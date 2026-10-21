// ── Subject leakage engine — segment vs subject splits, inflation model,
// split-strategy taxonomy, leakage audit checklist. Original content.
// No sources, URLs, or authors.

// ── Synthetic corpus: subjects × segments ───────────────────────────────────

export function makeCorpus({ subjects = 8, segmentsPerSubject = 12, seed = 42 } = {}) {
  let s = seed;
  const rand = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  const rows = [];
  for (let subj = 0; subj < subjects; subj += 1) {
    // per-subject signature: identity fingerprint the model can memorize
    const signature = Array.from({ length: 16 }, () => rand());
    for (let seg = 0; seg < segmentsPerSubject; seg += 1) {
      rows.push({
        id: `S${subj}-E${seg}`,
        subject: subj,
        // label: condition class the model should learn
        label: subj % 2,
        // features: shared signal + subject signature noise
        signal: (subj % 2) * 0.4 + 0.3 + rand() * 0.2,
        signature,
      });
    }
  }
  return rows;
}

// ── Split strategies ────────────────────────────────────────────────────────

export const SPLITS = [
  { id: 'segment', name: 'Segment-random split', leakage: true,
    desc: 'Shuffle all segments; assign randomly to train/test. Same subject lands in both.',
    inflated: 'High — the model can match subjects instead of conditions' },
  { id: 'subject', name: 'Subject-blocked split', leakage: false,
    desc: 'Partition by subject ID; every segment of a subject goes to exactly one side.',
    inflated: 'Honest — estimates generalization to unseen people' },
  { id: 'session', name: 'Session-blocked split', leakage: false,
    desc: 'Partition by recording session; a subject may appear on both sides, but never the same session.',
    inflated: 'Moderate — controls session noise, still sees the person' },
  { id: 'leaveone', name: 'Leave-one-subject-out (LOSO)', leakage: false,
    desc: 'Train on N−1 subjects; test on the held-out subject. Rotate until everyone is tested.',
    inflated: 'Honest per-subject; slowest protocol' },
  { id: 'crossds', name: 'Cross-dataset holdout', leakage: false,
    desc: 'Train on dataset A entirely; test on dataset B from a different collection.',
    inflated: 'Strictest — also absorbs hardware and protocol shift' },
];

// ── Inflation model ─────────────────────────────────────────────────────────

/**
 * Estimated accuracy under a split. Segment-random accuracy is inflated by
 * subject-memorization credit; subject-blocked strips it.
 */
export function estimateAccuracies({ subjects = 8, segmentsPerSubject = 12, signalStrength = 0.7 } = {}) {
  const honest = 0.5 + signalStrength * 0.35; // max ~85% at signal=1
  const total = subjects * segmentsPerSubject;
  // memorization credit rises with how much of each subject sits in both sides
  const overlap = segmentsPerSubject >= 4 ? 0.5 : segmentsPerSubject / 8;
  const memorize = 0.10 + 0.25 * overlap * (signalStrength * 0.5 + 0.5);
  const inflated = Math.min(0.97, honest + memorize);
  return {
    honest: Math.round(honest * 1000) / 10,
    inflated: Math.round(inflated * 1000) / 10,
    gap: Math.round((inflated - honest) * 1000) / 10,
    total,
    subjects,
    segmentsPerSubject,
  };
}

/** Illustrative literature-style anchor numbers for the demo. */
export const ANCHOR = {
  segmentAcc: 79.1,
  subjectAcc: 61.4,
  gap: 17.7,
  note: 'Seizure-detection demo: segment-random hit ~79% while subject-blocked truth sat near 61%',
};

// ── Split visualizer data ───────────────────────────────────────────────────

export function splitGrid(subjects, segmentsPerSubject, strategy, testFraction = 0.3) {
  const rows = [];
  const rng = (n) => Math.abs(Math.sin(n * 999 + 1) * 10000) % 1;
  for (let subj = 0; subj < subjects; subj += 1) {
    for (let seg = 0; seg < segmentsPerSubject; seg += 1) {
      let side;
      if (strategy === 'segment') {
        side = rng(subj * 100 + seg) < testFraction ? 'test' : 'train';
      } else if (strategy === 'subject') {
        side = subj < Math.floor(subjects * (1 - testFraction)) ? 'train' : 'test';
      } else if (strategy === 'session') {
        const session = seg < segmentsPerSubject / 2 ? 0 : 1;
        side = session === 0 ? 'train' : 'test';
      } else if (strategy === 'leaveone') {
        side = subj === subjects - 1 ? 'test' : 'train';
      } else {
        side = subj < Math.floor(subjects * 0.7) ? 'train' : 'test';
      }
      rows.push({ subject: subj, segment: seg, side });
    }
  }
  return rows;
}

export function leakedSubjects(grid) {
  const bySubject = {};
  for (const g of grid) {
    bySubject[g.subject] = bySubject[g.subject] || new Set();
    bySubject[g.subject].add(g.side);
  }
  return Object.entries(bySubject)
    .filter(([, sides]) => sides.has('train') && sides.has('test'))
    .map(([id]) => +id);
}

// ── Audit checklist ─────────────────────────────────────────────────────────

export const AUDIT_CHECKS = [
  { q: 'Can one person’s samples appear on both sides of the split?', why: 'The classic subject-leakage vector — segment shuffles guarantee it' },
  { q: 'Is the split unit the recording event, not the sliced window?', why: 'Windows from one event share noise, impedance, and state' },
  { q: 'Does the deployment target match the test target?', why: 'Subject-dependent models answer "same people?", not "new people?"' },
  { q: 'Were preprocessing statistics fit on train only?', why: 'Global normalization leaks test-distribution information' },
  { q: 'Does the reported accuracy survive a subject-blocked re-run?', why: 'If it collapses, the headline number was memorization credit' },
  { q: 'Is the split seed and subject list archived?', why: 'Unreproducible splits cannot be audited by anyone else' },
];

// ── Two-phase eval-report prompt ────────────────────────────────────────────

export const LEAK_PHASE1 = `ROLE
Act as an evaluation-integrity reviewer.

CONTEXT
I will provide a modeling study: task, dataset structure (how many people, sessions, segments), and the train/test split used.

TASK — PHASE 1 (ALIGNMENT ONLY — DO NOT RUN THE REVIEW YET)
1. Restate the dataset structure and the split you understand was used.
2. Ask up to 3 clarifying questions: split unit, subject overlap, preprocessing fit scope.
3. Describe the report schema you will emit (Leakage Vector · Severity · Expected Inflation · Fix).
STOP. Wait for my explicit reply: "approved".

HARD RULES FOR PHASE 1
- Do NOT emit any leakage verdict.
- Do NOT compute an inflation estimate.
- Restate and ask only.`;

export const LEAK_PHASE2 = `TASK — PHASE 2 (EXECUTE — runs only after the word "approved")
Emit an evaluation-integrity report with exactly these columns:
| Leakage Vector | Severity | Expected Inflation | Fix |

RULES
- The split unit must be stated first (segment / event / session / subject / dataset).
- If any person, session, or event appears on both sides, name it as a leakage vector.
- Expected Inflation must state a direction and rough magnitude, not a fake precise number.
- If the split is clean, say so explicitly — a clean audit is still a report.`;

// ── Lessons ─────────────────────────────────────────────────────────────────

export const LESSONS = [
  { id: 'identity', title: 'The model may recognize people, not conditions',
    body: 'Every subject carries a stable fingerprint — impedance, anatomy, habits. A segment-random split lets the classifier key on the fingerprint and score as if it had learned the condition.' },
  { id: 'unit', title: 'The split unit decides what the number means',
    body: 'Segments answer "can I sort windows from people I have seen?" Subject-blocked splits answer "does this work on someone new?" Only the second matches deployment.' },
  { id: 'honest', title: 'A lower honest number beats a higher leaky one',
    body: 'The inflated number wins the paper and loses the clinic. Report both when you must — but ship, deploy, and diagnose against the subject-blocked figure.' },
];
