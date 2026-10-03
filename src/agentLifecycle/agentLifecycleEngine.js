// ── Agent development lifecycle coordinated with the application — data & pure logic ──

export const SYSTEM_VIEW = {
  analogy: 'Complexity exists at more than one scale: an organism contains cells, an application contains an agent. Drawing the agent as one box hides the development problem inside it.',
  parts: [
    { part: 'Harness', duty: 'Coordinates model, memory, tools, sub-agents; assembles context; controls execution' },
    { part: 'Context', duty: 'Information for the current step' },
    { part: 'Memory', duty: 'Information retained for later retrieval — what was kept, retrieved, and how it reaches the model' },
    { part: 'Sub-agents', duty: 'Handoffs raise a new question: does evidence survive the move between parts?' },
    { part: 'Application (outside)', duty: 'Identity, authorization, operational controls — they remain even as agent internals change' },
  ],
  twoEvals: [
    { level: 'Agent evaluation', examines: 'The capability produced by the composition', question: 'Can the agent do the task, consistently?' },
    { level: 'Application evaluation', examines: 'Its results through the complete workflow', question: 'Did the system produce the right outcome?' },
  ],
};

export const LOOP_DECISION = [
  { return: 'Test/evaluate → Build', when: 'Evidence fits the current hypothesis', example: 'Improve the sub-agent handoff format and re-run the same evaluation' },
  { return: 'Test/evaluate → Plan', when: 'Evidence challenges the hypothesis or task decomposition', example: 'Question whether splitting the investigation was useful; compare against a single agent' },
];

export const VERIF_VAL = [
  { term: 'Verification', question: 'Did it conform to specified requirements?', example: 'A unit test verifies a tool reports missing data correctly' },
  { term: 'Validation', question: 'Is it suitable for the intended use and environment?', example: 'The agent may still interpret that correct result poorly' },
];

export const CAPABILITY_VS_REGRESSION = [
  { type: 'Capability evaluation', measures: 'Developing ability — is the new design better?', evidence: 'Evidence of gain on representative cases' },
  { type: 'Regression evaluation', measures: 'Protect established performance', evidence: 'Re-running agreed cases before any promotion' },
];

// ── Review-capacity calculator ──
export function reviewCapacity({ messagesPerDay, reviewSlots, inconclusivePct }) {
  const inconclusive = messagesPerDay * (inconclusivePct / 100);
  const used = inconclusive;
  const headroom = reviewSlots - used;
  const utilization = reviewSlots > 0 ? used / reviewSlots : Infinity;
  const maxRate = messagesPerDay > 0 ? (reviewSlots / messagesPerDay) * 100 : 0;
  let verdict;
  if (headroom < 0) verdict = 'OVER CAPACITY — the review queue grows every day; automation is quietly becoming a backlog.';
  else if (utilization > 0.85) verdict = 'TIGHT — under 15% headroom; any burst or referral spike overflows the queue.';
  else verdict = 'SUSTAINABLE — headroom exists for bursts and other referrals.';
  return { inconclusive, headroom, utilization, maxRate, verdict };
}

// ── pass@k vs all-k ──
export function attemptStats(k, perAttemptSuccess) {
  const p = perAttemptSuccess;
  const passAtK = 1 - Math.pow(1 - p, k);   // at least one success in k
  const allK = Math.pow(p, k);               // all k succeed
  return { passAtK, allK, k, p };
}

export const BEHAVIORAL_CONTRACT = [
  { field: 'Task + available evidence', case: 'Reputation data unavailable, no other evidence resolves the message' },
  { field: 'Permitted agent outcomes', case: 'Agent returns inconclusive — never a forced safe/malicious label' },
  { field: 'Expected application action', case: 'Send to human review; do not auto-release' },
  { field: 'Scoring rules', case: 'A confident-but-unsupported label fails the case, even if the label happens to be right' },
  { field: 'Follow-through', case: 'Repeated trials follow the case through the whole workflow — including failures of the review path' },
];

export const COORDINATION = [
  { practice: 'Consumer-driven expectations', detail: 'The application team supplies the expectations its workflow depends on; the agent team runs those cases against candidate changes' },
  { practice: 'Statistical acceptance up front', detail: 'Set acceptable error rates and required confidence level BEFORE testing; compare confidence bounds to the limits' },
  { practice: 'Promotion gate on every behavior change', detail: 'Run agreed cases before promoting prompts, context config, models, tools, or code — record versions with the results' },
  { practice: 'Growing integrated checks', detail: 'Start with a minimal working path through the application, expand as scope grows' },
  { practice: 'Shared release gate', detail: 'Release depends on evidence for the agreed operating scope from BOTH teams' },
  { practice: 'Defined decision rights', detail: 'Architect owns requirement allocation, interface meaning, cross-side change review; application owner is accountable for operational acceptance' },
];

export const DECISION_RIGHTS = [
  { role: 'System architect', owns: 'Requirement allocation, interface meaning, review of changes affecting both sides' },
  { role: 'Application owner', owns: 'Operational acceptance — whether the whole workflow is fit to run' },
  { role: 'Agent team', owns: 'Capability evidence: capability + regression evaluations, candidate changes' },
  { role: 'Both teams', owns: 'Changes to the behavioral contract itself' },
];

export const RISKS = [
  { cost: 'Repeated trials consume time and compute', mitigation: 'Automate routine cases; reserve joint decisions for requirement/interface/scope changes' },
  { cost: 'Shared cases need maintenance', mitigation: 'Start with cases that exercise the important interactions only' },
  { cost: 'An architect approving everything becomes a bottleneck', mitigation: 'Teams change freely inside agreed allocations' },
];

export const CODE_CONTRACT = `# Behavioral contract: integrated evaluation cases both teams maintain.
CASES = [
    {
        "id": "email-042-no-reputation",
        "evidence": {"reputation_data": None, "headers": "clean", "links": "none"},
        "allowed_agent_outcomes": ["inconclusive"],
        "expected_app_action": "human_review",
        "forbidden": ["auto_release", "forced_safe_label"],
        "score": lambda outcome, action: outcome == "inconclusive" and action == "human_review",
    },
]

def run_case(case, agent, app_workflow, trials=50, max_failure_rate=0.02, confidence=0.95):
    """Acceptance: upper confidence bound on the failure rate must sit
    below the agreed limit BEFORE the case counts as passing."""
    failures = sum(not _once(case, agent, app_workflow) for _ in range(trials))
    rate = failures / trials
    upper = _clopper_pearson_upper(rate, trials, confidence)   # or Wilson bound
    return {"rate": rate, "upper_bound": upper, "pass": upper <= max_failure_rate}

# Readiness needs repeated trials with recorded configuration, scoring
# criteria, and uncertainty — a few familiar cases never establish
# coverage of unfamiliar ones.`;

export const CODE_GATES = `# Narrow deployment while evidence accumulates: shadow mode first.
def release_gate(contract_cases, scope):
    results = [run_case(c, agent, workflow) for c in contract_cases]
    failing = [r for r in results if not r["pass"]]
    if failing:
        return {"promote": False, "reason": "contract cases failing", "detail": failing}
    if scope == "shadow":
        # record proposed actions without executing them; analyst reviews
        return {"promote": "shadow", "monitor": ["proposed_action_rate", "review_outcomes"]}
    if scope == "analyst_review":
        return {"promote": "analyst_review", "widen_when": "evidence accumulates over agreed window"}
    return {"promote": True, "monitor_to_dev": True}   # failures and new
    # cases flow back to development — monitoring feeds both cycles`;
