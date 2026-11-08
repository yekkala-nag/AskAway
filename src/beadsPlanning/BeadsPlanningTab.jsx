import React, { useState } from "react";
import {
  TRACK_OVERVIEW,
  FOUNDATION_BUNDLE,
  MULTI_MODEL_SYNTHESIS,
  INTEGRATE_SYNTHESIS,
  PLAN_REFINEMENT,
  OVERSHOOT_MISMATCH,
  PLAN_TO_BEADS,
  BEAD_POLISHING,
  FRESH_EYES_BEADS,
  BEAD_DEDUP,
  IDEA_WIZARD,
  CONVERGENCE_PHASES,
  CONVERGENCE_SIGNALS,
  IDEA_WIZARD_STEPS,
  BEAD_AS_EXECUTABLE_MEMORY,
  BEAD_CLI_REFERENCE,
  BEAD_POLISHING_RED_FLAGS,
} from "./beadsPlanningContent.js";

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

/* ─── Markdown Plan sub-tab ───────────────────────────── */
function MarkdownPlan() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>BEFORE YOU START: THE FOUNDATION BUNDLE</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          Before writing the plan itself, you need a coherent foundation. Think of it as
          assembling a foundation bundle. Weak foundations leak uncertainty into every
          later stage.
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {FOUNDATION_BUNDLE.map((item, i) => (
            <div
              key={i}
              style={{
                padding: "8px 12px",
                background: C.s2,
                borderRadius: 6,
                borderLeft: `3px solid ${C.teal}`,
                color: C.text,
                fontSize: 12,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>MULTI-MODEL SYNTHESIS</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>
          Ask multiple frontier models to independently create plans for the same project.
          Each comes up with pretty different plans. Then synthesize the best ideas.
        </div>
        <PromptBlock text={MULTI_MODEL_SYNTHESIS} accent={C.lav} />
        <div style={{ marginTop: 12 }}>
          <PromptBlock text={INTEGRATE_SYNTHESIS} accent={C.lav} />
        </div>
      </div>
    </>
  );
}

/* ─── Iterative Refinement sub-tab ────────────────────── */
function IterativeRefinement() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>PLAN REFINEMENT PROMPT</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>
          Paste the current plan into a <strong style={{ color: C.text }}>fresh</strong>{" "}
          conversation. Repeat 4–5 rounds until suggestions become incremental. Fresh
          conversations prevent the model from anchoring on its own prior output.
        </div>
        <PromptBlock text={PLAN_REFINEMENT} accent={C.teal} />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.coral)}>THE "LIE TO THEM" TECHNIQUE</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>
          Models tend to stop looking for problems after finding ~20–25 issues. If you tell
          them to find "all" problems, they stop early. The solution: overshoot.
        </div>
        <PromptBlock text={OVERSHOOT_MISMATCH} accent={C.coral} />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>WHEN TO STOP REFINING</div>
        <ul style={{ margin: 0, paddingLeft: 18, color: C.text, fontSize: 12, lineHeight: 1.9 }}>
          <li>Stay in plan refinement if whole-workflow questions are still moving around.</li>
          <li>Stay if major architecture debates are still open.</li>
          <li>Stay if fresh models keep finding substantial missing features.</li>
          <li>Switch to beads when the plan mostly feels stable and remaining improvements are about execution structure, testing obligations, and sequencing.</li>
        </ul>
      </div>
    </>
  );
}

/* ─── Plan → Beads sub-tab ────────────────────────────── */
function PlanToBeads() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>PLAN → BEADS CONVERSION</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>
          There are two separate stages. The planning is and should be prior to and orthogonal
          to beads. You should always have a super detailed markdown plan first. Then treat
          transforming that markdown plan into beads as a separate, distinct problem. But once
          you're in "bead space" you never look back at the markdown plan.
        </div>
        <PromptBlock text={PLAN_TO_BEADS} accent={C.teal} />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>BEADS AS EXECUTABLE MEMORY</div>
        <DataTable
          headers={["Principle", "Detail"]}
          rows={BEAD_AS_EXECUTABLE_MEMORY.map((b) => [b.principle, b.detail])}
          accent={C.lav}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>BEAD CLI QUICK REFERENCE</div>
        <DataTable
          headers={["Command", "Description"]}
          rows={BEAD_CLI_REFERENCE.map((b) => [b.cmd, b.desc])}
          accent={C.gold}
        />
      </div>
    </>
  );
}

/* ─── Bead Polishing sub-tab ──────────────────────────── */
function BeadPolishing() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>BEAD POLISHING PROMPT</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>
          Before you burn tokens with a big agent swarm, "Measure twice, cut once" becomes
          "Check your beads N times, implement once," where N is as many as you can stomach.
        </div>
        <PromptBlock text={BEAD_POLISHING} accent={C.teal} />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>CONVERGENCE DETECTION</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          Bead polishing follows numerical optimization convergence patterns.
        </div>
        <DataTable
          headers={["Phase", "Rounds", "Character"]}
          rows={CONVERGENCE_PHASES.map((c) => [c.phase, c.rounds, c.character])}
          accent={C.lav}
        />
        <div style={{ marginTop: 14 }}>
          <DataTable
            headers={["Signal", "Meaning"]}
            rows={CONVERGENCE_SIGNALS.map((s) => [s.signal, s.meaning])}
            accent={C.lav}
          />
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.coral)}>EARLY TERMINATION RED FLAGS</div>
        <DataTable
          headers={["Flag", "Meaning", "Action"]}
          rows={BEAD_POLISHING_RED_FLAGS.map((r) => [r.flag, r.meaning, r.action])}
          accent={C.coral}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>FRESH EYES ON BEADS</div>
        <PromptBlock text={FRESH_EYES_BEADS} accent={C.teal} />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>BEAD DEDUPLICATION</div>
        <PromptBlock text={BEAD_DEDUP} accent={C.gold} />
      </div>
    </>
  );
}

/* ─── Idea-Wizard sub-tab ─────────────────────────────── */
function IdeaWizard() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>IDEA-WIZARD: ADDING FEATURES TO EXISTING PROJECTS</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          The full planning pipeline is for new projects built from scratch. For existing
          projects, the Idea-Wizard is a formalized 6-phase pipeline.
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {IDEA_WIZARD_STEPS.map((s) => (
            <div
              key={s.step}
              style={{
                display: "flex",
                gap: 14,
                padding: "12px 14px",
                background: C.s2,
                borderRadius: 8,
                borderLeft: `3px solid ${C.teal}`,
              }}
            >
              <span style={{ ...mono, color: C.teal, fontWeight: 700, fontSize: 14, minWidth: 24 }}>
                {s.step}
              </span>
              <div>
                <div style={{ color: C.text, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{s.title}</div>
                <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>IDEA-WIZARD: GENERATE IDEAS</div>
        <PromptBlock text={IDEA_WIZARD} accent={C.lav} />
      </div>
    </>
  );
}

/* ─── Main Export ─────────────────────────────────────── */
export default function BeadsPlanningTab() {
  const [tab, setTab] = useState("markdown");

  const tabs = [
    { id: "markdown", label: "Markdown Plan" },
    { id: "refine", label: "Iterative Refinement" },
    { id: "beads", label: "Plan → Beads" },
    { id: "polish", label: "Bead Polishing" },
    { id: "ideawizard", label: "Idea-Wizard" },
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

      {tab === "markdown" && <MarkdownPlan />}
      {tab === "refine" && <IterativeRefinement />}
      {tab === "beads" && <PlanToBeads />}
      {tab === "polish" && <BeadPolishing />}
      {tab === "ideawizard" && <IdeaWizard />}
    </div>
  );
}
