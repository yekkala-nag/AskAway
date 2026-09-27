import React, { useState, useEffect, useRef } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero } from '../components/ui/Content.jsx';
import { Card, Badge, Button } from '../components/ui/Core.jsx';
import {
  PARTS,
  COMPONENTS,
  STD_DATA,
  GLOSSARY,
  QUIZ_QUESTIONS,
  LOOP_TYPES,
  PROCESS_STEPS,
  FAULTS
} from './aiHarnessData.js';
import DataTable from '../components/ui/DataTable.jsx';
import Workflow from '../components/ui/Workflow.jsx';
import { Reveal, AnimatedNumber } from '../components/ui/AnimatedReveal.jsx';

const { Container, Grid, Flex, Stack } = Primitives;

const LR_MAP = [1e-5, 3e-5, 1e-4, 3e-4, 1e-3, 3e-3, 1e-2, 3e-2, 1e-1, 3e-1, 1, 3];
const BATCH_MAP = [4, 8, 16, 32, 64, 128, 256, 512];

export default function AIHarnessTab() {
  const [activeMainTab, setActiveMainTab] = useState('home'); // 'home' | 'anatomy' | 'components' | 'standards' | 'glossary' | 'quiz' | 'loop'

  // Anatomy state
  const [selectedPartId, setSelectedPartId] = useState('boundary');

  // Components state
  const [compFilter, setCompFilter] = useState('all');

  // Standards state
  const [selectedStd, setSelectedStd] = useState('evals');

  // Glossary state
  const [glossarySearch, setGlossarySearch] = useState('');
  const [glossaryAlpha, setGlossaryAlpha] = useState('');

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  // Loop Subtabs state
  const [loopSubTab, setLoopSubTab] = useState('types'); // 'types' | 'simulator' | 'process' | 'faults'
  const [selectedLoopType, setSelectedLoopType] = useState('supervised');

  // Training Simulator state
  const [simLrIdx, setSimLrIdx] = useState(4); // 1e-3
  const [simBatchIdx, setSimBatchIdx] = useState(3); // 32
  const [simOptimizer, setSimOptimizer] = useState('adam');
  const [simLoss, setSimLoss] = useState('ce');
  const [simReg, setSimReg] = useState('l2');
  const [simDepth, setSimDepth] = useState(6);

  // Failure Modes state
  const [openFaults, setOpenFaults] = useState({});

  const canvasRef = useRef(null);

  const selectedPart = PARTS.find(p => p.id === selectedPartId) || PARTS[0];
  const selectedLoop = LOOP_TYPES.find(l => l.id === selectedLoopType) || LOOP_TYPES[0];

  const toggleFault = (idx) => {
    setOpenFaults(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Simulator Calculations & Canvas Draw
  const currentLr = LR_MAP[Math.min(simLrIdx, LR_MAP.length - 1)];
  const currentBatch = BATCH_MAP[Math.min(simBatchIdx, BATCH_MAP.length - 1)];

  const lrScore = currentLr >= 1e-5 && currentLr <= 3e-3 ? 1.0 : currentLr > 3e-3 ? 0.4 : 0.6;
  const optBonus = { sgd: 0.6, momentum: 0.78, adam: 1.0, adamw: 1.05, rmsprop: 0.88 }[simOptimizer];
  const batchFactor = currentBatch <= 16 ? 0.85 : currentBatch <= 128 ? 1.0 : 0.92;
  const depthPenalty = simDepth > 8 ? 0.9 : 1.0;
  const regBonus = { none: 0.85, l2: 1.0, dropout: 0.95, both: 1.05 }[simReg];

  const stability = Math.min(1, lrScore * optBonus * batchFactor * depthPenalty * regBonus);
  const convergenceSpeed = Math.round(stability * 90 + 10);
  const finalLoss = (1 - stability * 0.85).toFixed(3);
  const gpuUtil = Math.min(100, Math.round(currentBatch * simDepth * 1.2));
  const memGB = (simDepth * 0.8 + currentBatch * 0.05).toFixed(1);
  const overfit = simReg === 'none' ? 'HIGH' : simReg === 'both' ? 'LOW' : 'MED';

  const explodes = currentLr > 3e-2 && (simOptimizer === 'sgd' || simOptimizer === 'momentum');
  const vanishes = simDepth > 10 && simOptimizer === 'sgd' && currentLr < 1e-4;
  const slowConv = currentLr < 1e-4 && simOptimizer === 'sgd';

  // Draw Canvas Loss Curve
  useEffect(() => {
    if (activeMainTab === 'loop' && loopSubTab === 'simulator' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const W = canvas.width = canvas.offsetWidth || 600;
      const H = canvas.height = 120;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#1A2130';
      ctx.fillRect(0, 0, W, H);

      const steps = 60;
      const pts = [];

      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        let loss;
        if (explodes && i > 15) {
          loss = 2.5 + i * 0.3 + Math.random() * 0.5;
        } else if (vanishes) {
          loss = 2.3 - t * 0.05 + Math.random() * 0.1;
        } else if (slowConv) {
          loss = 2.3 - t * 0.7 * stability + Math.random() * 0.12;
        } else {
          const warmup = i < 5 ? 2.3 - i * 0.05 : 2.3;
          loss = warmup * Math.exp(-t * stability * 3.5) + (1 - stability) * 0.3 + Math.random() * 0.08;
        }
        pts.push({ x: (i / steps) * W, y: Math.min(H - 6, Math.max(6, H - (loss / 3) * (H - 12))) });
      }

      ctx.strokeStyle = 'rgba(36,46,63,0.8)';
      ctx.lineWidth = 1;
      for (let g = 0; g <= 3; g++) {
        const y = (g / 3) * (H - 12) + 6;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      const color = explodes ? '#FB7185' : stability > 0.75 ? '#C9B8E8' : '#F5A623';
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#6B7A96';
      ctx.font = '10px Space Mono, monospace';
      ctx.fillText('loss', 6, 16);
      ctx.fillText('steps →', W - 60, H - 6);
    }
  }, [activeMainTab, loopSubTab, simLrIdx, simBatchIdx, simOptimizer, simLoss, simReg, simDepth, stability, explodes, vanishes, slowConv]);

  // Quiz Handling
  const handleAnswerQuiz = (idx) => {
    if (quizAnswered) return;
    setSelectedOption(idx);
    setQuizAnswered(true);
    if (idx === QUIZ_QUESTIONS[quizIndex].ans) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex(prev => prev + 1);
      setQuizAnswered(false);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const handleResetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setQuizAnswered(false);
    setSelectedOption(null);
    setQuizFinished(false);
  };

  // Glossary Filters
  const uniqueAlpha = [...new Set(GLOSSARY.map(g => g.term[0]))].sort();
  const filteredGlossary = GLOSSARY.filter(g => {
    const q = glossarySearch.toLowerCase();
    if (glossaryAlpha) {
      return g.term[0].toUpperCase() === glossaryAlpha;
    }
    if (q) {
      return g.term.toLowerCase().includes(q) || g.def.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="data_platform"
        moduleLabel="Data & Platform Layers [AI System Harness & Training Loops]"
        title="AI Engineering Guide — Harness & Training Loops"
        description="Comprehensive interactive reference for understanding how AI systems are architected, connected, and orchestrated — from raw tensors and transformer layers to training loops, backprop dynamics, and production serving pipelines."
        metrics={[
          { label: 'Architecture', value: 'Transformer Stack' },
          { label: 'Training Loops', value: '6 Loop Types' },
          { label: 'Simulator', value: 'Hyperparameter Engine' },
          { label: 'Evaluations', value: 'MMLU / GSM8K / DPO' }
        ]}
      />

      <Container size="wide">
        {/* MAIN NAVIGATION BAR */}
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
            { id: 'home', icon: '🌐', label: '1. Overview Topology' },
            { id: 'anatomy', icon: '🔬', label: '2. System Architecture' },
            { id: 'components', icon: '🧩', label: '3. Core Components' },
            { id: 'standards', icon: '📋', label: '4. Protocols & Evals' },
            { id: 'glossary', icon: '📖', label: '5. AI Glossary' },
            { id: 'quiz', icon: '🎯', label: '6. Harness Quiz' },
            { id: 'loop', icon: '🔁', label: '7. AI Loop Engineering' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveMainTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '150px',
                padding: 'var(--ds-space-3) var(--ds-space-4)',
                borderRadius: 'var(--ds-radius-md)',
                border: 'none',
                background: activeMainTab === tab.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent',
                color: activeMainTab === tab.id ? 'white' : 'var(--ds-color-text-secondary)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all var(--ds-motion-duration-base)',
                fontWeight: activeMainTab === tab.id ? 'var(--ds-font-weight-semibold)' : 'var(--ds-font-weight-medium)',
                fontSize: 'var(--ds-font-size-bodySm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* ─── 1. OVERVIEW TOPOLOGY ─── */}
        {activeMainTab === 'home' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-6)', background: 'var(--ds-color-bg-canvas)', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--ds-font-family-mono)', fontSize: '0.75rem', letterSpacing: '0.2em', color: '#F5A623', marginBottom: '8px', textTransform: 'uppercase' }}>
                Interactive Topology Map
              </div>
              <h2 style={{ fontSize: '2.2rem', margin: '0 0 12px 0', color: 'var(--ds-color-text-primary)' }}>
                Full-Stack <span style={{ color: '#F5A623', fontStyle: 'italic' }}>AI System Harness</span>
              </h2>
              <p style={{ maxWidth: '640px', margin: '0 auto 24px auto', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-body)' }}>
                Visualizing how token streams pass through tokenization, embedding, multi-head attention, KV cache, and output logit decoding.
              </p>

              {/* ANIMATED SVG HARNESS TOPOLOGY */}
              <div style={{ background: '#131820', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '16px', padding: '24px', position: 'relative' }}>
                <svg viewBox="0 0 680 220" width="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="arrH" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0 0 L6 3 L0 6 Z" fill="#F5A623" opacity="0.8"/>
                    </marker>
                    <marker id="arrH2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0 0 L6 3 L0 6 Z" fill="#5EC4C8" opacity="0.8"/>
                    </marker>
                    <marker id="arrH3" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0 0 L6 3 L0 6 Z" fill="#5EC4C8" opacity="0.8"/>
                    </marker>
                  </defs>

                  <line x1="80" y1="110" x2="600" y2="110" stroke="#F5A623" strokeWidth="4" strokeLinecap="round" opacity="0.2"/>
                  <line x1="80" y1="110" x2="600" y2="110" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="8 4" markerEnd="url(#arrH)" />
                  <text x="340" y="102" textAnchor="middle" fill="#F5A623" fontSize="8" fontFamily="monospace" opacity="0.8">DATA / CONTEXT BUS</text>

                  <path d="M160 110 Q160 60 130 38" stroke="#5EC4C8" strokeWidth="1.5" fill="none" opacity="0.8" markerEnd="url(#arrH2)"/>
                  <path d="M270 110 Q270 55 255 32" stroke="#5EC4C8" strokeWidth="1.5" fill="none" opacity="0.8" markerEnd="url(#arrH2)"/>
                  <path d="M400 110 Q400 55 415 32" stroke="#5EC4C8" strokeWidth="1.5" fill="none" opacity="0.8" markerEnd="url(#arrH2)"/>
                  <path d="M520 110 Q520 60 545 38" stroke="#5EC4C8" strokeWidth="1.5" fill="none" opacity="0.8" markerEnd="url(#arrH2)"/>

                  <path d="M220 110 Q220 160 205 182" stroke="#5EC4C8" strokeWidth="1.5" fill="none" opacity="0.8" markerEnd="url(#arrH3)"/>
                  <path d="M460 110 Q460 160 475 182" stroke="#5EC4C8" strokeWidth="1.5" fill="none" opacity="0.8" markerEnd="url(#arrH3)"/>

                  <rect x="28" y="94" width="56" height="32" rx="6" fill="#131820" stroke="#F5A623" strokeWidth="1.5"/>
                  <text x="56" y="108" textAnchor="middle" fill="#F5A623" fontSize="7" fontFamily="monospace">DATA</text>
                  <text x="56" y="119" textAnchor="middle" fill="#F5A623" fontSize="7" fontFamily="monospace">PIPELINE</text>

                  <rect x="604" y="94" width="54" height="32" rx="6" fill="#131820" stroke="#F5A623" strokeWidth="1.5"/>
                  <text x="631" y="108" textAnchor="middle" fill="#F5A623" fontSize="7" fontFamily="monospace">INFER-</text>
                  <text x="631" y="119" textAnchor="middle" fill="#F5A623" fontSize="7" fontFamily="monospace">ENCE</text>

                  <circle cx="160" cy="110" r="5" fill="#5EC4C8"/>
                  <circle cx="270" cy="110" r="5" fill="#5EC4C8"/>
                  <circle cx="400" cy="110" r="6" fill="#F5A623"/>
                  <circle cx="520" cy="110" r="5" fill="#5EC4C8"/>
                  <circle cx="220" cy="110" r="4" fill="#5EC4C8"/>
                  <circle cx="460" cy="110" r="4" fill="#5EC4C8"/>

                  <rect x="100" y="22" width="60" height="22" rx="5" fill="#131820" stroke="#5EC4C8" strokeWidth="1.3"/>
                  <text x="130" y="37" textAnchor="middle" fill="#5EC4C8" fontSize="7" fontFamily="monospace">TOKENISER</text>

                  <rect x="220" y="16" width="70" height="22" rx="5" fill="#131820" stroke="#5EC4C8" strokeWidth="1.3"/>
                  <text x="255" y="31" textAnchor="middle" fill="#5EC4C8" fontSize="7" fontFamily="monospace">EMBEDDING</text>

                  <rect x="378" y="16" width="76" height="22" rx="5" fill="#131820" stroke="#5EC4C8" strokeWidth="1.3"/>
                  <text x="416" y="31" textAnchor="middle" fill="#5EC4C8" fontSize="7" fontFamily="monospace">ATTENTION</text>

                  <rect x="506" y="22" width="78" height="22" rx="5" fill="#131820" stroke="#5EC4C8" strokeWidth="1.3"/>
                  <text x="545" y="37" textAnchor="middle" fill="#5EC4C8" fontSize="7" fontFamily="monospace">FEED-FWRD</text>

                  <rect x="158" y="176" width="95" height="22" rx="5" fill="#131820" stroke="#5EC4C8" strokeWidth="1.3"/>
                  <text x="205" y="191" textAnchor="middle" fill="#5EC4C8" fontSize="7" fontFamily="monospace">KV CACHE / MEM</text>

                  <rect x="428" y="176" width="95" height="22" rx="5" fill="#131820" stroke="#5EC4C8" strokeWidth="1.3"/>
                  <text x="475" y="191" textAnchor="middle" fill="#5EC4C8" fontSize="7" fontFamily="monospace">EVAL / RLHF</text>
                </svg>

                <Flex gap={4} justify="center" style={{ marginTop: '16px', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--ds-color-text-secondary)' }}>
                  <span><strong style={{ color: '#F5A623' }}>—</strong> Data Bus</span>
                  <span><strong style={{ color: '#5EC4C8' }}>●</strong> Model Layers</span>
                  <span><strong style={{ color: '#5EC4C8' }}>●</strong> Memory & Evals</span>
                </Flex>
              </div>

              {/* STATS ROW */}
              <Grid columns={{ base: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-3)" style={{ marginTop: '24px' }}>
                <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#F5A623', fontFamily: 'monospace' }}>~1T</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ds-color-text-tertiary)' }}>Params in Frontier LLMs</div>
                </Card>
                <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#5EC4C8', fontFamily: 'monospace' }}>96+</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ds-color-text-tertiary)' }}>Transformer Layers (GPT-4)</div>
                </Card>
                <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#5EC4C8', fontFamily: 'monospace' }}>3</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ds-color-text-tertiary)' }}>Training Stages (PT➔SFT➔RLHF)</div>
                </Card>
                <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#C9B8E8', fontFamily: 'monospace' }}>128k+</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ds-color-text-tertiary)' }}>Context Window (Tokens)</div>
                </Card>
              </Grid>
            </Card>
          </Stack>
        )}

        {/* ─── 2. SYSTEM ARCHITECTURE (ANATOMY) ─── */}
        {activeMainTab === 'anatomy' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔬 Transformer Subsystem Stack (Anatomy)</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Click any layer in the list or diagram to inspect its parameters, role, and computational interfaces.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 340px' }} gap="var(--ds-space-4)">
                  {/* PARTS LIST */}
                  <Stack gap={3}>
                    {PARTS.map(part => (
                      <Card
                        key={part.id}
                        onClick={() => setSelectedPartId(part.id)}
                        style={{
                          padding: '14px',
                          cursor: 'pointer',
                          background: selectedPartId === part.id ? 'rgba(245,166,35,0.08)' : 'var(--ds-color-bg-surface)',
                          borderLeft: `4px solid ${part.color}`,
                          borderColor: selectedPartId === part.id ? part.color : undefined
                        }}
                      >
                        <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                          <Flex gap={2} align="center">
                            <span style={{ fontSize: '1.2rem' }}>{part.icon}</span>
                            <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>{part.name}</strong>
                          </Flex>
                          <Badge variant="subtle" style={{ background: `${part.color}20`, color: part.color, fontSize: '10px' }}>
                            {part.tag}
                          </Badge>
                        </Flex>
                        <p style={{ margin: 0, fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                          {part.desc}
                        </p>
                      </Card>
                    ))}
                  </Stack>

                  {/* DIAGRAM & DETAIL PANEL */}
                  <Card style={{ padding: '16px', background: '#131820', border: '1px solid var(--ds-color-border-subtle)', position: 'sticky', top: '80px', height: 'fit-content' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '12px' }}>
                      TRANSFORMER CROSS-SECTION:
                    </div>

                    <svg viewBox="0 0 280 290" width="100%">
                      <rect x="20" y="10" width="240" height="270" rx="10" fill="#131820" stroke={selectedPartId === 'boundary' ? '#F5A623' : '#242E3F'} strokeWidth={selectedPartId === 'boundary' ? '2.5' : '1'} style={{ cursor: 'pointer' }} onClick={() => setSelectedPartId('boundary')} />
                      <text x="140" y="28" textAnchor="middle" fill="#F5A623" fontSize="8" fontFamily="monospace">SYSTEM BOUNDARY</text>

                      <rect x="40" y="38" width="200" height="30" rx="6" fill="#0B0E14" stroke={selectedPartId === 'tokeniser' ? '#5EC4C8' : '#242E3F'} strokeWidth={selectedPartId === 'tokeniser' ? '2' : '1'} style={{ cursor: 'pointer' }} onClick={() => setSelectedPartId('tokeniser')} />
                      <text x="140" y="56" textAnchor="middle" fill="#5EC4C8" fontSize="9" fontFamily="monospace">TOKENISER</text>

                      <rect x="40" y="76" width="200" height="30" rx="6" fill="#0B0E14" stroke={selectedPartId === 'embedding' ? '#F5A623' : '#242E3F'} strokeWidth={selectedPartId === 'embedding' ? '2' : '1'} style={{ cursor: 'pointer' }} onClick={() => setSelectedPartId('embedding')} />
                      <text x="140" y="94" textAnchor="middle" fill="#F5A623" fontSize="9" fontFamily="monospace">EMBEDDING LAYER</text>

                      <rect x="40" y="114" width="200" height="74" rx="6" fill="#1A2130" stroke={selectedPartId === 'transformer' ? '#C9B8E8' : '#242E3F'} strokeWidth={selectedPartId === 'transformer' ? '2.5' : '1'} style={{ cursor: 'pointer' }} onClick={() => setSelectedPartId('transformer')} />
                      <text x="140" y="132" textAnchor="middle" fill="#C9B8E8" fontSize="9" fontFamily="monospace">TRANSFORMER BLOCK ×N</text>

                      <rect x="52" y="142" width="80" height="20" rx="4" fill="#131820" stroke={selectedPartId === 'attention' ? '#C9B8E8' : '#242E3F'} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelectedPartId('attention')} />
                      <text x="92" y="155" textAnchor="middle" fill="#C9B8E8" fontSize="7" fontFamily="monospace">ATTENTION</text>

                      <rect x="148" y="142" width="80" height="20" rx="4" fill="#131820" stroke={selectedPartId === 'ffn' ? '#C9B8E8' : '#242E3F'} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => setSelectedPartId('ffn')} />
                      <text x="188" y="155" textAnchor="middle" fill="#C9B8E8" fontSize="7" fontFamily="monospace">FEED-FWRD</text>

                      <rect x="40" y="196" width="200" height="26" rx="6" fill="#0B0E14" stroke={selectedPartId === 'kvcache' ? '#5EC4C8' : '#242E3F'} strokeWidth={selectedPartId === 'kvcache' ? '2' : '1'} strokeDasharray="5 3" style={{ cursor: 'pointer' }} onClick={() => setSelectedPartId('kvcache')} />
                      <text x="140" y="213" textAnchor="middle" fill="#5EC4C8" fontSize="8" fontFamily="monospace">KV CACHE (inference)</text>

                      <rect x="40" y="230" width="200" height="30" rx="6" fill="#0B0E14" stroke={selectedPartId === 'head' ? '#FB7185' : '#242E3F'} strokeWidth={selectedPartId === 'head' ? '2' : '1'} style={{ cursor: 'pointer' }} onClick={() => setSelectedPartId('head')} />
                      <text x="140" y="248" textAnchor="middle" fill="#FB7185" fontSize="9" fontFamily="monospace">OUTPUT HEAD</text>
                    </svg>

                    <Card style={{ padding: '12px', background: 'var(--ds-color-bg-canvas)', marginTop: '12px', borderLeft: `3px solid ${selectedPart.color}` }}>
                      <strong style={{ color: selectedPart.color, display: 'block', fontSize: 'var(--ds-font-size-bodySm)', marginBottom: '4px' }}>
                        {selectedPart.name}
                      </strong>
                      <p style={{ fontSize: '11px', margin: 0, color: 'var(--ds-color-text-secondary)', lineHeight: '1.5' }}>
                        {selectedPart.desc}
                      </p>
                    </Card>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 3. CORE COMPONENTS ─── */}
        {activeMainTab === 'components' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧩 AI System Building Blocks</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Explore data pipelines, transformer layers, fine-tuning mechanisms, serving engines, and RAG architectures.
                  </p>
                </div>

                <Flex gap={2} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)', paddingBottom: '8px' }}>
                  {['all', 'data', 'model', 'training', 'serving'].map(cat => (
                    <Button
                      key={cat}
                      variant={compFilter === cat ? 'primary' : 'subtle'}
                      size="sm"
                      onClick={() => setCompFilter(cat)}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {cat}
                    </Button>
                  ))}
                </Flex>

                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  {COMPONENTS.filter(c => compFilter === 'all' || c.cat === compFilter).map((comp, idx) => (
                    <Card key={idx} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                      <Flex gap={2} align="center" style={{ marginBottom: '8px' }}>
                        <span style={{ fontSize: '1.4rem' }}>{comp.icon}</span>
                        <div>
                          <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>{comp.title}</strong>
                          <div style={{ fontSize: '10px', color: comp.color }}>{comp.sub}</div>
                        </div>
                      </Flex>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '0 0 8px 0', lineHeight: '1.5' }}>
                        {comp.desc}
                      </p>
                      <Flex gap={1} style={{ flexWrap: 'wrap' }}>
                        {comp.specs.map((spec, sIdx) => (
                          <Badge key={sIdx} variant="subtle" style={{ fontSize: '9px', fontFamily: 'monospace' }}>
                            {spec}
                          </Badge>
                        ))}
                      </Flex>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 4. PROTOCOLS & EVALS ─── */}
        {activeMainTab === 'standards' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📋 Protocols, Benchmarks & Safety Standards</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Standardised benchmarks, safety policies (RSP, Preparedness), Chinchilla scaling laws, and production SLOs.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '220px 1fr' }} gap="var(--ds-space-4)">
                  <Stack gap={2}>
                    {[
                      { key: 'evals', label: 'Capability Evals' },
                      { key: 'safety', label: 'Safety Standards' },
                      { key: 'arch', label: 'Architecture Conventions' },
                      { key: 'infra', label: 'Infra & Serving SLOs' },
                      { key: 'data', label: 'Data Quality Standards' }
                    ].map(item => (
                      <Button
                        key={item.key}
                        variant={selectedStd === item.key ? 'primary' : 'subtle'}
                        size="sm"
                        onClick={() => setSelectedStd(item.key)}
                        style={{ textAlign: 'left', justifyContent: 'flex-start' }}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </Stack>

                  <Stack gap={4}>
                    <h4 style={{ margin: 0, color: 'var(--ds-color-module-foundations-primary)' }}>
                      {STD_DATA[selectedStd].title}
                    </h4>

                    {STD_DATA[selectedStd].blocks.map((block, bIdx) => (
                      <Card key={bIdx} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                        <Flex justify="space-between" align="center" style={{ marginBottom: '10px' }}>
                          <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>{block.title}</strong>
                          <Badge variant="subtle" style={{ fontSize: '9px', fontFamily: 'monospace' }}>
                            {block.tag}
                          </Badge>
                        </Flex>

                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ds-font-size-caption)' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid var(--ds-color-border-subtle)', textAlign: 'left', color: 'var(--ds-color-text-tertiary)' }}>
                                {block.tableHeaders.map((th, hIdx) => (
                                  <th key={hIdx} style={{ padding: '6px 8px' }}>{th}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {block.rows.map((row, rIdx) => (
                                <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} style={{ padding: '8px', color: cIdx === 0 ? 'var(--ds-color-text-primary)' : 'var(--ds-color-text-secondary)' }}>
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Card>
                    ))}
                  </Stack>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 5. AI GLOSSARY ─── */}
        {activeMainTab === 'glossary' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📖 AI System Terms Glossary</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Search and filter 24 essential AI engineering concepts from Attention and BPE to Speculative Decoding and RoPE.
                  </p>
                </div>

                <Flex gap={2} style={{ flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Search AI terms or definitions..."
                    value={glossarySearch}
                    onChange={e => { setGlossarySearch(e.target.value); setGlossaryAlpha(''); }}
                    style={{
                      flex: 1,
                      minWidth: '220px',
                      background: 'var(--ds-color-bg-surface)',
                      border: '1px solid var(--ds-color-border-subtle)',
                      padding: '8px 12px',
                      borderRadius: 'var(--ds-radius-md)',
                      color: 'var(--ds-color-text-primary)',
                      fontSize: 'var(--ds-font-size-bodySm)'
                    }}
                  />
                  <Button variant={!glossaryAlpha && !glossarySearch ? 'primary' : 'subtle'} size="sm" onClick={() => { setGlossaryAlpha(''); setGlossarySearch(''); }}>
                    All
                  </Button>
                  {uniqueAlpha.map(char => (
                    <Button
                      key={char}
                      variant={glossaryAlpha === char ? 'primary' : 'subtle'}
                      size="sm"
                      onClick={() => { setGlossaryAlpha(char); setGlossarySearch(''); }}
                      style={{ minWidth: '32px' }}
                    >
                      {char}
                    </Button>
                  ))}
                </Flex>

                <Stack gap={3}>
                  {filteredGlossary.map((item, idx) => (
                    <Card key={idx} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                        <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-primary)' }}>
                          {item.term}
                        </strong>
                        <Badge variant="subtle" style={{ background: `${item.catColor}20`, color: item.catColor, fontSize: '9px' }}>
                          {item.cat}
                        </Badge>
                      </Flex>
                      <p style={{ margin: 0, fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', lineHeight: '1.6' }}>
                        {item.def}
                      </p>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 6. HARNESS QUIZ ─── */}
        {activeMainTab === 'quiz' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)', maxWidth: '680px', margin: '0 auto', width: '100%' }}>
              {!quizFinished ? (
                <Stack gap={4}>
                  <Flex gap={1}>
                    {QUIZ_QUESTIONS.map((_, qIdx) => (
                      <div
                        key={qIdx}
                        style={{
                          flex: 1,
                          height: '4px',
                          borderRadius: '2px',
                          background: qIdx < quizIndex ? '#5EC4C8' : qIdx === quizIndex ? '#F5A623' : 'var(--ds-color-border-subtle)'
                        }}
                      />
                    ))}
                  </Flex>

                  <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#F5A623' }}>
                    QUESTION {quizIndex + 1} OF {QUIZ_QUESTIONS.length}
                  </div>

                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                    {QUIZ_QUESTIONS[quizIndex].q}
                  </h3>

                  <Stack gap={2}>
                    {QUIZ_QUESTIONS[quizIndex].opts.map((opt, oIdx) => {
                      const letters = ['A', 'B', 'C', 'D'];
                      const isCorrect = oIdx === QUIZ_QUESTIONS[quizIndex].ans;
                      const isSelected = selectedOption === oIdx;

                      let bg = 'var(--ds-color-bg-surface)';
                      let border = '1px solid var(--ds-color-border-subtle)';

                      if (quizAnswered) {
                        if (isCorrect) {
                          bg = 'rgba(46,204,140,0.12)';
                          border = '1px solid #5EC4C8';
                        } else if (isSelected) {
                          bg = 'rgba(255,77,77,0.12)';
                          border = '1px solid #FF4D4D';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleAnswerQuiz(oIdx)}
                          disabled={quizAnswered}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            borderRadius: 'var(--ds-radius-md)',
                            background: bg,
                            border,
                            color: 'var(--ds-color-text-primary)',
                            cursor: quizAnswered ? 'default' : 'pointer',
                            textAlign: 'left',
                            fontSize: 'var(--ds-font-size-bodySm)'
                          }}
                        >
                          <span style={{
                            width: '24px', height: '24px', borderRadius: '4px', background: 'var(--ds-color-bg-canvas)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: '11px', color: 'var(--ds-color-text-tertiary)'
                          }}>
                            {letters[oIdx]}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </Stack>

                  {quizAnswered && (
                    <Card style={{ padding: '12px', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.3)', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', lineHeight: '1.5' }}>
                      <strong style={{ color: '#F5A623', display: 'block', marginBottom: '4px' }}>EXPLANATION:</strong>
                      {QUIZ_QUESTIONS[quizIndex].exp}
                    </Card>
                  )}

                  <Flex justify="space-between" align="center" style={{ marginTop: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--ds-color-text-tertiary)' }}>
                      Score: <strong style={{ color: '#F5A623' }}>{quizScore}</strong> / {quizIndex}
                    </span>
                    {quizAnswered && (
                      <Button variant="primary" size="sm" onClick={handleNextQuiz}>
                        {quizIndex === QUIZ_QUESTIONS.length - 1 ? 'See Final Score ➔' : 'Next Question ➔'}
                      </Button>
                    )}
                  </Flex>
                </Stack>
              ) : (
                <Stack gap={4} style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{
                    width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #F5A623', margin: '0 auto',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#F5A623', fontFamily: 'monospace', lineHeight: '1' }}>
                      {quizScore}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)' }}>/ {QUIZ_QUESTIONS.length}</div>
                  </div>

                  <h3 style={{ margin: 0, fontSize: '1.5rem' }}>
                    {Math.round((quizScore / QUIZ_QUESTIONS.length) * 100)}% Correct Score!
                  </h3>

                  <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    {quizScore >= 7 ? 'Outstanding! You have mastered AI Harness & Training Loop Engineering.' :
                     quizScore >= 5 ? 'Good performance! Review the architecture and loop failure modes to solidify knowledge.' :
                     'Keep studying! Explore the architecture diagram and glossary sections to build core understanding.'}
                  </p>

                  <div>
                    <Button variant="primary" size="sm" onClick={handleResetQuiz}>
                      🔄 Retake Quiz
                    </Button>
                  </div>
                </Stack>
              )}
            </Card>
          </Stack>
        )}

        {/* ─── 7. AI LOOP ENGINEERING ─── */}
        {activeMainTab === 'loop' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔁 Module 2: AI Training Loop Engineering</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    The complete feedback loop of AI learning — forward pass, loss calculation, backpropagation, optimizer weight updates, RLHF alignment, and failure mode remedies.
                  </p>
                </div>

                {/* LOOP SUBTAB NAVIGATION */}
                <Flex gap={2} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)', paddingBottom: '8px' }}>
                  {[
                    { id: 'types', label: 'Loop Types' },
                    { id: 'simulator', label: 'Training Simulator' },
                    { id: 'process', label: 'Design Process' },
                    { id: 'faults', label: 'Failure Modes' }
                  ].map(tab => (
                    <Button
                      key={tab.id}
                      variant={loopSubTab === tab.id ? 'primary' : 'subtle'}
                      size="sm"
                      onClick={() => setLoopSubTab(tab.id)}
                    >
                      {tab.label}
                    </Button>
                  ))}
                </Flex>

                {/* ── SUB-SUBTAB 1: LOOP TYPES ── */}
                {loopSubTab === 'types' && (
                  <Stack gap={4}>
                    <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                      {LOOP_TYPES.map(loop => (
                        <Card
                          key={loop.id}
                          onClick={() => setSelectedLoopType(loop.id)}
                          style={{
                            padding: '14px',
                            cursor: 'pointer',
                            background: selectedLoopType === loop.id ? 'rgba(167,139,250,0.1)' : 'var(--ds-color-bg-surface)',
                            borderLeft: `4px solid ${loop.color}`,
                            borderColor: selectedLoopType === loop.id ? loop.color : undefined
                          }}
                        >
                          <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                            <Flex gap={2} align="center">
                              <span>{loop.icon}</span>
                              <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>{loop.name}</strong>
                            </Flex>
                            <Badge variant="subtle" style={{ background: loop.badgeBg, color: loop.color, fontSize: '9px' }}>
                              {loop.badge}
                            </Badge>
                          </Flex>
                          <p style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                            {loop.desc.slice(0, 95)}...
                          </p>
                          <Flex gap={1} style={{ flexWrap: 'wrap' }}>
                            {loop.specs.slice(0, 2).map((s, idx) => (
                              <Badge key={idx} variant="subtle" style={{ fontSize: '9px', fontFamily: 'monospace' }}>{s}</Badge>
                            ))}
                          </Flex>
                        </Card>
                      ))}
                    </Grid>

                    {/* SELECTED LOOP DETAIL PANEL */}
                    <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${selectedLoop.color}` }}>
                      <Flex gap={2} align="center" style={{ marginBottom: '8px' }}>
                        <span style={{ fontSize: '1.5rem' }}>{selectedLoop.icon}</span>
                        <div>
                          <strong style={{ fontSize: 'var(--ds-font-size-body)', color: 'var(--ds-color-text-primary)' }}>{selectedLoop.name}</strong>
                          <div style={{ fontSize: '11px', color: selectedLoop.color, fontFamily: 'monospace' }}>{selectedLoop.badge}</div>
                        </div>
                      </Flex>
                      <p style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                        {selectedLoop.desc}
                      </p>
                      <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '8px 12px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '11px', color: selectedLoop.color, marginBottom: '12px' }}>
                        {selectedLoop.eq}
                      </div>
                      <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                        <Card style={{ padding: '10px', background: 'var(--ds-color-bg-canvas)' }}>
                          <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>APPLICATIONS:</strong>
                          <ul style={{ margin: '4px 0 0 14px', padding: 0, fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>
                            {selectedLoop.uses.map((u, i) => <li key={i}>{u}</li>)}
                          </ul>
                        </Card>
                        <Card style={{ padding: '10px', background: 'var(--ds-color-bg-canvas)' }}>
                          <strong style={{ fontSize: '11px', color: '#3A9B9F' }}>ADVANTAGES:</strong>
                          <ul style={{ margin: '4px 0 0 14px', padding: 0, fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>
                            {selectedLoop.pros.map((p, i) => <li key={i}>{p}</li>)}
                          </ul>
                        </Card>
                        <Card style={{ padding: '10px', background: 'var(--ds-color-bg-canvas)' }}>
                          <strong style={{ fontSize: '11px', color: '#ef4444' }}>LIMITATIONS:</strong>
                          <ul style={{ margin: '4px 0 0 14px', padding: 0, fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>
                            {selectedLoop.cons.map((c, i) => <li key={i}>{c}</li>)}
                          </ul>
                        </Card>
                      </Grid>
                    </Card>

                    {/* ANIMATED TRAINING LOOP SVG */}
                    <Card style={{ padding: '16px', background: '#131820', border: '1px solid var(--ds-color-border-subtle)' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '8px' }}>
                        TRAINING LOOP COMPUTATION GRAPH:
                      </div>
                      <svg viewBox="0 0 700 160" width="100%">
                        <rect x="20" y="55" width="72" height="48" rx="8" fill="#131820" stroke="#5EC4C8" strokeWidth="1.5"/>
                        <text x="56" y="76" textAnchor="middle" fill="#5EC4C8" fontSize="8" fontFamily="monospace">DATA BATCH</text>

                        <line x1="92" y1="79" x2="148" y2="79" stroke="#5EC4C8" strokeWidth="2"/>
                        <text x="120" y="70" textAnchor="middle" fill="#5EC4C8" fontSize="7" fontFamily="monospace">forward</text>

                        <rect x="150" y="45" width="90" height="68" rx="8" fill="#131820" stroke="#C9B8E8" strokeWidth="2"/>
                        <text x="195" y="73" textAnchor="middle" fill="#C9B8E8" fontSize="8" fontFamily="monospace">MODEL (Weights)</text>

                        <line x1="240" y1="79" x2="296" y2="79" stroke="#5EC4C8" strokeWidth="2"/>
                        <text x="268" y="70" textAnchor="middle" fill="#5EC4C8" fontSize="7" fontFamily="monospace">pred y_hat</text>

                        <rect x="298" y="55" width="76" height="48" rx="8" fill="#131820" stroke="#FB7185" strokeWidth="1.5"/>
                        <text x="336" y="76" textAnchor="middle" fill="#FB7185" fontSize="8" fontFamily="monospace">LOSS L(y_hat, y)</text>

                        <line x1="374" y1="79" x2="430" y2="79" stroke="#FB7185" strokeWidth="2"/>
                        <text x="402" y="70" textAnchor="middle" fill="#FB7185" fontSize="7" fontFamily="monospace">dL/dW</text>

                        <rect x="432" y="55" width="86" height="48" rx="8" fill="#131820" stroke="#C9B8E8" strokeWidth="1.5"/>
                        <text x="475" y="74" textAnchor="middle" fill="#C9B8E8" fontSize="8" fontFamily="monospace">OPTIMIZER</text>

                        <path d="M518 79 Q600 79 600 25 Q600 12 475 12 Q195 12 195 45" stroke="#C9B8E8" strokeWidth="1.5" fill="none" strokeDasharray="5 3"/>
                        <text x="600" y="45" textAnchor="middle" fill="#C9B8E8" fontSize="7" fontFamily="monospace">Δ weights</text>
                      </svg>
                    </Card>
                  </Stack>
                )}

                {/* ── SUB-SUBTAB 2: TRAINING SIMULATOR ── */}
                {loopSubTab === 'simulator' && (
                  <Stack gap={4}>
                    <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)' }}>
                      <Stack gap={4}>
                        <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Hyperparameter Controls:</strong>

                        <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>
                              Learning Rate ({currentLr < 1e-3 ? currentLr.toExponential(0) : currentLr}):
                            </label>
                            <input type="range" min="1" max="12" value={simLrIdx + 1} onChange={e => setSimLrIdx(Number(e.target.value) - 1)} style={{ width: '100%' }} />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>
                              Batch Size ({currentBatch}):
                            </label>
                            <input type="range" min="1" max="8" value={simBatchIdx + 1} onChange={e => setSimBatchIdx(Number(e.target.value) - 1)} style={{ width: '100%' }} />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>
                              Optimizer:
                            </label>
                            <select value={simOptimizer} onChange={e => setSimOptimizer(e.target.value)} style={{ width: '100%', background: 'var(--ds-color-bg-canvas)', border: '1px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-primary)', padding: '6px', borderRadius: '4px' }}>
                              <option value="sgd">SGD (vanilla)</option>
                              <option value="momentum">SGD + Momentum</option>
                              <option value="adam">Adam</option>
                              <option value="adamw">AdamW</option>
                              <option value="rmsprop">RMSProp</option>
                            </select>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>
                              Loss Function:
                            </label>
                            <select value={simLoss} onChange={e => setSimLoss(e.target.value)} style={{ width: '100%', background: 'var(--ds-color-bg-canvas)', border: '1px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-primary)', padding: '6px', borderRadius: '4px' }}>
                              <option value="ce">Cross-Entropy</option>
                              <option value="mse">MSE</option>
                              <option value="bce">Binary Cross-Entropy</option>
                              <option value="huber">Huber Loss</option>
                            </select>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>
                              Regularisation:
                            </label>
                            <select value={simReg} onChange={e => setSimReg(e.target.value)} style={{ width: '100%', background: 'var(--ds-color-bg-canvas)', border: '1px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-primary)', padding: '6px', borderRadius: '4px' }}>
                              <option value="none">None</option>
                              <option value="l2">L2 (Weight Decay)</option>
                              <option value="dropout">Dropout (p=0.1)</option>
                              <option value="both">L2 + Dropout</option>
                            </select>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>
                              Model Depth ({simDepth} layers):
                            </label>
                            <input type="range" min="1" max="12" value={simDepth} onChange={e => setSimDepth(Number(e.target.value))} style={{ width: '100%' }} />
                          </div>
                        </Grid>

                        {/* RESULTS GRID */}
                        <Grid columns={{ base: '1fr 1fr', md: '1fr 1fr 1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">
                          <Card style={{ padding: '10px', background: 'var(--ds-color-bg-canvas)', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: stability < 0.5 ? '#ef4444' : '#5EC4C8' }}>{(stability * 100).toFixed(0)}%</div>
                            <div style={{ fontSize: '9px', color: 'var(--ds-color-text-tertiary)' }}>Stability Score</div>
                          </Card>
                          <Card style={{ padding: '10px', background: 'var(--ds-color-bg-canvas)', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3A9B9F' }}>{finalLoss}</div>
                            <div style={{ fontSize: '9px', color: 'var(--ds-color-text-tertiary)' }}>Est. Final Loss</div>
                          </Card>
                          <Card style={{ padding: '10px', background: 'var(--ds-color-bg-canvas)', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#C9B8E8' }}>{convergenceSpeed}k</div>
                            <div style={{ fontSize: '9px', color: 'var(--ds-color-text-tertiary)' }}>Steps to Converge</div>
                          </Card>
                          <Card style={{ padding: '10px', background: 'var(--ds-color-bg-canvas)', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: gpuUtil > 85 ? '#5EC4C8' : '#F5A623' }}>{gpuUtil}%</div>
                            <div style={{ fontSize: '9px', color: 'var(--ds-color-text-tertiary)' }}>GPU Utilisation</div>
                          </Card>
                          <Card style={{ padding: '10px', background: 'var(--ds-color-bg-canvas)', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#5EC4C8' }}>{memGB} GB</div>
                            <div style={{ fontSize: '9px', color: 'var(--ds-color-text-tertiary)' }}>VRAM (GB est.)</div>
                          </Card>
                          <Card style={{ padding: '10px', background: 'var(--ds-color-bg-canvas)', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: overfit === 'HIGH' ? '#ef4444' : '#5EC4C8' }}>{overfit}</div>
                            <div style={{ fontSize: '9px', color: 'var(--ds-color-text-tertiary)' }}>Overfit Risk</div>
                          </Card>
                        </Grid>

                        {/* LOSS CURVE CANVAS */}
                        <div style={{ background: '#1A2130', borderRadius: '8px', padding: '12px' }}>
                          <canvas ref={canvasRef} style={{ width: '100%', height: '120px', display: 'block' }} />
                        </div>

                        {/* RECOMMENDATIONS */}
                        <Card style={{ padding: '12px', background: 'var(--ds-color-bg-canvas)', fontSize: 'var(--ds-font-size-caption)', lineHeight: '1.5' }}>
                          {explodes && <div style={{ color: '#ef4444', marginBottom: '4px' }}>🔴 <strong>Exploding Gradients:</strong> Learning rate too high for optimizer — expect NaN loss. Reduce LR or switch to AdamW.</div>}
                          {vanishes && <div style={{ color: '#ef4444', marginBottom: '4px' }}>🔴 <strong>Vanishing Gradients:</strong> Deep architecture with SGD at low LR. Add residual connections or use AdamW.</div>}
                          {slowConv && <div style={{ color: '#F5A623', marginBottom: '4px' }}>⚠️ <strong>Slow Convergence:</strong> Learning rate is very low for SGD. Increase LR or add warmup schedule.</div>}
                          {stability > 0.85 && <div style={{ color: '#3A9B9F' }}>✅ <strong>Healthy Configuration:</strong> Hyperparameters are well-balanced for stable training.</div>}
                        </Card>
                      </Stack>
                    </Card>
                  </Stack>
                )}

                {/* ── SUB-SUBTAB 3: DESIGN PROCESS ── */}
                {loopSubTab === 'process' && (
                  <Stack gap={4}>
                    <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                      <Stack gap={3}>
                        {PROCESS_STEPS.map((step, idx) => (
                          <Card key={idx} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                            <Flex gap={3} align="flex-start">
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--ds-color-bg-canvas)', border: '2px solid #C9B8E8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: '11px', color: '#C9B8E8', flexShrink: 0 }}>
                                {step.n}
                              </div>
                              <div>
                                <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-primary)' }}>{step.title}</strong>
                                <p style={{ margin: '4px 0 0 0', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', lineHeight: '1.5' }}>
                                  {step.detail}
                                </p>
                              </div>
                            </Flex>
                          </Card>
                        ))}
                      </Stack>

                      <Stack gap={3}>
                        <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                          <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: '#5EC4C8' }}>Chain Rule — Gradient Backprop</strong>
                          <p style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', margin: '4px 0 8px 0' }}>
                            Backprop applies the chain rule layer-by-layer from output back to input weights.
                          </p>
                          <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '10px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '11px', color: '#5EC4C8' }}>
                            dL/dW1 = (dL/dy_hat) * (dy_hat/dh) * (dh/dW1)
                          </div>
                        </Card>

                        <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #C9B8E8' }}>
                          <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: '#C9B8E8' }}>Adam Weight Update Rule</strong>
                          <p style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', margin: '4px 0 8px 0' }}>
                            Adaptive moment estimation maintains running average of gradients & squared gradients.
                          </p>
                          <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '10px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '11px', color: '#C9B8E8' }}>
                            m_hat = m / (1 - beta1^t);  v_hat = v / (1 - beta2^t)<br />
                            Theta_new = Theta - alpha * m_hat / (sqrt(v_hat) + eps)
                          </div>
                        </Card>

                        <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                          <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: '#5EC4C8' }}>RLHF Outer Loop Objective</strong>
                          <p style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', margin: '4px 0 8px 0' }}>
                            Optimizes policy under KL constraint to prevent reward hacking.
                          </p>
                          <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '10px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '11px', color: '#5EC4C8' }}>
                            pi* = argmax E[R(x,y)] - beta * KL(pi || pi_ref)
                          </div>
                        </Card>
                      </Stack>
                    </Grid>
                  </Stack>
                )}

                {/* ── SUB-SUBTAB 4: FAILURE MODES ── */}
                {loopSubTab === 'faults' && (
                  <Stack gap={3}>
                    {FAULTS.map((fault, idx) => (
                      <Card
                        key={idx}
                        onClick={() => toggleFault(idx)}
                        style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', cursor: 'pointer' }}
                      >
                        <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                          <Flex gap={2} align="center">
                            <Badge variant="subtle" style={{
                              background: fault.sev === 'high' ? 'rgba(255,77,77,0.15)' : fault.sev === 'medium' ? 'rgba(245,166,35,0.15)' : 'rgba(46,204,140,0.15)',
                              color: fault.sev === 'high' ? '#FF4D4D' : fault.sev === 'medium' ? '#F5A623' : '#5EC4C8',
                              fontSize: '9px',
                              fontFamily: 'monospace'
                            }}>
                              {fault.sev.toUpperCase()}
                            </Badge>
                            <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>{fault.name}</strong>
                          </Flex>
                          <span style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', fontFamily: 'monospace' }}>
                            {openFaults[idx] ? '▲ collapse' : '▼ expand fix'}
                          </span>
                        </Flex>
                        <p style={{ margin: '0 0 6px 0', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                          <strong>Cause:</strong> {fault.cause}
                        </p>
                        {openFaults[idx] && (
                          <Card style={{ padding: '10px', background: 'var(--ds-color-bg-canvas)', marginTop: '8px', borderLeft: '3px solid #5EC4C8', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-primary)' }}>
                            <strong style={{ color: '#5EC4C8' }}>🔧 Remedy & Fix:</strong> {fault.remedy}
                          </Card>
                        )}
                      </Card>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Card>
          </Stack>
        )}
      {/* ─── INTERACTIVE ENHANCEMENTS: WORKFLOW + TABLE + ANIMATION ─── */}
      <Stack gap={6} style={{ marginTop: 'var(--ds-space-8)' }}>
        <Reveal variant="rise">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--ds-space-3)' }}>
            <h3 style={{ margin: 0, fontSize: 'var(--ds-font-size-h2)' }}>🏗️ Interactive Training Harness</h3>
            <Badge variant="module" moduleId="agents">Pipeline · Faults · Metrics</Badge>
          </div>
        </Reveal>

        <Reveal variant="rise" delay={60}>
          <Workflow
            accent="agents"
            accentLabel="Build Pipeline"
            title="From Objective to Aligned Model"
            description="The eight-stage ML training lifecycle. Hit ▶ Play to animate the flow."
            steps={PROCESS_STEPS.map((s) => ({
              title: s.title, description: s.detail, icon: '⚙️',
            }))}
          />
        </Reveal>

        <Reveal variant="rise" delay={120}>
          <DataTable
            caption="Common Training Faults — Severity, Cause & Remedy"
            columns={[
              { key: 'sev', label: 'Severity', sortable: false, render: (v) => (
                <span style={{ fontWeight: 700, color: v === 'high' ? 'var(--ds-color-state-error-light)' : v === 'medium' ? 'var(--ds-color-state-warning-light)' : 'var(--ds-color-text-tertiary)' }}>{v.toUpperCase()}</span>
              ) },
              { key: 'name', label: 'Fault', sortable: false },
              { key: 'cause', label: 'Cause', sortable: false },
              { key: 'remedy', label: 'Remedy', sortable: false },
            ]}
            rows={FAULTS}
            rowKey={(r) => r.name}
          />
        </Reveal>

        <Reveal variant="scale" delay={180}>
          <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)', display: 'flex', gap: 'var(--ds-space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ds-color-text-tertiary)' }}>Stages to Production</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--ds-color-module-agents-primary)' }}>
                <AnimatedNumber value={8} />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 200, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              A reliable harness spans <strong>8 disciplined stages</strong> — misaligned objectives are the single most
              common cause of models that train well but fail in deployment.
            </div>
          </Card>
        </Reveal>
      </Stack>

      </Container>
    </div>
  );
}
