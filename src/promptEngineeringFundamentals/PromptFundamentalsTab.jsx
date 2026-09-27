import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  COGNITIVE_PROMPTING_PATTERNS,
  PROMPT_STRUCTURE_COMPONENTS,
  PYTHON_DSPY_PROMPT_SCRIPT,
  COT_VS_TOT_COMPARISON,
  COT_TOT_HYBRID_PATTERNS,
  AGENTIC_REASONING_PATTERNS,
  PYTHON_COT_TOT_HYBRID
} from './promptFundamentalsEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function PromptFundamentalsTab() {
  const [activeSubTab, setActiveSubTab] = useState('patterns'); 
  // 'patterns' | 'architecture' | 'builder' | 'dspy'

  // Pattern selector
  const [selectedPatternIdx, setSelectedPatternIdx] = useState(2); // CoT default
  const activePattern = COGNITIVE_PROMPTING_PATTERNS[selectedPatternIdx];

  // Interactive Prompt Builder state
  const [role, setRole] = useState('Principal Security Engineer');
  const [contextData, setContextData] = useState('Kubernetes cluster audit log showing 50 failed SSH attempts on port 2222.');
  const [taskInstruction, setTaskInstruction] = useState('Analyze attack vector, identify source IP, and output remediation YAML.');
  const [outputFormat, setOutputFormat] = useState('JSON with keys: { "attack_type", "severity", "remediation_yaml" }');

  const assembledPrompt = `### SYSTEM ROLE:
You are a ${role}.

### CONSTRAINTS & RULES:
1. Base your answer strictly on the provided context.
2. NEVER hallucinate unseen IP addresses or ports.
3. If remediation is uncertain, flag severity as "HIGH_AUDIT_REQUIRED".

<context>
${contextData}
</context>

### TASK INSTRUCTION:
${taskInstruction}

### OUTPUT FORMAT:
Return strictly valid ${outputFormat}.`;

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="foundations"
        moduleLabel="Foundations & Architecture [Prompt Engineering Fundamentals & Cognitive Patterns]"
        title="Prompt Engineering: Cognitive Patterns & System Architecture"
        description="Master prompt engineering from core fundamentals to advanced cognitive reasoning architectures. Explore Zero-Shot, Few-Shot In-Context Learning, Chain-of-Thought (CoT), Tree-of-Thoughts (ToT), Directional Stimulus, and programmatic DSPy compilation."
        metrics={[
          { label: 'Foundational Patterns', value: 'Zero-Shot -> Few-Shot -> CoT' },
          { label: 'Search Space', value: 'Tree-of-Thoughts (ToT / Graph)' },
          { label: 'Security Standard', value: 'XML Delimiters & Strict Bounding' },
          { label: 'Programmatic Framework', value: 'DSPy Declarative Signatures' }
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
            { id: 'patterns', icon: '🧠', label: '1. Cognitive Patterns Taxonomy', desc: 'Zero-Shot, Few-Shot, CoT, ToT' },
            { id: 'architecture', icon: '🏛️', label: '2. System Prompt Blueprint', desc: 'Roles, delimiters, guardrails' },
            { id: 'builder', icon: '⚡', label: '3. Interactive Prompt Builder', desc: 'Real-time structured prompt composer' },
            { id: 'dspy', icon: '🛠️', label: '4. DSPy Programmatic Prompts', desc: 'Declarative signatures & assertions' },
            { id: 'cot_tot', icon: '🌳', label: '5. CoT vs ToT Deep Dive', desc: 'Trade-offs, hybrids, agentic patterns' }
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

        {/* ─── SUBTAB 1: COGNITIVE PATTERNS TAXONOMY ─── */}
        {activeSubTab === 'patterns' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧠 The Spectrum of Cognitive Reasoning Patterns</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    From simple zero-shot instructions to complex tree search algorithms over reasoning chains.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {COGNITIVE_PROMPTING_PATTERNS.map((pat, idx) => (
                    <Button
                      key={pat.id}
                      variant={selectedPatternIdx === idx ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSelectedPatternIdx(idx)}
                    >
                      {pat.name}
                    </Button>
                  ))}
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                      <strong style={{ fontSize: '13px', color: '#3A9B9F' }}>{activePattern.name}</strong>
                      <Badge variant="outline">{activePattern.paper}</Badge>
                    </Flex>

                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '10px' }}>
                      {activePattern.mechanism}
                    </p>

                    <div style={{ fontSize: '11px', color: '#3A9B9F' }}>
                      🎯 <strong>When to Use:</strong> {activePattern.whenToUse}
                    </div>
                  </Card>

                  <Card style={{ padding: '16px', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '6px' }}>
                      EXEMPLAR PROMPT FORMAT:
                    </div>
                    <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '11px', color: '#3A9B9F', whiteSpace: 'pre-wrap' }}>
                      {activePattern.samplePrompt}
                    </pre>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: SYSTEM PROMPT BLUEPRINT ─── */}
        {activeSubTab === 'architecture' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🏛️ Enterprise System Prompt Architectural Anatomy</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Production system prompts require a rigorous four-layer hierarchy to prevent prompt injection and maintain predictable output structure.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', sm: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {PROMPT_STRUCTURE_COMPONENTS.map((comp, idx) => (
                    <Card key={idx} style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderTop: '3px solid #5EC4C8' }}>
                      <strong style={{ fontSize: '12px', color: '#3A9B9F', display: 'block', marginBottom: '4px' }}>
                        {comp.section}
                      </strong>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '0 0 8px 0' }}>
                        {comp.purpose}
                      </p>
                      <div style={{ background: '#090d16', padding: '8px 10px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: '#3A9B9F' }}>
                        {comp.example}
                      </div>
                    </Card>
                  ))}
                </Grid>

                <Callout type="info">
                  <strong>XML Delimiter Standard:</strong> Always wrap user-provided context in explicit XML delimiters like <code>&lt;context&gt; ... &lt;/context&gt;</code>. Frontier models (Claude, GPT-4o) are heavily fine-tuned to recognize XML boundaries and reject adversarial prompt injection attacks hiding inside the data.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: INTERACTIVE PROMPT BUILDER ─── */}
        {activeSubTab === 'builder' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚡ Real-Time Structured Prompt Composer</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Adjust each layer of the prompt hierarchy and watch the final production-ready prompt assemble in real time.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Stack gap={3}>
                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                        1. System Role / Persona:
                      </label>
                      <input
                        type="text"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '8px', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                        2. Bounded Context Data:
                      </label>
                      <textarea
                        rows={3}
                        value={contextData}
                        onChange={e => setContextData(e.target.value)}
                        style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '8px', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                        3. Task Instruction:
                      </label>
                      <input
                        type="text"
                        value={taskInstruction}
                        onChange={e => setTaskInstruction(e.target.value)}
                        style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '8px', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                        4. Output Schema / Format:
                      </label>
                      <input
                        type="text"
                        value={outputFormat}
                        onChange={e => setOutputFormat(e.target.value)}
                        style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '8px', fontSize: '12px' }}
                      />
                    </div>
                  </Stack>

                  <Card style={{ padding: '16px', background: '#090d16', border: '1px solid #5EC4C8' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '12px', color: '#3A9B9F' }}>ASSEMBLED PRODUCTION PROMPT:</strong>
                      <Badge variant="subtle" style={{ color: '#3A9B9F', background: 'rgba(16,185,129,0.15)' }}>
                        READY TO COPY
                      </Badge>
                    </Flex>
                    <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '11px', color: '#3A9B9F', whiteSpace: 'pre-wrap', maxHeight: '280px', overflowY: 'auto' }}>
                      {assembledPrompt}
                    </pre>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: DSPY CODE ─── */}
        {activeSubTab === 'dspy' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛠️ DSPy Declarative Prompt Programming</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Stop hand-tuning brittle prompt strings. DSPy compiles declarative python signatures into optimized few-shot exemplars and reasoning chains automatically.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_DSPY_PROMPT_SCRIPT} />

                <Callout type="success">
                  <strong>The Shift to Programmatic Prompts:</strong> In 2026, leading engineering teams treat prompts as compiled code: defining inputs, outputs, and validation metrics (<code>dspy.Assert</code>), allowing automated teleprompters to discover optimal phrasing across different foundation models.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 5: CoT vs ToT DEEP DIVE (ML MASTERY) ─── */}
        {activeSubTab === 'cot_tot' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🌳 Chain-of-Thought vs Tree-of-Thoughts — When to Use Which</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Based on ML Mastery guide: CoT is linear, cheap, and great for deduction. ToT is branching, expensive, and shines on puzzles/planning. Hybrid patterns give you the best of both.
                  </p>
                </div>

                {/* Comparison Table */}
                <div>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--ds-color-text-primary)' }}>⚖️ Head-to-Head Comparison</h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}>
                          <th style={{ textAlign: 'left', padding: '8px' }}>Dimension</th>
                          <th style={{ textAlign: 'left', padding: '8px' }}>Chain-of-Thought (CoT)</th>
                          <th style={{ textAlign: 'left', padding: '8px' }}>Tree-of-Thoughts (ToT)</th>
                          <th style={{ textAlign: 'left', padding: '8px' }}>Winner</th>
                        </tr>
                      </thead>
                      <tbody>
                        {COT_VS_TOT_COMPARISON.map((c, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                            <td style={{ padding: '8px', color: '#3A9B9F', fontWeight: 'bold' }}>{c.dimension}</td>
                            <td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{c.cot}</td>
                            <td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{c.tot}</td>
                            <td style={{ padding: '8px', color: '#3A9B9F', fontWeight: 'bold' }}>{c.winner}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Hybrid Patterns */}
                <div style={{ marginTop: 'var(--ds-space-4)' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--ds-color-text-primary)' }}>🔀 Hybrid Patterns — Best of Both Worlds</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--ds-space-3)' }}>
                    {COT_TOT_HYBRID_PATTERNS.map((h, i) => (
                      <Card key={i} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}>
                        <div style={{ fontSize: '12px', color: '#3A9B9F', fontWeight: 'bold', marginBottom: '4px' }}>{h.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginBottom: '4px' }}>{h.description}</div>
                        <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>✓ {h.whenToUse}</div>
                        <div style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold' }}>Cost reduction: {h.costReduction}</div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Agentic Reasoning Patterns */}
                <div style={{ marginTop: 'var(--ds-space-4)' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--ds-color-text-primary)' }}>🤖 Agentic Reasoning Patterns (CoT/ToT in Agent Loops)</h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}>
                          <th style={{ textAlign: 'left', padding: '8px' }}>Pattern</th>
                          <th style={{ textAlign: 'left', padding: '8px' }}>Trace</th>
                          <th style={{ textAlign: 'left', padding: '8px' }}>Use Case</th>
                          <th style={{ textAlign: 'center', padding: '8px' }}>Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {AGENTIC_REASONING_PATTERNS.map((a, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                            <td style={{ padding: '8px', color: '#3A9B9F', fontWeight: 'bold' }}>{a.pattern}</td>
                            <td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)', fontFamily: 'monospace', fontSize: '10px' }}>{a.trace}</td>
                            <td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{a.useCase}</td>
                            <td style={{ padding: '8px', textAlign: 'center', color: 'var(--ds-color-text-tertiary)' }}>{a.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Hybrid Implementation */}
                <div style={{ marginTop: 'var(--ds-space-4)' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--ds-color-text-primary)' }}>🛠️ Progressive Deepening: CoT → ToT on Low Confidence</h4>
                  <CodeBlock language="python" code={PYTHON_COT_TOT_HYBRID} />
                  <Callout type="success">
                    <strong>Key insight:</strong> Default to CoT (1 call). Only escalate to ToT when self-evaluation confidence &lt; threshold. 
                    This adaptive compute allocation means 80%+ of tasks use cheap CoT; ToT budget spent only where it matters.
                  </Callout>
                </div>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
