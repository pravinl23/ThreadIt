import fsPromises from 'fs/promises'; // For promise-based fs operations
import fs from 'fs'; // For fs.createReadStream
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import fetch from 'node-fetch';
import sharp from 'sharp'; // For image preprocessing
import { File } from 'node:buffer';

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
 * Preprocesses the sketch to be a square PNG, as required by DALL-E edit API.
 * @param {string} originalSketchPath - Path to the original sketch (JPG)
 * @param {string} processedSketchPath - Path to save the processed PNG sketch
 * @param {number} size - The dimension for the square image (e.g., 1024)
 * @returns {Promise<string>} - Path to the processed PNG sketch
 */
async function preprocessSketchForEdit(originalSketchPath, processedSketchPath, size = 1024) {
  console.log(`Preprocessing sketch: ${originalSketchPath} -> ${processedSketchPath}`);
  await sharp(originalSketchPath)
    .resize(size, size, { 
      fit: 'contain', 
      background: { r: 255, g: 255, b: 255, alpha: 1 } 
    })
    .modulate({
      brightness: 1.3,
      saturation: 1.2,
      hue: 0
    })
    .sharpen({
      sigma: 2,
      flat: 1.5,
      jagged: 1.5
    })
    .threshold(128)
    .png()
    .toFile(processedSketchPath);
  return processedSketchPath;
}

/**
 * Enhances a clothing sketch using DALL-E 2's image edit feature.
 * @param {string} originalSketchPath - Path to the sketch image file (JPG)
 * @param {string} outputPath - Path to save the enhanced image (PNG)
 * @returns {Promise<string>} - URL of the enhanced image
 */
export async function enhanceSketch(originalSketchPath, outputPath) {
  // Ensure originalSketchPath is absolute to be safe for path.resolve
  const absoluteOriginalSketchPath = path.resolve(originalSketchPath);
  const processedSketchPath = path.resolve(absoluteOriginalSketchPath.replace('.jpg', '-processed-for-edit.png'));

  try {
    try {
      await fsPromises.access(absoluteOriginalSketchPath);
    } catch (error) {
      throw new Error(
        `Input file not found: ${absoluteOriginalSketchPath}\n` +
        'Please make sure to:\n' +
        '1. Create a "public" directory in your project root\n' +
        '2. Place your sketch image as "test-sketch.jpg" in the public directory'
      );
    }

    await preprocessSketchForEdit(absoluteOriginalSketchPath, processedSketchPath, 1024);

    console.log('Sending processed sketch to DALL-E 2 for editing...');
    console.log(`Using processed file for stream: ${processedSketchPath}`); // Log the exact path
    
    // Create a File object from the buffer
    const imageBuffer = await fsPromises.readFile(processedSketchPath);
    const imageFile = new File([imageBuffer], 'processed-sketch.png', { type: 'image/png' });
    
    const dalleResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: "Transform the sketched design on this t-shirt mockup into a visually stunning, photorealistic, production-quality print. Carefully interpret the concept, shapes, and layout of the original sketch, enhancing it with crisp lines, balanced composition, vibrant colors, and smooth professional details suitable for a premium clothing brand. The final design should feel realistic and expertly printed onto the shirt, as if it were ready for high-end retail or e-commerce. Do not alter the t-shirt’s color, shape, wrinkles, lighting, perspective, or background. Only refine and beautify the artwork, keeping its position and overall idea intact. Avoid adding extra elements, removing parts of the design, or changing the shirt itself. Do not add mannequins, people, or new backgrounds. The result should be a flawless, realistic t-shirt mockup with the enhanced design seamlessly integrated—perfect for marketing, product catalogs, or brand presentation.",
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url",
      style: "natural"
    });

    if (dalleResponse && dalleResponse.data && dalleResponse.data.length > 0 && dalleResponse.data[0].url) {
      const editedImageUrl = dalleResponse.data[0].url;
      console.log('DALL-E edited image URL:', editedImageUrl);
      console.log('Downloading edited image...');
      
      const response = await fetch(editedImageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download edited image: ${response.statusText} (URL: ${editedImageUrl})`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const outputDir = path.dirname(outputPath);
      await ensureDirectoryExists(outputDir);
      
      await fsPromises.writeFile(outputPath, buffer);
      console.log('Edited image saved to:', outputPath);
      return editedImageUrl;
    } else {
      console.error('Invalid response from DALL-E API (edit):', dalleResponse);
      throw new Error('No image URL received from DALL-E 2 (edit) or invalid response structure.');
    }
  } catch (error) {
    console.error('Error editing image with DALL-E:', error);
    throw error;
  } finally {
    try { 
      await fsPromises.access(processedSketchPath);
      console.log(`Cleaning up processed file: ${processedSketchPath}`);
      await fsPromises.unlink(processedSketchPath);
    } catch { /* no-op */ }
  }
}

/**
 * Enhances an image to look like a professional e-commerce product photo
 * @param {string} inputPath - Path to the input image
 * @param {string} outputPath - Path to save the enhanced image
 */
async function enhanceEcommerceImage(inputPath, outputPath) {
  try {
    console.log('Enhancing image for e-commerce presentation...');
    
    // Create a sharp instance for the input image
    const image = sharp(inputPath);
    
    // Get image metadata
    const metadata = await image.metadata();
    
    // Calculate dimensions for a square crop if needed
    const size = Math.min(metadata.width, metadata.height);
    const left = Math.floor((metadata.width - size) / 2);
    const top = Math.floor((metadata.height - size) / 2);
    
    // Process the image
    await image
      // Crop to square if needed
      .extract({ left, top, width: size, height: size })
      // Resize to standard e-commerce size
      .resize(1200, 1200, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      // Enhance contrast and brightness
      .modulate({
        brightness: 1.1,
        saturation: 1.05,
        hue: 0
      })
      // Sharpen the image
      .sharpen({
        sigma: 1.5,
        flat: 1,
        jagged: 1
      })
      // Add a subtle vignette effect
      .composite([{
        input: {
          create: {
            width: 1200,
            height: 1200,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0.1 }
          }
        },
        blend: 'overlay'
      }])
      // Ensure white background
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      // Save as high-quality PNG
      .png({ quality: 100 })
      .toFile(outputPath);
    
    console.log('E-commerce enhancement complete:', outputPath);
    return outputPath;
  } catch (error) {
    console.error('Error enhancing e-commerce image:', error);
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
    const publicDir = path.join(projectRoot, 'public');
    const sketchPath = path.join(publicDir, 'test-sketch.jpg'); 
    const dalleOutputPath = path.join(publicDir, 'edited-dalle-image.png');
    const finalOutputPath = path.join(publicDir, 'final-ecommerce-image.png');
    
    await ensureDirectoryExists(publicDir);
    
    console.log('Input sketch path:', sketchPath);
    console.log('DALL-E output path:', dalleOutputPath);
    console.log('Final e-commerce output path:', finalOutputPath);
    
    // First generate the DALL-E image
    await enhanceSketch(sketchPath, dalleOutputPath);
    
    // Then enhance it for e-commerce
    await enhanceEcommerceImage(dalleOutputPath, finalOutputPath);
    
    console.log('Process complete! Final image saved at:', finalOutputPath);
  } catch (error) {
    console.error('Failed to complete image enhancement process.');
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
