// Agent Flywheel — The complete 9-step workflow for building software with AI agent swarms.
// Content sanitized: external author names, site references, and CTAs removed.
// CLI commands (br, bv, ntm) kept verbatim where semantically essential.

export const TRACK_OVERVIEW = {
  audience: "Engineers and tech leads who want to build production software by orchestrating swarms of AI coding agents, not by hand-writing code.",
  prerequisites: "Experience with at least one AI coding agent (CLI or IDE); familiarity with git and basic project structure.",
  pacing: "4 tabs, ~40 minutes to cover. Start with Agent Flywheel, then Planning & Beads, then Swarm Coordination, then Launch & Harden.",
  outcomes: [
    "Walk through the 9-step Agent Flywheel workflow end to end.",
    "Explain why planning consumes ~85% of the effort and why that is correct.",
    "Distinguish the three reasoning spaces (plan, bead, code) and their rework costs.",
    "Use the glossary and convergence signals to decide when a plan or bead set is ready.",
  ],
};

export const NINE_STEPS = [
  {
    n: "1",
    title: "Explain what you want to build",
    body: "Describe your concept, goals, user workflows, and why it matters to a frontier model with extended reasoning. The model produces an initial markdown plan.",
  },
  {
    n: "2",
    title: "Ask competing models to create their own plans",
    body: "Have multiple frontier models independently design the same project. Each brings different 'tastes' and blind spots, producing surprisingly different approaches.",
  },
  {
    n: "3",
    title: "Synthesize the best ideas into one",
    body: "A frontier model analyzes all competing plans and produces a 'best of all worlds' hybrid that artfully blends the strongest ideas.",
  },
  {
    n: "4",
    title: "Iterate relentlessly",
    body: "Round after round of refinement in fresh conversations, until suggestions become incremental. Plans routinely reach 3,000–6,000+ lines.",
  },
  {
    n: "5",
    title: "Convert the plan into beads",
    body: "Beads are self-contained work units (like Jira tasks, but optimized for coding agents). Each carries its own context, reasoning, dependencies, and test obligations. A complex plan may produce 200–500 beads.",
  },
  {
    n: "6",
    title: "Polish the beads obsessively",
    body: "'Check your beads N times, implement once.' Each polishing round finds things the previous round missed. Convergence signals tell you when to stop.",
  },
  {
    n: "7",
    title: "Launch a swarm of agents",
    body: "Multiple agent sessions (Claude Code, Codex, Gemini-CLI) running in parallel in the same codebase. They coordinate through Agent Mail, choose work via graph-theory routing, and execute beads systematically.",
  },
  {
    n: "8",
    title: "Tend the swarm, not the code",
    body: "The human checks for stuck beads, rescues agents after context compaction, sends review prompts, and ensures flow quality. You are the clockwork deity.",
  },
  {
    n: "9",
    title: "Agents review, test, and harden",
    body: "Self-review with fresh eyes, cross-agent review, random code exploration, testing coverage, UI/UX polish. Rounds and rounds until reviews come back clean.",
  },
];

export const GLOSSARY = [
  { term: "Markdown plan", meaning: "A large design document where the whole project still fits in context", why: "Where architecture, workflows, tradeoffs, and intent get worked out" },
  { term: "Bead", meaning: "A self-contained work unit with context, dependencies, and test obligations", why: "What agents actually execute" },
  { term: "Bead graph", meaning: "The full dependency structure across all beads", why: "What lets the router compute the right next work" },
  { term: "Plan space", meaning: "The reasoning mode where you are still shaping the whole system", why: "The cheapest place to buy correctness" },
  { term: "Bead space", meaning: "The reasoning mode where you are shaping executable work packets", why: "Where planning becomes swarm-ready" },
  { term: "Code space", meaning: "The implementation and verification layer inside the codebase", why: "Where local execution happens" },
  { term: "AGENTS.md", meaning: "The operating manual every agent must reload after compaction", why: "Keeps the swarm from forgetting how to behave" },
  { term: "Skill", meaning: "A reusable instruction bundle that teaches agents how to use a tool or execute a workflow", why: "How methods become repeatable instead of staying as tacit lore" },
  { term: "Compaction", meaning: "Context compression inside a long-running agent session", why: "Why re-reading AGENTS.md is mandatory" },
  { term: "Fungible agents", meaning: "Generalist agents that can replace one another", why: "Makes crashes and amnesia survivable" },
];

export const THREE_SPACES = [
  { space: "Plan space", artifact: "Large markdown plan", decides: "Architecture, features, workflows, tradeoffs — the whole system still fits in context" },
  { space: "Bead space", artifact: "Bead issues + dependency graph", decides: "Task boundaries, execution order, embedded context — agents need explicit, local work units" },
  { space: "Code space", artifact: "Source files + tests", decides: "Implementation and verification — the plan has already constrained the high-level decisions" },
];

export const COST_ARCHITECTURE = [
  { layer: "Plan space", cost: "1×", character: "Fixes are pure reasoning. Zero code churn." },
  { layer: "Bead space", cost: "5×", character: "Fixes rewrite orchestration. High coordination cost." },
  { layer: "Code space", cost: "25×", character: "Fixes pay the double-tax: implementation + cleanup." },
];

export const KEY_STATS = [
  { label: "Line Plan", value: "5,500", detail: "Synthesized from 4 frontier models" },
  { label: "Beads", value: "347", detail: "With full dependency structure" },
  { label: "Lines of Code", value: "11k", detail: "Working, tested, production-ready" },
  { label: "Time to Ship", value: "~5 hrs", detail: "25 agents, 204 commits" },
];

export const INSIGHTS = [
  "The models are far smarter when reasoning about a plan that is very detailed and fleshed out but still trivially small enough to easily fit within their context window. This is really the key insight behind the obsessive focus on planning.",
  "Planning is the cheapest place to buy correctness, coherence, and ambition. A big, complex markdown plan is shorter than a few substantive code files.",
  "You spend ~85% of your time on planning. That discomfort is the signal that you are doing it right.",
  "Once you have the beads in good shape based on a great markdown plan, the project is basically a foregone conclusion. The rest is mindless machine-tending of your swarm.",
];
