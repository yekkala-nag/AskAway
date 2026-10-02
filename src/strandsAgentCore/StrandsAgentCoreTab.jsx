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

export default function StrandsAgentCoreTab() {
  return (
    <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 28, maxWidth: 880, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "24px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>📰</span>
          <div>
            <div style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>AI FIELD NOTES · JULY 2026</div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>Build and Run Your Own AI Agent in the Cloud</h2>
            <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>AWS Strands + AgentCore</div>
          </div>
        </div>
        <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.7 }}>
          Build and deploy an agent on AWS with Strands and AgentCore — from a simple model call to a production-deployed agent with long-term memory.
        </div>
      </div>

      {/* Strands vs AgentCore */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "24px" }}>
        <div style={{ color: COLORS.sky, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>STRANDS vs AGENTCORE — THE DIVISION OF LABOR</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Card style={{ borderLeft: `3px solid ${COLORS.sky}` }}>
            <div style={{ color: COLORS.sky, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Strands</div>
            <div style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>
              Open-source agent framework from AWS. Defines <strong>what</strong> the agent does.
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, color: COLORS.text, lineHeight: 1.8, fontSize: 12 }}>
              <li>LLM model selection (Claude, Nova, Ollama, etc.)</li>
              <li>System prompt / instructions</li>
              <li>Tool definitions the model can call</li>
              <li>Conversation messages + context</li>
              <li>Agent loop: request → tool → result → model</li>
            </ul>
            <div style={{ marginTop: 12, padding: "8px 10px", background: COLORS.surface, borderRadius: 6, color: COLORS.muted, fontSize: 11, fontStyle: "italic" }}>
              Think of it as the AWS equivalent of LangChain or CrewAI.
            </div>
          </Card>
          <Card style={{ borderLeft: `3px solid ${COLORS.amber}` }}>
            <div style={{ color: COLORS.amber, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>AgentCore</div>
            <div style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>
              Managed AWS services for deploying agents. Controls <strong>where and how</strong> the agent runs.
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, color: COLORS.text, lineHeight: 1.8, fontSize: 12 }}>
              <li><strong>Runtime</strong> — session-isolated environments, streaming, HTTP/MCP/A2A</li>
              <li><strong>Memory</strong> — long-term facts, preferences, summaries across sessions</li>
              <li><strong>Gateway</strong> — managed tool discovery (APIs, Lambda, MCP servers)</li>
              <li><strong>Identity</strong> — authentication + credential management</li>
              <li><strong>Observability</strong> — logs, traces, metrics to CloudWatch/X-Ray</li>
              <li><strong>Evaluations</strong> — built-in + custom behavior evaluators</li>
            </ul>
          </Card>
        </div>
        <div style={{ marginTop: 16, padding: "12px 14px", background: COLORS.surface2, borderRadius: 8, border: `1px solid ${COLORS.amber}33` }}>
          <div style={{ color: COLORS.amber, fontSize: 13, fontWeight: 600 }}>
            Key distinction: Strands controls behavior. AgentCore controls infrastructure. Deploying with AgentCore doesn't define the agent — that comes from your Strands code.
          </div>
        </div>
      </div>

      {/* AgentCore Capabilities Table */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "24px" }}>
        <div style={{ color: COLORS.violet, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>AGENTCORE CAPABILITIES</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${COLORS.border}`, color: COLORS.muted }}>
                <th style={{ textAlign: "left", padding: "8px" }}>Capability</th>
                <th style={{ textAlign: "left", padding: "8px" }}>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cap: "Runtime", purpose: "Hosts and scales agents in session-isolated environments. Supports streaming, HTTP, MCP, A2A protocols." },
                { cap: "Memory", purpose: "Stores conversation events and extracts durable facts, preferences, summaries, or episodes for use across sessions." },
                { cap: "Gateway", purpose: "Exposes APIs, Lambda functions, and MCP servers as managed tools that agents can discover and call." },
                { cap: "Identity", purpose: "Manages inbound authentication and credentials agents use to access external services." },
                { cap: "Policy", purpose: "Applies Cedar authorization rules to Gateway tool calls before they reach their targets." },
                { cap: "Browser", purpose: "Provides managed browser sessions for agents that need to interact with websites." },
                { cap: "Code Interpreter", purpose: "Runs Python, JavaScript, or TypeScript in isolated managed sandboxes." },
                { cap: "Observability", purpose: "Sends agent logs, traces, and metrics to CloudWatch and X-Ray." },
                { cap: "Evaluations", purpose: "Measures agent behavior and response quality using built-in or custom evaluators." },
              ].map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: "8px", color: COLORS.sky, fontWeight: 600 }}>{r.cap}</td>
                  <td style={{ padding: "8px", color: COLORS.muted }}>{r.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SME Agent Architecture */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "24px" }}>
        <div style={{ color: COLORS.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>BUILT EXAMPLE: SME TRIAGE AGENT</div>
        <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
          An educational assistant that routes questions to math, physics, chemistry, or geography experts. The model decides which subject best fits — no keyword list or separate routing tool.
        </div>

        {/* Routing flow */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "User Question", color: COLORS.muted },
            { label: "→", color: COLORS.border },
            { label: "Model Routes", color: COLORS.sky },
            { label: "→", color: COLORS.border },
            { label: "Subject Expert", color: COLORS.emerald },
            { label: "→", color: COLORS.border },
            { label: "Prefixed Answer", color: COLORS.amber },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {i > 0 && <span style={{ color: COLORS.border, fontSize: 18 }}>→</span>}
              <div style={{ padding: "6px 12px", borderRadius: 6, background: COLORS.surface2, border: `1px solid ${s.color}44`, color: s.color, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 600 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Card>
            <div style={{ color: COLORS.sky, fontWeight: 600, fontSize: 12, marginBottom: 4 }}>Model-Based Routing</div>
            <div style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.6 }}>
              No keyword classifier needed. The model understands that "Riemann hypothesis" is math, "corrosion" is chemistry, "coastal climate" is geography. Handles ambiguous cross-subject questions by choosing the most relevant subject.
            </div>
          </Card>
          <Card>
            <div style={{ color: COLORS.amber, fontWeight: 600, fontSize: 12, marginBottom: 4 }}>Explicit Prefix System</div>
            <div style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.6 }}>
              Each answer begins with an exact subject prefix (e.g., "This is your Math SME.") for deterministic downstream parsing. Unsupported questions get a polite decline response.
            </div>
          </Card>
        </div>

        {/* Strands code */}
        <div style={{ marginTop: 16, padding: "14px", background: "#060A14", borderRadius: 8 }}>
          <div style={{ color: COLORS.sky, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>STRANDS AGENT — MINIMAL EXAMPLE</div>
          <pre style={{ margin: 0, color: COLORS.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 11, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{`from strands import Agent

agent = Agent(
    model=model,
    system_prompt="You are an educational SME assistant. "
        "Decide whether the question is primarily about "
        "mathematics, physics, chemistry, or geography. "
        "Begin with the exact subject prefix, then explain.",
)

response = agent("Explain Newton's first law.")`}</pre>
        </div>

        <div style={{ marginTop: 12, padding: "14px", background: "#060A14", borderRadius: 8 }}>
          <div style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>AGENTCORE ENTRYPOINT</div>
          <pre style={{ margin: 0, color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 11, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{`from bedrock_agentcore.runtime import BedrockAgentCoreApp

app = BedrockAgentCoreApp()

@app.entrypoint
def invoke(payload, context):
    prompt = payload.get("prompt")
    if not isinstance(prompt, str) or not prompt.strip():
        return {"error": "A non-empty question is required."}
    response = build_agent()(prompt.strip())
    return {"response": str(response)}`}</pre>
        </div>
      </div>

      {/* Sessions vs Memory */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "24px" }}>
        <div style={{ color: COLORS.rose, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>SESSIONS vs LONG-TERM MEMORY</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Card style={{ border: `1px solid ${COLORS.sky}33` }}>
            <div style={{ color: COLORS.sky, fontWeight: 600, marginBottom: 8 }}>Runtime Sessions</div>
            <div style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.6 }}>
              Groups related turns in one conversation via <code style={{ color: COLORS.sky }}>session_id</code>. Enables follow-up questions within the same session. <strong>Context is lost</strong> when a new session begins.
            </div>
            <div style={{ marginTop: 8, padding: "6px 10px", background: COLORS.surface, borderRadius: 6, color: COLORS.sky, fontSize: 11, fontWeight: 600 }}>
              Ephemeral · Per-conversation
            </div>
          </Card>
          <Card style={{ border: `1px solid ${COLORS.amber}33` }}>
            <div style={{ color: COLORS.amber, fontWeight: 600, marginBottom: 8 }}>AgentCore Memory</div>
            <div style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.6 }}>
              Stores durable information across sessions via <code style={{ color: COLORS.amber }}>actor_id</code> + <code style={{ color: COLORS.amber }}>session_id</code>. User preferences survive across separate conversations.
            </div>
            <div style={{ marginTop: 8, padding: "6px 10px", background: COLORS.surface, borderRadius: 6, color: COLORS.amber, fontSize: 11, fontWeight: 600 }}>
              Persistent · Cross-session
            </div>
          </Card>
        </div>

        {/* Memory strategies */}
        <div style={{ marginTop: 16 }}>
          <div style={{ color: COLORS.muted, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>4 MEMORY STRATEGIES</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
            {[
              { name: "USER_PREFERENCE", desc: "User's choices, preferred style, recurring preferences", color: COLORS.sky },
              { name: "SEMANTIC", desc: "Durable facts extracted from conversations", color: COLORS.emerald },
              { name: "SUMMARIZATION", desc: "Summarized conversation history", color: COLORS.amber },
              { name: "EPISODIC", desc: "Sequences of interactions that inform later behavior", color: COLORS.violet },
            ].map((s, i) => (
              <Card key={i} style={{ borderTop: `2px solid ${s.color}` }}>
                <div style={{ color: s.color, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, marginBottom: 4 }}>{s.name}</div>
                <div style={{ color: COLORS.muted, fontSize: 11 }}>{s.desc}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Memory config example */}
        <div style={{ marginTop: 16, padding: "14px", background: "#060A14", borderRadius: 8 }}>
          <div style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>AGENTCORE MEMORY CONFIG</div>
          <pre style={{ margin: 0, color: COLORS.violet, fontFamily: "JetBrains Mono, monospace", fontSize: 11, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{`# Add memory to your agent
agentcore add memory \
  --name LearnerPreferences \
  --strategies USER_PREFERENCE \
  --expiry 30

# Invoke with learner ID
agentcore invoke "I prefer Pirate speak" \\
  -H "X-Learner-Id: learner-7f83a2"

# Follow-up respects stored preference
agentcore invoke "Explain Newton's second law" \\
  -H "X-Learner-Id: learner-7f83a2"
# → Response comes back in Pirate speak!`}</pre>
        </div>
      </div>

      {/* Deployment Workflow */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "24px" }}>
        <div style={{ color: COLORS.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>DEPLOYMENT WORKFLOW</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { step: "1", title: "Install tools", desc: "AWS CLI, Node.js 20+, Python 3.10+, AWS CDK, AgentCore CLI", color: COLORS.muted },
            { step: "2", title: "Create project", desc: "agentcore create --name SME --framework Strands --model-provider Bedrock --build CodeZip", color: COLORS.sky },
            { step: "3", title: "Local dev + test", desc: "agentcore dev → opens localhost:8080 → test questions", color: COLORS.emerald },
            { step: "4", title: "Deploy to AWS", desc: "agentcore deploy → CDK synth → CloudFormation → Runtime deployed", color: COLORS.amber },
            { step: "5", title: "Invoke + monitor", desc: "agentcore invoke --stream → check status → observe via CloudWatch", color: COLORS.violet },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: i < 4 ? `1px solid ${COLORS.border}` : "none", alignItems: "flex-start" }}>
              <div style={{
                minWidth: 32, height: 32, borderRadius: 8,
                background: s.color + "18", border: `1px solid ${s.color}44`,
                color: s.color, fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>{s.step}</div>
              <div>
                <div style={{ color: COLORS.text, fontSize: 13, fontWeight: 600 }}>{s.title}</div>
                <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CodeZip explanation */}
        <div style={{ marginTop: 16, padding: "12px 14px", background: COLORS.surface2, borderRadius: 8, border: `1px solid ${COLORS.emerald}33` }}>
          <div style={{ color: COLORS.emerald, fontWeight: 600, fontSize: 12, marginBottom: 4 }}>What is CodeZip?</div>
          <div style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.6 }}>
            AgentCore's deployment format for Python apps. Instead of Docker/ECR/ECS, it packages your Python source + Linux ARM64-compatible dependencies into a ZIP → S3 → Runtime runs the entrypoint. No container management needed.
          </div>
        </div>
      </div>

      {/* Cost Model */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "24px" }}>
        <div style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>COST MODEL</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Card style={{ border: `1px solid ${COLORS.sky}33` }}>
            <div style={{ color: COLORS.sky, fontWeight: 600, marginBottom: 8 }}>Strands (Open Source)</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: COLORS.text, lineHeight: 1.8, fontSize: 12 }}>
              <li>Framework itself: <strong>free</strong></li>
              <li>Pay only for LLM calls (Bedrock inference)</li>
              <li>Pay for compute (EC2, Lambda, etc.)</li>
              <li>Run locally, on EC2, Docker, Lambda — anywhere</li>
            </ul>
          </Card>
          <Card style={{ border: `1px solid ${COLORS.amber}33` }}>
            <div style={{ color: COLORS.amber, fontWeight: 600, marginBottom: 8 }}>AgentCore (Managed Services)</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: COLORS.text, lineHeight: 1.8, fontSize: 12 }}>
              <li>Runtime: session-isolated hosting + scaling</li>
              <li>Memory: cross-session preference storage</li>
              <li>Gateway, Identity, Observability: pay per use</li>
              <li>Cost depends on which capabilities you enable</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Synthesis */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.emerald}33`, borderRadius: 14, padding: "24px" }}>
        <div style={{ color: COLORS.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>SYNTHESIS: FRAMEWORKS & DEPLOYMENT IN THE AGENTIC STACK</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { level: "Agent Framework", what: "Defines agent behavior", tools: "Strands, LangChain, CrewAI, OpenAI Agents SDK" },
            { level: "Managed Deployment", what: "Runs agent in production", tools: "AgentCore, AWS Bedrock, Azure AI, GCP Vertex" },
            { level: "Long-Term Memory", what: "Persists across sessions", tools: "AgentCore Memory, LangMem, Zep, Mem0" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 12px", background: COLORS.surface2, borderRadius: 8, alignItems: "center" }}>
              <div style={{ color: COLORS.sky, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700, minWidth: 140 }}>{s.level}</div>
              <div style={{ flex: 1, color: COLORS.text, fontSize: 12 }}>{s.what}</div>
              <div style={{ color: COLORS.muted, fontSize: 11 }}>{s.tools}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: "14px", background: COLORS.surface2, borderRadius: 8, border: `1px solid ${COLORS.emerald}33` }}>
          <div style={{ color: COLORS.text, lineHeight: 1.7, fontSize: 13 }}>
            <strong>Key insight:</strong> Strands is framework-agnostic — run it anywhere. AgentCore adds managed capabilities (memory, identity, observability) only when needed. Start with Strands locally, add AgentCore when you need production deployment and cross-session memory.
          </div>
        </div>
      </div>

    </div>
  );
}