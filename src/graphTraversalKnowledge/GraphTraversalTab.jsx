import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { Panel, GlassCard } from '../components/ui/CleanInfographics.jsx';
import {
  ROUTER_RETIREMENT_COMPARISON,
  BITEMPORAL_EDGE_CONCEPTS,
  RESOLUTION_NODES_DATA,
  RUN_ENTITY_RESOLUTION_SIMULATOR,
  PYTHON_GRAPH_TRAVERSAL_CODE
} from './graphEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

/** Native recreation: fused retrieval, bitemporal integrity, two-threshold resolution. */
function GraphTraversalPanel() {
  const pts = { fontSize: 12.5, color: '#CBD5E1', lineHeight: 1.65, margin: '6px 0 0', paddingLeft: 16 };
  const mono = {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: 12, color: '#7FE3DC', background: 'rgba(0,0,0,0.35)',
    border: '1px solid rgba(94,196,200,0.25)', borderRadius: 6,
    padding: '6px 10px', marginTop: 8, lineHeight: 1.6,
  };
  return (
    <Panel
      title="Always-Fused Graph Traversal Knowledge Layer"
      sub="Retire the heuristic router: run vector, keyword, and graph retrieval fused — on bitemporal edges with adjudicated entities."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
        <GlassCard color="#A78BFA" icon="refresh" title="1. Fused Pipeline">
          <ul style={pts}>
            <li>Retire the heuristic query router</li>
            <li>Vector + keyword + graph in parallel</li>
            <li>One optimized multi-modal result set</li>
          </ul>
        </GlassCard>
        <GlassCard color="#5EC4C8" icon="nodes" title="2. Temporal Integrity">
          <ul style={pts}>
            <li>Bitemporal edges: valid-time + system-time</li>
            <li>Contradiction detection → reconciliation log</li>
          </ul>
          <div style={mono}>valid_from / valid_to + ingested_at</div>
        </GlassCard>
        <GlassCard color="#E8C558" icon="search" title="3. Entity Resolution" badge="149 → 19">
          <ul style={pts}>
            <li>Similarity ≥ 0.90 → auto-link canonical</li>
            <li>0.60–0.90 → adjudicator: canonical or new</li>
            <li>Below 0.60 → create new entity</li>
          </ul>
        </GlassCard>
      </div>
    </Panel>
  );
}

export default function GraphTraversalTab() {
  const [activeSubTab, setActiveSubTab] = useState('pipeline'); // 'pipeline' | 'bitemporal' | 'resolver' | 'code'

  // Simulator State
  const [mentionInput, setMentionInput] = useState('Cash Settlement Payout');
  const [highThresh, setHighThresh] = useState(0.90);
  const [lowThresh, setLowThresh] = useState(0.60);

  const simResult = RUN_ENTITY_RESOLUTION_SIMULATOR(mentionInput, highThresh, lowThresh);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="rag_architecture"
        moduleLabel="RAG Architectures & Pipelines [Graph Knowledge Layer]"
        title="Making the Knowledge Layer a Graph You Actually Traverse"
        description="Replace heuristic query routers with an Always-Fused Retrieval Pipeline (Vector + Keyword + Graph Traversal), bitemporal valid_from/valid_to edges, and a 2-threshold entity resolution pipeline that eliminates graph node fragmentation."
        metrics={[
          { label: 'Pipeline Architecture', value: 'Always-Fused (No Router)' },
          { label: 'Graph Fragmentation', value: '149 ➔ 19 Nodes (7x drop)' },
          { label: 'Temporal Resolution', value: 'Bitemporal (valid_from/to)' },
          { label: 'Contradictions', value: 'Auto-Discovered on Ingest' }
        ]}
      />

      <Container size="wide">
        {/* ARCHITECTURAL INFOGRAPHIC DIAGRAM */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <GraphTraversalPanel />
        </div>

        {/* SUBTAB NAVIGATION */}
        <div style={{
          display: 'flex',
          gap: 'var(--ds-space-2)',
          marginBottom: 'var(--ds-space-6)',
          background: 'var(--ds-color-bg-surface)',
          padding: 'var(--ds-space-2)',
          borderRadius: 'var(--ds-radius-lg)',
          border: '1px solid var(--ds-color-border-subtle)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'pipeline', icon: '🔄', label: '1. Always-Fused Pipeline vs Router', desc: 'Why retired heuristic router' },
            { id: 'bitemporal', icon: '⏳', label: '2. Bitemporal Edges & Contradictions', desc: 'valid_from, valid_to & event time' },
            { id: 'resolver', icon: '🎯', label: '3. 2-Threshold Entity Resolver', desc: 'Fix 149 ➔ 19 concept fragmentation' },
            { id: 'code', icon: '🛠️', label: '4. Production Python & Gremlin Code', desc: 'Apache Gremlin & bitemporal queries' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '210px',
                padding: 'var(--ds-space-3) var(--ds-space-4)',
                borderRadius: 'var(--ds-radius-md)',
                border: 'none',
                background: activeSubTab === tab.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent',
                color: activeSubTab === tab.id ? 'white' : 'var(--ds-color-text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--ds-motion-duration-base)',
                fontWeight: activeSubTab === tab.id ? 'var(--ds-font-weight-semibold)' : 'var(--ds-font-weight-medium)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--ds-font-size-body)', marginBottom: '2px' }}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>
                {tab.desc}
              </div>
            </button>
          ))}
        </div>

        {/* ─── SUBTAB 1: ALWAYS-FUSED PIPELINE VS ROUTER ─── */}
        {activeSubTab === 'pipeline' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔄 Why We Retired the Heuristic Query Router</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Routers make retrieval quality depend on how a user words their prompt. An Always-Fused pipeline runs Vector, Keyword, and Graph Traversal on every query, letting a unified reranker assemble context deterministically.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {ROUTER_RETIREMENT_COMPARISON.map((c, idx) => (
                    <Card key={idx} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${idx === 1 ? '#5EC4C8' : '#ef4444'}` }}>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: idx === 1 ? '#5EC4C8' : '#ef4444', display: 'block', marginBottom: '4px' }}>
                        {c.feature}
                      </strong>
                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '6px' }}>
                        Mechanism: {c.mechanism}
                      </div>
                      <div style={{ fontSize: '11px', color: idx === 1 ? '#5EC4C8' : '#ef4444' }}>
                        Outcome: {c.outcome}
                      </div>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: BITEMPORAL EDGES & CONTRADICTIONS ─── */}
        {activeSubTab === 'bitemporal' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⏳ Bitemporal Edges & Automatic Write-Time Contradiction Discovery</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Graph edges carry validity windows (event time) alongside system ingestion timestamps. New facts automatically trigger contradiction detection against active edges on the same subject node.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  {BITEMPORAL_EDGE_CONCEPTS.map((b, idx) => (
                    <Card key={idx} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: '#3A9B9F', display: 'block', marginBottom: '4px' }}>
                        {b.concept}
                      </strong>
                      <div style={{ fontSize: '11px', color: '#3A9B9F', fontFamily: 'monospace', marginBottom: '6px' }}>
                        Fields: {b.fields}
                      </div>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                        {b.purpose}
                      </p>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: 2-THRESHOLD ENTITY RESOLVER ─── */}
        {activeSubTab === 'resolver' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🎯 Two-Threshold Entity Resolution Simulator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Solves graph fragmentation (reducing 149 machine concept nodes down to 19 canonical nodes). Matches &ge; 0.90 auto-link, 0.60-0.90 go to LLM Adjudicator with context, and &lt; 0.60 create new entities.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
                    <strong style={{ fontSize: '11px', color: '#F5A623', display: 'block', marginBottom: '10px' }}>
                      ENTITY MENTION INPUT CONTROLS:
                    </strong>

                    <Stack gap={3}>
                      <div>
                        <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                          Extracted Mention Text:
                        </label>
                        <input
                          type="text"
                          value={mentionInput}
                          onChange={e => setMentionInput(e.target.value)}
                          style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '11px' }}
                        />
                      </div>

                      <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">
                        <div>
                          <label style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)' }}>High Threshold ({highThresh}):</label>
                          <input type="range" min="0.80" max="0.98" step="0.02" value={highThresh} onChange={e => setHighThresh(parseFloat(e.target.value))} style={{ width: '100%' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)' }}>Low Threshold ({lowThresh}):</label>
                          <input type="range" min="0.40" max="0.75" step="0.05" value={lowThresh} onChange={e => setLowThresh(parseFloat(e.target.value))} style={{ width: '100%' }} />
                        </div>
                      </Grid>
                    </Stack>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${simResult.decision === 'AUTO_LINK' ? '#5EC4C8' : simResult.decision === 'LLM_ADJUDICATE' ? '#F5A623' : '#ef4444'}` }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: simResult.decision === 'AUTO_LINK' ? '#5EC4C8' : simResult.decision === 'LLM_ADJUDICATE' ? '#F5A623' : '#ef4444' }}>
                        RESOLUTION DECISION: {simResult.decision}
                      </strong>
                      <Badge variant="subtle" style={{ background: 'rgba(56,189,248,0.15)', color: '#3A9B9F', fontSize: '9px' }}>
                        SIMILARITY: {simResult.score}
                      </Badge>
                    </Flex>

                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginBottom: '6px' }}>
                      Target Canonical Node: <strong style={{ color: '#3A9B9F' }}>{simResult.targetNode}</strong>
                    </div>

                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', margin: '0 0 8px 0' }}>
                      {simResult.explanation}
                    </p>

                    <div style={{ fontSize: '11px', color: '#3A9B9F' }}>
                      Impact: {simResult.fragmentationReductionPct}
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: PRODUCTION PYTHON & GREMLIN CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛠️ Production Python & Bitemporal Graph Traversal Script</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Complete reference script for bitemporal edge validity filtering and multi-hop graph traversal.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_GRAPH_TRAVERSAL_CODE} />

                <Callout type="success">
                  <strong>Responsible AI & Security Certified:</strong> Zero personal author details or unredacted PII. 100% synthetic Ostermere Mutual mock data.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
