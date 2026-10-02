/**
 * ragProductionOpsEngine.js
 * Architectural engine for Production RAG & AgentOps
  * Synthesizing empirical findings from production deep-dives
 */

// ==========================================
// 1. AGENTOPS VS MLOPS: FIVE BROKEN ASSUMPTIONS
// ==========================================

export const MLOPS_BROKEN_ASSUMPTIONS = [
  {
    id: 'comparable_outputs',
    assumption: 'Outputs are comparable across runs',
    mlopsSignal: 'Per-call accuracy on a single sampled test run',
    blindSpot: 'Run-to-run inconsistency on identical inputs. A single run might pass (61%), but over 8 attempts success drops to <25%.',
    agentOpsFix: 'pass^k across repeated trials (Tau-bench benchmark)',
    icon: '🎲'
  },
  {
    id: 'stateless_inference',
    assumption: 'Inference is stateless (request is the unit of work)',
    mlopsSignal: 'Request-level HTTP status 200 and per-step latency',
    blindSpot: 'Compounding trajectory errors. Early tool deviation cascades downstream. MAST taxonomy shows system design is the #1 failure mode.',
    agentOpsFix: 'Full trajectory replay with step-level state inspectability',
    icon: '⛓️'
  },
  {
    id: 'single_boundary',
    assumption: 'One decision boundary per request',
    mlopsSignal: 'Per-step success rate (e.g. 85% healthy on dashboard)',
    blindSpot: 'Step probability multiplication: 0.85^10 is ~19.6% true completion rate. Dashboard is green; 4 in 5 user runs fail.',
    agentOpsFix: 'End-to-end trajectory completion rate & outcome validation',
    icon: '📉'
  },
  {
    id: 'ground_truth_arrival',
    assumption: 'Ground truth labels arrive promptly',
    mlopsSignal: 'Data drift monitors against a static holdout window',
    blindSpot: 'Agents take real-world actions (writes to DB, payments, emails). Superficial verifiers only check syntax, missing business logic defects.',
    agentOpsFix: 'Deterministic pre-checks + versioned agent configurations diffed per run',
    icon: '⏱️'
  },
  {
    id: 'human_in_between',
    assumption: 'A human sits between the model and the consequence',
    mlopsSignal: 'Single-threshold quality alerts',
    blindSpot: 'Agent acts autonomously. Traces can be green or faked by model output without tool actually executing.',
    agentOpsFix: 'Pre-action gates on every side effect + hard iteration caps',
    icon: '🛡️'
  }
];

export function CALCULATE_COMPOUNDING_RELIABILITY(perStepReliabilityPct, stepCount) {
  const p = perStepReliabilityPct / 100;
  const endToEndSuccess = Math.pow(p, stepCount);
  const failureRate = 1 - endToEndSuccess;
  
  // Compounding trajectory points for graph visualization
  const curve = [];
  for (let n = 1; n <= Math.max(15, stepCount); n++) {
    curve.push({
      step: n,
      successRate: Math.round(Math.pow(p, n) * 1000) / 10
    });
  }

  return {
    perStepReliabilityPct,
    stepCount,
    endToEndSuccessPct: Math.round(endToEndSuccess * 1000) / 10,
    failureRatePct: Math.round(failureRate * 1000) / 10,
    curve
  };
}

export function CALCULATE_PASS_AT_K(pSingle, k) {
  const atLeastOne = 1 - Math.pow(1 - pSingle, k);
  const allSucceed = Math.pow(pSingle, k);
  return {
    atLeastOneSuccessPct: Math.round(atLeastOne * 1000) / 10,
    allSucceedPassKPct: Math.round(allSucceed * 1000) / 10
  };
}

export function SIMULATE_AGENT_TRAJECTORY(trajectoryScenario = 'clean_run', hardCapTrigger = 4) {
  if (trajectoryScenario === 'clean_run') {
    return {
      status: 'SUCCESS',
      badgeVariant: 'success',
      totalSteps: 4,
      totalTokens: 3840,
      costEstimate: 0.019,
      hardCapTripped: false,
      steps: [
        { step: 1, action: 'invoke_agent', detail: 'Received query: "Reconcile vendor invoice #INV-902 with PO."', latency: '120ms', status: 'GREEN' },
        { step: 2, action: 'execute_tool', detail: 'Tool: sql_query("SELECT * FROM po_records WHERE id=902")', latency: '45ms', status: 'GREEN' },
        { step: 3, action: 'execute_tool', detail: 'Tool: fetch_erp_receipts("INV-902") -> Matched $14,200', latency: '82ms', status: 'GREEN' },
        { step: 4, action: 'pre_action_gate', detail: 'Gate Passed: Side-effect authorization verified for $14,200 write.', latency: '14ms', status: 'GREEN' }
      ],
      verdict: 'Clean execution. All 4 steps succeeded. Outcome verified.'
    };
  }

  if (trajectoryScenario === 'infinite_loop') {
    return {
      status: 'LOOP_TRIPPED',
      badgeVariant: 'warning',
      totalSteps: 5,
      totalTokens: 18450,
      costEstimate: 0.092,
      hardCapTripped: true,
      steps: [
        { step: 1, action: 'invoke_agent', detail: 'Received query: "Update customer address on order #ORD-441"', latency: '110ms', status: 'GREEN' },
        { step: 2, action: 'execute_tool', detail: 'Tool: update_address("ORD-441", "742 Evergreen") -> ERROR: Schema locked by billing thread', latency: '40ms', status: 'AMBER' },
        { step: 3, action: 'execute_tool (retry 1)', detail: 'Tool: update_address("ORD-441", "742 Evergreen") -> ERROR: Schema locked by billing thread', latency: '38ms', status: 'AMBER' },
        { step: 4, action: 'execute_tool (retry 2)', detail: 'Tool: update_address("ORD-441", "742 Evergreen") -> ERROR: Schema locked by billing thread', latency: '41ms', status: 'AMBER' },
        { step: 5, action: 'hard_cap_interceptor', detail: `HARD CAP TRIPPED: Detected ${hardCapTrigger} identical non-progress retries. Halting trajectory to prevent 20-step recursion burn ($1.40).`, latency: '5ms', status: 'RED' }
      ],
      verdict: 'Hard Loop Cap caught deterministic retry storm. Saved ~15 unnecessary token loops.'
    };
  }

  return {
    status: 'SILENT_DEFECT',
    badgeVariant: 'danger',
    totalSteps: 5,
    totalTokens: 8900,
    costEstimate: 0.044,
    hardCapTripped: false,
    steps: [
      { step: 1, action: 'invoke_agent', detail: 'User query: "Refund customer for order #412 and send confirmation."', latency: '110ms', status: 'GREEN' },
      { step: 2, action: 'execute_tool', detail: 'Tool: lookup_order("412") -> Misinterpreted order id as customer id #412', latency: '35ms', status: 'GREEN (PATH DEFECT)' },
      { step: 3, action: 'execute_tool', detail: 'Tool: process_refund(customer_id="412", amount=$850) -> Processed on wrong account!', latency: '190ms', status: 'GREEN (UNCHECKED SIDE EFFECT)' },
      { step: 4, action: 'execute_tool', detail: 'Tool: send_email("customer412@domain.com") -> Confirmation sent', latency: '65ms', status: 'GREEN' },
      { step: 5, action: 'output_verifier', detail: 'Superficial Verifier: Passed! (Status 200, valid JSON response). ACTUAL OUTCOME: Severe Incident!', latency: '10ms', status: 'RED' }
    ],
    verdict: 'The "Green Trace Fallacy": All spans returned status 200, but wrong customer was refunded $850.'
  };
}


// ==========================================
// 2. WHY RAG COMPLEXITY SHOULD BE EARNED (8 LEVELS)
// ==========================================

export const RAG_COMPLEXITY_LEVELS = [
  {
    level: 0,
    name: 'Level 0: Direct Context Feeding',
    subtitle: 'No retrieval subsystem required',
    description: 'For corpora < 200,000 tokens (e.g. employee handbook, product spec), directly inject document into LLM context window. Avoid retrieval engineering entirely.',
    targetFailure: 'Building vector pipelines when full document already fits in context.',
    recall5: '1.00 (Perfect)',
    ndcg10: '1.00',
    latencyMs: 380,
    costPer1k: 2.50,
    pros: 'Zero indexing overhead, zero retrieval failures, simplest architecture.',
    cons: 'Token costs grow linearly with every query if corpus is large.'
  },
  {
    level: 1,
    name: 'Level 1: Corpus Representation & Hierarchy',
    subtitle: 'Clean parsing before search optimization',
    description: 'Structure before search. Preserve document headings, keep tables intact, propagate metadata (dates, authors, access control), and establish sensible chunk boundaries.',
    targetFailure: 'Fixed-character splitters slicing tables and separating section headings from policy rules.',
    recall5: '0.45',
    ndcg10: '0.38',
    latencyMs: 15,
    costPer1k: 0.05,
    pros: 'Preserves semantic cohesion without adding runtime query latency.',
    cons: 'Requires custom document loaders (LlamaParse, Unstructured.io).'
  },
  {
    level: 2,
    name: 'Level 2: Lexical Baseline (BM25)',
    subtitle: 'Inexpensive, exact-keyword matching',
    description: 'BM25 sparse search. Heavily rewards exact term frequency and document length normalization. Essential baseline for identifiers, error codes, legal clauses, and product SKUs.',
    targetFailure: 'Embedding models ranking semantically similar passages above the exact error code TS-999.',
    recall5: '0.62',
    ndcg10: '0.54',
    latencyMs: 8,
    costPer1k: 0.01,
    pros: 'Sub-millisecond latency, zero GPU/embedding cost, unbeatable on exact IDs.',
    cons: 'Fails completely when user query uses synonyms or paraphrased wording.'
  },
  {
    level: 3,
    name: 'Level 3: Dense Retrieval (Vector Embeddings)',
    subtitle: 'Semantic similarity for vocabulary mismatch',
    description: 'Bi-encoder dense vector search (e.g. OpenAI text-embedding-3, BGE-Large). Solves vocabulary mismatch when user says "voluntary resignation" and policy says "employee-initiated termination".',
    targetFailure: 'BM25 returning zero hits because user phrasing differs from document wording.',
    recall5: '0.71',
    ndcg10: '0.59',
    latencyMs: 25,
    costPer1k: 0.15,
    pros: 'Captures conceptual semantics, multilingual similarity, and fuzzy matches.',
    cons: 'Prone to false positives on technical codes, negation, and specific numbers.'
  },
  {
    level: 4,
    name: 'Level 4: Hybrid Search + Reciprocal Rank Fusion (RRF)',
    subtitle: 'Combining sparse precision + dense recall',
    description: 'Execute BM25 and dense vector search in parallel. Combine ranked candidate lists using Reciprocal Rank Fusion (RRF): score = sum(1 / (60 + rank_i)).',
    targetFailure: 'Having to pick between keyword precision or semantic coverage.',
    recall5: '0.82',
    ndcg10: '0.68',
    latencyMs: 32,
    costPer1k: 0.16,
    pros: 'Standard high-reliability baseline for enterprise knowledge bases.',
    cons: 'Requires dual indexing infrastructure (e.g. Qdrant / Elasticsearch).'
  },
  {
    level: 5,
    name: 'Level 5: Neural Reranking (Cross-Encoder)',
    subtitle: 'High top-k precision over candidate sets',
    description: 'Two-stage retrieval. Stage 1 (Hybrid) pulls broad top-50 candidates for recall. Stage 2 (Cross-Encoder / Cohere Rerank / FlashRank) computes deep cross-attention to re-order top-5.',
    targetFailure: 'Relevant chunk was retrieved at rank 14 and pushed out of LLM top-5 context.',
    recall5: '0.89',
    ndcg10: '0.81',
    latencyMs: 95,
    costPer1k: 0.55,
    pros: 'Major jump in NDCG@10 (+15-25%), filters out false positive vector hits.',
    cons: 'Adds 50-100ms compute latency to query path.'
  },
  {
    level: 6,
    name: 'Level 6: Contextual Chunk Representation',
    subtitle: 'Prepending document context before indexing',
    description: 'Anthropic Contextual Retrieval pattern: prepend a 50-100 token LLM-generated document summary to each chunk before embedding and indexing. Cuts retrieval failures by up to 49%.',
    targetFailure: 'Orphaned chunk containing factual condition but losing the document section it refers to.',
    recall5: '0.92',
    ndcg10: '0.85',
    latencyMs: 98,
    costPer1k: 0.60,
    pros: 'Fixes chunk amnesia at indexing time without query latency penalty.',
    cons: 'Upfront indexing cost to generate context summaries for millions of chunks.'
  },
  {
    level: 7,
    name: 'Level 7: Query Transformation & Decomposition',
    subtitle: 'Resolving multi-part queries before search',
    description: 'LLM decomposes multi-intent questions into 2-4 atomic sub-queries (e.g. HotpotQA pattern) or generates hypothetical document embeddings (HyDE).',
    targetFailure: 'Single vector query failing on compound questions spanning different documents.',
    recall5: '0.94',
    ndcg10: '0.88',
    latencyMs: 240,
    costPer1k: 1.20,
    pros: 'Breaks complex comparisons into clean, targeted single-concept searches.',
    cons: 'Adds one upfront LLM call and multiplies retrieval queries.'
  },
  {
    level: 8,
    name: 'Level 8: Agentic Adaptive Multi-Hop Retrieval',
    subtitle: 'Adaptive iterative search & source selection',
    description: 'Agentic loop with planning, heterogeneous source routing (SQL, vector DB, internal APIs), intermediate evidence inspection, and dynamic stopping criteria.',
    targetFailure: 'Multi-hop dependencies where Query B cannot be formulated until Query A output is seen.',
    recall5: '0.97',
    ndcg10: '0.92',
    latencyMs: 850,
    costPer1k: 4.80,
    pros: 'Can solve open-ended multi-document investigations and reconcile conflicts.',
    cons: 'Highest cost, highest latency, and introduces agentic non-determinism.'
  }
];

export const SAMPLE_COMPLEXITY_QUERIES = [
  {
    id: 'exact_code',
    title: '1. Identifier / Error Code Lookup',
    query: 'What does system error code TS-999 indicate in the gateway logs?',
    bestLevel: 2,
    explanation: 'Lexical BM25 solves this immediately with 100% precision. Vector embeddings often retrieve generic error handling passages instead of TS-999.'
  },
  {
    id: 'paraphrase',
    title: '2. Vocabulary Mismatch (Paraphrase)',
    query: 'Under what circumstances can an employee voluntarily resign their post?',
    bestLevel: 3,
    explanation: 'Policy document only contains the phrase "employee-initiated termination". BM25 gets 0 hits; Dense vector embeddings match effortlessly.'
  },
  {
    id: 'hybrid_sla',
    title: '3. Technical Identifier + Semantic SLA Condition',
    query: 'What termination clauses apply if Vendor B breaches Kafka cluster 99.5% uptime SLA?',
    bestLevel: 4,
    explanation: 'Combines exact entity identifiers ("Vendor B", "Kafka", "99.5%") with conceptual legal consequences ("termination clauses"). Hybrid RRF is essential.'
  },
  {
    id: 'multihop_financial',
    title: '4. Multi-Hop Comparative Financial Analysis',
    query: 'Which company had higher operating margins in 2025, Acme Corp or Zenith Inc, and what was the main driver of their YoY change?',
    bestLevel: 8,
    explanation: 'Requires sequential, evidence-dependent retrieval: Look up Acme 2025 margin -> Look up Acme MD&A -> Look up Zenith 2025 margin -> Look up Zenith MD&A -> Synthesize comparison.'
  }
];

export const FOUR_QUADRANTS_MATRIX = [
  {
    quadrant: 'Q1: Retrieval Pass / Generation Pass',
    status: 'OPTIMAL SUCCESS',
    color: '#3A9B9F',
    description: 'Relevant evidence was retrieved in top-k, and LLM generated a grounded, faithful answer with citations.'
  },
  {
    quadrant: 'Q2: Retrieval Pass / Generation Fail',
    status: 'REASONING DEFECT',
    color: '#f59e0b',
    description: 'Evidence entered LLM context, but model hallucinated, contradicted facts, or suffered from "Lost in the Middle" attention degradation.'
  },
  {
    quadrant: 'Q3: Retrieval Fail / Generation Pass',
    status: 'DANGEROUS LUCKY GUESS',
    color: '#ef4444',
    description: 'Retriever missed the evidence completely, but LLM answered correctly using pre-trained parametric memory. High risk of enterprise failure on proprietary private data!'
  },
  {
    quadrant: 'Q4: Retrieval Fail / Generation Fail',
    status: 'RETRIEVAL ROOT CAUSE',
    color: '#64748b',
    description: 'No relevant evidence entered top-k; model hallucinated or rightfully abstained. Prompt engineering cannot fix this; retrieval subsystem must be upgraded.'
  }
];


// ==========================================
// 3. FAQ AS RAG: INVERTED PIPELINE & CACHING
// ==========================================

export const SYNTHETIC_FAQ_CORPUS = [
  {
    qid: 'FAQ-01',
    tag: 'coverage',
    question: 'Does my home insurance policy cover water damage from burst pipes?',
    answer: 'Yes. Sudden and accidental water damage caused by burst plumbing pipes is covered under standard Section A property coverage, subject to your policy deductible ($500 standard). Slow leaks over 14+ days are excluded.'
  },
  {
    qid: 'FAQ-02',
    tag: 'deductibles',
    question: 'What is the standard deductible for home insurance property claims?',
    answer: 'The standard deductible is $500 per claim. Named storm and hurricane endorsements carry a separate 2% to 5% deductible based on the dwelling coverage limit.'
  },
  {
    qid: 'FAQ-03',
    tag: 'cancellation',
    question: 'How do I cancel my policy and can I receive a prorated refund?',
    answer: 'You may cancel at any time with 30 days written notice. An unearned premium refund will be calculated on a pro-rata basis and credited to your original payment method within 10 business days.'
  },
  {
    qid: 'FAQ-04',
    tag: 'claims',
    question: 'How do I submit a new insurance claim after property damage?',
    answer: 'Submit claims via the mobile app or call the 24/7 hotline at 1-800-555-0100. Please document physical damage with photos, prevent further damage, and retain all repair receipts.'
  },
  {
    qid: 'FAQ-05',
    tag: 'exclusions',
    question: 'Are flood damage and ground water infiltration covered under my standard policy?',
    answer: 'No. Flood damage, surface water runoff, and sewer backups are strictly excluded from standard coverage. Dedicated National Flood Insurance Program (NFIP) policies must be purchased separately.'
  },
  {
    qid: 'FAQ-06',
    tag: 'billing',
    question: 'Can I change my premium payment frequency from annual to monthly installments?',
    answer: 'Yes. You can switch to monthly automatic ACH or credit card installments in the billing portal with a $3/month installment administrative fee.'
  },
  {
    qid: 'FAQ-07',
    tag: 'pricing',
    question: 'How can I qualify for home insurance discounts on my annual premium?',
    answer: 'Discounts are available for: monitored burglar/fire alarm systems (-10%), hail-resistant roofing (-8%), multi-policy bundling with auto (-15%), and remaining claim-free for 3+ consecutive years (-5%).'
  }
];

export function CLASSIFY_FAQ_QUERY(userQuery, directThreshold = 0.92, adjacentThreshold = 0.78) {
  const normalized = userQuery.trim().toLowerCase();
  
  let bestMatch = SYNTHETIC_FAQ_CORPUS[0];
  let highestSim = 0.45;

  for (const item of SYNTHETIC_FAQ_CORPUS) {
    const qNorm = item.question.toLowerCase();
    
    const queryTokens = normalized.split(/\s+/);
    const itemTokens = qNorm.split(/\s+/);
    
    const overlap = queryTokens.filter(t => itemTokens.includes(t)).length;
    const tokenSim = overlap / Math.max(queryTokens.length, 3);
    
    let sim = 0.45 + (tokenSim * 0.45);
    
    if (normalized === qNorm || (normalized.includes("water damage") && qNorm.includes("water damage"))) {
      sim = Math.min(0.98, Math.max(sim, 0.95));
    } else if (normalized.includes("cancel") && qNorm.includes("cancel")) {
      sim = Math.min(0.96, Math.max(sim, 0.93));
    } else if (normalized.includes("deductible") && qNorm.includes("deductible")) {
      sim = Math.min(0.95, Math.max(sim, 0.91));
    } else if (normalized.includes("pipe") || normalized.includes("leak") || normalized.includes("flood")) {
      sim = Math.min(0.88, Math.max(sim, 0.81));
    }

    if (sim > highestSim) {
      highestSim = Math.round(sim * 100) / 100;
      bestMatch = item;
    }
  }

  let outcome = 'miss';
  let latencyMs = 2;
  let tokensConsumed = 0;
  let actionTaken = '';
  let deliveredAnswer = '';

  if (highestSim >= directThreshold) {
    outcome = 'direct';
    latencyMs = 2;
    tokensConsumed = 0;
    actionTaken = 'CACHE HIT: Short-circuit returned canonical FAQ answer verbatim. 0 LLM tokens, 2ms latency.';
    deliveredAnswer = bestMatch.answer;
  } else if (highestSim >= adjacentThreshold) {
    outcome = 'adjacent';
    latencyMs = 210;
    tokensConsumed = 480;
    actionTaken = 'DYNAMIC FEW-SHOT: Retrieved top Q&A pairs as in-context prompt examples. LLM dynamically tailored tone and scope.';
    deliveredAnswer = `[LLM REWRITE WITH DYNAMIC FEW-SHOT]: Based on policy reference (${bestMatch.qid}), ${bestMatch.answer} (Specifically customized for your scenario).`;
  } else {
    outcome = 'miss';
    latencyMs = 5;
    tokensConsumed = 0;
    actionTaken = 'EXPERT ESCALATION QUEUE: Query similarity below threshold. Logged to feedback flywheel for weekly semantic clustering and human authoring.';
    deliveredAnswer = 'I currently do not have a verified answer for this specific question. Your inquiry has been forwarded to our policy specialist team for review.';
  }

  return {
    userQuery,
    outcome,
    highestSim,
    bestMatch,
    latencyMs,
    tokensConsumed,
    actionTaken,
    deliveredAnswer
  };
}

export const FAQ_CLUSTER_MISSES = [
  {
    clusterId: 'CLUSTER-WATER-SEEPAGE',
    count: 42,
    theme: 'Foundation wall water seepage & hydrostatic pressure',
    sampleQueries: [
      'Does policy pay for water seeping through basement floor?',
      'Water entering foundation after heavy rain',
      'Hydrostatic pressure basement wall crack damage'
    ],
    status: 'RECOMMENDED_FOR_PROMOTION',
    suggestedAction: 'Author canonical entry: Exclude hydrostatic seepage; offer Foundation & Water Backup rider endorsement.'
  },
  {
    clusterId: 'CLUSTER-SOLAR-PANELS',
    count: 28,
    theme: 'Coverage for leased vs owned rooftop solar panels',
    sampleQueries: [
      'Are rooftop solar panels covered if damaged by hail?',
      'Leased solar panels insurance requirement',
      'Does dwelling coverage include solar inverter fire?'
    ],
    status: 'RECOMMENDED_FOR_PROMOTION',
    suggestedAction: 'Author canonical entry: Owned panels covered under dwelling; leased panels require utility endorsement.'
  }
];


// ==========================================
// 4. NOISY TEXT IN RAG: TYPOS & OCR ARTIFACTS
// ==========================================

export const NOISE_FAILURE_MODES = [
  {
    id: 'real_word_typos',
    name: '1. Real-Word Typographical Errors',
    example: '"form" instead of "from", "trail" instead of "trial", "statute" instead of "statue"',
    classicalResult: 'PASSES AS VALID (False Negative)',
    impact: 'Classical spell-check looks up dictionary: word exists, so no flag is raised. Lexical search matches completely wrong document.'
  },
  {
    id: 'word_boundary_errors',
    name: '2. Word Boundary Split / Merge Errors',
    example: '"in depth" vs "indepth", "data base" vs "database", "onboarding" vs "on boarding"',
    classicalResult: 'FAILS (Dictionary Miss)',
    impact: 'Levenshtein edit distance fails across space boundaries. Character tokenizers produce split subwords.'
  },
  {
    id: 'ocr_visual_substitutions',
    name: '3. OCR Visual Character Degradation',
    example: '"rn" ➔ "m" (modern ➔ rnodern), "cl" ➔ "d" (clear ➔ dear), "0" ➔ "O", "1" ➔ "l"',
    classicalResult: 'CORRUPTS RETRIEVAL',
    impact: 'BM25 recall drops to 0% because string hash misses. Dense embeddings degrade if subword splits change.'
  },
  {
    id: 'domain_jargon_acronyms',
    name: '4. Domain Jargon, Technical Codes & Acronyms',
    example: '"TS-999", "vLLM", "GDPR-Art6", "qdrant"',
    classicalResult: 'WRONGLY AUTO-CORRECTS (Corruption)',
    impact: 'Hunspell/Aspell attempts to "correct" TS-999 to "TO-999" or "vLLM" to "film", corrupting the user intent.'
  }
];

export function BENCHMARK_NOISY_RETRIEVAL(noiseScenario = 'ocr_glitch') {
  if (noiseScenario === 'ocr_glitch') {
    return {
      query: 'rnodern d0cument inte11igence with cIear indemnification',
      cleanTarget: 'modern document intelligence with clear indemnification',
      algorithms: [
        { name: 'Classical Levenshtein / SymSpell', recall: '18%', latency: '4ms', notes: 'Fails on "rn"->"m" and "cl"->"d" character merges.' },
        { name: 'Phonetic Soundex / Metaphone', recall: '24%', latency: '2ms', notes: 'Cannot reconcile number-letter visual substitutions like "0" and "1".' },
        { name: 'Standard BM25 (Exact Tokens)', recall: '12%', latency: '1ms', notes: 'CRITICAL FAILURE: 0 exact matches for corrupted tokens.' },
        { name: 'Character 3-Gram BM25', recall: '78%', latency: '6ms', notes: 'HIGH RECOVERY: Substring grams ("ern", "doc", "ume") match successfully.' },
        { name: 'Dense Bi-Encoder (BGE-Large)', recall: '86%', latency: '28ms', notes: 'STRONG: Semantic vector representation tolerates minor subword perturbations.' }
      ]
    };
  }

  if (noiseScenario === 'real_word_typo') {
    return {
      query: 'liability relief form gross negligence under statute',
      cleanTarget: 'liability relief from gross negligence under statute',
      algorithms: [
        { name: 'Classical Levenshtein / SymSpell', recall: '0%', latency: '3ms', notes: 'Ignored completely because "form" is a valid English dictionary word.' },
        { name: 'Phonetic Soundex / Metaphone', recall: '0%', latency: '2ms', notes: 'Generates code F650 for "form" instead of F650 for "from".' },
        { name: 'Standard BM25 (Exact Tokens)', recall: '42%', latency: '1ms', notes: 'Retrieves corporate forms instead of relational preposition "from".' },
        { name: 'Character 3-Gram BM25', recall: '45%', latency: '5ms', notes: 'Marginal improvement, still biased toward noun "form".' },
        { name: 'Dense Bi-Encoder (BGE-Large)', recall: '91%', latency: '25ms', notes: 'Contextual attention weights contextualize "relief from gross negligence" accurately.' }
      ]
    };
  }

  // Fast typing keyboard transposition
  return {
    query: 'wat is teh covarge for fyre damge to dwellng?',
    cleanTarget: 'what is the coverage for fire damage to dwelling?',
    algorithms: [
      { name: 'Classical Levenshtein / SymSpell', recall: '85%', latency: '5ms', notes: 'Well-suited for simple single-character transposition distance.' },
      { name: 'Phonetic Soundex / Metaphone', recall: '72%', latency: '3ms', notes: 'Maps homophones well but stumbles on "dwelling" truncation.' },
      { name: 'Standard BM25 (Exact Tokens)', recall: '0%', latency: '1ms', notes: 'Zero keyword matches across all corrupted tokens.' },
      { name: 'Character 3-Gram BM25', recall: '82%', latency: '6ms', notes: 'Recovers chunks across character splits.' },
      { name: 'Dense Bi-Encoder (BGE-Large)', recall: '94%', latency: '26ms', notes: 'Subword WordPiece/BPE merges handle colloquial typos seamlessly.' }
    ]
  };
}


// ==========================================
// 5. DEFENSIBLE "NOT IN THIS DOCUMENT" RAG: 4 BRICKS OF EVIDENCE
// ==========================================

export const ABSENCE_EVIDENCE_CASES = [
  {
    id: 'cmo_ai_electricity',
    title: '1. CMO Electricity Consumption for AI (April 2025 Case)',
    query: 'What was the Chief Marketing Officer projected AI electricity consumption for April 2025?',
    documentName: 'Enterprise_Quarterly_Report_Q1_2025.pdf',
    // Brick 1: Parse Coverage Evidence
    parseCoverage: {
      totalPages: 63,
      pagesWithText: 63,
      ocrDropouts: 0,
      extractedLines: 1420,
      extractedTables: 8,
      blankPages: 0,
      evidenceStatus: 'VERIFIED_COMPLETE_PARSE',
      summary: '63 of 63 pages parsed successfully. Zero OCR dropouts. Zero image-only blank pages. 1,420 lines of structured text available for search.'
    },
    // Brick 2: Validated Concept Vocabulary Evidence
    conceptVocabulary: [
      {
        concept: 'Concept A: Artificial Intelligence',
        synonyms: ['AI', 'artificial intelligence', 'machine learning', 'deep learning', 'neural net', 'generative AI', 'LLM', 'foundation model'],
        source: 'Expert Lexicon + Embedding Cluster Expansion'
      },
      {
        concept: 'Concept B: Electricity / Power Draw',
        synonyms: ['electricity', 'power consumption', 'kWh', 'megawatts', 'utility grid', 'energy draw', 'diesel generator'],
        source: 'Facility Management Domain Taxonomy'
      }
    ],
    // Brick 3: Full Document Sweep (Not Top-K!)
    documentSweep: {
      sweepMethod: 'FULL_CORPUS_TOKEN_SCAN',
      conceptAHits: 0,
      conceptBHits: 1,
      jointCoOccurrences: 0,
      distractorPassage: {
        page: 42,
        line: 18,
        snippet: '...facility backup diesel generators provide temporary electricity in the event of regional utility grid disruption...',
        whyNotAnswer: 'This passage discusses emergency backup diesel generators for physical facility continuity; it contains zero reference to AI, computing workloads, or the Chief Marketing Officer.'
      }
    },
    // Brick 4: Structured Justification Response
    structuredResponse: {
      verdict: 'NOT_IN_THIS_DOCUMENT',
      confidence: 1.0,
      justification: 'The requested information does not exist in this 63-page document. Complete parse coverage verified across all 1,420 lines. An exhaustive keyword sweep across 8 synonyms for AI and 7 synonyms for electricity yielded zero joint co-occurrences. The single occurrence of electricity on Page 42 refers to backup diesel generators.',
      parseCoverageVerified: true,
      sweepCount: 1420
    }
  },
  {
    id: 'commercial_earthquake_rider',
    title: '2. Commercial Earthquake Damage Deductible',
    query: 'What deductible applies to commercial earthquake shaking and foundation cracking?',
    documentName: 'Standard_Commercial_Property_Policy_v4.pdf',
    parseCoverage: {
      totalPages: 48,
      pagesWithText: 48,
      ocrDropouts: 0,
      extractedLines: 980,
      extractedTables: 5,
      blankPages: 0,
      evidenceStatus: 'VERIFIED_COMPLETE_PARSE',
      summary: '48 of 48 pages parsed. 0 OCR dropouts. 980 lines indexed. 5 endorsement schedules verified.'
    },
    conceptVocabulary: [
      {
        concept: 'Concept A: Earthquake / Earth Movement',
        synonyms: ['earthquake', 'earth movement', 'seismic', 'soil liquefaction', 'tectonic tremor'],
        source: 'Property Underwriting Lexicon'
      },
      {
        concept: 'Concept B: Deductible / Co-insurance',
        synonyms: ['deductible', 'retention', 'co-insurance', 'percentage deductible'],
        source: 'Actuarial Claims Taxonomy'
      }
    ],
    documentSweep: {
      sweepMethod: 'FULL_CORPUS_TOKEN_SCAN',
      conceptAHits: 2,
      conceptBHits: 14,
      jointCoOccurrences: 0,
      distractorPassage: {
        page: 12,
        line: 4,
        snippet: '...Section 4 Exclusions: Earth movement, including earthquake, volcanic eruption, landslide, and sinkholes are strictly excluded...',
        whyNotAnswer: 'Mentions earthquake only in the exclusions section; confirms that no earthquake coverage or deductible schedule exists in this policy.'
      }
    },
    structuredResponse: {
      verdict: 'NOT_IN_THIS_DOCUMENT',
      confidence: 1.0,
      justification: 'No earthquake deductible schedule exists. Complete parse confirmed across 48 pages. While "earthquake" appears twice, both occurrences reside inside the standard exclusions clause. No endorsement rider for seismic risk was bound in this contract.',
      parseCoverageVerified: true,
      sweepCount: 980
    }
  }
];


// ==========================================
// 6. YOUR JSON IS VALID BUT YOUR DATA IS WRONG (5 FAILURE MODES)
// ==========================================

export const STRUCTURED_FAILURE_MODES = [
  {
    id: 'enum_hallucination',
    name: '1. Enum Hallucination',
    subtitle: 'Grammar guarantees valid token, but meaning is wrong',
    rawInput: 'Support Ticket: "URGENT: Our production database just dropped customer billing data, and credit card payments are failing right now!"',
    validSchema: '{ "type": "object", "properties": { "priority": { "enum": ["low", "normal", "high", "urgent"] } } }',
    generatedJson: '{\n  "priority": "low"\n}',
    layer1Status: '100% SCHEMA VALID (Passes Zod / Pydantic)',
    semanticViolation: 'Model selected "low" from the valid enum set because the prompt framing or temperature bias shifted logits. The schema validator has zero context that database drop = urgent.',
    layer2Fix: 'Semantic Rule: If text contains keywords ["production", "data loss", "payment fail"], assert priority in ["high", "urgent"].'
  },
  {
    id: 'confident_fabrication',
    name: '2. Confident Fabrication (The Elephant Receipt)',
    subtitle: 'Schema forcing function invents plausible fields',
    rawInput: 'Image Upload: A photo of an African elephant walking across a savannah (Not an expense receipt!).',
    validSchema: '{ "vendor": "string", "amount": "number", "date": "string", "category": "string" }',
    generatedJson: '{\n  "vendor": "Savannah Bistro LLC",\n  "amount": 45.20,\n  "date": "2025-08-14",\n  "category": "Meals & Entertainment"\n}',
    layer1Status: '100% SCHEMA VALID (Valid types, valid keys)',
    semanticViolation: 'Because the schema required {vendor, amount, date}, constrained decoding forced the LLM to invent an expense receipt out of an elephant image rather than refusing.',
    layer2Fix: 'Layer 3 Uncertainty Gate: Add optional "is_receipt: boolean" or require visual confidence score >= 0.85 before populating expense fields.'
  },
  {
    id: 'cross_field_contradiction',
    name: '3. Cross-Field Contradiction',
    subtitle: 'Fields valid in isolation, but contradict together',
    rawInput: 'Contract terms: Agreement starts on June 1, 2026 and concludes on January 15, 2025.',
    validSchema: '{ "start_date": "YYYY-MM-DD", "end_date": "YYYY-MM-DD", "sentiment": "string", "score": "number" }',
    generatedJson: '{\n  "start_date": "2026-06-01",\n  "end_date": "2025-01-15",\n  "sentiment": "positive",\n  "score": 0.08\n}',
    layer1Status: '100% SCHEMA VALID (Both dates are valid ISO strings; score is a float)',
    semanticViolation: 'Start date is 17 months after end date! Sentiment is labeled "positive" but score is 0.08 (negative range). Schema checks fields independently and is blind to relational logic.',
    layer2Fix: 'Pydantic Model Validator (@model_validator): assert end_date >= start_date, and assert (sentiment == "positive") == (score > 0.5).'
  },
  {
    id: 'distributional_collapse',
    name: '4. Distributional Collapse (Confidence Flatline)',
    subtitle: 'Model converges onto safe, high-probability defaults',
    rawInput: 'Batch of 100 diverse customer emails (ranging from clear questions to noisy gibberish "asdfghjk").',
    validSchema: '{ "intent": "string", "confidence": "number (0.0 to 1.0)" }',
    generatedJson: '{\n  "intent": "general_inquiry",\n  "confidence": 0.98\n} // (Flatlined at 0.98 for all 100 outputs)',
    layer1Status: '100% SCHEMA VALID (All 100 records parse with float 0.98)',
    semanticViolation: 'Entropy Collapse: Model learned that 0.98 is a safe token sequence. Confidence metric is dead; gibberish gets the same 0.98 score as clear queries.',
    layer2Fix: 'Telemetry Entropy Monitor: Calculate Shannon entropy of confidence distribution. If variance < 0.01 across 50 calls, fire an alert for calibration drift.'
  },
  {
    id: 'phantom_extraction',
    name: '5. Phantom Extraction',
    subtitle: 'Inventing entities when the true answer is zero',
    rawInput: 'Document: "Meeting minutes: Team reviewed coffee supplies and agreed to order oat milk."',
    validSchema: '{ "identified_security_vulnerabilities": ["array of CVEs"] }',
    generatedJson: '{\n  "identified_security_vulnerabilities": [\n    "CVE-2023-4863 (Heap buffer overflow in WebP)",\n    "CVE-2024-3094 (XZ Utils backdoor)"\n  ]\n}',
    layer1Status: '100% SCHEMA VALID (Array of strings)',
    semanticViolation: 'Input text has 0 security vulnerabilities. But because the prompt demanded CVEs, constrained decoding fabricated real CVE numbers from training weights!',
    layer2Fix: 'Semantic Citation Grounding: Require every extracted entity to provide an exact character-index span offset from the source document.'
  }
];

export function CALCULATE_DISTRIBUTION_ENTROPY(scores) {
  if (!scores || scores.length === 0) return 0;
  // Calculate histogram bins
  const bins = {};
  scores.forEach(s => {
    const bin = Math.round(s * 10) / 10;
    bins[bin] = (bins[bin] || 0) + 1;
  });

  const total = scores.length;
  let entropy = 0;
  Object.values(bins).forEach(count => {
    const p = count / total;
    if (p > 0) {
      entropy -= p * Math.log2(p);
    }
  });

  return Math.round(entropy * 100) / 100;
}

