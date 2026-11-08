// Planning & Beads — Markdown plan creation, multi-model synthesis, iterative refinement,
// plan-to-beads conversion, bead polishing, convergence detection, and the Idea-Wizard.
// Content sanitized: external author names, site references, and CTAs removed.

export const TRACK_OVERVIEW = {
  audience: "Engineers who want to master the planning-heavy phase of the Agentic Coding Flywheel: from rough concept to polished, swarm-ready beads.",
  prerequisites: "Familiarity with the Agent Flywheel overview (9-step workflow).",
  pacing: "6 sub-tabs, ~20 minutes to cover.",
  outcomes: [
    "Create an initial markdown plan with a frontier model and assemble a foundation bundle.",
    "Run multi-model synthesis and iterative refinement to reach 3,000–6,000+ line plans.",
    "Convert a markdown plan into self-contained beads with dependency graphs.",
    "Polish beads to convergence and detect when to stop.",
    "Use the Idea-Wizard pipeline for adding features to existing projects.",
  ],
};

export const FOUNDATION_BUNDLE = [
  "Tech stack decision",
  "Initial architectural direction",
  "A strong AGENTS.md file bootstrapped from a known-good template",
  "Up-to-date best-practices guides for the chosen stack",
  "Enough product and workflow explanation for models to understand what 'good' looks like",
];

export const MULTI_MODEL_SYNTHESIS = `I asked 3 competing LLMs to do the exact same thing and they came up with pretty different plans which you can read below. I want you to REALLY carefully analyze their plans with an open mind and be intellectually honest about what they did that's better than your plan. Then I want you to come up with the best possible revisions to your plan that artfully and skillfully blends the "best of all worlds" to create a true, ultimate, superior hybrid version of the plan that best achieves our stated goals and will work the best in real-world practice.`;

export const INTEGRATE_SYNTHESIS = `OK, now integrate these revisions to the markdown plan in-place; use ultrathink and be meticulous. At the end, you can tell me which changes you wholeheartedly agree with, which you somewhat agree with, and which you disagree with:

[Pasted synthesis output]`;

export const PLAN_REFINEMENT = `Carefully review this entire plan for me and come up with your best revisions in terms of better architecture, new features, changed features, etc. to make it better, more robust/reliable, more performant, more compelling/useful, etc.

For each proposed change, give me your detailed analysis and rationale/justification for why it would make the project better along with the git-diff style changes relative to the original markdown plan shown below:

<PASTE YOUR EXISTING COMPLETE PLAN HERE>`;

export const OVERSHOOT_MISMATCH = `Do this again, and actually be super super careful: can you please check over the plan again and compare it to all that feedback I gave you? I am positive that you missed or screwed up at least 80 elements of that complex feedback.`;

export const PLAN_TO_BEADS = `OK so please take ALL of that and elaborate on it more and then create a comprehensive and granular set of beads for all this with tasks, subtasks, and dependency structure overlaid, with detailed comments so that the whole thing is totally self-contained and self-documenting (including relevant background, reasoning/justification, considerations, etc.-- anything we'd want our "future self" to know about the goals and intentions and thought process and how it serves the over-arching goals of the project.) Use only the bead tool to create and modify the beads and add the dependencies. Use ultrathink.`;

export const BEAD_POLISHING = `Reread AGENTS.md so it's still fresh in your mind. Check over each bead super carefully-- are you sure it makes sense? Is it optimal? Could we change anything to make the system work better for users? If so, revise the beads. It's a lot easier and faster to operate in "plan space" before we start implementing these things!

DO NOT OVERSIMPLIFY THINGS! DO NOT LOSE ANY FEATURES OR FUNCTIONALITY!

Also, make sure that as part of these beads, we include comprehensive unit tests and e2e test scripts with great, detailed logging so we can be sure that everything is working perfectly after implementation. Remember to ONLY use the bead tool to create and modify the beads and to add the dependencies to beads. Use ultrathink.`;

export const FRESH_EYES_BEADS = `We recently transformed a markdown plan file into a bunch of new beads. I want you to very carefully review and analyze these using the bead viewer. Check over each bead super carefully-- are you sure it makes sense? Is it optimal? Could we change anything to make the system work better for users? If so, revise the beads. Use ultrathink.`;

export const BEAD_DEDUP = `Reread AGENTS.md so it's still fresh in your mind. Check over ALL open beads. Make sure none of them are duplicative or excessively overlapping... try to intelligently and cleverly merge them into single canonical beads that best exemplify the strengths of each.`;

export const IDEA_WIZARD = `Come up with 30 ideas for improvements, enhancements, new features, or fixes for this project. Then winnow to your VERY best 5 and explain why each is valuable.`;

export const CONVERGENCE_PHASES = [
  { phase: "Major Fixes", rounds: "1–3", character: "Wild swings, fundamental changes" },
  { phase: "Architecture", rounds: "4–7", character: "Interface improvements, boundary refinements" },
  { phase: "Refinement", rounds: "8–12", character: "Edge cases, nuanced handling" },
  { phase: "Polishing", rounds: "13+", character: "Converging to steady state" },
];

export const CONVERGENCE_SIGNALS = [
  { signal: "Agent responses getting shorter", meaning: "Less new ground to cover" },
  { signal: "Rate of change decelerating", meaning: "Diminishing returns kicking in" },
  { signal: "Successive rounds more similar", meaning: "Approaching steady state" },
  { signal: "Weighted convergence score 0.75+", meaning: "Ready to finalize" },
  { signal: "Weighted convergence score 0.90+", meaning: "Hitting diminishing returns" },
];

export const IDEA_WIZARD_STEPS = [
  { step: "1", title: "Ground in reality", body: "Read AGENTS.md and list all existing beads. This prevents creating duplicates." },
  { step: "2", title: "Generate 30, winnow to 5", body: "The agent brainstorms 30 ideas, then self-selects the best 5 with justification." },
  { step: "3", title: "Expand to 15", body: "Prompt: 'ok and your next best 10 and why.' The agent produces ideas 6-15." },
  { step: "4", title: "Human review", body: "You review the 15 ideas and select which to pursue." },
  { step: "5", title: "Turn into beads", body: "Selected ideas become beads with full descriptions, dependencies, and priority levels." },
  { step: "6", title: "Refine 4-5 times", body: "The same polishing loop as above." },
];

export const BEAD_AS_EXECUTABLE_MEMORY = [
  { principle: "Self-contained", detail: "Beads must be so detailed that you never need to refer back to the original markdown plan." },
  { principle: "Rich content", detail: "Beads can and should contain long descriptions with embedded markdown. They don't need to be short bullet-point entries." },
  { principle: "Complete coverage", detail: "Everything from the markdown plan must be embedded into the beads. Lose nothing in the conversion." },
  { principle: "Explicit dependencies", detail: "The dependency graph must be correct; this is what enables the router to compute the optimal execution order." },
  { principle: "Include testing", detail: "Beads should include comprehensive unit tests and e2e test scripts with great, detailed logging." },
];

export const BEAD_CLI_REFERENCE = [
  { cmd: "br create \"Upload pipeline\"", desc: "Create task" },
  { cmd: "br update <id> --desc \"...\"", desc: "Update description" },
  { cmd: "br close <id> --reason \"Completed\"", desc: "Close task" },
  { cmd: "br dep add <id> <other-id>", desc: "Add dependency" },
  { cmd: "br comments add <id> \"Found root...\"", desc: "Add comment" },
  { cmd: "br sync --flush-only", desc: "Export to JSONL (no git ops)" },
  { cmd: "br ready", desc: "Show only unblocked work" },
];

export const BEAD_POLISHING_RED_FLAGS = [
  { flag: "Oscillation", meaning: "Alternating between two versions", action: "Reframe the problem" },
  { flag: "Expansion", meaning: "Output growing instead of shrinking", action: "Step back" },
  { flag: "Plateau at low quality", meaning: "Stuck without progress", action: "Kill the current approach and restart fresh" },
];
