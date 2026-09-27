import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero } from '../components/ui/Content.jsx';
import { Card, Badge, Button } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';

const { Container, Grid, Flex, Stack } = Primitives;

const DECISION_AREAS = [
  {
    id: 'action_primitives',
    icon: '⚡',
    label: 'Tool Calling vs Code Execution',
    desc: 'Choosing the right action primitive for AI agents',
    color: '#E8836A',
    tools: [
      { name: 'Tool Calling', use: 'Structured API invocations with typed schemas — best for external service integration' },
      { name: 'Code Execution', use: 'Sandboxed runtime for arbitrary logic — best for complex computations and transformations' },
      { name: 'Hybrid Approach', use: 'Tools for simple actions, code for complex branching — combine strengths of both' },
      { name: 'Decision Heuristic', use: 'If input/output fits a schema → tool call. If it needs loops/conditionals → code execution' },
    ],
  },
  {
    id: 'adaptation',
    icon: '🎯',
    label: 'RAG vs Fine-Tuning',
    desc: 'When to retrieve knowledge vs encode it in weights',
    color: '#3A9B9F',
    tools: [
      { name: 'Use RAG When', use: 'Knowledge changes frequently, sources must be cited, or data is too large for context' },
      { name: 'Use Fine-Tuning When', use: 'You need consistent style/tone, domain-specific reasoning patterns, or latency is critical' },
      { name: 'Use Both When', use: 'Enterprise systems needing both domain expertise (fine-tune) and current facts (RAG)' },
      { name: 'Cost Comparison', use: 'RAG: pay per query. Fine-tune: pay upfront, cheaper per query at scale' },
    ],
  },
  {
    id: 'agent_test',
    icon: '🧪',
    label: 'Agent vs Workflow',
    desc: 'The practical test for when you need an AI agent',
    color: '#9B89C4',
    tools: [
      { name: 'Workflow Wins', use: 'Deterministic steps, known failure modes, predictable inputs/outputs' },
      { name: 'Agent Wins', use: 'Ambiguous goals, dynamic tool selection, multi-step reasoning with branching' },
      { name: 'The Test', use: 'Can you write the steps in pseudocode without an LLM? If yes → workflow. If no → agent' },
      { name: 'Common Mistake', use: 'Using agents for tasks that are really just if/else chains with API calls' },
    ],
  },
  {
    id: 'drift',
    icon: '📉',
    label: 'Embedding Drift Monitoring',
    desc: 'Detecting when your vector representations degrade',
    color: '#D4956B',
    tools: [
      { name: 'Statistical Monitoring', use: 'Track cosine similarity distributions over time — alert on distribution shift' },
      { name: 'Performance Correlation', use: 'Link embedding drift to downstream task metrics — catch degradation early' },
      { name: 'A/B Testing', use: 'Compare old vs new embeddings on golden test sets before deploying changes' },
      { name: 'Versioning Strategy', use: 'Tag embeddings with model version — enable rollback when drift detected' },
    ],
  },
  {
    id: 'protocols',
    icon: '🔌',
    label: 'MCP & Interoperability',
    desc: 'Model Context Protocol and agent communication standards',
    color: '#5EC4C8',
    tools: [
      { name: 'MCP Basics', use: 'Standardized protocol for tool discovery and invocation between agents and services' },
      { name: 'Tool Registration', use: 'Declare capabilities with schemas — agents discover what they can call' },
      { name: 'Cross-Agent Comms', use: 'A2A (agent-to-agent) protocol for multi-agent coordination and handoffs' },
      { name: 'Security Model', use: 'Authentication, rate limiting, and audit trails for every tool invocation' },
    ],
  },
  {
    id: 'typesafe',
    icon: '🛡️',
    label: 'Typesafe AI & JEV',
    desc: 'Type-safe agent outputs and Jevons Engine optimization',
    color: '#F0A89A',
    tools: [
      { name: 'Typed Outputs', use: 'Enforce output schemas at inference — catch errors before they propagate' },
      { name: 'JEV Optimization', use: 'Jevons Engines optimize resource allocation across AI pipeline components' },
      { name: 'Validation Layers', use: 'Runtime type checking, format verification, semantic constraints' },
      { name: 'Error Recovery', use: 'Graceful fallbacks when typed outputs fail validation — retry, rephrase, or abstain' },
    ],
  },
];

const READING_LIST = [
  {
    title: 'Tool Calling vs Code Execution for AI Agents',
    url: 'https://machinelearningmastery.com/tool-calling-vs-code-execution-for-ai-agents-choosing-the-right-action-primitive/',
    tag: 'Action Primitives',
    desc: 'When to use structured tool calls vs sandboxed code execution — the decision framework for agent actions.',
  },
  {
    title: 'RAG vs Fine-Tuning for Domain Adaptation',
    url: 'https://machinelearningmastery.com/rag-vs-fine-tuning-for-domain-adaptation-when-to-use-which/',
    tag: 'Adaptation',
    desc: 'The practical guide to choosing between retrieval augmentation and fine-tuning for your domain.',
  },
  {
    title: 'Agent or Workflow? A Practical Test',
    url: 'https://machinelearningmastery.com/agent-or-workflow-a-practical-test-for-knowing-when-you-actually-need-an-ai-agent/',
    tag: 'Architecture',
    desc: 'A simple test to determine if your task actually needs an AI agent or just a well-designed workflow.',
  },
  {
    title: 'Monitoring Embedding Drift in Production',
    url: 'https://machinelearningmastery.com/monitoring-embedding-drift-in-production-scikit-llm-pipelines/',
    tag: 'Monitoring',
    desc: 'How to detect and respond to embedding drift before it degrades your RAG pipeline performance.',
  },
  {
    title: 'What Everyone Gets Wrong About Typesafe AI',
    url: 'https://www.kdnuggets.com/what-everyone-is-getting-wrong-about-typesafe-ais-jev',
    tag: 'Typesafe AI',
    desc: 'Common misconceptions about type-safe AI systems and Jevons Engine optimization.',
  },
  {
    title: 'MCP Explained in 5 Minutes',
    url: 'https://www.kdnuggets.com/mcp-explained-in-5-minutes',
    tag: 'MCP',
    desc: 'Quick primer on Model Context Protocol — the standard for agent-tool communication.',
  },
];

export default function AiArchDecisionsTab() {
  const [activeCategory, setActiveCategory] = useState('action_primitives');
  const [expandedTool, setExpandedTool] = useState(null);
  const active = DECISION_AREAS.find(c => c.id === activeCategory);

  return (
    <div style={{ paddingBottom: '32px' }}>
      <Hero
        moduleId="frontiers_production"
        moduleLabel="Frontiers & Production [AI Architecture Decisions]"
        title="AI Architecture Decisions — RAG vs Fine-Tune, Agent vs Workflow, Tool Calling"
        desc="Every AI system faces the same architectural crossroads: retrieve or encode? Agent or workflow? Tool call or code execution? This tab maps the decision landscape with practical frameworks, not hype."
        metrics={[
          { label: 'Decisions', value: '6' },
          { label: 'Patterns Mapped', value: '24+' },
          { label: 'Reading', value: '6 articles' },
        ]}
      />

      <div style={{ marginBottom: '24px' }}>
        <DiagramImage
          moduleId="frontiers_production"
          src="/assets/llm_rag_agent_comparison.png"
          alt="LLM vs RAG vs AI Agent vs Agentic AI"
          title="Architecture Comparison — LLM, RAG, Agent, Agentic AI"
          caption="From basic LLM inference to full agentic systems: understanding when to use each architectural paradigm."
          background="#090d16"
          maxWidth={1100}
        />
      </div>

      <Container size="wide">
        {/* Category Selector */}
        <div style={{
          display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px',
          background: '#F7F8FA', padding: '8px', borderRadius: '10px',
          border: '1px solid #E5E7EB'
        }}>
          {DECISION_AREAS.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setExpandedTool(null); }}
              style={{
                flex: 1, minWidth: '140px', padding: '10px 14px',
                borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: activeCategory === cat.id ? cat.color : 'transparent',
                color: activeCategory === cat.id ? '#ffffff' : '#4B5563',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontSize: '1.1rem', marginBottom: '2px' }}>{cat.icon}</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{cat.label}</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.75, marginTop: '2px' }}>{cat.desc}</div>
            </button>
          ))}
        </div>

        {/* Active Category Tools */}
        {active && (
          <Stack gap={6}>
            <Card style={{ padding: '20px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.3rem' }}>{active.icon}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1A1D26' }}>{active.label}</h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#9CA3AF' }}>{active.desc}</p>
                </div>
              </div>

              <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="16px">
                {active.tools.map((tool, i) => (
                  <button
                    key={i}
                    onClick={() => setExpandedTool(expandedTool === i ? null : i)}
                    style={{
                      textAlign: 'left', padding: '14px', borderRadius: '8px',
                      border: `1px solid ${expandedTool === i ? active.color : '#E5E7EB'}`,
                      background: expandedTool === i ? `${active.color}08` : '#FAFBFC',
                      cursor: 'pointer', transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '0.85rem', color: '#1A1D26' }}>{tool.name}</strong>
                      <span style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>{expandedTool === i ? '▲' : '▼'}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '4px' }}>{tool.use}</div>
                    {expandedTool === i && (
                      <div style={{
                        marginTop: '10px', padding: '10px', borderRadius: '6px',
                        background: '#F1F3F5', fontSize: '0.72rem', color: '#4B5563',
                        lineHeight: 1.5
                      }}>
                        <strong>Practical tip:</strong> {tool.use}. Start simple, add complexity only when the simpler approach fails.
                      </div>
                    )}
                  </button>
                ))}
              </Grid>
            </Card>
          </Stack>
        )}

        {/* Decision Framework Callout */}
        <Card style={{
          padding: '20px', marginTop: '24px',
          background: 'linear-gradient(135deg, #3A9B9F08 0%, #9B89C408 100%)',
          border: '1px solid #E5E7EB', borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <span style={{ fontSize: '1.5rem' }}>🧭</span>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', fontWeight: 700, color: '#1A1D26' }}>
                The Architecture Decision Framework
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#4B5563', lineHeight: 1.6 }}>
                Good AI architecture isn't about picking the fanciest tool — it's about matching the right primitive to the problem. Most failures come from over-engineering: using agents for workflows, RAG for style, or code execution for simple API calls.
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                {['Start with the simplest approach', 'Measure before you upgrade', 'Failures teach more than successes'].map((item, i) => (
                  <Badge key={i} variant="subtle" style={{ fontSize: '0.65rem', background: '#3A9B9F18', color: '#1A6B6E', padding: '3px 8px', borderRadius: '9999px' }}>
                    ✓ {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Reading List */}
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1A1D26', marginBottom: '12px' }}>
            📚 Essential Reading
          </h3>
          <Grid columns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }} gap="12px">
            {READING_LIST.map((article, i) => (
              <a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', padding: '14px', borderRadius: '8px',
                  border: '1px solid #E5E7EB', background: '#FFFFFF',
                  textDecoration: 'none', color: 'inherit',
                  transition: 'all 0.15s ease', cursor: 'pointer'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#3A9B9F'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(58,155,159,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <Badge variant="subtle" style={{ fontSize: '0.6rem', background: '#F1F3F5', color: '#6B7280', padding: '2px 6px', borderRadius: '4px' }}>
                    {article.tag}
                  </Badge>
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1A1D26', lineHeight: 1.3, marginBottom: '4px' }}>
                  {article.title}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#9CA3AF', lineHeight: 1.4 }}>
                  {article.desc}
                </div>
                <div style={{ fontSize: '0.62rem', color: '#3A9B9F', marginTop: '6px' }}>
                  Read article →
                </div>
              </a>
            ))}
          </Grid>
        </div>

        {/* Quick Reference */}
        <Card style={{
          padding: '16px', marginTop: '24px',
          background: '#FAFBFC', border: '1px solid #E5E7EB', borderRadius: '12px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', fontWeight: 700, color: '#1A1D26' }}>
            🚀 Quick Start: Make Better Architecture Decisions
          </h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { step: '1', label: 'List your current AI components', icon: '📋' },
              { step: '2', label: 'Apply the Agent vs Workflow test', icon: '🧪' },
              { step: '3', label: 'Evaluate RAG vs fine-tune needs', icon: '⚖️' },
              { step: '4', label: 'Add embedding drift monitoring', icon: '📉' },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, minWidth: '160px', padding: '10px 14px',
                borderRadius: '8px', background: '#FFFFFF', border: '1px solid #E5E7EB',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: '0.6rem', color: '#9CA3AF', fontWeight: 600 }}>STEP {s.step}</div>
                  <div style={{ fontSize: '0.75rem', color: '#1A1D26', fontWeight: 500 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Container>
    </div>
  );
}
