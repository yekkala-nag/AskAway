/**
 * Spec-Driven Development — per-lesson hero image prompts.
 *
 * Eight illustrations, one per lesson, rendered via OpenAI images/generations
 * (scripts/gen-specdriven-images.mjs reads OPENAI_API_KEY from the environment
 * at run time; no key is stored in this file or committed to the repo).
 *
 * Style: clean technical diagrams, white/dark-theme friendly, JetBrains Mono
 * labels where text is needed. No logos, no signatures, no watermarks.
 */

export const LESSON_IMAGES = [
  {
    lesson: 1,
    id: "lesson-1",
    title: "From Vibe Coding to Specs",
    prompt:
      "A split-screen technical diagram: left side labeled 'Vibe coding' shows a messy, tangled block of spaghetti code with question marks; right side labeled 'Spec-driven development' shows a clean, ordered stack of documents connected by arrows to clean code. Dark mode, navy background, cyan accents, JetBrains Mono labels, no photorealistic faces.",
  },
  {
    lesson: 2,
    id: "lesson-2",
    title: "Anatomy of a Spec",
    prompt:
      "A labeled callout box diagram of a software specification: sections titled 'Context and goal', 'Users and scenarios', 'Requirements', 'Acceptance criteria', 'Out of scope', 'Constraints', 'Open questions'. Isometric layout, dark surface, teal headings, JetBrains Mono labels.",
  },
  {
    lesson: 3,
    id: "lesson-3",
    title: "The SDD Workflow",
    prompt:
      "A horizontal seven-stage loop diagram: Intent -> Spec -> Plan -> Tasks -> Implement -> Verify -> Update spec -> back to Intent, with curved arrows and small gate icons between stages. Dark mode, cyan flow lines, JetBrains Mono stage labels.",
  },
  {
    lesson: 4,
    id: "lesson-4",
    title: "Writing Specs Agents Can Use",
    prompt:
      "A table of EARS requirement patterns: Ubiquitous / Event-driven / State-driven / Unwanted behavior / Optional feature, each row a card with its sentence template. Dark mode, lavender accents, JetBrains Mono text.",
  },
  {
    lesson: 5,
    id: "lesson-5",
    title: "Plans and Task Lists",
    prompt:
      "A checklist-style task list card: tasks with requirement IDs (R1-R5), done-check icons, and dependency arrows between ordered steps. Dark mode, gold accents, JetBrains Mono labels.",
  },
  {
    lesson: 6,
    id: "lesson-6",
    title: "Implementing and Verifying",
    prompt:
      "A diff-review visualization: left pane shows code diff with green added / red removed lines, right pane maps each change to requirement IDs with checkmarks. Dark mode, coral and teal accents, JetBrains Mono.",
  },
  {
    lesson: 7,
    id: "lesson-7",
    title: "The Tool Landscape",
    prompt:
      "Five tool cards in a row: GitHub Spec Kit, Kiro (AWS), OpenSpec, BMAD-METHOD, Plain markdown + rules file, each with a one-line description. Dark mode, gradient pastel accents, JetBrains Mono.",
  },
  {
    lesson: 8,
    id: "lesson-8",
    title: "Brownfield, Pitfalls and Judgment",
    prompt:
      "Two panels: top shows 'Working in existing code' as a delta arrow from old code to new spec; bottom lists seven pitfall warning icons (spec bloat, stale specs, waterfall relapse, etc.). Dark mode, coral accents, JetBrains Mono.",
  },
];
