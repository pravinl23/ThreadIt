import fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

/**
 * Validates and prepares an image for training
 * @param {string} imagePath - Path to the image
 * @param {string} outputPath - Path to save the processed image
 * @param {number} size - Target size for the image
 */
async function prepareImage(imagePath, outputPath, size = 1024) {
  try {
    await sharp(imagePath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .jpeg({ quality: 95 })
      .toFile(outputPath);
    
    console.log(`Processed image saved to: ${outputPath}`);
  } catch (error) {
    console.error(`Error processing image ${imagePath}:`, error);
    throw error;
  }
}

/**
 * Validates a training pair
 * @param {string} sketchPath - Path to the sketch image
 * @param {string} productPath - Path to the product image
 * @returns {Promise<boolean>} - Whether the pair is valid
 */
async function validatePair(sketchPath, productPath) {
  try {
    const sketchStats = await sharp(sketchPath).stats();
    const productStats = await sharp(productPath).stats();
    
    // Check if images are readable
    if (!sketchStats || !productStats) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating pair:', error);
    return false;
  }
}

/**
 * Prepares training data from a directory of images
 * @param {string} inputDir - Directory containing raw images
 * @param {string} outputDir - Directory to save processed images
 */
export async function prepareTrainingData(inputDir, outputDir) {
  try {
    // Create output directories
    const sketchDir = path.join(outputDir, 'sketches');
    const productDir = path.join(outputDir, 'products');
    
    await fsPromises.mkdir(sketchDir, { recursive: true });
    await fsPromises.mkdir(productDir, { recursive: true });
    
    // Get all files
    const files = await fsPromises.readdir(inputDir);
    const imageFiles = files.filter(file => 
      file.toLowerCase().endsWith('.jpg') || 
      file.toLowerCase().endsWith('.jpeg') || 
      file.toLowerCase().endsWith('.png')
    );
    
    console.log(`Found ${imageFiles.length} image files`);
    
    // Process each file
    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      const isSketch = file.toLowerCase().includes('sketch');
      const outputPath = path.join(
        isSketch ? sketchDir : productDir,
        `${path.parse(file).name}.jpg`
      );
      
      await prepareImage(inputPath, outputPath);
    }
    
    // Validate pairs
    const sketches = await fsPromises.readdir(sketchDir);
    const products = await fsPromises.readdir(productDir);
    
    console.log('\nValidating training pairs...');
    let validPairs = 0;
    
    for (const sketch of sketches) {
      const baseName = sketch.split('-')[0];
      const matchingProduct = products.find(p => p.startsWith(baseName));
      
      if (matchingProduct) {
        const sketchPath = path.join(sketchDir, sketch);
        const productPath = path.join(productDir, matchingProduct);
        
        if (await validatePair(sketchPath, productPath)) {
          validPairs++;
          console.log(`Valid pair found: ${sketch} - ${matchingProduct}`);
        }
      }
    }
    
    console.log(`\nFound ${validPairs} valid training pairs`);
    return validPairs;
  } catch (error) {
    console.error('Error preparing training data:', error);
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
    const inputDir = path.join(projectRoot, 'raw-data');
    const outputDir = path.join(projectRoot, 'training-data');
    
    await prepareTrainingData(inputDir, outputDir);
  } catch (error) {
    console.error('Failed to prepare training data.');
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
} 