// ── Agent architecture patterns: six production shapes, context techniques, guardrails ──
// Pure deterministic logic, Node-importable. Illustrative numbers only. No external sources.

export const PATTERNS = [
  {
    id: 'react',
    n: 1,
    name: 'ReAct loop',
    icon: '🔁',
    how: 'Alternate reason → act → observe until a final answer appears: pick one tool, read its observation, then decide whether to continue.',
    contextTip: 'Manage the scratchpad — truncate or summarize large tool observations so one huge dump does not ride along every later step.',
    pros: [
      'Flexible and self-correcting: a wrong turn is fixed on the next cycle',
      'Needs no upfront decomposition of the task',
    ],
    cons: [
      'Latency and cost grow with every extra step',
      'Long tasks drift as stale observations pile up in the scratchpad',
    ],
    useWhen: 'Open-ended research or debugging where nobody knows the steps in advance.',
    avoidWhen: 'Low-latency chat where every extra cycle is visible to the person waiting.',
  },
  {
    id: 'sequential',
    n: 2,
    name: 'Sequential pipeline',
    icon: '🏭',
    how: 'An assembly line of specialists — researcher → analyst → writer — where the output of one stage is the only input of the next.',
    contextTip: 'Each step gets ONLY its projection of state: the writer never sees the scraped pages, only the analyst’s brief.',
    pros: [
      'Reliable, with easy checkpoints at every stage boundary',
      'Token-efficient: no stage re-reads the whole history',
    ],
    cons: [
      'Strict linearity struggles with back-loops',
      'A late discovery of missing input forces a full rerun',
    ],
    useWhen: 'The steps are known in advance and each stage has exactly one job.',
    avoidWhen: 'Work that must loop back after a later stage uncovers a gap.',
  },
  {
    id: 'router',
    n: 3,
    name: 'Adaptive router',
    icon: '🔀',
    how: 'A fast intent classification dispatches the request into bounded sub-pipelines — several in parallel when the query mixes intents.',
    contextTip: 'Keep the router tiny: it reads the query alone, never the internals of every branch it can choose.',
    pros: [
      'Low latency — classification is one cheap call',
      'Each branch is testable and cheap in isolation',
    ],
    cons: [
      'Misrouting is a single point of failure: one wrong label derails the request',
      'Mixed queries can come back as robotically concatenated sub-answers',
    ],
    useWhen: 'One front door serves several clearly distinguishable intents.',
    avoidWhen: 'Intents that overlap or blur, where the classifier can only guess.',
  },
  {
    id: 'supervisor',
    n: 4,
    name: 'Supervisor–worker',
    icon: '🧑‍✈️',
    how: 'A manager plans the work, delegates parallel subtasks to workers that see local context only, keeps a task ledger, then synthesizes their results.',
    contextTip: 'Workers see only their own slice of the ledger — never the whole conversation and never a sibling’s draft.',
    pros: [
      'Scalable divide-and-conquer across independent subtasks',
      'The ledger makes progress inspectable and resumable',
    ],
    cons: [
      'Orchestration complexity grows with every added subtask',
      'The supervisor itself is a single point of failure',
    ],
    useWhen: 'A large task decomposes into subtasks that can run independently.',
    avoidWhen: 'Small tasks where planning and synthesis cost more than the work.',
  },
  {
    id: 'reflection',
    n: 5,
    name: 'Reflection loop',
    icon: '🪞',
    how: 'Generator → critic (a frontier model or deterministic tests) → revise, with the number of attempts capped in advance.',
    contextTip: 'Run deterministic checks mid-pipeline and spend critic calls only on the final, high-stakes output — a supervisor already acts as a critic.',
    pros: [
      'Measurably higher quality with automated QA inside the loop',
      'Catches constraint and format violations before anything ships',
    ],
    cons: [
      'Multiplies cost and latency with every revision round',
      'The critic can hallucinate flaws and drag output into a degradation loop',
    ],
    useWhen: 'Output quality matters more than speed and the mistakes are checkable.',
    avoidWhen: 'High-volume cheap generations where critic calls cost more than the retries.',
  },
  {
    id: 'swarm',
    n: 6,
    name: 'Autonomous swarm',
    icon: '🐝',
    how: 'Decentralized agents exchange messages on a shared event bus with topic-based pub/sub and structured payloads — no central coordinator.',
    contextTip: 'Messages ARE the context: structured payloads keep every agent’s view consistent without a shared transcript.',
    pros: [
      'Emergent problem-solving — agents specialize and claim matching topics',
      'Highly modular: members join or leave without rewiring',
    ],
    cons: [
      'Unpredictable: nobody holds the global plan',
      'Infinite chat-loop risk when agents keep replying to each other',
    ],
    useWhen: 'Research and creative sandboxes where exploration beats determinism.',
    avoidWhen: 'Strict enterprise automation that demands predictable, auditable paths.',
  },
];

// Deterministic profile → recommended pattern ids (plus a reason per id).
export function pickPattern(profile) {
  const p = profile || {};
  const knownSteps = !!p.knownSteps;
  const mixedIntent = !!p.mixedIntent;
  const parallelizable = !!p.parallelizable;
  const openEnded = !!p.openEnded;
  const highStakes = !!p.highStakes;

  const patterns = [];
  const reasons = {};
  const add = (id, reason) => {
    if (!patterns.includes(id)) patterns.push(id);
    reasons[id] = reason;
  };

  if (highStakes) {
    add('reflection', 'High-stakes iterative output needs a generator → critic revision loop with attempts capped in advance.');
    add('supervisor', 'A supervisor enforces those caps, arbitrates the critics, and keeps the task ledger.');
  }
  if (mixedIntent) {
    add('router', 'Mixed intents should be classified fast, then dispatched to bounded sub-pipelines — in parallel when they overlap.');
  }
  if (knownSteps && parallelizable) {
    add('supervisor', 'Known steps that can run in parallel divide cleanly under a supervisor with a task ledger.');
  } else if (knownSteps) {
    add('sequential', 'Known steps with no parallelism form a reliable, token-efficient assembly line.');
  }
  if (openEnded && parallelizable && !highStakes) {
    add('swarm', 'Open-ended parallel exploration with low stakes is a research sandbox — a decentralized swarm fits.');
  } else if (openEnded) {
    add('react', 'Open-ended research or debugging wants a reason → act → observe loop that self-corrects.');
  }
  if (patterns.length === 0) {
    add('react', 'No strong constraint detected — a single ReAct loop is the flexible default.');
  }
  return { patterns, reasons };
}

export const CONTEXT_TECHNIQUES = [
  {
    name: 'State projection',
    saving: 'Up to ~70% fewer prompt tokens per step',
    detail: 'Inject only what the current step needs. The writer receives the analyst’s brief, not the 200 pages that produced it.',
  },
  {
    name: 'Memory pruning & summarization',
    saving: 'Old observations shrink to ~5% of their original size',
    detail: 'When the scratchpad crosses a budget, summarize it with a cheap model and keep the summary plus only the most recent turn.',
  },
  {
    name: 'Structured scratchpads',
    saving: 'No extra tokens — large outputs become filterable',
    detail: 'Make intermediate fields parseable (a plan object, a findings list) so later steps read one field instead of re-reading a transcript.',
  },
  {
    name: 'Semantic memory retrieval',
    saving: 'Load ~2% of stored history per step',
    detail: 'Vector-index past actions and outcomes once, then retrieve only the entries relevant to the goal in front of the agent.',
  },
  {
    name: 'Prompt caching',
    saving: 'Loop iterations cost only the appended observations',
    detail: 'Static system prompt and tool schemas sit at the top and are paid once; across N loop iterations you pay only for what each iteration appends.',
  },
];

export const TRAJECTORY_METRICS = [
  {
    metric: 'Tool-selection accuracy',
    whatItCatches: 'Wrong, redundant or outright invented tool choices',
    spikeMeans: 'Routing context has drifted — tool descriptions or the plan no longer match reality.',
  },
  {
    metric: 'Schema-compliance rate',
    whatItCatches: 'Malformed arguments that fail validation on the way out',
    spikeMeans: 'The agent improvises formats — tighten the schema or move to structured output.',
  },
  {
    metric: 'Iteration count trend',
    whatItCatches: 'Loops that grind on without converging',
    spikeMeans: 'The agent is stuck: missing context, a broken tool, or a goal it cannot reach.',
  },
];

export const MAX_ITERATIONS = 12;
export const REPETITION_LIMIT = 3;

// Circuit breaker: iteration cap plus identical-consecutive-call detection.
export function circuitBreaker(iterations, lastCalls) {
  if (iterations >= MAX_ITERATIONS) {
    return {
      trip: true,
      reason: 'Iteration cap of ' + MAX_ITERATIONS + ' reached: inject a cap warning into the scratchpad and force a final answer.',
    };
  }
  const calls = Array.isArray(lastCalls) ? lastCalls : [];
  const n = calls.length;
  if (n >= REPETITION_LIMIT) {
    const tail = calls.slice(n - REPETITION_LIMIT);
    if (tail.every((c) => c === tail[0])) {
      return {
        trip: true,
        reason: '"' + tail[0] + '" called ' + REPETITION_LIMIT + ' times in a row: inject a repetition warning and require a different tool.',
      };
    }
  }
  return { trip: false, reason: '' };
}

// Loop-cost model for prompt caching: static prefix paid once, observations appended each turn.
export function loopCost(iterations, staticTokens, observationTokens) {
  const n = Math.max(0, Math.floor(iterations));
  const uncached = n * staticTokens + (observationTokens * n * (n + 1)) / 2;
  const cached = staticTokens + n * observationTokens;
  const saved = uncached - cached;
  const pct = uncached > 0 ? Math.round((saved / uncached) * 100) : 0;
  return { uncached, cached, saved, pct };
}

export const PATTERNS_CODE = `# Supervisor loop: plan once, delegate with local context, keep a ledger, synthesize.
def run_supervised(task, max_iter=12):
    ledger = []                                # {"id", "status", "result"} rows
    for sub in decompose(task):                # independent pieces only
        ledger.append({"id": sub.id, "status": "queued", "result": None})
    for _ in range(max_iter):                  # hard cap: no runaway orchestration
        open_tasks = [s for s in ledger if s["status"] == "queued"]
        if not open_tasks:
            break
        for s in open_tasks:
            s["status"] = "running"
        results = parallel(worker, open_tasks) # worker sees ONLY its own subtask
        for sub, res in zip(open_tasks, results):
            sub["result"], sub["status"] = res, "done"
        warn = check_breakers(ledger)          # cap + repeated-call detectors
        if warn:
            inject_warning(ledger, warn)       # written where the next step reads
    return synthesize([s["result"] for s in ledger])   # one final answer


def worker(sub):
    ctx = load_local(sub.id)                   # NOT the full transcript
    ctx += ledger_summary(only=sub.id)         # what changed since delegation
    return call_model(system=SYSTEM, input=ctx)`;
