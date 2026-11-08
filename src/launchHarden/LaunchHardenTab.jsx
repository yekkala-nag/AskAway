import React, { useState } from "react";
import {
  TRACK_OVERVIEW,
  NTM_COMMANDS,
  MARCHING_ORDERS,
  FIRST_TEN_MINUTES,
  SCALING_GUIDE,
  AGENT_COMPOSITION,
  STUCK_SWARM,
  HUMAN_TENDING,
  FRESH_EYES_REVIEW,
  ADVANCE_BEAD,
  TEST_COVERAGE,
  UI_UX_SCRUTINY,
  PLATFORM_POLISH,
  RANDOM_EXPLORATION,
  DE_SLOP_PATTERNS,
  COMPILER_CHECKS,
} from "./launchHardenContent.js";

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

function PromptBlock({ text, accent = C.teal }) {
  return (
    <div
      style={{
        background: C.s2,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: 14,
        whiteSpace: "pre-wrap",
        color: C.text,
        fontSize: 11.5,
        lineHeight: 1.65,
        ...mono,
      }}
    >
      {text}
    </div>
  );
}

/* ─── Launch sub-tab ──────────────────────────────────── */
function Launch() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>NTM: LAUNCH COMMANDS</div>
        <DataTable
          headers={["Command", "Description"]}
          rows={NTM_COMMANDS.map((c) => [c.cmd, c.desc])}
          accent={C.teal}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>MARCHING ORDERS</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>
          Give each agent these marching orders after launch.
        </div>
        <PromptBlock text={MARCHING_ORDERS} accent={C.lav} />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>FIRST 10 MINUTES AFTER LAUNCH</div>
        <div style={{ display: "grid", gap: 8 }}>
          {FIRST_TEN_MINUTES.map((s) => (
            <div
              key={s.step}
              style={{
                display: "flex",
                gap: 14,
                padding: "10px 14px",
                background: C.s2,
                borderRadius: 8,
                borderLeft: `3px solid ${C.teal}`,
              }}
            >
              <span style={{ ...mono, color: C.teal, fontWeight: 700, fontSize: 14, minWidth: 24 }}>
                {s.step}
              </span>
              <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6 }}>{s.action}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>AGENT COMPOSITION & MODEL RECOMMENDATIONS</div>
        <DataTable
          headers={["Phase", "Recommended Model", "Why"]}
          rows={AGENT_COMPOSITION.map((a) => [a.phase, a.model, a.why])}
          accent={C.teal}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>SCALING GUIDE</div>
        <DataTable
          headers={["Open Beads", "Claude (cc)", "Codex (cod)", "Gemini (gmi)"]}
          rows={SCALING_GUIDE.map((s) => [s.beads, s.claude, s.codex, s.gemini])}
          accent={C.lav}
        />
      </div>
    </>
  );
}

/* ─── Thundering Herd sub-tab ─────────────────────────── */
function ThunderingHerd() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.coral)}>THUNDERING HERD</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          When you start up 5 of each kind of agent and have them all collaborate in the same
          shared workspace, you can hit the classic "thundering herd" problem. The fix: stagger
          agent starts by 30 seconds minimum, make sure agents mark beads as in-progress quickly,
          and wait 4 seconds after launch before sending the initial prompt.
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <Callout color={C.coral} title="STAGGER STARTS">
            Wait 30 seconds between launching each agent to prevent simultaneous bead claims.
          </Callout>
          <Callout color={C.gold} title="MARK BEADS FAST">
            Agents should mark beads as in-progress immediately after claiming to prevent
            duplicate work.
          </Callout>
          <Callout color={C.teal} title="WAIT 4 SECONDS">
            After launch, wait 4 seconds before sending the initial marching-orders prompt.
          </Callout>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.coral)}>DIAGNOSING A STUCK SWARM</div>
        <DataTable
          headers={["Symptom", "Likely Cause", "What to Do"]}
          rows={STUCK_SWARM.map((s) => [s.symptom, s.cause, s.action])}
          accent={C.coral}
        />
      </div>
    </>
  );
}

/* ─── Tending sub-tab ────────────────────────────────── */
function Tending() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>WHAT THE HUMAN ACTUALLY DOES</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          The human tends the swarm on roughly a 10–30 minute cadence. You are the bottleneck.
          Be the clockwork deity to your agent swarms: design a beautiful and intricate machine,
          set it running, and then move on to the next project.
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {HUMAN_TENDING.map((t, i) => (
            <div
              key={i}
              style={{
                padding: "10px 14px",
                background: C.s2,
                borderRadius: 8,
                borderLeft: `3px solid ${C.teal}`,
                color: C.text,
                fontSize: 12,
                lineHeight: 1.6,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.coral)}>WATCH FOR STRATEGIC DRIFT</div>
        <Callout color={C.coral} title="REALITY CHECK">
          A swarm can look productive while heading in the wrong direction. If that happens,
          stop and ask: "Where are we on this project? Do we actually have the thing we are
          trying to build? If we intelligently implement all open beads, would we close that
          gap completely?"
        </Callout>
      </div>
    </>
  );
}

/* ─── Review & Testing sub-tab ────────────────────────── */
function ReviewTesting() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>FRESH EYES REVIEW</div>
        <PromptBlock text={FRESH_EYES_REVIEW} accent={C.teal} />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>ADVANCE TO NEXT BEAD</div>
        <PromptBlock text={ADVANCE_BEAD} accent={C.lav} />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>TEST COVERAGE</div>
        <PromptBlock text={TEST_COVERAGE} accent={C.gold} />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>COMPILER CHECKS (QUALITY GATE)</div>
        <DataTable
          headers={["Language", "Checks"]}
          rows={COMPILER_CHECKS.map((c) => [c.lang, c.checks])}
          accent={C.teal}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>DEEP CROSS-AGENT REVIEW</div>
        <PromptBlock text={RANDOM_EXPLORATION} accent={C.lav} />
      </div>
    </>
  );
}

/* ─── UI/UX Polish sub-tab ───────────────────────────── */
function UiUxPolish() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>UI/UX SCRUTINY</div>
        <PromptBlock text={UI_UX_SCRUTINY} accent={C.teal} />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>PLATFORM-SPECIFIC POLISH</div>
        <PromptBlock text={PLATFORM_POLISH} accent={C.lav} />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.coral)}>DE-SLOPIFICATION</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          After agents write documentation, run a de-slopify pass to remove telltale AI
          writing patterns.
        </div>
        <DataTable
          headers={["Pattern", "Problem"]}
          rows={DE_SLOP_PATTERNS.map((d) => [d.pattern, d.problem])}
          accent={C.coral}
        />
      </div>
    </>
  );
}

/* ─── Main Export ─────────────────────────────────────── */
export default function LaunchHardenTab() {
  const [tab, setTab] = useState("launch");

  const tabs = [
    { id: "launch", label: "Launch" },
    { id: "thundering", label: "Thundering Herd" },
    { id: "tending", label: "Tending" },
    { id: "review", label: "Review & Testing" },
    { id: "polish", label: "UI/UX Polish" },
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

      {tab === "launch" && <Launch />}
      {tab === "thundering" && <ThunderingHerd />}
      {tab === "tending" && <Tending />}
      {tab === "review" && <ReviewTesting />}
      {tab === "polish" && <UiUxPolish />}
    </div>
  );
}
