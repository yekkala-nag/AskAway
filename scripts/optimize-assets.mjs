#!/usr/bin/env node
/**
 * scripts/optimize-assets.mjs — optimize images in public/assets/
 *
 * - PNG: convert to WebP (quality 85) + optimized PNG (palette + zlib)
 * - SVG: run SVGO with safe optimizations
 * - Output to public/assets/optimized/ preserving directory structure
 * - Generates manifest.json mapping original → optimized paths
 *
 * Usage: node scripts/optimize-assets.mjs [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { optimize } from 'svgo';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ASSETS_DIR = path.join(ROOT, 'public', 'assets');
const OUT_DIR = path.join(ASSETS_DIR, 'optimized');
const MANIFEST_PATH = path.join(ASSETS_DIR, 'manifest.json');

const DRY_RUN = process.argv.includes('--dry-run');

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function optimizePng(inputPath, relPath) {
  const outWebp = path.join(OUT_DIR, relPath.replace(/\.png$/i, '.webp'));
  const outPng = path.join(OUT_DIR, relPath);

  await ensureDir(path.dirname(outWebp));
  await ensureDir(path.dirname(outPng));

  if (DRY_RUN) {
    console.log(`[dry-run] PNG: ${relPath} → ${path.relative(ASSETS_DIR, outWebp)} + ${path.relative(ASSETS_DIR, outPng)}`);
    return { original: relPath, webp: path.relative(ASSETS_DIR, outWebp), png: path.relative(ASSETS_DIR, outPng) };
  }

  const buffer = fs.readFileSync(inputPath);

  // WebP (for modern browsers)
  await sharp(buffer)
    .webp({ quality: 85, effort: 6 })
    .toFile(outWebp);

  // Optimized PNG (palette reduction + max compression)
  await sharp(buffer)
    .png({ palette: true, quality: 90, compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outPng);

  const origSize = buffer.length;
  const webpSize = fs.statSync(outWebp).size;
  const pngSize = fs.statSync(outPng).size;
  const savings = ((origSize - Math.min(webpSize, pngSize)) / origSize * 100).toFixed(1);

  console.log(`  PNG: ${relPath} (${(origSize/1024).toFixed(0)} KB) → WebP ${(webpSize/1024).toFixed(0)} KB, PNG ${(pngSize/1024).toFixed(0)} KB (${savings}% saved)`);

  return { original: relPath, webp: path.relative(ASSETS_DIR, outWebp), png: path.relative(ASSETS_DIR, outPng) };
}

async function optimizeSvg(inputPath, relPath) {
  const outSvg = path.join(OUT_DIR, relPath);

  await ensureDir(path.dirname(outSvg));

  if (DRY_RUN) {
    console.log(`[dry-run] SVG: ${relPath} → ${path.relative(ASSETS_DIR, outSvg)}`);
    return { original: relPath, svg: path.relative(ASSETS_DIR, outSvg) };
  }

  const content = fs.readFileSync(inputPath, 'utf8');
  const result = optimize(content, {
    path: inputPath,
    multipass: true,
    plugins: [
      'preset-default',
      'removeDimensions', // let CSS control size
      'removeXMLNS', // not needed for inline SVG
      { name: 'removeViewBox', active: false }, // keep viewBox for scaling
      { name: 'cleanupIds', active: false }, // some SVGs may reference IDs
    ],
  });

  fs.writeFileSync(outSvg, result.data);

  const origSize = content.length;
  const newSize = result.data.length;
  const savings = ((origSize - newSize) / origSize * 100).toFixed(1);

  console.log(`  SVG: ${relPath} (${(origSize/1024).toFixed(1)} KB) → ${(newSize/1024).toFixed(1)} KB (${savings}% saved)`);

  return { original: relPath, svg: path.relative(ASSETS_DIR, outSvg) };
}

async function main() {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error('Assets directory not found:', ASSETS_DIR);
    process.exit(1);
  }

  console.log(`Scanning ${ASSETS_DIR}...`);
  const files = fs.readdirSync(ASSETS_DIR).filter(f => !f.startsWith('.') && f !== 'optimized' && f !== 'manifest.json');

  const manifest = {};
  let pngCount = 0, svgCount = 0, otherCount = 0;

  for (const file of files) {
    const inputPath = path.join(ASSETS_DIR, file);
    const stat = fs.statSync(inputPath);
    if (!stat.isFile()) continue;

    const ext = path.extname(file).toLowerCase();
    try {
      if (ext === '.png') {
        manifest[file] = await optimizePng(inputPath, file);
        pngCount++;
      } else if (ext === '.svg') {
        manifest[file] = await optimizeSvg(inputPath, file);
        svgCount++;
      } else {
        // Copy other files as-is
        const outPath = path.join(OUT_DIR, file);
        await ensureDir(path.dirname(outPath));
        if (!DRY_RUN) fs.copyFileSync(inputPath, outPath);
        manifest[file] = { original: file, copied: file };
        otherCount++;
      }
    } catch (err) {
      console.error(`Failed to optimize ${file}:`, err.message);
      // Copy original as fallback
      const outPath = path.join(OUT_DIR, file);
      await ensureDir(path.dirname(outPath));
      if (!DRY_RUN) fs.copyFileSync(inputPath, outPath);
      manifest[file] = { original: file, copied: file, error: err.message };
    }
  }

  if (!DRY_RUN) {
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log(`\nManifest written to ${MANIFEST_PATH}`);
  }

  console.log(`\nDone. PNG: ${pngCount}, SVG: ${svgCount}, Other: ${otherCount}`);
  if (DRY_RUN) console.log('(dry-run: no files written)');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});