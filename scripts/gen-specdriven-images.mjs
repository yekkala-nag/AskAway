//─────────────────────────────────────────────────────────────────────
// scripts/gen-specdriven-images.mjs
// Generate one lesson hero image per prompt in src/specDrivenDev/lessonImages.js
// and save as /public/assets/optimized/specdriven/lesson-{n}.png
//
// Usage:
//   OPENAI_API_KEY=sk-YOUpload this script with the project root as cwd:
//   node scripts/gen-specdriven-images.mjs
//
// The OpenAI key is taken from the environment only; no key is stored in the repo.
//─────────────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';

// Reading package.json to ensure we match the project root
const projectRoot = process.cwd();
const imagesSrc = path.join(projectRoot, 'src', 'specDrivenDev', 'lessonImages.js');

// Safely import the prompts module as ES Module text (Node requires a file extension)
let LESSON_IMAGES;
import imagesMod from imagesSrc; // ESM import for .js files (supported by node >=18)
LESSON_IMAGES = imagesMod.LESSON_IMAGES || imagesMod.default?.LESSON_IMAGES;
if (!LESSON_IMAGES) {
  throw new Error('lessonImages.js must export LESSON_IMAGES');
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY || OPENAI_API_KEY.startsWith('sk-YOUR')) {
  throw new Error(
    'OPENAI_API_KEY must be set (non-placeholder) to generate images. Set it in your environment or .env.local and rerun.'
  );
}

const ENDPOINT = 'https://api.openai.com/v1/images/generations';
const MODEL = 'gpt-image-1';
const IMAGE_DIR = path.join(projectRoot, 'public', 'assets', 'optimized', 'specdriven');
const size = '1024x1024';

// Ensure output directory exists
if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR, { recursive: true });

console.log(`Generating ${LESSON_IMAGES.length} lesson images in ${IMAGE_DIR}...
`);

async function fetchImage(prompt) {
  const body = JSON.stringify({
    model: MODEL,
    prompt,
    n: 1,
    size,
    response_format: 'b64_json',
    style: { quality: 'high', consistency: true }, // optional; good for UI visuals
  });

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`, // token from env, never logged
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
  // Remove potential data URI prefix if present (rare)
  const base64Data = base64.replace(/^data:image\/[a-z]+;base64,/, '');
  const buf = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filePath, buf);
}

// Sequential processing (8 is small)
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
  console.log(`\nDone. ${successCount} images saved, ${errorCount} errors.
`);
})();
