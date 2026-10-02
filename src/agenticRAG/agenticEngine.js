// ============================================================================
// AGENTIC RAG ENGINE: 6 SYNTHETIC POLICY DOCUMENTS & INTERACTIVE TOOL SANDBOX
// Agentic RAG: let the agent search (OpenAI Agents SDK)
// ============================================================================

export const POLICY_DOCUMENTS = {
  "conference_guidelines.md": {
    doc_name: "conference_guidelines.md",
    title: "Global Conference & Event Attendance Guidelines",
    effective: "2024-03-01",
    summary: "Rules for attending industry conferences, official hotel booking exceptions, and justification requirements.",
    text: `# Global Conference & Event Attendance Guidelines
Effective Date: March 1, 2024 (Updated for 2026)

## 1. Eligibility & Attendance Caps
Employees in good standing may attend up to two paid industry conferences per calendar year, subject to department budget availability and manager approval.

## 2. Lodging & Official Conference Hotels
- Standard lodging should adhere to the nightly caps outlined in travel_policy.md ($220/night domestic, $280/night international).
- Exception: When attending an approved conference where the conference organizer has negotiated an official host hotel, employees are permitted to book the official conference hotel even if the nightly rate exceeds standard city caps.
- Justification Requirement: To qualify for the official hotel exception, the employee must demonstrate a practical business benefit (e.g., proximity for networking, lack of alternative transit, or session venue integration).

## 3. Approval Workflow
- Initial manager pre-approval must be obtained prior to registering or booking flights.
- For expenditure limits and escalation thresholds exceeding $2,000 in total trip costs, refer to approval_matrix.md.
- International travel notice timelines must strictly adhere to policy_updates_2026.md.`
  },

  "travel_policy.md": {
    doc_name: "travel_policy.md",
    title: "Corporate Travel & Expense Reimbursement Policy",
    effective: "2023-01-15",
    summary: "Standard lodging caps by tier, airfare booking classes, per-diem rates, and receipt submission rules.",
    text: `# Corporate Travel & Expense Reimbursement Policy
Effective Date: January 15, 2023

## 1. Flight Bookings
All commercial flights under 6 hours must be booked in Economy / Coach class via the corporate travel portal. Flights exceeding 6 hours continuous flight time qualify for Premium Economy.

## 2. Standard Nightly Lodging Caps
- Tier 1 High-Cost Cities (London, New York, Tokyo, Zurich): Max $320 / night.
- Tier 2 Major Metro Cities (Berlin, Paris, Singapore, San Francisco): Max $280 / night.
- Tier 3 Regional Cities: Max $200 / night.
- Taxes and mandatory resort fees are excluded from the nightly base cap calculation.

## 3. Meals & Incidentals (Per Diem)
- Domestic travel: $75 / day flat rate.
- International travel: $110 / day flat rate.
- No itemized receipts required for meals under the per-diem allowance.`
  },

  "approval_matrix.md": {
    doc_name: "approval_matrix.md",
    title: "Financial Delegation of Authority & Approval Matrix",
    effective: "2024-06-01",
    summary: "Spending thresholds, manager vs director vs VP approval requirements for travel and software.",
    text: `# Financial Delegation of Authority & Approval Matrix
Effective Date: June 1, 2024

## 1. Travel & Entertainment Approval Tiers
- Tier A ($0 – $1,000): Direct Manager approval via Expense Portal.
- Tier B ($1,001 – $2,000): Direct Manager + Department Head approval.
- Tier C ($2,001 – $5,000): Director of Operations / Engineering sign-off required.
- Tier D (Above $5,000): VP / C-Level Executive sign-off required.

## 2. Policy Cap Override Rules
- Any lodging booking that exceeds standard city caps by more than 15% requires explicit Manager Pre-Approval in writing regardless of total dollar amount.
- Conference official hotel exceptions require the manager to confirm the business justification checkbox in the portal.`
  },

  "policy_updates_2026.md": {
    doc_name: "policy_updates_2026.md",
    title: "2026 Policy Amendments & Operational Revisions",
    effective: "2026-01-01",
    summary: "New 14-day international conference advance notice rule, sustainability offset requirements, and revised per-diems.",
    text: `# 2026 Policy Amendments & Operational Revisions
Effective Date: January 1, 2026

## 1. Advance Notice for International Conferences (New Mandatory Rule)
Effective Jan 1, 2026: All travel requests for international conferences (defined as travel crossing national borders) must be submitted and fully approved at least 14 calendar days prior to the departure date. Late submissions will be rejected automatically by the travel portal.

## 2. Carbon Offset & Sustainable Transit
For inter-city trips in Europe where train travel is under 4 hours, rail transit is mandatory instead of commercial flights.

## 3. Remote Work Travel Coordination
Employees working remotely from an approved international hub must file travel requests through their primary entity code.`
  },

  "remote_work_policy.md": {
    doc_name: "remote_work_policy.md",
    title: "Global Remote Work & International Nomad Policy",
    effective: "2025-05-10",
    summary: "Rules on working from secondary locations, 30-day tax residency limitations, and equipment stipends.",
    text: `# Global Remote Work & International Nomad Policy
Effective Date: May 10, 2025

## 1. Temporary Work from Anywhere (WFA)
Full-time employees may work from an approved secondary domestic or international location for up to 30 calendar days per rolling 12-month period without triggering tax nexus recalculations.

## 2. Prohibited Jurisdictions
Due to data privacy (GDPR / HIPAA) and permanent establishment tax risks, WFA is strictly prohibited in non-FATF compliant jurisdictions and countries without corporate tax treaties.

## 3. Home Office Equipment
Remote employees receive a one-time $600 ergonomic workspace setup stipend upon hiring. Replacements require Manager sign-off after 24 months.`
  },

  "faq.md": {
    doc_name: "faq.md",
    title: "People Operations & Travel Expense FAQ",
    effective: "2024-01-01",
    summary: "Frequently asked questions regarding expense reimbursement deadlines, currency conversion, and lost receipts.",
    text: `# People Operations & Travel Expense FAQ
Effective Date: January 1, 2024

## Q1: When must expense reports be submitted?
All travel expense reports must be submitted within 21 calendar days of the trip conclusion.

## Q2: How are foreign currency transactions converted?
The portal automatically converts foreign exchange using the OANDA mid-market exchange rate on the transaction date.

## Q3: What if I lose an itemized receipt?
For expenses over $25 where a receipt is unavailable, an Affidavit of Lost Receipt must be signed by the employee and approved by the department VP.`
  }
};

// ── Tokenizer & Keyword Match Engine ──
export function tokenizeText(text) {
  return new Set(
    (text || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2)
  );
}

// ── 3 Curated Tools Implementation ──
export function listDocsTool() {
  return Object.values(POLICY_DOCUMENTS).map(doc => ({
    doc_name: doc.doc_name,
    title: doc.title,
    effective: doc.effective,
    summary: doc.summary
  }));
}

export function searchDocsTool(query) {
  const queryTokens = tokenizeText(query);
  if (!queryTokens.size) return [];

  const chunks = [];
  Object.values(POLICY_DOCUMENTS).forEach(doc => {
    const sections = doc.text.split(/(?=^##\s+)/m);
    sections.forEach((secText, idx) => {
      const headerMatch = secText.match(/^##\s+(.+)$/m);
      const sectionName = headerMatch ? headerMatch[1] : (idx === 0 ? "Overview" : `Section ${idx}`);
      const secTokens = tokenizeText(secText);

      let score = 0;
      queryTokens.forEach(t => {
        if (secTokens.has(t)) score += 1;
      });

      if (score > 0) {
        let snippet = secText.replace(/\n+/g, " ").trim();
        if (snippet.length > 380) {
          snippet = snippet.substring(0, 375).trim() + "...";
        }
        chunks.push({
          doc_name: doc.doc_name,
          title: doc.title,
          section: sectionName,
          snippet,
          score: score + (doc.title.toLowerCase().includes(query.toLowerCase()) ? 1.5 : 0)
        });
      }
    });
  });

  chunks.sort((a, b) => b.score - a.score);
  return chunks.slice(0, 3);
}

export function readDocTool(docName) {
  const cleanName = (docName || "").trim().toLowerCase();
  const foundKey = Object.keys(POLICY_DOCUMENTS).find(k => k.toLowerCase() === cleanName);
  if (!foundKey) {
    const valid = Object.keys(POLICY_DOCUMENTS).join(", ");
    return `Unknown document: "${docName}". Valid documents: ${valid}`;
  }
  return POLICY_DOCUMENTS[foundKey].text;
}

// ============================================================================
// 4 REAL-WORLD AGENTIC SCENARIOS & STEP-BY-STEP SIMULATION TRACES
// ============================================================================

export const AGENTIC_SCENARIOS = [
  {
    id: "berlin_conference",
    title: "Scenario 1: Conference Hotel Above Cap in Berlin",
    persona: "Employee attending tech conference in Berlin",
    query: "I am attending a conference in Berlin. The conference organizer lists an official hotel, but the nightly rate is above the normal hotel cap. Can I book that hotel, and what approval do I need before booking?",
    totalTurns: 6,
    finalAnswer: "Yes, you are permitted to book the official conference hotel even if it exceeds the standard Berlin cap ($280/night), provided you provide a practical business justification (e.g. networking/venue integration) as outlined in conference_guidelines.md.\n\nApproval Requirements:\n1. Manager Pre-Approval is required prior to booking because the hotel rate exceeds standard caps (approval_matrix.md).\n2. If total trip cost exceeds $2,000, Director sign-off is also required (approval_matrix.md).\n3. Advance Notice: Because this is an international conference, your travel request must be submitted and fully approved at least 14 calendar days prior to departure (policy_updates_2026.md).",
    citations: ["conference_guidelines.md#Sec2", "travel_policy.md#Sec2", "approval_matrix.md#Sec1-2", "policy_updates_2026.md#Sec1"],
    standardRAGFailureReason: "Standard Single-Shot Top-3 RAG retrieved snippets from travel_policy.md and conference_guidelines.md, but completely missed the 14-day international advance notice rule in policy_updates_2026.md because it lacked keyword overlap with 'hotel cap'.",
    turns: [
      {
        turn: 1,
        tool: "search_docs('conference hotel above cap Berlin approval')",
        icon: "🔍",
        type: "search",
        color: "#C47A6A",
        thought: "I will search the policy corpus for conference hotel exceptions and approval rules in Berlin.",
        input: { query: "conference hotel above cap Berlin approval" },
        output: [
          { doc_name: "conference_guidelines.md", section: "2. Lodging & Official Conference Hotels", snippet: "Exception: When attending an approved conference where the organizer has an official host hotel, employees may book it above standard caps with business justification." },
          { doc_name: "travel_policy.md", section: "2. Standard Nightly Lodging Caps", snippet: "Tier 2 Major Metro Cities (Berlin, Paris, Singapore): Max $280 / night." }
        ],
        decision: "I found that official conference hotels are an allowed exception, but I need to know the exact approval matrix and any recent policy amendments.",
        tokensPrompt: 480,
        tokensCompletion: 85,
        latencyMs: 310
      },
      {
        turn: 2,
        tool: "list_docs()",
        icon: "📋",
        type: "list",
        color: "#3A9B9F",
        thought: "Let me inspect the full list of available documents to find the governance and update policies.",
        input: {},
        output: listDocsTool(),
        decision: "I see 'approval_matrix.md' and 'policy_updates_2026.md'. I need to deep-read both to verify approval thresholds and any recent 2026 amendments.",
        tokensPrompt: 720,
        tokensCompletion: 95,
        latencyMs: 240
      },
      {
        turn: 3,
        tool: "read_doc('conference_guidelines.md')",
        icon: "📖",
        type: "read",
        color: "#7A6BA8",
        thought: "Reading full conference guidelines to confirm justification prerequisites and cross-references.",
        input: { doc_name: "conference_guidelines.md" },
        output: POLICY_DOCUMENTS["conference_guidelines.md"].text,
        decision: "Confirmed: Section 2 allows official hotel with business benefit. Cross-references approval_matrix.md and policy_updates_2026.md.",
        tokensPrompt: 1150,
        tokensCompletion: 120,
        latencyMs: 390
      },
      {
        turn: 4,
        tool: "read_doc('approval_matrix.md')",
        icon: "📖",
        type: "read",
        color: "#7A6BA8",
        thought: "Reading approval matrix to identify spending tiers and override thresholds.",
        input: { doc_name: "approval_matrix.md" },
        output: POLICY_DOCUMENTS["approval_matrix.md"].text,
        decision: "Found: Any lodging over standard cap requires Manager Pre-Approval in writing. Total trips >$2,000 require Director sign-off (Tier C).",
        tokensPrompt: 1540,
        tokensCompletion: 130,
        latencyMs: 370
      },
      {
        turn: 5,
        tool: "read_doc('policy_updates_2026.md')",
        icon: "📖",
        type: "read",
        color: "#7A6BA8",
        thought: "Checking 2026 policy updates for international travel timing constraints.",
        input: { doc_name: "policy_updates_2026.md" },
        output: POLICY_DOCUMENTS["policy_updates_2026.md"].text,
        decision: "Found critical requirement: Effective Jan 1 2026, international conference travel must be submitted at least 14 calendar days in advance. All evidence gathered.",
        tokensPrompt: 1980,
        tokensCompletion: 140,
        latencyMs: 380
      },
      {
        turn: 6,
        tool: "generate_grounded_answer()",
        icon: "✅",
        type: "answer",
        color: "#3A9B9F",
        thought: "I have gathered sufficient evidence across 4 distinct policy documents. I will now synthesize the grounded final answer with citations.",
        input: { confidence: 0.98, citations_count: 4 },
        output: "Synthesized multi-clause cited answer covering exception approval, Director threshold, and the 14-day advance notice rule.",
        decision: "Complete answer synthesized with 100% policy grounding.",
        tokensPrompt: 2320,
        tokensCompletion: 280,
        latencyMs: 520
      }
    ]
  },

  {
    id: "remote_work_relocation",
    title: "Scenario 2: Temporary International Remote Work & Tax Caps",
    persona: "Senior Software Engineer requesting 6-week work from Spain",
    query: "Can I work remotely from Spain for 6 weeks during the summer, and what approvals do I need?",
    totalTurns: 4,
    finalAnswer: "No, you cannot work remotely from Spain for the full 6 weeks (42 days). \n\nPolicy Constraints:\n1. 30-Day Hard Limit: The Global Remote Work Policy limits temporary international Work-From-Anywhere (WFA) to a maximum of 30 calendar days per rolling 12-month period to avoid permanent establishment corporate tax liabilities (remote_work_policy.md#Sec1).\n2. Remediated Plan: You may work remotely from Spain for up to 4 weeks (28-30 days) with direct Manager approval.\n3. Advance Submission: Remote work travel crossing international hubs must be submitted at least 14 days in advance (policy_updates_2026.md#Sec3).",
    citations: ["remote_work_policy.md#Sec1", "policy_updates_2026.md#Sec3", "approval_matrix.md#Sec1"],
    standardRAGFailureReason: "Standard RAG retrieved that remote work is permitted, but failed to connect the 30-day tax nexus limitation with the requested 6-week (42-day) duration.",
    turns: [
      {
        turn: 1,
        tool: "search_docs('remote work Spain international 6 weeks')",
        icon: "🔍",
        type: "search",
        color: "#C47A6A",
        thought: "Searching for international remote work duration limits and country eligibility.",
        input: { query: "remote work Spain international 6 weeks" },
        output: [
          { doc_name: "remote_work_policy.md", section: "1. Temporary Work from Anywhere (WFA)", snippet: "Full-time employees may work from an approved secondary domestic or international location for up to 30 calendar days per rolling 12-month period." }
        ],
        decision: "The snippet clearly indicates a 30-calendar-day cap. 6 weeks equals 42 days, which violates the 30-day limit. Need to check full doc and tax rules.",
        tokensPrompt: 450,
        tokensCompletion: 80,
        latencyMs: 290
      },
      {
        turn: 2,
        tool: "read_doc('remote_work_policy.md')",
        icon: "📖",
        type: "read",
        color: "#7A6BA8",
        thought: "Reading entire remote work policy to verify if extensions or exceptions exist for EU countries.",
        input: { doc_name: "remote_work_policy.md" },
        output: POLICY_DOCUMENTS["remote_work_policy.md"].text,
        decision: "Confirmed: 30 days is a hard statutory cap due to tax nexus risk. Prohibited jurisdictions rule does not apply to Spain, but duration is capped.",
        tokensPrompt: 980,
        tokensCompletion: 110,
        latencyMs: 340
      },
      {
        turn: 3,
        tool: "read_doc('policy_updates_2026.md')",
        icon: "📖",
        type: "read",
        color: "#7A6BA8",
        thought: "Checking Section 3 of 2026 policy updates on remote work entity code routing.",
        input: { doc_name: "policy_updates_2026.md" },
        output: POLICY_DOCUMENTS["policy_updates_2026.md"].text,
        decision: "Verified filing requirements through primary entity code. Evidence complete.",
        tokensPrompt: 1420,
        tokensCompletion: 95,
        latencyMs: 330
      },
      {
        turn: 4,
        tool: "generate_grounded_answer()",
        icon: "✅",
        type: "answer",
        color: "#3A9B9F",
        thought: "Synthesizing answer clearly stating why 6 weeks cannot be approved and offering the 30-day maximum alternative.",
        input: { confidence: 0.99, citations_count: 3 },
        output: "Generated answer with tax nexus rationale and 30-day actionable alternative.",
        decision: "Delivered accurate compliance verdict.",
        tokensPrompt: 1750,
        tokensCompletion: 210,
        latencyMs: 440
      }
    ]
  },

  {
    id: "lost_receipt_emergency",
    title: "Scenario 3: Lost Expense Receipt & VP Escalation",
    persona: "Sales Director submitting $450 client dinner expense without receipt",
    query: "I lost the itemized receipt for a $450 client dinner during a business trip. Can I still be reimbursed, and who needs to approve it?",
    totalTurns: 3,
    finalAnswer: "Yes, you can still be reimbursed for the $450 client dinner without an original itemized receipt, subject to the following mandatory procedure:\n\n1. Affidavit Requirement: Because the unreceipted amount exceeds $25, you must complete and sign an official Affidavit of Lost Receipt (faq.md#Q3).\n2. Executive Approval: For lost receipts over $25, the affidavit must be formally approved and signed off by your department Vice President (VP) prior to expense reimbursement (faq.md#Q3).\n3. Submission Deadline: Ensure the full report is submitted within 21 calendar days of the trip conclusion (faq.md#Q1).",
    citations: ["faq.md#Q3", "faq.md#Q1", "approval_matrix.md#Sec1"],
    standardRAGFailureReason: "Standard RAG found the 21-day submission deadline in FAQ but missed the specific $25 VP affidavit escalation clause.",
    turns: [
      {
        turn: 1,
        tool: "search_docs('lost receipt client dinner reimbursement')",
        icon: "🔍",
        type: "search",
        color: "#C47A6A",
        thought: "Searching for lost receipt procedures and dollar threshold escalations.",
        input: { query: "lost receipt client dinner reimbursement" },
        output: [
          { doc_name: "faq.md", section: "Q3: What if I lose an itemized receipt?", snippet: "For expenses over $25 where a receipt is unavailable, an Affidavit of Lost Receipt must be signed by the employee and approved by the department VP." }
        ],
        decision: "Found exact clause in FAQ.md. Let me read the full FAQ to check submission timelines.",
        tokensPrompt: 410,
        tokensCompletion: 75,
        latencyMs: 260
      },
      {
        turn: 2,
        tool: "read_doc('faq.md')",
        icon: "📖",
        type: "read",
        color: "#7A6BA8",
        thought: "Reading full FAQ document to confirm reimbursement deadline and currency conversion.",
        input: { doc_name: "faq.md" },
        output: POLICY_DOCUMENTS["faq.md"].text,
        decision: "Confirmed: 21 calendar day submission window + VP signed affidavit for expenses >$25.",
        tokensPrompt: 820,
        tokensCompletion: 90,
        latencyMs: 310
      },
      {
        turn: 3,
        tool: "generate_grounded_answer()",
        icon: "✅",
        type: "answer",
        color: "#3A9B9F",
        thought: "Synthesizing precise answer with Affidavit of Lost Receipt steps and VP approval citation.",
        input: { confidence: 0.99, citations_count: 2 },
        output: "Generated answer with 3-step action plan for VP affidavit submission.",
        decision: "Delivered exact grounded workflow.",
        tokensPrompt: 1140,
        tokensCompletion: 160,
        latencyMs: 390
      }
    ]
  },

  {
    id: "home_office_setup",
    title: "Scenario 4: Ergonomic Equipment Stipend & Replacement",
    persona: "Remote Engineer seeking second monitor and chair upgrade after 18 months",
    query: "I joined 18 months ago. Can I use the $600 home office stipend to buy a new ergonomic chair and second monitor?",
    totalTurns: 3,
    finalAnswer: "No, you cannot claim a new $600 stipend at this time.\n\nPolicy Rules:\n1. One-Time Setup: The $600 home office equipment stipend is a one-time benefit provided upon hiring (remote_work_policy.md#Sec3).\n2. 24-Month Replacement Window: Equipment replacement stipends require at least 24 months of tenure from initial claim, plus direct Manager sign-off (remote_work_policy.md#Sec3).\n3. Actionable Next Step: You will become eligible to request replacement equipment in 6 months (at the 24-month mark).",
    citations: ["remote_work_policy.md#Sec3", "approval_matrix.md#Sec1"],
    standardRAGFailureReason: "Standard RAG matched the phrase '$600 ergonomic workspace setup stipend' but failed to enforce the 24-month tenure gate against the user's 18-month tenure.",
    turns: [
      {
        turn: 1,
        tool: "search_docs('home office equipment stipend ergonomic replacement')",
        icon: "🔍",
        type: "search",
        color: "#C47A6A",
        thought: "Searching for remote home office equipment stipend eligibility and replacement frequency.",
        input: { query: "home office equipment stipend ergonomic replacement" },
        output: [
          { doc_name: "remote_work_policy.md", section: "3. Home Office Equipment", snippet: "Remote employees receive a one-time $600 ergonomic workspace setup stipend upon hiring. Replacements require Manager sign-off after 24 months." }
        ],
        decision: "The clause states replacement requires 24 months. The employee has only been at company for 18 months (6 months remaining).",
        tokensPrompt: 430,
        tokensCompletion: 80,
        latencyMs: 270
      },
      {
        turn: 2,
        tool: "read_doc('remote_work_policy.md')",
        icon: "📖",
        type: "read",
        color: "#7A6BA8",
        thought: "Confirming full context of home office equipment guidelines in remote work policy.",
        input: { doc_name: "remote_work_policy.md" },
        output: POLICY_DOCUMENTS["remote_work_policy.md"].text,
        decision: "Confirmed: 18 months is ineligible. Must wait until 24 months tenure.",
        tokensPrompt: 860,
        tokensCompletion: 85,
        latencyMs: 310
      },
      {
        turn: 3,
        tool: "generate_grounded_answer()",
        icon: "✅",
        type: "answer",
        color: "#3A9B9F",
        thought: "Synthesizing answer explaining the 24-month rule and calculating remaining 6-month wait time.",
        input: { confidence: 0.99, citations_count: 2 },
        output: "Clear denial with timeline explanation (eligible in 6 months).",
        decision: "Delivered precise arithmetic and grounded policy explanation.",
        tokensPrompt: 1180,
        tokensCompletion: 170,
        latencyMs: 380
      }
    ]
  }
];

export const DESIGN_DECISIONS_EVALUATOR = [
  {
    id: "corpus_scale",
    title: "1. Document Corpus Scale",
    options: [
      { id: "small", label: "Small (5 - 50 documents)", score: "Agentic Loop (No embeddings needed, pure tool search)" },
      { id: "medium", label: "Medium (50 - 5,000 documents)", score: "Hybrid Agentic (BM25 + Dense Embeddings + Read Doc tool)" },
      { id: "massive", label: "Enterprise Scale (10,000+ docs)", score: "Hierarchical GraphRAG + Agentic Sub-Tool Routing" }
    ]
  },
  {
    id: "latency_sla",
    title: "2. Latency SLA Target",
    options: [
      { id: "subsecond", label: "Sub-Second (<800ms) Inline IDE/Chat", score: "Single-Shot RAG (Zero-Model Fast Router + Pre-computed vectors)" },
      { id: "balanced", label: "Interactive (<3.0s) Assistant", score: "Bounded Agentic Loop (max_turns = 3, fast keyword filter)" },
      { id: "deep_research", label: "Deep Research (<15s) Compliance/Audit", score: "Full Multi-Agent Orchestrator (max_turns = 12, multi-doc reasoning)" }
    ]
  },
  {
    id: "reasoning_complexity",
    title: "3. Query Cross-Referencing Complexity",
    options: [
      { id: "factoid", label: "Single-Hop Factoid ('What is daily per diem?')", score: "Standard Single-Shot RAG" },
      { id: "multi_hop", label: "Multi-Hop & Conflict Resolution ('Does 2026 update override cap?')", score: "Agentic RAG (Search ➔ Read ➔ Decide Loop)" },
      { id: "synthesis", label: "Global Aggregation ('List all policy changes across 6 docs')", score: "Listing Aggregation Dispatcher + Map-Reduce" }
    ]
  }
];
