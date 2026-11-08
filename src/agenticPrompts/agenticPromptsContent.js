// Agentic Coding Prompts — curated, tool-agnostic teaching library.
// Entries are ready-to-use prompts for AI coding agents, each with the one-line
// verbatim query, the reason it works, and a fill-in template with <angle-bracket
// slots>. Tools named inside prompt text are kept where they change the semantics.
export const TRACK_OVERVIEW = {
  audience: "Engineers using AI coding agents (CLI or IDE) who want prompts that get reviewable, verifiable results instead of yappy guesses.",
  prerequisites: "Daily-driver experience with at least one AI coding agent; no configuration knowledge required.",
  pacing: "Browse by task, copy a verbatim prompt, then graduate to the fill-in templates. 20–30 minutes to cover.",
  outcomes: [
    "Use verbatim prompts for the most common agentic coding tasks.",
    "Explain why a specific, verifiable prompt beats a vague one.",
    "Choose the config file (AGENTS.md / rules / hooks) that fits a convention.",
    "Adapt fill-in templates to your own codebase and task."
  ]
};

export const PROMPT_STATS = { total: 122, curated: 44, categories: 18 };

export const CATEGORY_LABELS = {
  onboarding: { label: "Onboarding", color: "#5EC4C8", icon: "🧭", desc: "Get situated in an unfamiliar codebase fast." },
  search: { label: "Search & Tracing", color: "#3A9B9F", icon: "🔎", desc: "Locate code and trace execution flows." },
  debugging: { label: "Debugging", color: "#F0A89A", icon: "🐛", desc: "Reproduce, diagnose, and fix bugs." },
  refactoring: { label: "Refactoring", color: "#F0A89A", icon: "🏗️", desc: "Modernize and restructure legacy code." },
  testing: { label: "Testing", color: "#F0C674", icon: "🧪", desc: "Find gaps, write tests, run them." },
  planning: { label: "Planning", color: "#C9B8E8", icon: "🗺️", desc: "Explore first, plan, then implement." },
  "pr-git": { label: "PR & Git", color: "#5EC4C8", icon: "🔀", desc: "Create and improve pull requests." },
  review: { label: "Code Review", color: "#E8837A", icon: "🪞", desc: "Adversarial and focused review passes." },
  verification: { label: "Verification", color: "#F0C674", icon: "✅", desc: "Prove the change actually works." },
  scale: { label: "Scale Out", color: "#9B89C4", icon: "📣", desc: "Fan out across many files or sessions." },
  subagents: { label: "Subagents", color: "#C9B8E8", icon: "👥", desc: "Delegate investigation to a subagent." },
  "context-management": { label: "Context Care", color: "#C9B8E8", icon: "🧠", desc: "Keep the agent's context lean and focused." }
};

export const PROMPTS = [
  {
    "id": "cc-overview",
    "category": "onboarding",
    "tools": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "title": "Get a high-level overview",
    "prompt": "give me an overview of this codebase",
    "why": "Asking for the overview in one line gets you a README paraphrase. Naming what you want covered gets you the parts the README leaves out.",
    "template": "I'm new to this codebase. Give me an overview before I start work.\n\nCover:\n- What this project does, in two sentences\n- The main entry points, and how a request or command flows through them\n- The directory layout, and what belongs in each top-level folder\n- The key data models and where they're defined\n- Which conventions are enforced (linting, typing, test style) and where they're configured\n\nRead the README, the package manifests and the config files first. Where the code contradicts the README, say so. That's usually where the real conventions live.\n\nDon't change any files."
  },
  {
    "id": "cc-architecture",
    "category": "onboarding",
    "tools": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "title": "Ask about architecture patterns",
    "prompt": "explain the main architecture patterns used here",
    "why": "Asking which patterns are actually followed, rather than which are present, is what separates the real architecture from the one someone intended.",
    "template": "Explain the main architecture patterns used in this codebase.\n\nFor each pattern:\n- Name it, and point at two or three files where it's actually used\n- Say what problem it solves here specifically\n- Say whether it's applied consistently, or only in some parts, and if so which\n\nAlso cover:\n- How the layers are separated, and what's allowed to depend on what\n- Where the patterns break down, and whether that looks deliberate or accidental\n\nRead the code, not just the README or the folder names. If two parts of the codebase use conflicting approaches, tell me which one is newer.\n\nIf this codebase is small or plain enough that it has no real patterns to speak of, say so and describe how it's actually organised. Don't name patterns that aren't there.\n\nRead only. Don't change anything."
  },
  {
    "id": "cx-explain-flow",
    "category": "onboarding",
    "tools": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "title": "Explain the request flow, with gotchas",
    "prompt": "Explain how the request flows through the selected code.\n\nInclude:\n- a short summary of the responsibilities of each module involved\n- what data is validated and where\n- one or two \"gotchas\" to watch for when changing this",
    "why": "Naming the output shape up front is what turns a wandering explanation into something you can act on.",
    "template": "Explain how <a request> flows through <the selected code, or @path/to/file>.\n\nInclude:\n- A short summary of what each module involved is responsible for\n- What data is validated, and exactly where\n- Where errors are caught, and what happens to them\n- One or two gotchas to watch for when changing this\n\nThen give me the flow as a numbered list of steps, and list the files involved in order.\n\nRead the code rather than inferring from names. If part of the path is dynamic and you can't follow it statically, say so instead of filling the gap."
  },
  {
    "id": "cc-trace-flow",
    "category": "search",
    "tools": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "title": "Trace an execution flow end to end",
    "prompt": "trace the login process from front-end to database",
    "why": "A trace is only useful if you can tell which parts were read and which were guessed.",
    "template": "Trace <the login process> end to end, from <the front-end entry point> through to <the database>.\n\nFor each hop, tell me:\n- The file and function that handles it\n- What it receives, and what it passes on\n- Where validation, authorisation and error handling happen\n\nFinish with a numbered list of the files involved, in order.\n\nRead the code rather than inferring from names. Flag any step where the path branches, or where you're inferring rather than reading. Read only, don't change anything.\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself."
  },
  {
    "id": "cc-find-files",
    "category": "search",
    "tools": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "title": "Locate the files behind a feature",
    "prompt": "find the files that handle user authentication",
    "why": "Asking for the entry point and the tests alongside the files gives you somewhere to start reading instead of a flat list.",
    "template": "Find the files that handle <user authentication>.\n\nFor each file, give me:\n- The path\n- One line on its role in <authentication>\n- Whether it's core to the flow or peripheral\n\nThen tell me:\n- Which file is the entry point, the one I should read first\n- Where the tests for this live, or that there aren't any\n- Anything named as if it's part of this but isn't, or is dead\n\nSearch by behaviour, not just filename. Grep for the relevant calls and imports rather than trusting the directory layout.\n\nIf nothing here handles <user authentication>, say so and stop rather than offering me the nearest thing you found.\n\nRead only. Don't explain the whole flow yet, I'll ask for that next."
  },
  {
    "id": "cc-share-error",
    "category": "debugging",
    "tools": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "title": "Share the error",
    "prompt": "I'm seeing an error when I run npm test",
    "why": "Pasting the error is half the prompt. The other half is telling it to reproduce the failure before it forms a theory.",
    "template": "I'm seeing an error when I run <npm test>.\n\nHere's the output:\n```\n<paste the full error, including the stack trace>\n```\n\nContext:\n- <It started after I changed src/auth/session.ts>\n- <It fails every run / roughly one run in three>\n- <It passes on CI but fails locally, or vice versa>\n\nBefore proposing anything:\n1. Run <npm test> yourself and confirm you see the same failure\n2. Read the code the stack trace points at\n3. Tell me the root cause in one sentence\n\nDon't fix it yet, and don't guess from the message alone. If you can't reproduce it, say so and tell me what you need."
  },
  {
    "id": "cx-bug-repro",
    "category": "debugging",
    "tools": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "title": "Bug report with repro steps and constraints",
    "prompt": "Bug: Clicking \"Save\" on the settings screen sometimes shows \"Saved\" but doesn't persist the change.\n\nRepro:\n1) Start the app: npm run dev\n2) Go to /settings\n3) Toggle \"Enable alerts\"\n4) Click Save\n5) Refresh the page: the toggle resets\n\nConstraints:\n- Do not change the API shape.\n- Keep the fix minimal and add a regression test if feasible.\n\nStart by reproducing the bug locally, then propose a patch and run checks.",
    "why": "The best-structured prompt the three vendors published. Situation, evidence, guardrails, and the order of work, all declared.",
    "template": "Bug: <clicking \"Save\" on the settings screen sometimes shows \"Saved\" but doesn't persist the change>.\n\nRepro:\n1) <Start the app: npm run dev>\n2) <Go to /settings>\n3) <Toggle \"Enable alerts\">\n4) <Click Save>\n5) <Refresh the page: the toggle resets>\n\nFrequency: <intermittent, roughly one in three attempts>\nExpected: <the toggle stays on after a refresh>\n\nConstraints:\n- Do not change the API shape.\n- Keep the fix minimal, and add a regression test if feasible.\n- <Don't touch anything outside src/settings/>\n\nWork in this order:\n1. Reproduce the bug locally and confirm you've seen it fail\n2. Tell me the root cause in one sentence before patching\n3. Propose the patch\n4. Run the smallest relevant checks this repo defines, and report the commands and their results\n\nIf you cannot reproduce the bug, stop and tell me what you tried rather than patching the code you suspect.\n\nIf this repo has no test runner or no linter, say so and skip that check rather than installing one or writing a harness."
  },
  {
    "id": "cc-find-deprecated",
    "category": "refactoring",
    "tools": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "title": "Identify legacy code",
    "prompt": "find deprecated API usage in our codebase",
    "why": "A deprecation sweep is only actionable if it distinguishes what is scheduled to break from what is merely old.",
    "template": "Find deprecated API usage across this codebase.\n\nInclude:\n- Deprecated calls from our dependencies, check the changelogs and the deprecation warnings in the installed versions\n- Our own internal APIs marked deprecated in comments, annotations or docstrings\n- Patterns that still work but are superseded in the language or framework version this project targets\n\nFor each finding: the file and line, what replaces it, and whether it's scheduled to break or just discouraged.\n\nGroup by how urgent it is, not by directory. Put anything that breaks on the next major upgrade at the top.\n\nDon't change anything yet. If the codebase is large, tell me how you scoped the search and what you skipped. If you find nothing deprecated, say so plainly. An empty list is a good answer here, not a failed search."
  },
  {
    "id": "cc-suggest-refactor",
    "category": "refactoring",
    "tools": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "title": "Get refactoring recommendations",
    "prompt": "suggest how to refactor utils.js to use modern JavaScript features",
    "why": "Asking which changes are not worth making is what keeps a modernisation list from becoming a churn list.",
    "template": "Now suggest how to refactor <utils.js> to use <modern JavaScript features>, including anything from that list that lands in this file.\n\nRead the whole file first, plus a couple of its callers.\n\nFor each suggestion:\n- The current code, quoted\n- What you'd change it to\n- What it buys us: clarity, safety, fewer lines, a real bug avoided\n- Whether behaviour changes at all, including edge cases like <null, undefined and empty input>\n\nSeparate them into: worth doing, marginal, and not worth the churn. Be honest about the third group, I'd rather have a short list.\n\nDon't edit the file yet. Also tell me what our toolchain and target runtime actually support, so we don't propose something that won't build. If the file is already fine as it is, say so instead of finding three things.\n\nIf the previous step's output isn't in this conversation, stop and tell me rather than reconstructing it yourself."
  },
  {
    "id": "cc-verify-email",
    "category": "verification",
    "tools": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "title": "State the test cases up front",
    "prompt": "write a validateEmail function. example test cases: user@example.com is true, invalid is false, user@.com is false. run the tests after implementing",
    "why": "Handing over the test cases in the prompt gives the agent something to check itself against, so it stops when it's right rather than when it looks done.",
    "template": "Write a <validateEmail> function in <src/utils/validate.ts>.\n\nIt must satisfy these cases:\n- <user@example.com> → <true>\n- <invalid> → <false>\n- <user@.com> → <false>\n- <add the cases that matter in your domain>\n\nWork in this order:\n1. Write the tests from that list first\n2. Then the implementation\n3. Run the tests and iterate until they all pass\n4. Show me the final test output\n\nFollow the existing style in <src/utils/>. Don't add a validation library, <keep it dependency-free>.\n\nIf any case in my list is wrong or contradictory, tell me before implementing it.\n\nIf this repo has no test runner, stop and tell me before installing one or writing a harness."
  },
  {
    "id": "cx-unit-test",
    "category": "testing",
    "tools": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "title": "Write a test that follows existing conventions",
    "prompt": "Write a unit test for this function. Follow conventions used in other tests.",
    "why": "A test written to the codebase's own conventions gets reviewed and kept, one written in a foreign style gets rewritten.",
    "template": "Write a unit test for the selected function.\n\nInclude:\n- The happy path\n- <the boundary cases: empty, null, and the largest realistic input>\n- Any error the function is meant to raise\n\nConstraints:\n- Follow the conventions used in other tests in <tests/>. Read two of them first: same framework, same file location, same naming, same assertion style.\n- Do not add a test framework, helper library or fixture system that this repo does not already use.\n- One behaviour per test, named so the failure message is readable without opening the file.\n\nOutputs:\n- The test file\n- The command you ran and its output\n- Any case you chose not to cover, and why\n\nIf this repo has no existing tests to copy from, say so and tell me what you fell back on. If it has no test runner at all, stop and tell me before installing one."
  },
  {
    "id": "cc-explore",
    "category": "planning",
    "tools": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "title": "Explore in plan mode",
    "prompt": "read /src/auth and understand how we handle sessions and login.\nalso look at how we manage environment variables for secrets.",
    "why": "The value here is the constraint: reading without permission to edit is what stops it solving the wrong problem at speed.",
    "template": "Read <src/auth> and explain how <sessions and login> work here.\n\nBefore we change anything, I want to understand:\n- The main flow, end to end\n- Where <environment variables and secrets> are read, and how they're managed\n- Anything surprising, inconsistent, or clearly legacy\n- Which files I'd need to touch to change <this behaviour>\n\nRead only. Don't edit, don't propose a fix yet, and don't write code.\n\nWhere you're unsure, say so rather than filling the gap."
  },
  {
    "id": "cx-plan-refactor",
    "category": "planning",
    "tools": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "title": "Plan a refactor with goals and constraints",
    "prompt": "$plan\n\nWe need to refactor the auth subsystem to:\n- split responsibilities (token parsing vs session loading vs permissions)\n- reduce circular imports\n- improve testability\n\nConstraints:\n- No user-visible behavior changes\n- Keep public APIs stable\n- Include a step-by-step migration plan",
    "why": "Milestones that each leave the repo working are what make a large refactor abandonable halfway through.",
    "template": "We need to refactor <the auth subsystem> to:\n- <split responsibilities: token parsing vs session loading vs permissions>\n- <reduce circular imports>\n- <improve testability>\n\nConstraints:\n- No user-visible behaviour changes\n- Keep public APIs stable\n- Ship it in milestones, each of which leaves the repo working and its checks passing\n\nGive me a plan with:\n- Exactly which files move or change in each milestone\n- The order, and why that order\n- A rollback strategy for each milestone\n- The check that proves each milestone landed. If this repo has no automated tests, say so and tell me what to use instead.\n- What we'd measure to know the refactor achieved its goals\n\nDon't write code yet. I'll review the plan, then ask you to implement one milestone at a time."
  },
  {
    "id": "cu-mermaid",
    "category": "planning",
    "tools": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "title": "Ask for a Mermaid diagram of a subsystem",
    "prompt": "Create a Mermaid diagram showing the data flow for our authentication system, including OAuth providers, session management, and token refresh.",
    "why": "Diagrams drawn from filenames look right and teach nothing. Telling it to read the implementation first is the whole difference.",
    "template": "Create a Mermaid diagram showing <the data flow for our authentication system>, including <OAuth providers, session management and token refresh>.\n\nBefore drawing it, read the actual implementation. The diagram should reflect what the code does, not what the docs claim. If you can't find that subsystem in this codebase, say so and stop rather than diagramming a typical one.\n\nRequirements:\n- Show the sequence of calls, not just which components exist\n- Mark where state is persisted, and where it expires\n- Mark the failure paths, not only the happy path\n- Keep it readable: if it needs more than about 15 nodes, split it into two diagrams\n\nSave it to <docs/auth-flow.md>, and list anything you couldn't determine from the code."
  },
  {
    "id": "cc-pr-create",
    "category": "pr-git",
    "tools": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "title": "Generate the pull request",
    "prompt": "create a pr",
    "why": "Step two is lighter on purpose: the summary is already in context, so the prompt only needs to cover the mechanics.",
    "template": "Now create the PR, using that summary.\n\n- Title: what the change does, not which files moved\n- Description: what changed and why, what a reviewer should look at closely, and how to test it\n- Use `gh pr create`, target <main>, and give me the URL when it's open\n\nIf I'm on <main>, branch first. Commit anything uncommitted with a message that matches the summary.\n\nIf `gh` isn't installed or authenticated, or this isn't a GitHub remote, stop and tell me. Commit and push, then give me the compare URL, but don't reach for another tool on your own.\n\nDon't include the items you flagged as unrelated. If they can't be separated cleanly, stop and tell me before opening it."
  },
  {
    "id": "cc-adversarial-review",
    "category": "review",
    "tools": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "title": "Review the diff against the plan",
    "prompt": "Use a subagent to review the rate limiter diff against PLAN.md. Check that\nevery requirement is implemented, the listed edge cases have tests, and\nnothing outside the task's scope changed. Report gaps, not style preferences.",
    "why": "A reviewer told to find gaps will always find some. Telling it to report only what affects correctness is what keeps the output actionable.",
    "template": "Review <the rate limiter diff> against <PLAN.md>, in a fresh context.\n\nIf <PLAN.md> does not exist or you cannot read it, stop and tell me. Do not review against an inferred plan, and do not report an all-clear you could not verify.\n\nCheck that:\n- Every requirement in the plan is actually implemented, not just started\n- The edge cases the plan lists have tests that would fail if the behaviour regressed\n- Nothing outside the stated scope changed\n- The tests exercise real behaviour rather than asserting on mocks\n\nReport gaps that affect correctness or the stated requirements.\n\nDon't report style preferences, naming opinions, or suggestions for extra abstraction. I'll treat those as noise. If the work is sound, say so plainly rather than finding something to report."
  },
  {
    "id": "cx-review-focus",
    "category": "review",
    "tools": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "title": "Run a focused review",
    "prompt": "/review Focus on edge cases and security issues",
    "why": "Naming the categories, and asking it to say when a category is clean, is what stops a review padding itself out.",
    "template": "Review <the current diff>. Focus on edge cases and security issues.\n\nSpecifically:\n- Input that isn't validated before it's trusted\n- Authorisation checks that are missing or in the wrong place\n- Secrets, tokens or credentials that could be logged or committed\n- Boundary conditions: empty, null, very large, concurrent, repeated\n- Error paths that leak information or fail open\n\nFor each finding: the file and line, the input that triggers it, and the consequence. Rank by severity.\n\nWhere you find nothing in a category, say so rather than filling it."
  },
  {
    "id": "cc-verify-ui",
    "category": "verification",
    "tools": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "title": "Make the agent compare against the design",
    "prompt": "[paste screenshot] implement this design. take a screenshot of the result and compare it to the original. list differences and fix them",
    "why": "Screenshotting its own result and diffing it against the design is what replaces the agent's opinion that the UI looks right.",
    "template": "Implement this design in <src/components/Dashboard.tsx>.\n\nThen verify it visually, don't just tell me it's done:\n1. Run the app and take a screenshot of the result at <the same width as the design>\n2. Compare your screenshot to the original, side by side\n3. List every difference you can see: spacing, sizes, colour, weight, alignment, anything missing\n4. Fix them and repeat until the list is only things that genuinely can't be matched\n\nShow me the final screenshot and the remaining differences with a reason for each.\n\nUse <our existing components and tokens> where they fit. If you can't take a screenshot, say so rather than asserting it matches."
  },
  {
    "id": "cc-verify-root-cause",
    "category": "verification",
    "tools": [
      "claude-code",
      "codex",
      "cursor"
    ],
    "title": "Forbid suppressing the error",
    "prompt": "the build fails with this error: [paste error]. fix it and verify the build succeeds. address the root cause, don't suppress the error",
    "why": "Naming the specific evasions is what makes the ban stick, because \"fix the root cause\" alone is agreeable and unenforceable.",
    "template": "The build fails with this error:\n```\n<paste the full error output>\n```\n\nFix it, and address the root cause.\n\nBefore patching:\n- Reproduce it with <the build command> and confirm you see the same failure\n- Tell me the root cause in one sentence, and what introduced it\n\nDon't get past it by: suppressing or ignoring the error, adding <@ts-ignore, eslint-disable, a broad try/catch or a type assertion>, loosening <the compiler or lint config>, pinning a dependency backwards, or deleting the failing code.\n\nIf the honest fix is bigger than you expected, stop and tell me rather than reaching for one of those.\n\nWhen you're done, run <the build> and show me the command and the full output."
  },
  {
    "id": "cc-compact-focus",
    "category": "context-management",
    "tools": [
      "claude-code"
    ],
    "title": "Compact with a focus",
    "prompt": "/compact Focus on the API changes",
    "why": "Compaction without a focus keeps a fair summary of everything, which is rarely what you need next.",
    "template": "/compact Focus on <the API changes>.\n\nKeep, in full:\n- <The endpoints we changed and the new request and response shapes>\n- The decisions we made and the reasons, especially the ones we argued about\n- Every file we modified, by path\n- The test and build commands we've been running, verbatim\n- What's still unfinished, and what I asked for next\n\nDrop:\n- <The exploration of the old auth code>\n- Tool output we already acted on, and anything we tried and abandoned\n\nAfter compacting, tell me in a few lines what you kept and what you dropped, so I can correct you before we carry on rather than discovering the gap later."
  },
  {
    "id": "cc-fanout-list",
    "category": "scale",
    "tools": [
      "claude-code"
    ],
    "title": "Generate the task list first",
    "prompt": "list all 2,000 Python files that need migrating and save the list to files.txt",
    "why": "The list is a real artefact: it makes the batch resumable, reviewable, and countable before you spend anything running it.",
    "template": "List all <Python files that need migrating> and save the list to <files.txt>.\n\nInclusion rules:\n- <Files under src/ that import the legacy module>\n- Exclude <tests, generated files, vendored code, and anything under migrations/>\n- One path per line, relative to the repo root, no other text in the file\n\nSort by <smallest first>, so the early runs are the cheap ones.\n\nThen report back, separately from the file:\n- The total count\n- <5 to 10> files you'd call risky or unusual, and why\n- Anything you weren't sure whether to include\n\nDon't migrate anything yet. I want to read the list and check the count is plausible before it gets fed into a loop. If nothing matches the rules, write an empty file and tell me the count is zero rather than loosening them to find something."
  },
  {
    "id": "cc-subagent-investigate",
    "category": "subagents",
    "tools": [
      "claude-code"
    ],
    "title": "Delegate an investigation",
    "prompt": "use a subagent to investigate how our auth system handles token refresh",
    "why": "A subagent has its own context window, so the win is that the reading happens somewhere other than your session.",
    "template": "Use a subagent to investigate how <our auth system handles token refresh>.\n\nHave it read widely: <src/auth>, the callers, the tests, and the git history where the behaviour is unclear.\n\nReport back only:\n- How it works now, in a short summary\n- The specific files and functions, with line numbers\n- Where the refresh can fail, and what happens to the user when it does\n- Anything that would trap someone changing this\n\nKeep the file reads in the subagent context. I want the findings, not the transcript.\n\nRead only, no edits. If the subagent couldn't determine something, say so rather than filling the gap with a plausible answer."
  }
];

export const WEAK_STRONG_PAIRS = [
  {
    "id": "cc-verify-email",
    "title": "State the test cases up front",
    "weak": "implement a function that validates email addresses",
    "strong": "write a validateEmail function. example test cases: user@example.com is true, invalid is false, user@.com is false. run the tests after implementing",
    "why": "Handing over the test cases in the prompt gives the agent something to check itself against, so it stops when it's right rather than when it looks done."
  },
  {
    "id": "cc-describe-symptom",
    "title": "Symptom, likely location, and what fixed looks like",
    "weak": "fix the login bug",
    "strong": "users report that login fails after session timeout. check the auth flow in src/auth/, especially token refresh. write a failing test that reproduces the issue, then fix it",
    "why": "A failing test written before the fix is what stops the agent declaring victory on a symptom it merely hid."
  },
  {
    "id": "cc-verify-root-cause",
    "title": "Forbid suppressing the error",
    "weak": "the build is failing",
    "strong": "the build fails with this error: [paste error]. fix it and verify the build succeeds. address the root cause, don't suppress the error",
    "why": "Naming the specific evasions is what makes the ban stick, because \"fix the root cause\" alone is agreeable and unenforceable."
  },
  {
    "id": "cc-verify-ui",
    "title": "Make the agent compare against the design",
    "weak": "make the dashboard look better",
    "strong": "[paste screenshot] implement this design. take a screenshot of the result and compare it to the original. list differences and fix them",
    "why": "Screenshotting its own result and diffing it against the design is what replaces the agent's opinion that the UI looks right."
  }
];

export const CONFIG_ROWS = [
  {
    "file": "~/.codex/AGENTS.md",
    "scope": "Global — every project, for this machine",
    "example": "## Working agreements\n\n- Always run `npm test` after modifying JavaScript files.\n- Prefer `pnpm` when installing dependencies.\n- Ask for confirmation before adding new production dependencies."
  },
  {
    "file": "AGENTS.md",
    "scope": "Repo root — looked up from the working directory upward",
    "example": "## Repository expectations\n\n- Run `npm run lint` before opening a pull request.\n- Document public utilities in `docs/` when you change behavior."
  },
  {
    "file": "services/payments/AGENTS.override.md",
    "scope": "Nested directory — overrides repo rules inside that subtree",
    "example": "## Payments service rules\n\n- Use `make test-payments` instead of `npm test`.\n- Never rotate API keys without notifying the security channel."
  },
  {
    "file": ".cursor/rules/ (alwaysApply: true)",
    "scope": "Cursor rule attached to every request",
    "example": "---\nalwaysApply: true\n---\n\n- All source files must include the company copyright header\n- When you are unsure about implementation details, read the relevant\n  source files before proposing changes\n- Never modify generated files in the `dist/` or `build/` directories"
  },
  {
    "file": ".cursor/rules/ (globs: src/components/**/*.tsx)",
    "scope": "Cursor rule auto-attached when matching files are touched",
    "example": "---\nglobs: src/components/**/*.tsx\nalwaysApply: false\n---\n\n- Use named exports, not default exports\n- Co-locate styles in a module CSS file next to the component\n- Keep components under 200 lines. Extract subcomponents into the same\n  directory when a file grows beyond that\n- Prefer composition over prop drilling. Pass children or render props\n  instead of threading data through multiple layers"
  },
  {
    "file": ".cursor/rules/ (description: …)",
    "scope": "Cursor rule the agent selects when the task matches its description",
    "example": "---\ndescription: RPC service conventions and patterns for the backend\nalwaysApply: false\n---\n\n- Define each service in its own file under `src/services/`\n- Always validate inputs at the service boundary before passing data\n  to internal functions\n- Return structured error objects with a `code` and `message` field,\n  never throw raw strings\n- Add a `@service-template.ts` reference file when creating a new\n  service for the standard boilerplate"
  },
  {
    "file": ".cursor/hooks.json (stop hook)",
    "scope": "Runs a command when the agent finishes responding",
    "example": "{\n  \"version\": 1,\n  \"hooks\": {\n    \"stop\": [{ \"command\": \"bun run .cursor/hooks/grind.ts\" }]\n  }\n}"
  }
];
