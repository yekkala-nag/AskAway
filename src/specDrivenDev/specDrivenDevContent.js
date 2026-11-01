/**
 * Spec-Driven Development: Elective Track — content data
 * 8 lessons + capstone, extracted from the course document.
 */

export const TRACK_OVERVIEW = {
  audience:
    "Developers and learners who already use an AI coding assistant and want reliable, reviewable results instead of prompt-and-pray output.",
  prerequisites:
    "Basic programming, some hands-on use of an AI coding agent (chat, IDE or CLI), and the core course modules on prompt engineering and agents.",
  outcomes: [
    "Explain why vibe coding stops scaling and what spec-driven development (SDD) changes.",
    "Write a spec an agent can implement and a human can verify.",
    "Run the SDD loop: intent → spec → plan → tasks → implement → verify → update the spec.",
    "Apply the loop with any agent, and map it to tools such as GitHub Spec Kit, Kiro and OpenSpec.",
    "Adapt SDD to existing (brownfield) codebases and know when not to use it.",
  ],
  pacing: "Each lesson is a 20 to 30 minute read plus a 30 to 60 minute exercise. The capstone is one to two days.",
};

export const LESSON_MAP = [
  { n: "1", lesson: "From Vibe Coding to Specs", core: "Why unstated requirements cause drift" },
  { n: "2", lesson: "Anatomy of a Spec", core: "What goes in, what stays out" },
  { n: "3", lesson: "The SDD Workflow", core: "The seven-stage loop and its gates" },
  { n: "4", lesson: "Writing Specs Agents Can Use", core: "Acceptance criteria, EARS, ambiguity hunting" },
  { n: "5", lesson: "Plans and Task Lists", core: "Turning a spec into small, verifiable steps" },
  { n: "6", lesson: "Implementing and Verifying", core: "Agent runs, tests, review gates" },
  { n: "7", lesson: "Tool Landscape", core: "One workflow, many tools" },
  { n: "8", lesson: "Brownfield, Pitfalls and Judgment", core: "Real codebases, failure modes, when to skip" },
  { n: "C", lesson: "Capstone", core: "Ship a feature end to end" },
];

export const LESSONS = [
  {
    id: "l1",
    n: 1,
    title: "From Vibe Coding to Specs",
    icon: "🎸",
    objectives: [
      "Define vibe coding and SDD.",
      "Identify the failure modes of freeform prompting.",
      "Decide where each approach fits.",
    ],
    sections: [
      {
        heading: "What vibe coding is",
        body: [
          "Vibe coding means describing what you want in loose natural language, letting the AI generate code, and steering by feel: run it, see what breaks, prompt again. For a throwaway prototype, a landing page or a script you will run once, it is fast and genuinely fun.",
        ],
      },
      {
        heading: "Why it stops scaling",
        body: [
          "The agent is not careless. It is guessing at everything you did not say. Every unstated requirement becomes a coin flip:",
        ],
        bullets: [
          "Hidden requirements: error handling, permissions, data limits, accessibility, edge cases.",
          "Drift: each new prompt changes things the last prompt got right, because nothing records what \"right\" means.",
          "No memory of intent: a new chat or a new teammate has only the code, not the reasons behind it.",
          "Unreviewable output: you can read 800 lines of generated code, but you cannot tell whether it matches an intent that was never written down.",
          "Compounding rework: problems found in code review or production cost far more to fix than problems caught in a requirements paragraph.",
        ],
      },
      {
        heading: "The SDD idea in one sentence",
        body: [
          "Spec-driven development means writing a structured specification of what to build before code is generated, then driving the agent through a plan, task list and implementation that all trace back to that spec. The spec is the source of truth; code is an output.",
          "This is not a return to heavyweight waterfall documents. The spec is short, lives in the repository next to the code, is written in plain language, and is updated as you learn. The agent does the typing; you own the intent.",
        ],
      },
      {
        heading: "A spectrum, not a switch",
        body: ["Spec-driven practice comes in levels of rigor:"],
        bullets: [
          "Spec-first: write the spec before coding, then mostly discard it. Lightest touch.",
          "Spec-anchored: keep the spec and update it as the feature evolves.",
          "Spec-as-source: the spec is the primary artifact and code is regenerated from it. The most ambitious, and still emerging.",
          "Most teams today live at levels 1 and 2. This track teaches level 2.",
        ],
      },
    ],
    exercise:
      "Take a recent feature you vibe-coded. List five requirements you had in your head that you never typed into a prompt. How many did the agent get right by luck?",
    takeaway:
      "Vibe coding fails through unstated requirements, not weak models. A spec makes intent explicit, durable and checkable.",
  },
  {
    id: "l2",
    n: 2,
    title: "Anatomy of a Spec",
    icon: "🧩",
    objectives: [
      "List the parts of a good spec.",
      "Separate what/why from how.",
      "Recognize a weak spec.",
    ],
    sections: [
      {
        heading: "What a spec is (and is not)",
        body: [
          "A spec describes behavior and intent: what the system should do, for whom, under which rules, and how you will know it works. It is not an implementation plan, not a design essay, and not a pile of pseudo-code.",
        ],
      },
      {
        heading: "Spec vs. plan",
        body: [
          "Spec: what and why (stable, reviewed by humans who own the product).",
          "Plan: how (architecture, libraries, data model; reviewed by engineers).",
          "Tasks: in what order (small steps the agent executes).",
          "Keeping these apart matters. If you mix in implementation details too early, you lock in decisions before you understand the problem. If you leave out the intent, the agent invents it.",
        ],
      },
      {
        heading: "A weak spec versus a strong one",
        body: [
          "Weak: \"Add user login with good security.\"",
          "Strong: \"Users sign in with email and password. After five failed attempts in ten minutes, the account is locked for fifteen minutes and the user is told how long to wait. Passwords are never logged. Out of scope: social login, MFA.\"",
          "The strong version can be tested line by line. The weak version can only be argued about.",
        ],
      },
    ],
    exercise:
      "Rewrite this vague request as a one-page spec: \"Add a dashboard that shows my team's tasks.\" Mark at least three open questions.",
    takeaway:
      "A spec is testable behavior plus explicit scope. If you cannot write a pass/fail check for a line, it is not specific enough yet.",
  },
  {
    id: "l3",
    n: 3,
    title: "The SDD Workflow",
    icon: "🔁",
    objectives: [
      "Run the seven-stage loop.",
      "Place human review gates where they pay off.",
      "Know what each stage produces.",
    ],
    sections: [
      {
        heading: "The loop",
        body: ["Intent → Spec → Plan → Tasks → Implement → Verify → Update spec → (back to Intent)"],
      },
      {
        heading: "Where to spend your attention",
        body: [
          "The highest-leverage reviews are early: spec and plan. A one-line fix to a spec is cheaper than rewriting a module. Treat the spec and plan gates as the real code review, and the diff review as the confirmation.",
        ],
      },
      {
        heading: "Rules of the loop",
        body: [],
        bullets: [
          "Never ask the agent to implement something that is not in the spec.",
          "If implementation reveals a gap, stop, fix the spec, then continue. Do not patch silently in code.",
          "One task per agent run, one reviewable diff per task.",
          "The spec ships in the same pull request as the code.",
        ],
      },
    ],
    exercise:
      "Draw the loop for a feature you plan to build. Mark the two gates where a wrong decision would be most expensive.",
    takeaway:
      "The loop adds three cheap review points before any code exists. The spec travels with the code and is updated, not abandoned.",
  },
  {
    id: "l4",
    n: 4,
    title: "Writing Specs Agents Can Use",
    icon: "✅",
    objectives: [
      "Write acceptance criteria in testable form.",
      "Use the EARS pattern.",
      "Hunt ambiguity before the agent finds it for you.",
    ],
    sections: [
      {
        heading: "Acceptance criteria: Given / When / Then",
        body: [
          "Given a user with a valid reset link, when they submit a new password that meets the policy, then the password is updated, the link is invalidated, and the user is signed in.",
          "Each criterion should map to at least one automated test. If you cannot imagine the test, rewrite the criterion.",
        ],
      },
      {
        heading: "Ambiguity hunting",
        body: ["Before you approve a spec, ask the agent (or a teammate) to attack it:"],
        bullets: [
          "\"List every requirement that could be interpreted two ways.\"",
          "\"What edge cases and failure modes does this spec not cover?\"",
          "\"Which terms are undefined? (e.g. 'fast', 'secure', 'recent')\"",
          "\"What would you have to guess if you implemented this today?\"",
          "Treat the answers as a to-do list for the spec, not as a license for the agent to decide.",
        ],
      },
      {
        heading: "A clarification pass",
        body: [
          "A useful habit: have the agent ask you up to ten clarifying questions, answer them, and fold the answers back into the spec as explicit requirements or recorded decisions. The conversation is disposable; the spec is not.",
        ],
      },
    ],
    exercise:
      "Take your spec from Lesson 2. Convert every requirement into an EARS sentence and write a Given/When/Then for the three riskiest ones. Run an ambiguity pass and record the answers.",
    takeaway:
      "Short, uniform, testable sentences beat prose. Ambiguity found at spec time costs minutes; found at runtime, hours.",
  },
  {
    id: "l5",
    n: 5,
    title: "Plans and Task Lists",
    icon: "📋",
    objectives: [
      "Turn an approved spec into a technical plan.",
      "Break the plan into tasks an agent can finish and a human can review.",
      "Keep traceability back to the spec.",
    ],
    sections: [
      {
        heading: "The plan",
        body: ["The plan answers how, within the project rules:"],
        bullets: [
          "Architecture and where the change fits in the existing system.",
          "Data model and interfaces (APIs, events, schemas).",
          "Libraries and why (prefer what the project already uses).",
          "Risks, unknowns and spikes needed to retire them.",
          "A test strategy aligned with the acceptance criteria.",
          "Have the agent propose two options with trade-offs for any non-obvious decision, then record your choice and the reason.",
        ],
      },
      {
        heading: "Good tasks",
        body: ["A good task is:"],
        bullets: [
          "Small: one concern, one reviewable diff, ideally under an hour of human review.",
          "Independent or clearly ordered: dependencies are stated.",
          "Verifiable: has a done-check (a test, a command, an observable behavior).",
          "Traceable: references the requirement it satisfies.",
        ],
      },
      {
        heading: "Parallelism",
        body: [
          "Independent tasks can run in parallel agent sessions, each on its own branch or worktree. Dependent tasks run in order. Write the dependency in the task list instead of hoping the agent infers it.",
        ],
      },
    ],
    exercise:
      "Generate a plan and task list from your Lesson 4 spec. Delete or split any task you cannot review in one sitting. Add a done-check and a requirement ID to every task.",
    takeaway:
      "Small, traceable, checkable tasks make agent output reviewable. The plan records decisions and reasons, not only choices.",
  },
  {
    id: "l6",
    n: 6,
    title: "Implementing and Verifying",
    icon: "🛠️",
    objectives: [
      "Run an agent task safely against a spec.",
      "Verify against acceptance criteria.",
      "Handle spec gaps the right way.",
    ],
    sections: [
      {
        heading: "Running a task",
        body: ["Give the agent a tight context bundle:"],
        bullets: [
          "The project rules file.",
          "The relevant spec section.",
          "The plan sections it touches.",
          "One task, with its done-check.",
          "Then instruct it: implement only this task; do not change behavior outside it; run the done-check; report what it ran and what happened.",
        ],
      },
      {
        heading: "Review the diff against the spec, not against taste",
        body: ["For each diff ask:"],
        bullets: [
          "Does every changed behavior trace to a requirement?",
          "Is there behavior that is not in the spec? (Scope creep: remove it or add it to the spec deliberately.)",
          "Do the tests assert the acceptance criteria, or only whatever the code happens to do?",
          "Did the agent touch files unrelated to the task?",
        ],
      },
      {
        heading: "When implementation exposes a gap",
        body: ["This will happen. The correct response is a loop, not a patch:"],
        bullets: [
          "Stop the task.",
          "Update the spec (or record an open question) with the new decision.",
          "Adjust the plan and tasks if needed.",
          "Resume.",
          "If you let the code absorb the decision silently, the spec stops being the truth and you are back to vibe coding with extra paperwork.",
        ],
      },
      {
        heading: "Keep the spec current",
        body: [
          "After verification, diff the behavior against the spec and update either one. A stale spec is worse than none, because it lies confidently.",
        ],
      },
    ],
    exercise:
      "Implement two tasks from your list with an agent. For each, produce a requirement → evidence table and record one thing the spec did not anticipate.",
    takeaway:
      "One task per run, diffs reviewed against the spec, gaps resolved at the spec level. Verification maps back to acceptance criteria.",
  },
  {
    id: "l7",
    n: 7,
    title: "The Tool Landscape",
    icon: "🧰",
    objectives: [
      "Map the generic workflow onto current tools.",
      "Choose a tool by team needs.",
      "Avoid tool lock-in.",
    ],
    sections: [
      {
        heading: "One workflow, many tools",
        body: [
          "SDD is a method; tools differ in how much of it they automate. Names and features change quickly, so check each project's current documentation before adopting one.",
        ],
      },
      {
        heading: "How to choose",
        bullets: [
          "Solo or small project, any agent: start with plain markdown and a rules file. You learn the method with zero lock-in.",
          "Team standardizing across several agents: an agent-agnostic toolkit gives shared templates and consistent stages.",
          "Want enforcement inside the editor: an IDE built around specs reduces ceremony but ties the workflow to that product.",
          "Large existing codebase: prefer approaches that express changes as deltas to existing specs.",
        ],
      },
      {
        heading: "What transfers between tools",
        body: ["Good specs travel. Whatever the tool, keep these portable:"],
        bullets: [
          "Specs as plain markdown in the repository.",
          "Requirements with IDs and acceptance criteria.",
          "A rules file in plain language.",
          "Tasks with done-checks.",
          "If a tool stores your intent in a format you cannot read or export, treat that as a risk.",
        ],
      },
    ],
    exercise:
      "Pick one tool from the table and run Lesson 3's loop on a tiny feature. Then write one paragraph: what did the tool automate, and what did you still have to decide yourself?",
    takeaway:
      "The method is the durable part; tools are interchangeable scaffolding. Prefer plain, portable artifacts.",
  },
  {
    id: "l8",
    n: 8,
    title: "Brownfield, Pitfalls and Judgment",
    icon: "🏗️",
    objectives: [
      "Apply SDD to an existing codebase.",
      "Recognize failure modes.",
      "Decide when a spec is overkill.",
    ],
    sections: [
      {
        heading: "Working in an existing codebase",
        body: ["Most real work is brownfield. Adapt the loop:"],
        bullets: [
          "Capture the current behavior first. Have the agent draft a spec of how the relevant area works today, then verify it yourself. Agents infer behavior from code and can be confidently wrong.",
          "Write the change as a delta: \"Currently X; after this change, Y.\" This keeps reviews small.",
          "Respect existing patterns. Put conventions in the rules file so the agent extends the codebase instead of inventing a new style.",
          "Characterize before changing. Add tests that pin current behavior, then change it.",
        ],
      },
      {
        heading: "When not to use SDD",
        body: ["Spec-driven work has real overhead. Skip or shrink it for:"],
        bullets: [
          "Throwaway prototypes and spikes where learning is the goal.",
          "Tiny, obvious changes (a typo, a copy tweak, a one-line fix).",
          "Exploratory UI play where you need to see options to know what you want.",
          "A useful rule: the cost of a wrong guess decides how much spec you write. Low cost, vibe it. High cost (security, money, data, many users), spec it.",
        ],
      },
      {
        heading: "Vibe first, spec second",
        body: [
          "The two are not enemies. A strong pattern is to vibe-code a quick prototype to discover what you want, then write the spec from what you learned, and rebuild properly. The prototype becomes a research artifact, not the product.",
        ],
      },
    ],
    exercise:
      "Take a small module in a project you know. Draft its as-is spec with an agent, then list three statements the agent got wrong or could not know.",
    takeaway:
      "In existing code, spec the change as a delta and verify inferred behavior. Match the amount of spec to the cost of being wrong.",
  },
];

export const SDD_LOOP_STAGES = [
  { n: 1, stage: "Intent", produce: "A few sentences of goal and context", agent: "Asking clarifying questions", gate: "Is this worth building?" },
  { n: 2, stage: "Spec", produce: "Requirements, scenarios, acceptance criteria, scope", agent: "Drafting, finding ambiguity and gaps", gate: "Does this describe what we actually want?" },
  { n: 3, stage: "Plan", produce: "Architecture, data model, interfaces, risks", agent: "Proposing options with trade-offs", gate: "Is the approach sound and consistent with the codebase?" },
  { n: 4, stage: "Tasks", produce: "Ordered, small, independently checkable steps", agent: "Decomposing the plan, flagging dependencies", gate: "Is each task small enough to review?" },
  { n: 5, stage: "Implement", produce: "Code and tests, task by task", agent: "Writing code against one task at a time", gate: "Review each diff against the spec" },
  { n: 6, stage: "Verify", produce: "Passing tests, a spec-conformance check", agent: "Running tests, comparing behavior to acceptance criteria", gate: "Does behavior match every criterion?" },
  { n: 7, stage: "Update spec", produce: "Spec revised to match reality", agent: "Proposing spec edits from what was learned", gate: "Is the spec still the truth?" },
];

export const SPEC_SECTIONS = [
  { section: "Context and goal", purpose: "Why this exists, who benefits", example: "\"Let returning users reset their password without contacting support.\"" },
  { section: "Users and scenarios", purpose: "Concrete stories", example: "\"A user who forgot their password requests a reset link by email.\"" },
  { section: "Requirements", purpose: "Testable statements of behavior", example: "\"A reset link expires after 30 minutes.\"" },
  { section: "Acceptance criteria", purpose: "Pass/fail checks", example: "\"Given an expired link, when opened, then the user sees an error and can request a new one.\"" },
  { section: "Out of scope", purpose: "What you are deliberately not building", example: "\"No SMS-based reset in this version.\"" },
  { section: "Constraints", purpose: "Tech, security, performance, compliance limits", example: "\"Must reuse the existing email service.\"" },
  { section: "Open questions", purpose: "Known unknowns, to resolve before coding", example: "\"Should reset invalidate all active sessions?\"" },
];

export const EARS_PATTERNS = [
  { pattern: "Ubiquitous", template: "The system shall …", example: "The system shall hash passwords before storage." },
  { pattern: "Event-driven", template: "When event, the system shall …", example: "When a reset is requested, the system shall email a single-use link." },
  { pattern: "State-driven", template: "While state, the system shall …", example: "While an account is locked, the system shall reject sign-in attempts." },
  { pattern: "Unwanted behavior", template: "If condition, then the system shall …", example: "If the link has expired, then the system shall show an error and offer a new link." },
  { pattern: "Optional feature", template: "Where feature, the system shall …", example: "Where MFA is enabled, the system shall require a second factor." },
];

export const VERIFICATION_LAYERS = [
  { layer: "Automated tests", question: "Does it behave per criteria?", examples: "Unit, integration, end-to-end" },
  { layer: "Static checks", question: "Is it clean and safe?", examples: "Linters, type checks, dependency and secret scans" },
  { layer: "Spec conformance", question: "Is every requirement covered?", examples: "Ask the agent to produce a requirement → evidence table; you spot-check it" },
  { layer: "Human review", question: "Is it the right thing?", examples: "Read the diff, run the feature" },
];

export const TOOLS = [
  {
    name: "GitHub Spec Kit",
    style: "Open-source toolkit (CLI, templates, prompts) that works across many coding agents",
    loop: "Stages for constitution, specify, plan, tasks and implement, with spec folders in the repo",
  },
  {
    name: "Kiro (AWS)",
    style: "An IDE where specs are first-class",
    loop: "Requirements → design → tasks → implementation, with EARS-style requirements and steering files for project context",
  },
  {
    name: "OpenSpec",
    style: "Lightweight open-source spec layer for AI assistants",
    loop: "Proposes changes as spec deltas that are reviewed before implementation; suits existing codebases",
  },
  {
    name: "BMAD-METHOD",
    style: "Agent-persona-based, agile-flavored method",
    loop: "Role-specific agents (analyst, architect, developer and others) producing staged documents",
  },
  {
    name: "Plain markdown + a rules file",
    style: "No tooling",
    loop: "The folder layout from Lesson 3, with AGENTS.md or CLAUDE.md as standing instructions, and any agent",
  },
];

export const PITFALLS = [
  { pitfall: "Spec bloat", symptom: "Pages of prose nobody reads", fix: "Keep specs short; one feature per spec; cut anything untestable" },
  { pitfall: "Waterfall relapse", symptom: "Months of specs before code", fix: "Spec in small slices; ship a feature at a time" },
  { pitfall: "Stale specs", symptom: "Spec and code disagree", fix: "Update specs in the same PR; make spec updates a review item" },
  { pitfall: "Implementation leakage", symptom: "Spec dictates code structure", fix: "Move how-details to the plan" },
  { pitfall: "Rubber-stamping", symptom: "Approving agent-written specs unread", fix: "The human owns the gates; read what you approve" },
  { pitfall: "Over-trusting the agent", symptom: "\"The tests pass\" taken as proof", fix: "Check that tests assert the criteria, not just the code" },
  { pitfall: "Spec as magic", symptom: "Believing a good spec guarantees good code", fix: "Specs reduce guessing; they do not replace review and testing" },
];

export const CAPSTONE = {
  goal: "Deliver one real feature using the full loop, with artifacts a reviewer can audit.",
  brief:
    "Choose a feature that takes a day or two (examples: a rate-limited API endpoint, a saved-filters feature, an export-to-CSV button, a notification preference page).",
  deliverables: [
    { name: "Rules file with stack, testing and security conventions", detail: "half a page" },
    { name: "Spec with goal, scenarios, EARS requirements with IDs, Given/When/Then criteria, out-of-scope and resolved open questions", detail: "" },
    { name: "Plan with at least one decision where you compared two options and recorded the reason", detail: "" },
    { name: "Task list with requirement IDs and done-checks", detail: "" },
    { name: "Implementation via an agent, one task per run, with tests tied to criteria", detail: "" },
    { name: "Conformance table mapping every requirement to evidence", detail: "" },
    { name: "Retrospective (one page): which spec gaps surfaced during implementation, how you resolved them, and what you would change in the next spec", detail: "" },
  ],
  rubric: [
    { criterion: "Spec quality", strong: "Every requirement is testable; scope is explicit", weak: "Adjectives, no out-of-scope" },
    { criterion: "Traceability", strong: "Tasks, tests and code trace to requirement IDs", weak: "Cannot tell why code exists" },
    { criterion: "Gate discipline", strong: "Gaps fixed in the spec before code continued", weak: "Decisions hidden in code" },
    { criterion: "Verification", strong: "Tests assert the criteria; evidence table complete", weak: "\"It runs on my machine\"" },
    { criterion: "Judgment", strong: "Spec size matched the risk", weak: "Over- or under-specified" },
  ],
};

export const INSTRUCTOR_NOTES = [
  { topic: "Pacing", note: "Each lesson is a 20 to 30 minute read plus a 30 to 60 minute exercise. The capstone is one to two days." },
  { topic: "Tool-agnostic delivery", note: "Teach the loop first with plain markdown. Introduce a tool in Lesson 7 only after learners have felt the manual process." },
  { topic: "Keep it current", note: "Tool features and names in Lesson 7 change quickly. Review that lesson regularly and keep the tool table separate from the method lessons so it is easy to update." },
  { topic: "Suggested placement", note: "This track works as an elective alongside the agents and coding-agent modules, after prompt engineering and basic agent concepts." },
];

export const EXAMPLE_TASKS = [
  { id: "T1", reqs: "R1, R2", text: "Create reset_tokens table and migration.", done: "migration applies and rolls back cleanly." },
  { id: "T2", reqs: "R1", text: "Token service: issue + validate, 30-min expiry.", done: "unit tests for valid/expired/reused pass." },
  { id: "T3", reqs: "R1, R3", text: "POST /reset-request endpoint + email send.", done: "integration test confirms one email per request." },
  { id: "T4", reqs: "R2", text: "POST /reset-confirm endpoint.", done: "Given/When/Then scenarios 1-3 pass." },
  { id: "T5", reqs: "R4", text: "UI: request and confirm screens with error states.", done: "all error states render as specified." },
];

export const AMBIGUITY_QUESTIONS = [
  "List every requirement that could be interpreted two ways.",
  "What edge cases and failure modes does this spec not cover?",
  "Which terms are undefined? (e.g. 'fast', 'secure', 'recent')",
  "What would you have to guess if you implemented this today?",
];

export const VAGUE_VS_TESTABLE = [
  { vague: "\"Fast search\"", testable: "\"Search results return in under 300 ms for 95% of queries with 100k records.\"" },
  { vague: "\"Secure upload\"", testable: "\"Only PDF and PNG files up to 10 MB are accepted; others are rejected with an error.\"" },
  { vague: "\"Handles errors\"", testable: "\"On network failure, the app retries three times, then shows a retry button.\"" },
];

export const FILE_LAYOUT = `/specs/
  001-password-reset/
    spec.md        # what and why
    plan.md        # how
    tasks.md       # ordered steps with checkboxes
  constitution.md  # project-wide rules (stack, style, testing, security)
AGENTS.md          # standing instructions for any coding agent`;
