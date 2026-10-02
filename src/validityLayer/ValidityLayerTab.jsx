import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { VALIDITY_STATES, INVALIDITY_TYPES, EXPERIMENT_TABLE, WHEN_TO_BUILD, RUN_VALIDITY, PYTHON_VALIDITY_CODE } from './validityEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function ValidityLayerTab() {
  const [sub, setSub] = useState('states');
  const [faultAt, setFaultAt] = useState(1);
  const [budget, setBudget] = useState(8);
  const r = RUN_VALIDITY(faultAt, budget);
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="context_memory" moduleLabel="Context & Memory Engineering [Validity Layer]"
        title="Presence Isn't Validity — Check Before Acting"
        description="Flight $420 → $610 mid-plan: the baseline burns 2 doomed steps and misses tight budgets; the validity-aware executor checks state first and finishes. Four states, two executors, one law (PFW = closure − 1)."
        metrics={[{ label: 'States', value: '4, not 2' }, { label: 'Doomed Work', value: '2 → 0' }, { label: 'Budget Gap', value: '6–8' }, { label: 'Law Holds', value: '96/96' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="context_memory" src="/assets/validity_layer.svg" alt="Validity layer" title="Baseline vs Aware + 4 States" caption="Same fault, two policies; states decide act/verify/replan before execution." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'states', icon: '🧭', label: '1. States + Experiments', desc: '4 states, 5 results' },
          { id: 'sim', icon: '🔬', label: '2. Run Simulator', desc: 'Fault timing × budget' },
          { id: 'code', icon: '🛠️', label: '3. Executor Code', desc: 'Deterministic policies' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'states' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">{VALIDITY_STATES.map((s, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${s.color}` }}><div style={{ fontSize: '12px', color: s.color, fontWeight: 'bold' }}>{s.state}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{s.means}</div></Card>))}</Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{INVALIDITY_TYPES.map((t, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #F5A623' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{t.type}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{t.example}</div><div style={{ fontSize: '11px', color: '#3A9B9F' }}>→ {t.check}</div></Card>))}</Grid>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Experiment</th><th style={{ textAlign: 'left', padding: '8px' }}>Tests</th><th style={{ padding: '8px' }}>Baseline</th><th style={{ padding: '8px' }}>Aware</th></tr></thead>
            <tbody>{EXPERIMENT_TABLE.map((e, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{e.exp}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{e.tests}</td><td style={{ padding: '8px', textAlign: 'center', color: '#ef4444' }}>{e.base}</td><td style={{ padding: '8px', textAlign: 'center', color: '#3A9B9F' }}>{e.aware}</td></tr>))}</tbody></table></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">{WHEN_TO_BUILD.map((w, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${w.verdict.startsWith('Build') ? '#5EC4C8' : '#64748b'}` }}><div style={{ fontSize: '11px', color: 'white' }}>{w.use}</div><div style={{ fontSize: '11px', fontWeight: 'bold', color: w.verdict.startsWith('Build') ? '#5EC4C8' : 'var(--ds-color-text-tertiary)' }}>{w.verdict}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Flight-price run simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Fault fires at step: {faultAt} (0 = before start)</label>
              <input type="range" min="0" max="3" value={faultAt} onChange={e => setFaultAt(+e.target.value)} style={{ width: '100%', marginBottom: '8px' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Step budget: {budget}</label>
              <input type="range" min="4" max="10" value={budget} onChange={e => setBudget(+e.target.value)} style={{ width: '100%' }} />
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
              <div style={{ fontSize: '12px', color: '#ef4444' }}>Baseline: {r.baseline.steps} steps, {r.baseline.doomed} doomed → {r.baseline.completes ? 'completes' : 'FAILS'}</div>
              <div style={{ fontSize: '12px', color: '#3A9B9F', marginTop: '4px' }}>Aware: {r.aware.steps} steps, 0 doomed → {r.aware.completes ? 'completes' : 'FAILS'}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '6px', fontFamily: 'monospace' }}>{r.law}</div>
              <div style={{ fontSize: '11px', color: '#F5A623', marginTop: '4px' }}>{r.lesson}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Deterministic executors (no LLM — mechanism isolation)</h3></div>
          <CodeBlock language="python" code={PYTHON_VALIDITY_CODE} />
          <Callout type="success"><strong>Honest limits (author's own):</strong> flat recovery cost, binary verification, chain-only branches, state machines not LLMs. The E2 false-alarm row is why the other rows are believable.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
