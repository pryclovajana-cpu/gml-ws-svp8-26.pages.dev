import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, '../public/images');

async function processImage(filename) {
  const inputPath = path.join(imagesDir, filename);
  if (!fs.existsSync(inputPath)) {
    console.log(`File ${filename} not found, skipping.`);
    return;
  }

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const outputBuffer = Buffer.from(data);

  for (let i = 0; i < outputBuffer.length; i += channels) {
    const r = outputBuffer[i];
    const g = outputBuffer[i + 1];
    const b = outputBuffer[i + 2];

    // Compute luminance
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    // Calculate saturation / color difference from grey
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const sat = maxVal - minVal;

    if (lum >= 242 && sat < 15) {
      // Pure or off-white background -> completely transparent
      outputBuffer[i + 3] = 0;
    } else if (lum > 210 && sat < 25) {
      // Soft antialiased feathering transition for clean edges
      const factor = (242 - lum) / (242 - 210);
      outputBuffer[i + 3] = Math.min(outputBuffer[i + 3], Math.round(factor * 255));
    }
  }

  const pngName = filename.replace(/\.(jpg|jpeg)$/i, '.png');
  const pngPath = path.join(imagesDir, pngName);

  await sharp(outputBuffer, { raw: { width, height, channels } })
    .png({ quality: 100 })
    .toFile(pngPath);

  console.log(`Processed ${filename} -> ${pngName} with transparent background!`);
}

async function run() {
  await processImage('hero_meadow.jpg');
  await processImage('gifted_tree.jpg');
  await processImage('monolith_hall.jpg');
}

run().catch(console.error);
