import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BRIDGE_STRATEGIES,
  GAP_FRAMES,
  FINANCE_PLAYBOOK,
  GUARDRAIL_RULES,
  VERIFIABLE_TASKS,
  LEDGER_ROWS,
  BANK_ROWS,
  parseDate,
  dayDiff,
  descriptionOverlap,
  reconcile,
  timeSaved,
  RECON_PROMPT,
  RED_TEAM_TEXT,
  RED_TEAM_PROMPTS,
  ANTI_HYPE_MOVES,
  BLOCKERS,
  OUTCOME_FRAMING,
  MICRO_WIN_QUESTIONS,
} from '../src/aiGap/aiGapEngine.js';

test('five bridge strategies, each with trap and action', () => {
  assert.equal(BRIDGE_STRATEGIES.length, 5);
  assert.deepEqual(BRIDGE_STRATEGIES.map((s) => s.n), [1, 2, 3, 4, 5]);
  for (const s of BRIDGE_STRATEGIES) {
    assert.ok(s.name.length > 4);
    assert.ok(s.trap.length > 15, `${s.name} names a real trap`);
    assert.ok(s.action.length > 25, `${s.name} has a real action`);
  }
  assert.equal(GAP_FRAMES.length, 2);
  assert.ok(GAP_FRAMES.every((g) => g.basis.length > 10));
});

test('finance playbook and guardrails', () => {
  assert.equal(FINANCE_PLAYBOOK.length, 5);
  FINANCE_PLAYBOOK.forEach((p) => {
    assert.ok(p.action.length > 30, `${p.name} actionable`);
    assert.ok(p.payoff.length > 15);
  });
  assert.equal(GUARDRAIL_RULES.length, 3);
  assert.ok(GUARDRAIL_RULES.some((g) => /non-public/i.test(g.rule + g.detail)), 'MNPI rule present');
  assert.ok(GUARDRAIL_RULES.some((g) => /human-in-the-loop/i.test(g.rule)));
  assert.ok(GUARDRAIL_RULES.some((g) => /training/i.test(g.detail)), 'no-training tooling rule');
  assert.ok(VERIFIABLE_TASKS.length >= 5);
  VERIFIABLE_TASKS.forEach((t) => assert.ok(t.why.length > 10));
});

test('date parsing and day math across both formats', () => {
  assert.equal(dayDiff('2026-10-15', '10/15/26'), 0);
  assert.equal(dayDiff('2026-10-16', '10/17/26'), 1);
  assert.equal(dayDiff('2026-10-18', '10/20/26'), 2);
  assert.equal(dayDiff('10/21/26', '2026-10-19'), 2);
  assert.throws(() => parseDate('October 21'), /unparseable/);
});

test('description overlap scores shared tokens', () => {
  assert.ok(descriptionOverlap('WIRE OUT GLOBAL VENDORS', 'WIRE OUT GLOBAL VEND') >= 0.7);
  assert.ok(descriptionOverlap('CLOUDHOST WEB SERVICES', 'CLOUDHOST*BILLING') >= 0.4);
  assert.equal(descriptionOverlap('ALPHA', 'BETA'), 0);
  assert.equal(descriptionOverlap('', 'BETA'), 0);
});

test('default reconcile: 5 matched with reasons, fee alone in exceptions', () => {
  const r = reconcile();
  assert.equal(r.reconciled.length, 5);
  assert.equal(r.exceptions.length, 1);
  const fee = r.exceptions[0];
  assert.equal(fee.desc, 'UNKNOWN FEE');
  assert.match(fee.reason, /No corresponding entry/);
  for (const row of r.reconciled) {
    assert.ok(row.reason.length > 5, 'every match carries a reason');
    assert.match(row.reason, /exact amount|tolerance/);
    assert.match(row.reason, /same date|within \d+ day/);
  }
  assert.ok(r.reconciled.some((x) => x.reason.includes('description overlap')));
});

test('date tolerance 0 splits the two late-post pairs into exceptions', () => {
  const r = reconcile({ dateTol: 0 });
  assert.equal(r.reconciled.length, 3, 'only same-day pairs survive');
  assert.equal(r.exceptions.length, 5, 'fee + 2 unmatched ledger + 2 unmatched bank');
  const sources = r.exceptions.map((e) => e.source);
  assert.equal(sources.filter((s) => s === 'Ledger').length, 2);
  assert.equal(sources.filter((s) => s === 'Bank').length, 3);
  assert.ok(r.exceptions.some((e) => e.reason.includes('within tolerances')));
});

test('amount tolerance vs simulated rounding noise', () => {
  assert.equal(reconcile({ noiseCents: 3 }).reconciled.length, 5, '3¢ inside the 5¢ default');
  const strict = reconcile({ amountTol: 0.01, noiseCents: 3 });
  assert.equal(strict.reconciled.length, 0, '3¢ busts a 1¢ tolerance on every row');
  assert.equal(strict.exceptions.length, LEDGER_ROWS.length + BANK_ROWS.length);
  assert.equal(reconcile({ amountTol: 1 }).reconciled.length, 5);
});

test('time saved math', () => {
  const s = timeSaved(45, 5);
  assert.equal(s.manualSec, 2700);
  assert.equal(s.speedup, 540);
  assert.equal(s.savedMinutes, 45, 'rounds 44.92 min up');
  const d = timeSaved(17, 10);
  assert.equal(d.speedup, 102);
  assert.throws(() => timeSaved(10, 0), /aiSeconds/);
});

test('prompt block and red-team verdicts', () => {
  assert.match(RECON_PROMPT, /Do not estimate/);
  assert.match(RECON_PROMPT, /Manual Review Required/);
  assert.ok(RED_TEAM_TEXT.includes('Section 3') && RED_TEAM_TEXT.includes('Section 7'));
  assert.equal(RED_TEAM_PROMPTS.length, 3);
  assert.deepEqual(
    RED_TEAM_PROMPTS.map((p) => p.verdict).sort(),
    ['fail', 'pass', 'warn'],
  );
  assert.match(RED_TEAM_PROMPTS.find((p) => p.verdict === 'pass').result, /Information not present/);
  RED_TEAM_PROMPTS.forEach((p) => {
    assert.ok(p.result.length > 30);
    assert.ok(p.lesson.length > 20);
  });
});

test('anti-hype moves, blockers, framing, micro-wins', () => {
  assert.equal(ANTI_HYPE_MOVES.length, 4);
  assert.ok(ANTI_HYPE_MOVES.some((m) => m.name.includes('Ban the word')));
  assert.equal(BLOCKERS.length, 3);
  assert.ok(BLOCKERS.every((b) => b.valid === true && b.realFix.length > 20));
  assert.equal(OUTCOME_FRAMING.length, 3);
  OUTCOME_FRAMING.forEach((f) => {
    assert.ok(f.before.startsWith('“'));
    assert.ok(f.after.startsWith('“'));
    assert.notEqual(f.before, f.after);
  });
  assert.ok(MICRO_WIN_QUESTIONS.length >= 2);
});

test('content carries no URLs, authors, or brand names', () => {
  const blobs = [RECON_PROMPT, RED_TEAM_TEXT,
    ...BRIDGE_STRATEGIES.flatMap((r) => Object.values(r)),
    ...FINANCE_PLAYBOOK.flatMap((r) => Object.values(r)),
    ...GUARDRAIL_RULES.flatMap((r) => Object.values(r)),
    ...VERIFIABLE_TASKS.flatMap((r) => Object.values(r)),
    ...LEDGER_ROWS.map((r) => r.desc), ...BANK_ROWS.map((r) => r.desc),
    ...RED_TEAM_PROMPTS.flatMap((r) => Object.values(r)),
    ...ANTI_HYPE_MOVES.flatMap((r) => Object.values(r)),
    ...OUTCOME_FRAMING.flatMap((r) => Object.values(r))];
  for (const b of blobs) {
    if (typeof b !== 'string') continue;
    assert.ok(!/https?:\/\//.test(b), `no URLs: ${b.slice(0, 50)}`);
    assert.ok(!/\b(cursor|copilot|claude|karpathy|youtube|netsuite|quickbooks|sap|aws|paypal|staples|anthropic|openai)\b/i.test(b), `no brands: ${b.slice(0, 50)}`);
  }
});
