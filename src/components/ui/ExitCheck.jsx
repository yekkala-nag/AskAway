/**
 * ExitCheck — Phase 3 prove-it modal
 * Three questions for the active topic. Best score persists via mastery.js.
 * Pass bar: 2/3 correct. Same shuffle + reveal pedagogy as the quiz.
 */
import React, { useMemo, useState } from 'react';
import { getExitCheck } from '../../registry/exitChecks.js';
import { useModalA11y } from '../../hooks/useModalA11y.js';
import { getTopicMeta, getLevelInfo } from '../../registry/curriculum.js';
import { getTabById } from '../../registry/tabsRegistry.js';
import { recordQuiz, getMasteryScore, getEvidence } from '../../services/mastery.js';
import { getRemediation } from '../../services/recommend.js';

function shuffleFor(id, n) {
  let seed = [...id].reduce((a, c) => a + c.charCodeAt(0), 13);
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

export function ExitCheck({ open, tabId, onClose, onSelectTab }) {
  // Banks may hold more than three questions (e.g. merged sub-topic banks).
  // Deterministically sample three per topic so the pass bar stays meaningful.
  const questions = useMemo(() => {
    const all = getExitCheck(tabId) || [];
    if (all.length <= 3) return all;
    const pick = shuffleFor(`${tabId}:pick`, all.length).slice(0, 3).sort((a, b) => a - b);
    return pick.map((i) => all[i]);
  }, [tabId]);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(null);
  const answeredCount = Object.keys(answers).length;
  // Dismissable before starting or after finishing — never mid-attempt.
  const { ref: dialogRef, onBackdrop } = useModalA11y(open, onClose, {
    dismissable: done || answeredCount === 0
  });

  const orders = useMemo(
    () => questions.map((q, i) => shuffleFor(`${tabId}:${i}`, q.o.length)),
    [tabId, questions.length]
  );

  if (!open) return null;
  const tab = getTabById(tabId) || { label: tabId, icon: '📝' };
  const meta = getTopicMeta(tabId);
  const lvl = getLevelInfo(meta.l);

  const reset = () => { setAnswers({}); setDone(false); setScore(null); };

  const submit = () => {
    let correct = 0;
    questions.forEach((q, i) => { if (answers[i] === q.a) correct++; });
    const newScore = recordQuiz(tabId, correct, questions.length);
    setScore({ correct, total: questions.length, mastery: newScore });
    setDone(true);
  };

  const allAnswered = questions.length > 0 && questions.every((_, i) => answers[i] !== undefined);
  const passed = score && score.correct >= 2;
  const remedy = done && !passed ? getRemediation(tabId) : null;

  return (
    <div
      onClick={onBackdrop}
      style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(10,12,18,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Exit check: ${tabId}`}
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '600px', maxHeight: '88vh', overflowY: 'auto', background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-border-default)', borderRadius: '16px', padding: '24px', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ds-color-text-primary)' }}>
            ✅ Exit Check — {tab.icon} {tab.label}
          </div>
          <button onClick={() => { reset(); onClose(); }} style={{ background: 'transparent', border: 'none', color: 'var(--ds-color-text-tertiary)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--ds-color-text-tertiary)', marginBottom: '16px' }}>
          Prove it, don't claim it · <span style={{ color: lvl.text, fontWeight: 700 }}>{lvl.label}</span> · pass at 2/3 · best score keeps
          {getEvidence(tabId).quizBest > 0 && ` · current best ${Math.round(getEvidence(tabId).quizBest * 100)}%`}
        </div>

        {!done && questions.map((q, i) => (
          <div key={i} style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--ds-color-text-primary)', marginBottom: '8px' }}>
              {i + 1}. {q.q}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {orders[i].map(oi => {
                const picked = answers[i] === oi;
                return (
                  <button
                    key={oi}
                    onClick={() => setAnswers({ ...answers, [i]: oi })}
                    style={{
                      padding: '9px 12px', borderRadius: '8px', textAlign: 'left', cursor: 'pointer',
                      border: `1px solid ${picked ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-default)'}`,
                      background: picked ? 'rgba(13,148,136,0.12)' : 'transparent',
                      color: 'var(--ds-color-text-primary)', fontSize: '0.83rem'
                    }}
                  >
                    {q.o[oi]}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {!done && (
          <button
            onClick={submit}
            disabled={!allAnswered}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: allAnswered ? 'pointer' : 'default', background: allAnswered ? 'var(--ds-color-module-foundations-primary)' : 'rgba(255,255,255,0.08)', color: 'white', opacity: allAnswered ? 1 : 0.5 }}
          >
            Check Answers →
          </button>
        )}

        {done && (
          <div>
            <div style={{ padding: '14px', borderRadius: '10px', marginBottom: '12px', border: `2px solid ${passed ? '#5EC4C8' : '#F5A623'}`, background: 'var(--ds-color-bg-canvas)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: passed ? '#5EC4C8' : '#F5A623' }}>
                {score.correct}/{score.total} {passed ? '· Proven ✓' : '· Not yet'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                Topic mastery now {score.mastery}
                {score.mastery >= 70 ? ' — counts toward track progress.' : ' — review and retry; visits + best score accumulate.'}
              </div>
            </div>
            {remedy ? (
              <div style={{ padding: '12px', borderRadius: '10px', marginBottom: '12px', border: '1px solid #F5A623', background: 'rgba(245,166,35,0.08)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F5A623', marginBottom: '4px' }}>
                  🧭 Remediation — weakest foundation: {remedy.icon} {remedy.label} ({remedy.score})
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--ds-color-text-secondary)', marginBottom: '8px' }}>
                  This topic builds on it. Shore up the base first, then retry — the check keeps your best score.
                </div>
                {onSelectTab && (
                  <button
                    onClick={() => { reset(); onClose(); onSelectTab(remedy.id); }}
                    style={{ padding: '9px 14px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', background: '#F5A623', color: '#1a1a1a', fontSize: '0.82rem' }}
                  >
                    Study {remedy.label} →
                  </button>
                )}
              </div>
            ) : (
              done && !passed && (
                <div style={{ fontSize: '0.8rem', color: 'var(--ds-color-text-secondary)', marginBottom: '12px' }}>
                  Foundations solid — this one just needs a re-read and a retry.
                </div>
              )
            )}
            {questions.map((q, i) => {
              const ok = answers[i] === q.a;
              return (
                <div key={i} style={{ fontSize: '0.8rem', marginBottom: '8px', color: 'var(--ds-color-text-secondary)' }}>
                  <span style={{ color: ok ? '#5EC4C8' : '#ef4444', fontWeight: 700 }}>{ok ? '✓' : '✕'} {i + 1}.</span> {q.e}
                </div>
              );
            })}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button
                onClick={reset}
                style={{ flex: 1, padding: '11px', borderRadius: '8px', border: '1px solid var(--ds-color-border-default)', background: 'transparent', color: 'var(--ds-color-text-secondary)', cursor: 'pointer', fontWeight: 600 }}
              >
                Retry
              </button>
              <button
                onClick={() => { reset(); onClose(); }}
                style={{ flex: 2, padding: '11px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', background: 'var(--ds-color-module-foundations-primary)', color: 'white' }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
