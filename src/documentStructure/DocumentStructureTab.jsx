import { useState, useRef, useCallback, useEffect } from 'react';
import {
  enrichLineDfWithStyle,
  detectBodyHeadings,
  reconstructTocFromBody,
  DEFAULT_WEIGHTS,
  generateWorkflowFromToc,
  workflowToMermaid,
  generateTableFromToc,
  generateFlashcardsFromToc,
  generateImagePromptsFromToc,
  detectDocumentBoundaries,
  PdfOverlayViewer,
  DualLayerViewer,
  BenchmarkViewer,
} from '../documentStructure/index.js';
import { callAIProxy } from '../lib/aiProxy.js';

const API_BASE = (typeof import.meta.env === 'object' && import.meta.env)
  ? import.meta.env.VITE_API_BASE_URL || ''
  : '';

async function parsePdfViaProxy(file) {
  const res = await fetch(`${API_BASE}/api/document/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: file,
  });
  if (!res.ok) {
    let detail = '';
    try { detail = await res.text(); } catch { /* ignore */ }
    throw new Error(`PDF parse failed (${res.status}): ${detail}`);
  }
  return res.json(); // { line_df, span_df }
}

const DEFAULT_AI_CONFIG = {
  apiKey: '',
  model: 'gpt-4o-mini',
};

export default function DocumentStructureTab() {
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [progress, setProgress] = useState('');
  const [lineDf, setLineDf] = useState([]);
  const [spanDf, setSpanDf] = useState([]);
  const [tocDf, setTocDf] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [boundaries, setBoundaries] = useState([]);
  const [activeStep, setActiveStep] = useState(1);
  const [activeView, setActiveView] = useState('toc');
  
  const [threshold, setThreshold] = useState(3.0);
  const [signalWeights, setSignalWeights] = useState(DEFAULT_WEIGHTS);
  const [cascadeMode, setCascadeMode] = useState('auto');
  const [validationLogs, setValidationLogs] = useState([]);

  const [aiConfig, setAiConfig] = useState(DEFAULT_AI_CONFIG);
  const [generating, setGenerating] = useState(false);
  const [workflow, setWorkflow] = useState(null);
  const [table, setTable] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [imagePrompts, setImagePrompts] = useState([]);
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (flashcards.length > 0) {
      setCurrentFlashcard(0);
      setFlashcardFlipped(false);
    }
  }, [flashcards.length]);

  const recomputeHeadingsAndToc = useCallback(async (lDf, sDf, thresh, w, mode) => {
    if (!lDf || lDf.length === 0) return;
    const enriched = enrichLineDfWithStyle(lDf, sDf);
    const detected = detectBodyHeadings(enriched, thresh, w);
    setCandidates(detected);

    const docBoundaries = detectDocumentBoundaries(lDf);
    setBoundaries(docBoundaries);

    let logsCollector = [];
    const toc = await reconstructTocFromBody(lDf, sDf, {
      mode,
      threshold: thresh,
      weights: w,
      maxPasses: 3,
      llmParse: aiConfig.apiKey
        ? async (sys, user, schema) => callLLM(aiConfig, sys, user, schema)
        : null,
      onPassLog: (logs) => { logsCollector = logs; },
    });

    setTocDf(toc);
    setValidationLogs(logsCollector.length > 0 ? logsCollector : (toc.validationLogs || []));
  }, [aiConfig]);

  const handleFileChange = useCallback(async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.type !== 'application/pdf') {
      setError('Please select a PDF file.');
      return;
    }

    setFile(selected);
    setError('');
    setParsing(true);
    setProgress('Reading PDF...');

    try {
      setProgress('Uploading PDF for server-side parsing...');
      const { line_df, span_df } = await parsePdfViaProxy(selected);
      setLineDf(line_df);
      setSpanDf(span_df);

      setProgress('Running Loop Engineering TOC Reconstruction...');
      await recomputeHeadingsAndToc(line_df, span_df, threshold, signalWeights, cascadeMode);

      setProgress('Complete.');
      setActiveStep(2);
    } catch (err) {
      console.error(err);
      setError(`Parsing failed: ${err.message}`);
    } finally {
      setParsing(false);
    }
  }, [threshold, signalWeights, cascadeMode, recomputeHeadingsAndToc]);

  const callLLM = async (config, system, user, schema) => {
    const content = await callAIProxy({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      model: config.model,
      apiKey: config.apiKey || undefined,
    });
    return JSON.parse(content);
  };

  const handleGenerateAll = useCallback(async () => {
    setGenerating(true);
    setError('');
    try {
      const [wf, tbl, fcs, imgs] = await Promise.all([
        generateWorkflowFromToc(tocDf, aiConfig.apiKey ? aiConfig : null),
        generateTableFromToc(tocDf, lineDf, aiConfig.apiKey ? aiConfig : null),
        generateFlashcardsFromToc(tocDf, lineDf, aiConfig.apiKey ? aiConfig : null),
        generateImagePromptsFromToc(tocDf, aiConfig.apiKey ? aiConfig : null),
      ]);
      setWorkflow(wf);
      setTable(tbl);
      setFlashcards(fcs);
      setImagePrompts(imgs);
    } catch (err) {
      console.error(err);
      setError(`Generation failed: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  }, [tocDf, lineDf, aiConfig]);

  const handleWeightChange = (key, val) => {
    const newW = { ...signalWeights, [key]: parseFloat(val) || 0 };
    setSignalWeights(newW);
    recomputeHeadingsAndToc(lineDf, spanDf, threshold, newW, cascadeMode);
  };

  const handleThresholdChange = (val) => {
    const thresh = parseFloat(val) || 3.0;
    setThreshold(thresh);
    recomputeHeadingsAndToc(lineDf, spanDf, thresh, signalWeights, cascadeMode);
  };

  const handleModeChange = (mode) => {
    setCascadeMode(mode);
    recomputeHeadingsAndToc(lineDf, spanDf, threshold, signalWeights, mode);
  };

  const s = {
    container: { maxWidth: 1280, margin: '0 auto', padding: '1.5rem', fontFamily: 'DM Mono, monospace', color: '#1a1a2e' },
    card: { background: '#ffffff', border: '1px solid #e0dcd4', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
    sectionLabel: (color = '#F0A89A') => ({ fontFamily: 'Syne, sans-serif', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color, borderLeft: `3px solid ${color}`, paddingLeft: '0.7rem', marginBottom: '1rem' }),
    input: { width: '100%', padding: '0.55rem 0.9rem', border: '1px solid #d0ccc4', borderRadius: 4, fontSize: '0.72rem', fontFamily: 'DM Mono, monospace', outline: 'none' },
    btn: { padding: '0.6rem 1.2rem', borderRadius: 6, border: 'none', fontSize: '0.72rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s' },
    btnPrimary: { background: '#5EC4C8', color: '#fff' },
    btnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.67rem' },
    th: { textAlign: 'left', padding: '0.7rem 0.8rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#334155', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid #e0dcd4' },
    td: { padding: '0.7rem 0.8rem', borderBottom: '1px solid rgba(42,42,56,0.05)', color: '#1E293B' },
    badge: { display: 'inline-flex', alignItems: 'center', padding: '0.15rem 0.5rem', borderRadius: 999, fontSize: '0.6rem', fontWeight: 600 },
  };

  const steps = [
    { num: 1, title: 'Upload & Extract', desc: 'PDF typography & span extraction' },
    { num: 2, title: '6-Signal Scorer', desc: 'Weights & threshold controls' },
    { num: 3, title: 'Cascade & Modes', desc: 'Auto, Extend Native, Composite' },
    { num: 4, title: 'LLM Loop Trajectory', desc: 'Bounded validation passes' },
    { num: 5, title: 'PDF Visual Overlays', desc: 'Canvas bounding-box viewer' },
    { num: 6, title: 'Dual-Layer Architecture', desc: 'Section level & business tags' },
    { num: 7, title: 'Ground Truth Benchmarks', desc: 'Vaswani & NIST evaluation' },
  ];

  const renderTocView = () => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Pages', value: new Set(lineDf.map(l => l.page_num)).size, color: '#3A9B9F' },
          { label: 'Candidates', value: candidates.length, color: '#C47A6A' },
          { label: 'TOC Entries', value: tocDf.length, color: '#5c3d8f' },
        ].map((stat, i) => (
          <div key={i} style={{ ...s.card, padding: '1rem' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#334155', marginBottom: '0.5rem' }}>{stat.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {boundaries.length > 0 && (
        <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8, padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.65rem', fontWeight: 700, color: '#92400e', marginBottom: '0.5rem' }}>Document Boundaries Detected (Composite Mode)</div>
          <ul style={{ listStyle: 'disc', paddingLeft: '1.2rem', fontSize: '0.72rem', color: '#a16207' }}>
            {boundaries.map((b, i) => (
              <li key={i}>{b.type}: {b.reason} (Page {b.page}, confidence: {(b.confidence * 100).toFixed(0)}%)</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ ...s.card, overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e0dcd4', background: '#f7f5f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={s.sectionLabel('#2a7a9c')}>Reconstructed Table of Contents (toc_df)</div>
          <span style={{ fontSize: '0.62rem', color: '#64748b' }}>Cascade Mode: <strong>{cascadeMode}</strong></span>
        </div>
        <div style={{ overflowX: 'auto', maxHeight: 400, overflowY: 'auto' }}>
          <table style={s.table}>
            <thead style={{ position: 'sticky', top: 0, background: '#f7f5f0' }}>
              <tr>
                {['Title', 'Level', 'Page', 'Source', 'Score'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tocDf.map((entry, i) => (
                <tr key={i} style={{ background: entry.level === 1 ? '#eff6ff' : 'transparent' }}>
                  <td style={{ ...s.td, paddingLeft: `${(entry.level || 1) * 16}px`, fontWeight: 600, color: '#1a1a2e' }}>{entry.title}</td>
                  <td style={s.td}>{entry.level}</td>
                  <td style={s.td}>{entry.page}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, background: entry.source === 'native' ? '#d1fae5' : entry.source === 'body_structure' ? '#dbeafe' : '#f3f4f6', color: entry.source === 'native' ? '#065f46' : entry.source === 'body_structure' ? '#1e40af' : '#374151' }}>
                      {entry.source || 'body_structure'}
                    </span>
                  </td>
                  <td style={s.td}>{entry.heading_score?.toFixed(2) || '3.00'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCandidatesView = () => (
    <div>
      <div style={{ ...s.card, padding: '1rem', marginBottom: '1rem', background: '#f8fafc' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.65rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
          6-Signal Deterministic Scorer & Weight Controls
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
          {Object.entries(signalWeights).map(([key, w]) => (
            <div key={key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: '#475569', marginBottom: '0.2rem' }}>
                <span>{key}</span>
                <span style={{ fontWeight: 700 }}>{w.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="3.0"
                step="0.1"
                value={w}
                onChange={e => handleWeightChange(key, e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0f172a' }}>Candidate Threshold: {threshold.toFixed(1)}</span>
          <input
            type="range"
            min="1.0"
            max="5.0"
            step="0.1"
            value={threshold}
            onChange={e => handleThresholdChange(e.target.value)}
            style={{ width: 200 }}
          />
        </div>
      </div>

      <div style={{ ...s.card, overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e0dcd4', background: '#f7f5f0' }}>
          <div style={s.sectionLabel('#F0A89A')}>Heading Candidates (Deterministic Pass)</div>
          <p style={{ fontSize: '0.65rem', color: '#334155', marginTop: '0.3rem' }}>Lines scoring $\ge {threshold.toFixed(1)}$ before LLM validation</p>
        </div>
        <div style={{ overflowX: 'auto', maxHeight: 400, overflowY: 'auto' }}>
          <table style={s.table}>
            <thead style={{ position: 'sticky', top: 0, background: '#f7f5f0' }}>
              <tr>
                {['Text', 'Page', 'Score', 'Font Ratio', 'Bold', 'Prefix', 'Short', 'Aligned', 'Blank'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {candidates.map((c, i) => (
                <tr key={i}>
                  <td style={{ ...s.td, fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.text}</td>
                  <td style={s.td}>{c.page_num}</td>
                  <td style={s.td}>{c.heading_score.toFixed(2)}</td>
                  <td style={s.td}>{(c.signal_font_size_ratio || 0).toFixed(2)}</td>
                  <td style={s.td}>{(c.signal_is_bold || 0).toFixed(2)}</td>
                  <td style={s.td}>{(c.signal_has_numeric_prefix || 0).toFixed(2)}</td>
                  <td style={s.td}>{(c.signal_is_short || 0).toFixed(2)}</td>
                  <td style={s.td}>{(c.signal_is_left_aligned || 0).toFixed(2)}</td>
                  <td style={s.td}>{(c.signal_has_blank_before || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderValidationTrajectoryView = () => (
    <div style={{ ...s.card, padding: '1.25rem' }}>
      <div style={s.sectionLabel('#9B89C4')}>Bounded LLM Validation Trajectory</div>
      <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '1rem' }}>
        Tracks the pass-by-pass refinement loop ($max\_passes=3$). Convergence is achieved when a pass makes zero modifications.
      </p>

      {validationLogs.length === 0 ? (
        <p style={{ color: '#94a3b8', fontSize: '0.72rem' }}>No validation logs captured yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {validationLogs.map((log, idx) => (
            <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: '0.85rem', background: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1e293b' }}>Pass #{log.pass}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: log.status.includes('Converged') ? '#16a34a' : '#5EC4C8' }}>
                  {log.status}
                </span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '0.5rem' }}>
                Kept: <strong>{log.keptCount}</strong> | Dropped FPs: <strong style={{ color: '#dc2626' }}>{log.droppedCount}</strong> | Added Missed: <strong style={{ color: '#16a34a' }}>{log.addedCount}</strong>
              </div>
              <div style={{ maxHeight: 120, overflowY: 'auto', fontSize: '0.62rem', fontFamily: 'DM Mono, monospace', color: '#334155', background: '#f1f5f9', padding: '0.5rem', borderRadius: 4 }}>
                {log.entries?.map((e, ei) => (
                  <div key={ei}>• Page {e.page}: "{e.title}" (L{e.level})</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderWorkflowView = () => {
    if (!workflow) {
      return <div style={{ ...s.card, padding: '2rem', textAlign: 'center', color: '#334155' }}>Generate content to see the workflow diagram.</div>;
    }

    const mermaid = workflowToMermaid(workflow);
    return (
      <div style={{ ...s.card, overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e0dcd4', background: '#f7f5f0' }}>
          <div style={s.sectionLabel('#2a7a9c')}>Document Workflow</div>
        </div>
        <div style={{ padding: '1rem' }}>
          <pre style={{ background: '#1a1a2e', color: '#e2e8f0', padding: '1rem', borderRadius: 8, fontSize: '0.65rem', overflowX: 'auto', fontFamily: 'DM Mono, monospace', whiteSpace: 'pre-wrap' }}>
            {mermaid}
          </pre>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {workflow.nodes.map(node => (
              <div key={node.id} style={{ display: 'flex', alignItems: 'center', paddingLeft: `${node.level * 16}px`, fontSize: '0.72rem', color: '#1E293B' }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', marginRight: 8, background: node.type === 'root' ? '#5EC4C8' : node.type === 'section' ? '#5EC4C8' : '#93c5fd' }} />
                <span>{node.label}</span>
                {node.page && <span style={{ marginLeft: 8, fontSize: '0.6rem', color: '#9ca3af' }}>p.{node.page}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTableView = () => {
    if (!table) {
      return <div style={{ ...s.card, padding: '2rem', textAlign: 'center', color: '#334155' }}>Generate content to see the summary table.</div>;
    }

    return (
      <div style={{ ...s.card, overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e0dcd4', background: '#f7f5f0' }}>
          <div style={s.sectionLabel('#5EC4C8')}>{table.title}</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                {(table.headers || []).map((h, i) => (
                  <th key={i} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(table.rows || []).map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} style={s.td}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderFlashcardsView = () => {
    if (flashcards.length === 0) {
      return <div style={{ ...s.card, padding: '2rem', textAlign: 'center', color: '#334155' }}>Generate content to see flashcards.</div>;
    }

    const card = flashcards[currentFlashcard];
    if (!card) return null;

    return (
      <div style={{ ...s.card, overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e0dcd4', background: '#f7f5f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={s.sectionLabel('#5c3d8f')}>Flashcards</div>
          <span style={{ fontSize: '0.65rem', color: '#334155' }}>{currentFlashcard + 1} / {flashcards.length}</span>
        </div>
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            onClick={() => setFlashcardFlipped(!flashcardFlipped)}
            style={{ width: '100%', maxWidth: 480, aspectRatio: '3/2', cursor: 'pointer', perspective: 1000 }}
          >
            <div style={{
              position: 'relative', width: '100%', height: '100%', transition: 'transform 0.5s', transformStyle: 'preserve-3d',
              transform: flashcardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #5EC4C8, #4f46e5)', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backfaceVisibility: 'hidden' }}>
                <p style={{ color: '#fff', textAlign: 'center', fontSize: '1.1rem', fontWeight: 600 }}>{card.front}</p>
              </div>
              <div style={{ position: 'absolute', inset: 0, background: '#ffffff', border: '2px solid #e0dcd4', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <p style={{ color: '#1a1a2e', textAlign: 'center', fontSize: '1rem', lineHeight: 1.6 }}>{card.back}</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            <button onClick={() => { setCurrentFlashcard(Math.max(0, currentFlashcard - 1)); setFlashcardFlipped(false); }} disabled={currentFlashcard === 0} style={{ ...s.btn, background: '#f3f4f6', color: '#374151', ...(currentFlashcard === 0 ? s.btnDisabled : {}) }}>Previous</button>
            <button onClick={() => { setCurrentFlashcard(Math.min(flashcards.length - 1, currentFlashcard + 1)); setFlashcardFlipped(false); }} disabled={currentFlashcard === flashcards.length - 1} style={{ ...s.btn, background: '#f3f4f6', color: '#374151', ...(currentFlashcard === flashcards.length - 1 ? s.btnDisabled : {}) }}>Next</button>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem' }}>
            {card.tags?.map(tag => (
              <span key={tag} style={{ padding: '0.15rem 0.5rem', background: '#f3f4f6', color: '#6b7280', borderRadius: 999, fontSize: '0.6rem' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderImagesView = () => (
    <div style={{ ...s.card, overflow: 'hidden' }}>
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e0dcd4', background: '#f7f5f0' }}>
        <div style={s.sectionLabel('#9B89C4')}>Image Generation Prompts</div>
        <p style={{ fontSize: '0.65rem', color: '#334155', marginTop: '0.3rem' }}>AI prompts to generate diagrams for each section</p>
      </div>
      <div style={{ padding: '1rem', maxHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {imagePrompts.length === 0 ? (
          <p style={{ color: '#334155', fontSize: '0.72rem' }}>Generate content to see image prompts.</p>
        ) : (
          imagePrompts.map((img, i) => (
            <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#374151' }}>Section: {img.section}</span>
                <span style={{ fontSize: '0.6rem', color: '#9ca3af' }}>Page {img.page}</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#6b7280', fontStyle: 'italic' }}>"{img.prompt}"</p>
              <span style={{ display: 'inline-block', marginTop: '0.5rem', padding: '0.15rem 0.5rem', background: '#f3e8ff', color: '#7A6BA8', borderRadius: 999, fontSize: '0.6rem' }}>{img.style}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const navItems = [
    { id: 'toc', label: 'Table of Contents' },
    { id: 'candidates', label: `Candidates (${candidates.length})` },
    { id: 'trajectory', label: `LLM Trajectory (${validationLogs.length})` },
    { id: 'overlays', label: 'PDF Overlays' },
    { id: 'duallayer', label: 'Dual-Layer Tags' },
    { id: 'benchmark', label: 'Benchmarks' },
    { id: 'workflow', label: 'Workflow' },
    { id: 'table', label: 'Table' },
    { id: 'flashcards', label: `Flashcards (${flashcards.length})` },
    { id: 'images', label: 'Image Prompts' },
  ];

  return (
    <div style={s.container}>
      <div style={{ ...s.card, marginBottom: '1.5rem', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e0dcd4' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 900, color: '#1a1a2e', marginBottom: '0.5rem' }}>
            Document Structure with Loop Engineering [Vol.1 #5octies]
          </div>
          <p style={{ fontSize: '0.72rem', color: '#334155', lineHeight: 1.7, maxWidth: 800 }}>
            Recovering a PDF’s outline from body typography for RAG (Case 4). Rules propose via 6 deterministic signals; bounded LLM loop validates kept entries.
          </p>
          <div style={{
            marginTop: '10px',
            padding: '8px 14px',
            background: 'linear-gradient(90deg, rgba(37, 99, 235, 0.08), rgba(13, 148, 136, 0.08))',
            border: '1px solid rgba(37, 99, 235, 0.25)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
          }}>
            <span>
              🚀 <strong>Next Evolution:</strong> See <strong>Agentic Parsing Dispatcher [Vol.1 #5nonies]</strong> which closes Brick 1 by composing this body-structure loop with Docling, EasyOCR, fitz, and Azure DI.
            </span>
            <a
              href="?tab=agenticparsing"
              style={{
                color: '#3A9B9F',
                fontWeight: 700,
                textDecoration: 'none',
                padding: '3px 8px',
                background: 'white',
                borderRadius: '4px',
                border: '1px solid #5EC4C8',
              }}
            >
              Open Dispatcher ⚡
            </a>
          </div>
        </div>

        {/* 7-Step Interactive Pipeline Stepper */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e0dcd4', background: '#f8fafc', overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '1rem', minWidth: 800 }}>
            {steps.map(st => (
              <div
                key={st.num}
                onClick={() => setActiveStep(st.num)}
                style={{
                  flex: 1,
                  padding: '0.6rem 0.8rem',
                  borderRadius: 6,
                  border: activeStep === st.num ? '2px solid #5EC4C8' : '1px solid #e2e8f0',
                  background: activeStep === st.num ? '#eff6ff' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: activeStep === st.num ? '#5EC4C8' : '#cbd5e1',
                    color: '#ffffff', fontSize: '0.6rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {st.num}
                  </span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: activeStep === st.num ? '#1e40af' : '#475569', fontFamily: 'Syne, sans-serif' }}>
                    {st.title}
                  </span>
                </div>
                <div style={{ fontSize: '0.58rem', color: '#94a3b8', paddingLeft: '1.5rem' }}>
                  {st.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ fontSize: '0.72rem', color: '#1E293B' }}
            />
            {parsing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', color: '#3A9B9F' }}>
                <div style={{ width: 16, height: 16, border: '2px solid #5EC4C8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                {progress}
              </div>
            )}
            {file && !parsing && (
              <span style={{ fontSize: '0.72rem', color: '#334155' }}>{file.name}</span>
            )}

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.68rem', alignSelf: 'center', color: '#475569' }}>Cascade Mode:</span>
              {['auto', 'no_toc', 'extend_native', 'composite'].map(m => (
                <button
                  key={m}
                  onClick={() => handleModeChange(m)}
                  style={{
                    padding: '0.3rem 0.6rem',
                    borderRadius: 4,
                    border: 'none',
                    background: cascadeMode === m ? '#5EC4C8' : '#e2e8f0',
                    color: cascadeMode === m ? '#ffffff' : '#475569',
                    fontSize: '0.62rem',
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.72rem' }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>AI API Key (Optional - Falls back to Mock Validator)</label>
            <input
              type="password"
              value={aiConfig.apiKey}
              onChange={e => setAiConfig(c => ({ ...c, apiKey: e.target.value }))}
              placeholder="sk-..."
              style={s.input}
            />
          </div>

          {lineDf.length > 0 && (
            <div>
              <button
                onClick={handleGenerateAll}
                disabled={generating || tocDf.length === 0}
                style={{ ...s.btn, ...s.btnPrimary, ...(generating || tocDf.length === 0 ? s.btnDisabled : {}) }}
              >
                {generating ? 'Generating Content...' : 'Generate Workflows, Tables & Flashcards'}
              </button>
            </div>
          )}
        </div>
      </div>

      {lineDf.length > 0 && (
        <div style={{ ...s.card, overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e0dcd4', overflowX: 'auto' }}>
            {navItems.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  fontFamily: 'Syne, sans-serif',
                  cursor: 'pointer',
                  border: 'none',
                  borderBottom: activeView === tab.id ? '2px solid #5EC4C8' : '2px solid transparent',
                  background: activeView === tab.id ? '#eff6ff' : 'transparent',
                  color: activeView === tab.id ? '#5EC4C8' : '#6b7280',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div style={{ padding: '1rem' }}>
            {activeView === 'toc' && renderTocView()}
            {activeView === 'candidates' && renderCandidatesView()}
            {activeView === 'trajectory' && renderValidationTrajectoryView()}
            {activeView === 'overlays' && <PdfOverlayViewer file={file} lineDf={lineDf} candidates={candidates} threshold={threshold} />}
            {activeView === 'duallayer' && <DualLayerViewer lineDf={lineDf} tocDf={tocDf} />}
            {activeView === 'benchmark' && <BenchmarkViewer />}
            {activeView === 'workflow' && renderWorkflowView()}
            {activeView === 'table' && renderTableView()}
            {activeView === 'flashcards' && renderFlashcardsView()}
            {activeView === 'images' && renderImagesView()}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

