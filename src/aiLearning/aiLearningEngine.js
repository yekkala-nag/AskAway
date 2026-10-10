// ============================================================================
// AI LEARNING ENGINE — learn faster with voice exploration, reusable skills,
// spaced repetition + active recall, and triage-first planning.
// Data + pure functions only. No JSX / window / document.
// ============================================================================

export const KNOWING_PHASES = [
  {
    id: 'unknown-unknowns',
    index: 0,
    name: 'Unknown unknowns',
    tagline: 'You do not know what you are missing.',
    signal: 'Vague curiosity, no vocabulary for the topic yet.',
    voiceMove: 'Talk out loud about what puzzles you; capture every half-formed question.',
  },
  {
    id: 'known-unknowns',
    index: 1,
    name: 'Known unknowns',
    tagline: 'You can name your gaps.',
    signal: 'A written list of questions you cannot answer yet.',
    voiceMove: 'Turn rambling into a question list, then rank it by usefulness.',
  },
  {
    id: 'known-knowns',
    index: 2,
    name: 'Known knowns',
    tagline: 'You can explain it without notes.',
    signal: 'Clean recall plus one worked example from memory.',
    voiceMove: 'Teach it back out loud; stumble points become the next drill set.',
  },
  {
    id: 'unknown-knowns',
    index: 3,
    name: 'Unknown knowns',
    tagline: 'Fluency you no longer notice.',
    signal: 'Fast, calm application under time pressure.',
    voiceMove: 'Narrate edge cases while solving; new blind spots restart the loop.',
  },
];

export const VOICE_EXPLORATION_STEPS = [
  { id: 'dump', title: 'Brain dump', detail: 'Speak for five minutes with no editing. Externalize half-formed thoughts before judging them.' },
  { id: 'cluster', title: 'Cluster', detail: 'Group the transcript into 3 to 5 themes. Name each theme in your own words.' },
  { id: 'questions', title: 'Question list', detail: 'Convert each theme into one question you cannot answer yet. That list is your roadmap.' },
  { id: 'roadmap', title: 'Roadmap', detail: 'Order questions by payoff: what unlocks the most understanding first?' },
  { id: 'drill', title: 'First drill', detail: 'Pick the top question and run one ten-minute focused session on it today.' },
];

export const SKILL_ANATOMY_FIELDS = [
  { id: 'purpose', label: 'Purpose', description: 'What job does this skill do, in one sentence?', placeholder: 'e.g. Collect the best resources on any topic' },
  { id: 'inputs', label: 'Inputs', description: 'What must be supplied before the skill can run?', placeholder: 'e.g. topic, level, time available' },
  { id: 'process', label: 'Process', description: 'The repeatable steps, in order.', placeholder: 'e.g. search, filter, rank, summarize' },
  { id: 'outputFormat', label: 'Output format', description: 'What the result looks like every time.', placeholder: 'e.g. ranked list with one-line verdicts' },
  { id: 'qualityChecks', label: 'Quality checks', description: 'How you verify the output before trusting it.', placeholder: 'e.g. two independent sources per item' },
];

export const EXAMPLE_SKILLS = [
  {
    id: 'resource-collector',
    name: 'Resource collector',
    purpose: 'Collect the best resources on any new topic',
    inputs: 'topic, learner level, minutes available',
    process: 'Gather candidates, drop outdated ones, rank by clarity, keep top five',
    outputFormat: 'Ranked list of five with one-line verdict each',
    qualityChecks: 'Every item has two independent confirmations',
    whenToUse: 'Use when topic, learner level, minutes available are available.',
    doNotUse: 'Do not use when Every item has two independent confirmations cannot be verified.',
  },
  {
    id: 'study-scheduler',
    name: 'Study scheduler',
    purpose: 'Turn a question list into a week of short sessions',
    inputs: 'question list, daily minutes, deadline',
    process: 'Order by payoff, split into 25-minute blocks, assign one recall check per block',
    outputFormat: 'Day-by-day plan with session goal and recall prompt',
    qualityChecks: 'Each session ends with a two-minute self-quiz',
    whenToUse: 'Use when question list, daily minutes, deadline are available.',
    doNotUse: 'Do not use when Each session ends with a two-minute self-quiz cannot be verified.',
  },
  {
    id: 'concept-comparer',
    name: 'Concept comparer',
    purpose: 'Separate two easily confused ideas',
    inputs: 'two concepts, one example each',
    process: 'Define each, contrast on three axes, test with a borderline case',
    outputFormat: 'Side-by-side table plus a one-paragraph verdict',
    qualityChecks: 'Borderline case is classified correctly from memory',
    whenToUse: 'Use when two concepts, one example each are available.',
    doNotUse: 'Do not use when Borderline case is classified correctly from memory cannot be verified.',
  },
];

export const REVIEW_INTERVAL_PRESETS = [
  { id: 'gentle', label: 'Gentle (1 · 3 · 7)', intervals: [1, 3, 7] },
  { id: 'steady', label: 'Steady (1 · 2 · 4 · 7 · 14)', intervals: [1, 2, 4, 7, 14] },
  { id: 'intensive', label: 'Intensive (1 · 2 · 4 · 7 · 14 · 30)', intervals: [1, 2, 4, 7, 14, 30] },
];

export const ATTENTION_FORMATS = [
  { id: 'commute', attention: 'Commute', minutes: '10–20', energy: 'Low', best: 'Listen + speak back one idea', avoid: 'Dense derivations' },
  { id: 'short-break', attention: 'Short break', minutes: '5–10', energy: 'Medium', best: 'One flash quiz (3 questions)', avoid: 'Starting new topics' },
  { id: 'focused', attention: 'Focused block', minutes: '25–50', energy: 'High', best: 'Worked examples + teach-back', avoid: 'Passive re-reading' },
  { id: 'tired-evening', attention: 'Tired evening', minutes: '10–15', energy: 'Low', best: 'Review wins + park list', avoid: 'New hard concepts' },
];

export const TRIAGE_DECISIONS = ['go-deep', 'park', 'revisit-with-evidence'];

export const DAILY_QUIZ_AUTOMATION = `// Daily active-recall quiz — questions first, answers after.
// Schedule this once per day with a small topic rotation.

const PLAN = {
  topic: 'insert-topic-here',
  questionsFirst: true,
  sessionsPerDay: 1,
  questionsPerSession: 3,
};

function runDailyQuiz(topic, ask, check) {
  const questions = buildQuestions(topic, PLAN.questionsPerSession);
  // 1. Answer from memory — no notes, no peeking.
  const attempts = questions.map(function (q) {
    return { question: q, answer: ask(q) };
  });
  // 2. Only now reveal references and grade.
  return attempts.map(function (a) {
    const verdict = check(a.question, a.answer);
    return { question: a.question, kept: verdict.kept, fix: verdict.fix };
  });
}

function buildQuestions(topic, n) {
  const bank = [
    'State the core idea of ' + topic + ' in two sentences.',
    'Give one worked example of ' + topic + ' from memory.',
    'Name one borderline case where ' + topic + ' does NOT apply.',
    'Explain ' + topic + ' as if teaching a newcomer.',
    'Predict what breaks first when ' + topic + ' is misapplied.',
  ];
  return bank.slice(0, n);
}

// Vary the focus daily so recall stays effortful:
// day 1 -> Recall | day 2 -> Apply | day 3 -> Teach-back | then repeat.
// Log misses with \${topic} and \${date} keys to schedule the next review.
`;

export function getPhaseById(id) {
  if (typeof id !== 'string') return null;
  const found = KNOWING_PHASES.find((p) => p.id === id);
  return found || null;
}

export function nextPhaseId(currentId) {
  const current = getPhaseById(currentId);
  if (!current) return null;
  const nextIndex = (current.index + 1) % KNOWING_PHASES.length;
  return KNOWING_PHASES[nextIndex].id;
}

function trimmed(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function buildSkill(fields) {
  const required = ['purpose', 'inputs', 'process', 'outputFormat', 'qualityChecks'];
  const source = fields && typeof fields === 'object' ? fields : {};
  const errors = required.filter((k) => !trimmed(source[k]));
  if (errors.length > 0) return { ok: false, errors };
  const clean = {
    purpose: trimmed(source.purpose),
    inputs: trimmed(source.inputs),
    process: trimmed(source.process),
    outputFormat: trimmed(source.outputFormat),
    qualityChecks: trimmed(source.qualityChecks),
  };
  return {
    ok: true,
    skill: {
      title: clean.purpose,
      inputs: clean.inputs,
      process: clean.process,
      outputFormat: clean.outputFormat,
      qualityChecks: clean.qualityChecks,
      whenToUse: 'Use when ' + clean.inputs + ' are available.',
      doNotUse: 'Do not use when ' + clean.qualityChecks + ' cannot be verified.',
      summary: clean.purpose + ' — ' + clean.process + ' → ' + clean.outputFormat + '.',
    },
  };
}

export function estimateRetention(intervals) {
  if (!Array.isArray(intervals) || intervals.length === 0) {
    return { ok: false, errors: ['intervals-required'] };
  }
  const valid = intervals.filter((n) => typeof n === 'number' && Number.isFinite(n) && n > 0);
  if (valid.length === 0) return { ok: false, errors: ['intervals-required'] };
  const sum = valid.reduce((a, b) => a + b, 0);
  const averageGap = Math.round((sum / valid.length) * 10) / 10;
  const raw = 28 + valid.length * 14 - averageGap * 0.8;
  const estimatedRetention = Math.max(5, Math.min(97, Math.round(raw)));
  let level = 'fading';
  if (estimatedRetention >= 85) level = 'strong';
  else if (estimatedRetention >= 65) level = 'steady';
  else if (estimatedRetention >= 45) level = 'fragile';
  return { ok: true, reviews: valid.length, averageGap, estimatedRetention, level };
}

export function forgettingRetention(daysSinceReview) {
  const d = typeof daysSinceReview === 'number' && daysSinceReview >= 0 ? daysSinceReview : 0;
  return Math.round(100 * Math.exp(-d / 6));
}

export function triageTopic(input) {
  const isNew = !!(input && input.isNew);
  const isRelevant = !!(input && input.isRelevant);
  const hasEvidence = !!(input && input.hasEvidence);
  if (!isRelevant) {
    return {
      decision: 'park',
      reason: 'Not relevant to current goals — park it and protect focus.',
      nextAction: 'Write a one-line park note and revisit monthly.',
    };
  }
  if (!isNew) {
    return {
      decision: 'park',
      reason: 'Already in your system — park unless a gap reopens.',
      nextAction: 'Link it to the existing note instead of starting over.',
    };
  }
  if (hasEvidence) {
    return {
      decision: 'go-deep',
      reason: 'New, relevant, and backed by evidence — worth a focused block.',
      nextAction: 'Schedule one 25-minute deep session today.',
    };
  }
  return {
    decision: 'revisit-with-evidence',
    reason: 'Interesting but unproven — collect one piece of evidence first.',
    nextAction: 'Find one worked example before scheduling deep time.',
  };
}

export function getFormatsForAttention(attentionId) {
  if (typeof attentionId !== 'string') return null;
  const found = ATTENTION_FORMATS.find((f) => f.id === attentionId);
  return found || null;
}

const QUIZ_FOCUS = ['Recall', 'Apply', 'Teach-back', 'Connect', 'Predict'];

function questionsForFocus(topic, focus) {
  if (focus === 'Apply') {
    return [
      'Give one worked example of ' + topic + ' from memory.',
      'Name one borderline case where ' + topic + ' does NOT apply.',
    ];
  }
  if (focus === 'Teach-back') {
    return [
      'Explain ' + topic + ' as if teaching a newcomer.',
      'State the core idea of ' + topic + ' in two sentences.',
    ];
  }
  if (focus === 'Connect') {
    return [
      'Connect ' + topic + ' to one idea you already know well.',
      'Predict what breaks first when ' + topic + ' is misapplied.',
    ];
  }
  if (focus === 'Predict') {
    return [
      'Predict what breaks first when ' + topic + ' is misapplied.',
      'Give one worked example of ' + topic + ' from memory.',
    ];
  }
  return [
    'State the core idea of ' + topic + ' in two sentences.',
    'List three key terms from ' + topic + ' and define each from memory.',
  ];
}

export function buildDailyQuiz(topic, dayCount) {
  if (!trimmed(topic)) return { ok: false, errors: ['topic-required'] };
  const clean = trimmed(topic);
  let n = typeof dayCount === 'number' ? Math.floor(dayCount) : 3;
  if (!Number.isFinite(n)) n = 3;
  n = Math.max(1, Math.min(5, n));
  const plan = [];
  for (let i = 0; i < n; i += 1) {
    const focus = QUIZ_FOCUS[i % QUIZ_FOCUS.length];
    plan.push({ day: i + 1, focus, questions: questionsForFocus(clean, focus) });
  }
  return { ok: true, topic: clean, plan };
}
