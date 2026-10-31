/**
 * TopBar — top app shell header (logo, progress pill, search trigger, breadcrumbs,
 * position bar). Static: rendered on first paint.
 */

import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { UMBRELLA_TOPICS, getTabsForUmbrella, getUmbrellaForTab, getTabById } from '../../registry/tabsRegistry.js';
import {
  getCurrentTrackId,
  getTrackById,
  getTrackProgress,
  subscribeToAdaptiveProgress
} from '../../services/adaptiveLearning.js';
import {
  getTopicMeta,
  getChildById,
  PILOT_COLLAPSED_CHILDREN,
  getChildSequence,
  sortTopicsLikeJourney,
  getChildrenForUmbrella,
  getHubPageId
} from '../../registry/curriculum.js';
import { AskAwayLogo } from './AskAwayLogo.jsx';
import { getSyncStatus, subscribeToSync, isConsented } from '../../services/sync.js';
const AuthButton = lazy(() => import('./AuthButton.jsx').then(m => ({ default: m.AuthButton })));

// Category accents — EdTech palette
const MODULE_ACCENTS = {
  foundations: { primary: '#3A9B9F', dark: '#1A6B6E', gradient: 'linear-gradient(135deg, #3A9B9F, #2E7D80)', lightBg: 'rgba(58,155,159,0.08)', border: 'rgba(58,155,159,0.2)' },
  rag_architecture: { primary: '#E8836A', dark: '#B85A42', gradient: 'linear-gradient(135deg, #E8836A, #D96B50)', lightBg: 'rgba(232,131,106,0.08)', border: 'rgba(232,131,106,0.2)' },
  context_memory: { primary: '#9B89C4', dark: '#6B5E94', gradient: 'linear-gradient(135deg, #C9B8E8, #9B89C4)', lightBg: 'rgba(155,137,196,0.08)', border: 'rgba(155,137,196,0.2)' },
  agents_frameworks: { primary: '#E8836A', dark: '#B85A42', gradient: 'linear-gradient(135deg, #E8836A, #D96B50)', lightBg: 'rgba(232,131,106,0.08)', border: 'rgba(232,131,106,0.2)' },
  data_platform: { primary: '#3A9B9F', dark: '#1A6B6E', gradient: 'linear-gradient(135deg, #3A9B9F, #2E7D80)', lightBg: 'rgba(58,155,159,0.08)', border: 'rgba(58,155,159,0.2)' },
  frontiers_production: { primary: '#9B89C4', dark: '#6B5E94', gradient: 'linear-gradient(135deg, #C9B8E8, #9B89C4)', lightBg: 'rgba(155,137,196,0.08)', border: 'rgba(155,137,196,0.2)' }
};

// Sync status dot — shows synced / syncing / offline / error.
// Reads ai_rag_storage_consent: no dot when the user hasn't consented to sync.
function SyncDot() {
  const [status, setStatus] = useState(getSyncStatus());
  useEffect(() => {
    const unsub = subscribeToSync(setStatus);
    return unsub;
  }, []);
  if (!isConsented()) return null;
  const style = {
    width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block',
    marginLeft: '6px', flexShrink: 0,
  };
  const color = status === 'synced' ? '#22c55e' : status === 'syncing' ? '#f59e0b' : status === 'error' ? '#ef4444' : '#9ca3af';
  return (
    <span
      style={{ ...style, background: color }}
      title={`Progress sync: ${status}`}
      aria-label={`Progress sync ${status}`}
    />
  );
}

export function TopBar({ activeTab, onSelectTab, onSearchOpen, onToggleSidebar, sidebarCollapsed, mobileOpen }) {
  const currentModule = getUmbrellaForTab(activeTab) || UMBRELLA_TOPICS[0];
  const currentTab = getTabById(activeTab) || { id: activeTab, label: activeTab, icon: '📝' };
  const siblingTabs = getTabsForUmbrella(currentModule.id);
  const activeIndex = siblingTabs.findIndex(t => t.id === activeTab);
  const accent = MODULE_ACCENTS[currentModule.id] || MODULE_ACCENTS.foundations;

  const [trackId, setTrackId] = useState(() => getCurrentTrackId());
  const [trackProgress, setTrackProgress] = useState(() => getTrackProgress(trackId));

  useEffect(() => {
    const refresh = () => {
      const t = getCurrentTrackId();
      setTrackId(t);
      setTrackProgress(getTrackProgress(t));
    };
    refresh();
    return subscribeToAdaptiveProgress(refresh);
  }, []);

  const activeTrack = getTrackById(trackId);

  const activeMeta = getTopicMeta(activeTab);
  const activeChild = activeMeta.c ? getChildById(activeMeta.c) : null;
  const pilotSeq = activeChild && PILOT_COLLAPSED_CHILDREN.includes(activeChild.id) && !activeTab.endsWith('_hub');
  const childTabs = activeChild
    ? (pilotSeq
        ? getChildSequence(activeChild.id).map(id => getTabById(id) || { id, label: id }).filter(t => t && !String(t.id).endsWith('_hub'))
        : sortTopicsLikeJourney(getTabsForUmbrella(currentModule.id).filter(t => getTopicMeta(t.id).c === activeChild.id && !String(t.id).endsWith('_hub'))))
    : [];
  const childIndex = childTabs.findIndex(t => t.id === activeTab);
  const prevInChild = childIndex > 0 ? childTabs[childIndex - 1] : null;
  const nextInChild = childIndex >= 0 && childIndex < childTabs.length - 1 ? childTabs[childIndex + 1] : null;
  const isHubPage = typeof activeTab === 'string' && activeTab.endsWith('_hub');
  const hubSiblings = activeChild ? getChildrenForUmbrella(activeChild.umbrellaId) : [];
  const hubAt = activeChild ? hubSiblings.findIndex(c => c.id === activeChild.id) : -1;
  let nextHub = hubAt >= 0 && hubAt < hubSiblings.length - 1 ? hubSiblings[hubAt + 1] : null;
  let prevHub = hubAt > 0 ? hubSiblings[hubAt - 1] : null;
  const umbrellaOrderIdx = activeChild ? UMBRELLA_TOPICS.findIndex(u => u.id === activeChild.umbrellaId) : -1;
  if (!nextHub && umbrellaOrderIdx >= 0) {
    const nextUmbrella = UMBRELLA_TOPICS[umbrellaOrderIdx + 1];
    const firstChild = nextUmbrella ? getChildrenForUmbrella(nextUmbrella.id)[0] : null;
    if (firstChild) nextHub = firstChild;
  }
  if (!prevHub && umbrellaOrderIdx > 0) {
    const prevUmbrella = UMBRELLA_TOPICS[umbrellaOrderIdx - 1];
    const prevChildren = prevUmbrella ? getChildrenForUmbrella(prevUmbrella.id) : [];
    const lastChild = prevChildren.length ? prevChildren[prevChildren.length - 1] : null;
    if (lastChild) prevHub = lastChild;
  }
  const hubPageId = activeChild ? getHubPageId(activeChild.id) : null;

  return (
    <header style={{
      background: 'transparent',
      borderBottom: 'none',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "SF Pro Text", system-ui, sans-serif'
    }}>
      <style jsx>{`
        .topbar-mobile-menu-btn {
          display: none !important;
        }
        .aw-search-pill {
          background: linear-gradient(var(--ds-color-chrome-searchPill, #F1F4F8), var(--ds-color-chrome-searchPill, #F1F4F8)) padding-box,
                      linear-gradient(120deg, var(--ds-color-chrome-ctaFrom, #14B8A6), var(--ds-color-module-context-primary, #9B89C4)) border-box;
          border: 1px solid transparent;
          transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
        }
        .aw-search-pill:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(20, 184, 166, 0.28);
        }
        .aw-chip {
          border-radius: 9999px;
          transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
        }
        .aw-chip:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(22, 40, 63, 0.10);
        }
        .aw-btn {
          display: inline-flex;
          alignItems: center;
          gap: 5px;
          border-radius: 9999px;
          transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
        }
        .aw-btn-prev {
          background: #FFFFFF;
          border: 1px solid var(--ds-color-border-subtle, #E5E7EB);
          color: var(--ds-color-text-secondary, #4B5563);
        }
        .aw-btn-prev:hover:not(:disabled) {
          background: var(--ds-color-bg-surfaceHover, #F1F3F5);
          border-color: var(--ds-color-border-default, #D1D5DB);
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(22, 40, 63, 0.08);
        }
        .aw-btn-next {
          background: linear-gradient(135deg, var(--ds-color-chrome-ctaFrom, #14B8A6), var(--ds-color-chrome-ctaTo, #0E9F8A));
          border: none;
          color: #FFFFFF;
          font-weight: 600;
          box-shadow: 0 6px 16px rgba(20, 184, 166, 0.30);
        }
        .aw-btn-next:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(20, 184, 166, 0.42);
          filter: saturate(1.08);
        }
        @media (max-width: 768px) {
          .topbar-mobile-menu-btn {
            display: inline-flex !important;
          }
        }
      `}</style>

      {/* 1. ASK AWAY HEADER CARD (floating) */}
      <div style={{
        margin: '12px 16px 0',
        padding: '14px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
        background: 'var(--ds-color-chrome-headerBg, #FFFFFF)',
        border: '1px solid var(--ds-color-chrome-headerBorder, #E7EDF3)',
        borderRadius: '18px',
        boxShadow: 'var(--ds-color-chrome-headerShadow, 0 10px 30px rgba(22, 40, 63, 0.08))'
      }}>
        {/* Left: Enlarged Logo + Title + Tagline */}
        <div
          onClick={() => onSelectTab && onSelectTab('overview')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectTab && onSelectTab('overview');
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="AskAway home — go to Overview"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
            userSelect: 'none',
            minWidth: 0
          }}
          title="AskAway — Build, learn, and master the art of Generative AI."
        >
          {onToggleSidebar && (
            <button
              className="topbar-mobile-menu-btn"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSidebar();
              }}
              aria-label="Toggle navigation menu"
              aria-expanded={!!mobileOpen}
              aria-controls="main-sidebar"
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                color: '#475569',
                fontSize: '1rem',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              ☰
            </button>
          )}

          {/* Brand mark — official logo, borderless on the white header card */}
          <div style={{
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <AskAwayLogo
              size={44}
              style={{ filter: 'drop-shadow(0 2px 6px rgba(22, 40, 63, 0.16))' }}
            />
          </div>

          {/* Brand Title & Tagline */}
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              lineHeight: 1.2
            }}>
              <span style={{
                fontWeight: 800,
                fontSize: '1.2rem',
                color: '#16283F',
                letterSpacing: '-0.025em'
              }}>
                AskAway
              </span>
              <span style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                padding: '1px 7px',
                borderRadius: '9999px',
                background: 'rgba(229, 72, 77, 0.10)',
                color: 'var(--ds-color-chrome-proBadge, #E5484D)',
                border: '1px solid rgba(229, 72, 77, 0.25)',
                textTransform: 'uppercase'
              }}>
                PRO
              </span>
            </div>
            <div style={{
              fontSize: '0.76rem',
              color: '#64748B',
              fontWeight: 500,
              marginTop: '2px',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              Build, learn, and master the art of Generative AI.
            </div>
          </div>
        </div>

        {/* Right: Daily Progress pill + Search Pill Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <div
            title={`Daily Progress — ${activeTrack ? activeTrack.title : 'current track'}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              padding: '8px 16px',
              background: 'var(--ds-color-chrome-sidebarCard, #FFFFFF)',
              border: '1px solid var(--ds-color-chrome-headerBorder, #E7EDF3)',
              borderRadius: '9999px',
              boxShadow: '0 4px 14px rgba(22, 40, 63, 0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
              <span style={{
                fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase', color: '#64748B'
              }}>
                Daily Progress
              </span>
              <span style={{
                fontSize: '0.7rem', fontWeight: 800,
                color: 'var(--ds-color-chrome-ctaTo, #0E9F8A)'
              }}>
                {trackProgress.percent}%
              </span>
            </div>
            <div style={{ height: '5px', width: '130px', borderRadius: '3px', background: '#E5E7EB', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${trackProgress.percent}%`, borderRadius: '3px',
                background: 'linear-gradient(90deg, var(--ds-color-chrome-ctaFrom, #14B8A6), var(--ds-color-chrome-ctaTo, #0E9F8A))',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <span style={{ fontSize: '0.62rem', fontWeight: 500, color: '#9CA3AF' }}>
              {trackProgress.completed}/{trackProgress.total} items
            </span>
          </div>
          <button
            className="aw-search-pill"
            onClick={onSearchOpen}
            title="Search knowledge base (Ctrl+K / ⌘K)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              minWidth: '220px',
              padding: '10px 8px 10px 14px',
              borderRadius: '9999px',
              color: '#94A3B8',
              fontSize: '0.82rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <span style={{ flex: 1, textAlign: 'left' }}>Search modules…</span>
            <kbd style={{
              fontSize: '0.66rem',
              padding: '3px 8px',
              background: '#FFFFFF',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              color: '#64748B',
              fontWeight: 700,
              fontFamily: 'inherit'
            }}>Ctrl+K</kbd>
          </button>
          <Suspense fallback={<span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>&nbsp;</span>}>
            <AuthButton />
          </Suspense>
          <SyncDot />
        </div>
      </div>

      {/* 2. NAVIGATION BAR (BELOW THE LOGO) */}
      <div style={{
        padding: '7px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap',
        background: '#FAFBFC'
      }}>
        {/* Left: Breadcrumbs Path */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flexWrap: 'wrap' }}>
          {/* Module Pill (Foundations & Architecture) */}
          <button
            className="aw-chip"
            onClick={() => onSelectTab('overview')}
            title={`All modules — currently in ${currentModule.title}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 11px',
              background: accent.light,
              color: accent.dark,
              fontSize: '0.76rem',
              fontWeight: 600,
              border: `1px solid ${accent.border || 'transparent'}`,
              cursor: 'pointer'
            }}
          >
            <span>{currentModule.icon}</span>
            <span>{currentModule.title}</span>
          </button>

          <span style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>/</span>

          {activeChild && !isHubPage ? (
            <>
              <button
                className="aw-chip"
                onClick={() => hubPageId && onSelectTab(hubPageId)}
                title={`${activeChild.title} — click for hub overview`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 11px',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontSize: '0.76rem',
                  fontWeight: 500,
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer'
                }}
              >
                {activeChild.title}
              </button>
              <span style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>/</span>
            </>
          ) : null}

          {/* Active Tab Name (e.g. Home) */}
          <div
            className="aw-chip"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              background: '#FFFFFF',
              padding: '3px 11px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 4px rgba(22, 40, 63, 0.06)'
            }}
          >
            <span style={{ fontSize: '0.88rem' }}>{currentTab.icon}</span>
            <span style={{
              fontWeight: 600,
              fontSize: '0.8rem',
              color: '#0F172A'
            }}>
              {currentTab.label}
            </span>
          </div>
        </div>

        {/* Right: Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            title={activeChild ? `${activeChild.title} — ${activeChild.blurb}` : 'All topics in this module'}
            style={{
              fontSize: '0.72rem',
              color: '#64748B',
              fontWeight: 500
            }}
          >
            {activeChild && childIndex >= 0
              ? `${childIndex + 1} of ${childTabs.length} · ${activeChild.title}`
              : `${activeIndex + 1} of ${siblingTabs.length}`}
          </span>
        </div>
      </div>

      {/* POSITION BAR — prev/next navigation (Arrow Left/Right = carousel pattern) */}
      {activeChild && (
        <div
          role="group"
          aria-label="Topic position navigation"
          onKeyDown={(e) => {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
            if (e.target?.tagName !== 'BUTTON') return;
            const sel = e.key === 'ArrowLeft' ? '.aw-btn-prev' : '.aw-btn-next';
            const btn = e.currentTarget.querySelector(sel);
            if (btn && !btn.disabled) { e.preventDefault(); btn.click(); }
          }}
          style={{
          padding: '6px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
          borderTop: '1px solid #F1F3F5', background: '#FAFBFC'
        }}>
          {childIndex >= 0 ? (
            <>
              <button
                className="aw-btn aw-btn-prev"
                onClick={() => prevInChild ? onSelectTab(prevInChild.id) : (hubPageId && onSelectTab(hubPageId))}
                title={prevInChild ? `Previous: ${prevInChild.label}` : `Back to ${activeChild.title} overview`}
                style={{
                  padding: '4px 14px',
                  fontSize: '0.75rem', fontWeight: 500,
                  maxWidth: '40vw',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}
              >
                <span>←</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{prevInChild ? prevInChild.label : 'Hub overview'}</span>
              </button>
              <button
                onClick={() => hubPageId && onSelectTab(hubPageId)}
                title={`${activeChild.title} overview — ${childIndex + 1} of ${childTabs.length}`}
                style={{
                  fontSize: '0.68rem', color: '#9CA3AF', whiteSpace: 'nowrap',
                  overflow: 'hidden', textOverflow: 'ellipsis', background: 'transparent',
                  border: 'none', cursor: 'pointer'
                }}
              >
                {activeChild.title} · {childIndex + 1} of {childTabs.length}
              </button>
              <button
                className="aw-btn aw-btn-next"
                onClick={() => {
                  if (nextInChild) onSelectTab(nextInChild.id);
                  else if (nextHub) onSelectTab(getHubPageId(nextHub.id));
                  else if (hubPageId) onSelectTab(hubPageId);
                  else onSelectTab('overview');
                }}
                title={nextInChild ? `Next: ${nextInChild.label}` : (nextHub ? `Next section: ${nextHub.title}` : 'Hub overview')}
                style={{
                  padding: '4px 14px',
                  fontSize: '0.75rem',
                  cursor: 'pointer', maxWidth: '40vw',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{nextInChild ? nextInChild.label : (nextHub ? `Next: ${nextHub.title}` : 'Hub overview')}</span>
                <span>→</span>
              </button>
            </>
          ) : (
            <>
              <button
                className="aw-btn aw-btn-prev"
                onClick={() => prevHub && onSelectTab(getHubPageId(prevHub.id))}
                disabled={!prevHub}
                title={prevHub ? `Previous section: ${prevHub.title}` : 'First section'}
                style={{
                  padding: '4px 14px',
                  fontSize: '0.75rem', fontWeight: 500,
                  color: prevHub ? '#4B5563' : '#D1D5DB',
                  cursor: prevHub ? 'pointer' : 'default',
                  opacity: prevHub ? 1 : 0.5, maxWidth: '40vw',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}
              >
                <span>←</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{prevHub ? prevHub.title : 'Start'}</span>
              </button>
              <span style={{ fontSize: '0.68rem', color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                {activeChild.title} · Hub overview
              </span>
              <button
                className="aw-btn aw-btn-next"
                onClick={() => {
                  if (nextHub) onSelectTab(getHubPageId(nextHub.id));
                  else onSelectTab('overview');
                }}
                title={nextHub ? `Next section: ${nextHub.title}` : 'Back to Overview'}
                style={{
                  padding: '4px 14px',
                  fontSize: '0.75rem',
                  cursor: 'pointer', maxWidth: '40vw',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{nextHub ? `Next: ${nextHub.title}` : 'Overview'}</span>
                <span>→</span>
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

// ============================================
// ModuleSwitcher — Quick Module Switcher
// ============================================
export function ModuleSwitcher({ activeModuleId, onSelectModule }) {
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {UMBRELLA_TOPICS.map(module => {
        const isActive = module.id === activeModuleId;
        const accent = MODULE_ACCENTS[module.id] || MODULE_ACCENTS.foundations;
        return (
          <button
            key={module.id}
            onClick={() => onSelectModule(module.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', borderRadius: '8px',
              background: isActive ? accent.dark : '#FFFFFF',
              color: isActive ? '#ffffff' : '#4B5563',
              border: `1px solid ${isActive ? accent.dark : '#E5E7EB'}`,
              fontSize: '0.78rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s ease'
            }}
          >
            <span>{module.icon}</span>
            <span>{module.title}</span>
          </button>
        );
      })}
    </div>
  );
}
