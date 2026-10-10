import React, { useMemo, useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  FACTS,
  ANALOGY,
  MECHANISM_STEPS,
  SCALE_POINTS,
  FIXES,
  LIMITS,
  CODE_SIM,
  CODE_BOTH_ORDERS,
  quizItems,
  isCorrect,
  scoreAnswers,
  simulateDirectionalRecall,
} from './reversalCurseEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#5B4B8A';
const RED = '#B4553A';
const AMBER = '#B9821F';

const SUBTABS = [
  { id: 'memory', icon: '↔️', label: '1. One-Way Memory', desc: 'A-is-B works, B-is-A fails' },
  { id: 'why', icon: '⚙️', label: '2. Why, Mechanically', desc: 'Only one side gets trained' },
  { id: 'scale', icon: '📏', label: '3. Scale Doesn\u2019t Fix It', desc: 'Bigger, still one-way' },
  { id: 'fix', icon: '🧰', label: '4. What To Do', desc: 'Both directions + retrieval' },
];

// ── SVG 1: asymmetry arrows ───────────────────────────────────
function AsymmetryDiagram() {
  return (
    <svg viewBox="0 0 560 220" width="100%" role="img"
      aria-label="Two boxes labeled A and B. The arrow from A to B is thick and solid; the arrow from B back to A is thin, dashed, and marked with a cross.">
      {/* nodes */}
      <rect x="24" y="70" width="130" height="80" rx="12" fill="#E6F3F3" stroke={TEAL} strokeWidth="2.5" />
      <text x="89" y="105" textAnchor="middle" fontSize="20" fontWeight="800" fill={TEAL_DARK}>A</text>
      <text x="89" y="128" textAnchor="middle" fontSize="11.5" fill="var(--ds-color-text-secondary)">subject seen</text>
      <rect x="406" y="70" width="130" height="80" rx="12" fill="#F3EFFA" stroke={PURPLE} strokeWidth="2.5" />
      <text x="471" y="105" textAnchor="middle" fontSize="20" fontWeight="800" fill={PURPLE}>B</text>
      <text x="471" y="128" textAnchor="middle" fontSize="11.5" fill="var(--ds-color-text-secondary)">answer given</text>
      {/* forward: thick solid */}
      <line x1="154" y1="92" x2="392" y2="92" stroke={TEAL} strokeWidth="6" strokeLinecap="round" />
      <polygon points="392,82 410,92 392,102" fill={TEAL} />
      <text x="273" y="80" textAnchor="middle" fontSize="12" fontWeight="700" fill={TEAL_DARK}>trained: A → B ✓</text>
      {/* reverse: thin dashed, broken */}
      <line x1="392" y1="130" x2="154" y2="130" stroke={RED} strokeWidth="2" strokeDasharray="7 6" strokeLinecap="round" />
      <polygon points="168,122 150,130 168,138" fill="none" stroke={RED} strokeWidth="2" />
      <text x="273" y="152" textAnchor="middle" fontSize="12" fontWeight="700" fill={RED}>never trained: B → A ✕</text>
      <text x="280" y="186" textAnchor="middle" fontSize="11.5" fill="var(--ds-color-text-tertiary)">
        Same fact, one direction practiced. The return trip was never walked.
      </text>
    </svg>
  );
}

// ── SVG 2: flat-across-sizes curve ────────────────────────────
const SW = 640, SH = 300, PL = 48, PR = 20, PT = 24, PB = 44;
function ssy(a) { return SH - PB - a * (SH - PT - PB); }
function ssx(i) { return PL + (i / (SCALE_POINTS.length - 1)) * (SW - PL - PR); }

function ScaleFlatCurve() {
  const fwdPts = SCALE_POINTS.map((p, i) => `${ssx(i).toFixed(1)},${ssy(p.forward).toFixed(1)}`).join(' ');
  const revPts = SCALE_POINTS.map((p, i) => `${ssx(i).toFixed(1)},${ssy(p.reverse).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${SW} ${SH}`} width="100%" role="img"
      aria-label="Line chart across four sizes: trained-direction accuracy stays near 95 percent and reverse accuracy stays near 12 percent. Both lines are flat.">
      {[0, 0.25, 0.5, 0.75, 1].map((a) => (
        <g key={a}>
          <line x1={PL} y1={ssy(a)} x2={SW - PR} y2={ssy(a)} stroke="#EEF1F4" />
          <text x={PL - 8} y={ssy(a) + 4} textAnchor="end" fontSize="11" fill="var(--ds-color-text-tertiary)">{Math.round(a * 100)}%</text>
        </g>
      ))}
      {SCALE_POINTS.map((p, i) => (
        <text key={p.size} x={ssx(i)} y={SH - PB + 20} textAnchor="middle" fontSize="11.5" fill="var(--ds-color-text-secondary)">{p.params}</text>
      ))}
      <text x={(SW + PL) / 2} y={SH - 4} textAnchor="middle" fontSize="11.5" fill="var(--ds-color-text-tertiary)">capacity →</text>
      <line x1={PL} y1={PT} x2={PL} y2={SH - PB} stroke="#CBD5E1" />
      <line x1={PL} y1={SH - PB} x2={SW - PR} y2={SH - PB} stroke="#CBD5E1" />
      <polyline points={fwdPts} fill="none" stroke={TEAL} strokeWidth="3" />
      <polyline points={revPts} fill="none" stroke={RED} strokeWidth="3" strokeDasharray="2 0" />
      {SCALE_POINTS.map((p, i) => (
        <g key={p.size}>
          <circle cx={ssx(i)} cy={ssy(p.forward)} r="5" fill={TEAL} style={{ transition: 'all var(--ds-motion-duration-base)' }} />
          <circle cx={ssx(i)} cy={ssy(p.reverse)} r="5" fill={RED} style={{ transition: 'all var(--ds-motion-duration-base)' }} />
        </g>
      ))}
      <line x1={SW - 235} y1={PT + 6} x2={SW - 210} y2={PT + 6} stroke={TEAL} strokeWidth="3" />
      <text x={SW - 204} y={PT + 10} fontSize="11.5" fill={TEAL_DARK}>trained direction ≈ 95%</text>
      <line x1={SW - 235} y1={PT + 24} x2={SW - 210} y2={PT + 24} stroke={RED} strokeWidth="3" />
      <text x={SW - 204} y={PT + 28} fontSize="11.5" fill={RED}>reverse ≈ 12%, flat</text>
    </svg>
  );
}

// ── Simulator 1: direction-flip quiz ──────────────────────────
function QuizSimulator() {
  const [direction, setDirection] = useState('forward');
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const items = useMemo(() => quizItems(direction), [direction]);
  const result = useMemo(
    () => (checked ? scoreAnswers(answers, direction) : null),
    [checked, answers, direction],
  );

  const flip = (next) => {
    setDirection(next);
    setAnswers({});
    setChecked(false);
  };

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🔄 Simulator — Answer the same facts both ways</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Type short answers to all {FACTS.length} questions, check your score, then flip direction and try the same facts reversed.
            Illustrative numbers only — this quizzes you, to make the asymmetry tangible.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['forward', 'reverse'].map((d) => (
            <button key={d} onClick={() => flip(d)}
              style={{
                padding: '8px 16px', borderRadius: 'var(--ds-radius-md)', cursor: 'pointer',
                border: direction === d ? `2px solid ${TEAL}` : '1px solid var(--ds-color-border-default)',
                background: direction === d ? '#E6F3F3' : 'var(--ds-color-bg-canvas)',
                color: direction === d ? TEAL_DARK : 'var(--ds-color-text-secondary)',
                fontWeight: direction === d ? 700 : 500,
                transition: 'all var(--ds-motion-duration-base)',
              }}>
              {d === 'forward' ? 'A → B (trained order)' : 'B → A (reversed)'}
            </button>
          ))}
          <Badge variant="default">{direction === 'forward' ? 'familiar cue' : 'unfamiliar cue'}</Badge>
        </div>
        <Stack gap={4}>
          {items.map((it) => {
            const ok = checked ? isCorrect(answers[it.id] || '', it.a) : null;
            return (
              <div key={it.id} style={{
                padding: 12, borderRadius: 'var(--ds-radius-md)',
                border: `1px solid ${checked ? (ok ? TEAL : RED) : 'var(--ds-color-border-subtle)'}`,
                background: 'var(--ds-color-bg-canvas)',
                transition: 'border-color var(--ds-motion-duration-base)',
              }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ds-color-text-primary)', marginBottom: 6 }}>{it.q}</div>
                <input value={answers[it.id] || ''}
                  onChange={(e) => { setAnswers({ ...answers, [it.id]: e.target.value }); setChecked(false); }}
                  placeholder="Type your answer…"
                  aria-label={it.q}
                  style={{
                    width: '100%', boxSizing: 'border-box', padding: '8px 10px',
                    borderRadius: 'var(--ds-radius-sm)', border: '1px solid var(--ds-color-border-default)',
                    fontSize: 13.5, background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)',
                  }} />
                {checked && (
                  <div style={{ marginTop: 6, fontSize: 12.5, color: ok ? TEAL_DARK : RED }}>
                    {ok ? '✓ Correct' : `✕ Expected: ${it.a}`}
                  </div>
                )}
              </div>
            );
          })}
        </Stack>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setChecked(true)}
            style={{ padding: '10px 20px', borderRadius: 'var(--ds-radius-md)', border: 'none', background: TEAL, color: '#062A2B', fontWeight: 700, cursor: 'pointer' }}>
            Check score
          </button>
          <button onClick={() => { setAnswers({}); setChecked(false); }}
            style={{ padding: '10px 20px', borderRadius: 'var(--ds-radius-md)', border: '1px solid var(--ds-color-border-default)', background: 'var(--ds-color-bg-canvas)', color: 'var(--ds-color-text-secondary)', cursor: 'pointer' }}>
            Reset
          </button>
        </div>
        {result && (
          <Callout type={result.acc >= 0.8 ? 'success' : result.acc >= 0.4 ? 'warning' : 'danger'} title={`Scoreboard: ${result.correct}/${result.total} (${Math.round(result.acc * 100)}%)`}>
            {direction === 'forward'
              ? 'This is the practiced direction — the cue matches how the sentence was learned.'
              : 'Same facts, flipped cues. If this felt harder, that gap is the reversal curse in miniature.'}
            {' '}Now flip direction and compare.
          </Callout>
        )}
      </Stack>
    </Card>
  );
}

// ── Simulator 2: train-one-direction ──────────────────────────
function TrainSim() {
  const [pairs, setPairs] = useState(8);
  const [seed, setSeed] = useState(7);
  const sim = useMemo(() => simulateDirectionalRecall({ pairCount: pairs, seed }), [pairs, seed]);
  const fwdPct = Math.round(sim.trainedAcc * 100);
  const revPct = Math.round(sim.reverseAcc * 100);

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🧪 Simulator — Train one direction, quiz both</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            A tiny associative memory learns cue → answer links one way only. Drag the sliders: the trained bar stays pinned
            near 100% while the reverse bar hovers around chance. Deterministic — same seed, same bars.
          </p>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ds-color-text-primary)' }}>Fact pairs</span>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: TEAL_DARK }}>{pairs}</span>
          </div>
          <input type="range" min={3} max={16} step={1} value={pairs} onChange={(e) => setPairs(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: TEAL, cursor: 'pointer' }} aria-label="Fact pairs" />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ds-color-text-primary)' }}>Seed</span>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: TEAL_DARK }}>{seed}</span>
          </div>
          <input type="range" min={1} max={20} step={1} value={seed} onChange={(e) => setSeed(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: PURPLE, cursor: 'pointer' }} aria-label="Seed" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
              <span style={{ fontWeight: 700, color: TEAL_DARK }}>Trained direction (A → B)</span>
              <span style={{ fontWeight: 700, color: TEAL_DARK }}>{fwdPct}%</span>
            </div>
            <div style={{ height: 14, borderRadius: 7, background: 'var(--ds-color-bg-canvas)', border: '1px solid var(--ds-color-border-subtle)' }}>
              <div style={{ height: '100%', width: `${fwdPct}%`, borderRadius: 7, background: TEAL, transition: 'width var(--ds-motion-duration-base)' }} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
              <span style={{ fontWeight: 700, color: RED }}>Reverse (B → A)</span>
              <span style={{ fontWeight: 700, color: RED }}>{revPct}% (chance ≈ {Math.round(sim.chance * 100)}%)</span>
            </div>
            <div style={{ height: 14, borderRadius: 7, background: 'var(--ds-color-bg-canvas)', border: '1px solid var(--ds-color-border-subtle)' }}>
              <div style={{ height: '100%', width: `${revPct}%`, borderRadius: 7, background: RED, transition: 'width var(--ds-motion-duration-base)' }} />
            </div>
          </div>
        </div>
        <Callout type="info" title="Read the gap">
          Trained accuracy <strong>{fwdPct}%</strong> vs reverse <strong>{revPct}%</strong> over {sim.pairCount} pairs
          (vocabulary {sim.vocabSize}, seed {sim.seed}). No seed or size rescues the reverse bar — the link was never written,
          so there is nothing for scale to amplify.
        </Callout>
      </Stack>
    </Card>
  );
}

export default function ReversalCurseTab() {
  const [activeSubTab, setActiveSubTab] = useState('memory');

  const mechanismColumns = [
    { key: 'step', header: 'Step' },
    { key: 'what', header: 'What happens', sortable: false },
    { key: 'why', header: 'Why it matters', sortable: false },
  ];

  const scaleColumns = [
    { key: 'params', header: 'Capacity' },
    { key: 'forward', header: 'Trained direction', render: (v) => <span style={{ color: TEAL_DARK, fontWeight: 700 }}>{Math.round(v * 100)}%</span> },
    { key: 'reverse', header: 'Reverse', render: (v) => <span style={{ color: RED, fontWeight: 700 }}>{Math.round(v * 100)}%</span> },
  ];

  const fixColumns = [
    { key: 'fix', header: 'Fix' },
    { key: 'how', header: 'How', sortable: false },
    { key: 'cost', header: 'Cost / catch', sortable: false },
  ];

  const limitColumns = [
    { key: 'limit', header: 'Limit of the demo', sortable: false },
    { key: 'note', header: 'Honest note', sortable: false },
  ];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="foundations"
        moduleLabel="Foundations [Memory Asymmetry]"
        title="The Reversal Curse: Learned One Way, Lost the Other"
        description="Large-model studies found a stubborn asymmetry: train on facts phrased as “A is B” and the model answers “what is A?” fluently — then fails “what is B?”. The link was written in one direction only, and recall cannot walk it backwards."
        metrics={[
          { label: 'Trained direction (illustrative)', value: '~95%' },
          { label: 'Reversed direction (illustrative)', value: '~12%' },
          { label: 'New data needed to see it', value: '0' },
          { label: 'Fix that adds parameters', value: 'None' },
        ]}
      />

      <Container size="wide">
        <div style={{
          display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)',
          background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)',
          borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto',
        }}>
          {SUBTABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1, minWidth: '190px', padding: 'var(--ds-space-3) var(--ds-space-4)',
                borderRadius: 'var(--ds-radius-md)',
                border: activeSubTab === tab.id ? `2px solid ${TEAL}` : '1px solid transparent',
                background: activeSubTab === tab.id ? '#E6F3F3' : 'transparent',
                color: activeSubTab === tab.id ? TEAL_DARK : 'var(--ds-color-text-secondary)',
                cursor: 'pointer', textAlign: 'left', transition: 'all var(--ds-motion-duration-base)',
                fontWeight: activeSubTab === tab.id ? 700 : 500,
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--ds-font-size-body)', marginBottom: 2 }}>
                <span>{tab.icon}</span><span>{tab.label}</span>
              </div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>{tab.desc}</div>
            </button>
          ))}
        </div>

        {activeSubTab === 'memory' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>The asymmetry in one picture</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Training writes a forward association from the subject to the answer. The reverse association is a
                different pathway — and it was never trained, so it stays near chance.
              </p>
              <AsymmetryDiagram />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>{ANALOGY.title}</h3>
                  <p style={{ margin: '6px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)', lineHeight: 1.7 }}>
                    {ANALOGY.body}
                  </p>
                </div>
                <Callout type="tip" title="Try it on yourself first">
                  Learn this sentence once: “The harbor ledger is stamped with a copper gull.” Now, without re-reading:
                  what is stamped with a copper gull? Most people hesitate for a beat — a model trained one-way hesitates forever.
                </Callout>
              </Stack>
            </Card>

            <QuizSimulator />
          </Stack>
        )}

        {activeSubTab === 'why' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Why, mechanically — in four steps</h3>
              <Table columns={mechanismColumns} data={MECHANISM_STEPS} sortable={false} />
            </Card>
            <TrainSim />
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>The toy trainer, annotated</h3>
              <p style={{ margin: '0 0 10px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                The critical line is the comment: one row of the memory is updated, the other is never touched.
                Next-word training works the same way at scale — the loss only rewards continuing from the subject side.
              </p>
              <CodeBlock language="javascript" code={CODE_SIM} />
            </Card>
          </Stack>
        )}

        {activeSubTab === 'scale' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Bigger models, same flat gap</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Illustrative numbers: trained-direction recall climbs slightly with capacity while reverse recall stays
                pinned near chance. Capacity was never the bottleneck — the training objective never asks for the reverse link.
              </p>
              <ScaleFlatCurve />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Illustrative scores across sizes</h3>
              <Table columns={scaleColumns} data={SCALE_POINTS} sortable={false} />
            </Card>
            <Callout type="warning" title="Why more parameters cannot help">
              Scale amplifies what the objective rewards. If the loss never requires “given B, produce A”, extra capacity
              builds a stronger one-way street — not a return lane. The missing gradient, not the missing size, is the story.
            </Callout>
          </Stack>
        )}

        {activeSubTab === 'fix' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>What to do about one-way memory</h3>
              <Table columns={fixColumns} data={FIXES} sortable={false} />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Symmetry fix in code</h3>
              <p style={{ margin: '0 0 10px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Either teach the return trip explicitly, or stop relying on parametric memory and look the fact up from either end.
              </p>
              <CodeBlock language="javascript" code={CODE_BOTH_ORDERS} />
            </Card>
            <Callout type="info" title="Contrast with grokking: learned late vs never linked">
              Grokking is delayed structure: the general circuit eventually forms and test accuracy clicks upward with no new
              data. The reversal curse is the opposite — the reverse link never forms at all, no matter how long training runs,
              because nothing in the objective rewards it. One is “eventually learned”; the other is “never asked for”.
              Both warn against reading a single scoreboard number as understanding.
            </Callout>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <Stack gap={4}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ margin: 0 }}>Honest limits of these toy demos</h3>
                  <Badge variant="default">illustrative only</Badge>
                </div>
                <Table columns={limitColumns} data={LIMITS} sortable={false} />
              </Stack>
            </Card>
            <Callout type="danger" title="Operational rule">
              Never certify recall with forward-only questions. Quiz every high-stakes fact in both directions — and where
              symmetry matters, retrieve the fact from a store instead of trusting a one-way memory trace.
            </Callout>
          </Stack>
        )}
      </Container>
    </div>
  );
}
