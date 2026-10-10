/**
 * Exit-check bank L — enforcement hooks, org chart, refactor health,
 * sync/async execution, forecasting traps, AI learning, reversal curse,
 * agent creativity.
 * Same shape as exitChecks.js.
 */
export const EXIT_CHECKS_L = {
  functionalscars: [
    { q: 'Corrections need four layers because…', o: ['Notes cover record, re-find and read — only an on-path check applies', 'Models cannot read files', 'Hooks are faster than prompts', 'Logs need more volume'], a: 0, e: 'Layers 1–3 inform; layer 4 enforces on the action path.' },
    { q: 'Strongest intervention in the ladder…', o: ['A context hint before answering', 'A pre-call denial — the call never happens', 'A post-call report', 'A weekly review'], a: 1, e: 'Denial prevents the effect; hints and reports only observe it.' },
    { q: 'Every scar needs…', o: ['A retirement date — upstream fixes and drift obsolete rules', 'A larger model', 'More examples in the prompt', 'A dashboard'], a: 0, e: 'Unretired checks become false-positive machines.' }
  ],
  agentorgchart: [
    { q: 'A role differs from a worker in that…', o: ['The role is the job definition; the worker (human or AI) fills it', 'Workers outrank roles', 'Roles are only for humans', 'They are synonyms'], a: 0, e: 'Define jobs first, then hire human or AI into them.' },
    { q: 'One desk per agent because…', o: ['Shared checkouts let one agent clobber everyones work', 'Desks are cheaper', 'Agents prefer windows', 'Reviews go faster'], a: 0, e: 'Isolation turns cross-agent damage from possible to impossible.' },
    { q: 'Office politics in agent orgs comes from…', o: ['Over-broad roles — keep roles tight and scale via a task board', 'Too many humans', 'Slow models', 'Small contexts'], a: 0, e: 'Scale by jobs-to-be-done, not by job title.' }
  ],
  refactorhealth: [
    { q: 'The health score is a weighted sum so that…', o: ['The lowest sub-score tells you where to work next', 'The number always rises', 'Duplication counts triple', 'Grades look scientific'], a: 0, e: 'One number for the trend, sub-scores for the action.' },
    { q: 'Each loop iteration ends with…', o: ['A measurement in a clean worktree plus a separate commit', 'A rewrite of the module', 'A new feature', 'A longer test suite only'], a: 0, e: 'Measure → fix one thing → test → commit → measure again.' },
    { q: 'A score that can only go up…', o: ['Is lying — honest instruments must be able to fall', 'Proves velocity', 'Needs no tests', 'Should ship'], a: 0, e: 'Legitimate stops (missing tests) are part of the method.' }
  ],
  synasyncagent: [
    { q: 'Synchronous execution breaks when…', o: ['The agent run outlasts the callers timeout — connection drops, tokens burn', 'Two tools are used', 'The queue fills', 'Workers restart'], a: 0, e: 'Blocked threads plus long reasoning loops equal dropped work.' },
    { q: 'Async fire-and-forget decouples…', o: ['Submission from completion via job id, queue, workers and checkpoints', 'Prompts from models', 'Tools from schemas', 'Users from billing'], a: 0, e: 'Return the id now; deliver the result when ready.' },
    { q: 'Choose async when…', o: ['Tasks run long and callers tolerate waiting for a notification', 'Every answer is instant', 'No state exists', 'One tool suffices'], a: 0, e: 'Duration × latency tolerance is the whole decision.' }
  ],
  forecasttraps: [
    { q: 'A feature unknowable at forecast time…', o: ['Looks brilliant offline and is useless live — exclude it', 'Should be kept with a caveat note', 'Helps if lagged once', 'Only matters for small data'], a: 0, e: 'A warning the model ignores is not a fix.' },
    { q: 'Reporting delay means…', o: ['Only values older than the delay window are legal inputs', 'Recent values are fine with care', 'Delays average out', 'Holdouts fix it'], a: 0, e: 'Shift features past the delay or leak the future.' },
    { q: 'A reported error far below the noise floor…', o: ['Is a symptom of leakage, not a success', 'Proves a great model', 'Needs a bigger test set', 'Calls for ensembling'], a: 0, e: 'No forecaster beats irreducible noise honestly.' }
  ],
  ailearning: [
    { q: 'Voice mode fits the start of learning because…', o: ['It externalizes half-formed thoughts when exploration beats precision', 'It transcribes faster', 'It replaces reading', 'It tests recall'], a: 0, e: 'Unknown-unknowns need organizing, not quizzing.' },
    { q: 'A reusable skill needs…', o: ['Purpose, inputs, process, output format and quality checks', 'A catchy name only', 'Model weights', 'A calendar'], a: 0, e: 'Five fields turn a good prompt into a repeatable workflow.' },
    { q: 'Spaced repetition + active recall work by…', o: ['Resurfacing at growing intervals and retrieving (not rereading)', 'Reading twice', 'Highlighting more', 'Longer sessions'], a: 0, e: 'Retrieve from memory on schedule; recognition is not recall.' }
  ],
  reversalcurse: [
    { q: 'The reversal curse says…', o: ['A fact learned as A-is-B may not reverse to B-is-A on recall', 'Models cannot learn names', 'Bigger models forget more', 'Prompts fix training'], a: 0, e: 'Recall is directional; nothing warns you at query time.' },
    { q: 'Mechanically it happens because…', o: ['Training updates the subject-side representation, never the answer side as subject', 'Embeddings are too small', 'Softmax is biased', 'Data is dirty'], a: 0, e: 'Untrained-as-subject notes stay near their starting values.' },
    { q: 'Practical defense…', o: ['Ask both directions and train or retrieve both orders', 'Use a larger model only', 'Lower the temperature', 'Add examples'], a: 0, e: 'Symmetry must be built in — scale alone stays flat.' }
  ],
  agentcreativity: [
    { q: 'Creativity here means…', o: ['Original (self + human novelty) and useful (impact, feasibility-gated)', 'Novelty alone', 'High scores alone', 'Long runs'], a: 0, e: 'Novelty without impact is trivia; impact without novelty is routine.' },
    { q: 'Agents typically move…', o: ['From exploration to exploitation within the first few episodes', 'From exploitation to exploration', 'Randomly forever', 'Nowhere'], a: 0, e: 'Novelty declines steeply while impact flattens.' },
    { q: 'High human-novelty with low impact shows…', o: ['Agents reach novel territory but cannot convert it — optimize both', 'The metric is broken', 'Humans are uncreative', 'Judges are biased'], a: 0, e: 'Dual-optimize novelty AND impact under a feasibility gate.' }
  ]
};
