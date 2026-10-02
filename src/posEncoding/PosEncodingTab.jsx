import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { PE_PIPELINE, PE_REQUIREMENTS, PE_METHODS, SHUFFLE_DEMO, LAG_GUIDE, PYTHON_PE_CODE } from './peEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function PosEncodingTab() {
  const [sub, setSub] = useState('pipeline');
  const [order, setOrder] = useState('chrono');
  const [lag, setLag] = useState('t−7');
  const d = SHUFFLE_DEMO(order);
  const lagInfo = LAG_GUIDE.find(l => l.lag === lag);
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="foundations" moduleLabel="Foundations & Architecture [Positional Encoding]"
        title="Order Changes Meaning — Give Attention a Clock"
        description="Five weekday temps through scalar→embed→QKV: shuffle them and attention can't tell. Sinusoidal clocks restore order and relative distance (t−1, t−7, t−30)."
        metrics={[{ label: 'Pipeline', value: '5 steps' }, { label: 'PE Needs', value: '5 properties' }, { label: 'Key Lags', value: 't−1 · t−7' }, { label: 'Beyond', value: 'RoPE/learned' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="foundations" src="/assets/pos_encoding.svg" alt="Positional encoding" title="Shuffle Blindness → Clocks → Lags" caption="Same values, new order, identical attention — until h = e + p." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'pipeline', icon: '🔢', label: '1. Scalar → Context', desc: '5-step pipeline' },
          { id: 'sim', icon: '🔬', label: '2. Shuffle Lab', desc: 'Break it, fix it' },
          { id: 'code', icon: '🛠️', label: '3. Clocks Code', desc: 'Sinusoidal numpy' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'pipeline' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">{PE_PIPELINE.map((s, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${i === 3 ? '#ef4444' : i === 4 ? '#5EC4C8' : '#5EC4C8'}` }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{s.step}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{s.detail}</div><div style={{ fontSize: '11px', color: '#3A9B9F', fontFamily: 'monospace' }}>{s.math}</div></Card>))}</Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">
            <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
              <strong style={{ fontSize: '12px', color: '#F5A623' }}>Position must supply 5 things:</strong>
              {PE_REQUIREMENTS.map((r, i) => (<div key={i} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}><span style={{ color: 'white' }}>{r.need}:</span> {r.ex}</div>))}
            </Card>
            <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
              <strong style={{ fontSize: '12px', color: '#3A9B9F' }}>Three encodings:</strong>
              {PE_METHODS.map((m, i) => (<div key={i} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}><span style={{ color: 'white' }}>{m.method}:</span> {m.how} <span style={{ color: 'var(--ds-color-text-tertiary)' }}>({m.cost}; {m.limit})</span></div>))}
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Shuffle lab + lag picker</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <Flex gap="var(--ds-space-2)" style={{ marginBottom: '8px' }}>
                <Button variant={order === 'chrono' ? 'primary' : 'secondary'} size="sm" onClick={() => setOrder('chrono')}>Chrono week</Button>
                <Button variant={order === 'shuffled' ? 'primary' : 'secondary'} size="sm" onClick={() => setOrder('shuffled')}>Shuffled week</Button>
              </Flex>
              <div style={{ fontSize: '12px', color: 'white', fontFamily: 'monospace' }}>{d.seq.join(' · ')}</div>
              <label style={{ fontSize: '11px', color: 'white', display: 'block', marginTop: '10px' }}>Lag of interest</label>
              <Flex gap="var(--ds-space-2)">{LAG_GUIDE.map(l => (<Button key={l.lag} variant={lag === l.lag ? 'primary' : 'secondary'} size="sm" onClick={() => setLag(l.lag)}>{l.lag}</Button>))}</Flex>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #F5A623' }}>
              <div style={{ fontSize: '12px', color: '#ef4444' }}>no p: {d.noPE}</div>
              <div style={{ fontSize: '12px', color: '#3A9B9F', marginTop: '6px' }}>with p: {d.withPE}</div>
              <div style={{ fontSize: '12px', color: '#3A9B9F', marginTop: '6px' }}>{lag} → {lagInfo.captures}</div>
              <div style={{ fontSize: '11px', color: 'white', fontWeight: 'bold', marginTop: '6px' }}>{d.verdict}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Sinusoidal clocks + blindness proof</h3></div>
          <CodeBlock language="python" code={PYTHON_PE_CODE} />
          <Callout type="success"><strong>The question to keep:</strong> not "position 7?" but "what notion of time does the task need?" — timestamps, calendars, and gaps for irregular series.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
