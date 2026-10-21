// ── AI harms & their technical causes engine — harm taxonomy, cause chains,
// mitigation levers, and a two-phase harm-report prompt. Original content.
// No sources, URLs, or authors.

// ── Harms ───────────────────────────────────────────────────────────────────

export const HARMS = [
  { id: 'discrimination', name: 'Discriminatory outcomes', icon: '⚖️', blurb: 'Systematically worse decisions for a group', severity: 4 },
  { id: 'privacy', name: 'Privacy erosion', icon: '🔓', blurb: 'Sensitive data exposed or inferred', severity: 4 },
  { id: 'misinformation', name: 'Fabricated claims at scale', icon: '📰', blurb: 'Confident falsehoods amplified by automation', severity: 3 },
  { id: 'deskilling', name: 'Human deskilling', icon: '🧠', blurb: 'Practitioners lose skills the system absorbs', severity: 3 },
  { id: 'feedback', name: 'Self-reinforcing loops', icon: '🔄', blurb: 'Model outputs re-enter training data', severity: 4 },
  { id: 'anthropomorphism', name: 'False trust in fluency', icon: '🎭', blurb: 'Fluent prose mistaken for competence', severity: 3 },
];

// ── Technical causes ────────────────────────────────────────────────────────

export const CAUSES = [
  { id: 'trainbias', name: 'Biased training distribution', layer: 'Data', icon: '🗄️',
    detail: 'Historical skew or missing subgroups in the training set survive into the model.' },
  { id: 'proxy', name: 'Proxy-variable leakage', layer: 'Data', icon: '🪪',
    detail: 'A feature correlates with a protected attribute; the model rediscovers it.' },
  { id: 'objective', name: 'Objective misspecification', layer: 'Objective', icon: '🎯',
    detail: 'The optimized metric diverges from the outcome stakeholders actually care about.' },
  { id: 'ood', name: 'Distribution shift', layer: 'Deployment', icon: '📉',
    detail: 'Deployment inputs drift from the training distribution the model memorized.' },
  { id: 'opacity', name: 'Decision opacity', layer: 'Interpretation', icon: '🌫️',
    detail: 'No one can reconstruct why a decision was made, so errors go unchallenged.' },
  { id: 'scale', name: 'Automation scale', layer: 'Deployment', icon: '🏭',
    detail: 'One bad decision rule, executed millions of times, becomes a systemic harm.' },
  { id: 'loop', name: 'Output re-ingestion', layer: 'Pipeline', icon: '🔁',
    detail: 'Generated outputs re-enter the data corpus; the next model trains on its own artifacts.' },
  { id: 'fluency', name: 'Fluency without grounding', layer: 'Generation', icon: '💬',
    detail: 'Surface form is polished; the underlying claim is unverified or false.' },
  { id: 'agency', name: 'Unbounded tool agency', layer: 'Deployment', icon: '🤖',
    detail: 'Actions execute at machine speed without a human confirmation gate.' },
];

// ── Cause ↔ harm links (strength 1–3) ───────────────────────────────────────

export const LINKS = [
  { harm: 'discrimination', cause: 'trainbias', strength: 3 },
  { harm: 'discrimination', cause: 'proxy', strength: 3 },
  { harm: 'discrimination', cause: 'objective', strength: 2 },
  { harm: 'privacy', cause: 'proxy', strength: 3 },
  { harm: 'privacy', cause: 'opacity', strength: 2 },
  { harm: 'privacy', cause: 'scale', strength: 2 },
  { harm: 'misinformation', cause: 'fluency', strength: 3 },
  { harm: 'misinformation', cause: 'loop', strength: 2 },
  { harm: 'deskilling', cause: 'agency', strength: 3 },
  { harm: 'deskilling', cause: 'scale', strength: 2 },
  { harm: 'feedback', cause: 'loop', strength: 3 },
  { harm: 'feedback', cause: 'ood', strength: 2 },
  { harm: 'anthropomorphism', cause: 'fluency', strength: 3 },
  { harm: 'anthropomorphism', cause: 'opacity', strength: 2 },
];

export function causesForHarm(harmId) {
  return LINKS.filter((l) => l.harm === harmId)
    .map((l) => ({ ...CAUSES.find((c) => c.id === l.cause), strength: l.strength }))
    .sort((a, b) => b.strength - a.strength);
}

export function harmsForCause(causeId) {
  return LINKS.filter((l) => l.cause === causeId)
    .map((l) => ({ ...HARMS.find((h) => h.id === l.harm), strength: l.strength }))
    .sort((a, b) => b.strength - a.strength);
}

// ── Mitigation levers per cause ─────────────────────────────────────────────

export const MITIGATIONS = [
  { cause: 'trainbias', lever: 'Stratified sampling + subgroup eval slices', layer: 'Data', residual: 1 },
  { cause: 'proxy', lever: 'Proxy-detection audit: correlate every feature with protected attributes', layer: 'Data', residual: 1 },
  { cause: 'objective', lever: 'Rewrite the objective with stakeholders; add counter-metric', layer: 'Objective', residual: 2 },
  { cause: 'ood', lever: 'Drift monitors + abstention threshold on out-of-distribution inputs', layer: 'Deployment', residual: 2 },
  { cause: 'opacity', lever: 'Decision logs with reconstructable features + appeal path', layer: 'Interpretation', residual: 1 },
  { cause: 'scale', lever: 'Human gate on irreversible actions; batch sampling audits', layer: 'Deployment', residual: 2 },
  { cause: 'loop', lever: 'Provenance tagging; exclude synthetic rows from retraining', layer: 'Pipeline', residual: 1 },
  { cause: 'fluency', lever: 'Citation-required generation with abstention on missing evidence', layer: 'Generation', residual: 1 },
  { cause: 'agency', lever: 'Capability allowlist + typed tools + confirmation gate', layer: 'Deployment', residual: 1 },
];

export function mitigationFor(causeId) {
  return MITIGATIONS.find((m) => m.cause === causeId);
}

// ── Simulator: residual harm given enabled mitigations ──────────────────────

export function residualHarm(harmId, enabledCauseIds) {
  const links = LINKS.filter((l) => l.harm === harmId);
  const base = links.reduce((s, l) => s + l.strength, 0);
  const mitigated = links.reduce((s, l) => {
    if (!enabledCauseIds.includes(l.cause)) return s + l.strength;
    const m = mitigationFor(l.cause);
    const factor = m ? m.residual / 3 : 1;
    return s + l.strength * factor;
  }, 0);
  return {
    base,
    residual: Math.round(mitigated * 10) / 10,
    pct: base ? Math.round((mitigated / base) * 100) : 0,
  };
}

// ── Upstream vs downstream fix table ────────────────────────────────────────

export const FIX_STRATEGY = [
  { id: 'upstream', name: 'Upstream fix', when: 'Cause lives in data or objective — fix before the next training run',
    examples: ['Rebalance the corpus', 'Rewrite the objective', 'Purge proxy features'],
    tradeoff: 'Slow — waits for a retrain, but the harm stops recurring' },
  { id: 'midstream', name: 'Midstream fix', when: 'Cause lives in the pipeline — fix the loop',
    examples: ['Provenance tags on synthetic data', 'Decision logs', 'Abstention thresholds'],
    tradeoff: 'Medium — ships without a retrain; needs monitoring to stay honest' },
  { id: 'downstream', name: 'Downstream fix', when: 'Cause lives at deployment — gate the action',
    examples: ['Human approval on irreversible actions', 'Output filters', 'Appeal paths'],
    tradeoff: 'Fast — protects users immediately, but the root cause still exists upstream' },
];

// ── Harm-discovery workflow ─────────────────────────────────────────────────

export const HARM_WORKFLOW = [
  { step: 1, name: 'Hazard scan', job: 'List what the system can touch — decisions, data, actions', output: 'A hazard register, not a vibe' },
  { step: 2, name: 'Incident mapping', job: 'Map each hazard to a plausible harm from the taxonomy', output: 'Hazard → harm pairs' },
  { step: 3, name: 'Cause tracing', job: 'For each harm, walk data → objective → pipeline → deployment and name the technical cause', output: 'Cause chain per harm' },
  { step: 4, name: 'Control selection', job: 'Pick upstream / midstream / downstream controls per cause', output: 'Control plan with owners' },
  { step: 5, name: 'Residual sign-off', job: 'State the residual harm someone is willing to accept, in writing', output: 'Signed residual-risk statement' },
];

// ── Two-phase harm-report prompt ────────────────────────────────────────────

export const HARM_PHASE1 = `ROLE
Act as an AI harms analyst.

CONTEXT
I will provide a system description: what it decides, what data it touches, what actions it can take.

TASK — PHASE 1 (ALIGNMENT ONLY — DO NOT RUN THE ANALYSIS YET)
1. Restate the system scope and the harms you understand to be in play.
2. Ask up to 3 clarifying questions about affected groups, action bounds, and deployment scale.
3. Describe the report schema you will emit (Harm · Technical Cause · Layer · Control · Residual).
STOP. Wait for my explicit reply: "approved".

HARD RULES FOR PHASE 1
- Do NOT emit any harm table.
- Do NOT recommend controls yet.
- Map causes, don't propose fixes.`;

export const HARM_PHASE2 = `TASK — PHASE 2 (EXECUTE — runs only after the word "approved")
Emit a harms-and-causes report with exactly these columns:
| Harm | Technical Cause | Cause Layer | Control | Residual Risk |

RULES
- Every Harm must name at least one Technical Cause from the cause taxonomy (Data / Objective / Pipeline / Interpretation / Generation / Deployment).
- Controls must state upstream, midstream, or downstream — and what remains after the control is active.
- If a harm has no plausible technical cause, say so explicitly rather than inventing one.`;

// ── Cause layer summary ─────────────────────────────────────────────────────

export const LAYERS = [
  { id: 'Data', icon: '🗄️', note: 'Fixes wait for the next training run — slowest, most durable' },
  { id: 'Objective', icon: '🎯', note: 'A misspecified objective poisons every downstream stage' },
  { id: 'Pipeline', icon: '🔁', note: 'Where today\'s outputs become tomorrow\'s training data' },
  { id: 'Interpretation', icon: '🌫️', note: 'Opacity turns recoverable mistakes into unchallenged ones' },
  { id: 'Generation', icon: '💬', note: 'Fluency is the harm amplifier — polished claims outrun evidence' },
  { id: 'Deployment', icon: '🏭', note: 'Scale and agency turn one bad rule into systemic damage' },
];
