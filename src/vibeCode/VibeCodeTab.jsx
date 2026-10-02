import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { UNIT_CASE, FAILURE_MODES, VIBE_DISCIPLINE, DAILY_PNL, PYTHON_VIBE_CODE } from './vibeEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function VibeCodeTab() {
  const [sub, setSub] = useState('case');
  const [visitors, setVisitors] = useState(200);
  const [searches, setSearches] = useState(1.5);
  const [cost, setCost] = useState(0.17);
  const r = DAILY_PNL(visitors, searches, cost);
  const rc = r.net >= 0 ? '#5EC4C8' : '#ef4444';
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="agents_frameworks" moduleLabel="Agent Systems & Frameworks [Vibe-Coding Economics]"
        title="Two Hours to Build, $52 a Day to Regret"
        description="Ukuflow: free to build on credits, −$48/day to run for 200 users. Overkill solution, shrinking beginner market, untested assumption — corrected by static-first pages and a minimum viable offer."
        metrics={[{ label: 'Build', value: '$0' }, { label: 'Run (1 day)', value: '$52' }, { label: 'Net', value: '−$48/day' }, { label: 'Fix', value: 'Static-first' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="agents_frameworks" src="/assets/vibe_code.svg" alt="Vibe code economics" title="Agent-per-search vs Static-first" caption="Same beginners served; one bleeds $17k/yr, the other costs ~$0." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'case', icon: '🧾', label: '1. The $52 Case', desc: 'Unit lines + failures' },
          { id: 'sim', icon: '🔬', label: '2. P&L Simulator', desc: 'Your visitors, your verdict' },
          { id: 'code', icon: '🛠️', label: '3. Gate Code', desc: 'P&L + MVP offer' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'case' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Line</th><th style={{ padding: '8px' }}>Value</th><th style={{ textAlign: 'left', padding: '8px' }}>Note</th></tr></thead>
            <tbody>{UNIT_CASE.map((u, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{u.line}</td><td style={{ padding: '8px', textAlign: 'center', color: i === 2 || i === 3 ? '#ef4444' : '#5EC4C8', fontFamily: 'monospace', fontWeight: 'bold' }}>{u.value}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{u.note}</td></tr>))}</tbody></table></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{FAILURE_MODES.map((f, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #ef4444' }}><div style={{ fontSize: '12px', color: '#ef4444', fontWeight: 'bold' }}>{f.mode}</div><div style={{ fontSize: '11px', color: 'white' }}>{f.detail}</div><div style={{ fontSize: '11px', color: '#3A9B9F' }}>→ {f.fix}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Daily P&L simulator (the $52 day, tunable)</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Visitors/day: {visitors}</label>
              <input type="range" min={10} max={5000} step={10} value={visitors} onChange={e => setVisitors(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Agent searches each: {searches}</label>
              <input type="range" min={0.5} max={5} step={0.5} value={searches} onChange={e => setSearches(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Cost/search: ${cost.toFixed(2)}</label>
              <input type="range" min={0.01} max={1} step={0.01} value={cost} onChange={e => setCost(+e.target.value)} style={{ width: '100%' }} />
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${rc}` }}>
              <div style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)' }}>cost ${r.cost} · revenue ${r.rev}</div>
              <div style={{ fontSize: '20px', color: rc, fontWeight: 'bold' }}>{r.net >= 0 ? '+' : ''}${r.net}/day</div>
              <div style={{ fontSize: '12px', color: 'white', marginTop: '4px' }}>{r.verdict}</div>
              <div style={{ fontSize: '11px', color: '#3A9B9F', marginTop: '4px' }}>{r.staticAlt}</div>
            </Card>
          </Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">{VIBE_DISCIPLINE.map((d, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{d.rule}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{d.how}</div><div style={{ fontSize: '11px', color: '#ef4444' }}>kills: {d.kills}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ P&L gate + MVP-offer code</h3></div>
          <CodeBlock language="python" code={PYTHON_VIBE_CODE} />
          <Callout type="success"><strong>Career lesson (author's):</strong> AI erased his coding edge — planning, users, and iteration are the remaining moat. Vibe-code the offer, not the architecture.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
