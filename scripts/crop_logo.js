import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logoPath = path.join(__dirname, '../public/images/gml_official_logo.png');

async function cropLogo() {
  const { data, info } = await sharp(logoPath)
    .trim({ threshold: 10 }) // Tightly trim transparent/white bounding box
    .toBuffer({ resolveWithObject: true });

  await sharp(data)
    .png()
    .toFile(logoPath);

  console.log(`Cropped logo tightly! New dimensions: ${info.width}x${info.height}`);
}

cropLogo().catch(console.error);
