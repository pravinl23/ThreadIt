import fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { FormData, File } from 'formdata-node';
import sharp from 'sharp';
import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import { createCanvas, loadImage } from 'canvas'

dotenv.config();

const API_URL = "https://api.stability.ai";
const ENGINE_ID = "stable-diffusion-xl-1024-v1-0";

// Allowed dimensions for SDXL
const ALLOWED_DIMENSIONS = [
  { width: 1024, height: 1024 },
  { width: 1152, height: 896 },
  { width: 1216, height: 832 },
  { width: 1344, height: 768 },
  { width: 1536, height: 640 },
  { width: 640, height: 1536 },
  { width: 768, height: 1344 },
  { width: 832, height: 1216 },
  { width: 896, height: 1152 }
];

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * Resizes an image to the nearest allowed dimensions
 * @param {Buffer} imageBuffer - The image buffer to resize
 * @returns {Promise<Buffer>} - The resized image buffer
 */
async function resizeToAllowedDimensions(imageBuffer) {
  const metadata = await sharp(imageBuffer).metadata();
  
  // Always use 1024x1024 for 1:1 ratio
  return sharp(imageBuffer)
    .resize(1024, 1024, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .png()
    .toBuffer();
}

/**
 * Generates a product image from a sketch
 * @param {string} sketchPath - Path to the sketch
 * @param {string} outputPath - Path to save the result
 * @returns {Promise<string>} - Path to the generated image
 */
async function generateProductImage(sketchPath, outputPath) {
  try {
    const formData = new FormData();
    
    // Read and resize the sketch
    const sketchBuffer = await fsPromises.readFile(sketchPath);
    const resizedBuffer = await resizeToAllowedDimensions(sketchBuffer);
    
    const imageFile = new File([resizedBuffer], 'sketch.png', { type: 'image/png' });
    formData.append('init_image', imageFile);
    
    // Prompt focused on creative interpretation while maintaining design essence
    const textPrompts = [
      {
        text: "A creative and artistic product photo of a t-shirt. The t-shirt is displayed on a pure white background. Take the design elements and interpret them artistically - add depth, dimension, and creative flair while keeping the core concept. If there are flowers, make them more vibrant and dimensional. If there is text, give it personality and style. If there are other elements, enhance them with creative details and artistic touches. The design should look like a premium screen print with artistic interpretation, creative details, and professional finish. The t-shirt should have natural cotton fabric texture that adds character to the design. The overall look should be creative and artistic while maintaining the original design's spirit. Imagine the image you get was to be displayed on a website as something someone could buy, a nice clean template. dont add any features like v-necks keep it a blank normal t-shirt. really emphasize the texture and depth of the t-shirt while not chanigng a single thing about the design.",
        weight: 1
      },
      {
        text: "changed design, modified elements, altered colors, distorted text, wrong font, different style, wrong placement, blurry design, modified graphics, wrong size, different style, wrong colors, random images, unrelated elements, wrong interpretation, different subject matter, flat design, marker drawing, digital art, illustration, cartoon style, unrealistic fabric, perfect print, no texture, drawing style, sketchy look, artificial appearance, digital look, 2D appearance, brush strokes, marker lines, pencil marks, sketchy edges, hand-drawn look, visible strokes, uneven edges, rough lines, boring design, plain look, basic style, uncreative interpretation",
        weight: -1
      }
    ];
    
    textPrompts.forEach((prompt, index) => {
      formData.append(`text_prompts[${index}][text]`, prompt.text);
      formData.append(`text_prompts[${index}][weight]`, prompt.weight.toString());
    });
    
    // Parameters optimized for creative interpretation
    formData.append('image_strength', '0.42');  // Keep your adjusted value
    formData.append('cfg_scale', '6.8');       // Keep your adjusted value
    formData.append('steps', '50');            // Keep your adjusted value
    formData.append('samples', '1');
    formData.append('style_preset', 'photographic'); // Changed from 'photographic' to 'enhance' for more creative interpretation
    formData.append('seed', Math.floor(Math.random() * 1000000)); // Random seed for more variation
    
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
      throw new Error(`API request failed: ${await response.text()}`);
    }
    
    const data = await response.json();
    
    // Save the result
    const imageBuffer = Buffer.from(data.artifacts[0].base64, 'base64');
    await fsPromises.writeFile(outputPath, imageBuffer);
    
    console.log('Generated product image saved to:', outputPath);
    return outputPath;
  } catch (error) {
    console.error('Error generating product image:', error);
    throw error;
  }
}

/**
 * Main generation function
 */
async function generateProduct() {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const projectRoot = path.resolve(__dirname, '../../');
    const sketchPath = path.join(projectRoot, 'public', 'test-sketch.jpg');
    const outputPath = path.join(projectRoot, 'public', 'final-product.png');
    
    console.log('Generating product image from sketch...');
    await generateProductImage(sketchPath, outputPath);
    console.log('\nGeneration completed!');
    console.log('Final product image saved to:', outputPath);
    
  } catch (error) {
    if (error.message.includes('insufficient_balance')) {
      console.error('\nError: Insufficient API credits. Please:');
      console.error('1. Add credits to your Stability AI account at https://platform.stability.ai/');
      console.error('2. Update your API key in the .env file');
      console.error('3. Try again');
      process.exit(1);
    } else {
      console.error('Error in generation:', error);
      throw error;
    }
  }
}

// Run the generation
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateProduct()
    .catch(error => {
      console.error('Generation failed:', error);
      process.exit(1);
    });
}

export async function generateProduct(inputPath, outputPath) {
  try {
    console.log(`🎨 Generating product from: ${inputPath}`)
    
    // Load the input image
    const image = await loadImage(inputPath)
    const canvas = createCanvas(image.width, image.height)
    const ctx = canvas.getContext('2d')
    
    // Draw the original image
    ctx.drawImage(image, 0, 0)
    
    // Add some basic enhancement (this is a placeholder - you can expand this)
    ctx.globalAlpha = 0.1
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.globalAlpha = 1.0
    
    // Save the generated product
    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync(outputPath, buffer)
    
    console.log(`✅ Product generated: ${outputPath}`)
    return outputPath
  } catch (error) {
    console.error('❌ Product generation failed:', error)
    throw error
  }
}

export async function enhanceProduct(inputPath, outputPath) {
  try {
    console.log(`✨ Enhancing product from: ${inputPath}`)
    
    // Use Claude to generate enhancement ideas (this is a conceptual example)
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 300,
      messages: [{
        role: "user",
        content: "Generate creative enhancement ideas for a ThreadIt design. Return a JSON object with color suggestions, style improvements, and visual effects that could be applied."
      }]
    })
    
    console.log('🤖 Claude enhancement suggestions:', response.content[0].text)
    
    // Load and enhance the image
    const image = await loadImage(inputPath)
    const canvas = createCanvas(image.width, image.height)
    const ctx = canvas.getContext('2d')
    
    // Draw the original image
    ctx.drawImage(image, 0, 0)
    
    // Apply enhancement effects (placeholder - expand based on Claude suggestions)
    ctx.globalCompositeOperation = 'overlay'
    ctx.globalAlpha = 0.15
    
    // Add a subtle gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#4F46E5')
    gradient.addColorStop(1, '#7C3AED')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1.0
    
    // Save the enhanced product
    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync(outputPath, buffer)
    
    console.log(`✅ Product enhanced: ${outputPath}`)
    return outputPath
  } catch (error) {
    console.error('❌ Product enhancement failed:', error)
    throw error
  }
} 