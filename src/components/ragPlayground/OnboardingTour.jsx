import { useEffect, useState } from 'react';

const STORAGE_KEY = 'askaway_rag_tour_seen';

const DEFAULT_STEPS = [
  {
    id: 'welcome',
    title: '👋 Welcome to the RAG Playground',
    body: 'Stop guessing how AI reads your data. See the entire Retrieval-Augmented Generation pipeline in real time. We’ll walk you through the 3 core zones of a production RAG system.',
    target: 'center',
    cta: 'Let’s Go →',
  },
  {
    id: 'knowledge-base',
    title: '📚 Zone 1: The Knowledge Base',
    body: 'Notice the yellow highlighted text? Those are “chunks” the AI retrieved. If it can’t find a relevant chunk here, it won’t hallucinate an answer.',
    target: 'ragpg-knowledge',
    cta: 'Next →',
  },
  {
    id: 'pipeline',
    title: '⚙️ Zone 2: The RAG Pipeline',
    body: 'Watch it work: 1. Parse (vectors) → 2. Search (database) → 3. Generate (LLM). The model only answers using the retrieved chunks.',
    target: 'ragpg-pipeline',
    cta: 'Next →',
  },
  {
    id: 'prompt-engineer',
    title: '🛠️ Zone 3: Prompt Engineering',
    body: 'Type a question, but first open the Framework dropdown. Try “Active-Prompt” — the AI asks you clarifying questions before retrieving.',
    target: 'ragpg-prompt',
    cta: 'Start Building! 🚀',
  },
];

function readSeen(key) {
  try {
    return window.localStorage.getItem(key) === 'true';
  } catch (e) {
    return false;
  }
}

function writeSeen(key) {
  try {
    window.localStorage.setItem(key, 'true');
  } catch (e) {
    /* storage blocked — tour simply reappears next visit */
  }
}

export function resetRagPlaygroundTour(key = STORAGE_KEY) {
  try {
    window.localStorage.removeItem(key);
  } catch (e) {
    /* ignore */
  }
}

/**
 * Adapted tour: step 0 is a centered modal; steps 1–3 dock as a bottom
 * sheet while the referenced zone is ring-highlighted and scrolled into
 * view (robust across viewports — no fragile absolute positioning).
 */
export function OnboardingTour({
  steps = DEFAULT_STEPS,
  storageKey = STORAGE_KEY,
  onFinish,
  replaySignal = 0,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (readSeen(storageKey)) return undefined;
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, [storageKey]);

  useEffect(() => {
    if (replaySignal > 0) {
      setCurrentStep(0);
      setIsVisible(true);
    }
  }, [replaySignal]);

  useEffect(() => {
    if (!isVisible) return undefined;
    const step = steps[currentStep];
    if (!step || step.target === 'center') return undefined;
    let el = null;
    let prev = null;
    try {
      el = document.getElementById(step.target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        prev = {
          outline: el.style.outline,
          outlineOffset: el.style.outlineOffset,
          boxShadow: el.style.boxShadow,
        };
        el.style.outline = '3px solid #14B8A6';
        el.style.outlineOffset = '4px';
        el.style.boxShadow = '0 0 0 6px rgba(20, 184, 166, 0.18)';
      }
    } catch (e) {
      el = null;
    }
    return () => {
      try {
        if (el && prev) {
          el.style.outline = prev.outline;
          el.style.outlineOffset = prev.outlineOffset;
          el.style.boxShadow = prev.boxShadow;
        }
      } catch (e) {
        /* ignore */
      }
    };
  }, [isVisible, currentStep, steps]);

  if (!isVisible) return null;

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const centered = step.target === 'center';

  const finish = () => {
    setIsVisible(false);
    writeSeen(storageKey);
    if (onFinish) onFinish();
  };

  const handleNext = () => {
    if (isLast) finish();
    else setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (!isFirst) setCurrentStep((s) => s - 1);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={step.title}
      style={{
        position: 'fixed', inset: 0, zIndex: 90,
        background: centered ? 'rgba(10, 20, 48, 0.45)' : 'transparent',
        pointerEvents: centered ? 'auto' : 'none',
        display: 'flex', alignItems: centered ? 'center' : 'flex-end',
        justifyContent: 'center', padding: 16,
      }}
      onClick={centered ? undefined : () => {}}
    >
      <div
        style={{
          pointerEvents: 'auto',
          position: 'relative',
          width: 'min(440px, 100%)',
          marginBottom: centered ? 0 : 12,
          background: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #E7EDF3',
          boxShadow: '0 24px 60px rgba(10, 20, 48, 0.28)',
          padding: 20,
          fontFamily: 'inherit',
        }}
      >
        <button
          onClick={finish}
          aria-label="Skip tour"
          title="Skip tour"
          style={{
            position: 'absolute', top: 12, right: 12,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#94A3B8', fontSize: 18, lineHeight: 1, padding: 4,
          }}
        >
          ×
        </button>

        <div style={{ fontSize: 11, fontWeight: 700, color: '#0E9F8A', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
          Step {currentStep + 1} of {steps.length}
        </div>
        <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: '#16283F' }}>
          {step.title}
        </h3>
        <p style={{ margin: '0 0 16px', fontSize: 13.5, color: '#475569', lineHeight: 1.6 }}>
          {step.body}
        </p>

        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {steps.map((_, idx) => (
            <div
              key={idx}
              style={{
                height: 6, borderRadius: 3,
                width: idx === currentStep ? 24 : 6,
                background: idx === currentStep ? '#14B8A6' : '#E2E8F0',
                transition: 'width 0.2s ease',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {isFirst ? (
            <button
              onClick={finish}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#64748B', padding: '8px 0' }}
            >
              Skip tour
            </button>
          ) : (
            <button
              onClick={handleBack}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#64748B', padding: '8px 0' }}
            >
              ← Back
            </button>
          )}
          <button
            onClick={handleNext}
            style={{
              background: 'linear-gradient(135deg, #14B8A6, #0E9F8A)',
              color: '#FFFFFF', border: 'none', borderRadius: 10,
              padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(20, 184, 166, 0.35)',
            }}
          >
            {step.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
