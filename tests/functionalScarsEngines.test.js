import test from 'node:test';
import assert from 'node:assert/strict';

import {
  FOUR_LAYERS,
  layersOnActionPath,
  INTERVENTION_LEVELS,
  getInterventionStats,
  tradeoffScore,
  ENFORCEMENT_CASES,
  reductionPercent,
  enforcementSummary,
  SCAR_FIELDS,
  DEFAULT_SCAR,
  buildScar,
  generateScarJSON,
  evaluateScar,
  SAMPLE_COMMANDS,
  fireScarAgainstSamples,
  classifyHeredoc,
  QUOTING_SEMANTICS,
  SCOPE_LIMITS,
  NON_CLAIMS,
  isScarExpired,
  suggestRetirementDays,
} from '../src/functionalScars/functionalScarsEngine.js';

test('four layers: record, re-find, read, apply — only apply is on the action path', () => {
  assert.equal(FOUR_LAYERS.length, 4);
  assert.deepEqual(FOUR_LAYERS.map((l) => l.id), ['record', 'refind', 'read', 'apply']);
  assert.deepEqual(layersOnActionPath(), ['apply']);
  assert.equal(FOUR_LAYERS.filter((l) => l.onActionPath).length, 1);
});

test('intervention ladder: pre-call denial blocks most at highest false-positive cost', () => {
  assert.equal(INTERVENTION_LEVELS.length, 3);
  const hint = getInterventionStats('context-hint');
  const deny = getInterventionStats('pre-call-denial');
  const post = getInterventionStats('post-call-check');
  assert.equal(hint.blockRate, 0.18);
  assert.equal(deny.blockRate, 0.94);
  assert.equal(post.blockRate, 0.61);
  assert.ok(deny.blockRate > post.blockRate && post.blockRate > hint.blockRate);
  assert.ok(deny.falsePositiveRate > post.falsePositiveRate);
  assert.equal(getInterventionStats('nope'), null);
});

test('tradeoff score is blockRate minus 3x false-positive rate', () => {
  assert.equal(tradeoffScore('pre-call-denial'), 0.94 - 3 * 0.09);
  assert.equal(tradeoffScore('context-hint'), 0.18 - 3 * 0.02);
  assert.equal(tradeoffScore('missing'), null);
});

test('enforcement cases: exact before/after rates with heredoc 6.7 -> 0.8', () => {
  assert.equal(ENFORCEMENT_CASES.length, 3);
  const h = ENFORCEMENT_CASES.find((c) => c.id === 'heredoc-writes');
  assert.equal(h.before, 6.7);
  assert.equal(h.after, 0.8);
  const r = reductionPercent(6.7, 0.8);
  assert.ok(Math.abs(r - 88.05970149253731) < 1e-9);
  assert.equal(reductionPercent(0, 0), 0);
});

test('enforcement summary attaches the reduction', () => {
  const s = enforcementSummary('quoting-rule');
  assert.equal(s.before, 4.9);
  assert.equal(s.after, 1.1);
  assert.ok(Math.abs(s.reduction - reductionPercent(4.9, 1.1)) < 1e-12);
  assert.equal(enforcementSummary('missing'), null);
});

test('scar contract has six fields and a valid default scar', () => {
  assert.deepEqual(SCAR_FIELDS.map((f) => f.key), ['id', 'name', 'rule', 'severity', 'event', 'toolMatcher']);
  const { scar, errors } = buildScar(DEFAULT_SCAR);
  assert.deepEqual(errors, []);
  assert.equal(scar.version, 1);
  const json = generateScarJSON(scar);
  assert.deepEqual(JSON.parse(json), scar);
});

test('buildScar rejects bad slugs, severities, and events', () => {
  const bad = buildScar({ id: 'Bad ID!', name: '', rule: '', severity: 'mega', event: 'Whenever', toolMatcher: '' });
  assert.ok(bad.errors.length >= 5);
  assert.ok(bad.errors.some((e) => e.includes('slug')));
  assert.ok(bad.errors.some((e) => e.includes('severity')));
  assert.ok(bad.errors.some((e) => e.includes('event')));
});

test('evaluateScar: BLOCK exits 2 on rule match, PASS exits 0 otherwise', () => {
  const { scar } = buildScar(DEFAULT_SCAR);
  const b = evaluateScar(scar, 'cat <<EOF > x.sh', 'Bash');
  assert.deepEqual(b, { verdict: 'BLOCK', exitCode: 2, matched: true, reason: 'rule-match' });
  const p = evaluateScar(scar, 'git status --short', 'Bash');
  assert.deepEqual(p, { verdict: 'PASS', exitCode: 0, matched: false, reason: 'no-match' });
  const miss = evaluateScar(scar, 'cat <<EOF > x.sh', 'Write');
  assert.equal(miss.reason, 'tool-matcher-miss');
  assert.equal(miss.exitCode, 0);
  const empty = evaluateScar({ ...scar, rule: '' }, 'anything', 'Bash');
  assert.equal(empty.reason, 'empty-rule');
});

test('sample suite: default scar blocks 2 of 5 samples', () => {
  assert.equal(SAMPLE_COMMANDS.length, 5);
  const { scar } = buildScar(DEFAULT_SCAR);
  const results = fireScarAgainstSamples(scar);
  assert.equal(results.filter((r) => r.verdict === 'BLOCK').length, 2);
  assert.equal(results.filter((r) => r.verdict === 'PASS').length, 3);
  for (const r of results) {
    assert.equal(r.exitCode, r.verdict === 'BLOCK' ? 2 : 0);
  }
  assert.equal(results[0].verdict, 'BLOCK');
  assert.equal(results[4].verdict, 'PASS');
});

test('classifyHeredoc distinguishes quoted, bare, and absent heredocs', () => {
  assert.equal(classifyHeredoc("cat <<'EOF' > notes.txt"), 'quoted-heredoc');
  assert.equal(classifyHeredoc('cat <<EOF > deploy.sh'), 'unquoted-heredoc');
  assert.equal(classifyHeredoc("printf '%s' 'hi'"), 'no-heredoc');
  assert.equal(classifyHeredoc(''), 'no-heredoc');
  assert.equal(QUOTING_SEMANTICS.length, 4);
});

test('scope limits: retirement dates and honest non-claims', () => {
  assert.equal(SCOPE_LIMITS.length, 3);
  assert.ok(NON_CLAIMS.length >= 3);
  assert.equal(suggestRetirementDays('high'), 45);
  assert.equal(suggestRetirementDays('critical'), 30);
  assert.equal(suggestRetirementDays('unknown-sev'), 45);
  assert.equal(isScarExpired('2026-01-01', '2026-03-01', 45), true);
  assert.equal(isScarExpired('2026-01-01', '2026-01-10', 45), false);
  assert.equal(isScarExpired('not-a-date', '2026-01-10'), false);
});
