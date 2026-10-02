import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  PHASES,
  CRAM_VS_UNDERSTAND,
  PROGRESS_MEASURES,
  LESSONS,
  trainAccAt,
  testAccAt,
  phaseAt,
  CODE_TRAIN,
  CODE_EARLYSTOP,
  CODE_PROGRESS,
} from './grokkingEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#9B89C4';
const PURPLE_DARK = '#5B4B8A';

const SUBTABS = [
  { id: 'timeline', icon: '📈', label: '1. The Two Curves', desc: 'Memorize → plateau → click' },
  { id: 'inside', icon: '🌀', label: '2. Inside the Click', desc: 'Circle positions + rotation' },
  { id: 'simulator', icon: '⏱️', label: '3. Early-Stopping Simulator', desc: 'Stop too soon, judge wrong' },
  { id: 'code', icon: '🛠️', label: '4. Code & Lessons', desc: 'Train, trap, progress probes' },
];

const W = 920, H = 380, PAD_L = 56, PAD_R = 24, PAD_T = 24, PAD_B = 48;
const MAX_STEPS = 30000;

function sx(s) { return PAD_L + (s / MAX_STEPS) * (W - PAD_L - PAD_R); }
function sy(a) { return H - PAD_B - a * (H - PAD_T - PAD_B); }
function curve(fn) {
  const pts = [];
  for (let s = 0; s <= MAX_STEPS; s += 250) pts.push(`${sx(s).toFixed(1)},${sy(fn(s)).toFixed(1)}`);
  return pts.join(' ');
}

function TimelineChart() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
      aria-label="Training accuracy reaches 100 percent within 1000 steps while test accuracy stays near 10 percent until around 9000 steps, then jumps to nearly 100 percent by 20000 steps">
      {/* plateau band */}
      <rect x={sx(1000)} y={PAD_T} width={sx(9000) - sx(1000)} height={H - PAD_T - PAD_B}
        fill="#F5F3FA" />
      <text x={(sx(1000) + sx(9000)) / 2} y={PAD_T + 16} textAnchor="middle" fontSize="11.5" fill={PURPLE_DARK} fontWeight="600">
        construction plateau — scoreboard flat
      </text>

      {/* axes */}
      <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke="#CBD5E1" />
      <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke="#CBD5E1" />
      {[0, 0.5, 1].map((a) => (
        <g key={a}>
          <line x1={PAD_L} y1={sy(a)} x2={W - PAD_R} y2={sy(a)} stroke="#EEF1F4" />
          <text x={PAD_L - 8} y={sy(a) + 4} textAnchor="end" fontSize="11" fill="#6B7280">{Math.round(a * 100)}%</text>
        </g>
      ))}
      {[0, 10000, 20000, 30000].map((s) => (
        <text key={s} x={sx(s)} y={H - PAD_B + 18} textAnchor="middle" fontSize="11" fill="#6B7280">{s / 1000}k</text>
      ))}
      <text x={(W + PAD_L) / 2} y={H - 8} textAnchor="middle" fontSize="11.5" fill="#6B7280">training steps</text>

      {/* early stopping marker */}
      <line x1={sx(1500)} y1={PAD_T} x2={sx(1500)} y2={H - PAD_B} stroke="#B4553A" strokeWidth="1.5" strokeDasharray="6 4" />
      <text x={sx(1500) + 8} y={H - PAD_B - 10} fontSize="11" fill="#B4553A">typical early stop fires here</text>

      {/* curves */}
      <polyline points={curve(trainAccAt)} fill="none" stroke={TEAL} strokeWidth="2.5" />
      <polyline points={curve(testAccAt)} fill="none" stroke={PURPLE} strokeWidth="2.5" />

      {/* the click */}
      <circle cx={sx(20000)} cy={sy(testAccAt(20000))} r="5" fill={PURPLE} />
      <text x={sx(20000) + 10} y={sy(testAccAt(20000)) - 8} fontSize="11.5" fill={PURPLE_DARK} fontWeight="700">the click (~20k)</text>

      {/* legend */}
      <line x1={W - 210} y1={PAD_T + 8} x2={W - 185} y2={PAD_T + 8} stroke={TEAL} strokeWidth="3" />
      <text x={W - 179} y={PAD_T + 12} fontSize="11.5" fill={TEAL_DARK}>train (seen pairs)</text>
      <line x1={W - 210} y1={PAD_T + 26} x2={W - 185} y2={PAD_T + 26} stroke={PURPLE} strokeWidth="3" />
      <text x={W - 179} y={PAD_T + 30} fontSize="11.5" fill={PURPLE_DARK}>test (fresh pairs)</text>
    </svg>
  );
}

function CircleDiagram() {
  const cx = 150, cy = 150, r = 100;
  const pt = (angleDeg, label, color) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    const x = cx + r * Math.cos(rad);
    const y = cy + r * Math.sin(rad);
    return (
      <g key={label}>
        <circle cx={x} cy={y} r="7" fill={color} />
        <text x={cx + (r + 22) * Math.cos(rad)} y={cy + (r + 22) * Math.sin(rad) + 4}
          textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#1A1D26">{label}</text>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 320 320" width="100%" role="img"
      aria-label="Clock face: adding two numbers equals rotating from one position by the second number's angle">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#CBD5E1" strokeWidth="2" />
      <circle cx={cx} cy={cy} r="3" fill="#94A3B8" />
      {pt(0, '0', '#94A3B8')}
      {pt(72, 'a', TEAL)}
      {pt(180, 'b', PURPLE)}
      {pt(252, 'a+b', '#B4553A')}
      {/* rotation arcs */}
      <path d={`M ${cx + r * Math.cos(((72 - 90) * Math.PI) / 180)} ${cy + r * Math.sin(((72 - 90) * Math.PI) / 180)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(((180 - 90) * Math.PI) / 180)} ${cy + r * Math.sin(((180 - 90) * Math.PI) / 180)}`}
        fill="none" stroke={TEAL} strokeWidth="3" strokeDasharray="5 4" />
      <path d={`M ${cx + r * Math.cos(((180 - 90) * Math.PI) / 180)} ${cy + r * Math.sin(((180 - 90) * Math.PI) / 180)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(((252 - 90) * Math.PI) / 180)} ${cy + r * Math.sin(((252 - 90) * Math.PI) / 180)}`}
        fill="none" stroke={PURPLE} strokeWidth="3" strokeDasharray="5 4" />
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="12" fill="#4B5563">rotate by a,</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="12" fill="#4B5563">then by b → read the hand</text>
      <text x={cx} y="305" textAnchor="middle" fontSize="11.5" fill="#6B7280">each number = one position on the circle</text>
    </svg>
  );
}

function Metric({ value, label, color }) {
  return (
    <div style={{ flex: 1, minWidth: 130 }}>
      <div style={{ fontSize: 26, fontWeight: 800, color: color || 'var(--ds-color-text-primary)', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 11.5, color: 'var(--ds-color-text-secondary)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function EarlyStopSim() {
  const [steps, setSteps] = useState(1500);
  const train = trainAccAt(steps);
  const test = testAccAt(steps);
  const phase = phaseAt(steps);
  const stopped = steps >= 1500; // patience rule fires shortly after the plateau begins
  const conclusion = test < 0.5 ? 'memorizer — discard' : 'generalizing — keep';

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>⏱️ Simulator — Judge the run at any checkpoint</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Scrub the training timeline. At every checkpoint you see what the scoreboard says, what is actually happening inside, and what a standard patience-based early-stopping rule would conclude.
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ds-color-text-primary)' }}>Training steps</span>
            <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13, fontWeight: 700, color: TEAL_DARK }}>{steps.toLocaleString()}</span>
          </div>
          <input type="range" min={100} max={MAX_STEPS} step={100} value={steps}
            onChange={(e) => setSteps(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: TEAL, cursor: 'pointer' }} aria-label="Training steps" />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Metric value={`${Math.round(train * 100)}%`} label="Train accuracy (seen pairs)" color={TEAL_DARK} />
          <Metric value={`${Math.round(test * 100)}%`} label="Test accuracy (fresh pairs)" color={PURPLE_DARK} />
          <Metric value={`${Math.round((1 - test) * 100)}%`} label="Generalization gap" color="#B4553A" />
          <Metric value={phase.name} label={`Phase · ${phase.range}`} />
        </div>

        <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
          <Card style={{ padding: 14, background: 'var(--ds-color-bg-canvas)', borderLeft: `4px solid ${PURPLE}` }}>
            <strong style={{ fontSize: 12.5, color: PURPLE_DARK, display: 'block', marginBottom: 4 }}>What is actually happening</strong>
            <span style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', lineHeight: 1.6 }}>{phase.inside}</span>
          </Card>
          <Card style={{ padding: 14, background: 'var(--ds-color-bg-canvas)', borderLeft: `4px solid ${TEAL}` }}>
            <strong style={{ fontSize: 12.5, color: TEAL_DARK, display: 'block', marginBottom: 4 }}>What the outside shows</strong>
            <span style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', lineHeight: 1.6 }}>{phase.outside}</span>
          </Card>
        </Grid>

        <Callout type={test < 0.5 ? 'warning' : 'success'} title={stopped ? 'Early-stopping verdict at this checkpoint' : 'Checkpoint'}>
          The run reads <strong>train {Math.round(train * 100)}%, test {Math.round(test * 100)}%</strong>{test < 0.5 ? ', flat for thousands of steps' : ''} → a patience rule concludes <strong>“{conclusion}”</strong>.
          {' '}At 20k steps the same weights score <strong>≈ 100% on both</strong> — the verdict at {steps.toLocaleString()} steps was about the scoreboard, not the model.
        </Callout>
      </Stack>
    </Card>
  );
}

export default function GrokkingTab() {
  const [activeSubTab, setActiveSubTab] = useState('timeline');

  const phaseColumns = [
    { key: 'name', header: 'Phase' },
    { key: 'range', header: 'Steps' },
    { key: 'train', header: 'Train', render: (v) => <span style={{ color: TEAL_DARK, fontWeight: 600 }}>{v}</span> },
    { key: 'test', header: 'Test', render: (v) => <span style={{ color: PURPLE_DARK, fontWeight: 600 }}>{v}</span> },
    { key: 'inside', header: 'Inside the network', sortable: false },
    { key: 'outside', header: 'From the outside', sortable: false },
  ];

  const cramColumns = [
    { key: 'property', header: 'Signal' },
    { key: 'cram', header: 'Cramming (memorize)', render: (v) => <span style={{ color: '#B4553A' }}>{v}</span> },
    { key: 'understand', header: 'Understanding (grok)', render: (v) => <span style={{ color: TEAL_DARK }}>{v}</span> },
  ];

  const progressColumns = [
    { key: 'measure', header: 'Progress measure' },
    { key: 'watches', header: 'Watches', sortable: false },
    { key: 'catches', header: 'Catches early', sortable: false },
    { key: 'gap', header: 'Blind spot', sortable: false },
  ];

  const lessonColumns = [
    { key: 'lesson', header: 'Lesson', sortable: false },
    { key: 'action', header: 'What to do about it', sortable: false },
  ];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="foundations"
        moduleLabel="Foundations [Training Dynamics]"
        title="Grokking: Understanding Arrives After the Scoreboard Gives Up"
        description="A tiny network learns clock math perfectly on practice questions and barely beats guessing on new ones — then, thousands of steps after looking finished, jumps to near-perfect on both. The plateau was never empty: a general circuit was being assembled underneath a memorized shortcut."
        metrics={[
          { label: 'Train accuracy (within 1k steps)', value: '100%' },
          { label: 'Test accuracy at the same checkpoint', value: '10%' },
          { label: 'Steps until the late click', value: '20k' },
          { label: 'New data required for the click', value: '0' },
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
                borderRadius: 'var(--ds-radius-md)', border: 'none',
                background: activeSubTab === tab.id ? TEAL : 'transparent',
                color: activeSubTab === tab.id ? '#FFFFFF' : 'var(--ds-color-text-secondary)',
                cursor: 'pointer', textAlign: 'left', transition: 'all var(--ds-motion-duration-base)',
                fontWeight: activeSubTab === tab.id ? 600 : 500,
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--ds-font-size-body)', marginBottom: 2 }}>
                <span>{tab.icon}</span><span>{tab.label}</span>
              </div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>{tab.desc}</div>
            </button>
          ))}
        </div>

        {activeSubTab === 'timeline' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Two accuracy curves, one long silence</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Training accuracy (teal) hits the ceiling almost immediately. Test accuracy (purple) hugs 10% through the plateau, then climbs in a narrow window. Nothing about the setup changed in between — only what the network was becoming.
              </p>
              <TimelineChart />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>The four phases</h3>
              <Table columns={phaseColumns} data={PHASES} sortable={false} />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Cramming vs understanding</h3>
              <Table columns={cramColumns} data={CRAM_VS_UNDERSTAND} sortable={false} />
            </Card>
          </Stack>
        )}

        {activeSubTab === 'inside' && (
          <Stack gap={6}>
            <Grid columns={{ base: '1fr', md: '320px 1fr' }} gap="var(--ds-space-4)">
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                <h3 style={{ margin: '0 0 8px 0' }}>What the network built</h3>
                <CircleDiagram />
              </Card>
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                <h3 style={{ margin: '0 0 8px 0' }}>Rediscovered trigonometry, nobody taught it</h3>
                <p style={{ margin: 0, fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', lineHeight: 1.7 }}>
                  A mechanistic audit of the trained network showed it had taught itself to place each number at a point around a circle, then perform addition as rotation — the mathematical structure of a clock face, recovered by gradient descent alone.
                  <br /><br />
                  For most of training both solutions lived side by side: a memorized lookup that worked on seen pairs and could never generalize, and the rotation circuit under construction. The general method only started producing answers once it was complete enough to outcompete the shortcut — which is why the plateau looks like nothing and is actually the entire story.
                </p>
              </Card>
            </Grid>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Progress measures that see through the flat line</h3>
              <Table columns={progressColumns} data={PROGRESS_MEASURES} sortable={false} />
            </Card>
          </Stack>
        )}

        {activeSubTab === 'simulator' && (
          <Stack gap={6}>
            <EarlyStopSim />
            <Callout type="info" title="Why this generalizes beyond clock math">
              Grokking has been documented on several narrow rule-based tasks. Whether silent construction phases happen inside today's much larger models is an open question — but memorization and understanding being externally identical until they are not is exactly the risk a single-scoreboard training run takes.
            </Callout>
          </Stack>
        )}

        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>1 · Train on clock math and log the gap</h3>
              <p style={{ margin: '0 0 10px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                A minimal modular-addition trainer. The probe on fresh pairs is the line that matters — training accuracy alone would declare victory at step 780.
              </p>
              <CodeBlock language="python" code={CODE_TRAIN} />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>2 · The early-stopping trap</h3>
              <CodeBlock language="python" code={CODE_EARLYSTOP} />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>3 · A progress measure that moves before accuracy does</h3>
              <CodeBlock language="python" code={CODE_PROGRESS} />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Operational lessons</h3>
              <Table columns={lessonColumns} data={LESSONS} sortable={false} />
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
