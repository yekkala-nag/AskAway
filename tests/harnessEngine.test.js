import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sampleGoldenDataset, judgeKind, cascadePlan, jsonlAppend, parseJsonl,
  summarize, rescoreGain, HARNESS_STAGES, JUDGE_COMPARISON,
} from '../src/evalHarness/harnessEngine.js';

test('sampleGoldenDataset: 8 cases, id/input/expected_concept, 4-category mix', () => {
  const cases = sampleGoldenDataset();
  assert.equal(cases.length, 8);
  for (const c of cases) {
    assert.ok(c.id, 'id missing');
    assert.ok(c.input, 'input missing');
    assert.ok(c.expected_concept, 'expected_concept missing');
  }
  const cats = [...new Set(cases.map((c) => c.category))].sort();
  assert.deepEqual(cats, ['ambiguity', 'factual', 'format', 'refusal']);
});

test('judgeKind mapping: check field decides, category is the fallback', () => {
  assert.equal(judgeKind({ check: 'substring' }), 'deterministic');
  assert.equal(judgeKind({ check: 'format' }), 'deterministic');
  assert.equal(judgeKind({ check: 'semantic' }), 'llm');
  assert.equal(judgeKind({ category: 'factual' }), 'deterministic');
  assert.equal(judgeKind({ category: 'format' }), 'deterministic');
  assert.equal(judgeKind({ category: 'refusal' }), 'llm');
  assert.equal(judgeKind({ category: 'ambiguity' }), 'llm');
  assert.equal(judgeKind({}), 'llm');
  for (const c of sampleGoldenDataset()) {
    const expected = (c.category === 'factual' || c.category === 'format') ? 'deterministic' : 'llm';
    assert.equal(judgeKind(c), expected, c.id);
  }
});

test('cascadePlan exact savings math: all deterministic cases settle locally', () => {
  const plan = cascadePlan(sampleGoldenDataset());
  assert.equal(plan.total, 8);
  assert.equal(plan.detCount, 4);
  assert.equal(plan.detRouted, 0);
  assert.equal(plan.llmRouted, 4);
  assert.equal(plan.allLlmCalls, 8);
  assert.equal(plan.savedApiCalls, 4);
});

test('cascadePlan routes deterministic failures/ambiguities to the LLM judge', () => {
  const cases = sampleGoldenDataset();
  const p75 = cascadePlan(cases, 0.75);
  assert.equal(p75.detRouted, 1);
  assert.equal(p75.llmRouted, 5);
  assert.equal(p75.savedApiCalls, 3);
  const p50 = cascadePlan(cases, 0.5);
  assert.equal(p50.detRouted, 2);
  assert.equal(p50.llmRouted, 6);
  assert.equal(p50.savedApiCalls, 2);
  const p0 = cascadePlan(cases, 0);
  assert.equal(p0.detRouted, 4);
  assert.equal(p0.llmRouted, 8);
  assert.equal(p0.savedApiCalls, 0);
});

test('jsonlAppend round-trips through parseJsonl', () => {
  const records = [
    { id: 'G-01', judge: 'deterministic', pass: true, ts: '2026-01-01T00:00:00.000Z' },
    { id: 'G-02', judge: 'llm', pass: false, reason: 'missed the expected concept', ts: '2026-01-01T00:00:01.000Z' },
  ];
  const text = jsonlAppend(records);
  assert.ok(text.endsWith('\n'), 'jsonl must end with a newline');
  assert.equal(text.split('\n').filter(Boolean).length, 2);
  assert.deepEqual(parseJsonl(text), records);
});

test('jsonlAppend stamps a timestamp when the record lacks one', () => {
  const text = jsonlAppend([{ id: 'G-03', pass: true }], '2026-01-01T00:00:00.000Z');
  const [line] = parseJsonl(text);
  assert.equal(line.ts, '2026-01-01T00:00:00.000Z');
  assert.equal(line.id, 'G-03');
  assert.equal(line.pass, true);
});

test('parseJsonl skips a corrupt middle line, keeps the rest', () => {
  const text = '{"id":"a","pass":true}\n{"id":"b","pass":tru\n\n{"id":"c","pass":false}\n';
  const parsed = parseJsonl(text);
  assert.equal(parsed.length, 2);
  assert.deepEqual(parsed.map((r) => r.id), ['a', 'c']);
  assert.deepEqual(parseJsonl(''), []);
});

test('summarize: exact passRate and byJudge split', () => {
  const records = [
    { judge: 'deterministic', pass: true },
    { judge: 'deterministic', pass: true },
    { judge: 'deterministic', pass: true },
    { judge: 'deterministic', pass: true },
    { judge: 'llm', pass: true },
    { judge: 'llm', pass: true },
    { judge: 'llm', pass: false },
    { judge: 'llm', pass: false },
  ];
  const s = summarize(records);
  assert.equal(s.total, 8);
  assert.equal(s.passed, 6);
  assert.equal(s.passRate, 0.75);
  assert.equal(s.byJudge.deterministic.total, 4);
  assert.equal(s.byJudge.deterministic.passRate, 1);
  assert.equal(s.byJudge.llm.total, 4);
  assert.equal(s.byJudge.llm.passed, 2);
  assert.equal(s.byJudge.llm.passRate, 0.5);
  assert.equal(summarize([]).passRate, 0);
});

test('rescoreGain: re-scores stored raws with zero inference runs', () => {
  const rawOutputs = Array.from({ length: 5 }, (_, i) => ({ id: `R-${i}`, fit: i / 10 }));
  const gain = rescoreGain({ rawOutputs, newJudgePassFn: (r) => r.fit >= 0.2 });
  assert.equal(gain.rescored, 5);
  assert.equal(gain.inferenceRuns, 0);
  assert.equal(gain.savedInference, 5);
  assert.equal(gain.passed, 3);
  assert.equal(gain.passRate, 0.6);
  assert.equal(gain.records.length, 5);
  assert.equal(gain.records[0].pass, false);
  assert.equal(gain.records[2].pass, true);
});

test('HARNESS_STAGES shape: 4 ordered modules with owns + handsOff', () => {
  assert.equal(HARNESS_STAGES.length, 4);
  HARNESS_STAGES.forEach((s, i) => {
    assert.equal(s.order, i + 1);
    for (const key of ['icon', 'name', 'owns', 'handsOff', 'color']) {
      assert.ok(s[key], `${key} missing on stage ${i + 1}`);
    }
  });
});

test('JUDGE_COMPARISON shape: aspect/deterministic/llmJudge rows', () => {
  assert.ok(JUDGE_COMPARISON.length >= 4);
  const aspects = JUDGE_COMPARISON.map((r) => r.aspect);
  for (const aspect of ['Speed', 'Cost', 'Consistency', 'Best for']) {
    assert.ok(aspects.includes(aspect), `${aspect} row missing`);
  }
  for (const row of JUDGE_COMPARISON) {
    for (const key of ['aspect', 'deterministic', 'llmJudge']) {
      assert.ok(row[key], `${key} missing on ${row.aspect}`);
    }
  }
});
