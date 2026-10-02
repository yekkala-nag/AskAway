import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { AGENT_SYSTEM, CONTRACT_CHECKS, SIX_LAYERS, STATISTICS_RULES, OPEN_ENDED, TRIAL_STATS, PYTHON_CODING_EVAL_CODE } from './codingEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function CodingEvalsTab() {
  const [sub, setSub] = useState('contracts');
  const [runs, setRuns] = useState(10);
  const [p, setP] = useState(0.7);
  const [serious, setSerious] = useState(0);
  const r = TRIAL_STATS(runs, p, 0.8, serious);
  const rc = r.verdict.startsWith('SHIP') ? '#5EC4C8' : r.verdict.startsWith('GATE') ? '#F5A623' : '#ef4444';
  const [checked, setChecked] = useState(CONTRACT_CHECKS.map(() => true));
  const toggle = (i) => setChecked(c => c.map((v, j) => (j === i ? !v : v)));
  const coverage = Math.round((checked.filter(Boolean).length / checked.length) * 100);
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="agents_frameworks" moduleLabel="Agent Systems & Frameworks [Coding-Agent Evals]"
        title="Stop Grading Agents Like Chatbots — Evaluate the Work"
        description="Agent ≠ model: seven parts, one system score. Executable contracts admit many valid patches; six layers beat pass-rate worship; non-determinism is statistics; open-ended work gets PO simulators."
        metrics={[{ label: 'Unit', value: 'Whole system' }, { label: 'Layers', value: '6, not 1' }, { label: 'Method', value: 'Contracts' }, { label: 'Bar', value: 'Decisions > demos' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="agents_frameworks" src="/assets/coding_evals.svg" alt="Coding agent evals" title="System + Contracts + Layers" caption="Behavior over diffs; distributions over demos; questions rewarded, invented requirements punished." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'contracts', icon: '📜', label: '1. Contracts + Layers', desc: '8 checks, 6 layers' },
          { id: 'sim', icon: '🔬', label: '2. Trial Simulator', desc: 'Distributions → verdict' },
          { id: 'code', icon: '🛠️', label: '3. Harness Code', desc: 'Contracts + stats' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'contracts' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">{AGENT_SYSTEM.map((a, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{a.part}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{a.note}</div></Card>))}</Grid>
          <div><h3 style={{ margin: 0 }}>📜 Executable contract — toggle to feel coverage drop</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{CONTRACT_CHECKS.map((c, i) => (
            <label key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '10px', background: 'var(--ds-color-bg-surface)', borderRadius: '8px', border: `1px solid ${checked[i] ? 'rgba(16,185,129,0.4)' : 'var(--ds-color-border-subtle)'}`, cursor: 'pointer', fontSize: '12px', color: 'white' }}>
              <input type="checkbox" checked={checked[i]} onChange={() => toggle(i)} style={{ marginTop: '2px' }} />
              <span><strong>{c.check}</strong> <span style={{ color: 'var(--ds-color-text-tertiary)' }}>— bars: {c.bars}</span></span>
            </label>))}</Grid>
          <div style={{ fontSize: '12px', color: coverage === 100 ? '#5EC4C8' : coverage >= 60 ? '#F5A623' : '#ef4444', fontWeight: 'bold' }}>
            Contract coverage: {coverage}% {coverage < 100 && '— every unchecked box is a bluffable surface.'}
          </div>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Layer</th><th style={{ textAlign: 'left', padding: '8px' }}>Asks</th><th style={{ textAlign: 'left', padding: '8px' }}>Metric</th></tr></thead>
            <tbody>{SIX_LAYERS.map((l, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{l.layer}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{l.asks}</td><td style={{ padding: '8px', color: '#3A9B9F', fontFamily: 'monospace' }}>{l.metric}</td></tr>))}</tbody></table></div>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Trial-statistics simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Trial runs: {runs}</label>
              <input type="range" min={3} max={50} value={runs} onChange={e => setRuns(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Single-run pass p: {p.toFixed(2)}</label>
              <input type="range" min={30} max={100} value={p * 100} onChange={e => setP(+e.target.value / 100)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Serious failures: {serious}</label>
              <input type="range" min={0} max={3} value={serious} onChange={e => setSerious(+e.target.value)} style={{ width: '100%' }} />
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${rc}` }}>
              <div style={{ fontSize: '12px', color: 'white', fontFamily: 'monospace' }}>E[passes] {r.expectedPasses}/{runs} · 95% CI [{r.ci95[0]}, {r.ci95[1]}]</div>
              <div style={{ fontSize: '16px', color: rc, fontWeight: 'bold', marginTop: '6px' }}>{r.verdict}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>{r.note}</div>
            </Card>
          </Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">
            <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
              <strong style={{ fontSize: '12px', color: '#3A9B9F' }}>Statistics rules</strong>
              {STATISTICS_RULES.map((s, i) => (<div key={i} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}><span style={{ color: 'white' }}>{s.rule}:</span> {s.how}</div>))}
            </Card>
            <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
              <strong style={{ fontSize: '12px', color: '#C47A6A' }}>Open-ended bounds</strong>
              {OPEN_ENDED.map((o, i) => (<div key={i} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}><span style={{ color: 'white' }}>{o.move}:</span> {o.why}</div>))}
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Contract evaluator + trial stats</h3></div>
          <CodeBlock language="python" code={PYTHON_CODING_EVAL_CODE} />
          <Callout type="success"><strong>The bar, restated:</strong> useful isn't perfect — it's whether the eval beats demos, anecdotes, and provider claims. Providers get engineering benefits only with engineering evidence.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
