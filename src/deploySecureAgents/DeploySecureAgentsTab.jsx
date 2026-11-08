import React, { useState } from "react";
import {
  TRACK_OVERVIEW,
  THREE_PILLARS,
  SCALING_STRATEGIES,
  PERFORMANCE_TIPS,
  DEPLOYMENT_CHECKLIST,
  SECURITY_VULNERABILITIES,
  COMPLIANCE_FRAMEWORKS,
  SECURITY_CHECKLIST,
  RBAC_ROLES,
  ENCRYPTION_STRATEGIES,
  PRIVACY_BY_DESIGN,
  INCIDENT_RESPONSE,
  AUTH_CODE,
  INPUT_SANITIZATION_CODE,
  ENCRYPTION_CODE,
  ANONYMIZATION_CODE,
  DOCKER_COMPOSE,
} from "./deploySecureAgentsContent.js";

const C = {
  bg: "#0F1219",
  surface: "#161B26",
  s2: "#1C2433",
  s3: "#243044",
  border: "#2A3548",
  text: "#E2E8F0",
  muted: "#B8B8C4",
  teal: "#5EC4C8",
  tealDark: "#3A9B9F",
  coral: "#E8837A",
  lav: "#C9B8E8",
  gold: "#F0C674",
};

const sectionStyle = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 14,
  padding: 24,
};

const mono = { fontFamily: "JetBrains Mono, monospace" };

const labelStyle = (color) => ({
  ...mono,
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.1em",
  color,
  marginBottom: 12,
});

function DataTable({ headers, rows, accent = C.teal }) {
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

function Callout({ color, title, children }) {
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

function CodeBlock({ text, accent = C.teal }) {
  return (
    <div
      style={{
        background: C.s2,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: 14,
        whiteSpace: "pre-wrap",
        color: C.text,
        fontSize: 11,
        lineHeight: 1.6,
        ...mono,
        overflowX: "auto",
      }}
    >
      {text}
    </div>
  );
}

/* ─── Deployment sub-tab ──────────────────────────────── */
function Deployment() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>THREE PILLARS OF AGENT DEPLOYMENT</div>
        <div style={{ display: "grid", gap: 12 }}>
          {THREE_PILLARS.map((p, i) => (
            <div
              key={i}
              style={{
                padding: 14,
                background: C.s2,
                borderRadius: 8,
                borderLeft: `3px solid ${C.teal}`,
              }}
            >
              <div style={{ color: C.teal, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{p.pillar}</div>
              <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 8 }}>{p.description}</div>
              <div style={{ display: "grid", gap: 2 }}>
                {p.details.map((d, j) => (
                  <div key={j} style={{ color: C.text, fontSize: 11 }}>• {d}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>DOCKER COMPOSE EXAMPLE</div>
        <CodeBlock text={DOCKER_COMPOSE} accent={C.lav} />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>DEPLOYMENT CHECKLIST</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {DEPLOYMENT_CHECKLIST.map((d, i) => (
            <div key={i}>
              <div style={{ color: i === 0 ? C.teal : C.coral, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>
                {d.phase}
              </div>
              {d.items.map((item, j) => (
                <div key={j} style={{ color: C.text, fontSize: 11, marginBottom: 4 }}>☐ {item}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Scaling sub-tab ─────────────────────────────────── */
function Scaling() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>SCALING STRATEGIES</div>
        <div style={{ display: "grid", gap: 12 }}>
          {SCALING_STRATEGIES.map((s, i) => (
            <div
              key={i}
              style={{
                padding: 14,
                background: C.s2,
                borderRadius: 8,
                borderLeft: `3px solid ${C.teal}`,
              }}
            >
              <div style={{ color: C.teal, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{s.strategy}</div>
              <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 8 }}>{s.description}</div>
              <div style={{ display: "grid", gap: 2 }}>
                {s.details.map((d, j) => (
                  <div key={j} style={{ color: C.text, fontSize: 11 }}>• {d}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>PERFORMANCE OPTIMIZATION</div>
        <div style={{ display: "grid", gap: 12 }}>
          {PERFORMANCE_TIPS.map((p, i) => (
            <div key={i}>
              <div style={{ color: C.lav, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>{p.category}</div>
              {p.tips.map((tip, j) => (
                <div key={j} style={{ color: C.text, fontSize: 11, marginBottom: 2, paddingLeft: 12 }}>• {tip}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Security sub-tab ────────────────────────────────── */
function Security() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.coral)}>SECURITY BEST PRACTICES</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          AI agents often handle sensitive data and have access to powerful tools. Implementing
          proper security measures is not optional—it's essential.
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ color: C.teal, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>Authentication & Authorization</div>
          <DataTable
            headers={["Role", "Permissions"]}
            rows={RBAC_ROLES.map((r) => [r.role, r.permissions])}
            accent={C.teal}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ color: C.lav, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>Authentication Code (JWT + MFA)</div>
          <CodeBlock text={AUTH_CODE} accent={C.lav} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ color: C.gold, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>Input Sanitization (Prompt Injection Prevention)</div>
          <CodeBlock text={INPUT_SANITIZATION_CODE} accent={C.gold} />
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.coral)}>COMMON SECURITY VULNERABILITIES</div>
        <DataTable
          headers={["Vulnerability", "Description", "Mitigation"]}
          rows={SECURITY_VULNERABILITIES.map((v) => [v.vulnerability, v.description, v.mitigation])}
          accent={C.coral}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>ENCRYPTION STRATEGIES</div>
        <DataTable
          headers={["Strategy", "Details"]}
          rows={ENCRYPTION_STRATEGIES.map((e) => [e.strategy, e.details])}
          accent={C.teal}
        />
        <div style={{ marginTop: 12 }}>
          <CodeBlock text={ENCRYPTION_CODE} accent={C.teal} />
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>PRIVACY BY DESIGN</div>
        <DataTable
          headers={["Principle", "Details"]}
          rows={PRIVACY_BY_DESIGN.map((p) => [p.principle, p.details])}
          accent={C.lav}
        />
        <div style={{ marginTop: 12 }}>
          <CodeBlock text={ANONYMIZATION_CODE} accent={C.lav} />
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>INCIDENT RESPONSE PLAN</div>
        <div style={{ display: "grid", gap: 6 }}>
          {INCIDENT_RESPONSE.map((step, i) => (
            <div
              key={i}
              style={{
                padding: "8px 12px",
                background: C.s2,
                borderRadius: 6,
                borderLeft: `3px solid ${C.gold}`,
                color: C.text,
                fontSize: 12,
              }}
            >
              {i + 1}. {step}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Compliance sub-tab ──────────────────────────────── */
function Compliance() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>COMPLIANCE FRAMEWORKS</div>
        <div style={{ display: "grid", gap: 16 }}>
          {COMPLIANCE_FRAMEWORKS.map((f, i) => (
            <div
              key={i}
              style={{
                padding: 16,
                background: C.s2,
                borderRadius: 8,
                borderLeft: `3px solid ${C.teal}`,
              }}
            >
              <div style={{ color: C.teal, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{f.framework}</div>
              <div style={{ display: "grid", gap: 4 }}>
                {f.requirements.map((r, j) => (
                  <div key={j} style={{ color: C.text, fontSize: 11 }}>• {r}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>SECURITY CHECKLIST FOR PRODUCTION</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {SECURITY_CHECKLIST.map((c, i) => (
            <div key={i}>
              <div style={{ color: C.teal, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>{c.category}</div>
              {c.items.map((item, j) => (
                <div key={j} style={{ color: C.text, fontSize: 11, marginBottom: 4 }}>☐ {item}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Main Export ─────────────────────────────────────── */
export default function DeploySecureAgentsTab() {
  const [tab, setTab] = useState("deployment");

  const tabs = [
    { id: "deployment", label: "Deployment" },
    { id: "scaling", label: "Scaling" },
    { id: "security", label: "Security" },
    { id: "compliance", label: "Compliance" },
  ];

  return (
    <div
      style={{
        padding: "24px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 28,
        maxWidth: 880,
        margin: "0 auto",
      }}
    >
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
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? "page" : undefined}
              style={{
                background: "none",
                border: "none",
                borderBottom: `2px solid ${tab === t.id ? C.teal : "transparent"}`,
                color: tab === t.id ? C.teal : C.muted,
                padding: "10px 12px",
                fontSize: 12,
                fontWeight: tab === t.id ? 600 : 400,
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

      {tab === "deployment" && <Deployment />}
      {tab === "scaling" && <Scaling />}
      {tab === "security" && <Security />}
      {tab === "compliance" && <Compliance />}
    </div>
  );
}
