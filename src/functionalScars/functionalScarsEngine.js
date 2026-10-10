// ============================================================================
// FUNCTIONAL SCARS ENGINE — corrections that sit on the action path
// Data + pure functions only. No JSX, no window/document. Node-importable.
// Teaching examples with plausible illustrative numbers (not copied stats).
// ============================================================================

export const PALETTE = {
  TEAL: '#3A9B9F',
  TEAL_DARK: '#1A6B6E',
  PURPLE: '#5B4B8A',
  RED: '#B4553A',
  AMBER: '#B9821F',
};

// ─── 1. Corrections need four layers ─────────────────────────────────────────

export const FOUR_LAYERS = [
  {
    id: 'record',
    step: 1,
    name: 'Record',
    question: 'Where does the correction live?',
    mechanism: 'A written note: the fix, the trigger, and one example.',
    onActionPath: false,
    failureMode: 'A note nobody re-opens is a diary entry, not a control.',
  },
  {
    id: 'refind',
    step: 2,
    name: 'Re-find',
    question: 'Can the agent surface it when it matters?',
    mechanism: 'Retrieval: the note is fetched for matching tasks.',
    onActionPath: false,
    failureMode: 'Retrieved too late, or ranked below the stale habit.',
  },
  {
    id: 'read',
    step: 3,
    name: 'Read',
    question: 'Does the agent load it into context?',
    mechanism: 'The correction is injected as a prompt hint or reminder.',
    onActionPath: false,
    failureMode: 'Read but ignorable: context hints lose to momentum.',
  },
  {
    id: 'apply',
    step: 4,
    name: 'Apply',
    question: 'Does anything stop the wrong action?',
    mechanism: 'An enforcement hook on the action path that can deny the call.',
    onActionPath: true,
    failureMode: 'Without this layer, layers 1-3 are advisory only.',
  },
];

export function layersOnActionPath() {
  return FOUR_LAYERS.filter((l) => l.onActionPath).map((l) => l.id);
}

// ─── Intervention-strength ladder ────────────────────────────────────────────

export const INTERVENTION_LEVELS = [
  {
    id: 'context-hint',
    label: 'Context hint',
    strength: 1,
    blockRate: 0.18,
    falsePositiveRate: 0.02,
    latencyMs: 0,
    note: 'A reminder in the prompt. Zero friction, easy to steamroll.',
  },
  {
    id: 'pre-call-denial',
    label: 'Pre-call denial',
    strength: 2,
    blockRate: 0.94,
    falsePositiveRate: 0.09,
    latencyMs: 40,
    note: 'A hook inspects the call before it runs and can refuse it.',
  },
  {
    id: 'post-call-check',
    label: 'Post-call check',
    strength: 3,
    blockRate: 0.61,
    falsePositiveRate: 0.05,
    latencyMs: 320,
    note: 'A reviewer audits the result after the fact. Damage may be done.',
  },
];

export function getInterventionStats(levelId) {
  return INTERVENTION_LEVELS.find((l) => l.id === levelId) || null;
}

// Net benefit sketch: blocked bad actions minus weighted false-positive cost.
export function tradeoffScore(levelId) {
  const s = getInterventionStats(levelId);
  if (!s) return null;
  return s.blockRate - 3 * s.falsePositiveRate;
}

// ─── 2. Measure before / after ───────────────────────────────────────────────

export const ENFORCEMENT_CASES = [
  {
    id: 'heredoc-writes',
    label: 'Heredoc-style writes',
    mechanism: 'Pre-call denial on the shell-write pattern',
    before: 6.7,
    after: 0.8,
    unit: '% of assisted sessions with a stray write',
  },
  {
    id: 'quoting-rule',
    label: 'Quoting-rule mechanism check',
    mechanism: 'Parser checks the quoting mechanism inside any command',
    before: 4.9,
    after: 1.1,
    unit: '% of commands with an unsafe expansion',
  },
  {
    id: 'reminder-hooks',
    label: 'Reminder-only hooks',
    mechanism: 'Passive note with no enforcement (open rate 12%)',
    before: 5.4,
    after: 4.6,
    unit: '% of sessions repeating the mistake',
  },
];

export function reductionPercent(before, after) {
  if (before === 0) return 0;
  return ((before - after) / before) * 100;
}

export function enforcementSummary(caseId) {
  const c = ENFORCEMENT_CASES.find((k) => k.id === caseId) || null;
  if (!c) return null;
  return { ...c, reduction: reductionPercent(c.before, c.after) };
}

export const MECHANISM_LESSON =
  'Check the mechanism inside any command, not a command allowlist. ' +
  'An allowlist asks "is this command permitted?" while a mechanism check asks ' +
  '"does this command carry the risky pattern, whoever invoked it?".';

// ─── 3. Scar contract builder ────────────────────────────────────────────────

export const SCAR_FIELDS = [
  { key: 'id', label: 'id', hint: 'slug, e.g. scar-heredoc-guard' },
  { key: 'name', label: 'name', hint: 'human title, e.g. Heredoc write guard' },
  { key: 'rule', label: 'rule', hint: 'substring pattern matched in the command' },
  { key: 'severity', label: 'severity', hint: 'advisory | low | medium | high | critical' },
  { key: 'event', label: 'event', hint: 'PreToolUse | PostToolUse' },
  { key: 'toolMatcher', label: 'tool-matcher', hint: 'Bash | Write | Edit | *' },
];

export const SEVERITIES = ['advisory', 'low', 'medium', 'high', 'critical'];
export const SCAR_EVENTS = ['PreToolUse', 'PostToolUse'];
export const TOOL_MATCHERS = ['Bash', 'Write', 'Edit', '*'];

export const DEFAULT_SCAR = {
  id: 'scar-heredoc-guard',
  name: 'Heredoc write guard',
  rule: '<<',
  severity: 'high',
  event: 'PreToolUse',
  toolMatcher: 'Bash',
};

export function buildScar(input) {
  const errors = [];
  const scar = {
    id: (input.id || '').trim(),
    name: (input.name || '').trim(),
    rule: input.rule ?? '',
    severity: input.severity || '',
    event: input.event || '',
    toolMatcher: input.toolMatcher || '',
    version: 1,
  };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(scar.id)) {
    errors.push('id must be a lowercase slug like scar-heredoc-guard');
  }
  if (!scar.name) errors.push('name is required');
  if (!scar.rule) errors.push('rule is required');
  if (!SEVERITIES.includes(scar.severity)) {
    errors.push('severity must be one of ' + SEVERITIES.join(', '));
  }
  if (!SCAR_EVENTS.includes(scar.event)) {
    errors.push('event must be one of ' + SCAR_EVENTS.join(', '));
  }
  if (!scar.toolMatcher) errors.push('tool-matcher is required');
  return { scar, errors };
}

export function generateScarJSON(scar) {
  return JSON.stringify(scar, null, 2);
}

// Exit-code semantics: BLOCK -> 2 (denied by policy), PASS -> 0 (allowed).
export function evaluateScar(scar, command, toolName = 'Bash') {
  const cmd = command || '';
  if (!scar || !scar.rule) {
    return { verdict: 'PASS', exitCode: 0, matched: false, reason: 'empty-rule' };
  }
  if (scar.toolMatcher && scar.toolMatcher !== '*' && toolName !== scar.toolMatcher) {
    return { verdict: 'PASS', exitCode: 0, matched: false, reason: 'tool-matcher-miss' };
  }
  if (cmd.includes(scar.rule)) {
    return { verdict: 'BLOCK', exitCode: 2, matched: true, reason: 'rule-match' };
  }
  return { verdict: 'PASS', exitCode: 0, matched: false, reason: 'no-match' };
}

export const SAMPLE_COMMANDS = [
  { id: 's1', tool: 'Bash', command: "cat <<'EOF' > notes.txt\nhello\nEOF" },
  { id: 's2', tool: 'Bash', command: 'cat <<EOF > deploy.sh\necho hi\nEOF' },
  { id: 's3', tool: 'Bash', command: "printf '%s\\n' 'hello' > out.txt" },
  { id: 's4', tool: 'Bash', command: 'echo hello > log.txt' },
  { id: 's5', tool: 'Bash', command: 'git status --short' },
];

export function fireScarAgainstSamples(scar, commands = SAMPLE_COMMANDS) {
  return commands.map((c) => ({
    ...c,
    ...evaluateScar(scar, c.command, c.tool),
  }));
}

// ─── 4. Scope limits ─────────────────────────────────────────────────────────

export const SCOPE_LIMITS = [
  {
    id: 'novel-mistakes',
    limit: 'Scars cannot catch mistakes nobody has made yet.',
    practice: 'Pair each scar with a review queue for first-seen failures.',
  },
  {
    id: 'retirement',
    limit: 'Scars rot: tools and habits change under them.',
    practice: 'Every scar ships with a retirement date and an owner.',
  },
  {
    id: 'advisory-drift',
    limit: 'Advisory scars decay into background noise.',
    practice: 'Promote repeated advisories to denials, or retire them.',
  },
];

export const NON_CLAIMS = [
  'A scar is not a proof of safety.',
  'A scar does not cover novel failure modes.',
  'A passing scar suite does not mean the agent understood the rule.',
];

export function isScarExpired(createdAtIso, nowIso, ttlDays = 45) {
  const created = Date.parse(createdAtIso);
  const now = Date.parse(nowIso);
  if (Number.isNaN(created) || Number.isNaN(now)) return false;
  return now - created > ttlDays * 24 * 60 * 60 * 1000;
}

export function suggestRetirementDays(severity) {
  const map = { advisory: 90, low: 90, medium: 60, high: 45, critical: 30 };
  return map[severity] ?? 45;
}

// ─── Quoting-parser semantics (testable mini-table) ──────────────────────────

export function classifyHeredoc(command) {
  const cmd = command || '';
  if (!cmd.includes('<<')) return 'no-heredoc';
  if (/<<\s*['"]/.test(cmd)) return 'quoted-heredoc';
  return 'unquoted-heredoc';
}

export const QUOTING_SEMANTICS = [
  {
    case: 'Quoted delimiter',
    example: "cat <<'EOF'",
    mechanism: 'Delimiter is quoted: body is literal, no expansion.',
    outcome: 'safe',
  },
  {
    case: 'Bare delimiter',
    example: 'cat <<EOF',
    mechanism: 'Delimiter is bare: body expands variables and commands.',
    outcome: 'risky',
  },
  {
    case: 'No heredoc',
    example: "printf '%s' 'hi'",
    mechanism: 'No heredoc operator present in the command.',
    outcome: 'safe',
  },
  {
    case: 'Denied pattern',
    example: 'any command matching the scar rule',
    mechanism: 'Scar rule matches: pre-call denial fires first.',
    outcome: 'blocked',
  },
];

// Sample hook sketch kept free of template interpolation so it stays
// safe inside JS template literals in UI code.
export const HOOK_SKETCH = [
  '# Pre-call hook sketch (illustrative, generic coding-assistant hooks)',
  '# event: PreToolUse | tool-matcher: Bash',
  '# if the scar rule appears in the command: exit 2 (BLOCK)',
  '# otherwise: exit 0 (PASS)',
  'rule="<<"',
  'case "$COMMAND" in',
  '  *"$rule"*) exit 2 ;;',
  '  *) exit 0 ;;',
  'esac',
].join('\n');
