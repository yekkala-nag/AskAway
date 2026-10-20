import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ROUNDS,
  CODING_AXES,
  CONVERSATION_LADDER,
  HINT_LADDER,
  BUG_RULES,
  PRACTICE_DRILLS,
  TOPIC_FOCUS,
  AI_ROUND,
  AI_PRACTICE,
  DESIGN_DRIVERS,
  PUSH_PULL,
  SUCCESS_LADDER,
  BEHAVIORAL_PROBES,
  STAR_FIELDS,
  SENIOR_STORY_CHECKS,
  BLUFF_LADDER,
  WINNER_TRAITS,
  RECRUITER_USES,
  ROUND_CODE,
  BLUF_TEMPLATE,
} from '../src/interviewMindset/interviewMindsetEngine.js';

test('four rounds: two hire gates, two level signals, minutes sum sensibly', () => {
  assert.equal(ROUNDS.length, 4);
  assert.deepEqual(ROUNDS.map((r) => r.id), ['coding', 'ai', 'design', 'behavioral']);
  assert.equal(ROUNDS.filter((r) => r.answers.startsWith('Should')).length, 2);
  assert.equal(ROUNDS.filter((r) => r.answers.startsWith('At')).length, 2);
  for (const r of ROUNDS) {
    assert.ok(r.minutes >= 40 && r.minutes <= 60, `${r.id} length`);
    assert.ok(r.key.length > 10);
  }
  assert.equal(ROUNDS.find((r) => r.id === 'ai').minutes, 60);
});

test('coding axes: four, and only one is the code itself', () => {
  assert.deepEqual(CODING_AXES.map((a) => a.id), ['code', 'comm', 'solve', 'verify']);
  assert.equal(CODING_AXES.length, 4);
  CODING_AXES.forEach((a) => {
    assert.ok(a.asks.endsWith('?'), `${a.id} asks a real question`);
    assert.ok(a.fail.length > 15);
  });
});

test('conversation ladder: clarify through verify, in order', () => {
  assert.equal(CONVERSATION_LADDER.length, 5);
  assert.deepEqual(CONVERSATION_LADDER.map((s) => s.n), [1, 2, 3, 4, 5]);
  assert.equal(CONVERSATION_LADDER[0].step, 'Clarify');
  assert.equal(CONVERSATION_LADDER[4].step, 'Verify');
});

test('hint ladder: defending or ignoring fails, noticing wins', () => {
  assert.equal(HINT_LADDER.length, 3);
  assert.equal(HINT_LADDER.filter((h) => h.outcome === 'pass').length, 1);
  assert.equal(HINT_LADDER.find((h) => h.outcome === 'pass').response, 'Notice, confirm, then pivot');
  HINT_LADDER.forEach((h) => assert.ok(h.why.length > 20));
});

test('bug rules: not automatic fails, but cannot ship buggy', () => {
  assert.ok(BUG_RULES.length >= 4);
  assert.ok(BUG_RULES.some((b) => b.rule.includes('not automatic fails')));
  assert.ok(BUG_RULES.some((b) => b.rule.includes('cannot leave it buggy')));
  assert.ok(ROUND_CODE.includes('Name the bug') && ROUND_CODE.includes('verification axis'));
});

test('practice drills, topics, and AI round content', () => {
  assert.equal(PRACTICE_DRILLS.length, 4);
  assert.ok(PRACTICE_DRILLS.some((d) => d.drill.includes('Record')));
  assert.deepEqual(TOPIC_FOCUS.map((t) => t.topic), ['Iteration', 'Sorting', 'Divide & conquer', 'Recursion']);
  assert.equal(AI_ROUND.length, 5);
  assert.ok(AI_ROUND.some((a) => a.detail.includes('unit tests')));
  assert.ok(AI_ROUND.some((a) => a.detail.includes('in-house')));
  assert.equal(AI_PRACTICE.length, 4);
  assert.ok(AI_PRACTICE.some((p) => p.habit.includes('practice environment')));
});

test('design drivers and trade-off table', () => {
  assert.equal(DESIGN_DRIVERS.length, 5);
  assert.equal(DESIGN_DRIVERS[0].move, 'Ask what is required');
  assert.ok(DESIGN_DRIVERS[4].detail.includes('did it again'));
  assert.deepEqual(PUSH_PULL.map((p) => p.axis), ['Push updates', 'Pull updates']);
  PUSH_PULL.forEach((p) => assert.ok(p.tell.startsWith('Say why')));
});

test('behavioral: STAR fields, probes, success ladder, bluff grades', () => {
  assert.deepEqual(STAR_FIELDS.map((f) => f.field), ['Situation', 'Task', 'Action', 'Result']);
  STAR_FIELDS.forEach((f) => {
    assert.ok(f.strong.length > f.weak.length - 20, `${f.field} has a strong sample`);
  });
  assert.equal(BEHAVIORAL_PROBES.length, 5);
  assert.equal(SUCCESS_LADDER.length, 5);
  assert.ok(SUCCESS_LADDER[0].answer.includes('learned'));
  assert.equal(BLUFF_LADDER.map((b) => b.grade).filter((g) => g === 'green').length, 1);
  assert.match(BLUFF_LADDER.find((b) => b.grade === 'green').move, /reason/i);
  assert.match(BLUFF_LADDER.find((b) => b.grade === 'red').why, /hint/);
});

test('winner traits, senior checks, recruiter asks, templates', () => {
  assert.equal(WINNER_TRAITS.length, 4);
  assert.ok(WINNER_TRAITS.some((w) => /hint|help/i.test(w.trait + w.detail)));
  assert.ok(WINNER_TRAITS.some((w) => w.trait.includes('mistakes')));
  assert.equal(SENIOR_STORY_CHECKS.length, 4);
  assert.ok(SENIOR_STORY_CHECKS.some((c) => c.check.includes('consequences')));
  assert.equal(RECRUITER_USES.length, 4);
  assert.ok(BLUF_TEMPLATE.includes('clarifying question') || BLUF_TEMPLATE.includes('Clarifying'));
});

test('content carries no URLs, authors, or company names', () => {
  const blobs = [ROUND_CODE, BLUF_TEMPLATE,
    ...ROUNDS.flatMap((r) => Object.values(r)),
    ...CODING_AXES.flatMap((r) => Object.values(r)),
    ...AI_ROUND.flatMap((r) => Object.values(r)),
    ...STAR_FIELDS.flatMap((r) => Object.values(r)),
    ...BLUFF_LADDER.flatMap((r) => Object.values(r)),
    ...SUCCESS_LADDER.flatMap((r) => Object.values(r))];
  for (const b of blobs) {
    if (typeof b !== 'string') continue;
    assert.ok(!/https?:\/\//.test(b), `no URLs: ${b.slice(0, 50)}`);
    assert.ok(!/\b(meta|facebook|jean lee|youtube|substack|chatgpt|claude|codex)\b/i.test(b), `no attribution: ${b.slice(0, 50)}`);
  }
});
