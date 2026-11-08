// Launch & Harden — Launching agent swarms, marching orders, thundering herd, tending, review, testing, and hardening.
// Content sanitized: external author names, site references, and CTAs removed.
// CLI commands (ntm, br, bv) kept verbatim where semantically essential.

export const TRACK_OVERVIEW = {
  audience: "Engineers who want to launch, tend, and harden a multi-agent swarm from first prompt to production-ready code.",
  prerequisites: "Familiarity with the Agent Flywheel, Planning & Beads, and Swarm Coordination tabs.",
  pacing: "7 sub-tabs, ~20 minutes to cover.",
  outcomes: [
    "Launch a multi-agent swarm with staggered starts and marching orders.",
    "Diagnose and fix a stuck or drifting swarm.",
    "Run fresh-eyes reviews, testing, and deep cross-agent review rounds.",
    "Apply UI/UX polish and de-slopification passes.",
  ],
};

export const NTM_COMMANDS = [
  { cmd: "ntm spawn myproject --cc=2 --cod=1 --gmi=1", desc: "Spawn a multi-agent session" },
  { cmd: "ntm send myproject \"Your marching orders prompt here\"", desc: "Send a prompt to ALL agents" },
  { cmd: "ntm send myproject --cc \"Focus on the API layer\"", desc: "Send to specific agent type" },
  { cmd: "ntm palette", desc: "Open the command palette (battle-tested prompts)" },
];

export const MARCHING_ORDERS = `First read ALL of the AGENTS.md file and README.md file super carefully and understand ALL of both! Then use your code investigation agent mode to fully understand the code, and technical architecture and purpose of the project. Then register with MCP Agent Mail and introduce yourself to the other agents.

Be sure to check your agent mail and to promptly respond if needed to any messages; then proceed meticulously with your next assigned beads, working on the tasks systematically and meticulously and tracking your progress via beads and agent mail messages.

Don't get stuck in "communication purgatory" where nothing is getting done; be proactive about starting tasks that need to be done, but inform your fellow agents via messages when you do so and mark beads appropriately.

When you're not sure what to do next, use the bv tool mentioned in AGENTS.md to prioritize the best beads to work on next; pick the next one that you can usefully work on and get started. Make sure to acknowledge all communication requests from other agents and that you are aware of all active agents and their names. Use ultrathink.`;

export const FIRST_TEN_MINUTES = [
  { step: "1", action: "Your session manager creates the agent terminals." },
  { step: "2", action: "You send the marching-orders prompt to each agent (staggered, not all at once)." },
  { step: "3", action: "Each agent reads AGENTS.md and the repo docs, inspects the codebase, and joins Agent Mail." },
  { step: "4", action: "Each agent checks who else is active, acknowledges waiting messages." },
  { step: "5", action: "Each agent uses bv --robot-triage and br ready --json to choose a bead." },
  { step: "6", action: "Before editing, the agent reserves the relevant file surface and announces the claim." },
  { step: "7", action: "Only then does the agent start coding, reviewing, or testing." },
];

export const SCALING_GUIDE = [
  { beads: "400+", claude: "4", codex: "4", gemini: "2" },
  { beads: "100–399", claude: "3", codex: "3", gemini: "2" },
  { beads: "<100", claude: "1", codex: "1", gemini: "1" },
];

export const AGENT_COMPOSITION = [
  { phase: "Initial plan creation", model: "Frontier model (web)", why: "Extended reasoning, all-you-can-eat pricing" },
  { phase: "Plan synthesis", model: "Frontier model (web)", why: "Best at being the final arbiter" },
  { phase: "Plan refinement", model: "Frontier model + second model (web)", why: "First reviews, second integrates" },
  { phase: "Plan → Beads conversion", model: "Claude Code (Opus)", why: "Best coding agent for structured creation" },
  { phase: "Bead polishing", model: "Claude Code (Opus)", why: "Consistent, thorough" },
  { phase: "Implementation", model: "Claude Code + Codex + Gemini", why: "Diverse swarm" },
  { phase: "Code review", model: "Claude Code + Gemini", why: "Gemini good for review duty" },
  { phase: "Final verification", model: "Codex (GPT)", why: "Different model catches different things" },
];

export const STUCK_SWARM = [
  { symptom: "Multiple agents pick the same bead", cause: "Starts not staggered; agents not marking in_progress", action: "Stagger starts, force explicit Agent Mail claims" },
  { symptom: "Agent goes in circles after compaction", cause: "Forgot AGENTS.md", action: "Force Reread AGENTS.md; kill/restart if erratic" },
  { symptom: "Bead sits in_progress too long", cause: "Agent crashed, silently blocked", action: "Check Agent Mail, reclaim the bead, split out blocker" },
  { symptom: "Contradictory implementations", cause: "Not coordinating through Agent Mail", action: "Audit reservation use, revise bead boundaries" },
  { symptom: "Lots of code but goal feels far", cause: "Strategic drift", action: "Stop, run reality check, revise bead graph" },
];

export const HUMAN_TENDING = [
  "Check bead progress. Use br list --status in_progress --json or bv --robot-triage.",
  "Handle compactions. When you see an agent acting confused, send: 'Reread AGENTS.md.'",
  "Run periodic reviews. Pick an agent and send the 'fresh eyes' review prompt.",
  "Manage rate limits. Switch accounts with the account manager.",
  "Commit periodically. Every 1–2 hours, designate one agent for the organized commit prompt.",
  "Handle surprises. Create new beads for unanticipated issues.",
];

export const FRESH_EYES_REVIEW = `Great, now I want you to carefully read over all of the new code you just wrote and other existing code you just modified with "fresh eyes" looking super carefully for any obvious bugs, errors, problems, issues, confusion, etc. Carefully fix anything you uncover. Use ultrathink.`;

export const ADVANCE_BEAD = `Reread AGENTS.md so it's still fresh in your mind. Use ultrathink. Use bv with the robot flags (see AGENTS.md for info on this) to find the most impactful bead(s) to work on next and then start on it. Remember to mark the beads appropriately and communicate with your fellow agents. Pick the next bead you can actually do usefully now and start coding on it immediately; communicate what you're working on to your fellow agents and mark beads appropriately as you work. And respond to any agent mail messages you've received.`;

export const TEST_COVERAGE = `Do we have full unit test coverage without using mocks/fake stuff? What about complete e2e integration test scripts with great, detailed logging? If not, then create a comprehensive and granular set of beads for all this with tasks, subtasks, and dependency structure overlaid with detailed comments. Use ultrathink.`;

export const UI_UX_SCRUTINY = `Great, now I want you to super carefully scrutinize every aspect of the application workflow and implementation and look for things that just seem sub-optimal or even wrong/mistaken to you, things that could very obviously be improved from a user-friendliness and intuitiveness standpoint, places where our UI/UX could be improved and polished to be slicker, more visually appealing, and more premium feeling and just ultra high quality, like Stripe-level apps. Use ultrathink.`;

export const PLATFORM_POLISH = `I still think there are strong opportunities to enhance the UI/UX look and feel and to make everything work better and be more intuitive, user-friendly, visually appealing, polished, slick, and world class in terms of following UI/UX best practices like those used by Stripe, don't you agree? And I want you to carefully consider desktop UI/UX and mobile UI/UX separately while doing this and hyper-optimize for both separately to play to the specifics of each modality. Use ultrathink.`;

export const RANDOM_EXPLORATION = `I want you to sort of randomly explore the code files in this project, choosing code files to deeply investigate and understand and trace their functionality and execution flows through the related code files which they import or which they are imported by.

Once you understand the purpose of the code in the larger context of the workflows, I want you to do a super careful, methodical, and critical check with "fresh eyes" to find any obvious bugs, problems, errors, issues, silly mistakes, etc. and then systematically and meticulously and intelligently correct them.

Be sure to comply with ALL rules in AGENTS.md and ensure that any code you write or revise conforms to the best practice guides referenced in the AGENTS.md file. Use ultrathink.`;

export const DE_SLOP_PATTERNS = [
  { pattern: "Emdash overuse", problem: "LLMs use emdashes constantly, even when semicolons or commas work better" },
  { pattern: "\"It's not X, it's Y\"", problem: "Formulaic contrast structure" },
  { pattern: "\"Here's why\" / \"Here's why it matters:\"", problem: "Clickbait-style lead-in" },
  { pattern: "\"Let's dive in\"", problem: "Forced enthusiasm" },
  { pattern: "\"At its core...\"", problem: "Pseudo-profound opener" },
  { pattern: "\"It's worth noting...\"", problem: "Unnecessary hedge" },
];

export const COMPILER_CHECKS = [
  { lang: "Rust", checks: "cargo check --all-targets, cargo clippy --all-targets -- -D warnings, cargo fmt --check" },
  { lang: "Go", checks: "go build ./..., go vet ./..." },
  { lang: "TypeScript", checks: "bun typecheck, bun lint" },
];
