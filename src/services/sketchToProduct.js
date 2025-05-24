import fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import sharp from 'sharp';
import fetch from 'node-fetch';
import { FormData, File } from 'formdata-node';

dotenv.config();

const API_URL = "https://api.stability.ai";
const ENGINE_ID = "stable-diffusion-xl-1024-v1-0";

/**
 * Ensures the required directories exist
 * @param {string} dirPath - Path to check/create
 */
async function ensureDirectoryExists(dirPath) {
  try {
    await fsPromises.access(dirPath);
  } catch {
    console.log(`Creating directory: ${dirPath}`);
    await fsPromises.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Preprocesses the sketch for ControlNet
 * @param {string} originalSketchPath - Path to the original sketch
 * @param {string} processedSketchPath - Path to save the processed sketch
 */
async function preprocessSketch(originalSketchPath, processedSketchPath) {
  console.log(`Preprocessing sketch: ${originalSketchPath} -> ${processedSketchPath}`);
  
  await sharp(originalSketchPath)
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
    .toFile(processedSketchPath);
}

/**
 * Converts a sketch to a realistic product photo using Stable Diffusion with ControlNet
 * @param {string} sketchPath - Path to the sketch image
 * @param {string} outputPath - Path to save the generated image
 */
export async function convertSketchToProduct(sketchPath, outputPath) {
  let processedSketchPath;
  try {
    processedSketchPath = path.resolve(sketchPath.replace('.jpg', '-processed.png'));
    
    // Preprocess the sketch
    await preprocessSketch(sketchPath, processedSketchPath);
    
    // Read the processed sketch
    const sketchBuffer = await fsPromises.readFile(processedSketchPath);
    
    // Create form data
    const formData = new FormData();
    
    // Format text_prompts correctly
    const textPrompts = [{
      text: "Create a photorealistic t-shirt product photo. The t-shirt should have the exact same design as shown in the reference sketch, including all patterns, text, and graphic elements in their precise locations. The t-shirt should be rendered with realistic fabric textures and natural folds, but the design must be identical to the sketch. Display it on a pure white background with professional studio lighting. The t-shirt should appear to be worn by an invisible mannequin. The final image should look like a premium e-commerce product photo, but the design must be exactly the same as in the reference sketch.",
      weight: 1
    }];
    
    // Add each prompt separately
    textPrompts.forEach((prompt, index) => {
      formData.append(`text_prompts[${index}][text]`, prompt.text);
      formData.append(`text_prompts[${index}][weight]`, prompt.weight.toString());
    });
    
    // Create a File object from the buffer
    const imageFile = new File([sketchBuffer], 'sketch.png', { type: 'image/png' });
    formData.append('init_image', imageFile);
    
    formData.append('image_strength', '0.35');
    formData.append('cfg_scale', '7');
    formData.append('steps', '30');
    formData.append('samples', '1');
    formData.append('style_preset', 'photographic');

    // Prepare the API request
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
      throw new Error(`Non-200 response: ${await response.text()}`);
    }

    const data = await response.json();
    
    // Save the generated image
    const outputDir = path.dirname(outputPath);
    await ensureDirectoryExists(outputDir);
    
    const imageBuffer = Buffer.from(data.artifacts[0].base64, 'base64');
    await fsPromises.writeFile(outputPath, imageBuffer);
    
    console.log('Generated image saved to:', outputPath);
    return outputPath;
  } catch (error) {
    console.error('Error converting sketch to product:', error);
    throw error;
  } finally {
    if (processedSketchPath) {
      try {
        await fsPromises.unlink(processedSketchPath);
      } catch (error) {
        console.error('Error cleaning up processed sketch:', error);
      }
    }
  }
}

/**
 * Example usage
 */
async function main() {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const projectRoot = path.resolve(__dirname, '../../');
    const publicDir = path.join(projectRoot, 'public');
    const sketchPath = path.join(publicDir, 'test-sketch.jpg');
    const outputPath = path.join(publicDir, 'generated-product.png');
    
    await ensureDirectoryExists(publicDir);
    
    console.log('Input sketch path:', sketchPath);
    console.log('Output path:', outputPath);
    
    await convertSketchToProduct(sketchPath, outputPath);
  } catch (error) {
    console.error('Failed to complete sketch conversion process.');
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
} 