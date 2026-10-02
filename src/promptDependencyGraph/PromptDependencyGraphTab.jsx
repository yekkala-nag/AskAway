import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import {
  ARTICLE_RESULTS, SHARING_CURVE, VOCAB_TABLE, RUNTIME_TABLE,
  AGENTS, WORKFLOWS, CHANGE_OPTIONS, COMPUTE_IMPACT,
  PYTHON_PROMPT_GRAPH_CODE
} from './dependencyEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function PromptDependencyGraphTab() {
  const [activeSubTab, setActiveSubTab] = useState('blast');
  const [changeIdx, setChangeIdx] = useState(0);
  const change = CHANGE_OPTIONS[changeIdx];
  const impact = COMPUTE_IMPACT(change.component, change.section);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="foundations"
        moduleLabel="Foundations & Architecture [Prompt Dependency Graph]"
        title="One Prompt Change Can Hit 50 Others — Know What to Retest"
        description="Composable prompts create a blast radius with no compiler to catch it. Pure-Python dependency graph separates Reachable (structural ceiling) from Candidate (section-aware eval set)."
        metrics={[
          { label: 'Experiment', value: '55 Nodes, Seed 7' },
          { label: 'Best Narrowing', value: '85% → 8 Candidates' },
          { label: 'Honest Zero', value: 'tone: 55/55' },
          { label: 'Impact Compute', value: '~0.04 ms' }
        ]}
      />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <DiagramImage moduleId="foundations" src="/assets/prompt_dependency_graph.svg" alt="Prompt dependency blast radius" title="Reachable vs Candidate + Sharing Curve" caption="Top: base-policy/refunds edit splits downstream into candidate (orange), reachable-not-candidate (gray), not-reachable (green). Bottom: narrowing collapses as sharing → 100%." background="#090d16" maxWidth={1100} />
        </div>

        <div style={{ display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' }}>
          {[
            { id: 'blast', icon: '💥', label: '1. Blast Radius', desc: 'Why flat lookup fails' },
            { id: 'sim', icon: '🔬', label: '2. Impact Simulator', desc: 'Reachable vs candidate live' },
            { id: 'curve', icon: '📈', label: '3. Results + Sharing Curve', desc: '55-node numbers + vocab' },
            { id: 'code', icon: '🛠️', label: '4. Python Graph Code', desc: 'BFS + section diff' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveSubTab(tab.id)} style={{ flex: 1, minWidth: '210px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: activeSubTab === tab.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: activeSubTab === tab.id ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left', fontWeight: activeSubTab === tab.id ? 'var(--ds-font-weight-semibold)' : 'var(--ds-font-weight-medium)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--ds-font-size-body)', marginBottom: '2px' }}><span>{tab.icon}</span><span>{tab.label}</span></div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{tab.desc}</div>
            </button>
          ))}
        </div>

        {activeSubTab === 'blast' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={{ margin: 0 }}>💥 Composability creates the eval surface</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>base-policy → support/sales/analyst agents → workflows → JSON/email/report. One sentence (30d → 14d refunds) propagates everywhere. Like Bazel: rebuild only what is downstream. Like chaos engineering: keep blast radius legible.</p></div>
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #ef4444' }}>
                    <strong style={{ color: '#ef4444' }}>Flat lookup fails on deep chains</strong>
                    <p style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>comp-b → agent → workflow → agent → workflow = 4 real consumers. One-hop lookup reports <b>1</b>, misses 3. Graph BFS reports <b>4</b>. Prompts layer like org charts; risks live hops away.</p>
                  </Card>
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <strong style={{ color: '#3A9B9F' }}>Section model fixes over-counting</strong>
                    <p style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', fontFamily: 'monospace' }}>PromptComponent(name, version, sections) + SectionDependency(component, sections, kind). sales-* uses privacy, not refunds → excluded from refunds candidate. Kind (imports/inherits/…) modeled now, used in v2.</p>
                  </Card>
                </Grid>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                    <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Role (10 teams each)</th><th style={{ textAlign: 'left', padding: '8px' }}>base-policy usage</th><th style={{ padding: '8px' }}>Note</th></tr></thead>
                    <tbody>
                      {[["support", "refunds + privacy (+escalation ent/vip)", "heaviest consumer"], ["sales", "privacy only (+escalation ent/partner)", "narrow surface"], ["analyst", "escalation only (references)", "reads, doesn't own"], ["operations", "refunds + escalation + safety", "inherits safety"], ["marketing", "none — deliberately disconnected", "tests zero-exposure"], ["workflows ×5", "transitive via 3 member agents", "diamond shapes"]].map((r, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{r[0]}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)', fontFamily: 'monospace' }}>{r[1]}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{r[2]}</td></tr>))}
                    </tbody>
                  </table>
                </div>
              </Stack>
            </Card>
          </Stack>
        )}

        {activeSubTab === 'sim' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={{ margin: 0 }}>🔬 Impact Simulator — distilled 11-node replica of the 55-node system</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>Same mechanism as the article: section diff → BFS from section seeds (candidate) vs BFS from whole component (reachable). Marketing has zero base-policy exposure by design.</p></div>
                <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
                  <strong style={{ fontSize: '11px', color: '#F5A623', display: 'block', marginBottom: '8px' }}>CHANGE TARGET:</strong>
                  <Flex gap="var(--ds-space-2)" style={{ flexWrap: 'wrap' }}>
                    {CHANGE_OPTIONS.map((c, i) => (
                      <Button key={i} variant={i === changeIdx ? 'primary' : 'secondary'} size="sm" onClick={() => setChangeIdx(i)}>{c.component} / {c.section}</Button>
                    ))}
                  </Flex>
                  <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--ds-color-text-secondary)', fontFamily: 'monospace' }}>v1: "{change.v1}" → v2: "{change.v2}" · changed_sections() = [{change.section}]</div>
                </Card>
                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #ef4444' }}>
                    <strong style={{ fontSize: '12px', color: '#ef4444' }}>REACHABLE: {impact.reachable.length}</strong>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>structural ceiling — any-section downstream</div>
                    <div style={{ marginTop: '6px', fontSize: '11px', fontFamily: 'monospace', color: 'white' }}>{impact.reachable.join(', ') || '—'}</div>
                  </Card>
                  <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #fb923c' }}>
                    <strong style={{ fontSize: '12px', color: '#fb923c' }}>CANDIDATE: {impact.candidate.length} · narrow {impact.narrowing}%</strong>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>section seeds + downstream — the eval set</div>
                    <div style={{ marginTop: '6px', fontSize: '11px', fontFamily: 'monospace', color: 'white' }}>{impact.candidate.join(', ') || '—'}</div>
                  </Card>
                  <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <strong style={{ fontSize: '12px', color: '#3A9B9F' }}>SKIPPED: {impact.reachableNotCandidate.length + impact.notReachable.length}</strong>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>reachable-not-candidate: {impact.reachableNotCandidate.join(', ') || '—'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>not reachable: {impact.notReachable.join(', ') || '—'}</div>
                  </Card>
                </Grid>
                <Callout type="success"><strong>Read honestly:</strong> candidates are <i>what to evaluate</i>, not <i>what will fail</i>. Behaviour still needs the eval run. Try <b>tone / professional</b> — every agent inherits it, so candidate == reachable (the article's honest 0%).</Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {activeSubTab === 'curve' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={{ margin: 0 }}>📈 Article results + sharing curve + precise vocabulary</h3></div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                    <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Change</th><th style={{ padding: '8px' }}>Reachable</th><th style={{ padding: '8px' }}>Candidate</th><th style={{ padding: '8px' }}>Narrowing</th><th style={{ textAlign: 'left', padding: '8px' }}>Why</th></tr></thead>
                    <tbody>{ARTICLE_RESULTS.map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontFamily: 'monospace', fontWeight: 'bold' }}>{r.change}</td><td style={{ padding: '8px', textAlign: 'center', color: '#ef4444' }}>{r.reachable}</td><td style={{ padding: '8px', textAlign: 'center', color: '#fb923c', fontWeight: 'bold' }}>{r.candidate}</td><td style={{ padding: '8px', textAlign: 'center', color: r.narrowing ? '#5EC4C8' : 'var(--ds-color-text-tertiary)' }}>{r.narrowing}%</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{r.note}</td></tr>))}</tbody>
                  </table>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                    <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ padding: '8px' }}>Sharing</th><th style={{ padding: '8px' }}>Direct</th><th style={{ padding: '8px' }}>Reachable</th><th style={{ padding: '8px' }}>Candidate</th><th style={{ padding: '8px' }}>Narrowing</th></tr></thead>
                    <tbody>{SHARING_CURVE.map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>{r.sharing}</td><td style={{ padding: '8px', textAlign: 'center', color: 'var(--ds-color-text-secondary)' }}>{r.sharedAgents}</td><td style={{ padding: '8px', textAlign: 'center', color: 'var(--ds-color-text-secondary)' }}>{r.reachable}</td><td style={{ padding: '8px', textAlign: 'center', color: '#3A9B9F' }}>{r.candidate}</td><td style={{ padding: '8px', textAlign: 'center', color: '#3A9B9F', fontWeight: 'bold' }}>{r.narrowing}%</td></tr>))}</tbody>
                  </table>
                </div>
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
                    <strong style={{ fontSize: '11px', color: '#F5A623' }}>SAY THIS, NOT THAT:</strong>
                    {VOCAB_TABLE.map((v, i) => (<div key={i} style={{ fontSize: '11px', marginTop: '4px', color: 'var(--ds-color-text-secondary)' }}><span style={{ color: '#ef4444', textDecoration: 'line-through' }}>{v.avoid}</span> → <span style={{ color: '#3A9B9F', fontWeight: 'bold' }}>{v.use}</span> <span style={{ color: 'var(--ds-color-text-tertiary)' }}>— {v.why}</span></div>))}
                  </Card>
                  <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
                    <strong style={{ fontSize: '11px', color: '#3A9B9F' }}>RUNTIME (Py3.12 CPU, stdlib core):</strong>
                    {RUNTIME_TABLE.map((r, i) => (<div key={i} style={{ fontSize: '11px', marginTop: '4px', color: 'var(--ds-color-text-secondary)' }}><span style={{ color: 'white' }}>{r.op}</span>: <span style={{ fontFamily: 'monospace', color: '#3A9B9F' }}>{r.latency}</span> <span style={{ color: 'var(--ds-color-text-tertiary)' }}>({r.notes})</span></div>))}
                    <div style={{ fontSize: '11px', marginTop: '8px', color: 'var(--ds-color-text-tertiary)' }}>Honest limits: mechanical text diff (1-char fix = full rewrite), no rename inference, kinds unused in v1, 55-node toy scope, no cycles / no prod-scale validation yet.</div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={{ margin: 0 }}>🛠️ Pure-Python implementation (repo-faithful)</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>Deterministic (seed 7), reproduced on a second machine. Runs above are live JS ports of the same BFS.</p></div>
                <CodeBlock language="python" code={PYTHON_PROMPT_GRAPH_CODE} />
                <Callout type="success"><strong>Make the cost of change visible:</strong> the graph never says what <i>will</i> break — it draws a defensible evaluation boundary before you pay for the evals.</Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
