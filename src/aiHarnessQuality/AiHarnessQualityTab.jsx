import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero } from '../components/ui/Content.jsx';
import { Card, Badge, Button } from '../components/ui/Core.jsx';

const { Container, Grid, Flex, Stack } = Primitives;

const TOPIC_AREAS = [
  {
    id: 'null_returns',
    icon: '🚫',
    label: 'When the Answer is Nothing',
    desc: 'Handling empty, null, and abstention responses in pipelines',
    color: '#E8836A',
    tools: [
      { name: 'Abstention Logic', use: 'Train models to say "I don\'t know" instead of hallucinating' },
      { name: 'Null Return Protocols', use: 'Define what happens when retrieval finds nothing relevant' },
      { name: 'Confidence Thresholds', use: 'Score uncertainty and route low-confidence answers to fallbacks' },
      { name: 'Graceful Degradation', use: 'Partial answers, related results, or explicit "no answer" states' },
    ],
  },
  {
    id: 'harnesses',
    icon: '🔒',
    label: 'AI Harnesses & Guardrails',
    desc: 'Building truthful, constrained, and verifiable AI systems',
    color: '#3A9B9F',
    tools: [
      { name: 'Output Validators', use: 'Schema checks, format enforcement, semantic constraints' },
      { name: 'Factuality Rails', use: 'Cross-reference claims against source documents at inference' },
      { name: 'Behavioral Harnesses', use: 'Define allowed actions, tool boundaries, and escalation rules' },
      { name: 'Audit Trails', use: 'Log every decision, prompt, and output for post-hoc review' },
    ],
  },
  {
    id: 'coding_agents',
    icon: '💻',
    label: 'Coding Agent Optimization',
    desc: 'Maximizing value from AI coding subscriptions and tools',
    color: '#9B89C4',
    tools: [
      { name: 'Subscription Stacking', use: 'Combine Copilot, Cursor, Claude for complementary strengths' },
      { name: 'Prompt Templates', use: 'Reusable context frames that reduce token waste per task' },
      { name: 'Task Decomposition', use: 'Break large features into agent-sized chunks with clear acceptance criteria' },
      { name: 'Cost Monitoring', use: 'Track per-task spend, identify high-value vs wasteful patterns' },
    ],
  },
  {
    id: 'pipeline_returns',
    icon: '📊',
    label: 'Pipeline Return Design',
    desc: 'Structuring what comes back from multi-stage AI systems',
    color: '#D4956B',
    tools: [
      { name: 'Typed Outputs', use: 'Structured JSON/schemas instead of free-form text' },
      { name: 'Partial Results', use: 'Return what you have when full completion fails' },
      { name: 'Confidence Scoring', use: 'Attach reliability metadata to every output' },
      { name: 'Fallback Chains', use: 'Ordered alternatives when primary pipeline returns empty' },
    ],
  },
  {
    id: 'verification',
    icon: '✅',
    label: 'Output Verification',
    desc: 'Testing, validating, and certifying AI outputs before production',
    color: '#5EC4C8',
    tools: [
      { name: 'Golden Dataset Testing', use: 'Compare outputs against known-correct answers' },
      { name: 'Adversarial Probing', use: 'Automated red-teaming to find failure modes' },
      { name: 'Regression Suites', use: 'Ensure new changes don\'t break existing good outputs' },
      { name: 'Human Spot Checks', use: 'Targeted sampling of outputs for quality assurance' },
    ],
  },
];

const READING_LIST = [
  {
    title: 'When the Correct Answer is Nothing',
    url: 'https://towardsdatascience.com/when-the-correct-answer-is-nothing-what-does-your-pipeline-return/',
    tag: 'Null Returns',
    desc: 'What your pipeline should return when retrieval finds nothing — and why "I don\'t know" is a feature, not a bug.',
  },
  {
    title: 'Beyond RAGs: Building Actually Truthful AI Harnesses',
    url: 'https://towardsdatascience.com/beyond-rags-building-actually-truthful-ai-harnesses/',
    tag: 'AI Harnesses',
    desc: 'Moving from retrieval-augmented generation to constrained, verifiable AI systems that stay truthful.',
  },
  {
    title: 'How to Maximize Your Coding Agent Subscriptions',
    url: 'https://towardsdatascience.com/how-to-maximize-your-coding-agent-subscriptions/',
    tag: 'Coding Agents',
    desc: 'Strategic use of Copilot, Cursor, and Claude to get the most value from AI coding tools.',
  },
];

export default function AiHarnessQualityTab() {
  const [activeCategory, setActiveCategory] = useState('harnesses');
  const [expandedTool, setExpandedTool] = useState(null);
  const active = TOPIC_AREAS.find(c => c.id === activeCategory);

  return (
    <div style={{ paddingBottom: '32px' }}>
      <Hero
        moduleId="frontiers_production"
        moduleLabel="Frontiers & Production [AI Quality & Harnesses]"
        title="AI Quality — Harnesses, Null Returns, and Coding Agent Value"
        description="The hardest part of AI isn't generating answers — it's knowing when to stop, what to return when there's nothing, and how to constrain systems to stay truthful. This tab covers the engineering of AI quality: harnesses, null returns, pipeline design, and getting maximum value from coding agent subscriptions."
        metrics={[
          { label: 'Topics', value: '5' },
          { label: 'Tools Mapped', value: '20+' },
          { label: 'Reading', value: '3 articles' },
        ]}
      />

      <Container size="wide">
        {/* Category Selector */}
        <div style={{
          display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px',
          background: '#F7F8FA', padding: '8px', borderRadius: '10px',
          border: '1px solid #E5E7EB'
        }}>
          {TOPIC_AREAS.map(cat => (
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
                        <strong>Why it matters:</strong> {tool.use}. Implementing this reduces failure modes and builds user trust in AI systems.
                      </div>
                    )}
                  </button>
                ))}
              </Grid>
            </Card>
          </Stack>
        )}

        {/* Core Principles Callout */}
        <Card style={{
          padding: '20px', marginTop: '24px',
          background: 'linear-gradient(135deg, #3A9B9F08 0%, #9B89C408 100%)',
          border: '1px solid #E5E7EB', borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', fontWeight: 700, color: '#1A1D26' }}>
                The Three Pillars of AI Quality Engineering
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#4B5563', lineHeight: 1.6 }}>
                Reliable AI systems aren't built by prompting alone. They require deliberate engineering around what happens when things go wrong, how outputs are constrained, and whether you can verify correctness before users see it.
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                {['Know when to say nothing', 'Constrain before you generate', 'Verify before you ship'].map((item, i) => (
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
            🚀 Quick Start: Improve Your Pipeline Returns
          </h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { step: '1', label: 'Audit current null/empty returns', icon: '🔍' },
              { step: '2', label: 'Add confidence scoring to outputs', icon: '📊' },
              { step: '3', label: 'Implement fallback chains', icon: '⛓️' },
              { step: '4', label: 'Build verification test suite', icon: '✅' },
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
