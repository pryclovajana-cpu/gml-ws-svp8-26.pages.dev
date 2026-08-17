import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inputPath = path.join(__dirname, '../C:/Users/Pryclova/.gemini/antigravity/brain/f21fc438-5cf4-4aed-ba79-fce11079dc0b/.user_uploaded/media_1786916891805.png');
const outputPath = path.join(__dirname, '../public/images/hero_meadow.png');

async function process() {
  const { data, info } = await sharp('C:/Users/Pryclova/.gemini/antigravity/brain/f21fc438-5cf4-4aed-ba79-fce11079dc0b/.user_uploaded/media_1786916891805.png')
    .ensureAlpha()
    .trim({ threshold: 10 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const buffer = Buffer.from(data);

  for (let i = 0; i < buffer.length; i += channels) {
    const r = buffer[i];
    const g = buffer[i + 1];
    const b = buffer[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const sat = Math.max(r, g, b) - Math.min(r, g, b);

    if (lum >= 238 && sat < 20) {
      buffer[i + 3] = 0;
    } else if (lum > 200 && sat < 25) {
      const factor = (238 - lum) / (238 - 200);
      buffer[i + 3] = Math.min(buffer[i + 3], Math.round(factor * 255));
    }
  }

  await sharp(buffer, { raw: { width, height, channels } })
    .trim({ threshold: 5 })
    .png()
    .toFile(outputPath);

  console.log('Tightly cropped and transparent meadow drawing saved!');
}

process().catch(console.error);
