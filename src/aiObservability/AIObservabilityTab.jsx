import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { SIGNAL_TABLE, PLATFORM_TABLE, SAMPLING_PLAN, PYTHON_OBS_CODE, WHY_TABLE, METRIC_TABLE, PROD_EVAL_TABLE, ALERT_RULES, DASHBOARD_ROWS } from './obsEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };

export default function AIObservabilityTab() {
  const [sub, setSub] = useState('why');
  const [tasks, setTasks] = useState(100000);
  const [sample, setSample] = useState(5);
  const p = SAMPLING_PLAN(tasks, sample);
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="frontiers_production" moduleLabel="Production & Frontiers [AI Observability]"
        title="If It's Not a Span, It Didn't Happen"
        description="Traces carry prompts, spans carry scores, versions pin every span. 100% of errors, 5% of success, all of canary — thin sampling is incident blindness."
        metrics={[{ label: 'Errors', value: '100% Kept' }, { label: 'Success', value: '5% Sampled' }, { label: 'Canary', value: '100% Kept' }, { label: 'Versions', value: 'Pinned' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="frontiers_production" src="/assets/ai_observability.svg" alt="AI observability" title="Signals + Platforms + Sampling" caption="Scores ride spans; platforms picked by data gravity; sampling trades GB for lag." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'why', icon: '🤔', label: '1. Why LLM Obs Differs', desc: 'APM fails quietly on 200 OK' },
          { id: 'signals', icon: '📡', label: '2. Signals + Platforms', desc: 'What to capture, where' },
          { id: 'measure', icon: '📏', label: '3. What to Measure', desc: 'The six golden SLIs' },
          { id: 'evals', icon: '🧪', label: '4. Evals in Production', desc: 'Offline, sampled, feedback, canary' },
          { id: 'sim', icon: '🔬', label: '5. Sampling Sim', desc: 'GB vs detection lag' },
          { id: 'dash', icon: '📊', label: '6. Dashboard + Alerts', desc: 'Illustrated SLO board' },
          { id: 'code', icon: '🛠️', label: '7. OTel Code', desc: 'Spans + scores' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={{ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: sub === t.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: sub === t.id ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'why' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🤔 Why LLM observability ≠ classic APM</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>Traditional monitoring answers "did the request succeed?" An LLM request succeeds and still fails. The five differences that change your whole telemetry design:</p></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{WHY_TABLE.map((w, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}>
            <div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{w.dim}</div>
            <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', fontFamily: 'monospace' }}>APM: {w.apm}</div>
            <div style={{ fontSize: '11px', color: '#F5A623', fontFamily: 'monospace' }}>LLM: {w.llm}</div></Card>))}</Grid>
          <Callout type="info"><strong>The core shift:</strong> you are not diffing outputs — you are <em>scoring</em> them (quality, safety, cost) and joining those scores to the trace that produced them.</Callout>
        </Stack></Card></Stack>)}
        {sub === 'signals' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{SIGNAL_TABLE.map((s, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{s.signal}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{s.captures}</div><div style={{ fontSize: '11px', color: '#ef4444', fontFamily: 'monospace' }}>alert: {s.alert}</div></Card>))}</Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{PLATFORM_TABLE.map((pl, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{pl.dim}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{pl.note}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'measure' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>📏 The six SLIs that actually matter</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>Two latency, one cost, one reliability, two quality — anything else is a drill-down, not a dashboard tile.</p></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{METRIC_TABLE.map((m, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${m.type === 'quality' ? '#F5A623' : m.type === 'cost' ? '#A78BFA' : '#5EC4C8'}` }}>
            <div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{m.metric} <span style={{ color: 'var(--ds-color-text-tertiary)', fontFamily: 'monospace', fontWeight: 400 }}>· {m.unit}</span></div>
            <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{m.why}</div></Card>))}</Grid>
          <Callout type="info"><strong>Start with latency + errors + cost,</strong> then layer scores — a beautiful faithfulness dashboard is useless if nobody knows the app is down.</Callout>
        </Stack></Card></Stack>)}
        {sub === 'evals' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🧪 Evaluating in production (without shipping a regression)</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>Four complementary loops — each catches what the others miss, and each has an honest limitation:</p></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{PROD_EVAL_TABLE.map((e, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #A78BFA' }}>
            <div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{e.mode} <span style={{ color: 'var(--ds-color-text-tertiary)', fontFamily: 'monospace', fontWeight: 400 }}>· {e.cadence}</span></div>
            <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>How: {e.how}</div>
            <div style={{ fontSize: '11px', color: '#5EC4C8' }}>Catches: {e.catches}</div>
            <div style={{ fontSize: '11px', color: '#F5A623' }}>Caveat: {e.honest}</div></Card>))}</Grid>
          <Callout type="info"><strong>LLM-as-judge rule:</strong> score a 50-item human-labeled subset first — if the judge disagrees with humans &gt;10% of the time, fix the rubric before trusting it on live traffic.</Callout>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Sampling vs detection-lag simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Tasks/day: {(tasks / 1000).toFixed(0)}k</label>
              <input type="range" min={1000} max={1000000} step={5000} value={tasks} onChange={e => setTasks(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Success sample: {sample}% (errors always 100%)</label>
              <input type="range" min={1} max={100} value={sample} onChange={e => setSample(+e.target.value)} style={{ width: '100%' }} />
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${sample < 5 ? '#ef4444' : '#5EC4C8'}` }}>
              <div style={{ fontSize: '12px', color: 'white', fontFamily: 'monospace' }}>{p.storedPerDay.toLocaleString()} traces/day · {p.gbPerDay} GB/day · {p.gbPerMonth} GB/mo</div>
              <div style={{ fontSize: '12px', color: sample < 5 ? '#ef4444' : '#5EC4C8', fontWeight: 'bold', marginTop: '6px' }}>detection lag {p.detectLag}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>{p.advice}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'dash' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>📊 Dashboard + alert rules (illustrated example)</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>Static example data for teaching the layout — not live telemetry. Six tiles from section 3, band-collected, wired to the four alert rules below:</p></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{DASHBOARD_ROWS.map((d, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${d.band === 'ok' ? '#5EC4C8' : '#F5A623'}` }}>
            <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{d.name}</div>
            <div style={{ fontSize: '18px', color: d.band === 'ok' ? '#5EC4C8' : '#F5A623', fontWeight: 'bold', fontFamily: 'monospace' }}>{d.value}</div>
            <div style={{ fontSize: '10.5px', color: 'var(--ds-color-text-tertiary)' }}>{d.note}</div></Card>))}</Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{ALERT_RULES.map((a, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #ef4444' }}>
            <div style={{ fontSize: '12px', color: 'white', fontFamily: 'monospace' }}>{a.rule}</div>
            <div style={{ fontSize: '11px', color: '#5EC4C8' }}>→ {a.action}</div>
            <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{a.why}</div></Card>))}</Grid>
          <Callout type="warning"><strong>Honest labels everywhere:</strong> score-based tiles carry their judge + sample rate; cost tiles carry their window. A tile nobody can attribute is a tile nobody trusts.</Callout>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ OTel spans + score logging</h3></div>
          <CodeBlock language="python" code={PYTHON_OBS_CODE} />
          <Callout type="success"><strong>Blame needs pins:</strong> component@version on every span, scores as span attributes, band-slip alerts Ship→Gate. A floating-version span is a bug, not telemetry.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
