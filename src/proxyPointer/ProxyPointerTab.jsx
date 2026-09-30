import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Stepper } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { Panel, GlassBar } from '../components/ui/CleanInfographics.jsx';
import {
  SAMPLE_MARKDOWN_DOC,
  PIPELINE_STEPS,
  SEARCH_SCENARIOS,
  NOISE_FILTER_CATEGORIES,
  MULTIMODAL_SCENARIOS
} from './proxyPointerEngine.js';

const { Container, Section, Grid, Flex, Stack } = Primitives;

/** Native recreation of the 9-stage proxy-pointer ingestion strip. */
function ProxyPipelineStripPanel() {
  const stages = [
    { t: 'Markdown documents', d: 'Raw docs in — no preprocessing.', c: '#5EC4C8', icon: 'file' },
    { t: 'Skeleton Tree', d: 'Regex heading parse, no LLM, under 1 second.', c: '#6A9BD8', icon: 'nodes' },
    { t: 'Tree Walk', d: 'Boundary propagation with parent-propagation capping.', c: '#A78BFA', icon: 'refresh' },
    { t: 'Noise Filter', d: 'Lightweight LLM filter with 6-category exclusion.', c: '#E8C558', icon: 'zap' },
    { t: 'Breadcrumb Injection', d: 'Prepend the ancestry path on every chunk.', c: '#7FB069', icon: 'link' },
    { t: 'Structure-Guided Chunking', d: '2000-char windows, 200 overlap, per-node boundaries.', c: '#E08A4C', icon: 'clip' },
    { t: 'Metadata Attach', d: 'Doc/node id, title, and start/end line on each chunk.', c: '#F0A89A', icon: 'check' },
    { t: 'Embed', d: 'Text embeddings at 1536 dimensions.', c: '#9B89C4', icon: 'cpu' },
    { t: 'Index', d: 'Vector pointer index ready for retrieval.', c: '#34D399', icon: 'search' },
  ];
  return (
    <Panel
      title="Proxy-Pointer Ingestion Pipeline — Skeleton Tree to Pointer Map"
      sub="Nine deterministic stages from raw markdown to an indexed pointer map — one LLM call, everything else rules and regex."
    >
      <div style={{ display: 'grid', gap: 12 }}>
        {stages.map((s, i) => (
          <GlassBar key={s.t} color={s.c} icon={s.icon} index={`${i + 1}.`} title={s.t} detail={s.d} />
        ))}
      </div>
    </Panel>
  );
}

/** Native recreation of the 4-stage multimodal proxy-pointer flow. */
function MultimodalFlowPanel() {
  return (
    <Panel
      title="Proxy-Pointer Multimodal RAG — Answers Without Multimodal Embeddings"
      sub="Lightweight text proxies do the searching; pointers pull the original high-resolution visuals at synthesis time."
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <GlassBar
          color="#5EC4C8" icon="file" index="1." title="Multimodal Document Ingestion"
          detail="Source PDFs → parser/extractor → extracted text & metadata, plus the original high-resolution image assets kept with bounding boxes."
        />
        <GlassBar
          color="#6A9BD8" icon="layers" index="2." title="Dual Indexing"
          detail="Lightweight text proxy index — captions and OCR into text embeddings in a vector DB with pointers — beside a physical asset store mapping bounding-box coordinates to unique asset IDs."
        />
        <GlassBar
          color="#E8C558" icon="search" index="3." title="Fast Text Vector Search"
          detail="Natural-language query → query vector → proxy index. Sub-millisecond matching with no multimodal-embedding overhead returns text plus asset pointers."
        />
        <GlassBar
          color="#A78BFA" icon="cpu" index="4." title="Pointer Resolution & Synthesis"
          detail="Pointers resolve to the original high-res charts and retrieved multimodal images; a large multimodal model fuses cross-modal reasoning into one cited multimodal answer."
        />
      </div>
    </Panel>
  );
}

/** Native recreation: naive shredding destroys context; layout proxies preserve it. */
function ShreddingVsProxyPanel() {
  return (
    <Panel
      title="Naive Shredding vs Layout Preservation"
      sub="Chunking shreds charts, images, and tables into broken context; proxies keep layout trees plus decoupled text stand-ins."
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <GlassBar color="#E8836A" icon="zap" title="Naive Path — Shredded Context" detail="Documents shredded into fragments: charts lose axes, tables lose headers, images lose position. Retrieval returns shards; answers hallucinate the gaps." />
        <GlassBar color="#34D399" icon="check" title="Proxy Path — Layout Preserved" detail="Layout trees extracted once; text proxies answer search while pointers resolve to exact document line ranges and structural hierarchy at synthesis." />
      </div>
    </Panel>
  );
}

/** Pointer-graph note: the caption was the content (source art was decorative). */
function PointerGraphNote() {
  return (
    <Panel
      title="Decoupled Vector Space & Pointer Graph"
      sub="Proxy vector coordinates dynamically resolve to exact document line ranges and structural hierarchy."
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <GlassBar color="#5EC4C8" icon="nodes" title="Coordinates, Not Copies" detail="The index stores lightweight proxy coordinates; the originals stay authoritative. Every retrieved chunk carries its line range and position in the document tree." />
      </div>
    </Panel>
  );
}

export default function ProxyPointerTab() {
  const [activeSubTab, setActiveSubTab] = useState('pipeline'); // 'pipeline' | 'multimodal' | 'resolution' | 'noise' | 'benchmark' | 'code'
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [activeSearchId, setActiveSearchId] = useState('pkce_verifier');
  const [activeMultimodalId, setActiveMultimodalId] = useState('q2_revenue_chart');
  const [activeNoiseCategory, setActiveNoiseCategory] = useState(0);

  const activeStep = PIPELINE_STEPS[activeStepIdx] || PIPELINE_STEPS[0];
  const activeSearch = SEARCH_SCENARIOS.find(s => s.id === activeSearchId) || SEARCH_SCENARIOS[0];
  const activeMultimodal = MULTIMODAL_SCENARIOS.find(s => s.id === activeMultimodalId) || MULTIMODAL_SCENARIOS[0];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="rag"
        moduleLabel="Enterprise Document Intelligence [Vol.1 #15]"
        title="Proxy-Pointer RAG: Structure Meets Scale"
        description="Standard RAG either chunks blindly by token count (severing headings and tables) or retains massive documents (blowing token budgets). Proxy-Pointer RAG decouples the search index from content storage: light, breadcrumb-injected proxy vectors locate the answer, while precise pointers expand retrieval to the exact structured parent section."
        metrics={[
          { label: 'Ingestion Pipeline', value: '8 Stages' },
          { label: 'Heading Parse Time', value: '<1.0s (Regex)' },
          { label: 'Context Accuracy', value: '100% Grounded' },
          { label: 'Token Waste Saved', value: '42%' }
        ]}
      />

      <Container size="wide">
        {/* DUAL ARCHITECTURAL INFOGRAPHIC CARDS */}
        <Grid columns={{ base: '1fr', lg: '1.4fr 0.6fr' }} gap="var(--ds-space-4)" style={{ marginBottom: 'var(--ds-space-6)' }}>
          <ProxyPipelineStripPanel />
          <PointerGraphNote />
        </Grid>

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
            { id: 'pipeline', icon: '⚡', label: '8-Stage Ingestion Pipeline', desc: 'Step-by-step pipeline runner' },
            { id: 'multimodal', icon: '🖼️', label: 'Multimodal (No Vision Vectors)', desc: 'Charts & diagrams via text proxies' },
            { id: 'resolution', icon: '🔍', label: 'Proxy vs Pointer Resolution', desc: 'Live retrieval & expansion tester' },
            { id: 'noise', icon: '🧹', label: '6-Category Noise Filter', desc: 'Gemini Flash Lite boilerplate cleaner' },
            { id: 'benchmark', icon: '📊', label: 'Accuracy & Cost Benchmark', desc: 'Standard Chunking vs Proxy-Pointer' },
            { id: 'code', icon: '💻', label: 'Production Python Code', desc: 'SkeletonTree & PointerResolver' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '200px',
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

        {/* ─── MULTIMODAL PROXY-POINTER RAG (NO VISION EMBEDDINGS) ─── */}
        {activeSubTab === 'multimodal' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>🖼️ Multimodal Answers Without Multimodal Embeddings</h3>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                      Instead of complex multi-vector CLIP/ColPali embeddings, lightweight text captions act as search proxies, and pointers inject the original high-resolution charts directly into the Multimodal LLM.
                    </p>
                  </div>
                  <Badge variant="success">Zero Vision Embedding Overhead</Badge>
                </Flex>

                {/* DUAL MULTIMODAL PANELS */}
                <Grid columns={{ base: '1fr', lg: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <ShreddingVsProxyPanel />
                  <MultimodalFlowPanel />
                </Grid>

                {/* INTERACTIVE MULTIMODAL SCENARIO SELECTOR */}
                <div>
                  <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                    Select Multimodal Scenario to Test:
                  </span>
                  <Flex gap={2} style={{ flexWrap: 'wrap' }}>
                    {MULTIMODAL_SCENARIOS.map(sc => (
                      <button
                        key={sc.id}
                        onClick={() => setActiveMultimodalId(sc.id)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 'var(--ds-radius-md)',
                          border: `1px solid ${activeMultimodalId === sc.id ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)'}`,
                          background: activeMultimodalId === sc.id ? 'var(--ds-color-module-foundations-light)' : 'var(--ds-color-bg-surface)',
                          color: activeMultimodalId === sc.id ? 'var(--ds-color-module-foundations-dark)' : 'var(--ds-color-text-primary)',
                          cursor: 'pointer',
                          fontWeight: activeMultimodalId === sc.id ? 'bold' : 'normal',
                          fontSize: 'var(--ds-font-size-bodySm)'
                        }}
                      >
                        {sc.title}
                      </button>
                    ))}
                  </Flex>
                </div>

                {/* SCENARIO LIVE SIMULATION DETAILS */}
                <Grid columns={{ base: '1fr', lg: '1fr 1fr' }} gap="var(--ds-space-4)">
                  {/* TEXT PROXY LAYER */}
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                    <Stack gap={3}>
                      <Flex justify="space-between" align="center">
                        <Badge variant="info">1. Lightweight Text Proxy Index</Badge>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', color: '#3A9B9F', fontWeight: 'bold' }}>
                          Latency: &lt;10ms (1536d)
                        </span>
                      </Flex>

                      <div>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>USER NATURAL LANGUAGE QUERY:</span>
                        <div style={{ fontSize: 'var(--ds-font-size-body)', fontWeight: 'bold', color: 'var(--ds-color-text-primary)', marginTop: '2px' }}>
                          "{activeMultimodal.query}"
                        </div>
                      </div>

                      <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '10px 12px', borderRadius: '6px' }}>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>EMBEDDED TEXT PROXY (CAPTION + OCR):</span>
                        <p style={{ margin: '4px 0 0 0', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', lineHeight: '1.4' }}>
                          "{activeMultimodal.textProxy.caption}"
                        </p>
                      </div>

                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>
                        Embedding Model: <code style={{ color: 'var(--ds-color-text-primary)' }}>{activeMultimodal.textProxy.modelUsed}</code>
                      </div>
                    </Stack>
                  </Card>

                  {/* PHYSICAL POINTER RESOLUTION & MULTIMODAL LLM */}
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <Stack gap={3}>
                      <Flex justify="space-between" align="center">
                        <Badge variant="success">2. Pointer Asset Resolution ➔ Multimodal LLM</Badge>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', color: '#3A9B9F', fontWeight: 'bold' }}>
                          Confidence: {activeMultimodal.multimodalLLMAnswer.confidence}
                        </span>
                      </Flex>

                      <div>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>RESOLVED HIGH-RES ASSET POINTER:</span>
                        <div style={{ fontSize: 'var(--ds-font-size-caption)', fontFamily: 'var(--ds-font-family-mono)', color: '#3A9B9F', marginTop: '2px' }}>
                          📎 {activeMultimodal.multimodalPointer.pointer_uri} ({activeMultimodal.multimodalPointer.resolution})
                        </div>
                      </div>

                      <div style={{ background: 'var(--ds-color-bg-surface)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--ds-color-border-subtle)' }}>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: '#3A9B9F' }}>
                          MULTIMODAL SYNTHESIS (GEMINI 1.5 PRO / GPT-4O):
                        </span>
                        <p style={{ margin: '4px 0 0 0', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-primary)', lineHeight: '1.5' }}>
                          {activeMultimodal.multimodalLLMAnswer.textAnswer}
                        </p>
                      </div>

                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>
                        Bounding Box: <code style={{ color: 'var(--ds-color-text-primary)' }}>{JSON.stringify(activeMultimodal.multimodalPointer.bbox_coordinates)}</code>
                      </div>
                    </Stack>
                  </Card>
                </Grid>

                {/* CLIP/COLPALI VS PROXY-POINTER COST COMPARISON */}
                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <Stack gap={2}>
                    <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>⚡ Architectural Advantage Over ColPali / CLIP:</strong>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: 'var(--ds-font-size-caption)' }}>
                      <div style={{ background: 'rgba(220,38,38,0.06)', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(220,38,38,0.2)' }}>
                        <span style={{ color: '#DC2626', fontWeight: 'bold' }}>❌ Dense Vision Vectors (ColPali / CLIP):</span>
                        <p style={{ margin: '2px 0 0 0', color: 'var(--ds-color-text-secondary)' }}>
                          {activeMultimodal.clipColPaliVsProxyComparison.clipOverhead}
                        </p>
                      </div>
                      <div style={{ background: 'rgba(16,185,129,0.06)', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <span style={{ color: '#3A9B9F', fontWeight: 'bold' }}>✅ Text Proxy + Multimodal Pointer:</span>
                        <p style={{ margin: '2px 0 0 0', color: 'var(--ds-color-text-secondary)' }}>
                          {activeMultimodal.clipColPaliVsProxyComparison.proxyPointerAdvantage}
                        </p>
                      </div>
                    </div>
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 1. 8-STAGE INGESTION PIPELINE ─── */}
        {activeSubTab === 'pipeline' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>⚡ Live Ingestion Pipeline Stepper (8 Stages)</h3>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                      Observe how raw markdown documents are transformed into noise-free, breadcrumb-injected proxy vectors and pointer maps.
                    </p>
                  </div>
                  <Flex gap={2}>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={activeStepIdx === 0}
                      onClick={() => setActiveStepIdx(s => Math.max(0, s - 1))}
                    >
                      ← Previous Stage
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={activeStepIdx >= PIPELINE_STEPS.length - 1}
                      onClick={() => setActiveStepIdx(s => Math.min(PIPELINE_STEPS.length - 1, s + 1))}
                    >
                      Next Stage →
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setActiveStepIdx(0)}
                    >
                      🔄 Reset
                    </Button>
                  </Flex>
                </Flex>

                {/* 8-STAGE STEPPER BAR */}
                <Stepper
                  activeStep={activeStepIdx}
                  onStepClick={(idx) => setActiveStepIdx(idx)}
                  steps={PIPELINE_STEPS.map((s, idx) => ({
                    label: `Stage ${s.num}`,
                    detail: s.title.split(' ')[0],
                    status: idx < activeStepIdx ? 'complete' : idx === activeStepIdx ? 'current' : 'upcoming'
                  }))}
                />

                {/* ACTIVE STAGE CARD */}
                <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)', borderTop: `4px solid ${activeStep.color}` }}>
                  <Stack gap={3}>
                    <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '8px' }}>
                      <Flex align="center" gap={2}>
                        <span style={{ fontSize: '1.5rem' }}>{activeStep.icon}</span>
                        <div>
                          <strong style={{ fontSize: 'var(--ds-font-size-bodyLg)', color: 'var(--ds-color-text-primary)' }}>
                            Stage {activeStep.num}: {activeStep.title}
                          </strong>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '2px' }}>
                            {activeStep.desc}
                          </div>
                        </div>
                      </Flex>
                      <Badge variant="primary" style={{ fontFamily: 'var(--ds-font-family-mono)' }}>{activeStep.badge}</Badge>
                    </Flex>

                    {/* LIVE STAGE OUTPUT PAYLOAD */}
                    <div>
                      <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>
                        STAGE COMPUTED ARTIFACT / OUTPUT:
                      </span>
                      <CodeBlock
                        language={typeof activeStep.output === 'string' ? 'markdown' : 'json'}
                        code={typeof activeStep.output === 'string' ? activeStep.output : JSON.stringify(activeStep.output, null, 2)}
                      />
                    </div>
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 2. PROXY VS POINTER RESOLUTION LAB ─── */}
        {activeSubTab === 'resolution' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔍 Interactive Proxy-Pointer Resolution Lab</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    See how a breadcrumb proxy vector matches the query, and how the pointer expands the retrieved context to the complete parent section.
                  </p>
                </div>

                {/* SCENARIO SELECTOR */}
                <Flex gap={2}>
                  {SEARCH_SCENARIOS.map(sc => (
                    <button
                      key={sc.id}
                      onClick={() => setActiveSearchId(sc.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--ds-radius-md)',
                        border: `1px solid ${activeSearchId === sc.id ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)'}`,
                        background: activeSearchId === sc.id ? 'var(--ds-color-module-foundations-light)' : 'var(--ds-color-bg-surface)',
                        color: activeSearchId === sc.id ? 'var(--ds-color-module-foundations-dark)' : 'var(--ds-color-text-primary)',
                        cursor: 'pointer',
                        fontWeight: activeSearchId === sc.id ? 'bold' : 'normal'
                      }}
                    >
                      Query: "{sc.query.substring(0, 45)}..."
                    </button>
                  ))}
                </Flex>

                <Grid columns={2} gap={4}>
                  {/* LEFT: PROXY SEARCH LAYER */}
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                    <Stack gap={3}>
                      <Flex justify="space-between" align="center">
                        <Badge variant="info">1. Proxy Search Hit (FAISS Index)</Badge>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: '#3A9B9F' }}>
                          Similarity: {(activeSearch.proxyHit.score * 100).toFixed(1)}%
                        </span>
                      </Flex>

                      <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '8px 10px', borderRadius: '6px' }}>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>INJECTED BREADCRUMB PATH:</span>
                        <div style={{ fontSize: 'var(--ds-font-size-caption)', color: '#3A9B9F', fontFamily: 'var(--ds-font-family-mono)', fontWeight: 'bold', marginTop: '2px' }}>
                          🏷️ [{activeSearch.proxyHit.breadcrumb}]
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>MATCHED PROXY SNIPPET:</span>
                        <p style={{ margin: '4px 0 0 0', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-primary)', lineHeight: '1.5' }}>
                          "{activeSearch.proxyHit.snippet}"
                        </p>
                      </div>

                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', borderTop: '1px solid var(--ds-color-border-subtle)', paddingTop: '6px' }}>
                        Node Pointer ID: <code style={{ color: 'var(--ds-color-text-primary)' }}>{activeSearch.proxyHit.node_id}</code>
                      </div>
                    </Stack>
                  </Card>

                  {/* RIGHT: POINTER EXPANDED FULL SECTION */}
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <Stack gap={3}>
                      <Flex justify="space-between" align="center">
                        <Badge variant="success">2. Pointer Resolved Context (Source Section)</Badge>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', color: '#3A9B9F', fontWeight: 'bold' }}>
                          100% Boundary Preservation
                        </span>
                      </Flex>

                      <div>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>RESOLVED MARKDOWN SECTION:</span>
                        <CodeBlock language="markdown" code={activeSearch.pointerResolvedContext} />
                      </div>
                    </Stack>
                  </Card>
                </Grid>

                {/* STANDARD RAG COMPARISON CALLOUT */}
                <Callout type="danger" title="Why Standard Fixed-Size Chunking Fails Here:">
                  <p style={{ margin: '4px 0 0 0', fontSize: 'var(--ds-font-size-bodySm)', lineHeight: 1.5 }}>
                    <strong>Standard Chunk:</strong> "{activeSearch.standardRagComparison.standardChunk}"<br />
                    <strong>Failure Mode:</strong> {activeSearch.standardRagComparison.standardFailure}
                  </p>
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 3. 6-CATEGORY LLM NOISE FILTER ─── */}
        {activeSubTab === 'noise' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧹 6-Category LLM Noise Filter (Gemini Flash Lite)</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Before embedding, lightweight LLM passes purge non-informational boilerplate, reducing index size by 14–22% and eliminating embedding dilution.
                  </p>
                </div>

                <Grid columns={3} gap={3}>
                  {NOISE_FILTER_CATEGORIES.map((cat, idx) => (
                    <Card
                      key={idx}
                      style={{
                        padding: 'var(--ds-space-4)',
                        borderTop: `3px solid ${activeNoiseCategory === idx ? '#3A9B9F' : 'var(--ds-color-border-subtle)'}`,
                        background: activeNoiseCategory === idx ? 'var(--ds-color-bg-surfaceHover)' : 'var(--ds-color-bg-surface)',
                        cursor: 'pointer'
                      }}
                      onClick={() => setActiveNoiseCategory(idx)}
                    >
                      <Stack gap={2}>
                        <div style={{ fontSize: '1.5rem' }}>{cat.icon}</div>
                        <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-primary)' }}>{cat.name}</strong>
                        <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', fontStyle: 'italic' }}>
                          Example: "{cat.example}"
                        </div>
                      </Stack>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 4. ACCURACY & COST BENCHMARK ─── */}
        {activeSubTab === 'benchmark' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📊 Performance & Accuracy Benchmark</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Empirical comparison between Standard Fixed-Token Chunking, Sliding Window, and Proxy-Pointer RAG.
                  </p>
                </div>

                <Grid columns={3} gap={4}>
                  <Card style={{ padding: 'var(--ds-space-4)', borderTop: '3px solid #DC2626' }}>
                    <Stack gap={2}>
                      <Badge variant="danger">Standard 500-Token Chunking</Badge>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#DC2626' }}>71.2%</div>
                      <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                        Context Accuracy (Severed Headings & Lost Tables)
                      </span>
                    </Stack>
                  </Card>

                  <Card style={{ padding: 'var(--ds-space-4)', borderTop: '3px solid #C47A6A' }}>
                    <Stack gap={2}>
                      <Badge variant="warning">Sliding Window with Overlap</Badge>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#C47A6A' }}>82.5%</div>
                      <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                        High Token Redundancy (+85% Index Bloat)
                      </span>
                    </Stack>
                  </Card>

                  <Card style={{ padding: 'var(--ds-space-4)', borderTop: '3px solid #5EC4C8', background: 'rgba(16,185,129,0.04)' }}>
                    <Stack gap={2}>
                      <Badge variant="success">Proxy-Pointer Architecture</Badge>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#3A9B9F' }}>100%</div>
                      <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                        Zero Boundary Fragmentation & -42% Token Waste
                      </span>
                    </Stack>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 5. PRODUCTION PYTHON CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={3}>
                <Flex justify="space-between" align="center">
                  <h3 style={{ margin: 0 }}>💻 Production Python Implementation</h3>
                  <Badge variant="subtle">Python 3.11+ / FAISS / Gemini Embeddings</Badge>
                </Flex>

                <CodeBlock
                  language="python"
                  code={`# Proxy-Pointer RAG: Structure Meets Scale
import re
from typing import NamedTuple, List, Dict
import google.generativeai as genai

class NodePointer(NamedTuple):
    doc_id: str
    node_id: str
    title: str
    breadcrumb: str
    start_line: int
    end_line: int

class SkeletonTree:
    """Regex Heading Parser without LLM overhead (<1 sec)."""
    @staticmethod
    def parse_markdown(doc_id: str, markdown_text: str) -> List[NodePointer]:
        lines = markdown_text.splitlines()
        nodes = []
        heading_stack = []
        
        for i, line in enumerate(lines, 1):
            match = re.match(r'^(#{1,6})\s+(.+)$', line)
            if match:
                level = len(match.group(1))
                title = match.group(2).strip()
                
                # Maintain ancestry stack for breadcrumbs
                while heading_stack and heading_stack[-1]['level'] >= level:
                    prev = heading_stack.pop()
                    prev['end_line'] = i - 1
                    nodes.append(prev)
                
                breadcrumb = " > ".join([h['title'] for h in heading_stack] + [title])
                heading_stack.append({
                    'doc_id': doc_id,
                    'node_id': f"node_{len(nodes)+1}",
                    'title': title,
                    'breadcrumb': breadcrumb,
                    'level': level,
                    'start_line': i,
                    'end_line': len(lines)
                })
        
        while heading_stack:
            nodes.append(heading_stack.pop())
            
        return [NodePointer(**{k: v for k, v in n.items() if k != 'level'}) for n in nodes]

class ProxyPointerRetriever:
    """Decoupled Proxy Vector Search with Instant Pointer Resolution."""
    def __init__(self, vector_index, pointer_map: Dict[str, str]):
        self.index = vector_index
        self.pointer_map = pointer_map  # node_id -> full markdown section

    def search_and_resolve(self, query: str, top_k: int = 3) -> List[str]:
        # 1. Search Proxy Layer
        matched_node_ids = self.index.search(query, top_k=top_k)
        
        # 2. Resolve Pointers to Complete Structured Sections
        resolved_sections = [self.pointer_map[nid] for nid in matched_node_ids]
        return resolved_sections`}
                />
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
