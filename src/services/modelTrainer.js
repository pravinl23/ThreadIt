import fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { FormData, File } from 'formdata-node';
import sharp from 'sharp';

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
 */
async function resizeToAllowedDimensions(imageBuffer) {
  const metadata = await sharp(imageBuffer).metadata();
  const aspectRatio = metadata.width / metadata.height;
  
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
 * Prepares training data by creating pairs of sketches and final designs
 */
async function prepareTrainingData(sketchDir, designDir, outputDir) {
  try {
    // Create output directories
    await fsPromises.mkdir(outputDir, { recursive: true });
    await fsPromises.mkdir(path.join(outputDir, 'sketches'), { recursive: true });
    await fsPromises.mkdir(path.join(outputDir, 'designs'), { recursive: true });
    
    // Get all sketch files
    const sketchFiles = await fsPromises.readdir(sketchDir);
    
    for (const sketchFile of sketchFiles) {
      if (!sketchFile.match(/\.(jpg|jpeg|png)$/i)) continue;
      
      const sketchPath = path.join(sketchDir, sketchFile);
      const designPath = path.join(designDir, sketchFile.replace(/\.(jpg|jpeg|png)$/i, '.png'));
      
      // Check if corresponding design exists
      try {
        await fsPromises.access(designPath);
      } catch {
        console.log(`No matching design found for ${sketchFile}, skipping...`);
        continue;
      }
      
      // Read and resize images
      const sketchBuffer = await fsPromises.readFile(sketchPath);
      const designBuffer = await fsPromises.readFile(designPath);
      
      const resizedSketch = await resizeToAllowedDimensions(sketchBuffer);
      const resizedDesign = await resizeToAllowedDimensions(designBuffer);
      
      // Save processed images
      const outputSketchPath = path.join(outputDir, 'sketches', sketchFile);
      const outputDesignPath = path.join(outputDir, 'designs', sketchFile.replace(/\.(jpg|jpeg|png)$/i, '.png'));
      
      await fsPromises.writeFile(outputSketchPath, resizedSketch);
      await fsPromises.writeFile(outputDesignPath, resizedDesign);
      
      console.log(`Processed ${sketchFile}`);
    }
    
    console.log('Training data preparation completed!');
  } catch (error) {
    console.error('Error preparing training data:', error);
    throw error;
  }
}

/**
 * Creates a fine-tuning job for the model
 */
async function createFineTuningJob(trainingDataDir) {
  try {
    const formData = new FormData();
    
    // Add training data
    const sketchDir = path.join(trainingDataDir, 'sketches');
    const designDir = path.join(trainingDataDir, 'designs');
    
    const sketchFiles = await fsPromises.readdir(sketchDir);
    
    for (const sketchFile of sketchFiles) {
      const sketchPath = path.join(sketchDir, sketchFile);
      const designPath = path.join(designDir, sketchFile.replace(/\.(jpg|jpeg|png)$/i, '.png'));
      
      const sketchBuffer = await fsPromises.readFile(sketchPath);
      const designBuffer = await fsPromises.readFile(designPath);
      
      const sketchFileObj = new File([sketchBuffer], sketchFile, { type: 'image/png' });
      const designFileObj = new File([designBuffer], sketchFile.replace(/\.(jpg|jpeg|png)$/i, '.png'), { type: 'image/png' });
      
      formData.append('training_files', sketchFileObj);
      formData.append('training_files', designFileObj);
    }
    
    // Add training parameters
    formData.append('name', 'tshirt-design-converter');
    formData.append('description', 'Fine-tuned model for converting t-shirt sketches to realistic designs');
    formData.append('base_model', ENGINE_ID);
    formData.append('training_steps', '1000');
    formData.append('learning_rate', '1e-5');
    
    const response = await fetch(
      `${API_URL}/v1/fine-tuning/jobs`,
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
    console.log('Fine-tuning job created:', data);
    return data;
  } catch (error) {
    console.error('Error creating fine-tuning job:', error);
    throw error;
  }
}

/**
 * Main training function
 */
async function trainModel() {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const projectRoot = path.resolve(__dirname, '../../');
    
    // Define directories
    const sketchDir = path.join(projectRoot, 'training-data', 'sketches');
    const designDir = path.join(projectRoot, 'training-data', 'designs');
    const processedDir = path.join(projectRoot, 'training-data', 'processed');
    
    console.log('Preparing training data...');
    await prepareTrainingData(sketchDir, designDir, processedDir);
    
    console.log('Creating fine-tuning job...');
    const job = await createFineTuningJob(processedDir);
    
    console.log('\nTraining started!');
    console.log('Job ID:', job.id);
    console.log('You can monitor the training progress in the Stability AI dashboard.');
    
  } catch (error) {
    if (error.message.includes('insufficient_balance')) {
      console.error('\nError: Insufficient API credits. Please:');
      console.error('1. Add credits to your Stability AI account at https://platform.stability.ai/');
      console.error('2. Update your API key in the .env file');
      console.error('3. Try again');
      process.exit(1);
    } else {
      console.error('Error in training:', error);
      throw error;
    }
  }
}

// Run the training
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  trainModel()
    .catch(error => {
      console.error('Training failed:', error);
      process.exit(1);
    });
} 