// ============================================================================
// HANDOFF WATCHDOG ENGINE (Intermediate State Evals)
// Plausible-but-wrong handoffs: grade seams, not just final text
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const SILENT_FAILURES = [
  { shape: "Empty 200", detail: "Billing API returns 200 with zero records (bad account ID upstream)", downstream: "Drafts 'nothing to refund' email — polite, wrong, shipped" },
  { shape: "Default fallback", detail: "Service can't match input, returns well-formed defaults", downstream: "Next node treats defaults as real lookup results" },
  { shape: "ID mismatch", detail: "Payload account_id ≠ requested account_id", downstream: "Decision made for the wrong customer" },
  { shape: "Stale lookup", detail: "Cached result predates a superseding event", downstream: "Acts on a world that moved on" }
];

export const WHY_EVALS_MISS = [
  { check: "Tone skim", sees: "Polite, grammatical email", misses: "Zero-record payload two hops back" },
  { check: "Final-text rubric", sees: "Clear, on-topic resolution", misses: "Trajectory: where corruption entered" },
  { check: "Golden-answer diff", sees: "Close to reference wording", misses: "Semantically garbage intermediate state" }
];

export const WATCHDOG_RULES = [
  { rule: "Schema the handoff (Pydantic)", why: "Grader needs something concrete, not fresh guesses per call" },
  { rule: "One narrow question", why: "plausible? + confidence — cheap enough for the critical path" },
  { rule: "Confidence floor 0.35", why: "Below it, plausible counts as implausible (tuned by false-halt rate)" },
  { rule: "Fail closed on garbage", why: "Unparseable grader output blocks — never shrugs through" },
  { rule: "Gate before external acts", why: "Email/record/refund boundaries pay for the extra hop" }
];

export const WATCHDOG_COSTS = [
  { cost: "Latency", detail: "2 extra inference calls on a 3-node path — hurts realtime" },
  { cost: "False halts", detail: "Miscalibrated watchdog trades silent corruption for manual triage" },
  { cost: "Judgment", detail: "Only gate where being-wrong cost beats the extra hop" }
];

// ── Simulator: grade a handoff ──────────────────────────────────────────────
export const GRADE_HANDOFF = (scenario = "empty200", floor = 0.35) => {
  const cases = {
    valid: { idMatch: true, emptyActive: false, graderConf: 0.91, shape: "Full records, IDs match" },
    empty200: { idMatch: true, emptyActive: true, graderConf: 0.88, shape: "200 OK, zero records, subscription ACTIVE" },
    idmismatch: { idMatch: false, emptyActive: false, graderConf: 0.93, shape: "Well-formed payload, wrong account_id" },
    lowconf: { idMatch: true, emptyActive: false, graderConf: 0.22, shape: "Unusual but possibly valid edge case" }
  };
  const c = cases[scenario];
  const hardFail = !c.idMatch || c.emptyActive;
  const pass = !hardFail && c.graderConf >= floor;
  return {
    scenario, shape: c.shape, floor,
    verdict: pass ? "PASS — forward to drafting node" : "HALT — HandoffRejectedError, alert with payload attached",
    reason: !c.idMatch ? "account_id mismatch (requested ≠ payload)"
      : c.emptyActive ? "empty billing_records on ACTIVE subscription (fallback smell)"
      : c.graderConf < floor ? `grader confidence ${c.graderConf} below floor ${floor} (fail closed)` : "IDs match, records present, confidence above floor",
    lesson: scenario === "lowconf" && !pass ? "Floor tuning is real work: staging false-halts set it, not theory."
      : scenario === "lowconf" ? "Lowered floor lets an edge case through — watch what it costs."
      : "Output-level eval would have shipped all four shapes."
  };
};

export const PYTHON_WATCHDOG_CODE = `# ============================================================================
# INTERMEDIATE STATE EVALS: schema + narrow grader + gate
# ============================================================================
from pydantic import BaseModel, Field
import logging
logger = logging.getLogger("pipeline.handoff")

CONFIDENCE_FLOOR = 0.35   # tuned by staging false-halt rate, not theory

class AccountHistoryPayload(BaseModel):
    account_id: str
    subscription_status: str
    billing_records: list = Field(default_factory=list)
    lookup_source: str     # which system answered — often the only clue

class HandoffVerdict(BaseModel):
    is_plausible: bool
    reason: str
    confidence: float

class HandoffRejectedError(Exception):
    pass

def grade_handoff(request_account_id: str, payload: AccountHistoryPayload, local_grader) -> HandoffVerdict:
    prompt = (f"Downstream agent is about to receive: {payload.model_dump_json()} "
              f"requested for account_id={request_account_id}. "
              f"Reply ONLY JSON: is_plausible/reason/confidence. "
              f"Flag ID mismatch, empty records on ACTIVE subs, fallback-shaped data.")
    try:
        verdict = HandoffVerdict.model_validate_json(local_grader(prompt))
    except ValueError:
        return HandoffVerdict(is_plausible=False, reason="grader output unparseable", confidence=0.0)
    if not verdict.is_plausible or verdict.confidence < CONFIDENCE_FLOOR:
        logger.warning("Handoff rejected: %s (%.2f)", verdict.reason, verdict.confidence)
    return verdict

def run_pipeline(account_id: str, account_data: dict, local_grader):
    payload = AccountHistoryPayload(**account_data)
    verdict = grade_handoff(account_id, payload, local_grader)
    if not verdict.is_plausible:
        raise HandoffRejectedError(f"{account_id}: {verdict.reason}")
    return payload  # safe for the drafting node
`;
