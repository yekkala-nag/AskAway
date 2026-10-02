import React, { useState, useEffect } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  THE_EIGHT_TYPED_TOOLS,
  BENCHMARK_ABLATION_DATA,
  ESCALATION_SIGNALS,
  PYTHON_BOUNDED_LOOP_SCRIPT
} from './agentGateEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function TypedAgentGateTab() {
  const [activeSubTab, setActiveSubTab] = useState('tools'); 
  // 'tools' | 'loop' | 'gate' | 'ablation' | 'code'

  // Tool selector state
  const [selectedToolIdx, setSelectedToolIdx] = useState(0);
  const activeTool = THE_EIGHT_TYPED_TOOLS[selectedToolIdx];

  // Loop simulation animation state
  const [simStep, setSimStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulationEvents = [
    { round: 1, tool: "resolve_entity", args: "{'mention': 'Roof Inspection Rule'}", result: "canonical_id: POLICY_ROOF_2026", tokens: 420 },
    { round: 2, tool: "timeline", args: "{'entity_id': 'POLICY_ROOF_2026'}", result: "Found 3 milestones: Jun 2025 (20yr), Jan 2026 (Memo), Mar 2026 (15yr H3)", tokens: 890 },
    { round: 3, tool: "traverse", args: "{'entity_id': 'POLICY_ROOF_2026', 'hops': 2}", result: "Linked to 14 claim files filed between Jan–Feb 2026", tokens: 1450 },
    { round: 4, tool: "search_evidence", args: "{'query': 'claim file roof age data'}", result: "Extracted property age: Claim #402 (18 years), Claim #415 (16 years)", tokens: 2100 },
    { round: 5, tool: "list_contradictions", args: "{'entity_id': 'POLICY_ROOF_2026'}", result: "No unresolved contradiction logged for roof rule", tokens: 2450 },
    { round: 6, tool: "COMPOSER_GATE", args: "Grounding check & citation verification", result: "PASSED: 2 claims counterfactually flagged under March rule", tokens: 2680 }
  ];

  useEffect(() => {
    let timer;
    if (isSimulating && simStep < simulationEvents.length - 1) {
      timer = setTimeout(() => setSimStep(prev => prev + 1), 1200);
    } else if (simStep >= simulationEvents.length - 1) {
      setIsSimulating(false);
    }
    return () => clearTimeout(timer);
  }, [isSimulating, simStep]);

  const handleStartSim = () => {
    setSimStep(0);
    setIsSimulating(true);
  };

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="agents_frameworks"
        moduleLabel="Agent Systems & Frameworks [Governed Agentic Architecture]"
        title="Typed Tools, Hard Bounds & The Downstream Gate"
        description="Stop giving your AI agent a vague search box and hoping for the best. Discover the 8-tool semantic contract, the 80-line bounded execution loop, non-negotiable downstream composer gates that enforce contradiction refusal, and the production Escalation Architecture."
        metrics={[
          { label: 'Tool Contract', value: '8 Read-Only Semantic Tools' },
          { label: 'Outer Bounds', value: 'MAX 8 Rounds + Token Budget' },
          { label: 'Governance Gate', value: 'External Downstream Composer' },
          { label: 'Optimal Topology', value: 'Escalation Architecture' }
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
            { id: 'tools', icon: '🧰', label: '1. The 8 Typed Tools Contract', desc: 'Semantic read-only tool surface' },
            { id: 'loop', icon: '⚡', label: '2. 80-Line Bounded Loop', desc: 'Outer limits & trace state machine' },
            { id: 'gate', icon: '🛡️', label: '3. Agency vs The Gate', desc: 'Composer refusal & contradiction test' },
            { id: 'ablation', icon: '📊', label: '4. Ablation & Escalation', desc: '3-way benchmark & routing lanes' },
            { id: 'code', icon: '🛠️', label: '5. Production Python & MCP', desc: 'Runnable bounded loop & composer' }
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

        {/* ─── SUBTAB 1: THE 8 TYPED TOOLS CONTRACT ─── */}
        {activeSubTab === 'tools' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧰 The 8-Tool Semantic Contract (Read-Only & Host-Agnostic)</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Tools must expose what the knowledge layer <em>means</em> (evidence, concepts, graph topology, temporal evolution, disagreement) rather than database mechanics (indices, vector IDs, SQL syntax).
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {THE_EIGHT_TYPED_TOOLS.map((t, idx) => (
                    <Button
                      key={t.name}
                      variant={selectedToolIdx === idx ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSelectedToolIdx(idx)}
                    >
                      {t.name}()
                    </Button>
                  ))}
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '14px', color: '#3A9B9F', fontFamily: 'monospace' }}>
                        {activeTool.name}
                      </strong>
                      <Badge variant="outline">{activeTool.domain}</Badge>
                    </Flex>

                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>FUNCTION SIGNATURE:</div>
                    <div style={{ background: '#090d16', padding: '8px 10px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#3A9B9F', marginBottom: '8px' }}>
                      {activeTool.signature}
                    </div>

                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '8px' }}>
                      {activeTool.description}
                    </p>

                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>EXEMPLAR INVOCATION:</div>
                    <div style={{ background: '#090d16', padding: '6px 8px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#F5A623' }}>
                      {activeTool.exampleCall}
                    </div>
                  </Card>

                  <Card style={{ padding: '16px', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <strong style={{ fontSize: '12px', color: '#3A9B9F', display: 'block', marginBottom: '8px' }}>
                      STANDARDIZED ENVELOPE RETURN SCHEMA:
                    </strong>
                    <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '11px', color: '#3A9B9F', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
{`{
  "results": [...],           // Typed payload: EvidenceChunk | Concept | GraphPath
  "sources": ["DOC_2026_01"], // Source document identifiers
  "validity_window": {
    "effective_from": "2026-03-01",
    "effective_to": null
  },
  "insufficient": false       // True when layer has nothing (prevents hallucination)
}`}
                    </pre>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '8px' }}>
                      💡 <strong>The Insufficient Flag:</strong> An agent that cannot be told "there is nothing here" will fill the silence with hallucinated confidence.
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: 80-LINE BOUNDED LOOP ─── */}
        {activeSubTab === 'loop' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚡ The 80-Line Loop & Hard Outer Bounds State Machine</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Cost control by construction. Hard bounds (max 8 rounds, token ceiling, timeout) are enforced strictly <em>outside</em> the model loop.
                  </p>
                </div>

                <Flex justify="space-between" align="center">
                  <Button variant="primary" size="sm" onClick={handleStartSim} disabled={isSimulating}>
                    {isSimulating ? 'Simulating Trace...' : '▶ Run Multi-Hop Investigation Trace'}
                  </Button>
                  <Badge variant="subtle" style={{ color: '#3A9B9F', background: 'rgba(16,185,129,0.15)' }}>
                    Round: {simulationEvents[simStep].round} / 8 | Tokens: {simulationEvents[simStep].tokens} / 6000
                  </Badge>
                </Flex>

                {/* ANIMATED TRACE PROGRESS */}
                <Stack gap={2}>
                  {simulationEvents.map((evt, idx) => {
                    const isPassed = idx <= simStep;
                    const isCurrent = idx === simStep;
                    return (
                      <div
                        key={idx}
                        style={{
                          padding: '10px 14px',
                          background: isCurrent ? 'rgba(56, 189, 248, 0.12)' : isPassed ? '#090d16' : 'rgba(255,255,255,0.02)',
                          border: isCurrent ? '1px solid #5EC4C8' : '1px solid rgba(255,255,255,0.05)',
                          borderRadius: '6px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div>
                          <span style={{ fontFamily: 'monospace', color: isPassed ? '#5EC4C8' : 'var(--ds-color-text-tertiary)', fontWeight: 'bold', marginRight: '8px' }}>
                            [Round {evt.round}]
                          </span>
                          <span style={{ fontFamily: 'monospace', color: isCurrent ? '#5EC4C8' : 'white', fontWeight: isCurrent ? 'bold' : 'normal' }}>
                            {evt.tool}()
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginLeft: '10px' }}>
                            Args: {evt.args}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', fontFamily: 'monospace', color: isPassed ? '#5EC4C8' : 'var(--ds-color-text-tertiary)' }}>
                          {isPassed ? evt.result : 'Pending...'}
                        </div>
                      </div>
                    );
                  })}
                </Stack>

                <Callout type="info">
                  <strong>First-Class Trace Output:</strong> Alongside the final answer, every run returns the complete sequence of tool calls: name, arguments, result digest, tokens, and milliseconds. The trace turns "the agent reasoned" from an unverifiable claim into an auditable machine log.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: AGENCY VS THE GATE ─── */}
        {activeSubTab === 'gate' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛡️ Agency vs The Gate: Governance That Survives Agency</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Why inside-the-loop governance fails: LLMs have an innate bias to be helpful and resolve tension, glossing over organizational contradictions.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '16px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.3)' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '13px', color: '#ef4444' }}>❌ NAIVE UNGATED AGENT</strong>
                      <Badge variant="subtle" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.2)' }}>Fails Governance</Badge>
                    </Flex>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '8px' }}>
                      When asked about a policy with an open contradiction (e.g. Trace & Access water damage limits), the naive agent picks whichever source was more recent or persuasive, presenting a false certainty.
                    </p>
                    <div style={{ background: '#090d16', padding: '10px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#f87171' }}>
                      "Under standard underwriting, Trace & Access is capped at $5,000 as per the 2025 memo." (HALLUCINATED CONSENSUS)
                    </div>
                  </Card>

                  <Card style={{ padding: '16px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '13px', color: '#3A9B9F' }}>✅ DOWNSTREAM COMPOSER GATE</strong>
                      <Badge variant="subtle" style={{ color: '#3A9B9F', background: 'rgba(16,185,129,0.2)' }}>Refusal Enforced</Badge>
                    </Flex>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '8px' }}>
                      The composer performs its <em>own independent lookup</em> of open contradictions for all touched entities downstream. If a disagreement exists, it strictly enforces the "both positions + no choice" presentation.
                    </p>
                    <div style={{ background: '#090d16', padding: '10px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#34d399' }}>
                      "The organization has an unresolved contradiction: Underwriting Memo 2025 states $5k cap, while Endorsement H3-2026 states full coverage. Neither policy supersedes the other."
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: ABLATION & ESCALATION ARCHITECTURE ─── */}
        {activeSubTab === 'ablation' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📊 3-Way Ablation Benchmark & The Escalation Architecture</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Empirical validation across single-hop lookups, multi-hop counterfactual reasoning, and contradiction refusals.
                  </p>
                </div>

                {/* BENCHMARK TABLE */}
                <div style={{ overflowX: 'auto', background: '#090d16', padding: '14px', borderRadius: '8px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'monospace' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ textAlign: 'left', padding: '8px', color: 'var(--ds-color-text-tertiary)' }}>Evaluation Metric</th>
                        <th style={{ textAlign: 'center', padding: '8px', color: '#3A9B9F' }}>System A (Fixed Fused)</th>
                        <th style={{ textAlign: 'center', padding: '8px', color: '#ef4444' }}>System B (Search-Box)</th>
                        <th style={{ textAlign: 'center', padding: '8px', color: '#3A9B9F' }}>System C (8-Tool Agent)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {BENCHMARK_ABLATION_DATA.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{row.metric}</td>
                          <td style={{ padding: '8px', textAlign: 'center', color: '#3A9B9F' }}>{row.systemA_fixed}</td>
                          <td style={{ padding: '8px', textAlign: 'center', color: '#ef4444' }}>{row.systemB_searchOnly}</td>
                          <td style={{ padding: '8px', textAlign: 'center', color: '#3A9B9F' }}>{row.systemC_typedAgent}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ESCALATION SIGNALS */}
                <div>
                  <strong style={{ fontSize: '13px', color: 'white', display: 'block', marginBottom: '8px' }}>
                    Production Escalation Signals (When to Run the Expensive Agent):
                  </strong>
                  <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                    {ESCALATION_SIGNALS.map((sig, idx) => (
                      <Card key={idx} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #F5A623' }}>
                        <strong style={{ fontSize: '12px', color: '#F5A623' }}>{sig.signal}</strong>
                        <p style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', margin: '4px 0' }}>
                          Detector: {sig.detector}
                        </p>
                        <div style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold' }}>
                          Action: {sig.action}
                        </div>
                      </Card>
                    ))}
                  </Grid>
                </div>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 5: PRODUCTION PYTHON CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛠️ Production 80-Line Bounded Loop & Composer Gate</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Copy-pasteable reference architecture for a governed agentic loop with hard bounds and external refusal enforcement.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_BOUNDED_LOOP_SCRIPT} />

                <Callout type="success">
                  <strong>Model Independence:</strong> Because the 8-tool surface is a clean typed contract (compatible with MCP and OpenAI function calling), you can switch models (GPT-4o, Claude 3.5, Gemini 2.0, DeepSeek-V3) with a single config dial without rewriting loop or tool plumbing!
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
