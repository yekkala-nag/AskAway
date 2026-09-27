import React from 'react';

/* Clean native recreations of reference infographics.
 * No raster images, no watermarks, no brand names, no attributions, no social UI.
 * Dark contrast section so it works inside both light (EdTech) and dark tabs. */

const wrap = {
  background: '#0F1219',
  border: '1px solid #2A3548',
  borderRadius: 12,
  padding: 20,
  marginBottom: 24,
};
const h3 = { margin: '0 0 4px', fontSize: 17, fontWeight: 800, color: '#F1F5F9' };
const sub = { margin: '0 0 16px', fontSize: 13, color: '#94A3B8', lineHeight: 1.6 };
const grid = (min = 220) => ({
  display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap: 12,
});
const card = {
  background: '#161B26', border: '1px solid #2A3548', borderRadius: 10, padding: 14,
};
const cardTitle = { fontSize: 13, fontWeight: 800, color: '#F1F5F9', marginBottom: 6 };
const cardBody = { fontSize: 12.5, color: '#CBD5E1', lineHeight: 1.65 };
const promptStyle = {
  marginTop: 8, fontSize: 12, color: '#5EC4C8', background: '#0B1220',
  border: '1px solid #234', borderRadius: 6, padding: '6px 8px', lineHeight: 1.5,
};
const tag = {
  display: 'inline-block', fontSize: 10.5, fontWeight: 700, color: '#5EC4C8',
  background: '#5EC4C822', border: '1px solid #5EC4C844', borderRadius: 20, padding: '2px 8px', marginBottom: 8,
};
const step = {
  background: '#161B26', border: '1px solid #2A3548', borderRadius: 10,
  padding: '10px 14px', fontSize: 12.5, color: '#CBD5E1', lineHeight: 1.6,
};

export function LearningPromptsGrid() {
  const items = [
    { t: 'Explain Like I\u2019m 5', d: 'Force a plain-language explanation with familiar everyday terms to reduce complexity.', p: 'Prompt: \u201CExplain [topic] like I\u2019m 5 using a real-life analogy and 3 key takeaways.\u201D' },
    { t: 'Examples & Analogies', d: 'Anchor new concepts to known domains to accelerate understanding and transfer.', p: 'Prompt: \u201CGive 3 analogies for [topic]: one work-related, one personal-life, one visual/metaphor.\u201D' },
    { t: 'Motivation & Purpose', d: 'Sustain effort by clarifying why it matters, what good looks like, and quick wins.', p: 'Prompt: \u201CShow why [topic] matters for [goal] and design a 7-day momentum plan.\u201D' },
    { t: 'Role-Play Practice', d: 'Build skill through realistic simulation, feedback, and iterative reps.', p: 'Prompt: \u201CAct as [role]; run a scenario on [topic], then critique my response and suggest improvements.\u201D' },
    { t: 'Study Plan (Milestones)', d: 'Convert a vague goal into a structured path with checkpoints and measurable outputs.', p: 'Prompt: \u201CCreate a 2-week plan for [topic] with daily tasks, milestones, and a checkpoint quiz schedule.\u201D' },
    { t: 'Quiz & Feedback Loop', d: 'Use retrieval practice to reveal gaps and strengthen long-term retention.', p: 'Prompt: \u201CQuiz me on [topic] (10 questions). After each answer, explain and give a follow-up mini-question.\u201D' },
    { t: 'Mind Map the Domain', d: 'Organize concepts into a hierarchy to see relationships, dependencies, and missing pieces.', p: 'Prompt: \u201CCreate a mind map for [topic]: pillars \u2192 subtopics \u2192 key terms; note prerequisites.\u201D' },
    { t: 'Expert Roundtable', d: 'Compare perspectives to understand trade-offs, edge cases, and decision criteria faster.', p: 'Prompt: \u201CSimulate 3 experts debating [topic] (pragmatist, skeptic, specialist) and summarize consensus + risks.\u201D' },
    { t: 'Mental Associations (Mnemonics)', d: 'Encode key ideas with memory hooks to improve recall under time pressure.', p: 'Prompt: \u201CCreate 5 mnemonics for [topic] and a 60-second recall drill I can repeat daily.\u201D' },
  ];
  return (
    <div style={wrap}>
      <div style={h3}>9 Prompt Patterns for Learning Anything Faster</div>
      <p style={sub}>Reusable prompt shapes: simplify, analogize, motivate, simulate, plan, retrieve, map, debate, memorize.</p>
      <div style={grid(230)}>{items.map((it, i) => (
        <div key={i} style={card}>
          <div style={cardTitle}>{i + 1}. {it.t}</div>
          <div style={cardBody}>{it.d}</div>
          <div style={promptStyle}>{it.p}</div>
        </div>
      ))}</div>
    </div>
  );
}

export function PromptFrameworksGrid() {
  const items = [
    { a: 'TRACE', e: 'Task, Request, Action, Context, Example', b: 'Repeatable, high-clarity instructions', pts: ['Start with the outcome (Task)', 'Specify the ask (Request) and method (Action)', 'Add constraints/background (Context)', 'Provide a reference output (Example)'], t: 'Task: [goal] / Request: [what you want back] / Action: [steps/criteria] / Context: [background/constraints] / Example: [sample format]' },
    { a: 'TAG', e: 'Task, Action, Goal', b: 'Quick, lightweight prompts', pts: ['Define the objective (Task)', 'State the operations to perform (Action)', 'Make success measurable (Goal)'], t: 'Task: [objective] / Action: [do X using Y] / Goal: [metric/definition of done]' },
    { a: 'RTF', e: 'Role, Task, Format', b: 'Controlling tone and structure', pts: ['Assign expertise to shape judgment (Role)', 'Specify deliverable (Task)', 'Lock output structure (Format)'], t: 'Role: Act as a [expert] / Task: Produce [deliverable] / Format: [bullets/table/checklist], include [sections]' },
    { a: 'CLEAR', e: 'Concise, Logical, Explicit, Actionable, Responsible', b: 'Refining messy prompts', pts: ['Remove noise; keep only essential constraints', 'Order requirements stepwise', 'Make assumptions explicit and testable', 'Ensure outputs can be executed; add safety/limits if needed'], t: 'Concise ask: [one sentence] / Logic: [ordered requirements] / Explicit constraints: [must/avoid] / Actionable output: [next steps] / Responsible guardrails: [limits]' },
    { a: 'PACT', e: 'Perspective, Action, Context, Task', b: 'Stakeholder-aware outputs', pts: ['Set viewpoint to frame trade-offs (Perspective)', 'Define output operation (Action)', 'Provide scenario details (Context)', 'State the objective (Task)'], t: 'Perspective: As a [stakeholder/expert] / Action: [analyze/compare/design] / Context: [situation, constraints, audience] / Task: [objective + success criteria]' },
    { a: 'STAR', e: 'Situation, Task, Action, Result', b: 'Case write-ups and structured narratives', pts: ['Describe the setting (Situation)', 'Clarify responsibility (Task)', 'Detail what was done (Action)', 'Quantify/qualify impact (Result)'], t: 'Situation: [context] / Task: [what needed to happen] / Action: [steps taken] / Result: [outcome + metric + lesson]' },
    { a: 'RISE', e: 'Reflect, Inquire, Suggest, Elevate', b: 'Feedback loops and iteration', pts: ['Reflect what you observed (neutral)', 'Ask targeted questions (Inquire)', 'Suggest specific improvements (Suggest)', 'Elevate with a higher standard or next iteration (Elevate)'], t: 'Reflect: [what\u2019s working / what you see] / Inquire: [2\u20133 diagnostic questions] / Suggest: [concrete changes] / Elevate: [stronger version]' },
    { a: 'RASCEF', e: 'Role, Action, Step, Context, Example, Format', b: 'Complex, multi-stage tasks', pts: ['Lock expertise (Role) + deliverable operation (Action)', 'Break process into steps (Step) for reliability', 'Add constraints and background (Context)', 'Provide exemplar (Example); enforce structure (Format)'], t: 'Role: [expert] / Action: [create/analyze/plan] / Steps: 1) \u2026 2) \u2026 / Context: [constraints, audience] / Example: [mini sample] / Format: [table/sections]' },
  ];
  return (
    <div style={wrap}>
      <div style={h3}>8 Structured Prompting Frameworks Compared</div>
      <p style={sub}>Pick by need: clarity, speed, tone control, cleanup, stakeholder framing, narrative, iteration, or multi-stage reliability.</p>
      <div style={grid(260)}>{items.map((it, i) => (
        <div key={i} style={card}>
          <span style={tag}>Best for: {it.b}</span>
          <div style={cardTitle}>{String(i + 1).padStart(2, '0')} · {it.a}</div>
          <div style={{ ...cardBody, color: '#94A3B8' }}>{it.e}</div>
          <ul style={{ ...cardBody, margin: '8px 0', paddingLeft: 16 }}>{it.pts.map((p, j) => <li key={j}>{p}</li>)}</ul>
          <div style={promptStyle}>{it.t}</div>
        </div>
      ))}</div>
    </div>
  );
}

export function HarnessDistillationFlow() {
  return (
    <div style={wrap}>
      <div style={h3}>Harness Distillation via Agent-as-Harness</div>
      <p style={sub}>Use a domain-optimized harness as training-time guidance, transfer the induced behavior into model weights, then deploy under a single fixed harness.</p>
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={step}><b style={{ color: '#F1F5F9' }}>1. Evolve &amp; Adapt</b> — evolve a specialized harness from training tasks (tools, middleware, skills, memory), then adapt it into action recipes, review middleware, review guidance, and failure patterns.</div>
        <div style={step}><b style={{ color: '#F1F5F9' }}>2. Agent-as-Harness Trajectory Collection</b> — a harnessing agent corrects student proposals before execution in the fixed target harness action space: PASS keeps the proposal, Replace substitutes the corrected action. Unexecuted proposals never touch the environment.</div>
        <div style={step}><b style={{ color: '#F1F5F9' }}>3. Train &amp; Deploy</b> — retain reviewer-perspective trajectories, fine-tune on them, and deploy the distilled student alone. Reported effects: large task-success gains with the specialized harness removed, and high recovery of harness-induced behaviors.</div>
      </div>
    </div>
  );
}

export function ArchitectureComparison() {
  const rows = [
    { t: 'Language Model', f: 'Prompt + provided context \u2192 learned parameters \u2192 sequentially generated response.' },
    { t: 'Retrieval-Augmented Generation', f: 'Query \u2192 retriever searches an indexed knowledge base for relevant chunks \u2192 query + retrieved context \u2192 grounded response (not guaranteed correct).' },
    { t: 'AI Agent', f: 'Goal \u2192 agent core (model + instructions + task state) \u2192 decide \u2192 act via tool calls (APIs, files, apps, databases) \u2192 observe result \u2192 update task state and repeat until the goal is met.' },
    { t: 'Multi-Agent System', f: 'Objective \u2192 orchestration coordinates work across single/multi-agent workflows with shared task state \u2192 tool calls \u2192 evaluate progress \u2192 replan \u2192 outcome when the goal is met.' },
  ];
  return (
    <div style={wrap}>
      <div style={h3}>Architecture Comparison — Model, Retrieval, Agent, Multi-Agent</div>
      <p style={sub}>From single inference to orchestrated systems: each tier adds a capability — and operational cost.</p>
      <div style={{ display: 'grid', gap: 12 }}>{rows.map((r, i) => (
        <div key={i} style={step}><b style={{ color: '#F1F5F9' }}>{i + 1}. {r.t}</b> — {r.f}</div>
      ))}</div>
    </div>
  );
}

export function EvalMethodsGrid() {
  const items = [
    { t: 'G-Eval', d: 'Model judges with chain-of-thought against custom criteria; aggregate step scores.' },
    { t: 'ROUGE', d: 'Recall-oriented: how much of the reference text is covered by the output (n-grams/LCS, F1).' },
    { t: 'BLEU', d: 'Precision-oriented: how much of the output is supported by the reference, with brevity penalty.' },
    { t: 'LLM-as-Judge', d: 'Model compares two outputs using a rubric; final decision and win-rate ranking.' },
    { t: 'BERTScore', d: 'Contextual embeddings measure semantic similarity; handles synonyms well (P/R/F1, cosine).' },
    { t: 'Human Eval', d: 'Annotators rate outputs on defined dimensions; aggregated quality score. High quality, high cost.' },
    { t: 'Multi-turn Eval', d: 'Scores response quality across an entire conversation: roles, history tracking, coherence.' },
    { t: 'Safety Eval', d: 'Checks bias, toxicity, and privacy leakage (classifiers + flags) before final scoring.' },
    { t: 'LLM Juries', d: 'Independent model judges score in parallel; scores aggregated into one final verdict.' },
    { t: 'DAG Eval', d: 'Decision-tree evaluation: criteria tree root \u2192 node evaluation \u2192 branch paths \u2192 leaf scores.' },
    { t: 'Trajectory Accuracy', d: 'Measures how closely an agent\u2019s step-by-step execution path matches the expected path.' },
  ];
  return (
    <div style={wrap}>
      <div style={h3}>11 Evaluation Methods — From Overlap to Trajectory Accuracy</div>
      <p style={sub}>Reference-based overlap, embedding similarity, model judges and juries, human review, safety gates, and execution-path scoring.</p>
      <div style={grid(210)}>{items.map((it, i) => (
        <div key={i} style={card}>
          <div style={cardTitle}>{i + 1}. {it.t}</div>
          <div style={cardBody}>{it.d}</div>
        </div>
      ))}</div>
    </div>
  );
}

export function DataReadinessJourney() {
  const miles = [
    { t: 'Clean', n: 'A good starting point — necessary but not sufficient.' },
    { t: 'Consistent across systems', n: 'Not always structured the same way.' },
    { t: 'Connected', n: 'Silos make this hard.' },
    { t: 'Clear definitions', n: 'What does \u201Con time\u201D actually mean?' },
    { t: 'Exceptions captured', n: 'Real life is messy.' },
    { t: 'Business context', n: 'Data without context can mislead.' },
    { t: 'Accessible to AI', n: 'The right format, at the right level.' },
    { t: 'Reliable for the use case', n: 'It has to work in the real world.' },
    { t: 'Actually AI-ready', n: 'Now it can drive real value.' },
  ];
  return (
    <div style={wrap}>
      <div style={h3}>The AI-Ready Data Journey</div>
      <p style={sub}>The naive view is linear — Clean \u2192 Organized \u2192 Digitized \u2192 AI-ready. The real path winds through consistency, connectivity, definitions, exceptions, context, accessibility, and reliability.</p>
      <div style={{ display: 'grid', gap: 8 }}>{miles.map((m, i) => (
        <div key={i} style={step}><b style={{ color: i === miles.length - 1 ? '#5EC4C8' : '#F1F5F9' }}>{i + 1}. {m.t}</b> <span style={{ color: '#94A3B8' }}>— {m.n}</span></div>
      ))}</div>
    </div>
  );
}

export function SevenLayersStack() {
  const layers = [
    { n: 7, t: 'General Intelligence', d: 'General intelligence across tasks — not achieved yet.' },
    { n: 6, t: 'Agentic AI', d: 'Plans, uses tools, and takes actions.' },
    { n: 5, t: 'Generative AI', d: 'Creates text, images, audio, and code. Current frontier.' },
    { n: 4, t: 'Deep Learning', d: 'Many-layer neural networks for vision, speech, and language.' },
    { n: 3, t: 'Neural Networks', d: 'Interconnected learned representations.' },
    { n: 2, t: 'Machine Learning', d: 'Learns patterns from data.' },
    { n: 1, t: 'Classical AI', d: 'Rules, logic, search.' },
  ];
  return (
    <div style={wrap}>
      <div style={h3}>7 Layers of AI — From Classical Rules to General Intelligence</div>
      <p style={sub}>Each layer builds on the one below. We are currently at the generative frontier.</p>
      <div style={{ display: 'grid', gap: 8 }}>{layers.map((l) => (
        <div key={l.n} style={step}><b style={{ color: '#F1F5F9' }}>{l.n}. {l.t}</b> — {l.d}</div>
      ))}</div>
    </div>
  );
}

export function TokenOptimizationFlow() {
  return (
    <div style={wrap}>
      <div style={h3}>Token Optimization for Coding Agents (~92% Reduction Pattern)</div>
      <p style={sub}>Keep large files out of the expensive model\u2019s context; delegate ruthlessly to cheaper models; enforce with pre-tool hooks.</p>
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={step}><b style={{ color: '#F1F5F9' }}>Gate every read</b> — pre-tool hook checks file size / command before execution. Small reads pass; anything over the line threshold routes to bulk-read. Follow-ups then cost nothing extra.</div>
        <div style={step}><b style={{ color: '#F1F5F9' }}>Bulk-read path</b> — a script wraps files in tags and attaches the question; a cheap model returns bullets only (name/line-number led). Files never enter the expensive context.</div>
        <div style={step}><b style={{ color: '#F1F5F9' }}>Delegated writing</b> — code-write calls carry spec + reference file; a cheap writer matches reference patterns, code only. One shot, nothing kept between calls; delegations capped per run.</div>
        <div style={step}><b style={{ color: '#F1F5F9' }}>Three layers</b> — 1) advisory skills and docs, 2) scripts that report tokens, 3) hooks that run before the tool and can refuse. Rules moved from ignored advisory text into enforced hooks.</div>
      </div>
    </div>
  );
}

export function ToolSelectionFramework() {
  const cats = ['Image generation', 'Website building', 'Video creation', 'Coding assistance', 'Writing assistance', 'Conversational search', 'Presentation generation', 'Spreadsheet formulas', 'Voice generation', 'Design editing'];
  return (
    <div style={wrap}>
      <div style={h3}>Free-Tier AI Tool Selection Framework</div>
      <p style={sub}>Ten capability areas across create, search, build, and communicate — plus a picker, a router, and a self-quiz.</p>
      <div style={grid(180)}>{cats.map((c, i) => (
        <div key={i} style={card}><div style={cardTitle}>{i + 1}. {c}</div><div style={cardBody}>Free tier available with limits — check credits, export caps, and output restrictions.</div></div>
      ))}</div>
      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        <div style={step}><b style={{ color: '#F1F5F9' }}>A) Pick fast (3 questions)</b> — 1) What are you making? 2) Do you need watermark-free exports? 3) How many free credits per month?</div>
        <div style={step}><b style={{ color: '#F1F5F9' }}>B) Router</b> — image \u2192 image tool · design/poster \u2192 design tool · video \u2192 video tool · website \u2192 website builder · code \u2192 coding assistant · writing/ideas \u2192 writing assistant · slides \u2192 presentation tool · voice \u2192 voice tool · search answers \u2192 conversational search · spreadsheet formulas \u2192 spreadsheet helper.</div>
        <div style={step}><b style={{ color: '#F1F5F9' }}>C) Reality check + quiz</b> — many free tools have credit, watermark, export, or trial limits. Self-test: cover the answers and name the right tool for spreadsheets, slides, code completion, conversational search, and credit-limited video.</div>
      </div>
    </div>
  );
}
