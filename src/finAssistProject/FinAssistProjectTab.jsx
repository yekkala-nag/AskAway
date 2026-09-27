import React, { useState, useEffect, useCallback } from "react";

const C = {
  bg: "#080D1A", surface: "#0F1629", s2: "#162040", s3: "#1E2D52",
  border: "#243358", text: "#E2E8F0", muted: "#7A8BA8",
  amber: "#F59E0B", sky: "#5EC4C8", rose: "#F43F5E", violet: "#A78BFA", emerald: "#5EC4C8",
};

function Card({ children, style = {} }) {
  return <div style={{ background: C.s2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, ...style }}>{children}</div>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MODULE 1 — Secure MCP Setup Simulator
   ═══════════════════════════════════════════════════════════════════════════ */
function MCPSimulator() {
  const [authToken, setAuthToken] = useState("");
  const [tool, setTool] = useState("get_account_balance");
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);

  const VALID_TOKEN = "bank_session_abc123";

  const tools = {
    get_account_balance: {
      desc: "Returns current account balance for authenticated user",
      params: ["account_id"],
      response: { balance: 12847.53, currency: "USD", account_type: "checking", last_updated: "2026-09-19T14:30:00Z" },
    },
    get_recent_transactions: {
      desc: "Returns last 5 transactions",
      params: ["account_id", "limit"],
      response: {
        transactions: [
          { id: "TXN-001", date: "2026-09-18", description: "Direct Deposit - Employer", amount: 3200.00, type: "credit" },
          { id: "TXN-002", date: "2026-09-17", description: "Amazon.com Purchase", amount: -89.99, type: "debit" },
          { id: "TXN-003", date: "2026-09-16", description: "ATM Withdrawal", amount: -200.00, type: "debit" },
          { id: "TXN-004", date: "2026-09-15", description: "Electric Company AutoPay", amount: -142.30, type: "debit" },
          { id: "TXN-005", date: "2026-09-14", description: "Coffee Shop", amount: -5.45, type: "debit" },
        ],
      },
    },
    calculate_loan_eligibility: {
      desc: "Deterministic loan eligibility based on income/debt ratio",
      params: ["annual_income", "monthly_debt", "loan_amount"],
      response: null, // computed
    },
  };

  const computeLoan = (income, debt, amount) => {
    const dti = (debt * 12) / income;
    const eligible = dti < 0.43 && amount <= income * 0.3;
    return {
      eligible,
      dti_ratio: (dti * 100).toFixed(1) + "%",
      max_loan: (income * 0.3).toFixed(2),
      monthly_payment: (amount / 36).toFixed(2),
      interest_rate: "6.5%",
      term_months: 36,
      disclaimers: ["This is an estimate, not a binding offer.", "Actual rates depend on credit score and underwriting."],
    };
  };

  const [income, setIncome] = useState(75000);
  const [debt, setDebt] = useState(800);
  const [loanAmt, setLoanAmt] = useState(15000);

  const callTool = () => {
    const timestamp = new Date().toISOString();
    if (authToken !== VALID_TOKEN) {
      setResult({ error: "AUTH_FAILED", message: "Invalid or missing session token. Please authenticate first." });
      setLogs(prev => [...prev, { time: timestamp, tool, status: "REJECTED", reason: "auth_failure" }]);
      return;
    }
    if (tool === "calculate_loan_eligibility") {
      const r = computeLoan(income, debt, loanAmt);
      setResult(r);
      setLogs(prev => [...prev, { time: timestamp, tool, status: "SUCCESS", params: { income, debt, loanAmt } }]);
    } else {
      setResult(tools[tool].response);
      setLogs(prev => [...prev, { time: timestamp, tool, status: "SUCCESS", params: {} }]);
    }
  };

  return (
    <Card>
      <div style={{ color: C.sky, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        MODULE 1 — SECURE MCP SERVER SIMULATOR
      </div>

      {/* Auth */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>Session Token (try: {VALID_TOKEN})</div>
          <input value={authToken} onChange={e => setAuthToken(e.target.value)} placeholder="Enter session token..."
            style={{ width: "100%", padding: "8px 12px", background: "#060A14", border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 12, fontFamily: "JetBrains Mono, monospace", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <span style={{ padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: authToken === VALID_TOKEN ? C.emerald + "22" : C.rose + "22", color: authToken === VALID_TOKEN ? C.emerald : C.rose }}>
            {authToken === VALID_TOKEN ? "● AUTHENTICATED" : "○ UNAUTHENTICATED"}
          </span>
        </div>
      </div>

      {/* Tool selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {Object.keys(tools).map(t => (
          <button key={t} onClick={() => { setTool(t); setResult(null); }} style={{
            flex: 1, padding: "6px 8px", borderRadius: 6,
            background: tool === t ? C.sky + "22" : C.surface,
            border: `1px solid ${tool === t ? C.sky : C.border}`,
            color: tool === t ? C.sky : C.muted, fontSize: 10, cursor: "pointer", fontFamily: "JetBrains Mono, monospace",
          }}>{t}</button>
        ))}
      </div>
      <div style={{ color: C.muted, fontSize: 11, marginBottom: 12 }}>{tools[tool].desc}</div>

      {/* Params */}
      {tool === "calculate_loan_eligibility" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <div style={{ color: C.muted, fontSize: 10 }}>Annual Income</div>
            <input type="number" value={income} onChange={e => setIncome(Number(e.target.value))}
              style={{ width: "100%", padding: "6px 8px", background: "#060A14", border: `1px solid ${C.border}`, borderRadius: 4, color: C.sky, fontSize: 12, fontFamily: "JetBrains Mono, monospace", boxSizing: "border-box" }} />
          </div>
          <div>
            <div style={{ color: C.muted, fontSize: 10 }}>Monthly Debt</div>
            <input type="number" value={debt} onChange={e => setDebt(Number(e.target.value))}
              style={{ width: "100%", padding: "6px 8px", background: "#060A14", border: `1px solid ${C.border}`, borderRadius: 4, color: C.sky, fontSize: 12, fontFamily: "JetBrains Mono, monospace", boxSizing: "border-box" }} />
          </div>
          <div>
            <div style={{ color: C.muted, fontSize: 10 }}>Loan Amount</div>
            <input type="number" value={loanAmt} onChange={e => setLoanAmt(Number(e.target.value))}
              style={{ width: "100%", padding: "6px 8px", background: "#060A14", border: `1px solid ${C.border}`, borderRadius: 4, color: C.sky, fontSize: 12, fontFamily: "JetBrains Mono, monospace", boxSizing: "border-box" }} />
          </div>
        </div>
      )}

      <button onClick={callTool} style={{
        padding: "8px 20px", borderRadius: 6, background: C.sky, color: "#000", border: "none",
        fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 16,
      }}>▶ Call MCP Tool</button>

      {/* Response */}
      {result && (
        <div style={{ background: "#060A14", borderRadius: 8, padding: 14, marginBottom: 12, borderLeft: `3px solid ${result.error ? C.rose : C.emerald}` }}>
          <div style={{ color: C.muted, fontSize: 10, marginBottom: 6 }}>MCP RESPONSE</div>
          <pre style={{ margin: 0, color: result.error ? C.rose : C.text, fontSize: 11, fontFamily: "JetBrains Mono, monospace", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {/* Audit log */}
      {logs.length > 0 && (
        <div style={{ background: C.s3, borderRadius: 8, padding: 12 }}>
          <div style={{ color: C.amber, fontSize: 10, fontWeight: 700, marginBottom: 6 }}>AUDIT LOG</div>
          {logs.slice(-5).reverse().map((l, i) => (
            <div key={i} style={{ display: "flex", gap: 8, fontSize: 10, fontFamily: "JetBrains Mono, monospace", marginBottom: 2 }}>
              <span style={{ color: C.muted }}>{l.time.slice(11, 19)}</span>
              <span style={{ color: l.status === "SUCCESS" ? C.emerald : C.rose }}>{l.status}</span>
              <span style={{ color: C.sky }}>{l.tool}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MODULE 2 — Policy RAG Pipeline Simulator
   ═══════════════════════════════════════════════════════════════════════════ */
function PolicyRAGSimulator() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const policyDocs = [
    { id: "CHK-4.2", doc: "Checking Account Agreement", section: "4.2", title: "Monthly Maintenance Fee", content: "A monthly maintenance fee of $12.00 will be charged to accounts with a balance below $1,500.00. This fee is waived for accounts with direct deposit of $500.00 or more per statement cycle.", category: "fees" },
    { id: "CHK-7.1", doc: "Checking Account Agreement", section: "7.1", title: "Overdraft Policy", content: "Overdraft transactions may be paid at the bank's discretion. An overdraft fee of $35.00 will be assessed per item paid. Customers may opt out of overdraft coverage by contacting customer service.", category: "fees" },
    { id: "CC-3.4", doc: "Credit Card Terms", section: "3.4", title: "Annual Percentage Rate (APR)", content: "The standard variable APR for purchases is 17.99% to 24.99%, depending on creditworthiness. Cash advance APR is 27.99%. No introductory APR offers are currently available.", category: "rates" },
    { id: "CC-5.2", doc: "Credit Card Terms", section: "5.2", title: "Late Payment Fee", content: "A late payment fee of up to $40.00 will be charged if payment is not received by the due date. A second late payment within six months may result in a penalty APR of 29.99%.", category: "fees" },
    { id: "LN-2.1", doc: "Personal Loan Agreement", section: "2.1", title: "Loan Eligibility", content: "Applicants must have a minimum annual income of $25,000 and a debt-to-income ratio below 43%. Loan amounts range from $1,000 to $50,000 with terms of 12 to 60 months.", category: "eligibility" },
    { id: "LN-4.3", doc: "Personal Loan Agreement", section: "4.3", title: "Prepayment Penalty", content: "There is no prepayment penalty for personal loans. Customers may pay off their loan balance at any time without additional charges.", category: "policies" },
    { id: "DIS-1.0", doc: "General Disclaimer", section: "1.0", title: "Not Financial Advice", content: "All information provided by this system is for informational purposes only and does not constitute financial advice. Customers should consult with a qualified financial advisor for personalized recommendations.", category: "compliance" },
  ];

  const trapDoc = { id: "MISSING", doc: "N/A", section: "N/A", title: "Wire Transfer Fees", content: "This fee schedule does not include wire transfer fee information. Please contact customer service for current wire transfer rates.", category: "missing" };

  const searchRAG = () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setAnswer(null);

    setTimeout(() => {
      const q = query.toLowerCase();
      let matches = policyDocs.filter(d =>
        d.content.toLowerCase().includes(q.split(" ").filter(w => w.length > 3).join("|").replace(/\|/g, "|")) ||
        d.title.toLowerCase().includes(q.split(" ").filter(w => w.length > 3)[0] || "")
      );

      // Trap: wire transfer query should find nothing
      if (q.includes("wire transfer") || q.includes("wire")) {
        matches = [];
        setResults([]);
        setAnswer({
          type: "out_of_policy",
          text: "I don't have information about wire transfer fees in my policy documents. This topic is not covered in the current documentation. Let me connect you with a human agent who can help with wire transfer inquiries.",
          citations: [],
        });
        setIsSearching(false);
        return;
      }

      if (matches.length === 0) {
        matches = policyDocs.slice(0, 2); // fallback to general
      }

      setResults(matches.slice(0, 3));

      const bestMatch = matches[0];
      let responseText = "";
      if (q.includes("fee") || q.includes("charge") || q.includes("cost")) {
        responseText = `According to Section ${bestMatch.section} of the ${bestMatch.doc}: "${bestMatch.content}"`;
      } else if (q.includes("apr") || q.includes("rate") || q.includes("interest")) {
        responseText = `Based on the ${bestMatch.doc}, Section ${bestMatch.section}: "${bestMatch.content}"`;
      } else if (q.includes("eligible") || q.includes("qualify") || q.includes("requirement")) {
        responseText = `Per Section ${bestMatch.section} of the ${bestMatch.doc}: "${bestMatch.content}"`;
      } else {
        responseText = `Here's what I found in the ${bestMatch.doc}, Section ${bestMatch.section}: "${bestMatch.content}"`;
      }

      setAnswer({
        type: "grounded",
        text: responseText,
        citations: matches.map(m => ({ id: m.id, doc: m.doc, section: m.section, title: m.title })),
      });
      setIsSearching(false);
    }, 800);
  };

  return (
    <Card>
      <div style={{ color: C.violet, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        MODULE 2 — POLICY RAG PIPELINE SIMULATOR
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {["What is the monthly maintenance fee?", "What is the APR for credit cards?", "What are the loan eligibility requirements?", "What is the overdraft policy?", "What are the wire transfer fees? (trap!)"].map((s, i) => (
          <button key={i} onClick={() => setQuery(s)} style={{
            padding: "4px 10px", borderRadius: 4, fontSize: 10, cursor: "pointer",
            background: i === 4 ? C.rose + "22" : C.surface, border: `1px solid ${i === 4 ? C.rose : C.border}`,
            color: i === 4 ? C.rose : C.muted,
          }}>{i === 4 ? "⚠️ " + s : s}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Ask about bank policies..."
          onKeyDown={e => e.key === "Enter" && searchRAG()}
          style={{ flex: 1, padding: "8px 12px", background: "#060A14", border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 12, boxSizing: "border-box" }} />
        <button onClick={searchRAG} style={{ padding: "8px 16px", borderRadius: 6, background: C.violet, color: "#000", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
          {isSearching ? "..." : "🔍 Search"}
        </button>
      </div>

      {/* Retrieved chunks */}
      {results.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: C.muted, fontSize: 10, marginBottom: 6 }}>RETRIEVED CHUNKS (Top {results.length})</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {results.map((r, i) => (
              <div key={i} style={{ padding: "8px 12px", background: C.surface, borderRadius: 6, borderLeft: `3px solid ${C.violet}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: C.violet, fontSize: 10, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>{r.id}</span>
                  <span style={{ color: C.muted, fontSize: 10 }}>{r.doc} §{r.section}</span>
                </div>
                <div style={{ color: C.text, fontSize: 11 }}>{r.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Answer */}
      {answer && (
        <div style={{ padding: "14px", background: "#060A14", borderRadius: 8, borderLeft: `3px solid ${answer.type === "out_of_policy" ? C.rose : C.emerald}` }}>
          <div style={{ color: answer.type === "out_of_policy" ? C.rose : C.emerald, fontSize: 10, fontWeight: 700, marginBottom: 6 }}>
            {answer.type === "out_of_policy" ? "⚠️ OUT-OF-POLICY — ESCALATING TO HUMAN" : "✅ GROUNDED RESPONSE"}
          </div>
          <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6, marginBottom: 8 }}>{answer.text}</div>
          {answer.citations.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {answer.citations.map((c, i) => (
                <span key={i} style={{ padding: "3px 8px", background: C.violet + "22", borderRadius: 4, color: C.violet, fontSize: 9, fontFamily: "JetBrains Mono, monospace" }}>
                  {c.id} — {c.doc} §{c.section}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MODULE 3 — Agentic Workflow Visualizer
   ═══════════════════════════════════════════════════════════════════════════ */
function AgentWorkflow() {
  const [userInput, setUserInput] = useState("");
  const [flow, setFlow] = useState(null);
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const classifyIntent = (input) => {
    const lower = input.toLowerCase();
    if (lower.includes("my balance") || lower.includes("my account") || lower.includes("my transaction") || lower.includes("my apr") || lower.includes("my loan")) {
      return { type: "personal_data", intent: "User wants personal account data — requires authentication + MCP tools" };
    }
    if (lower.includes("what is") || lower.includes("what are") || lower.includes("tell me about") || lower.includes("explain") || lower.includes("how does")) {
      return { type: "general_info", intent: "General policy question — answer from RAG documents" };
    }
    if (lower.includes("calculate") || lower.includes("eligibility") || lower.includes("can i get") || lower.includes("am i eligible")) {
      return { type: "calculation", intent: "Requires calculation — use MCP loan calculator" };
    }
    return { type: "ambiguous", intent: "Ambiguous intent — clarify with user before proceeding" };
  };

  const runAgent = () => {
    if (!userInput.trim()) return;
    setIsRunning(true);
    setStep(0);

    const intent = classifyIntent(userInput);
    const steps = [
      { label: "Intent Classification", detail: intent.intent, icon: "🧠", color: C.sky },
      { label: intent.type === "personal_data" ? "Auth Check" : intent.type === "calculation" ? "MCP Tool Selection" : "RAG Retrieval",
        detail: intent.type === "personal_data" ? "Verifying session token before MCP call" : intent.type === "calculation" ? "Selecting calculate_loan_eligibility tool" : "Searching policy documents for relevant chunks",
        icon: intent.type === "personal_data" ? "🔐" : intent.type === "calculation" ? "🔧" : "📚",
        color: intent.type === "personal_data" ? C.amber : intent.type === "calculation" ? C.sky : C.violet },
      { label: "Tool Execution", detail: intent.type === "personal_data" ? "Calling get_account_balance / get_recent_transactions" : intent.type === "calculation" ? "Running deterministic loan eligibility formula" : "Retrieving top-3 policy chunks by cosine similarity",
        icon: "⚡", color: C.sky },
      { label: "Response Generation", detail: "Generating grounded response with citations and disclaimers", icon: "📝", color: C.emerald },
      { label: "Safety Check", detail: "Verifying: PII masked in logs, disclaimer included, no financial advice given", icon: "🛡️", color: C.emerald },
    ];

    let i = 0;
    const timer = setInterval(() => {
      setStep(i + 1);
      i++;
      if (i >= steps.length) {
        clearInterval(timer);
        setIsRunning(false);
      }
    }, 700);

    setFlow({ intent, steps });
  };

  return (
    <Card>
      <div style={{ color: C.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        MODULE 3 — AGENTIC WORKFLOW VISUALIZER (LangGraph)
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {["What is the monthly fee?", "What is my balance?", "Am I eligible for a loan?", "Tell me about overdraft", "What's my APR?"].map((s, i) => (
          <button key={i} onClick={() => setUserInput(s)} style={{
            padding: "4px 10px", borderRadius: 4, fontSize: 10, cursor: "pointer",
            background: i === 1 || i === 4 ? C.amber + "22" : C.surface,
            border: `1px solid ${i === 1 || i === 4 ? C.amber : C.border}`,
            color: i === 1 || i === 4 ? C.amber : C.muted,
          }}>{i === 1 || i === 4 ? "🔒 " + s : s}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Ask FinAssist..."
          onKeyDown={e => e.key === "Enter" && runAgent()}
          style={{ flex: 1, padding: "8px 12px", background: "#060A14", border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 12, boxSizing: "border-box" }} />
        <button onClick={runAgent} disabled={isRunning} style={{
          padding: "8px 16px", borderRadius: 6, background: C.amber, color: "#000", border: "none",
          fontSize: 12, fontWeight: 700, cursor: isRunning ? "wait" : "pointer", opacity: isRunning ? 0.6 : 1,
        }}>{isRunning ? "Running..." : "▶ Run Agent"}</button>
      </div>

      {flow && (
        <div style={{ background: "#060A14", borderRadius: 8, padding: 16 }}>
          {/* Intent badge */}
          <div style={{ marginBottom: 16, padding: "8px 12px", background: C.surface, borderRadius: 6, borderLeft: `3px solid ${flow.intent.type === "personal_data" ? C.amber : flow.intent.type === "calculation" ? C.sky : C.violet}` }}>
            <span style={{ color: C.muted, fontSize: 10 }}>INTENT: </span>
            <span style={{ color: flow.intent.type === "personal_data" ? C.amber : flow.intent.type === "calculation" ? C.sky : C.violet, fontSize: 10, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
              {flow.intent.type.toUpperCase()}
            </span>
          </div>

          {/* Flow steps */}
          {flow.steps.map((s, i) => {
            const isActive = i < step;
            const isCurrent = i === step - 1;
            return (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < flow.steps.length - 1 ? 8 : 0, opacity: isActive ? 1 : 0.3 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: isActive ? s.color + "33" : C.s3,
                    border: `2px solid ${isActive ? s.color : C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, transition: "all 0.3s",
                  }}>{s.icon}</div>
                  {i < flow.steps.length - 1 && (
                    <div style={{ width: 2, height: 16, background: isActive ? s.color : C.border, transition: "background 0.3s" }} />
                  )}
                </div>
                <div style={{ flex: 1, paddingBottom: 4 }}>
                  <div style={{ color: isActive ? s.color : C.muted, fontSize: 11, fontWeight: 600 }}>{s.label}</div>
                  {isActive && (
                    <div style={{ color: C.muted, fontSize: 10, marginTop: 2, lineHeight: 1.4 }}>{s.detail}</div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Final output */}
          {step >= flow.steps.length && !isRunning && (
            <div style={{ marginTop: 16, padding: "10px 14px", background: C.emerald + "11", borderRadius: 6, borderLeft: `3px solid ${C.emerald}` }}>
              <div style={{ color: C.emerald, fontWeight: 600, fontSize: 11, marginBottom: 4 }}>AGENT OUTPUT</div>
              <div style={{ color: C.text, fontSize: 12, lineHeight: 1.5 }}>
                {flow.intent.type === "personal_data"
                  ? "🔒 [REDACTED] Your account balance is $**47.53. Recent transactions: [3 items]. (Full details require authenticated session.)"
                  : flow.intent.type === "calculation"
                  ? "Based on your income of $75,000 and monthly debt of $800, your DTI ratio is 12.8%. You are ELIGIBLE for a loan up to $22,500. (This is an estimate, not a binding offer.)"
                  : "According to Section 4.2 of the Checking Account Agreement, a $12.00 monthly maintenance fee applies when your balance falls below $1,500.00. This fee is waived with direct deposit of $500+."}
              </div>
              <div style={{ marginTop: 8, color: C.muted, fontSize: 9, fontStyle: "italic" }}>
                Disclaimer: This information is for educational purposes only and does not constitute financial advice.
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MODULE 4 — PII Redaction & Safety Engine
   ═══════════════════════════════════════════════════════════════════════════ */
function PIISimulator() {
  const [input, setInput] = useState("Hello, my name is John Smith. My account number is 4532-8901-2345-6789 and my SSN is 123-45-6789. I noticed a charge of $150.00 on my card ending in 4321. Please call me at (555) 123-4567 or email john.smith@email.com.");
  const [redacted, setRedacted] = useState(null);
  const [showPatterns, setShowPatterns] = useState(false);

  const piiPatterns = [
    { name: "Credit Card", regex: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, replacement: "[CARD_REDACTED]", color: C.rose },
    { name: "SSN", regex: /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g, replacement: "[SSN_REDACTED]", color: C.rose },
    { name: "Phone", regex: /\(?\d{3}\)?[-\s.]?\d{3}[-\s.]?\d{4}\b/g, replacement: "[PHONE_REDACTED]", color: C.amber },
    { name: "Email", regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: "[EMAIL_REDACTED]", color: C.amber },
    { name: "Account Number (dash)", regex: /\b\d{4}[-]\d{4}[-]\d{4}[-]\d{4}\b/g, replacement: "[ACCT_REDACTED]", color: C.rose },
  ];

  const redact = () => {
    let result = input;
    const found = [];
    piiPatterns.forEach(p => {
      const matches = result.match(p.regex);
      if (matches) {
        matches.forEach(m => found.push({ type: p.name, value: m, color: p.color }));
        result = result.replace(p.regex, p.replacement);
      }
    });
    setRedacted({ original: input, cleaned: result, found });
  };

  const samples = [
    "My SSN is 987-65-4321 and my card is 4111 1111 1111 1111. Email me at test@bank.com.",
    "Account 1234-5678-9012-3456 has a balance issue. Call (800) 555-0199.",
    "Transaction on card 5500-0000-0000-0004 for $299.99. Contact: jane.doe@corp.net SSN: 111-22-3333.",
  ];

  return (
    <Card>
      <div style={{ color: C.rose, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        MODULE 4 — PII REDACTION ENGINE
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {samples.map((s, i) => (
          <button key={i} onClick={() => setInput(s)} style={{
            padding: "4px 8px", borderRadius: 4, fontSize: 9, cursor: "pointer",
            background: C.surface, border: `1px solid ${C.border}`, color: C.muted,
          }}>Sample {i + 1}</button>
        ))}
      </div>

      <textarea value={input} onChange={e => setInput(e.target.value)} style={{
        width: "100%", height: 80, background: "#060A14", border: `1px solid ${C.border}`,
        borderRadius: 6, padding: 10, color: C.text, fontSize: 11, fontFamily: "JetBrains Mono, monospace",
        resize: "vertical", marginBottom: 12, boxSizing: "border-box",
      }} />

      <button onClick={redact} style={{
        padding: "8px 16px", borderRadius: 6, background: C.rose, color: "#000", border: "none",
        fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 16,
      }}>🛡️ Redact PII</button>

      {redacted && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>ORIGINAL</div>
              <div style={{ padding: "10px", background: "#060A14", borderRadius: 6, color: C.text, fontSize: 11, lineHeight: 1.5 }}>{redacted.original}</div>
            </div>
            <div>
              <div style={{ color: C.emerald, fontSize: 10, marginBottom: 4 }}>REDACTED</div>
              <div style={{ padding: "10px", background: "#060A14", borderRadius: 6, color: C.emerald, fontSize: 11, lineHeight: 1.5 }}>{redacted.cleaned}</div>
            </div>
          </div>

          {redacted.found.length > 0 && (
            <div style={{ padding: "10px 14px", background: C.surface, borderRadius: 6 }}>
              <div style={{ color: C.muted, fontSize: 10, marginBottom: 6 }}>PII DETECTED ({redacted.found.length} items)</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {redacted.found.map((p, i) => (
                  <span key={i} style={{ padding: "3px 8px", borderRadius: 4, fontSize: 10, background: p.color + "22", color: p.color, fontFamily: "JetBrains Mono, monospace" }}>
                    {p.type}: {p.value}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MODULE 5 — Project Roadmap & Gap Analysis
   ═══════════════════════════════════════════════════════════════════════════ */
function ProjectRoadmap() {
  const [activeModule, setActiveModule] = useState(0);
  const modules = [
    {
      id: 1, title: "Secure MCP Setup", status: "simulated",
      tasks: [
        { name: "Create Python MCP server with FastAPI", status: "todo", effort: "2h" },
        { name: "Implement get_account_balance tool", status: "simulated", effort: "1h" },
        { name: "Implement get_recent_transactions tool", status: "simulated", effort: "1h" },
        { name: "Implement calculate_loan_eligibility (deterministic)", status: "simulated", effort: "1.5h" },
        { name: "Add auth token validation middleware", status: "simulated", effort: "1h" },
        { name: "Add audit logging to every tool call", status: "todo", effort: "1h" },
        { name: "Write unit tests for each tool", status: "todo", effort: "1.5h" },
      ],
      code: `# mcp_server.py
from fastapi import FastAPI, Header, HTTPException
from typing import Optional
import logging, json, datetime

app = FastAPI()
audit_log = []

def verify_auth(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing or invalid auth token")
    return authorization.replace("Bearer ", "")

@app.get("/tools/get_account_balance")
def get_balance(account_id: str, authorization: Optional[str] = Header(None)):
    token = verify_auth(authorization)
    result = {"balance": 12847.53, "currency": "USD", "account_type": "checking"}
    audit_log.append({"tool": "get_account_balance", "time": str(datetime.datetime.now()), "status": "success"})
    return result`,
    },
    {
      id: 2, title: "Policy RAG Pipeline", status: "simulated",
      tasks: [
        { name: "Collect banking PDFs (ToS, Fee Schedules, Loan Agreements)", status: "done", effort: "2h" },
        { name: "Chunk documents by section (recursive text splitter)", status: "todo", effort: "2h" },
        { name: "Embed with sentence-transformers", status: "todo", effort: "1h" },
        { name: "Store in PostgreSQL + pgvector", status: "todo", effort: "2h" },
        { name: "Implement hybrid search (semantic + keyword)", status: "todo", effort: "3h" },
        { name: "Add citation extraction from chunk metadata", status: "todo", effort: "1h" },
        { name: "Test with hallucination trap queries", status: "simulated", effort: "1h" },
      ],
      code: `# rag_pipeline.py
from langchain_community.vectorstores import PGVector
from langchain_community.embeddings import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = PGVector(connection_string=CONN_STR, embedding_function=embeddings)

def search_policies(query: str, k: int = 3):
    """Search with hybrid retrieval and citation metadata."""
    results = vectorstore.similarity_search_with_score(query, k=k)
    return [
        {
            "content": doc.page_content,
            "citation": doc.metadata["citation"],  # e.g. "CHK-4.2"
            "source": doc.metadata["source"],
            "score": score
        }
        for doc, score in results
    ]`,
    },
    {
      id: 3, title: "Financial Agent (LangGraph)", status: "planned",
      tasks: [
        { name: "Define agent state schema (intent, auth, response, citations)", status: "todo", effort: "1h" },
        { name: "Build intent classification node", status: "todo", effort: "2h" },
        { name: "Build auth verification node", status: "todo", effort: "1h" },
        { name: "Build RAG retrieval node", status: "todo", effort: "2h" },
        { name: "Build MCP tool execution node", status: "todo", effort: "2h" },
        { name: "Build response generation node with disclaimers", status: "todo", effort: "1.5h" },
        { name: "Wire LangGraph StateGraph with conditional edges", status: "todo", effort: "3h" },
        { name: "Test full workflow end-to-end", status: "todo", effort: "2h" },
      ],
      code: `# agent_graph.py
from langgraph.graph import StateGraph, END
from typing import TypedDict, Literal

class AgentState(TypedDict):
    user_input: str
    intent: str  # "general_info" | "personal_data" | "calculation"
    authenticated: bool
    session_token: str
    rag_results: list
    mcp_response: dict
    final_response: str

def classify_intent(state: AgentState) -> AgentState:
    # Intent classification logic
    ...

def check_auth(state: AgentState) -> AgentState:
    if state["intent"] == "personal_data":
        state["authenticated"] = verify_token(state["session_token"])
    return state

graph = StateGraph(AgentState)
graph.add_node("classify", classify_intent)
graph.add_node("auth_check", check_auth)
graph.add_node("rag_retrieve", rag_retrieve)
graph.add_node("mcp_call", mcp_call)
graph.add_node("generate_response", generate_response)`,
    },
    {
      id: 4, title: "Safety & Redaction", status: "simulated",
      tasks: [
        { name: "Build PII regex patterns (card, SSN, phone, email)", status: "simulated", effort: "1h" },
        { name: "Add PII middleware to all logging", status: "todo", effort: "2h" },
        { name: "Add compliance disclaimers to system prompt", status: "todo", effort: "0.5h" },
        { name: "Implement groundedness check (LLM verifies own answer)", status: "todo", effort: "2h" },
        { name: "Add 'not financial advice' to every response", status: "todo", effort: "0.5h" },
      ],
      code: `# pii_redaction.py
import re

PATTERNS = {
    "CARD": r"\\b\\d{4}[-]?\\d{4}[-]?\\d{4}[-]?\\d{4}\\b",
    "SSN": r"\\b\\d{3}[-]?\\d{2}[-]?\\d{4}\\b",
    "PHONE": r"\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}",
    "EMAIL": r"\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b",
}

def redact_pii(text: str) -> str:
    for pii_type, pattern in PATTERNS.items():
        text = re.sub(pattern, f"[{pii_type}_REDACTED]", text)
    return text

def log_with_redaction(entry: dict):
    entry["message"] = redact_pii(entry.get("message", ""))
    audit_logger.info(json.dumps(entry))`,
    },
    {
      id: 5, title: "Audit & Deployment", status: "planned",
      tasks: [
        { name: "Build Streamlit UI with mock login screen", status: "todo", effort: "3h" },
        { name: "Add 'Thought Process' sidebar showing agent reasoning", status: "todo", effort: "2h" },
        { name: "Build audit log viewer (filterable by tool, time, user)", status: "todo", effort: "2h" },
        { name: "Create compliance test suite (100% citation check)", status: "todo", effort: "2h" },
        { name: "Dockerize for deployment", status: "todo", effort: "1h" },
      ],
      code: `# app.py (Streamlit)
import streamlit as st

st.set_page_config(page_title="FinAssist", page_icon="🏦")

# Mock login
if "authenticated" not in st.session_state:
    st.session_state.authenticated = False

if not st.session_state.authenticated:
    with st.form("login"):
        st.title("🏦 FinAssist Secure Login")
        username = st.text_input("Username")
        password = st.text_input("Password", type="password")
        if st.form_submit_button("Login"):
            if username == "demo" and password == "bank123":
                st.session_state.authenticated = True
                st.session_state.token = "bank_session_abc123"
                st.rerun()

# Chat interface
if st.session_state.authenticated:
    st.title("🏦 FinAssist — Banking Assistant")
    # ... chat logic with agent workflow`,
    },
  ];

  const m = modules[activeModule];
  const doneCount = m.tasks.filter(t => t.status === "done" || t.status === "simulated").length;

  return (
    <Card>
      <div style={{ color: C.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        MODULE 5 — PROJECT ROADMAP & IMPLEMENTATION GUIDE
      </div>

      {/* Module tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {modules.map((mod, i) => (
          <button key={i} onClick={() => setActiveModule(i)} style={{
            padding: "6px 12px", borderRadius: 6, whiteSpace: "nowrap",
            background: activeModule === i ? C.emerald + "22" : C.surface,
            border: `1px solid ${activeModule === i ? C.emerald : C.border}`,
            color: activeModule === i ? C.emerald : C.muted, fontSize: 11, cursor: "pointer",
          }}>
            M{mod.id}: {mod.title}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 8, background: C.s3, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: `${(doneCount / m.tasks.length) * 100}%`, height: "100%", background: C.emerald, borderRadius: 4, transition: "width 0.3s" }} />
        </div>
        <span style={{ color: C.emerald, fontSize: 11, fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>{doneCount}/{m.tasks.length}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Tasks */}
        <div>
          <div style={{ color: C.muted, fontSize: 10, marginBottom: 8 }}>TASKS</div>
          {m.tasks.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 4, marginBottom: 4, background: t.status === "done" ? C.emerald + "11" : t.status === "simulated" ? C.sky + "11" : C.surface }}>
              <span style={{ fontSize: 12 }}>{t.status === "done" ? "✅" : t.status === "simulated" ? "🔵" : "⬜"}</span>
              <span style={{ flex: 1, color: t.status === "done" || t.status === "simulated" ? C.text : C.muted, fontSize: 11, textDecoration: t.status === "done" ? "line-through" : "none" }}>{t.name}</span>
              <span style={{ color: C.muted, fontSize: 9, fontFamily: "JetBrains Mono, monospace" }}>{t.effort}</span>
            </div>
          ))}
        </div>

        {/* Code reference */}
        <div>
          <div style={{ color: C.muted, fontSize: 10, marginBottom: 8 }}>REFERENCE CODE</div>
          <div style={{ background: "#060A14", borderRadius: 8, padding: 14, maxHeight: 360, overflowY: "auto" }}>
            <pre style={{ margin: 0, color: C.sky, fontSize: 10, fontFamily: "JetBrains Mono, monospace", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{m.code}</pre>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function FinAssistProjectTab() {
  const [activeSection, setActiveSection] = useState("overview");
  const sections = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "mcp", label: "M1: MCP Server", icon: "🔧" },
    { id: "rag", label: "M2: Policy RAG", icon: "📚" },
    { id: "agent", label: "M3: Agent Flow", icon: "🤖" },
    { id: "safety", label: "M4: PII & Safety", icon: "🛡️" },
    { id: "roadmap", label: "M5: Roadmap", icon: "🗺️" },
  ];

  return (
    <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 24, maxWidth: 960, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>🏦</span>
          <div>
            <div style={{ color: C.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>REALTIME PROJECT · BANKING DOMAIN</div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>FinAssist: Intelligent Banking Support & Compliance Agent</h2>
          </div>
        </div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
          A hands-on project to build a production-grade banking AI assistant using Agentic Workflows (LangGraph), Policy RAG (pgvector), and Model Context Protocol (MCP). Practice each module interactively before implementing.
        </div>

        {/* STATUTORY REGULATORY & FINANCIAL DISCLAIMER */}
        <div style={{
          padding: "10px 14px",
          background: "rgba(245, 158, 11, 0.08)",
          borderRadius: 8,
          border: "1px solid rgba(245, 158, 11, 0.3)",
          borderLeft: "4px solid #F59E0B",
          marginBottom: 16,
          display: "flex",
          alignItems: "flex-start",
          gap: 10
        }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <div style={{ fontSize: 11, color: "#CBD5E1", lineHeight: 1.5 }}>
            <strong style={{ color: "#F59E0B" }}>STATUTORY NOTICE — NOT FINANCIAL OR INVESTMENT ADVICE:</strong>{" "}
            FinAssist is an academic and educational simulation illustrating technical AI architecture (MCP, LangGraph, and RAG). All balances, loan underwriting algorithms, transactions, and calculations are mock synthetic data. This system does not provide investment, financial, credit, tax, or legal advice, and should never be utilized for real-world capital decisions.
          </div>
        </div>

        {/* BRD Gaps Analysis */}
        <div style={{ padding: "12px 14px", background: C.s3, borderRadius: 8, borderLeft: `3px solid ${C.amber}` }}>
          <div style={{ color: C.amber, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>🔍 BRD GAP ANALYSIS — What's Missing</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { gap: "No chunking strategy defined for financial PDFs", fix: "Use recursive text splitter with section-aware boundaries (§4.2, §7.1)", priority: "high" },
              { gap: "LangGraph workflow diagram missing", fix: "Implemented in Module 3 with StateGraph visualization", priority: "high" },
              { gap: "No data seeding strategy for sample PDFs", fix: "7 policy documents embedded in RAG simulator", priority: "medium" },
              { gap: "Missing compliance disclaimer placement rules", fix: "Added to every response in agent output", priority: "high" },
              { gap: "No error handling for MCP tool failures", fix: "Auth validation + graceful error responses", priority: "medium" },
              { gap: "Streamlit UI mockup not specified", fix: "Login screen + chat interface in Module 5 code", priority: "medium" },
              { gap: "No testing strategy defined", fix: "Unit tests for MCP tools, compliance test suite", priority: "medium" },
              { gap: "Missing escalation flow for out-of-policy queries", fix: "Implemented in RAG simulator with trap detection", priority: "high" },
            ].map((g, i) => (
              <div key={i} style={{ padding: "6px 8px", background: C.surface, borderRadius: 4, fontSize: 10 }}>
                <div style={{ color: C.rose, fontWeight: 600, marginBottom: 2 }}>❌ {g.gap}</div>
                <div style={{ color: C.emerald }}>✅ {g.fix}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section nav */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
            padding: "8px 14px", borderRadius: 6, whiteSpace: "nowrap",
            background: activeSection === s.id ? C.sky + "22" : C.surface,
            border: `1px solid ${activeSection === s.id ? C.sky : C.border}`,
            color: activeSection === s.id ? C.sky : C.muted, fontSize: 12, cursor: "pointer", fontWeight: 600,
          }}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeSection === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Card>
            <div style={{ color: C.sky, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
              TECH STACK
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
              {[
                { name: "Frontend", tech: "Streamlit", color: C.sky, detail: "Secure chat UI with mock login" },
                { name: "Orchestration", tech: "LangGraph", color: C.violet, detail: "Stateful multi-step workflows" },
                { name: "Vector DB", tech: "PostgreSQL + pgvector", color: C.emerald, detail: "Data sovereignty for banking" },
                { name: "MCP Server", tech: "Python + FastAPI", color: C.amber, detail: "Simulated banking REST APIs" },
              ].map((t, i) => (
                <div key={i} style={{ padding: "10px", background: C.surface, borderRadius: 6, borderLeft: `3px solid ${t.color}` }}>
                  <div style={{ color: C.muted, fontSize: 9, marginBottom: 2 }}>{t.name}</div>
                  <div style={{ color: t.color, fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{t.tech}</div>
                  <div style={{ color: C.muted, fontSize: 10 }}>{t.detail}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ color: C.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
              MODULE PROGRESS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { id: 1, title: "Secure MCP Setup", pct: 85, color: C.sky },
                { id: 2, title: "Policy RAG Pipeline", pct: 70, color: C.violet },
                { id: 3, title: "Financial Agent (LangGraph)", pct: 40, color: C.amber },
                { id: 4, title: "Safety & Redaction", pct: 90, color: C.rose },
                { id: 5, title: "Audit & Deployment", pct: 30, color: C.emerald },
              ].map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ color: C.muted, fontSize: 11, width: 160 }}>M{m.id}: {m.title}</span>
                  <div style={{ flex: 1, height: 8, background: C.s3, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${m.pct}%`, height: "100%", background: m.color, borderRadius: 4 }} />
                  </div>
                  <span style={{ color: m.color, fontSize: 11, fontFamily: "JetBrains Mono, monospace", fontWeight: 700, width: 36, textAlign: "right" }}>{m.pct}%</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ color: C.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
              SUCCESS CRITERIA (from BRD)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { metric: "Citation Accuracy", target: "100%", current: "Simulated", icon: "📄" },
                { metric: "PII Leakage", target: "0 instances", current: "Engine built", icon: "🔒" },
                { metric: "Loan Calc Accuracy", target: "100% deterministic", current: "Implemented", icon: "🧮" },
              ].map((k, i) => (
                <div key={i} style={{ padding: "10px", background: C.surface, borderRadius: 6, textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{k.icon}</div>
                  <div style={{ color: C.muted, fontSize: 10, marginBottom: 2 }}>{k.metric}</div>
                  <div style={{ color: C.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 900 }}>{k.target}</div>
                  <div style={{ color: C.muted, fontSize: 9, marginTop: 2 }}>{k.current}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeSection === "mcp" && <MCPSimulator />}
      {activeSection === "rag" && <PolicyRAGSimulator />}
      {activeSection === "agent" && <AgentWorkflow />}
      {activeSection === "safety" && <PIISimulator />}
      {activeSection === "roadmap" && <ProjectRoadmap />}

      <Card style={{ border: `1px solid ${C.emerald}33` }}>
        <div style={{ color: C.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>MENTOR'S NOTE</div>
        <div style={{ color: C.text, fontSize: 13, lineHeight: 1.7 }}>
          This banking context is excellent for a portfolio because it shows you understand <strong>constraints</strong>. In GenAI, knowing how to build something <em>safe</em> and <em>auditable</em> is often more valuable to employers than just making something <em>creative</em>. Each module above is a self-contained project you can implement, test, and showcase.
        </div>
      </Card>
    </div>
  );
}