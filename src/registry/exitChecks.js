/**
 * Exit-check bank — Phase 3. Three questions per topic: prove, don't claim.
 * Format: { q, o: [4 options], a: correct index, e: explanation }.
 * Coverage: all P0/P1/P2 tabs + all L1 entry topics. Remaining topics
 * fall back to visit-based scoring until their checks land.
 */
export const EXIT_CHECKS = {
  // ── New tabs: chunking + article trio ──
  ragchunking: [
    { q: 'Fixed-size chunking hurts retrieval mainly because…', o: ['It cuts mid-sentence and mid-row, severing meaning', 'It is too slow', 'It needs GPUs', 'It over-overlaps'], a: 0, e: 'Arbitrary windows sever semantic units; boundaries beat size.' },
    { q: 'Parent-child chunking retrieves small but synthesizes from large to get…', o: ['Precision + rich context together', 'Lower storage', 'Faster embeddings', 'Fewer LLM calls only'], a: 0, e: 'Small child for retrieval precision, large parent for synthesis context.' },
    { q: 'Late chunking (Jina) differs by…', o: ['Embedding the full doc first, then chunking', 'Chunking before reading', 'Skipping embeddings', 'Using larger overlap'], a: 0, e: 'Full-document context lands inside every chunk embedding.' }
  ],
  projectprepframework: [
    { q: 'The framework exists because with agent fleets…', o: ['Wrong direction amplifies ~Nx across every change', 'Agents need no requirements', 'Docs slow agents down', 'Planning is waterfall'], a: 0, e: 'One wrong assumption copies into every agent-generated change.' },
    { q: 'Scrutiny should be proportional to…', o: ['Reversal cost of the decision', 'Seniority of the decider', 'Sprint velocity', 'Token budget'], a: 0, e: 'Button label: decide fast. Data contract: eliminate uncertainty first.' },
    { q: 'Which doc makes decision ownership explicit?', o: ['governance.md (RACI + escalation)', 'PID.md', 'roadmap.md', 'discovery-report.md'], a: 0, e: 'Governance turns decision structure into explicit agreement.' }
  ],
  promptdependencygraph: [
    { q: '“Reachable” vs “candidate” means…', o: ['Ceiling of all downstream vs section-aware eval set', 'Failed vs passing prompts', 'Old vs new versions', 'Agents vs workflows'], a: 0, e: 'Reachable is structural; candidate narrows by changed section.' },
    { q: 'Flat one-hop lookup fails on deep chains because…', o: ['It misses transitive dependents past the first hop', 'It is too slow', 'It needs embeddings', 'It double-counts'], a: 0, e: 'BFS traversal follows agent→workflow chains; one hop stops early.' },
    { q: 'tone/professional scores 55/55 narrowing 0% — the honest reading is…', o: ['Universal component: full re-eval is correct', 'The tool failed', 'Tone needs no tests', 'Sample 5% instead'], a: 0, e: 'No shortcut exists when every agent genuinely depends on it.' }
  ],
  tablegridrag: [
    { q: 'Flattening a PDF table destroys…', o: ['The row×column intersection answers need', 'The font styles', 'The page numbers', 'The file size'], a: 0, e: 'Labels land apart from values; the model guesses which number is whose.' },
    { q: 'table_df_meta exists because table dimensions are…', o: ['Orthogonal — a table can be hard on all axes at once', 'Mutually exclusive', 'Always perfect', 'Irrelevant to parsing'], a: 0, e: 'Parse × size × header × continuity × doc-ratio compose, never a tree.' },
    { q: 'An aggregate question (“total premium?”) should…', o: ['Route to a SQL agent, not retrieval', 'Retrieve more chunks', 'Raise temperature', 'Flatten wider'], a: 0, e: 'Computation is not retrieval — SELECT, execute, interpret, cite the query.' }
  ],
  // ── P0 ──
  memhierarchy: [
    { q: 'Memory score formula weights…', o: ['0.6 salience + 0.3 recency + 0.1 frequency', 'Recency only', 'Random eviction', 'FIFO order'], a: 0, e: 'Importance dominates, recency decays, frequency steadies.' },
    { q: 'PII in a memory event must be…', o: ['Quarantined (hashed+TTL) before scoring', 'Scored then redacted', 'Kept verbatim', 'Embedded anyway'], a: 0, e: 'Quarantine-before-scoring keeps raw spans out of all tiers.' },
    { q: 'MemGPT pages out when…', o: ['Working-context pressure passes ~85%', 'Every turn ends', 'Weekly cron fires', 'User says so'], a: 0, e: 'Pressure-triggered paging via function calls, resume with pointers.' }
  ],
  longcontext: [
    { q: 'Lost-in-the-middle means place critical facts…', o: ['At head AND tail, never only mid-doc', 'Only in the middle', 'In footnotes', 'Across chats'], a: 0, e: 'Recall is U-shaped; anchors bracket the weak zone.' },
    { q: 'Document exceeds usable window →', o: ['Retrieve-then-read + compress the rest', 'Stuff it anyway', 'Truncate silently', 'Split chats'], a: 0, e: 'Overflow tokens get retrieved or compressed, never stuffed.' },
    { q: 'L3 structured state compresses ~30–50x but risks…', o: ['Schema drift', 'Higher cost', 'Slower reads', 'More tokens'], a: 0, e: 'Slots/decisions as JSON are compact; schemas must be versioned.' }
  ],
  rageval: [
    { q: 'Faithfulness < 0.85 means…', o: ['Generation fault — fix the contract first', 'Raise k', 'Shrink chunks', 'Lower temperature'], a: 0, e: 'Ungrounded claims blame the generator; prompt tuning never fixes it.' },
    { q: 'Context recall < 0.7 means…', o: ['Retrieval blind — rebuild retrieval, not prompts', 'Worse prompts', 'Bad evals', 'Slow index'], a: 0, e: 'Missing facts are a retriever failure by definition.' },
    { q: 'Ship band requires…', o: ['Faithfulness ≥0.95 AND precision ≥0.8', 'Any single metric high', 'Zero latency', 'Human approval'], a: 0, e: 'Both gates must hold; either failing blocks promotion.' }
  ],
  rerankers: [
    { q: 'Cross-encoder rerank over top-50 mainly lifts…', o: ['Top-k precision', 'Embedding speed', 'Chunk size', 'Prompt length'], a: 0, e: 'Joint scoring rescues buried truths and buries distractors.' },
    { q: 'HyDE helps most when queries are…', o: ['Short/vague with vocabulary mismatch', 'Long and precise', 'Already perfect', 'Non-English only'], a: 0, e: 'Draft-answer embeddings bridge the query↔document wording gap.' },
    { q: 'ColBERT late interaction suits…', o: ['Term-heavy / long docs via token MaxSim', 'Tiny corpora', 'Image search', 'No-index setups'], a: 0, e: 'Token-level matching without joint encoding cost.' },
    { q: 'The recall ceiling says a perfect reranker can never exceed…', o: ['The recall of the stages upstream of it', 'Its own parameter count', '100% by definition', 'The embedding model’s benchmark score'], a: 0, e: 'Retrieval is a funnel: end recall ≈ product of stage recalls; rankers cannot rank what was never surfaced.' },
    { q: 'Sliding each stage’s recall in the funnel shows the strongest lever is…', o: ['The stage with the lowest recall (the bottleneck)', 'Always the cross-encoder', 'The stage with the most candidates', 'The cheapest stage'], a: 0, e: 'Improving a 0.96 stage moves the product less than fixing the 0.70 one.' },
    { q: 'For agent-driven search, a recall gap is worse than for humans because…', o: ['Agents rerun search–evaluate–decide loops, compounding missing candidates into extra iterations, latency, and tokens', 'Agents prefer lexical search', 'Humans read slower', 'Agents cannot use rerankers'], a: 0, e: 'Each missed passage forces another loop — recall failures multiply cost.' }
  ],
  promptcontracts: [
    { q: 'A prompt contract pins…', o: ['Sections, version, I/O schema, capabilities', 'Only the model name', 'Token limits', 'The temperature'], a: 0, e: 'Four parts make change legality checkable in CI.' },
    { q: 'Renaming a section without an alias is…', o: ['Breaking — dependents’ refs dangle', 'Safe', 'Auto-fixed', 'A minor style'], a: 0, e: 'Every consumer referencing the old name breaks silently.' },
    { q: 'Contract gate sits where in the pipeline?', o: ['Before dependency graph and golden regression', 'After production deploy', 'Inside the LLM call', 'Nowhere — manual'], a: 0, e: 'May-ship → what-to-retest → did-behaviour-hold, in that order.' }
  ],
  promptregression: [
    { q: 'A golden set is…', o: ['Fixed Q/A pairs run on every prompt version', 'Random user logs', 'The training set', 'A prompt template'], a: 0, e: 'Fixed cases make behaviour drift measurable across versions.' },
    { q: 'Rate 0.83 on golden set means…', o: ['GATE — inspect diffs, no prod', 'Ship it', 'Delete the suite', 'Rollback infra'], a: 0, e: '0.80–0.95 gates; below 0.80 rolls back.' },
    { q: 'Every rollback should…', o: ['Donate its failing case to the golden set', 'Delete logs', 'Blame the model', 'Skip review'], a: 0, e: 'The suite compounds — quiet failures get louder each incident.' }
  ],
  // ── P1 ──
  agentplanner: [
    { q: 'ReAct loops…', o: ['Thought → Action → Observation', 'Plan → Approve → Merge', 'Embed → Retrieve → Generate', 'Train → Eval → Deploy'], a: 0, e: 'Reasoning interleaved with grounded tool observations.' },
    { q: 'Stall guard fires when…', o: ['No new information in 2 steps → replan/stop', 'Latency exceeds 1s', 'Cost exceeds $1', 'User disconnects'], a: 0, e: 'Loops without progress never recover; cut them early.' },
    { q: 'Reflexion critics must be…', o: ['External (tests, tools, second model)', 'The same actor, confident', 'Removed for speed', 'Human-only'], a: 0, e: 'Self-critique flatters; verification must come from outside.' }
  ],
  agenthitl: [
    { q: 'Risk score ≥ 6 routes to…', o: ['L1 supervised — approval per act', 'Full autonomy', 'No logging', 'Async audit only'], a: 0, e: 'Irreversible + wide blast + low confidence/novelty needs humans in the loop.' },
    { q: 'Async audit alone fails for…', o: ['Irreversible acts — it cannot un-send', 'Read-only acts', 'Fast acts', 'Cheap acts'], a: 0, e: 'Audit reviews history; gates prevent the act. Pair them.' },
    { q: 'Gate-fatigue defence is…', o: ['Risk-ordered queues + mandatory diff review', 'More gates everywhere', 'Auto-approve all', 'Removing humans'], a: 0, e: 'A waved-through gate is decoration; design for attention.' }
  ],
  agenta2a: [
    { q: 'Mesh messaging grows as…', o: ['n(n−1)/2 — dies past ~6 agents', 'Linear always', 'Constant', 'Logarithmic'], a: 0, e: 'Peer-to-peer explodes; supervisor or chain past small teams.' },
    { q: 'Unknown peer in the registry should…', o: ['Fail closed', 'Ask the LLM', 'Assume trust', 'Retry forever'], a: 0, e: 'Unpinned agents are untrusted agents.' },
    { q: 'MCP tool scoping defends against…', o: ['Confused deputy — tool output as instruction', 'Slow networks', 'Large payloads', 'Typos'], a: 0, e: 'Retrieved content is data, never instruction; scope tools per agent.' }
  ],
  agentsandbox: [
    { q: 'Default tier for code/content agents is…', o: ['T1 staged writes (jailed, no net)', 'Full prod access', 'No sandbox', 'T3 break-glass'], a: 0, e: 'Stage mutations where they can be reviewed, never prod-direct.' },
    { q: 'Production secrets reach the model as…', o: ['Short-lived brokered creds — never raw values', 'Env vars in context', 'Pasted by users', 'Hardcoded strings'], a: 0, e: 'Standing secrets are an incident; brokers mint scoped expiry.' },
    { q: 'Mutating tool calls require…', o: ['Fresh idempotency keys', 'Higher temperature', 'Longer timeouts only', 'No logging'], a: 0, e: 'Retries without idempotency double-apply mutations.' }
  ],
  agentevals: [
    { q: 'pass^3 of 0.51 from p=0.8 shows…', o: ['Flakiness repetition exposes', 'Great consistency', 'Security posture', 'Low cost'], a: 0, e: 'All-k-must-pass punishes agents that work “usually”.' },
    { q: 'Indirect prompt injection arrives via…', o: ['Retrieved docs hiding instructions', 'The system prompt', 'Model weights', 'Network latency'], a: 0, e: 'Tool output is the classic vector — quarantine and hierarchize.' },
    { q: 'Ship needs…', o: ['pass^k ≥ 0.7 AND security ≥ 0.9', 'Either axis alone', 'Speed records', 'Manager approval'], a: 0, e: 'Consistent-but-porous and solid-but-flaky both gate.' },
    { q: 'High syntax + low output consistency (Q1) is dangerous because…', o: ['Look-alike solutions behave differently — small edits change results', 'It wastes tokens', 'It is slow', 'It needs bigger models'], a: 0, e: 'Similar code, different behavior: the worst quadrant for trust.' },
    { q: 'Q4 (varied code, same behavior) is most trustworthy since…', o: ['Many independent roads reaching one answer beats memorized repetition', 'It uses less compute', 'Syntax scores are higher', 'Temperature is zero'], a: 0, e: 'Convergent behavior without copying signals real understanding.' },
    { q: 'Output consistency is only as good as…', o: ['The behavior suite — weak tests plus unrunnable code fake the score', 'The model size', 'The prompt length', 'The temperature'], a: 0, e: 'Count unrunnable samples separately; cover edge cases.' }
  ],
  vectordbops: [
    { q: 'HNSW costs ~1.35x RAM for…', o: ['0.95–0.99 recall at high QPS', 'Exact recall always', 'Zero RAM', 'No tuning'], a: 0, e: 'Graph index trades memory for speed; measure recall@k yourself.' },
    { q: 'Past ~100M vectors reach for…', o: ['PQ compression (paired with IVF/HNSW)', 'Flat brute force', 'Bigger prompts', 'More replicas only'], a: 0, e: '1/8th RAM at 0.80–0.92 recall — compress or shard.' },
    { q: 'Benchmarks must include…', o: ['Payload filters — they change everything', 'Only pure ANN', 'Only latency', 'Only cost'], a: 0, e: 'Filtered recall is the production number; unfiltered lies.' }
  ],
  finops: [
    { q: 'First cost lever is…', o: ['Semantic cache — remove calls entirely', 'Reranking', 'Compression', 'Bigger models'], a: 0, e: 'Cheapest token is un-sent; then downgrade the rest.' },
    { q: 'Correct lever order…', o: ['Cache → route → filter → compress → rerank', 'Rerank first', 'Compress first', 'Any order'], a: 0, e: 'Each lever multiplies a smaller base — order is strategy.' },
    { q: 'Cache correctness needs…', o: ['TTL + tenant scope + version', 'Infinite TTL', 'Global sharing', 'No invalidation'], a: 0, e: 'Stale or cross-tenant hits are incidents, not savings.' }
  ],
  observability: [
    { q: 'Retention default keeps 100% of…', o: ['Error traces (+ sampled success, full canary)', 'All success forever', 'Nothing', 'Only canary'], a: 0, e: 'Errors are cheap to keep, priceless in incidents.' },
    { q: 'Eval scores belong…', o: ['As span attributes — band slips alert', 'In chat logs', 'Nowhere', 'In the model'], a: 0, e: 'Scores riding spans make quality drops pageable.' },
    { q: 'A floating-version span is…', o: ['A bug — every span pins component@version', 'Normal', 'Efficient', 'Unavoidable'], a: 0, e: 'Blame needs pins; unversioned telemetry cannot attribute.' }
  ],
  // ── P2 ──
  tokenization: [
    { q: 'BPE builds vocab by…', o: ['Merging frequent pairs bottom-up', 'Pruning top-down', 'Random sampling', 'Dictionary lookup'], a: 0, e: 'Greedy merges favor frequent sequences; rare words shatter.' },
    { q: 'hi/ar ≈1.8x fertility means…', o: ['~2x tokens and bill for same meaning', 'Better quality', 'Faster inference', 'No impact'], a: 0, e: 'The multilingual tax: mitigate with native models + cache.' },
    { q: 'Chunkers must…', o: ['Budget by estimate, split on whitespace — never inside tokens', 'Split mid-token for balance', 'Ignore fertility', 'Use chars only'], a: 0, e: 'Mid-token splits corrupt embeddings silently.' }
  ],
  quantserve: [
    { q: '70B at INT4 AWQ/GPTQ needs…', o: ['~35 GB at −1–3% quality', '~140 GB', '~18 GB lossless', 'No GPU'], a: 0, e: 'The single-GPU serving sweet spot.' },
    { q: 'VRAM math must add…', o: ['KV cache — grows with context', 'Only weights', 'Only prompts', 'Nothing else'], a: 0, e: '32k context adds ~10 GB on 70B; budget it or OOM.' },
    { q: 'Lowest p99 latency comes from…', o: ['TensorRT-LLM fused kernels', 'llama.cpp CPU', 'Higher temperature', 'Longer prompts'], a: 0, e: 'Throughput = vLLM; latency = TensorRT; edge = llama.cpp.' }
  ],
  multilingualrag: [
    { q: 'EN-dominant corpus + low volume routes to…', o: ['Translate the query', 'Translate the corpus', 'Skip retrieval', 'Use bigger k only'], a: 0, e: 'Per-query MT is cheapest when EN dominates and volume is modest.' },
    { q: 'Entity drift in MT is fixed by…', o: ['Carrying source spans + citing source language', 'More temperature', 'Longer queries', 'Ignoring entities'], a: 0, e: 'Names/dates morph in translation; evidence stays native.' },
    { q: 'Mixed-language chunks should be…', o: ['Language-tagged and filtered first', 'Embedded blindly', 'Deleted', 'Split by chars'], a: 0, e: 'One chunk, two languages embeds weakly in both.' }
  ],
  multimodalrag: [
    { q: 'Charts should be answered via…', o: ['DePlot extraction → table → SQL/text path', 'Pixel reading as prose', 'Guessing trends', 'Ignoring them'], a: 0, e: 'Recover data first; never read numbers as prose when a grid exists.' },
    { q: 'Photo answers must cite…', o: ['Image regions — captions alone hallucinate', 'Nothing', 'The whole doc', 'Model confidence'], a: 0, e: 'Caption detail without verification is hallucination with coordinates.' },
    { q: 'Vision-LLM budget triggers past…', o: ['30% vision share (O5-style fallback)', '90% share', 'Never', 'Always default'], a: 0, e: 'Vision calls cost ≥10x — fallback, not default.' }
  ],
  texttosql: [
    { q: 'Text-to-SQL loop order…', o: ['Link → guarded generate → execute+repair → interpret', 'Generate → link → ship', 'Execute → guess schema', 'Interpret → generate'], a: 0, e: 'Ground terms first; guards before execution; one repair then escalate.' },
    { q: 'Guards must parse…', o: ['The SQL AST — never regex', 'Vibes', 'The question', 'Logs only'], a: 0, e: 'SELECT-only, allow-list, LIMIT enforced on structure.' },
    { q: 'Join answers cite…', o: ['SQL + result hash', 'A retrieved passage', 'Model confidence', 'Nothing'], a: 0, e: 'Computation cites the query, not a document.' }
  ],
  crossdocjoins: [
    { q: 'prime_annuelle → premium_amount at 0.97…', o: ['Auto-map with evidence logged', 'Needs human approval', 'Reject', 'Ignore'], a: 0, e: '≥0.85 auto-maps; below needs a human.' },
    { q: 'garantie → coverage at 0.72…', o: ['Human confirm required', 'Auto-map', 'Drop the column', 'Guess'], a: 0, e: 'Ambiguity is a decision — route to a named approver.' },
    { q: 'Cross-version joins must…', o: ['Predicate on validity dates', 'Ignore versions', 'Average them', 'Use latest only silently'], a: 0, e: 'valid_from<=x<=valid_to or fan-out double-counts.' }
  ],
  datapipeline: [
    { q: 'Partitions ≈ …', o: ['max(rate/per-partition, consumers)', 'Always 12', 'Random', 'One per topic'], a: 0, e: 'Throughput math first; lag risk past ~48 partitions.' },
    { q: 'New bytes reach retrieval…', o: ['Via staging branch + rag-eval Ship gate', 'Direct to prod', 'Never', 'By email'], a: 0, e: 'LakeFS branches let evals gate bytes before prod merge.' },
    { q: 'Exactly-once costs ~2x — so…', o: ['Ask if you need it before paying', 'Always enable', 'Never enable', 'It is free'], a: 0, e: 'Idempotent sinks + checkpoints are a choice, not a default.' }
  ],
  slmedge: [
    { q: 'SeqKD keeps…', o: ['~90% quality at ~10% size via teacher generations', '100% always', 'Nothing', 'Only speed'], a: 0, e: 'Reverse-KL on generations suits open-ended tasks.' },
    { q: 'Device fit rule…', o: ['Model ≤ 60% of device RAM', 'Fill all RAM', 'RAM irrelevant', 'Use swap'], a: 0, e: 'Leave room for OS/app/runtime or face kills.' },
    { q: 'Edge deploy gate is…', o: ['Server golden-set parity', 'Vibes', 'Size alone', 'Speed alone'], a: 0, e: 'Different body, same evals — parity or no ship.' }
  ],
  // ── L1 entry topics ──
  glossary: [
    { q: 'An embedding is…', o: ['A dense vector capturing meaning for similarity', 'A dictionary definition', 'A model checkpoint', 'A prompt template'], a: 0, e: 'Geometry of meaning: near vectors ≈ near meanings.' },
    { q: 'Temperature 0 means…', o: ['Greedy, deterministic output', 'Random output', 'No output', 'Faster output'], a: 0, e: 'Zero temperature always picks the top token.' },
    { q: 'RAG stands for…', o: ['Retrieval-Augmented Generation', 'Random Access Grammar', 'Recursive Agent Graphs', 'Ranked Answer Generator'], a: 0, e: 'Retrieve evidence, then generate grounded answers.' }
  ],
  firstaiapp: [
    { q: 'First secret to protect in an AI app…', o: ['API keys via env vars, never code', 'The model name', 'The UI theme', 'Log verbosity'], a: 0, e: 'Keys in code leak; env + rotation is baseline.' },
    { q: 'A summarizer MVP should first…', o: ['Call the API and handle errors', 'Fine-tune a model', 'Build a vector DB', 'Train embeddings'], a: 0, e: 'Vertical slice first: API + errors + JSON output.' },
    { q: 'Map-reduce chunking helps when…', o: ['Input exceeds the window', 'Outputs need JSON', 'Keys leak', 'Tests fail'], a: 0, e: 'Chunk, summarize each, reduce — overflow pattern.' }
  ],
  promptfundamentals: [
    { q: 'Zero-shot vs few-shot…', o: ['No examples vs in-prompt examples', 'No prompt vs long prompt', 'Cheap vs expensive models', 'Sync vs async'], a: 0, e: 'Examples in context steer format and behavior.' },
    { q: 'Chain-of-thought helps…', o: ['Multi-step reasoning tasks', 'Simple lookups', 'Reducing tokens', 'Hiding reasoning'], a: 0, e: 'Intermediate steps unlock compositional tasks.' },
    { q: 'Delimiters (###, XML tags)…', o: ['Separate instructions from data clearly', 'Speed up models', 'Reduce cost only', 'Replace evals'], a: 0, e: 'Structure prevents instruction/data confusion.' }
  ],
  llmsampling: [
    { q: 'Top-p (nucleus) sampling…', o: ['Samples from the smallest set covering p probability', 'Picks top-p tokens always', 'Disables randomness', 'Sets temperature'], a: 0, e: 'Dynamic cutoff adapts to distribution shape.' },
    { q: 'Repetition penalty fixes…', o: ['Loops repeating phrases', 'Slow inference', 'High cost', 'Bad grammar'], a: 0, e: 'Down-weights already-used tokens.' },
    { q: 'Greedy decoding risks…', o: ['Locally-optimal, globally-poor text', 'Randomness', 'High cost', 'Longer outputs'], a: 0, e: 'No lookahead — beam/search trade compute for quality.' }
  ],
  selfattention: [
    { q: 'QKV stands for…', o: ['Query, Key, Value', 'Queue, Kernel, Vector', 'Quant, Key, Vote', 'Quick, Keen, Vast'], a: 0, e: 'Queries match keys; values carry the content.' },
    { q: 'Attention scaling divides by √d to…', o: ['Keep softmax gradients healthy', 'Speed up GPUs', 'Reduce params', 'Add positions'], a: 0, e: 'Unscaled dot products saturate softmax.' },
    { q: 'Multi-head means…', o: ['Parallel attention subspaces concatenated', 'Multiple models', 'Multiple prompts', 'Multiple GPUs'], a: 0, e: 'Different heads learn different relations.' }
  ],
  archconcepts: [
    { q: 'Latent space means…', o: ['Compressed representation geometry models reason in', 'Disk storage', 'Prompt cache', 'Log files'], a: 0, e: 'Embeddings live here; distance ≈ relatedness.' },
    { q: 'MoE activates…', o: ['Top-k experts per token (sparse)', 'All params always', 'One expert total', 'No routing'], a: 0, e: 'Dense quality at sparse cost (e.g. 37B of 671B).' },
    { q: 'KV cache trades…', o: ['Memory for decode speed', 'Accuracy for speed', 'Quality for cost only', 'Nothing'], a: 0, e: 'Store keys/values; never recompute prefixes.' }
  ],
  promptmgmt: [
    { q: 'Prompt versioning matters because…', o: ['Changes silently shift behavior', 'Prompts never change', 'Models ignore versions', 'It saves tokens'], a: 0, e: 'Unversioned edits are untestable edits.' },
    { q: 'A prompt template should…', o: ['Separate structure from variables', 'Hardcode everything', 'Avoid examples', 'Maximize length'], a: 0, e: 'Structure stable, variables injected and validated.' },
    { q: 'First regression signal for prompts…', o: ['Golden-set pass rate', 'Vibes', 'Latency only', 'Cost only'], a: 0, e: 'Fixed cases per version catch quiet drift.' }
  ],
  rag: [
    { q: 'Naive RAG retrieves by…', o: ['Embedding similarity top-k', 'Keyword exact match only', 'Random sampling', 'File order'], a: 0, e: 'Vector closeness approximates relevance — approximately.' },
    { q: 'Hybrid search adds…', o: ['BM25 keywords alongside vectors', 'More GPUs', 'Longer prompts', 'Bigger models'], a: 0, e: 'Exact terms catch what embeddings miss (codes, names).' },
    { q: 'Top RAG failure at boundaries…', o: ['Context split across chunks', 'Slow disks', 'Bad fonts', 'Long titles'], a: 0, e: 'Answers straddling chunks need overlap or hierarchy.' }
  ],
  pipeline: [
    { q: 'Canonical RAG stage order…', o: ['Parse → chunk → embed → retrieve → generate', 'Generate → retrieve → parse', 'Embed → parse → chunk', 'Retrieve → parse → embed'], a: 0, e: 'Each stage feeds the next; errors compound downstream.' },
    { q: 'Embeddings are computed…', o: ['At ingestion for docs, at query time', 'Only at query time', 'Never — random', 'By the LLM always'], a: 0, e: 'Precompute corpus once; embed each query live.' },
    { q: 'Vector DB role…', o: ['Fast similarity search at scale', 'Storing prompts', 'Training models', 'Billing'], a: 0, e: 'ANN indexes make million-scale search milliseconds.' }
  ],
  qparseloop: [
    { q: 'Query rewriting helps when…', o: ['User wording mismatches doc vocabulary', 'Queries are perfect', 'Corpus is tiny', 'Latency is zero'], a: 0, e: 'Bridge vocabulary drift before retrieval.' },
    { q: 'Intent detection routes…', o: ['Lookup vs aggregate vs scoped questions', 'Users to humans', 'Bills to teams', 'Logs to disk'], a: 0, e: 'Question shape decides retrieval vs SQL vs clarification.' },
    { q: 'Loop termination needs…', o: ['Bounded iterations + stop conditions', 'Infinite retries', 'User waiting', 'No checks'], a: 0, e: 'Unbounded loops burn budget; decide.py-style gates stop them.' }
  ],
  filtering: [
    { q: 'Pre-filter before vectors because…', o: ['Exact constraints shrink candidates cheaply', 'Vectors are exact', 'Filters slow search', 'It looks thorough'], a: 0, e: 'doc_type=X AND year=Y first; similarity second.' },
    { q: 'BM25 beats vectors for…', o: ['Rare terms, codes, exact names', 'Paraphrases', 'Synonyms', 'Typos always'], a: 0, e: 'Lexical precision complements semantic recall.' },
    { q: 'Over-filtering risk…', o: ['Zero results — monitor recall', 'Too many results', 'Slow queries', 'High cost'], a: 0, e: 'Tight filters can exclude the answer; measure.' }
  ],
  ctxeng: [
    { q: 'Context engineering vs prompt engineering…', o: ['Whole evidence assembly vs wording', 'Same thing', 'Cheaper models', 'No retrieval'], a: 0, e: 'Right pages beat right words — context is the product.' },
    { q: 'Write/select/compress/isolate are…', o: ['Context operations per brick', 'Model sizes', 'Pricing tiers', 'File formats'], a: 0, e: 'Each pipeline brick shapes context deliberately.' },
    { q: 'Best context fix for wrong-page retrieval…', o: ['Better retrieval, not better prompt', 'Longer prompt', 'Higher temperature', 'More examples'], a: 0, e: 'No wording fixes absent evidence.' }
  ],
  vague: [
    { q: 'Vague question strategy…', o: ['Clarify or scope before retrieving', 'Guess silently', 'Retrieve everything', 'Refuse always'], a: 0, e: 'Ambiguity resolved early is cheap; late is hallucination.' },
    { q: 'Clarification should be…', o: ['Targeted with options, not open interrogation', 'Endless', 'Avoided entirely', 'Always human'], a: 0, e: 'One sharp question beats five vague ones.' },
    { q: 'Scope filters come from…', o: ['Question parsing (time/place/entity)', 'Random choice', 'Model weights', 'User tier'], a: 0, e: 'Parsed scope drives projection and filtering.' }
  ],
  memeng: [
    { q: 'Working vs long-term memory…', o: ['Window-limited vs persisted across sessions', 'GPU vs CPU', 'Fast vs slow models', 'Same thing'], a: 0, e: 'Persistence boundary defines the engineering.' },
    { q: 'Compaction summarizes history to…', o: ['Fit the window while keeping decisions', 'Delete everything', 'Slow the model', 'Increase cost'], a: 0, e: 'Summaries preserve entities, decisions, todos.' },
    { q: 'Memory staleness fix…', o: ['Tombstones + validity dates', 'More RAM', 'Bigger windows', 'Ignoring it'], a: 0, e: 'Superseded facts must be marked, not just appended.' }
  ],
  contextlimits: [
    { q: '1M context does NOT guarantee…', o: ['Mid-context recall', 'Token acceptance', 'API availability', 'Billing'], a: 0, e: 'Capacity ≠ attention; U-curve persists at scale.' },
    { q: 'Working-memory tests (BAPO) probe…', o: ['Variable tracking across long inputs', 'Typing speed', 'Model size', 'Cost'], a: 0, e: 'State maintenance under distraction separates models.' },
    { q: 'Mitigation for limits…', o: ['Retrieve-then-read + compression ladder', 'Hope', 'Max temperature', 'Single prompt'], a: 0, e: 'Architecture beats window size.' }
  ],
  fiveassets: [
    { q: 'Five agent assets include…', o: ['Tools, evals, prompts, memory, harnesses', 'GPUs only', 'Five models', 'Five vendors'], a: 0, e: 'Capabilities around the model make the agent.' },
    { q: 'Most-skipped asset in practice…', o: ['Evals', 'Tools', 'Prompts', 'Memory'], a: 0, e: 'Unevaluated agents are unowned behavior.' },
    { q: 'Asset-first means…', o: ['Inventory capabilities before designing loops', 'Buy hardware', 'Hire first', 'Prompt first'], a: 0, e: 'Design from what the agent can touch and prove.' }
  ],
  redesign: [
    { q: '“Redesign work first” argues…', o: ['Fix the process before automating it', 'Automate everything now', 'Hire more agents', 'Skip discovery'], a: 0, e: 'Automated mess runs at machine speed.' },
    { q: 'Task fit for agents…', o: ['Repetitive, verifiable, bounded', 'Ambiguous and political', 'One-off and fuzzy', 'Secret'], a: 0, e: 'Verifiability bounds autonomy safely.' },
    { q: 'Human role after redesign…', o: ['Exception handler + owner', 'Eliminated', 'Data entry', 'Unchanged'], a: 0, e: 'Agents do routine; humans own edge + accountability.' }
  ],
  agentsastools: [
    { q: 'Subagent as tool gives…', o: ['Isolation + typed I/O per subtask', 'Shared global state', 'No observability', 'Infinite cost'], a: 0, e: 'Bounded units compose safely.' },
    { q: 'Handoff artifact must be…', o: ['Typed and versioned', 'Free text always', 'Verbal', 'None'], a: 0, e: 'Contracts between agents prevent skew.' },
    { q: 'Fan-out needs…', o: ['Result merging + conflict ownership', 'More prompts', 'Blind trust', 'No limits'], a: 0, e: 'Parallel answers must reconcile somewhere.' }
  ],
  agenttasks: [
    { q: 'Task archetypes help…', o: ['Match autonomy to task shape', 'Avoid all agents', 'Write prompts only', 'Cut evals'], a: 0, e: 'Lookup ≠ research ≠ repair — govern each differently.' },
    { q: 'Highest-governance archetype…', o: ['Irreversible mutations', 'Summarization', 'Search', 'Drafting'], a: 0, e: 'Blast radius sets the gate, not the tech.' },
    { q: 'Triage first question…', o: ['Is the outcome verifiable?', 'Is it fun?', 'Is it novel?', 'Is it cheap?'], a: 0, e: 'Verifiability unlocks autonomy safely.' }
  ],
  codingagentsnonprog: [
    { q: 'Non-programmers succeed with agents via…', o: ['Constrained tasks + review checkpoints', 'Open-ended access', 'No guardrails', 'Raw shell'], a: 0, e: 'Bounds substitute for code literacy.' },
    { q: 'Review checkpoint shows…', o: ['Diffs in plain language + approve/edit', 'Raw logs', 'Nothing', 'Bills'], a: 0, e: 'Humans approve what they can understand.' },
    { q: 'Biggest risk…', o: ['Silent over-permission', 'Slow models', 'High cost only', 'Typos'], a: 0, e: 'Capability without comprehension needs least privilege.' }
  ],
  pandasdataframes: [
    { q: 'Vectorized ops beat loops by…', o: ['Running in compiled C code', 'Using more RAM', 'Magic', 'Luck'], a: 0, e: 'Pandas speed lives in NumPy, not Python loops.' },
    { q: 'read_csv dtype + usecols…', o: ['Cut memory and parse time', 'Increase accuracy', 'Change values', 'No effect'], a: 0, e: 'Load only what you need, typed tightly.' },
    { q: 'SettingWithCopyWarning signals…', o: ['Chained-assignment ambiguity', 'A crash', 'Slow disk', 'Bad data'], a: 0, e: 'Use .loc explicitly; copies vs views bite.' }
  ],
  linearregression: [
    { q: 'MSE penalizes large errors…', o: ['Quadratically', 'Linearly', 'Not at all', 'Inversely'], a: 0, e: 'Squares amplify outliers — know your loss.' },
    { q: 'Learning rate too high…', o: ['Diverges/oscillates', 'Converges faster always', 'No effect', 'Reduces loss to zero'], a: 0, e: 'Overshoot compounds; schedule or shrink.' },
    { q: 'Feature scaling matters for…', o: ['Gradient descent convergence', 'Tree models mostly', 'Nothing', 'Only plots'], a: 0, e: 'Conditioned surfaces descend cleanly.' }
  ],
  modernioformats: [
    { q: 'Parquet beats CSV mainly via…', o: ['Columnar layout + compression + stats', 'Bigger files', 'Text readability', 'No schema'], a: 0, e: 'Scan less, decode faster, skip row-groups.' },
    { q: 'Arrow zero-copy helps…', o: ['Pandas↔DuckDB handoffs without copies', 'Network speed', 'Disk writes', 'GPU training'], a: 0, e: 'Shared memory layout kills serialization.' },
    { q: 'DuckDB shines for…', o: ['In-process SQL over files', 'Distributed training', 'Streaming only', 'GPU kernels'], a: 0, e: 'Query Parquet directly; no server.' }
  ],
  activelearn: [
    { q: 'Label next the points with…', o: ['Highest uncertainty / disagreement', 'Lowest loss', 'Random only', 'Easiest first'], a: 0, e: 'Information gain per label is the objective.' },
    { q: 'Cold start needs…', o: ['Seed set + diversity sampling', 'No labels', 'Full labels', 'Guessing'], a: 0, e: 'Cover the space before exploiting uncertainty.' },
    { q: 'Stopping rule…', o: ['Plateau on holdout + budget cap', 'Never stop', 'One round', 'Vibes'], a: 0, e: 'Diminishing returns are measurable.' }
  ],
  datahumanization: [
    { q: 'Humanized insight leads with…', o: ['The decision, then the evidence', 'Raw tables', 'Methodology', 'Caveats only'], a: 0, e: 'So-what first; proof on demand.' },
    { q: 'SCQA structure…', o: ['Situation, Complication, Question, Answer', 'Select, Count, Query, Aggregate', 'Slow, Careful, Quiet, Accurate', 'None'], a: 0, e: 'Narrative arc carries analytical conclusions.' },
    { q: 'One chart rule…', o: ['One message per visual', 'Maximize ink', '3D effects', 'All data always'], a: 0, e: 'Every visual argues exactly one point.' }
  ],
  aiusecases: [
    { q: 'Beyond-chatbot value often starts with…', o: ['Embeddings over existing text (search, scoring)', 'Bigger chatbots', 'More prompts', 'Fine-tuning first'], a: 0, e: 'Unstructured data you already own is the asset.' },
    { q: 'Lead scoring with embeddings needs…', o: ['Labels + offline eval before rollout', 'No eval', 'Vibes', 'Manual review forever'], a: 0, e: 'Prove lift on holdout, then ship.' },
    { q: 'First enterprise AI risk to clear…', o: ['Data access + PII handling', 'Model brand', 'UI color', 'Latency decimals'], a: 0, e: 'Governance gates every use case.' }
  ],
  goaltracker: [
    { q: 'Good 2026 metric…', o: ['Specific, time-bound, reviewable', 'Vague aspiration', 'Secret', 'Annual-only'], a: 0, e: 'Review cadence beats resolution intensity.' },
    { q: 'Leading vs lagging…', o: ['Habits predict outcomes', 'Outcomes predict habits', 'Same thing', 'Neither matters'], a: 0, e: 'Track inputs you control weekly.' },
    { q: 'Review loop…', o: ['Weekly score + monthly reset', 'Yearly glance', 'Never', 'Daily overhaul'], a: 0, e: 'Compounding needs cadence.' }
  ],
  classicalml: [
    { q: 'XGBoost wins tabulars via…', o: ['Boosted trees + regularization', 'Deep layers', 'Attention', 'Luck'], a: 0, e: 'Sequential error correction with guardrails.' },
    { q: 'Train/valid/test split prevents…', o: ['Optimistic illusions (leakage/overfit)', 'Slow training', 'High cost', 'Bad plots'], a: 0, e: 'Holdout honesty is the whole game.' },
    { q: 'Baseline first…', o: ['Logistic/mean beats fancy until proven', 'Deep nets always', 'No baseline', 'Ensembles only'], a: 0, e: 'Simple reference prices complexity.' }
  ],
  practices: [
    { q: 'Top production practice…', o: ['Eval before scale', 'Scale before eval', 'Prompt-only fixes', 'No monitoring'], a: 0, e: 'Measurement precedes optimization, always.' },
    { q: 'Prompt changes need…', o: ['Version + regression check', 'Silence', 'Hope', 'Restarts'], a: 0, e: 'Untested edits are incidents waiting.' },
    { q: 'Cost control starts with…', o: ['Measuring per-task spend', 'Bigger models', 'Ignoring bills', 'Annual review'], a: 0, e: 'Meter first, optimize second.' }
  ],
  powerfeatures: [
    { q: 'Power feature vs default…', o: ['Measured win on your workload', 'Marketing claim', 'Always better', 'Always worse'], a: 0, e: 'Your evals arbitrate every upgrade.' },
    { q: 'Adopt when…', o: ['A/B proves lift within budget', 'Launch day', 'Never', 'Peer pressure'], a: 0, e: 'Gated rollouts beat flag flips.' },
    { q: 'Rollback plan…', o: ['Pinned last-good + one-command revert', 'Hope', 'Rewrite', 'Wait'], a: 0, e: 'Every power feature ships with an exit.' }
  ],
  tokenbill: [
    { q: '3x bills usually come from…', o: ['Uncached repeats + flagship-everything + fat context', 'Model prices only', 'One bad query', 'Inflation'], a: 0, e: 'Structure of usage dominates unit price.' },
    { q: 'Fastest big win…', o: ['Cache repeats', 'Renegotiate', 'Smaller fonts', 'Fewer users'], a: 0, e: 'Un-sent tokens are free tokens.' },
    { q: 'Sustained control needs…', o: ['Per-team budgets + router review', 'One-off audit', 'Hope', 'Bigger quota'], a: 0, e: 'Governance, not heroics.' }
  ]
};

import { EXIT_CHECKS_B } from './exitChecks2.js';
import { EXIT_CHECKS_C } from './exitChecks3.js';
import { EXIT_CHECKS_D } from './exitChecks4.js';
import { EXIT_CHECKS_E } from './exitChecks5.js';
import { EXIT_CHECKS_F } from './exitChecks6.js';
import { EXIT_CHECKS_G } from './exitChecks7.js';
import { EXIT_CHECKS_H } from './exitChecks8.js';
import { EXIT_CHECKS_I } from './exitChecks9.js';
import { EXIT_CHECKS_J } from './exitChecks10.js';
import { EXIT_CHECKS_K } from './exitChecks11.js';
import { EXIT_CHECKS_L } from './exitChecks12.js';
import { EXIT_CHECKS_M } from './exitChecks13.js';
import { EXIT_CHECKS_N } from './exitChecks14.js';
import { EXIT_CHECKS_O } from './exitChecks15.js';

const ALL_CHECKS = { ...EXIT_CHECKS, ...EXIT_CHECKS_B, ...EXIT_CHECKS_C, ...EXIT_CHECKS_D, ...EXIT_CHECKS_E, ...EXIT_CHECKS_F, ...EXIT_CHECKS_G, ...EXIT_CHECKS_H, ...EXIT_CHECKS_I, ...EXIT_CHECKS_J, ...EXIT_CHECKS_K, ...EXIT_CHECKS_L, ...EXIT_CHECKS_M, ...EXIT_CHECKS_N, ...EXIT_CHECKS_O };

export function getExitCheck(tabId) {
  return ALL_CHECKS[tabId] || null;
}

export function hasExitCheck(tabId) {
  return Array.isArray(ALL_CHECKS[tabId]) && ALL_CHECKS[tabId].length > 0;
}

/** Coverage stats for dashboards: banked topics and questions. */
export function getExitCoverage() {
  const topics = Object.keys(ALL_CHECKS);
  return {
    topics: topics.length,
    questions: topics.reduce((a, id) => a + ALL_CHECKS[id].length, 0)
  };
}
