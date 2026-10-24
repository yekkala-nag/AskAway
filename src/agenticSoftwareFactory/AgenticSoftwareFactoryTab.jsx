import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import {
  HIERARCHY_LAYERS,
  PRACTICES,
  COORDINATION_MODES,
  DIAGNOSE_FACTORY,
  PYTHON_FACTORY_TRIGGER
} from './asfEngine.js';

const { Container, Grid, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '180px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-agents-primary, #F0A89A)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

const SCORE_LABELS = [
  { key: 'harness', label: 'Harness (run + debug)' },
  { key: 'personalization', label: 'Personalization (rules & context)' },
  { key: 'automation', label: 'Automation (background starts)' },
  { key: 'learning', label: 'Learning (post-run improvements)' }
];

export default function AgenticSoftwareFactoryTab() {
  const [sub, setSub] = useState('pyramid');
  const [scores, setScores] = useState({ harness: 2, personalization: 1, automation: 1, learning: 0 });
  const diag = DIAGNOSE_FACTORY(scores);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="agents_frameworks"
        moduleLabel="Agent Systems & Frameworks [Agentic Software Factory]"
        title="Delegate Outcomes — Autonomous, Asynchronous, Verifiable"
        description="A software factory combines an agent harness, durable project context, triggers that start work without you, and loops that improve from run evidence. You own specification and verification; implementation can proceed while you are away."
        metrics={[
          { label: 'Core pair', value: 'Auto + Async' },
          { label: 'Layers', value: '4' },
          { label: 'Through-line', value: 'Spec + Verify' },
          { label: 'Start size', value: '1 agent + cron' }
        ]}
      />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <DiagramImage
            moduleId="agents_frameworks"
            src="/assets/agentic_software_factory.svg"
            alt="Agentic software factory hierarchy"
            title="Factory hierarchy of needs"
            caption="Each layer depends on the ones below; specification and verification run through all four."
            background="#090d16"
            maxWidth={1100}
          />
        </div>
        <div style={NAV}>
          {[
            { id: 'pyramid', icon: '🏗️', label: '1. Four layers', desc: 'Harness → learning' },
            { id: 'coord', icon: '🔀', label: '2. Coordination', desc: 'Workers & checks' },
            { id: 'sim', icon: '🔬', label: '3. Maturity sim', desc: 'What to fix next' },
            { id: 'code', icon: '🛠️', label: '4. Trigger sketch', desc: 'Ready-task pickup' }
          ].map(t => (
            <button key={t.id} type="button" onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}>
              <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}>
                <span>{t.icon}</span><span>{t.label}</span>
              </div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div>
            </button>
          ))}
        </div>

        {sub === 'pyramid' && (
          <Stack gap={6}>
            <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
              {PRACTICES.map(p => (
                <Card key={p.id} style={{ padding: 'var(--ds-space-4)', borderLeft: '4px solid #5EC4C8' }}>
                  <div style={{ fontWeight: 700, color: 'white' }}>{p.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', marginTop: 6 }}>{p.desc}</div>
                </Card>
              ))}
            </Grid>
            <Stack gap={3}>
              {HIERARCHY_LAYERS.map(layer => (
                <Card key={layer.id} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-canvas)', borderLeft: `4px solid ${layer.color}` }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: layer.color }}>{layer.tag}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>{layer.name}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ds-color-text-secondary)', marginTop: 6 }}>{layer.needs}</div>
                  <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)" style={{ marginTop: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, letterSpacing: '0.08em', color: '#F5A623' }}>PAIN SIGNALS</div>
                      <ul style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 12, color: 'var(--ds-color-text-secondary)' }}>
                        {layer.signals.map(s => <li key={s}>{s}</li>)}
                      </ul>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, letterSpacing: '0.08em', color: '#5EC4C8' }}>FIXES</div>
                      <ul style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 12, color: 'var(--ds-color-text-secondary)' }}>
                        {layer.fixes.map(f => <li key={f}>{f}</li>)}
                      </ul>
                    </div>
                  </Grid>
                </Card>
              ))}
            </Stack>
            <Callout type="info">
              <strong>Factory ≠ chat session:</strong> autonomous step choice plus work that continues without live attention — with evidence or a named blocker when you return.
            </Callout>
          </Stack>
        )}

        {sub === 'coord' && (
          <Stack gap={4}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}>
                    <th style={{ textAlign: 'left', padding: 8 }}>Pattern</th>
                    <th style={{ textAlign: 'left', padding: 8 }}>When</th>
                    <th style={{ textAlign: 'left', padding: 8 }}>Watch</th>
                  </tr>
                </thead>
                <tbody>
                  {COORDINATION_MODES.map(row => (
                    <tr key={row.mode} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                      <td style={{ padding: 8, color: 'white', fontWeight: 600 }}>{row.mode}</td>
                      <td style={{ padding: 8, color: 'var(--ds-color-text-secondary)' }}>{row.when}</td>
                      <td style={{ padding: 8, color: '#F0A89A' }}>{row.risk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Card style={{ padding: 'var(--ds-space-4)', background: '#090d16' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 8 }}>Verification mix (same shipment)</div>
              <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">
                {[
                  { t: 'Deterministic', d: 'Balances, persistence, invariants — code owns truth.' },
                  { t: 'Agent review', d: 'Missed requirements, cross-feature inconsistencies.' },
                  { t: 'Human judgment', d: 'Workflow fit, product trade-offs, approval gates.' }
                ].map(c => (
                  <div key={c.t} style={{ padding: 10, border: '1px solid var(--ds-color-border-subtle)', borderRadius: 8 }}>
                    <div style={{ color: '#5EC4C8', fontSize: 11, fontWeight: 700 }}>{c.t}</div>
                    <div style={{ fontSize: 11, color: 'var(--ds-color-text-secondary)', marginTop: 4 }}>{c.d}</div>
                  </div>
                ))}
              </Grid>
            </Card>
          </Stack>
        )}

        {sub === 'sim' && (
          <Stack gap={4}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <h3 style={{ margin: '0 0 12px' }}>Maturity diagnostic (0 = missing, 3 = solid)</h3>
              <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                <Stack gap={3}>
                  {SCORE_LABELS.map(({ key, label }) => (
                    <div key={key}>
                      <label style={{ fontSize: 11, color: 'white' }}>{label}: {scores[key]}</label>
                      <input
                        type="range"
                        min={0}
                        max={3}
                        step={1}
                        value={scores[key]}
                        onChange={e => setScores(s => ({ ...s, [key]: +e.target.value }))}
                        style={{ width: '100%' }}
                      />
                    </div>
                  ))}
                </Stack>
                <Card style={{ padding: 14, borderLeft: '4px solid #F0A89A' }}>
                  <div style={{ fontSize: 13, color: 'white', fontWeight: 700 }}>Maturity {diag.maturity}</div>
                  <div style={{ fontSize: 12, color: '#5EC4C8', marginTop: 8 }}>Invest next: {diag.nextLayer}</div>
                  {diag.blockers.length > 0 && (
                    <div style={{ fontSize: 11, color: '#ef4444', marginTop: 6 }}>Blockers at 0: {diag.blockers.join(', ')}</div>
                  )}
                  <div style={{ fontSize: 12, color: 'var(--ds-color-text-secondary)', marginTop: 10 }}>{diag.advice}</div>
                </Card>
              </Grid>
            </Card>
          </Stack>
        )}

        {sub === 'code' && (
          <Stack gap={4}>
            <CodeBlock language="python" code={PYTHON_FACTORY_TRIGGER} />
            <Callout type="success">
              <strong>Queue hygiene:</strong> dedupe ready tasks, cap spend/time, persist partial progress so the next worker continues — not a replay of the whole chat.
            </Callout>
          </Stack>
        )}
      </Container>
    </div>
  );
}
