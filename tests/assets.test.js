import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ASSETS = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets');
const svgs = readdirSync(ASSETS).filter((n) => n.endsWith('.svg'));
const read = (name) => readFileSync(join(ASSETS, name), 'utf8');

/** entity references that are legal in XML text/attributes */
const ENTITY = /&(?:amp|lt|gt|quot|apos|nbsp|#\d+|#x[0-9a-fA-F]+);/g;

test('asset inventory is non-trivial', () => {
  assert.ok(svgs.length >= 50, `expected >=50 svg assets, found ${svgs.length}`);
});

test('no legacy light canvas colors remain in any svg', () => {
  const forbidden = ['#f7f5f0', '#f8fafc', '#eef2f6', '#eef2f7', '#fafaf9', '#fffef7'];
  for (const name of svgs) {
    const svg = read(name).toLowerCase();
    for (const hex of forbidden) {
      assert.ok(
        !svg.includes(hex),
        `${name} still uses light canvas color ${hex}`
      );
    }
  }
});

test('every svg declares a viewbox', () => {
  for (const name of svgs) {
    assert.match(read(name), /viewBox="/, `${name} has no viewBox`);
  }
});

test('no invalid font-size values (markup bug from generator)', () => {
  for (const name of svgs) {
    assert.doesNotMatch(
      read(name),
      /font-size="[^0-9.\-]/,
      `${name} has a non-numeric font-size`
    );
  }
});

test('no malformed #rrggbb #aa fill values', () => {
  for (const name of svgs) {
    assert.doesNotMatch(
      read(name),
      /fill="#[0-9a-fA-F]{3,8} [0-9a-fA-F]{1,2}"/,
      `${name} has a space-separated alpha fill`
    );
  }
});

test('no bare ampersands (invalid XML) in any svg', () => {
  for (const name of svgs) {
    const stripped = read(name).replace(ENTITY, '');
    assert.ok(
      !stripped.includes('&'),
      `${name} contains an unescaped &`
    );
  }
});

test('every paint reference resolves to a definition', () => {
  for (const name of svgs) {
    const svg = read(name);
    const refs = [...svg.matchAll(/url\(#[A-Za-z0-9_-]+\)/g)]
      .map((m) => m[0].slice(5, -1));
    const defs = new Set(
      [...svg.matchAll(/<(?:marker|linearGradient|radialGradient|filter|clipPath) id="([^"]+)"/g)]
        .map((m) => m[1])
    );
    for (const id of refs) {
      assert.ok(defs.has(id), `${name} references undefined #${id}`);
    }
  }
});

test('migrated diagrams sit on the navy ground with ramp accents', () => {
  const migrated = [
    'agentic_rag.svg', 'arch_mla.svg', 'arch_moe.svg', 'arch_speculative.svg',
    'context_engineering.svg', 'hallucination_loop.svg', 'pipeline_flow.svg',
    'rag_types_spectrum.svg', 'workflows_hierarchy.svg', 'overview_architecture.svg',
    'complete_rag_pipeline.svg',
  ];
  const RAMP = ['#c96a5a', '#e08a4c', '#e8c558', '#7fb069', '#5ec4c8', '#6a9bd8', '#a78bfa'];
  for (const name of migrated) {
    const svg = read(name).toLowerCase();
    assert.ok(
      svg.includes('#090d16') || svg.includes('#101a30'),
      `${name} lost the navy DIAGRAM_BG ground`
    );
    const accents = new Set(
      [...svg.matchAll(/(?:fill|stroke|stop-color)="(#[0-9a-f]{6})(?:[0-9a-f]{2})?"/g)]
        .map((m) => m[1])
        .filter((hex) => !['#000000', '#ffffff'].includes(hex))
    );
    const offRamp = [...accents].filter(
      (hex) => !RAMP.includes(hex) && !['#0f172a', '#334155', '#475569', '#94a3b8',
        '#f1f5f9', '#f0ede6', '#e0dcd4', '#ef4444', '#f5a623', '#1a1a2e', '#101a30',
        '#090d16'].includes(hex)
    );
    assert.deepEqual(offRamp, [], `${name} has off-palette colors: ${offRamp.join(', ')}`);
  }
});
