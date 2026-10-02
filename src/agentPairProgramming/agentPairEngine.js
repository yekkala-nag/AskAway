// ============================================================================
// WORKING WITH AI CODING AGENTS ENGINE
// Methodology: Context Bounding, Test-Driven Verification,
// Problem Decomposition, and Keeping the Human-in-the-Loop
// ============================================================================

export const AGENT_PAIRING_PILLARS = [
  {
    pillar: "1. Provide Deep Local Context",
    mistake: "Asking 'Fix this bug' with zero repo context.",
    bestPractice: "Provide file paths, relevant schemas, database models, and error stack traces verbatim.",
    impact: "Reduces hallucinated API methods by 85%."
  },
  {
    pillar: "2. Decompose Into Atomic Milestones",
    mistake: "Prompting 'Build an entire real-time collaborative whiteboard app'.",
    bestPractice: "Break down into: (1) Data Schema, (2) Canvas State Engine, (3) WebSocket Sync, (4) UI Controls.",
    impact: "Prevents token degradation and incomplete code snippets."
  },
  {
    pillar: "3. Enforce Test-Driven Verification",
    mistake: "Assuming generated code works without running it.",
    bestPractice: "Instruct the agent to write a failing test first, implement the change, and run the test suite to verify.",
    impact: "Eliminates subtle logical regressions and edge-case bugs."
  },
  {
    pillar: "4. Maintain Human Architectural Control",
    mistake: "Letting agents make unvetted database migrations or dependency upgrades.",
    bestPractice: "Agent acts as the high-speed pair programmer; human retains final review on architecture and security.",
    impact: "Guarantees production standards and security compliance."
  }
];

export const WORKFLOW_COMPARISON_MODES = [
  {
    mode: "Vibe Coding (Generate & Pray)",
    failureRate: "64% in multi-file systems",
    speed: "Fast initially, slow debugging later",
    contextPreservation: "Poor",
    characteristics: [
      "Large vague prompts without constraints",
      "Blind copy-pasting into codebase",
      "No automated unit tests executed",
      "Accumulates technical debt and ghost bugs"
    ]
  },
  {
    mode: "Engineered Agent Pairing",
    failureRate: "< 8% across releases",
    speed: "Consistent 4x-10x throughput multiplier",
    contextPreservation: "High (Scoped context + explicit schemas)",
    characteristics: [
      "Explicit system rules (GEMINI.md / AGENTS.md / rules)",
      "Strict step-by-step milestone execution",
      "Continuous test execution and lint validation",
      "Human-in-the-loop review on diffs and architectural gates"
    ]
  }
];

export const PYTHON_AGENT_TEST_DRIVEN_SCRIPT = `# ============================================================================
# PRODUCTION AGENT PAIR PROGRAMMING WORKFLOW (TEST-DRIVEN AGENT PROMPT)
# Demonstrates how to structure instructions for reliable, self-verifying agents
# ============================================================================

"""
SYSTEM INSTRUCTION FOR CODING AGENT:
You are an expert pair-programming agent collaborating on an enterprise codebase.

STRICT OPERATIONAL RULES:
1. NEVER modify production database schemas without an explicit migration script.
2. For any feature or bugfix, FIRST write a reproduction unit test in \`tests/\`.
3. Implement the minimal necessary change in \`src/\` to make tests pass.
4. Run \`pytest tests/test_feature.py\` and confirm 100% green before returning.
5. If tests fail, inspect the stack trace, self-correct, and re-run up to 3 times.
6. Present a concise markdown diff and summary of files modified.
"""

def test_driven_agent_loop():
    # 1. Agent creates reproduction test
    test_code = """
def test_user_discount_calculation():
    from src.pricing import calculate_discount
    assert calculate_discount(amount=100.0, tier='VIP') == 20.0
    assert calculate_discount(amount=50.0, tier='STANDARD') == 0.0
"""
    # 2. Agent executes implementation and verifies
    print("Writing test -> Running PyTest -> Implementing logic -> Verifying build clean!")

if __name__ == '__main__':
    test_driven_agent_loop()
`;

// ============================================================================
// TOKEN OPTIMIZATION CHEAT SHEET
// Biggest savings when working with an AI coding assistant, plus how to read
// the token display. Illustrative figures — exact numbers vary by tool/model.
// ============================================================================

export const TOKEN_SAVERS = [
  {
    saver: "/compact — summarize the conversation",
    how: "Run /compact when total tokens exceed ~50k; the assistant summarizes history into a smaller context.",
    saves: "Large sessions: cuts context by 50–90% in one call.",
    watch: "Details get compressed — pin file paths & decisions before compacting."
  },
  {
    saver: "Batch bash commands in one message",
    how: "npm install && npm run build && npm test as a single command instead of 3 separate shell calls.",
    saves: "Each turn re-sends full history — fewer turns = fewer input tokens.",
    watch: "Chain only when steps truly depend on each other; a failing step still stops the run."
  },
  {
    saver: "Specify line ranges when reading files",
    how: '"Read lines 1–80 of server.ts" instead of reading the whole 500-line file.',
    saves: "~2k tokens per avoided full-file read; adds up fast across a session.",
    watch: "If you need cross-file context, whole-file reads are worth it — scope narrowly only when you know the target."
  },
  {
    saver: "Stay in the same session",
    how: "Re-use the session for related work instead of starting fresh — cached context is served at a fraction of normal cost.",
    saves: "Cache reads are typically ~10% of the base input price.",
    watch: "Stale context misleads — start fresh when the topic or branch changes."
  },
  {
    saver: "Write clear, scoped tasks",
    how: '"Fix the login bug in auth.ts line 42" instead of "Fix all the bugs in the project".',
    saves: "The agent reads fewer files → less input, less output, fewer tokens.",
    watch: "Scope too tight and the fix is a band-aid; name the constraint (file/line/error) but not the solution."
  }
];

export const TOKEN_DISPLAY = [
  { term: "Input tokens", meaning: "Everything sent to the model: your prompt + file contents the agent read + conversation history.", cost: "Base cost.", tip: "Browsers of large files dominate this — use line ranges." },
  { term: "Output tokens", meaning: "Words the model generated: code, explanations, plans.", cost: "Usually priced several × input.", tip: "Long verbose replies cost more — ask for concise diffs when you only need changes." },
  { term: "Cache read", meaning: "Prompt portions served from the provider's prompt cache instead of re-sent.", cost: "≈10% of base input price.", tip: "Rewriting the system prompt or restarting sessions evicts the cache." },
  { term: "Cache creation", meaning: "First time a large context block is written to cache.", cost: "Slightly more than base input upfront.", tip: "Pays for itself the moment the same context is reused." }
];
