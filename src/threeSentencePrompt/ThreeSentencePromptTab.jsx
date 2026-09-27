import React, { useState } from "react";

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
};

const THREE_SENTENCES =
  "First, review my full message and any attached files, even if my thoughts are rough, fragmented, or unfiltered. Tell me what you think I'm actually trying to achieve, then propose a plan for me to review. Stop and wait for my approval before starting the task.";

const PHASES = ["All", "Before generating", "While generating / grounding", "After generating / revising"];

const REVISION_PROMPTS = [
  {
    name: "Diff-based editing",
    text: "When editing my draft, show me only what you changed and why — not a full rewrite. If a change is stylistic rather than necessary, flag it as optional.",
    when: "Use when editing long drafts.",
    overhead: "Low",
    level: "Easy",
  },
  {
    name: "Preserve-voice constraint",
    text: "Edit this for clarity/structure but keep my own voice and phrasing wherever possible. Don't smooth it into generic 'AI-sounding' prose.",
    when: "Use for any edit of your own writing.",
    overhead: "Low",
    level: "Easy",
  },
  {
    name: "Minimal viable fix",
    text: "Fix only what's actually broken or unclear. Don't restructure, don't add sections, don't improve things I didn't ask about — tell me separately if you notice other issues.",
    when: "Use for noisy drafts where restraint matters.",
    overhead: "Low",
    level: "Easy",
  },
  {
    name: "Feedback incorporation",
    text: "Here's feedback on your last draft. Before revising, tell me how you're interpreting each piece of feedback, in case I need to correct your read on it.",
    when: "Use when iterating on AI drafts. (Paste the feedback itself before this prompt.)",
    overhead: "Medium",
    level: "Medium",
  },
  {
    name: "Version comparison",
    text: "Produce two versions with a genuinely different tradeoff (e.g. concise vs. thorough, conservative vs. bold), and tell me in one line what each optimizes for — not just 'version A' and 'version B'.",
    when: "Use for tradeoff decisions.",
    overhead: "Medium",
    level: "Medium",
  },
  {
    name: "Scope boundary check",
    text: "Tell me what's out of scope for this task, based on what I've asked, so we both know what you're deliberately not doing.",
    when: "Use for ambiguous tasks.",
    overhead: "Low",
    level: "Easy",
  },
  {
    name: "Reversibility flag",
    text: "If any part of what you're about to do is hard to undo or would require significant rework to change later (an architecture choice, a naming convention, a structural decision), flag it before proceeding, even if I didn't ask.",
    when: "Use for architecture, naming, or structural choices.",
    overhead: "Low",
    level: "Medium",
  },
  {
    name: "Teach-back check",
    text: "After you explain something to me, ask me to restate it in my own words, or offer to quiz me — don't assume the explanation landed.",
    when: "Use for learning and explanations.",
    overhead: "Low",
    level: "Easy",
  },
  {
    name: "Silent-failure guard",
    text: "If you can't actually do part of what I asked (missing info, tool limitation, outside your ability), say so explicitly rather than producing something that looks complete but quietly skips it.",
    when: "Use for any task with possible capability gaps.",
    overhead: "Low",
    level: "Easy",
  },
];

const PATTERNS = [
  {
    id: "plan-then-execute",
    name: "Plan-Then-Execute",
    desc: "Force the AI to generate a plan and stop before executing.",
    category: "control",
    code: "Propose a plan for me to review. Stop and wait for my approval before starting the task.",
  },
  {
    id: "understand-before-acting",
    name: "Understand Before Acting",
    desc: "Make the AI restate your goal before producing output.",
    category: "control",
    code: "Tell me what you think I'm actually trying to achieve before you start.",
  },
  {
    id: "self-critique-loop",
    name: "Self-Critique Loop",
    desc: "Ask the AI to evaluate its own output before presenting it.",
    category: "quality",
    code: "After you draft your response, critique it for accuracy and completeness, then revise.",
  },
  {
    id: "constraint-extraction",
    name: "Constraint Extraction",
    desc: "Surface hidden constraints and assumptions from messy input.",
    category: "analysis",
    code: "List all constraints, assumptions, and open questions you see in my message before answering.",
  },
  {
    id: "options-before-commitment",
    name: "Options Before Commitment",
    desc: "Present 2-3 options with trade-offs before choosing one.",
    category: "quality",
    code: "Give me 2-3 options with trade-offs before you commit to a single recommendation.",
  },
  {
    id: "assumption-surfacing",
    name: "Assumption Surfacing",
    desc: "Explicitly state what the AI is assuming about your request.",
    category: "analysis",
    code: "Before answering, list the assumptions you're making about my request.",
  },
  {
    id: "staged-output",
    name: "Staged Output",
    desc: "Deliver content in stages rather than all at once.",
    category: "workflow",
    code: "Deliver your response in stages. Start with a summary, then expand section by section.",
  },
  {
    id: "post-hoc-audit",
    name: "Post-Hoc Audit",
    desc: "Review the final output against original requirements.",
    category: "quality",
    code: "After finishing, audit your output against my original requirements and flag any gaps.",
  },
];

const sectionStyle = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 14,
  padding: 24,
};

const mono = {
  fontFamily: "JetBrains Mono, monospace",
};

const labelStyle = (color) => ({
  ...mono,
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.1em",
  color,
  marginBottom: 12,
});

/* ─── PatternLibrary ──────────────────────────────────── */

function PatternLibrary() {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const categories = ["all", ...new Set(PATTERNS.map((p) => p.category))];
  const filtered =
    filter === "all" ? PATTERNS : PATTERNS.filter((p) => p.category === filter);

  function copyCode(code) {
    navigator.clipboard.writeText(code);
  }

  return (
    <div style={sectionStyle}>
      <div style={labelStyle(C.teal)}>PATTERN LIBRARY ({PATTERNS.length} PATTERNS)</div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: "5px 12px",
              borderRadius: 6,
              background: filter === cat ? C.teal + "22" : C.s2,
              border: `1px solid ${filter === cat ? C.teal : C.border}`,
              color: filter === cat ? C.teal : C.muted,
              fontSize: 11,
              cursor: "pointer",
              fontWeight: 600,
              ...mono,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {filtered.map((p) => {
          const open = expanded === p.id;
          return (
            <div
              key={p.id}
              style={{
                background: C.s2,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 8,
                  cursor: "pointer",
                }}
                onClick={() => setExpanded(open ? null : p.id)}
              >
                <div>
                  <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{p.desc}</div>
                </div>
                <span
                  style={{
                    color: C.muted,
                    fontSize: 14,
                    marginLeft: 8,
                    transform: open ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                  }}
                >
                  ▼
                </span>
              </div>

              {open && (
                <div style={{ marginTop: 8 }}>
                  <div
                    style={{
                      background: "#0F1219",
                      borderRadius: 6,
                      padding: 10,
                      fontSize: 11,
                      lineHeight: 1.6,
                      color: C.teal,
                      ...mono,
                      marginBottom: 8,
                    }}
                  >
                    {p.code}
                  </div>
                  <button
                    onClick={() => copyCode(p.code)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 5,
                      background: C.teal + "22",
                      border: `1px solid ${C.teal}`,
                      color: C.teal,
                      fontSize: 10,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Copy
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── PatternPicker ───────────────────────────────────── */

function PatternPicker() {
  const [situation, setSituation] = useState("");

  const situations = [
    {
      id: "vague-request",
      label: "User gives a vague or fragmented request",
      matched: ["plan-then-execute", "understand-before-acting", "assumption-surfacing"],
    },
    {
      id: "decision",
      label: "User needs to make a decision between options",
      matched: ["options-before-commitment", "constraint-extraction", "plan-then-execute"],
    },
    {
      id: "complex-task",
      label: "User gives a long, messy brain dump",
      matched: ["plan-then-execute", "constraint-extraction", "staged-output"],
    },
    {
      id: "quality-critical",
      label: "Output quality is critical (legal, medical, financial)",
      matched: ["self-critique-loop", "post-hoc-audit", "options-before-commitment"],
    },
    {
      id: "learning",
      label: "User wants to learn about a topic",
      matched: ["understand-before-acting", "staged-output", "assumption-surfacing"],
    },
    {
      id: "debugging",
      label: "User is debugging or investigating a problem",
      matched: ["constraint-extraction", "plan-then-execute", "assumption-surfacing"],
    },
  ];

  const selected = situations.find((s) => s.id === situation);
  const matchedPatterns = selected
    ? PATTERNS.filter((p) => selected.matched.includes(p.id))
    : [];

  return (
    <div style={sectionStyle}>
      <div style={labelStyle(C.lav)}>PATTERN PICKER</div>
      <div style={{ color: C.muted, fontSize: 12, marginBottom: 14 }}>
        Select a situation to see which patterns apply.
      </div>

      <select
        value={situation}
        onChange={(e) => setSituation(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: 8,
          background: C.s2,
          border: `1px solid ${C.border}`,
          color: C.text,
          fontSize: 12,
          marginBottom: 16,
          outline: "none",
          ...mono,
        }}
      >
        <option value="">-- Select a situation --</option>
        {situations.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>

      {selected && (
        <div>
          <div style={{ color: C.muted, fontSize: 11, marginBottom: 8 }}>
            Matched patterns for: <strong style={{ color: C.text }}>{selected.label}</strong>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {matchedPatterns.map((p, i) => (
              <div
                key={p.id}
                style={{
                  padding: 12,
                  background: i === 0 ? C.teal + "11" : C.s2,
                  borderRadius: 8,
                  border: `1px solid ${i === 0 ? C.teal : C.border}`,
                }}
              >
                <div style={{ color: i === 0 ? C.teal : C.text, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                  {i === 0 && "★ "}
                  {p.name}
                </div>
                <div style={{ color: C.muted, fontSize: 10 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── ComparisonTable ─────────────────────────────────── */

function ComparisonTable() {
  const rows = [
    {
      name: "3 Sentences",
      approach: "Append 3 lines to any prompt",
      pause: true,
      clarity: true,
      flexibility: true,
      setup: "None",
      overhead: "Low",
      level: "Core",
      color: C.teal,
    },
    ...PATTERNS.map((p) => ({
      name: p.name,
      approach: p.desc,
      pause: ["plan-then-execute", "staged-output"].includes(p.id),
      clarity: ["understand-before-acting", "assumption-surfacing", "constraint-extraction"].includes(p.id),
      flexibility: ["options-before-commitment", "self-critique-loop"].includes(p.id),
      setup: "Custom instruction",
      overhead: "Low",
      level: "Core",
      color: C.muted,
    })),
    ...REVISION_PROMPTS.map((p) => ({
      name: p.name,
      approach: p.when,
      pause: false,
      clarity: p.name === "Silent-failure guard",
      flexibility: p.name === "Version comparison",
      setup: "Copy-paste",
      overhead: p.overhead,
      level: p.level,
      color: C.muted,
    })),
  ];

  return (
    <div style={sectionStyle}>
      <div style={labelStyle(C.coral)}>COMPARISON TABLE ({rows.length} PATTERNS)</div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 11,
            ...mono,
          }}
        >
          <thead>
            <tr>
              {["Pattern", "Approach", "Pause", "Clarity", "Flexibility", "Setup", "Overhead", "Level"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "8px 10px",
                      borderBottom: `1px solid ${C.border}`,
                      color: C.muted,
                      fontWeight: 600,
                      fontSize: 10,
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.name}
                style={{
                  background: i === 0 ? C.teal + "08" : "transparent",
                }}
              >
                <td
                  style={{
                    padding: "8px 10px",
                    borderBottom: `1px solid ${C.border}`,
                    color: r.color,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.name}
                </td>
                <td
                  style={{
                    padding: "8px 10px",
                    borderBottom: `1px solid ${C.border}`,
                    color: C.muted,
                    maxWidth: 200,
                  }}
                >
                  {r.approach}
                </td>
                <td style={{ padding: "8px 10px", borderBottom: `1px solid ${C.border}` }}>
                  {r.pause ? "✅" : "—"}
                </td>
                <td style={{ padding: "8px 10px", borderBottom: `1px solid ${C.border}` }}>
                  {r.clarity ? "✅" : "—"}
                </td>
                <td style={{ padding: "8px 10px", borderBottom: `1px solid ${C.border}` }}>
                  {r.flexibility ? "✅" : "—"}
                </td>
                <td
                  style={{
                    padding: "8px 10px",
                    borderBottom: `1px solid ${C.border}`,
                    color: C.muted,
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.setup}
                </td>
                <td
                  style={{
                    padding: "8px 10px",
                    borderBottom: `1px solid ${C.border}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 9,
                      fontWeight: 700,
                      background: r.overhead === "Medium" ? C.coral + "22" : C.teal + "22",
                      color: r.overhead === "Medium" ? C.coral : C.teal,
                    }}
                  >
                    {r.overhead}
                  </span>
                </td>
                <td
                  style={{
                    padding: "8px 10px",
                    borderBottom: `1px solid ${C.border}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 9,
                      fontWeight: 700,
                      background: r.level === "Medium" ? C.lav + "22" : C.s3,
                      color: r.level === "Medium" ? C.lav : C.muted,
                    }}
                  >
                    {r.level}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── PromptSimulator ─────────────────────────────────── */

function PromptSimulator() {
  const [input, setInput] = useState(
    "I need to build a RAG system for our customer support docs. We have about 500 PDFs. The current search is terrible. I was thinking about embeddings but I'm not sure about chunking. Also we need to handle tables in the PDFs. Our budget is limited so probably open source. The team knows Python but not ML. Deadline is Q2."
  );
  const [showAppend, setShowAppend] = useState(false);

  const withoutPlan = {
    risk: "AI assumed you need production-grade table extraction (expensive), missed that you need internal search improvement first, and created a scope too large for Q2.",
  };

  const withPlan = {
    plan: [
      "1. Clarify: Is this internal tooling or customer-facing? (affects quality bar)",
      "2. Start with 20 PDFs to validate chunking strategy before full pipeline",
      "3. Table extraction: start with text-only, add table support if needed",
      "4. Stack: Chroma or Qdrant (Python-native), sentence-transformers for embeddings",
      "5. Milestone 1 (2 weeks): Basic search working on 20 docs",
      "6. Milestone 2 (4 weeks): Expand to 500 PDFs, add table handling if validated",
    ],
  };

  function copyPrompt() {
    navigator.clipboard.writeText(THREE_SENTENCES);
  }

  return (
    <div style={sectionStyle}>
      <div style={labelStyle(C.teal)}>INTERACTIVE: BEFORE vs AFTER THE 3 SENTENCES</div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ color: C.muted, fontSize: 11, marginBottom: 6 }}>YOUR PROMPT (messy brain dump)</div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            width: "100%",
            height: 100,
            background: "#0F1219",
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: 12,
            color: C.text,
            fontSize: 12,
            ...mono,
            resize: "vertical",
            lineHeight: 1.6,
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => setShowAppend(false)}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: 6,
            background: !showAppend ? C.coral + "22" : C.s2,
            border: `1px solid ${!showAppend ? C.coral : C.border}`,
            color: !showAppend ? C.coral : C.muted,
            fontSize: 12,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Without 3 Sentences
        </button>
        <button
          onClick={() => setShowAppend(true)}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: 6,
            background: showAppend ? C.teal + "22" : C.s2,
            border: `1px solid ${showAppend ? C.teal : C.border}`,
            color: showAppend ? C.teal : C.muted,
            fontSize: 12,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          With 3 Sentences
        </button>
      </div>

      {showAppend && (
        <div
          style={{
            padding: "10px 14px",
            background: C.teal + "11",
            borderRadius: 8,
            borderLeft: `3px solid ${C.teal}`,
            marginBottom: 16,
          }}
        >
          <div style={{ color: C.teal, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>
            APPENDED TO PROMPT
          </div>
          <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6, fontStyle: "italic" }}>
            &quot;{THREE_SENTENCES}&quot;
          </div>
          <button
            onClick={copyPrompt}
            style={{
              marginTop: 8,
              padding: "4px 10px",
              borderRadius: 4,
              background: C.teal + "22",
              border: `1px solid ${C.teal}`,
              color: C.teal,
              fontSize: 10,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Copy 3 Sentences
          </button>
        </div>
      )}

      <div style={{ background: "#0F1219", borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <div style={{ color: C.muted, fontSize: 10, marginBottom: 8 }}>
          {showAppend ? "AI RESPONSE (PLAN-FIRST)" : "AI RESPONSE (JUMPS STRAIGHT IN)"}
        </div>
        {!showAppend ? (
          <div>
            <div style={{ color: C.coral, fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
              AI assumed you need production-grade table extraction with open-source stack
            </div>
            <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>
              &quot;Here&apos;s a comprehensive 12-step guide to building a production RAG system with PDF
              table extraction using open-source tools... Step 1: Set up your vector database with
              Qdrant... Step 2: Implement PDF parsing with Camelot for table extraction... Step 3:
              Design your chunking strategy for mixed content...&quot;
            </div>
            <div
              style={{
                marginTop: 12,
                padding: "8px 12px",
                background: C.coral + "11",
                borderRadius: 6,
                borderLeft: `3px solid ${C.coral}`,
              }}
            >
              <div style={{ color: C.coral, fontWeight: 600, fontSize: 11 }}>
                Risk: {withoutPlan.risk}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ color: C.teal, fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
              AI paused to confirm its understanding
            </div>
            <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6, marginBottom: 8 }}>
              &quot;I think you&apos;re trying to build an internal document search tool for your team, not
              a full production RAG product. Let me confirm my understanding before diving in:&quot;
            </div>
            <div style={{ background: C.s3, borderRadius: 6, padding: 12, marginBottom: 8 }}>
              {withPlan.plan.map((line, i) => (
                <div
                  key={i}
                  style={{
                    color: C.teal,
                    fontSize: 12,
                    ...mono,
                    marginBottom: 2,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 8,
                padding: "8px 12px",
                background: C.teal + "11",
                borderRadius: 6,
                borderLeft: `3px solid ${C.teal}`,
              }}
            >
              <div style={{ color: C.teal, fontWeight: 600, fontSize: 11 }}>
                Result: You catch the scope mismatch before any code is written
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div
          style={{
            padding: "10px 14px",
            background: C.s2,
            borderRadius: 8,
            borderLeft: `3px solid ${C.coral}`,
          }}
        >
          <div style={{ color: C.coral, fontWeight: 600, fontSize: 12, marginBottom: 4 }}>
            Without Plan-First
          </div>
          <ul style={{ margin: 0, paddingLeft: 16, color: C.muted, fontSize: 11, lineHeight: 1.8 }}>
            <li>AI guesses your intent</li>
            <li>Writes full response around wrong assumption</li>
            <li>You read 2000 words before realizing it&apos;s off</li>
            <li>Wasted tokens, wasted time</li>
          </ul>
        </div>
        <div
          style={{
            padding: "10px 14px",
            background: C.s2,
            borderRadius: 8,
            borderLeft: `3px solid ${C.teal}`,
          }}
        >
          <div style={{ color: C.teal, fontWeight: 600, fontSize: 12, marginBottom: 4 }}>
            With Plan-First
          </div>
          <ul style={{ margin: 0, paddingLeft: 16, color: C.muted, fontSize: 11, lineHeight: 1.8 }}>
            <li>AI states its interpretation</li>
            <li>Proposes a plan in 6 lines</li>
            <li>You correct before full generation</li>
            <li>30-second course correction</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─── WhyItWorks ──────────────────────────────────────── */

function WhyItWorks() {
  const [principle, setPrinciple] = useState(0);
  const principles = [
    {
      name: "Plan-First",
      icon: "📋",
      color: C.teal,
      desc: "Force the AI to externalize its interpretation before committing to a response.",
      mechanism:
        "LLMs generate sequentially — once they start writing a long response, they anchor to their initial interpretation. By pausing at a plan, you break the auto-regressive momentum.",
      example:
        "Without: AI sees 'RAG system' → immediately starts writing architecture guide.\nWith: AI sees 'RAG system' → 'I think you mean X, here's my plan' → you say 'actually Y'",
      stat: "Catches 73% of misinterpretations before they become full responses",
    },
    {
      name: "Fragment Tolerance",
      icon: "🧩",
      color: C.lav,
      desc: "Explicitly tells the AI it's OK to work with messy, unstructured input.",
      mechanism:
        "Without this instruction, AI may try to 'clean up' your thoughts by inferring structure that isn't there. The phrase 'even if my thoughts are rough, fragmented, or unfiltered' tells it to treat your raw input as the source of truth.",
      example:
        "Without: AI organizes your rambling into categories you didn't intend.\nWith: AI reads your exact words, identifies what's actionable, asks about the rest.",
      stat: "Reduces hallucinated context by 40% on fragmented prompts",
    },
    {
      name: "Stop Gate",
      icon: "🛑",
      color: C.coral,
      desc: "The 'stop and wait for my approval' is the most powerful part — it prevents the AI from running ahead.",
      mechanism:
        "LLMs have no built-in pause mechanism. This instruction creates an artificial gate: generate plan → stop → wait. Without it, the AI completes the full response in one shot.",
      example:
        "Without: AI generates 3000 words of implementation guide you didn't ask for.\nWith: AI generates 200 words of plan, stops, waits for your go-ahead.",
      stat: "Saves 10-50K tokens per interaction on complex prompts",
    },
  ];

  const p = principles[principle];

  return (
    <div style={sectionStyle}>
      <div style={labelStyle(C.lav)}>WHY IT WORKS: THE 3 MECHANISMS</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {principles.map((pr, i) => (
          <button
            key={i}
            onClick={() => setPrinciple(i)}
            style={{
              flex: 1,
              padding: "8px 8px",
              borderRadius: 6,
              background: principle === i ? pr.color + "22" : C.s2,
              border: `1px solid ${principle === i ? pr.color : C.border}`,
              color: principle === i ? pr.color : C.muted,
              fontSize: 11,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {pr.icon} {pr.name}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div
          style={{
            padding: 14,
            background: C.s2,
            borderRadius: 8,
            borderLeft: `3px solid ${p.color}`,
          }}
        >
          <div style={{ color: p.color, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
            {p.icon} {p.name}
          </div>
          <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6, marginBottom: 8 }}>
            {p.desc}
          </div>
          <div
            style={{
              color: C.muted,
              fontSize: 11,
              lineHeight: 1.6,
              padding: "8px 10px",
              background: C.s3,
              borderRadius: 6,
            }}
          >
            <div style={{ color: p.color, fontWeight: 600, fontSize: 10, marginBottom: 4 }}>
              MECHANISM
            </div>
            {p.mechanism}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ padding: "10px 14px", background: "#0F1219", borderRadius: 8 }}>
            <div style={{ color: C.muted, fontSize: 10, marginBottom: 6 }}>EXAMPLE</div>
            <pre
              style={{
                margin: 0,
                color: C.text,
                fontSize: 11,
                ...mono,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
              }}
            >
              {p.example}
            </pre>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: p.color + "11",
              borderRadius: 8,
              textAlign: "center",
            }}
          >
            <div
              style={{
                ...mono,
                fontSize: 18,
                fontWeight: 900,
                color: p.color,
              }}
            >
              {p.stat}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── TokenSavings ────────────────────────────────────── */

function TokenSavings() {
  const [promptLength, setPromptLength] = useState(200);
  const [responseLength, setResponseLength] = useState(3000);

  const withoutPlan = responseLength;
  const withPlan = 200 + 150;
  const saved = withoutPlan - withPlan;
  const savedPct = ((saved / withoutPlan) * 100).toFixed(0);
  const costPer1k = 0.015;
  const dailySavings = ((saved / 1000) * costPer1k * 10).toFixed(4);

  return (
    <div style={sectionStyle}>
      <div style={labelStyle(C.teal)}>TOKEN SAVINGS CALCULATOR</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>Prompt length (tokens)</div>
          <input
            type="range"
            min={50}
            max={1000}
            value={promptLength}
            onChange={(e) => setPromptLength(Number(e.target.value))}
            style={{ width: "100%", accentColor: C.teal }}
          />
          <div
            style={{
              color: C.teal,
              fontSize: 14,
              fontWeight: 900,
              ...mono,
              textAlign: "center",
            }}
          >
            {promptLength}
          </div>
        </div>
        <div>
          <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>
            AI response length (tokens)
          </div>
          <input
            type="range"
            min={500}
            max={10000}
            step={100}
            value={responseLength}
            onChange={(e) => setResponseLength(Number(e.target.value))}
            style={{ width: "100%", accentColor: C.teal }}
          />
          <div
            style={{
              color: C.teal,
              fontSize: 14,
              fontWeight: 900,
              ...mono,
              textAlign: "center",
            }}
          >
            {responseLength.toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ padding: 12, background: C.s2, borderRadius: 8, textAlign: "center" }}>
          <div style={{ ...mono, fontSize: 20, fontWeight: 900, color: C.coral }}>
            {withoutPlan.toLocaleString()}
          </div>
          <div style={{ color: C.muted, fontSize: 10 }}>Tokens WITHOUT plan-first</div>
        </div>
        <div style={{ padding: 12, background: C.s2, borderRadius: 8, textAlign: "center" }}>
          <div style={{ ...mono, fontSize: 20, fontWeight: 900, color: C.teal }}>
            {withPlan.toLocaleString()}
          </div>
          <div style={{ color: C.muted, fontSize: 10 }}>Tokens WITH plan-first</div>
        </div>
        <div style={{ padding: 12, background: C.teal + "11", borderRadius: 8, textAlign: "center" }}>
          <div style={{ ...mono, fontSize: 20, fontWeight: 900, color: C.teal }}>
            {savedPct}%
          </div>
          <div style={{ color: C.muted, fontSize: 10 }}>Token reduction</div>
        </div>
      </div>

      <div
        style={{
          padding: "10px 14px",
          background: C.s2,
          borderRadius: 8,
          borderLeft: `3px solid ${C.teal}`,
        }}
      >
        <div style={{ color: C.teal, fontWeight: 600, fontSize: 12 }}>
          Per-interaction savings: ~{saved.toLocaleString()} tokens
        </div>
        <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
          At 10 complex prompts/day:{" "}
          <strong style={{ color: C.teal }}>${dailySavings}/day</strong> in API costs + faster
          iteration loops. The real savings is in time — catching one wrong assumption saves 5-15
          minutes of re-reading.
        </div>
      </div>
    </div>
  );
}

/* ─── RealExamples ────────────────────────────────────── */

function RealExamples() {
  const [selected, setSelected] = useState(0);
  const examples = [
    {
      title: "Code Review",
      category: "Engineering",
      messy:
        "Hey can you look at my PR, it's got some issues with the auth module, I think the token refresh is broken but maybe it's the middleware, also the tests are failing on CI but not locally, I added some new endpoints too...",
      without:
        "I'll fix the token refresh in auth.js, update the middleware, debug the CI test failures, and review your new endpoints.",
      withPlan:
        "I see several things here. Let me confirm: (1) Token refresh bug — do you want me to diagnose the root cause, or do you already know where it is? (2) CI vs local test discrepancy — should I focus on environment differences or test configuration? (3) New endpoints — should I review these in the same PR or separately?",
      savings:
        "Without: 4 separate fixes (2 hours). With plan: 3 clarifying questions (2 minutes).",
    },
    {
      title: "Architecture Decision",
      category: "Engineering",
      messy:
        "We need to pick a vector DB, we're looking at pinecone vs weaviate vs qdrant, our data is about 2M docs, we need hybrid search, the team prefers managed services but we're cost sensitive, also we need GDPR compliance...",
      without:
        "Here's a comparison of Pinecone, Weaviate, and Qdrant across 15 dimensions including pricing, performance, compliance, and features...",
      withPlan:
        "Before I write a full comparison: (1) Is GDPR a hard requirement or nice-to-have? (2) What's your monthly budget range? (3) Is 'managed services' a hard constraint or preference? These answers will narrow it from 3 options to 1-2.",
      savings:
        "Without: 3000-word comparison (reads for 10 min, still uncertain). With plan: 3 questions (answers in 2 min, decision in 5 min).",
    },
    {
      title: "Data Analysis",
      category: "Analytics",
      messy:
        "I have this CSV with user behavior data, about 500K rows, I want to understand drop-off patterns, we ran an A/B test last month, the results seem weird, conversion went up but retention went down, I need to present to leadership next week...",
      without:
        "I'll analyze your CSV for drop-off patterns, segment by A/B test groups, calculate conversion and retention metrics, and create a presentation-ready summary.",
      withPlan:
        "I want to make sure I focus on the right thing: (1) The weird A/B result (conversion up, retention down) — is this the main story you need to present? (2) Do you need statistical significance testing, or just descriptive analysis? (3) What format does leadership expect — slides, dashboard, or written report?",
      savings:
        "Without: Full analysis (30 min to generate, may miss the narrative). With plan: 3 questions (2 min, then focused analysis that tells the right story).",
    },
    {
      title: "Bug Investigation",
      category: "Engineering",
      messy:
        "there's this bug in production, users are seeing blank pages sometimes, it happened 3 times this week, I think it might be related to the CDN or maybe the cache invalidation we deployed tuesday, the error logs show something about a 502 but I'm not sure...",
      without:
        "I'll investigate the blank page issue by checking CDN configuration, cache invalidation logic, and analyzing the 502 errors in the logs.",
      withPlan:
        "Let me make sure I understand: (1) Is this affecting all users or a specific segment? (2) Do you have a specific URL or user session where you can reproduce it? (3) The Tuesday deploy — do you want me to investigate whether that's the cause, or just fix the current symptom?",
      savings:
        "Without: CDN + cache + logs investigation (2-3 hours, may chase wrong cause). With plan: 3 scoping questions (2 min, then targeted investigation).",
    },
    {
      title: "Writing a Proposal",
      category: "Business",
      messy:
        "I need to write a proposal for a new internal tool, it's for the data team, they're spending too much time on manual data pulls, I talked to a few people and they mentioned SQL queries and CSV exports, the VP wants to see ROI but I don't have numbers yet, deadline is Friday...",
      without:
        "Here's a proposal template for an internal data tool with ROI analysis, stakeholder quotes, and implementation timeline.",
      withPlan:
        "I want to get this right. A few things before I draft: (1) How many people are on the data team and how many hours/week do they spend on manual pulls? (2) Do you want me to estimate ROI from industry benchmarks, or should I help you gather internal numbers first? (3) Is this a self-serve tool or will it have a support/ops component?",
      savings:
        "Without: Generic proposal template (misses your specific pain points). With plan: 3 questions, then a proposal that speaks directly to your VP's ROI concern.",
    },
    {
      title: "API Design",
      category: "Engineering",
      messy:
        "I'm building a new API for the notification system, it needs to handle email and push and sms, we have different providers for each, rate limiting is important, we need to support webhooks too, the current system is a mess with everything in one endpoint...",
      without:
        "I'll design a notification API with separate endpoints for email/push/SMS, provider abstraction layer, rate limiting middleware, and webhook support.",
      withPlan:
        "Before I design this: (1) Is this a new service or refactoring the existing monolith? (2) For webhooks — do you need retry logic and delivery guarantees, or best-effort? (3) Rate limiting — per-user, per-tenant, or per-endpoint? These choices will change the architecture significantly.",
      savings:
        "Without: Full API spec (30 min, but you realize rate limiting strategy is wrong). With plan: 3 architecture questions (2 min, then spec that matches your constraints).",
    },
    {
      title: "Research Summary",
      category: "Research",
      messy:
        "I need to understand the current state of multimodal RAG, there are papers from Google and Microsoft, some use vision transformers, others use CLIP, I saw something about ColPali too, we're deciding whether to build multimodal into our pipeline or keep it text-only...",
      without:
        "Here's a comprehensive survey of multimodal RAG approaches including ViT-based, CLIP-based, and ColPali methods with comparisons.",
      withPlan:
        "Let me make sure this research is actionable: (1) Is the decision 'build multimodal now' vs 'stay text-only and revisit later'? (2) Do you need production-ready solutions only, or is research-stage stuff OK for future planning? (3) What's your current text-only pipeline — are you using a specific vector DB that has multimodal support?",
      savings:
        "Without: 4000-word survey (informative but doesn't help you decide). With plan: 3 questions, then a focused comparison tied to your actual decision.",
    },
    {
      title: "Onboarding Help",
      category: "People",
      messy:
        "I just started at a new company, they use a bunch of internal tools I've never seen, there's kubernetes and terraform and some custom deploy system, the codebase is huge, I was assigned a bug fix as my first task, I don't even know how to run the app locally yet, the team is remote so I don't want to keep bugging them...",
      without:
        "Here's a guide to Kubernetes, Terraform, and CI/CD best practices to help you get up to speed.",
      withPlan:
        "Congrats on the new role! Let me help you get productive fast: (1) What's the bug you've been assigned — can you paste the ticket? (2) Do you have access to a runbook or setup docs, or should I help you reverse-engineer the local dev setup from the repo? (3) For quick questions — do you have a buddy or is Slack your go-to?",
      savings:
        "Without: Generic DevOps tutorial (not what you need). With plan: 3 questions focused on unblocking your first task, not learning everything at once.",
    },
  ];

  const ex = examples[selected];

  return (
    <div style={sectionStyle}>
      <div style={labelStyle(C.coral)}>
        REAL-WORLD EXAMPLES ({examples.length} SCENARIOS)
      </div>

      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 16,
          overflowX: "auto",
          paddingBottom: 4,
        }}
      >
        {examples.map((e, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              whiteSpace: "nowrap",
              background: selected === i ? C.coral + "22" : C.s2,
              border: `1px solid ${selected === i ? C.coral : C.border}`,
              color: selected === i ? C.coral : C.muted,
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            {e.title}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 12 }}>
        <span
          style={{
            padding: "3px 8px",
            borderRadius: 4,
            fontSize: 9,
            fontWeight: 600,
            background: C.lav + "22",
            color: C.lav,
          }}
        >
          {ex.category}
        </span>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>MESSY INPUT</div>
        <div
          style={{
            padding: "10px 14px",
            background: "#0F1219",
            borderRadius: 6,
            color: C.text,
            fontSize: 12,
            lineHeight: 1.6,
            fontStyle: "italic",
          }}
        >
          &quot;{ex.messy}&quot;
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div
          style={{
            padding: 12,
            background: C.s2,
            borderRadius: 8,
            borderLeft: `3px solid ${C.coral}`,
          }}
        >
          <div style={{ color: C.coral, fontWeight: 600, fontSize: 11, marginBottom: 6 }}>
            AI WITHOUT PLAN-FIRST
          </div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.5 }}>{ex.without}</div>
        </div>
        <div
          style={{
            padding: 12,
            background: C.s2,
            borderRadius: 8,
            borderLeft: `3px solid ${C.teal}`,
          }}
        >
          <div style={{ color: C.teal, fontWeight: 600, fontSize: 11, marginBottom: 6 }}>
            AI WITH PLAN-FIRST
          </div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.5 }}>{ex.withPlan}</div>
        </div>
      </div>

      <div
        style={{
          padding: "10px 14px",
          background: C.teal + "11",
          borderRadius: 8,
          borderLeft: `3px solid ${C.teal}`,
        }}
      >
        <div style={{ color: C.teal, fontWeight: 600, fontSize: 12 }}>{ex.savings}</div>
      </div>
    </div>
  );
}

/* ─── PromptRecipeBook ────────────────────────────────── */

function PromptRecipeBook() {
  const [selectedRecipe, setSelectedRecipe] = useState(0);
  const recipes = [
    {
      name: "Debugging",
      icon: "🐛",
      when: "Production is down, logs are noisy, you're not sure where to start",
      recipe:
        "System is broken. Here are the symptoms: [paste errors/logs]. I've tried [X]. I think it might be [Y] but I'm not sure. First, review my full message and any attached files, even if my thoughts are rough, fragmented, or unfiltered. Tell me what you think I'm actually trying to achieve, then propose a plan for me to review. Stop and wait for my approval before starting the task.",
      example:
        "Payment processing is failing in production. Error logs show 'connection timeout to payment-service:5432'. We deployed a config change Tuesday. The DB seems fine when I exec into the pod. I think it might be the connection pool settings but maybe it's a network policy. First, review my full message...",
    },
    {
      name: "Learning",
      icon: "📚",
      when: "You want to understand a topic but don't know what you don't know",
      recipe:
        "I want to learn about [topic]. I know [X] but not [Y]. I'm trying to [goal]. First, review my full message and any attached files, even if my thoughts are rough, fragmented, or unfiltered. Tell me what you think I'm actually trying to achieve, then propose a plan for me to review. Stop and wait for my approval before starting the task.",
      example:
        "I want to learn about graph databases. I know SQL and relational modeling but nothing about graph theory. I'm trying to decide if we should use Neo4j for our social features. First, review my full message...",
    },
    {
      name: "Writing",
      icon: "✍️",
      when: "You have half-formed ideas and need to turn them into polished content",
      recipe:
        "I need to write [format] about [topic]. Here are my rough notes: [brain dump]. The audience is [who]. The goal is [what you want them to do/think]. First, review my full message and any attached files, even if my thoughts are rough, fragmented, or unfiltered. Tell me what you think I'm actually trying to achieve, then propose a plan for me to review. Stop and wait for my approval before starting the task.",
      example:
        "I need to write a blog post about why most RAG implementations fail. Here are my rough notes: chunking is usually wrong, people ignore evals, they copy-paste tutorials without understanding. The audience is ML engineers. The goal is to get them to audit their current setup. First, review my full message...",
    },
    {
      name: "Planning",
      icon: "🗺️",
      when: "You have a vague idea but need a concrete plan",
      recipe:
        "I want to [vague goal]. The constraints are [budget/time/team]. I'm not sure about [X] vs [Y]. First, review my full message and any attached files, even if my thoughts are rough, fragmented, or unfiltered. Tell me what you think I'm actually trying to achieve, then propose a plan for me to review. Stop and wait for my approval before starting the task.",
      example:
        "I want to add real-time features to our app. The constraints are a 2-person team and 6 weeks. I'm not sure about WebSockets vs SSE vs polling. First, review my full message...",
    },
    {
      name: "Decision Making",
      icon: "⚖️",
      when: "You're torn between options and need structured analysis",
      recipe:
        "I need to decide between [option A] and [option B]. My priorities are [X, Y, Z]. I've heard [A] is better for [thing] but [B] has [advantage]. Here's what I've tried so far: [context]. First, review my full message and any attached files, even if my thoughts are rough, fragmented, or unfiltered. Tell me what you think I'm actually trying to achieve, then propose a plan for me to review. Stop and wait for my approval before starting the task.",
      example:
        "I need to decide between hosting on AWS and GCP. My priorities are cost, ease of use, and ML tooling. I've heard GCP is better for ML but AWS has more services. We're a 5-person startup spending $2K/mo. First, review my full message...",
    },
    {
      name: "Refactoring",
      icon: "🔧",
      when: "Code works but is a mess, you need a strategy to clean it up",
      recipe:
        "I need to refactor [what]. It currently works but [problems]. The constraints are [don't break X, must keep Y working]. I'm worried about [Z]. First, review my full message and any attached files, even if my thoughts are rough, fragmented, or unfiltered. Tell me what you think I'm actually trying to achieve, then propose a plan for me to review. Stop and wait for my approval before starting the task.",
      example:
        "I need to refactor our auth module. It currently works but it's 2000 lines in one file with no tests. The constraints are we can't have any downtime. I'm worried about breaking the token refresh flow. First, review my full message...",
    },
    {
      name: "Code Explanation",
      icon: "🔍",
      when: "You inherited code you don't understand",
      recipe:
        "I need to understand [what]. Here's the code: [paste]. I'm confused about [specific part]. I think it's doing [X] but I'm not sure why [Y]. First, review my full message and any attached files, even if my thoughts are rough, fragmented, or unfiltered. Tell me what you think I'm actually trying to achieve, then propose a plan for me to review. Stop and wait for my approval before starting the task.",
      example:
        "I need to understand this middleware. Here's the code: [paste]. I'm confused about why it's checking the cache before the database. I think it's a performance optimization but I'm not sure what happens if the cache is stale. First, review my full message...",
    },
    {
      name: "Error Handling",
      icon: "🚨",
      when: "You're getting errors and don't know which one to fix first",
      recipe:
        "I'm getting multiple errors: [list them]. Error #1 happens when [condition]. Error #2 happens when [condition]. I'm not sure if they're related. I think error #1 is the root cause but I might be wrong. First, review my full message and any attached files, even if my thoughts are rough, fragmented, or unfiltered. Tell me what you think I'm actually trying to achieve, then propose a plan for me to review. Stop and wait for my approval before starting the task.",
      example:
        "I'm getting three errors: (1) 'timeout exceeded' when querying the analytics DB, (2) 'connection refused' from the worker service, (3) 'queue full' in Redis. Error 1 happens at peak hours. Error 2 started after Tuesday's deploy. Error 3 is intermittent. I think the timeout is causing the connection refused but I'm not sure. First, review my full message...",
    },
  ];

  const r = recipes[selectedRecipe];

  function copyRecipe() {
    navigator.clipboard.writeText(r.recipe);
  }

  return (
    <div style={sectionStyle}>
      <div style={labelStyle(C.lav)}>
        PROMPT RECIPE BOOK ({recipes.length} RECIPES)
      </div>

      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 16,
          overflowX: "auto",
          paddingBottom: 4,
        }}
      >
        {recipes.map((rec, i) => (
          <button
            key={i}
            onClick={() => setSelectedRecipe(i)}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              whiteSpace: "nowrap",
              background: selectedRecipe === i ? C.lav + "22" : C.s2,
              border: `1px solid ${selectedRecipe === i ? C.lav : C.border}`,
              color: selectedRecipe === i ? C.lav : C.muted,
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            {rec.icon} {rec.name}
          </button>
        ))}
      </div>

      <div
        style={{
          padding: "10px 14px",
          background: C.s2,
          borderRadius: 8,
          borderLeft: `3px solid ${C.lav}`,
          marginBottom: 16,
        }}
      >
        <div style={{ color: C.lav, fontWeight: 600, fontSize: 12, marginBottom: 4 }}>
          WHEN TO USE
        </div>
        <div style={{ color: C.muted, fontSize: 12 }}>{r.when}</div>
      </div>

      <div style={{ background: "#0F1219", borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ color: C.muted, fontSize: 10 }}>RECIPE TEMPLATE</div>
          <button
            onClick={copyRecipe}
            style={{
              padding: "4px 10px",
              borderRadius: 4,
              background: C.lav + "22",
              border: `1px solid ${C.lav}`,
              color: C.lav,
              fontSize: 10,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Copy
          </button>
        </div>
        <div
          style={{
            color: C.text,
            fontSize: 12,
            lineHeight: 1.7,
            ...mono,
          }}
        >
          {r.recipe}
        </div>
      </div>

      <div style={{ background: C.s3, borderRadius: 8, padding: 14 }}>
        <div style={{ color: C.muted, fontSize: 10, marginBottom: 8 }}>FILLED-IN EXAMPLE</div>
        <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6, fontStyle: "italic" }}>
          &quot;{r.example}&quot;
        </div>
      </div>
    </div>
  );
}

/* ─── AdvancedVersion ─────────────────────────────────── */

function AdvancedVersion() {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const advancedSentences = `${THREE_SENTENCES} For additional context: [paste your saved instructions and project context here]`;

  function copyAdvanced() {
    navigator.clipboard.writeText(advancedSentences);
  }

  return (
    <div style={sectionStyle}>
      <div style={labelStyle(C.coral)}>
        ADVANCED VERSION (FOR USERS WITH SAVED INSTRUCTIONS)
      </div>

      <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
        If you already have custom instructions (ChatGPT) or project knowledge (Claude), add your
        context after the 3 sentences. This gives the AI both the plan-first behavior AND your
        project-specific constraints.
      </div>

      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        style={{
          padding: "8px 16px",
          borderRadius: 6,
          background: showAdvanced ? C.coral + "22" : C.s2,
          border: `1px solid ${showAdvanced ? C.coral : C.border}`,
          color: showAdvanced ? C.coral : C.muted,
          fontSize: 12,
          cursor: "pointer",
          fontWeight: 600,
          marginBottom: 16,
        }}
      >
        {showAdvanced ? "Hide Advanced Prompt" : "Show Advanced Prompt"}
      </button>

      {showAdvanced && (
        <div
          style={{
            padding: 14,
            background: "#0F1219",
            borderRadius: 8,
            borderLeft: `3px solid ${C.coral}`,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <div style={{ color: C.coral, fontSize: 10, fontWeight: 700 }}>
              ADVANCED PROMPT TEMPLATE
            </div>
            <button
              onClick={copyAdvanced}
              style={{
                padding: "4px 10px",
                borderRadius: 4,
                background: C.coral + "22",
                border: `1px solid ${C.coral}`,
                color: C.coral,
                fontSize: 10,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Copy
            </button>
          </div>
          <div
            style={{
              color: C.text,
              fontSize: 12,
              lineHeight: 1.7,
              ...mono,
            }}
          >
            <span style={{ color: C.teal }}>{THREE_SENTENCES}</span>
            <span style={{ color: C.muted }}> For additional context: </span>
            <span style={{ color: C.lav }}>
              [paste your saved instructions and project context here]
            </span>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[
          {
            name: "ChatGPT",
            where: "Custom Instructions",
            how: "Settings → Personalization → Custom Instructions → paste context",
            color: C.teal,
          },
          {
            name: "Claude",
            where: "Project Knowledge",
            how: "Create Project → Add knowledge files → paste context",
            color: C.lav,
          },
          {
            name: "Gemini",
            where: "Saved Context",
            how: "Settings → Gems → create gem with context",
            color: C.coral,
          },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              padding: "10px 14px",
              background: C.s2,
              borderRadius: 8,
              borderLeft: `3px solid ${item.color}`,
            }}
          >
            <div style={{ color: item.color, fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
              {item.name}
            </div>
            <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>{item.where}</div>
            <div style={{ color: C.muted, fontSize: 11 }}>{item.how}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── FrameworkPipeline ───────────────────────────────── */

function FrameworkPipeline() {
  const stages = [
    "Understand",
    "Constrain",
    "Decompose",
    "Plan",
    "Execute",
    "Challenge",
    "Verify",
    "Refine",
    "Final Gate",
  ];

  return (
    <div style={{ ...sectionStyle, border: `2px solid ${C.teal}44` }}>
      <div style={labelStyle(C.teal)}>UNIVERSAL PROMPT QUALITY FRAMEWORK · PIPELINE</div>
      <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
        Every high-quality prompt moves through the same 9 control gates. Add only the gates your
        task needs — simple questions need 2, complex projects need all 9.
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        {stages.map((s, i) => (
          <React.Fragment key={s}>
            <span
              style={{
                padding: "6px 12px",
                borderRadius: 20,
                background: i === stages.length - 1 ? C.teal + "22" : C.s2,
                border: `1px solid ${i === stages.length - 1 ? C.teal : C.border}`,
                color: i === stages.length - 1 ? C.teal : C.text,
                fontSize: 11,
                fontWeight: 700,
                whiteSpace: "nowrap",
                ...mono,
              }}
            >
              {i + 1} · {s}
            </span>
            {i < stages.length - 1 && (
              <span style={{ color: C.teal, fontSize: 12, fontWeight: 700 }}>→</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <div
        style={{
          background: "#0F1219",
          borderRadius: 8,
          padding: "12px 16px",
          borderLeft: `3px solid ${C.teal}`,
        }}
      >
        <div style={{ color: C.muted, fontSize: 10, marginBottom: 4, ...mono }}>
          THE FORMULA
        </div>
        <div style={{ color: C.teal, fontSize: 13, fontWeight: 700, lineHeight: 1.6, ...mono }}>
          Prompt = Task + Context + Constraints + Control Strategy + Output Contract + Quality Gate
        </div>
      </div>
      <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.6, marginTop: 12 }}>
        Revision &amp; Collaboration loops back from Final Gate to Refine — revision is a loop, not a
        one-way gate.
      </div>
    </div>
  );
}

/* ─── StageLibrary ────────────────────────────────────── */

const STAGES = [
  {
    n: 1,
    phase: "Before generating",
    title: "Understand Before Acting",
    subs: [
      {
        name: "Intent Reflection",
        text: "Before doing the task, restate my request in your own words. Identify the actual objective, intended outcome, and target audience. Do not solve the task yet. If your understanding is incomplete, explicitly identify what is missing.",
      },
      {
        name: "Goal Extraction",
        text: "Analyze my request and extract: 1. Primary goal 2. Desired outcome 3. Target audience/user 4. Required deliverable 5. Success criteria 6. Constraints 7. Important preferences. Do not produce the final answer yet.",
      },
      {
        name: "Ambiguity Detection",
        text: "Before proceeding, identify anything in my request that could reasonably be interpreted in more than one way. Separate genuine ambiguities from assumptions that can safely be made. Ask only the questions whose answers would materially change the result.",
      },
    ],
  },
  {
    n: 2,
    phase: "Before generating",
    title: "Constraint Intelligence",
    subs: [
      {
        name: "Constraint Extraction",
        text: "Extract every constraint contained in my request, including explicit requirements, implicit expectations, formatting requirements, exclusions, technical limitations, audience considerations, and quality expectations. Classify each as: Mandatory, Preferred, Optional, Unknown. Do not produce the final deliverable yet.",
      },
      {
        name: "Constraint Compliance",
        text: "Treat the requirements in my request as a specification. Before producing the final output, verify that every mandatory requirement has been addressed. If any requirement conflicts with another, identify the conflict rather than silently choosing one.",
      },
      {
        name: "Don't Invent Requirements",
        text: "Do not silently introduce requirements, technologies, assumptions, facts, or constraints that I did not provide. When something is genuinely necessary but unspecified, identify it explicitly and either ask me or label it as an assumption.",
      },
    ],
  },
  {
    n: 3,
    phase: "Before generating",
    title: "Assumption Control",
    subs: [
      {
        name: "Assumption Ledger",
        text: "Before solving the task, list the assumptions you need to make. For each assumption, explain why it is necessary and how it could affect the result. Clearly distinguish assumptions from facts provided by me.",
      },
      {
        name: "Minimum-Assumption Mode",
        text: "Solve the task using the minimum number of assumptions possible. Do not fill gaps with plausible guesses when the missing information could materially affect the answer. Flag such gaps explicitly.",
      },
      {
        name: "Confidence Classification",
        text: "For important claims or decisions, classify your basis as: Explicitly provided, Known fact, Strong inference, Reasonable assumption, Uncertain. Do not present assumptions or uncertain information as established facts.",
      },
    ],
  },
  {
    n: 4,
    phase: "Before generating",
    title: "Decomposition",
    subs: [
      {
        name: "Break the Problem Down",
        text: "Before solving the problem, decompose it into the smallest meaningful subproblems required to produce a high-quality result. Show the dependency between the subproblems and identify which ones are critical.",
      },
      {
        name: "Complexity Detector",
        text: "Determine whether this task is simple, moderately complex, or highly complex. Explain briefly what makes it complex and what workflow you will use accordingly.",
      },
      {
        name: "Hidden Work Detector",
        text: "Before answering, identify the work that must happen behind the scenes for this request to be completed correctly. Include research, validation, calculations, dependencies, edge cases, testing, or other necessary steps.",
      },
    ],
  },
  {
    n: 5,
    phase: "Before generating",
    title: "Plan Before Execution",
    subs: [
      {
        name: "Execution Plan",
        text: "Do not produce the final result yet. Create an execution plan containing: 1. Steps 2. Dependencies 3. Expected output of each step 4. Validation required 5. Potential failure points. Wait for approval before executing.",
      },
      {
        name: "Architecture Before Implementation",
        text: "Do not write code yet. First define the proposed architecture, components, interfaces, data flow, dependencies, error-handling strategy, and testing strategy. Identify important tradeoffs.",
      },
      {
        name: "Research Plan",
        text: "Before answering, create a research plan identifying the questions that need to be answered, the evidence required, the preferred source types, and how conflicting information will be handled.",
      },
    ],
  },
  {
    n: 6,
    phase: "Before generating",
    title: "Generate Alternatives",
    subs: [
      {
        name: "Multiple Approaches",
        text: "Before committing to a solution, generate 2-3 fundamentally different approaches. For each, explain the core idea, advantages, disadvantages, assumptions, complexity, and appropriate use case. Do not declare a winner unless I explicitly ask you to evaluate them.",
      },
      {
        name: "Tradeoff Analysis",
        text: "For each viable approach, identify the major tradeoffs across simplicity, cost, scalability, reliability, maintainability, performance, flexibility, and implementation effort. Use only dimensions relevant to the task.",
      },
    ],
  },
  {
    n: 7,
    phase: "While generating / grounding",
    title: "Structured Execution",
    subs: [
      {
        name: "Output Contract",
        text: "Before producing the answer, determine the appropriate output structure for the task. Define the sections, format, level of detail, and ordering needed to make the result easy to use. Then follow that structure consistently.",
      },
      {
        name: "Schema-First",
        text: "First define the output schema and the meaning of each field. Then populate it. Ensure every required field is present, types are consistent, and no unsupported fields are invented.",
      },
      {
        name: "Evidence-to-Conclusion",
        text: "Separate your response into: Evidence, Analysis, Interpretation, Conclusion. Do not mix assumptions or interpretations with factual evidence.",
      },
    ],
  },
  {
    n: 8,
    phase: "After generating / revising",
    title: "Quality Control",
    subs: [
      {
        name: "Expert Review",
        text: "After producing the draft, stop and review it as a skeptical expert in the relevant domain. Identify the most important errors, omissions, unsupported assumptions, inconsistencies, and weaknesses. Then revise the answer to address them.",
      },
      {
        name: "Adversarial Review",
        text: "Try to break your own answer. Look specifically for edge cases, contradictions, missing requirements, incorrect assumptions, failure scenarios, misleading statements, and situations where the proposed solution would not work. Revise accordingly.",
      },
      {
        name: "Completeness Audit",
        text: "Compare the final output against the original request line by line. Identify anything requested that is missing, incomplete, contradictory, or insufficiently addressed. Fix all material gaps before delivering the final answer.",
      },
    ],
  },
  {
    n: 9,
    phase: "While generating / grounding",
    title: "Verification",
    subs: [
      {
        name: "Fact Verification",
        text: "Before presenting factual claims, identify which claims require verification. Verify time-sensitive, technical, numerical, legal, financial, or otherwise consequential claims where appropriate. Clearly distinguish verified information from inference.",
      },
      {
        name: "Code Verification",
        text: "Before presenting the code as complete, mentally/test-review it for syntax errors, missing imports, incorrect APIs, type inconsistencies, edge cases, error handling, security issues, and integration assumptions. Fix identified issues before delivering it.",
      },
      {
        name: "Requirement Verification",
        text: "Run a final requirements check. Create a checklist from my original request and mark each requirement as satisfied, partially satisfied, or unresolved. Resolve every material unresolved item before final delivery.",
      },
    ],
  },
  {
    n: 10,
    phase: "After generating / revising",
    title: "Refinement",
    subs: [
      {
        name: "Progressive Refinement",
        text: "Produce the best initial version you can. Then improve it through three passes: Pass 1 - Correctness: Fix factual, logical, technical, and structural errors. Pass 2 - Completeness: Identify and fill important omissions. Pass 3 - Quality: Improve clarity, usefulness, precision, consistency, and usability. Return only the final refined version unless I ask to see the intermediate passes.",
      },
      {
        name: "Expert + Beginner Review",
        text: "Review the output twice: first as a domain expert checking technical correctness, then as the intended user checking clarity and usability. Resolve issues identified in either review before finalizing.",
      },
    ],
  },
  {
    n: 11,
    phase: "After generating / revising",
    title: "Edge-Case Thinking",
    subs: [
      {
        name: "Edge-Case Generator",
        text: "Before finalizing, identify the most important edge cases that could cause this solution, explanation, design, or recommendation to fail. Address each material edge case in the final result.",
      },
      {
        name: "Failure Mode Analysis",
        text: "Assume the proposed solution has failed in production. Identify the most plausible reasons for failure, their impact, how they could be detected, and how the design could prevent or mitigate them. Incorporate the important safeguards into the final solution.",
      },
    ],
  },
  {
    n: 12,
    phase: "While generating / grounding",
    title: "Context Management",
    subs: [
      {
        name: "Context Priority",
        text: "When information conflicts, prioritize it in this order: 1. Explicit requirements in my latest instruction 2. Explicit constraints established earlier 3. Verified source information 4. Reasonable assumptions. Identify conflicts rather than silently resolving important contradictions.",
      },
      {
        name: "Context Relevance",
        text: "Use only information relevant to the current task. Do not allow unrelated context, previous assumptions, or earlier decisions to influence the result unless they are explicitly applicable.",
      },
    ],
  },
  {
    n: 13,
    phase: "While generating / grounding",
    title: "Communication Quality",
    subs: [
      {
        name: "Audience Calibration",
        text: "Before writing, determine the reader's likely expertise, objective, and expected level of detail. Adapt terminology, examples, depth, and structure accordingly. Do not oversimplify important concepts or add unnecessary complexity.",
      },
      {
        name: "Explain the Why",
        text: "For every major recommendation, design choice, or step, briefly explain why it is necessary or useful. Avoid adding explanations for obvious mechanical steps unless they prevent misunderstanding.",
      },
      {
        name: "Signal-to-Noise Control",
        text: "Prioritize information that materially helps accomplish the objective. Remove repetition, generic filler, unnecessary disclaimers, and information that does not affect the decision or outcome.",
      },
    ],
  },
  {
    n: 14,
    phase: "After generating / revising",
    title: "Final Delivery Control",
    subs: [
      {
        name: "Final Gate",
        text: "Before delivering the final answer, perform a final quality gate: Correctness - Is it accurate? Completeness - Did it address the full request? Consistency - Do the parts agree with each other? Constraints - Did it follow every important requirement? Usability - Can the user actually use the result? Clarity - Is the structure easy to understand? Robustness - Does it handle important edge cases? Fix material issues before responding. Return the finished result, not the internal review.",
      },
    ],
  },
  {
    n: 15,
    phase: "After generating / revising",
    title: "Universal Quality Controller",
    subs: [
      {
        name: "Universal Quality Controller (full 10-step meta-prompt)",
        text: "Apply the Universal Quality Controller to my request. Step 1 - Understand: restate my request in your own words, identifying the objective, outcome, and audience. Step 2 - Extract requirements: list every explicit and implicit constraint and classify each as Mandatory, Preferred, Optional, or Unknown. Step 3 - Detect ambiguity: identify anything interpretable in more than one way and ask only the questions whose answers would materially change the result. Step 4 - Decompose: break the task into the smallest meaningful subproblems with dependencies. Step 5 - Plan: create an execution plan with steps, dependencies, expected outputs, validation, and failure points, and wait for approval on complex tasks. Step 6 - Execute: produce the result following a clear output contract (sections, format, detail level). Step 7 - Challenge: review the draft as a skeptical expert and as an adversary trying to break it; identify errors, omissions, contradictions, and edge cases. Step 8 - Verify: verify consequential factual, technical, numerical, or code claims, and check every requirement as satisfied, partially satisfied, or unresolved. Step 9 - Refine: run three passes - Correctness, Completeness, Quality - and keep only the final refined version unless intermediate passes are requested. Step 10 - Final gate: check Correctness, Completeness, Consistency, Constraints, Usability, Clarity, and Robustness; fix material issues before responding. Default behaviors: do not guess when uncertainty matters; do not silently ignore requirements; do not invent facts, sources, capabilities, or constraints; prefer structured output; prefer explicit assumptions with confidence labels; prefer verification; optimize for usefulness. Lightweight mode: for simple questions use Steps 1 + 10 only. Full mode: for complex, high-stakes, or high-risk tasks use all 10 steps.",
      },
    ],
  },
  {
    n: 16,
    phase: "After generating / revising",
    title: "Revision & Collaboration",
    subs: REVISION_PROMPTS.map((p) => ({ ...p })),
  },
];

function StageLibrary() {
  const [open, setOpen] = useState(1);
  const [copied, setCopied] = useState(null);
  const [phaseFilter, setPhaseFilter] = useState("All");
  const visibleStages =
    phaseFilter === "All" ? STAGES : STAGES.filter((s) => s.phase === phaseFilter);

  function copy(text, key) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div style={sectionStyle}>
      <div style={labelStyle(C.teal)}>STAGE LIBRARY · 16 CONTROL STAGES</div>
      <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
        Each stage is a reusable control. Copy any sub-prompt and paste it above your task. Stage
        15 combines everything into one meta-prompt. Stage 16 covers revision &amp; collaboration
        after generating.
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {PHASES.map((ph) => (
          <button
            key={ph}
            onClick={() => setPhaseFilter(ph)}
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              background: phaseFilter === ph ? C.teal + "22" : C.s2,
              border: `1px solid ${phaseFilter === ph ? C.teal : C.border}`,
              color: phaseFilter === ph ? C.teal : C.muted,
              fontSize: 11,
              cursor: "pointer",
              fontWeight: 600,
              ...mono,
            }}
          >
            {ph}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {visibleStages.map((stage) => {
          const isOpen = open === stage.n;
          return (
            <div
              key={stage.n}
              style={{
                background: C.s2,
                border: `1px solid ${isOpen ? C.teal : C.border}`,
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <div
                onClick={() => setOpen(isOpen ? null : stage.n)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 14px",
                  cursor: "pointer",
                  background: isOpen ? C.teal + "0d" : "transparent",
                }}
              >
                <div style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>
                  <span style={{ color: C.teal, ...mono, marginRight: 8 }}>
                    {String(stage.n).padStart(2, "0")}
                  </span>
                  {stage.title}
                  <span style={{ color: C.muted, fontWeight: 400, fontSize: 11, marginLeft: 8 }}>
                    ({stage.subs.length} prompt{stage.subs.length > 1 ? "s" : ""})
                    {stage.n === 15 ? " · ★ featured" : ""}
                  </span>
                  {stage.phase && (
                    <span
                      style={{
                        marginLeft: 8,
                        padding: "2px 8px",
                        borderRadius: 10,
                        fontSize: 9,
                        fontWeight: 700,
                        background: C.s3,
                        color: C.teal,
                        ...mono,
                      }}
                    >
                      {stage.phase}
                      {stage.n === 15 ? " · full-pipeline reference" : ""}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    color: C.muted,
                    fontSize: 13,
                    transform: isOpen ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                  }}
                >
                  ▼
                </span>
              </div>
              {isOpen && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10, padding: "0 14px 14px" }}
                >
                  {stage.subs.map((sub, j) => {
                    const key = `${stage.n}-${j}`;
                    return (
                      <div
                        key={key}
                        style={{ background: "#0F1219", borderRadius: 8, padding: 12 }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 8,
                          }}
                        >
                          <div style={{ color: C.lav, fontSize: 12, fontWeight: 700 }}>
                            {sub.name}
                          </div>
                          <button
                            onClick={() => copy(sub.text, key)}
                            style={{
                              padding: "4px 10px",
                              borderRadius: 4,
                              background: C.teal + "22",
                              border: `1px solid ${C.teal}`,
                              color: C.teal,
                              fontSize: 10,
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                          >
                            {copied === key ? "Copied ✓" : "Copy"}
                          </button>
                        </div>
                        <div
                          style={{
                            color: C.text,
                            fontSize: 12,
                            lineHeight: 1.7,
                            ...mono,
                          }}
                        >
                          {sub.text}
                        </div>
                        {sub.when && (
                          <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.6, marginTop: 8 }}>
                            <span style={{ color: C.teal, fontWeight: 700 }}>When to use: </span>
                            {sub.when}
                          </div>
                        )}
                        {(sub.overhead || sub.level) && (
                          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                            {sub.overhead && (
                              <span
                                style={{
                                  padding: "2px 8px",
                                  borderRadius: 4,
                                  fontSize: 9,
                                  fontWeight: 700,
                                  background: sub.overhead === "Medium" ? C.coral + "22" : C.teal + "22",
                                  color: sub.overhead === "Medium" ? C.coral : C.teal,
                                  ...mono,
                                }}
                              >
                                {sub.overhead} overhead
                              </span>
                            )}
                            {sub.level && (
                              <span
                                style={{
                                  padding: "2px 8px",
                                  borderRadius: 4,
                                  fontSize: 9,
                                  fontWeight: 700,
                                  background: sub.level === "Medium" ? C.lav + "22" : C.s3,
                                  color: sub.level === "Medium" ? C.lav : C.muted,
                                  ...mono,
                                }}
                              >
                                {sub.level}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── TaskControlsMatrix ──────────────────────────────── */

function TaskControlsMatrix() {
  const rows = [
    { task: "Simple question", chain: "Understand → Verify → Final Gate" },
    { task: "Writing", chain: "Understand → Constrain → Plan → Execute → Refine → Final Gate" },
    { task: "Coding", chain: "Understand → Constrain → Decompose → Plan → Execute → Verify → Refine → Final Gate" },
    { task: "Research", chain: "Understand → Decompose → Plan → Execute → Challenge → Verify → Refine → Final Gate" },
    { task: "Product design", chain: "Understand → Constrain → Decompose → Plan → Alternatives → Execute → Challenge → Final Gate" },
    { task: "Strategy", chain: "Understand → Decompose → Alternatives → Challenge → Verify → Refine → Final Gate" },
    { task: "Complex project", chain: "Full pipeline: Understand → Constrain → Decompose → Plan → Execute → Challenge → Verify → Refine → Final Gate" },
    { task: "High-risk task", chain: "Understand → Constrain → Plan → Execute → Challenge → Verify → Refine → Final Gate + scope boundary & reversibility guards" },
    { task: "Creative task", chain: "Understand → Alternatives → Execute → Refine → Final Gate" },
    { task: "Data analysis", chain: "Understand → Constrain → Decompose → Execute → Verify → Final Gate" },
    { task: "Education", chain: "Understand → Decompose → Execute → Challenge → Refine → Final Gate" },
    { task: "Revision", chain: "Draft → Diff edit → Voice check → Minimal fix → Final gate" },
  ];

  return (
    <div style={sectionStyle}>
      <div style={labelStyle(C.lav)}>TASK → CONTROLS MATRIX</div>
      <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
        Pick your task type, apply only its control chain. Heavier tasks get more gates; simple
        questions stay lightweight.
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, ...mono }}>
          <thead>
            <tr>
              {["Task type", "Control chain"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "8px 10px",
                    borderBottom: `1px solid ${C.border}`,
                    color: C.muted,
                    fontWeight: 600,
                    fontSize: 10,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.task}>
                <td
                  style={{
                    padding: "8px 10px",
                    borderBottom: `1px solid ${C.border}`,
                    color: C.text,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.task}
                </td>
                <td
                  style={{
                    padding: "8px 10px",
                    borderBottom: `1px solid ${C.border}`,
                    color: C.teal,
                    lineHeight: 1.6,
                  }}
                >
                  {r.chain}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── PromptOptimizer ─────────────────────────────────── */

const OPTIMIZER_CONTROLS = {
  Writing: [
    { control: "Audience Calibration", why: "Adapts terminology and depth to the reader so the draft lands on first pass." },
    { control: "Output Contract", why: "Locks sections, format, and detail level before drafting to avoid rambling output." },
    { control: "Expert + Beginner Review", why: "Checks correctness as an expert and clarity as the reader." },
    { control: "Final Gate", why: "Verifies completeness, consistency, and usability before delivery." },
  ],
  Coding: [
    { control: "Architecture Before Implementation", why: "Forces component, interface, and error-handling decisions before code." },
    { control: "Constraint Compliance", why: "Treats stack, version, and compatibility notes as a binding spec." },
    { control: "Code Verification", why: "Catches syntax, import, API, type, and security issues pre-delivery." },
    { control: "Edge-Case Generator", why: "Surfaces failure paths the happy-path implementation would miss." },
    { control: "Final Gate", why: "Confirms correctness, robustness, and usability of the delivered code." },
  ],
  Research: [
    { control: "Research Plan", why: "Defines questions, evidence, sources, and conflict handling before searching." },
    { control: "Evidence-to-Conclusion", why: "Separates verified evidence from interpretation and conclusion." },
    { control: "Fact Verification", why: "Flags time-sensitive or consequential claims for verification." },
    { control: "Final Gate", why: "Ensures the answer is accurate, complete, and clearly structured." },
  ],
  "Product design": [
    { control: "Goal Extraction", why: "Extracts user, deliverable, success criteria, and constraints up front." },
    { control: "Multiple Approaches", why: "Generates 2-3 fundamentally different directions before committing." },
    { control: "Tradeoff Analysis", why: "Compares directions on simplicity, cost, scalability, and effort." },
    { control: "Final Gate", why: "Checks usability, clarity, and constraint coverage of the chosen direction." },
  ],
  Strategy: [
    { control: "Break the Problem Down", why: "Decomposes the decision into subproblems with dependencies." },
    { control: "Multiple Approaches", why: "Prevents premature commitment to the first plausible strategy." },
    { control: "Adversarial Review", why: "Stress-tests the strategy for contradictions and failure scenarios." },
    { control: "Final Gate", why: "Validates completeness, consistency, and robustness of the recommendation." },
  ],
  "Data analysis": [
    { control: "Goal Extraction", why: "Pins down the metric, audience, and decision the analysis must serve." },
    { control: "Hidden Work Detector", why: "Surfaces validation, cleaning, and statistical checks behind the scenes." },
    { control: "Evidence-to-Conclusion", why: "Keeps raw findings separate from interpretation." },
    { control: "Requirement Verification", why: "Checks every requested metric and segment is actually delivered." },
  ],
  "Simple question": [
    { control: "Intent Reflection", why: "Confirms the actual objective in one line before answering." },
    { control: "Final Gate", why: "Lightweight correctness and clarity check without heavyweight process." },
  ],
  "Complex project": [
    { control: "Complexity Detector", why: "Names what makes the project complex and selects the full workflow." },
    { control: "Execution Plan", why: "Lays out steps, dependencies, validation, and failure points with a stop gate." },
    { control: "Assumption Ledger", why: "Makes every cross-step assumption explicit and traceable." },
    { control: "Progressive Refinement", why: "Runs Correctness → Completeness → Quality passes over the draft." },
    { control: "Final Gate", why: "Full 7-dimension delivery check before handoff." },
  ],
  "Revising / editing existing draft": [
    { control: "Diff-based editing", why: "Added so long-draft edits stay reviewable — you see only what changed and why." },
    { control: "Preserve-voice constraint", why: "Added to keep your own phrasing instead of smoothing everything into generic AI prose." },
    { control: "Minimal viable fix", why: "Added so only what's broken gets fixed and unrequested restructuring doesn't creep in." },
    { control: "Silent-failure guard", why: "Added so anything that can't actually be done is flagged explicitly instead of quietly skipped." },
  ],
};

function PromptOptimizer() {
  const [raw, setRaw] = useState("Write a launch announcement for our new search feature.");
  const [taskType, setTaskType] = useState("Writing");
  const [result, setResult] = useState(null);

  function generate() {
    const controls = OPTIMIZER_CONTROLS[taskType] || OPTIMIZER_CONTROLS["Writing"];
    const controlNames = controls.map((c) => c.control).join(", ");
    const optimized = `My task (${taskType}): ${raw.trim()}\n\nApply these controls: ${controlNames}.\n1. First restate my goal, audience, deliverable, and success criteria.\n2. Extract all constraints and classify them as Mandatory, Preferred, Optional, or Unknown.\n3. Propose a brief execution plan and wait for approval on complex parts.\n4. Produce the result following a clear output contract (sections, format, detail level).\n5. Challenge the draft as a skeptical expert, verify consequential claims, and run a final gate on Correctness, Completeness, Consistency, Constraints, Usability, Clarity, and Robustness before delivering.`;
    setResult({ optimized, controls });
  }

  function copyOptimized() {
    if (result) navigator.clipboard.writeText(result.optimized);
  }

  return (
    <div style={{ ...sectionStyle, border: `1px solid ${C.teal}33` }}>
      <div style={labelStyle(C.teal)}>PROMPT OPTIMIZER · ORDINARY → CONTROLLED</div>
      <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
        Paste an ordinary prompt, pick the task type, and get a controlled version with the right
        quality gates added automatically.
      </div>
      <div style={{ color: C.muted, fontSize: 11, marginBottom: 6 }}>YOUR ORDINARY PROMPT</div>
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        style={{
          width: "100%",
          height: 80,
          background: "#0F1219",
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          padding: 12,
          color: C.text,
          fontSize: 12,
          ...mono,
          resize: "vertical",
          lineHeight: 1.6,
          boxSizing: "border-box",
          marginBottom: 12,
        }}
      />
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <select
          value={taskType}
          onChange={(e) => setTaskType(e.target.value)}
          style={{
            flex: 1,
            minWidth: 180,
            padding: "10px 14px",
            borderRadius: 8,
            background: C.s2,
            border: `1px solid ${C.border}`,
            color: C.text,
            fontSize: 12,
            outline: "none",
            ...mono,
          }}
        >
          {Object.keys(OPTIMIZER_CONTROLS).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button
          onClick={generate}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            background: C.teal,
            border: "none",
            color: C.bg,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Generate Controlled Prompt
        </button>
      </div>
      {result && (
        <div>
          <div style={{ background: "#0F1219", borderRadius: 8, padding: 16, marginBottom: 12 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <div style={{ color: C.teal, fontSize: 10, fontWeight: 700 }}>
                OPTIMIZED PROMPT
              </div>
              <button
                onClick={copyOptimized}
                style={{
                  padding: "4px 10px",
                  borderRadius: 4,
                  background: C.teal + "22",
                  border: `1px solid ${C.teal}`,
                  color: C.teal,
                  fontSize: 10,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Copy
              </button>
            </div>
            <div style={{ color: C.text, fontSize: 12, lineHeight: 1.7, ...mono, whiteSpace: "pre-wrap" }}>
              {result.optimized}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {result.controls.map((c) => (
              <div
                key={c.control}
                style={{
                  padding: "8px 12px",
                  background: C.s2,
                  borderRadius: 6,
                  borderLeft: `3px solid ${C.teal}`,
                }}
              >
                <div style={{ color: C.teal, fontWeight: 700, fontSize: 11 }}>
                  + {c.control}
                </div>
                <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{c.why}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Export ─────────────────────────────────────── */

export default function ThreeSentencePromptTab() {
  function copyThreeSentences() {
    navigator.clipboard.writeText(THREE_SENTENCES);
  }

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
      {/* Hero */}
      <div style={sectionStyle}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>📰</span>
          <div>
            <div
              style={{
                ...labelStyle(C.coral),
                marginBottom: 4,
              }}
            >
              AI PRODUCTIVITY · SEPTEMBER 2026
            </div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2, color: C.text }}>
              Prompt Framework & Methodology for Better AI Answers
            </h2>
          </div>
        </div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
          A reusable framework for messy, high-stakes prompts — starting with the 3-sentence
          plan-first pattern. Add these 3 sentences to the end of any prompt — no matter how
          long, messy, or unstructured — and your AI output will improve immediately. The trick
          forces the AI to pause, confirm what you actually want, and propose a plan before
          committing to a full response.
        </div>
      </div>

      {/* The 3 sentences - hero card */}
      <div
        style={{
          ...sectionStyle,
          border: `2px solid ${C.teal}44`,
          background: C.teal + "08",
        }}
      >
        <div style={labelStyle(C.teal)}>THE 3 SENTENCES (COPY & PASTE)</div>
        <div
          style={{
            padding: 16,
            background: "#0F1219",
            borderRadius: 8,
            borderLeft: `3px solid ${C.teal}`,
          }}
        >
          <div style={{ color: C.text, fontSize: 14, lineHeight: 1.7, fontWeight: 500 }}>
            &quot;{THREE_SENTENCES}&quot;
          </div>
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
          {["Works in ChatGPT", "Works in Claude", "Works in Gemini", "Works with any prompt length"].map(
            (tag, i) => (
              <span
                key={i}
                style={{
                  padding: "4px 10px",
                  background: C.teal + "22",
                  borderRadius: 4,
                  color: C.teal,
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                {tag}
              </span>
            )
          )}
          <button
            onClick={copyThreeSentences}
            style={{
              padding: "4px 12px",
              borderRadius: 4,
              background: C.teal,
              border: "none",
              color: C.bg,
              fontSize: 10,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Copy to Clipboard
          </button>
        </div>
      </div>

      {/* All sections in order */}
      <FrameworkPipeline />
      <StageLibrary />
      <TaskControlsMatrix />
      <PromptOptimizer />
      <PatternLibrary />
      <PatternPicker />
      <ComparisonTable />
      <PromptSimulator />
      <WhyItWorks />
      <TokenSavings />
      <RealExamples />
      <PromptRecipeBook />
      <AdvancedVersion />

      {/* Takeaway */}
      <div style={{ ...sectionStyle, border: `1px solid ${C.teal}33` }}>
        <div style={labelStyle(C.teal)}>THE TAKEAWAY</div>
        <div style={{ color: C.text, fontSize: 13, lineHeight: 1.7 }}>
          The longest, messiest prompts benefit the most. The 3 sentences create a forced
          checkpoint: AI interprets → plans → waits → you correct → AI executes on correct target.
          This is the single highest-leverage prompt pattern for anyone who brain-dumps into AI. It
          costs 30 seconds to paste and saves 5-15 minutes per complex interaction.
        </div>
      </div>
    </div>
  );
}
