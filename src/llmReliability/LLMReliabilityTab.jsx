import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { Panel, GlassCard } from '../components/ui/CleanInfographics.jsx';
import {
  PARSE_MARKUP_TAGS,
  VALIDATE_OUTPUT_SCHEMA,
  SIMULATE_RETRY_FALLBACK,
  PYTHON_RELIABILITY_PIPELINE
} from './reliabilityEngine.js';
import DataTable from '../components/ui/DataTable.jsx';
import Workflow from '../components/ui/Workflow.jsx';
import { Reveal, AnimatedNumber } from '../components/ui/AnimatedReveal.jsx';

const { Container, Grid, Flex, Stack } = Primitives;

/** Native recreation: stochastic challenges → 5 mechanisms → reliable output. */
function ReliabilityPanel() {
  const pts = { fontSize: 12.5, color: '#CBD5E1', lineHeight: 1.65, margin: '6px 0 0', paddingLeft: 16 };
  return (
    <Panel
      title="LLM Reliability & Fault Tolerance — 5 Mechanisms"
      sub="Stochastic outputs go in; five deterministic mechanisms stand between them and production."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        <GlassCard color="#E8836A" icon="zap" title="Challenges In">
          <ul style={pts}>
            <li>Inconsistent formats (JSON / free-text mix)</li>
            <li>Rate limits and throttling</li>
            <li>Provider outages</li>
          </ul>
        </GlassCard>
        <GlassCard color="#5EC4C8" icon="clip" title="1–2 · Parse & Validate">
          <ul style={pts}>
            <li>Markup tag parsing — extract content</li>
            <li>Schema validation — types enforced</li>
          </ul>
        </GlassCard>
        <GlassCard color="#6A9BD8" icon="file" title="3 · System Prompting">
          <ul style={pts}>
            <li>Structured prompt + context blocks</li>
            <li>Conformance described up front</li>
          </ul>
        </GlassCard>
        <GlassCard color="#E8C558" icon="refresh" title="4 · Backoff Retries">
          <ul style={pts}>
            <li>Exponential timeline: 2s → 4s → 8s</li>
            <li>Transient faults ride out</li>
          </ul>
        </GlassCard>
        <GlassCard color="#A78BFA" icon="nodes" title="5 · Provider Fallback">
          <ul style={pts}>
            <li>Primary → fallback → fallback chain</li>
            <li>Yes/no routing on failure</li>
          </ul>
        </GlassCard>
        <GlassCard color="#34D399" icon="check" title="Reliable Output" badge="99.9%">
          <ul style={pts}>
            <li>Status, success, and data streams green</li>
            <li>Handled errors → logging + notifications</li>
          </ul>
        </GlassCard>
      </div>
    </Panel>
  );
}

export default function LLMReliabilityTab() {
  const [activeSubTab, setActiveSubTab] = useState('xml'); // 'xml' | 'schema' | 'fallback' | 'code'

  // XML Tag state
  const [xmlInputText, setXmlInputText] = useState(
    "<think>\nInspecting request...\n</think>\n<answer>\nClassification: Category_A\nConfidence: 0.98\n</answer>"
  );

  // Schema state
  const [schemaInputJson, setSchemaInputJson] = useState(
    '{\n  "record_id": 101,\n  "status": "OK",\n  "metric_value": 98.4\n}'
  );

  // Fallback simulator state
  const [failPrimary, setFailPrimary] = useState(true);
  const [failSecondary, setFailSecondary] = useState(true);

  const xmlResult = PARSE_MARKUP_TAGS(xmlInputText, 'answer');
  const schemaResult = VALIDATE_OUTPUT_SCHEMA(schemaInputJson);
  const fallbackResult = SIMULATE_RETRY_FALLBACK(failPrimary, failSecondary);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="frontiers_production"
        moduleLabel="Production & Frontiers [Reliability Engineering]"
        title="LLM Application Reliability & Fault Tolerance"
        description="Engineering patterns for 99.9% uptime in stochastic LLM applications: XML Markup Tag parsing, Pydantic schema validation, exponential backoff retries, and multi-provider fallback chains."
        metrics={[
          { label: 'Reliability Target', value: '99.9% Uptime' },
          { label: 'Parsing Pattern', value: 'XML &lt;answer&gt; Tags' },
          { label: 'Validation', value: 'Pydantic BaseModel' },
          { label: 'Failover', value: 'OpenAI ➔ Gemini ➔ Claude' }
        ]}
      />

      <Container size="wide">
        {/* ARCHITECTURAL INFOGRAPHIC DIAGRAM */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <ReliabilityPanel />
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
            { id: 'xml', icon: '🏷️', label: '1. XML Markup Tag Parsing', desc: 'Guaranteed answer extraction' },
            { id: 'schema', icon: '📋', label: '2. Pydantic Output Validation', desc: 'Type-safe JSON schema' },
            { id: 'fallback', icon: '🔄', label: '3. Retry & Fallback Simulator', desc: 'Backoff & multi-vendor failover' },
            { id: 'code', icon: '🛠️', label: '4. Production Python Engine', desc: 'Resilient LLM pipeline code' }
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

        {/* ─── SUBTAB 1: XML MARKUP TAG PARSING ─── */}
        {activeSubTab === 'xml' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🏷️ Output Consistency via XML Markup Tags</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Frontier LLMs (OpenAI, DeepSeek, Qwen, Gemini) are pre-trained and RLHF-aligned on XML markup tags (`&lt;answer&gt;`, `&lt;think&gt;`, `&lt;example&gt;`). Tag enclosure provides near 100% format adherence compared to free-text prompting.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                    <strong style={{ fontSize: '11px', color: '#F5A623', display: 'block', marginBottom: '8px' }}>
                      RAW LLM OUTPUT WITH XML TAGS:
                    </strong>
                    <textarea
                      rows={6}
                      value={xmlInputText}
                      onChange={e => setXmlInputText(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#090d16',
                        border: '1px solid var(--ds-color-border-subtle)',
                        borderRadius: '6px',
                        padding: '10px',
                        color: 'white',
                        fontFamily: 'monospace',
                        fontSize: '12px'
                      }}
                    />
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${xmlResult.success ? '#5EC4C8' : '#F5A623'}` }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '11px', color: '#3A9B9F' }}>PARSED & EXTRACTED CONTENT:</strong>
                      <Badge variant="subtle" style={{ background: xmlResult.success ? 'rgba(46,204,140,0.15)' : 'rgba(245,166,35,0.15)', color: xmlResult.success ? '#5EC4C8' : '#F5A623' }}>
                        {xmlResult.success ? 'TAG_MATCH' : 'FALLBACK'}
                      </Badge>
                    </Flex>
                    <div style={{
                      minHeight: '100px',
                      background: '#090d16',
                      border: '1px solid var(--ds-color-border-subtle)',
                      borderRadius: '6px',
                      padding: '10px',
                      color: '#3A9B9F',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {xmlResult.extractedContent}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '8px' }}>
                      Log: {xmlResult.log}
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: PYDANTIC SCHEMA VALIDATION ─── */}
        {activeSubTab === 'schema' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📋 Type-Safe Pydantic Output Validation</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Validate incoming LLM JSON outputs against rigid Pydantic `BaseModel` schemas (`record_id: int`, `status: str`, `metric_value: float`).
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                    <strong style={{ fontSize: '11px', color: '#3A9B9F', display: 'block', marginBottom: '8px' }}>
                      INCOMING LLM JSON PAYLOAD:
                    </strong>
                    <textarea
                      rows={6}
                      value={schemaInputJson}
                      onChange={e => setSchemaInputJson(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#090d16',
                        border: '1px solid var(--ds-color-border-subtle)',
                        borderRadius: '6px',
                        padding: '10px',
                        color: 'white',
                        fontFamily: 'monospace',
                        fontSize: '12px'
                      }}
                    />
                    <Flex gap={2} style={{ marginTop: '8px' }}>
                      <Button size="sm" variant="subtle" onClick={() => setSchemaInputJson('{\n  "record_id": 101,\n  "status": "OK",\n  "metric_value": 98.4\n}')}>
                        Valid Payload
                      </Button>
                      <Button size="sm" variant="subtle" onClick={() => setSchemaInputJson('{\n  "record_id": "invalid_string",\n  "status": "OK"\n}')}>
                        Invalid Types Payload
                      </Button>
                    </Flex>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${schemaResult.isValid ? '#5EC4C8' : '#ef4444'}` }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>PYDANTIC VALIDATION RESULT:</strong>
                      <Badge variant="subtle" style={{ background: schemaResult.isValid ? 'rgba(46,204,140,0.15)' : 'rgba(255,77,77,0.15)', color: schemaResult.isValid ? '#5EC4C8' : '#ef4444' }}>
                        {schemaResult.isValid ? 'VALIDATED_OK' : 'SCHEMA_ERROR'}
                      </Badge>
                    </Flex>

                    {schemaResult.isValid ? (
                      <Card style={{ padding: '10px', background: '#090d16', color: '#3A9B9F', fontFamily: 'monospace', fontSize: '11px' }}>
                        {JSON.stringify(schemaResult.parsedObject, null, 2)}
                      </Card>
                    ) : (
                      <Stack gap={2}>
                        {schemaResult.errors.map((err, eIdx) => (
                          <Card key={eIdx} style={{ padding: '8px 10px', background: 'rgba(255,77,77,0.1)', border: '1px solid #ef4444', color: '#ef4444', fontSize: '11px' }}>
                            ⚠️ {err}
                          </Card>
                        ))}
                      </Stack>
                    )}
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: RETRY, TEMP & FALLBACK SIMULATOR ─── */}
        {activeSubTab === 'fallback' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔄 Exponential Backoff, Temp Escalation & Multi-Vendor Failover</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Simulate API failures (429 Rate Limits, Timeouts, Content Moderation refusals) and test how backoff retries, temperature step escalation ($0.0 \rightarrow 0.3$), and multi-provider chains (`OpenAI ➔ Gemini ➔ Claude ➔ Local Ollama`) guarantee 99.9% uptime.
                  </p>
                </div>

                <Flex gap={4} align="center">
                  <label style={{ fontSize: '12px', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input type="checkbox" checked={failPrimary} onChange={e => setFailPrimary(e.target.checked)} />
                    Simulate OpenAI Failure (429 Rate Limit)
                  </label>
                  <label style={{ fontSize: '12px', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input type="checkbox" checked={failSecondary} onChange={e => setFailSecondary(e.target.checked)} />
                    Simulate Gemini Failure (Content Refusal)
                  </label>
                </Flex>

                <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                  <Flex justify="space-between" align="center" style={{ marginBottom: '12px' }}>
                    <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: '#3A9B9F' }}>
                      RELIABILITY EXECUTION TRACE (Total Attempts: {fallbackResult.totalAttempts})
                    </strong>
                    <Badge variant="subtle" style={{ background: 'rgba(46,204,140,0.15)', color: '#3A9B9F' }}>
                      Resolved Via: {fallbackResult.finalProvider}
                    </Badge>
                  </Flex>

                  <Stack gap={2}>
                    {fallbackResult.attempts.map((att, idx) => (
                      <Card key={idx} style={{ padding: '10px 14px', background: '#090d16', borderLeft: `4px solid ${att.status === 'SUCCESS' ? '#5EC4C8' : '#ef4444'}` }}>
                        <Flex justify="space-between" align="center">
                          <span style={{ fontSize: '11px', color: '#3A9B9F', fontFamily: 'monospace' }}>
                            Attempt {att.attempt}: {att.provider} (Temp={att.temperature})
                          </span>
                          <Badge variant="subtle" style={{ background: att.status === 'SUCCESS' ? 'rgba(46,204,140,0.15)' : 'rgba(255,77,77,0.15)', color: att.status === 'SUCCESS' ? '#5EC4C8' : '#ef4444', fontSize: '9px' }}>
                            {att.status}
                          </Badge>
                        </Flex>
                        <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                          {att.log}
                        </div>
                      </Card>
                    ))}
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: PRODUCTION PYTHON CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛠️ Production Python Reliability & Resilience Pipeline</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Complete reference script for implementing multi-provider failover, Pydantic validation, and XML tag extraction in production.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_RELIABILITY_PIPELINE} />

                <Callout type="success">
                  <strong>Responsible AI & Security Certified:</strong> Zero personal author data or unredacted PII is stored or executed in this environment.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      {/* ─── INTERACTIVE ENHANCEMENTS: WORKFLOW + TABLE + ANIMATION ─── */}
      <Stack gap={6} style={{ marginTop: 'var(--ds-space-8)' }}>
        <Reveal variant="rise">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--ds-space-3)' }}>
            <h3 style={{ margin: 0, fontSize: 'var(--ds-font-size-h2)' }}>🔁 Interactive Reliability Playground</h3>
            <Badge variant="module" moduleId="platform">Retry · Fallback · Replay</Badge>
          </div>
          <p style={{ marginTop: 0, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Watch the fault-tolerant dispatch sequence step by step, then inspect every attempt in the table. Hit ▶ Play to animate the failover.
          </p>
        </Reveal>

        <Reveal variant="rise" delay={60}>
          <Workflow
            accent="platform"
            accentLabel="Fault-Tolerant Dispatch"
            title="Retry → Backoff → Provider Failover"
            description="Simulated run: primary rate-limits, retry times out, then failover to a backup provider resolves."
            orientation="vertical"
            steps={SIMULATE_RETRY_FALLBACK(true, false).attempts.map((a) => ({
              title: `Attempt ${a.attempt} · ${a.provider}`,
              description: `${a.log} (temperature ${a.temperature})`,
              icon: a.status === 'SUCCESS' ? '✅' : '⚠️',
              detail: `Status: ${a.status}`,
            }))}
          />
        </Reveal>

        <Reveal variant="rise" delay={120}>
          <DataTable
            caption="Per-Attempt Dispatch Log"
            searchable={false}
            columns={[
              { key: 'attempt', label: '#', numeric: true },
              { key: 'provider', label: 'Provider', sortable: false },
              { key: 'temperature', label: 'Temp', numeric: true },
              { key: 'status', label: 'Status', sortable: false, render: (v) => (
                <span style={{ fontWeight: 700, color: v === 'SUCCESS' ? 'var(--ds-color-state-success-light)' : 'var(--ds-color-state-warning-light)' }}>{v}</span>
              ) },
              { key: 'log', label: 'Log', sortable: false },
            ]}
            rows={SIMULATE_RETRY_FALLBACK(true, false).attempts}
            rowKey={(r) => r.attempt}
          />
        </Reveal>

        <Reveal variant="scale" delay={180}>
          <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)', display: 'flex', gap: 'var(--ds-space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ds-color-text-tertiary)' }}>Target Uptime</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--ds-color-module-platform-primary)' }}>
                <AnimatedNumber value={99.9} decimals={1} suffix="%" />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 200, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Multi-provider failover with exponential backoff keeps the application responsive even when the primary
              API returns <strong>429</strong> rate limits or <strong>timeouts</strong> — the defining property of a reliable LLM system.
            </div>
          </Card>
        </Reveal>
      </Stack>

      </Container>
    </div>
  );
}
