import { useEffect, useState } from 'react';
import { getTabById, TABS_REGISTRY, UMBRELLA_TOPICS } from '../../registry/tabsRegistry.js';
import { getCompletedTabs, subscribeToAdaptiveProgress } from '../../services/adaptiveLearning.js';
import { SEVEN_LAYERS, Icon } from '../ui/CleanInfographics.jsx';

/**
 * Overview chrome data + hooks (AskAway redesign).
 * Curated index rows declare explicit tabIds so labels can differ from
 * umbrella titles; progress is % mastered over those ids (0% when untouched).
 * Unknown ids are filtered defensively so registry drift degrades, not breaks.
 */

export const CURATED_INDEX = [
  {
    id: 'start',
    label: 'Overview & Roadmap',
    icon: '🧭',
    tabIds: ['overview', 'airoadmap'],
    targetTab: 'overview',
  },
  {
    id: 'foundations',
    label: 'AI Foundations',
    icon: '📚',
    tabIds: ['firstaiapp', 'promptfundamentals', 'threesentenceprompt', 'datacentricai'],
    targetTab: 'firstaiapp',
  },
  {
    id: 'internals',
    label: 'Model Internals',
    icon: '🔬',
    tabIds: ['tokenization', 'quantserve', 'posencoding', 'modellandscape'],
    targetTab: 'tokenization',
  },
];

export function getCuratedProgress(tabIds) {
  let valid = [];
  try {
    valid = tabIds.filter((id) => {
      try {
        return !!getTabById(id);
      } catch (e) {
        return false;
      }
    });
  } catch (e) {
    valid = [];
  }
  const total = valid.length > 0 ? valid.length : tabIds.length;
  let done = [];
  try {
    done = getCompletedTabs();
  } catch (e) {
    done = [];
  }
  const doneSet = new Set(done);
  const hit = valid.filter((id) => doneSet.has(id)).length;
  return {
    percent: total > 0 ? Math.round((hit / total) * 100) : 0,
    completed: hit,
    total,
  };
}

/** First unmastered tab in the entry (deep-link target), else the entry fallback. */
export function getCuratedNextTab(entry) {
  let done = new Set();
  try {
    done = new Set(getCompletedTabs());
  } catch (e) {
    done = new Set();
  }
  const next = (entry.tabIds || []).find((id) => {
    try {
      return getTabById(id) && !done.has(id);
    } catch (e) {
      return false;
    }
  });
  return next || entry.targetTab;
}

export function useCuratedProgress() {
  const [, setTick] = useState(0);
  useEffect(() => subscribeToAdaptiveProgress(() => setTick((t) => t + 1)), []);
  return CURATED_INDEX.map((entry) => ({ ...entry, ...getCuratedProgress(entry.tabIds) }));
}

/** Header stat strip definitions. Counts resolve live from the registry. */
export function getOverviewStats() {
  let modules = 189;
  try {
    const real = TABS_REGISTRY.filter((t) => t && t.id && !String(t.id).endsWith('_hub')).length;
    if (real > 0) modules = real;
  } catch (e) {
    modules = 189;
  }
  let paths = 6;
  try {
    if (UMBRELLA_TOPICS.length > 0) paths = UMBRELLA_TOPICS.length;
  } catch (e) {
    paths = 6;
  }
  return [
    { value: String(modules), label: 'Modules', accent: true, targetTab: 'progress' },
    { value: String(paths), label: 'Learning Paths', accent: true, targetTab: 'airoadmap' },
    { value: null, label: 'Real-Time Lab', accent: false, targetTab: 'llmevals' },
    { value: null, label: 'Secure Sandbox', accent: false, targetTab: 'agentsandbox' },
  ];
}

/** Stat strip (mock row 1). Every stat navigates; counts resolve live. */
export function StatsStrip({ onSelectTab }) {
  const stats = getOverviewStats();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 28px', marginBottom: '18px' }}>
      {stats.map((s) => (
        <button
          key={s.label}
          onClick={() => onSelectTab && s.targetTab && onSelectTab(s.targetTab)}
          title={s.targetTab ? `Open ${s.label}` : s.label}
          style={{
            background: 'none', border: 'none', cursor: s.targetTab ? 'pointer' : 'default',
            padding: 0, fontSize: '1.35rem', fontWeight: 600, color: '#1A1D26',
            letterSpacing: '-0.01em', fontFamily: 'inherit', textAlign: 'left',
          }}
        >
          {s.value != null ? (
            <span style={{ color: s.accent ? '#0E9F8A' : '#1A1D26', fontWeight: 800 }}>{s.value} </span>
          ) : null}
          <span>{s.label}</span>
        </button>
      ))}
    </div>
  );
}

const CTA_TEAL = 'linear-gradient(135deg, var(--ds-color-chrome-ctaFrom, #14B8A6), var(--ds-color-chrome-ctaTo, #0E9F8A))';

/** CTA pill row (mock row 2). Handlers come from the host tab — no new logic. */
export function CtaRow({ onExploreLayers, onOpenRoadmap, onOpenDiagnostic }) {
  const teal = {
    background: CTA_TEAL, color: '#FFFFFF', border: 'none',
    boxShadow: 'var(--ds-color-chrome-ctaShadow, 0 8px 20px rgba(20, 184, 166, 0.35))',
  };
  const outline = {
    background: '#FFFFFF', color: '#1A1D26', border: '2px solid #1A1D26',
    boxShadow: 'none',
  };
  const base = {
    borderRadius: '9999px', padding: '12px 26px', fontSize: '0.95rem', fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit', transition: 'transform 0.12s ease, box-shadow 0.12s ease',
  };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '22px' }}>
      <button onClick={onExploreLayers} style={{ ...base, ...teal }}>Explore 7-Layer Stack</button>
      <button onClick={onOpenRoadmap} style={{ ...base, ...outline }}>AI Engineer Roadmap</button>
      <button onClick={onOpenDiagnostic} style={{ ...base, ...teal }}>30s Skill Diagnostic</button>
    </div>
  );
}

/** Dark navy 7-layer showcase (mock panel). Same dataset as SevenLayersStack. */
export function LayersShowcasePanel({ onSelectLayer }) {
  return (
    <div
      id="seven-layers-section"
      style={{
        scrollMarginTop: '80px',
        background: 'var(--ds-color-chrome-showcaseBg, #0A1430)',
        border: '1px solid var(--ds-color-chrome-showcaseEdge, rgba(94, 196, 200, 0.25))',
        borderRadius: '18px',
        padding: '28px 28px 32px',
        marginBottom: '24px',
        boxShadow: '0 20px 50px rgba(10, 20, 48, 0.35)',
      }}
    >
      <div style={{
        color: '#FFFFFF', fontSize: '1.3rem', fontWeight: 800,
        textAlign: 'center', marginBottom: '22px', letterSpacing: '-0.01em',
      }}>
        7 Layers of AI — From Classical Rules to General Intelligence
      </div>
      <div style={{ position: 'relative', display: 'grid', gap: '12px', maxWidth: '720px', margin: '0 auto' }}>
        <div style={{
          position: 'absolute', left: '31px', top: '16px', bottom: '16px', width: '2px',
          background: 'linear-gradient(180deg, #A78BFA, #5EC4C8)', opacity: 0.5,
        }} />
        {SEVEN_LAYERS.map((l) => (
          <button
            key={l.n}
            onClick={() => onSelectLayer && onSelectLayer(l)}
            title={l.flag ? `${l.t} — ${l.flag}` : l.t}
            style={{
              position: 'relative', display: 'flex', alignItems: 'center', gap: '14px',
              padding: '13px 18px 13px 16px', borderRadius: '14px', cursor: onSelectLayer ? 'pointer' : 'default',
              background: `linear-gradient(90deg, ${l.c}55 0%, ${l.c}22 55%, transparent 100%)`,
              border: `1px solid ${l.c}66`, textAlign: 'left', fontFamily: 'inherit',
              boxShadow: `0 0 24px ${l.c}33`,
            }}
          >
            <span style={{
              width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.1)', border: `1px solid ${l.c}88`,
            }}>
              <Icon name={l.icon} size={18} color="#FFFFFF" />
            </span>
            <span style={{ color: '#FFFFFF', fontSize: '1.02rem', fontWeight: 700 }}>
              <span style={{ opacity: 0.75, marginRight: '8px' }}>{l.n}</span>
              {l.t}
            </span>
            {l.flag ? (
              <span style={{
                marginLeft: 'auto', fontSize: '0.66rem', fontWeight: 700, color: '#0A1430',
                background: '#5EC4C8', borderRadius: '20px', padding: '3px 10px',
                textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0,
              }}>
                {l.flag}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
