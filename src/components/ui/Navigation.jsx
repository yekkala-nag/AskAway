/**
 * Navigation Components — Sidebar, TopBar, CommandPalette, ModuleSwitcher
 * Apple Product Architecture & UI/UX Redesign (macOS Sequoia / Sonoma Aesthetic)
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { UMBRELLA_TOPICS, getTabsForUmbrella, getUmbrellaForTab, getTabById, TABS_REGISTRY } from '../../registry/tabsRegistry.js';
import { getModuleColors } from '../../design-system/tokens.js';
import { Button, Badge } from './Core.jsx';
import { LuminaLogo } from './LuminaLogo.jsx';
import {
  getCurrentTrackId,
  getTrackById,
  getTrackProgress,
  subscribeToAdaptiveProgress
} from '../../services/adaptiveLearning.js';
import {
  getGroupedTabsForUmbrella,
  getTopicMeta,
  getLevelInfo,
  getChildLevelCounts,
  getChildLevelSpan,
  getChildById,
  getChildrenForUmbrella,
  getChildSequence,
  getHubPageId,
  PILOT_COLLAPSED_CHILDREN,
  sortTopicsLikeJourney
} from '../../registry/curriculum.js';
import { useModalA11y } from '../../hooks/useModalA11y.js';
import { isMastered } from '../../services/mastery.js';

// Category accents — EdTech palette
const MODULE_ACCENTS = {
  foundations: { primary: '#3A9B9F', dark: '#1A6B6E', gradient: 'linear-gradient(135deg, #3A9B9F, #2E7D80)', lightBg: 'rgba(58,155,159,0.08)', border: 'rgba(58,155,159,0.2)' },
  rag_architecture: { primary: '#E8836A', dark: '#B85A42', gradient: 'linear-gradient(135deg, #E8836A, #D96B50)', lightBg: 'rgba(232,131,106,0.08)', border: 'rgba(232,131,106,0.2)' },
  context_memory: { primary: '#9B89C4', dark: '#6B5E94', gradient: 'linear-gradient(135deg, #C9B8E8, #9B89C4)', lightBg: 'rgba(155,137,196,0.08)', border: 'rgba(155,137,196,0.2)' },
  agents_frameworks: { primary: '#E8836A', dark: '#B85A42', gradient: 'linear-gradient(135deg, #E8836A, #D96B50)', lightBg: 'rgba(232,131,106,0.08)', border: 'rgba(232,131,106,0.2)' },
  data_platform: { primary: '#3A9B9F', dark: '#1A6B6E', gradient: 'linear-gradient(135deg, #3A9B9F, #2E7D80)', lightBg: 'rgba(58,155,159,0.08)', border: 'rgba(58,155,159,0.2)' },
  frontiers_production: { primary: '#9B89C4', dark: '#6B5E94', gradient: 'linear-gradient(135deg, #C9B8E8, #9B89C4)', lightBg: 'rgba(155,137,196,0.08)', border: 'rgba(155,137,196,0.2)' }
};

// ============================================
// PilotHubRow — one collapsed sidebar row per pilot hub (Batch: prompt hub).
// Replaces the flat per-subtopic list for children in
// PILOT_COLLAPSED_CHILDREN. Click opens the hub overview (page 0);
// position ("N of 10") + level chip show while inside the hub.
// In search mode the caller bypasses this and lists matches flat.
// ============================================
function PilotHubRow({ child, rawTabs, activeTab, onSelectTab }) {
  const seq = getChildSequence(child.id);
  const hubId = getHubPageId(child.id);
  const hubTab = getTabById(hubId) || { label: child.title, icon: '📚' };
  const proven = seq.filter(isMastered).length;
  const pct = seq.length ? Math.round((proven / seq.length) * 100) : 0;
  const activeIndex = seq.indexOf(activeTab);
  const isInside = activeIndex >= 0 || activeTab === hubId;
  const activeLevel = activeIndex >= 0 ? (getTopicMeta(activeTab).l || 1) : null;
  const levelInk = { 1: '#1A6B6E', 2: '#6B5E94', 3: '#B85A42' };
  const [expanded, setExpanded] = useState(isInside);
  useEffect(() => { if (isInside) setExpanded(true); }, [isInside]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <button
        onClick={() => onSelectTab(hubId)}
        title={`${child.title} — ${child.blurb} (${proven}/${seq.length} proven)`}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '5px 8px', borderRadius: '5px',
          background: isInside ? 'rgba(58,155,159,0.08)' : 'transparent',
          color: isInside ? '#3A9B9F' : '#4B5563',
          border: 'none', cursor: 'pointer', textAlign: 'left',
          fontSize: '0.75rem', fontWeight: isInside ? 600 : 500,
          transition: 'all 0.12s ease', flex: 1, minWidth: 0
        }}
        onMouseEnter={e => {
          if (!isInside) { e.currentTarget.style.background = '#F1F3F5'; }
        }}
        onMouseLeave={e => {
          if (!isInside) { e.currentTarget.style.background = 'transparent'; }
        }}
      >
        <span style={{ fontSize: '0.8rem', flexShrink: 0 }}>{hubTab.icon}</span>
        <span style={{
          lineHeight: 1.25,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          flex: 1
        }}>
          {child.title}
        </span>
        {activeLevel && (
          <span style={{
            fontSize: '0.58rem', fontWeight: 700, fontFamily: 'SF Mono, monospace',
            color: levelInk[activeLevel],
            background: 'rgba(58,155,159,0.10)',
            padding: '0px 5px', borderRadius: '9999px', flexShrink: 0
          }}>
            L{activeLevel}
          </span>
        )}
        <span style={{
          fontSize: '0.6rem', fontWeight: 600, color: isInside ? '#3A9B9F' : '#9CA3AF',
          flexShrink: 0
        }}>
          {activeIndex >= 0 ? `${activeIndex + 1}/${seq.length}` : `${proven}/${seq.length}`}
        </span>
      </button>
        <button
          onClick={() => setExpanded(e => !e)}
          title={expanded ? `Collapse ${child.title} topics` : `Expand ${child.title} topics (${seq.length})`}
          aria-expanded={expanded}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${child.title} topics`}
          style={{
            flexShrink: 0, width: '22px', height: '22px', borderRadius: '5px',
            background: 'transparent', border: '1px solid #E5E7EB',
            color: '#9CA3AF', cursor: 'pointer', fontSize: '0.65rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <span style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s ease' }}>›</span>
        </button>
      </div>
      <div style={{ padding: '2px 8px 4px 8px' }} title={`${child.blurb} — ${proven}/${seq.length} proven`}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: '0.58rem', fontWeight: 600, color: '#9CA3AF', marginBottom: '3px'
        }}>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {getChildLevelSpan(child.id, rawTabs)} · {seq.length} topics
          </span>
          <span style={{ fontWeight: 600, flexShrink: 0, marginLeft: '6px' }}>
            {pct}%
          </span>
        </div>
        <div style={{ height: '3px', borderRadius: '2px', background: '#E5E7EB', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`, borderRadius: '2px',
            background: '#3A9B9F', transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', paddingLeft: '14px', marginTop: '2px' }} role="list" aria-label={`${child.title} topics`}>
          {seq.map((id, i) => {
            const t = getTabById(id) || { label: id, icon: '📝' };
            const isActive = id === activeTab;
            const done = isMastered(id);
            return (
              <button
                key={id}
                role="listitem"
                onClick={() => onSelectTab(id)}
                title={`${i + 1}. ${t.label}${done ? ' (proven ✓)' : ''}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '4px 8px', borderRadius: '5px',
                  background: isActive ? 'rgba(58,155,159,0.08)' : 'transparent',
                  color: isActive ? '#3A9B9F' : '#4B5563',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  fontSize: '0.72rem', fontWeight: isActive ? 600 : 500,
                  width: '100%'
                }}
              >
                <span style={{ fontSize: '0.6rem', opacity: 0.7, flexShrink: 0 }}>{done ? '✓' : `${i + 1}`}</span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{t.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================
// Sidebar — Apple macOS Sequoia Glass Sidebar
// ============================================
export function Sidebar({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  collapsed,
  onToggleCollapse,
}) {
  const [trackId, setTrackId] = useState(() => getCurrentTrackId());
  const [trackProgress, setTrackProgress] = useState(() => getTrackProgress(trackId));

  useEffect(() => {
    const refresh = () => {
      const t = getCurrentTrackId();
      setTrackId(t);
      setTrackProgress(getTrackProgress(t));
      setProgTick(x => x + 1);
    };
    refresh();
    return subscribeToAdaptiveProgress(refresh);
  }, []);

  const activeTrack = getTrackById(trackId);
  const [, setProgTick] = useState(0);

  const [expandedModules, setExpandedModules] = useState({
    foundations: true,
    rag_architecture: false,
    context_memory: false,
    agents_frameworks: false,
    data_platform: false,
    frontiers_production: false,
  });

  useEffect(() => {
    const parentModule = getUmbrellaForTab(activeTab);
    if (parentModule?.id) {
      setExpandedModules({
        foundations: false,
        rag_architecture: false,
        context_memory: false,
        agents_frameworks: false,
        data_platform: false,
        frontiers_production: false,
        [parentModule.id]: true
      });
    }
  }, [activeTab]);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => {
      const willOpen = !prev[moduleId];
      if (willOpen) {
        return {
          foundations: false,
          rag_architecture: false,
          context_memory: false,
          agents_frameworks: false,
          data_platform: false,
          frontiers_production: false,
          [moduleId]: true
        };
      } else {
        return { ...prev, [moduleId]: false };
      }
    });
  };

  const moduleOrder = UMBRELLA_TOPICS.map(m => m.id);
  const queryStr = (typeof searchQuery === 'string' ? searchQuery : (searchQuery?.target?.value || '')).trim().toLowerCase();
  const isHubTab = (tabId) => typeof tabId === 'string' && tabId.endsWith('_hub');
  const isSearchMode = queryStr.length > 0;

  let totalVisibleTabs = 0;

  return (
    <aside
      style={{
        width: '100%',
        height: '100%',
        background: '#FFFFFF',
        color: '#1A1D26',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "SF Pro Text", system-ui, sans-serif',
        userSelect: 'none',
        borderRight: '1px solid #E5E7EB'
      }}
      aria-label="Main navigation"
    >
      {/* 1. BRAND HEADER */}
      <div style={{
        padding: collapsed ? '16px 12px' : '16px 16px 12px',
        borderBottom: '1px solid #F1F3F5',
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
        }}>
          <div
            onClick={() => onSelectTab && onSelectTab('overview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              overflow: 'hidden',
              cursor: 'pointer',
              userSelect: 'none'
            }}
            title="Lumina AI — Build, learn, and master the art of Generative AI."
          >
            <div style={{
              width: '34px', height: '34px', borderRadius: '10px',
              background: '#0B0F19',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(11, 15, 25, 0.12), inset 0 0 10px rgba(56, 189, 248, 0.15)'
            }}>
              <LuminaLogo size={26} />
            </div>
            {!collapsed && (
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontWeight: 800, fontSize: '0.98rem', color: '#0F172A',
                  letterSpacing: '-0.02em', lineHeight: 1.2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  <span>Lumina AI</span>
                  <span style={{
                    fontSize: '0.58rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    background: 'rgba(56, 189, 248, 0.12)',
                    color: '#0284C7',
                    textTransform: 'uppercase'
                  }}>PRO</span>
                </div>
                <div style={{
                  fontSize: '0.67rem', color: '#64748B',
                  fontWeight: 500, marginTop: '2px',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  maxWidth: '160px'
                }} title="Build, learn, and master the art of Generative AI.">
                  Build, learn & master GenAI
                </div>
              </div>
            )}
          </div>
          {!collapsed && onToggleCollapse && (
            <button
              onClick={() => onToggleCollapse?.()}
              title="Collapse sidebar (⌘[)"
              style={{
                background: 'transparent', border: '1px solid #E5E7EB',
                borderRadius: '6px', color: '#9CA3AF', cursor: 'pointer',
                width: '28px', height: '28px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s ease', fontSize: '0.7rem'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F1F3F5'; e.currentTarget.style.color = '#4B5563'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}
              aria-label="Collapse sidebar"
            >
              ◂
            </button>
          )}
        </div>
      </div>

      {/* 2. SEARCH INPUT */}
      {!collapsed && (
        <div style={{ padding: '12px 16px 8px', flexShrink: 0 }}>
          <div style={{
            position: 'relative', display: 'flex', alignItems: 'center',
            background: '#F1F3F5', border: '1px solid #E5E7EB',
            borderRadius: '8px', padding: '7px 10px 7px 32px',
            transition: 'all 0.15s ease'
          }}>
            <span style={{ position: 'absolute', left: '10px', color: '#9CA3AF', fontSize: '0.8rem', pointerEvents: 'none' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search topics..."
              value={typeof searchQuery === 'string' ? searchQuery : (searchQuery?.target?.value || '')}
              onChange={(e) => onSearchChange?.(e.target.value)}
              style={{
                width: '100%', background: 'transparent', border: 'none',
                color: '#1A1D26', fontSize: '0.8rem', outline: 'none', fontFamily: 'inherit'
              }}
            />
            {queryStr.length === 0 ? (
              <kbd style={{
                fontSize: '0.6rem', padding: '2px 5px', borderRadius: '4px',
                background: '#FFFFFF', border: '1px solid #E5E7EB',
                color: '#9CA3AF', fontWeight: 600, flexShrink: 0
              }}>
                ⌘K
              </kbd>
            ) : (
              <button
                onClick={() => onSearchChange?.('')}
                style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '0.75rem', padding: '0 2px' }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. TODAY'S GOAL CARD */}
      {!collapsed && !queryStr && (
        <div style={{ padding: '4px 16px 12px', flexShrink: 0 }}>
          <div style={{
            background: '#F7F8FA', border: '1px solid #E5E7EB',
            borderRadius: '10px', padding: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1A1D26' }}>
                Today's goal
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#3A9B9F' }}>
                {trackProgress.completed}/{trackProgress.total} items
              </span>
            </div>
            <div style={{ height: '4px', borderRadius: '2px', background: '#E5E7EB', overflow: 'hidden', marginBottom: '6px' }}>
              <div style={{
                height: '100%', width: `${trackProgress.percent}%`, borderRadius: '2px',
                background: 'linear-gradient(90deg, #3A9B9F, #2E7D80)',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>
              {trackProgress.percent === 0
                ? 'Complete items to stay at a good pace!'
                : trackProgress.percent >= 100
                  ? 'Great work! You\'re ahead of schedule.'
                  : 'Keep going — you\'re making progress!'}
            </div>
          </div>
        </div>
      )}

      {/* 4. QUICK NAVIGATION */}
      {!collapsed && !queryStr && (
        <div style={{ padding: '0 16px 8px', flexShrink: 0 }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px', paddingLeft: '2px' }}>
            Quick Navigation
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <button
              onClick={() => onSelectTab('overview')}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 8px', borderRadius: '6px',
                background: activeTab === 'overview' ? 'rgba(58,155,159,0.08)' : 'transparent',
                color: activeTab === 'overview' ? '#3A9B9F' : '#4B5563',
                border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.8rem',
                fontWeight: activeTab === 'overview' ? 600 : 500,
                transition: 'all 0.12s ease', width: '100%'
              }}
              onMouseEnter={e => { if (activeTab !== 'overview') e.currentTarget.style.background = '#F1F3F5'; }}
              onMouseLeave={e => { if (activeTab !== 'overview') e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: '0.85rem' }}>📊</span>
              <span>Overview & Roadmap</span>
            </button>
            <button
              onClick={() => onSelectTab('airoadmap')}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 8px', borderRadius: '6px',
                background: activeTab === 'airoadmap' ? 'rgba(58,155,159,0.08)' : 'transparent',
                color: activeTab === 'airoadmap' ? '#3A9B9F' : '#4B5563',
                border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.8rem',
                fontWeight: activeTab === 'airoadmap' ? 600 : 500,
                transition: 'all 0.12s ease', width: '100%'
              }}
              onMouseEnter={e => { if (activeTab !== 'airoadmap') e.currentTarget.style.background = '#F1F3F5'; }}
              onMouseLeave={e => { if (activeTab !== 'airoadmap') e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: '0.85rem' }}>{activeTrack.icon}</span>
              <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeTrack.title}
              </span>
              <span style={{
                fontSize: '0.65rem', fontWeight: 600, color: '#3A9B9F',
                background: 'rgba(58,155,159,0.08)', padding: '1px 6px', borderRadius: '4px'
              }}>
                {trackProgress.percent}%
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 5. MODULE ACCORDIONS */}
      <nav style={{
        flex: 1, overflowY: 'auto', padding: collapsed ? '8px 8px' : '4px 16px 16px',
        display: 'flex', flexDirection: 'column', gap: '2px', scrollbarWidth: 'thin'
      }}>
        {!collapsed && !queryStr && (
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px', paddingLeft: '2px' }}>
            Modules
          </div>
        )}
        {moduleOrder.map(moduleId => {
          const module = UMBRELLA_TOPICS.find(m => m.id === moduleId);
          if (!module) return null;
          const rawTabs = getTabsForUmbrella(moduleId);
          const tabs = isSearchMode
            ? rawTabs.filter(t =>
                t.label.toLowerCase().includes(queryStr) ||
                t.id.toLowerCase().includes(queryStr) ||
                (t.keywords && t.keywords.some(k => k.toLowerCase().includes(queryStr)))
              )
            : rawTabs.filter(isHubTab);

          const activeMetaForCompat = getTopicMeta(activeTab);
          const showNonHubActive = !isSearchMode && rawTabs.some(t => t.id === activeTab && !isHubTab(t.id))
            && !(activeMetaForCompat.c && PILOT_COLLAPSED_CHILDREN.includes(activeMetaForCompat.c));
          const displayTabs = isSearchMode ? tabs : (showNonHubActive ? [...tabs, rawTabs.find(t => t.id === activeTab)].filter(Boolean) : tabs);

          if (isSearchMode && tabs.length === 0) return null;

          totalVisibleTabs += displayTabs.length;
          const isExpanded = isSearchMode ? true : (expandedModules[moduleId] ?? false);
          const hasActiveTab = rawTabs.some(t => t.id === activeTab);
          const accent = MODULE_ACCENTS[moduleId] || MODULE_ACCENTS.foundations;

          return (
            <div key={moduleId} style={{ marginBottom: '2px' }}>
              {/* MODULE HEADER */}
              <button
                onClick={() => collapsed ? onToggleCollapse?.() : toggleModule(moduleId)}
                title={module.title}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'space-between',
                  padding: collapsed ? '8px' : '7px 8px',
                  background: hasActiveTab ? 'rgba(58,155,159,0.06)' : 'transparent',
                  border: 'none', color: '#1A1D26',
                  cursor: 'pointer', textAlign: 'left', borderRadius: '6px',
                  transition: 'all 0.12s ease'
                }}
                onMouseEnter={e => {
                  if (!hasActiveTab) e.currentTarget.style.background = '#F1F3F5';
                }}
                onMouseLeave={e => {
                  if (!hasActiveTab) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '6px',
                    background: accent.light, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', flexShrink: 0, color: accent.dark
                  }}>
                    {module.icon}
                  </div>
                  {!collapsed && (
                    <span style={{
                      fontWeight: hasActiveTab ? 600 : 500,
                      color: hasActiveTab ? '#1A1D26' : '#4B5563',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      fontSize: '0.8rem'
                    }}>
                      {module.title}
                    </span>
                  )}
                </div>
                {!collapsed && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, marginLeft: '4px' }}>
                    <span style={{
                      fontSize: '0.6rem', fontWeight: 600, color: '#9CA3AF',
                      background: '#F1F3F5', padding: '1px 5px', borderRadius: '4px'
                    }}>
                      {tabs.length}
                    </span>
                    <span style={{
                      fontSize: '0.6rem', color: '#9CA3AF',
                      transition: 'transform 0.15s ease',
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      display: 'inline-block'
                    }}>
                      ›
                    </span>
                  </div>
                )}
              </button>

              {/* NESTED TOPICS */}
              {!collapsed && isExpanded && (
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: '1px',
                  padding: '2px 0 2px 12px',
                  borderLeft: '2px solid #E5E7EB', marginLeft: '11px',
                  marginTop: '2px', marginBottom: '4px'
                }}>
                  {getGroupedTabsForUmbrella(moduleId, isSearchMode ? tabs : rawTabs).map(group => {
                    if (group.child && PILOT_COLLAPSED_CHILDREN.includes(group.child.id) && !isSearchMode) {
                      return (
                        <PilotHubRow
                          key={group.child.id}
                          child={group.child}
                          rawTabs={rawTabs}
                          activeTab={activeTab}
                          onSelectTab={onSelectTab}
                        />
                      );
                    }
                    return (
                      <div key={group.child ? group.child.id : 'ungrouped'} style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginBottom: group.child ? '4px' : 0 }}>
                        {group.child && (() => {
                          const provenCount = group.tabs.filter(t => isMastered(t.id)).length;
                          const pct = group.tabs.length ? Math.round((provenCount / group.tabs.length) * 100) : 0;
                          return (
                            <div style={{ padding: '4px 6px 2px' }}>
                              <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                fontSize: '0.6rem', fontWeight: 600, color: '#9CA3AF',
                                letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '3px'
                              }}>
                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {group.child.title}
                                </span>
                                <span style={{ fontSize: '0.55rem', color: '#9CA3AF', flexShrink: 0, marginLeft: '4px' }}>
                                  {getChildLevelCounts(group.child.id, rawTabs)}
                                </span>
                              </div>
                              <div style={{ height: '3px', borderRadius: '2px', background: '#E5E7EB', overflow: 'hidden' }}>
                                <div style={{
                                  height: '100%', width: `${pct}%`, borderRadius: '2px',
                                  background: '#3A9B9F', transition: 'width 0.3s ease'
                                }} />
                              </div>
                            </div>
                          );
                        })()}
                        {group.tabs.map(tab => {
                          const meta = getTopicMeta(tab.id);
                          const lvl = getLevelInfo(meta.l);
                          const isActive = activeTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => onSelectTab(tab.id)}
                              title={`${tab.label} — ${lvl.label}${meta.deep ? ' · Deep dive (optional)' : ''}`}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '5px 6px', borderRadius: '5px',
                                background: isActive ? 'rgba(58,155,159,0.08)' : 'transparent',
                                color: isActive ? '#3A9B9F' : '#4B5563',
                                border: 'none', cursor: 'pointer', textAlign: 'left',
                                fontSize: '0.75rem', fontWeight: isActive ? 600 : 500,
                                transition: 'all 0.12s ease', width: '100%'
                              }}
                              onMouseEnter={e => {
                                if (!isActive) { e.currentTarget.style.background = '#F1F3F5'; }
                              }}
                              onMouseLeave={e => {
                                if (!isActive) { e.currentTarget.style.background = 'transparent'; }
                              }}
                            >
                              <span style={{ fontSize: '0.8rem', flexShrink: 0 }}>{tab.icon}</span>
                              <span style={{ lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                                {tab.label}
                                {meta.deep && (
                                  <span title="Deep dive — optional" style={{ color: '#E8836A', fontSize: '0.65rem', marginLeft: '3px' }}>✦</span>
                                )}
                              </span>
                              {isActive ? (
                                <span style={{
                                  fontSize: '0.55rem', fontWeight: 700, color: '#3A9B9F',
                                  background: 'rgba(58,155,159,0.1)', padding: '1px 5px', borderRadius: '4px', flexShrink: 0
                                }}>
                                  {lvl.short}
                                </span>
                              ) : (
                                <span style={{
                                  width: '5px', height: '5px', borderRadius: '50%',
                                  background: lvl.color, opacity: 0.8, flexShrink: 0
                                }} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {queryStr && totalVisibleTabs === 0 && (
          <div style={{ padding: '24px 12px', textAlign: 'center', color: '#9CA3AF' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '6px' }}>🔍</div>
            <div style={{ fontSize: '0.8rem', marginBottom: '8px' }}>No topics match "{queryStr}"</div>
            <button
              onClick={() => onSearchChange?.('')}
              style={{
                padding: '4px 12px', borderRadius: '6px',
                border: '1px solid #E5E7EB', background: '#F1F3F5',
                color: '#4B5563', fontSize: '0.72rem', cursor: 'pointer'
              }}
            >
              Clear Search
            </button>
          </div>
        )}
      </nav>

      {/* 6. COLLAPSED EXPAND BUTTON */}
      {collapsed && (
        <div style={{ padding: '8px', borderTop: '1px solid #F1F3F5', textAlign: 'center' }}>
          <button
            onClick={() => onToggleCollapse?.()}
            title="Expand sidebar (⌘[)"
            style={{
              background: '#F1F3F5', border: '1px solid #E5E7EB',
              borderRadius: '6px', color: '#4B5563', cursor: 'pointer',
              padding: '6px', fontSize: '0.75rem', width: '100%'
            }}
            aria-label="Expand sidebar"
          >
            ▸
          </button>
        </div>
      )}
    </aside>
  );
}

// ============================================
// TopBar — Clean EdTech Breadcrumb Navigation
// ============================================
export function TopBar({ activeTab, onSelectTab, onSearchOpen, onToggleSidebar, sidebarCollapsed }) {
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
      background: '#FFFFFF',
      borderBottom: '1px solid #E5E7EB',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "SF Pro Text", system-ui, sans-serif'
    }}>
      <style jsx>{`
        .topbar-mobile-menu-btn {
          display: none !important;
        }
        @media (max-width: 768px) {
          .topbar-mobile-menu-btn {
            display: inline-flex !important;
          }
        }
      `}</style>

      {/* BREADCRUMB ROW */}
      <div style={{
        padding: '10px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '12px', flexWrap: 'wrap'
      }}>
        {/* Left: Mobile Toggle + Breadcrumb Path */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flexWrap: 'wrap' }}>
          {onToggleSidebar && (
            <button
              className="topbar-mobile-menu-btn"
              onClick={onToggleSidebar}
              aria-label="Toggle mobile navigation menu"
              style={{
                alignItems: 'center', gap: '4px',
                padding: '5px 10px',
                background: '#F1F3F5',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                color: '#4B5563',
                fontSize: '0.8rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              <span>☰</span>
            </button>
          )}

          {/* Module Pill */}
          <button
            onClick={() => onSelectTab('overview')}
            title={`All modules — currently in ${currentModule.title}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '4px 10px', borderRadius: '6px',
              background: accent.light,
              color: accent.dark,
              fontSize: '0.78rem', fontWeight: 600,
              border: 'none', cursor: 'pointer'
            }}
          >
            <span>{currentModule.icon}</span>
            <span>{currentModule.title}</span>
          </button>

          <span style={{ color: '#D1D5DB', fontSize: '0.85rem' }}>/</span>

          {activeChild && !isHubPage ? (
            <>
              <button
                onClick={() => hubPageId && onSelectTab(hubPageId)}
                title={`${activeChild.title} — click for hub overview`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '4px 10px', borderRadius: '6px',
                  background: 'transparent',
                  color: '#4B5563',
                  fontSize: '0.78rem', fontWeight: 500,
                  border: '1px solid #E5E7EB',
                  cursor: 'pointer'
                }}
              >
                {activeChild.title}
              </button>
              <span style={{ color: '#D1D5DB', fontSize: '0.85rem' }}>/</span>
            </>
          ) : null}

          {/* Active Tab Name */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '0.95rem' }}>{currentTab.icon}</span>
            <span style={{
              fontWeight: 600, fontSize: '0.85rem', color: '#1A1D26'
            }}>
              {currentTab.label}
            </span>
          </div>
        </div>

        {/* Right: Position & Search Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            title={activeChild ? `${activeChild.title} — ${activeChild.blurb}` : 'All topics in this module'}
            style={{
              fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 500
            }}
          >
            {activeChild && childIndex >= 0
              ? `${childIndex + 1} of ${childTabs.length} · ${activeChild.title}`
              : `${activeIndex + 1} of ${siblingTabs.length}`}
          </span>
          <button
            onClick={onSearchOpen}
            title="Search knowledge base (⌘K)"
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '5px 10px',
              background: '#F1F3F5',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              color: '#4B5563',
              fontSize: '0.75rem', fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <span>🔍</span>
            <span>Search</span>
            <kbd style={{
              fontSize: '0.6rem', padding: '1px 4px', background: '#FFFFFF',
              borderRadius: '3px', border: '1px solid #E5E7EB', color: '#9CA3AF'
            }}>⌘K</kbd>
          </button>
        </div>
      </div>

      {/* POSITION BAR — prev/next navigation */}
      {activeChild && (
        <div style={{
          padding: '6px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
          borderTop: '1px solid #F1F3F5', background: '#FAFBFC'
        }}>
          {childIndex >= 0 ? (
            <>
              <button
                onClick={() => prevInChild ? onSelectTab(prevInChild.id) : (hubPageId && onSelectTab(hubPageId))}
                title={prevInChild ? `Previous: ${prevInChild.label}` : `Back to ${activeChild.title} overview`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '4px 12px', borderRadius: '6px',
                  background: 'transparent', color: '#4B5563',
                  border: '1px solid #E5E7EB', fontSize: '0.75rem', fontWeight: 500,
                  cursor: 'pointer', maxWidth: '40vw',
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
                onClick={() => {
                  if (nextInChild) onSelectTab(nextInChild.id);
                  else if (nextHub) onSelectTab(getHubPageId(nextHub.id));
                  else if (hubPageId) onSelectTab(hubPageId);
                  else onSelectTab('overview');
                }}
                title={nextInChild ? `Next: ${nextInChild.label}` : (nextHub ? `Next section: ${nextHub.title}` : 'Hub overview')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '4px 12px', borderRadius: '6px',
                  background: '#3A9B9F', color: '#ffffff',
                  border: 'none', fontSize: '0.75rem', fontWeight: 600,
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
                onClick={() => prevHub && onSelectTab(getHubPageId(prevHub.id))}
                disabled={!prevHub}
                title={prevHub ? `Previous section: ${prevHub.title}` : 'First section'}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '4px 12px', borderRadius: '6px',
                  background: 'transparent',
                  color: prevHub ? '#4B5563' : '#D1D5DB',
                  border: '1px solid #E5E7EB', fontSize: '0.75rem', fontWeight: 500,
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
                onClick={() => {
                  if (nextHub) onSelectTab(getHubPageId(nextHub.id));
                  else onSelectTab('overview');
                }}
                title={nextHub ? `Next section: ${nextHub.title}` : 'Back to Overview'}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '4px 12px', borderRadius: '6px',
                  background: '#3A9B9F', color: '#ffffff',
                  border: 'none', fontSize: '0.75rem', fontWeight: 600,
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
// CommandPalette — Global Search Modal (⌘K)
// ============================================
export function CommandPalette({ isOpen, onClose, tabs, onSelectTab }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const { ref: dialogRef } = useModalA11y(isOpen, onClose, { dismissable: false, autofocus: false });

  const queryStr = (query || '').trim().toLowerCase();
  const filteredTabs = queryStr
    ? tabs.filter(t => {
        const matchLabel = t.label?.toLowerCase().includes(queryStr);
        const matchId = t.id?.toLowerCase().includes(queryStr);
        const matchKeywords = t.keywords?.some?.(k => k.toLowerCase().includes(queryStr));
        const matchCategory = t.category?.toLowerCase().includes(queryStr);
        const umbrella = t.umbrellaId ? UMBRELLA_TOPICS.find(u => u.id === t.umbrellaId) : null;
        const matchUmbrella = umbrella?.title?.toLowerCase().includes(queryStr) || umbrella?.description?.toLowerCase().includes(queryStr);
        return matchLabel || matchId || matchKeywords || matchCategory || matchUmbrella;
      }).slice(0, 16)
    : tabs.slice(0, 10);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, Math.max(0, filteredTabs.length - 1))); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
      else if (e.key === 'Enter') { e.preventDefault(); if (filteredTabs[selectedIndex]) { onSelectTab(filteredTabs[selectedIndex].id); onClose(); } }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, filteredTabs, selectedIndex, onClose, onSelectTab]);

  if (!isOpen) return null;

  return (
    <>
    <div
      onClick={onClose}
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'rgba(0,0,0,0.3)',
      }}
    />
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="command-palette"
      style={{
        position: 'fixed', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: 'min(640px, 90vw)', zIndex: 60,
        background: '#FFFFFF', border: '1px solid #E5E7EB',
        borderRadius: '12px', boxShadow: '0 20px 25px rgba(0,0,0,0.08), 0 8px 10px rgba(0,0,0,0.04)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "SF Pro Text", system-ui, sans-serif',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
      role="dialog" aria-modal="true" aria-label="Command palette"
    >
      <div style={{ padding: '12px', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F1F3F5', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '8px 12px' }}>
          <span style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search topics (e.g., QLoRA, Graph RAG, LangChain)..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            style={{ background: 'none', border: 'none', outline: 'none', fontSize: '0.88rem', color: '#1A1D26', width: '100%', fontFamily: 'inherit' }}
          />
          <kbd style={{ fontSize: '0.6rem', padding: '2px 6px', background: '#FFFFFF', borderRadius: '4px', border: '1px solid #E5E7EB', color: '#9CA3AF', fontWeight: 600 }}>⌘K</kbd>
        </div>
      </div>
      <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
        {filteredTabs.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF', fontSize: '0.85rem' }}>
            No results for "{query}"
          </div>
        ) : (
          filteredTabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => { onSelectTab(tab.id); onClose(); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 16px', background: i === selectedIndex ? 'rgba(58,155,159,0.08)' : 'transparent',
                border: 'none', textAlign: 'left', cursor: 'pointer',
                transition: 'background 0.1s ease'
              }}
            >
              <span style={{ fontSize: '1rem', width: '24px', textAlign: 'center' }}>{tab.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1A1D26' }}>{tab.label}</div>
                <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{tab.umbrellaId ? UMBRELLA_TOPICS.find(u => u.id === tab.umbrellaId)?.title : ''}</div>
              </div>
              {i === selectedIndex && <span style={{ color: '#3A9B9F', fontSize: '0.85rem' }}>→</span>}
            </button>
          ))
        )}
      </div>
      <div
        className="bottom-nav"
        style={{
          padding: '8px 16px',
          paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
          borderTop: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
          {filteredTabs.length} matching topic{filteredTabs.length === 1 ? '' : 's'}
        </span>
        <Button variant="ghost" size="sm" onClick={onClose}>Close (Esc)</Button>
      </div>
    </div>
    </>
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