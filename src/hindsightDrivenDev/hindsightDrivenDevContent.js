export const TRACK_OVERVIEW = {
  audience: "Software engineers and AI practitioners moving from vibe coding to systematic experimentation and hindsight-driven validation.",
  prerequisites: "Basic programming experience, familiarity with prompt engineering and rapid prototyping.",
  pacing: "Self-paced interactive lesson with worked examples and AI simulation sandbox.",
  outcomes: [
    "Explain the core idea behind HDD in your own words.",
    "Walk through the HDD loop and apply it to a small feature.",
    "Compare HDD with TDD, Agile, and vibe coding.",
    "Decide when HDD is a good fit and when it isn't."
  ]
};

export const LESSON_MAP = [
  { n: "01", lesson: "The Big Idea", core: "Foresight vs. Hindsight: predicting what's right is hard, recognizing what's wrong is easy." },
  { n: "02", lesson: "The HDD Loop", core: "Intent → Build rough version → Observe reactions → Codify tests → Generate spec last." },
  { n: "03", lesson: "The Five Rules", core: "Grow specs from corrections, build before you agree, turn fixes into tests, inherit safety upfront." },
  { n: "04", lesson: "Comparison & Spectrum", core: "Contrasting HDD with TDD, Agile, and Vibe Coding." },
  { n: "05", lesson: "Worked Example", core: "Building a customer refund chatbot using hindsight observation and codified rules." },
  { n: "06", lesson: "When to Use HDD", core: "Identifying good fit (prototyping, UX) vs poor fit (regulated infrastructure)." },
  { n: "07", lesson: "Practice Exercise", core: "Apply the HDD loop to a to-do list with reminders." },
  { n: "08", lesson: "Quick Check & Quiz", core: "Test your understanding of HDD concepts." }
];

export const HDD_LOOP_STAGES = [
  {
    step: "01",
    name: "Start with Intent",
    desc: "One sentence, not a requirements document. Give the AI or prototype the core direction.",
    example: "Intent: 'A chatbot that helps customers request refunds.'"
  },
  {
    step: "02",
    name: "Build a Rough Version",
    desc: "Use AI or rapid prototyping to get a working draft instantly. Speed over polish.",
    example: "AI generates a working chatbot interface in 15 minutes."
  },
  {
    step: "03",
    name: "Observe and Correct",
    desc: "Put it in front of users or stakeholders. Collect real reactions ('this workflow is confusing').",
    example: "Tester: 'It offered a refund before I finished explaining the problem.'"
  },
  {
    step: "04",
    name: "Codify Corrections",
    desc: "Turn checkable corrections into automated tests. Vague feedback stays as notes in the spec.",
    example: "Test: The bot must not offer a refund until the issue is confirmed."
  },
  {
    step: "05",
    name: "Generate the Spec Last",
    desc: "The spec grows from the corrections you kept, recording what you actually saw work.",
    example: "Spec document contains verified rules and open design notes."
  }
];

export const COMPARISON_TABLE = [
  { approach: "TDD / Spec-Driven", timing: "Before code", difference: "HDD writes tests after experimentation, to lock in what worked" },
  { approach: "Agile", timing: "Tickets & acceptance criteria before dev", difference: "In HDD, the working product suggests the next spec" },
  { approach: "Vibe Coding", timing: "Rarely", difference: "Vibe coding accepts AI output as-is. HDD questions every result and saves corrections as tests" }
];

export const SUPPORT_CHATBOT_EXAMPLE = {
  intent: "A chatbot that helps customers request refunds.",
  roughBuild: "AI generates a working chatbot in an hour.",
  observations: [
    { feedback: "It offered a refund before I finished explaining the problem.", type: "checkable", action: "Write test: The bot must not offer a refund until the issue is confirmed." },
    { feedback: "The tone feels off.", type: "vague", action: "Add spec note: Tone should be empathetic and measured." }
  ],
  finalSpec: "Contains tested rules (no premature refund offers) and open design notes (empathetic tone), drawn entirely from real observations."
};

export const QUICK_CHECK_QUESTIONS = [
  {
    q: "1. What does HDD say is easier than predicting what's right?",
    answer: "Recognizing what's wrong."
  },
  {
    q: "2. In HDD, when is the spec written?",
    answer: "Last, grown from kept corrections after observing the rough prototype."
  },
  {
    q: "3. Which feedback becomes an automated test, and which becomes a spec note?",
    answer: "Checkable corrections become automated tests; vague feedback becomes spec notes."
  },
  {
    q: "4. Why is rule 5 (clean up what you keep) necessary?",
    answer: "Kept prototypes become production code, so they must be reviewed, refactored, and simplified."
  },
  {
    q: "5. Name one domain where HDD is a poor fit and say why.",
    answer: "Regulated or safety-critical domains (medical, aerospace, core financial systems) because formal upfront specs are mandated."
  }
];
