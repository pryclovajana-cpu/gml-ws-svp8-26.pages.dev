import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logoPath = path.join(__dirname, '../public/images/gml_official_logo.png');

async function cleanLogo() {
  const { data, info } = await sharp(logoPath)
    .ensureAlpha()
    .trim({ threshold: 15 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const outputBuffer = Buffer.from(data);

  for (let i = 0; i < outputBuffer.length; i += channels) {
    const r = outputBuffer[i];
    const g = outputBuffer[i + 1];
    const b = outputBuffer[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const sat = maxVal - minVal;

    // If near white, make 100% transparent
    if (lum >= 235 && sat < 20) {
      outputBuffer[i + 3] = 0;
    }
  }

  await sharp(outputBuffer, { raw: { width, height, channels } })
    .trim({ threshold: 5 })
    .png()
    .toFile(logoPath);

  console.log(`Cleaned and trimmed uploaded logo!`);
}

cleanLogo().catch(console.error);
