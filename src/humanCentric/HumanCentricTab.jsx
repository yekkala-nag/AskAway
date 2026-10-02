import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { BLIND_SPOTS, VALUES_CRITIQUE, VSD_PILLARS, CONCENTRIC_AXES, ROLLOUT_GATE, PYTHON_HUMAN_CODE } from './humanEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function HumanCentricTab() {
  const [sub, setSub] = useState('blindspots');
  const [auto, setAuto] = useState(1);
  const [ext, setExt] = useState(1);
  const r = ROLLOUT_GATE(auto, ext);
  const rc = r.zone.startsWith('GREEN') ? '#5EC4C8' : r.zone.startsWith('AMBER') ? '#F5A623' : '#ef4444';
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="foundations" moduleLabel="Foundations & Architecture [Human-Centric AI]"
        title="Satisfied ≠ Unharmed — Design for Humans, Not Metrics"
        description="Compartmentalized metrics, smoker-satisfied filter bubbles, non-voluntary exposure, FAccT and compliance falling short — answered by value-sensitive design and concentric rollout (support→automation, internal→customer)."
        metrics={[{ label: 'Axes', value: '2 rollout' }, { label: 'Zones', value: 'Green/Amber/Red' }, { label: 'Duty', value: 'Pareto no-harm' }, { label: 'Horizon', value: '10-year defense' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="foundations" src="/assets/human_centric.svg" alt="Human-centric AI" title="Blind Spots → Rollout Discipline" caption="Satisfaction misleads, compliance trails, values must be designed in." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'blindspots', icon: '🙈', label: '1. Blind Spots', desc: '3 ways harm hides' },
          { id: 'sim', icon: '🔬', label: '2. Rollout Gate Sim', desc: 'Autonomy × exposure' },
          { id: 'code', icon: '🛠️', label: '3. VSD + Code', desc: 'Pillars and gate' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'blindspots' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{BLIND_SPOTS.map((b, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #ef4444' }}><div style={{ fontSize: '12px', color: '#ef4444', fontWeight: 'bold' }}>{b.spot}</div><div style={{ fontSize: '11px', color: 'white' }}>{b.detail}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>e.g. {b.ex}</div></Card>))}</Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{VALUES_CRITIQUE.map((v, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #F5A623' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>“{v.claim}”</div><div style={{ fontSize: '11px', color: '#F5A623' }}>→ {v.pushback}</div></Card>))}</Grid>
          <Callout type="success"><strong>The Nest test:</strong> automating a loved chore to zero effort can still harm — ask what fiddling, searching, and forming opinions are *for* before removing them.</Callout>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Concentric rollout gate simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Autonomy: {['advise', 'assist', 'decide', 'auto-decide'][auto]}</label>
              <input type="range" min="0" max="3" value={auto} onChange={e => setAuto(+e.target.value)} style={{ width: '100%', marginBottom: '8px' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Exposure: {['internal', 'advisors', 'applicants', 'customers'][ext]}</label>
              <input type="range" min="0" max="3" value={ext} onChange={e => setExt(+e.target.value)} style={{ width: '100%' }} />
              <div style={{ marginTop: '8px' }}>{CONCENTRIC_AXES.map((c, i) => (<div key={i} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}><span style={{ color: '#3A9B9F' }}>{c.axis}:</span> {c.rule}</div>))}</div>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${rc}` }}>
              <div style={{ fontSize: '20px', color: rc, fontWeight: 'bold' }}>{r.risk} · {r.zone}</div>
              <div style={{ fontSize: '11px', color: '#F5A623', marginTop: '8px' }}>REQUIRED CONTROLS:</div>
              {r.controls.map((c, i) => (<div key={i} style={{ fontSize: '11px', color: 'white' }}>• {c}</div>))}
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '6px' }}>{r.note}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Value-sensitive pillars + rollout code</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{VSD_PILLARS.map((v, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{v.pillar}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{v.does}</div></Card>))}</Grid>
          <CodeBlock language="python" code={PYTHON_HUMAN_CODE} />
          <Callout type="success"><strong>Obvion playbook:</strong> resource the ethics work explicitly, staff for process-understanding (not just numbers), and roll out concentrically — the mortgage stakes demand nothing less.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
