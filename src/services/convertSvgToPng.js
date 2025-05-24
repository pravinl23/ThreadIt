import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

async function convertSvgToPng() {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const projectRoot = path.resolve(__dirname, '../../')
    const publicDir = path.join(projectRoot, 'public')
    
    const svgPath = path.join(publicDir, 'test-sketch.svg')
    const pngPath = path.join(publicDir, 'test-sketch.png')
    
    // Read SVG file
    const svgBuffer = await fs.readFile(svgPath)
    
    // Convert to PNG
    await sharp(svgBuffer)
      .resize(800, 1000) // Double the size for better quality
      .png()
      .toFile(pngPath)
    
    console.log('SVG converted to PNG:', pngPath)
  } catch (error) {
    console.error('Error converting SVG to PNG:', error)
    process.exit(1)
  }
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  convertSvgToPng()
} 