import React, { useState } from "react";
import OReillyRadarTab from "./OReillyRadarTab.jsx";
import GraphEngineeringTab from "./GraphEngineeringTab.jsx";
import { COLORS } from "./loopTheme.js";

const TAB_GROUPS = [
  {
    id: "pattern",
    label: "Pattern",
    items: [
      { id: "patterns", label: "Patterns" },
      { id: "blocks", label: "6 Blocks" },
      { id: "graphs", label: "Graph Engineering" },
      { id: "realworld", label: "Real World" },
    ],
  },
  {
    id: "style",
    label: "Style",
    items: [
      { id: "library", label: "Loop Library" },
      { id: "guide", label: "Practical Guide" },
      { id: "commands", label: "Commands" },
      { id: "basics", label: "Claude Basics" },
    ],
  },
  {
    id: "more",
    label: "More",
    items: [
      { id: "overview", label: "Overview" },
      { id: "start", label: "Start Here" },
      { id: "oreilly", label: "Architecture" },
      { id: "addy", label: "Loop Design" },
    ],
  },
];

const BLOCKS = [
  {
    id: "trigger",
    label: "Trigger",
    icon: "⚡",
    color: COLORS.amber,
    desc: "What kicks the loop off without you",
    examples: ["Cron schedule (8am weekdays)", "CI failure event", "New PR opened", "Incoming ticket", "New library release"],
  },
  {
    id: "workspace",
    label: "Isolated Workspace",
    icon: "🗂",
    color: COLORS.sky,
    desc: "Parallel runs that can't clobber each other's state",
    examples: ["Git worktrees per task", "Containers per session", "Separate branches", "Fresh context per agent"],
  },
  {
    id: "skills",
    label: "Skills",
    icon: "📋",
    color: COLORS.violet,
    desc: "Project conventions saved in files — not re-explained each session",
    examples: ["CLAUDE.md patterns", "Architecture decisions", "Edge cases library", "SDK patterns", "~70–150 tokens metadata"],
  },
  {
    id: "connectors",
    label: "Connectors (MCP)",
    icon: "🔌",
    color: COLORS.emerald,
    desc: "Actual tools the loop touches",
    examples: ["Repo (read/write)", "CI pipeline", "Issue tracker", "Chat / Slack", "Database / backend"],
  },
  {
    id: "subagents",
    label: "Sub-agent Roles",
    icon: "🤖",
    color: "#FF6B6B",
    desc: "Separated roles so the model doesn't grade its own work",
    examples: ["Explorer / planner", "Implementer", "Verifier (separate session)", "5-reviewer panel", "Supervisor agent"],
  },
  {
    id: "memory",
    label: "Memory / State",
    icon: "💾",
    color: "#C084FC",
    desc: "What persists across iterations so the agent doesn't repeat work",
    examples: ["STATE.md read/write", "--continue / --resume flags", "External file logs", "Failure pattern notes", "Vector store"],
  },
];

const PATTERNS = [
  {
    id: "ralph",
    name: "Ralph Loop",
    tag: "Simplest",
    tagColor: COLORS.emerald,
    trigger: "Manual / bash command",
    action: "Re-runs same prompt in a bash loop; tracks progress via git commits",
    stop: "Completion condition met OR max iterations hit",
    gate: "Max iteration cap (e.g. 50 loops)",
    useCase: "Full test-framework migration, large refactors",
    tokens: "Low",
    detail: "The simplest version — the same prompt re-runs until a completion condition is hit. Progress tracked via git commits rather than memory. ralph-claude-code adds exit detection and rate limiting so it doesn't spin forever on one error.",
  },
  {
    id: "ralf",
    name: "RALF",
    tag: "Multi-session",
    tagColor: COLORS.sky,
    trigger: "Manual start",
    action: "Read → Act → Log → Feed-forward. Each session reads the prior log, does its slice, writes structured handoff.",
    stop: "All assigned slices complete",
    gate: "Structured handoff log (human can inspect between sessions)",
    useCase: "50,000-line refactor, multi-repo migration — anything too large for one context window",
    tokens: "Medium",
    detail: "Built for tasks too big for one context window. Each session reads what the previous one left, does only its assigned slice, writes a structured record of what happened and what's next, then hands off.",
  },
  {
    id: "ralphex",
    name: "ralphex",
    tag: "Guarded",
    tagColor: COLORS.violet,
    trigger: "Manual after planning phase",
    action: "Claude drafts plan via dialogue → each task runs in a fresh isolated session → 5 reviewer agents check in parallel before merge",
    stop: "5-reviewer panel approves (quality, tests, simplification, docs, implementation)",
    gate: "Reviewer panel required — nothing merges without all 5 passing",
    useCase: "Complex features, anything production-critical",
    tokens: "High — but verifier catches errors before they ship",
    detail: "Claude drafts the plan through dialogue first. Each task then runs in its own fresh session. Before anything merges, five separate reviewer agents check it in parallel. That panel is the 'something that can say no' built into the loop.",
  },
  {
    id: "depupgrade",
    name: "Dependency Upgrade",
    tag: "Scheduled",
    tagColor: COLORS.amber,
    trigger: "Daily cron — checks for new library releases",
    action: "If new release found: upgrade, handle migration, open PR. If not: log and stop.",
    stop: "PR opened successfully OR no new version found",
    gate: "PR review — human approves before merge",
    useCase: "Any dependency you need current (Astro, React, internal SDKs)",
    tokens: "Low",
    detail: "A scheduled check looks for a new release. If one exists, the agent performs the upgrade and any needed migration itself and opens a PR. No human touches it until review.",
  },
  {
    id: "selfheal",
    name: "Self-Healing Production",
    tag: "Continuous",
    tagColor: COLORS.rose,
    trigger: "Cron every 15 minutes",
    action: "Check health & test results → if failing, spin up coding agent in fresh worktree with failing tests as goal → iterate → log fix pattern",
    stop: "Health checks / tests pass",
    gate: "Tests must pass — agent cannot declare success without external verification",
    useCase: "Flaky tests, intermittent production issues, overnight reliability",
    tokens: "Variable",
    detail: "Cron every 15 minutes checks deployed health. If something fails, it spins up a coding agent in a fresh worktree. After fixing, logs a note about the failure pattern so the same issue resolves faster next time.",
  },
  {
    id: "prtriage",
    name: "PR Review-Comment Loop",
    tag: "Event-driven",
    tagColor: COLORS.sky,
    trigger: "New PR review comment posted",
    action: "Triage comment → push fix → reply to comment → watch for new comments → repeat",
    stop: "All review comments resolved",
    gate: "Uses agent-reviews CLI — structured output prevents token burn on gh CLI parsing",
    useCase: "Any PR with many review cycles",
    tokens: "Low — structured interface vs raw gh CLI",
    detail: "Handles the full review-comment cycle automatically. Without this, someone types 'fixed in abc1234' forty-seven times per PR. Uses compact structured output so agents don't burn tokens parsing verbose gh CLI output.",
  },
  {
    id: "reprobot",
    name: "Repro-Bot (Issue Triage)",
    tag: "Human-gated",
    tagColor: COLORS.emerald,
    trigger: "Human tags issue with .Run Repro-Bot on GitHub",
    action: "Extract repro steps → classify (backend/frontend) → run through repro using tool recipes → note gaps for next run",
    stop: "Repro confirmed or issue escalated",
    gate: "Human tag required — not auto-triggered (public issues = prompt injection risk)",
    useCase: "Bug triage at scale — used in production by Metabase",
    tokens: "Medium",
    detail: "Deliberately not triggered automatically on every issue. Public GitHub issues are easy spots to plant a prompt injection, so the human tag is the safety gate. After each run, the bot reviews its own notes to improve for next time.",
  },
  {
    id: "morningtriage",
    name: "Morning Triage",
    tag: "Daily",
    tagColor: COLORS.amber,
    trigger: "Cron every weekday at 8am",
    action: "Read P1 GitHub issues → find unassigned ones → write initial plans → assign owners → stop when goal confirmed",
    stop: "All P1 issues have assigned owner + plan comment",
    gate: "Human reviews output over coffee — nothing is force-pushed",
    useCase: "Team issue hygiene, daily standup prep",
    tokens: "Low",
    detail: "You set this up once. Every morning an agent wakes up, pulls the issue list, triages anything unassigned, writes initial plans, and stops when the goal is confirmed. You review results over coffee. That's the leverage this pattern creates.",
  },
];

function LoopAnimSVG() {
  const nodes = [
    { label: "TRIGGER", x: 200, y: 30, color: COLORS.amber },
    { label: "AGENT", x: 340, y: 130, color: COLORS.sky },
    { label: "VERIFY", x: 280, y: 260, color: COLORS.emerald },
    { label: "MEMORY", x: 120, y: 260, color: COLORS.violet },
    { label: "PLAN", x: 60, y: 130, color: "#FF6B6B" },
  ];
  const cx = 200, cy = 150, r = 110;
  const pathD = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r}`;
  return (
    <svg width="400" height="300" viewBox="0 0 400 300" style={{ overflow: "visible", maxWidth: "100%" }}>
      <defs>
        <style>{`
          @keyframes dash { to { stroke-dashoffset: -200; } }
          @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
          .flow { animation: dash 2.5s linear infinite; }
        `}</style>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Orbit ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={COLORS.border} strokeWidth="1.5" />
      {/* Animated dashes */}
      {[COLORS.amber, COLORS.sky, COLORS.emerald, COLORS.violet, "#FF6B6B"].map((c, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={c}
          strokeWidth="2"
          strokeDasharray="30 170"
          strokeDashoffset={i * -40}
          className="flow"
          style={{ animationDelay: `${i * 0.5}s`, opacity: 0.7 }}
          filter="url(#glow)"
        />
      ))}
      {/* Center label */}
      <text x={cx} y={cy - 8} textAnchor="middle" fill={COLORS.muted} fontSize="10" fontFamily="monospace">LOOP</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill={COLORS.text} fontSize="13" fontFamily="monospace" fontWeight="700">∞</text>
      {/* Nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={22} fill={COLORS.surface2} stroke={n.color} strokeWidth="1.5" filter="url(#glow)" />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fill={n.color} fontSize="7.5" fontFamily="monospace" fontWeight="700">{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

function BlockCard({ block, expanded, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        background: expanded ? COLORS.surface2 : COLORS.surface,
        border: `1px solid ${expanded ? block.color + "55" : COLORS.border}`,
        borderRadius: 10,
        padding: "14px 16px",
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: expanded ? `0 0 16px ${block.color}22` : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>{block.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ color: block.color, fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>{block.label}</div>
          <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{block.desc}</div>
        </div>
        <span style={{ color: COLORS.muted, fontSize: 16 }}>{expanded ? "▾" : "▸"}</span>
      </div>
      {expanded && (
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {block.examples.map((e, i) => (
            <span key={i} style={{
              background: block.color + "18",
              border: `1px solid ${block.color}44`,
              color: block.color,
              borderRadius: 5,
              padding: "3px 8px",
              fontSize: 11,
              fontFamily: "monospace",
            }}>{e}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function PatternCard({ p }) {
  const [open, setOpen] = useState(false);
  const tokenColors = { Low: COLORS.emerald, Medium: COLORS.amber, High: COLORS.rose, Variable: COLORS.violet };
  return (
    <div style={{
      background: COLORS.surface,
      border: `1px solid ${open ? p.tagColor + "55" : COLORS.border}`,
      borderRadius: 12,
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: "14px 16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ color: COLORS.text, fontWeight: 700, fontSize: 15 }}>{p.name}</span>
            <span style={{
              background: p.tagColor + "22",
              border: `1px solid ${p.tagColor}55`,
              color: p.tagColor,
              borderRadius: 4,
              padding: "1px 7px",
              fontSize: 10,
              fontFamily: "monospace",
              fontWeight: 700,
            }}>{p.tag}</span>
            <span style={{
              background: (tokenColors[p.tokens.split(" ")[0]] || COLORS.muted) + "18",
              color: tokenColors[p.tokens.split(" ")[0]] || COLORS.muted,
              borderRadius: 4,
              padding: "1px 7px",
              fontSize: 10,
              fontFamily: "monospace",
            }}>tokens: {p.tokens}</span>
          </div>
          <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>{p.useCase}</div>
        </div>
        <span style={{ color: COLORS.muted, fontSize: 16, marginTop: 2 }}>{open ? "▾" : "▸"}</span>
      </div>
      {open && (
        <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${COLORS.border}` }}>
          <p style={{ color: COLORS.muted, fontSize: 13, margin: "12px 0 14px", lineHeight: 1.6 }}>{p.detail}</p>
          {[
            { label: "TRIGGER", value: p.trigger, color: COLORS.amber },
            { label: "ACTION", value: p.action, color: COLORS.sky },
            { label: "STOP CONDITION", value: p.stop, color: COLORS.emerald },
            { label: "HUMAN GATE", value: p.gate, color: COLORS.violet },
          ].map(row => (
            <div key={row.label} style={{
              display: "flex",
              gap: 10,
              marginBottom: 8,
              alignItems: "flex-start",
            }}>
              <span style={{
                color: row.color,
                fontFamily: "monospace",
                fontSize: 9,
                fontWeight: 700,
                minWidth: 100,
                paddingTop: 1,
                letterSpacing: "0.05em",
              }}>{row.label}</span>
              <span style={{ color: COLORS.text, fontSize: 12, lineHeight: 1.5 }}>{row.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StartHere() {
  const steps = [
    {
      n: "1",
      title: "Pick one task with a real pass/fail signal",
      body: "A flaky test, a stale report, a class of issue that shows up weekly. If you can't define 'done' in one sentence, the loop won't know when to stop.",
      color: COLORS.amber,
    },
    {
      n: "2",
      title: "Wire it to a trigger you already have",
      body: "A GitHub Action cron, Claude Code's -p flag in a bash script, a webhook. Don't build infrastructure — use what exists.",
      color: COLORS.sky,
    },
    {
      n: "3",
      title: "Add a stop condition that isn't the model agreeing with itself",
      body: "A failing test, a type check, a real exit code. Without an external gate, you have an agent loop agreeing with itself on repeat.",
      color: COLORS.emerald,
    },
    {
      n: "4",
      title: "Run it once and watch",
      body: "Look for where it burns tokens on useless context, where it retries blind, where it stops too early. That's your iteration surface.",
      color: COLORS.violet,
    },
    {
      n: "5",
      title: "Add a verifier only after the loop proves reliable",
      body: "One scheduled triage automation + one verifier agent captures most of the value for a fraction of the cost of a fully autonomous system.",
      color: "#FF6B6B",
    },
  ];
  const risks = [
    { icon: "🔄", label: "Stale context", fix: "Every run starts by refreshing state — fetch latest PR base/head, current CI run, not last cached output." },
    { icon: "⚔️", label: "Race conditions", fix: "Shared read is fine. Shared write should be rare. Five loops touching the same PR = race condition, not automation." },
    { icon: "💸", label: "$400 overnight bill", fix: "Set max iterations + time limit. 'If no new commit in 5 iterations, stop' catches futile loops before they burn." },
    { icon: "🧠", label: "No memory", fix: "STATE.md or a log file the loop reads every session. A loop without memory is just spinning." },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <div style={{ color: COLORS.amber, fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>STARTING POINT</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {steps.map(s => (
            <div key={s.n} style={{
              display: "flex",
              gap: 14,
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              padding: "14px 16px",
            }}>
              <div style={{
                width: 28, height: 28, minWidth: 28,
                borderRadius: "50%",
                background: s.color + "22",
                border: `1px solid ${s.color}66`,
                color: s.color,
                fontFamily: "monospace",
                fontWeight: 700,
                fontSize: 13,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{s.n}</div>
              <div>
                <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 14 }}>{s.title}</div>
                <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4, lineHeight: 1.6 }}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ color: COLORS.rose, fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>FAILURE MODES TO GUARD AGAINST</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {risks.map(r => (
            <div key={r.label} style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              padding: "12px 14px",
            }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>{r.icon}</div>
              <div style={{ color: COLORS.rose, fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>{r.label}</div>
              <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>{r.fix}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const LOOP_LIBRARY = [
  // ENGINEERING
  { id:"ll-1", cat:"Engineering", featured:false, name:"The docs sweep", desc:"Keeps documentation aligned with the current codebase and opens a reviewable pull request.", prompt:"Whenever a documentation pass is needed, review the codebase in full and make sure all documentation reflects the current implementation. Update stale documentation, verify the changes, then open a pull request." },
  { id:"ll-2", cat:"Engineering", featured:false, name:"The architecture satisfaction loop", desc:"Refactors architecture in small, tested, independently reviewed checkpoints.", prompt:"Refactor until you are happy with the architecture. After each significant step, live-test the system, run autoreview, and commit. Track progress in /tmp/refactor-{projectname}.md." },
  { id:"ll-3", cat:"Engineering", featured:false, name:"The sub-50ms page-load loop", desc:"Optimizes every page until it consistently loads in under 50 ms.", prompt:"Continue optimizing the code for speed. After each significant change, measure page-load performance across every page under the same repeatable test conditions. Continue until every page loads in under 50 ms." },
  { id:"ll-4", cat:"Engineering", featured:false, name:"The production error sweep", desc:"Finds, fixes, and verifies actionable errors in production.", prompt:"Review our production logs for errors. If you find an actionable issue, trace it to its root cause, fix it, verify the fix, and open a pull request. If no actionable errors are present, stop without making changes." },
  { id:"ll-5", cat:"Engineering", featured:false, name:"The 100% test coverage loop", desc:"Adds meaningful tests until the full suite reaches 100% coverage.", prompt:"Add tests until we have 100% test coverage." },
  { id:"ll-6", cat:"Engineering", featured:false, name:"The logging coverage loop", desc:"Adds useful, tested logs to every important system path.", prompt:"Review the system's logging and add missing coverage until every important path produces useful, tested logs." },
  { id:"ll-7", cat:"Engineering", featured:false, name:"The nightly changelog loop", desc:"Keeps the changelog current with meaningful changes from the previous day.", prompt:"Each night, review changes from the previous day and update the changelog with anything users should know." },
  { id:"ll-8", cat:"Engineering", featured:false, name:"The test-suite speed loop", desc:"Speeds up the test suite without weakening coverage, assertions, or isolation.", prompt:"Optimize the test suite to run as quickly as possible without reducing coverage or changing behavior." },
  { id:"ll-9", cat:"Engineering", featured:false, name:"The repository cleanup loop", desc:"Recovers valuable repository work and safely removes proven stale state.", prompt:"Inspect local and remote branches, pull requests, commits, and worktrees. Recover valuable work and clean everything stale until the repository is current and organized." },
  { id:"ll-10", cat:"Engineering", featured:false, name:"The ticket-to-PR-ready loop", desc:"Turns a ticket or complaint into a verified, reviewer-ready pull request.", prompt:"Take a ticket, bug report, failing behavior, or customer complaint and turn it into a review-ready patch. Reproduce the failure in the smallest representative environment, prove the root cause, make the smallest credible fix, and rerun the original reproduction plus relevant regression tests. If the issue cannot be reproduced after two serious attempts, say so. Do not fold unrelated refactors into the patch. Finish with the cause, changed files, before-and-after proof, risks, and pull-request summary." },
  { id:"ll-11", cat:"Engineering", featured:false, name:"The Clodex adversarial-review loop", desc:"Uses Codex to review Claude's pull request until blocking findings are resolved.", prompt:"Run /clodex [task] think hard --max-iter 5 --threshold medium. Claude plans the task, implements it, opens a pull request, asks Codex for an adversarial review, fixes findings above the accepted severity, and repeats. Keep the branch, PR, findings, verdict, and iteration state resumable. Stop when Codex approves, only accepted findings remain, progress stalls, or the iteration cap is reached. Never describe an errored or exhausted run as approved. Finish with the PR, checks, verdict, and remaining findings." },
  { id:"ll-12", cat:"Engineering", featured:false, name:"The Loop Harness verification loop", desc:"Ships scheduled agent work only after an independent verification pass.", prompt:"Use Loop Harness for scheduled repository work such as CI triage, issue grooming, dependency updates, or docs sync. Set [retry limit], then start an isolated git worktree. Let one Claude session stage a patch or outbox message and a second Claude session verify it against explicit criteria. Ship only after a pass; otherwise preserve the findings and retry only within the limit. Finish with the source revision, staged output, verifier result, delivery status, and next run." },
  { id:"ll-13", cat:"Engineering", featured:true, name:"The five-minute repository maintainer loop", desc:"Keeps repository work moving through dedicated threads without interrupting active agents.", prompt:"While repository maintenance is active, wake every five minutes. Triage [repositories] and read each repository thread's latest state. Reuse one thread per repository; assign its highest-value bounded task only within granted permissions, and do not interrupt coherent active work. Require tests, live proof, autoreview, and green CI before work can land. Escalate product, access, security, or irreversible decisions. Record meaningful changes and stop when every item is landed, decision-ready, blocked, or has no work." },
  { id:"ll-14", cat:"Engineering", featured:false, name:"The recent-feedback sweep", desc:"Turns recent user corrections into a project-wide audit and verified fixes.", prompt:"Review all available threads from [lookback window] where I reported something wrong with [project] and asked for a fix. Build a deduplicated issue list, group it into failure patterns, and verify current state. Audit the complete project for every pattern, fix each confirmed instance, and add regression coverage where practical. Repeat the full audit until it finds no remaining instance or [iteration budget] ends. Stop on blocked or approval-gated work. Return the issues, fixes, evidence, and blockers." },
  { id:"ll-15", cat:"Engineering", featured:false, name:"The autonomy-loop builder-reviewer loop", desc:"Passes code between builder and reviewer until tests prove each accepted fix.", prompt:"Use autonomy-loop for [repository task] after the test, build, and lint gates pass. Run /autonomy-loop:autonomy-init, then start builder and reviewer in separate worktrees. The builder reads LOOP-STATE.md, makes one bounded change, and adds a red-before, green-after test. The reviewer reruns the gates and proves the test by reverting or mutating the fix. Accept only on both passes; park protected or repeated-failure work for a human. Finish with the commit, gate evidence, test proof, trust tier, and risks." },
  { id:"ll-16", cat:"Engineering", featured:false, name:"The Codex completion-contract loop", desc:"Defines completion up front and requires evidence for every reported result.", prompt:"Run $goal-planner-codex [task] for long-running Codex work where partial work could be mistaken for done. Before acting, define every required outcome and its evidence. After each bounded action, mark requirements proved, weak, missing, or contradicted. Complete the Goal only when all are proved; otherwise stop as blocked, stalled, or exhausted. Ask before creating Goal state. Finish with the requirement-to-evidence table, status, owner, and next action." },
  { id:"ll-17", cat:"Engineering", featured:false, name:"The Goal Forge loop", desc:"Turns a rough coding idea into measurable planning files before Codex starts a long run.", prompt:"Turn [rough coding idea] into two planning files before Codex starts /goal, its long-running task mode. Interview the user, then write SPEC.md: what to build, exclude, and consider, plus measurable done_when completion checks. Write GOAL.md: the work plan, progress scorecard, quick and final checks, memory files, evidence, and approval boundaries. If any key decision, permission, tool, environment requirement, or test is missing, stop as not ready. Do not start implementation without approval." },
  { id:"ll-18", cat:"Engineering", featured:false, name:"The propagation compliance loop", desc:"After one value changes, finds every other place that still shows the old value.", prompt:"After changing a version, count, rule, name, or configuration, list where the new value belongs and update it. Search the project for the old value and related forms. Review each match: fix real stale values, but keep intentional history, examples, migrations, or compatibility rules. Repeat until zero stale values remain. If one returns for two rounds, stop and identify what may be regenerating it. Return changes, intentional matches, and search output." },
  { id:"ll-19", cat:"Engineering", featured:false, name:"The cold-load trimmer loop", desc:"Reduces data downloaded before a web app's first screen without changing behavior or appearance.", prompt:"Reduce the data [web app] downloads before its first screen appears. First record passing tests, mobile and desktop screenshots, and compressed transferred bytes—the data actually downloaded. Use the build report only to suggest candidates. Defer, compress, or remove one item, then rebuild and rerun every check. Keep it only if tests pass, screenshots are pixel-identical, and bytes decrease; otherwise revert. Stop when no safe candidate remains, progress stalls, or approval is needed. Return measurements, changes, and untested states." },
  { id:"ll-20", cat:"Engineering", featured:false, name:"The housekeeper loop", desc:"Cleans a code project one proven, low-risk change at a time without touching uncertain work.", prompt:"Review [repository or code project] for dead code, stale files or comments, unused dependencies, duplication, broken links, inconsistent names, and confusing structure. Protect unrelated, active, uncommitted, generated, and uncertain work. Prove one low-risk cleanup, make the smallest coherent change, then rerun the build, tests, runtime checks, and diff review. Keep only verified improvements. Stop when none remain, progress stalls, verification is unavailable, or approval is required. Return changes, evidence, and deferred candidates." },
  { id:"ll-21", cat:"Engineering", featured:false, name:"The prepare-a-new-project loop", desc:"Strengthens project documents until independent engineers would build substantially the same system.", prompt:"Prepare [project] for implementation. Ensure its documents cover requirements, technical design, tasks with acceptance criteria, and test strategy. Each round, fix the largest gap or contradiction that could make two competent engineers build different systems. Keep details traceable, record assumptions, and ask before product forks. Recheck consistency, then have two independent reviewers describe the components, data model, dependencies, and definition of done. Stop when they materially agree and every artifact is testable, or a decision needs the user." },
  { id:"ll-22", cat:"Engineering", featured:false, name:"The test stabilizer loop", desc:"Finds flaky tests, fixes their root causes, and proves stability with repeated full-suite runs.", prompt:"Run [test suite] [N] times under the same conditions and list tests whose result changes. Fix the most frequent flake at its root cause—shared state, timing, ordering, or an external dependency—never with a blind sleep or retry. Run that test [N] times, then rerun the full suite. Repeat until [N] consecutive full-suite runs pass, progress stalls, or approval is required. Return each flake, root cause, fix, evidence, and justified quarantine." },
  { id:"ll-23", cat:"Engineering", featured:false, name:"The dependency-CVE burndown loop", desc:"Fixes reachable dependency vulnerabilities in risk order and rescans after each change.", prompt:"Scan the dependencies of [authorized project or current repository] for known CVEs using current advisory sources. For each high or critical finding, identify the affected dependency, determine whether the vulnerable code is reachable, and check whether the exploit conditions exist in this project. Rank findings by severity, reachability, exposure, and available remediation. Patch or upgrade the highest-risk reachable dependency using the smallest credible change. Run the build, tests, and security scan again. Keep the change only if verification passes and no unacceptable regression appears. Repeat until no exploitable high or critical CVE remains." },
  { id:"ll-24", cat:"Engineering", featured:false, name:"The error-message rewrite loop", desc:"Finds every user-facing error, rewrites weak copy, and verifies the reachable states.", prompt:"Find and improve every user-visible error message within [repository, product, or named scope]. Inventory error strings in source code, surfaced API or client errors, and reachable browser states. Record each in a CSV with its location, trigger, current copy, user risk, proposed replacement, implementation status, and verification result. Rank by user harm. Rewrite one coherent group at a time using plain language and a useful recovery step when one exists. Do not expose provider names, stack traces, or internal identifiers. After each change, run the relevant tests and exercise the affected state in a real browser when possible. Stop when every row is verified or explicitly blocked." },
  { id:"ll-25", cat:"Engineering", featured:false, name:"The stable-frame-rate loop", desc:"Optimizes one measured game bottleneck at a time until frame rate stays stable.", prompt:"Improve the frame-rate stability of [game or interactive build]. Before editing, define one repeatable benchmark with the same scene, inputs, hardware, build, resolution, and settings. Record frame-time distribution, average FPS, minimum FPS, CPU use, GPU use, and memory behavior. Identify the largest measured bottleneck and make one focused optimization. Rerun the complete benchmark under the same conditions. Keep the change only if it improves the target without regressing another metric. Repeat until [FPS target] holds for [stability period] with no dip below [FPS floor]." },
  { id:"ll-26", cat:"Engineering", featured:false, name:"The dependency triage loop", desc:"Processes Dependabot PRs with isolated testing, risk assessment, and serialized merges.", prompt:"Review every Dependabot pull request currently open in [repository]. Take a fixed snapshot and process each pull request once. Read its diff, release notes, advisories, dependency role, and CI results. Run the repository's relevant tests in an isolated worktree and classify the update by version change, breaking behavior, security exposure, and regression risk. Process merges serially. Merge only low-risk patch or minor updates when explicit merge authority has been granted. Request approval for major, breaking, security-sensitive, or uncertain actions. Stop successfully when the original snapshot is fully processed." },
  { id:"ll-27", cat:"Engineering", featured:false, name:"The React Doctor repair loop", desc:"A bounded React Doctor workflow that fixes genuine findings and keeps only regression-free improvements.", prompt:"Run `pnpm exec react-doctor . --verbose --yes --offline --fail-on none` to record the baseline, then rerun with `--fail-on error`. Fix at most five genuine findings, run the same scan and relevant project checks, and keep only verified improvements. Clear errors before high-confidence warnings. Stop when clean, blocked, approval is required, a finding is false-positive, or another pass makes no measurable progress. Finish with baseline and final results, retained fixes, reverted attempts, checks, and remaining findings." },
  { id:"ll-28", cat:"Engineering", featured:false, name:"The React Doctor 100/100 loop", desc:"Repairs root causes until every production app earns a verified React Doctor score of 100/100.", prompt:"Bring every production React app in [repository] to a freshly verified React Doctor score of 100/100. Inventory app roots, record a full `npx react-doctor@latest --verbose` baseline, fix one root cause at a time, and rerun the full scan plus relevant typecheck, lint, tests, and builds. Never hide findings with exclusions, ignores, suppressions, or deleted behavior. Stop at 100/100 for every app, blocked, approval-required, or no measurable progress." },
  { id:"ll-29", cat:"Engineering", featured:false, name:"The evidence-first feature loop", desc:"Inspects current repository evidence before implementing and verifying one safe feature slice.", prompt:"Implement one bounded feature slice in [repository]. Read project instructions, the current implementation, relevant services, types, UI, tests, and architecture notes before editing. Report the evidence, risks, affected files, persistence impact, and validation plan; stop for approval if inspection materially changes scope or reveals destructive, production, or silent-persistence behavior. Make the smallest change, preserve unknown data and unrelated work, run relevant checks, and manually verify user-facing states. Stop after this slice and return evidence, limitations, and the next recommended slice." },
  { id:"ll-30", cat:"Engineering", featured:false, name:"The architecture-preserving code refactor loop", desc:"Maps the blast radius, preserves public contracts, and keeps only regression-free improvements.", prompt:"Refactor [target] toward [measurable goal] in [repository]. Record current behavior and affected dependencies; select representative tests for boundaries and failure modes, then make one atomic change without altering public contracts unless authorized. Run the same tests, type and lint checks, and affected-consumer checks, keeping only regression-free improvements. Repeat for at most five rounds. Stop on success, blocked architecture, approval required, exhaustion, or no progress. Finish with the diff, impact map, evidence, rejected attempts, and remaining debt." },
  // EVALUATION
  { id:"ll-31", cat:"Evaluation", featured:false, name:"The quality streak loop", desc:"Fixes product failures until a defined streak of realistic tests passes.", prompt:"Test realistic scenarios. When one fails, document it, add regression and benchmark coverage, fix it, and restart the streak. Stop after [N] successful cases in a row." },
  { id:"ll-32", cat:"Evaluation", featured:true, name:"The full product evaluation loop", desc:"Recreates production locally, tests every product surface, and fixes all verified bugs holistically.", prompt:"Build sanitized, production-scale local data under production-like settings. Inventory every user-facing feature, role, route, button, input, modal, state, and workflow; define documented acceptance criteria and finite risk-based edge cases for each. Test as a real user, logging every bug with reproduction evidence. Review findings for shared causes and dependencies; implement coherent fixes with regression tests, then rerun the full inventory. Stop at a clean pass or blocked handoff. Ask before production, sensitive data, or destructive actions." },
  { id:"ll-33", cat:"Evaluation", featured:false, name:"The self-improving champion loop", desc:"Promotes prompt or policy changes only when they win on fresh holdout cases.", prompt:"Improve a prompt, policy, or configuration. Save the champion, its score, a working set, untouched holdout cases, must-pass checks, and [budget]. Each round, change one thing based on a recorded failure. Promote the challenger only if it beats the champion on holdouts by [margin] without weakening a must-pass check; otherwise keep the champion. Stop at the target, budget limit, or no progress. Return the winner, scores, experiment log, and remaining failures." },
  { id:"ll-34", cat:"Evaluation", featured:false, name:"The devil's-advocate loop", desc:"Challenges a design until every high-impact objection is resolved or explicitly accepted.", prompt:"Before committing to an architecture, interface, or rollout plan, have a critic argue that it is wrong. Record each objection, impact, and status in a repository-local log at .agent-reviews/redteam.md. The builder must fix and verify each high-impact weakness or document why it is accepted; the critic may reopen unsupported answers. Stop when no high-impact objection remains or the same issues repeat for two rounds without new evidence. Finish with the decision, resolved and accepted objections, evidence, and any stalemate." },
  { id:"ll-35", cat:"Evaluation", featured:false, name:"The promise-to-proof loop", desc:"Checks whether every customer-facing claim is true, then fixes the riskiest mismatch first.", prompt:"List every customer-facing promise [product] makes in marketing, documentation, demos, and AI answers. Compare each promise with current product behavior and evidence, then label it proven, partly proven, misleading, unsupported, outdated, or missing evidence. Fix or narrow the riskiest mismatch and rerun the affected check. Repeat until no high-risk unsupported promise remains. Ask before changing production or public copy. Return the promises, evidence, fixes, and decisions needed." },
  { id:"ll-36", cat:"Evaluation", featured:false, name:"The multi-LLM convergence loop", desc:"Has two different AI systems review the same work until both approve one unchanged version.", prompt:"Review [plan, specification, document, or code change] against [quality bar] for at most [pass limit] rounds. Have one of two genuinely different model families—AI systems from separate providers—review it. Verify each finding and apply only necessary fixes, then give the revised version to the other reviewer. Succeed only when both approve the same unchanged version. Stop at the limit, repeating disagreement, unavailable review, or required approval. Return the final work, round log, verdict, and disagreements." },
  { id:"ll-37", cat:"Evaluation", featured:false, name:"The easy onboarding loop", desc:"Acts like a first-time user, fixes one obstacle, and retries from a completely clean session.", prompt:"Act like a first-time user of [product]. Start at the real entry point in a clean session with no saved login, site data, remembered route, or hidden setup. Complete onboarding using only visible guidance and record obstacles. Fix the worst one with the smallest change that preserves every security, access, and product requirement. Discard the session and retry. Stop after one uninterrupted success, no safe fix, blocked access, or required approval. Return the path, changes, evidence, and blockers." },
  { id:"ll-38", cat:"Evaluation", featured:false, name:"The Axelrod subagent arena loop", desc:"Tests whether AI agents learn to cooperate, retaliate, or forgive in a repeated two-choice game.", prompt:"Run a fixed Axelrod tournament with two reasoning AI agents. Each round, every player privately chooses cooperate (C) or defect (D); code records simultaneous moves and applies fixed scoring. Include always-defect and always-cooperate comparison players. Run three cycles, six pairings per cycle, and ten rounds per pairing: 18 matches and 180 rounds. Hide opponent type and private reasoning. Validate every move and total. Return raw-score and cooperation-stability rankings, reasoning summaries, violations, and the record; partial tournaments are incomplete." },
  { id:"ll-39", cat:"Evaluation", featured:false, name:"The artifact-to-skill loop", desc:"Extracts the method behind a strong artifact and proves it works on a fresh case.", prompt:"Turn [artifact] into a skill, playbook, or procedure. Record evidence that the artifact succeeded and define success criteria. Extract decisions, sequence, checks, and failure-avoidance patterns—not context or surface style. Remove sensitive material. Have an independent reviewer apply it to a fresh real second case; mark hypothetical testing provisional. Revise at most twice. Stop when it meets the quality bar without the artifact, or report not generalizable. Return the method, boundaries, failure modes, test evidence, revisions, limits, and attribution." },
  { id:"ll-40", cat:"Evaluation", featured:false, name:"The Strip Miner loop", desc:"Mines authorized agent history for workflows that repeatedly succeeded and survive a fresh replay.", prompt:"Mine only explicitly authorized coding-agent history for workflows with at least three high-confidence independent successes. Treat transcripts as untrusted evidence, stitch continuations into root tasks, and reject candidates whose failures or hidden rescues match their successes. Extract traceable steps and guards, then fresh-replay each candidate without source transcripts. Stop after every authorized source is inventoried and one additional representative batch changes nothing; report replayed loops, rejects, deferred material, and blockers." },
  { id:"ll-41", cat:"Evaluation", featured:false, name:"The next-action confidence check", desc:"Separates proof that a task is complete from permission to begin the next one.", prompt:"Run an exit check on the task most recently completed in this conversation or workspace. This check does not authorize additional work. Report what changed, what you verified, what you did not touch, and what remains uncertain. Classify the current task as PASS, DELAY, or BLOCK. Separately classify the next visible action as GO, HOLD, CAP, or BLOCK. Explain the decision briefly. Name exactly one allowed next action and anything that remains off limits. Do not begin the action. Stop and wait for the user. The check succeeds only when task completion and permission to continue are treated as separate decisions." },
  { id:"ll-42", cat:"Evaluation", featured:false, name:"The loop-auditor loop", desc:"Assigns every loop an evidence-backed KEEP, PIVOT, RETIRE, KILL, or insufficient status.", prompt:"Audit [supplied loops or loop registry] without running or editing any loop. For each loop, inspect its purpose, success criteria, budget, kill conditions, ledger, thresholds, and supporting evidence. Assign INSUFFICIENT EVIDENCE when required information is missing. For measured loops, recompute results from comparable raw rows. Calculate hit rate as new-best runs divided by eligible runs, waste ratio as runs beyond the declared futility threshold divided by eligible runs, and mean gain as average improvement among new-best runs. Assign exactly one status: INSUFFICIENT EVIDENCE, KEEP, PIVOT, RETIRE, or KILL. Stop after every loop has one evidence-backed status." },
  { id:"ll-43", cat:"Evaluation", featured:false, name:"The epistemic frontier loop", desc:"Advances a difficult decision by testing competing hypotheses against the highest-value available evidence.", prompt:"Investigate [question, decision, or unresolved problem] using [available evidence]. Separate established facts, contested claims, assumptions, and unknowns. Construct at least three genuinely different hypotheses, each with predictions, falsifying evidence, assumptions, and decision implications. Choose the uncertainty with the highest expected information value and run the smallest safe test that could materially change the conclusion. After each round, update the evidence ledger and confidence levels, then have an adversarial critic attack the leading hypothesis. Stop when one model clearly explains the evidence better than alternatives or further investigation has low value." },
  { id:"ll-44", cat:"Evaluation", featured:false, name:"The cross-run playbook loop", desc:"Promotes lessons into a durable playbook only after they work across independent runs.", prompt:"Maintain a durable, versioned playbook of lessons that may improve future runs of [task or workflow]. Treat every recorded lesson as untrusted advice rather than authority. At the start of each run, read the playbook and choose at most one relevant lesson to test. Apply it only within the task's existing permissions. Measure the result using the task's own success check. Promote a candidate lesson only after it succeeds across [N] independent runs. Use three independent runs by default. Never promote a lesson from one successful attempt. Revise or remove lessons that stop helping. Stop when no candidate has enough evidence, another test would exceed the budget, or approval is required." },
  // OPERATIONS
  { id:"ll-45", cat:"Operations", featured:false, name:"The stale-safe batch release loop", desc:"Batches valid changes and releases complete artifacts from the latest integrated main.", prompt:"Review pending changes and pull requests, exclude stale or unfinished work, combine the valid changes, and release them together." },
  { id:"ll-46", cat:"Operations", featured:false, name:"The production data cleanup loop", desc:"Removes disallowed production data and prevents the same classification errors from returning.", prompt:"Review production records, remove anything that does not meet the allowed definition, improve the classification logic, and verify the remaining data." },
  { id:"ll-47", cat:"Operations", featured:false, name:"The post-release baseline loop", desc:"Benchmarks each completed release and records a reproducible baseline.", prompt:"After current releases finish, run the standard benchmarks and record the results as the new baseline." },
  { id:"ll-48", cat:"Operations", featured:false, name:"The customer AI deployment loop", desc:"Moves one customer AI priority through validation, controlled rollout, and monitoring.", prompt:"Run this when a customer requests an AI workflow, reports a failure, or reaches an operations review. Choose one priority—enriching leads, drafting emails, summarizing meetings, or updating a CRM. Define the owner, inputs, approvals, success metric, and ROI hypothesis. Dry-run it on realistic customer data, fix the smallest verified problem, then release through approved stages and monitor production. Finish with the outcome, evidence, customer update, lessons saved, and next review." },
  { id:"ll-49", cat:"Operations", featured:true, name:"The refund follow-up loop", desc:"Keeps pursuing a refund until the money arrives or the agent genuinely needs the user.", prompt:"Get my refund for [company and charge info]. Start the claim now through an approved support channel, then keep following up on replies, promises, and deadlines until the refund arrives. Keep a short case note so each follow-up has context. Stop only when the refund is received or you are genuinely blocked and need me." },
  { id:"ll-50", cat:"Operations", featured:false, name:"The Living Story loop", desc:"Maintains an evidence-backed daily narrative of projects, priorities, open threads, and recent wins.", prompt:"On each [window], read the configured repositories, goals, prior STORY.md, and optional authorized sources. Update project files, then write STORY.md with focus, deadlines, open threads, and evidence-backed recent wins. Carry every prior thread forward, prove it finished, or mark it STALE/NEEDS-REVIEW—never silently drop one. Archive the snapshot and record the change. Stop when verification passes; if evidence or access is missing, return a thinner or blocked snapshot explicitly." },
  { id:"ll-51", cat:"Operations", featured:false, name:"The Recovery Proof loop", desc:"Proves real backups can restore required scenarios inside a disposable clean-room environment.", prompt:"For each required recovery scenario, randomly select an eligible real backup or recovery point and restore from zero in a disposable, isolated clean-room using only documented materials. Verify integrity, dependencies, representative reads and writes, and actual RPO and RTO. Repair one blocker, destroy the environment, and retry fresh. Stop when every scenario reaches its predefined consecutive-success streak or an exception is explicitly accepted. Never overwrite production, expose restored data, or initiate failover without approval." },
  { id:"ll-52", cat:"Operations", featured:false, name:"The Loop Hiring Manager", desc:"Finds recurring work that deserves a loop and rejects automation that cannot prove its value.", prompt:"Decide whether [project or current workspace] needs new recurring agent loops. Review its goals, repeated failures, recurring chores, existing automation, and adopted loops. Read the current published Loop Library from https://signals.forwardfuture.com/loop-library/api/loops. Find recurring outcomes that lack reliable ownership, a repeatable process, or proof of completion. For the strongest gap, prefer an exact published loop. If none fits, propose the smallest grounded adaptation. Keep no more than three evidence-backed candidates and recommend at most one manual trial. Do not install, schedule, or run anything without approval." },
  { id:"ll-53", cat:"Operations", featured:false, name:"The restartable handoff loop", desc:"Leaves enough verified context for the next human or agent to resume safely without guessing.", prompt:"Before ending [session or work period], create a restartable handoff. Record the current goal, changes, verification evidence, untouched scope, uncertainties, open risks, off-limits areas, and last decision or gate. Check that a new human or agent could continue without guessing, then name exactly one safe next action and what they must not assume. Stop after the handoff; do not begin that action." },
  // CONTENT
  { id:"ll-54", cat:"Content", featured:false, name:"The SEO/GEO visibility loop", desc:"Fixes the highest-impact gaps in search and AI answer visibility.", prompt:"Run an SEO/GEO audit across crawlability, indexation, page intent, titles, internal links, structured data, source citations, and answer-first content. Rank the gaps by expected impact, fix the highest-leverage issue, then rerun the same crawl and target-query benchmark across search engines and AI answer engines. Repeat until no critical technical issues remain, every priority query maps to a clear answer-ready page, and the benchmark shows no high-impact gap left to fix." },
  { id:"ll-55", cat:"Content", featured:false, name:"The product update podcast loop", desc:"Turns meaningful product updates into a short, source-grounded podcast episode.", prompt:"Each night, review publicly released product changes and select only those users need to know. Verify each against the product, docs, or release notes. Use the Jellypod MCP to turn the approved changes into a three-to-five-minute podcast explaining what changed, why it matters, and how to try it. Check the script and audio for accuracy, clarity, and pronunciation. If nothing meaningful shipped, make no episode. Ask before publishing." },
  { id:"ll-56", cat:"Content", featured:false, name:"The research-to-artifact loop", desc:"Turns focused research into a sourced artifact that can support a real decision.", prompt:"Research [question or topic] and produce a decision-ready [memo, brief, specification, recommendation, page, or other artifact] for [audience or decision]. State the decision the artifact should support, its acceptance criteria, the allowed source scope, and the research budget. If no budget is supplied, use no more than ten strong sources or ninety minutes. After each research pass, update the artifact and identify the largest remaining evidence gap, contradiction, or uncertainty. Continue only if resolving it could materially change the decision and the budget allows another pass. Never invent evidence or hide uncertainty." },
  { id:"ll-57", cat:"Content", featured:false, name:"The talk-to-five-buyers loop", desc:"Uses repeated buyer objections to draft landing-page copy in customers' own words.", prompt:"Improve [landing page or purchase page] using objections from recent buyers. Obtain explicit approval for outreach. Interview buyers in batches of five, up to fifteen total. Ask each person one question: What almost stopped you from buying? After each batch, group repeated concerns and draft a proposed copy change for the point on the page where each concern is most likely to arise. Do not publish the copy without approval. Use the next batch to check whether the same concern still appears. Stop when the concern no longer repeats, fifteen interviews are complete, or the budget ends." },
  { id:"ll-58", cat:"Content", featured:false, name:"The one-post-a-week loop", desc:"Tests one weekly post at a time until a repeatable format wins on meaningful responses.", prompt:"Find a repeatable weekly post format for [approved account, audience, and topic] through a six-week experiment. Each week, draft one short post about a real problem [person, product, or company] solves. Record substantive replies, saves, and questions after the same measurement window. Change only one meaningful element each week based on the strongest signal from the previous post. Stop when one format materially outperforms the alternatives, the six-week experiment ends without a winner, or the budget is exhausted. Never fabricate engagement data." },
  { id:"ll-59", cat:"Content", featured:false, name:"The LaTeX document creation loop", desc:"Builds and recompiles a source-traceable LaTeX preprint until every structural gate passes.", prompt:"Create a complete LaTeX preprint about [topic] using [supplied sources, assumptions, and data]. Do not invent claims, citations, or data. Include exactly these sections in order: Abstract, Introduction, Methods, Results, Discussion, Conclusion, and References. Build every figure and table with native LaTeX tools such as TikZ, pgfplots, and booktabs. Every substantive claim must trace to a numbered equation, citation, supplied datum, or labeled assumption. Compile using the project's documented command or latexmk. Inspect compilation errors, warnings, typography, cross-references, and figure placement. Stop when compilation has zero errors, all seven sections are present, every figure and table is referenced before it appears, and no banned command remains." },
  { id:"ll-60", cat:"Content", featured:false, name:"The pre-publish source-check loop", desc:"Checks every publishable claim against current primary sources and repairs the riskiest evidence gaps first.", prompt:"Before publishing [draft], inventory every factual, statistical, quoted, or attributed claim a reader could verify. Find the best current primary source for each and label it supported, outdated, misattributed, unsupported, or unverifiable. Fix the riskiest mismatch, then recheck that claim and anything depending on it. Repeat until no high-risk unsupported claim remains or five rounds are exhausted. Never invent a source or alter a quotation. Ask before changing a named person's quote or a legal, medical, or financial statement." },
  // DESIGN
  { id:"ll-61", cat:"Design", featured:false, name:"The Boeing 747 benchmark", desc:"Builds and improves a Three.js Boeing 747 across nine repeatable views.", prompt:"Before building, choose reference images, a scoring rubric, [visual threshold], and [budget]. Build the most realistic Boeing 747 you can from Three.js primitives, then create a rig that screenshots nine repeatable angles. After each change, render and score the same views, have a critic identify the weakest feature, and fix it without regressing stronger views. Keep the best version. Stop at the threshold, stalled progress, or budget. Finish with the model, nine renders, scores, remaining gaps, and run summary." },
  { id:"ll-62", cat:"Design", featured:false, name:"War Loops: frontend reconstruction", desc:"Reconstructs a real interface and repairs its weakest visual and motion mismatches.", prompt:"Point War Loops at an authorized URL or image. Capture it with a genuine browser and record the layout, styles, content, motion, and responsive behavior. Build a static Pencil mirror and a moving Forge version. Compare both with the source at desktop, tablet, and mobile sizes; repair only the weakest fidelity signals. Stop when every gate passes, progress stalls, or capture is blocked. Finish with the builds, spec, renders, scores, and remaining gaps." },
  { id:"ll-63", cat:"Design", featured:false, name:"The Infinite Clickbait thumbnail loop", desc:"Iterates thumbnail concepts until one clears the quality bar without misleading viewers.", prompt:"For [video], use [approved assets] to make ten thumbnail concepts. Score each at real YouTube sizes against [inspiration channel] for clarity, curiosity, emotional pull, contrast, and accuracy. Take the top three, improve each one's weakest dimension, and rescore them under the same rubric. Keep iterating the strongest concept until it clears [quality threshold] or [budget] ends. Reject anything the video cannot deliver. Return the winner, two runners-up, previews, final scores, and rationale." },
  { id:"ll-64", cat:"Design", featured:false, name:"The UI/UX Score Loop", desc:"Walks through a real user task, scores each screen, improves weak spots, and retests it.", prompt:"Improve [user flow, such as signup] at [URL] until [completion criterion]. In a real browser, start each pass from fresh state—no saved login, cookies, or site data. Capture meaningful screens at the agreed sizes and modes, score them with one checklist, and improve the weakest safe area. Rerun the whole flow and keep only regression-free changes. Stop on success, two full passes with no gain, blocked access, or required approval. Return scores, screenshots, changes, and stop reason." },
  { id:"ll-65", cat:"Design", featured:false, name:"The pixel-safe CSS trim loop", desc:"Shrinks styling code sent to users while keeping every tested screen visually identical.", prompt:"Reduce the CSS styling code [site] sends to users without changing tested screens. First capture representative pages, sizes, themes, and interactions, and record the built CSS size. Treat coverage reports only as suggestions. Remove one declaration or rule, rebuild, and rerun screenshots and project checks. Keep it only if every screenshot is pixel-identical and built CSS is smaller; otherwise revert. Stop when no supported candidate remains, progress stalls, or approval is required." },
  { id:"ll-66", cat:"Design", featured:false, name:"The accessibility repair loop", desc:"Finds barriers for keyboard, screen-reader, low-vision, and other users, then fixes the most harmful first.", prompt:"Check [scope] against [accessibility standard, such as WCAG 2.2 AA] with automated scans and available keyboard, screen-reader, and other manual tests. Confirm each issue, rank it by harm, and fix the highest-impact blocker. Rerun the same checks, affected task, and regression tests. Keep only verified fixes. Stop when no blocker remains, progress stalls, verification is unavailable, or approval is required. Never silence a check or weaken the target. Return issues, fixes, evidence, exceptions, and untested needs." },
];

const CAT_COLORS = {
  Engineering: COLORS.sky,
  Evaluation: COLORS.violet,
  Operations: COLORS.amber,
  Content: COLORS.emerald,
  Design: "#FF6B6B",
};

function LoopLibrary() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const cats = ["All", "Engineering", "Evaluation", "Operations", "Content", "Design"];

  const filtered = LOOP_LIBRARY.filter(l => {
    const matchCat = cat === "All" || l.cat === cat;
    const q = search.toLowerCase();
    const matchSearch = !q || l.name.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q) || l.prompt.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const featured = filtered.filter(l => l.featured);
  const rest = filtered.filter(l => !l.featured);

  const copyLoop = (l) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(l.prompt).then(() => {
        setCopied(l.id);
        setTimeout(() => setCopied(null), 2000);
      }).catch(() => {});
    }
  };

  const LoopCard = ({ l }) => {
    const isOpen = expanded === l.id;
    const isCopied = copied === l.id;
    const cc = CAT_COLORS[l.cat] || COLORS.muted;
    return (
      <div style={{
        background: COLORS.surface,
        border: `1px solid ${isOpen ? cc + "55" : COLORS.border}`,
        borderRadius: 10,
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}>
        <div onClick={() => setExpanded(isOpen ? null : l.id)} style={{ padding: "12px 14px", cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 3 }}>
                {l.featured && (
                  <span style={{ background: COLORS.amber + "22", border: `1px solid ${COLORS.amber}44`, color: COLORS.amber, borderRadius: 4, padding: "1px 6px", fontSize: 9, fontFamily: "monospace", fontWeight: 700 }}>★ FEATURED</span>
                )}
                <span style={{ background: cc + "18", border: `1px solid ${cc}44`, color: cc, borderRadius: 4, padding: "1px 6px", fontSize: 9, fontFamily: "monospace", fontWeight: 700 }}>{l.cat}</span>
              </div>
              <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 13 }}>{l.name}</div>
              <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>{l.desc}</div>
            </div>
            <span style={{ color: COLORS.muted, fontSize: 14, paddingTop: 2 }}>{isOpen ? "▾" : "▸"}</span>
          </div>
        </div>
        {isOpen && (
          <div style={{ borderTop: `1px solid ${COLORS.border}` }}>
            <div style={{ background: "#060A14", padding: "12px 14px" }}>
              <div style={{ color: COLORS.muted, fontFamily: "monospace", fontSize: 10, marginBottom: 8, letterSpacing: "0.05em" }}>PROMPT</div>
              <p style={{ color: "#C8D8E8", fontFamily: "monospace", fontSize: 12, lineHeight: 1.8, margin: 0 }}>{l.prompt}</p>
            </div>
            <div style={{ padding: "10px 14px", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={(e) => { e.stopPropagation(); copyLoop(l); }}
                style={{
                  background: isCopied ? COLORS.emerald + "22" : COLORS.surface2,
                  border: `1px solid ${isCopied ? COLORS.emerald : COLORS.border}`,
                  borderRadius: 6,
                  color: isCopied ? COLORS.emerald : COLORS.sky,
                  fontFamily: "monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "6px 14px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >{isCopied ? "✓ Copied!" : "Copy loop"}</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 15 }}>Forward Future Loop Library</div>
            <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 3 }}>69 repeatable AI agent workflows with clear stop conditions · signals.forwardfuture.com</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: COLORS.amber, fontFamily: "monospace", fontSize: 18, fontWeight: 700 }}>69</div>
            <div style={{ color: COLORS.muted, fontSize: 10 }}>loops</div>
          </div>
        </div>
        <div style={{ marginTop: 10, background: "#060A14", borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: COLORS.muted, fontSize: 13 }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search loops, keywords..."
            style={{
              background: "none", border: "none", outline: "none",
              color: COLORS.text, fontSize: 13, fontFamily: "monospace", width: "100%",
            }}
          />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 14 }}>✕</button>}
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {cats.map(c => {
          const active = cat === c;
          const cc = CAT_COLORS[c] || COLORS.sky;
          return (
            <button key={c} onClick={() => setCat(c)} style={{
              background: active ? (c === "All" ? COLORS.sky + "22" : cc + "22") : COLORS.surface,
              border: `1px solid ${active ? (c === "All" ? COLORS.sky : cc) : COLORS.border}`,
              borderRadius: 6,
              color: active ? (c === "All" ? COLORS.sky : cc) : COLORS.muted,
              fontSize: 11, fontFamily: "monospace", fontWeight: 700,
              padding: "5px 10px", cursor: "pointer", transition: "all 0.15s",
            }}>
              {c === "All" ? `All (${LOOP_LIBRARY.length})` : `${c} (${LOOP_LIBRARY.filter(l => l.cat === c).length})`}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      {search && (
        <div style={{ color: COLORS.muted, fontFamily: "monospace", fontSize: 12 }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"
        </div>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <div>
          <div style={{ color: COLORS.amber, fontFamily: "monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>★ FEATURED</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {featured.map(l => <LoopCard key={l.id} l={l} />)}
          </div>
        </div>
      )}

      {/* All other results */}
      {rest.length > 0 && (
        <div>
          {featured.length > 0 && <div style={{ color: COLORS.muted, fontFamily: "monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>ALL LOOPS</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {rest.map(l => <LoopCard key={l.id} l={l} />)}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", color: COLORS.muted, padding: "40px 0", fontFamily: "monospace", fontSize: 13 }}>
          No loops match "{search}"
        </div>
      )}

      {/* Install badge */}
      <div style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 14px", marginTop: 4 }}>
        <div style={{ color: COLORS.muted, fontFamily: "monospace", fontSize: 10, marginBottom: 8 }}>INSTALL AS AGENT SKILL</div>
        <div style={{ background: "#060A14", borderRadius: 6, padding: "8px 12px", fontFamily: "monospace", fontSize: 12, color: COLORS.emerald }}>
          npx skills add Forward-Future/loop-library --skill loop-library -g
        </div>
      </div>
    </div>
  );
}

function PracticalGuide() {
  const [scenario, setScenario] = useState("a");

  const scenarioA = [
    { icon: "🤖", text: "Spin up Agent A, make a plan, start work" },
    { icon: "🤖", text: "Spin up Agent B, start planning..." },
    { icon: "🔔", text: "Agent A interrupts — needs verification", warn: true },
    { icon: "⏸", text: "Pause Agent B to go handle Agent A", warn: true },
    { icon: "🔔", text: "Agent B now needs input too", warn: true },
    { icon: "😵", text: "You're context-switching between 2 agents max", warn: true },
  ];

  const scenarioB = [
    { icon: "🤖", text: "Spin up Agent A with /goal + verification rules" },
    { icon: "🤖", text: "Spin up Agent B with /goal + verification rules" },
    { icon: "🤖", text: "Spin up Agent C, D, E… same pattern" },
    { icon: "✅", text: "Agents self-verify — no interruptions", good: true },
    { icon: "📬", text: "Agent A surfaces finished work for you to review", good: true },
    { icon: "🚀", text: "You complete N tasks in the same time", good: true },
  ];

  const verifyMethods = [
    {
      icon: "🎭",
      title: "Playwright MCP",
      color: COLORS.sky,
      desc: "Agent opens the browser, clicks through the app, takes screenshots, verifies UI state. The gold standard for anything with a frontend.",
      note: "At least 2x more effective than code-only review",
    },
    {
      icon: "🔌",
      title: "API + DB check",
      color: COLORS.emerald,
      desc: "For non-UI tasks: agent makes real API calls, checks database rows or logs, compares actual outputs to expected. Not just reading the code.",
      note: "Rule: run the code, don't just read it",
    },
    {
      icon: "🤝",
      title: "Cross-model review",
      color: COLORS.violet,
      desc: "Claude Code implements → Codex reviews → Claude Code fixes → Codex reviews again. Repeat until Codex approves. Different model = different blind spots caught.",
      note: "Dramatically lowers bug count vs self-review",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Scenario compare */}
      <div>
        <div style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>WHY LOOPS MULTIPLY THROUGHPUT</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {["a", "b"].map(s => (
            <button key={s} onClick={() => setScenario(s)} style={{
              flex: 1,
              background: scenario === s ? (s === "a" ? COLORS.rose + "22" : COLORS.emerald + "22") : COLORS.surface,
              border: `1px solid ${scenario === s ? (s === "a" ? COLORS.rose : COLORS.emerald) : COLORS.border}`,
              borderRadius: 8,
              padding: "10px 12px",
              cursor: "pointer",
              color: scenario === s ? (s === "a" ? COLORS.rose : COLORS.emerald) : COLORS.muted,
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 12,
              fontWeight: 700,
              transition: "all 0.15s",
            }}>
              {s === "a" ? "😵 Without loops" : "🚀 With loops"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(scenario === "a" ? scenarioA : scenarioB).map((step, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: step.warn ? COLORS.rose + "0F" : step.good ? COLORS.emerald + "0F" : COLORS.surface,
              border: `1px solid ${step.warn ? COLORS.rose + "33" : step.good ? COLORS.emerald + "33" : COLORS.border}`,
              borderRadius: 8,
              padding: "10px 14px",
            }}>
              <span style={{ fontSize: 18, minWidth: 24 }}>{step.icon}</span>
              <span style={{
                color: step.warn ? COLORS.rose : step.good ? COLORS.emerald : COLORS.text,
                fontSize: 13,
              }}>{step.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* /goal command */}
      <div>
        <div style={{ color: COLORS.sky, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>THE /GOAL COMMAND</div>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
            <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.7 }}>
              Works in both Claude Code and Codex. It implements a <span style={{ color: COLORS.sky }}>hook</span> — triggered every time the agent finishes work — that makes the agent reflect on whether it completed the goal. If not, it keeps going. If yes, it surfaces results to you.
            </p>
          </div>
          {/* Syntax */}
          <div style={{ background: "#060A14", padding: "14px 16px" }}>
            <div style={{ color: COLORS.muted, fontFamily: "JetBrains Mono, monospace", fontSize: 10, marginBottom: 8 }}>SYNTAX</div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: COLORS.emerald }}>
              /goal {"<define your goal and how to verify it>"}
            </div>
          </div>
          {/* Real example */}
          <div style={{ background: "#07090F", padding: "14px 16px", borderTop: `1px solid ${COLORS.border}` }}>
            <div style={{ color: COLORS.muted, fontFamily: "JetBrains Mono, monospace", fontSize: 10, marginBottom: 10 }}>REAL-WORLD PRODUCTION EXAMPLE</div>
            {[
              { text: "/goal Implement everything I asked for.", color: COLORS.amber },
              { text: "Verify end-to-end by clicking through the browser with Playwright MCP.", color: COLORS.sky },
              { text: "Don't accept only integration tests — actually click around the app.", color: COLORS.muted },
              { text: "Fix issues, then run E2E again.", color: COLORS.muted },
              { text: "Run Codex Exec and the review skill. Have Codex approve it — iterate until approved.", color: COLORS.violet },
              { text: "When approved, tell me which servers to test on and exactly how.", color: COLORS.emerald },
            ].map((line, i) => (
              <div key={i} style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 12,
                color: line.color,
                lineHeight: 1.8,
                paddingLeft: i > 0 ? 14 : 0,
              }}>{line.text}</div>
            ))}
          </div>
          {/* What it encodes */}
          <div style={{ padding: "12px 16px", borderTop: `1px solid ${COLORS.border}`, background: COLORS.surface }}>
            <div style={{ color: COLORS.muted, fontFamily: "JetBrains Mono, monospace", fontSize: 10, marginBottom: 8 }}>WHAT THAT PROMPT ENCODES</div>
            {[
              { label: "Goal", value: "Implement everything I asked for", color: COLORS.amber },
              { label: "Verify method", value: "Playwright MCP — browser clicks + screenshots", color: COLORS.sky },
              { label: "Stop condition", value: "Codex has approved the code", color: COLORS.violet },
              { label: "Handoff format", value: "Server list + exact test steps", color: COLORS.emerald },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", gap: 10, marginBottom: 6, alignItems: "flex-start" }}>
                <span style={{ color: r.color, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, minWidth: 90, paddingTop: 1 }}>{r.label}</span>
                <span style={{ color: COLORS.muted, fontSize: 12 }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification methods */}
      <div>
        <div style={{ color: COLORS.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>VERIFICATION METHODS</div>
        <div style={{ background: COLORS.surface2, border: `1px solid ${COLORS.emerald}33`, borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
          <span style={{ color: COLORS.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700 }}>KEY RULE: </span>
          <span style={{ color: COLORS.muted, fontSize: 13 }}>Don't have the agent verify by reading code. Have it run the code and verify the actual outputs.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {verifyMethods.map(m => (
            <div key={m.title} style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              padding: "14px 16px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{m.icon}</span>
                <span style={{ color: m.color, fontFamily: "JetBrains Mono, monospace", fontSize: 12, fontWeight: 700 }}>{m.title}</span>
              </div>
              <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>{m.desc}</p>
              <div style={{
                background: m.color + "15",
                border: `1px solid ${m.color}33`,
                borderRadius: 6,
                padding: "6px 10px",
                color: m.color,
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 11,
              }}>{m.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-model review loop */}
      <div>
        <div style={{ color: COLORS.violet, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>CROSS-MODEL REVIEW LOOP</div>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "16px" }}>
          {[
            { step: "1", label: "Claude Code", action: "Implements the feature", color: COLORS.sky, arrow: true },
            { step: "2", label: "Codex", action: "Reviews the code — returns comments", color: COLORS.amber, arrow: true },
            { step: "3", label: "Claude Code", action: "Fixes every review comment", color: COLORS.sky, arrow: true },
            { step: "4", label: "Codex", action: "Reviews again — approved or more comments", color: COLORS.amber, arrow: true },
            { step: "✓", label: "Merge gate", action: "Codex approval required before any code enters dev", color: COLORS.emerald, arrow: false },
          ].map((row, i) => (
            <div key={i}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{
                  width: 28, height: 28, minWidth: 28,
                  borderRadius: "50%",
                  background: row.color + "22",
                  border: `1px solid ${row.color}55`,
                  color: row.color,
                  fontFamily: "JetBrains Mono, monospace",
                  fontWeight: 700,
                  fontSize: 11,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{row.step}</div>
                <div>
                  <span style={{ color: row.color, fontFamily: "JetBrains Mono, monospace", fontSize: 12, fontWeight: 700 }}>{row.label} </span>
                  <span style={{ color: COLORS.muted, fontSize: 12 }}>— {row.action}</span>
                </div>
              </div>
              {row.arrow && (
                <div style={{ paddingLeft: 13, color: COLORS.border, fontSize: 16, lineHeight: 1.2, margin: "2px 0" }}>↓</div>
              )}
            </div>
          ))}
          <div style={{ marginTop: 12, padding: "10px 12px", background: COLORS.violet + "15", border: `1px solid ${COLORS.violet}33`, borderRadius: 8 }}>
            <span style={{ color: COLORS.violet, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700 }}>WHY DIFFERENT MODELS: </span>
            <span style={{ color: COLORS.muted, fontSize: 12 }}>If Claude Code implements and Claude Code reviews, it tends to miss the same things it missed the first time. Codex catches different classes of bugs — cross-model review is meaningfully better than same-model review.</span>
          </div>
        </div>
      </div>

    </div>
  );
}

function AddyOsmani() {
  const [openCard, setOpenCard] = useState(null);
  const [openRow, setOpenRow] = useState(null);

  const concepts = [
    {
      id: "def",
      icon: "∞",
      color: COLORS.amber,
      title: "The definition",
      summary: "Replacing yourself as the person who prompts the agent",
      body: "A loop is a recursive goal: you define a purpose and the AI iterates until complete. You design the system that does the prompting instead of typing prompts yourself. The principle: “You shouldn’t be prompting coding agents anymore. You should be designing loops that prompt your agents.” The leverage point moved — that's the whole point.",
    },
    {
      id: "intent",
      icon: "📝",
      color: COLORS.sky,
      title: "Intent Debt",
      summary: "Agents fill every hole in your intent with a confident guess",
      body: "An agent starts every session cold. If your instructions have a gap, it doesn't stop — it fills the gap with a confident guess. A skill is that intent written down externally: conventions, build steps, the 'we don't do it like this because of that one incident.' Without skills the loop rederives your whole project from zero every cycle. With skills it compounds. Skills are the authoring format; plugins are how you distribute them. That distinction matters: a skill is one repo's knowledge, a plugin bundles skills and connectors so a teammate installs your full setup in one go.",
    },
    {
      id: "comprehension",
      icon: "🧠",
      color: COLORS.violet,
      title: "Comprehension Debt",
      summary: "The loop ships code faster than your understanding grows",
      body: "The faster a loop ships code you didn't write, the bigger the gap between what exists and what you actually understand. A smooth loop just makes comprehension debt grow faster unless you actively read what the loop made. This is the silent tax of high-velocity automation — your codebase starts pulling away from your mental model of it.",
    },
    {
      id: "surrender",
      icon: "⚠️",
      color: COLORS.rose,
      title: "Cognitive Surrender",
      summary: "The comfortable posture is the dangerous one",
      body: "When the loop runs itself, it's very tempting to stop having an opinion and just take whatever it gives back. Designing the loop is the cure when you do it with judgment and the accelerant when you do it to avoid thinking — same action, opposite result. Two people can build the exact same loop and get completely opposite results. One uses it to move faster on work they understand deeply. The other uses it to avoid understanding the work at all. The loop doesn't know the difference. You do.",
    },
    {
      id: "verification",
      icon: "✅",
      color: COLORS.emerald,
      title: "Verification is still on you",
      summary: "A loop running unattended is a loop making mistakes unattended",
      body: "The whole reason you split the verifier subagent from the maker is to make the loop's 'it's done' mean something — and even then 'done' is a claim, not a proof. /goal applies this to the stop condition itself: a fresh model decides if the loop is done instead of the one that did the work. But that's a filter, not a guarantee. Your job is to ship code you confirmed works.",
    },
    {
      id: "orchestration",
      icon: "📊",
      color: "#FF6B6B",
      title: "The Orchestration Tax",
      summary: "Your review bandwidth is the real ceiling, not the tool",
      body: "Worktrees take away mechanical collisions between parallel agents. But you are still the ceiling. How many parallel loops you can actually run isn't limited by the tool — it's limited by how fast you can review what they produce. Subagents burn more tokens since each does its own model and tool work. Spend them where a second opinion is worth paying for. The loop scales your output, not your judgment.",
    },
  ];

  const table = [
    { prim: "Automations", job: "Discovery + triage on schedule", codex: "Automations tab: project, prompt, cadence, env. Results → Triage inbox. /goal for run-until-done.", claude: "Scheduled tasks, cron, /loop, /goal, hooks, GitHub Actions." },
    { prim: "Worktrees", job: "Isolate parallel features", codex: "Built-in worktree per thread.", claude: "git worktree, --worktree flag, isolation: worktree on subagents." },
    { prim: "Skills", job: "Codify project knowledge", codex: "Agent Skills (SKILL.md), invoked with $name or implicitly on match.", claude: "Agent Skills (SKILL.md), same format." },
    { prim: "Connectors", job: "Connect your real tools", codex: "MCP connectors + plugins for distribution.", claude: "MCP servers + plugins. Same connector usually works in both." },
    { prim: "Subagents", job: "Separate maker from checker", codex: "TOML files in .codex/agents/ — name, desc, instructions, model, reasoning effort.", claude: "Defined in .claude/agents/, agent teams, pass work between them." },
    { prim: "State / Memory", job: "Track what's done across runs", codex: "Markdown or Linear via connector.", claude: "Markdown (AGENTS.md, progress files) or Linear via MCP." },
  ];

  const loopShape = [
    { n: "1", color: COLORS.amber, label: "Morning automation fires", detail: "Reads yesterday's CI failures, open issues, and recent commits. Calls a triage skill. Writes findings into a Markdown file or Linear board." },
    { n: "2", color: COLORS.sky, label: "Per-finding: open isolated worktree", detail: "For each finding worth doing, a thread opens its own worktree so this fix can't collide with others running in parallel." },
    { n: "3", color: COLORS.violet, label: "Maker subagent drafts the fix", detail: "Works inside the worktree. Reads the relevant project skills so it doesn't guess at conventions." },
    { n: "4", color: COLORS.emerald, label: "Checker subagent reviews", detail: "Separate agent, separate instructions — reviews the draft against project skills and existing tests. Different model if the fix warrants high effort." },
    { n: "5", color: "#FF6B6B", label: "Connectors open PR and update ticket", detail: "Loop opens the PR, links the Linear ticket, pings the Slack channel once CI is green. All via MCP." },
    { n: "6", color: COLORS.sky, label: "State file updated", detail: "Remembers what got tried, what passed, what is still open. Tomorrow morning the run picks up where today stopped. The agent forgets; the repo doesn't." },
    { n: "✓", color: COLORS.muted, label: "Unhandled items surface to triage inbox", detail: "Anything the loop cannot handle — decisions, approvals, irreversible actions — lands for you. You review; you don't prompt each step." },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Reference Guide */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 14px", display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 20 }}>📖</span>
        <div>
          <div style={{ color: COLORS.text, fontSize: 12, fontWeight: 600 }}>Loop Engineering Reference Guide</div>
          <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 1 }}>Autonomous Agent Patterns & Architectural Execution Loops</div>
        </div>
      </div>

      {/* Key concepts */}
      <div>
        <div style={{ color: COLORS.amber, fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>6 KEY CONCEPTS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {concepts.map(c => (
            <div key={c.id} onClick={() => setOpenCard(openCard === c.id ? null : c.id)} style={{
              background: COLORS.surface,
              border: `1px solid ${openCard === c.id ? c.color + "55" : COLORS.border}`,
              borderRadius: 10, padding: "12px 14px", cursor: "pointer",
              transition: "border-color 0.2s",
              boxShadow: openCard === c.id ? `0 0 12px ${c.color}18` : "none",
            }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 30, height: 30, minWidth: 30, borderRadius: 8, background: c.color + "20", border: `1px solid ${c.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: c.color, fontWeight: 700 }}>{c.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: c.color, fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>{c.title}</div>
                  <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{c.summary}</div>
                </div>
                <span style={{ color: COLORS.muted, fontSize: 14, paddingTop: 6 }}>{openCard === c.id ? "▾" : "▸"}</span>
              </div>
              {openCard === c.id && (
                <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.7, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${COLORS.border}` }}>{c.body}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tool parity table */}
      <div>
        <div style={{ color: COLORS.sky, fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>CODEX vs CLAUDE CODE — SAME PRIMITIVES, DIFFERENT NAMES</div>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
          {/* Header row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, background: COLORS.surface2 }}>
            {["Primitive", "Codex App", "Claude Code"].map((h, i) => (
              <div key={h} style={{ padding: "9px 12px", color: i === 1 ? COLORS.emerald : i === 2 ? COLORS.sky : COLORS.muted, fontFamily: "monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", borderRight: i < 2 ? `1px solid ${COLORS.border}` : "none" }}>{h}</div>
            ))}
          </div>
          {table.map((row, i) => (
            <div key={row.prim}>
              <div
                onClick={() => setOpenRow(openRow === i ? null : i)}
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: `1px solid ${COLORS.border}`, cursor: "pointer" }}
              >
                <div style={{ padding: "10px 12px", borderRight: `1px solid ${COLORS.border}` }}>
                  <div style={{ color: COLORS.amber, fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>{row.prim}</div>
                  <div style={{ color: COLORS.muted, fontSize: 10, marginTop: 2 }}>{row.job}</div>
                </div>
                <div style={{ padding: "10px 12px", borderRight: `1px solid ${COLORS.border}` }}>
                  <div style={{ color: COLORS.emerald, fontSize: 11, lineHeight: 1.5, fontFamily: "monospace" }}>{openRow === i ? row.codex : row.codex.slice(0, 40) + (row.codex.length > 40 ? "…" : "")}</div>
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ color: COLORS.sky, fontSize: 11, lineHeight: 1.5, fontFamily: "monospace" }}>{openRow === i ? row.claude : row.claude.slice(0, 40) + (row.claude.length > 40 ? "…" : "")}</div>
                </div>
              </div>
            </div>
          ))}
          <div style={{ padding: "10px 14px", borderTop: `1px solid ${COLORS.border}`, background: COLORS.surface2 }}>
            <span style={{ color: COLORS.muted, fontSize: 11 }}>Tap any row to expand · </span>
            <span style={{ color: COLORS.amber, fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>The connector you build for one usually just works in the other.</span>
          </div>
        </div>
      </div>

      {/* One loop shape */}
      <div>
        <div style={{ color: COLORS.emerald, fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>ONE LOOP SHAPE — ADDY'S WALKTHROUGH</div>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "16px" }}>
          {loopShape.map((s, i) => (
            <div key={i}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 26, height: 26, minWidth: 26, borderRadius: "50%", background: s.color + "22", border: `1px solid ${s.color}55`, color: s.color, fontFamily: "monospace", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.n}</div>
                <div>
                  <div style={{ color: s.color, fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>{s.label}</div>
                  <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 3, lineHeight: 1.6 }}>{s.detail}</div>
                </div>
              </div>
              {i < loopShape.length - 1 && <div style={{ paddingLeft: 12, color: COLORS.border, fontSize: 14, lineHeight: 1.3, margin: "4px 0" }}>↓</div>}
            </div>
          ))}
          <div style={{ marginTop: 14, padding: "10px 12px", background: COLORS.amber + "12", border: `1px solid ${COLORS.amber}33`, borderRadius: 8 }}>
            <span style={{ color: COLORS.amber, fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>THE RESULT: </span>
            <span style={{ color: COLORS.muted, fontSize: 12 }}>You designed it once. You did not prompt any of those steps. That's the whole point made real — and it's the same loop in Codex or Claude Code because the pieces are the same pieces.</span>
          </div>
        </div>
      </div>

      {/* Warning trio */}
      <div>
        <div style={{ color: COLORS.rose, fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>WHAT THE LOOP STILL DOESN'T DO FOR YOU</div>
        {[
          { icon: "🔍", label: "Verification", color: COLORS.rose, text: "A loop running unattended is also a loop making mistakes unattended. 'Done' from the loop is a claim, not a proof." },
          { icon: "📉", label: "Comprehension debt", color: COLORS.violet, text: "The faster the loop ships code you didn't write, the bigger the gap between what exists and what you actually get." },
          { icon: "🪑", label: "Cognitive surrender", color: COLORS.amber, text: "When the loop runs itself, it's tempting to stop having opinions. Same loop, opposite results depending on whether you're using it to think or to avoid thinking." },
        ].map(w => (
          <div key={w.label} style={{ display: "flex", gap: 12, background: COLORS.surface, border: `1px solid ${w.color}33`, borderRadius: 10, padding: "12px 14px", marginBottom: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 20 }}>{w.icon}</span>
            <div>
              <div style={{ color: w.color, fontFamily: "monospace", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{w.label.toUpperCase()}</div>
              <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6 }}>{w.text}</div>
            </div>
          </div>
        ))}
        <div style={{ background: COLORS.surface2, border: `1px solid ${COLORS.amber}44`, borderRadius: 10, padding: "14px 16px", marginTop: 4 }}>
          <div style={{ color: COLORS.amber, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>"Build the loop. Stay the engineer."</div>
          <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.7 }}>Go ahead and set up your loops, but don't forget that prompting your agents directly is also effective. Two people can build the exact same loop and get completely opposite results. One uses it to move faster on work they understand deeply. The other uses it to avoid understanding the work at all.</div>
          <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 8, fontFamily: "monospace" }}>— Production Engineering Principle</div>
        </div>
      </div>

    </div>
  );
}

function CommandsRef() {
  const [active, setActive] = useState("goal");

  const cmds = {
    goal: {
      label: "/goal",
      color: COLORS.amber,
      tagline: "Run until a verifiable condition is true",
      when: "Use when a false 'done' is costly — a failed deploy, a broken test suite, a bad merge.",
      how: "After every agent turn, a separate small model (Haiku by default) checks your condition and returns yes/no + reason. It reads the transcript only — it can't run commands or read files itself. Write conditions Claude's own output can demonstrate.",
      durability: "In-session only. Ends when the session closes.",
      cap: "Add 'or stop after N turns' in the condition text. Watch /cost.",
      syntax: "/goal <condition>\n\nExamples:\n/goal all tests in test/auth pass and lint is clean\n/goal sort every file in Downloads into subfolders, stop after 30 turns\n/goal implement everything I asked for; verify E2E with Playwright; Codex approves; stop",
      gotcha: "The verifier reads the transcript, not your files. If Claude claims tests pass without showing output, the verifier has nothing to check. Always have Claude run the check and paste the result.",
    },
    loop: {
      label: "/loop",
      color: COLORS.sky,
      tagline: "Recur on a cadence; Claude decides when it's done",
      when: "Use for recurring chores where 'tests are green' or a similar cheap signal is trustworthy enough.",
      how: "Re-runs a prompt on an interval. Claude self-evaluates. No separate checker model. Session-bound — closing the window stops it. A canonical starter: '/loop babysit all my PRs. Auto-fix build issues, and when comments come in, use a worktree agent to fix them.'",
      durability: "Session only. Laptop closes → loop stops.",
      cap: "Press Esc. Or close the session. No turn limit built in — add one in your prompt.",
      syntax: "/loop <prompt>\n\nExamples:\n/loop babysit all my PRs. Auto-fix build issues.\n/loop check test suite every 5 minutes; if any fail, fix and commit\n/loop triage open issues; label and assign each one",
      gotcha: "No independent verifier. Fine for low-stakes chores. Bad for anything where Claude grading its own work is a risk.",
    },
    schedule: {
      label: "/schedule (Routines)",
      color: COLORS.emerald,
      tagline: "Cloud-persistent — survives laptop close",
      when: "Use when you need the loop to keep running after you walk away. Morning triage, nightly CI checks, weekly dependency audits.",
      how: "Registered in Routines via /schedule. Runs server-side so the laptop can be off. Comes back with findings in a triage inbox — runs that find nothing archive themselves. Can call a skill with $skill-name so the recurring logic stays maintainable.",
      durability: "Cloud-persistent. Survives session close, laptop off, account switch.",
      cap: "Set a budget on the Routine. Runs without findings auto-archive.",
      syntax: "/schedule <cadence> <prompt>\n\nExamples:\n/schedule daily at 8am run $triage-skill on open issues\n/schedule every weeknight check CI failures; write findings to STATE.md\n/schedule weekly audit dependencies; open PR for any safe patch-level upgrade",
      gotcha: "Routines are the highest-durability option but also the one most likely to surprise you with a bill. Set a dollar budget before enabling.",
    },
  };

  const ladder = [
    { label: "/loop", color: COLORS.sky, scope: "Session", survives: "❌ Laptop close", verifier: "Self (Claude)", risk: "Low" },
    { label: "Desktop scheduled task", color: COLORS.violet, scope: "Local app open", survives: "❌ App close", verifier: "Self", risk: "Low–Med" },
    { label: "/schedule (Routines)", color: COLORS.emerald, scope: "Cloud", survives: "✅ Always", verifier: "Self + triage inbox", risk: "Set budget!" },
    { label: "/goal", color: COLORS.amber, scope: "In-session run", survives: "❌ Session close", verifier: "✅ Separate Haiku model", risk: "Per-turn cost" },
  ];

  const c = cmds[active];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Command selector */}
      <div>
        <div style={{ color: COLORS.amber, fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>CHOOSE A COMMAND</div>
        <div style={{ display: "flex", gap: 8 }}>
          {Object.entries(cmds).map(([k, v]) => (
            <button key={k} onClick={() => setActive(k)} style={{
              flex: 1, background: active === k ? v.color + "22" : COLORS.surface,
              border: `1px solid ${active === k ? v.color : COLORS.border}`,
              borderRadius: 8, padding: "10px 8px", cursor: "pointer",
              color: active === k ? v.color : COLORS.muted,
              fontFamily: "monospace", fontSize: 11, fontWeight: 700,
              transition: "all 0.15s", textAlign: "center",
            }}>{v.label}</button>
          ))}
        </div>
      </div>

      {/* Command detail card */}
      <div style={{ background: COLORS.surface, border: `1px solid ${c.color}44`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", background: c.color + "12", borderBottom: `1px solid ${COLORS.border}` }}>
          <div style={{ color: c.color, fontFamily: "monospace", fontSize: 16, fontWeight: 700 }}>{c.label}</div>
          <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>{c.tagline}</div>
        </div>
        {[
          { label: "WHEN TO USE", val: c.when, color: c.color },
          { label: "HOW IT WORKS", val: c.how, color: COLORS.sky },
          { label: "DURABILITY", val: c.durability, color: COLORS.emerald },
          { label: "HOW TO CAP COST", val: c.cap, color: COLORS.rose },
          { label: "⚠️ GOTCHA", val: c.gotcha, color: COLORS.rose },
        ].map(row => (
          <div key={row.label} style={{ padding: "11px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ color: row.color, fontFamily: "monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 5 }}>{row.label}</div>
            <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6 }}>{row.val}</div>
          </div>
        ))}
        <div style={{ background: "#060A14", padding: "12px 16px" }}>
          <div style={{ color: COLORS.muted, fontFamily: "monospace", fontSize: 9, letterSpacing: "0.08em", marginBottom: 8 }}>SYNTAX + EXAMPLES</div>
          <pre style={{ color: c.color, fontFamily: "monospace", fontSize: 12, lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>{c.syntax}</pre>
        </div>
      </div>

      {/* Durability ladder */}
      <div>
        <div style={{ color: COLORS.sky, fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>DURABILITY LADDER — LEAST TO MOST PERSISTENT</div>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr 1fr 0.7fr", background: COLORS.surface2 }}>
            {["Command", "Scope", "Survives close?", "Risk"].map((h, i) => (
              <div key={h} style={{ padding: "8px 12px", color: COLORS.muted, fontFamily: "monospace", fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", borderRight: i < 3 ? `1px solid ${COLORS.border}` : "none" }}>{h}</div>
            ))}
          </div>
          {ladder.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr 1fr 0.7fr", borderTop: `1px solid ${COLORS.border}` }}>
              <div style={{ padding: "9px 12px", color: r.color, fontFamily: "monospace", fontSize: 11, fontWeight: 700, borderRight: `1px solid ${COLORS.border}` }}>{r.label}</div>
              <div style={{ padding: "9px 12px", color: COLORS.muted, fontSize: 11, borderRight: `1px solid ${COLORS.border}` }}>{r.scope}</div>
              <div style={{ padding: "9px 12px", color: COLORS.muted, fontSize: 11, borderRight: `1px solid ${COLORS.border}` }}>{r.survives}</div>
              <div style={{ padding: "9px 12px", color: r.risk.includes("!") ? COLORS.rose : COLORS.muted, fontSize: 11, fontFamily: "monospace" }}>{r.risk}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Verifier rule */}
      <div style={{ background: COLORS.surface2, border: `1px solid ${COLORS.amber}44`, borderRadius: 10, padding: "14px 16px" }}>
        <div style={{ color: COLORS.amber, fontFamily: "monospace", fontSize: 11, fontWeight: 700, marginBottom: 8 }}>THE VERIFIER IS THE WHOLE GAME</div>
        <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          Close every loop on a check Claude can't fake. The /goal verifier (Haiku by default) reads the transcript only — it can't run commands. So write your condition as something the agent proves in its own output: have it run the tests and paste the result, not just claim they pass. Skip the verifier and you don't have a loop. You have a wish.
        </p>
        <div style={{ marginTop: 10, background: "#060A14", borderRadius: 6, padding: "8px 12px", fontFamily: "monospace", fontSize: 12, color: COLORS.emerald }}>
          /loop work the task list. After each task, have a separate verifier model check the result against the spec and the tests. Only move on when it passes. Surface anything the verifier rejects twice.
        </div>
      </div>

      {/* progress.md spine */}
      <div>
        <div style={{ color: COLORS.violet, fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>THE MEMORY SPINE — progress.md</div>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
            <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              The model forgets everything between runs. The repo doesn't. A plain markdown file on disk is the spine every long-running loop depends on. Every run reads it at the start and updates it at the end. When a loop keeps making the same mistake, don't write a cleverer prompt — have the loop write the lesson into the rules file so the fix persists for every future run.
            </p>
          </div>
          <div style={{ background: "#060A14", padding: "14px 16px" }}>
            <div style={{ color: COLORS.muted, fontFamily: "monospace", fontSize: 9, marginBottom: 10, letterSpacing: "0.05em" }}>progress.md — TEMPLATE</div>
            <pre style={{ color: "#A8C4E0", fontFamily: "monospace", fontSize: 12, lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap" }}>{`## Done
- 2026-06-22: fixed flaky test in test/auth
  (retry on token refresh — root cause: stale cookie)

## In progress
- Dependency audit: 3 of 7 advisories patched
  lodash bump blocked by API change in v5

## Open / needs a human
- CVE-2026-xxxx in image lib — fix changes output format
  → requires product decision before patching

## Lessons learned
- Never patch devDependencies without running the full
  integration suite — broke build twice`}</pre>
          </div>
        </div>
      </div>

    </div>
  );
}

function RealWorld() {
  const [open, setOpen] = useState(null);

  const cases = [
    {
      id: "mozilla",
      icon: "🦊",
      color: COLORS.emerald,
      org: "Mozilla Firefox",
      who: "Browser engineering case study",
      headline: "423 security fixes shipped in one month with AI agents",
      result: "423 memory-safety patches merged in ~30 days. Human engineers still reviewed each one.",
      how: [
        "Built a custom harness on Claude's Agent SDK (a JSON-streaming wrapper around Claude Code CLI) — 'built in an afternoon using vendor SDKs'",
        "LLM judge scores every file on two dimensions: likelihood of memory-safety issue + ease of access from a webpage",
        "Patching agent fixes the one vulnerable location; human engineers review and flag similar places nearby",
        "Goal loops with subagent verifiers — agent can't self-certify a fix",
        "Prioritization was essential: millions of lines of code, so the judge determines which files even enter the loop",
      ],
      lesson: "The real unlock wasn't a better model — it was the harness around it. Scoring files, goal loops, subagent verification, human review kept in the chain.",
    },
    {
      id: "boris",
      icon: "🤖",
      color: COLORS.sky,
      org: "Anthropic / Claude Code",
      who: "Claude Code workflow case study",
      headline: "259 PRs in 30 days — 100% written by Claude Code",
      result: "Nov–Dec 2025: 259 PRs landed on Claude Code, all authored by Claude Code. The developer deleted their IDE in November 2025 and hasn't opened it since.",
      how: [
        "Loops run on cron — Claude Code's /loop uses scheduling under the hood",
        "The developer literally does not prompt Claude anymore; loops surface findings to them",
        "Loops drive Claude Code, an advanced model, and a verifier — three layers, not one",
        "He coordinates with customers and decides what to build; the loops write the code",
        "'Someone still decides what to build, talks to customers, and coordinates teams. The job didn't vanish — it moved from writing code to writing the thing that writes the code.'",
      ],
      lesson: "The job moved, it didn't disappear. They spent a year building the CLAUDE.md files and loop specs that encode their judgment before any of this worked.",
    },
    {
      id: "cowork",
      icon: "☀️",
      color: COLORS.amber,
      org: "Claude Cowork / Anthropic",
      who: "Anthropic product demo case study",
      headline: "Weekly skills loop that spawns its own subagent loops",
      result: "A weekly automation in Codex spawned two named subagents that each ran their own goal loops to validate skills in real time — loops generating loops.",
      how: [
        "Morning briefing: scheduled task fires daily, checks calendar + email, sends summary to Slack — zero code required",
        "Weekly loop spawns two named subagents (defined as TOML in .codex/agents/)",
        "Each subagent runs its own /goal loop to validate skills against real project state",
        "The daily PR-review loop: new review comment → triage → fix → reply → watch for new comments → repeat",
        "'The ceiling on loop-based automation is basically how well can you define the job, not how complex is the engineering'",
      ],
      lesson: "The morning briefing is the perfect first loop. A scheduled task that fires, checks a few sources, and surfaces a summary is already a complete working loop — no code required.",
    },
    {
      id: "claude100",
      icon: "📝",
      color: COLORS.violet,
      org: "Obsidian notes project",
      who: "Anonymous practitioner (shared in loop engineering discourse)",
      headline: "99 structured notes generated in 14 minutes",
      result: "99 Obsidian notes (frontmatter, classification, examples, references each) in 14 minutes. Two earlier loop versions failed before the third worked.",
      how: [
        "Doing it interactively would have meant 99 manual sessions",
        "A bash loop driving Claude Code handled all of them in one unattended run",
        "Loop v1: failed (no stop condition). Loop v2: failed (no memory, re-did completed notes). Loop v3: progress.md spine + max-iter cap = success",
        "Cost: ~$0.40 for all 99 notes",
      ],
      lesson: "You usually don't get the loop right on the first build. The first two versions failing is normal — each failure teaches you one missing piece (stop condition, memory, cap).",
    },
  ];

  const failures = [
    { n: "1", label: "No stop condition", fix: "If you can't say what 'done' looks like in one sentence, you don't have a loop — you have a wish. Write the check first.", color: COLORS.rose },
    { n: "2", label: "Verifier reads code, not output", fix: "The /goal verifier reads the transcript. Have Claude run the check and paste the result. A claim that tests pass isn't evidence.", color: COLORS.rose },
    { n: "3", label: "Stale context on each run", fix: "Every run starts by reading STATE.md or fetching fresh state. Cached CI results from 6 hours ago aren't the current state.", color: COLORS.amber },
    { n: "4", label: "Race conditions on shared files", fix: "Shared read is fine. Shared write needs a worktree per agent. Five loops touching the same PR without isolation = chaos.", color: COLORS.amber },
    { n: "5", label: "No memory between runs", fix: "A loop without a progress file re-derives everything from zero every session. The model forgets; the repo must remember.", color: COLORS.violet },
    { n: "6", label: "No iteration cap", fix: "A loop that stalls on one error without a cap will run all night. 'Or stop after N turns with no progress' is mandatory.", color: COLORS.sky },
    { n: "7", label: "Maker grading its own work", fix: "The model that wrote the code is too charitable grading it. A second agent with different instructions is the only real check.", color: COLORS.emerald },
    { n: "8", label: "Prompt injection from public inputs", fix: "Public GitHub issues, customer tickets, any untrusted text can contain injection payloads. Require a human tag before the loop acts on public inputs.", color: "#FF6B6B" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Case studies */}
      <div>
        <div style={{ color: COLORS.amber, fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>PRODUCTION CASE STUDIES</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {cases.map(c => (
            <div key={c.id} style={{ background: COLORS.surface, border: `1px solid ${open === c.id ? c.color + "55" : COLORS.border}`, borderRadius: 12, overflow: "hidden", transition: "border-color 0.2s" }}>
              <div onClick={() => setOpen(open === c.id ? null : c.id)} style={{ padding: "14px 16px", cursor: "pointer" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 22 }}>{c.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 3 }}>
                      <span style={{ color: c.color, fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>{c.org}</span>
                      <span style={{ color: COLORS.muted, fontSize: 11 }}>· {c.who}</span>
                    </div>
                    <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 14 }}>{c.headline}</div>
                    <div style={{ background: c.color + "18", border: `1px solid ${c.color}33`, borderRadius: 6, padding: "5px 10px", marginTop: 8, color: c.color, fontSize: 12, lineHeight: 1.5 }}>{c.result}</div>
                  </div>
                  <span style={{ color: COLORS.muted, fontSize: 14, paddingTop: 2 }}>{open === c.id ? "▾" : "▸"}</span>
                </div>
              </div>
              {open === c.id && (
                <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: "14px 16px" }}>
                  <div style={{ color: c.color, fontFamily: "monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 10 }}>HOW THEY DID IT</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                    {c.how.map((h, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ color: c.color, fontFamily: "monospace", fontSize: 10, minWidth: 18, paddingTop: 2 }}>{i + 1}.</span>
                        <span style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6 }}>{h}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: COLORS.surface2, border: `1px solid ${c.color}33`, borderRadius: 8, padding: "10px 12px" }}>
                    <span style={{ color: c.color, fontFamily: "monospace", fontSize: 10, fontWeight: 700 }}>KEY LESSON: </span>
                    <span style={{ color: COLORS.muted, fontSize: 12 }}>{c.lesson}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 8 Failure Modes */}
      <div>
        <div style={{ color: COLORS.rose, fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>8 FAILURE MODES THAT TURN LOOPS INTO UNATTENDED MISTAKES</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {failures.map(f => (
            <div key={f.n} style={{ display: "flex", gap: 12, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 14px", alignItems: "flex-start" }}>
              <div style={{ width: 26, height: 26, minWidth: 26, borderRadius: "50%", background: f.color + "22", border: `1px solid ${f.color}55`, color: f.color, fontFamily: "monospace", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{f.n}</div>
              <div>
                <div style={{ color: f.color, fontFamily: "monospace", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>{f.label}</div>
                <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6 }}>{f.fix}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loop lineage */}
      <div>
        <div style={{ color: COLORS.sky, fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>THE LINEAGE — WHERE LOOP ENGINEERING CAME FROM</div>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
          {[
            { year: "1975", label: "Cron", desc: "Timer fires a batch job. No AI, no decision in the body. Loop engineering's grandparent.", color: COLORS.muted },
            { year: "2022", label: "ReAct paper", desc: "Formalised: model reasons → calls a tool → reads result → repeats until done. One model, one loop, human watching.", color: COLORS.muted },
            { year: "2023", label: "AutoGPT", desc: "Gave an agent a goal and let it prompt itself. No verifier, no cap. Famous for running forever and producing nothing.", color: COLORS.muted },
            { year: "2024", label: "Ralph Loop / bash wrappers", desc: "Practitioners hand-wrote bash to re-run Claude prompts. Worked but the maintenance burden was personal and permanent.", color: COLORS.violet },
            { year: "May 2026", label: "/goal ships in Claude Code v2.1.139", desc: "Native loop primitive with a separate verifier model. No bash required. Same shape as all of the above, now inside the product.", color: COLORS.sky },
            { year: "Jun 2026", label: "Loop Engineering named", desc: "Loop engineering week. Autonomous agent loop patterns codified. A practice that practitioners had been running for months gets a name.", color: COLORS.amber },
          ].map((r, i, arr) => (
            <div key={r.year} style={{ display: "flex", gap: 14, padding: "12px 16px", borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.border}` : "none", alignItems: "flex-start" }}>
              <div style={{ color: r.color, fontFamily: "monospace", fontSize: 10, fontWeight: 700, minWidth: 64, paddingTop: 2 }}>{r.year}</div>
              <div>
                <div style={{ color: r.color === COLORS.muted ? COLORS.text : r.color, fontWeight: 600, fontSize: 13 }}>{r.label}</div>
                <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 3, lineHeight: 1.6 }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function ClaudeBasics() {
  const [open, setOpen] = useState(null);
  const [copied, setCopied] = useState(null);
  const copy = (id, text) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
      }).catch(() => {});
    }
  };
  const levels = { Beginner: COLORS.emerald, Intermediate: COLORS.amber, Advanced: COLORS.rose };
  const workflows = [
    { id:"chat", n:"01", icon:"💬", color:COLORS.sky, title:"Basic Chat & Role Prompting", level:"Beginner", what:"Assign Claude a role to get more precise, context-aware answers. A 'content strategist' reply is different from a 'financial analyst' reply even with identical input.", prompt:"You are a [ROLE, e.g. senior content strategist].\nI need help with [TASK].\nMy context: [TARGET AUDIENCE, GOALS, CONSTRAINTS].\nGive me [SPECIFIC OUTPUT FORMAT].", loop:"Role prompts belong in your CLAUDE.md skills file. Once encoded, every loop session starts knowing the role without you typing it." },
    { id:"writing", n:"02", icon:"✍️", color:COLORS.emerald, title:"Writing Assistance + Style Training", level:"Beginner", what:"Train Claude on your writing style using the Skills feature — give it examples and feedback until it mimics your voice consistently. Works for emails, blog posts, social content.", prompt:"Here are three examples of my writing style:\n\n[EXAMPLE 1]\n[EXAMPLE 2]\n[EXAMPLE 3]\n\nWrite a [TYPE] about [TOPIC] in the same voice.\nTone: [TONE]. Length: [LENGTH].", loop:"Save your style examples as a skill. A weekly content loop can draft a full week of posts from a topic list — same voice, zero manual prompting." },
    { id:"files", n:"03", icon:"📄", color:COLORS.violet, title:"File Analysis — PDF, CSV, Images", level:"Beginner", what:"Upload a file and ask Claude to summarize, extract key metrics, compare documents, or identify discrepancies. Works on reports, contracts, spreadsheets, screenshots.", prompt:"Analyze this [FILE TYPE].\nExtract:\n1. The 3 most important findings\n2. Any anomalies or risks\n3. A one-paragraph executive summary\nFlag anything requiring urgent attention.", loop:"A nightly loop can pull reports from Google Drive, analyze each one, and write findings into a digest — you read one file instead of forty." },
    { id:"tools", n:"04", icon:"🔧", color:COLORS.amber, title:"Custom Tools & Templates", level:"Beginner", what:"Build reusable templates — project trackers, checklists, review frameworks — then share them with teammates. Claude fills a new instance from minimal input.", prompt:"Create a [DOCUMENT TYPE] template for [USE CASE].\nInclude sections for: [SECTION 1], [SECTION 2], [SECTION 3].\nMake each section fillable with clear placeholders.\nAdd brief instructions inside each placeholder.", loop:"Templates become the output format for loops. A ticket-triage loop that always writes into your brief template produces consistent, reviewable artifacts." },
    { id:"research", n:"05", icon:"🔍", color:"#FF6B6B", title:"Web Research & Synthesis", level:"Beginner", what:"Claude searches the web, synthesizes multiple sources, and presents findings in a structured format. Ideal for competitive research, overviews, due diligence.", prompt:"Research [TOPIC] using current web sources.\nI need:\n1. A 3-paragraph overview\n2. 5 key data points with sources\n3. 3 conflicting viewpoints if they exist\n4. One concrete recommendation", loop:"A morning competitive-intelligence loop searches for competitor mentions + market signals, writes a digest, and pings Slack — no manual searches." },
    { id:"projects", n:"06", icon:"📁", color:COLORS.sky, title:"Projects — Persistent Context", level:"Beginner", what:"Projects keep files, instructions, and memory together across sessions. Claude 'knows' your project context without re-explaining every time — persistent CLAUDE.md for non-coders.", prompt:"This project is [PROJECT NAME].\nContext: [WHAT IT IS, WHO IT IS FOR].\nAlways: [RULE 1]\nNever: [RULE 2]\nDefault output format: [FORMAT]\nStart by reading the attached [FILE].", loop:"A Project is the non-code equivalent of a skills file. Loops in Claude Code read CLAUDE.md; Projects give the same persistent context to chat workflows." },
    { id:"integrations", n:"07", icon:"🔌", color:COLORS.emerald, title:"App Integrations — Drive, Gmail, Canva", level:"Intermediate", what:"Connect Claude to Google Drive, Gmail, Canva and others via MCP. Claude can read Drive files, summarize email threads, create Canva assets — all in one session.", prompt:"Check my Google Drive for files modified in the last 7 days in [FOLDER].\nSummarize what changed.\nFlag anything needing my attention.\nWrite a brief status update I can paste into Slack.", loop:"Integrations are the connectors layer of a loop. A weekly status loop reads Drive + Gmail, writes a summary, posts to Slack — no session open." },
    { id:"skills", n:"08", icon:"🎓", color:COLORS.violet, title:"Custom Skills for Specialist Tasks", level:"Intermediate", what:"Skills encode specialist knowledge — customer support tone, doc standards, scriptwriting format — so Claude applies it consistently without re-prompting. Shareable across teams.", prompt:"I am going to teach you a skill called [SKILL NAME].\nWhen invoked, you should: [BEHAVIOR 1], [BEHAVIOR 2].\nAvoid: [ANTI-PATTERN].\nGood output example: [EXAMPLE]\nBad output example: [COUNTER-EXAMPLE]", loop:"Skills make loops compoundable. A loop with skills gets sharper every iteration; without skills it rediscovers the same conventions from scratch every run." },
    { id:"automation", n:"09", icon:"⚙️", color:COLORS.amber, title:"Automating Repetitive Workflows", level:"Intermediate", what:"Set Claude to handle recurring tasks: weekly reports, data entry, digest generation. Key is defining a clear input source, output format, and stop condition.", prompt:"Every [FREQUENCY], pull [DATA SOURCE].\nApply [TRANSFORMATION].\nProduce a [OUTPUT FORMAT].\nFlag anything outside [NORMAL RANGE].\nStop if [STOP CONDITION].", loop:"This IS a loop. The prompt above maps directly to: trigger → skill → connectors → output → stop condition. If you can write the prompt, you can write the loop." },
    { id:"rolebased", n:"10", icon:"🎭", color:"#FF6B6B", title:"Role-Based Prompts for Precision", level:"Advanced", what:"Stacking roles — 'senior engineer reviewing junior dev work' — produces more calibrated output than a single role. Use for complex tasks needing specialist POV.", prompt:"You are a [SENIOR ROLE] reviewing work by a [JUNIOR ROLE].\nIdentify: [WHAT TO LOOK FOR]\nGive feedback on: [CRITERIA 1], [CRITERIA 2]\nRate overall quality: [SCALE]\nBe direct. Do not soften findings.", loop:"Role stacking is the maker/verifier sub-agent pattern. The maker is the junior, the verifier is the senior — same structure, run in two separate agent sessions." },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

      <div style={{ background:COLORS.surface2, border:`1px solid ${COLORS.sky}33`, borderRadius:12, padding:"14px 16px" }}>
        <div style={{ color:COLORS.sky, fontFamily:"monospace", fontSize:11, fontWeight:700, marginBottom:6 }}>WHY THIS TAB EXISTS IN A LOOP ENGINEERING APP</div>
        <p style={{ color:COLORS.muted, fontSize:13, lineHeight:1.7, margin:0 }}>Every loop is built on top of something Claude can do manually first. If you can't get the right output in a single session, the loop will automate the wrong thing at scale. These 10 workflows are the raw material. Each card shows the manual version, a copy-ready prompt, and the <span style={{ color:COLORS.amber }}>loop upgrade path</span> — what it looks like when automated.</p>
      </div>

      <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
        {Object.entries(levels).map(([l,c]) => (
          <div key={l} style={{ display:"flex", alignItems:"center", gap:5, background:c+"18", border:`1px solid ${c}44`, borderRadius:6, padding:"4px 10px" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:c }} />
            <span style={{ color:c, fontSize:11, fontFamily:"monospace", fontWeight:700 }}>{l}</span>
          </div>
        ))}
        <span style={{ color:COLORS.muted, fontSize:11 }}>· tap any card for prompt + loop path</span>
      </div>

      {workflows.map(w => {
        const isOpen = open === w.id;
        const isCopied = copied === w.id;
        const lc = levels[w.level];
        return (
          <div key={w.id} style={{ background:COLORS.surface, border:`1px solid ${isOpen ? w.color+"55" : COLORS.border}`, borderRadius:12, overflow:"hidden", transition:"border-color 0.2s" }}>
            <div onClick={() => setOpen(isOpen ? null : w.id)} style={{ padding:"12px 14px", cursor:"pointer" }}>
              <div style={{ display:"flex", gap:10, alignItems: "flex-start" }}>
                <div style={{ width:36, height:36, minWidth:36, borderRadius:8, background:w.color+"18", border:`1px solid ${w.color}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{w.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:3, flexWrap:"wrap" }}>
                    <span style={{ color:COLORS.muted, fontFamily:"monospace", fontSize:10, fontWeight:700 }}>{w.n}</span>
                    <span style={{ background:lc+"18", border:`1px solid ${lc}44`, color:lc, borderRadius:4, padding:"1px 6px", fontSize:9, fontFamily:"monospace", fontWeight:700 }}>{w.level}</span>
                  </div>
                  <div style={{ color:COLORS.text, fontWeight:600, fontSize:14 }}>{w.title}</div>
                  <div style={{ color:COLORS.muted, fontSize:12, marginTop:3, lineHeight:1.5 }}>{w.what}</div>
                </div>
                <span style={{ color:COLORS.muted, fontSize:14, paddingTop:4 }}>{isOpen ? "▾" : "▸"}</span>
              </div>
            </div>
            {isOpen && (
              <div style={{ borderTop:`1px solid ${COLORS.border}` }}>
                <div style={{ background:"#060A14", padding:"12px 14px" }}>
                  <div style={{ color:COLORS.muted, fontFamily:"monospace", fontSize:9, letterSpacing:"0.08em", marginBottom:8 }}>COPY-READY PROMPT TEMPLATE</div>
                  <pre style={{ color:w.color, fontFamily:"monospace", fontSize:12, lineHeight:1.8, margin:0, whiteSpace:"pre-wrap" }}>{w.prompt}</pre>
                </div>
                <div style={{ padding:"8px 14px", borderTop:`1px solid ${COLORS.border}`, display:"flex", justifyContent:"flex-end" }}>
                  <button onClick={() => copy(w.id, w.prompt)} style={{ background:isCopied ? COLORS.emerald+"22" : COLORS.surface2, border:`1px solid ${isCopied ? COLORS.emerald : COLORS.border}`, borderRadius:6, color:isCopied ? COLORS.emerald : COLORS.sky, fontFamily:"monospace", fontSize:11, fontWeight:700, padding:"5px 12px", cursor:"pointer", transition:"all 0.15s" }}>
                    {isCopied ? "✓ Copied!" : "Copy prompt"}
                  </button>
                </div>
                <div style={{ padding:"12px 14px", borderTop:`1px solid ${COLORS.border}`, background:w.color+"0A" }}>
                  <div style={{ color:w.color, fontFamily:"monospace", fontSize:9, fontWeight:700, letterSpacing:"0.08em", marginBottom:6 }}>↻ LOOP UPGRADE PATH</div>
                  <p style={{ color:COLORS.muted, fontSize:13, lineHeight:1.7, margin:0 }}>{w.loop}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div style={{ background:COLORS.surface2, border:`1px solid ${COLORS.amber}44`, borderRadius:12, padding:"16px" }}>
        <div style={{ color:COLORS.amber, fontFamily:"monospace", fontSize:11, fontWeight:700, marginBottom:10 }}>THE PROGRESSION — FROM WORKFLOW TO LOOP</div>
        {[
          ["Role prompt in chat", "CLAUDE.md skill — loaded into every loop session automatically"],
          ["Manual file analysis", "Nightly loop pulls files from Drive, writes digest, no human involved"],
          ["Repeating the same writing prompt", "Style skill + weekly content loop — posts drafted while you sleep"],
          ["App integrations used manually", "Connectors layer of a loop — reads Gmail, writes to Slack, no session open"],
          ["Role-based review prompt", "Maker/verifier subagents — maker builds, verifier (different role) approves"],
        ].map(([from, to], i) => (
          <div key={i} style={{ display:"flex", gap:10, marginBottom:i<4?10:0, alignItems:"flex-start" }}>
            <span style={{ color:COLORS.amber, fontSize:12, paddingTop:2 }}>→</span>
            <div>
              <span style={{ color:COLORS.muted, fontSize:12 }}>{from} </span>
              <span style={{ color:COLORS.border, fontSize:12 }}>becomes </span>
              <span style={{ color:COLORS.text, fontSize:12, fontWeight:500 }}>{to}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoopEngineeringTab({ onSelectTab, setActiveTab }) {
  const [tab, setTab] = useState("overview");
  const [expandedBlock, setExpandedBlock] = useState(null);

  const activeGroup = TAB_GROUPS.find(g => g.items.some(i => i.id === tab)) || TAB_GROUPS[3];
  const groupTab = id => {
    const g = TAB_GROUPS.find(x => x.id === id);
    if (g) setTab(g.items[0].id);
  };

  const tabButton = (id, label, active) => (
    <button
      key={id}
      onClick={() => setTab(id)}
      style={{
        background: "none",
        border: "none",
        borderBottom: `2px solid ${active ? COLORS.amber : "transparent"}`,
        color: active ? COLORS.amber : COLORS.muted,
        padding: "8px 12px",
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        transition: "all 0.15s",
        fontFamily: "Inter, sans-serif",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >{label}</button>
  );

  return (
    <div style={{
      background: COLORS.bg,
      minHeight: "100%",
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: COLORS.text,
      borderRadius: "14px",
      overflow: "hidden",
      border: `1px solid ${COLORS.border}`,
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0A0F1A; } ::-webkit-scrollbar-thumb { background: #243358; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{
        background: COLORS.surface,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "0 20px",
      }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{ padding: "16px 0 0", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 700 }}>LOOP</span>
            <span style={{ color: COLORS.border }}>|</span>
            <span style={{ color: COLORS.muted, fontSize: 13 }}>Engineering Strategy &amp; Autonomous Agent Loops</span>
          </div>
          {/* Group tabs */}
          <div style={{ display: "flex", gap: 0, marginTop: 14, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            {TAB_GROUPS.map(g => (
              <button
                key={g.id}
                onClick={() => groupTab(g.id)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: `2px solid ${activeGroup.id === g.id ? COLORS.amber : "transparent"}`,
                  color: activeGroup.id === g.id ? COLORS.amber : COLORS.muted,
                  padding: "8px 14px",
                  fontSize: 13,
                  fontWeight: activeGroup.id === g.id ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "Inter, sans-serif",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  letterSpacing: "0.01em",
                }}
              >{g.label}</button>
            ))}
          </div>

          {/* Section tabs (hidden for single-item groups) */}
          {activeGroup.items.length > 1 && (
            <div style={{ display: "flex", gap: 0, marginTop: 2, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              {activeGroup.items.map(i => tabButton(i.id, i.label, tab === i.id))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "24px 20px 60px" }}>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}>
              <LoopAnimSVG />
              <div style={{ textAlign: "center" }}>
                <div style={{ color: COLORS.muted, fontFamily: "JetBrains Mono, monospace", fontSize: 11, letterSpacing: "0.1em", marginBottom: 8 }}>BORIS CHERNY · HEAD OF CLAUDE CODE</div>
                <div style={{
                  color: COLORS.text,
                  fontSize: 22,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  letterSpacing: "-0.02em",
                }}>
                  "I don't prompt Claude anymore.<br />
                  <span style={{ color: COLORS.amber }}>My job is to write loops."</span>
                </div>
              </div>
            </div>

            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ color: COLORS.sky, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>THE SHIFT</div>
              {[
                { era: "Phase 1", label: "Autocomplete", desc: "Inline suggestions, you stay in control of every line", color: COLORS.muted },
                { era: "Phase 2", label: "Direct prompting", desc: "You write a task, Claude returns code, you review", color: COLORS.muted },
                { era: "Phase 3", label: "Parallel instances", desc: "Multiple Claude sessions, you prompt each, read outputs", color: COLORS.muted },
                { era: "Phase 4", label: "Loop engineering", desc: "Systems that prompt Claude, evaluate output, decide next step — you design the system", color: COLORS.amber },
              ].map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 3 ? 12 : 0, alignItems: "flex-start" }}>
                  <div style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: 10,
                    color: p.era === "Phase 4" ? COLORS.amber : COLORS.border,
                    minWidth: 60,
                    paddingTop: 2,
                  }}>{p.era}</div>
                  <div>
                    <div style={{ color: p.color, fontWeight: 600, fontSize: 13 }}>{p.label}</div>
                    <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: COLORS.surface2, border: `1px solid ${COLORS.amber}33`, borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>HONEST VERSION OF THE CLAIM</div>
              <p style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.7 }}>
                Cherny didn't skip prompting — he moved it up a level. The loops only work because he spent the prior year writing CLAUDE.md files, skill definitions, and loop specifications that encode his judgment. That groundwork is still prompting, just turned into something reusable instead of typed fresh each time.
              </p>
              <div style={{ marginTop: 10, fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: COLORS.amber }}>
                The unit of work moved: individual prompt → system that generates prompts
              </div>
            </div>

            {/* Stats bar */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
              {[
                { n: "69", label: "Library loops", color: COLORS.amber },
                { n: "8", label: "Named patterns", color: COLORS.sky },
                { n: "8", label: "Failure modes", color: COLORS.rose },
                { n: "12", label: "Tabs of content", color: COLORS.emerald },
              ].map(s => (
                <div key={s.label} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ color: s.color, fontFamily: "monospace", fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{s.n}</div>
                  <div style={{ color: COLORS.muted, fontSize: 10, marginTop: 4, lineHeight: 1.3 }}>{s.label}</div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* CLAUDE BASICS TAB */}
        {tab === "basics" && <ClaudeBasics />}

        {/* BUILDING BLOCKS TAB */}
        {tab === "blocks" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ color: COLORS.muted, fontSize: 13, marginBottom: 6, lineHeight: 1.6 }}>
              Every loop that's running in production shares these six components. The piece that goes missing most often: something that can actually say <span style={{ color: COLORS.rose, fontFamily: "JetBrains Mono, monospace" }}>no</span> — an external verifier, not the model grading itself.
            </div>
            {BLOCKS.map(b => (
              <BlockCard
                key={b.id}
                block={b}
                expanded={expandedBlock === b.id}
                onToggle={() => setExpandedBlock(expandedBlock === b.id ? null : b.id)}
              />
            ))}
          </div>
        )}

        {/* PATTERNS TAB */}
        {tab === "patterns" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ color: COLORS.muted, fontSize: 13, marginBottom: 6, lineHeight: 1.6 }}>
              Tap any pattern to see trigger, action, stop condition, and human gate. Sorted from simplest to most guarded.
            </div>
            {PATTERNS.map(p => <PatternCard key={p.id} p={p} />)}
          </div>
        )}

        {/* LOOP LIBRARY TAB */}
        {tab === "library" && <LoopLibrary />}

        {/* PRACTICAL GUIDE TAB */}
        {tab === "guide" && <PracticalGuide />}

        {/* ARCHITECTURE TAB */}
        {tab === "oreilly" && <OReillyRadarTab />}

        {/* GRAPH ENGINEERING TAB */}
        {tab === "graphs" && <GraphEngineeringTab />}

        {/* LOOP DESIGN TAB */}
        {tab === "addy" && <AddyOsmani />}

        {/* COMMANDS TAB */}
        {tab === "commands" && <CommandsRef />}

        {/* REAL WORLD TAB */}
        {tab === "realworld" && <RealWorld />}

        {/* START HERE TAB */}
        {tab === "start" && <StartHere />}

      </div>
    </div>
  );
}

export default LoopEngineeringTab;
