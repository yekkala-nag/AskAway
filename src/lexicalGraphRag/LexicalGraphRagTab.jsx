import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout, Button } from '../components/ui/Core.jsx';
import {
  HIERARCHY_LEVELS,
  PIPELINE_STAGES,
  INFRASTRUCTURE_OPTIONS,
  TRAVERSAL_SEARCH_FLOW,
  GRAPH_STATS_DEMO,
  computeConnectivityInsights,
  TRAVERSAL_DEPTH_NODES,
  estimateTraversalCost,
  GRAPHRAG_VS_VECTOR,
  ADVANCED_FEATURES,
  NEXT_STEPS,
  PROPOSITION_CLEANUP,
  CODE_DOCKER_COMPOSE,
  CODE_INSTALL,
  CODE_EXTRACT_BUILD,
  CODE_INSPECT_STATS,
  CODE_QUERY,
  CODE_SEPARATE_QUERY,
} from './lexicalGraphRagEngine.js';

const { Container, Stack, Grid, Flex } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#9B89C4';
const PURPLE_DARK = '#5B4B8A';
const AMBER = '#B9821F';
const RED = '#B4553A';

const SUBTABS = [
  { id: 'hierarchy', icon: '🏗️', label: '1. 6-Level Hierarchy', desc: 'Source → Chunk → Topic → Statement → Fact → Entity' },
  { id: 'pipeline', icon: '⚙️', label: '2. Extract & Build Pipeline', desc: 'Two-stage, micro-batched, resumable' },
  { id: 'search', icon: '🔍', label: '3. Traversal-Based Search', desc: 'Vector anchors → graph traversal → context assembly' },
  { id: 'infrastructure', icon: '☁️', label: '4. Infrastructure Options', desc: 'Neo4j, Postgres+pgvector, Neptune, Bedrock' },
  { id: 'simulator', icon: '🎛️', label: '5. Connectivity & Cost Sim', desc: 'Graph stats, traversal depth, token budgets' },
  { id: 'code', icon: '🛠️', label: '6. Complete Code Tutorial', desc: 'Docker → Install → Extract → Query (5 steps)' },
  { id: 'comparison', icon: '⚖️', label: '7. GraphRAG vs Vector', desc: 'Why graph wins on multi-hop questions' },
  { id: 'advanced', icon: '🔮', label: '8. Advanced Features', desc: 'MCP, multi-tenancy, versioning, BYOKG-RAG' },
];

// ── SVG Diagram: 6-Level Hierarchy ───
function HierarchyDiagram() {
  const levels = HIERARCHY_LEVELS;
  const boxWidth = 150;
  const boxHeight = 70;
  const gapX = 30;
  const startX = 20;
  const startY = 30;
  const rowY = [30, 120, 210, 300, 390, 480]; // staggered for visual flow

  return (
    <svg viewBox="0 0 1100 580" width="100%" role="img" aria-label="6-level hierarchical lexical graph: source, chunk, topic, statement, fact, entity">
      <defs>
        <marker id="hier-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={TEAL} />
        </marker>
        <linearGradient id="levelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F0F8F8" />
        </linearGradient>
      </defs>

      {/* Connecting lines between levels */}
      {levels.slice(0, -1).map((level, i) => (
        <line
          key={`conn-${i}`}
          x1={startX + boxWidth / 2}
          y1={rowY[i] + boxHeight}
          x2={startX + boxWidth / 2}
          y2={rowY[i + 1]}
          stroke={TEAL}
          strokeWidth={2}
          strokeDasharray="6 4"
          markerEnd="url(#hier-arrow)"
        />
      ))}

      {levels.map((level, i) => (
        <g key={level.name} transform={`translate(${startX}, ${rowY[i]})`}>
          {/* Level box */}
          <rect
            x={0} y={0} width={boxWidth} height={boxHeight} rx={10}
            fill="url(#levelGrad)" stroke={level.color} strokeWidth={2}
          />
          {/* Color accent bar */}
          <rect x={0} y={0} width={6} height={boxHeight} rx={10} fill={level.color} />
          {/* Icon */}
          <text x={20} y={28} fontSize="22">{level.icon}</text>
          {/* Name */}
          <text x={55} y={24} fontSize="14" fontWeight="700" fill="#1A1D26">{level.name}</text>
          {/* Node count badge */}
          <rect x={55} y={32} width={55} height={18} rx={9} fill={level.color} fillOpacity={0.15} />
          <text x={82} y={45} fontSize="11" fontWeight="700" fill={level.color} textAnchor="middle">
            ~{level.nodeCount} nodes
          </text>
          {/* Description */}
          <text x={20} y={58} fontSize="10.5" fill="#4B5563" style={{ maxWidth: '120px' }}>
            {level.description}
          </text>
          {/* Example (truncated) */}
          <text x={20} y={70} fontSize="9" fill="#9CA3AF" style={{ fontStyle: 'italic' }}>
            {level.example.length > 35 ? level.example.slice(0, 35) + '…' : level.example}
          </text>
        </g>
      ))}

      {/* Right side: explanation */}
      <g transform="translate(220, 30)">
        <rect x={0} y={0} width={840} height={520} rx={12} fill="#FAFAFC" stroke="#E5E7EB" />
        <text x={20} y={30} fontSize="16" fontWeight="700" fill="#1A1D26">How the Hierarchy Enables Multi-Hop Retrieval</text>
        <text x={20} y={55} fontSize="12" fill="#4B5563" style={{ lineHeight: 1.6 }}>
          A plain vector store only retrieves at the <strong>Chunk</strong> level. The lexical graph lets traversal hop
          <strong>up</strong> (chunk → topic → source) and <strong>down</strong> (topic → statement → fact → entity)
          and <strong>across</strong> (entity → fact → statement in another document).
        </text>

        <text x={20} y={100} fontSize="13" fontWeight="700" fill={TEAL_DARK}>Key Insight: Proposition Cleanup Pass</text>
        <text x={20} y={120} fontSize="11.5" fill="#4B5563" style={{ lineHeight: 1.7 }}>
          {PROPOSITION_CLEANUP.pass1}
        </text>
        <text x={20} y={145} fontSize="11.5" fill="#4B5563" style={{ lineHeight: 1.7 }}>
          {PROPOSITION_CLEANUP.pass2}
        </text>
        <text x={20} y={170} fontSize="11" fill={AMBER} style={{ fontStyle: 'italic' }}>
          ⚠ The cleanup pass is optional but measurably improves extraction quality.
        </text>

        <text x={20} y={205} fontSize="13" fontWeight="700" fill={TEAL_DARK}>Connectivity Metrics (from demo)</text>
        <text x={20} y={225} fontSize="11.5" fill="#4B5563">
          Local Connectivity: 1.31 edges/chunk — chunks connect to multiple statements/topics
        </text>
        <text x={20} y={245} fontSize="11.5" fill="#4B5563">
          Global Connectivity: 0.87 — entities link across document boundaries (multi-hop enabled)
        </text>

        <text x={20} y={280} fontSize="13" fontWeight="700" fill={TEAL_DARK}>Traversal Patterns</text>
        {[
          '🔼 Up: Chunk → Topic → Source (find related chunks in same document)',
          '🔽 Down: Topic → Statement → Fact → Entity (drill into specifics)',
          '↔ Across: Entity → Fact → Statement (jump to another document sharing the entity)',
          '🔄 Multi-hop: Anchor (vector) → Topic → Entity → Fact → Statement (answer assembly)',
        ].map((item, i) => (
          <text key={i} x={20} y={305 + i * 25} fontSize="11.5" fill="#4B5563" style={{ lineHeight: 1.5 }}>
            {item}
          </text>
        ))}
      </g>
    </svg>
  );
}

// ── SVG Diagram: Extract & Build Pipeline ───
function PipelineDiagram() {
  return (
    <svg viewBox="0 0 1100 480" width="100%" role="img" aria-label="Two-stage pipeline: Extract (LLM) and Build (Graph + Vector)">
      <defs>
        <marker id="pipe-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={TEAL} />
        </marker>
        <linearGradient id="extractGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E6F4F1" />
          <stop offset="100%" stopColor="#D1EDED" />
        </linearGradient>
        <linearGradient id="buildGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F1EDF9" />
          <stop offset="100%" stopColor="#E8DFF8" />
        </linearGradient>
      </defs>

      {/* Extract Stage */}
      <rect x={20} y={20} width={500} height={420} rx={16} fill="url(#extractGrad)" stroke={TEAL} strokeWidth={2} />
      <rect x={20} y={20} width={500} height={50} rx={16} fill={TEAL} />
      <text x={270} y={52} textAnchor="middle" fontSize="16" fontWeight="700" fill="#FFFFFF">🔍 STAGE 1: EXTRACT (LLM-Powered)</text>

      {PIPELINE_STAGES[0].steps.map((step, i) => (
        <g key={`extract-${i}`} transform={`translate(40, ${85 + i * 65})`}>
          <circle cx={15} cy={15} r={12} fill={TEAL} />
          <text x={15} y={19} textAnchor="middle" fontSize="12" fontWeight="700" fill="#FFF">{i + 1}</text>
          <text x={40} y={12} fontSize="12.5" fontWeight="600" fill="#1A1D26" style={{ maxWidth: '420px' }}>{step}</text>
        </g>
      ))}

      {/* Two-pass detail */}
      <rect x={40} y={410} width={460} height={100} rx={8} fill="#FFFFFF" stroke={TEAL} strokeWidth={1} strokeDasharray="4 4" />
      <text x={60} y={430} fontSize="12" fontWeight="700" fill={TEAL_DARK}>Two LLM Calls Per Chunk (Quality Boost)</text>
      <text x={60} y={455} fontSize="10.5" fill="#4B5563">{PROPOSITION_CLEANUP.pass1}</text>
      <text x={60} y={475} fontSize="10.5" fill="#4B5563">{PROPOSITION_CLEANUP.pass2}</text>

      {/* Arrow between stages */}
      <line x1={540} y1={230} x2={580} y2={230} stroke={TEAL} strokeWidth={3} markerEnd="url(#pipe-arrow)" />
      <text x={560} y={220} textAnchor="middle" fontSize="11" fontWeight="600" fill={TEAL_DARK}>JSONL</text>
      <text x={560} y={245} textAnchor="middle" fontSize="10" fill={TEAL_DARK}>extracted elements</text>

      {/* Build Stage */}
      <rect x={580} y={20} width={500} height={420} rx={16} fill="url(#buildGrad)" stroke={PURPLE} strokeWidth={2} />
      <rect x={580} y={20} width={500} height={50} rx={16} fill={PURPLE} />
      <text x={830} y={52} textAnchor="middle" fontSize="16" fontWeight="700" fill="#FFFFFF">🏗️ STAGE 2: BUILD (Graph + Vector Indexes)</text>

      {PIPELINE_STAGES[1].steps.map((step, i) => (
        <g key={`build-${i}`} transform={`translate(600, ${85 + i * 65})`}>
          <circle cx={15} cy={15} r={12} fill={PURPLE} />
          <text x={15} y={19} textAnchor="middle" fontSize="12" fontWeight="700" fill="#FFF">{i + 1}</text>
          <text x={40} y={12} fontSize="12.5" fontWeight="600" fill="#1A1D26" style={{ maxWidth: '420px' }}>{step}</text>
        </g>
      ))}

      {/* Separation benefit */}
      <rect x={600} y={410} width={460} height={100} rx={8} fill="#FFFFFF" stroke={PURPLE} strokeWidth={1} strokeDasharray="4 4" />
      <text x={620} y={430} fontSize="12" fontWeight="700" fill={PURPLE_DARK}>Why Separate Stages?</text>
      <text x={620} y={455} fontSize="10.5" fill="#4B5563">• Pause, inspect, filter large ingestion jobs mid-pipeline</text>
      <text x={620} y={475} fontSize="10.5" fill="#4B5563">• Micro-batched & resumable — no lost progress on failure</text>
    </svg>
  );
}

// ── SVG Diagram: Traversal-Based Search Flow ───
function TraversalFlowDiagram() {
  return (
    <svg viewBox="0 0 1100 400" width="100%" role="img" aria-label="Traversal-based search: embed question → vector anchors → graph traversal → context assembly → LLM generation">
      <defs>
        <marker id="flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={TEAL} />
        </marker>
      </defs>

      const stepX = [40, 250, 460, 670, 880];
      const stepY = 150;

      {TRAVERSAL_SEARCH_FLOW.map((step, i) => (
        <g key={step.step} transform={`translate(${stepX[i]}, ${stepY - 60})`}>
          {/* Step circle */}
          <circle cx={60} cy={60} r={50} fill="#FFFFFF" stroke={i === 2 ? PURPLE : TEAL} strokeWidth={3} />
          <text x={60} y={50} textAnchor="middle" fontSize="28">{step.icon}</text>
          <text x={60} y={85} textAnchor="middle" fontSize="11" fontWeight="600" fill="#1A1D26">{step.name}</text>

          {/* Description box */}
          <rect x={-40} y={110} width={200} height={80} rx={8} fill="#FAFAFC" stroke="#E5E7EB" />
          <text x={60} y={145} textAnchor="middle" fontSize="10.5" fill="#4B5563" style={{ lineHeight: 1.4 }}>
            {step.description}
          </text>

          {/* Arrow to next */}
          {i < TRAVERSAL_SEARCH_FLOW.length - 1 && (
            <line
              x1={120} y1={60} x2={stepX[i + 1] - stepX[i] - 20} y2={60}
              stroke={TEAL} strokeWidth={2.5} markerEnd="url(#flow-arrow)"
            />
          )}
        </g>
      ))}

      {/* Highlight: Graph Traversal is the differentiator */}
      <rect x={420} y={30} width={280} height={80} rx={12} fill="#FFF7ED" stroke={AMBER} strokeWidth={2} strokeDasharray="6 4" />
      <text x={560} y={55} textAnchor="middle" fontSize="13" fontWeight="700" fill={AMBER}>🎯 THE DIFFERENTIATOR</text>
      <text x={560} y={80} textAnchor="middle" fontSize="11" fill="#4B5563" style={{ lineHeight: 1.5 }}>
        Vector search alone stops at Step 2. Graph traversal (Step 3) follows
        entity/topic edges to pull connected context across documents.
      </text>

      {/* Optional parameters */}
      <rect x={40} y={300} width={1020} height={70} rx={10} fill="#F1EDF9" stroke={PURPLE} />
      <text x={550} y={322} textAnchor="middle" fontSize="12" fontWeight="700" fill={PURPLE_DARK}>Optional Query Parameters</text>
      <text x={550} y={342} textAnchor="middle" fontSize="11" fill="#4B5563" style={{ lineHeight: 1.5 }}>
        <strong>context_format="json"</strong> → structured array of retrieved statements (for inspection/post-processing)
        &nbsp;|&nbsp; <strong>verbose=False</strong> → concise answer (production chat interfaces)
      </text>
    </svg>
  );
}

// ── Simulator: Graph Stats & Connectivity ───
function GraphStatsSimulator() {
  const [stats, setStats] = useState(GRAPH_STATS_DEMO);
  const insights = useMemo(() => computeConnectivityInsights(stats), [stats]);

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>📊 Graph Statistics & Connectivity Explorer</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Adjust node counts to see how connectivity metrics change. Based on the 3-article demo (Artemis, ISS, Commercial Crew).
          </p>
        </div>

        <Grid columns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="var(--ds-space-3)">
          {HIERARCHY_LEVELS.slice(1).map((level) => (
            <div key={level.name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>
                {level.icon} {level.name} nodes
              </label>
              <input
                type="number"
                min={0}
                max={level.name === 'Entity' ? 500 : level.name === 'Fact' ? 1000 : 500}
                value={stats[level.name.toLowerCase()]}
                onChange={(e) => setStats({ ...stats, [level.name.toLowerCase()]: parseInt(e.target.value) || 0 })}
                style={{
                  padding: '8px 12px', borderRadius: 6, border: '1px solid var(--ds-color-border-default)',
                  background: 'var(--ds-color-bg-canvas)', color: 'var(--ds-color-text-primary)', fontSize: 14,
                }}
              />
            </div>
          ))}
        </Grid>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 8 }}>
          <div style={{ padding: '12px 16px', background: '#E6F4F1', borderRadius: 8, border: `1px solid ${TEAL}40` }}>
            <div style={{ fontSize: '11px', color: TEAL_DARK, fontWeight: 600 }}>Local Connectivity</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: TEAL_DARK }}>{insights.localConnectivity.toFixed(2)}</div>
            <div style={{ fontSize: '11px', color: TEAL_DARK }}>{insights.interpretation.local}</div>
          </div>
          <div style={{ padding: '12px 16px', background: '#F1EDF9', borderRadius: 8, border: `1px solid ${PURPLE}40` }}>
            <div style={{ fontSize: '11px', color: PURPLE_DARK, fontWeight: 600 }}>Global Connectivity</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: PURPLE_DARK }}>{insights.globalConnectivity.toFixed(2)}</div>
            <div style={{ fontSize: '11px', color: PURPLE_DARK }}>{insights.interpretation.global}</div>
          </div>
          <div style={{ padding: '12px 16px', background: '#FFF7ED', borderRadius: 8, border: `1px solid ${AMBER}40` }}>
            <div style={{ fontSize: '11px', color: AMBER, fontWeight: 600 }}>Stmt/Chunk Ratio</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: AMBER }}>{insights.avgEdgesPerChunk}</div>
            <div style={{ fontSize: '11px', color: AMBER }}>Statements per chunk (avg)</div>
          </div>
          <div style={{ padding: '12px 16px', background: '#F0F4FF', borderRadius: 8, border: `1px solid #3B82F640` }}>
            <div style={{ fontSize: '11px', color: '#1E40AF', fontWeight: 600 }}>Fact/Entity Ratio</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#1E40AF' }}>{insights.factToEntityRatio}</div>
            <div style={{ fontSize: '11px', color: '#1E40AF' }}>Facts per entity (avg)</div>
          </div>
        </div>

        <Callout type="info" title="Reading the metrics">
          <div>
            <strong>Local Connectivity</strong> = avg edges per chunk (statement + topic links).{' '}
            <span>{">"}1</span> means chunks fan out to multiple statements/topics — good for retrieval breadth.
          </div>
          <br/><br/>
          <div>
            <strong>Global Connectivity</strong> = cross-document entity linking density.{' '}
            <span>{">"}0.5</span> means entities appear in multiple documents — enables multi-hop reasoning across sources.
          </div>
        </Callout>
      </Stack>
    </Card>
  );
}

// ── Simulator: Traversal Depth vs. Cost ───
function TraversalCostSimulator() {
  const [depth, setDepth] = useState(2);
  const [tokenPrice, setTokenPrice] = useState(3);
  const cost = useMemo(() => estimateTraversalCost(depth, tokenPrice), [depth, tokenPrice]);
  const level = TRAVERSAL_DEPTH_NODES.find(d => d.depth === depth) || TRAVERSAL_DEPTH_NODES[0];

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🎛️ Traversal Depth vs. Token Cost Simulator</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Each traversal hop pulls more context but costs more tokens. Find the sweet spot for your budget.
          </p>
        </div>

        <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 8 }}>
              Traversal Depth: {depth} ({level.label})
            </label>
            <input
              type="range" min={0} max={4} step={1} value={depth}
              onChange={(e) => setDepth(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: TEAL }}
            />
            <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: 4 }}>
              0=anchors only → 4=full neighborhood
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 8 }}>
              Token Price (USD / 1M): ${tokenPrice}
            </label>
            <input
              type="range" min={0.5} max={15} step={0.5} value={tokenPrice}
              onChange={(e) => setTokenPrice(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: PURPLE }}
            />
            <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: 4 }}>
              Bedrock: ~$3-15/M depending on model
            </div>
          </div>
        </Grid>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 8 }}>
          <div style={{ flex: 1, minWidth: 150, padding: '12px', background: 'var(--ds-color-bg-canvas)', borderRadius: 8, border: '1px solid var(--ds-color-border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Nodes Retrieved</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: TEAL_DARK }}>{cost.nodes}</div>
          </div>
          <div style={{ flex: 1, minWidth: 150, padding: '12px', background: 'var(--ds-color-bg-canvas)', borderRadius: 8, border: '1px solid var(--ds-color-border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Estimated Tokens</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: PURPLE_DARK }}>{cost.tokens.toLocaleString()}</div>
          </div>
          <div style={{ flex: 1, minWidth: 150, padding: '12px', background: 'var(--ds-color-bg-canvas)', borderRadius: 8, border: '1px solid var(--ds-color-border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Cost / Query</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: RED }}>${cost.costPerQuery}</div>
          </div>
          <div style={{ flex: 1, minWidth: 150, padding: '12px', background: 'var(--ds-color-bg-canvas)', borderRadius: 8, border: '1px solid var(--ds-color-border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Cost / 1K Queries</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: RED }}>${cost.costPer1k}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {TRAVERSAL_DEPTH_NODES.map((d) => (
            <span
              key={d.depth}
              style={{
                padding: '8px 12px', borderRadius: 999, fontSize: '11px', fontWeight: 600,
                background: d.depth === depth ? TEAL : 'var(--ds-color-bg-canvas)',
                color: d.depth === depth ? '#FFF' : 'var(--ds-color-text-secondary)',
                border: `1px solid ${d.depth === depth ? TEAL : 'var(--ds-color-border-subtle)'}`,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onClick={() => setDepth(d.depth)}
            >
              Depth {d.depth}: {d.label} ({d.nodes} nodes, {d.tokens.toLocaleString()} tok)
            </span>
          ))}
        </div>

        <Callout type="success" title="Budget control via score floor">
          The toolkit's <code>score</code> primitive lets you set a relevance floor (default 0.65).
          Nodes below the floor are dropped before the prompt — token budgets become enforceable reports, not vibes.
          See the GraphRAG System 1 tab for the pruning simulator.
        </Callout>
      </Stack>
    </Card>
  );
}

// ── Infrastructure Comparison Cards ───
function InfrastructureCards() {
  return (
    <Stack gap={6}>
      {INFRASTRUCTURE_OPTIONS.map((layer, i) => (
        <Card key={layer.layer} style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ fontSize: '1.5rem' }}>
              {i === 0 ? '🗄️' : i === 1 ? '🔍' : '🤖'}
            </div>
            <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>{layer.layer}</h3>
          </div>
          <Grid columns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap="var(--ds-space-3)">
            {layer.options.map((opt) => (
              <div
                key={opt.name}
                style={{
                  padding: '12px', borderRadius: 10, background: 'var(--ds-color-bg-canvas)',
                  border: `1px solid ${opt.local ? TEAL : PURPLE}40`,
                  display: 'flex', flexDirection: 'column', gap: 6,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <strong style={{ color: opt.local ? TEAL_DARK : PURPLE_DARK }}>{opt.name}</strong>
                  {opt.badge && (
                    <Badge variant="default" size="sm" style={{
                      background: opt.local ? 'rgba(94,196,200,0.15)' : 'rgba(155,137,196,0.15)',
                      color: opt.local ? TEAL_DARK : PURPLE_DARK,
                    }}>
                      {opt.badge}
                    </Badge>
                  )}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>
                  Cost: <strong>{opt.cost}</strong>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>
                  {opt.notes}
                </div>
                {opt.local && (
                  <div style={{ fontSize: '10px', color: TEAL_DARK, fontWeight: 600 }}>
                    ✓ Runs locally via Docker
                  </div>
                )}
              </div>
            ))}
          </Grid>
        </Card>
      ))}
    </Stack>
  );
}

// ── Advanced Features Cards ───
function AdvancedFeaturesCards() {
  return (
    <Grid columns={{ base: '1fr', md: '1fr 1fr', lg: 'repeat(3, 1fr)' }} gap="var(--ds-space-4)">
      {ADVANCED_FEATURES.map((feat) => (
        <Card key={feat.name} style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)', borderTop: `3px solid ${TEAL}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: '1.5rem' }}>{feat.icon}</span>
            <strong style={{ color: 'var(--ds-color-text-primary)' }}>{feat.name}</strong>
          </div>
          <p style={{ margin: 0, fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', lineHeight: 1.6 }}>
            {feat.description}
          </p>
        </Card>
      ))}
    </Grid>
  );
}

// ── Next Steps Cards ───
function NextStepsCards() {
  return (
    <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
      {NEXT_STEPS.map((step) => (
        <Card key={step.title} style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${step.type === 'workshop' ? PURPLE : step.type === 'app' ? TEAL : AMBER}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ fontSize: '1.5rem', marginTop: 2 }}>
              {step.type === 'workshop' ? '📓' : step.type === 'app' ? '🚀' : '📖'}
            </span>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 6px 0', color: 'var(--ds-color-text-primary)' }}>{step.title}</h4>
              <p style={{ margin: 0, fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', lineHeight: 1.6 }}>
                {step.description}
              </p>
              <div style={{ marginTop: 8 }}>
                <code style={{ fontSize: '10px', color: TEAL_DARK, background: 'var(--ds-color-bg-canvas)', padding: '2px 6px', borderRadius: 4 }}>
                  {step.link}
                </code>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </Grid>
  );
}

export default function LexicalGraphRagTab() {
  const [activeSubTab, setActiveSubTab] = useState('hierarchy');

  const hierarchyColumns = [
    { key: 'level', header: 'Lvl', render: (v) => <strong style={{ fontFamily: 'monospace', color: TEAL_DARK }}>{v}</strong> },
    { key: 'name', header: 'Level', render: (v) => <strong>{v}</strong> },
    { key: 'icon', header: '' },
    { key: 'description', header: 'Description', sortable: false },
    { key: 'example', header: 'Example', sortable: false, render: (v) => <code style={{ fontSize: '11px', background: 'var(--ds-color-bg-canvas)', padding: '2px 6px', borderRadius: 4 }}>{v}</code> },
    { key: 'nodeCount', header: 'Demo Nodes', render: (v) => <span style={{ fontFamily: 'monospace', color: TEAL_DARK }}>~{v}</span> },
  ];

  const pipelineColumns = [
    { key: 'stage', header: 'Stage', render: (v) => <strong style={{ color: TEAL_DARK }}>{v}</strong> },
    { key: 'title', header: 'Title', render: (v) => <strong>{v}</strong> },
    { key: 'description', header: 'Description', sortable: false },
  ];

  const searchFlowColumns = [
    { key: 'step', header: 'Step', render: (v) => <strong style={{ fontFamily: 'monospace', color: TEAL_DARK }}>{v}</strong> },
    { key: 'name', header: 'Operation', render: (v) => <strong>{v}</strong> },
    { key: 'description', header: 'Description', sortable: false },
    { key: 'icon', header: '' },
  ];

  const comparisonColumns = [
    { key: 'aspect', header: 'Aspect', render: (v) => <strong style={{ color: TEAL_DARK }}>{v}</strong> },
    { key: 'vector', header: 'Plain Vector RAG', render: (v) => <span style={{ color: RED }}>{v}</span> },
    { key: 'graphrag', header: 'GraphRAG (Lexical Graph)', render: (v) => <span style={{ color: TEAL_DARK }}>{v}</span> },
  ];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="rag_architecture"
        moduleLabel="RAG Architectures & Pipelines [AWS graphrag-toolkit]"
        title="Lexical Graph RAG: Hierarchical Knowledge Graphs from AWS Labs"
        description="AWS Labs' open-source graphrag-toolkit (lexical-graph) builds a 6-level hierarchical knowledge graph from unstructured documents. Two-stage extract/build pipeline, traversal-based search over entity/topic edges, swappable Neo4j/Postgres/Neptune backends. Solves multi-hop questions that plain vector RAG cannot."
        metrics={[
          { label: 'Hierarchy Levels', value: '6' },
          { label: 'Pipeline Stages', value: '2 (Extract + Build)' },
          { label: 'Search Strategy', value: 'Traversal-Based' },
          { label: 'Local Infra Cost', value: '$0 (Docker)' },
        ]}
      />

      <Container size="wide">
        <div style={{
          display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)',
          background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)',
          borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto',
        }}>
          {SUBTABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1, minWidth: '180px',
                padding: 'var(--ds-space-3) var(--ds-space-4)',
                borderRadius: 'var(--ds-radius-md)', border: 'none',
                background: activeSubTab === tab.id ? TEAL : 'transparent',
                color: activeSubTab === tab.id ? '#FFFFFF' : 'var(--ds-color-text-secondary)',
                cursor: 'pointer', textAlign: 'left',
                transition: 'all var(--ds-motion-duration-base)',
                fontWeight: activeSubTab === tab.id ? 600 : 500,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--ds-font-size-body)', marginBottom: 2 }}>
                <span>{tab.icon}</span><span>{tab.label}</span>
              </div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>{tab.desc}</div>
            </button>
          ))}
        </div>

        {/* ─── 1. HIERARCHY ─── */}
        {activeSubTab === 'hierarchy' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <HierarchyDiagram />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Level Reference Table</h3>
              <Table columns={hierarchyColumns} data={HIERARCHY_LEVELS} sortable={false} />
            </Card>

            <Callout type="info" title="Why 6 levels?">
              Each level serves a retrieval purpose: <strong>Source/Chunk</strong> for document grounding,
              <strong>Topic</strong> for thematic clustering, <strong>Statement</strong> for propositional claims,
              <strong>Fact</strong> for verified atomic truths, <strong>Entity</strong> for cross-document linking.
              Traversal hops between any levels — this is the structural feature that makes multi-hop questions answerable.
            </Callout>
          </Stack>
        )}

        {/* ─── 2. PIPELINE ─── */}
        {activeSubTab === 'pipeline' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <PipelineDiagram />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Stage Comparison</h3>
              <Table columns={pipelineColumns} data={PIPELINE_STAGES} sortable={false} />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Proposition Cleanup Pass (Quality Boost)</h3>
              <p style={{ margin: '0 0 10px 0', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', lineHeight: 1.7 }}>
                {PROPOSITION_CLEANUP.explanation}
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 250, padding: '10px', background: '#E6F4F1', borderRadius: 8, border: `1px solid ${TEAL}40` }}>
                  <strong style={{ color: TEAL_DARK }}>Pass 1 — Cleanup</strong>
                  <div style={{ fontSize: '12px', marginTop: 4, fontFamily: 'monospace' }}>{PROPOSITION_CLEANUP.pass1}</div>
                </div>
                <div style={{ flex: 1, minWidth: 250, padding: '10px', background: '#F1EDF9', borderRadius: 8, border: `1px solid ${PURPLE}40` }}>
                  <strong style={{ color: PURPLE_DARK }}>Pass 2 — Extraction</strong>
                  <div style={{ fontSize: '12px', marginTop: 4, fontFamily: 'monospace' }}>{PROPOSITION_CLEANUP.pass2}</div>
                </div>
              </div>
              <Callout type="tip" title="Evidence from toolkit docs">
                {PROPOSITION_CLEANUP.evidence}
              </Callout>
            </Card>
          </Stack>
        )}

        {/* ─── 3. SEARCH ─── */}
        {activeSubTab === 'search' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <TraversalFlowDiagram />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Traversal Search Flow Steps</h3>
              <Table columns={searchFlowColumns} data={TRAVERSAL_SEARCH_FLOW} sortable={false} />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Why Traversal Beats Pure Vector Search</h3>
              <p style={{ margin: '0 0 10px 0', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', lineHeight: 1.7 }}>
                A vector index retrieves chunks in isolation. The lexical graph's traversal follows explicit edges:
                <strong>chunk → topic → statement → fact → entity</strong> and across documents via shared entities.
                This is how a question spanning Artemis, ISS, and Commercial Crew gets a complete answer —
                no single chunk contains all three, but the graph connects them through entities like "NASA", "Orion", "crew transport".
              </p>
              <div style={{ fontSize: '12px', fontFamily: 'monospace', background: 'var(--ds-color-bg-canvas)', padding: '10px', borderRadius: 6, border: '1px solid var(--ds-color-border-subtle)' }}>
                Question: "How does Commercial Crew relate to ISS crew transport and Artemis logistics?"
                → Vector anchors: Commercial Crew chunk, ISS chunk, Artemis chunk
                → Traversal: Commercial Crew → entity:NASA → fact:crew transport → ISS statement
                → Traversal: Artemis → entity:Orion → fact:crew logistics → Commercial Crew fact
                → Assembly: Thematic groups → LLM generates unified answer
              </div>
            </Card>
          </Stack>
        )}

        {/* ─── 4. INFRASTRUCTURE ─── */}
        {activeSubTab === 'infrastructure' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Swappable Backend Architecture</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                The toolkit uses factory patterns: connection string scheme (<code>neo4j://</code>, <code>postgresql://</code>) auto-detects the backend.
                Only Bedrock is required for LLM calls; graph/vector stores run locally at zero cost.
              </p>
              <InfrastructureCards />
            </Card>

            <Callout type="warning" title="Bedrock is currently required">
              The toolkit's only built-in model provider is Amazon Bedrock. An AWS account with Bedrock model access is unavoidable
              for extraction and querying, even with local Neo4j + Postgres. Custom providers need extension work.
            </Callout>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Local Development Stack (Zero Infrastructure Cost)</h3>
              <CodeBlock language="yaml" code={CODE_DOCKER_COMPOSE} />
              <p style={{ margin: '12px 0 0 0', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>
                Run <code>docker compose up -d</code> → Neo4j on 7474/7687, Postgres+pgvector on 5432.
                Both persist via Docker volumes. No cloud credits needed for development.
              </p>
            </Card>
          </Stack>
        )}

        {/* ─── 5. SIMULATOR ─── */}
        {activeSubTab === 'simulator' && (
          <Stack gap={6}>
            <GraphStatsSimulator />
            <TraversalCostSimulator />
          </Stack>
        )}

        {/* ─── 6. CODE TUTORIAL ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Step 1: Spin Up Local Neo4j + Postgres</h3>
              <p style={{ margin: '0 0 10px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Docker Compose with persistent volumes. Neo4j 5 + pgvector/pgvector:pg16.
              </p>
              <CodeBlock language="yaml" code={CODE_DOCKER_COMPOSE} />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Step 2: Install Toolkit & Dependencies</h3>
              <CodeBlock language="bash" code={CODE_INSTALL} />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Step 3: Extract & Build from Real Wikipedia Articles</h3>
              <p style={{ margin: '0 0 10px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Three related but distinct articles → genuine multi-hop questions needed.
                <code>extract_and_build()</code> runs both stages in one continuous pass using Bedrock.
              </p>
              <CodeBlock language="python" code={CODE_EXTRACT_BUILD} />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Step 4: Inspect Graph Statistics</h3>
              <p style={{ margin: '0 0 10px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                <code>get_stats()</code> returns exact node counts per hierarchy level + connectivity metrics.
                Run as a sanity check before querying.
              </p>
              <CodeBlock language="python" code={CODE_INSPECT_STATS} />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Step 5: Query with a Genuine Multi-Hop Question</h3>
              <p style={{ margin: '0 0 10px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Traversal-based engine (current default). Anchors via vector similarity, then graph traversal
                pulls connected context across all three articles before LLM generation.
              </p>
              <CodeBlock language="python" code={CODE_QUERY} />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Separate Extraction & Querying (Production Pattern)</h3>
              <p style={{ margin: '0 0 10px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Extraction runs once; querying reuses the populated graph. Reconnect to same Neo4j/Postgres instances.
              </p>
              <CodeBlock language="python" code={CODE_SEPARATE_QUERY} />
            </Card>
          </Stack>
        )}

        {/* ─── 7. COMPARISON ─── */}
        {activeSubTab === 'comparison' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>GraphRAG (Lexical Graph) vs. Plain Vector RAG</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                The core distinction: a vector index tells you what <strong>sounds relevant</strong>; a lexical graph tells you how
                the underlying information is <strong>actually connected</strong>. Most RAG demos test clean single-fact questions.
                Real users ask multi-hop questions — this is where graph-enhanced retrieval wins.
              </p>
              <Table columns={comparisonColumns} data={GRAPHRAG_VS_VECTOR} sortable={false} />
            </Card>

            <Callout type="success" title="The multi-hop test">
              Ask: "How does the Commercial Crew Program relate to ISS crew transport and Artemis logistics?"
              <br/>• Vector RAG: returns chunks from each article separately, no synthesis
              <br/>• Lexical Graph: traverses NASA → Orion → crew transport edges across all three, assembles unified answer
            </Callout>
          </Stack>
        )}

        {/* ─── 8. ADVANCED ─── */}
        {activeSubTab === 'advanced' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Advanced Features Built Into the Toolkit</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Beyond the core extract/build/query cycle, the toolkit includes production-ready capabilities
                for multi-tenancy, versioning, agent integration, and existing-graph workflows.
              </p>
              <AdvancedFeaturesCards />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>BYOKG-RAG: For Existing Knowledge Graphs</h3>
              <p style={{ margin: '0 0 10px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                If you already have a knowledge graph (Neptune, Neo4j, FalkorDB), BYOKG-RAG adds a multi-strategy
                question-answering layer <strong>without re-extraction</strong>. Skips the entire Extract stage.
                Separate component in the same repo: <code>graphrag-toolkit/byokg-rag</code>.
              </p>
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Next Steps: Workshop, Explorer & Docs</h3>
              <NextStepsCards />
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}