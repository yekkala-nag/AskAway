// ── Practical ML problem framing engine — taxonomy, examples, decision
// tree, and the Given→Identify→Benefit framing template. Original teaching
// content. No sources, URLs, authors, or copyright notices.

// ── Framing template ────────────────────────────────────────────────────────

export const FRAMING_TEMPLATE = 'Given [the data you have], identify or predict [the decision], so that [the business or domain benefit].';

export const FRAMING_BLOCKS = [
  { id: 'given', name: 'GIVEN', icon: '📦', line: 'Given [the data you have]', why: 'Anchors the problem in real, existing data — not aspirational data' },
  { id: 'identify', name: 'IDENTIFY / PREDICT', icon: '🎯', line: 'identify or predict [the decision]', why: 'Names the single decision being modelled — one decision per problem' },
  { id: 'benefit', name: 'BENEFIT', icon: '💰', line: 'so that [the business or domain benefit]', why: 'Ties the model to an action taken — a decision no one acts on is never worth modelling' },
];

// ── Problem-type taxonomy ───────────────────────────────────────────────────

export const PROBLEM_TYPES = [
  {
    id: 'classification',
    icon: '🏷️',
    name: 'Classification',
    labeled: true,
    outcome: 'A discrete class label (spam / not spam)',
    essence: 'Discrimination — modelling the differences or similarities between groups',
    dataNeeds: 'Historical examples labelled with the classes you care about',
    algorithmHints: ['Logistic-style linear classifiers', 'Tree ensembles', 'Nearest-neighbour', 'Small neural networks'],
    framed: 'Given labelled emails, predict whether a new email is spam, so that junk never reaches the inbox.',
  },
  {
    id: 'regression',
    icon: '📈',
    name: 'Regression',
    labeled: true,
    outcome: 'A real number (a price, a count, a temperature)',
    essence: 'Valuation — predicting how much, not which one',
    dataNeeds: 'Historical examples labelled with the continuous quantity, plus the drivers that move it',
    algorithmHints: ['Linear / regularized regression', 'Gradient-boosted trees', 'Smoothing & decomposition for series'],
    framed: 'Given past price movements and calendar features, predict tomorrow’s price, so that analysts get a valuation range to act on.',
  },
  {
    id: 'clustering',
    icon: '🧩',
    name: 'Clustering',
    labeled: false,
    outcome: 'Group assignments derived from natural structure',
    essence: 'Organization — the labels are discovered, not given',
    dataNeeds: 'Unlabelled records with measurable similarity between examples',
    algorithmHints: ['k-means family', 'Hierarchical / density-based grouping', 'Dimensionality reduction first'],
    framed: 'Given a photo album with no names attached, group photos by the faces that appear, so that the collection becomes browsable.',
  },
  {
    id: 'rule_extraction',
    icon: '📜',
    name: 'Rule Extraction',
    labeled: false,
    outcome: 'If–then propositions (antecedent → consequent)',
    essence: 'Discovery — finding statistically supportable relationships between attributes, not predicting one of them',
    dataNeeds: 'Transaction or event logs with many co-occurring attributes',
    algorithmHints: ['Association-rule mining', 'Frequent-itemset search', 'Interestingness filtering'],
    framed: 'Given a basket of purchases across many stores, extract rules linking items that are bought together, so that layouts and bundles follow the evidence.',
  },
];

export const TYPE_BY_ID = Object.fromEntries(PROBLEM_TYPES.map((t) => [t.id, t]));

// ── Ten grounding examples ──────────────────────────────────────────────────

export const EXAMPLES = [
  { id: 'spam', name: 'Spam detection', given: 'Email in an inbox', decision: 'Spam or not spam', benefit: 'Junk is diverted; the inbox stays clean', type: 'classification' },
  { id: 'fraud', name: 'Card fraud detection', given: 'A month of card transactions', decision: 'Made by the customer or not', benefit: 'Fraudulent charges are refunded early', type: 'classification' },
  { id: 'digits', name: 'Digit recognition', given: 'Handwritten digits on envelopes', decision: 'Which digit each character is', benefit: 'Mail is sorted automatically by destination', type: 'classification' },
  { id: 'speech', name: 'Speech understanding', given: 'An utterance from a user', decision: 'The specific request made', benefit: 'A voice assistant can attempt to fulfil it', type: 'classification' },
  { id: 'faces', name: 'Face detection', given: 'A photo album of hundreds of images', decision: 'Which photos include a given person', benefit: 'The album is organized by person', type: 'clustering' },
  { id: 'recommend', name: 'Purchase-rule mining', given: 'Baskets of co-purchased items across a large inventory', decision: 'If–then rules linking items bought together', benefit: 'Bundles and layouts follow the discovered relationships', type: 'rule_extraction' },
  { id: 'medical', name: 'Medical diagnosis support', given: 'Patient symptoms plus anonymized records', decision: 'Likelihood of an illness', benefit: 'Clinicians get decision support, not a replacement', type: 'classification' },
  { id: 'stock', name: 'Stock price estimation', given: 'Current and past price movements plus calendar features', decision: 'A real-valued price for the next period', benefit: 'Analysts get a valuation range to act on', type: 'regression' },
  { id: 'segment', name: 'Customer segmentation', given: 'Trial-period behaviour vs. all past users', decision: 'Will convert to paid or not', benefit: 'Interventions can target the right trial users', type: 'clustering' },
  { id: 'shape', name: 'Shape detection', given: 'A hand-drawn shape plus known shapes', decision: 'Which shape the user meant to draw', benefit: 'Crisp diagrams replace scribbles', type: 'classification' },
];

// ── Problem-type decision tree ──────────────────────────────────────────────

export const DECISION_QUESTIONS = [
  { id: 'decision', q: 'Does the task hinge on modelling ONE decision from data?', no: 'notml', yes: 'labels' },
  { id: 'labels', q: 'Do you have historical examples labelled with the answer?', no: 'structure', yes: 'real' },
  { id: 'real', q: 'Is the answer a real number rather than a class?', no: 'classification', yes: 'regression' },
  { id: 'structure', q: 'Do you want groups or relationships discovered in unlabelled data?', no: 'notml', groups: 'clustering', relationships: 'rule_extraction' },
];

export const LEAF_NOTES = {
  classification: 'Labelled data, discrete answer — a discrimination problem.',
  regression: 'Labelled data, numeric answer — a valuation problem.',
  clustering: 'Unlabelled data, groups discovered — an organization problem.',
  rule_extraction: 'Unlabelled data, if–then rules discovered — a discovery problem.',
  notml: 'Not (yet) an ML problem: no single decision modelled from data. Collect the decision, the data, and the action first.',
};

export function resolveType(answers) {
  // answers: { decision: 'yes'|'no', labels: 'yes'|'no', real?: 'yes'|'no', structure?: 'groups'|'relationships'|'no' }
  if (answers.decision !== 'yes') return 'notml';
  if (answers.labels === 'yes') return answers.real === 'yes' ? 'regression' : 'classification';
  if (answers.structure === 'groups') return 'clustering';
  if (answers.structure === 'relationships') return 'rule_extraction';
  return 'notml';
}

// ── “Is this actually an ML problem?” checklist ─────────────────────────────

export const ML_CHECKLIST = [
  { id: 'decision', check: 'A single decision is named', weak: '“Make the product smarter”', strong: '“Decide, per transaction, whether it is fraudulent.”' },
  { id: 'data', check: 'Historical examples exist (ideally labelled)', weak: '“We’ll get the data later”', strong: '“Two years of transactions with confirmed outcomes.”' },
  { id: 'action', check: 'Someone acts on the prediction', weak: 'A dashboard nobody opens', strong: 'Refunds auto-issued above a score threshold' },
  { id: 'volume', check: 'The decision recurs at a scale where automation pays', weak: 'Two decisions per quarter', strong: '40,000 decisions per day' },
  { id: 'feedback', check: 'The true answer eventually becomes known', weak: 'Outcomes never recorded', strong: 'Chargebacks land within 30 days, labelled' },
];

// ── The full prompt framework ───────────────────────────────────────────────

export const ML_FRAMING_PROMPT = `ROLE
Act as a pragmatic machine-learning problem advisor.

INPUT
Here is the problem as my team currently describes it:
"[paste the vague request]"

STEPS
1. Restate the request as ONE decision that needs modelling.
2. Fill the framing template:
   Given [data] · identify or predict [decision] · so that [benefit].
3. Classify the problem: classification, regression,
   clustering, or rule extraction — and say why.
4. Name the data actually needed (fields, labels, volume).
5. List 3 checks that would tell us this is NOT worth
   modelling as ML yet.

CONSTRAINTS
- One decision per problem. If you see two, split them.
- If the request has no decision, no data, or no action,
   say so plainly instead of forcing an ML answer.
- End with the single most dangerous assumption.`;

// ── Difficulty spectrum ─────────────────────────────────────────────────────

export const DIFFICULTY_SPECTRUM = [
  { band: 'Classic & well understood', examples: 'Spam detection, digit recognition, card fraud', note: 'Decades of public benchmarks; the hard part is usually data quality, not algorithms' },
  { band: 'Hard but tractable', examples: 'Product recommendation, medical diagnosis support, segmentation', note: 'Strong signal exists, but labels are noisy, private, or expensive to obtain' },
  { band: 'Frontier', examples: 'Open-ended speech understanding, general vision', note: 'Human-easy tasks that resist formalization — treat success as a spectrum, not a bit' },
];

// ── Side concepts ───────────────────────────────────────────────────────────

export const SIDE_CONCEPTS = [
  { id: 'effect', name: 'The AI Effect', icon: '🎣', text: 'Once a system works well enough, it stops being called AI and becomes “just software” — so yesterday’s impossibility is today’s feature.' },
  { id: 'complete', name: 'AI-Complete', icon: '🧱', text: 'Problems whose solution would amount to general intelligence — open-ended language and vision sit here; benchmark them as graded capability, never as a single pass/fail.' },
];

// ── Prompt-builder helper ───────────────────────────────────────────────────

export function buildFramingPrompt({ data, decision, benefit, type }) {
  const t = type ? TYPE_BY_ID[type] : null;
  const head = `Given ${data || '[the data you have]'}, identify or predict ${decision || '[the decision]'}, so that ${benefit || '[the benefit]'}.`;
  if (!t) return `FRAME\n${head}\n\nTYPE\nUnassigned — run the decision tree first.`;
  return `FRAME\n${head}\n\nTYPE\n${t.name} — ${t.essence}\n\nDATA NEEDED\n${t.dataNeeds}\n\nALGORITHM FAMILIES TO TRY\n${t.algorithmHints.map((a) => `· ${a}`).join('\n')}`;
}
