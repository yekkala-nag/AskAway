import React from "react";

const COLORS = {
  bg: "#080D1A",
  surface: "#0F1629",
  surface2: "#162040",
  surface3: "#1E2D52",
  border: "#243358",
  text: "#E2E8F0",
  muted: "#7A8BA8",
  amber: "#F59E0B",
  sky: "#5EC4C8",
  emerald: "#5EC4C8",
  rose: "#F43F5E",
  violet: "#A78BFA",
};

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: COLORS.surface2,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 10,
      padding: "16px",
      ...style
    }}>
      {children}
    </div>
  );
}

export default function OReillyRadar() {
  return (
    <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 28, maxWidth: 880, margin: "0 auto" }}>

      {/* Article 1: Own the Outer Loop */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "24px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>📰</span>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>Own the Outer Loop</h2>
            <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}><span style={{ color: COLORS.sky }}>Autonomous Agent Systems Guide</span></div>
          </div>
        </div>

        <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
          The inner loop (code → run → fix) is table stakes. The outer loop — the meta-loop that decides <em>what</em> to build, <em>whether</em> it works, and <em>how</em> to improve the system itself — is where leverage lives. Most teams automate the inner loop and ignore the outer one entirely.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <Card style={{ border: `1px solid ${COLORS.amber}33` }}>
            <div style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>INNER LOOP (Execution)</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: COLORS.text, lineHeight: 1.8, fontSize: 13 }}>
              <li>Write code / prompt agent</li>
              <li>Run tests / verify output</li>
              <li>Fix failures / iterate</li>
              <li>Commit when green</li>
            </ul>
            <div style={{ marginTop: 10, fontSize: 11, color: COLORS.muted }}>Automated by: CI, lint, type-check, agent loops</div>
          </Card>
          <Card style={{ border: `1px solid ${COLORS.violet}33` }}>
            <div style={{ color: COLORS.violet, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>OUTER LOOP (Meta)</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: COLORS.text, lineHeight: 1.8, fontSize: 13 }}>
              <li>Define the goal & success criteria</li>
              <li>Choose/design the inner loop</li>
              <li>Monitor: Is the loop solving the right problem?</li>
              <li>Adjust: Change tools, prompts, architecture, team</li>
              <li>Learn: Capture patterns → skills → new loops</li>
            </ul>
            <div style={{ marginTop: 10, fontSize: 11, color: COLORS.muted }}>Owned by: Humans (tech leads, architects, product)</div>
          </Card>
        </div>

        <Card style={{ border: `1px solid ${COLORS.border}` }}>
          <div style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>KEY INSIGHTS FROM THE ARTICLE</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {[
              { icon: "🎯", title: "Outer Loop = Judgment", desc: "Deciding what 'done' looks like, whether the metric is right, when to pivot. Cannot be delegated to the model." },
              { icon: "🔄", title: "Outer Loop Runs Slower", desc: "Inner loop: seconds/minutes. Outer loop: days/weeks. Different cadence, different tools, different owners." },
              { icon: "📚", title: "Skills Bridge the Loops", desc: "Outer loop captures lessons (CLAUDE.md, prompt templates, loop specs) → inner loop executes them. Skills are the interface." },
              { icon: "🛡️", title: "Verification Lives in Outer", desc: "Inner loop verifies syntax/tests. Outer loop verifies: does this solve the user problem? Is the architecture sound?" },
              { icon: "📈", title: "Compound Improvement", desc: "Each outer loop iteration improves the inner loop's prompts, tools, verifiers, skills. Exponential leverage over time." },
              { icon: "👥", title: "Team as Outer Loop", desc: "Code review, design review, retrospectives, planning — these are the human outer loop. Automate inner, elevate outer." }
            ].map((k, i) => (
              <div key={i} style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 18 }}>{k.icon}</span>
                <div>
                  <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 13 }}>{k.title}</div>
                  <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{k.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ border: `1px solid ${COLORS.emerald}33` }}>
          <div style={{ color: COLORS.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>PRACTICAL TAKEAWAYS</div>
          <ol style={{ margin: 0, paddingLeft: 18, color: COLORS.text, lineHeight: 1.9, fontSize: 13 }}>
            <li><strong>Name your outer loop.</strong> Is it a weekly planning session? A monthly architecture review? A retrospective? Make it explicit.</li>
            <li><strong>Instrument the inner loop.</strong> Track: loop duration, failure rate, token cost, verification pass rate. Feed this to the outer loop.</li>
            <li><strong>Codify outer-loop decisions as skills.</strong> When the outer loop learns "use Playwright for UI verification," write it as a skill the inner loop can invoke.</li>
            <li><strong>Protect outer-loop time.</strong> If 100% of engineering time is inner-loop execution, the system degrades. Reserve 20% for outer-loop work.</li>
            <li><strong>Build an outer-loop dashboard.</strong> Not "builds passing" — "problems solved," "skills added," "loop patterns retired," "verification coverage."</li>
          </ol>
        </Card>
      </div>

      {/* Article 2: What the Hell is a Loop Anyway? */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "24px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>📰</span>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>What the Hell Is a Loop Anyway?</h2>
            <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}><span style={{ color: COLORS.sky }}>Engineering Architecture Guide</span></div>
          </div>
        </div>

        <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
          "Loop" has become a buzzword slapped on everything from cron jobs to agent swarms. This article cuts through the noise with a precise taxonomy: what counts as a loop, what doesn't, and the six properties every production loop needs.
        </div>

        <Card style={{ border: `1px solid ${COLORS.border}` }}>
          <div style={{ color: COLORS.sky, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>THE DEFINITION</div>
          <div style={{ fontSize: 14, color: COLORS.text, fontWeight: 500, lineHeight: 1.5, marginBottom: 12, fontStyle: "italic" }}>
            "A loop is an autonomous system that repeatedly executes a unit of work, evaluates the result against a goal, and decides whether to continue, modify, or stop — without human intervention at each iteration."
          </div>
          <div style={{ color: COLORS.muted, fontSize: 12 }}>
            Three required components: <span style={{ color: COLORS.text }}>(1) Execution</span> — does the work, <span style={{ color: COLORS.text }}>(2) Evaluation</span> — measures outcome vs goal, <span style={{ color: COLORS.text }}>(3) Decision</span> — continue/modify/stop.
          </div>
        </Card>

        <div style={{ marginBottom: 16 }}>
          <div style={{ color: COLORS.sky, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 10 }}>SIX PROPERTIES OF A PRODUCTION LOOP</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {[
              { n: 1, name: "Trigger", icon: "⚡", desc: "What starts it — cron, event, webhook, schedule. Must be reliable and observable.", color: COLORS.amber },
              { n: 2, name: "Isolated Workspace", icon: "🗂", desc: "Each iteration runs in a clean environment (git worktree, container, fresh context). No state leakage.", color: COLORS.sky },
              { n: 3, name: "Skills / Context", icon: "📋", desc: "Project conventions, patterns, edge cases saved as files (CLAUDE.md). Not re-explained each run.", color: COLORS.violet },
              { n: 4, name: "Connectors (MCP)", icon: "🔌", desc: "Real tools: repo read/write, CI, issue tracker, DB. The loop touches production systems.", color: COLORS.emerald },
              { n: 5, name: "Sub-agent Roles", icon: "🤖", desc: "Separated roles so model doesn't grade its own work: explorer, implementer, verifier (separate session).", color: "#FF6B6B" },
              { n: 6, name: "Memory / State", icon: "💾", desc: "What persists: STATE.md, logs, failure patterns, vector store. A loop without memory is just spinning.", color: "#C084FC" }
            ].map(p => (
              <div key={p.n} style={{ padding: "14px", background: COLORS.surface2, borderRadius: 10, borderLeft: `3px solid ${p.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 16 }}>{p.icon}</span>
                  <div style={{ color: p.color, fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}>{p.n}. {p.name}</div>
                </div>
                <div style={{ color: COLORS.muted, fontSize: 12 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <Card style={{ border: `1px solid ${COLORS.rose}33` }}>
          <div style={{ color: COLORS.rose, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>WHAT IS NOT A LOOP (Anti-Patterns)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {[
              { name: "Cron Job", why: "Runs on schedule but has no evaluation or decision. Just executes." },
              { name: "Single Prompt", why: "One-shot generation. No iteration, no evaluation, no continuation decision." },
              { name: "Chat Session", why: "Human-in-the-loop at every step. The human is the loop, not the system." },
              { name: "Workflow/DAG", why: "Fixed graph, no runtime decision to repeat or modify based on outcome." },
              { name: "Retry Logic", why: "Repeats on failure but doesn't evaluate goal progress or modify approach." },
              { name: "Infinite While True", why: "No stop condition, no goal evaluation. A bug, not a loop." }
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px", background: COLORS.surface, borderRadius: 8, border: `1px solid ${COLORS.rose}22` }}>
                <div style={{ color: COLORS.rose, fontFamily: "monospace", fontSize: 11, fontWeight: 700, minWidth: 100 }}>{a.name}</div>
                <div style={{ color: COLORS.muted, fontSize: 12 }}>{a.why}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ border: `1px solid ${COLORS.border}` }}>
          <div style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>LOOP MATURITY MODEL (from article)</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${COLORS.border}`, color: COLORS.muted }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Level</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Evaluation</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Decision</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Example</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { l: "0", name: "Script", eval: "None", decision: "None", ex: "bash script, cron job" },
                  { l: "1", name: "Retry Loop", eval: "Pass/Fail (exit code)", decision: "Retry N times", ex: "CI re-run on flake" },
                  { l: "2", name: "Guardrail Loop", eval: "Tests + lint + typecheck", decision: "Stop on violation", ex: "Pre-commit hooks + CI" },
                  { l: "3", name: "Goal Loop", eval: "Outcome vs success criteria", decision: "Modify approach / continue", ex: "Agent fixes bug until tests pass" },
                  { l: "4", name: "Meta Loop", eval: "System-level metrics", decision: "Change loop itself", ex: "Outer loop: new skills, new verifiers" }
                ].map((m, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: '8px', color: COLORS.amber, fontFamily: 'monospace', fontWeight: 700 }}>{m.l}</td>
                    <td style={{ padding: '8px', color: COLORS.text, fontWeight: 600 }}>{m.name}</td>
                    <td style={{ padding: '8px', color: COLORS.muted, fontSize: 11 }}>{m.eval}</td>
                    <td style={{ padding: '8px', color: COLORS.muted, fontSize: 11 }}>{m.decision}</td>
                    <td style={{ padding: '8px', color: COLORS.text, fontSize: 11 }}>{m.ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Synthesis */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.amber}33`, borderRadius: 14, padding: "24px" }}>
        <div style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>SYNTHESIS: TWO ARTICLES, ONE MESSAGE</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Card style={{ border: `1px solid ${COLORS.sky}33` }}>
            <div style={{ color: COLORS.sky, fontWeight: 600, marginBottom: 8 }}>What the Hell Is a Loop?</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: COLORS.text, lineHeight: 1.8, fontSize: 13 }}>
              <li>Defines the <strong>unit</strong> (inner loop)</li>
              <li>Six required properties</li>
              <li>Maturity model (0→4)</li>
              <li>Anti-patterns to avoid</li>
            </ul>
          </Card>
          <Card style={{ border: `1px solid ${COLORS.violet}33` }}>
            <div style={{ color: COLORS.violet, fontWeight: 600, marginBottom: 8 }}>Own the Outer Loop</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: COLORS.text, lineHeight: 1.8, fontSize: 13 }}>
              <li>Defines the <strong>system</strong> (outer loop)</li>
              <li>Judgment, goals, verification</li>
              <li>Skills as the bridge</li>
              <li>Compound improvement over time</li>
            </ul>
          </Card>
        </div>
        <div style={{ marginTop: 16, padding: "16px", background: COLORS.surface2, borderRadius: 10, border: `1px solid ${COLORS.amber}33` }}>
          <div style={{ color: COLORS.amber, fontWeight: 600, marginBottom: 6 }}>🎯 The Loop Engineering Stack</div>
          <div style={{ color: COLORS.text, lineHeight: 1.8, fontSize: 13 }}>
            <strong>Level 0–1:</strong> Scripts & retries → automate the boring stuff<br/>
            <strong>Level 2:</strong> Guardrails (tests, lint, typecheck) → stop bad code from shipping<br/>
            <strong>Level 3:</strong> Goal loops (agents with verification) → autonomous problem-solving<br/>
            <strong>Level 4:</strong> Outer loop (you) → improve the loop itself: skills, verifiers, architecture, goals<br/>
            <br/>
            <span style={{ color: COLORS.sky, fontWeight: 600 }}>The lever is Level 4.</span> Most teams stop at Level 2. The organizations winning with AI are building Level 3 inner loops <em>and</em> owning Level 4 outer loops.
          </div>
        </div>
      </div>

    </div>
  );
}