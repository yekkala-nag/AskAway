import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero } from '../components/ui/Content.jsx';
import { Card, Badge, Button } from '../components/ui/Core.jsx';
import { ToolSelectionFramework } from '../components/ui/CleanInfographics.jsx';

const { Container, Grid, Flex, Stack } = Primitives;

const TOOL_CATEGORIES = [
  {
    id: 'images',
    icon: '🎨',
    label: 'AI Image Generation',
    desc: 'Text-to-image, style transfer, inpainting, upscaling',
    color: '#E8836A',
    tools: [
      { name: 'DALL·E 3', use: 'Photorealistic renders, concept art, diagrams from text' },
      { name: 'Midjourney', use: 'Stylized illustrations, brand assets, storyboards' },
      { name: 'Stable Diffusion', use: 'Open-source fine-tuning, LoRA adapters, controlnet' },
      { name: 'Flux', use: 'High-fidelity generation with strong prompt adherence' },
    ],
  },
  {
    id: 'workflows',
    icon: '⚙️',
    label: 'AI Workflows',
    desc: 'Multi-step pipelines, chaining, orchestration',
    color: '#3A9B9F',
    tools: [
      { name: 'LangGraph', use: 'Stateful agent graphs with branching and human-in-the-loop' },
      { name: 'CrewAI', use: 'Multi-agent role-based task delegation' },
      { name: 'n8n + AI', use: 'Visual workflow builder with LLM nodes' },
      { name: 'Dify', use: 'Low-code RAG and agent workflow builder' },
    ],
  },
  {
    id: 'tables',
    icon: '📊',
    label: 'AI Tables & Data',
    desc: 'Structured output, data generation, analysis',
    color: '#9B89C4',
    tools: [
      { name: 'Code Interpreter', use: 'Python-driven data analysis, CSV/Excel processing' },
      { name: 'Tabular LLMs', use: 'Models trained specifically on structured data' },
      { name: 'Synthetic Data Gen', use: 'Privacy-preserving dataset generation' },
      { name: 'Vanna.ai', use: 'Text-to-SQL with natural language queries' },
    ],
  },
  {
    id: 'animations',
    icon: '🎬',
    label: 'AI Animations',
    desc: 'Video generation, motion, character animation',
    color: '#D4956B',
    tools: [
      { name: 'Runway Gen-3', use: 'Text/video-to-video, motion brush, camera control' },
      { name: 'Pika', use: 'Quick video clips from text or image prompts' },
      { name: 'Kling', use: 'Long-form video with consistent character motion' },
      { name: 'Lottie + AI', use: 'Procedural SVG animations from descriptions' },
    ],
  },
  {
    id: 'simulators',
    icon: '🧪',
    label: 'AI Simulators',
    desc: 'Interactive demos, sandboxes, world models',
    color: '#5EC4C8',
    tools: [
      { name: 'World Models', use: 'Predictive environments that learn cause-and-effect' },
      { name: 'Agent Sandboxes', use: 'Safe testing grounds for autonomous agent behavior' },
      { name: 'Jevons Engines', use: 'Decision-making models that optimize resource allocation' },
      { name: 'Interactive Canvas', use: 'Real-time parameter tweaking with instant visual feedback' },
    ],
  },
];

export default function AiGenToolsTab() {
  const [activeCategory, setActiveCategory] = useState('images');
  const [expandedTool, setExpandedTool] = useState(null);
  const active = TOOL_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div style={{ paddingBottom: '32px' }}>
      <Hero
        moduleId="frontiers_production"
        moduleLabel="Frontiers & Production [AI Generation Tools]"
        title="Generate — Images, Workflows, Tables, Animations, Simulators"
        description="AI is no longer just text. Modern systems generate rich, interactive outputs: images, structured data, animated sequences, and live simulators. This tab maps the tooling landscape and connects you to the underlying models and decision-making frameworks."
        metrics={[
          { label: 'Categories', value: '5' },
          { label: 'Tools Mapped', value: '20+' },
          { label: 'Reading', value: '7 articles' },
        ]}
      />

      <Container size="wide">
        <ToolSelectionFramework />
      </Container>

      <Container size="wide">
        {/* Category Selector */}
        <div style={{
          display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px',
          background: '#F7F8FA', padding: '8px', borderRadius: '10px',
          border: '1px solid #E5E7EB'
        }}>
          {TOOL_CATEGORIES.map(cat => (
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
                        <strong>Key capabilities:</strong> {tool.use}. Integrates with standard pipelines and supports both API-based and self-hosted deployment.
                      </div>
                    )}
                  </button>
                ))}
              </Grid>
            </Card>
          </Stack>
        )}

        {/* Context Engineering Callout */}
        <Card style={{
          padding: '20px', marginTop: '24px',
          background: 'linear-gradient(135deg, #3A9B9F08 0%, #9B89C408 100%)',
          border: '1px solid #E5E7EB', borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <span style={{ fontSize: '1.5rem' }}>🧩</span>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '0.95rem', fontWeight: 700, color: '#1A1D26' }}>
                Why Enterprise AI Success Depends on Context Engineering
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#4B5563', lineHeight: 1.6 }}>
                Context engineering is the discipline of designing what information an AI system sees at inference time. It turns raw models into reliable, domain-specific tools. Without it, agents drift, hallucinate, and fail to deliver business value.
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                {['Turn context into AI value', 'Improve reasoning & reliability', 'Reduce agent drift', 'Increase governance'].map((item, i) => (
                  <Badge key={i} variant="subtle" style={{ fontSize: '0.65rem', background: '#3A9B9F18', color: '#1A6B6E', padding: '3px 8px', borderRadius: '9999px' }}>
                    ✓ {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>


        {/* Quick Reference */}
        <Card style={{
          padding: '16px', marginTop: '24px',
          background: '#FAFBFC', border: '1px solid #E5E7EB', borderRadius: '12px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', fontWeight: 700, color: '#1A1D26' }}>
            🚀 Quick Start: Build Your First AI Generator
          </h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { step: '1', label: 'Pick a category above', icon: '👆' },
              { step: '2', label: 'Try a tool from the list', icon: '🔧' },
              { step: '3', label: 'Read the context engineering article', icon: '📖' },
              { step: '4', label: 'Build a workflow that chains generators', icon: '⛓️' },
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
