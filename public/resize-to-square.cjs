const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = '/Users/pravinlohani/ThreadSketch/public/clothes';
const outputDir = '/Users/pravinlohani/ThreadSketch/public/clothes_padded';
const TARGET_SIZE = 1024;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

fs.readdirSync(inputDir).forEach(async (file) => {
  if (!file.endsWith('.png')) return;

  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file);

  try {
    const original = sharp(inputPath);
    const metadata = await original.metadata();

    let resizedBuffer;
    let newWidth = metadata.width;
    let newHeight = metadata.height;

    // Resize down if too big
    if (metadata.width > TARGET_SIZE || metadata.height > TARGET_SIZE) {
      const scaleFactor = Math.min(TARGET_SIZE / metadata.width, TARGET_SIZE / metadata.height);
      newWidth = Math.floor(metadata.width * scaleFactor);
      newHeight = Math.floor(metadata.height * scaleFactor);
      resizedBuffer = await original.resize(newWidth, newHeight).toBuffer();
    } else {
      resizedBuffer = await original.toBuffer();
    }

    const left = Math.floor((TARGET_SIZE - newWidth) / 2);
    const top = Math.floor((TARGET_SIZE - newHeight) / 2);

    await sharp({
      create: {
        width: TARGET_SIZE,
        height: TARGET_SIZE,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{ input: resizedBuffer, top, left }])
      .png()
      .toFile(outputPath);

    console.log(`✅ Padded: ${file}`);
  } catch (err) {
    console.error(`❌ Failed to process ${file}:`, err);
  }
});
