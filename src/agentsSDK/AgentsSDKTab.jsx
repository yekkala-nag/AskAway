import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { WHY_MULTI, HANDOFF_FLOW, HANDOFF_CUSTOM, TOOLS_PATTERN, PICK_TABLE, PICK_PATTERN, PYTHON_SDK_CODE } from './sdkEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function AgentsSDKTab() {
  const [sub, setSub] = useState('patterns');
  const [domains, setDomains] = useState(1);
  const [combine, setCombine] = useState(false);
  const [precise, setPrecise] = useState(false);
  const [audit, setAudit] = useState(true);
  const r = PICK_PATTERN(domains, combine, precise, audit);
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="agents_frameworks" moduleLabel="Agent Systems & Frameworks [Agents SDK Patterns]"
        title="Handoff Transfers, Tools Consult — Pick per Query Shape"
        description="Triage nurse routes to weather/air-quality specialists via transfer_to_* functions; custom handoffs add names, callbacks, Pydantic inputs; orchestrator merges both via as_tool(). Trace dashboard arbitrates."
        metrics={[{ label: 'Patterns', value: '2 + custom' }, { label: 'Trace Split', value: '1.7s → 7.2s' }, { label: 'Fix', value: 'Explicit lat/lon' }, { label: 'Rule', value: 'Clarify, never force' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="agents_frameworks" src="/assets/agents_sdk.svg" alt="Agents SDK patterns" title="Transfer vs Consult" caption="Control moves in handoffs; orchestrator keeps it in tools. Traces prove which ran." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'patterns', icon: '🤝', label: '1. Two Patterns', desc: 'Flows + custom knobs' },
          { id: 'sim', icon: '🔬', label: '2. Pattern Picker', desc: 'Query shape → pattern' },
          { id: 'code', icon: '🛠️', label: '3. SDK Code', desc: 'Triage + orchestrator' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'patterns' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{WHY_MULTI.map((w, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{w.why}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{w.detail}</div></Card>))}</Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">
            <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
              <strong style={{ fontSize: '12px', color: '#3A9B9F' }}>Handoff flow (+custom knobs):</strong>
              {HANDOFF_FLOW.map((h, i) => (<div key={i} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', fontFamily: 'monospace', marginTop: '4px' }}>{h.step} — {h.code}</div>))}
              {HANDOFF_CUSTOM.map((c, i) => (<div key={i} style={{ fontSize: '11px', color: '#F5A623', marginTop: '4px' }}>⚙ {c.knob}: {c.does}</div>))}
            </Card>
            <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
              <strong style={{ fontSize: '12px', color: '#3A9B9F' }}>Agents-as-tools flow:</strong>
              {TOOLS_PATTERN.map((t, i) => (<div key={i} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', fontFamily: 'monospace', marginTop: '4px' }}>{t.step} — {t.code}</div>))}
            </Card>
          </Grid>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Need</th><th style={{ padding: '8px' }}>Pick</th><th style={{ textAlign: 'left', padding: '8px' }}>Why</th></tr></thead>
            <tbody>{PICK_TABLE.map((p, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white' }}>{p.need}</td><td style={{ padding: '8px', textAlign: 'center', color: '#3A9B9F', fontWeight: 'bold' }}>{p.pick}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{p.why}</td></tr>))}</tbody></table></div>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Pattern picker simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Domains in query: {domains}</label>
              <input type="range" min="1" max="4" value={domains} onChange={e => setDomains(+e.target.value)} style={{ width: '100%', marginBottom: '8px' }} />
              <Stack gap={2}>
                {[['Combine into one answer', combine, setCombine], ['Precise downstream inputs needed', precise, setPrecise], ['Audit each transfer', audit, setAudit]].map(([l, v, s], i) => (
                  <label key={i} style={{ fontSize: '12px', color: 'white', cursor: 'pointer' }}><input type="checkbox" checked={v} onChange={e => s(e.target.checked)} /> {l}</label>
                ))}
              </Stack>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
              <strong style={{ color: '#3A9B9F' }}>{r.pattern}</strong>
              <div style={{ fontSize: '12px', color: 'white', marginTop: '6px' }}>{r.why}</div>
              <div style={{ fontSize: '11px', color: '#3A9B9F', fontFamily: 'monospace', marginTop: '4px' }}>{r.code}</div>
              <div style={{ fontSize: '11px', color: '#F5A623', marginTop: '4px' }}>⚠ {r.warn}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Triage, orchestrator, and the coordinate fix</h3></div>
          <CodeBlock language="python" code={PYTHON_SDK_CODE} />
          <Callout type="success"><strong>Hardest lesson, cheapest fix:</strong> shared place-names drift across agents. Explicit typed inputs (lat/lon) beat hoping every specialist resolves "Jakarta" identically.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
