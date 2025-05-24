import fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import fetch from 'node-fetch';
import { FormData, File } from 'formdata-node';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = "https://api.stability.ai";
const ENGINE_ID = "stable-diffusion-xl-1024-v1-0";

/**
 * Preprocesses the image to make it more suitable for texture enhancement
 */
async function preprocessForTextureEnhancement(imageBuffer) {
  return sharp(imageBuffer)
    .sharpen({ sigma: 1.2, m1: 1.0, m2: 0.3 }) // Sharpen to define edges better
    .modulate({ 
      brightness: 1.05,
      saturation: 1.1,
      hue: 0 
    })
    .png()
    .toBuffer();
}

/**
 * Analyzes the image to create better prompts
 */
async function analyzeImageForTexturePrompt(imageBuffer) {
  const metadata = await sharp(imageBuffer).metadata();
  const stats = await sharp(imageBuffer).stats();
  
  const avgBrightness = stats.channels.reduce((sum, channel) => 
    sum + channel.mean, 0) / stats.channels.length;
  
  console.log('Image Analysis:');
  console.log(`- Dimensions: ${metadata.width}x${metadata.height}`);
  console.log(`- Average Brightness: ${avgBrightness.toFixed(1)}`);
  
  return {
    brightness: avgBrightness,
    width: metadata.width,
    height: metadata.height
  };
}

/**
 * Alternative: Pure Sharp-based texture enhancement (no AI)
 */
async function addFabricTextureWithSharp(inputPath, outputPath) {
  try {
    console.log('Adding fabric texture using Sharp (no AI)...');
    
    const inputBuffer = await fsPromises.readFile(inputPath);
    
    // Create a subtle fabric texture pattern
    const textureBuffer = await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 4,
        background: { r: 128, g: 128, b: 128, alpha: 0.1 }
      }
    })
    .noise({ type: 'gaussian', mean: 128, sigma: 15 }) // Add noise for texture
    .modulate({ brightness: 1.0, saturation: 0.8 })
    .png()
    .toBuffer();
    
    // Get original image dimensions
    const { width, height } = await sharp(inputBuffer).metadata();
    
    // Resize texture to match input
    const resizedTexture = await sharp(textureBuffer)
      .resize(width, height)
      .toBuffer();
    
    // Composite texture over original with very low opacity
    const result = await sharp(inputBuffer)
      .composite([
        {
          input: resizedTexture,
          blend: 'overlay',
          opacity: 0.15 // Very subtle texture
        }
      ])
      .sharpen({ sigma: 0.8, m1: 1.0, m2: 0.2 }) // Slight sharpening
      .png()
      .toBuffer();
    
    await fsPromises.writeFile(outputPath, result);
    console.log('✅ Fabric texture added using Sharp');
    return outputPath;
    
  } catch (error) {
    console.error('Error adding texture with Sharp:', error);
    throw error;
  }
}

/**
 * Enhanced AI-based texture enhancement with better preservation
 */
async function enhanceProductImageAI(inputPath, outputPath, userDescription = '') {
  try {
    const formData = new FormData();
    
    // Read and preprocess the input image
    const originalBuffer = await fsPromises.readFile(inputPath);
    const analysis = await analyzeImageForTexturePrompt(originalBuffer);
    const processedBuffer = await preprocessForTextureEnhancement(originalBuffer);
    
    const imageFile = new File([processedBuffer], 'product.png', { type: 'image/png' });
    formData.append('init_image', imageFile);
    
    // Build description-aware prompt
    let designDescription = 'the exact design shown in the input image';
    if (userDescription && userDescription.trim()) {
      designDescription = `the ${userDescription} design shown in the input image`;
    }
    
    // Much more specific prompts to preserve original design
    const positivePrompt = `A close-up, **photorealistic studio shot** of a single, clean t-shirt on a **minimal, bright white background**. The t-shirt's material is **soft, finely-woven cotton jersey**, exhibiting **authentic fabric wrinkles and creases** where appropriate. The graphic is an **unmodified, exact reproduction of the sketch**, flawlessly integrated as a **premium screen print**. The print itself should possess a **slight, realistic tactile texture**, with the **t-shirt's weave subtly visible beneath the ink**. Render with **photographic depth of field** and **true-to-life shadows and highlights** that define the garment's form. The design must be 100% accurate to the source. EXACT COPY: ${designDescription}. Keep every single element, color, shape, and detail identical to the input image. Add only subtle natural cotton fabric texture. The design should appear naturally printed on fabric. Preserve all original colors exactly. Maintain exact same composition and layout. Add only realistic fabric texture, nothing else. No layering. No multiple t-shirts. No background elements. No additional images. No new patterns. No extra details. No random elements. No additional shading. No extra highlights. No additional shadows. No decorative elements. No embellishments. No stray marks. No random textures. No additional colors. No extra details.Currently you are being fed a sketch of a t-shirt design, now picture what this would look like if it were to be sold on a website, obviously you can’t upload a mid 2d sketch so we need to add some realism effects, like texture, fabric, depth, shading, but we need to maintain the EXACT same design while making sure to real-life it almost. Don’t forget the only thing you can kind of change are the edges of the t-shirt. You want to make sure it’s a realistic looking t-shirt so you can get blend the black edges on t-shirt and give it realistic looking t-shirt edges.`;
    
    const negativePrompt = `new design, different design, altered design, changed colors, modified elements, different shapes, wrong colors, distorted graphics, blurred design, different style, new graphics, additional elements, removed elements, different composition, different layout, artistic interpretation, stylistic changes, color shifts, brightness changes, contrast changes, saturation changes, completely different image, unrelated design, wrong subject matter, 3D render, CGI, plastic, artificial, unrealistic, perfect print, flat design, illustration, cartoon, digital art, painting, drawing, background elements, additional images, new patterns, extra details, decorative elements, embellishments, borders, frames, shadows, highlights, gradients, textures beyond fabric, any elements not in original design, multiple t-shirts, layering, stacked shirts, overlapping shirts, duplicate designs, multiple layers, artificial layering, stacked images, random elements, stray marks, additional shading, extra highlights, additional shadows, decorative elements, embellishments, random textures, additional colors, extra details, stray lines, random patterns, unintended elements, unexpected additions, unwanted elements, stray pixels, random spots, unintended shading, extra effects`;
    
    const textPrompts = [
      {
        text: positivePrompt,
        weight: 1
      },
      {
        text: negativePrompt,
        weight: -1
      }
    ];
    
    textPrompts.forEach((prompt, index) => {
      formData.append(`text_prompts[${index}][text]`, prompt.text);
      formData.append(`text_prompts[${index}][weight]`, prompt.weight.toString());
    });
    
    // Ultra-conservative parameters to minimize changes
    formData.append('image_strength', '0.05');  // Even more conservative to prevent random additions
    formData.append('cfg_scale', '8.0');        // Higher guidance for strict adherence
    formData.append('steps', '15');             // Fewer steps to minimize changes
    formData.append('samples', '1');
    formData.append('style_preset', 'photographic');
    formData.append('seed', Math.floor(Math.random() * 1000000));
    
    console.log('AI Enhancement Parameters:');
    console.log('- Image Strength: 0.05 (ultra-conservative to prevent random additions)');
    console.log('- CFG Scale: 8.0 (higher guidance for strict adherence)');
    console.log('- Steps: 15 (minimal processing)');
    
    const response = await fetch(
      `${API_URL}/v1/generation/${ENGINE_ID}/image-to-image`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
        },
        body: formData
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${errorText}`);
    }
    
    const data = await response.json();
    const enhancedBuffer = Buffer.from(data.artifacts[0].base64, 'base64');
    await fsPromises.writeFile(outputPath, enhancedBuffer);
    
    console.log('✅ AI-enhanced product image saved to:', outputPath);
    return outputPath;
  } catch (error) {
    console.error('Error enhancing product image with AI:', error);
    throw error;
  }
}

/**
 * Hybrid approach: Combine original with AI result for maximum preservation
 */
async function hybridTextureEnhancement(inputPath, outputPath, userDescription = '') {
  try {
    console.log('Using hybrid approach for maximum design preservation...');
    
    const tempAIPath = inputPath.replace('.png', '_temp_ai.png');
    
    // First, try AI enhancement with ultra-conservative settings
    await enhanceProductImageAI(inputPath, tempAIPath, userDescription);
    
    // Then blend the AI result with the original to preserve design
    const originalBuffer = await fsPromises.readFile(inputPath);
    const aiBuffer = await fsPromises.readFile(tempAIPath);
    
    // Composite: 90% original + 10% AI enhancement
    const result = await sharp(originalBuffer)
      .composite([
        {
          input: aiBuffer,
          blend: 'overlay',
          opacity: 0.10 // Even lower opacity of AI result
        }
      ])
      .png()
      .toBuffer();
    
    await fsPromises.writeFile(outputPath, result);
    
    // Clean up temp file
    try {
      await fsPromises.unlink(tempAIPath);
    } catch (e) {
      // Ignore cleanup errors
    }
    
    console.log('✅ Hybrid enhancement completed');
    return outputPath;
    
  } catch (error) {
    console.error('Error in hybrid enhancement:', error);
    throw error;
  }
}

/**
 * Main enhancement function with multiple approaches
 */
async function enhanceProduct(method = 'hybrid', userDescription = '') {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const projectRoot = path.resolve(__dirname, '../../');
    const inputPath = path.join(projectRoot, 'public', 'final-product.png');
    
    let outputPath;
    
    console.log('🚀 Product Image Texture Enhancement');
    console.log('===================================');
    
    if (userDescription) {
      console.log(`📝 Design Description: "${userDescription}"`);
    }
    
    switch (method) {
      case 'sharp':
        outputPath = path.join(projectRoot, 'public', 'enhanced-product-sharp.png');
        console.log('\n🎨 Using Sharp-only texture enhancement...');
        await addFabricTextureWithSharp(inputPath, outputPath);
        break;
        
      case 'ai':
        outputPath = path.join(projectRoot, 'public', 'enhanced-product-ai.png');
        console.log('\n🤖 Using AI texture enhancement...');
        await enhanceProductImageAI(inputPath, outputPath, userDescription);
        break;
        
      case 'hybrid':
      default:
        outputPath = path.join(projectRoot, 'public', 'enhanced-product-hybrid.png');
        console.log('\n🔄 Using hybrid approach (recommended)...');
        await hybridTextureEnhancement(inputPath, outputPath, userDescription);
        break;
    }
    
    console.log('\n✅ Enhancement completed!');
    console.log(`📁 Enhanced product image: ${outputPath}`);
    
    return outputPath;
    
  } catch (error) {
    if (error.message.includes('insufficient_balance')) {
      console.error('\n💳 Error: Insufficient API credits. Please:');
      console.error('1. Add credits to your Stability AI account');
      console.error('2. Update your API key in the .env file');
      console.error('\n💡 Tip: Try the "sharp" method which doesn\'t use AI credits:');
      console.error('node script.js sharp');
      process.exit(1);
    } else {
      console.error('❌ Enhancement failed:', error);
      throw error;
    }
  }
}

// CLI Interface
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const method = process.argv[2] || 'hybrid'; // sharp, ai, model, or hybrid
  const userDescription = process.argv[3] || ''; // describe your design
  
  console.log(`Method: ${method}`);
  if (userDescription) {
    console.log(`Description: "${userDescription}"`);
  }
  
  enhanceProduct(method, userDescription)
    .catch(error => {
      console.error('Enhancement failed:', error);
      process.exit(1);
    });
}

export { enhanceProduct, addFabricTextureWithSharp, enhanceProductImageAI, hybridTextureEnhancement };