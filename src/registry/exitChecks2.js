/**
 * Exit-check bank B — Phase P3. Foundations remainder + RAG core/advanced
 * + Context + first agent batch. Same shape as exitChecks.js.
 */
export const EXIT_CHECKS_B = {
  reinforcementlearning: [
    { q: 'An MDP frames problems as…', o: ['States, actions, rewards, transitions', 'Prompts and completions', 'Tables and joins', 'Pixels and labels'], a: 0, e: 'Markov framing turns sequential decisions into optimizable policies.' },
    { q: 'PPO stays stable by…', o: ['Clipping policy updates to a trust region', 'Bigger learning rates', 'No clipping', 'Random restarts'], a: 0, e: 'Clipped surrogates prevent destructively large steps.' },
    { q: 'Consumer RL (pricing, NBA) differs by…', o: ['Reward design + constraints dominate algorithms', 'Using no data', 'Ignoring latency', 'Bigger models only'], a: 0, e: 'In production RL, the reward IS the product spec.' },
    { q: 'A Q-table stores…', o: ['Expected long-term payoff per board-and-move pair', 'The rules of the game', 'Win counts only', 'Random seeds'], a: 0, e: 'Tabular values replace the network for small games.' },
    { q: 'Alpha and gamma control…', o: ['How fast new experience overwrites old values vs how much future rewards count', 'Board size vs move count', 'Wins vs draws', 'Speed vs memory'], a: 0, e: 'Alpha weights the update; gamma discounts the future.' },
    { q: 'Heavy invalid-move penalties…', o: ['Train illegal moves out fast via strongly negative rewards', 'Slow learning', 'Break exploration', 'Only affect draws'], a: 0, e: 'Shaped rewards teach legality before strategy.' }
  ],
  aimoralagency: [
    { q: 'Functional vs experiential caring…', o: ['Behaves caringly vs feels concern', 'Fast vs slow models', 'Open vs closed weights', 'Same thing'], a: 0, e: 'Alignment evaluates behavior; experience claims are untestable.' },
    { q: 'Constitutional AI steers via…', o: ['Principles + self-critique loops', 'Bigger datasets only', 'Human labels per output', 'Faster GPUs'], a: 0, e: 'Explicit principles beat implicit vibes at scale.' },
    { q: 'First alignment check for agents…', o: ['Refusal + scope evals before autonomy', 'Speed tests', 'Cost audits', 'UI polish'], a: 0, e: 'Prove restraint before granting reach.' }
  ],
  dialoguelamda: [
    { q: 'LaMDA SSI stands for…', o: ['Sensibleness, Specificity, Interestingness', 'Speed, Size, Intelligence', 'Search, Summarize, Infer', 'None'], a: 0, e: 'Sensible + specific beats sensible-but-generic.' },
    { q: 'Tool grounding fixes…', o: ['Hallucinated facts via retrieval', 'Slow typing', 'High cost', 'Bad UI'], a: 0, e: 'Ground claims or refuse them.' },
    { q: 'Open-domain eval needs…', o: ['Human + interactive judgments', 'BLEU alone', 'No eval', 'Latency only'], a: 0, e: 'Static metrics miss conversational quality.' }
  ],
  modellandscape: [
    { q: 'Open vs closed tradeoff centers on…', o: ['Control/cost vs frontier quality', 'Color schemes', 'Speed only', 'Nothing'], a: 0, e: 'Own the weights or rent the frontier — decide per workload.' },
    { q: 'Test-time compute helps…', o: ['Reasoning models spending more per query', 'Training only', 'Smaller contexts', 'Cheaper tokens'], a: 0, e: 'Inference scaling: pay per hard question, not per param.' },
    { q: 'Router picks models by…', o: ['Difficulty, cost, latency signals', 'Random choice', 'Alphabetical', 'Newest always'], a: 0, e: 'Route easy calls down, hard calls up.' }
  ],
  structuredoutputs: [
    { q: 'Constrained decoding guarantees…', o: ['Schema-valid output by construction', 'Better ideas', 'Lower cost always', 'Faster training'], a: 0, e: 'Grammar-masked tokens cannot violate the schema.' },
    { q: 'Pydantic + instructor give…', o: ['Validated, typed retries', 'Free inference', 'Bigger context', 'No validation'], a: 0, e: 'Parse, validate, reprompt on failure — typed loop.' },
    { q: 'Logit masking risks…', o: ['Over-constraining valid diversity', 'Nothing', 'Higher cost always', 'Slower training'], a: 0, e: 'Tight grammars can strangle legitimate variation.' }
  ],
  topicmodeling: [
    { q: 'Seeded topic modeling injects…', o: ['Analyst priors as seed terms', 'Random noise', 'More GPUs', 'Longer docs'], a: 0, e: 'Guide discovery without dictating it.' },
    { q: 'LLM summarization layer adds…', o: ['Human-readable topic labels', 'More topics only', 'Speed', 'Nothing'], a: 0, e: 'Top-words become narratives a stakeholder trusts.' },
    { q: 'Trend tracking needs…', o: ['Time-binned assignments', 'Single snapshot', 'No timestamps', 'Guessing'], a: 0, e: 'Topics move; slice by time to see drift.' }
  ],
  workflows: [
    { q: 'Prompt chaining wins when…', o: ['Steps are verifiable independently', 'Tasks are trivial', 'Latency is free', 'Never'], a: 0, e: 'Each link needs its own check, or errors compound.' },
    { q: 'Chain failure mode…', o: ['Silent drift across steps', 'Loud crashes only', 'No failures', 'Cost drops'], a: 0, e: 'Validate handoffs with schemas, not hope.' },
    { q: 'Parallel chains need…', o: ['Merge + conflict ownership', 'More prompts', 'Blind trust', 'No limits'], a: 0, e: 'Branches must reconcile somewhere.' }
  ],
  unhobbling: [
    { q: '“Unhobbling” means…', o: ['Removing capability blocks to test true limits', 'Adding guardrails', 'Slowing models', 'Cutting cost'], a: 0, e: 'Eval the ceiling before governing the floor.' },
    { q: 'Capability evals precede…', o: ['Deployment and autonomy decisions', 'Marketing', 'Pricing', 'Nothing'], a: 0, e: 'Know what it CAN do before deciding what it MAY do.' },
    { q: 'Reasoning transparency helps…', o: ['Audit and debugging', 'Speed', 'Cost', 'Hiding logic'], a: 0, e: 'Visible traces are debuggable traces.' }
  ],
  aiharness: [
    { q: 'KV cache exists to…', o: ['Skip recomputing prefixes at decode', 'Store prompts', 'Train faster', 'Compress weights'], a: 0, e: 'Memory for speed on every token after the first.' },
    { q: 'GQA balances…', o: ['Quality vs KV memory across heads', 'Nothing', 'Speed vs cost only', 'Layers vs width'], a: 0, e: 'Grouped queries shrink cache with minimal quality loss.' },
    { q: 'RLHF → DPO shift…', o: ['Direct preference loss, no reward model', 'More RL', 'No alignment', 'Bigger data only'], a: 0, e: 'Simpler objective, fewer moving parts.' }
  ],
  promptlearning: [
    { q: 'English feedback (critique) loops…', o: ['Rewrite prompts from natural-language critiques', 'Fine-tune weights', 'Add GPUs', 'Translate prompts'], a: 0, e: 'Language as gradient for instructions.' },
    { q: 'Voyager-style lifelong learning…', o: ['Skill library compounding over tasks', 'Single prompt', 'No memory', 'Manual only'], a: 0, e: 'Verified skills become reusable tools.' },
    { q: 'Meta-prompts risk…', o: ['Drift from the real objective', 'Nothing', 'Speed', 'Cost only'], a: 0, e: 'Optimizing the optimizer needs grounding evals.' }
  ],
  hierrag: [
    { q: 'Hierarchical retrieval (TOC/tree) wins when…', o: ['Corpus has real structure to exploit', 'Docs are flat', 'Corpus is tiny', 'Never'], a: 0, e: 'Route down the tree instead of searching the pile.' },
    { q: 'Summary-first routing…', o: ['Searches summaries, then drills into winners', 'Skips retrieval', 'Embeds everything twice wastefully', 'Guesses'], a: 0, e: 'Coarse-to-fine beats flat top-k on structured corpora.' },
    { q: 'Tree staleness…', o: ['Requires rebuilds on corpus change', 'Never matters', 'Self-heals', 'Only affects speed'], a: 0, e: 'Version the index with the bytes.' }
  ],
  prodrag: [
    { q: 'Production PDF extraction must handle…', o: ['Scans, layouts, tables, OCR confidence', 'Plain text only', 'English only', 'Small files only'], a: 0, e: 'Enterprise PDFs are hostile; parsers must be layered.' },
    { q: 'Extraction confidence drives…', o: ['Escalation to stronger parsers', 'Nothing', 'Lower cost', 'Faster GPUs'], a: 0, e: 'Adaptive escalation (Art.10 cascade) spends where needed.' },
    { q: 'Highlight/citation back to source…', o: ['Requires geometry (bboxes) preserved', 'Is automatic', 'Needs no parsing', 'Is cosmetic'], a: 0, e: 'No bbox, no trustworthy cite.' }
  ],
  routercheap: [
    { q: 'Zero-model router decides with…', o: ['Deterministic signals (length, scope, margin) — no LLM call', 'A flagship model', 'Coin flips', 'User tier'], a: 0, e: 'Fast path without spending a token.' },
    { q: 'Margin-based routing…', o: ['Sends low-confidence gaps to bigger models', 'Sends everything up', 'Sends everything down', 'Ignores confidence'], a: 0, e: 'Pay flagship prices only past the margin.' },
    { q: 'Fast-path risk…', o: ['Misrouted hard queries — measure', 'No risk', 'High cost', 'Latency'], a: 0, e: 'Sample and eval the boundary continuously.' }
  ],
  genpatterns: [
    { q: 'Generation contracts (typed) catch…', o: ['Extraction errors as schema violations', 'Slow disks', 'Bad fonts', 'High bills'], a: 0, e: 'Most hallucinations are untyped extraction slips.' },
    { q: 'Cite-or-refuse…', o: ['Forces grounding or abstention', 'Forces longer answers', 'Slows everything pointlessly', 'Removes citations'], a: 0, e: 'No evidence → no claim. The reliability invariant.' },
    { q: 'Pattern count 7 exists because…', o: ['Failure modes cluster into types', 'Marketing', 'Random choice', 'Model count'], a: 0, e: 'Typed failures get typed fixes.' }
  ],
  fourpdfs: [
    { q: 'One pipeline over four PDFs proves…', o: ['Generality across layouts, not overfitting one doc', 'Speed records', 'Cost minimums', 'Nothing'], a: 0, e: 'Benchmarks must span the corpus variety.' },
    { q: 'Per-PDF score variance signals…', o: ['Layout-specific weaknesses to fix', 'Success', 'Random noise only', 'Model size issues'], a: 0, e: 'Slice evals by document, not just average.' },
    { q: 'Shared pipeline + per-doc adapters…', o: ['Balance reuse with layout quirks', 'Overfit everything', 'Duplicate code', 'Skip evals'], a: 0, e: 'Common core, local exceptions.' }
  ],
  hallucbricks: [
    { q: 'Four verification bricks…', o: ['Independent checks composing into trust', 'Four models', 'Four prompts', 'Four vendors'], a: 0, e: 'Defense in depth for generation.' },
    { q: 'Verification order…', o: ['Cheap deterministic checks first', 'LLM judges first', 'No order', 'Human first always'], a: 0, e: 'Spend model calls only on what rules cannot catch.' },
    { q: 'Brick failure should…', o: ['Block or escalate, never silent-pass', 'Log and continue', 'Retry forever', 'Alert weekly'], a: 0, e: 'Verification that cannot stop is decoration.' }
  ],
  workflowloop: [
    { q: 'Dispatcher decides…', o: ['Loop vs stop per step (should_continue)', 'Model choice', 'Pricing', 'UI theme'], a: 0, e: 'Bounded iteration with explicit exit conditions.' },
    { q: 'Drift detection…', o: ['Compares new output to trajectory, halts divergence', 'Ignores history', 'Speeds loops', 'Cuts cost only'], a: 0, e: 'Loops need tripwires, not just counters.' },
    { q: 'Audit trail per loop…', o: ['Makes retries explainable', 'Wastes storage', 'Slows models', 'Optional luxury'], a: 0, e: 'Every iteration logged with reason and result.' }
  ],
  proxypointer: [
    { q: 'Proxy-pointer keeps…', o: ['Skeleton tree + breadcrumb injection for scale', 'Full docs in context', 'No structure', 'Only vectors'], a: 0, e: 'Structure meets scale: navigate, then fetch.' },
    { q: 'Pointer map (FAISS)…', o: ['Jumps from breadcrumb to exact span', 'Replaces parsing', 'Stores prompts', 'Bills users'], a: 0, e: 'Indirection keeps context small and precise.' },
    { q: 'Noise filter role…', o: ['Cheap model drops junk before flagship reads', 'Increases cost', 'Slows everything', 'Optional'], a: 0, e: 'Frugal pre-filter, expensive judgment.' }
  ],
  agenticrag: [
    { q: 'Agentic RAG differs by…', o: ['Letting the agent drive multi-step search', 'Bigger chunks', 'No retrieval', 'One-shot only'], a: 0, e: 'Search becomes a tool loop, not a pipeline stage.' },
    { q: 'Trace value…', o: ['Debuggable, auditable search decisions', 'Higher cost only', 'Slower answers only', 'None'], a: 0, e: 'Every hop logged with reason.' },
    { q: 'Loop cap…', o: ['Hard bound on search iterations', 'Unlimited', 'User-set only', 'Unneeded'], a: 0, e: 'Open-ended search needs a ceiling + escalation.' }
  ],
  ragcasestudies: [
    { q: 'Case studies teach…', o: ['Blueprint selection per corpus shape', 'Copy-paste code', 'Vendor choice', 'Pricing'], a: 0, e: 'Architecture follows corpus, not hype.' },
    { q: 'Enterprise RAG fails most on…', o: ['Corpus mismatch + missing evals', 'Model size', 'UI design', 'Latency decimals'], a: 0, e: 'Wrong shape + unmeasured quality sink projects.' },
    { q: 'Blueprint includes…', o: ['Pseudocode + architecture + eval plan', 'Marketing copy', 'Bills only', 'Resumes'], a: 0, e: 'Buildable, measurable, reviewable.' }
  ],
  interviewprep: [
    { q: 'Chunking interview answer…', o: ['Boundaries matter more than size', 'Bigger is better', 'Overlap is harmful', 'Size is everything'], a: 0, e: 'Semantic units beat token counts.' },
    { q: 'Reranker interview answer…', o: ['Precision layer over recall base', 'Replaces retrieval', 'Only for speed', 'Never needed'], a: 0, e: 'Recall broad, rerank ruthless.' },
    { q: 'Eval interview answer…', o: ['Faithfulness gates shipping', 'Vibes suffice', 'Latency only', 'Cost only'], a: 0, e: 'Ungrounded = unshippable.' }
  ],
  rowlevelrag: [
    { q: 'Unit mismatch: tables vs questions…', o: ['Retrieve rows, not whole tables, for lookups', 'Always full tables', 'Never chunk tables', 'Only headers'], a: 0, e: 'Match retrieval unit to question unit.' },
    { q: 'Header:Value serialization…', o: ['Makes rows self-describing sentences', 'Wastes tokens', 'Breaks search', 'Hides values'], a: 0, e: 'Rows read standalone with headers attached.' },
    { q: 'Dual-scale index…', o: ['Geometry + row chunks for both query types', 'Double cost, no gain', 'Slower always', 'Unneeded'], a: 0, e: 'Overview queries use tables; lookups use rows.' }
  ],
  graphtraversalknowledge: [
    { q: 'Always-fused means…', o: ['Graph + vector signals combined per query', 'Graph only', 'Vectors only', 'No retrieval'], a: 0, e: 'Relations disambiguate what similarity confuses.' },
    { q: 'Bitemporal edges…', o: ['valid_from/to keep traversals version-correct', 'Double storage waste', 'Speed hack', 'Unneeded'], a: 0, e: 'Time-valid graphs never cross versions.' },
    { q: 'Entity resolution prevents…', o: ['Split/duplicate nodes corrupting hops', 'Slow queries', 'High cost', 'Bad UI'], a: 0, e: 'One entity, one node — or traversals lie.' }
  ],
  ragcorpusshapes: [
    { q: 'Three corpus shapes…', o: ['Unrelated pile, homogeneous typed, case bundles', 'Big, medium, small', 'PDF, HTML, TXT', 'Fast, slow, broken'], a: 0, e: 'Shape dictates architecture before any embedding.' },
    { q: 'Flat-pile failure #1…', o: ['Vocabulary drift misses candidates', 'High cost', 'Slow disks', 'Bad fonts'], a: 0, e: 'Query words ≠ source words without bridging.' },
    { q: 'Three diagnostic questions determine…', o: ['Relations, universal fields, bundles → shape', 'Model choice', 'Pricing', 'UI layout'], a: 0, e: 'Answer business questions before writing ingestion code.' }
  ],
  ctxmeasure: [
    { q: 'Context quality metric #1…', o: ['Recall of needed facts in context', 'Token count', 'Latency', 'Cost'], a: 0, e: 'Right pages present beats everything else.' },
    { q: 'Noise ratio…', o: ['Irrelevant tokens dilute attention', 'Helpful context', 'Speed boost', 'Cost saver'], a: 0, e: 'Measure signal, cut the rest.' },
    { q: 'Measure per…', o: ['Question type, not just average', 'Day of week', 'Model brand', 'User tier'], a: 0, e: 'Slice quality by query shape.' }
  ],
  hallucination: [
    { q: 'Silent loop danger…', o: ['Confident, cited-looking, wrong answers', 'Loud errors', 'Slow responses', 'High bills'], a: 0, e: 'Failure without signals is the worst kind.' },
    { q: 'Detection needs…', o: ['Independent verification, not self-checks', 'Higher temperature', 'Longer prompts', 'Trust'], a: 0, e: 'Models cannot reliably audit themselves.' },
    { q: 'Break the loop by…', o: ['Grounding gates + abstention paths', 'More tokens', 'Faster models', 'Ignoring it'], a: 0, e: 'No evidence → no claim, enforced.' }
  ],
  contextgraph: [
    { q: 'Context graph stores…', o: ['Stateful memory as linked context nodes', 'Model weights', 'Bills', 'Logs only'], a: 0, e: 'Memory with structure beats memory as pile.' },
    { q: 'Multi-agent memory needs…', o: ['Shared graph with access scopes', 'Private piles only', 'No memory', 'Full sharing'], a: 0, e: 'Scoped sharing prevents cross-talk leaks.' },
    { q: 'Stale nodes…', o: ['Tombstoned, never silently edited', 'Deleted quietly', 'Ignored', 'Duplicated'], a: 0, e: 'History preserved, validity explicit.' }
  ],
  companybrain: [
    { q: 'Company brain layer…', o: ['Curated org knowledge over raw docs', 'A bigger model', 'A chatbot skin', 'Email search'], a: 0, e: 'Curation is the product, not the corpus.' },
    { q: 'Freshness requires…', o: ['TTL + ownership per fact', 'Hope', 'Bigger windows', 'More prompts'], a: 0, e: 'Every fact has an owner and an expiry.' },
    { q: 'Access control…', o: ['RBAC at retrieval, not just UI', 'UI hiding only', 'None needed', 'Per model'], a: 0, e: 'Leaks happen at retrieval; enforce there.' }
  ],
  claudecode100: [
    { q: '100+ tasks need…', o: ['Triage + bifurcation + worktrees', 'One big prompt', 'Hope', 'Manual work'], a: 0, e: 'Decompose, isolate, verify at scale.' },
    { q: 'Worktrees give…', o: ['Parallel isolated task environments', 'Faster models', 'Cheaper tokens', 'Better prompts'], a: 0, e: 'Isolation prevents cross-task contamination.' },
    { q: 'Verification reports…', o: ['Prove completion per task', 'Slow things down pointlessly', 'Replace tests', 'Are optional'], a: 0, e: 'Scale without proof is scale of risk.' }
  ],
  typedagentgate: [
    { q: 'Typed tools enforce…', o: ['Schemas + hard bounds at call time', 'Faster calls', 'Bigger context', 'No validation'], a: 0, e: 'Types are contracts agents cannot wiggle past.' },
    { q: 'Composer gate…', o: ['Approves multi-tool plans pre-execution', 'Writes code', 'Trains models', 'Bills users'], a: 0, e: 'Review the plan, not just the acts.' },
    { q: 'Contradiction refusal…', o: ['Escalates on disagreeing tools', 'Guesses anyway', 'Retries forever', 'Ignores tools'], a: 0, e: 'Disagreement is information — surface it.' }
  ],
  agentpairprogramming: [
    { q: 'Task decomposition first because…', o: ['Agents execute slices, humans own seams', 'Agents need big tasks', 'Humans are slow', 'Reviews waste time'], a: 0, e: 'Small verifiable units compose safely.' },
    { q: 'Context injection…', o: ['Feeds repo truth per task', 'Dumps everything', 'Skips docs', 'Guesses APIs'], a: 0, e: 'Relevant context, not maximal context.' },
    { q: 'Test-driven pairing…', o: ['Tests define done before code', 'Slows shipping', 'Replaces review', 'Optional'], a: 0, e: 'Executable specs gate agent output.' }
  ],
  cliagent: [
    { q: 'Local CLI agents (Ollama/Qwen) win on…', o: ['Privacy + offline + zero per-call cost', 'Frontier quality', 'Speed records', 'Huge context'], a: 0, e: 'Local-first for sensitive, routine work.' },
    { q: 'Subprocess boundary…', o: ['Isolates tool effects from the model', 'Slows everything', 'Unneeded', 'Breaks tools'], a: 0, e: 'Execute outside, reason inside.' },
    { q: 'Escalation trigger…', o: ['Capability or confidence threshold', 'Always escalate', 'Never escalate', 'Random'], a: 0, e: 'Local handles routine; cloud takes the hard.' }
  ],
  multiagent: [
    { q: 'Handoffs need…', o: ['Typed artifacts + ownership', 'Verbal agreements', 'Shared memory only', 'Trust'], a: 0, e: 'Contracts between agents prevent skew.' },
    { q: 'Orchestration failure mode…', o: ['Bottleneck leader / message explosion', 'No failures', 'Slow disks', 'Bad fonts'], a: 0, e: 'Topology is a cost and reliability decision.' },
    { q: 'Swarm vs pipeline…', o: ['Exploratory vs stable flows', 'Same thing', 'Bigger vs smaller', 'Old vs new'], a: 0, e: 'Match topology to task stability.' }
  ],
  langchain: [
    { q: 'LCEL composes…', o: ['Runnables with pipes, batch, stream', 'Raw strings', 'SQL only', 'No composition'], a: 0, e: 'Uniform interface enables streaming + fallback.' },
    { q: 'Chains fail silently via…', o: ['Unvalidated handoffs', 'Loud errors only', 'Slow disks', 'Bad UI'], a: 0, e: 'Schema every seam.' },
    { q: 'LangChain vs direct SDK…', o: ['Velocity + ecosystem vs control', 'Always better', 'Always worse', 'Same'], a: 0, e: 'Abstractions price control; choose consciously.' }
  ],
  langgraph: [
    { q: 'StateGraph adds…', o: ['Named state + edges + checkpointing', 'Bigger prompts', 'More tokens', 'No state'], a: 0, e: 'Stateful graphs survive long, branching work.' },
    { q: 'Checkpointing enables…', o: ['Pause, resume, time-travel debug', 'Faster training', 'Cheaper calls', 'No benefit'], a: 0, e: 'Durable execution for durable tasks.' },
    { q: 'HITL in graphs…', o: ['Interrupt points before sensitive nodes', 'Impossible', 'Manual only', 'Unneeded'], a: 0, e: 'Gates as first-class graph nodes.' }
  ]
};
