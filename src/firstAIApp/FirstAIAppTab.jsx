import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  FIVE_APP_STAGES,
  API_ERROR_TRIAGE_MATRIX,
  SIMULATE_SUMMARIZER_PIPELINE,
  PYTHON_PRODUCTION_APP_SCRIPT
} from './firstAppEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function FirstAIAppTab() {
  const [activeSubTab, setActiveSubTab] = useState('stages'); 
  // 'stages' | 'simulator' | 'jsoninspect' | 'errors' | 'code'

  // Interactive Summarizer Simulator State
  const [inputArticle, setInputArticle] = useState(
    "Artificial intelligence is transforming industries by automating tasks, improving decision-making, and enabling new products and services. However, building production AI applications requires understanding that the client package is not the model itself—it is a messenger to cloud neural infrastructure. Developers must secure their API keys with environment variables, navigate structured JSON response trees, handle quota and rate-limit errors gracefully with retries, and apply Map-Reduce chunking when processing large multi-page articles."
  );
  const [chunkSize, setChunkSize] = useState(40); // words per chunk for interactive demo

  const simResult = SIMULATE_SUMMARIZER_PIPELINE(inputArticle, chunkSize);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="foundations"
        moduleLabel="Foundations & Infrastructure [Real-World AI Application Engineering]"
        title="Building Your First Real AI App: Architecture, APIs & Infrastructure"
        description="Demystify what actually happens behind the curtain when building AI applications. Master the 5-stage engineering journey from local client messengers to cloud neural compute, environment variable secret management, JSON response navigation, code vs infrastructure error triaging, and Map-Reduce document chunking."
        metrics={[
          { label: 'Core Mental Model', value: 'Messenger ➔ Cloud Brain' },
          { label: 'Secret Security', value: 'os.getenv(.env) Zero Leakage' },
          { label: 'Error Triaging', value: 'Code Bugs vs Quota (429)' },
          { label: 'Long Text Strategy', value: 'Map-Reduce Chunking' }
        ]}
      />

      <Container size="wide">
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
            { id: 'stages', icon: '🚀', label: '1. The 5 App Milestones', desc: 'From toy script to production app' },
            { id: 'simulator', icon: '⚡', label: '2. Live Summarizer & Chunking', desc: 'Interactive Map-Reduce pipeline' },
            { id: 'jsoninspect', icon: '🔍', label: '3. JSON Response Anatomy', desc: 'Deconstructing choices & usage' },
            { id: 'errors', icon: '🛡️', label: '4. Error Triaging Matrix', desc: 'Code bugs vs 429 quota limits' },
            { id: 'code', icon: '💻', label: '5. Production Starter Code', desc: 'Runnable .env & retry script' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '180px',
                padding: 'var(--ds-space-3) var(--ds-space-3)',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--ds-font-size-bodySm)', marginBottom: '2px' }}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              <div style={{ fontSize: '11px', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>
                {tab.desc}
              </div>
            </button>
          ))}
        </div>

        {/* ─── SUBTAB 1: THE 5 APP MILESTONES ─── */}
        {activeSubTab === 'stages' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🚀 The 5 Milestones: From "Toy Script" to Real-World AI App</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Building an AI app isn't just about calling a model—it's about managing infrastructure, secrets, and structured data safely.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {FIVE_APP_STAGES.map((s, idx) => (
                    <Card key={idx} style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                      <strong style={{ fontSize: '13px', color: '#3A9B9F', display: 'block', marginBottom: '6px' }}>
                        {s.stage}
                      </strong>

                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'white', marginBottom: '8px' }}>
                        {s.concept}
                      </p>

                      <div style={{ background: 'rgba(239,68,68,0.08)', padding: '6px 8px', borderRadius: '4px', borderLeft: '3px solid #ef4444', fontSize: '11px', color: '#f87171', marginBottom: '6px' }}>
                        <strong>Anti-Pattern:</strong> {s.antiPattern}
                      </div>

                      <div style={{ background: 'rgba(16,185,129,0.08)', padding: '6px 8px', borderRadius: '4px', borderLeft: '3px solid #5EC4C8', fontSize: '11px', color: '#34d399' }}>
                        <strong>Best Practice:</strong> {s.bestPractice}
                      </div>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: LIVE SUMMARIZER & CHUNKING SIMULATOR ─── */}
        {activeSubTab === 'simulator' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚡ Live Article Summarizer & Map-Reduce Chunking Sandbox</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Paste custom text and adjust the chunking threshold to see how long articles are segmented into manageable windows before being synthesized.
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                    Paste Article Text:
                  </label>
                  <textarea
                    rows={4}
                    value={inputArticle}
                    onChange={e => setInputArticle(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--ds-color-bg-surface)',
                      color: 'white',
                      border: '1px solid var(--ds-color-border-subtle)',
                      borderRadius: '6px',
                      padding: '10px',
                      fontSize: '12px',
                      fontFamily: 'sans-serif'
                    }}
                  />
                </div>

                <Flex justify="space-between" align="center">
                  <div style={{ flex: 1, maxWidth: '300px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Max Chunk Size: {chunkSize} words
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      step="5"
                      value={chunkSize}
                      onChange={e => setChunkSize(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <Badge variant="subtle" style={{ color: '#3A9B9F', background: 'rgba(16,185,129,0.15)' }}>
                    Total Words: {simResult.totalWords} | Chunks Created: {simResult.chunkCount} | Est. Tokens: {simResult.totalTokensEstimated}
                  </Badge>
                </Flex>

                {/* VISUAL CHUNKS BREAKDOWN */}
                <div>
                  <strong style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Mapped Document Chunks:
                  </strong>
                  <Grid columns={{ base: '1fr', md: `repeat(${Math.min(simResult.chunkCount, 4)}, 1fr)` }} gap="var(--ds-space-3)">
                    {simResult.chunks.map((c, i) => (
                      <Card key={i} style={{ padding: '10px', background: '#090d16', borderTop: '3px solid #5EC4C8' }}>
                        <div style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold' }}>Chunk #{i + 1} ({c.split(' ').length} words)</div>
                        <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px', maxHeight: '70px', overflowY: 'auto' }}>
                          "{c.slice(0, 80)}..."
                        </div>
                      </Card>
                    ))}
                  </Grid>
                </div>

                {/* FINAL SUMMARY OUTPUT */}
                <Card style={{ padding: '16px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                    <strong style={{ fontSize: '13px', color: '#3A9B9F' }}>🎯 Generated Executive Summary:</strong>
                    <span style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', fontFamily: 'monospace' }}>
                      Latency: {simResult.executionTimeMs}ms
                    </span>
                  </Flex>
                  <pre style={{ margin: 0, fontSize: '12px', color: 'white', whiteSpace: 'pre-wrap', fontFamily: 'sans-serif', lineHeight: '1.6' }}>
                    {simResult.summary}
                  </pre>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: JSON RESPONSE ANATOMY ─── */}
        {activeSubTab === 'jsoninspect' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔍 Anatomy of an LLM API Response Object</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Why understanding structured returns separates script copiers from production AI engineers.
                  </p>
                </div>

                <div style={{ background: '#090d16', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '11px', color: '#3A9B9F', lineHeight: '1.6' }}>
{`{
  "id": "chatcmpl-9Abc123xyz",
  "object": "chat.completion",
  "created": 1718900000,
  "model": "gpt-4o-mini-2024-07-18",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "• The client library communicates with cloud neural compute..."
      },
      "finish_reason": "stop"   // "stop" | "length" (truncated) | "content_filter"
    }
  ],
  "usage": {
    "prompt_tokens": 142,       // Input cost calculation
    "completion_tokens": 48,    // Output cost calculation
    "total_tokens": 190
  }
}`}
                  </pre>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}>
                    <strong style={{ fontSize: '12px', color: '#3A9B9F' }}>1. Extracting Content</strong>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                      Always access <code>response.choices[0].message.content</code> rather than printing raw response.
                    </div>
                  </Card>

                  <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #F5A623' }}>
                    <strong style={{ fontSize: '12px', color: '#F5A623' }}>2. Logging Token Usage</strong>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                      Track <code>response.usage.prompt_tokens</code> and <code>completion_tokens</code> for financial observability and cost attribution.
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: ERROR TRIAGING MATRIX ─── */}
        {activeSubTab === 'errors' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛡️ Error Triaging Matrix: Code Bugs vs Infrastructure Failures</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Stop modifying working code when your failure is an authentication, rate limit, or billing tier block.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {API_ERROR_TRIAGE_MATRIX.map((err, idx) => (
                    <Card key={idx} style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderTop: '3px solid #ef4444' }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                        <strong style={{ fontSize: '12px', color: '#ef4444', fontFamily: 'monospace' }}>{err.code}</strong>
                        <Badge variant="outline">{err.domain}</Badge>
                      </Flex>

                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginBottom: '6px' }}>
                        <strong>Root Cause:</strong> {err.cause}
                      </div>

                      <div style={{ background: 'rgba(16,185,129,0.08)', padding: '6px 8px', borderRadius: '4px', fontSize: '11px', color: '#34d399' }}>
                        <strong>Engineering Fix:</strong> {err.remedy}
                      </div>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 5: CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>💻 Production Starter Kit: Article Summarizer with Retries</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Clean Python code implementing `.env` loading, exponential backoff retries via `tenacity`, and Map-Reduce chunking.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_PRODUCTION_APP_SCRIPT} />

                <Callout type="success">
                  <strong>Ship in Public:</strong> The fastest way to grow in AI engineering isn't passive reading—it's writing code, encountering real 429 errors, structuring secrets, and deploying functioning tools.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
