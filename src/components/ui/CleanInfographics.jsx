import React from 'react';

/* Clean native recreations of reference infographics.
 * No raster images, no watermarks, no brand names, no attributions, no social UI.
 * Dark contrast section so it works inside both light (EdTech) and dark tabs. */

const grid = (min = 220) => ({
  display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap: 12,
});

/* ---------- Inline SVG helpers (no image files, no watermarks) ---------- */

const ICONS = {
  book: (<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>),
  link: (<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>),
  target: (<><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>),
  smile: (<><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></>),
  calendar: (<><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M9 16l2 2 4-4" /></>),
  help: (<><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>),
  nodes: (<><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>),
  users: (<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>),
  bulb: (<><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-4.1 12.7c.6.5 1.1 1.4 1.1 2.3h6c0-.9.5-1.8 1.1-2.3A7 7 0 0 0 12 2z" /></>),
  clip: (<><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" /></>),
  gauge: (<><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></>),
  search: (<><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>),
  eye: (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>),
  star: (<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>),
  chart: (<><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>),
  shield: (<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>),
  chat: (<><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>),
  layers: (<><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>),
  check: (<><polyline points="20 6 9 17 4 12" /></>),
  zap: (<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>),
  file: (<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="15" y2="17" /></>),
  cpu: (<><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="15" x2="4" y2="15" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="15" x2="23" y2="15" /></>),
  branch: (<><line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></>),
  flag: (<><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></>),
  send: (<><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>),
  globe: (<><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>),
  play: (<><rect x="2" y="4" width="20" height="16" rx="3" /><polygon points="10 9 15 12 10 15 10 9" /></>),
  pen: (<><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></>),
  slides: (<><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>),
  table: (<><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /></>),
  code: (<><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>),
  mic: (<><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0" /><line x1="12" y1="19" x2="12" y2="22" /></>),
  wrench: (<><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></>),
  refresh: (<><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></>),
  award: (<><circle cx="12" cy="8" r="6" /><path d="M15.5 13l1.5 8-5-3-5 3 1.5-8" /></>),
};

export function Icon({ name, size = 26, color = '#5EC4C8' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      {ICONS[name] || ICONS.file}
    </svg>
  );
}

let __flowUid = 0;
/* Generic horizontal flow strip: boxes + arrows, fully responsive SVG. */
function FlowStrip({ steps, accent = '#5EC4C8' }) {
  const uid = React.useMemo(() => `fs${++__flowUid}`, []);
  const W = 640, H = 88, gap = 12, aw = 26;
  const n = steps.length;
  const bw = (W - (n - 1) * (gap + aw)) / n;
  const cy = H / 2;
  let x = 0;
  const nodes = steps.map((s) => { const bx = x; x += bw + gap + aw; return { ...s, bx }; });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} role="img">
      <defs>
        <marker id={uid} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="none" stroke={accent} strokeWidth="1.6" />
        </marker>
      </defs>
      {nodes.map((s, i) => (
        <g key={i}>
          <rect x={s.bx} y={10} width={bw} height={H - 20} rx={9} fill="rgba(255,255,255,0.05)" stroke={accent} strokeOpacity={0.45} />
          <rect x={s.bx} y={10} width={4} height={H - 20} rx={2} fill={accent} opacity={0.85} />
          <text x={s.bx + bw / 2} y={s.d ? 40 : 50} textAnchor="middle" fontSize={s.label.length > 14 ? 10.5 : 12.5} fontWeight={700} fill="#F1F5F9">{s.label}</text>
          {s.d ? <text x={s.bx + bw / 2} y={60} textAnchor="middle" fontSize={9.5} fill="#94A3B8">{s.d}</text> : null}
          {i < nodes.length - 1 ? (<line x1={s.bx + bw + 3} y1={cy} x2={s.bx + bw + gap + aw - 3} y2={cy} stroke={accent} strokeWidth={1.8} markerEnd={`url(#${uid})`} />) : null}
        </g>
      ))}
    </svg>
  );
}

/* ---------- Unified showcase system (reference: 7-Layers panel) ----------
 * Navy ground, glassy per-color bars/cards, icon chips, spine, pill badges.
 * Every diagram below renders through these primitives — no bespoke skins. */

export function Panel({ title, sub, children }) {
  return (
    <div style={{
      background: 'var(--ds-color-chrome-showcaseBg, #0A1430)',
      border: '1px solid var(--ds-color-chrome-showcaseEdge, rgba(94, 196, 200, 0.25))',
      borderRadius: 18, padding: '26px 26px 30px', marginBottom: 24,
      boxShadow: '0 20px 50px rgba(10, 20, 48, 0.35)',
    }}>
      <div style={{
        color: '#FFFFFF', fontSize: '1.25rem', fontWeight: 800,
        textAlign: 'center', margin: '0 0 6px', letterSpacing: '-0.01em',
      }}>
        {title}
      </div>
      {sub ? (
        <p style={{
          margin: '0 auto 20px', maxWidth: 660, fontSize: 13,
          color: '#94A3B8', lineHeight: 1.6, textAlign: 'center',
        }}>
          {sub}
        </p>
      ) : null}
      {children}
    </div>
  );
}

function Pill({ children, color = '#5EC4C8' }) {
  return (
    <span style={{
      marginLeft: 'auto', fontSize: '0.66rem', fontWeight: 700, color: '#0A1430',
      background: color, borderRadius: 20, padding: '3px 10px',
      textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0, whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

function Chip({ icon, color, size = 32 }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: 10, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(255,255,255,0.08)', border: `1px solid ${color}88`,
    }}>
      <Icon name={icon} size={Math.round(size * 0.58)} color="#FFFFFF" />
    </span>
  );
}

export function GlassBar({ color, icon, index, title, badge, detail }) {
  return (
    <div style={{
      padding: '13px 18px 13px 16px', borderRadius: 14,
      background: `linear-gradient(90deg, ${color}55 0%, ${color}22 55%, transparent 100%)`,
      border: `1px solid ${color}66`, boxShadow: `0 0 24px ${color}33`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Chip icon={icon} color={color} />
        <span style={{ color: '#FFFFFF', fontSize: '1.02rem', fontWeight: 700 }}>
          {index != null ? (<span style={{ opacity: 0.75, marginRight: '8px' }}>{index}</span>) : null}
          {title}
        </span>
        {badge ? (<Pill>{badge}</Pill>) : null}
      </div>
      {detail ? (
        <div style={{ color: '#CBD5E1', fontSize: 12.5, lineHeight: 1.65, marginTop: 8, paddingLeft: 46 }}>
          {detail}
        </div>
      ) : null}
    </div>
  );
}

export function GlassCard({ color = '#5EC4C8', icon, title, badge, children }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${color}44`, borderRadius: 12, padding: 14,
      boxShadow: `0 0 18px ${color}22`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Chip icon={icon} color={color} size={28} />
        <div style={{ flex: 1, fontSize: 13, fontWeight: 800, color: '#F1F5F9' }}>{title}</div>
        {badge ? (<span style={{
          fontSize: '0.62rem', fontWeight: 700, color: '#0A1430', background: color,
          borderRadius: 20, padding: '2px 8px', textTransform: 'uppercase',
          letterSpacing: '0.04em', flexShrink: 0, whiteSpace: 'nowrap',
        }}>
          {badge}
        </span>) : null}
      </div>
      {children}
    </div>
  );
}

const glassBody = { fontSize: 12.5, color: '#CBD5E1', lineHeight: 1.65 };
const glassPrompt = {
  marginTop: 8, fontSize: 12, color: '#7FE3DC', background: 'rgba(0,0,0,0.35)',
  border: '1px solid rgba(94,196,200,0.25)', borderRadius: 6, padding: '6px 8px', lineHeight: 1.5,
};
const glassList = { ...glassBody, margin: '8px 0 0', paddingLeft: 16 };

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
  const icons = ['book', 'link', 'target', 'smile', 'calendar', 'help', 'nodes', 'users', 'bulb'];
  const palette = ['#5EC4C8', '#6A9BD8', '#A78BFA', '#7FB069', '#E8C558', '#E08A4C', '#F0A89A', '#9B89C4', '#34D399'];
  return (
    <Panel
      title="9 Prompt Patterns for Learning Anything Faster"
      sub="Reusable prompt shapes: simplify, analogize, motivate, simulate, plan, retrieve, map, debate, memorize."
    >
      <div style={grid(230)}>{items.map((it, i) => (
        <GlassCard key={i} color={palette[i % palette.length]} icon={icons[i]} title={`${i + 1}. ${it.t}`}>
          <div style={glassBody}>{it.d}</div>
          <div style={glassPrompt}>{it.p}</div>
        </GlassCard>
      ))}</div>
    </Panel>
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
  const icons = ['clip', 'target', 'smile', 'search', 'eye', 'star', 'refresh', 'branch'];
  const palette = ['#5EC4C8', '#6A9BD8', '#A78BFA', '#7FB069', '#E8C558', '#E08A4C', '#F0A89A', '#9B89C4'];
  return (
    <Panel
      title="8 Structured Prompting Frameworks Compared"
      sub="Pick by need: clarity, speed, tone control, cleanup, stakeholder framing, narrative, iteration, or multi-stage reliability."
    >
      <div style={grid(260)}>{items.map((it, i) => (
        <GlassCard
          key={i}
          color={palette[i % palette.length]}
          icon={icons[i]}
          title={`${String(i + 1).padStart(2, '0')} · ${it.a}`}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: palette[i % palette.length], marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Best for: {it.b}</div>
          <div style={{ ...glassBody, color: '#94A3B8' }}>{it.e}</div>
          <ul style={glassList}>{it.pts.map((p, j) => <li key={j}>{p}</li>)}</ul>
          <div style={glassPrompt}>{it.t}</div>
        </GlassCard>
      ))}</div>
    </Panel>
  );
}

export function HarnessDistillationFlow() {
  return (
    <Panel
      title="Harness Distillation via Agent-as-Harness"
      sub="Use a domain-optimized harness as training-time guidance, transfer the induced behavior into model weights, then deploy under a single fixed harness."
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <GlassBar
          color="#5EC4C8" icon="refresh" index="1." title="Evolve & Adapt"
          detail="Evolve a specialized harness from training tasks (tools, middleware, skills, memory), then adapt it into action recipes, review middleware, review guidance, and failure patterns."
        />
        <GlassBar
          color="#7FB069" icon="zap" index="2." title="Agent-as-Harness Trajectory Collection"
          detail="A harnessing agent corrects student proposals before execution in the fixed target harness action space: PASS keeps the proposal, Replace substitutes the corrected action. Unexecuted proposals never touch the environment."
        />
        <GlassBar
          color="#6A9BD8" icon="check" index="3." title="Train & Deploy"
          detail="Retain reviewer-perspective trajectories, fine-tune on them, and deploy the distilled student alone. Reported effects: large task-success gains with the specialized harness removed, and high recovery of harness-induced behaviors."
        />
      </div>
    </Panel>
  );
}

export function ArchitectureComparison() {
  const tiers = [
    { n: 1, t: 'Language Model', c: 'Prompt in, response out — no outside knowledge.', accent: '#6A9BD8', icon: 'chat', steps: [{ label: 'Prompt', d: '+ context' }, { label: 'Model', d: 'parameters' }, { label: 'Response', d: 'generated' }] },
    { n: 2, t: 'Retrieval-Augmented Generation', c: 'Grounds answers in an indexed knowledge base.', accent: '#7FB069', icon: 'search', steps: [{ label: 'Query', d: 'user ask' }, { label: 'Retriever', d: '+ index' }, { label: 'Model', d: 'with context' }, { label: 'Answer', d: 'grounded' }] },
    { n: 3, t: 'AI Agent', c: 'Goal-driven loop: decide, act with tools, observe, repeat.', accent: '#E8C558', icon: 'cpu', steps: [{ label: 'Goal', d: 'objective' }, { label: 'Core', d: 'model+state' }, { label: 'Decide', d: 'choose' }, { label: 'Act', d: 'tool call' }, { label: 'Observe', d: 'result' }] },
    { n: 4, t: 'Multi-Agent System', c: 'Orchestrated team with shared state and evaluation.', accent: '#A78BFA', icon: 'nodes', steps: [{ label: 'Objective', d: 'mission' }, { label: 'Orchestrate', d: 'coordinate' }, { label: 'Agent team', d: 'workflows' }, { label: 'Evaluate', d: 'progress' }, { label: 'Outcome', d: 'goal met' }] },
  ];
  return (
    <Panel
      title="Architecture Comparison — Model, Retrieval, Agent, Multi-Agent"
      sub="From single inference to orchestrated systems: each tier adds a capability — and operational cost."
    >
      <div style={{ display: 'grid', gap: 18 }}>
        {tiers.map((tier) => (
          <div key={tier.n} style={{ display: 'grid', gap: 10 }}>
            <GlassBar color={tier.accent} icon={tier.icon} index={`${tier.n}.`} title={tier.t} detail={tier.c} />
            <FlowStrip steps={tier.steps} accent={tier.accent} />
          </div>
        ))}
      </div>
    </Panel>
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
  const icons = ['gauge', 'file', 'check', 'cpu', 'nodes', 'eye', 'chat', 'shield', 'award', 'branch', 'send'];
  const palette = ['#5EC4C8', '#6A9BD8', '#A78BFA', '#7FB069', '#E8C558', '#E08A4C', '#F0A89A', '#9B89C4', '#34D399', '#F472B6', '#38BDF8'];
  return (
    <Panel
      title="11 Evaluation Methods — From Overlap to Trajectory Accuracy"
      sub="Reference-based overlap, embedding similarity, model judges and juries, human review, safety gates, and execution-path scoring."
    >
      <div style={grid(210)}>{items.map((it, i) => (
        <GlassCard
          key={i}
          color={palette[i % palette.length]}
          icon={icons[i]}
          title={`${i + 1}. ${it.t}`}
        >
          <div style={glassBody}>{it.d}</div>
        </GlassCard>
      ))}</div>
    </Panel>
  );
}

export function DataReadinessJourney() {
  const miles = [
    { t: 'Clean', n: 'A good starting point.' },
    { t: 'Consistent', n: 'Same meaning everywhere.' },
    { t: 'Connected', n: 'Silos make this hard.' },
    { t: 'Clear definitions', n: 'Agree what fields mean.' },
    { t: 'Exceptions captured', n: 'Real life is messy.' },
    { t: 'Business context', n: 'Data needs meaning.' },
    { t: 'Accessible to AI', n: 'Right format, right level.' },
    { t: 'Reliable', n: 'Works in the real world.' },
    { t: 'Actually AI-ready', n: 'Now it drives value.', done: true },
  ];
  const pts = miles.map((m, i) => ({ ...m, x: i % 2 === 0 ? 185 : 455, y: 36 + i * 58 }));
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  return (
    <Panel
      title="The AI-Ready Data Journey"
      sub="The naive view is linear — Clean, Organized, Digitized, AI-ready. The real path winds through consistency, connectivity, definitions, exceptions, context, accessibility, and reliability."
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {['Clean', 'Organized', 'Digitized', 'AI-ready?'].map((s, i, a) => (
          <React.Fragment key={s}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#94A3B8', background: 'rgba(255,255,255,0.05)', border: '1px dashed #3A4A63', borderRadius: 20, padding: '4px 12px' }}>{s}</span>
            {i < a.length - 1 ? (<span style={{ color: '#3A4A63' }}>→</span>) : null}
          </React.Fragment>
        ))}
        <span style={{ fontSize: 11, color: '#94A3B8' }}>— the myth</span>
      </div>
      <svg viewBox="0 0 640 560" style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Winding AI-ready data journey">
        <path d={pathD} fill="none" stroke="#3B4A6E" strokeWidth={20} strokeLinejoin="round" strokeLinecap="round" />
        <path d={pathD} fill="none" stroke="#5EC4C8" strokeWidth={2} strokeDasharray="7 6" opacity={0.8} />
        {pts.map((p, i) => {
          const left = p.x < 320;
          const accent = p.done ? '#34D399' : '#5EC4C8';
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={15} fill="#0A1430" stroke={accent} strokeWidth={3} />
              <circle cx={p.x} cy={p.y} r={5.5} fill={accent} />
              <text x={left ? p.x + 26 : p.x - 26} y={p.y - 1} textAnchor={left ? 'start' : 'end'} fontSize={13} fontWeight={800} fill="#F1F5F9">{i + 1}. {p.t}</text>
              <text x={left ? p.x + 26 : p.x - 26} y={p.y + 16} textAnchor={left ? 'start' : 'end'} fontSize={10.5} fill="#94A3B8">{p.n}</text>
            </g>
          );
        })}
      </svg>
    </Panel>
  );
}

/** Single source of truth for the 7-layer stack (also rendered by LayersShowcasePanel). */
export const SEVEN_LAYERS = [
  { n: 7, t: 'General Intelligence', d: 'General intelligence across tasks — not yet achieved.', c: '#A78BFA', icon: 'star' },
  { n: 6, t: 'Agentic AI', d: 'Plans, uses tools, and takes actions.', c: '#6A9BD8', icon: 'cpu' },
  { n: 5, t: 'Generative AI', d: 'Creates text, images, audio, and code.', c: '#5EC4C8', icon: 'zap', flag: 'current frontier' },
  { n: 4, t: 'Deep Learning', d: 'Many-layer nets for vision, speech, language.', c: '#7FB069', icon: 'layers' },
  { n: 3, t: 'Neural Networks', d: 'Interconnected learned representations.', c: '#E8C558', icon: 'nodes' },
  { n: 2, t: 'Machine Learning', d: 'Learns patterns from data.', c: '#E08A4C', icon: 'chart' },
  { n: 1, t: 'Classical AI', d: 'Rules, logic, search.', c: '#C96A5A', icon: 'branch' },
];

export function SevenLayersStack() {
  return (
    <Panel
      title="7 Layers of AI — From Classical Rules to General Intelligence"
      sub="Each layer builds on the one below. We are currently at the generative frontier."
    >
      <div style={{ display: 'grid', gap: 12 }}>
        {SEVEN_LAYERS.map((l) => (
          <GlassBar key={l.n} color={l.c} icon={l.icon} index={`${l.n}.`} title={l.t} badge={l.flag} detail={l.d} />
        ))}
      </div>
    </Panel>
  );
}

export function TokenOptimizationFlow() {
  return (
    <Panel
      title="Token Optimization for Coding Agents"
      sub="Keep large files out of the expensive model’s context; delegate ruthlessly to cheaper models; enforce with pre-tool hooks."
    >
      <svg viewBox="0 0 640 320" style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Token optimization flowchart">
        <defs>
          <marker id="tokA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="none" stroke="#5EC4C8" strokeWidth="1.6" />
          </marker>
        </defs>
        <rect x={215} y={8} width={210} height={42} rx={9} fill="rgba(255,255,255,0.05)" stroke="#2A3548" />
        <rect x={215} y={8} width={4} height={42} rx={2} fill="#5EC4C8" />
        <text x={320} y={33} textAnchor="middle" fontSize={12.5} fontWeight={700} fill="#F1F5F9">Read / execute request</text>
        <line x1={320} y1={50} x2={320} y2={64} stroke="#5EC4C8" strokeWidth={1.8} markerEnd="url(#tokA)" />
        <polygon points="320,66 410,116 320,166 230,116" fill="rgba(255,255,255,0.05)" stroke="#E8C558" strokeWidth={2} />
        <text x={320} y={112} textAnchor="middle" fontSize={13} fontWeight={800} fill="#F1F5F9">over the line limit?</text>
        <text x={320} y={130} textAnchor="middle" fontSize={10} fill="#94A3B8">pre-tool hook gate</text>
        <text x={206} y={106} textAnchor="end" fontSize={11} fontWeight={700} fill="#7FB069">no</text>
        <text x={434} y={106} textAnchor="start" fontSize={11} fontWeight={700} fill="#E8C558">yes</text>
        <line x1={228} y1={116} x2={188} y2={116} stroke="#5EC4C8" strokeWidth={1.8} markerEnd="url(#tokA)" />
        <line x1={412} y1={116} x2={452} y2={116} stroke="#5EC4C8" strokeWidth={1.8} markerEnd="url(#tokA)" />
        <rect x={22} y={88} width={160} height={56} rx={9} fill="rgba(255,255,255,0.05)" stroke="#2A3548" />
        <rect x={22} y={88} width={4} height={56} rx={2} fill="#7FB069" />
        <text x={102} y={111} textAnchor="middle" fontSize={12} fontWeight={700} fill="#F1F5F9">Small read</text>
        <text x={102} y={129} textAnchor="middle" fontSize={10} fill="#94A3B8">passes straight through</text>
        <rect x={458} y={88} width={160} height={56} rx={9} fill="rgba(255,255,255,0.05)" stroke="#2A3548" />
        <rect x={458} y={88} width={4} height={56} rx={2} fill="#E8C558" />
        <text x={538} y={111} textAnchor="middle" fontSize={12} fontWeight={700} fill="#F1F5F9">Bulk-read script</text>
        <text x={538} y={129} textAnchor="middle" fontSize={10} fill="#94A3B8">file wrapped once</text>
        <line x1={538} y1={144} x2={538} y2={158} stroke="#5EC4C8" strokeWidth={1.8} markerEnd="url(#tokA)" />
        <rect x={458} y={162} width={160} height={56} rx={9} fill="rgba(255,255,255,0.05)" stroke="#2A3548" />
        <rect x={458} y={162} width={4} height={56} rx={2} fill="#5EC4C8" />
        <text x={538} y={185} textAnchor="middle" fontSize={12} fontWeight={700} fill="#F1F5F9">Cheap model</text>
        <text x={538} y={203} textAnchor="middle" fontSize={10} fill="#94A3B8">bullets only, cited lines</text>
        <rect x={60} y={252} width={520} height={52} rx={9} fill="rgba(255,255,255,0.05)" stroke="#2A3548" />
        <text x={320} y={273} textAnchor="middle" fontSize={11.5} fill="#CBD5E1">Files never enter the expensive context — follow-ups cost nothing extra</text>
        <text x={320} y={291} textAnchor="middle" fontSize={10.5} fill="#94A3B8">Three layers: advisory docs → token-reporting scripts → enforcing hooks</text>
      </svg>
      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        <GlassBar color="#5EC4C8" icon="zap" title="Gate every read" detail="Pre-tool hook checks file size / command before execution. Small reads pass; anything over the line threshold routes to bulk-read." />
        <GlassBar color="#E8C558" icon="file" title="Bulk-read path" detail="A script wraps files in tags and attaches the question; a cheap model returns bullets only (name/line-number led)." />
        <GlassBar color="#6A9BD8" icon="send" title="Delegated writing" detail="Code-write calls carry spec + reference file; a cheap writer matches reference patterns, code only. One shot, nothing kept between calls." />
      </div>
    </Panel>
  );
}

export function ToolSelectionFramework() {
  const cats = ['Image generation', 'Website building', 'Video creation', 'Coding assistance', 'Writing assistance', 'Conversational search', 'Presentation generation', 'Spreadsheet formulas', 'Voice generation', 'Design editing'];
  const catLook = [
    { c: '#5EC4C8', icon: 'eye' }, { c: '#6A9BD8', icon: 'globe' },
    { c: '#A78BFA', icon: 'play' }, { c: '#7FB069', icon: 'code' },
    { c: '#E8C558', icon: 'pen' }, { c: '#E08A4C', icon: 'search' },
    { c: '#F0A89A', icon: 'slides' }, { c: '#9B89C4', icon: 'table' },
    { c: '#34D399', icon: 'mic' }, { c: '#38BDF8', icon: 'layers' },
  ];
  return (
    <Panel
      title="Free-Tier AI Tool Selection Framework"
      sub="Ten capability areas across create, search, build, and communicate — plus a picker, a router, and a self-quiz."
    >
      <div style={grid(180)}>{cats.map((c, i) => (
        <GlassCard key={i} color={catLook[i].c} icon={catLook[i].icon} title={`${i + 1}. ${c}`}>
          <div style={glassBody}>Free tier available with limits — check credits, export caps, and output restrictions.</div>
        </GlassCard>
      ))}</div>
      <div style={{ display: 'grid', gap: 12, marginTop: 14 }}>
        <GlassBar color="#5EC4C8" icon="check" title="A) Pick fast (3 questions)" detail="1) What are you making? 2) Do you need watermark-free exports? 3) How many free credits per month?" />
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(94,196,200,0.2)', borderRadius: 14, padding: '14px 14px 6px' }}>
          <div style={{ color: '#F1F5F9', fontSize: 13, fontWeight: 800, marginBottom: 6 }}>B) Task → tool router</div>
          <svg viewBox="0 0 640 330" style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Task to tool router">
            <defs>
              <marker id="rtlA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="none" stroke="#5EC4C8" strokeWidth="1.6" />
              </marker>
            </defs>
            <rect x={14} y={135} width={132} height={60} rx={9} fill="#5EC4C8" />
            <text x={80} y={160} textAnchor="middle" fontSize={12.5} fontWeight={800} fill="#0F1219">Your task</text>
            <text x={80} y={178} textAnchor="middle" fontSize={10} fill="#0F1219" opacity={0.75}>what to make?</text>
            {['Image', 'Video + Voice', 'Website', 'Code', 'Writing + Slides'].map((m, i) => {
              const y = 14 + i * 64;
              return (
                <g key={m}>
                  <line x1={146} y1={165} x2={226} y2={y + 22} stroke="#5EC4C8" strokeWidth={1.4} opacity={0.65} markerEnd="url(#rtlA)" />
                  <rect x={232} y={y} width={150} height={44} rx={9} fill="rgba(255,255,255,0.05)" stroke="#2A3548" />
                  <text x={307} y={y + 27} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="#F1F5F9">{m}</text>
                </g>
              );
            })}
            {['Create visuals', 'Generate media', 'Build sites', 'Develop code', 'Communicate'].map((r, i) => {
              const y = 14 + i * 64;
              return (
                <g key={r}>
                  <line x1={382} y1={y + 22} x2={462} y2={y + 22} stroke="#5EC4C8" strokeWidth={1.4} opacity={0.65} markerEnd="url(#rtlA)" />
                  <rect x={468} y={y} width={158} height={44} rx={9} fill="rgba(255,255,255,0.05)" stroke="#34D399" />
                  <text x={547} y={y + 27} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="#F1F5F9">{r}</text>
                </g>
              );
            })}
          </svg>
        </div>
        <GlassBar color="#E8C558" icon="shield" title="C) Reality check + quiz" detail="Many free tools have credit, watermark, export, or trial limits. Self-test: cover the answers and name the right lane for spreadsheets, slides, code completion, conversational search, and credit-limited video." />
      </div>
    </Panel>
  );
}

/* Shared cross-tab panels (imported by eval + reasoning tabs). */

const panelBody = { fontSize: 12.5, color: '#CBD5E1', lineHeight: 1.65 };
const panelList = { ...panelBody, margin: '6px 0 0', paddingLeft: 16 };

/** Evaluation-framework poster recreation (goal → archetypes → launch gate). */
export function PmEvalFrameworkPanel() {
  return (
    <Panel
      title="Evaluation Framework — From Model Goal to Launch Gate"
      sub="Translate product goals into evals, grow past headline-accuracy thinking, and gate launch on measured tradeoffs with post-launch monitoring."
    >
      <div style={grid(240)}>
        <GlassCard color="#34D399" icon="check" title="1. Goal → Eval Translation">
          <div style={panelBody}>Each model paradigm gets its own metrics:</div>
          <ul style={panelList}>
            <li><b>Classification</b> — precision, recall, false positives</li>
            <li><b>Text generation</b> — accuracy, fluency, hallucination detection, relevance</li>
            <li><b>Recommender</b> — click-through rate, CTR, novelty</li>
          </ul>
        </GlassCard>
        <GlassCard color="#5EC4C8" icon="users" title="2. Three PM Archetypes">
          <ul style={panelList}>
            <li><b>Ships blind</b> — launches on headline accuracy, ignores failure slices</li>
            <li><b>Inspects</b> — slices datasets, hunts false positives</li>
            <li><b>Co-designs</b> — diverse training data, domain experts, UI safety nets</li>
          </ul>
        </GlassCard>
        <GlassCard color="#E8C558" icon="flag" title="3. Eval → Launch Gate">
          <ul style={panelList}>
            <li><b>Tradeoffs</b> — speed vs accuracy assessed explicitly</li>
            <li><b>Thresholds</b> — acceptable cutoff bounds before ship</li>
            <li><b>Flywheel</b> — production data → eval &amp; monitoring → retraining data</li>
          </ul>
        </GlassCard>
      </div>
    </Panel>
  );
}

/** Reasoning-benchmark poster recreation (mutation → noise → robust reasoning). */
export function GsmSymbolicPanel() {
  return (
    <Panel
      title="Rethinking Benchmarks: Reasoning Beyond Training Data"
      sub="Static benchmarks leak into training data. Symbolic mutation and noise injection test whether models reason — or match patterns."
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <GlassBar
          color="#6A9BD8" icon="refresh" index="1." title="Symbolic Template Generator"
          detail="Static benchmark problems are mutated into dynamic symbolic variables — new numbers, names, and conditions over identical reasoning. Memorized answers stop working; only real reasoning transfers."
        />
        <GlassBar
          color="#E8836A" icon="zap" index="2." title="Noise Injection" badge="≈65% drop reported"
          detail="Irrelevant distractor clauses are injected into prompts. Accuracy falls steeply as noise rises — up to ~65% reported drop in autoregressive models, exposing pattern matching."
        />
        <GlassBar
          color="#A78BFA" icon="cpu" index="3." title="Pattern Matching vs Robust Reasoning"
          detail="Fragile path: test-time pattern matching. Robust path: test-time compute search plus code-interpreter verification and symbolic execution engines."
        />
      </div>
    </Panel>
  );
}

/* Shared framework panels (also used by the App.jsx component library). */

const fwPts = { fontSize: 12.5, color: '#CBD5E1', lineHeight: 1.65, margin: '6px 0 0', paddingLeft: 16 };
const fwFlow = { fontSize: 12, color: '#7FE3DC', marginTop: 8, lineHeight: 1.6 };

/** Composable chain: prompt | model | parser, plus tools and memory. */
export function LcelPipelinePanel() {
  return (
    <Panel
      title="Composable Pipeline — Prompt | Model | Parser"
      sub="Modular, declarative workflows: chain = prompt | model | output_parser, with tools and memory attached."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>
        <GlassCard color="#5EC4C8" icon="file" title="1. Prompts">
          <div style={fwFlow}>Topic + style → templates → formatted prompt.</div>
          <ul style={fwPts}>
            <li>System message templates</li>
            <li>User message templates</li>
          </ul>
        </GlassCard>
        <GlassCard color="#6A9BD8" icon="cpu" title="2. Chat Models">
          <div style={fwFlow}>Any chat model behind one interface.</div>
          <ul style={fwPts}>
            <li>Model choice + parameters</li>
            <li>Model response out</li>
          </ul>
        </GlassCard>
        <GlassCard color="#34D399" icon="check" title="3. Output Parsers">
          <div style={fwFlow}>Raw text → typed structure.</div>
          <ul style={fwPts}>
            <li>Plain-text extraction</li>
            <li>JSON-to-dict parsing</li>
            <li>Schema-validated objects</li>
          </ul>
        </GlassCard>
        <GlassCard color="#E8C558" icon="wrench" title="+ Tools & Memory">
          <ul style={fwPts}>
            <li>Agent executor: retriever, search, calculators</li>
            <li>Conversation buffer + history</li>
          </ul>
        </GlassCard>
      </div>
    </Panel>
  );
}

/** Stateful agent graph: nodes, edges, checkpoints, cyclic loop. */
export function StateGraphPanel() {
  return (
    <Panel
      title="Stateful Agent Graph — Nodes, Edges, Checkpoints"
      sub="Start → agent ⇄ tools in a cyclic feedback loop; every state transition checkpointed, interruptible for approval."
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <GlassBar color="#A78BFA" icon="cpu" index="1." title="Agent Node" detail="Brain, plan, choose tool. Emits state updates and next-step decisions into the shared state graph." />
        <GlassBar color="#5EC4C8" icon="zap" index="2." title="Tools Node + Cyclic Loop" detail="Executes chosen tools and API calls, then routes back — rejection and correction edges included — until the answer is final." />
        <GlassBar color="#E8C558" icon="file" index="3." title="Checkpoint Storage" detail="Durable checkpointer for long-term state plus volatile in-memory saver; interrupts pause for human approval; compiled graph ends with the final answer." />
      </div>
    </Panel>
  );
}

/** Classic RAG: index lane plus retrieve lane. */
export function RagIndexRetrievePanel() {
  return (
    <Panel
      title="RAG Indexing & Retrieval Architecture"
      sub="Index once up front; retrieve at runtime. Documents → chunks → embeddings → vector store; query → vector → search → augment → generate."
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <GlassBar color="#5EC4C8" icon="file" index="1." title="Indexing Lane" detail="Documents → chunking → embedding model → vectorized vectors → vector store nodes, indexed and ready." />
        <GlassBar color="#6A9BD8" icon="search" index="2." title="Retrieval Lane" detail="User → query → vectorize → search the store → retrieve nodes → augment the prompt with relevant contexts → model generates → response." />
      </div>
    </Panel>
  );
}

/** Hybrid retrieval: dense + keyword fusion, filters, rerank, top-10. */
export function HybridRetrievalPanel() {
  return (
    <Panel
      title="Hybrid Retrieval Pipeline — Dense + Keyword Fusion"
      sub="Semantic recall plus exact match, fused and filtered down to the ten best contexts."
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <GlassBar color="#5EC4C8" icon="search" index="1." title="Parallel Retrieval" detail="Dense vector search for semantic matching runs beside BM25 keyword search for exact matches such as identifiers and clause IDs." />
        <GlassBar color="#E8C558" icon="nodes" index="2." title="Fusion + Metadata Filters" detail="Reciprocal rank fusion merges both rankings; jurisdiction, effective-date, and access-control filters prune." />
        <GlassBar color="#34D399" icon="check" index="3." title="Rerank → Top 10" detail="Cross-encoder reranking scores the survivors; the top-10 contexts go to the model." badge="top-10" />
      </div>
    </Panel>
  );
}
