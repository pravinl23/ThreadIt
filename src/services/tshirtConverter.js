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
 * Preprocesses the sketch for better results
 * @param {string} sketchPath - Path to the sketch
 * @param {string} outputPath - Path to save the processed sketch
 */
async function preprocessSketch(sketchPath, outputPath) {
  await sharp(sketchPath)
    .resize(1024, 1024, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .modulate({
      brightness: 1.2,
      saturation: 1.1
    })
    .sharpen({
      sigma: 1.5,
      flat: 1,
      jagged: 1
    })
    .png()
    .toFile(outputPath);
}

/**
 * Converts a t-shirt sketch to a realistic product photo
 * @param {string} sketchPath - Path to the sketch
 * @param {string} outputPath - Path to save the generated image
 * @param {Object} options - Additional options
 */
export async function convertSketchToProduct(sketchPath, outputPath, options = {}) {
  try {
    // Preprocess the sketch
    const processedSketchPath = sketchPath.replace('.jpg', '-processed.png');
    await preprocessSketch(sketchPath, processedSketchPath);
    
    // Read the processed sketch
    const sketchBuffer = await fsPromises.readFile(processedSketchPath);
    
    // Create form data
    const formData = new FormData();
    
    // Add the sketch
    const imageFile = new File([sketchBuffer], 'sketch.png', { type: 'image/png' });
    formData.append('init_image', imageFile);
    
    // Add text prompts
    const textPrompts = [{
      text: "Convert this t-shirt sketch into a photorealistic product photo. The t-shirt should have the exact same design as shown in the reference sketch, including all patterns, text, and graphic elements in their precise locations. The t-shirt should be rendered with realistic fabric textures and natural folds, but the design must be identical to the sketch. Display it on a pure white background with professional studio lighting. The t-shirt should appear to be worn by an invisible mannequin. The final image should look like a premium e-commerce product photo, but the design must be exactly the same as in the reference sketch.",
      weight: 1
    }];
    
    textPrompts.forEach((prompt, index) => {
      formData.append(`text_prompts[${index}][text]`, prompt.text);
      formData.append(`text_prompts[${index}][weight]`, prompt.weight.toString());
    });
    
    // Add generation parameters
    formData.append('image_strength', '0.35');
    formData.append('cfg_scale', '7');
    formData.append('steps', '30');
    formData.append('samples', '1');
    formData.append('style_preset', 'photographic');

    // Make the API request
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
    
    // Save the generated image
    const outputDir = path.dirname(outputPath);
    await fsPromises.mkdir(outputDir, { recursive: true });
    
    const imageBuffer = Buffer.from(data.artifacts[0].base64, 'base64');
    await fsPromises.writeFile(outputPath, imageBuffer);
    
    // Clean up
    await fsPromises.unlink(processedSketchPath);
    
    console.log('Generated image saved to:', outputPath);
    return outputPath;
  } catch (error) {
    console.error('Error converting sketch to product:', error);
    throw error;
  }
}

/**
 * Example usage
 */
async function main() {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const projectRoot = path.resolve(__dirname, '../../');
    const sketchPath = path.join(projectRoot, 'public', 'test-sketch.jpg');
    const outputPath = path.join(projectRoot, 'public', 'generated-product.png');
    
    await convertSketchToProduct(sketchPath, outputPath);
  } catch (error) {
    console.error('Failed to convert sketch to product.');
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
} 