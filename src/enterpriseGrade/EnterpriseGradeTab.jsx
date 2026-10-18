import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { VALUE_PLAYS, DATA_DILIGENCE, BIAS_TRAPS, DEPLOY_QUESTIONS, DRIFT_TYPES, READINESS_SCORE, PYTHON_ENTERPRISE_CODE, SIX_REQUIREMENTS, CONTEXT_TAX, REQUIREMENTS_CODE } from './enterpriseEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

function RequirementsPanel() {
  const [sel, setSel] = React.useState(1);
  const activeReq = SIX_REQUIREMENTS.find((r) => r.n === sel) || SIX_REQUIREMENTS[0];
  return (
    <Stack gap={4}>
      <svg viewBox="0 0 760 130" style={{ width: '100%', height: 'auto' }} role="img" aria-label="six data requirements grid">
        {SIX_REQUIREMENTS.map((r, i) => {
          const x = 8 + i * 125;
          const on = r.n === sel;
          return (
            <g key={r.n} style={{ cursor: 'pointer' }} onClick={() => setSel(r.n)} role="button" tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setSel(r.n); }}>
              <rect x={x} y={26} width={114} height={70} rx={12}
                fill={on ? '#E8F3F3' : 'var(--ds-color-bg-surfaceHover)'}
                stroke={on ? '#3A9B9F' : 'var(--ds-color-border-subtle)'} strokeWidth={on ? 2 : 1.5} />
              <text x={x + 12} y={52} fontSize={14} fontWeight={800} fill={on ? '#1A6B6E' : '#5B4B8A'}>0{r.n}</text>
              <text x={x + 12} y={74} fontSize={10.5} fill="var(--ds-color-text-primary)">
                {r.name.length > 18 ? `${r.name.slice(0, 17)}…` : r.name}
              </text>
            </g>
          );
        })}
      </svg>
      <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
        <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
          <Badge variant="default">requirement 0{activeReq.n}</Badge>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1A6B6E', margin: '6px 0 4px' }}>{activeReq.name}</div>
          <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>{activeReq.detail}</div>
        </Card>
        <Card style={{ padding: 'var(--ds-space-4)', background: '#FDF0EC', border: '1.5px solid #B4553A' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#B4553A' }}>WITHOUT IT</div>
          <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-primary)', marginTop: 6 }}>{activeReq.failureWithout}</div>
        </Card>
      </Grid>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px' }}>
          <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}>
            <th style={{ textAlign: 'left', padding: 8 }}>Signal</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Fragmented stack</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Persisted layer</th>
            <th style={{ padding: 8 }}>Hidden cost</th>
          </tr></thead>
          <tbody>{CONTEXT_TAX.map((t, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
              <td style={{ padding: 8, color: 'white', fontWeight: 700 }}>{t.signal}</td>
              <td style={{ padding: 8, color: 'var(--ds-color-text-secondary)' }}>{t.fragmented}</td>
              <td style={{ padding: 8, color: '#5EC4C8' }}>{t.persisted}</td>
              <td style={{ padding: 8, textAlign: 'center', color: '#F5A623' }}>{t.exampleCost}</td>
            </tr>))}</tbody>
        </table>
      </div>
      <Callout type="tip" title="Vector-only retrieval hits a wall">
        Nearest neighbors cannot join entities, filter by valid time, or traverse relations. Once an agent reasons across steps — not just retrieves a passage — it needs a contextual layer, not a bigger index.
      </Callout>
    </Stack>
  );
}
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
          { id: 'code', icon: '🛠️', label: '3. Gate Code', desc: 'Weighted ship gate' },
          { id: 'agentdata', icon: '🗄️', label: '4. Agent Data Layer', desc: 'Six requirements' }].map(t => (
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
        {sub === 'agentdata' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🗄️ Six data requirements — where demos melt</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--ds-color-text-secondary)' }}>
              Pilot agents fail beneath the model: fragmented context, stale facts, governance in a doc. Click a requirement to see what breaks without it.
            </p></div>
          <RequirementsPanel />
          <CodeBlock language="python" code={REQUIREMENTS_CODE} />
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
