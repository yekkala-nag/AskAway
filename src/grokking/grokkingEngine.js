// ── Grokking: delayed generalization — data & pure logic ──

// Piecewise learning curves (steps → accuracy), shaped to the classic
// modular-addition experiment: instant memorization, long silence, late click.
export function trainAccAt(steps) {
  if (steps <= 0) return 0.02;
  return Math.min(1, 0.02 + steps / 780);
}

function smoothstep(x) {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
}

export function testAccAt(steps) {
  if (steps < 9000) return 0.10 + 0.04 * (steps / 9000);
  if (steps < 20000) return 0.14 + 0.84 * smoothstep((steps - 9000) / 11000);
  return 0.98 + 0.02 * Math.min(1, (steps - 20000) / 5000);
}

export function phaseAt(steps) {
  if (steps < 1000) return PHASES[0];
  if (steps < 9000) return PHASES[1];
  if (steps < 20000) return PHASES[2];
  return PHASES[3];
}

export const PHASES = [
  {
    id: 'fit',
    name: 'Fit the answer key',
    range: '0 – 1k steps',
    train: '≈ 100%',
    test: '≈ 10%',
    inside: 'A memorization circuit stores seen (a, b) → c pairs verbatim.',
    outside: 'Looks finished: training loss is flat and perfect. This is where most runs stop.',
  },
  {
    id: 'plateau',
    name: 'Construction plateau',
    range: '1k – 9k steps',
    train: '≈ 100%',
    test: '≈ 10–14%',
    inside: 'Two circuits coexist: the memorizer still wins outputs while a general rotation circuit is assembled piece by piece.',
    outside: 'The scoreboard is flat. Early-stopping rules read this as "no progress" and cut the run.',
  },
  {
    id: 'takeover',
    name: 'Circuit takeover',
    range: '9k – 20k steps',
    train: '100%',
    test: '14% → 98%',
    inside: 'The general circuit completes and outcompetes the memorizer on every input, seen or not.',
    outside: 'Test accuracy jumps in a narrow window. From outside it looks sudden; inside it was inevitable.',
  },
  {
    id: 'general',
    name: 'General solution',
    range: '20k+ steps',
    train: '100%',
    test: '≈ 100%',
    inside: 'Numbers are positions on a circle; addition is rotation — trigonometry rediscovered by gradient descent.',
    outside: 'Novel problems are solved exactly. The model is now a different kind of model.',
  },
];

export const CRAM_VS_UNDERSTAND = [
  { property: 'Novel problem accuracy', cram: 'Random (~10%)', understand: 'Near perfect' },
  { property: 'Training accuracy', cram: '100%', understand: '100%' },
  { property: 'Internal representation', cram: 'Per-example lookup table', understand: 'Circle positions + rotation' },
  { property: 'Survives distribution shift', cram: 'No', understand: 'Yes' },
  { property: 'What the scoreboard shows', cram: 'Finished', understand: 'Identical — until the click' },
  { property: 'Early stopping verdict', cram: 'Keep (it converged!)', understand: 'Discard (it stalled!) — wrong call' },
];

export const PROGRESS_MEASURES = [
  { measure: 'Train / test gap', watches: 'The delta itself', catches: 'Plateau while the general circuit builds', gap: 'Cannot see which circuit is winning' },
  { measure: 'Loss on fresh modular pairs', watches: 'Generalization directly', catches: 'The late click within ~1k steps', gap: 'Needs a held-out probe set every N steps' },
  { measure: 'Circle-structure probes', watches: 'Hidden-state geometry', catches: 'Rotation circuit forming before accuracy moves', gap: 'Task-specific — must be written per rule' },
  { measure: 'Circuit ablation', watches: 'Which neurons the answer depends on', catches: 'Memorizer vs general circuit ownership', gap: 'Expensive; offline analysis only' },
];

export const LESSONS = [
  { lesson: 'A flat curve is not an empty run', action: 'Log probe accuracy on fresh examples, not just train/val.' },
  { lesson: 'Early stopping is a hypothesis, not a law', action: 'Extend patience when the probe gap is still collapsing internally.' },
  { lesson: 'Memorization and understanding look identical externally', action: 'Add interpretability probes for high-stakes training runs.' },
  { lesson: 'The general method must outcompete the memorizer', action: 'Weight decay and data variety tilt the competition toward the general circuit.' },
  { lesson: 'Small rule-based tasks prove the mechanism exists', action: 'Open question: watch for analogous silent phases in large models.' },
];

export const CODE_TRAIN = `import numpy as np

P = 97  # modular clock: (a + b) mod P
rng = np.random.default_rng(7)

# dataset: every ordered pair of clock numbers
X = np.array([(a, b) for a in range(P) for b in range(P)])
y = (X[:, 0] + X[:, 1]) % P

def one_hot(v, k=P):
    out = np.zeros((len(v), k)); out[np.arange(len(v)), v] = 1
    return out

Xh, yh = X / P, one_hot(y)
W1 = rng.normal(0, 0.5, (2, 128)); b1 = np.zeros(128)
W2 = rng.normal(0, 0.5, (128, P)); b2 = np.zeros(P)
lr = 0.05

for step in range(1, 20001):
    h = np.tanh(Xh @ W1 + b1)
    logits = h @ W2 + b2
    p = np.exp(logits - logits.max(1, keepdims=True))
    p /= p.sum(1, keepdims=True)
    g = (p - yh) / len(X)
    W2 -= lr * (h.T @ g); b2 -= lr * g.sum(0)
    gh = (g @ W2.T) * (1 - h ** 2)
    W1 -= lr * (Xh.T @ gh); b1 -= lr * gh.sum(0)

    if step % 500 == 0:
        pred = p.argmax(1)
        seen_acc = (pred == y).mean()          # training: perfect early
        probe = evaluate_on_unseen_pairs(...)  # held-out: jumps late
        print(f"step {step:>6}  train {seen_acc:.2f}  test {probe:.2f}")`;

export const CODE_EARLYSTOP = `# The trap: a standard patience rule kills the run at the plateau.
def early_stop(test_acc_history, patience=3, min_delta=0.005):
    if len(test_acc_history) < patience + 1:
        return False
    recent = test_acc_history[-patience - 1:]
    best = max(recent[:-1])
    return recent[-1] < best + min_delta   # "no improvement"

# At step 1500 the model reads: train 1.00, test 0.10, flat for 500 steps.
# early_stop() returns True -> weights are checkpointed as "converged".
# The general circuit never gets to finish. The fix: extend patience when
# probe geometry (circle structure) is still changing even if accuracy is not.`;

export const CODE_PROGRESS = `# Progress measure: does the hidden state encode numbers as circle positions?
def circle_score(model, P=97, n=200):
    """Probe: embed each number 0..P-1, fit an angle per number,
    then check whether adding == rotating by that angle."""
    import numpy as np
    h = model.embed(np.arange(P))              # (P, d)
    h = h - h.mean(0)
    # two principal directions define the circle plane
    u, s, vt = np.linalg.svd(h, full_matrices=False)
    xy = h @ vt[:2].T                          # (P, 2)
    theta = np.arctan2(xy[:, 1], xy[:, 0])     # angle of each number

    # consistency: angle(a) + angle(b) - angle(a+b) should be ~0 (mod 2pi)
    a = np.random.randint(0, P, n); b = np.random.randint(0, P, n)
    d = theta[a] + theta[b] - theta[(a + b) % P]
    err = np.angle(np.exp(1j * d))             # wrap to (-pi, pi]
    return float(np.mean(np.abs(err)))         # -> ~0 means circle found

# circle_score falls long before test accuracy jumps: the geometry
# is the progress measure, accuracy is only the report card.`;
