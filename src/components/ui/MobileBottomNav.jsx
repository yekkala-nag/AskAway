/**
 * MobileBottomNav — Native-like bottom action & navigation bar for Mobile and Tablet devices.
 * 
 * Provides thumb-friendly navigation:
 * - 🏠 Overview (Home)
 * - 🧭 Topics (Curriculum Drawer)
 * - 🔍 Search (Command Palette)
 * - 🎯 Progress (Learning Track)
 * - ⚡ Next (Adaptive progression)
 */

import React, { useCallback } from 'react';
import { getUmbrellaForTab, getTabsForUmbrella, getTabById } from '../../registry/tabsRegistry.js';
import { getTopicMeta, getChildById, getChildSequence, PILOT_COLLAPSED_CHILDREN, sortTopicsLikeJourney, getChildrenForUmbrella, getHubPageId } from '../../registry/curriculum.js';

export function MobileBottomNav({
  activeTab,
  onSelectTab,
  onToggleSidebar,
  onSearchOpen,
  sidebarOpen
}) {
  // Resolve Next Topic
  const getNextTopic = useCallback(() => {
    if (!activeTab || activeTab === 'overview') {
      return 'firstaiapp';
    }
    const currentModule = getUmbrellaForTab(activeTab);
    const activeMeta = getTopicMeta(activeTab);
    const activeChild = activeMeta.c ? getChildById(activeMeta.c) : null;
    
    if (activeChild && currentModule) {
      const pilotSeq = PILOT_COLLAPSED_CHILDREN.includes(activeChild.id) && !activeTab.endsWith('_hub');
      const childTabs = pilotSeq
        ? getChildSequence(activeChild.id).map(id => getTabById(id) || { id, label: id }).filter(t => t && !String(t.id).endsWith('_hub'))
        : sortTopicsLikeJourney(getTabsForUmbrella(currentModule.id).filter(t => getTopicMeta(t.id).c === activeChild.id && !String(t.id).endsWith('_hub')));
      
      const childIndex = childTabs.findIndex(t => t.id === activeTab);
      if (childIndex >= 0 && childIndex < childTabs.length - 1) {
        return childTabs[childIndex + 1].id;
      }
      
      const hubSiblings = getChildrenForUmbrella(activeChild.umbrellaId);
      const hubAt = hubSiblings.findIndex(c => c.id === activeChild.id);
      if (hubAt >= 0 && hubAt < hubSiblings.length - 1) {
        return getHubPageId(hubSiblings[hubAt + 1].id);
      }
    }
    return 'overview';
  }, [activeTab]);

  const handleNextClick = () => {
    const nextTab = getNextTopic();
    if (nextTab) {
      onSelectTab(nextTab);
    }
  };

  const navItems = [
    {
      id: 'overview',
      label: 'Home',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      active: activeTab === 'overview',
      onClick: () => onSelectTab('overview')
    },
    {
      id: 'topics',
      label: 'Topics',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      ),
      active: !!sidebarOpen,
      onClick: onToggleSidebar
    },
    {
      id: 'search',
      label: 'Search',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
      active: false,
      onClick: onSearchOpen
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
      active: activeTab === 'progress',
      onClick: () => onSelectTab('progress')
    },
    {
      id: 'next',
      label: 'Next',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      active: false,
      onClick: handleNextClick
    }
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      aria-label="Mobile primary navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--ds-color-border-subtle, #E5E7EB)',
        paddingTop: '6px',
        paddingBottom: 'calc(6px + env(safe-area-inset-bottom, 0px))',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.06)'
      }}
    >
      <style jsx>{`
        .mobile-bottom-nav {
          display: flex;
          align-items: center;
          justify-content: space-around;
        }
        @media (min-width: 1025px) {
          .mobile-bottom-nav {
            display: none !important;
          }
        }
        .mbn-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px 12px;
          border-radius: 10px;
          min-width: 54px;
          min-height: 48px;
          color: #64748B;
          touch-action: manipulation;
          transition: all 0.15s ease;
          position: relative;
        }
        .mbn-tab:active {
          transform: scale(0.92);
        }
        .mbn-tab.active {
          color: #3A9B9F;
          font-weight: 700;
        }
        .mbn-tab.active::after {
          content: '';
          position: absolute;
          bottom: 2px;
          width: 16px;
          height: 3px;
          background: #3A9B9F;
          border-radius: 9999px;
        }
        .mbn-label {
          font-size: 0.64rem;
          margin-top: 3px;
          letter-spacing: -0.01em;
          line-height: 1;
        }
      `}</style>
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`mbn-tab ${item.active ? 'active' : ''}`}
          onClick={item.onClick}
          aria-label={item.label}
          title={item.label}
        >
          {item.icon}
          <span className="mbn-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default MobileBottomNav;

