import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ZR_STAGES,
  ZR_SCALING,
  ZR_CODE,
  chunkWords,
  chunkCount,
  cosineDistance,
  topK,
  answerPlan,
  bruteForceMillis,
} from '../src/zeroRag/zeroRagEngine.js';

test('chunkCount exacts: step = size - overlap', () => {
  // 100 words, size 25, overlap 5 → step 20 → ceil(100/20) = 5? No: ceil(100/20)=5.
  // Wait — words 0..99 in steps of 20: starts 0,20,40,60,80 → 5 chunks? The last
  // window starts at 80 and covers 80..99. But ceil counts 100/20=5.
  assert.equal(chunkCount(100, 25, 5), 5);
  // 99 words → starts 0..80, last covers 80..98 → still 5
  assert.equal(chunkCount(99, 25, 5), 5);
  // 101 words → start 100 needed → 6
  assert.equal(chunkCount(101, 25, 5), 6);
  // zero overlap: ceil(100/25) = 4
  assert.equal(chunkCount(100, 25, 0), 4);
  // edge: empty
  assert.equal(chunkCount(0, 25, 5), 0);
});

test('chunkCount / chunkWords validation', () => {
  assert.throws(() => chunkCount(10, 5, 5), /overlap/);
  assert.throws(() => chunkCount(10, 0, 0), /size/);
  assert.throws(() => chunkWords('a b', 5, 5), /overlap/);
});

test('chunkWords: exact chunk boundaries with overlap', () => {
  const words = Array.from({ length: 10 }, (_, i) => `w${i}`);
  const chunks = chunkWords(words.join(' '), 4, 1);
  // step 3 → starts 0,3,6,9 → chunks w0-w3, w3-w6, w6-w9, w9
  assert.deepEqual(chunks, ['w0 w1 w2 w3', 'w3 w4 w5 w6', 'w6 w7 w8 w9', 'w9']);
  // overlap word appears in consecutive chunks
  assert.ok(chunks[0].includes('w3') && chunks[1].includes('w3'));
});

test('chunkWords: no overlap = clean partition', () => {
  const words = Array.from({ length: 8 }, (_, i) => `w${i}`);
  const chunks = chunkWords(words.join(' '), 4, 0);
  assert.deepEqual(chunks, ['w0 w1 w2 w3', 'w4 w5 w6 w7']);
});

test('chunkWords: empty text → empty list', () => {
  assert.deepEqual(chunkWords('   ', 10, 2), []);
});

test('cosineDistance: identical → 0, orthogonal → 1', () => {
  assert.equal(cosineDistance([1, 2, 3], [1, 2, 3]), 0);
  assert.equal(cosineDistance([1, 0], [0, 1]), 1);
  // opposite → 2
  assert.equal(cosineDistance([1, 0], [-1, 0]), 2);
});

test('cosineDistance: zero vector guard and dim mismatch', () => {
  assert.equal(cosineDistance([0, 0], [1, 1]), 1);
  assert.throws(() => cosineDistance([1], [1, 2]), /dimension/);
});

test('topK: sorted by ascending distance, k truncates', () => {
  const matrix = [
    [1, 0.5],  // idx 0: far
    [1, 0.05], // idx 1: near
    [1, 0],    // idx 2: identical to query
  ];
  const q = [1, 0];
  assert.deepEqual(topK(q, matrix, 2).map((r) => r.idx), [2, 1]);
  assert.deepEqual(topK(q, matrix, 3).map((r) => r.idx), [2, 1, 0]);
  // k larger than matrix → all, in order
  assert.equal(topK(q, matrix, 9).length, 3);
  // distances ascending
  const ranked = topK(q, matrix, 3);
  assert.ok(ranked[0].d <= ranked[1].d && ranked[1].d <= ranked[2].d);
});

test('topK: ties broken by original index (stable)', () => {
  const matrix = [[1, 1], [1, 1], [1, 1]];
  assert.deepEqual(topK([1, 1], matrix, 2).map((r) => r.idx), [0, 1]);
});

test('topK: k validation', () => {
  assert.throws(() => topK([1], [[1]], 0), /k/);
});

test('answerPlan: abstain when no content-word overlap', () => {
  const plan = answerPlan(['archipelago of islands with beaches'], 'What is the boiling point of tungsten?');
  assert.equal(plan.action, 'abstain');
  assert.equal(plan.overlap, 0);
});

test('answerPlan: answer when context overlaps the query', () => {
  const plan = answerPlan(['tropical beaches and islands everywhere'], 'Which islands have beaches?');
  assert.equal(plan.action, 'answer');
  assert.ok(plan.overlap >= 1);
});

test('answerPlan: stop-words never count as overlap', () => {
  // "what/which/where" are stop words; only "tungsten" would count, context lacks it
  const plan = answerPlan(['the weather pattern shifts weekly'], 'What is the weather pattern?');
  assert.equal(plan.action, 'answer'); // "weather","pattern" shared
  const plan2 = answerPlan(['completely unrelated marine biology'], 'What is the weather pattern?');
  assert.equal(plan2.action, 'abstain');
});

test('bruteForceMillis: grows linearly with chunks, sub-ms at 1k', () => {
  const at100 = bruteForceMillis(100);
  const at1000 = bruteForceMillis(1000);
  assert.ok(at1000 > at100);
  assert.ok(at1000 < 1); // 1000 × 384 × 2 ns ≈ 0.77 ms
});

test('data exports: stage count, scaling rows, code sample', () => {
  assert.equal(ZR_STAGES.length, 4);
  ZR_STAGES.forEach((s) => {
    assert.ok(typeof s.n === 'number' && s.stage && s.detail && s.output);
  });
  assert.equal(ZR_SCALING.length, 4);
  assert.ok(ZR_SCALING[0].option.includes('Brute-force'));
  assert.ok(ZR_CODE.includes('def chunk') && ZR_CODE.includes('retrieve'));
});
