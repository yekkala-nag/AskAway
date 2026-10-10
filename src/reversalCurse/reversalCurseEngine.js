// ── Reversal curse: one-way memory — data & pure logic ──
// Pure JS only: no JSX, no window/document. Deterministic (seeded) simulation.

export const FACTS = [
  {
    id: 'glowmoth',
    subject: 'The glowmoth',
    relation: 'is guarded by',
    object: 'the lantern keeper',
    forwardQ: 'Who guards the glowmoth?',
    forwardA: 'The lantern keeper',
    reverseQ: 'Who does the lantern keeper guard?',
    reverseA: 'The glowmoth',
    hint: 'Everyday version: you learn "the new neighbor is a beekeeper" but blank when asked "who is the beekeeper?"',
  },
  {
    id: 'saltcharter',
    subject: 'The salt charter',
    relation: 'was signed in',
    object: 'the harbor town of Merrivale',
    forwardQ: 'Where was the salt charter signed?',
    forwardA: 'The harbor town of Merrivale',
    reverseQ: 'What was signed in the harbor town of Merrivale?',
    reverseA: 'The salt charter',
    hint: 'You memorized the sentence in one word order only.',
  },
  {
    id: 'brasscomet',
    subject: 'The brass comet festival',
    relation: 'was founded by',
    object: 'the clockmaker Ilsa Renn',
    forwardQ: 'Who founded the brass comet festival?',
    forwardA: 'The clockmaker Ilsa Renn',
    reverseQ: 'What did the clockmaker Ilsa Renn found?',
    reverseA: 'The brass comet festival',
    hint: 'Names are invented for this demo — the asymmetry is the point, not the trivia.',
  },
  {
    id: 'riverpact',
    subject: 'The river pact',
    relation: 'is kept inside',
    object: 'the blue vault',
    forwardQ: 'Where is the river pact kept?',
    forwardA: 'Inside the blue vault',
    reverseQ: 'What is kept inside the blue vault?',
    reverseA: 'The river pact',
    hint: 'Flip the question and the memorized sentence no longer matches.',
  },
  {
    id: 'nightmill',
    subject: 'The night mill',
    relation: 'grinds',
    object: 'moonbarley',
    forwardQ: 'What does the night mill grind?',
    forwardA: 'Moonbarley',
    reverseQ: 'Where is moonbarley ground?',
    reverseA: 'At the night mill',
    hint: 'Subject and object swap roles; the memory trace does not follow.',
  },
];

export const ANALOGY = {
  title: 'The one-way street analogy',
  body: 'Learning "A is B" is like walking a street in one direction: you memorize every turn from A to B, but you never practiced the return trip. Asked to walk it backwards, you hesitate at each corner — even though it is the same street. Training on next-word prediction walks every fact street in one direction only.',
};

export const MECHANISM_STEPS = [
  {
    step: '1 · The update touches the subject side',
    what: 'Seeing "A is B" adjusts the representation of A so it predicts the words of B next.',
    why: 'Gradient flows into the tokens that did the predicting — the subject-side context.',
  },
  {
    step: '2 · The answer side is a target, not a student',
    what: 'B appears as the thing to predict, so the model never practices starting from B and reaching A.',
    why: 'Loss rewards "given A, say B" and never asks "given B, say A".',
  },
  {
    step: '3 · At quiz time the cue is unfamiliar',
    what: 'Asked "who is B?", the model starts from B — a starting point it never trained from.',
    why: 'Retrieval follows trained cue → answer pathways; the reverse pathway was never built.',
  },
  {
    step: '4 · Paraphrase does not rescue it',
    what: 'Rewording still cues from the wrong end of a one-way link.',
    why: 'The missing piece is a reverse association, not a missing synonym.',
  },
];

// Scale curve: illustrative only. Forward recall high and flat; reverse low and flat.
export const SCALE_POINTS = [
  { size: 'S', params: 'Small', forward: 0.92, reverse: 0.12 },
  { size: 'M', params: 'Medium', forward: 0.94, reverse: 0.11 },
  { size: 'L', params: 'Large', forward: 0.95, reverse: 0.13 },
  { size: 'XL', params: 'Very large', forward: 0.96, reverse: 0.12 },
];

export function forwardAccAtScale(i) {
  return SCALE_POINTS[Math.min(Math.max(i, 0), SCALE_POINTS.length - 1)].forward;
}

export function reverseAccAtScale(i) {
  return SCALE_POINTS[Math.min(Math.max(i, 0), SCALE_POINTS.length - 1)].reverse;
}

export const FIXES = [
  { fix: 'Ask both directions', how: 'Quiz every fact forward and reversed before trusting recall.', cost: 'Doubles evaluation effort; catches the gap immediately.' },
  { fix: 'Train both orders', how: 'Include "B is linked to A" phrasings alongside "A is B" during training.', cost: 'Needs deliberate data design; still only covers phrased reversals.' },
  { fix: 'Augment with questions', how: 'Add QA pairs in both directions so answer-side entities appear as subjects.', cost: 'Synthesis effort; must avoid leaking test items into training.' },
  { fix: 'Retrieval as symmetry fix', how: 'Store the fact once and look it up from either end instead of relying on parametric memory.', cost: 'Adds a retrieval step; shifts trust to the index and retriever.' },
];

export const LIMITS = [
  { limit: 'Toy demos use clean pairs', note: 'Real text buries facts in varied prose; the gap can be subtler or sharper.' },
  { limit: 'Chance baseline depends on quiz design', note: 'Open-ended vs multiple-choice changes what "near chance" means — report the baseline.' },
  { limit: 'Both-orders training is not a cure-all', note: 'It covers phrased reversals, not every inference a user might expect.' },
];

export const CODE_SIM = `// Toy directional-recall sketch (illustrative, not a real trainer).
// Train cue -> answer links one way; the reverse row is never updated.
function trainForward(pairs, W, lr) {
  for (const [a, b] of pairs) {
    W[a][b] += lr;                 // strengthen the trained direction
    for (let j = 0; j < W.length; j++) {
      if (j !== b) W[a][j] -= lr / (W.length - 1);  // keep the row balanced
    }
    // NOTE: row b is never touched — so "given b, find a" stays untrained.
  }
  return W;
}`;

export const CODE_BOTH_ORDERS = `// Symmetry fix sketch: present each fact in both orders.
function augmentBothOrders(pairs) {
  const out = [];
  for (const [a, b] of pairs) {
    out.push([a, b]);  // "A is linked to B"
    out.push([b, a]);  // "B is linked to A" — trains the return trip
  }
  return out;
}

// Retrieval alternative: store once, query from either end.
function lookup(store, cue) {
  return store.find(([a, b]) => a === cue || b === cue) || null;
}`;

// ── Quiz helpers ──────────────────────────────────────────────

export function quizItems(direction = 'forward') {
  return FACTS.map((f) =>
    direction === 'forward'
      ? { id: f.id, q: f.forwardQ, a: f.forwardA }
      : { id: f.id, q: f.reverseQ, a: f.reverseA },
  );
}

export function normalizeAnswer(s) {
  return String(s || '').trim().toLowerCase().replace(/^(the|a|an)\s+/, '').replace(/[.?!\s]+$/g, '');
}

export function isCorrect(given, expected) {
  const g = normalizeAnswer(given);
  const e = normalizeAnswer(expected);
  if (!g) return false;
  return g === e || g.includes(e) || e.includes(g);
}

export function scoreAnswers(answersById, direction = 'forward') {
  const items = quizItems(direction);
  let correct = 0;
  const rows = items.map((it) => {
    const given = answersById[it.id] || '';
    const ok = isCorrect(given, it.a);
    if (ok) correct += 1;
    return { id: it.id, q: it.q, expected: it.a, given, ok };
  });
  return { correct, total: items.length, acc: items.length ? correct / items.length : 0, rows };
}

// ── Deterministic directional-recall simulation ───────────────
// Tiny from-scratch associative memory: a V x V weight matrix.
// Training strengthens only the forward row (cue -> answer).
// Reverse queries read an untrained row, so accuracy stays near chance.

export function mulberry32(seed) {
  let t = (seed >>> 0) + 0x6d2b79f5;
  return function rand() {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makePairs(pairCount, seed = 7) {
  const rand = mulberry32(seed);
  const V = pairCount * 2;
  const idx = Array.from({ length: V }, (_, i) => i);
  // Deterministic shuffle of entity indices, then slice into ordered pairs.
  for (let i = idx.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const pairs = [];
  for (let k = 0; k < pairCount; k += 1) {
    pairs.push([idx[2 * k], idx[2 * k + 1]]);
  }
  return { pairs, vocabSize: V };
}

export function simulateDirectionalRecall({ pairCount = 8, seed = 7, epochs = 12, lr = 1.0 } = {}) {
  const { pairs, vocabSize: V } = makePairs(pairCount, seed);
  const rand = mulberry32(seed ^ 0x9e3779b9);
  // Small random init so untrained rows have a (deterministic) arbitrary winner.
  const W = Array.from({ length: V }, () =>
    Array.from({ length: V }, () => (rand() - 0.5) * 0.01),
  );
  for (let e = 0; e < epochs; e += 1) {
    for (const [a, b] of pairs) {
      W[a][b] += lr;
      const dec = lr / (V - 1);
      for (let j = 0; j < V; j += 1) {
        if (j !== b) W[a][j] -= dec;
      }
      // Deliberately never touch row b: the reverse link never forms.
    }
  }
  const argmax = (row) => {
    let best = 0;
    for (let j = 1; j < row.length; j += 1) {
      if (row[j] > row[best]) best = j;
    }
    return best;
  };
  let fwd = 0;
  let rev = 0;
  const reverseRows = [];
  for (const [a, b] of pairs) {
    if (argmax(W[a]) === b) fwd += 1;
    const guess = argmax(W[b]);
    if (guess === a) rev += 1;
    reverseRows.push({ cue: b, guess, answer: a, ok: guess === a });
  }
  const chance = 1 / V;
  return {
    pairCount,
    seed,
    epochs,
    vocabSize: V,
    trainedAcc: fwd / pairs.length,
    reverseAcc: rev / pairs.length,
    chance,
    reverseRows,
  };
}
