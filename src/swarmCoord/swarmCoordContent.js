// Swarm Coordination — Agent Mail, beads, bv graph-theory routing, AGENTS.md, single-branch git, DCG, and agent fungibility.
// Content sanitized: external author names, site references, and CTAs removed.
// CLI commands (br, bv, ntm) kept verbatim where semantically essential.

export const TRACK_OVERVIEW = {
  audience: "Engineers who want to understand the coordination stack that makes multi-agent swarms work: Agent Mail, beads, bv routing, AGENTS.md, and the single-branch git model.",
  prerequisites: "Familiarity with the Agent Flywheel overview and Planning & Beads tabs.",
  pacing: "7 sub-tabs, ~20 minutes to cover.",
  outcomes: [
    "Explain why three interlocking tools (Agent Mail + Beads + bv) are each necessary and insufficient alone.",
    "Use bv's graph-theory routing patterns to prioritize work.",
    "Write an effective AGENTS.md with the core rules every agent must follow.",
    "Understand the single-branch git model and why branch-per-agent fails at scale.",
    "Explain agent fungibility and why specialist agents are a liability.",
  ],
};

export const COORDINATION_STACK = [
  { tool: "Agent Mail", role: "Communication layer", why: "Without beads, agents have no structured work to coordinate around. Without Agent Mail, agents can't communicate." },
  { tool: "Beads", role: "Work structure layer", why: "Without bv, agents randomly choose tasks instead of computing optimal execution order." },
  { tool: "bv", role: "Routing layer", why: "Without Agent Mail, agents can't coordinate. Without beads, there's nothing to route." },
];

export const BV_PATTERNS = [
  { pattern: "High PageRank + High Betweenness", meaning: "Critical bottleneck", action: "DROP EVERYTHING, fix this first" },
  { pattern: "High PageRank + Low Betweenness", meaning: "Foundation piece", action: "Important but not currently blocking" },
  { pattern: "Low PageRank + High Betweenness", meaning: "Unexpected chokepoint", action: "Investigate why this is a bridge" },
  { pattern: "Low PageRank + Low Betweenness", meaning: "Leaf work", action: "Safe to parallelize freely" },
];

export const BV_COMMANDS = [
  { cmd: "bv --robot-triage", desc: "Full recommendations with scores" },
  { cmd: "bv --robot-next", desc: "Just the single top pick + claim command" },
  { cmd: "bv --robot-plan", desc: "Parallel execution tracks with unblocks lists" },
  { cmd: "bv --robot-insights", desc: "Full graph metrics: PageRank, betweenness, HITS" },
  { cmd: "bv --robot-priority", desc: "Priority recommendations with reasoning and confidence" },
  { cmd: "bv --robot-diff --diff-since <ref>", desc: "Changes since last check" },
];

export const AGENT_MAIL_RULES = [
  { rule: "No broadcast-to-all default", detail: "Agents are lazy and will only use broadcast mode, spamming every agent with mostly irrelevant information." },
  { rule: "Good MCP ergonomics", detail: "It takes careful iteration to get the API surface right." },
  { rule: "No git worktrees", detail: "Worktrees demolish development velocity and create reconciliation debt." },
  { rule: "Advisory file reservations", detail: "Agents call dibs temporarily on files, but it's not rigidly enforced, and reservations expire." },
  { rule: "Semi-persistent identity", detail: "Agent Mail generates whimsical names like 'ScarletCave' and 'CoralBadger'." },
];

export const AGENTS_MD_RULES = [
  { rule: "Rule 0: The Override Prerogative", detail: "The human's instructions override everything." },
  { rule: "Rule 1: No File Deletion", detail: "Never delete files without explicit permission." },
  { rule: "No destructive git commands", detail: "git reset --hard, git clean -fd, rm -rf are forbidden." },
  { rule: "Branch policy", detail: "All work happens on main, never master." },
  { rule: "No script-based code changes", detail: "Always make code changes manually." },
  { rule: "No file proliferation", detail: "No mainV2.rs or main_improved.rs variants." },
  { rule: "Compiler checks after changes", detail: "Always verify no errors were introduced." },
  { rule: "Multi-agent awareness", detail: "Never stash, revert, or overwrite other agents' changes." },
];

export const BLOCKED_COMMANDS = [
  { blocked: "git reset --hard", safe: "git stash", why: "Recoverable" },
  { blocked: "git checkout -- file", safe: "git stash push file", why: "Preserves changes" },
  { blocked: "git push --force", safe: "git push --force-with-lease", why: "Checks remote unchanged" },
  { blocked: "git clean -fd", safe: "git clean -fdn (preview first)", why: "Shows what would delete" },
  { blocked: "rm -rf /path", safe: "rm -ri /path", why: "Interactive confirmation" },
];

export const DCG_ORIGIN = "On December 17, 2025, an agent ran git checkout -- on uncommitted work. Files were recovered via git fsck --lost-found, but the incident proved that instructions do not prevent execution. Mechanical enforcement does. DCG was built the next day.";

export const FUNGIBILITY = [
  "Every agent is a generalist. No role specialization.",
  "All agents read the same AGENTS.md and can pick up any bead.",
  "This is deliberately opposed to 'specialist agent' architectures where one agent has a special role.",
  "Specialist agents become single points of failure.",
  "With 12 fungible agents, losing one makes almost no difference.",
  "When one agent breaks, it's not even a problem when all the agents are fungible. Agents become like commodities and can be instantiated and destroyed at will and the only downside is some slowdown and some wasted tokens.",
];

export const POST_COMPACTION_RESET = "Reread AGENTS.md so it's still fresh in your mind.";

export const AGENTS_MD_PROMPT = `Reread AGENTS.md so it's still fresh in your mind.`;
