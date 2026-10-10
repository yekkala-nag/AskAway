/**
 * Exit-check bank O — 8 tabs lacking quizzes.
 * Same shape as exitChecks3.js: tabid -> [ { q, o:[x4], a, e }, x3 ].
 */
export const EXIT_CHECKS_O = {
  textclusteringhdbscan: [
    { q: 'The text-clustering pipeline in this tab reduces embeddings from 384 dims to…', o: ['50 dims with no clustering step', '5 dims via UMAP before HDBSCAN', '2 dims for display only, clustering on raw text', '384 dims kept end to end'], a: 1, e: 'Embed (384-dim) → UMAP to 5 dims → HDBSCAN cluster.' },
    { q: 'The HDBSCAN sliders default to min_cluster_size 8 and min_samples 3 because they control…', o: ['How small a dense group can count as a cluster vs how conservative noise labeling is', 'The embedding model choice', 'The number of newsgroup topics in advance', 'The random seed only'], a: 0, e: 'min_cluster_size sets minimum group size; min_samples tunes noise conservatism.' },
    { q: 'Per the comparison table, HDBSCAN beats K-Means for this 150-doc task since it…', o: ['Requires K up front and ignores noise', 'Needs soft density assignments only', 'Runs only on labeled data', 'Auto-discovers cluster count and labels outliers as noise'], a: 3, e: 'No pre-specified K; noise points get label -1 instead of distorting groups.' },
  ],
  agentguardrails: [
    { q: 'The lethal trifecta says danger appears where three conditions meet…', o: ['Reads untrusted content + holds privileged tools/data + has an output channel', 'Uses long prompts + big models + fast GPUs', 'Has logs + metrics + dashboards', 'Reads docs + writes docs + deletes docs'], a: 0, e: 'Untrusted input, harmful capability, channel back out — the intersection is the danger zone.' },
    { q: 'The dual-agent pattern defends by…', o: ['Letting one agent do everything faster', 'Quarantining a tool-less reader that emits only typed variables for a separate privileged orchestrator', 'Removing all authentication checks', 'Merging all sources into one context'], a: 1, e: 'Reader has no tools; orchestrator substitutes variables into a fixed template.' },
    { q: 'The stack-builder simulator warns that even a full six-pattern stack leaves open…', o: ['Direct greeting messages', 'Generated-code variable tampering / sandbox escape, which needs sandbox limits', 'Slow dashboard colors', 'Spelling errors in summaries'], a: 1, e: 'No single pattern closes all 10 vectors; sandbox escape needs its own control.' },
  ],
  progress: [
    { q: 'The Progress Tracker tab organizes learning into…', o: ['15 checklist concepts across 4 groups: RAG, Agents, Frameworks, Production', '3 videos with no checklist', 'A single ungrouped list of 5 items', '10 quizzes with timers'], a: 0, e: 'Four group cards hold the 15 toggleable concepts.' },
    { q: 'Checking off concepts in the tracker persists because state is saved to…', o: ['A remote database on every keystroke', 'In-memory only, reset on reload', 'Local browser storage under a progress key', 'A downloaded CSV file'], a: 2, e: 'Checked state round-trips through localStorage so reloads keep progress.' },
    { q: 'The header of the tracker summarizes completion as…', o: ['Overall percent plus done/total concept counts, with per-group done/total', 'Only a streak flame with no numbers', 'A letter grade A–F', 'Elapsed time in minutes'], a: 0, e: 'Overall pct bar plus done/total; each group shows its own fraction.' },
  ],
  finassistproject: [
    { q: 'In the banking simulator, calling a money tool with a missing or wrong session token…', o: ['Returns balances anyway for demo convenience', 'Returns AUTH_FAILED and logs the call as REJECTED', 'Deletes the audit log', 'Skips straight to loan approval'], a: 1, e: 'The auth gate rejects unauthenticated tool calls before any data is touched.' },
    { q: 'Asking the policy-RAG simulator about wire-transfer fees triggers…', o: ['A loan-eligibility calculation', 'A fabricated fee table with no warning', 'A PII redaction report', 'An out-of-policy response that escalates to a human, since no covering chunk exists'], a: 3, e: 'The trap query finds no policy chunk, so the agent abstains and hands off.' },
    { q: 'The agent-flow visualizer routes “my balance” differently from “what is the monthly fee” because…', o: ['Both always hit the same retrieval node', 'Personal-data intents require an auth check plus account tools, while general questions use document retrieval', 'Balance questions are deleted for safety', 'Fee questions require a session token'], a: 1, e: 'Intent classification splits personal-data, general-info, calculation, and ambiguous paths.' },
  ],
  zerocostmultiagent: [
    { q: 'With only 2 GB of GPU memory, the tab runs large models by…', o: ['Loading full-precision weights entirely on the GPU', 'Loading quantized low-bit weights into system RAM with only a few layers on the GPU', 'Skipping quantization entirely', 'Renting cloud GPUs per query'], a: 1, e: 'Quantized weights live in RAM; the small GPU accelerates a few layers.' },
    { q: 'Lazy loading in this multi-agent design means…', o: ['Keeping all four agents resident forever', 'Instantiating agents only when needed and destroying them after the task logs to shared memory', 'Preloading every model at boot', 'Never shutting anything down'], a: 1, e: 'On-demand spin-up cuts peak RAM versus holding every agent resident.' },
    { q: 'The shared markdown memory pool exists to avoid…', o: ['Writing any files at all', 'Using system RAM', 'Logging task results', 'Bouncing massive context windows between agents on every handoff'], a: 3, e: 'Agents read/write one central pool instead of passing huge windows around.' },
  ],
  aigentools: [
    { q: 'This tab maps the generation landscape into five categories…', o: ['Images, workflows, tables/structured data, animations, simulators', 'Email, chat, search, maps, calendars', 'Train, eval, deploy, monitor, bill', 'Read, write, delete, share, print'], a: 0, e: 'Five selectable categories hold 20+ mapped tools.' },
    { q: 'The tab defines context engineering as the discipline of…', o: ['Buying bigger GPUs', 'Writing longer marketing copy', 'Designing what information the system sees at inference time', 'Compressing video files'], a: 2, e: 'Curated inference-time context turns raw models into reliable tools and cuts drift.' },
    { q: 'The quick-start path in this tab ends with…', o: ['Deleting all generators', 'Building a workflow that chains generators together', 'Disabling simulators permanently', 'Avoiding structured outputs'], a: 1, e: 'Pick a category, try a tool, study context design, then chain generators into a workflow.' },
  ],
  aiharnessquality: [
    { q: 'When retrieval finds nothing relevant, the tab recommends…', o: ['Hallucinating a confident answer', 'Abstaining with an explicit no-answer state or fallback instead of guessing', 'Returning a random cached answer', 'Crashing the pipeline silently'], a: 1, e: 'Abstention logic plus null-return protocols beat confident fabrication.' },
    { q: 'The three pillars callout says quality engineering means…', o: ['Prompt harder, spend more, ship faster', 'Know when to say nothing, constrain before generating, verify before shipping', 'Generate first, log never, test rarely', 'Remove all guardrails for speed'], a: 1, e: 'Stop conditions, output constraints, and pre-ship verification carry quality.' },
    { q: 'Before production, outputs should pass verification such as…', o: ['Golden-dataset comparisons plus adversarial probing and regression suites', 'A single manual glance with no records', 'Vibes and upvotes only', 'Longer prompts with no tests'], a: 0, e: 'Known-correct sets, red-teaming, regression suites, and spot checks certify outputs.' },
  ],
  aiarchdecisions: [
    { q: 'The agent-vs-workflow test in this tab says…', o: ['Always use agents for everything', 'If you can write the steps as pseudocode without a language model, build a workflow; otherwise consider an agent', 'Never use workflows', 'Pick by coin flip'], a: 1, e: 'Deterministic steps with known failure modes stay workflows; ambiguity earns agents.' },
    { q: 'Reach for retrieval over weight updates when…', o: ['Knowledge changes often, sources must be cited, or data exceeds context', 'You need a fixed writing style only', 'Latency budgets forbid any lookup', 'Facts never change'], a: 0, e: 'Fresh, citable, oversized knowledge favors retrieval; style and reasoning patterns favor tuning.' },
    { q: 'The action-primitive heuristic chooses between structured calls and sandboxed code by…', o: ['Schema fit versus need for loops and conditionals', 'Which logo looks nicer', 'Alphabetical order of tool names', 'Team size'], a: 0, e: 'Schema-shaped I/O takes a typed call; branching logic takes sandboxed code execution.' },
  ],
};
