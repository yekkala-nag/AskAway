// ── Token economics: cache, trimming, model ladders — data & pure logic ──

// Illustrative price ladder ($ per million tokens). Cached input = 0.1× input.
export const PRICE_TIERS = {
  light: { label: 'Light tier', in: 1.0, out: 5.0, best: 'Sorting, tagging, extraction, summaries' },
  middle: { label: 'Middle tier', in: 3.0, out: 15.0, best: 'Drafting code and documents, lighter analysis' },
  top: { label: 'Top tier', in: 10.0, out: 50.0, best: 'Deep analysis, coordinating other agents' },
};

export const CACHE_WINDOWS = [
  { where: 'Subscription chat apps', minutes: 60 },
  { where: 'One major API', minutes: 5 },
  { where: 'Browser chat products', minutes: 8 },
  { where: 'Another major API', minutes: 30 },
];

export const TOKEN_FACTS = [
  { fact: 'Prediction is per token, and each token needs the maths for every token before it', why: 'This is why history is re-processed every turn — and why caching exists at all' },
  { fact: '≈ 1.33 tokens per word', why: 'Long words split; spaces, punctuation, numbers all count' },
  { fact: 'Output is the pricier lane', why: 'You pay to drive in and to drive back out — the return trip costs more' },
  { fact: 'Cached input costs 1/10 of normal input', why: 'A warm cache skips the recomputation — the single biggest lever in the bill' },
];

export const TRIMS = [
  { trim: 'Keep custom instructions and prompts short', recurring: 'Every turn, both directions', note: 'Every extra sentence in the request is a recurring charge while the cache is cold' },
  { trim: 'Ask for short replies (plain or compact technical style)', recurring: 'Every reply', note: 'Output tokens are the expensive lane — shrink them at the source' },
  { trim: 'Give only the context this task needs', recurring: 'Every turn', note: 'Noise hurts the answer AND the bill: irrelevant material muddies prediction and rides along each turn' },
  { trim: 'Enable only the tools this session needs', recurring: 'Before turn 1', note: 'Every tool lengthens the system prompt and adds a side door the model can wander through' },
  { trim: 'New task → new chat', recurring: 'At task boundaries', note: 'Two short focused chats beat one long rambling one, on cost and on quality' },
  { trim: 'Compress before walking away', recurring: 'End of session', note: 'Ask for a short portable brief of decisions, facts, open questions; paste it into a fresh chat next time' },
];

export const INTERN_RULES = [
  { rule: 'Hand the subagent one narrow job', why: 'Summarise this file, one yes/no call, dig and bring back only what matters' },
  { rule: 'Run it on a cheaper tier than the manager', why: 'The heavy reading happens at light-tier prices' },
  { rule: 'Keep the messy work out of the manager’s context', why: 'Dozens of raw documents never touch the expensive context window' },
  { rule: 'The job must finish inside the cache window', why: 'If the manager’s cache expires while the intern works, the whole context recomputes — you spent more than you saved' },
];

export const DETERMINISTIC = [
  { step: 'Arithmetic (totals, VAT, sums)', use: 'A three-line script', why: 'Models predict digits, not arithmetic — the script is free, instant, and identical every time' },
  { step: 'File parsing (documents, spreadsheets)', use: 'A script inside a skill', why: 'Precise readers beat asking the model to eyeball markup-laden formats' },
  { step: 'Fixed-format conversions and checks', use: 'Deterministic function', why: 'One right answer = no judgement needed = no tokens' },
  { step: 'Judgement calls, synthesis, negotiation drafts', use: 'The model', why: 'Where prediction actually earns its price' },
];

// ── Conversation cost simulation ──
// messages: array of {role, tokens}. Cost without cache: every turn re-sends all history.
// With cache: prefix within window is billed at 0.1× input; a miss bills the full prefix.
export function conversationCost(turns, { windowMin, gapMin, tierKey, cacheEnabled }) {
  const tier = PRICE_TIERS[tierKey];
  const cachedRate = tier.in * 0.1;
  let cost = 0, cachedTokens = 0, fullPrefixTokens = 0, outputTokens = 0, misses = 0;

  let history = 0; // tokens of prior turns replayed as prefix each turn
  for (let t = 0; t < turns.length; t++) {
    const fresh = turns[t].in;
    const out = turns[t].out;
    const warm = cacheEnabled && t > 0 && gapMin <= windowMin;
    if (cacheEnabled && t > 0 && !warm) misses++;
    if (t > 0) {
      if (warm) {
        cost += (history / 1e6) * cachedRate;
        cachedTokens += history;
      } else {
        cost += (history / 1e6) * tier.in;
        fullPrefixTokens += history;
      }
    }
    cost += (fresh / 1e6) * tier.in + (out / 1e6) * tier.out;
    outputTokens += out;
    history += fresh + out;
  }

  // Baseline: no caching at all — every turn re-bills the full prefix at input price.
  let naive = 0, h = 0;
  for (const tr of turns) {
    naive += ((h + tr.in) / 1e6) * tier.in + (tr.out / 1e6) * tier.out;
    h += tr.in + tr.out;
  }

  return {
    cost, naive, misses, cachedTokens, fullPrefixTokens, outputTokens,
    savings: naive - cost,
    savingsPct: naive > 0 ? (naive - cost) / naive : 0,
  };
}

// The coffee-break trap: same questions, different spacing.
export function spacedCost(totalQuestions, gapMin, opts) {
  const turns = Array.from({ length: totalQuestions }, () => ({ in: 900, out: 450 }));
  return conversationCost(turns, { ...opts, gapMin });
}

export const CHEAT_SHEET = [
  'Never miss the cache — know your window, keep the exchange moving inside it',
  'Compress before you leave — portable brief into a fresh chat',
  'Trim the fat — short prompts, short replies, only needed context and tools',
  'Match the tier to the job — clerks for clerical work, experts for expert work',
  'Use interns wisely — cheap subagents for narrow jobs that finish inside the window',
  'Let code do the maths — deterministic steps never cost tokens',
  'Watch the meter — transcripts and telemetry show where the money goes',
  'Stay free to leave — own your skills, prompts, and test suites',
];

export const CODE_CALC = `# Cost of one conversation, with and without a warm cache.
TIER = {"in": 3.0, "out": 15.0}          # $ per million tokens
CACHED = TIER["in"] * 0.1                # warm cache: a tenth of input price

def turn_cost(history, fresh, reply, warm):
    """history = all prior input+output tokens, replayed every turn."""
    prefix_rate = CACHED if warm else TIER["in"]
    return (history / 1e6) * prefix_rate \\
         + (fresh / 1e6) * TIER["in"] \\
         + (reply / 1e6) * TIER["out"]

def conversation_cost(turns, window_min, gap_min, cache=True):
    history, total = 0, 0.0
    for i, (fresh, reply) in enumerate(turns):
        warm = cache and i > 0 and gap_min <= window_min
        total += turn_cost(history, fresh, reply, warm)
        history += fresh + reply
    return total

turns = [(900, 450)] * 7                 # 7 questions, same thread
week  = conversation_cost(turns, 30, 1440)   # one a day: cache always cold
burst = conversation_cost(turns, 30, 5)      # all inside the window
print(f"week: \${week:.4f}   burst: \${burst:.4f}   saved: \${week - burst:.4f}")`;

export const CODE_LADDER = `# The two-second habit: pick the tier before you hit enter.
TASKS = {
    "label_incoming_emails":   "light",   # 500 rows, no judgement
    "extract_invoice_fields":  "light",
    "draft_code_module":       "middle",
    "edit_prose":              "middle",
    "plan_multi_agent_run":    "top",
    "deep_contract_analysis":  "top",
}

def route(task: str) -> str:
    tier = TASKS.get(task, "middle")      # default to the middle shelf
    if task.startswith("label_") or task.startswith("extract_"):
        tier = "light"                    # clerical work: no philosopher
    return tier

# Reasoning (a private chain of thought before answering) is why analysis
# improved so much — and why paying for it on clerical tasks is waste.
# Fast clerk for clerks' work; expert for expert work.`;
