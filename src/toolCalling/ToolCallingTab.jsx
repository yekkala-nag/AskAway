import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { WHY_BRIDGE, ANATOMY, PROVIDER_SHAPES, FAILURE_MODES, TASK_IDS, BUILD_CALL, PYTHON_TOOLS_CODE, SCHEMA_BRIDGE_WEIGHTS_CARD, AGENT_LOOP_STAGES, AGENT_LOOP_MODES, AGENT_LOOP_MEMORY, AGENT_LOOP_FAILURES, RUN_AGENT_LOOP } from './toolsEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });
const TASK_LABELS = { weather: 'Get weather', refund: 'Refund lookup', escalate: 'Escalate ticket' };

export default function ToolCallingTab() {
  const [sub, setSub] = useState('bridge');
  const [task, setTask] = useState('weather');
  const [good, setGood] = useState(true);
  const [loopCap, setLoopCap] = useState(3);
  const [loopNeed, setLoopNeed] = useState(6);
  const loopResult = RUN_AGENT_LOOP(loopNeed, loopCap);
  const r = BUILD_CALL(task, good);
  const rc = r.verdict.startsWith('VALID') ? '#5EC4C8' : '#ef4444';
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="agents_frameworks" moduleLabel="Agent Systems & Frameworks [Function Calling Basics]"
        title="Wishes In, Actions Out — Schemas In Between"
        description="The bridge from data pipelines to agent execution: typed function contracts both sides understand. Build a call, break a call, watch validation decide before anything executes."
        metrics={[{ label: 'Contract', value: 'JSON Schema' }, { label: 'Rule', value: 'Validate first' }, { label: 'Batch', value: 'Parallel calls' }, { label: 'Writes', value: 'Idempotent' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="agents_frameworks" src="/assets/tool_calling.svg" alt="Function calling bridge" title="Data → Schema → Action" caption="Schemas turn model wishes into machine actions — validated pre-execution." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'bridge', icon: '🌉', label: '1. Bridge + Anatomy', desc: 'Why + parts' },
          { id: 'sim', icon: '🔬', label: '2. Call Builder Sim', desc: 'Good vs broken args' },
          { id: 'code', icon: '🛠️', label: '3. Contract Code', desc: 'Validate first' },
          { id: 'loop', icon: '🔁', label: '4. First Agent Loop', desc: 'Cycle + cap sim' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'bridge' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{WHY_BRIDGE.map((w, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}><div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>{w.from} → {w.to}</div><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{w.bridge}</div></Card>))}</Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{ANATOMY.map((a, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold', fontFamily: 'monospace' }}>{a.part}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{a.role}</div><div style={{ fontSize: '11px', color: '#F5A623' }}>{a.bad}</div></Card>))}</Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{FAILURE_MODES.map((f, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #ef4444' }}><div style={{ fontSize: '12px', color: '#ef4444', fontWeight: 'bold' }}>{f.fail}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>→ {f.fix}</div></Card>))}</Grid>
          <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5B4B8A' }}>
            <div style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)', fontWeight: 'bold' }}>{SCHEMA_BRIDGE_WEIGHTS_CARD.title}</div>
            <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>{SCHEMA_BRIDGE_WEIGHTS_CARD.message}</div>
            <ul style={{ margin: '6px 0', paddingLeft: '18px', fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>
              {SCHEMA_BRIDGE_WEIGHTS_CARD.signs.map((s, i) => (<li key={i}>{s}</li>))}
            </ul>
            <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Next step: see {SCHEMA_BRIDGE_WEIGHTS_CARD.fineTuneTabName}, subtab 8.</div>
          </Card>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Call-builder simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <Flex gap="var(--ds-space-2)" style={{ flexWrap: 'wrap', marginBottom: '10px' }}>
                {TASK_IDS.map(id => (<Button key={id} variant={task === id ? 'primary' : 'secondary'} size="sm" onClick={() => setTask(id)}>{TASK_LABELS[id]}</Button>))}
              </Flex>
              <Flex gap="var(--ds-space-2)">
                <Button variant={good ? 'primary' : 'secondary'} size="sm" onClick={() => setGood(true)}>Send good args</Button>
                <Button variant={!good ? 'primary' : 'secondary'} size="sm" onClick={() => setGood(false)}>Send broken args</Button>
              </Flex>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${rc}` }}>
              <div style={{ fontSize: '12px', color: 'white', fontFamily: 'monospace' }}>{r.fn}({r.args})</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>{r.schema}</div>
              <div style={{ fontSize: '13px', color: rc, fontWeight: 'bold', marginTop: '6px' }}>{r.verdict}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>{r.explain}</div>
            </Card>
          </Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{PROVIDER_SHAPES.map((p, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{p.provider}</div><div style={{ fontSize: '11px', color: '#3A9B9F', fontFamily: 'monospace' }}>{p.shape}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{p.note}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Schema-first tools, validated</h3></div>
          <CodeBlock language="python" code={PYTHON_TOOLS_CODE} />
          <Callout type="success"><strong>Bridge rule:</strong> data teams emit schemas agents can satisfy; agent teams validate before executing. The contract is the collaboration.</Callout>
        </Stack></Card></Stack>)}
        {sub === 'loop' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔁 First Agent Loop: request → validate → execute → respond</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>Start single-tool, then loop-until-done. Memory rides along as persistent messages.</p>
          </div>
          <svg viewBox="0 0 520 110" width="100%" height="110" role="img" aria-label="Agent loop diagram" style={{ background: 'var(--ds-color-bg-surface)', borderRadius: '8px', border: '1px solid var(--ds-color-border-subtle)' }}>
            <g fontSize="11" fontFamily="monospace" textAnchor="middle">
              <rect x="8" y="30" width="100" height="44" rx="8" fill="none" stroke="#3A9B9F" strokeWidth="2" />
              <text x="58" y="56" style={{ fill: 'var(--ds-color-text-primary)' }}>request</text>
              <text x="122" y="56" fill="#3A9B9F">→</text>
              <rect x="136" y="30" width="100" height="44" rx="8" fill="none" stroke="#1A6B6E" strokeWidth="2" />
              <text x="186" y="56" style={{ fill: 'var(--ds-color-text-primary)' }}>validate</text>
              <text x="250" y="56" fill="#3A9B9F">→</text>
              <rect x="264" y="30" width="100" height="44" rx="8" fill="none" stroke="#5B4B8A" strokeWidth="2" />
              <text x="314" y="56" style={{ fill: 'var(--ds-color-text-primary)' }}>execute</text>
              <text x="378" y="56" fill="#3A9B9F">→</text>
              <rect x="392" y="30" width="100" height="44" rx="8" fill="none" stroke="#B9821F" strokeWidth="2" />
              <text x="442" y="56" style={{ fill: 'var(--ds-color-text-primary)' }}>respond</text>
              <path d="M 442 74 C 442 96, 58 96, 58 74" fill="none" stroke="#B4553A" strokeWidth="2" strokeDasharray="5 4" />
              <text x="250" y="104" style={{ fill: 'var(--ds-color-text-tertiary)' }}>loop-until-done</text>
            </g>
          </svg>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">{AGENT_LOOP_STAGES.map((s) => (<Card key={s.id} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #3A9B9F' }}><div style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)', fontWeight: 'bold' }}>{s.label}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{s.detail}</div></Card>))}</Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{AGENT_LOOP_MODES.map((m, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${i === 0 ? '#1A6B6E' : '#B4553A'}` }}><div style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)', fontWeight: 'bold', fontFamily: 'monospace' }}>{m.mode}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{m.detail}</div></Card>))}</Grid>
          <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
            <div style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)', fontWeight: 'bold', marginBottom: '8px' }}>Iteration-cap simulator</div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <label style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>Cap: {loopCap}
                <input type="range" min="1" max="8" value={loopCap} onChange={e => setLoopCap(Number(e.target.value))} style={{ display: 'block', width: '160px' }} />
              </label>
              <label style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>Steps needed: {loopNeed}
                <input type="range" min="1" max="8" value={loopNeed} onChange={e => setLoopNeed(Number(e.target.value))} style={{ display: 'block', width: '160px' }} />
              </label>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', fontFamily: 'monospace' }}>{loopResult.transcript.join(' · ') || 'no iterations yet'}</div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '6px', color: loopResult.completed ? '#3A9B9F' : '#B4553A' }}>{loopResult.completed ? `Done in ${loopResult.stepsTaken} steps.` : `${loopResult.fallback} — ${loopResult.lesson}`}</div>
          </Card>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>MEMORY AS PERSISTENT MESSAGES:</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', textAlign: 'left', color: 'var(--ds-color-text-secondary)' }}><th style={{ padding: '6px' }}>Strategy</th><th style={{ padding: '6px' }}>Constraint</th></tr></thead>
                <tbody>{AGENT_LOOP_MEMORY.map((m, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '6px', color: '#3A9B9F', fontWeight: 'bold', fontFamily: 'monospace' }}>{m.strategy}</td><td style={{ padding: '6px', color: 'var(--ds-color-text-secondary)' }}>{m.constraint}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>FAILURE-PATH TRIAGE:</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', textAlign: 'left', color: 'var(--ds-color-text-secondary)' }}><th style={{ padding: '6px' }}>Failure</th><th style={{ padding: '6px' }}>Triage</th></tr></thead>
                <tbody>{AGENT_LOOP_FAILURES.map((f, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '6px', color: '#B4553A', fontWeight: 'bold' }}>{f.failure}</td><td style={{ padding: '6px', color: 'var(--ds-color-text-secondary)' }}>{f.triage}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
