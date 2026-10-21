import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  UNIVERSAL_BLOCKS,
  META_PROMPT,
  QUICK_FIRE,
  PRO_TIPS,
  TASK_REPORT_INPUT,
  TASK_STATUS,
  TASK_REPORT_SECTIONS,
  TASK_QUICK,
  SAMPLE_TASKS,
  TOKEN_REPORT_INPUT,
  TOKEN_ROWS,
  tokenTotals,
  budgetState,
  RATE_IN_PER_M,
  RATE_OUT_PER_M,
  EFFICIENCY_NOTES,
  TOKEN_QUICK,
  ALIGNMENT_PROTOCOLS,
  WHY_ALIGNMENT,
  TWO_PHASE_INPUT,
  BG_TASKS,
  STATUS_LABELS,
  aggregateTasks,
  COMPLIANCE_NOTES,
} from '../src/promptAlignment/promptAlignEngine.js';

test('universal master: six blocks in fixed order, each with line and why', () => {
  assert.deepEqual(UNIVERSAL_BLOCKS.map((b) => b.id), ['role', 'context', 'task', 'steps', 'constraints', 'output']);
  for (const b of UNIVERSAL_BLOCKS) {
    assert.ok(b.line.includes('['), `${b.id} shows a fill-in line`);
    assert.ok(b.why.length > 25, `${b.id} explains itself`);
  }
  assert.ok(UNIVERSAL_BLOCKS.find((b) => b.id === 'constraints').line.includes('ask first'));
});

test('meta-prompt, C-T-F shortcut, and pro tips', () => {
  assert.equal(META_PROMPT.steps.length, 5);
  assert.ok(META_PROMPT.steps.some((s) => s.includes('Wait')));
  assert.match(META_PROMPT.opening, /ultimate goal/);
  assert.deepEqual(QUICK_FIRE.blocks.map((b) => b.letter), ['C', 'T', 'F']);
  assert.equal(PRO_TIPS.length, 3);
  for (const t of PRO_TIPS) {
    assert.ok(t.add.startsWith('“') && t.add.endsWith('”'), `${t.tip} is quotable`);
    assert.ok(t.why.length > 15);
  }
  assert.match(PRO_TIPS.map((t) => t.add).join(' '), /clarifying questions/);
  assert.match(PRO_TIPS.map((t) => t.add).join(' '), /step-by-step/);
});

test('task report: input skeleton, five sections, three statuses', () => {
  assert.match(TASK_REPORT_INPUT, /Approval Request/);
  assert.match(TASK_REPORT_INPUT, /Next Steps/);
  assert.deepEqual(TASK_REPORT_SECTIONS.map((s) => s.section), [
    'Executive Summary', 'Tasks Performed', 'Blockers & Dependencies', 'Approval Request', 'Next Steps',
  ]);
  TASK_REPORT_SECTIONS.forEach((s) => {
    assert.notEqual(s.strong, s.weak, `${s.section} strong differs from weak`);
    assert.ok(s.strong.length > 10);
  });
  assert.deepEqual(TASK_STATUS.map((s) => s.id), ['done', 'wip', 'blocked']);
  SAMPLE_TASKS.forEach((t) => assert.ok(TASK_STATUS.some((s) => s.id === t.status)));
  assert.match(TASK_QUICK, /Approval Needed/);
});

test('token totals: 50k in, 40k out, cost from rates', () => {
  assert.equal(RATE_IN_PER_M, 2);
  assert.equal(RATE_OUT_PER_M, 1);
  assert.deepEqual(TOKEN_ROWS.map((r) => r.task), ['Data preprocessing', 'Draft generation', 'Revision & refinement']);
  const t = tokenTotals();
  assert.equal(t.input, 50000);
  assert.equal(t.output, 40000);
  assert.equal(t.total, 90000);
  assert.equal(t.cost, 0.14);
  const empty = tokenTotals([]);
  assert.equal(empty.total, 0);
  assert.match(TOKEN_REPORT_INPUT, /BUDGET/);
  assert.match(TOKEN_QUICK, /Approval Needed/);
  assert.equal(EFFICIENCY_NOTES.length, 2);
  assert.ok(EFFICIENCY_NOTES.some((n) => n.kind === 'positive'));
  assert.ok(EFFICIENCY_NOTES.some((n) => n.kind === 'observation'));
});

test('budget verdicts flip across within / tight / over', () => {
  assert.equal(budgetState(90000, 100000).verdict, 'tight');
  assert.equal(budgetState(90000, 100000).pct, 90);
  assert.equal(budgetState(90000, 120000).verdict, 'within');
  assert.equal(budgetState(90000, 85000).verdict, 'over');
  assert.equal(budgetState(90000, 85000).remaining, -5000);
  assert.equal(budgetState(50000, 50000).pct, 100);
  assert.throws(() => budgetState(10, 0), /positive/);
});

test('alignment protocols: four families with closings', () => {
  assert.deepEqual(ALIGNMENT_PROTOCOLS.map((p) => p.id), ['universal', 'precheck', 'creative', 'oneliner']);
  const universal = ALIGNMENT_PROTOCOLS.find((p) => p.id === 'universal');
  assert.equal(universal.steps.length, 4);
  assert.ok(universal.closing.startsWith('“'));
  assert.equal(ALIGNMENT_PROTOCOLS.find((p) => p.id === 'oneliner').steps.length, 1);
  assert.ok(ALIGNMENT_PROTOCOLS.find((p) => p.id === 'precheck').closing.includes('multiple-choice'));
  assert.equal(WHY_ALIGNMENT.length, 3);
  assert.ok(WHY_ALIGNMENT.some((w) => w.detail.includes('2,000') || w.detail.includes('2000') || /20×/.test(w.detail) || w.detail.includes('20×')));
});

test('two-phase prompt and background-task aggregate', () => {
  assert.match(TWO_PHASE_INPUT, /PHASE 1/);
  assert.match(TWO_PHASE_INPUT, /PHASE 2/);
  assert.match(TWO_PHASE_INPUT, /STRICT CONSTRAINT/);
  assert.match(TWO_PHASE_INPUT, /sub-task/);
  assert.match(TWO_PHASE_INPUT, /“Approved”|Approved/);
  const agg = aggregateTasks();
  assert.equal(agg.total, 109250);
  assert.equal(agg.count, 6);
  assert.equal(agg.wasted, 3200);
  assert.deepEqual(agg.byStatus, { running: 2, completed: 2, failed: 1, passed: 1 });
  assert.equal(aggregateTasks([]).total, 0);
  BG_TASKS.forEach((r) => assert.ok(STATUS_LABELS[r.status], 'every fixture status labeled'));
  assert.equal(COMPLIANCE_NOTES.length, 3);
  assert.ok(COMPLIANCE_NOTES.some((n) => n.note.includes('aggregate')));
});

test('content carries no URLs, authors, or brand names', () => {
  const blobs = [TASK_REPORT_INPUT, TOKEN_REPORT_INPUT, TWO_PHASE_INPUT, TASK_QUICK, TOKEN_QUICK,
    ...UNIVERSAL_BLOCKS.flatMap((b) => Object.values(b)),
    ...TASK_REPORT_SECTIONS.flatMap((s) => Object.values(s)),
    ...ALIGNMENT_PROTOCOLS.flatMap((p) => [p.name, p.when, p.closing, ...p.steps]),
    ...PRO_TIPS.flatMap((t) => Object.values(t)),
    ...SAMPLE_TASKS.map((t) => t.outcome), ...BG_TASKS.map((r) => r.id)];
  for (const b of blobs) {
    if (typeof b !== 'string') continue;
    assert.ok(!/https?:\/\//.test(b), `no URLs: ${b.slice(0, 50)}`);
    assert.ok(!/\b(jira|confluence|openai|anthropic|chatgpt|claude|cursor|github|copilot|slack)\b/i.test(b), `no brands: ${b.slice(0, 50)}`);
  }
});
