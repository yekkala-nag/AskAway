import React, { useState } from "react";

const C = {
  bg: "#080D1A", surface: "#0F1629", s2: "#162040", s3: "#1E2D52",
  border: "#243358", text: "#E2E8F0", muted: "#7A8BA8",
  amber: "#F59E0B", sky: "#5EC4C8", rose: "#F43F5E", violet: "#A78BFA", emerald: "#5EC4C8",
};

function Card({ children, style = {} }) {
  return <div style={{ background: C.s2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, ...style }}>{children}</div>;
}

function DeploymentPipeline() {
  const [activeStage, setActiveStage] = useState(0);
  const stages = [
    { id: "notebook", label: "Notebook", icon: "📓", color: C.muted, desc: "Model trains in Jupyter. Works on your machine only." },
    { id: "local_api", label: "Local API", icon: "🔌", color: C.sky, desc: "FastAPI endpoint. curl works. Swagger UI works. Still localhost." },
    { id: "docker", label: "Docker", icon: "🐳", color: C.violet, desc: "Self-sufficient image. Python version, packages, paths — all baked in." },
    { id: "ec2", label: "EC2 Deploy", icon: "☁️", color: C.amber, desc: "Real server. Anyone with the IP can call /predict." },
    { id: "elastic", label: "Elastic IP", icon: "🌍", color: C.emerald, desc: "Stable address that survives instance restarts." },
  ];

  const failures = {
    0: { title: "Works on my machine", desc: "Model only runs in your specific Python environment with your specific package versions." },
    1: { title: "ModuleNotFoundError", desc: "Running from /code vs /app changes Python's package resolution. CMD must use --app-dir to mimic local behavior." },
    2: { title: "Build slower on t3.micro", desc: "Some packages lack prebuilt wheels for Python 3.14 — compile from source takes 166s vs local." },
    3: { title: "SSH Connection Timeout", desc: "Security group firewall restricted SSH to your IP. By the time SCP ran, your IP had changed. Common hiccup." },
    4: { title: "Still fragile", desc: "No HTTPS, no authentication, no auto-restart on reboot. Learning project, not production-grade." },
  };

  return (
    <Card>
      <div style={{ color: C.sky, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        INTERACTIVE: MODEL DEPLOYMENT PIPELINE
      </div>
      <div style={{ display: "flex", gap: 0, alignItems: "center", marginBottom: 16, overflowX: "auto" }}>
        {stages.map((s, i) => (
          <React.Fragment key={s.id}>
            <div onClick={() => setActiveStage(i)} style={{
              padding: "10px 14px", borderRadius: 8, cursor: "pointer", minWidth: 100, textAlign: "center",
              background: activeStage === i ? s.color + "22" : C.surface,
              border: `2px solid ${activeStage === i ? s.color : C.border}`,
              transition: "all 0.2s",
            }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ color: activeStage === i ? s.color : C.muted, fontSize: 11, fontWeight: 700 }}>{s.label}</div>
            </div>
            {i < stages.length - 1 && <span style={{ color: C.border, fontSize: 16, padding: "0 6px" }}>→</span>}
          </React.Fragment>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ padding: "14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${stages[activeStage].color}` }}>
          <div style={{ color: stages[activeStage].color, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
            {stages[activeStage].icon} {stages[activeStage].label}
          </div>
          <div style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>{stages[activeStage].desc}</div>
        </div>

        <div style={{ padding: "14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${C.rose}` }}>
          <div style={{ color: C.rose, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 6 }}>
            FAILURE AT THIS STAGE
          </div>
          <div style={{ color: C.amber, fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{failures[activeStage].title}</div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>{failures[activeStage].desc}</div>
        </div>
      </div>
    </Card>
  );
}

function DockerfileWalkthrough() {
  const [highlight, setHighlight] = useState(null);
  const lines = [
    { num: 1, code: "FROM python:3.14-slim", desc: "Match local Python version exactly — 3.14 is new, no prebuilt wheels for some packages", color: C.sky },
    { num: 2, code: "WORKDIR /code", desc: "Set working directory — this is where the subtle bug lives", color: C.muted },
    { num: 3, code: "COPY requirements.txt .", desc: "Copy dependency manifest first for Docker layer caching", color: C.muted },
    { num: 4, code: "RUN pip install --no-cache-dir -r requirements.txt", desc: "Install packages — 166s on t3.micro due to source compilation", color: C.violet },
    { num: 5, code: "COPY ./app ./app", desc: "Copy application code", color: C.muted },
    { num: 6, code: "COPY ./models ./models", desc: "Copy trained model artifacts", color: C.muted },
    { num: 7, code: "EXPOSE 8000", desc: "Document the port", color: C.muted },
    { num: 8, code: 'CMD ["uvicorn", "main:app", "--app-dir", "app", "--host", "0.0.0.0", "--port", "8000"]', desc: "KEY FIX: --app-dir tells uvicorn to load app from /app, mimicking local behavior", color: C.amber },
  ];

  return (
    <Card>
      <div style={{ color: C.violet, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        DOCKERFILE — THE SUBTLE BUG AND THE FIX
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ padding: "14px", background: "#060A14", borderRadius: 8 }}>
          <div style={{ color: C.violet, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, marginBottom: 8 }}>Dockerfile</div>
          {lines.map(l => (
            <div key={l.num} onClick={() => setHighlight(l.num)} style={{
              padding: "4px 8px", borderRadius: 4, cursor: "pointer",
              background: highlight === l.num ? l.color + "22" : "transparent",
              borderLeft: highlight === l.num ? `2px solid ${l.color}` : "2px solid transparent",
              transition: "all 0.15s",
            }}>
              <span style={{ color: C.muted, fontSize: 10, marginRight: 8 }}>{l.num}</span>
              <span style={{ color: l.color, fontFamily: "JetBrains Mono, monospace", fontSize: 11 }}>{l.code}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "14px", background: C.surface, borderRadius: 8 }}>
          <div style={{ color: C.muted, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, marginBottom: 8 }}>LINE EXPLANATION</div>
          {highlight ? (
            <div style={{ color: C.text, fontSize: 13, lineHeight: 1.7 }}>
              <div style={{ color: lines[highlight - 1].color, fontWeight: 700, marginBottom: 8 }}>Line {highlight}</div>
              <code style={{ color: C.sky, fontSize: 12 }}>{lines[highlight - 1].code}</code>
              <div style={{ marginTop: 8, color: C.muted, fontSize: 12 }}>{lines[highlight - 1].desc}</div>
            </div>
          ) : (
            <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>
              Click any line to see why it matters. The critical line is <strong style={{ color: C.amber }}>Line 8</strong> — without <code style={{ color: C.amber }}>--app-dir</code>, Python can't find the schemas module because it treats app/ as a package instead of the root.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function ProductionReadiness() {
  const [checked, setChecked] = useState({});
  const items = [
    { id: "docker", label: "Dockerized with pinned versions", critical: true },
    { id: "elastic", label: "Elastic IP for stable address", critical: false },
    { id: "https", label: "HTTPS/TLS certificates", critical: true },
    { id: "auth", label: "API key / authentication", critical: true },
    { id: "restart", label: "Auto-restart on instance reboot", critical: true },
    { id: "logs", label: "Structured logging + monitoring", critical: false },
    { id: "health", label: "Health check endpoint", critical: false },
    { id: "rollback", label: "Rollback strategy documented", critical: true },
  ];

  const score = Object.values(checked).filter(Boolean).length;
  const criticalMissing = items.filter(i => i.critical && !checked[i.id]).length;

  return (
    <Card>
      <div style={{ color: C.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        PRODUCTION READINESS CHECKLIST
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <div style={{ padding: "12px 16px", background: C.surface, borderRadius: 8, flex: 1, textAlign: "center" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 24, fontWeight: 900, color: score === items.length ? C.sky : C.amber }}>{score}/{items.length}</div>
          <div style={{ color: C.muted, fontSize: 11 }}>Items Complete</div>
        </div>
        <div style={{ padding: "12px 16px", background: C.surface, borderRadius: 8, flex: 1, textAlign: "center" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 24, fontWeight: 900, color: criticalMissing === 0 ? C.sky : C.rose }}>{criticalMissing}</div>
          <div style={{ color: C.muted, fontSize: 11 }}>Critical Missing</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {items.map(item => (
          <div key={item.id} onClick={() => setChecked(p => ({ ...p, [item.id]: !p[item.id] }))} style={{
            padding: "10px 12px", borderRadius: 6, cursor: "pointer",
            background: checked[item.id] ? C.sky + "11" : C.surface,
            border: `1px solid ${checked[item.id] ? C.sky + "44" : item.critical ? C.rose + "33" : C.border}`,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ color: checked[item.id] ? C.sky : C.muted, fontSize: 16 }}>{checked[item.id] ? "✓" : "○"}</span>
            <span style={{ color: checked[item.id] ? C.text : C.muted, fontSize: 12, textDecoration: checked[item.id] ? "line-through" : "none" }}>{item.label}</span>
            {item.critical && <span style={{ marginLeft: "auto", color: C.rose, fontSize: 9, fontWeight: 700 }}>*</span>}
          </div>
        ))}
      </div>
    </Card>
  );
}

function FailureModes() {
  const failures = [
    { stage: "Docker Build", error: "ModuleNotFoundError: No module named 'schemas'", cause: "CMD runs from /code, Python treats app/ as package instead of root", fix: "Add --app-dir app to uvicorn CMD", color: C.violet },
    { stage: "EC2 SSH", error: "ssh: connect to host <ip> port 22: Connection timed out", cause: "Security group restricted SSH to your IP. Your IP changed between console setup and SCP.", fix: "Update security group inbound rule or use current IP", color: C.amber },
    { stage: "Production", error: "Container dies on SSH disconnect", cause: "Running without -d flag means container is attached to SSH session", fix: "Use docker run -d -p 8000:8000 to run detached", color: C.rose },
  ];

  return (
    <Card>
      <div style={{ color: C.rose, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        3 FAILURES I DIDN'T SEE COMING
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {failures.map((f, i) => (
          <div key={i} style={{ padding: "12px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${f.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ color: f.color, fontWeight: 700, fontSize: 12 }}>{f.stage}</span>
            </div>
            <div style={{ padding: "6px 10px", background: "#060A14", borderRadius: 4, marginBottom: 6 }}>
              <code style={{ color: C.rose, fontFamily: "JetBrains Mono, monospace", fontSize: 11 }}>{f.error}</code>
            </div>
            <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>
              <strong style={{ color: C.text }}>Cause:</strong> {f.cause}
            </div>
            <div style={{ color: C.sky, fontSize: 12, lineHeight: 1.6, marginTop: 4 }}>
              <strong>Fix:</strong> {f.fix}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function ModelDeploymentTab() {
  return (
    <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 28, maxWidth: 880, margin: "0 auto" }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>📰</span>
          <div>
            <div style={{ color: C.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>AI FIELD NOTES · SEPTEMBER 2026</div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>Your Model Isn't Done Until Someone Else Can Call It</h2>
          </div>
        </div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
          Building a FastAPI endpoint for churn prediction, and everything that broke between "it runs" and "it's live."
        </div>
      </div>

      <DeploymentPipeline />
      <DockerfileWalkthrough />
      <FailureModes />
      <ProductionReadiness />

      <Card style={{ border: `1px solid ${C.emerald}33` }}>
        <div style={{ color: C.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
          THE REAL LESSON
        </div>
        <div style={{ color: C.text, fontSize: 13, lineHeight: 1.7 }}>
          The majority of issues weren't logical errors in code — they were <strong>environmental mismatches</strong> or subtle infrastructure changes. Docker solves "works on my machine." But between containerization and production, you hit SSH timeouts, IP changes, detached containers dying on disconnect, missing HTTPS, no auth, and no auto-restart. The unglamorous work of making a model <em>reachable</em> is where most ML projects actually fail.
        </div>
      </Card>
    </div>
  );
}