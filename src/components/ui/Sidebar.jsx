/**
 * Sidebar — left navigation shell (module accordions, curated index, search input).
 * Lazy-loaded: rendered with a skeleton placeholder until first needed.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { UMBRELLA_TOPICS, getTabsForUmbrella, getUmbrellaForTab, getTabById, TABS_REGISTRY } from '../../registry/tabsRegistry.js';
import { getModuleColors } from '../../design-system/tokens.js';
import { Button, Badge } from './Core.jsx';
import { AskAwayLogo } from './AskAwayLogo.jsx';
import {
  getCurrentTrackId,
  getTrackById,
  getTrackProgress,
  subscribeToAdaptiveProgress
} from '../../services/adaptiveLearning.js';
import {
  getChildSequence,
  getHubPageId,
  PILOT_COLLAPSED_CHILDREN,
  sortTopicsLikeJourney,
  getTopicMeta,
  getChildById,
  getChildrenForUmbrella,
  getChildSequence as _getChildSequence,
  getGroupedTabsForUmbrella,
  getChildLevelCounts,
  getLevelInfo
} from '../../registry/curriculum.js';
import { useModalA11y } from '../../hooks/useModalA11y.js';
import { highlightSegments } from '../../search/highlight.js';
import { isMastered } from '../../services/mastery.js';
import { useCuratedProgress, getCuratedNextTab } from '../overview/OverviewWidgets.jsx';

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
          }}
        >
          {expanded ? '▾' : '▸'}
        </button>
      </div>
      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginLeft: '14px', marginTop: '2px' }}>
          {seq.map((tabId, i) => {
            const tab = getTabById(tabId) || { id: tabId, label: tabId, icon: '📄' };
            const isActive = activeTab === tabId;
            return (
              <button
                key={tabId}
                onClick={() => onSelectTab(tabId)}
                title={tab.label}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '4px 8px', borderRadius: '4px',
                  background: isActive ? 'rgba(58,155,159,0.08)' : 'transparent',
                  color: isActive ? '#3A9B9F' : '#4B5563',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  fontSize: '0.72rem', fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.12s ease', width: '100%'
                }}
              >
                <span style={{ fontSize: '0.75rem', flexShrink: 0 }}>{tab.icon}</span>
                <span style={{ lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Sidebar({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  collapsed,
  onToggleCollapse,
}) {
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
  const curated = useCuratedProgress();
  const queryStr = (typeof searchQuery === 'string' ? searchQuery : (searchQuery?.target?.value || '')).trim().toLowerCase();
  const isHubTab = (tabId) => typeof tabId === 'string' && tabId.endsWith('_hub');
  const isSearchMode = queryStr.length > 0;

  // Fuzzy/synonym ids from the shared search engine (lazy-loaded); null until ready
  const [fuzzyIds, setFuzzyIds] = useState(null);
  useEffect(() => {
    if (!isSearchMode) {
      setFuzzyIds(null);
      return undefined;
    }
    let cancelled = false;
    const t = setTimeout(() => {
      import('../../search/search.js')
        .then((m) => m.filterTabIds(queryStr, { limit: 80 }))
        .then((ids) => { if (!cancelled) setFuzzyIds(ids); })
        .catch(() => { if (!cancelled) setFuzzyIds(null); });
    }, 150);
    return () => { cancelled = true; clearTimeout(t); };
  }, [queryStr, isSearchMode]);

  let totalVisibleTabs = 0;

  // Roving focus: ArrowDown/ArrowUp move between visible controls.
  const handleNavKeyDown = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const isField = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
    if (isField && e.key !== 'ArrowDown') return;
    const items = Array.from(
      e.currentTarget.querySelectorAll('button:not([disabled]), a[href], input, select, textarea')
    ).filter(el => el.offsetParent !== null);
    const idx = items.indexOf(document.activeElement);
    const nextIdx = idx === -1
      ? (e.key === 'ArrowDown' ? 0 : items.length - 1)
      : idx + (e.key === 'ArrowDown' ? 1 : -1);
    if (nextIdx < 0 || nextIdx >= items.length) return;
    e.preventDefault();
    items[nextIdx].focus();
  };

  return (
    <aside
      onKeyDown={handleNavKeyDown}
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--ds-color-chrome-sidebarBg, #EDF1F6)',
        color: '#1A1D26',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "SF Pro Text", system-ui, sans-serif',
        userSelect: 'none',
        borderRight: 'none'
      }}
      aria-label="Main navigation"
    >
      {/* 1. SIDEBAR DIRECTORY HEADER */}
      <div style={{
        padding: collapsed ? '14px 10px' : '14px 16px',
        borderBottom: '1px solid #F1F3F5',
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
        }}>
          {!collapsed ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.95rem',
              fontWeight: 800,
              color: '#1A1D26',
              letterSpacing: '0.01em'
            }}>
              <span>CURRICULUM INDEX</span>
            </div>
          ) : (
            <span style={{ fontSize: '1.1rem' }} title="Curriculum Index">🧭</span>
          )}
          {onToggleCollapse && (
            <button
              onClick={() => onToggleCollapse?.()}
              title={collapsed ? "Expand sidebar (⌘[)" : "Collapse sidebar (⌘[)"}
              style={{
                background: 'transparent', border: '1px solid #E5E7EB',
                borderRadius: '6px', color: '#9CA3AF', cursor: 'pointer',
                width: '28px', height: '28px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s ease', fontSize: '0.7rem'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F1F3F5'; e.currentTarget.style.color = '#4B5563'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? '▸' : '◂'}
            </button>
          )}
        </div>
      </div>

      {/* 2. SEARCH INPUT */}
      {!collapsed && (
        <div style={{ padding: '12px 16px 8px', flexShrink: 0 }}>
          <div className="ds-field-focus" style={{
            position: 'relative', display: 'flex', alignItems: 'center',
            background: '#F1F3F5', border: '1px solid #E5E7EB',
            borderRadius: '8px', padding: '7px 10px 7px 32px',
            transition: 'all 0.15s ease'
          }}>
            <span aria-hidden="true" style={{ position: 'absolute', left: '10px', color: '#9CA3AF', fontSize: '0.8rem', pointerEvents: 'none' }}>
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
            {queryStr.length > 0 && (
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

      {/* 3. CURATED INDEX (mock labels, live progress) */}
      {!collapsed && !queryStr && (
        <div style={{ padding: '0 16px 8px', flexShrink: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {curated.map((entry) => {
              const isActive = entry.tabIds.includes(activeTab);
              return (
                <button
                  key={entry.id}
                  onClick={() => onSelectTab && onSelectTab(getCuratedNextTab(entry))}
                  title={`${entry.label} — ${entry.completed}/${entry.total} done`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 10px', borderRadius: '8px',
                    background: isActive ? '#FFFFFF' : 'transparent',
                    color: '#1A1D26',
                    border: isActive ? '1px solid var(--ds-color-chrome-headerBorder, #E7EDF3)' : '1px solid transparent',
                    boxShadow: isActive ? '0 2px 8px rgba(22, 40, 63, 0.06)' : 'none',
                    cursor: 'pointer', textAlign: 'left', fontSize: '0.86rem',
                    fontWeight: isActive ? 700 : 500,
                    transition: 'all 0.12s ease', width: '100%'
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.65)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{entry.icon}</span>
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {entry.label}
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1A1D26', flexShrink: 0 }}>
                    {entry.percent}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. MODULE ACCORDIONS */}
      <nav aria-label="Curriculum modules" style={{
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
          // Single search path: ids come from the shared search service.
          const tabs = isSearchMode
            ? rawTabs.filter(t => fuzzyIds && fuzzyIds.has(t.id))
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
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight' && !isSearchMode) {
                    if (!isExpanded) {
                      e.preventDefault();
                      toggleModule(moduleId);
                    } else {
                      const first = e.currentTarget.parentElement?.querySelectorAll('button')[1];
                      if (first) { e.preventDefault(); first.focus(); }
                    }
                  } else if (e.key === 'ArrowLeft' && !isSearchMode && isExpanded && !collapsed) {
                    e.preventDefault();
                    toggleModule(moduleId);
                  }
                }}
                aria-expanded={isExpanded}
                aria-controls={isExpanded && !collapsed ? `sidebar-mod-${moduleId}` : undefined}
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
                </div>
              </button>

              {/* NESTED TOPICS */}
              {!collapsed && isExpanded && (
                <div
                  id={`sidebar-mod-${moduleId}`}
                  style={{
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
            {fuzzyIds === null ? (
              <div style={{ fontSize: '0.8rem' }}>Searching…</div>
            ) : (
              <>
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
              </>
            )}
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
