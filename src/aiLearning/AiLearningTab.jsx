import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  KNOWING_PHASES,
  VOICE_EXPLORATION_STEPS,
  SKILL_ANATOMY_FIELDS,
  EXAMPLE_SKILLS,
  REVIEW_INTERVAL_PRESETS,
  ATTENTION_FORMATS,
  DAILY_QUIZ_AUTOMATION,
  getPhaseById,
  nextPhaseId,
  buildSkill,
  estimateRetention,
  forgettingRetention,
  triageTopic,
  getFormatsForAttention,
  buildDailyQuiz,
} from './aiLearningEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#5B4B8A';
const RED = '#B4553A';
const AMBER = '#B9821F';

const bodyText = { color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)', lineHeight: 1.65 };
const headingText = { color: 'var(--ds-color-text-primary)', margin: 0 };
const mutedText = { color: 'var(--ds-color-text-tertiary)', fontSize: 'var(--ds-font-size-caption)' };

function PhaseLoopDiagram({ activeId }) {
  const nodes = [
    { id: 'unknown-unknowns', x: 200, y: 44, color: RED },
    { id: 'known-unknowns', x: 340, y: 140, color: AMBER },
    { id: 'known-knowns', x: 200, y: 236, color: TEAL },
    { id: 'unknown-knowns', x: 60, y: 140, color: PURPLE },
  ];
  return (
    <svg viewBox="0 0 400 280" style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Learning lifecycle loop through four phases of knowing">
      <ellipse cx="200" cy="140" rx="118" ry="76" fill="none" stroke={TEAL} strokeWidth="2" strokeDasharray="7 6" opacity="0.55" />
      <line x1="318" y1="72" x2="300" y2="66" stroke={TEAL} strokeWidth="2" />
      <line x1="318" y1="72" x2="310" y2="88" stroke={TEAL} strokeWidth="2" />
      {nodes.map((n) => {
        const phase = getPhaseById(n.id);
        const active = activeId === n.id;
        return (
          <g key={n.id} style={{ transition: 'all 0.3s ease', cursor: 'default' }}>
            <circle
              cx={n.x}
              cy={n.y}
              r={active ? 44 : 36}
              fill="var(--ds-color-bg-surface)"
              stroke={n.color}
              strokeWidth={active ? 4 : 2.5}
              style={{ transition: 'all 0.3s ease' }}
            />
            <text x={n.x} y={n.y - 4} textAnchor="middle" style={{ fontSize: 11, fontWeight: 700, fill: 'var(--ds-color-text-primary)' }}>
              {phase.index + 1}
            </text>
            <text x={n.x} y={n.y + 12} textAnchor="middle" style={{ fontSize: 9, fontWeight: 600, fill: 'var(--ds-color-text-secondary)' }}>
              {phase.name.split(' ')[0]}
            </text>
          </g>
        );
      })}
      <text x="200" y="140" textAnchor="middle" style={{ fontSize: 11, fontWeight: 700, fill: 'var(--ds-color-text-secondary)' }}>
        loop
      </text>
    </svg>
  );
}

function ForgettingCurveDiagram() {
  const w = 420;
  const h = 220;
  const pad = 36;
  const x = (d) => pad + (d / 14) * (w - pad * 2);
  const y = (r) => h - pad - (r / 100) * (h - pad * 2);
  const days = [0, 1, 2, 3, 5, 7, 10, 14];
  const pts = days.map((d) => `${x(d)},${y(forgettingRetention(d))}`).join(' ');
  const reviewPts = `${x(0)},${y(100)} ${x(3)},${y(forgettingRetention(3))} ${x(3)},${y(92)} ${x(7)},${y(62)} ${x(7)},${y(90)} ${x(11)},${y(60)}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Forgetting curve with and without review">
      <line x1={pad} y1={pad - 10} x2={pad} y2={h - pad} stroke="var(--ds-color-border-subtle)" strokeWidth="1.5" />
      <line x1={pad} y1={h - pad} x2={w - pad + 14} y2={h - pad} stroke="var(--ds-color-border-subtle)" strokeWidth="1.5" />
      <text x={8} y={pad} style={{ fontSize: 10, fill: 'var(--ds-color-text-tertiary)' }}>100%</text>
      <text x={14} y={h - pad} style={{ fontSize: 10, fill: 'var(--ds-color-text-tertiary)' }}>0%</text>
      <text x={x(14)} y={h - 12} style={{ fontSize: 10, fill: 'var(--ds-color-text-tertiary)' }}>day 14</text>
      <polyline points={pts} fill="none" stroke={RED} strokeWidth="3" strokeLinecap="round" style={{ transition: 'all 0.3s ease' }} />
      <polyline points={reviewPts} fill="none" stroke={TEAL} strokeWidth="3" strokeLinecap="round" strokeDasharray="1 0" style={{ transition: 'all 0.3s ease' }} />
      {[3, 7].map((d) => (
        <circle key={d} cx={x(d)} cy={y(90)} r="5" fill={TEAL_DARK} stroke="var(--ds-color-bg-surface)" strokeWidth="2" />
      ))}
      <text x={x(9)} y={y(30)} style={{ fontSize: 11, fontWeight: 600, fill: RED }}>no review: fades</text>
      <text x={x(7.5)} y={y(96)} style={{ fontSize: 11, fontWeight: 600, fill: TEAL_DARK }}>with review: lifts</text>
    </svg>
  );
}

const SUBTABS = [
  { id: 'phases', icon: '🧭', label: '1. Four Phases', desc: 'Name your stage + explore by voice' },
  { id: 'skills', icon: '🧩', label: '2. Reusable Skills', desc: 'Build skills you can run again' },
  { id: 'remember', icon: '🧠', label: '3. Remember It', desc: 'Spaced repetition + daily recall' },
  { id: 'triage', icon: '🎯', label: '4. Triage + Plan', desc: 'Filter noise, match format to focus' },
];

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 'var(--ds-radius-sm)',
  border: '1px solid var(--ds-color-border-subtle)',
  background: 'var(--ds-color-bg-canvas)',
  color: 'var(--ds-color-text-primary)',
  fontSize: 'var(--ds-font-size-bodySm)',
};

export default function AiLearningTab() {
  const [activeSubTab, setActiveSubTab] = useState('phases');
  const [activePhase, setActivePhase] = useState('unknown-unknowns');
  const [skillFields, setSkillFields] = useState({ purpose: '', inputs: '', process: '', outputFormat: '', qualityChecks: '' });
  const [skillResult, setSkillResult] = useState(null);
  const [picked, setPicked] = useState([1, 3, 7]);
  const [quizTopic, setQuizTopic] = useState('photosynthesis');
  const [quizDays, setQuizDays] = useState(3);
  const [triage, setTriage] = useState({ isNew: true, isRelevant: true, hasEvidence: false });

  const phase = getPhaseById(activePhase) || KNOWING_PHASES[0];
  const retention = estimateRetention(picked);
  const quiz = buildDailyQuiz(quizTopic || 'your topic', quizDays);
  const verdict = triageTopic(triage);

  const toggleInterval = (n) => {
    setPicked((prev) => (prev.includes(n) ? prev.filter((v) => v !== n) : [...prev, n].sort((a, b) => a - b)));
  };

  const attentionColumns = [
    { key: 'attention', header: 'Situation' },
    { key: 'minutes', header: 'Minutes' },
    { key: 'energy', header: 'Energy' },
    { key: 'best', header: 'Best format' },
    { key: 'avoid', header: 'Avoid' },
  ];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="ai_learning"
        moduleLabel="Learning Lab — Study Systems"
        title="Learn Faster with AI: Explore, Systemize, Remember"
        description="A four-part loop for turning confusion into durable skill: map where you stand, talk through the messy start, package repeatable methods as reusable skills, and lock gains in with spaced recall."
        metrics={[
          { label: 'Phases', value: '4' },
          { label: 'Anatomy fields', value: '5' },
          { label: 'Example skills', value: '3' },
          { label: 'Daily questions', value: '3' },
        ]}
      />

      <Container size="wide">
        <div style={{
          display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)',
          background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)',
          borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto',
        }}>
          {SUBTABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1, minWidth: '210px', padding: 'var(--ds-space-3) var(--ds-space-4)',
                borderRadius: 'var(--ds-radius-md)',
                border: activeSubTab === tab.id ? `1px solid ${TEAL}` : '1px solid transparent',
                background: activeSubTab === tab.id ? 'rgba(58,155,159,0.14)' : 'transparent',
                color: 'var(--ds-color-text-secondary)',
                cursor: 'pointer', textAlign: 'left',
                transition: 'all var(--ds-motion-duration-base)',
                fontWeight: activeSubTab === tab.id ? 'var(--ds-font-weight-semibold)' : 'var(--ds-font-weight-medium)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--ds-font-size-body)', marginBottom: '2px', color: 'var(--ds-color-text-primary)' }}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{tab.desc}</div>
            </button>
          ))}
        </div>

        {activeSubTab === 'phases' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={headingText}>🧭 The four phases of knowing</h3>
                  <p style={bodyText}>Learning stalls when you study the wrong phase. Name your stage first, then pick the move that fits. Mastery loops: fluency reveals fresh blind spots.</p>
                </div>
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                    <PhaseLoopDiagram activeId={activePhase} />
                    <p style={mutedText}>Lifecycle loop: unknown-unknowns → known-unknowns → known-knowns → unknown-knowns → new unknowns.</p>
                  </Card>
                  <Stack gap={3}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {KNOWING_PHASES.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setActivePhase(p.id)}
                          style={{
                            padding: '6px 12px', borderRadius: 'var(--ds-radius-full)', cursor: 'pointer',
                            border: activePhase === p.id ? `2px solid ${TEAL}` : '1px solid var(--ds-color-border-subtle)',
                            background: activePhase === p.id ? 'rgba(58,155,159,0.14)' : 'var(--ds-color-bg-surface)',
                            color: 'var(--ds-color-text-primary)', fontSize: 'var(--ds-font-size-bodySm)',
                            transition: 'all 0.25s ease',
                          }}
                        >
                          {p.index + 1}. {p.name}
                        </button>
                      ))}
                    </div>
                    <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${TEAL}` }}>
                      <Badge variant="default" size="sm">Phase {phase.index + 1} of 4</Badge>
                      <h4 style={{ ...headingText, marginTop: 8 }}>{phase.name}</h4>
                      <p style={bodyText}>{phase.tagline} Signal: {phase.signal}</p>
                      <p style={bodyText}><strong style={{ color: 'var(--ds-color-text-primary)' }}>Voice move:</strong> {phase.voiceMove}</p>
                      <p style={mutedText}>Next: {nextPhaseId(phase.id)} (the loop continues)</p>
                    </Card>
                  </Stack>
                </Grid>
                <Callout type="tip">
                  <strong>Voice mode is for the messy start.</strong> When thoughts are half-formed, speaking beats typing: externalize the ramble, then ask for a roadmap back. Five spoken minutes can surface the question list that ten silent minutes hide.
                </Callout>
                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  {VOICE_EXPLORATION_STEPS.map((s, i) => (
                    <Card key={s.id} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)', borderTop: `3px solid ${i < 2 ? RED : i < 4 ? AMBER : TEAL}`, transition: 'transform 0.25s ease' }}>
                      <Badge variant="default" size="sm">Step {i + 1}</Badge>
                      <div style={{ fontWeight: 700, marginTop: 6, color: 'var(--ds-color-text-primary)', fontSize: 'var(--ds-font-size-bodySm)' }}>{s.title}</div>
                      <div style={bodyText}>{s.detail}</div>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {activeSubTab === 'skills' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={headingText}>🧩 Reusable skills beat one-off answers</h3>
                  <p style={bodyText}>An answer helps once. A skill helps every time. Package any repeatable method in five fields so a future session can run it without reinventing it.</p>
                </div>
                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  {SKILL_ANATOMY_FIELDS.map((f, i) => (
                    <Card key={f.id} style={{ padding: 'var(--ds-space-3)', background: 'var(--ds-color-bg-surface)', borderTop: `3px solid ${[TEAL, TEAL_DARK, PURPLE, RED, AMBER][i % 5]}` }}>
                      <Badge variant="default" size="sm">{f.label}</Badge>
                      <div style={{ ...bodyText, marginTop: 6 }}>{f.description}</div>
                    </Card>
                  ))}
                </Grid>
                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  {EXAMPLE_SKILLS.map((s) => (
                    <Card key={s.id} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                      <Badge variant="default" size="sm">Example skill</Badge>
                      <div style={{ fontWeight: 700, marginTop: 6, color: 'var(--ds-color-text-primary)' }}>{s.name}</div>
                      <div style={bodyText}>{s.purpose}.</div>
                      <div style={{ ...bodyText, marginTop: 6 }}><strong style={{ color: 'var(--ds-color-text-primary)' }}>Process:</strong> {s.process}.</div>
                      <div style={{ ...bodyText, marginTop: 4 }}><strong style={{ color: 'var(--ds-color-text-primary)' }}>Output:</strong> {s.outputFormat}.</div>
                      <div style={{ ...mutedText, marginTop: 6 }}>{s.whenToUse}</div>
                      <div style={{ ...mutedText, marginTop: 2 }}>{s.doNotUse}</div>
                    </Card>
                  ))}
                </Grid>
                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <Stack gap={3}>
                    <strong style={{ color: 'var(--ds-color-text-primary)', fontSize: 'var(--ds-font-size-bodySm)' }}>⚙️ Skill-builder simulator — fill the 5 fields, generate a skill card</strong>
                    <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                      {SKILL_ANATOMY_FIELDS.map((f) => (
                        <div key={f.id}>
                          <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: 4, color: 'var(--ds-color-text-secondary)' }}>{f.label}</label>
                          <input
                            type="text"
                            placeholder={f.placeholder}
                            value={skillFields[f.id]}
                            onChange={(e) => setSkillFields({ ...skillFields, [f.id]: e.target.value })}
                            style={inputStyle}
                          />
                        </div>
                      ))}
                    </Grid>
                    <div>
                      <button
                        onClick={() => setSkillResult(buildSkill(skillFields))}
                        style={{ padding: '10px 18px', borderRadius: 'var(--ds-radius-md)', border: `1px solid ${TEAL_DARK}`, background: 'rgba(58,155,159,0.14)', color: 'var(--ds-color-text-primary)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.25s ease' }}
                      >
                        Generate skill card
                      </button>
                    </div>
                    {skillResult && !skillResult.ok && (
                      <Callout type="warning">
                        <strong>Missing fields:</strong> {skillResult.errors.join(', ')}. Fill all five to generate the card.
                      </Callout>
                    )}
                    {skillResult && skillResult.ok && (
                      <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-canvas)', borderLeft: `4px solid ${PURPLE}` }}>
                        <Badge variant="default" size="sm">Generated skill</Badge>
                        <h4 style={{ ...headingText, marginTop: 8 }}>{skillResult.skill.title}</h4>
                        <p style={bodyText}>{skillResult.skill.summary}</p>
                        <p style={bodyText}><strong style={{ color: 'var(--ds-color-text-primary)' }}>When to use:</strong> {skillResult.skill.whenToUse}</p>
                        <p style={bodyText}><strong style={{ color: 'var(--ds-color-text-primary)' }}>Do not use:</strong> {skillResult.skill.doNotUse}</p>
                      </Card>
                    )}
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {activeSubTab === 'remember' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={headingText}>🧠 Remember it: spaced repetition + active recall</h3>
                  <p style={bodyText}>Memory fades on a curve, not a cliff. Each effortful recall lifts the curve; each interval stretches how long the lift lasts. Quiz yourself before checking answers.</p>
                </div>
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                    <ForgettingCurveDiagram />
                    <p style={mutedText}>Red: no review ({forgettingRetention(7)}% left on day 7). Teal dots: reviews that lift retention back up.</p>
                  </Card>
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                    <Stack gap={3}>
                      <strong style={{ color: 'var(--ds-color-text-primary)', fontSize: 'var(--ds-font-size-bodySm)' }}>📅 Interval scheduler simulator — pick review gaps</strong>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {[1, 2, 4, 7, 14, 30].map((n) => (
                          <button
                            key={n}
                            onClick={() => toggleInterval(n)}
                            style={{
                              padding: '6px 12px', borderRadius: 'var(--ds-radius-full)', cursor: 'pointer',
                              border: picked.includes(n) ? `2px solid ${TEAL_DARK}` : '1px solid var(--ds-color-border-subtle)',
                              background: picked.includes(n) ? 'rgba(58,155,159,0.16)' : 'var(--ds-color-bg-canvas)',
                              color: 'var(--ds-color-text-primary)', fontSize: 'var(--ds-font-size-bodySm)',
                              transition: 'all 0.25s ease',
                            }}
                          >
                            +{n}d
                          </button>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {REVIEW_INTERVAL_PRESETS.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setPicked([...p.intervals])}
                            style={{ padding: '6px 10px', borderRadius: 'var(--ds-radius-sm)', border: '1px solid var(--ds-color-border-subtle)', background: 'var(--ds-color-bg-canvas)', color: 'var(--ds-color-text-secondary)', cursor: 'pointer', fontSize: 'var(--ds-font-size-caption)', transition: 'all 0.25s ease' }}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                      {retention.ok ? (
                        <div>
                          <div style={{ fontSize: '2rem', fontWeight: 800, color: TEAL_DARK }}>{retention.estimatedRetention}%</div>
                          <div style={bodyText}>Estimated retention after {retention.reviews} reviews · avg gap {retention.averageGap} days · <strong style={{ color: 'var(--ds-color-text-primary)' }}>{retention.level}</strong></div>
                        </div>
                      ) : (
                        <Callout type="warning">Pick at least one interval to estimate retention.</Callout>
                      )}
                    </Stack>
                  </Card>
                </Grid>
                <Callout type="info">
                  <strong>Active-recall rule:</strong> questions first, answers after, varied daily. Answering from memory — even imperfectly — beats re-reading. Vary the focus (recall → apply → teach-back) so each day stays effortful.
                </Callout>
                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <Stack gap={3}>
                    <strong style={{ color: 'var(--ds-color-text-primary)', fontSize: 'var(--ds-font-size-bodySm)' }}>❓ Daily-quiz planner — questions before answers</strong>
                    <Grid columns={{ base: '1fr', md: '2fr 1fr' }} gap="var(--ds-space-3)">
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: 4, color: 'var(--ds-color-text-secondary)' }}>Topic</label>
                        <input type="text" value={quizTopic} onChange={(e) => setQuizTopic(e.target.value)} style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: 4, color: 'var(--ds-color-text-secondary)' }}>Days (1–5)</label>
                        <input type="number" min="1" max="5" value={quizDays} onChange={(e) => setQuizDays(Number(e.target.value))} style={inputStyle} />
                      </div>
                    </Grid>
                    {quiz.ok && (
                      <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                        {quiz.plan.map((d) => (
                          <Card key={d.day} style={{ padding: 'var(--ds-space-3)', background: 'var(--ds-color-bg-canvas)', borderTop: `3px solid ${TEAL}` }}>
                            <Badge variant="default" size="sm">Day {d.day} · {d.focus}</Badge>
                            <ol style={{ ...bodyText, paddingLeft: 18, margin: '8px 0 0' }}>
                              {d.questions.map((q, i) => <li key={i}>{q}</li>)}
                            </ol>
                          </Card>
                        ))}
                      </Grid>
                    )}
                  </Stack>
                </Card>
                <Stack gap={3}>
                  <strong style={{ color: 'var(--ds-color-text-primary)', fontSize: 'var(--ds-font-size-bodySm)' }}>Automation pattern: scheduled daily quiz</strong>
                  <CodeBlock language="javascript" code={DAILY_QUIZ_AUTOMATION} />
                </Stack>
              </Stack>
            </Card>
          </Stack>
        )}

        {activeSubTab === 'triage' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={headingText}>🎯 Triage before you dive</h3>
                  <p style={bodyText}>New material competes for fixed attention. Run two filters — is it new, is it relevant — then commit: go deep, park it, or revisit once evidence exists.</p>
                </div>
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                    <Stack gap={3}>
                      <strong style={{ color: 'var(--ds-color-text-primary)', fontSize: 'var(--ds-font-size-bodySm)' }}>Filter simulator — triage a topic</strong>
                      {[['isNew', 'Is it new to you?'], ['isRelevant', 'Is it relevant to current goals?'], ['hasEvidence', 'Is there evidence it works?']].map(([key, label]) => (
                        <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                          <input
                            type="checkbox"
                            checked={triage[key]}
                            onChange={() => setTriage({ ...triage, [key]: !triage[key] })}
                            style={{ width: 18, height: 18, accentColor: TEAL }}
                          />
                          {label}
                        </label>
                      ))}
                      <Card style={{ padding: 'var(--ds-space-3)', background: 'var(--ds-color-bg-canvas)', borderLeft: `4px solid ${verdict.decision === 'go-deep' ? TEAL : verdict.decision === 'park' ? AMBER : PURPLE}` }}>
                        <Badge variant="default" size="sm">{verdict.decision}</Badge>
                        <div style={{ ...bodyText, marginTop: 6 }}>{verdict.reason}</div>
                        <div style={{ ...mutedText, marginTop: 4 }}>Next: {verdict.nextAction}</div>
                      </Card>
                    </Stack>
                  </Card>
                  <Stack gap={3}>
                    <Callout type={verdict.decision === 'go-deep' ? 'success' : verdict.decision === 'park' ? 'warning' : 'info'}>
                      <strong>Decision: {verdict.decision}.</strong> {getFormatsForAttention('focused') ? 'Focused blocks are reserved for go-deep topics only.' : ''}
                    </Callout>
                    <Callout type="tip">
                      <strong>Parking is progress.</strong> A parked topic with a one-line note costs nothing and removes the background worry that you might forget it.
                    </Callout>
                  </Stack>
                </Grid>
                <Stack gap={3}>
                  <strong style={{ color: 'var(--ds-color-text-primary)', fontSize: 'var(--ds-font-size-bodySm)' }}>Match the format to your attention</strong>
                  <Table columns={attentionColumns} data={ATTENTION_FORMATS} sortable={false} />
                </Stack>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
