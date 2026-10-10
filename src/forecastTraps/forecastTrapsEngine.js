// ── Forecast traps: hidden time leakage in forecasting / ML evaluation — data & pure logic ──
// Illustrative numbers only. No external sources.

export const HONEST_ERROR = 8.4;

export const TRAPS = [
  {
    id: 'peek',
    name: 'The unknowable feature',
    symptom: 'A feature that is only known after the outcome (settled totals, final labels, post-hoc corrections).',
    offline: 'Looks brilliant offline: the model appears to predict almost perfectly.',
    live: 'Useless live: at forecast time the column is blank, so the score collapses.',
    fix: 'Stamp every feature with the moment it becomes knowable; drop anything knowable after issue time.',
    discount: 4.1,
  },
  {
    id: 'delay',
    name: 'The reporting delay',
    symptom: 'Source values arrive late — only values at least N periods old are actually published at issue time.',
    offline: 'Using fresh values flatters the score because the model sees data production never had.',
    live: 'Live inputs are older and noisier, so error jumps back up.',
    fix: 'Shift every input by its publication delay; assert no label newer than issue time.',
    discount: 1.6,
  },
  {
    id: 'echo',
    name: 'The borrowed-from-future effect',
    symptom: 'An event (promotion, outage, holiday) lifts sales first, then causes a post-event dip the model never sees.',
    offline: 'The dip looks like random noise, so a naive model scores well by ignoring it.',
    live: 'Every event is followed by a predictable slump the forecast keeps missing.',
    fix: 'Add lagged-event features (periods since the event) so the echo is learnable.',
    discount: 1.1,
  },
  {
    id: 'break',
    name: 'The structural break',
    symptom: 'The world shifts level mid-series (new fee, new sensor, new policy) and old history no longer applies.',
    offline: 'A single average across the break hides the shift; residuals look acceptable in aggregate.',
    live: 'Forecasts sit permanently above or below reality until the break is modelled.',
    fix: 'Plot residuals over time; fit separate levels before and after the break point.',
    discount: 0.6,
  },
];

export function round1(n) {
  return Math.round(n * 10) / 10;
}

export function round2(n) {
  return Math.round(n * 100) / 100;
}

// Reported-vs-honest score for a set of active (leaky) traps.
// Honest error is fixed; each active trap subtracts its discount from the reported error.
export function trapScores(activeIds) {
  const active = new Set(activeIds);
  const applied = TRAPS.filter((t) => active.has(t.id));
  const total = applied.reduce((s, t) => s + t.discount, 0);
  const reported = round1(HONEST_ERROR - total);
  const gap = round1(HONEST_ERROR - reported);
  let status = 'HONEST';
  if (gap >= 3) status = 'FANTASY';
  else if (gap > 0) status = 'INFLATED';
  return { reported, honest: HONEST_ERROR, gap, status, applied: applied.map((t) => t.id) };
}

export const EVALUATION_STEPS = [
  { n: 1, step: 'Hold out the future, chronologically', detail: 'Train on early periods, test on later ones. Never shuffle time into random folds.' },
  { n: 2, step: 'Walk forward with refits', detail: 'Slide the train window forward, refit, and score the next horizon — repeat across the whole history.' },
  { n: 3, step: 'Assert availability at issue time', detail: 'Every feature and label used for a forecast at time T must have existed at T. Reject anything newer.' },
];

// Period indices (integers). A feature is legal only if it was available at or before issue time.
export function isFeatureLegal(availableAt, issueTime) {
  return availableAt <= issueTime;
}

export function assertAvailability(rows) {
  const legal = [];
  const illegal = [];
  for (const r of rows) {
    if (isFeatureLegal(r.availableAt, r.issueTime)) legal.push(r);
    else illegal.push(r);
  }
  return { legal, illegal, legalCount: legal.length, illegalCount: illegal.length, ok: illegal.length === 0 };
}

// Latest period whose value is published by issueTime given a reporting delay.
export function delayLegal(issueTime, delayPeriods) {
  return issueTime - delayPeriods;
}

// Sliding walk-forward splits over nPeriods (0-indexed periods).
// Each fold: train [i, i + trainSize - 1], test [i + trainSize, i + trainSize + horizon - 1].
export function walkForwardSplits(nPeriods, trainSize, horizon) {
  const folds = [];
  for (let i = 0; i + trainSize + horizon <= nPeriods; i += 1) {
    folds.push({
      fold: folds.length + 1,
      train: [i, i + trainSize - 1],
      test: [i + trainSize, i + trainSize + horizon - 1],
    });
  }
  return folds;
}

// Residual series (illustrative): 24 periods, level shift after period 12.
export const RESIDUALS = [
  0.4, -0.6, 0.2, -0.3, 0.5, -0.1, 0.3, -0.4, 0.1, -0.2, 0.6, -0.5,
  3.4, 2.4, 3.2, 2.7, 3.5, 2.9, 3.3, 2.6, 3.1, 2.8, 3.6, 2.5,
];
export const BREAK_AT = 12;

export function residualMean(series, start, end) {
  const slice = series.slice(start, end);
  if (slice.length === 0) return 0;
  return round2(slice.reduce((s, v) => s + v, 0) / slice.length);
}

// Size of the level shift: mean(after) − mean(before) around breakAt.
export function breakSize(series, breakAt) {
  return round2(residualMean(series, breakAt, series.length) - residualMean(series, 0, breakAt));
}

// Score plausibility: a reported error below the noise floor cannot be real.
export function checkPlausibility(reportedError, noiseEstimate) {
  const ratio = round2(reportedError / noiseEstimate);
  let verdict = 'PLAUSIBLE';
  if (reportedError < noiseEstimate) verdict = 'TOO GOOD';
  else if (reportedError <= noiseEstimate * 1.15) verdict = 'BORDERLINE';
  return { ratio, verdict };
}

export const CHECKLIST = [
  { id: 'rerun', question: 'Can someone rerun the code and get the same score?', why: 'A score nobody can reproduce is a story, not evidence. One command should rebuild it.' },
  { id: 'toogood', question: 'Is the score almost too good?', why: 'Compare against the noise floor: pure randomness sets a minimum error no honest model beats.' },
  { id: 'available', question: 'Was every feature available at prediction time?', why: 'Each input needs a knowable-at timestamp. Anything newer than issue time is leakage.' },
  { id: 'plot', question: 'Did anyone plot the errors over time?', why: 'Level shifts and post-event echoes hide in averages but stand out in a residual plot.' },
  { id: 'warning', question: 'Is the warning in the code, or only in the text?', why: 'A caveat the model ignores is not a fix. Availability rules belong in assertions, not footnotes.' },
];

export function checklistProgress(checkedIds) {
  const done = CHECKLIST.filter((c) => checkedIds.includes(c.id)).length;
  const total = CHECKLIST.length;
  const pct = Math.round((done / total) * 100);
  return { done, total, pct, ready: done === total };
}

export const CODE_AVAILABILITY = `# Availability assertion: reject anything newer than issue time.
def assert_available(rows, issue_time):
    illegal = [r for r in rows if r["available_at"] > issue_time]
    if illegal:
        raise ValueError("leakage: " + str(len(illegal)) + " feature(s) newer than issue time")
    return True


def walk_forward(n_periods, train_size, horizon):
    folds = []
    start = 0
    while start + train_size + horizon <= n_periods:
        train = (start, start + train_size - 1)
        test = (start + train_size, start + train_size + horizon - 1)
        folds.append({"train": train, "test": test})
        start += 1
    return folds`;
