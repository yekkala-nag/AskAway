import { useEffect, useRef, useState } from 'react';
import { OnboardingTour } from './OnboardingTour.jsx';

const CHUNKS = [
  'Hybrid retrieval fuses dense vector search with BM25 keyword matching, then merges both rankings with reciprocal rank fusion.',
  'A semantic cache stores canonical answers; similarity above 0.92 returns instantly with zero model tokens.',
  'The dispatcher routes clean single-line lookups to an expert dictionary and reserves the full model waterfall for genuine reasoning.',
  'Metadata filters prune by jurisdiction, effective date, and access control before reranking the top candidates.',
  'Cross-encoder reranking scores survivors so only the ten best contexts reach the model.',
];
const RETRIEVED = [1, 3];

const FRAMEWORKS = ['None', 'TRACE', 'CLEAR', 'Active-Prompt'];

const INK = '#16283F';
const MUTED = '#64748B';
const TEAL = '#0E9F8A';
const LINE = '#E7EDF3';

function groundedAnswer() {
  return 'Grounded answer (cited): the dispatcher reserves the model waterfall for genuine reasoning [Chunk 3]; metadata filters prune before reranking so only top contexts are used [Chunk 4]. No hallucination — everything above comes from highlighted chunks.';
}

function clarifyingQuestion() {
  return 'Before I retrieve anything — one clarifying question (Active-Prompt): are you asking about the dispatcher, the filters, or the reranker? Reply with one of those, and I’ll pull the exact chunks.';
}

/**
 * Compact 3-zone RAG playground demo that hosts the onboarding tour:
 * knowledge base (chunk highlights) · pipeline visualizer · prompt engineer
 * (chat + framework dropdown, Active-Prompt preselected on tour finish).
 */
export function RagPlayground() {
  const [framework, setFramework] = useState('None');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Ask me anything about the knowledge base on the left. Try the Framework dropdown first.' },
  ]);
  const [stage, setStage] = useState(-1);
  const [highlighted, setHighlighted] = useState(false);
  const [clarified, setClarified] = useState(false);
  const [running, setRunning] = useState(false);
  const [replaySignal, setReplaySignal] = useState(0);
  const runId = useRef(0);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (ms, fn) => {
    const id = runId.current;
    timers.current.push(setTimeout(() => {
      if (runId.current === id) fn();
    }, ms));
  };

  const send = (text) => {
    const query = (text || '').trim();
    if (!query || running) return;
    runId.current += 1;
    setMessages((m) => [...m, { role: 'user', text: query }]);
    setInput('');
    setRunning(true);
    if (framework === 'Active-Prompt' && !clarified) {
      setStage(-1);
      setHighlighted(false);
      later(500, () => {
        setMessages((m) => [...m, { role: 'assistant', text: clarifyingQuestion() }]);
        setClarified(true);
        setRunning(false);
      });
      return;
    }
    setStage(0);
    setHighlighted(false);
    later(650, () => setStage(1));
    later(1300, () => {
      setStage(2);
      setHighlighted(true);
    });
    later(1900, () => {
      setMessages((m) => [...m, { role: 'assistant', text: groundedAnswer() }]);
      setStage(-1);
      setRunning(false);
    });
  };

  const stages = ['Parse', 'Search', 'Generate'];

  return (
    <div style={{ fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: INK }}>RAG Playground — Live Demo</div>
          <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2 }}>Retrieve from the knowledge base, watch the pipeline, engineer the prompt.</div>
        </div>
        <button
          onClick={() => setReplaySignal((s) => s + 1)}
          title="Replay the onboarding tour"
          style={{ background: '#FFFFFF', border: `1px solid ${LINE}`, borderRadius: 10, padding: '8px 14px', fontSize: 12.5, fontWeight: 700, color: MUTED, cursor: 'pointer' }}
        >
          ↻ Replay tour
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div
          id="ragpg-knowledge"
          style={{ flex: '1 1 260px', background: '#FFFFFF', border: `1px solid ${LINE}`, borderRadius: 14, padding: 16 }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, color: INK, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>
            📚 Knowledge Base
          </div>
          {CHUNKS.map((c, i) => {
            const on = highlighted && RETRIEVED.includes(i);
            return (
              <div
                key={i}
                style={{
                  fontSize: 12.5, lineHeight: 1.6, color: INK,
                  background: on ? '#FEF3C7' : '#F1F4F8',
                  border: `1px solid ${on ? '#F59E0B' : 'transparent'}`,
                  borderRadius: 8, padding: '8px 10px', marginBottom: 8,
                  transition: 'background 0.3s ease',
                }}
              >
                <span style={{ fontWeight: 800, color: on ? '#92400E' : '#94A3B8', marginRight: 6 }}>
                  [{i + 1}]
                </span>
                {c}
              </div>
            );
          })}
        </div>

        <div
          id="ragpg-pipeline"
          style={{ flex: '1 1 200px', background: '#FFFFFF', border: `1px solid ${LINE}`, borderRadius: 14, padding: 16 }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, color: INK, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>
            ⚙️ Pipeline
          </div>
          {stages.map((s, i) => {
            const active = stage === i;
            const done = stage > i || (stage === -1 && highlighted);
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: '#FFFFFF',
                  background: active ? '#14B8A6' : done ? '#0E9F8A' : '#CBD5E1',
                }}>
                  {done ? '✓' : i + 1}
                </span>
                <span style={{ fontSize: 13, fontWeight: active ? 800 : 500, color: active ? INK : MUTED }}>{s}</span>
              </div>
            );
          })}
          <div style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.5, marginTop: 6 }}>
            Parse → vectors · Search → database · Generate → LLM answers strictly from chunks.
          </div>
        </div>

        <div
          id="ragpg-prompt"
          style={{ flex: '1 1 260px', background: '#FFFFFF', border: `1px solid ${LINE}`, borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, color: INK, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>
            🛠️ Prompt Engineer
          </div>
          <label style={{ fontSize: 11.5, fontWeight: 700, color: MUTED, marginBottom: 4 }} htmlFor="ragpg-framework">
            Framework
          </label>
          <select
            id="ragpg-framework"
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            style={{
              border: `1px solid ${LINE}`, borderRadius: 8, padding: '8px 10px',
              fontSize: 13, color: INK, background: '#F8FAFC', marginBottom: 10, fontFamily: 'inherit',
            }}
          >
            {FRAMEWORKS.map((f) => (
              <option key={f} value={f}>{f === 'None' ? 'None (direct ask)' : f}</option>
            ))}
          </select>
          <div style={{ fontSize: 11, color: MUTED, marginBottom: 10 }}>
            Full 30-framework library lives in the Prompting tab.
          </div>
          <div style={{ flex: 1, minHeight: 120, maxHeight: 220, overflowY: 'auto', marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '90%', fontSize: 12.5, lineHeight: 1.55,
                  background: m.role === 'user' ? TEAL : '#F1F4F8',
                  color: m.role === 'user' ? '#FFFFFF' : INK,
                  borderRadius: 10, padding: '8px 12px',
                }}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send(input); }}
              placeholder="Ask about retrieval…"
              disabled={running}
              style={{
                flex: 1, border: `1px solid ${LINE}`, borderRadius: 8,
                padding: '8px 10px', fontSize: 13, fontFamily: 'inherit', color: INK,
              }}
            />
            <button
              onClick={() => send(input)}
              disabled={running || !input.trim()}
              style={{
                background: running || !input.trim() ? '#CBD5E1' : 'linear-gradient(135deg, #14B8A6, #0E9F8A)',
                color: '#FFFFFF', border: 'none', borderRadius: 8,
                padding: '8px 14px', fontSize: 13, fontWeight: 700,
                cursor: running || !input.trim() ? 'default' : 'pointer',
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <OnboardingTour
        replaySignal={replaySignal}
        onFinish={() => setFramework('Active-Prompt')}
      />
    </div>
  );
}
