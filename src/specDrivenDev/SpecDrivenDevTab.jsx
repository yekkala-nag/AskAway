import React, { useState } from "react";
import { callAIProxy } from "../lib/aiProxy.js";
import {
  TRACK_OVERVIEW,
  LESSON_MAP,
  LESSONS,
  SDD_LOOP_STAGES,
  SPEC_SECTIONS,
  EARS_PATTERNS,
  VERIFICATION_LAYERS,
  TOOLS,
  PITFALLS,
  CAPSTONE,
  INSTRUCTOR_NOTES,
  EXAMPLE_TASKS,
  AMBIGUITY_QUESTIONS,
  VAGUE_VS_TESTABLE,
  FILE_LAYOUT,
} from "./specDrivenDevContent.js";

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

/* ─── Small shared pieces ─────────────────────────────── */

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

function CopyButton({ text, label = "Copy", color = C.teal, onCopied }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopied?.();
  };
  return (
    <button
      onClick={copy}
      style={{
        padding: "4px 10px",
        borderRadius: 4,
        background: copied ? color + "33" : color + "22",
        border: `1px solid ${color}`,
        color,
        fontSize: 10,
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      {copied ? "✓ Copied" : label}
    </button>
  );
}

/* ─── Overview sub-tab ────────────────────────────────── */

function Overview() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>📐</span>
          <div>
            <div style={{ ...labelStyle(C.teal), marginBottom: 4 }}>ELECTIVE TRACK · 8 LESSONS + CAPSTONE</div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2, color: C.text }}>
              Spec-Driven Development
            </h2>
          </div>
        </div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
          Tool-agnostic workflow for getting reliable, reviewable results from AI coding agents:
          write a structured spec first, then drive the agent through a plan, task list and
          implementation that all trace back to it. The spec is the source of truth; code is
          an output.
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <Callout color={C.lav} title="WHO IT IS FOR">
            {TRACK_OVERVIEW.audience}
          </Callout>
          <Callout color={C.coral} title="PREREQUISITES">
            {TRACK_OVERVIEW.prerequisites}
          </Callout>
          <Callout color={C.teal} title="PACING">
            {TRACK_OVERVIEW.pacing}
          </Callout>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>BY THE END YOU CAN</div>
        <div style={{ display: "grid", gap: 8 }}>
          {TRACK_OVERVIEW.outcomes.map((o, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                padding: "8px 12px",
                background: C.s2,
                borderRadius: 6,
                borderLeft: `3px solid ${C.gold}`,
              }}
            >
              <span style={{ color: C.gold, fontWeight: 700, fontSize: 11 }}>{i + 1}</span>
              <span style={{ color: C.text, fontSize: 12, lineHeight: 1.6 }}>{o}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>LESSON MAP</div>
        <DataTable
          headers={["#", "Lesson", "Core idea"]}
          rows={LESSON_MAP.map((l) => [l.n, l.lesson, l.core])}
        />
      </div>
    </>
  );
}

/* ─── Lessons sub-tab ─────────────────────────────────── */

function Lessons() {
  const [sel, setSel] = useState(0);
  const lesson = LESSONS[sel];
  const [genType, setGenType] = useState("code");
  const [genPrompt, setGenPrompt] = useState("");
  const [genKey, setGenKey] = useState("");
  const [genResult, setGenResult] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState(null);

  const handleGenerate = async () => {
    if (!genPrompt.trim()) return;
    setGenLoading(true);
    setGenError(null);
    setGenResult("");
    try {
      const result = await callAIProxy({
        messages: [
          {
            role: "user",
            content: `Generate a ${genType} for: ${genPrompt}. Lesson: ${lesson.title}. Keep it concise and practical.`,
          },
        ],
        stream: false,
        apiKey: genKey.trim() || undefined,
      });
      setGenResult(result);
    } catch (e) {
      setGenError(String(e.message));
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>SELECT A LESSON</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {LESSONS.map((l, i) => (
            <button
              key={l.id}
              onClick={() => setSel(i)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                background: sel === i ? C.teal + "22" : C.s2,
                border: `1px solid ${sel === i ? C.teal : C.border}`,
                color: sel === i ? C.teal : C.muted,
                fontSize: 11,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {l.icon} {l.n}. {l.title}
            </button>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={{ ...labelStyle(C.coral), marginBottom: 6 }}>
          LESSON {lesson.n} OF 8
        </div>
        <h3 style={{ margin: "0 0 10px 0", color: C.text, fontSize: 18 }}>
          {lesson.icon} {lesson.title}
        </h3>
        <div style={{ color: C.muted, fontSize: 11, marginBottom: 6, ...mono }}>LEARNING OBJECTIVES</div>
        <ul style={{ margin: "0 0 16px 0", paddingLeft: 18, color: C.text, fontSize: 12, lineHeight: 1.9 }}>
          {lesson.objectives.map((o, i) => (
            <li key={i}>{o}</li>
          ))}
        </ul>

        {lesson.sections.map((s, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ color: C.teal, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
              {s.heading}
            </div>
            {(s.body || []).map((b, j) => (
              <div key={j} style={{ color: C.text, fontSize: 12, lineHeight: 1.7, marginBottom: 6 }}>
                {b}
              </div>
            ))}
            {s.bullets && (
              <ul style={{ margin: "4px 0 0 0", paddingLeft: 18, color: C.muted, fontSize: 12, lineHeight: 1.9 }}>
                {s.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
          <Callout color={C.lav} title="EXERCISE">
            {lesson.exercise}
          </Callout>
          <Callout color={C.teal} title="TAKEAWAY">
            {lesson.takeaway}
          </Callout>
        </div>

        <div style={sectionStyle}>
          <div style={labelStyle(C.teal)}>GENERATE WITH AI</div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>
            Generate code, a markdown table, or a workflow outline for this lesson&apos;s topic.
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            <select
              value={genType}
              onChange={(e) => setGenType(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                background: C.s2,
                border: `1px solid ${C.border}`,
                color: C.text,
                fontSize: 11,
              }}
            >
              <option value="code">Code</option>
              <option value="table">Markdown table</option>
              <option value="workflow">Workflow outline</option>
            </select>
            <input
              value={genPrompt}
              onChange={(e) => setGenPrompt(e.target.value)}
              placeholder="Your requirement (e.g. password reset endpoint)"
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                background: C.s2,
                border: `1px solid ${C.border}`,
                color: C.text,
                fontSize: 11,
              }}
            />
            <input
              value={genKey}
              onChange={(e) => setGenKey(e.target.value)}
              type="password"
              placeholder="OpenAI API key (optional; uses platform key if set)"
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                background: C.s2,
                border: `1px solid ${C.border}`,
                color: C.text,
                fontSize: 11,
              }}
            />
            <button
              onClick={handleGenerate}
              disabled={genLoading}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                background: genLoading ? C.muted : C.teal,
                border: "none",
                color: C.bg,
                fontSize: 11,
                fontWeight: 600,
                cursor: genLoading ? "not-allowed" : "pointer",
              }}
            >
              {genLoading ? "Generating…" : "Generate"}
            </button>
          </div>
          {genError && (
            <Callout color={C.coral}>{genError}</Callout>
          )}
          {genResult && (
            <div
              style={{
                padding: 12,
                background: C.s2,
                borderRadius: 6,
                borderLeft: `3px solid ${C.teal}`,
                color: C.text,
                fontSize: 12,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {genResult}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── The Loop sub-tab ────────────────────────────────── */

function TheLoop() {
  const [active, setActive] = useState(1);
  const stage = SDD_LOOP_STAGES.find((s) => s.n === active);

  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>THE SEVEN-STAGE LOOP</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
          Intent → Spec → Plan → Tasks → Implement → Verify → Update spec → back to Intent.
          The highest-leverage reviews are early: spec and plan. Treat those gates as the real
          code review; the diff review is the confirmation.
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {SDD_LOOP_STAGES.map((s) => (
            <button
              key={s.n}
              onClick={() => setActive(s.n)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                background: active === s.n ? C.teal + "22" : C.s2,
                border: `1px solid ${active === s.n ? C.teal : C.border}`,
                color: active === s.n ? C.teal : C.muted,
                fontSize: 11,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {s.n}. {s.stage}
            </button>
          ))}
        </div>
        {stage && (
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ padding: 12, background: C.s2, borderRadius: 8, borderLeft: `3px solid ${C.teal}` }}>
              <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>YOU PRODUCE</div>
              <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6 }}>{stage.produce}</div>
            </div>
            <div style={{ padding: 12, background: C.s2, borderRadius: 8, borderLeft: `3px solid ${C.lav}` }}>
              <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>AGENT HELPS BY</div>
              <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6 }}>{stage.agent}</div>
            </div>
            <div style={{ padding: 12, background: C.coral + "11", borderRadius: 8, borderLeft: `3px solid ${C.coral}` }}>
              <div style={{ color: C.coral, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>
                GATE (HUMAN DECISION)
              </div>
              <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6 }}>{stage.gate}</div>
            </div>
          </div>
        )}
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.coral)}>RULES OF THE LOOP</div>
        <ul style={{ margin: 0, paddingLeft: 18, color: C.text, fontSize: 12, lineHeight: 1.9 }}>
          <li>Never ask the agent to implement something that is not in the spec.</li>
          <li>If implementation reveals a gap, stop, fix the spec, then continue.</li>
          <li>One task per agent run, one reviewable diff per task.</li>
          <li>The spec ships in the same pull request as the code.</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>ARTIFACTS LIVE IN THE REPO</div>
        <div
          style={{
            padding: 14,
            background: "#0F1219",
            borderRadius: 8,
            color: C.teal,
            fontSize: 11,
            lineHeight: 1.7,
            ...mono,
            whiteSpace: "pre-wrap",
          }}
        >
          {FILE_LAYOUT}
        </div>
        <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.6, marginTop: 10 }}>
          Project-wide rules file (constitution / steering file / AGENTS.md): conventions that
          apply to every feature. Write it once; every spec inherits it. One folder per feature
          keeps history and makes specs diff-able in version control.
        </div>
      </div>
    </>
  );
}

/* ─── Specs & EARS sub-tab ────────────────────────────── */

function SpecsEars() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>THE CORE SECTIONS OF A SPEC</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          A spec describes behavior and intent: what the system should do, for whom, under which
          rules, and how you will know it works. Not an implementation plan, not a design essay.
        </div>
        <DataTable
          headers={["Section", "Purpose", "Example"]}
          rows={SPEC_SECTIONS.map((s) => [s.section, s.purpose, s.example])}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.coral)}>SPEC vs. PLAN vs. TASKS</div>
        <div style={{ display: "grid", gap: 8 }}>
          <Callout color={C.teal} title="SPEC — WHAT &amp; WHY">
            Stable, reviewed by humans who own the product.
          </Callout>
          <Callout color={C.lav} title="PLAN — HOW">
            Architecture, libraries, data model; reviewed by engineers.
          </Callout>
          <Callout color={C.coral} title="TASKS — IN WHAT ORDER">
            Small steps the agent executes.
          </Callout>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>EARS: REQUIREMENT SENTENCE PATTERNS</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          EARS (Easy Approach to Requirements Syntax) gives short, uniform sentence templates.
          Kiro uses it in the spec stage. The value is consistency: every line is one verifiable
          behavior.
        </div>
        <DataTable
          headers={["Pattern", "Template", "Example"]}
          rows={EARS_PATTERNS.map((e) => [e.pattern, e.template, e.example])}
          accent={C.lav}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.coral)}>VAGUE vs. TESTABLE</div>
        <div style={{ display: "grid", gap: 10 }}>
          {VAGUE_VS_TESTABLE.map((v, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ padding: 10, background: C.coral + "11", borderRadius: 6, borderLeft: `3px solid ${C.coral}`, color: C.text, fontSize: 12, lineHeight: 1.6 }}>
                {v.vague}
              </div>
              <div style={{ padding: 10, background: C.teal + "11", borderRadius: 6, borderLeft: `3px solid ${C.teal}`, color: C.text, fontSize: 12, lineHeight: 1.6 }}>
                {v.testable}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>AMBIGUITY HUNTING</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>
          Before you approve a spec, ask the agent (or a teammate) to attack it. Treat the
          answers as a to-do list for the spec, not as a license for the agent to decide.
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {AMBIGUITY_QUESTIONS.map((q, i) => (
            <div
              key={i}
              style={{
                padding: "8px 12px",
                background: C.s2,
                borderRadius: 6,
                borderLeft: `3px solid ${C.lav}`,
                color: C.text,
                fontSize: 12,
                lineHeight: 1.6,
                ...mono,
              }}
            >
              {q}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <Callout color={C.teal} title="GIVEN / WHEN / THEN">
            Each criterion should map to at least one automated test. If you cannot imagine the
            test, rewrite the criterion.
          </Callout>
        </div>
      </div>
    </>
  );
}

/* ─── Tasks & Planning sub-tab ────────────────────────── */

function TasksPlanning() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>GOOD TASKS</div>
        <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
          <Callout color={C.teal} title="SMALL">
            One concern, one reviewable diff, ideally under an hour of human review.
          </Callout>
          <Callout color={C.lav} title="INDEPENDENT OR CLEARLY ORDERED">
            Dependencies are stated.
          </Callout>
          <Callout color={C.coral} title="VERIFIABLE">
            Has a done-check: a test, a command, an observable behavior.
          </Callout>
          <Callout color={C.gold} title="TRACEABLE">
            References the requirement it satisfies.
          </Callout>
        </div>
        <div style={labelStyle(C.lav)}>EXAMPLE TASK LIST</div>
        <div style={{ display: "grid", gap: 6 }}>
          {EXAMPLE_TASKS.map((t) => (
            <div
              key={t.id}
              style={{
                padding: "10px 12px",
                background: C.s2,
                borderRadius: 6,
                borderLeft: `3px solid ${C.teal}`,
              }}
            >
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 4 }}>
                <span style={{ color: C.teal, fontWeight: 700, fontSize: 11, ...mono }}>{t.id}</span>
                <span style={{ color: C.muted, fontSize: 10, ...mono }}>({t.reqs})</span>
              </div>
              <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6 }}>{t.text}</div>
              <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
                Done when: {t.done}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.coral)}>THE PLAN ANSWERS HOW</div>
        <ul style={{ margin: 0, paddingLeft: 18, color: C.text, fontSize: 12, lineHeight: 1.9 }}>
          <li>Architecture and where the change fits in the existing system.</li>
          <li>Data model and interfaces (APIs, events, schemas).</li>
          <li>Libraries and why (prefer what the project already uses).</li>
          <li>Risks, unknowns and spikes needed to retire them.</li>
          <li>A test strategy aligned with the acceptance criteria.</li>
        </ul>
        <div style={{ marginTop: 12 }}>
          <Callout color={C.gold} title="RECORD THE REASON">
            Have the agent propose two options with trade-offs for any non-obvious decision, then
            record your choice and the reason. That reason is exactly what the next developer —
            or the next agent session — will need.
          </Callout>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>PARALLELISM &amp; TEST-FIRST</div>
        <div style={{ color: C.text, fontSize: 12, lineHeight: 1.7, marginBottom: 10 }}>
          Independent tasks can run in parallel agent sessions, each on its own branch or
          worktree. Dependent tasks run in order. Write the dependency in the task list instead
          of hoping the agent infers it.
        </div>
        <div style={{ color: C.text, fontSize: 12, lineHeight: 1.7 }}>
          Where practical, make the first task for each behavior &quot;write the failing test from
          the acceptance criterion&quot;. The tests then become the objective check that the
          agent&apos;s code matches the spec.
        </div>
      </div>
    </>
  );
}

/* ─── Implement & Verify sub-tab ──────────────────────── */

function ImplementVerify() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>RUNNING A TASK: THE CONTEXT BUNDLE</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>
          Give the agent a tight context bundle, then instruct it: implement only this task; do
          not change behavior outside it; run the done-check; report what it ran and what
          happened.
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {["The project rules file.", "The relevant spec section.", "The plan sections it touches.", "One task, with its done-check."].map((t, i) => (
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
              {i + 1}. {t}
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.coral)}>REVIEW THE DIFF AGAINST THE SPEC, NOT AGAINST TASTE</div>
        <ul style={{ margin: 0, paddingLeft: 18, color: C.text, fontSize: 12, lineHeight: 1.9 }}>
          <li>Does every changed behavior trace to a requirement?</li>
          <li>Is there behavior that is not in the spec? (Scope creep: remove it or add it to the spec deliberately.)</li>
          <li>Do the tests assert the acceptance criteria, or only whatever the code happens to do?</li>
          <li>Did the agent touch files unrelated to the task?</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>VERIFICATION LAYERS</div>
        <DataTable
          headers={["Layer", "Question", "Examples"]}
          rows={VERIFICATION_LAYERS.map((v) => [v.layer, v.question, v.examples])}
          accent={C.lav}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>WHEN IMPLEMENTATION EXPOSES A GAP</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>
          This will happen. The correct response is a loop, not a patch:
        </div>
        <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
          {["Stop the task.", "Update the spec (or record an open question) with the new decision.", "Adjust the plan and tasks if needed.", "Resume."].map((t, i) => (
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
              {i + 1}. {t}
            </div>
          ))}
        </div>
        <Callout color={C.coral}>
          If you let the code absorb the decision silently, the spec stops being the truth and
          you are back to vibe coding with extra paperwork. After verification, diff the behavior
          against the spec and update either one — a stale spec is worse than none, because it
          lies confidently.
        </Callout>
      </div>
    </>
  );
}

/* ─── Tools sub-tab ───────────────────────────────────── */

function ToolsTab() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>ONE WORKFLOW, MANY TOOLS</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          SDD is a method; tools differ in how much of it they automate. Names and features
          change quickly, so check each project&apos;s current documentation before adopting one.
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {TOOLS.map((t, i) => (
            <div
              key={i}
              style={{ padding: 14, background: C.s2, borderRadius: 8, borderLeft: `3px solid ${C.teal}` }}
            >
              <div style={{ color: C.teal, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{t.name}</div>
              <div style={{ color: C.muted, fontSize: 11, marginBottom: 6 }}>{t.style}</div>
              <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6 }}>{t.loop}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>HOW TO CHOOSE</div>
        <ul style={{ margin: 0, paddingLeft: 18, color: C.text, fontSize: 12, lineHeight: 1.9 }}>
          <li>Solo or small project, any agent: start with plain markdown and a rules file. Zero lock-in.</li>
          <li>Team standardizing across several agents: an agent-agnostic toolkit gives shared templates and consistent stages.</li>
          <li>Want enforcement inside the editor: an IDE built around specs reduces ceremony but ties the workflow to that product.</li>
          <li>Large existing codebase: prefer approaches that express changes as deltas to existing specs.</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>WHAT TRANSFERS BETWEEN TOOLS</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>
          Good specs travel. Keep these portable, whatever the tool:
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, color: C.text, fontSize: 12, lineHeight: 1.9 }}>
          <li>Specs as plain markdown in the repository.</li>
          <li>Requirements with IDs and acceptance criteria.</li>
          <li>A rules file in plain language.</li>
          <li>Tasks with done-checks.</li>
        </ul>
        <div style={{ marginTop: 12 }}>
          <Callout color={C.coral}>
            If a tool stores your intent in a format you cannot read or export, treat that as a
            risk.
          </Callout>
        </div>
      </div>
    </>
  );
}

/* ─── Brownfield & Pitfalls sub-tab ───────────────────── */

function BrownfieldPitfalls() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>WORKING IN AN EXISTING CODEBASE</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>
          Most real work is brownfield. Adapt the loop:
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <Callout color={C.teal} title="CAPTURE CURRENT BEHAVIOR FIRST">
            Have the agent draft a spec of how the relevant area works today, then verify it
            yourself. Agents infer behavior from code and can be confidently wrong.
          </Callout>
          <Callout color={C.lav} title="WRITE THE CHANGE AS A DELTA">
            &quot;Currently X; after this change, Y.&quot; This keeps reviews small.
          </Callout>
          <Callout color={C.gold} title="RESPECT EXISTING PATTERNS">
            Put conventions in the rules file so the agent extends the codebase instead of
            inventing a new style.
          </Callout>
          <Callout color={C.coral} title="CHARACTERIZE BEFORE CHANGING">
            Add tests that pin current behavior, then change it.
          </Callout>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.coral)}>COMMON FAILURE MODES</div>
        <DataTable
          headers={["Pitfall", "Symptom", "Fix"]}
          rows={PITFALLS.map((p) => [p.pitfall, p.symptom, p.fix])}
          accent={C.coral}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>WHEN NOT TO USE SDD</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>
          Spec-driven work has real overhead. Skip or shrink it for:
        </div>
        <ul style={{ margin: "0 0 12px 0", paddingLeft: 18, color: C.text, fontSize: 12, lineHeight: 1.9 }}>
          <li>Throwaway prototypes and spikes where learning is the goal.</li>
          <li>Tiny, obvious changes (a typo, a copy tweak, a one-line fix).</li>
          <li>Exploratory UI play where you need to see options to know what you want.</li>
        </ul>
        <Callout color={C.gold}>
          A useful rule: the cost of a wrong guess decides how much spec you write. Low cost,
          vibe it. High cost (security, money, data, many users), spec it.
        </Callout>
        <div style={{ marginTop: 10 }}>
          <Callout color={C.teal} title="VIBE FIRST, SPEC SECOND">
            The two are not enemies. Vibe-code a quick prototype to discover what you want, then
            write the spec from what you learned, and rebuild properly. The prototype becomes a
            research artifact, not the product.
          </Callout>
        </div>
      </div>
    </>
  );
}

/* ─── Capstone sub-tab ────────────────────────────────── */

function Capstone() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>SHIP A FEATURE SPEC-FIRST</div>
        <h3 style={{ margin: "0 0 10px 0", color: C.text, fontSize: 18 }}>🏆 Capstone</h3>
        <Callout color={C.teal} title="GOAL">{CAPSTONE.goal}</Callout>
        <div style={{ height: 10 }} />
        <Callout color={C.lav} title="BRIEF">{CAPSTONE.brief}</Callout>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>DELIVERABLES</div>
        <div style={{ display: "grid", gap: 8 }}>
          {CAPSTONE.deliverables.map((d, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                padding: "8px 12px",
                background: C.s2,
                borderRadius: 6,
                borderLeft: `3px solid ${C.teal}`,
              }}
            >
              <span style={{ color: C.teal, fontWeight: 700, fontSize: 11 }}>☐</span>
              <div>
                <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6 }}>{d.name}</div>
                {d.detail && <div style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>{d.detail}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.coral)}>RUBRIC</div>
        <DataTable
          headers={["Criterion", "Strong", "Weak"]}
          rows={CAPSTONE.rubric.map((r) => [r.criterion, r.strong, r.weak])}
          accent={C.coral}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>INSTRUCTOR NOTES</div>
        <div style={{ display: "grid", gap: 8 }}>
          {INSTRUCTOR_NOTES.map((n, i) => (
            <div
              key={i}
              style={{ padding: 12, background: C.s2, borderRadius: 8, borderLeft: `3px solid ${C.lav}` }}
            >
              <div style={{ color: C.lav, fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{n.topic}</div>
              <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6 }}>{n.note}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Main Export ─────────────────────────────────────── */

export default function SpecDrivenDevTab() {
  const [tab, setTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "lessons", label: "Lessons" },
    { id: "loop", label: "The Loop" },
    { id: "specs", label: "Specs & EARS" },
    { id: "tasks", label: "Plans & Tasks" },
    { id: "verify", label: "Implement & Verify" },
    { id: "tools", label: "Tools" },
    { id: "brownfield", label: "Brownfield & Pitfalls" },
    { id: "capstone", label: "Capstone" },
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
      {/* Sub-tab bar */}
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

      {tab === "overview" && <Overview />}
      {tab === "lessons" && <Lessons />}
      {tab === "loop" && <TheLoop />}
      {tab === "specs" && <SpecsEars />}
      {tab === "tasks" && <TasksPlanning />}
      {tab === "verify" && <ImplementVerify />}
      {tab === "tools" && <ToolsTab />}
      {tab === "brownfield" && <BrownfieldPitfalls />}
      {tab === "capstone" && <Capstone />}
    </div>
  );
}
