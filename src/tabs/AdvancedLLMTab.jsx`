import React, { useState } from 'react';
import { Container, Section, Grid, Flex, Stack } from '../components/layout/Primitives.jsx';

/**
 * Advanced LLM Techniques and Agentic RAG Systems
 * Based on ENHANCED_CONTENT.md
 */
export default function AdvancedLLMTab({ s }) {
  return (
    <Container size="normal" style={{ padding: 'var(--ds-space-10) 0' }}>
      <Section variant="hero" style={{ marginBottom: 'var(--ds-space-12)' }}>
        <Section.Header>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 'var(--ds-space-4)' }}>
            Advanced LLM Techniques & Agentic RAG
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--ds-color-text-secondary)', maxWidth: '800px' }}>
            An exploration of cutting-edge strategies for enhancing model performance,
            inference speed, and autonomous retrieval systems.
          </p>
        </Section.Header>
      </Section>

      <Stack gap="lg">
        {/* 1. Agentic Software Factory */}
        <Section variant="bordered">
          <Section.Header>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>1. Agentic Software Factory</h2>
            <p style={{ color: 'var(--ds-color-text-secondary)' }}>Implementing a hierarchy of needs for autonomous software development.</p>
          </Section.Header>
          <Section.Body>
            <Grid columns={2} gap="lg">
              <Grid.Item>
                <Stack gap="sm">
                  <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 'var(--ds-space-2)' }}>Key Components:</div>
                  <ul style={{ paddingLeft: '20px', color: 'var(--ds-color-text-secondary)', lineHeight: '1.6' }}>
                    <li><strong>Harness:</strong> Tooling, workspace, and execution environment.</li>
                    <li><strong>Personalization:</strong> Project direction, custom rules, and skills.</li>
                    <li><strong>Automation:</strong> Self-starting and iterative work loops.</li>
                    <li><strong>Continual Learning:</strong> Feedback loops from success/failure.</li>
                  </ul>
                </Stack>
              </Grid.Item>
              <Grid.Item>
                <div style={{
                  background: 'var(--ds-color-bg-surfaceHover)',
                  borderRadius: '12px',
                  padding: 'var(--ds-space-6)',
                  border: '1px solid var(--ds-color-border-subtle)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontWeight: 600, marginBottom: 'var(--ds-space-4)' }}>Factory Workflow</div>
                  <WorkflowDiagram type="factory" />
                </div>
              </Grid.Item>
            </Grid>
          </Section.Body>
        </Section>

        {/* 2. Speculative Decoding */}
        <Section variant="bordered">
          <Section.Header>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>2. Speculative Decoding</h2>
            <p style={{ color: 'var(--ds-color-text-secondary)' }}>Reducing inference latency via draft-and-verify loops.</p>
          </Section.Header>
          <Section.Body>
            <Stack gap="lg">
              <div style={{
                background: 'var(--ds-color-bg-surfaceHover)',
                borderRadius: '12px',
                padding: 'var(--ds-space-6)',
                border: '1px solid var(--ds-color-border-subtle)'
              }}>
                <SpeculativeSimulator />
              </div>

              <Grid columns={1} gap="md">
                <Grid.Item>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', color: 'var(--ds-color-text-secondary)' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', textAlign: 'left' }}>
                        <th style={{ padding: '12px', fontWeight: 600, color: 'var(--ds-color-text-primary)' }}>Variant</th>
                        <th style={{ padding: '12px', fontWeight: 600, color: 'var(--ds-color-text-primary)' }}>Description</th>
                        <th style={{ padding: '12px', fontWeight: 600, color: 'var(--ds-color-text-primary)' }}>Implementation</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                        <td style={{ padding: '12px', fontWeight: 500 }}>Medusa</td>
                        <td style={{ padding: '12px' }}>Target model with multiple prediction heads</td>
                        <td style={{ padding: '12px' }}>Directly predicts future tokens</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                        <td style={{ padding: '12px', fontWeight: 500 }}>Eagle</td>
                        <td style={{ padding: '12px' }}>Uses internal hidden states</td>
                        <td style={{ padding: '12px' }}>Higher acceptance rates</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '12px', fontWeight: 500 }}>Prompt Lookup</td>
                        <td style={{ padding: '12px' }}>No secondary model</td>
                        <td style={{ padding: '12px' }}>Uses recurring phrases from input</td>
                      </tr>
                    </tbody>
                  </table>
                </Grid.Item>
              </Grid>
            </Stack>
          </Section.Body>
        </Section>

        {/* 3. Multi-modal RAG Pipeline */}
        <Section variant="bordered">
          <Section.Header>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>3. Multi-modal RAG Pipeline</h2>
            <p style={{ color: 'var(--ds-color-text-secondary)' }}>Integrating visual and textual data for grounded reasoning.</p>
          </Section.Header>
          <Section.Body>
            <Grid columns={2} gap="lg">
              <Grid.Item>
                <Stack gap="sm">
                  <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 'var(--ds-space-2)' }}>Pipeline Stages:</div>
                  <ol style={{ paddingLeft: '20px', color: 'var(--ds-color-text-secondary)', lineHeight: '1.6' }}>
                    <li><strong>Parse Document:</strong> Extract text & images from PDF.</li>
                    <li><strong>Image Summarization:</strong> Generate searchable text descriptions.</li>
                    <li><strong>Multi-vector Storage:</strong> Store text and image embeddings separately.</li>
                    <li><strong>Query with Text + Image:</strong> Retrieve relevant mixed content.</li>
                    <li><strong>GPT-4o Reasoning:</strong> Generate final grounded answer.</li>
                  </ol>
                </Stack>
              </Grid.Item>
              <Grid.Item>
                <div style={{
                  background: 'var(--ds-color-bg-surfaceHover)',
                  borderRadius: '12px',
                  padding: 'var(--ds-space-6)',
                  border: '1px solid var(--ds-color-border-subtle)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontWeight: 600, marginBottom: 'var(--ds-space-4)' }}>RAG Pipeline Flow</div>
                  <WorkflowDiagram type="rag" />
                </div>
              </Grid.Item>
            </Grid>
          </Section.Body>
        </Section>

        {/* 4. Planted Hint Experiment */}
        <Section variant="bordered">
          <Section.Header>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>4. Planted Hint Experiment</h2>
            <p style={{ color: 'var(--ds-color-text-secondary)' }}>Analyzing model faithfulness and bias response.</p>
          </Section.Header>
          <Section.Body>
            <Grid columns={1} gap="md">
              <Grid.Item>
                <div style={{
                  background: 'var(--ds-color-bg-canvas)',
                  borderRadius: '12px',
                  padding: 'var(--ds-space-6)',
                  border: '1px solid var(--ds-color-border-subtle)'
                }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--ds-space-4)' }}>Behavioral Patterns Observed</h3>
                  <Flex wrap justify="center" gap="lg">
                    <BehaviorCard label="Defers" desc="Directly states the hint is the reason for the answer." color="#ef4444" />
                    <BehaviorCard label="Mentions then Argues" desc="States the hint, then provides independent reasoning." color="#f59e0b" />
                    <BehaviorCard label="Says Nothing" desc="No mention of the hint in the final reasoning path." color="#10b981" />
                  </Flex>
                </div>
              </Grid.Item>
            </Grid>
          </Section.Body>
        </Section>
      </Stack>
    </Container>
  );
}

// --- Helper Components ---

function BehaviorCard({ label, desc, color }) {
  return (
    <div style={{
      flex: 1,
      minWidth: '200px',
      padding: 'var(--ds-space-6)',
      borderRadius: '12px',
      borderLeft: `4px solid ${color}`,
      background: 'var(--ds-color-bg-surface)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      textAlign: 'center'
    }}>
      <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 'var(--ds-space-2)', color: color }}>{label}</div>
      <div style={{ fontSize: '14px', color: 'var(--ds-color-text-secondary)' }}>{desc}</div>
    </div>
  );
}

function WorkflowDiagram({ type }) {
  if (type === 'factory') {
    return (
      <svg width="300" height="120" viewBox="0 0 300 120">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="var(--ds-color-text-tertiary)" />
          </marker>
        </defs>
        <g transform="translate(10,10)">
          <Rect x="0" y="0" w="50" h="30" rx="4" label="Goal" />
          <Rect x="70" y="0" w="50" h="30" rx="4" label="Harness" />
          <Rect x="140" y="0" w="50" h="30" rx="4" label="Context" />
          <Rect x="210" y="0" w="50" h="30" rx="4" label="Auto" />
          <path d="M50,15 L70,15" stroke="var(--ds-color-text-tertiary)" strokeWidth="2" markerEnd="url(#arrow)" />
          <path d="M120,15 L140,15" stroke="var(--ds-color-text-tertiary)" strokeWidth="2" markerEnd="url(#arrow)" />
          <path d="M190,15 L210,15" stroke="var(--ds-color-text-tertiary)" strokeWidth="2" markerEnd="url(#arrow)" />
        </g>
      </svg>
    );
  }
  if (type === 'rag') {
    return (
      <svg width="300" height="120" viewBox="0 0 300 120">
        <defs>
          <marker id="arrow-rag" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="var(--ds-color-text-tertiary)" />
          </marker>
        </defs>
        <g transform="translate(10,10)">
          <Rect x="0" y="0" w="60" h="30" rx="4" label="PDF" />
          <Rect x="80" y="0" w="60" h="30" rx="4" label="Parse" />
          <Rect x="160" y="0" w="60" h="30" rx="4" label="Store" />
          <Rect x="240" y="0" w="60" h="30" rx="4" label="Answer" />
          <path d="M60,15 L80,15" stroke="var(--ds-color-text-tertiary)" strokeWidth="2" markerEnd="url(#arrow-rag)" />
          <path d="M140,15 L160,15" stroke="var(--ds-color-text-tertiary)" strokeWidth="2" markerEnd="url(#arrow-rag)" />
          <path d="M220,15 L240,15" stroke="var(--ds-color-text-tertiary)" strokeWidth="2" markerEnd="url(#arrow-rag)" />
        </g>
      </svg>
    );
  }
  return null;
}

function Rect({ x, y, w, h, rx, label }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill="var(--ds-color-bg-surface)" stroke="var(--ds-color-border-subtle)" strokeWidth="1" />
      <text x={x + w/2} y={y + h/2 + 4} textAnchor="middle" fontSize="10" fill="var(--ds-color-text-primary)" fontWeight="600">{label}</text>
    </g>
  );
}

function SpeculativeSimulator() {
  const [step, setStep] = useState(0);
  const [tokens, setTokens] = useState([]);
  const [accepted, setAccepted] = useState([]);

  const runStep = () => {
    if (step >= 5) {
      setStep(0);
      setTokens([]);
      setAccepted([]);
      return;
    }

    const draftTokens = ['The', 'quick', 'brown', 'fox', 'jumps'];
    const targetTokens = ['The', 'quick', 'brown', 'dog', 'leaps'];

    const currentDraft = draftTokens[step];
    const currentTarget = targetTokens[step];

    setTokens(prev => [...prev, currentDraft]);
    setAccepted(prev => [...prev, currentDraft === currentTarget]);
    setStep(prev => prev + 1);
  };

  return (
    <Stack gap="md" align="center">
      <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Speculative Decoding Simulator</div>
      <div style={{ display: 'flex', gap: '8px', minHeight: '40px', alignItems: 'center' }}>
        {tokens.map((t, i) => (
          <div key={i} style={{
            padding: '4px 8px',
            borderRadius: '4px',
            background: accepted[i] ? '#dcfce7' : '#fee2e2',
            color: accepted[i] ? '#166534' : '#991b1b',
            border: `1px solid ${accepted[i] ? '#bbf7d0' : '#fecaca'}`,
            fontWeight: 500,
            transition: 'all 0.2s ease'
          }}>
            {t}
          </div>
        ))}
        {step < 5 && <div style={{ width: '12px', height: '12px', background: '#cbd5e1', borderRadius: '50%', animation: 'pulse 1s infinite' }} />}
      </div>
      <div style={{ fontSize: '13px', color: 'var(--ds-color-text-secondary)', textAlign: 'center' }}>
        {step === 0 ? "Click 'Next' to see the draft model predict tokens." :
         accepted[step-1] ? "✓ Accepted by target model" : "✗ Rejected! Target model corrects token."}
      </div>
      <button
        onClick={runStep}
        style={{
          padding: '8px 24px',
          background: 'var(--ds-color-module-foundations-primary)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--ds-radius-md)',
          cursor: 'pointer',
          fontWeight: 600
        }}
      >
        {step >= 5 ? 'Reset' : 'Next Token'}
      </button>
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </Stack>
  );
}
