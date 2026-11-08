import React, { useState, useEffect } from "react";

// Shared UI kit for the Hands-On Projects tabs.
// Code blocks are rendered verbatim; the step tracker persists per tab in localStorage.

export const C = {
  bg: "#0F1219",
  surface: "#161B26",
  s2: "#1C2433",
  s3: "#243044",
  border: "#2A3548",
  text: "#E2E8F0",
  muted: "#B8B8C4",
  teal: "#5EC4C8",
  coral: "#E8837A",
  lav: "#C9B8E8",
  gold: "#F0C674",
  green: "#7BC99A",
};

export const mono = { fontFamily: "JetBrains Mono, monospace" };

export const sectionStyle = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 14,
  padding: 24,
};

export const labelStyle = (color) => ({
  ...mono,
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.1em",
  color,
  marginBottom: 12,
});

export function Section({ label, color = C.teal, children, style }) {
  return (
    <div style={{ ...sectionStyle, ...style }}>
      {label && <div style={labelStyle(color)}>{label}</div>}
      {children}
    </div>
  );
}

export function Callout({ color = C.teal, title, children }) {
  return (
    <div
      style={{
        padding: "12px 14px",
        background: color + "11",
        borderRadius: 8,
        borderLeft: `3px solid ${color}`,
      }}
    >
      {title && (
        <div style={{ color, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>{title}</div>
      )}
      <div style={{ color: C.text, fontSize: 12, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

export function DataTable({ headers, rows, accent = C.teal }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, ...mono }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "8px 10px",
                  borderBottom: `1px solid ${C.border}`,
                  color: accent,
                  fontWeight: 600,
                  fontSize: 10,
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ background: i % 2 ? C.s2 + "55" : "transparent" }}>
              {r.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: "8px 10px",
                    borderBottom: `1px solid ${C.border}`,
                    color: j === 0 ? C.text : C.muted,
                    fontWeight: j === 0 ? 600 : 400,
                    lineHeight: 1.6,
                    verticalAlign: "top",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CodeBlock({ code, accent = C.teal }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // clipboard unavailable (insecure context); leave button unlatched
    }
  };
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={copy}
        aria-label="Copy code"
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
          background: C.s3,
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          color: copied ? accent : C.muted,
          fontSize: 10,
          padding: "3px 8px",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre
        style={{
          background: C.s2,
          border: `1px solid ${C.border}`,
          borderLeft: `3px solid ${accent}`,
          borderRadius: 8,
          padding: 14,
          paddingRight: 64,
          margin: 0,
          color: C.text,
          fontSize: 11,
          lineHeight: 1.6,
          ...mono,
          overflowX: "auto",
          whiteSpace: "pre",
        }}
      >
        {code}
      </pre>
    </div>
  );
}

// ── Progress tracking ────────────────────────────────────────────────────
const storageKey = (tabId) => `hop:v1:${tabId}`;

export function useProgress(tabId, stepIds) {
  const [done, setDone] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey(tabId));
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [hydrated, setHydrated] = useState(false);

  // Re-read when the tab changes; storage may have been written by another tab.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(tabId));
      setDone(raw ? new Set(JSON.parse(raw)) : new Set());
    } catch {
      setDone(new Set());
    }
    setHydrated(true);
  }, [tabId]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(storageKey(tabId), JSON.stringify([...done]));
    } catch {
      // storage full or blocked; progress simply won't persist
    }
  }, [done, tabId, hydrated]);

  const toggle = (id) =>
    setDone((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const reset = () => setDone(new Set());

  const total = stepIds.length;
  const complete = stepIds.filter((id) => done.has(id)).length;
  return { done, toggle, reset, complete, total };
}

export function ProgressBar({ complete, total, accent = C.teal }) {
  const pct = total ? Math.round((complete / total) * 100) : 0;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ ...mono, fontSize: 10, letterSpacing: "0.1em", color: C.muted }}>
          PROJECT PROGRESS
        </span>
        <span style={{ ...mono, fontSize: 11, color: accent, fontWeight: 700 }}>
          {complete}/{total} steps · {pct}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Project progress"
        style={{ height: 6, background: C.s3, borderRadius: 999, overflow: "hidden" }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: accent,
            transition: "width 0.25s ease",
          }}
        />
      </div>
    </div>
  );
}

export function ProjectCard({ project, done, onToggle, accent = C.teal }) {
  return (
    <div
      style={{
        background: C.s2,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: 18,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
        <span style={{ ...mono, color: accent, fontWeight: 700, fontSize: 12 }}>
          {String(project.n).padStart(2, "0")}
        </span>
        <h3 style={{ margin: 0, color: C.text, fontSize: 16, fontWeight: 700 }}>
          {project.title}
        </h3>
      </div>
      <p style={{ margin: "0 0 8px 0", color: C.muted, fontSize: 12, lineHeight: 1.6 }}>
        {project.blurb}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {project.stack.map((s) => (
          <span
            key={s}
            style={{
              ...mono,
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 999,
              border: `1px solid ${C.border}`,
              color: C.muted,
            }}
          >
            {s}
          </span>
        ))}
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {project.steps.map((step, i) => {
          const id = `${project.id}-${i}`;
          const isDone = done.has(id);
          return (
            <div key={id}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <span style={{ ...mono, fontSize: 10, color: C.muted }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    color: isDone ? C.muted : C.text,
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: isDone ? "line-through" : "none",
                  }}
                >
                  {step.title}
                </span>
              </div>
              <CodeBlock code={step.code} accent={accent} />
              {step.note && (
                <div
                  style={{
                    margin: "8px 0 0 0",
                    color: C.muted,
                    fontSize: 11,
                    lineHeight: 1.7,
                    borderLeft: `2px solid ${C.border}`,
                    paddingLeft: 10,
                  }}
                >
                  {step.note}
                </div>
              )}
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 8,
                  cursor: "pointer",
                  color: isDone ? accent : C.muted,
                  fontSize: 11,
                }}
              >
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => onToggle(id)}
                  style={{ accentColor: accent, cursor: "pointer" }}
                />
                {isDone ? "Completed" : "Mark as complete"}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TabBar({ tabs, active, onChange, accent = C.teal }) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "0 12px",
        margin: 0,
      }}
    >
      <div style={{ display: "flex", gap: 0, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            aria-current={active === t.id ? "page" : undefined}
            style={{
              background: "none",
              border: "none",
              borderBottom: `2px solid ${active === t.id ? accent : "transparent"}`,
              color: active === t.id ? accent : C.muted,
              padding: "10px 12px",
              fontSize: 12,
              fontWeight: active === t.id ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
              flexShrink: 0,
              fontFamily: "inherit",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TabShell({ tabs, active, onChange, accent, children }) {
  return (
    <div
      style={{
        padding: "24px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        maxWidth: 980,
        margin: "0 auto",
      }}
    >
      <TabBar tabs={tabs} active={active} onChange={onChange} accent={accent} />
      {children}
    </div>
  );
}

export function StackRow({ items, accent = C.teal }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {items.map((it) => (
        <span
          key={it}
          style={{
            ...mono,
            fontSize: 10,
            padding: "3px 9px",
            borderRadius: 999,
            background: accent + "14",
            border: `1px solid ${accent}44`,
            color: accent,
          }}
        >
          {it}
        </span>
      ))}
    </div>
  );
}
