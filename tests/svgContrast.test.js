import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets');
const files = fs.readdirSync(dir).filter((n) => n.endsWith('.svg'));

const hex = (h) => {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const lum = (c) => {
  const [r, g, b] = hex(c).map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const l1 = lum(a);
  const l2 = lum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};
/** '#rgb'/'#rrggbb'/'#rrggbbaa' + optional fill-opacity -> { rgb, a } */
const parse = (h, op) => {
  const m = (h || '').match(/^#([0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/);
  if (!m) return null;
  const hexA = m[2] ? parseInt(m[2], 16) / 255 : 1;
  return { rgb: hex('#' + m[1]), a: hexA * (op !== undefined ? parseFloat(op) : 1) };
};
const over = (fg, bg) => fg.rgb.map((v, i) => Math.round(v * fg.a + bg[i] * (1 - fg.a)));
const toHex = (c) => '#' + c.map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');

/** background painted behind a text node: canvas, then every rect covering it in draw order */
function backgroundFor(svg) {
  let canvas = [9, 13, 22];
  const gref = svg.match(/<rect width="\d+" height="\d+" fill="url\(#([^)]+)\)"/);
  if (gref) {
    const g = svg.match(new RegExp(`<linearGradient id="${gref[1]}"[^>]*>([\\s\\S]*?)<\\/linearGradient>`));
    if (g) {
      const stop = [...g[1].matchAll(/stop-color="(#[0-9a-fA-F]{6,8})"/g)].map((m) => m[1])[0];
      const p = parse(stop || '#090d16');
      if (p) canvas = p.rgb;
    }
  }
  const solid = svg.match(/<rect width="\d+" height="\d+" fill="(#[0-9a-fA-F]{6,8})"\/>/);
  if (solid) {
    const p = parse(solid[1]);
    if (p) canvas = p.rgb;
  }
  const rects = [...svg.matchAll(/<rect ([^>]*)\/?>/g)].map((m) => {
    const a = m[1];
    return {
      x: +(a.match(/\bx="([-\d.]+)"/) || [, 0])[1],
      y: +(a.match(/\by="([-\d.]+)"/) || [, 0])[1],
      w: +(a.match(/\bwidth="([-\d.]+)"/) || [, 0])[1],
      h: +(a.match(/\bheight="([-\d.]+)"/) || [, 0])[1],
      f: (a.match(/\bfill="([^"]+)"/) || [])[1],
      fo: (a.match(/\bfill-opacity="([^"]+)"/) || [])[1],
    };
  }).filter((r) => r.f && r.w && r.h);
  return (x, y) => {
    let bg = canvas;
    for (const r of rects) {
      if (r.x <= x && x <= r.x + r.w && r.y <= y && y <= r.y + r.h) {
        const p = parse(r.f, r.fo);
        if (p) bg = p.a >= 0.99 ? p.rgb : over(p, bg);
      }
    }
    return toHex(bg);
  };
}

test('every svg text node meets WCAG contrast against its actual backdrop', () => {
  const failures = [];
  for (const name of files) {
    const svg = fs.readFileSync(join(dir, name), 'utf8');
    const bgAt = backgroundFor(svg);
    for (const [, attrs, content] of svg.matchAll(/<text ([^>]*)>([^<]*)</g)) {
      const text = content.trim();
      if (!text) continue;
      const fill = (attrs.match(/\bfill="([^"]+)"/) || [])[1];
      if (!fill) continue;
      const opacity = (attrs.match(/\bfill-opacity="([^"]+)"/) || [])[1];
      const fg = parse(fill, opacity);
      if (!fg || fg.a < 0.9) continue; // translucent captions are decorative
      const x = +(attrs.match(/\bx="([-\d.]+)"/) || [, 0])[1];
      const y = +(attrs.match(/\by="([-\d.]+)"/) || [, 0])[1];
      const size = +((attrs.match(/font-size="([\d.]+)"/) || [])[1] || 16);
      const bold = /font-weight="(700|800|900)"/.test(attrs);
      const need = size >= 18 || (size >= 14 && bold) ? 3 : 4.5;
      const ratio = contrast(toHex(fg.rgb), bgAt(x, y));
      if (ratio < need) {
        failures.push(`${name}: ${ratio.toFixed(2)}:1 (need ${need}) "${text.slice(0, 40)}"`);
      }
    }
  }
  assert.deepEqual(failures, [], `low-contrast text:\n  ${failures.join('\n  ')}`);
  assert.ok(files.length >= 50, `expected >=50 svgs, found ${files.length}`);
});
