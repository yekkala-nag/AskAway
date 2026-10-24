import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { BOTTLENECK_TABLE, VARIANT_TABLE, FRAMEWORK_TABLE, SIM_SPECULATIVE, PYTHON_SPEC_CONFIG } from './specEngine.js';

const { Container, Grid, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '180px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-frontiers-primary, #9B89C4)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function SpeculativeDecodingTab() {
  const [sub, setSub] = useState('loop');
  const [k, setK] = useState(6);
  const [acceptance, setAcceptance] = useState(0.78);
  const sim = SIM_SPECULATIVE(k, acceptance);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="frontiers_production"
        moduleLabel="Production & Frontiers [Speculative Decoding]"
        title="Draft k Tokens, Verify in One Pass — Same Distribution, Faster"
        description="Autoregressive decoding is memory-bandwidth bound: each token reloads the full weight set. A fast draft proposes a short chain; the target model accepts or rejects in parallel — often 2–3× faster without changing weights or output quality."
        metrics={[
          { label: 'Typical gain', value: '2–3×' },
          { label: 'Draft depth', value: '4–8 tok' },
          { label: 'Quality', value: 'Lossless*' },
          { label: 'Sweet spot', value: 'Long gen' }
        ]}
      />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <DiagramImage moduleId="frontiers_production" src="/assets/arch_speculative.svg" alt="Speculative decoding" title="Draft → verify loop" caption="Cheap draft proposes; target validates batch — reject triggers corrected sample." background="#090d16" maxWidth={1100} />
        </div>
        <div style={NAV}>
          {[
            { id: 'loop', icon: '🔁', label: '1. Draft/verify', desc: 'Why it is faster' },
            { id: 'variants', icon: '🧬', label: '2. Variants', desc: 'Beyond 2-model' },
            { id: 'sim', icon: '🔬', label: '3. Speed sim', desc: 'Acceptance × k' },
            { id: 'code', icon: '🛠️', label: '4. Enable', desc: 'Serving flags' }
          ].map(t => (
            <button key={t.id} type="button" onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}>
              <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div>
            </button>
          ))}
        </div>

        {sub === 'loop' && (
          <Stack gap={4}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}>
                    <th style={{ textAlign: 'left', padding: 8 }}>Stage</th>
                    <th style={{ textAlign: 'left', padding: 8 }}>What happens</th>
                    <th style={{ textAlign: 'left', padding: 8 }}>Limit</th>
                  </tr>
                </thead>
                <tbody>
                  {BOTTLENECK_TABLE.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                      <td style={{ padding: 8, color: 'white', fontWeight: 600 }}>{r.factor}</td>
                      <td style={{ padding: 8, color: 'var(--ds-color-text-secondary)' }}>{r.effect}</td>
                      <td style={{ padding: 8, color: '#C9B8E8' }}>{r.bound}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Card style={{ padding: 'var(--ds-space-4)', background: '#090d16' }}>
              <ol style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: 'var(--ds-color-text-secondary)', lineHeight: 1.8 }}>
                <li>Draft model autoregressively proposes <strong style={{ color: 'white' }}>k</strong> candidates quickly.</li>
                <li>Target runs <strong style={{ color: 'white' }}>one</strong> forward pass over the chain and compares token probabilities.</li>
                <li>Accept while target confidence ≥ draft; on reject, sample correction and restart loop.</li>
                <li>Best case: accept all k plus one bonus token — many tokens per target load.</li>
              </ol>
            </Card>
            <Callout type="warning">
              <strong>Batch serving trade-off:</strong> under heavy concurrent batching, speculative tokens can reduce total throughput — enable for latency-sensitive single streams, not always for max QPS.
            </Callout>
          </Stack>
        )}

        {sub === 'variants' && (
          <Stack gap={4}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}>
                    <th style={{ textAlign: 'left', padding: 8 }}>Approach</th>
                    <th style={{ textAlign: 'left', padding: 8 }}>Draft source</th>
                    <th style={{ padding: 8 }}>Distribution</th>
                    <th style={{ textAlign: 'left', padding: 8 }}>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {VARIANT_TABLE.map((v, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                      <td style={{ padding: 8, color: 'white', fontWeight: 600 }}>{v.name}</td>
                      <td style={{ padding: 8, color: 'var(--ds-color-text-secondary)' }}>{v.draft}</td>
                      <td style={{ padding: 8, color: '#5EC4C8', fontSize: 10 }}>{v.guarantee}</td>
                      <td style={{ padding: 8, color: 'var(--ds-color-text-secondary)' }}>{v.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">
              {FRAMEWORK_TABLE.map(f => (
                <Card key={f.stack} style={{ padding: 12, borderLeft: '3px solid #9B89C4' }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 12 }}>{f.stack}</div>
                  <div style={{ fontSize: 11, color: '#C9B8E8', marginTop: 4 }}>{f.flag}</div>
                  <div style={{ fontSize: 11, color: 'var(--ds-color-text-secondary)', marginTop: 4 }}>{f.note}</div>
                </Card>
              ))}
            </Grid>
          </Stack>
        )}

        {sub === 'sim' && (
          <Stack gap={4}>
            <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
              <Card style={{ padding: 14, background: '#090d16' }}>
                <label style={{ fontSize: 11, color: 'white' }}>Draft depth k: {k}</label>
                <input type="range" min={2} max={10} step={1} value={k} onChange={e => setK(+e.target.value)} style={{ width: '100%' }} />
                <label style={{ fontSize: 11, color: 'white' }}>Acceptance rate: {Math.round(acceptance * 100)}%</label>
                <input type="range" min={0.3} max={0.95} step={0.01} value={acceptance} onChange={e => setAcceptance(+e.target.value)} style={{ width: '100%' }} />
              </Card>
              <Card style={{ padding: 14, borderLeft: `4px solid ${acceptance < 0.45 ? '#ef4444' : '#5EC4C8'}` }}>
                <div style={{ fontSize: 14, color: 'white', fontWeight: 700 }}>Est. speedup {sim.speedup}</div>
                <div style={{ fontSize: 12, color: 'var(--ds-color-text-secondary)', marginTop: 6 }}>E[accepted] ≈ {sim.expectedAccepted} of {sim.k} per step</div>
                <div style={{ fontSize: 12, color: '#C9B8E8', marginTop: 6 }}>{sim.verdict}</div>
                <div style={{ fontSize: 11, color: 'var(--ds-color-text-tertiary)', marginTop: 8 }}>{sim.lossless}</div>
              </Card>
            </Grid>
          </Stack>
        )}

        {sub === 'code' && (
          <Stack gap={4}>
            <CodeBlock language="python" code={PYTHON_SPEC_CONFIG} />
            <Callout type="success">
              <strong>Practitioner rule:</strong> pair draft/target from the same tokenizer family; tune k where acceptance × k is maximized on your real prompts (code and summarization often exceed 80%).
            </Callout>
          </Stack>
        )}
      </Container>
    </div>
  );
}
