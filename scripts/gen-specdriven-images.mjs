#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

// Read the lesson images module as text (ESM .js file)
const projectRoot = process.cwd();
const lessonImagesPath = path.join(projectRoot, 'src', 'specDrivenDev', 'lessonImages.js');
let LESSON_IMAGES;
try {
  // Read the file as text and extract the exported array
  const content = fs.readFileSync(lessonImagesPath, 'utf8');
  // Parse the export: looks like "export const LESSON_IMAGES = [ ... ]"
  const match = content.match(/export\s+const\s+LESSON_IMAGES\s*=\s*\[([\s\S]+?)\];/);
  if (!match) throw new Error('Could not parse LESSON_IMAGES from lessonImages.js');
  LESSON_IMAGES = JSON.parse(match[1]);
  if (!Array.isArray(LESSON_IMAGES)) throw new Error('LESSON_IMAGES must be an array');
} catch (e) {
  throw new Error(`Failed to parse lessonImages.js: ${e.message}`);
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY || OPENAI_API_KEY.startsWith('sk-YOUR')) {
  throw new Error('OPENAI_API_KEY must be set (non-placeholder) to generate images. Set it in your environment or .env.local and rerun.');
}

const ENDPOINT = 'https://api.openai.com/v1/images/generations';
const MODEL = 'gpt-image-1';
const IMAGE_DIR = path.join(projectRoot, 'public', 'assets', 'optimized', 'specdriven');
const size = '1024x1024';

if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR, { recursive: true });

console.log(`Generating ${LESSON_IMAGES.length} lesson images in ${IMAGE_DIR}...`);
console.log('Using OPENAI_API_KEY from environment:', !!OPENAI_API_KEY);

async function fetchImage(prompt) {
  const body = JSON.stringify({
    model: MODEL,
    prompt,
    n: 1,
    size,
    response_format: 'b64_json',
    style: { quality: 'high', consistency: true },
  });

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error ${res.status} ${res.statusText}: ${text}`);
  }

  const data = await res.json();
  const image = data.data?.[0];
  if (!image?.b64_json) throw new Error('OpenAI response had no image data.');
  return image.b64_json;
}

async function saveBase64ToFile(base64, filePath) {
  const base64Data = base64.replace(/^data:image\/[a-z]+;base64,/, '');
  const buf = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filePath, buf);
}

(async () => {
  let successCount = 0;
  let errorCount = 0;
  for (const img of LESSON_IMAGES) {
    const outPath = path.join(IMAGE_DIR, `${img.id}.png`);
    try {
      console.log(`  [${img.lesson}] Generating ${img.title} -> ${img.id}.png`);
      const base64 = await fetchImage(img.prompt);
      await saveBase64ToFile(base64, outPath);
      console.log(`    ✓ saved`);
      successCount++;
    } catch (err) {
      console.error(`    ✗ ${err.message}`);
      errorCount++;
    }
  }
  console.log(`\nDone. ${successCount} images saved, ${errorCount} errors.`);
})();