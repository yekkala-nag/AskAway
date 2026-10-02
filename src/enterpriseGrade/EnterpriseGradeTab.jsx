import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { VALUE_PLAYS, DATA_DILIGENCE, BIAS_TRAPS, DEPLOY_QUESTIONS, DRIFT_TYPES, READINESS_SCORE, PYTHON_ENTERPRISE_CODE } from './enterpriseEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });
const FLAGS = [['data', 'Data diligence'], ['bias', 'Bias tested'], ['perf', 'Good-enough bench'], ['deploy', 'Deploy answers'], ['monitor', 'Monitoring live'], ['buyin', 'Buy-in secured']];

export default function EnterpriseGradeTab() {
  const [sub, setSub] = useState('plays');
  const [flags, setFlags] = useState({ data: true, bias: false, perf: true, deploy: false, monitor: false, buyin: true });
  const toggle = (k) => setFlags(f => ({ ...f, [k]: !f[k] }));
  const r = READINESS_SCORE(flags);
  const rc = r.score >= 85 ? '#5EC4C8' : r.score >= 60 ? '#F5A623' : '#ef4444';
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="frontiers_production" moduleLabel="Production & Frontiers [Enterprise-Grade AI]"
        title="Mundane Beats Moonshots — End-to-End or End of Story"
        description="87% of AI projects never reach production. Forecasting, anomaly detection, classification on diligent data; bias traps dodged; good-enough benchmarked; four drifts watched; buy-in earned."
        metrics={[{ label: 'Win Zone', value: 'Mundane 3' }, { label: 'Fail Rate', value: '87% stall' }, { label: 'Edge', value: '10–20%' }, { label: 'Bar', value: '85 to ship' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="frontiers_production" src="/assets/enterprise_grade.svg" alt="Enterprise grade AI" title="Diligence → Benchmark → Watch → Buy-in" caption="Data diligence up front, good-enough in the middle, drift watch forever." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'plays', icon: '🏭', label: '1. Plays + Data', desc: 'Value + diligence' },
          { id: 'sim', icon: '🔬', label: '2. Readiness Sim', desc: 'Score your program' },
          { id: 'code', icon: '🛠️', label: '3. Gate Code', desc: 'Weighted ship gate' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'plays' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{VALUE_PLAYS.map((v, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{v.play}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{v.ex}</div><div style={{ fontSize: '11px', color: '#3A9B9F' }}>{v.why}</div></Card>))}</Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">
            <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
              <strong style={{ fontSize: '12px', color: '#3A9B9F' }}>Data diligence (CRISP-DM heart):</strong>
              {DATA_DILIGENCE.map((d, i) => (<div key={i} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}><span style={{ color: 'white' }}>{d.check}:</span> {d.detail}</div>))}
            </Card>
            <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
              <strong style={{ fontSize: '12px', color: '#ef4444' }}>Bias traps:</strong>
              {BIAS_TRAPS.map((b, i) => (<div key={i} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}><span style={{ color: '#ef4444', fontWeight: 'bold' }}>{b.trap}:</span> {b.lesson}</div>))}
            </Card>
          </Grid>
          <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #F5A623' }}>
            <strong style={{ fontSize: '12px', color: '#F5A623' }}>Before deployment, answer all four:</strong>
            {DEPLOY_QUESTIONS.map((q, i) => (<div key={i} style={{ fontSize: '11px', color: 'white', marginTop: '4px' }}>{i + 1}. {q}</div>))}
          </Card>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Enterprise readiness simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <strong style={{ fontSize: '11px', color: '#F5A623', display: 'block', marginBottom: '8px' }}>PROGRAM CHECKLIST:</strong>
              <Stack gap={2}>{FLAGS.map(([k, label]) => (
                <label key={k} style={{ fontSize: '12px', color: 'white', cursor: 'pointer' }}><input type="checkbox" checked={flags[k]} onChange={() => toggle(k)} /> {label}</label>
              ))}</Stack>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${rc}` }}>
              <div style={{ fontSize: '24px', color: rc, fontWeight: 'bold' }}>{r.score}/100</div>
              <div style={{ fontSize: '13px', color: 'white', fontWeight: 'bold' }}>{r.verdict}</div>
              <div style={{ fontSize: '11px', color: '#F5A623', marginTop: '4px' }}>First fix: {r.firstFix}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '6px' }}>{r.reminder}</div>
            </Card>
          </Grid>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Drift</th><th style={{ textAlign: 'left', padding: '8px' }}>Means</th><th style={{ padding: '8px' }}>Signal needs</th></tr></thead>
            <tbody>{DRIFT_TYPES.map((d, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{d.drift}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{d.means}</td><td style={{ padding: '8px', textAlign: 'center', color: d.needs === 'Labels' ? '#F5A623' : '#5EC4C8' }}>{d.needs}</td></tr>))}</tbody></table></div>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Readiness gate + drift sketch</h3></div>
          <CodeBlock language="python" code={PYTHON_ENTERPRISE_CODE} />
          <Callout type="success"><strong>Root-cause speed is the MLOps KPI:</strong> tools differ, but time-to-cause decides impact. Monitor integrity, health, and all four drifts — then buy-in follows results.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
