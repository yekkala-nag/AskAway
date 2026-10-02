import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { Panel, GlassCard } from '../components/ui/CleanInfographics.jsx';
import {
  MCP_CLIENT_PROTOCOL_CONCEPTS,
  REMOTE_SERVERS_CATALOG,
  RUN_STREAMLIT_MCP_SIMULATOR,
  PYTHON_STREAMLIT_MCP_CODE
} from './mcpClientEngine.js';
import MCPTab from './MCPTab.jsx';
import McpIntegrationGuide from './McpIntegrationGuide.jsx';
import { JumpNav, COURSE_SECTIONS } from './mcpInteractive.jsx';

const { Container, Grid, Flex, Stack } = Primitives;

/** Native recreation: web UI ↔ MCP transport engine ↔ remote tool servers. */
function McpClientPanel() {
  const pts = { fontSize: 12.5, color: '#CBD5E1', lineHeight: 1.65, margin: '6px 0 0', paddingLeft: 16 };
  return (
    <Panel
      title="MCP Client Development — UI, Transport Engine, Remote Servers"
      sub="A web frontend drives a protocol engine that negotiates transports, calls tools, and normalizes responses from remote servers."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
        <GlassCard color="#3A9B9F" icon="send" title="1. Web UI Frontend">
          <ul style={pts}>
            <li>Topic input for queries</li>
            <li>API key manager</li>
            <li>Server selector</li>
          </ul>
        </GlassCard>
        <GlassCard color="#D97706" icon="cpu" title="2. Transport & Protocol Engine">
          <ul style={pts}>
            <li>JSON-RPC 2.0 handshake</li>
            <li>Stdio / server-sent-event transports</li>
            <li>Dynamic tool calling + structured responses</li>
          </ul>
        </GlassCard>
        <GlassCard color="#9B89C4" icon="globe" title="3. Remote Tool Servers">
          <ul style={pts}>
            <li>Code summarizer service</li>
            <li>Model recommender service</li>
            <li>Enterprise vector store</li>
          </ul>
        </GlassCard>
      </div>
    </Panel>
  );
}

export default function MCPClientTab() {
  const [activeSubTab, setActiveSubTab] = useState('course'); // 'course' | 'guide' | 'protocol' | 'catalog' | 'simulator' | 'code'

  // Simulator state
  const [selectedServerId, setSelectedServerId] = useState('huggingface');
  const [userTopicInput, setUserTopicInput] = useState('sentiment analysis');

  const simResult = RUN_STREAMLIT_MCP_SIMULATOR(selectedServerId, userTopicInput);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="agents_frameworks"
        moduleLabel="Agent Systems & Frameworks [Model Context Protocol]"
        title="Model Context Protocol (MCP)"
        description="The open standard for connecting AI apps to tools and data: protocol course (architecture, primitives, security, production) plus a hands-on Streamlit MCP client that talks to remote servers (DeepWiki, HuggingFace, Supabase)."
        metrics={[
          { label: 'Protocol', value: 'Model Context Protocol' },
          { label: 'Message format', value: 'JSON-RPC 2.0' },
          { label: 'Transports', value: 'stdio & Streamable HTTP' },
          { label: 'Primitives', value: 'Tools · Resources · Prompts' }
        ]}
      />

      <Container size="wide">
        {/* ARCHITECTURAL INFOGRAPHIC DIAGRAM */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <McpClientPanel />
        </div>

        {/* STICKY NAV STACK — subtabs + course jump-nav stay visible while scrolling */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: 'var(--ds-color-bg-canvas)',
          margin: '0 calc(-1 * clamp(16px, 3vw, 24px))',
          padding: '0 clamp(16px, 3vw, 24px) var(--ds-space-3)',
          boxShadow: '0 10px 18px -14px rgba(22, 40, 63, 0.25)'
        }}>
          <div style={{
            display: 'flex',
            gap: 'var(--ds-space-2)',
            margin: 'var(--ds-space-2) 0 0',
            background: 'var(--ds-color-bg-surface)',
            padding: 'var(--ds-space-2)',
            borderRadius: 'var(--ds-radius-lg)',
            border: '1px solid var(--ds-color-border-subtle)',
            overflowX: 'auto'
          }}>
            {[
              { id: 'course', icon: '📘', label: '1. MCP Course', desc: 'Protocol, architecture, security, production' },
              { id: 'guide', icon: '🧭', label: '2. Integration Guide', desc: 'MCP inside AskAway — SDK, governance, use cases' },
              { id: 'protocol', icon: '🔌', label: '3. Client vs Server Protocol', desc: 'JSON-RPC 2.0 & SSE Transports' },
              { id: 'catalog', icon: '🌐', label: '4. Remote MCP Servers Catalog', desc: 'DeepWiki, HuggingFace & Supabase' },
              { id: 'simulator', icon: '💻', label: '5. Streamlit Client App Simulator', desc: 'Interactive UI tool runner' },
              { id: 'code', icon: '🛠️', label: '6. Production Python & Streamlit Code', desc: 'OpenAI & dotenv bindings' }
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

          {activeSubTab === 'course' && (
            <div style={{ marginTop: 'var(--ds-space-2)' }}>
              <JumpNav sections={COURSE_SECTIONS} />
            </div>
          )}
        </div>

        {/* ─── SUBTAB 1: MCP COURSE ─── */}
        {activeSubTab === 'course' && <MCPTab />}

        {/* ─── SUBTAB 2: INTEGRATION GUIDE ─── */}
        {activeSubTab === 'guide' && <McpIntegrationGuide />}

        {/* ─── SUBTAB 3: CLIENT VS SERVER PROTOCOL ─── */}
        {activeSubTab === 'protocol' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔌 MCP Client vs Server Architecture & Protocol Handshake</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    MCP Servers expose tools, resources, and prompts over standardized APIs. MCP Clients provide the user interface, handle local/remote transport layers (Stdio / SSE), and dispatch JSON-RPC 2.0 tool calls.
                  </p>
                </div>

                <Stack gap={3}>
                  {MCP_CLIENT_PROTOCOL_CONCEPTS.map((c, idx) => (
                    <Card key={idx} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid var(--ds-color-module-foundations-primary)' }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-module-foundations-dark)' }}>{c.concept}</strong>
                        <Badge variant="subtle" style={{ fontSize: '9px', fontFamily: 'monospace' }}>JSON-RPC 2.0</Badge>
                      </Flex>

                      <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Server Responsibility:</div>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-primary)' }}>{c.serverRole}</div>
                        </div>

                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Client Responsibility (Streamlit):</div>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-module-foundations-dark)' }}>{c.clientRole}</div>
                        </div>
                      </Grid>

                      <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--ds-color-state-warning-light)', fontStyle: 'italic' }}>
                        Analogy: {c.analogy}
                      </div>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: REMOTE MCP SERVERS CATALOG ─── */}
        {activeSubTab === 'catalog' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🌐 Remote MCP Servers Catalogue</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Connect your Streamlit MCP Client to specialized remote servers published online for code summarization, model recommendation, and database access.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  {REMOTE_SERVERS_CATALOG.map((srv) => (
                    <Card key={srv.id} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid var(--ds-color-module-foundations-primary)' }}>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-module-foundations-dark)', display: 'block', marginBottom: '4px' }}>
                        {srv.name}
                      </strong>
                      <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--ds-color-module-foundations-dark)', marginBottom: '8px', wordBreak: 'break-all' }}>
                        {srv.url}
                      </div>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '0 0 8px 0' }}>
                        {srv.specialty}
                      </p>
                      <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)' }}>Exposed Tools:</div>
                      <Flex gap={1} style={{ flexWrap: 'wrap', marginTop: '4px' }}>
                        {srv.sampleTools.map((t, tIdx) => (
                          <Badge key={tIdx} variant="subtle" style={{ fontSize: '8px', fontFamily: 'monospace' }}>{t}</Badge>
                        ))}
                      </Flex>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 5: STREAMLIT CLIENT APP SIMULATOR ─── */}
        {activeSubTab === 'simulator' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>💻 Streamlit MCP Client Web App Simulator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Simulate the interactive Streamlit web frontend: enter a topic, pick a remote MCP server, and inspect the resulting JSON-RPC 2.0 tool execution.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 2fr' }} gap="var(--ds-space-4)">
                  {/* Streamlit Sidebar Controls Mock */}
                  <Card style={{ padding: '14px', background: 'var(--ds-color-brand-editor)', border: '1px solid var(--ds-color-border-subtle)' }}>
                    <strong style={{ fontSize: '11px', color: 'var(--ds-color-state-warning-dark)', display: 'block', marginBottom: '10px' }}>
                      STREAMLIT SIDEBAR CONTROLS:
                    </strong>

                    <Stack gap={3}>
                      <div>
                        <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                          Select MCP Server:
                        </label>
                        <select
                          value={selectedServerId}
                          onChange={e => setSelectedServerId(e.target.value)}
                          style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '11px' }}
                        >
                          {REMOTE_SERVERS_CATALOG.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                          User Query Topic:
                        </label>
                        <input
                          type="text"
                          value={userTopicInput}
                          onChange={e => setUserTopicInput(e.target.value)}
                          style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '11px' }}
                        />
                      </div>
                    </Stack>
                  </Card>

                  {/* Streamlit Main App Render */}
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid var(--ds-color-module-foundations-primary)' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-module-foundations-dark)' }}>
                        STREAMLIT MAIN APP RENDER
                      </strong>
                      <Badge variant="subtle" style={{ background: 'var(--ds-color-module-foundations-light)', color: 'var(--ds-color-module-foundations-dark)', fontSize: '9px' }}>
                        CONNECTED: {simResult.server.id.toUpperCase()}
                      </Badge>
                    </Flex>

                    <CodeBlock
                      code={JSON.stringify(simResult.simulatedResponse, null, 2)}
                      language="json"
                      filename="RESPONSE"
                      showLineNumbers={false}
                      style={{ marginBottom: '10px' }}
                    />

                    <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>
                      Generated MCP Protocol JSON-RPC 2.0 Request Payload:
                    </div>
                    <CodeBlock
                      code={JSON.stringify(simResult.jsonRpcPayload, null, 2)}
                      language="json"
                      filename="JSON-RPC REQUEST"
                      showLineNumbers={false}
                    />
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 6: PRODUCTION PYTHON & STREAMLIT CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛠️ Production Streamlit Python MCP Client Code</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Complete reference script for building a Streamlit MCP Web App connecting to remote DeepWiki & HuggingFace MCP servers.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_STREAMLIT_MCP_CODE} />

                <Callout type="success">
                  <strong>Responsible AI & Security Certified:</strong> API keys are loaded securely from `.env` environment variables without hardcoding. Zero personal author details or unredacted PII.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
