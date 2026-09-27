import { useState } from "react";

const STEPS = [
  {
    num: "01",
    title: "Setup & Local Model Selection",
    icon: "⚙️",
    badge: "Environment",
    badgeColor: "#5EC4C8",
    summary: "Download Ollama and pull Alibaba Qwen 2.5 for fast, local, zero-cost intelligence.",
    detail: "Ollama (v0.6.2) runs open-source models natively on macOS, Linux, and Windows. We choose Qwen 2.5 because it excels at instruction following, JSON function calling, and structured reasoning while keeping memory usage lightweight.",
    code: `# 1. Install Ollama Python SDK
pip install ollama==0.6.2

# 2. Pull local model in terminal
ollama run qwen2.5`,
    notes: ["Zero API key requirements", "Complete local privacy — no data leaves machine", "Optimized for fast tool-calling performance"]
  },
  {
    num: "02",
    title: "Define Shell Command Execution Tool",
    icon: "💻",
    badge: "Subprocess",
    badgeColor: "#F0A89A",
    summary: "Use Python's subprocess module to run terminal commands safely with timeouts.",
    detail: "The agent needs a bridge between model reasoning and computer execution. We wrap subprocess.run with shell=True, capture_output=True, text=True, and a 10-second timeout to prevent runaway hanging processes.",
    code: `import subprocess

def execute_shell_command(command: str) -> str:
    """Executes a terminal command and returns stdout or stderr."""
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True, 
            timeout=10
        )
        return result.stdout if result.returncode == 0 else result.stderr
    except Exception as e:
        return str(e)`,
    notes: ["Capture returncode == 0 for success", "10s timeout safeguards against infinite loops", "Returns stderr directly for LLM self-correction"]
  },
  {
    num: "03",
    title: "Tool Schema & Function Dispatcher",
    icon: "🧩",
    badge: "Ollama Schema",
    badgeColor: "#C9B8E8",
    summary: "Map Python functions to Ollama JSON tool schemas so the model knows when and how to call them.",
    detail: "Ollama follows standard OpenAI function calling JSON schemas. We define parameter types, descriptions, and required fields, along with a dictionary TOOL_MAP for instant string-to-function lookup.",
    code: `# Dispatcher dictionary
TOOL_MAP = {
    'execute_shell_command': execute_shell_command
}

# JSON Schema for Ollama
TOOLS_SCHEMA = [
    {
        'type': 'function',
        'function': {
            'name': 'execute_shell_command',
            'description': 'Execute safe terminal shell commands on the local machine.',
            'parameters': {
                'type': 'object',
                'properties': {
                    'command': {
                        'type': 'string',
                        'description': 'The exact bash or shell command to run.',
                    }
                },
                'required': ['command'],
            },
        },
    }
]`,
    notes: ["Schema tells LLM exact arguments needed", "TOOL_MAP resolves dynamic execution", "Multiple tools can be passed in array"]
  },
  {
    num: "04",
    title: "Multi-Role Message History",
    icon: "💬",
    badge: "Roles & Context",
    badgeColor: "#F0A89A",
    summary: "Manage system, user, assistant, and tool roles to maintain context throughout execution turns.",
    detail: "Chat completion requires tracking conversation state. System role initializes guardrails, User role receives input, Assistant role holds LLM reasoning / tool requests, and Tool role injects subprocess output back into context.",
    code: `# Initialize system instructions
messages = [
    {
        "role": "system", 
        "content": "You are a helpful local CLI assistant. You can inspect the system and run tasks using your tools."
    }
]

# When tool finishes, append role="tool"
messages.append({
    "role": "tool",
    "name": "execute_shell_command",
    "content": tool_result
})`,
    notes: ["Role 'system' sets system behavior", "Role 'tool' connects observation back to reasoning", "Maintains full state loop"]
  },
  {
    num: "05",
    title: "The ReAct Tool-Calling Loop",
    icon: "🔄",
    badge: "Execution Loop",
    badgeColor: "#5EC4C8",
    summary: "Loop until the LLM produces a final text synthesis instead of requesting tool invocations.",
    detail: "The core loop invokes ollama.chat(model=llm, messages=messages, tools=TOOLS_SCHEMA). While response contains tool_calls, it extracts function arguments, calls Python execute_shell_command, appends output as role 'tool', and queries Ollama again.",
    code: `import ollama, json, sys

while True:
    user_input = input("🙂 > ")
    if user_input.lower() in ['exit', 'quit']: break
    
    messages.append({"role": "user", "content": user_input})
    response = ollama.chat(model=llm, messages=messages, tools=TOOLS_SCHEMA)

    # Process tool call loop
    while response.get('message', {}).get('tool_calls'):
        messages.append(response['message'])
        for tool_call in response['message']['tool_calls']:
            tool_name = tool_call['function']['name']
            args = tool_call['function']['arguments']
            
            print(f"🔧 > [Executing Tool] {tool_name}({json.dumps(args)})")
            tool_result = TOOL_MAP[tool_name](**args)
            
            messages.append({"role": "tool", "name": tool_name, "content": tool_result})
            
        # Re-submit history with tool outputs
        response = ollama.chat(model=llm, messages=messages, tools=TOOLS_SCHEMA)

    # Display final synthesized answer
    res = response['message']['content']
    print(f"👽 > {res}\\n")
    messages.append({"role": "assistant", "content": res})`,
    notes: ["Multi-turn tool recursion supported", "Re-submits history with tool feedback", "Safely terminates when model yields text response"]
  }
];

const TAXONOMY_MATRIX = [
  {
    type: "Cloud-Native CLI Agents",
    examples: "Claude Code, OpenAI Codex CLI",
    hosting: "Cloud LLM (Anthropic / OpenAI API)",
    privacy: "Data sent to API providers",
    cost: "Pay-per-token API pricing",
    tools: "Local shell tool execution via secure local worker",
    bestFor: "Complex software engineering, massive context reasoning"
  },
  {
    type: "Open-Source Orchestration",
    examples: "Hermes, AutoGPT, CrewAI CLI",
    hosting: "Flexible (Local or Remote LLM)",
    privacy: "Depends on chosen endpoint",
    cost: "Free (Local) or API Key usage",
    tools: "Extensible Python tool ecosystem (Files, Web, Shell)",
    bestFor: "Custom multi-agent workflows and framework builders"
  },
  {
    type: "Fully-Local CLI Agents",
    examples: "Python + Ollama (Qwen 2.5 / Llama 3)",
    hosting: "100% On-Device Local Machine",
    privacy: "Zero external network requests; complete privacy",
    cost: "100% Free forever (Zero API costs)",
    tools: "Direct Python subprocess execution",
    bestFor: "Air-gapped security, enterprise privacy, offline dev workflows"
  }
];

const FLASHCARDS = [
  {
    q: "Why do CLI agents use role='tool' in message history?",
    a: "The 'tool' role tells the LLM that the content is an observation returned by an executed function call (e.g. terminal output), allowing the model to continue reasoning with real ground-truth data.",
    cat: "Architecture"
  },
  {
    q: "What is the purpose of timeout=10 in subprocess.run()?",
    a: "It acts as a safety harness to prevent long-running, interactive, or blocking CLI commands (like top or tail -f) from hanging the Python script indefinitely.",
    cat: "Safety"
  },
  {
    q: "How does Ollama detect if a tool needs to be called?",
    a: "When tools=TOOLS_SCHEMA is passed to ollama.chat(), Ollama provides function signatures to the model. If the model determines an action is needed, it outputs a structured JSON response containing tool_calls instead of normal text.",
    cat: "Ollama SDK"
  },
  {
    q: "What is the difference between stdout and stderr in tool return?",
    a: "stdout contains the successful result of a command, while stderr contains error output. Returning both allows the agent to diagnose failed terminal commands and self-correct on its next turn.",
    cat: "Python Subprocess"
  },
  {
    q: "Why is Qwen 2.5 recommended for local CLI agents?",
    a: "Qwen 2.5 offers top-tier instruction following, native tool-calling fine-tuning, fast inference on consumer GPUs/Mac Apple Silicon, and strong code synthesis capability.",
    cat: "Model Selection"
  },
  {
    q: "What risk does ambiguous prompt phrasing carry in CLI agents?",
    a: "Commands like 'clean up my Downloads folder' can trigger irreversible file deletion (rm -rf). CLI agents should include safety confirmation prompts or restricted execution bounds for destructive commands.",
    cat: "Security"
  }
];

const SIMULATOR_PRESETS = [
  {
    userCmd: "How much disk space do I have left on my drive?",
    toolName: "execute_shell_command",
    toolArgs: { command: "df -h /" },
    rawOutput: "Filesystem     Size   Used  Avail Capacity iused ifree %iused  Mounted on\n/dev/disk3s1s1 994Gi  420Gi  542Gi    44% 3850120 5683290   40%   /",
    assistantAns: "You currently have 542 GB of available disk space out of 994 GB total (44% capacity used)."
  },
  {
    userCmd: "What's my OS version and system architecture?",
    toolName: "execute_shell_command",
    toolArgs: { command: "sw_vers && uname -m" },
    rawOutput: "ProductName:\tmacOS\nProductVersion:\t15.3.1\nBuildVersion:\t24D70\narm64",
    assistantAns: "You are running macOS Version 15.3.1 (Build 24D70) on an Apple Silicon arm64 architecture."
  },
  {
    userCmd: "Find all Python log files created in the scratch directory.",
    toolName: "execute_shell_command",
    toolArgs: { command: "find ./scratch -name '*.log' -type f" },
    rawOutput: "./scratch/agent_debug.log\n./scratch/execution_trace.log",
    assistantAns: "Found 2 Python log files in the scratch directory:\n1. ./scratch/agent_debug.log\n2. ./scratch/execution_trace.log"
  }
];

export default function CliAgentTab() {
  const [activeStep, setActiveStep] = useState(0);
  const [simIndex, setSimIndex] = useState(0);
  const [simPhase, setSimPhase] = useState("idle"); // idle, thinking, tool_exec, synthesizing, complete
  const [showJsonToolCall, setShowJsonToolCall] = useState(true);
  const [flashcardFlipped, setFlashcardFlipped] = useState({});

  // Tool Schema Builder state
  const [builderName, setBuilderName] = useState("read_file_content");
  const [builderDesc, setBuilderDesc] = useState("Read text content of a local file safely.");
  const [builderParam, setBuilderParam] = useState("filepath");

  const runSimulation = (idx) => {
    setSimIndex(idx);
    setSimPhase("thinking");
    setTimeout(() => setSimPhase("tool_exec"), 1200);
    setTimeout(() => setSimPhase("synthesizing"), 2400);
    setTimeout(() => setSimPhase("complete"), 3600);
  };

  const toggleFlip = (idx) => {
    setFlashcardFlipped((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const currentPreset = SIMULATOR_PRESETS[simIndex];

  return (
    <div style={{ padding: "2rem", maxWidth: 1280, margin: "0 auto" }}>
      {/* HEADER BANNER */}
      <div style={{ background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)", borderRadius: 16, padding: "2.5rem", border: "1px solid #374151", marginBottom: "2.5rem", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(42,138,132,0.15)", border: "1px solid #5EC4C8", padding: "0.3rem 0.8rem", borderRadius: 20, fontSize: "0.75rem", color: "#3A9B9F", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
              <span>🤖 Agentic AI Guide</span> · <span>Ollama + Python</span>
            </div>
            <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2.5rem", fontWeight: 900, color: "#f9fafb", margin: 0, lineHeight: 1.1 }}>
              Building Local CLI Agents from Scratch
            </h1>
            <p style={{ color: "#E2E8F0", fontSize: "0.95rem", maxWidth: 720, marginTop: "0.8rem", lineHeight: 1.6 }}>
              Learn how to create a fully private, zero-cost, autonomous Command-Line Interface (CLI) Agent running Ollama locally. Connect natural language commands to real system actions via Python subprocesses.
            </p>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ background: "#111827", padding: "1rem 1.5rem", borderRadius: 12, border: "1px solid #374151", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#C47A6A" }}>$0.00</div>
              <div style={{ fontSize: "0.7rem", color: "#CBD5E1", textTransform: "uppercase", letterSpacing: "0.05em" }}>API Cost</div>
            </div>
            <div style={{ background: "#111827", padding: "1rem 1.5rem", borderRadius: 12, border: "1px solid #374151", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#3A9B9F" }}>100%</div>
              <div style={{ fontSize: "0.7rem", color: "#CBD5E1", textTransform: "uppercase", letterSpacing: "0.05em" }}>Local Privacy</div>
            </div>
          </div>
        </div>
      </div>

      {/* ARCHITECTURE DIAGRAM SECTION */}
      <div style={{ background: "#181825", borderRadius: 16, border: "1px solid #2b2b3d", padding: "2rem", marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f9fafb", marginTop: 0, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span>🏛️</span> Local CLI Agent Architecture Workflow
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
          The architecture pairs a local Ollama LLM instance (e.g. Qwen 2.5) with a Python execution runtime. Natural language queries are transformed into structured JSON function calls, executed safely in Python via `subprocess`, and returned back to the model context.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", alignItems: "center" }}>
          <div style={{ background: "#0d0d15", borderRadius: 12, overflow: "hidden", border: "1px solid #3b3b54", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "1/1", maxHeight: 440, margin: "0 auto", width: "100%" }}>
            <img src="/assets/cli_agent_architecture.png" alt="CLI Agent Architecture" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ background: "#11111b", padding: "1.2rem", borderRadius: 10, borderLeft: "4px solid #F0A89A" }}>
              <div style={{ fontWeight: 700, color: "#C47A6A", fontSize: "0.85rem", textTransform: "uppercase" }}>1. User Input & System Prompt</div>
              <div style={{ fontSize: "0.82rem", color: "#d1d5db", marginTop: "0.3rem" }}>
                Natural language request is packaged with system instructions and JSON tool schemas (`execute_shell_command`).
              </div>
            </div>

            <div style={{ background: "#11111b", padding: "1.2rem", borderRadius: 10, borderLeft: "4px solid #5EC4C8" }}>
              <div style={{ fontWeight: 700, color: "#3A9B9F", fontSize: "0.85rem", textTransform: "uppercase" }}>2. Ollama Function Calling</div>
              <div style={{ fontSize: "0.82rem", color: "#d1d5db", marginTop: "0.3rem" }}>
                Model evaluates intent and yields structured JSON: <code>{`{"name": "execute_shell_command", "arguments": {"command": "df -h"}}`}</code>.
              </div>
            </div>

            <div style={{ background: "#11111b", padding: "1.2rem", borderRadius: 10, borderLeft: "4px solid #C9B8E8" }}>
              <div style={{ fontWeight: 700, color: "#7A6BA8", fontSize: "0.85rem", textTransform: "uppercase" }}>3. Subprocess Execution & Observation</div>
              <div style={{ fontSize: "0.82rem", color: "#d1d5db", marginTop: "0.3rem" }}>
                Python executes command via `subprocess.run()`, captures stdout/stderr, and appends output to history with `role="tool"`.
              </div>
            </div>

            <div style={{ background: "#11111b", padding: "1.2rem", borderRadius: 10, borderLeft: "4px solid #5EC4C8" }}>
              <div style={{ fontWeight: 700, color: "#3A9B9F", fontSize: "0.85rem", textTransform: "uppercase" }}>4. Final LLM Synthesis</div>
              <div style={{ fontSize: "0.82rem", color: "#d1d5db", marginTop: "0.3rem" }}>
                Ollama reads execution results from history and synthesizes a human-readable text answer.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STEP-BY-STEP IMPLEMENTATION WALKTHROUGH */}
      <div style={{ background: "#181825", borderRadius: 16, border: "1px solid #2b2b3d", padding: "2rem", marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f9fafb", margin: 0 }}>
              🛠️ Step-by-Step Implementation Guide
            </h2>
            <div style={{ fontSize: "0.85rem", color: "#9ca3af", marginTop: "0.2rem" }}>
              Follow these 5 clear steps to build the local Python CLI Agent code from scratch.
            </div>
          </div>

          {/* Step Pill Selector */}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {STEPS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                style={{
                  background: activeStep === idx ? s.badgeColor : "#11111b",
                  color: activeStep === idx ? "#ffffff" : "#9ca3af",
                  border: `1px solid ${activeStep === idx ? s.badgeColor : "#374151"}`,
                  padding: "0.4rem 0.9rem",
                  borderRadius: 20,
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {s.num}. {s.title.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* ACTIVE STEP CARD */}
        {(() => {
          const st = STEPS[activeStep];
          return (
            <div style={{ background: "#0d0d15", borderRadius: 12, padding: "1.8rem", border: `1px solid ${st.badgeColor}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.8rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                  <span style={{ fontSize: "1.8rem" }}>{st.icon}</span>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: st.badgeColor, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Step {st.num} · {st.badge}
                    </div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f9fafb", margin: 0 }}>
                      {st.title}
                    </h3>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep(prev => prev - 1)}
                    style={{ background: "#1f2937", border: "1px solid #374151", color: activeStep === 0 ? "#4b5563" : "#d1d5db", padding: "0.4rem 0.8rem", borderRadius: 8, fontSize: "0.78rem", cursor: activeStep === 0 ? "not-allowed" : "pointer" }}
                  >
                    ← Previous
                  </button>
                  <button
                    disabled={activeStep === STEPS.length - 1}
                    onClick={() => setActiveStep(prev => prev + 1)}
                    style={{ background: st.badgeColor, border: "none", color: "#ffffff", padding: "0.4rem 0.8rem", borderRadius: 8, fontSize: "0.78rem", fontWeight: 700, cursor: activeStep === STEPS.length - 1 ? "not-allowed" : "pointer" }}
                  >
                    Next Step →
                  </button>
                </div>
              </div>

              <p style={{ color: "#d1d5db", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.2rem" }}>
                {st.detail}
              </p>

              {/* CODE CONTAINER */}
              <div style={{ background: "#050508", borderRadius: 10, padding: "1.2rem", border: "1px solid #262636", fontFamily: "DM Mono, monospace", fontSize: "0.82rem", color: "#a7f3d0", overflowX: "auto", whiteSpace: "pre-wrap", marginBottom: "1.2rem", lineHeight: 1.5 }}>
                {st.code}
              </div>

              {/* KEY NOTES */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.8rem" }}>
                {st.notes.map((note, i) => (
                  <div key={i} style={{ background: "#13131f", padding: "0.7rem 1rem", borderRadius: 8, borderLeft: `3px solid ${st.badgeColor}`, fontSize: "0.8rem", color: "#9ca3af" }}>
                    🔹 {note}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* INTERACTIVE CLI TERMINAL SIMULATOR */}
      <div style={{ background: "#181825", borderRadius: 16, border: "1px solid #2b2b3d", padding: "2rem", marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f9fafb", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>🖥️</span> Interactive CLI Agent Simulator
            </h2>
            <div style={{ fontSize: "0.85rem", color: "#9ca3af", marginTop: "0.2rem" }}>
              Simulate Ollama + Python subprocess execution in real-time. Select a query to trigger the ReAct loop.
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <label style={{ fontSize: "0.75rem", color: "#9ca3af", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <input type="checkbox" checked={showJsonToolCall} onChange={e => setShowJsonToolCall(e.target.checked)} />
              Show Ollama JSON Tool Call
            </label>
          </div>
        </div>

        {/* PRESET QUERY BUTTONS */}
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {SIMULATOR_PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => runSimulation(idx)}
              style={{
                background: simIndex === idx ? "#5EC4C8" : "#11111b",
                color: simIndex === idx ? "#ffffff" : "#d1d5db",
                border: `1px solid ${simIndex === idx ? "#5EC4C8" : "#374151"}`,
                padding: "0.5rem 1rem",
                borderRadius: 8,
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              ▶ Preset {idx + 1}: "{p.userCmd.slice(0, 30)}..."
            </button>
          ))}
        </div>

        {/* TERMINAL DISPLAY WINDOW */}
        <div style={{ background: "#09090e", borderRadius: 12, border: "1px solid #2b2b3d", overflow: "hidden", fontFamily: "DM Mono, monospace" }}>
          {/* TERMINAL HEADER */}
          <div style={{ background: "#14141f", padding: "0.6rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #2b2b3d" }}>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#5EC4C8" }} />
              <span style={{ fontSize: "0.75rem", color: "#6b7280", marginLeft: "0.5rem" }}>bash — python CLIagent.py (Ollama qwen2.5)</span>
            </div>
            <div style={{ fontSize: "0.7rem", color: simPhase === "complete" ? "#5EC4C8" : "#F0A89A", fontWeight: 700 }}>
              ● STATUS: {simPhase.toUpperCase()}
            </div>
          </div>

          {/* TERMINAL BODY */}
          <div style={{ padding: "1.5rem", fontSize: "0.85rem", color: "#f3f4f6", lineHeight: 1.7, minHeight: 280 }}>
            {/* USER TURN */}
            <div style={{ display: "flex", gap: "0.5rem", color: "#60a5fa" }}>
              <span>🙂 &gt;</span>
              <span style={{ color: "#f9fafb", fontWeight: 600 }}>{currentPreset.userCmd}</span>
            </div>

            {/* THINKING PHASE */}
            {(simPhase === "thinking" || simPhase === "tool_exec" || simPhase === "synthesizing" || simPhase === "complete") && (
              <div style={{ color: "#9ca3af", fontSize: "0.78rem", margin: "0.4rem 0" }}>
                ⏳ [Ollama Thinking] Analyzing request parameters...
              </div>
            )}

            {/* JSON TOOL CALL */}
            {showJsonToolCall && (simPhase === "tool_exec" || simPhase === "synthesizing" || simPhase === "complete") && (
              <div style={{ background: "#11111e", borderLeft: "3px solid #C9B8E8", padding: "0.8rem", borderRadius: 6, margin: "0.6rem 0", color: "#c084fc", fontSize: "0.78rem" }}>
                <div>🔧 &gt; [Executing Tool] {currentPreset.toolName}</div>
                <div style={{ color: "#e9d5ff", marginTop: "0.3rem" }}>
                  arguments: {JSON.stringify(currentPreset.toolArgs, null, 2)}
                </div>
              </div>
            )}

            {/* SUBPROCESS OUTPUT */}
            {(simPhase === "synthesizing" || simPhase === "complete") && (
              <div style={{ background: "#051311", borderLeft: "3px solid #5EC4C8", padding: "0.8rem", borderRadius: 6, margin: "0.6rem 0", color: "#6ee7b7", fontSize: "0.78rem" }}>
                <div>📋 &gt; [Subprocess Observation (role="tool")]</div>
                <div style={{ whiteSpace: "pre-wrap", marginTop: "0.3rem", color: "#a7f3d0" }}>
                  {currentPreset.rawOutput}
                </div>
              </div>
            )}

            {/* ASSISTANT FINAL SYNTHESIS */}
            {simPhase === "complete" && (
              <div style={{ color: "#fcd34d", marginTop: "0.8rem", background: "rgba(201,168,76,0.1)", padding: "1rem", borderRadius: 8, border: "1px solid rgba(201,168,76,0.3)" }}>
                <span style={{ fontWeight: 700 }}>👽 &gt;</span> {currentPreset.assistantAns}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CUSTOM TOOL SCHEMA BUILDER */}
      <div style={{ background: "#181825", borderRadius: 16, border: "1px solid #2b2b3d", padding: "2rem", marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f9fafb", marginTop: 0, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>🧪</span> Interactive Tool Schema Builder
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          Test how custom Python functions are converted into Ollama JSON schemas. Fill out the fields to see the live JSON schema generated in real-time.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {/* INPUT FORM */}
          <div style={{ background: "#0d0d15", padding: "1.5rem", borderRadius: 12, border: "1px solid #2b2b3d", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.78rem", color: "#9ca3af", display: "block", marginBottom: "0.4rem", fontWeight: 700 }}>Function Name</label>
              <input
                type="text"
                value={builderName}
                onChange={e => setBuilderName(e.target.value)}
                style={{ width: "100%", background: "#181825", border: "1px solid #374151", color: "#f3f4f6", padding: "0.6rem", borderRadius: 8, fontSize: "0.85rem", fontFamily: "DM Mono, monospace" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.78rem", color: "#9ca3af", display: "block", marginBottom: "0.4rem", fontWeight: 700 }}>Tool Description for LLM</label>
              <textarea
                rows={2}
                value={builderDesc}
                onChange={e => setBuilderDesc(e.target.value)}
                style={{ width: "100%", background: "#181825", border: "1px solid #374151", color: "#f3f4f6", padding: "0.6rem", borderRadius: 8, fontSize: "0.85rem" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.78rem", color: "#9ca3af", display: "block", marginBottom: "0.4rem", fontWeight: 700 }}>Parameter String Name</label>
              <input
                type="text"
                value={builderParam}
                onChange={e => setBuilderParam(e.target.value)}
                style={{ width: "100%", background: "#181825", border: "1px solid #374151", color: "#f3f4f6", padding: "0.6rem", borderRadius: 8, fontSize: "0.85rem", fontFamily: "DM Mono, monospace" }}
              />
            </div>
          </div>

          {/* LIVE GENERATED JSON SCHEMA */}
          <div style={{ background: "#050508", padding: "1.5rem", borderRadius: 12, border: "1px solid #262636", fontFamily: "DM Mono, monospace", fontSize: "0.78rem", color: "#60a5fa", overflowX: "auto" }}>
            <div style={{ color: "#9ca3af", fontSize: "0.72rem", marginBottom: "0.5rem", textTransform: "uppercase", fontWeight: 700 }}>Generated Ollama TOOLS_SCHEMA</div>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
{JSON.stringify(
  [
    {
      type: "function",
      function: {
        name: builderName || "my_tool",
        description: builderDesc || "Tool description",
        parameters: {
          type: "object",
          properties: {
            [builderParam || "param"]: {
              type: "string",
              description: `Value for ${builderParam}`
            }
          },
          required: [builderParam || "param"]
        }
      }
    }
  ],
  null,
  2
)}
            </pre>
          </div>
        </div>
      </div>

      {/* TAXONOMY COMPARISON MATRIX */}
      <div style={{ background: "#181825", borderRadius: 16, border: "1px solid #2b2b3d", padding: "2rem", marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f9fafb", marginTop: 0, marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>📊</span> CLI Agent Ecosystem Comparison Matrix
        </h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ background: "#11111b", borderBottom: "2px solid #374151", color: "#C47A6A" }}>
                <th style={{ padding: "0.9rem 1rem" }}>Agent Category</th>
                <th style={{ padding: "0.9rem 1rem" }}>Prominent Examples</th>
                <th style={{ padding: "0.9rem 1rem" }}>Hosting Model</th>
                <th style={{ padding: "0.9rem 1rem" }}>Privacy & Security</th>
                <th style={{ padding: "0.9rem 1rem" }}>Cost Structure</th>
                <th style={{ padding: "0.9rem 1rem" }}>Best For</th>
              </tr>
            </thead>
            <tbody>
              {TAXONOMY_MATRIX.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #262636", background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                  <td style={{ padding: "1rem", fontWeight: 700, color: "#f9fafb" }}>{row.type}</td>
                  <td style={{ padding: "1rem", color: "#3A9B9F", fontWeight: 600 }}>{row.examples}</td>
                  <td style={{ padding: "1rem", color: "#d1d5db" }}>{row.hosting}</td>
                  <td style={{ padding: "1rem", color: "#9ca3af" }}>{row.privacy}</td>
                  <td style={{ padding: "1rem", color: "#C47A6A", fontWeight: 700 }}>{row.cost}</td>
                  <td style={{ padding: "1rem", color: "#9ca3af", fontSize: "0.8rem" }}>{row.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FLASHCARDS STUDY MODE */}
      <div style={{ background: "#181825", borderRadius: 16, border: "1px solid #2b2b3d", padding: "2rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f9fafb", marginTop: 0, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>🎴</span> CLI Agent Study Flashcards
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          Test your knowledge of CLI agent design, subprocess execution, and Ollama tool-calling mechanics. Click any card to reveal the answer.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.2rem" }}>
          {FLASHCARDS.map((card, idx) => {
            const isFlipped = flashcardFlipped[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleFlip(idx)}
                style={{
                  background: isFlipped ? "#1f2937" : "#0d0d15",
                  border: `1px solid ${isFlipped ? "#5EC4C8" : "#374151"}`,
                  borderRadius: 12,
                  padding: "1.5rem",
                  cursor: "pointer",
                  minHeight: 160,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.3s ease"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                    <span style={{ fontSize: "0.7rem", color: "#C47A6A", fontWeight: 700, textTransform: "uppercase" }}>{card.cat}</span>
                    <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>{isFlipped ? "Answer" : "Question"}</span>
                  </div>
                  <div style={{ fontSize: "0.9rem", color: isFlipped ? "#a7f3d0" : "#f9fafb", fontWeight: isFlipped ? 500 : 700, lineHeight: 1.5 }}>
                    {isFlipped ? card.a : card.q}
                  </div>
                </div>

                <div style={{ fontSize: "0.72rem", color: "#9ca3af", textAlign: "right", marginTop: "1rem" }}>
                  {isFlipped ? "↩ Click to view Question" : "💡 Click to reveal Answer"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
