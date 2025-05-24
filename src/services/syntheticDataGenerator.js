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

/**
 * Resizes an image to the nearest allowed dimensions
 * @param {Buffer} imageBuffer - The image buffer to resize
 * @returns {Promise<Buffer>} - The resized image buffer
 */
async function resizeToAllowedDimensions(imageBuffer) {
  const metadata = await sharp(imageBuffer).metadata();
  const aspectRatio = metadata.width / metadata.height;
  
  // Find the closest allowed dimensions that maintain aspect ratio
  let bestDimensions = ALLOWED_DIMENSIONS[0];
  let minDiff = Infinity;
  
  for (const dims of ALLOWED_DIMENSIONS) {
    const dimsRatio = dims.width / dims.height;
    const diff = Math.abs(dimsRatio - aspectRatio);
    
    if (diff < minDiff) {
      minDiff = diff;
      bestDimensions = dims;
    }
  }
  
  return sharp(imageBuffer)
    .resize(bestDimensions.width, bestDimensions.height, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .png()
    .toBuffer();
}

/**
 * Generates variations of a sketch for training
 * @param {string} sketchPath - Path to the original sketch
 * @param {string} outputDir - Directory to save variations
 * @param {number} numVariations - Number of variations to generate
 */
export async function generateSketchVariations(sketchBuffer, outputDir, baseName) {
  try {
    const variations = [];
    
    // Original sketch
    variations.push({
      buffer: sketchBuffer,
      name: `${baseName}-sketch.png`
    });
    
    // Rotated variations
    for (let angle of [-5, 5]) {
      const rotated = await sharp(sketchBuffer)
        .rotate(angle)
        .toBuffer();
      variations.push({
        buffer: rotated,
        name: `${baseName}-sketch-rotated-${angle}.png`
      });
    }
    
    // Slightly scaled variations
    for (let scale of [0.95, 1.05]) {
      const scaled = await sharp(sketchBuffer)
        .resize(Math.round(1024 * scale), Math.round(1024 * scale))
        .toBuffer();
      variations.push({
        buffer: scaled,
        name: `${baseName}-sketch-scaled-${scale}.png`
      });
    }
    
    // Save variations
    for (const variation of variations) {
      const outputPath = path.join(outputDir, 'sketches', variation.name);
      await fsPromises.writeFile(outputPath, variation.buffer);
    }
    
    return variations;
  } catch (error) {
    console.error('Error generating sketch variations:', error);
    throw error;
  }
}

/**
 * Generates product photos from sketches
 * @param {string} sketchPath - Path to the sketch
 * @param {string} outputDir - Directory to save product photos
 * @param {number} numPhotos - Number of product photos to generate
 */
export async function generateProductPhotos(sketchBuffer, outputDir, baseName) {
  try {
    const formData = new FormData();
    
    // Resize sketch to allowed dimensions
    const resizedSketch = await resizeToAllowedDimensions(sketchBuffer);
    const imageFile = new File([resizedSketch], 'sketch.png', { type: 'image/png' });
    formData.append('init_image', imageFile);
    
    // Prompt for realistic t-shirt design
    const textPrompts = [
      {
        text: "A professional product photo of a t-shirt. The t-shirt is displayed on a pure white background. Transform the sketch into a realistic t-shirt design - make it look like a professional screen print or heat transfer. The design should have the texture and appearance of real fabric printing, with proper ink saturation and fabric interaction. Keep the exact same design elements, but make them look like they're actually printed on the t-shirt with realistic print quality.",
        weight: 1
      },
      {
        text: "digital art, vector graphics, flat design, unrealistic print quality, artificial looking, perfect edges, no texture, no fabric interaction, too clean, too perfect, no print quality, no ink texture, no fabric texture",
        weight: -1
      }
    ];
    
    textPrompts.forEach((prompt, index) => {
      formData.append(`text_prompts[${index}][text]`, prompt.text);
      formData.append(`text_prompts[${index}][weight]`, prompt.weight.toString());
    });
    
    // Parameters for realistic t-shirt design
    formData.append('image_strength', '0.3');
    formData.append('cfg_scale', '7.5');
    formData.append('steps', '40');
    formData.append('samples', '1');
    formData.append('style_preset', 'photographic');
    
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
    const imageBuffer = Buffer.from(data.artifacts[0].base64, 'base64');
    
    // Save the generated product photo
    const outputPath = path.join(outputDir, 'designs', `${baseName}-design.png`);
    await fsPromises.writeFile(outputPath, imageBuffer);
    
    return outputPath;
  } catch (error) {
    console.error('Error generating product photo:', error);
    throw error;
  }
}

/**
 * Main function to generate synthetic training data
 */
async function generateTrainingData() {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const projectRoot = path.resolve(__dirname, '../../');
    
    // Create directories
    const trainingDataDir = path.join(projectRoot, 'training-data');
    const sketchesDir = path.join(trainingDataDir, 'sketches');
    const designsDir = path.join(trainingDataDir, 'designs');
    
    await fsPromises.mkdir(sketchesDir, { recursive: true });
    await fsPromises.mkdir(designsDir, { recursive: true });
    
    // Get all sketch files from public directory
    const publicDir = path.join(projectRoot, 'public');
    const sketchFiles = await fsPromises.readdir(publicDir);
    
    for (const sketchFile of sketchFiles) {
      if (!sketchFile.match(/\.(jpg|jpeg|png)$/i)) continue;
      
      console.log(`Processing ${sketchFile}...`);
      
      // Read sketch
      const sketchPath = path.join(publicDir, sketchFile);
      const sketchBuffer = await fsPromises.readFile(sketchPath);
      
      // Generate base name for variations
      const baseName = path.parse(sketchFile).name;
      
      // Generate sketch variations
      console.log('Generating sketch variations...');
      await generateSketchVariations(sketchBuffer, trainingDataDir, baseName);
      
      // Generate product photos
      console.log('Generating product photos...');
      await generateProductPhotos(sketchBuffer, trainingDataDir, baseName);
      
      console.log(`Completed processing ${sketchFile}\n`);
    }
    
    console.log('Training data generation completed!');
    console.log(`Generated data saved in: ${trainingDataDir}`);
    
  } catch (error) {
    if (error.message.includes('insufficient_balance')) {
      console.error('\nError: Insufficient API credits. Please:');
      console.error('1. Add credits to your Stability AI account at https://platform.stability.ai/');
      console.error('2. Update your API key in the .env file');
      console.error('3. Try again');
      process.exit(1);
    } else {
      console.error('Error generating training data:', error);
      throw error;
    }
  }
}

// Run the generation
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateTrainingData()
    .catch(error => {
      console.error('Generation failed:', error);
      process.exit(1);
    });
} 