import { useState, useEffect, useRef, useCallback } from 'react';
import { CodeBlock } from './Content.jsx';
import { Container, Section, Grid, Flex, Stack } from '../layout/Primitives.jsx';
import { Card, Badge, Button, Callout } from './Core.jsx';
import { getModuleColors } from '../../design-system/tokens.js';
import { GATE_TRIGGERS, DECISION_NODES, STYLE_MATRIX, TOKEN_MULTIPLIER_PARALLEL_CREW, evaluateGate, estimateTokenCost, recommendStyle } from '../../frameworkCompare/decisionEngine.js';

// Palette: TEAL #3A9B9F / TEAL_DARK #1A6B6E / PURPLE #5B4B8A / RED #B4553A / AMBER #B9821F
const DECISION_ACCENT = '#3A9B9F';
const DECISION_ACCENT_DARK = '#1A6B6E';

// ============================================================================
// DECISION TREE — interactive gate + 3 nodes -> generic style recommendation
// ============================================================================
function DecisionTreeSection() {
  const [gateChecked, setGateChecked] = useState({});
  const [mentalModel, setMentalModel] = useState('states');
  const [durability, setDurability] = useState('ephemeral');
  const [ecosystem, setEcosystem] = useState('flexible');
  const [baseTokens, setBaseTokens] = useState(1000);

  const toggleGate = (id) => {
    setGateChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const activeIds = GATE_TRIGGERS.filter(t => gateChecked[t.id]).map(t => t.id);
  const gate = evaluateGate(activeIds);
  const rec = recommendStyle({ mentalModel, durability, ecosystem });
  const cost = estimateTokenCost(baseTokens, TOKEN_MULTIPLIER_PARALLEL_CREW);

  const setNodeValue = (nodeId, value) => {
    if (nodeId === 'mental-model') setMentalModel(value);
    else if (nodeId === 'durability') setDurability(value);
    else if (nodeId === 'ecosystem') setEcosystem(value);
  };
  const nodeValue = (nodeId) => {
    if (nodeId === 'mental-model') return mentalModel;
    if (nodeId === 'durability') return durability;
    return ecosystem;
  };

  return (
    <Section variant="bordered" style={{ marginBottom: 'var(--ds-space-6)', borderColor: 'rgba(58, 155, 159, 0.35)' }}>
      <Section.Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ fontSize: 'var(--ds-font-size-h3)', margin: 0, color: 'var(--ds-color-text-primary)' }}>
            Decision Tree: Single Agent or Multi-Agent?
          </h2>
          <Badge variant="success" size="sm" dot>Interactive</Badge>
        </div>
        <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
          Answer the gate plus three decision nodes to land on one of five generic coordination styles.
        </p>
      </Section.Header>
      <Section.Body>
        {/* Inline SVG decision-tree diagram */}
        <div style={{ background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: 'var(--ds-radius-md)', padding: '12px', marginBottom: 'var(--ds-space-4)', overflowX: 'auto' }}>
          <svg viewBox="0 0 640 190" style={{ width: '100%', minWidth: 520, height: 'auto' }} role="img" aria-label="Decision tree diagram">
            {/* Node 0 diamond */}
            <g>
              <polygon points="90,20 160,60 90,100 20,60" fill="rgba(58,155,159,0.12)" stroke="#3A9B9F" strokeWidth="2" />
              <text x="90" y="55" textAnchor="middle" fill="var(--ds-color-text-primary)" fontSize="11" fontWeight="bold">Node 0: Gate</text>
              <text x="90" y="70" textAnchor="middle" fill="var(--ds-color-text-secondary)" fontSize="9">any of 4 triggers?</text>
            </g>
            {/* Gate branches */}
            <line x1="160" y1="60" x2="220" y2="30" stroke="#B4553A" strokeWidth="1.5" />
            <text x="192" y="38" fill="var(--ds-color-text-tertiary)" fontSize="9">none</text>
            <line x1="160" y1="60" x2="220" y2="95" stroke="#3A9B9F" strokeWidth="1.5" />
            <text x="192" y="90" fill="var(--ds-color-text-tertiary)" fontSize="9">any</text>
            {/* Single-agent terminal */}
            <g>
              <rect x="220" y="12" width="120" height="36" rx="6" fill="rgba(180,85,58,0.12)" stroke="#B4553A" strokeWidth="1.5" />
              <text x="280" y="27" textAnchor="middle" fontSize="10" fontWeight="bold" fill="var(--ds-color-text-primary)">Single agent</text>
              <text x="280" y="40" textAnchor="middle" fontSize="9" fill="var(--ds-color-text-secondary)">minimal style</text>
            </g>
            {/* 3 decision nodes */}
            <g>
              <rect x="220" y="77" width="120" height="36" rx="6" fill="rgba(91,75,138,0.12)" stroke="#5B4B8A" strokeWidth="1.5" />
              <text x="280" y="92" textAnchor="middle" fontSize="10" fontWeight="bold" fill="var(--ds-color-text-primary)">3 decision nodes</text>
              <text x="280" y="105" textAnchor="middle" fontSize="9" fill="var(--ds-color-text-secondary)">model · durability · eco</text>
            </g>
            {/* Fan out to 5 styles */}
            <line x1="340" y1="95" x2="400" y2="20" stroke="#3A9B9F" strokeWidth="1.2" />
            <line x1="340" y1="95" x2="400" y2="48" stroke="#5B4B8A" strokeWidth="1.2" />
            <line x1="340" y1="95" x2="400" y2="76" stroke="#B9821F" strokeWidth="1.2" />
            <line x1="340" y1="95" x2="400" y2="104" stroke="#1A6B6E" strokeWidth="1.2" />
            <line x1="340" y1="95" x2="400" y2="132" stroke="#B4553A" strokeWidth="1.2" />
            {[
              { y: 8, label: 'State machine' },
              { y: 36, label: 'Role-based org chart' },
              { y: 64, label: 'Conversational debate' },
              { y: 92, label: 'Type-safe Python' },
              { y: 120, label: 'Minimal native SDK' }
            ].map((s, i) => (
              <g key={i}>
                <rect x="400" y={s.y} width="220" height="24" rx="5" fill="var(--ds-color-bg-canvas)" stroke="var(--ds-color-border-default)" strokeWidth="1" />
                <text x="510" y={s.y + 16} textAnchor="middle" fontSize="10" fill="var(--ds-color-text-primary)">{s.label}</text>
              </g>
            ))}
            <text x="90" y="130" textAnchor="middle" fontSize="9" fill="var(--ds-color-text-tertiary)">4 gate triggers</text>
            <text x="90" y="143" textAnchor="middle" fontSize="9" fill="var(--ds-color-text-tertiary)">context · parallel · divergent · critic</text>
            <text x="280" y="132" textAnchor="middle" fontSize="9" fill="var(--ds-color-text-tertiary)">cost: parallel crew ≈ 4x tokens</text>
          </svg>
        </div>

        <Grid columns={{ base: '1fr', lg: '1fr 1fr' }} gap="var(--ds-space-4)">
          <div>
            {/* Node-0 gate checkboxes */}
            <h3 style={{ fontSize: '0.95rem', margin: '0 0 8px 0', color: 'var(--ds-color-text-primary)' }}>Node 0 — Do you need multiple agents?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {GATE_TRIGGERS.map(t => (
                <label key={t.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: 'var(--ds-color-bg-surface)', border: gateChecked[t.id] ? '2px solid #3A9B9F' : '1px solid var(--ds-color-border-default)', borderRadius: '8px', padding: '10px 12px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!gateChecked[t.id]} onChange={() => toggleGate(t.id)} style={{ marginTop: 3, accentColor: '#3A9B9F' }} />
                  <span>
                    <span style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', color: 'var(--ds-color-text-primary)' }}>{t.label}</span>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--ds-color-text-secondary)', lineHeight: 1.45 }}>{t.description}</span>
                  </span>
                </label>
              ))}
            </div>
            {/* 3 decision nodes */}
            {DECISION_NODES.map(node => (
              <div key={node.id} style={{ marginBottom: '14px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--ds-color-text-primary)', marginBottom: 2 }}>{node.label}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--ds-color-text-secondary)', marginBottom: 6 }}>{node.question}</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {node.options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setNodeValue(node.id, opt.value)}
                      title={opt.hint}
                      style={{
                        padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700,
                        border: nodeValue(node.id) === opt.value ? '2px solid #1A6B6E' : '1px solid var(--ds-color-border-default)',
                        background: nodeValue(node.id) === opt.value ? 'rgba(26,107,110,0.10)' : 'var(--ds-color-bg-surface)',
                        color: nodeValue(node.id) === opt.value ? '#1A6B6E' : 'var(--ds-color-text-primary)'
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div>
            {/* Recommendation readout */}
            <Card style={{ padding: '16px', borderLeft: '4px solid ' + DECISION_ACCENT, marginBottom: '12px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--ds-color-text-tertiary)', marginBottom: 4 }}>GATE VERDICT</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: gate.needsMultiAgent ? '#1A6B6E' : '#B4553A', marginBottom: 4 }}>
                {gate.needsMultiAgent ? 'Multi-agent justified' : 'Stay single-agent'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--ds-color-text-secondary)' }}>{gate.guidance}</div>
            </Card>
            <Card style={{ padding: '16px', borderLeft: '4px solid ' + DECISION_ACCENT_DARK, marginBottom: '12px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--ds-color-text-tertiary)', marginBottom: 4 }}>RECOMMENDED STYLE</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ds-color-text-primary)', marginBottom: 4 }}>{rec.styleName}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--ds-color-text-secondary)', marginBottom: 8 }}>{rec.rationale}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ds-color-text-primary)', marginBottom: 4 }}><strong>Best fit:</strong> {rec.bestFit}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ds-color-text-primary)' }}><strong>Watch out:</strong> {rec.watchOut}</div>
            </Card>
            <Card style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--ds-color-text-tertiary)', marginBottom: 6 }}>TOKEN COST MODEL</div>
              <label style={{ fontSize: '0.78rem', color: 'var(--ds-color-text-secondary)', display: 'block', marginBottom: 4 }}>
                Single-agent baseline tokens: {baseTokens}
              </label>
              <input type="range" min="200" max="5000" step="100" value={baseTokens} onChange={e => setBaseTokens(Number(e.target.value))} style={{ width: '100%', accentColor: '#3A9B9F' }} />
              <div style={{ fontSize: '0.82rem', color: 'var(--ds-color-text-primary)', marginTop: 8 }}>
                Parallel crew ≈ {cost.multiplier}x → <strong>{cost.totalTokens.toLocaleString()} tokens</strong>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--ds-color-text-secondary)' }}>
                Overhead vs single-agent: +{cost.overheadVsSingle.toLocaleString()} tokens. Each extra agent re-reads shared context.
              </div>
            </Card>
          </div>
        </Grid>
      </Section.Body>
    </Section>
  );
}

// ============================================================================
// FIVE-STYLE MATRIX — style x strength x limitation x best for
// ============================================================================
function FiveStyleMatrixSection() {
  return (
    <Section variant="bordered" style={{ marginBottom: 'var(--ds-space-6)' }}>
      <Section.Header>
        <h2 style={{ fontSize: 'var(--ds-font-size-h3)', margin: 0, color: 'var(--ds-color-text-primary)' }}>
          Five-Style Matrix
        </h2>
        <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
          Compare the five generic coordination styles head to head.
        </p>
      </Section.Header>
      <Section.Body>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', minWidth: 640 }}>
            <thead>
              <tr style={{ background: 'var(--ds-color-bg-canvas)' }}>
                {['Style', 'Strength', 'Limitation', 'Best for'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--ds-color-text-primary)', borderBottom: '2px solid #3A9B9F', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STYLE_MATRIX.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 800, color: s.color, whiteSpace: 'nowrap' }}>{s.name}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--ds-color-text-secondary)', lineHeight: 1.5 }}>{s.strength}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--ds-color-text-secondary)', lineHeight: 1.5 }}>{s.limitation}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--ds-color-text-primary)', lineHeight: 1.5 }}>{s.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '12px' }}>
          <Callout type="info" title="How to read this matrix">
            <span style={{ fontSize: '0.82rem' }}>Start at Node 0. If no trigger fires, stay single-agent. Otherwise pick the row whose strength matches your decision-node answers, and respect its watch-out guardrail.</span>
          </Callout>
        </div>
      </Section.Body>
    </Section>
  );
}

// ============================================================================
// SIMULATION SCENARIO DATA DEFINITIONS
// ============================================================================
const SIMULATION_SCENARIOS = [
  {
    id: 0,
    title: '1. Pipeline vs Loops (Cyclic Flow)',
    badge: 'Execution Model',
    icon: '🔄',
    tagline: 'Unidirectional LCEL Chaining vs Stateful Cyclic Graph Machines',
    lcSummary: 'LangChain processes data sequentially: Prompt → LLM → Parser. Loops require external wrapping scripts.',
    lgSummary: 'LangGraph natively routes nodes back to earlier steps using conditional edges, executing multi-turn agent loops.',
    steps: [
      {
        step: 0,
        name: 'Initialization',
        lcNode: 'prompt',
        lgNode: 'start',
        description: 'User prompt received: "Search latest SEC 10-K and summarize risk factors".',
        lcState: { input: 'Search SEC 10-K', template: 'qa_v1', chain: 'prompt | llm | parser' },
        lgState: { messages: ['User: Search SEC 10-K...'], iteration: 0, tool_calls: [] },
        telemetry: { lcTokens: 45, lgTokens: 45, elapsedMs: 120 }
      },
      {
        step: 1,
        name: 'Step 1: First Inference & Decision',
        lcNode: 'llm',
        lgNode: 'agent',
        description: 'LLM analyzes prompt. LangChain generates text directly. LangGraph decides tool execution is needed.',
        lcState: { prompt_rendered: 'Query: SEC 10-K', status: 'streaming_response' },
        lgState: { messages: ['User: Search...', 'AI: invoke tool(sec_retriever)'], iteration: 1, tool_calls: [{ name: 'sec_retriever', query: 'risk factors' }] },
        telemetry: { lcTokens: 280, lgTokens: 310, elapsedMs: 650 }
      },
      {
        step: 2,
        name: 'Step 2: Tool Execution & Feedback',
        lcNode: 'parser',
        lgNode: 'tools',
        description: 'LangChain parses LLM text. LangGraph executes tools and passes structured observations back to graph state.',
        lcState: { output: 'Parsed standard text response', chain_complete: true },
        lgState: { messages: ['...', 'Tool: Found 14 risk items...'], iteration: 1, tool_result_len: 14 },
        telemetry: { lcTokens: 320, lgTokens: 890, elapsedMs: 1240 }
      },
      {
        step: 3,
        name: 'Step 3: Cyclic Loop Evaluation (LangGraph)',
        lcNode: 'done',
        lgNode: 'agent_loop',
        description: 'LangChain has exited. LangGraph cycles back to the agent node with tool results for synthesis & verification.',
        lcState: { status: 'Terminated (Single-turn)' },
        lgState: { messages: ['...', 'AI: Analyzing retrieved risk items against Q3 baseline...'], iteration: 2, loop_cycles: 1 },
        telemetry: { lcTokens: 320, lgTokens: 1420, elapsedMs: 1980 }
      },
      {
        step: 4,
        name: 'Step 4: Final Synthesis & Completion',
        lcNode: 'done',
        lgNode: 'end',
        description: 'LangGraph completes verification and returns high-confidence synthesized output.',
        lcState: { status: 'Finished' },
        lgState: { messages: ['...', 'AI: Comprehensive verified SEC 10-K breakdown complete.'], status: 'Graph END', total_cycles: 2 },
        telemetry: { lcTokens: 320, lgTokens: 1850, elapsedMs: 2450 }
      }
    ]
  },
  {
    id: 1,
    title: '2. Stateless vs Managed State (TypedDict)',
    badge: 'State Architecture',
    icon: '🧠',
    tagline: 'Isolated Runnables vs Managed Graph State Schemas & Reducers',
    lcSummary: 'LangChain runnables pass input→output dicts without shared cross-step memory. Intermediate steps are discarded.',
    lgSummary: 'LangGraph maintains a centralized TypedDict state schema with custom reducers (e.g. add_messages) updating automatically.',
    steps: [
      {
        step: 0,
        name: 'State Initialization',
        lcNode: 'r1_in',
        lgNode: 'schema_init',
        description: 'Initializing workflow with conversation history and configuration variables.',
        lcState: { input_dict: { query: 'Analyze portfolio' } },
        lgState: { schema: 'AgentState', messages: [], retry_count: 0, portfolio_ids: ['AAPL', 'GOOGL'] },
        telemetry: { lcTokens: 30, lgTokens: 30, elapsedMs: 80 }
      },
      {
        step: 1,
        name: 'Step 1: Partial State Update',
        lcNode: 'r1_run',
        lgNode: 'node_alpha',
        description: 'Node A updates message list. LangChain replaces output dict; LangGraph applies state reducer without overwriting existing data.',
        lcState: { previous_dict_discarded: true, output_dict: { market_data: 'bullish' } },
        lgState: { messages: ['[HumanMessage: Analyze]'], portfolio_ids: ['AAPL', 'GOOGL'], delta: '+1 message reduced' },
        telemetry: { lcTokens: 150, lgTokens: 170, elapsedMs: 420 }
      },
      {
        step: 2,
        name: 'Step 2: Concurrent Multi-Node Reducer',
        lcNode: 'r2_run',
        lgNode: 'node_beta',
        description: 'Parallel nodes execute. LangGraph automatically merges branch outputs into unified state safely.',
        lcState: { manual_merge_required: true },
        lgState: { messages: ['...', 'ToolMessage: metrics calculated'], retry_count: 0, merged_branches: 2 },
        telemetry: { lcTokens: 290, lgTokens: 410, elapsedMs: 880 }
      },
      {
        step: 3,
        name: 'Step 3: State Verification & Output',
        lcNode: 'r3_done',
        lgNode: 'state_persist',
        description: 'Complete state is formatted for caller. Graph state is intact and ready for subsequent turns.',
        lcState: { return: 'Final response only' },
        lgState: { full_conversation_retained: true, state_snapshots: 4, memory_keys: 5 },
        telemetry: { lcTokens: 310, lgTokens: 620, elapsedMs: 1150 }
      }
    ]
  },
  {
    id: 2,
    title: '3. Human-in-the-Loop (HITL Interrupts)',
    badge: 'Human Approval',
    icon: '👤',
    tagline: 'Custom App DB Polling vs Native interrupt() Graph Checkpoints',
    lcSummary: 'LangChain requires external webhooks, database state saving, and re-invoking entire chains with reconstructed history.',
    lgSummary: 'LangGraph uses built-in interrupt() primitives to pause execution in-flight and resume seamlessly upon approval.',
    steps: [
      {
        step: 0,
        name: 'Step 1: Automated Proposal Generation',
        lcNode: 'chain_exec',
        lgNode: 'agent_propose',
        description: 'Agent prepares a high-stakes transaction: "Transfer $75,000 to Escrow Account #9021".',
        lcState: { status: 'Drafting proposal', amount: 75000 },
        lgState: { action: 'wire_transfer', recipient: 'Escrow #9021', status: 'awaiting_human_decision' },
        telemetry: { lcTokens: 210, lgTokens: 210, elapsedMs: 380 }
      },
      {
        step: 1,
        name: 'Step 2: Execution Interruption',
        lcNode: 'external_db_save',
        lgNode: 'hitl_interrupt',
        description: 'Critical Checkpoint: LangGraph invokes interrupt() and pauses thread execution. LangChain exits to external DB.',
        lcState: { external_app: 'Save state to PostgreSQL, send webhook, terminate worker' },
        lgState: { graph_status: 'INTERRUPTED', checkpoint_id: 'chk-88391', thread_id: 'wire-774' },
        telemetry: { lcTokens: 240, lgTokens: 240, elapsedMs: 510 }
      },
      {
        step: 2,
        name: 'Step 3: Human Review & Decision',
        lcNode: 'human_wait',
        lgNode: 'human_review',
        description: 'Human operator inspects the proposed transaction and issues an approval or modification.',
        lcState: { pending_manual_restart: true },
        lgState: { interactive_action_required: true, prompt: 'Approve $75,000 transfer?' },
        telemetry: { lcTokens: 240, lgTokens: 240, elapsedMs: 890 }
      },
      {
        step: 3,
        name: 'Step 4: Seamless Thread Resumption',
        lcNode: 'chain_rebuild',
        lgNode: 'resume_graph',
        description: 'LangGraph resumes from exact node breakpoint with input. LangChain requires rebuilding context manually.',
        lcState: { manual_context_injected: true, re_executed_tokens: 340 },
        lgState: { resumed_from: 'chk-88391', approval: 'GRANTED', transaction_status: 'EXECUTED_SUCCESSFULLY' },
        telemetry: { lcTokens: 580, lgTokens: 390, elapsedMs: 1420 }
      }
    ]
  },
  {
    id: 3,
    title: '4. Error Recovery & Checkpoint Resume',
    badge: 'Fault Tolerance',
    icon: '💾',
    tagline: 'Restart-from-Scratch vs Checkpoint State Recovery',
    lcSummary: 'A failure on Step 4 forces LangChain to restart the entire sequence from Step 1, wasting tokens & latency.',
    lgSummary: 'LangGraph snapshots state at each node with checkpointers (Postgres/Memory), resuming directly from the failed step.',
    steps: [
      {
        step: 0,
        name: 'Step 1: Research & Extraction (OK)',
        lcNode: 's1_ok',
        lgNode: 's1_chk',
        description: 'Fetching primary documents and extracting key entities (Cost: $0.008).',
        lcState: { step1: 'Done (4,000 tokens)' },
        lgState: { step1: 'Done', checkpoint: 'chk_1_saved' },
        telemetry: { lcTokens: 4000, lgTokens: 4000, elapsedMs: 1200 }
      },
      {
        step: 1,
        name: 'Step 2: Embeddings & Vector Indexing (OK)',
        lcNode: 's2_ok',
        lgNode: 's2_chk',
        description: 'Generating chunk embeddings and indexing to Pinecone (Cost: $0.004).',
        lcState: { step2: 'Done (2,000 tokens)' },
        lgState: { step2: 'Done', checkpoint: 'chk_2_saved' },
        telemetry: { lcTokens: 6000, lgTokens: 6000, elapsedMs: 2400 }
      },
      {
        step: 2,
        name: 'Step 3: Downstream API Timeout (ERROR 503)',
        lcNode: 's3_fail',
        lgNode: 's3_fail',
        description: 'Third-party compliance API times out with HTTP 503 error.',
        lcState: { error: '503 Service Unavailable', action: 'CHAIN FAILED' },
        lgState: { error: '503 Service Unavailable', state_persisted_at: 'chk_2_saved' },
        telemetry: { lcTokens: 6200, lgTokens: 6200, elapsedMs: 3100 }
      },
      {
        step: 3,
        name: 'Step 4: Recovery Execution',
        lcNode: 's4_restart',
        lgNode: 's4_resume',
        description: 'LangChain re-executes Steps 1, 2, and 3 from scratch. LangGraph resumes directly at Step 3.',
        lcState: { recovery: 'Restarted all from Step 1 (Wasted 6,000 tokens, +3.5s latency)' },
        lgState: { recovery: 'Resumed from chk_2_saved (0 wasted tokens, +0.4s latency)' },
        telemetry: { lcTokens: 12800, lgTokens: 6800, elapsedMs: 5900 }
      }
    ]
  }
];

export function LangChainVsLangGraphComparison() {
  const [activeScenarioId, setActiveScenarioId] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeCodeTab, setActiveCodeTab] = useState('langchain');
  const [inspectedNode, setInspectedNode] = useState(null);
  const [humanDecision, setHumanDecision] = useState(null); // 'approved' | 'rejected'

  const currentScenario = SIMULATION_SCENARIOS.find(s => s.id === activeScenarioId) || SIMULATION_SCENARIOS[0];
  const maxSteps = currentScenario.steps.length;
  const currentStep = currentScenario.steps[activeStepIndex] || currentScenario.steps[0];

  // Auto-play timer loop
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      const intervalMs = Math.round(2200 / playbackSpeed);
      timer = setTimeout(() => {
        setActiveStepIndex(prev => {
          if (prev >= maxSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, activeStepIndex, maxSteps, playbackSpeed]);

  const handleScenarioChange = (id) => {
    setActiveScenarioId(id);
    setActiveStepIndex(0);
    setIsPlaying(false);
    setInspectedNode(null);
    setHumanDecision(null);
  };

  const handlePlayToggle = () => {
    if (activeStepIndex >= maxSteps - 1) {
      setActiveStepIndex(0);
    }
    setIsPlaying(prev => !prev);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveStepIndex(0);
    setHumanDecision(null);
    setInspectedNode(null);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setActiveStepIndex(prev => Math.min(prev + 1, maxSteps - 1));
  };

  const handleStepBack = () => {
    setIsPlaying(false);
    setActiveStepIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <Container size="normal" style={{ paddingTop: 'var(--ds-space-4)', paddingBottom: 'var(--ds-space-8)' }}>
      {/* Header Banner */}
      <Section variant="bordered" style={{ marginBottom: 'var(--ds-space-6)', background: 'linear-gradient(135deg, rgba(74, 154, 74, 0.08) 0%, rgba(42, 122, 156, 0.08) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Badge variant="primary" size="sm">Interactive Architecture Lab</Badge>
          <span style={{ fontSize: '0.8rem', color: 'var(--ds-color-text-tertiary)' }}>LangChain (LCEL) vs LangGraph (StateGraph)</span>
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0 8px 0', color: 'var(--ds-color-text-primary)' }}>
          LangChain vs LangGraph: Execution Flow Architecture
        </h1>
        <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: '0.95rem', maxWidth: '850px', lineHeight: 1.5, margin: 0 }}>
          Interactive step-by-step telemetry simulator comparing linear composable chains with stateful cyclic graph state machines. Click nodes, play traces, and test edge conditions live.
        </p>
      </Section>

      {/* ========================================================================= */}
      {/* INTERACTIVE EXECUTION FLOW ARCHITECTURE SIMULATOR */}
      {/* ========================================================================= */}
      <Section variant="bordered" style={{ marginBottom: 'var(--ds-space-6)', borderColor: 'rgba(37, 99, 235, 0.3)' }}>
        <Section.Header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  Execution Flow Simulator & Inspector
                </h2>
                <Badge variant="success" size="sm" dot>Live Simulation</Badge>
              </div>
              <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Select an architectural dimension to step through state mutations, token cost, and execution graphs.
              </p>
            </div>

            {/* Playback Controls Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--ds-color-bg-canvas)', padding: '6px 10px', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-default)' }}>
              <button
                onClick={handleReset}
                title="Reset simulation (R)"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: '4px 8px', borderRadius: '4px', color: 'var(--ds-color-text-secondary)' }}
              >
                🔄 Reset
              </button>
              <button
                onClick={handleStepBack}
                disabled={activeStepIndex === 0}
                title="Previous step"
                style={{ background: 'none', border: 'none', cursor: activeStepIndex === 0 ? 'not-allowed' : 'pointer', opacity: activeStepIndex === 0 ? 0.4 : 1, fontSize: '0.9rem', padding: '4px 6px', color: 'var(--ds-color-text-primary)' }}
              >
                ⏮
              </button>
              <button
                onClick={handlePlayToggle}
                style={{
                  background: isPlaying ? '#dc2626' : '#5EC4C8',
                  border: 'none',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '6px 14px',
                  borderRadius: 'var(--ds-radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)'
                }}
              >
                <span>{isPlaying ? '⏸ Pause' : '▶ Play Trace'}</span>
              </button>
              <button
                onClick={handleStepForward}
                disabled={activeStepIndex === maxSteps - 1}
                title="Next step"
                style={{ background: 'none', border: 'none', cursor: activeStepIndex === maxSteps - 1 ? 'not-allowed' : 'pointer', opacity: activeStepIndex === maxSteps - 1 ? 0.4 : 1, fontSize: '0.9rem', padding: '4px 6px', color: 'var(--ds-color-text-primary)' }}
              >
                ⏭
              </button>

              <div style={{ width: '1px', height: '18px', background: 'var(--ds-color-border-subtle)', margin: '0 4px' }} />

              {/* Speed Buttons */}
              <div style={{ display: 'flex', gap: '2px' }}>
                {[0.5, 1, 2].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    style={{
                      background: playbackSpeed === speed ? 'var(--ds-color-module-foundations-primary)' : 'transparent',
                      color: playbackSpeed === speed ? 'white' : 'var(--ds-color-text-tertiary)',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section.Header>

        <Section.Body>
          {/* Scenario Tab Buttons */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: 'var(--ds-space-4)' }}>
            {SIMULATION_SCENARIOS.map(sc => {
              const isSelected = sc.id === activeScenarioId;
              return (
                <button
                  key={sc.id}
                  onClick={() => handleScenarioChange(sc.id)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 'var(--ds-radius-lg)',
                    border: isSelected ? '2px solid #5EC4C8' : '1px solid var(--ds-color-border-default)',
                    background: isSelected ? 'rgba(37, 99, 235, 0.08)' : 'var(--ds-color-bg-surface)',
                    color: isSelected ? '#5EC4C8' : 'var(--ds-color-text-primary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.15)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{sc.icon}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ lineHeight: 1.2 }}>{sc.title}</div>
                    <div style={{ fontSize: '0.7rem', color: isSelected ? '#5EC4C8' : 'var(--ds-color-text-tertiary)', fontWeight: 500 }}>
                      {sc.badge}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Step Timeline Progress Bar */}
          <div style={{ background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: 'var(--ds-radius-md)', padding: '10px 16px', marginBottom: 'var(--ds-space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>
                TIMELINE: Step {activeStepIndex + 1} of {maxSteps} — <strong style={{ color: 'var(--ds-color-text-primary)' }}>{currentStep.name}</strong>
              </span>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--ds-color-text-tertiary)', fontFamily: 'var(--ds-font-family-mono)' }}>
                <span>⏱ {currentStep.telemetry.elapsedMs}ms</span>
                <span>🦜 LC: {currentStep.telemetry.lcTokens} tok</span>
                <span>🕸️ LG: {currentStep.telemetry.lgTokens} tok</span>
              </div>
            </div>

            {/* Stepper Dots */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {currentScenario.steps.map((st, idx) => {
                const isActive = idx === activeStepIndex;
                const isPassed = idx < activeStepIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => { setIsPlaying(false); setActiveStepIndex(idx); }}
                    style={{
                      flex: 1,
                      height: '8px',
                      borderRadius: '4px',
                      border: 'none',
                      background: isActive ? '#5EC4C8' : isPassed ? '#5EC4C8' : 'var(--ds-color-border-default)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                    title={`Step ${idx + 1}: ${st.name}`}
                  />
                );
              })}
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: '0.82rem', color: 'var(--ds-color-text-secondary)', lineHeight: 1.4 }}>
              💡 {currentStep.description}
            </p>
          </div>

          {/* DUAL INTERACTIVE CANVAS GRID */}
          <Grid columns={{ base: '1fr', lg: '1fr 1fr' }} gap="var(--ds-space-4)" align="stretch">
            {/* 1. LANGCHAIN EXECUTION CANVAS */}
            <div style={{
              background: '#0a101d',
              border: '1px solid rgba(74, 154, 74, 0.4)',
              borderRadius: 'var(--ds-radius-lg)',
              padding: 'var(--ds-space-4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🦜</span>
                  <span style={{ color: '#4ade80', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.02em' }}>
                    LANGCHAIN (LCEL PIPELINE)
                  </span>
                </div>
                <Badge variant="default" size="sm" style={{ background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.3)' }}>
                  Unidirectional DAG
                </Badge>
              </div>

              {/* LangChain SVG Visual Graph */}
              <div style={{ minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 100 50" style={{ width: '100%', height: '100%', maxHeight: '180px' }}>
                  {/* Step 1: Prompt */}
                  <g onClick={() => setInspectedNode({ framework: 'LangChain', name: 'ChatPromptTemplate', desc: 'Formats variables into prompt message payload', payload: currentStep.lcState })} style={{ cursor: 'pointer' }}>
                    <rect
                      x="4" y="16" width="26" height="18" rx="4"
                      fill={currentStep.lcNode === 'prompt' || currentStep.lcNode === 'r1_in' || currentStep.lcNode === 's1_ok' ? '#5EC4C8' : '#1e293b'}
                      stroke={currentStep.lcNode === 'prompt' || currentStep.lcNode === 'r1_in' || currentStep.lcNode === 's1_ok' ? '#4ade80' : '#334155'}
                      strokeWidth={currentStep.lcNode === 'prompt' ? '1.8' : '1'}
                      style={{ transition: 'all 0.3s' }}
                    />
                    <text x="17" y="27" textAnchor="middle" fill="#ffffff" fontSize="4.5" fontWeight="bold">Prompt</text>
                  </g>

                  {/* Arrow 1 */}
                  <line x1="30" y1="25" x2="37" y2="25" stroke={activeStepIndex >= 1 ? '#4ade80' : '#475569'} strokeWidth="1.2" strokeDasharray={activeStepIndex >= 1 ? 'none' : '2,1'} markerEnd="url(#arrow-lc-1)" />

                  {/* Step 2: LLM */}
                  <g onClick={() => setInspectedNode({ framework: 'LangChain', name: 'ChatAnthropic / ChatOpenAI', desc: 'Single-turn stateless model inference', payload: currentStep.lcState })} style={{ cursor: 'pointer' }}>
                    <rect
                      x="37" y="16" width="26" height="18" rx="4"
                      fill={currentStep.lcNode === 'llm' || currentStep.lcNode === 'r1_run' || currentStep.lcNode === 'chain_exec' || currentStep.lcNode === 's2_ok' ? '#5EC4C8' : '#1e293b'}
                      stroke={currentStep.lcNode === 'llm' || currentStep.lcNode === 'r1_run' || currentStep.lcNode === 'chain_exec' || currentStep.lcNode === 's2_ok' ? '#4ade80' : '#334155'}
                      strokeWidth={currentStep.lcNode === 'llm' ? '1.8' : '1'}
                      style={{ transition: 'all 0.3s' }}
                    />
                    <text x="50" y="27" textAnchor="middle" fill="#ffffff" fontSize="4.5" fontWeight="bold">LLM Model</text>
                  </g>

                  {/* Arrow 2 */}
                  <line x1="63" y1="25" x2="70" y2="25" stroke={activeStepIndex >= 2 ? '#4ade80' : '#475569'} strokeWidth="1.2" strokeDasharray={activeStepIndex >= 2 ? 'none' : '2,1'} markerEnd="url(#arrow-lc-2)" />

                  {/* Step 3: Parser */}
                  <g onClick={() => setInspectedNode({ framework: 'LangChain', name: 'StrOutputParser', desc: 'Extracts formatted strings or JSON dictionaries', payload: currentStep.lcState })} style={{ cursor: 'pointer' }}>
                    <rect
                      x="70" y="16" width="26" height="18" rx="4"
                      fill={currentStep.lcNode === 'parser' || currentStep.lcNode === 'r2_run' || currentStep.lcNode === 's3_fail' ? (currentStep.lcNode === 's3_fail' ? '#ef4444' : '#5EC4C8') : '#1e293b'}
                      stroke={currentStep.lcNode === 'parser' || currentStep.lcNode === 's3_fail' ? '#f87171' : '#334155'}
                      strokeWidth={currentStep.lcNode === 'parser' || currentStep.lcNode === 's3_fail' ? '1.8' : '1'}
                      style={{ transition: 'all 0.3s' }}
                    />
                    <text x="83" y="27" textAnchor="middle" fill="#ffffff" fontSize="4.5" fontWeight="bold">
                      {currentStep.lcNode === 's3_fail' ? 'FAIL 503' : 'Output Parser'}
                    </text>
                  </g>

                  <defs>
                    <marker id="arrow-lc-1" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill={activeStepIndex >= 1 ? '#4ade80' : '#475569'} />
                    </marker>
                    <marker id="arrow-lc-2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill={activeStepIndex >= 2 ? '#4ade80' : '#475569'} />
                    </marker>
                  </defs>
                </svg>
              </div>

              {/* LangChain Live Telemetry Box */}
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: 'var(--ds-radius-sm)', padding: '8px 12px', border: '1px solid rgba(74, 154, 74, 0.2)', fontSize: '0.75rem', fontFamily: 'var(--ds-font-family-mono)', color: '#86efac' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#94a3b8' }}>
                  <span>STATE PAYLOAD</span>
                  <span>Node: {currentStep.lcNode}</span>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: '55px', overflowY: 'auto' }}>
                  {JSON.stringify(currentStep.lcState, null, 2)}
                </div>
              </div>
            </div>

            {/* 2. LANGGRAPH EXECUTION CANVAS */}
            <div style={{
              background: '#091122',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: 'var(--ds-radius-lg)',
              padding: 'var(--ds-space-4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🕸️</span>
                  <span style={{ color: '#3A9B9F', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.02em' }}>
                    LANGGRAPH (STATEGRAPH MACHINE)
                  </span>
                </div>
                <Badge variant="default" size="sm" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#3A9B9F', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  Cyclic State Graph
                </Badge>
              </div>

              {/* LangGraph SVG Visual Graph with Cyclic Loop */}
              <div style={{ minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 100 56" style={{ width: '100%', height: '100%', maxHeight: '180px' }}>
                  {/* Start Node */}
                  <circle cx="10" cy="28" r="5" fill="#5EC4C8" stroke="#60a5fa" strokeWidth="1" />
                  <text x="10" y="29.5" textAnchor="middle" fill="#ffffff" fontSize="3.5" fontWeight="bold">Start</text>

                  <line x1="15" y1="28" x2="24" y2="28" stroke="#5EC4C8" strokeWidth="1.2" markerEnd="url(#arrow-lg-1)" />

                  {/* Agent Node */}
                  <g onClick={() => setInspectedNode({ framework: 'LangGraph', name: 'Agent Node (LLM Brain)', desc: 'Processes messages, decides tool invocation, appends to state schema', payload: currentStep.lgState })} style={{ cursor: 'pointer' }}>
                    <rect
                      x="24" y="18" width="24" height="20" rx="4"
                      fill={currentStep.lgNode === 'agent' || currentStep.lgNode === 'agent_loop' || currentStep.lgNode === 'agent_propose' || currentStep.lgNode === 'node_alpha' ? '#5EC4C8' : '#1e293b'}
                      stroke={currentStep.lgNode === 'agent' || currentStep.lgNode === 'agent_loop' ? '#60a5fa' : '#334155'}
                      strokeWidth={currentStep.lgNode === 'agent' || currentStep.lgNode === 'agent_loop' ? '1.8' : '1'}
                      style={{ transition: 'all 0.3s' }}
                    />
                    <text x="36" y="27" textAnchor="middle" fill="#ffffff" fontSize="4" fontWeight="bold">Agent Node</text>
                    <text x="36" y="32" textAnchor="middle" fill="#93c5fd" fontSize="2.8">StateGraph</text>
                  </g>

                  {/* Conditional Edge Forward */}
                  <line x1="48" y1="28" x2="58" y2="28" stroke={activeStepIndex >= 2 ? '#5EC4C8' : '#475569'} strokeWidth="1.2" markerEnd="url(#arrow-lg-2)" />

                  {/* Tools Node / HITL Checkpoint Node */}
                  <g onClick={() => setInspectedNode({ framework: 'LangGraph', name: 'Tools / Checkpoint Node', desc: 'Executes tools or triggers interrupt() for human checkpointing', payload: currentStep.lgState })} style={{ cursor: 'pointer' }}>
                    <rect
                      x="58" y="18" width="24" height="20" rx="4"
                      fill={currentStep.lgNode === 'tools' || currentStep.lgNode === 'hitl_interrupt' || currentStep.lgNode === 'node_beta' ? '#3A9B9F' : '#1e293b'}
                      stroke={currentStep.lgNode === 'tools' || currentStep.lgNode === 'hitl_interrupt' ? '#2dd4bf' : '#334155'}
                      strokeWidth={currentStep.lgNode === 'tools' || currentStep.lgNode === 'hitl_interrupt' ? '1.8' : '1'}
                      style={{ transition: 'all 0.3s' }}
                    />
                    <text x="70" y="27" textAnchor="middle" fill="#ffffff" fontSize="4" fontWeight="bold">
                      {activeScenarioId === 2 ? 'interrupt()' : 'Tools Node'}
                    </text>
                    <text x="70" y="32" textAnchor="middle" fill="#5eead4" fontSize="2.8">
                      {activeScenarioId === 2 ? 'Human Gate' : 'Reducers'}
                    </text>
                  </g>

                  {/* Cyclic Feedback Loop (Arrow curving back from Tools to Agent) */}
                  <path
                    d="M 70 18 C 70 7, 36 7, 36 18"
                    fill="none"
                    stroke={activeStepIndex === 3 && activeScenarioId === 0 ? '#5EC4C8' : 'rgba(56, 189, 248, 0.2)'}
                    strokeWidth={activeStepIndex === 3 ? '1.8' : '1'}
                    strokeDasharray={activeStepIndex === 3 ? 'none' : '3,2'}
                    markerEnd="url(#arrow-lg-loop)"
                  />
                  <text x="53" y="10" textAnchor="middle" fill="#5EC4C8" fontSize="2.8" fontWeight="bold">
                    Cyclic Feedback Loop
                  </text>

                  {/* End Node */}
                  <line x1="82" y1="28" x2="89" y2="28" stroke={activeStepIndex >= 4 ? '#5EC4C8' : '#475569'} strokeWidth="1.2" markerEnd="url(#arrow-lg-3)" />
                  <circle cx="94" cy="28" r="4.5" fill={activeStepIndex >= 4 ? '#5EC4C8' : '#334155'} stroke="#4ade80" strokeWidth="1" />
                  <text x="94" y="29.2" textAnchor="middle" fill="#ffffff" fontSize="3" fontWeight="bold">END</text>

                  <defs>
                    <marker id="arrow-lg-1" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill="#5EC4C8" />
                    </marker>
                    <marker id="arrow-lg-2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill={activeStepIndex >= 2 ? '#5EC4C8' : '#475569'} />
                    </marker>
                    <marker id="arrow-lg-3" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill={activeStepIndex >= 4 ? '#5EC4C8' : '#475569'} />
                    </marker>
                    <marker id="arrow-lg-loop" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill="#5EC4C8" />
                    </marker>
                  </defs>
                </svg>
              </div>

              {/* LangGraph Live State Schema Box */}
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: 'var(--ds-radius-sm)', padding: '8px 12px', border: '1px solid rgba(56, 189, 248, 0.2)', fontSize: '0.75rem', fontFamily: 'var(--ds-font-family-mono)', color: '#7dd3fc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#94a3b8' }}>
                  <span>AGENTSTATE (TYPEDDICT)</span>
                  <span>Node: {currentStep.lgNode}</span>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: '55px', overflowY: 'auto' }}>
                  {JSON.stringify(currentStep.lgState, null, 2)}
                </div>
              </div>
            </div>
          </Grid>

          {/* HITL Interactive Branch Action (Scenario 2 Special Action) */}
          {activeScenarioId === 2 && activeStepIndex >= 1 && (
            <div style={{
              marginTop: 'var(--ds-space-4)',
              background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
              border: '1px solid #F0A89A',
              borderRadius: 'var(--ds-radius-md)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <strong style={{ color: '#C47A6A', fontSize: '0.9rem' }}>🛑 Human Approval Checkpoint Active:</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--ds-color-text-primary)', marginLeft: '8px' }}>
                  LangGraph interrupted thread <code style={{ fontFamily: 'var(--ds-font-family-mono)' }}>#wire-774</code>. Choose action to resume graph:
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => { setHumanDecision('approved'); setActiveStepIndex(3); }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#16a34a',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  ✓ Approve & Resume Wire ($75k)
                </button>
                <button
                  onClick={() => { setHumanDecision('rejected'); setActiveStepIndex(3); }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#dc2626',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  ✕ Reject & Reroute to Compliance
                </button>
              </div>
            </div>
          )}

          {/* Interactive Click Inspector Modal / Callout */}
          {inspectedNode && (
            <div style={{
              marginTop: 'var(--ds-space-4)',
              background: 'var(--ds-color-bg-surfaceHover)',
              border: '1px solid var(--ds-color-border-focus)',
              borderRadius: 'var(--ds-radius-md)',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              animation: 'fadeIn 0.2s ease'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Badge variant="primary" size="sm">{inspectedNode.framework}</Badge>
                  <strong style={{ fontSize: '0.9rem' }}>{inspectedNode.name}</strong>
                </div>
                <p style={{ margin: '0 0 6px 0', fontSize: '0.82rem', color: 'var(--ds-color-text-secondary)' }}>
                  {inspectedNode.desc}
                </p>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--ds-font-family-mono)', color: 'var(--ds-color-text-tertiary)' }}>
                  Inspected Node Payload: {JSON.stringify(inspectedNode.payload)}
                </div>
              </div>
              <button
                onClick={() => setInspectedNode(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ds-color-text-tertiary)', fontSize: '1.1rem' }}
                aria-label="Close inspector"
              >
                ✕
              </button>
            </div>
          )}
        </Section.Body>
      </Section>

      {/* ========================================================================= */}
      {/* 4 KEY ARCHITECTURAL DIFFERENCES EXPLORER */}
      {/* ========================================================================= */}
      <Section variant="bordered" style={{ marginBottom: 'var(--ds-space-6)' }}>
        <Section.Header>
          <h2 style={{ fontSize: 'var(--ds-font-size-h3)', marginBottom: 'var(--ds-space-1)' }}>
            Summary of Key Architectural Pillars
          </h2>
          <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: '0.85rem' }}>
            Direct comparison matrix across state, cycles, interruptions, and resilience.
          </p>
        </Section.Header>

        <Section.Body>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Callout type="success" title="LangChain (LCEL) Architecture">
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '18px', fontSize: '0.82rem', lineHeight: 1.6 }}>
                <li><strong>Execution Paradigm:</strong> Unidirectional linear DAG (Prompt → LLM → Parser)</li>
                <li><strong>State Model:</strong> Stateless runnables passing transient dictionary payloads</li>
                <li><strong>Human-in-the-Loop:</strong> External DB pause/resume constructed at application layer</li>
                <li><strong>Fault Recovery:</strong> Re-executes the entire chain from Step 1 on error</li>
                <li><strong>Best Suited For:</strong> Straightforward RAG pipelines, single-turn QA, summarization</li>
              </ul>
            </Callout>

            <Callout type="info" title="LangGraph (StateGraph) Architecture">
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '18px', fontSize: '0.82rem', lineHeight: 1.6 }}>
                <li><strong>Execution Paradigm:</strong> Cyclic state machines with dynamic conditional routing</li>
                <li><strong>State Model:</strong> Centralized `TypedDict` schema with reducer functions (`add_messages`)</li>
                <li><strong>Human-in-the-Loop:</strong> Native `interrupt()` primitive with thread checkpointing</li>
                <li><strong>Fault Recovery:</strong> Checkpointer snapshots state per step for immediate resume</li>
                <li><strong>Best Suited For:</strong> Multi-agent systems, ReAct loops, complex coding/planning agents</li>
              </ul>
            </Callout>
          </Grid>
        </Section.Body>
      </Section>

      {/* ========================================================================= */}
      {/* DECISION TREE + FIVE-STYLE MATRIX (generic coordination styles) */}
      {/* ========================================================================= */}
      <DecisionTreeSection />
      <FiveStyleMatrixSection />

      {/* ========================================================================= */}
      {/* CODE EXAMPLES SIDE-BY-SIDE */}
      {/* ========================================================================= */}
      <Section variant="bordered">
        <Section.Header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 style={{ fontSize: 'var(--ds-font-size-h3)', margin: 0 }}>
                Code Implementation Comparison
              </h2>
              <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Compare syntax: Composable pipe operator `|` vs StateGraph nodes and conditional edges.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setActiveCodeTab('langchain')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: activeCodeTab === 'langchain' ? '2px solid #5EC4C8' : '1px solid var(--ds-color-border-default)',
                  background: activeCodeTab === 'langchain' ? 'rgba(74, 154, 74, 0.1)' : 'transparent',
                  color: activeCodeTab === 'langchain' ? '#5EC4C8' : 'inherit',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                🦜 LangChain (LCEL)
              </button>
              <button
                onClick={() => setActiveCodeTab('langgraph')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: activeCodeTab === 'langgraph' ? '2px solid #2a7a9c' : '1px solid var(--ds-color-border-default)',
                  background: activeCodeTab === 'langgraph' ? 'rgba(42, 122, 156, 0.1)' : 'transparent',
                  color: activeCodeTab === 'langgraph' ? '#2a7a9c' : 'inherit',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                🕸️ LangGraph (StateGraph)
              </button>
            </div>
          </div>
        </Section.Header>

        <Section.Body>
          {activeCodeTab === 'langchain' ? (
            <CodeBlock
              language="python"
              code={`from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_anthropic import ChatAnthropic

# 1. Linear Composable LCEL Pipeline
prompt = PromptTemplate.from_template("What is the capital of {country}?")
model = ChatAnthropic(model="claude-sonnet-4-20250514")
parser = StrOutputParser()

# 2. Pipe operator composition (Prompt -> Model -> Parser)
chain = prompt | model | parser

# 3. Direct invoke
result = chain.invoke({"country": "France"})
print(result) # "Paris"`}
            />
          ) : (
            <CodeBlock
              language="python"
              code={`from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver
from langchain_anthropic import ChatAnthropic
from langchain_core.tools import tool

# 1. Define Typed State Schema
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    iterations: int

# 2. Define Tools & Nodes
@tool
def search_docs(query: str) -> str:
    return "Relevant context snippet"

llm = ChatAnthropic(model="claude-sonnet-4-20250514").bind_tools([search_docs])

def agent_node(state: AgentState):
    response = llm.invoke(state["messages"])
    return {"messages": [response], "iterations": state["iterations"] + 1}

# 3. Build Cyclic StateGraph
workflow = StateGraph(AgentState)
workflow.add_node("agent", agent_node)
workflow.set_entry_point("agent")

# Add conditional feedback edge
def should_continue(state: AgentState):
    if state["iterations"] > 3 or not state["messages"][-1].tool_calls:
        return END
    return "agent"

workflow.add_conditional_edges("agent", should_continue)

# 4. Compile with Checkpointer
checkpointer = MemorySaver()
app = workflow.compile(checkpointer=checkpointer)

# 5. Execute with Session Threading
config = {"configurable": {"thread_id": "session-123"}}
result = app.invoke({"messages": [("user", "Analyze Q3 numbers")], "iterations": 0}, config)`}
            />
          )}
        </Section.Body>
      </Section>
    </Container>
  );
}

export default LangChainVsLangGraphComparison;