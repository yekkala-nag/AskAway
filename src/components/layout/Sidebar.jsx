import { useState } from "react";
import { UMBRELLA_TOPICS, getTabsForUmbrella } from "../../registry/tabsRegistry.js";
import { AskAwayLogo } from "../ui/AskAwayLogo.jsx";

export default function Sidebar({
  activeTab,
  onSelectTab,
  searchQ,
  onSearchChange,
  isCollapsed,
  onToggleCollapse
}) {
  const [expandedUmbrellas, setExpandedUmbrellas] = useState({
    foundations: true,
    rag_architecture: true,
    context_memory: false,
    agents_frameworks: false,
    data_platform: false,
    frontiers_production: false
  });

  const toggleUmbrella = (id) => {
    setExpandedUmbrellas(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <aside style={{
      width: isCollapsed ? "68px" : "280px",
      minWidth: isCollapsed ? "68px" : "280px",
      height: "100vh",
      position: "sticky",
      top: 0,
      background: "#141424",
      color: "#e2e8f0",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid #24243a",
      transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      zIndex: 50,
      userSelect: "none"
    }}>
      {/* BRAND HEADER */}
      <div style={{
        padding: isCollapsed ? "1.2rem 0.5rem" : "1.2rem 1.2rem 1rem",
        borderBottom: "1px solid #24243a",
        display: "flex",
        alignItems: "center",
        justifyContent: isCollapsed ? "center" : "space-between"
      }}>
        <div
          onClick={() => onSelectTab && onSelectTab('overview')}
          style={{ display: "flex", alignItems: "center", gap: "0.7rem", overflow: "hidden", cursor: "pointer" }}
          title="AskAway — Build, learn, and master the art of Generative AI."
        >
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, #FFFFFF 0%, #E7F0F5 100%)",
            border: "1px solid rgba(20, 184, 166, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(20, 184, 166, 0.2)"
          }}>
            <AskAwayLogo size={24} />
          </div>
          {!isCollapsed && (
            <div>
              <div style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "0.85rem",
                color: "#ffffff",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap"
              }}>
                AskAway
              </div>
              <div style={{
                fontSize: "0.58rem",
                color: "#94a3b8",
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "140px"
              }}>
                Build, learn & master GenAI
              </div>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            title="Collapse Sidebar"
            style={{
              background: "transparent",
              border: "1px solid #334155",
              borderRadius: 4,
              color: "#94a3b8",
              cursor: "pointer",
              padding: "0.2rem 0.45rem",
              fontSize: "0.65rem",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#ffffff"}
            onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
          >
            ◀
          </button>
        )}
      </div>

      {/* SEARCH INPUT */}
      {!isCollapsed && (
        <div style={{ padding: "0.8rem 1rem", borderBottom: "1px solid #24243a" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "#1e1e32",
            border: "1px solid #334155",
            borderRadius: 6,
            padding: "0.45rem 0.75rem"
          }}>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>⌕</span>
            <input
              type="text"
              placeholder="Search concepts, RAG, agents..."
              value={searchQ}
              onChange={e => onSearchChange(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#f8fafc",
                fontSize: "0.68rem",
                fontFamily: "DM Mono, monospace",
                width: "100%"
              }}
            />
            {searchQ && (
              <button
                onClick={() => onSearchChange("")}
                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "0.75rem" }}
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      {/* ACCORDION UMBRELLA NAVIGATION LIST */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: isCollapsed ? "0.8rem 0.3rem" : "0.8rem 0.6rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem"
      }}>
        {UMBRELLA_TOPICS.map(umbrella => {
          const subTabs = getTabsForUmbrella(umbrella.id);
          const isExpanded = expandedUmbrellas[umbrella.id] || searchQ.length > 0;
          const hasActiveSubTab = subTabs.some(t => t.id === activeTab);

          return (
            <div key={umbrella.id} style={{
              background: hasActiveSubTab ? "#1c1c30" : "transparent",
              borderRadius: 6,
              border: `1px solid ${hasActiveSubTab ? `${umbrella.color}50` : "transparent"}`,
              overflow: "hidden"
            }}>
              {/* UMBRELLA TOPIC HEADER ROW */}
              <button
                onClick={() => isCollapsed ? onToggleCollapse() : toggleUmbrella(umbrella.id)}
                title={umbrella.title}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isCollapsed ? "center" : "space-between",
                  padding: isCollapsed ? "0.7rem 0" : "0.6rem 0.75rem",
                  background: "transparent",
                  border: "none",
                  color: hasActiveSubTab ? "#ffffff" : "#94a3b8",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "color 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#ffffff"}
                onMouseLeave={e => e.currentTarget.style.color = hasActiveSubTab ? "#ffffff" : "#94a3b8"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", minWidth: 0 }}>
                  <span style={{ fontSize: "1rem", flexShrink: 0 }}>{umbrella.icon}</span>
                  {!isCollapsed && (
                    <span style={{
                      fontFamily: "Syne, sans-serif",
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      letterSpacing: "0.02em",
                      color: hasActiveSubTab ? umbrella.color : "inherit",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>
                      {umbrella.title}
                    </span>
                  )}
                </div>
                {!isCollapsed && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
                    <span style={{
                      fontSize: "0.55rem",
                      fontFamily: "DM Mono, monospace",
                      background: `${umbrella.color}25`,
                      color: umbrella.color,
                      padding: "0.1rem 0.35rem",
                      borderRadius: 10,
                      fontWeight: 700
                    }}>
                      {subTabs.length}
                    </span>
                    <span style={{ fontSize: "0.6rem", color: "#64748b" }}>
                      {isExpanded ? "▾" : "▸"}
                    </span>
                  </div>
                )}
              </button>

              {/* SUB-TABS LIST */}
              {(!isCollapsed && isExpanded) && (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.2rem",
                  padding: "0.2rem 0.5rem 0.6rem 1.8rem",
                  borderLeft: `2px solid ${umbrella.color}30`,
                  marginLeft: "1rem",
                  marginBottom: "0.3rem"
                }}>
                  {subTabs.map(subTab => {
                    const isActive = activeTab === subTab.id;
                    return (
                      <button
                        key={subTab.id}
                        onClick={() => onSelectTab(subTab.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.4rem 0.6rem",
                          borderRadius: 4,
                          background: isActive ? umbrella.color : "transparent",
                          color: isActive ? "#ffffff" : "#cbd5e1",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.15s ease"
                        }}
                        onMouseEnter={e => {
                          if (!isActive) e.currentTarget.style.background = "#24243a";
                        }}
                        onMouseLeave={e => {
                          if (!isActive) e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <span style={{ fontSize: "0.8rem", flexShrink: 0 }}>{subTab.icon}</span>
                        <span style={{
                          fontSize: "0.65rem",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: isActive ? 700 : 500,
                          lineHeight: 1.3,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}>
                          {subTab.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER TOGGLE WHEN COLLAPSED */}
      {isCollapsed && (
        <div style={{ padding: "0.8rem", borderTop: "1px solid #24243a", display: "flex", justifyContent: "center" }}>
          <button
            onClick={onToggleCollapse}
            title="Expand Sidebar"
            style={{
              background: "#1e1e32",
              border: "1px solid #334155",
              borderRadius: 4,
              color: "#94a3b8",
              cursor: "pointer",
              padding: "0.4rem 0.6rem",
              fontSize: "0.75rem"
            }}
          >
            ▶
          </button>
        </div>
      )}
    </aside>
  );
}
