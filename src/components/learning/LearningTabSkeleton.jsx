import React, { useState } from 'react';

const C = {
  bg: '#0F1219', surface: '#161B26', s2: '#1C2433',
  border: '#2A3548', text: '#E2E8F0', muted: '#B8B8C4',
  teal: '#5EC4C8', coral: '#E8837A', lav: '#C9B8E8',
  ok: '#6BD4A0', bad: '#E8837A', warn: '#E8C37A',
};
const mono = { fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" };
const page = { maxWidth: 940, margin: '0 auto', padding: '24px 20px 60px' };
const card = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 18 };
const label = (color) => ({ color, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 10, ...mono });

function Quiz({ quiz }) {
  const [picked, setPicked] = useState({});
  const [checked, setChecked] = useState(false);
  const done = Object.keys(picked).length === quiz.length;
  const correctCount = quiz.filter((q, i) => picked[i] === q.answer).length;

  return (
    <div style={card}>
      <div style={label(C.coral)}>CHECK YOUR UNDERSTANDING</div>
      {quiz.map((q, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <div style={{ color: C.text, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            {i + 1}. {q.q}
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            {q.options.map((opt, oi) => {
              const isPicked = picked[i] === oi;
              const state = !checked ? (isPicked ? 'picked' : 'idle')
                : oi === q.answer ? 'right'
                : isPicked ? 'wrong' : 'idle';
              return (
                <button
                  key={oi}
                  onClick={() => !checked && setPicked({ ...picked, [i]: oi })}
                  style={{
                    textAlign: 'left', padding: '8px 12px', borderRadius: 8, cursor: checked ? 'default' : 'pointer',
                    background: state === 'picked' ? C.teal + '18' : C.s2,
                    border: `1px solid ${state === 'right' ? C.ok : state === 'wrong' ? C.bad : state === 'picked' ? C.teal : C.border}`,
                    color: state === 'right' ? C.ok : state === 'wrong' ? C.bad : C.text,
                    fontSize: 12.5, lineHeight: 1.5,
                  }}
                >
                  {String.fromCharCode(65 + oi)}. {opt}
                </button>
              );
            })}
          </div>
          {checked && (
            <div style={{ color: C.lav, fontSize: 12, lineHeight: 1.6, marginTop: 6, paddingLeft: 4 }}>
              {picked[i] === q.answer ? '✓ ' : '→ '}
              {q.explain}
            </div>
          )}
        </div>
      ))}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button
          disabled={!done}
          onClick={() => setChecked(true)}
          style={{
            background: done ? C.teal : C.s2, border: 'none', color: done ? C.bg : C.muted,
            padding: '8px 16px', borderRadius: 6, fontSize: 12, fontWeight: 700,
            cursor: done ? 'pointer' : 'not-allowed', ...mono,
          }}
        >
          Check answers
        </button>
        {checked && (
          <>
            <span style={{ color: correctCount === quiz.length ? C.ok : C.warn, fontSize: 12, ...mono }}>
              {correctCount}/{quiz.length} correct
            </span>
            <button
              onClick={() => { setPicked({}); setChecked(false); }}
              style={{ background: 'none', border: `1px solid ${C.border}`, color: C.muted, padding: '7px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer', ...mono }}
            >
              Retry
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Consistent learning-tab skeleton:
 * objectives + intuition/analogy header, 6-section sub-nav, common-mistakes
 * callouts inside sections, quiz, prerequisite/next links.
 */
export default function LearningTabSkeleton({
  eyebrow, title, tagline, objectives, analogy,
  sections, quiz, prev, next, onSelectTab,
}) {
  const [tab, setTab] = useState(sections[0].id);

  return (
    <div style={page}>
      {/* Header: objectives + intuition */}
      <div style={card}>
        <div style={{ color: C.coral, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', ...mono }}>{eyebrow}</div>
        <h1 style={{ color: C.text, fontSize: 21, fontWeight: 800, margin: '6px 0 8px' }}>{title}</h1>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>{tagline}</div>

        <div style={label(C.teal)}>LEARNING OBJECTIVES — BY THE END YOU CAN</div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {objectives.map((o, i) => (
            <li key={i} style={{ color: C.text, fontSize: 12.5, lineHeight: 1.75 }}>{o}</li>
          ))}
        </ul>

        <div style={{ ...label(C.lav), marginTop: 14 }}>INTUITION — THE ANALOGY</div>
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.lav}`, borderRadius: 8, padding: 12, color: C.text, fontSize: 12.5, lineHeight: 1.7 }}>
          {analogy}
        </div>
      </div>

      {/* Section sub-nav */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setTab(s.id)}
            style={{
              background: tab === s.id ? C.teal + '18' : C.surface,
              border: `1px solid ${tab === s.id ? C.teal : C.border}`,
              color: tab === s.id ? C.teal : C.muted,
              borderRadius: 8, padding: '8px 12px', fontSize: 12, cursor: 'pointer',
              textAlign: 'left', ...mono,
            }}
          >
            {s.icon} {s.label}
          </button>
        ))}
        <button
          onClick={() => setTab('__quiz')}
          style={{
            background: tab === '__quiz' ? C.coral + '18' : C.surface,
            border: `1px solid ${tab === '__quiz' ? C.coral : C.border}`,
            color: tab === '__quiz' ? C.coral : C.muted,
            borderRadius: 8, padding: '8px 12px', fontSize: 12, cursor: 'pointer', ...mono,
          }}
        >
          📝 Quiz
        </button>
      </div>

      {tab !== '__quiz' && sections.find((s) => s.id === tab)?.render()}

      {tab === '__quiz' && (
        <>
          <Quiz quiz={quiz} />
          <div style={card}>
            <div style={label(C.teal)}>COMMON MISCONCEPTIONS</div>
            {quiz.map((q, i) => (
              <div key={i} style={{ color: C.muted, fontSize: 12, lineHeight: 1.7, marginBottom: 6 }}>
                ✗ <span style={{ color: C.text }}>{q.myth}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Prereq / next links */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        {prev ? (
          <button
            onClick={() => onSelectTab && onSelectTab(prev.id)}
            style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: '10px 14px', fontSize: 12, cursor: 'pointer', textAlign: 'left', ...mono }}
          >
            ← Prerequisite<br /><span style={{ color: C.muted, fontSize: 11 }}>{prev.label}</span>
          </button>
        ) : <span />}
        {next && (
          <button
            onClick={() => onSelectTab && onSelectTab(next.id)}
            style={{ background: C.surface, border: `1px solid ${C.teal}66`, color: C.teal, borderRadius: 8, padding: '10px 14px', fontSize: 12, cursor: 'pointer', textAlign: 'right', ...mono }}
          >
            Next →<br /><span style={{ color: C.muted, fontSize: 11 }}>{next.label}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export { C as learningTokens, mono as learningMono, card as learningCard, label as learningLabel };
