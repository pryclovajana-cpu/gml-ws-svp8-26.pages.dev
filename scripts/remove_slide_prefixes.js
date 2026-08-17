import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const slidesDir = path.join(__dirname, '../src/slides');
const componentsDir = path.join(__dirname, '../src/components');

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;

  // Patterns like "Slide 1 • ", "Slide 2 • ", "Slide 10 • ", etc.
  content = content.replace(/Slide \d+[a-z]? • /gi, '');
  content = content.replace(/Slide \d+[a-z]?/gi, (match, offset, str) => {
    // If it's part of variable name or import, keep it
    if (str.slice(offset - 6, offset).includes('import') || str.slice(offset - 1, offset).match(/[a-zA-Z0-9_]/)) {
      return match;
    }
    return '';
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Cleaned: ${path.basename(filePath)}`);
  }
}

function processDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      processDir(fullPath);
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      cleanFile(fullPath);
    }
  }
}

processDir(slidesDir);
processDir(componentsDir);
