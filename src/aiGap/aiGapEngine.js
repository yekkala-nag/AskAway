// ── AI understanding-gap engine — workplace adoption strategies, finance
// playbook, anti-hype moves, and a deterministic reconciliation lab.
// Original teaching content. No sources, URLs, authors, or brand names.
// Fixture figures are illustrative samples.

export const BRIDGE_STRATEGIES = [
  { n: 1, name: 'Upgrade the tooling', trap: 'Judging frontier AI by free, capped, outdated tiers', action: 'Get the team on frontier-tier access — evaluating a restricted model is testing a different machine' },
  { n: 2, name: 'Shift prompt → context', trap: 'Generic asks ("summarize this") get generic, underwhelming results', action: 'Feed real work artifacts — codebases, messy exports, detailed requirements — and ask for concrete work' },
  { n: 3, name: 'Show, don’t tell', trap: 'Slides and hype videos breed eye-rolls', action: 'A 15-minute live demo on a real workflow: tests written, code refactored, changes explained in front of the team' },
  { n: 4, name: 'Start with verifiable wins', trap: 'Trust is scarce on subjective, unfalsifiable tasks', action: 'Adopt first where right/wrong is obvious: data cleaning, generated queries, docs-from-code, clause checks' },
  { n: 5, name: 'Acknowledge the jaggedness', trap: 'Overselling as magic destroys credibility with skeptics', action: 'Validate the concern out loud, then show the guardrail that prevents exactly that failure' },
];

export const GAP_FRAMES = [
  { label: 'Casual perception', level: 'Quirky chatbot: fun, flaky, occasionally wrong', basis: 'Free, capped, or outdated models' },
  { label: 'Current reality', level: 'Agentic coworker: multi-step, tool-using, work-grade', basis: 'Frontier tiers + deep context + verification loops' },
];

export const FINANCE_PLAYBOOK = [
  { n: 1, name: 'Guardrails before demos', action: 'Define what AI must NOT do first — skeptics relax when the boundaries are explicit', payoff: 'Skepticism turns into engagement once safety is concrete' },
  { n: 2, name: 'Verifiable workflows only', action: 'Start with binary-outcome work: complex spreadsheet formulas, script automation, PDF-to-table formatting', payoff: 'Zero creative trust required — output either matches or it doesn’t' },
  { n: 3, name: 'Show-don’t-tell demo', action: 'Take a public filing, extract themed mentions as quotes with locations, live — 10 seconds vs 15 minutes of skimming', payoff: 'Proves value without asking anyone to trust an "opinion"' },
  { n: 4, name: 'Red-team it yourself', action: 'Hand skeptics a flawed summary, let the model fail openly, then show the grounded prompt that abstains', payoff: 'Passive consumers become critical operators' },
  { n: 5, name: 'Micro-win culture', action: 'Ask: “What repetitive 15-minute task annoyed you this week?” — solve one, live, in the meeting', payoff: 'One saved Friday afternoon creates an internal champion' },
];

export const GUARDRAIL_RULES = [
  { rule: 'No sensitive data in public models', detail: 'Never paste material non-public information or client PII into consumer-grade chat — the rule is absolute, not advisory' },
  { rule: 'Enterprise-approved tooling only', detail: 'Use sanctioned instances where your data is contractually excluded from training' },
  { rule: 'Human-in-the-loop mandate', detail: 'Frame it as a junior analyst at 100× speed that still needs a senior’s sign-off — AI drafts, humans own the number' },
];

export const VERIFIABLE_TASKS = [
  { task: 'Complex spreadsheet formulas', example: 'Lookup a key in one sheet, match an id in another, return a quarter figure — return a sentinel when missing', why: 'Renders in Excel instantly; wrong is visibly wrong' },
  { task: 'Script automation', example: 'Generate a script that cleans a multi-tab export or automates a monthly reconciliation report', why: 'It either runs on the data or it throws' },
  { task: 'PDF dump → structured table', example: 'Paste an unstructured statement dump; get clean CSV or Markdown rows', why: 'Spot-check a few cells and you know it worked' },
  { task: 'Docs from code', example: 'Draft initial documentation or changelog entries straight from source', why: 'Reader compares doc to code in seconds' },
  { task: 'Clause coverage review', example: 'Flag contract clauses that are missing against a checklist', why: 'Missing = present check, binary result' },
];

// ── Reconciliation lab ──────────────────────────────────────────────────────

export const LEDGER_ROWS = [
  { date: '2026-10-15', desc: 'CLOUDHOST WEB SERVICES', amount: -1250.0 },
  { date: '2026-10-16', desc: 'OFFICE SUPPLY #4492', amount: -84.5 },
  { date: '2026-10-17', desc: 'ACH DEP CLIENT INV 9921', amount: 5000.0 },
  { date: '2026-10-18', desc: 'PAYMENT *ACME CORP', amount: -310.25 },
  { date: '2026-10-19', desc: 'WIRE OUT GLOBAL VENDORS', amount: -15000.0 },
];

export const BANK_ROWS = [
  { date: '10/15/26', desc: 'CLOUDHOST*BILLING', amount: -1250.0 },
  { date: '10/17/26', desc: 'OFFICE SUPPLY 4492 NY', amount: -84.5 },
  { date: '10/17/26', desc: 'ACH CREDIT INV 9921', amount: 5000.0 },
  { date: '10/20/26', desc: 'PAYMENT ACME CORP', amount: -310.25 },
  { date: '10/19/26', desc: 'WIRE OUT GLOBAL VEND', amount: -15000.0 },
  { date: '10/21/26', desc: 'UNKNOWN FEE', amount: -15.0 },
];

export function parseDate(s) {
  let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  m = /^(\d{2})\/(\d{2})\/(\d{2})$/.exec(s);
  if (m) return new Date(Date.UTC(2000 + +m[3], +m[1] - 1, +m[2]));
  throw new Error(`unparseable date: ${s}`);
}

const DAY = 86400000;

export function dayDiff(a, b) {
  return Math.round(Math.abs(parseDate(a) - parseDate(b)) / DAY);
}

function money(x) {
  const sign = x < 0 ? '-' : '';
  return `${sign}$${Math.abs(x).toFixed(2)}`;
}

function tokens(s) {
  return new Set(s.toUpperCase().replace(/[^A-Z0-9]+/g, ' ').split(' ').filter(Boolean));
}

export function descriptionOverlap(a, b) {
  const A = tokens(a);
  const B = tokens(b);
  if (!A.size || !B.size) return 0;
  let shared = 0;
  for (const t of A) if (B.has(t)) shared += 1;
  return Math.round((shared / Math.min(A.size, B.size)) * 100) / 100;
}

// Deterministic matcher — no guessing: amount within tol AND date within tol.
export function reconcile({ amountTol = 0.05, dateTol = 2, noiseCents = 0 } = {}) {
  const bank = BANK_ROWS.map((r, i) => ({
    ...r,
    i,
    amount: Math.round((r.amount - Math.sign(r.amount) * (noiseCents / 100)) * 100) / 100,
  }));
  const used = new Set();
  const reconciled = [];
  const unmatchedLedger = [];

  for (const a of LEDGER_ROWS) {
    let best = null;
    for (const b of bank) {
      if (used.has(b.i)) continue;
      const amountDiff = Math.round(Math.abs(a.amount - b.amount) * 100) / 100;
      const days = dayDiff(a.date, b.date);
      if (amountDiff <= amountTol + 1e-9 && days <= dateTol) {
        if (!best || amountDiff < best.amountDiff || (amountDiff === best.amountDiff && days < best.days)) {
          best = { b, amountDiff, days };
        }
      }
    }
    if (best) {
      used.add(best.b.i);
      const reasons = [];
      reasons.push(best.amountDiff === 0 ? 'exact amount' : `amount within ${money(best.amountDiff)} tolerance`);
      reasons.push(best.days === 0 ? 'same date' : `date within ${best.days} day${best.days === 1 ? '' : 's'}`);
      const overlap = descriptionOverlap(a.desc, best.b.desc);
      if (overlap >= 0.34) reasons.push('description overlap');
      reconciled.push({
        ledgerDate: a.date, bankDate: best.b.date,
        ledgerDesc: a.desc, bankDesc: best.b.desc,
        amount: a.amount, reason: reasons.join(', '),
      });
    } else {
      unmatchedLedger.push(a);
    }
  }

  const exceptions = [
    ...bank.filter((b) => !used.has(b.i)).map((b) => ({
      source: 'Bank', date: b.date, desc: b.desc, amount: b.amount,
      reason: 'No corresponding entry in the ledger.',
    })),
    ...unmatchedLedger.map((a) => ({
      source: 'Ledger', date: a.date, desc: a.desc, amount: a.amount,
      reason: 'No entry within tolerances in the bank statement.',
    })),
  ];

  return { reconciled, exceptions, noiseCents, amountTol, dateTol };
}

export const RECON_PROMPT = `SYSTEM INSTRUCTIONS
You are a deterministic reconciliation tool.
Do not estimate, do not add external knowledge,
do not round numbers unless explicitly instructed.
Compare List A and List B by these rules only:

1. MATCH if |amountA - amountB| <= $TOLERANCE
   AND |dateA - dateB| <= $DAY_TOLERANCE calendar days.
2. Matching rows → "Reconciled" table.
3. Non-matching rows → "Exceptions" table.
4. If unsure → flag "Manual Review Required".
   Do not guess.

OUTPUT
Two tables: Reconciled, Exceptions —
every row carries its match reason (or exception reason).`;

export function timeSaved(manualMinutes = 30, aiSeconds = 5) {
  const manualSec = manualMinutes * 60;
  if (aiSeconds <= 0) throw new Error('aiSeconds must be > 0');
  return {
    manualSec, aiSeconds, savedMinutes: Math.round((manualSec - aiSeconds) / 60),
    speedup: Math.round(manualSec / aiSeconds),
  };
}

// ── Red-team prompt discipline ──────────────────────────────────────────────

export const RED_TEAM_TEXT = 'Section 3 notes supplier delays of 6 weeks. Section 7 states Q3 margin fell 2 points. No forward guidance appears anywhere in the document.';

export const RED_TEAM_PROMPTS = [
  {
    id: 'open',
    label: '“Summarize the risks.”',
    verdict: 'fail',
    result: 'Invented a supply-contract penalty risk that appears nowhere in the text — confident, plausible, fabricated.',
    lesson: 'Open-ended asks on thin inputs are how hallucinations walk into a deck.',
  },
  {
    id: 'grounded',
    label: '“Using ONLY the text below… if absent, state ‘Information not present’… cite the section.”',
    verdict: 'pass',
    result: 'Reports the 6-week delay (Section 3) and the 2-point margin drop (Section 7); declines everything else with “Information not present.”',
    lesson: 'Grounding + abstention + citations = prompt discipline the team can audit.',
  },
  {
    id: 'half',
    label: '“Summarize, and be accurate.”',
    verdict: 'warn',
    result: 'Mostly faithful, but adds a hedge about “possible further margin erosion” not present in the text — no citation, so nobody caught it.',
    lesson: 'Vague accuracy adjectives are not guardrails; explicit source-bounds are.',
  },
];

// ── Anti-hype playbook ──────────────────────────────────────────────────────

export const ANTI_HYPE_MOVES = [
  { name: 'Silent builder', action: 'Pick the most overloaded person; quietly do their Monday chore with a tool and hand over the finished file', why: 'You removed a pain point without charging them attention or training time — curiosity does the rest' },
  { name: 'Diagnose the real blocker', action: 'Ask flat-out: “What is the actual reason we aren’t using this — IT, compliance, or time?”', why: 'Most resistance is structural, not a mindset to be changed' },
  { name: 'Ban the word “AI”', action: 'Pitch the outcome: “Reconciliation formatting went from 45 minutes to 5 — want to see how?”', why: 'People care about going home on Friday, not about the technology stack' },
  { name: 'Boring template, not workshop', action: 'Ship one locked-down prompt that does exactly one thing: paste messy rows → get four named columns, nothing else', why: 'Foolproof and narrow leaves zero room for a model to wander' },
];

export const BLOCKERS = [
  { quote: 'IT hasn’t approved a secure tool — I’m not risking my job pasting client data into a website.', valid: true, realFix: 'Escalate tooling approval; hand them a sanctioned instance instead of a mindset lecture' },
  { quote: 'I already work 50-hour weeks; I don’t have 3 hours to experiment with prompts.', valid: true, realFix: 'Do the setup for them — the template arrives pre-built, zero exploration cost' },
  { quote: 'Last time it invented a number and I burned an hour fact-checking it.', valid: true, realFix: 'Constrain to verifiable tasks with source-bounded prompts; keep the human sign-off' },
];

export const OUTCOME_FRAMING = [
  { before: '“We need to leverage AI to streamline our reconciliation workflow.”', after: '“I cut monthly reconciliation formatting from 45 minutes to 5. Want to see how?”' },
  { before: '“Let’s run an AI innovation workshop.”', after: '“Here’s a locked-down template that turns any messy CSV into four clean columns.”' },
  { before: '“It’s like a super-fast junior analyst.”', after: '“I already ran this week’s file — it’s done. Want the output?”' },
];

export const MICRO_WIN_QUESTIONS = [
  { prompt: '“What is the most annoying, repetitive 15-minute task you did this week?”', next: 'Pick one or two — solve it live in the meeting, in ten minutes' },
  { prompt: '“Which file does everyone quietly dread touching?”', next: 'Turn the dread file into the boring template' },
];
