import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Stepper } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { Panel, GlassCard } from '../components/ui/CleanInfographics.jsx';
import {
  EXTRACTION_SCENARIOS,
  FSM_DECODING_STEPS,
  PARADIGM_COMPARISON
} from './structuredEngine.js';

const { Container, Section, Grid, Flex, Stack } = Primitives;

/** Native recreation: three paradigms for schema-valid LLM outputs. */
function StructuredOutputsPanel() {
  const pts = { fontSize: 12.5, color: '#CBD5E1', lineHeight: 1.65, margin: '6px 0 0', paddingLeft: 16 };
  const flow = { fontSize: 12, color: '#7FE3DC', marginTop: 8, lineHeight: 1.6 };
  return (
    <Panel
      title="Generating Structured Outputs — 3 Core Paradigms"
      sub="From retry loops to server-side enforcement to mathematically guaranteed constrained decoding."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
        <GlassCard color="#6A9BD8" icon="refresh" title="1. Prompt & Re-prompting">
          <div style={flow}>Input → LLM + JSON instructions → validation → parsed output; retry on parse errors.</div>
          <ul style={pts}>
            <li>Simple to implement</li>
            <li>Prone to hallucinations &amp; structural errors</li>
            <li>Multiple round trips; inconsistent results</li>
          </ul>
        </GlassCard>
        <GlassCard color="#E8C558" icon="shield" title="2. Provider Enforcement">
          <div style={flow}>Input → LLM + defined JSON schema; server-side grammar validated during generation.</div>
          <ul style={pts}>
            <li>Needs tuning or proprietary hooks</li>
            <li>Capability-dependent; fewer errors</li>
            <li>Black-box implementation</li>
          </ul>
        </GlassCard>
        <GlassCard color="#34D399" icon="cpu" title="3. Constrained Decoding" badge="100% valid">
          <div style={flow}>Schema → compiler → deterministic finite automaton; logit masking zeroes invalid tokens.</div>
          <ul style={pts}>
            <li>Guaranteed structural validity</li>
            <li>Open-weights compatible; single pass</li>
            <li>No token-level hallucinations</li>
          </ul>
        </GlassCard>
      </div>
    </Panel>
  );
}

export default function StructuredOutputsTab() {
  const [activeSubTab, setActiveSubTab] = useState('paradigms'); // 'paradigms' | 'fsm' | 'workbench' | 'benchmark' | 'code'
  const [activeFsmStepIdx, setActiveFsmStepIdx] = useState(0);
  const [selectedScenarioId, setSelectedScenarioId] = useState('receipt_extraction');
  const [activeMethod, setActiveMethod] = useState('constrainedDecoding'); // 'prompting' | 'apiProvider' | 'constrainedDecoding'

  const activeScenario = EXTRACTION_SCENARIOS.find(s => s.id === selectedScenarioId) || EXTRACTION_SCENARIOS[0];
  const activeFsmStep = FSM_DECODING_STEPS[activeFsmStepIdx] || FSM_DECODING_STEPS[0];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="structured"
        moduleLabel="Enterprise LLM Engineering [Vol.1 #18]"
        title="Generating Structured Outputs from LLMs"
        description="Transforming LLMs from chaotic chatbot outputs into reliable software components. Explore the 3 foundational paradigms: Prompt & Re-prompting with Pydantic, Provider API Enforcement, and Constrained Decoding via Finite State Machine (FSM) logit masking for 100% mathematical schema compliance."
        metrics={[
          { label: 'Core Paradigms', value: '3 Methods' },
          { label: 'FSM Syntax Guarantee', value: '100% Mathematical' },
          { label: 'Prompt Retry Waste', value: '-65% Latency' },
          { label: 'Open-Weights Support', value: 'Native (Outlines)' }
        ]}
      />

      <Container size="wide">
        {/* ARCHITECTURAL INFOGRAPHIC CARD */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <StructuredOutputsPanel />
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
            { id: 'paradigms', icon: '🏛️', label: '3 Core Paradigms', desc: 'Architecture & Tradeoffs' },
            { id: 'fsm', icon: '⚙️', label: 'FSM Logit Masking Simulator', desc: 'Step-by-step token constraint' },
            { id: 'workbench', icon: '🧪', label: 'Extraction Workbench', desc: 'Receipts & Medical schemas' },
            { id: 'benchmark', icon: '📊', label: 'Reliability & Cost Benchmark', desc: 'Error rate comparison' },
            { id: 'code', icon: '💻', label: 'Production Python Code', desc: 'Outlines, Instructor & OpenAI' }
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

        {/* ─── 1. 3 CORE PARADIGMS ARCHITECTURE ─── */}
        {activeSubTab === 'paradigms' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🏛️ The 3 Paradigms for Structured Output Generation</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Choosing the right paradigm depends on your runtime environment, API lock-in tolerance, and mathematical reliability requirements.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="var(--ds-space-4)">
                  {/* PARADIGM 1 */}
                  <Card style={{ padding: 'var(--ds-space-4)', borderTop: '4px solid #ef4444' }}>
                    <Stack gap={2}>
                      <Badge variant="danger">1. Prompting & Re-prompting</Badge>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Instructor / Pydantic / LangChain</strong>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                        Instructs LLM to return JSON in the system prompt. If validation fails on client side, executes a retry loop with the error trace.
                      </p>
                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: '#ef4444', fontWeight: 'bold' }}>
                        Flaw: 15–28% first-pass syntax failure rate on complex nested schemas.
                      </div>
                    </Stack>
                  </Card>

                  {/* PARADIGM 2 */}
                  <Card style={{ padding: 'var(--ds-space-4)', borderTop: '4px solid #5EC4C8' }}>
                    <Stack gap={2}>
                      <Badge variant="primary">2. API Provider Enforcement</Badge>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>OpenAI Strict Mode & Tool Calling</strong>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                        Provider applies server-side grammar constraints during generation. Guarantees schema adherence on hosted endpoints.
                      </p>
                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: '#3A9B9F', fontWeight: 'bold' }}>
                        Tradeoff: Vendor lock-in; unavailable on self-hosted open-weights models.
                      </div>
                    </Stack>
                  </Card>

                  {/* PARADIGM 3 */}
                  <Card style={{ padding: 'var(--ds-space-4)', borderTop: '4px solid #5EC4C8', background: 'rgba(16,185,129,0.04)' }}>
                    <Stack gap={2}>
                      <Badge variant="success">3. Constrained Decoding with FSM</Badge>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Outlines / SGLang / Guidance / llama.cpp</strong>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                        Compiles JSON Schema into a Deterministic Finite Automaton (DFA). Masks invalid token logits to -inf at every generation step.
                      </p>
                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: '#3A9B9F', fontWeight: 'bold' }}>
                        Advantage: 100% Mathematical guarantee, zero retries, native open-weights.
                      </div>
                    </Stack>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 2. FSM LOGIT MASKING SIMULATOR ─── */}
        {activeSubTab === 'fsm' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>⚙️ Step-by-Step FSM Logit Masking Simulator</h3>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                      Observe how the Outlines / SGLang compiler masks 128,000+ invalid vocabulary tokens to <code style={{ fontFamily: 'var(--ds-font-family-mono)' }}>-inf</code> at each generation step.
                    </p>
                  </div>
                  <Flex gap={2}>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={activeFsmStepIdx === 0}
                      onClick={() => setActiveFsmStepIdx(s => Math.max(0, s - 1))}
                    >
                      ← Previous Token Step
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={activeFsmStepIdx >= FSM_DECODING_STEPS.length - 1}
                      onClick={() => setActiveFsmStepIdx(s => Math.min(FSM_DECODING_STEPS.length - 1, s + 1))}
                    >
                      Next Token Step →
                    </Button>
                  </Flex>
                </Flex>

                <Stepper
                  activeStep={activeFsmStepIdx}
                  onStepClick={setActiveFsmStepIdx}
                  steps={FSM_DECODING_STEPS.map((s, idx) => ({
                    label: `Token ${s.step}`,
                    detail: s.fsmState,
                    status: idx < activeFsmStepIdx ? 'complete' : idx === activeFsmStepIdx ? 'current' : 'upcoming'
                  }))}
                />

                <Grid columns={2} gap={4}>
                  {/* LEFT: FSM STATE & LOGIT MASKING */}
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                    <Stack gap={3}>
                      <Flex justify="space-between" align="center">
                        <Badge variant="primary">FSM State: {activeFsmStep.fsmState}</Badge>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', color: '#3A9B9F', fontWeight: 'bold' }}>
                          Step #{activeFsmStep.step} of 5
                        </span>
                      </Flex>

                      <div>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>ALLOWED TOKENS (UNMASKED LOGITS &gt; 0):</span>
                        <Flex gap={1} style={{ marginTop: '4px', flexWrap: 'wrap' }}>
                          {activeFsmStep.allowedTokens.map((tok, i) => (
                            <Badge key={i} variant="success" style={{ fontFamily: 'var(--ds-font-family-mono)' }}>{tok}</Badge>
                          ))}
                        </Flex>
                      </div>

                      <div>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>MASKED TOKENS (LOGITS FORCED TO -INF):</span>
                        <Flex gap={1} style={{ marginTop: '4px', flexWrap: 'wrap' }}>
                          {activeFsmStep.maskedTokensSample.map((tok, i) => (
                            <Badge key={i} variant="danger" style={{ fontFamily: 'var(--ds-font-family-mono)', opacity: 0.7 }}>{tok}</Badge>
                          ))}
                          <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', alignSelf: 'center' }}>+127,995 more...</span>
                        </Flex>
                      </div>

                      <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '8px 10px', borderRadius: '6px', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', lineHeight: 1.4 }}>
                        <strong>FSM Rule:</strong> {activeFsmStep.explanation}
                      </div>
                    </Stack>
                  </Card>

                  {/* RIGHT: GENERATED STREAM SO FAR */}
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <Stack gap={3}>
                      <Flex justify="space-between" align="center">
                        <Badge variant="success">Synthesized Schema Stream</Badge>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', color: '#3A9B9F', fontWeight: 'bold' }}>
                          Mathematical Validity: 100%
                        </span>
                      </Flex>

                      <div>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>OUTPUT BUFFER:</span>
                        <pre style={{ margin: '4px 0 0 0', padding: '10px', background: 'var(--ds-color-bg-surface)', borderRadius: '6px', fontSize: 'var(--ds-font-size-bodySm)', fontFamily: 'var(--ds-font-family-mono)', color: 'var(--ds-color-text-primary)' }}>
                          {activeFsmStep.generatedSoFar}<span style={{ background: '#5EC4C8', color: 'white', padding: '1px 4px', borderRadius: '3px' }}>{activeFsmStep.chosenToken}</span>
                        </pre>
                      </div>
                    </Stack>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 3. EXTRACTION WORKBENCH ─── */}
        {activeSubTab === 'workbench' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>🧪 Interactive Extraction Workbench</h3>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                      Test complex enterprise schema extraction across Prompting, OpenAI Strict Mode, and Constrained Decoding.
                    </p>
                  </div>
                  <Flex gap={2}>
                    {EXTRACTION_SCENARIOS.map(sc => (
                      <button
                        key={sc.id}
                        onClick={() => setSelectedScenarioId(sc.id)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 'var(--ds-radius-md)',
                          border: `1px solid ${selectedScenarioId === sc.id ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)'}`,
                          background: selectedScenarioId === sc.id ? 'var(--ds-color-module-foundations-light)' : 'var(--ds-color-bg-surface)',
                          color: selectedScenarioId === sc.id ? 'var(--ds-color-module-foundations-dark)' : 'var(--ds-color-text-primary)',
                          cursor: 'pointer',
                          fontWeight: selectedScenarioId === sc.id ? 'bold' : 'normal',
                          fontSize: 'var(--ds-font-size-bodySm)'
                        }}
                      >
                        {sc.title}
                      </button>
                    ))}
                  </Flex>
                </Flex>

                <Grid columns={{ base: '1fr', lg: '1fr 1fr' }} gap="var(--ds-space-4)">
                  {/* RAW UNSTRUCTURED INPUT */}
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                    <Stack gap={2}>
                      <Badge variant="subtle">Raw Unstructured Text Input</Badge>
                      <pre style={{ margin: 0, padding: '10px', background: 'var(--ds-color-bg-canvas)', borderRadius: '6px', fontSize: 'var(--ds-font-size-caption)', whiteSpace: 'pre-wrap', color: 'var(--ds-color-text-primary)' }}>
                        {activeScenario.inputData}
                      </pre>
                    </Stack>
                  </Card>

                  {/* TARGET JSON SCHEMA */}
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                    <Stack gap={2}>
                      <Badge variant="info">Target JSON Schema Contract</Badge>
                      <CodeBlock language="json" code={JSON.stringify(activeScenario.targetSchema, null, 2)} />
                    </Stack>
                  </Card>
                </Grid>

                {/* METHOD SELECTOR */}
                <div>
                  <Flex gap={2} style={{ marginBottom: '8px' }}>
                    {[
                      { id: 'prompting', label: '1. Prompting & Re-prompting', badge: 'Flaky / Retries' },
                      { id: 'apiProvider', label: '2. API Strict Enforcement', badge: 'Proprietary' },
                      { id: 'constrainedDecoding', label: '3. Constrained Decoding (FSM)', badge: '100% Valid' }
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => setActiveMethod(m.id)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 'var(--ds-radius-md)',
                          border: `1px solid ${activeMethod === m.id ? '#3A9B9F' : 'var(--ds-color-border-subtle)'}`,
                          background: activeMethod === m.id ? 'var(--ds-color-bg-surfaceHover)' : 'var(--ds-color-bg-surface)',
                          color: activeMethod === m.id ? '#3A9B9F' : 'var(--ds-color-text-primary)',
                          cursor: 'pointer',
                          fontWeight: activeMethod === m.id ? 'bold' : 'normal'
                        }}
                      >
                        {m.label} ({m.badge})
                      </button>
                    ))}
                  </Flex>

                  {/* METHOD RESULT CARD */}
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)', borderTop: '3px solid #3A9B9F' }}>
                    <Stack gap={2}>
                      <Flex justify="space-between" align="center">
                        <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Extraction Result Payload:</strong>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                          Latency: <strong>{activeScenario.results[activeMethod].latencyMs}ms</strong> | Retries: <strong>{activeScenario.results[activeMethod].retriesNeeded}</strong>
                        </span>
                      </Flex>

                      {activeScenario.results[activeMethod].error && (
                        <Callout type="danger" title="Parse / Validation Error Triggered:">
                          {activeScenario.results[activeMethod].error}
                        </Callout>
                      )}

                      <CodeBlock
                        language="json"
                        code={typeof activeScenario.results[activeMethod].structuredJson === 'object'
                          ? JSON.stringify(activeScenario.results[activeMethod].structuredJson, null, 2)
                          : activeScenario.results[activeMethod].rawOutput}
                      />
                    </Stack>
                  </Card>
                </div>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 4. RELIABILITY & COST BENCHMARK ─── */}
        {activeSubTab === 'benchmark' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📊 Reliability, Latency & Portability Matrix</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Detailed architectural comparison across the 3 structured output paradigms.
                  </p>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    <thead>
                      <tr style={{ background: 'var(--ds-color-bg-surface)', borderBottom: '2px solid var(--ds-color-border-default)' }}>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Paradigm</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Mechanism</th>
                        <th style={{ padding: '10px', textAlign: 'center' }}>Syntax Guarantee</th>
                        <th style={{ padding: '10px', textAlign: 'center' }}>Latency & Cost</th>
                        <th style={{ padding: '10px', textAlign: 'center' }}>Open-Weights Support</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PARADIGM_COMPARISON.map((p, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)', background: idx === 2 ? 'rgba(16,185,129,0.04)' : 'transparent' }}>
                          <td style={{ padding: '10px', fontWeight: 'bold' }}>{p.paradigm}</td>
                          <td style={{ padding: '10px', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>{p.mechanism}</td>
                          <td style={{ padding: '10px', textAlign: 'center' }}>{p.syntaxGuarantee}</td>
                          <td style={{ padding: '10px', textAlign: 'center', fontSize: 'var(--ds-font-size-caption)' }}>{p.latencyCost}</td>
                          <td style={{ padding: '10px', textAlign: 'center' }}>{p.localModelSupport}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                  <h3 style={{ margin: 0 }}>💻 Production Python Implementations</h3>
                  <Badge variant="subtle">Outlines / Instructor / OpenAI Strict</Badge>
                </Flex>

                <CodeBlock
                  language="python"
                  code={`# 1. CONSTRAINED DECODING VIA OUTLINES (100% Mathematical Guarantee)
import outlines
from pydantic import BaseModel

class ReceiptExtraction(BaseModel):
    vendor: str
    total: float
    items_count: int

# Compiles JSON schema into a Deterministic Finite Automaton (DFA)
model = outlines.models.transformers("mistralai/Mistral-7B-Instruct-v0.2")
generator = outlines.generate.json(model, ReceiptExtraction)

# Zero possibility of syntax or type errors
result = generator("ACME Supermarket Total: $28.40 (3 items)")
print(result.vendor, result.total)

# -------------------------------------------------------------
# 2. OPENAI STRICT JSON SCHEMA MODE
from openai import OpenAI
client = OpenAI()

response = client.beta.chat.completions.parse(
    model="gpt-4o-2024-08-06",
    messages=[{"role": "user", "content": "Extract receipt data..."}],
    response_format=ReceiptExtraction,
)
print(response.choices[0].message.parsed)

# -------------------------------------------------------------
# 3. INSTRUCTOR (PROMPTING & RE-PROMPTING WITH PYDANTIC)
import instructor
client = instructor.from_openai(OpenAI())

receipt = client.chat.completions.create(
    model="gpt-4o-mini",
    response_model=ReceiptExtraction,
    max_retries=2,  # Auto-reprompts on validation errors
    messages=[{"role": "user", "content": "Extract receipt data..."}]
)`}
                />
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
