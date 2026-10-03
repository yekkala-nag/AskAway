// ── Control plane for AI agents: capability vs authority — data & pure logic ──

export const PLANES = [
  {
    id: 'planning',
    name: 'Planning plane',
    color: '#5B4B8A',
    duty: 'Interpret the task, select among a small set of business-level tools, form a typed proposal, explain intent.',
    mustNot: 'Hold broad provider credentials — or decide the policy question “may this happen?”',
  },
  {
    id: 'control',
    name: 'Control plane',
    color: '#B4553A',
    duty: 'Authenticate the principal, resolve tenant/delegation, canonicalize and validate the action, evaluate risk/ownership/data policy, request approval or issue narrow short-lived authority, persist evidence.',
    mustNot: 'Trust the model’s natural-language intent — it decides on the canonical action, outside the LLM.',
  },
  {
    id: 'execution',
    name: 'Execution & observation plane',
    color: '#1A6B6E',
    duty: 'Broker invokes a constrained adapter with narrow credentials; a verifier reads the authoritative postcondition; states pending / unknown / failed / verified stay distinct; the audit ledger keeps the decision–effect trail.',
    mustNot: 'Treat a 200 response — or a mutable chat transcript — as the audit log.',
  },
];

export const FAILURE_EXAMPLE = {
  call: 'cancel_subscription(account_id, reason)',
  green: ['JSON is syntactically valid', 'API returned HTTP 200', 'trace shows a green tool span', 'no error anywhere'],
  reality: 'The account id came from an earlier message — the wrong account was canceled. Every check that exists (schema, authn, tool definition) passed; none of them asked whether this principal may cancel that subscription.',
};

export const NINE_STEPS = [
  { n: 1, name: 'Narrow, typed action contracts', detail: 'Business verbs — create_draft_invoice, queue_refund_review, send_approved_notice — never http_request, run_shell, or raw SQL. Schema carries side_effect_class, required_scopes, risk_tier, approval_mode, idempotency_requirement, verification_method. Schemas reduce ambiguity; they do not authorize.' },
  { n: 2, name: 'Separate authN, delegation, approval', detail: 'Do not hand the agent the user’s token — that converts a temporary request into ambient authority you cannot audit. Give agents their own attributable identity and model user-delegated vs agent-own authority as distinct concepts.' },
  { n: 3, name: 'Deterministic authorization', detail: 'Model emits ActionProposal → gateway validates → policy decision point returns allow / deny / approval_required → broker executes with constrained authority. Policy runs outside the LLM; nothing executes before the decision; a dispatch 200 is not success.' },
  { n: 4, name: 'Classify actions by consequence', detail: 'Autonomy is a property of actions, not of agents. The same agent can read a knowledge base automatically, draft in staging, and require human approval for production changes. Tier each action; escalate on risk signals; never auto-demote because the model sounds confident.' },
  { n: 5, name: 'Bind approval to the canonical action', detail: 'The approver sees the exact effect that will dispatch — recipient, target, amount, scope, irreversibility — not “please resolve this billing issue”. Approval binds to a digest; any change invalidates it; a one-time nonce blocks replay.' },
  { n: 6, name: 'Defend against prompt injection', detail: 'Provenance-label every item, partition untrusted content out of system instructions, quarantine-extract with a no-tool component, re-gate at execution, shrink blast radius to one short-lived credential. No classifier converts untrusted text into trusted instruction.' },
  { n: 7, name: 'Uncertainty, retries, compensation', detail: 'Persist intended effect + idempotency key before dispatch; verify with authoritative read-back; surface unknown into a reconciliation queue instead of fabricating success. Retry, rollback, compensation, and reconciliation are four different operations.' },
  { n: 8, name: 'Decision / effect record', detail: 'Traces answer “how did it run”; audit evidence answers “who is accountable”. Record run.started → action.proposed → policy.decided → approval.* → execution.* → effect.verified/unknown/failed → compensation, protected and tamper-evident.' },
  { n: 9, name: 'Evaluate the control plane', detail: 'Gate on contract conformance, authZ denial, approval invalidation, injection attack-success rate, egress canaries, duplicate-effect chaos tests, and whether humans notice material changes — not on whether the model’s answer “looks good”.' },
];

export const TIERS = [
  { tier: 'T0', name: 'Observe', scope: 'Read approved/public information; local classification', posture: 'Typed read contract, least privilege, rate limits, logging' },
  { tier: 'T1', name: 'Draft', scope: 'Create a draft or agent-owned staging artifact', posture: 'Scoped staging write, provenance, version record, later review' },
  { tier: 'T2', name: 'Reversible internal', scope: 'Update one authorized internal record; queue a bounded workflow', posture: 'Policy check, idempotency key, postcondition read, compensation path' },
  { tier: 'T3', name: 'High impact', scope: 'External message, production change, payment/refund, access change', posture: 'Exact-action human approval, short-lived narrow authority, egress controls' },
  { tier: 'T4', name: 'Critical / systemic', scope: 'High-value transfer, destructive bulk action, root identity change', posture: 'Default deny for autonomous commit; human-operated runbook, independent approval, dry run' },
];

const BASE_TIER = {
  read_only: 0,
  draft: 1,
  reversible_write: 2,
  external: 3,
  irreversible: 4,
};

export function evaluateTier({ sideEffect, identityInferred = false, untrustedInfluenced = false, crossTenantOrBulk = false, verified = true }) {
  let tier = BASE_TIER[sideEffect] ?? 2;
  const reasons = [`base tier from side_effect_class "${sideEffect}" → T${tier}`];
  const escalate = (cond, why) => {
    if (cond && tier < 4) {
      tier += 1;
      reasons.push(`escalated → T${tier}: ${why}`);
    }
  };
  escalate(identityInferred, 'target identity was inferred, not explicitly selected');
  escalate(untrustedInfluenced, 'untrusted content materially influenced the action');
  escalate(!verified, 'no idempotency mechanism or authoritative verification path');
  escalate(crossTenantOrBulk, 'scope is cross-tenant, bulk, external, or production-critical');

  const posture = tier <= 1 ? 'auto (policy check + logging)'
    : tier === 2 ? 'policy check + idempotency + postcondition read'
    : tier === 3 ? 'exact-action human approval required'
    : 'default deny for autonomous commit — human-operated runbook';
  return { tier, label: `T${tier}`, posture, reasons, neverDemote: 'model confidence never lowers a tier' };
}

export const APPROVAL_FIELDS = [
  'Action name and schema version',
  'Tenant, principal, agent-run, and executor identities',
  'Resolved target/resource and consequential parameters',
  'Risk tier and the policy version that required approval',
  'Digest/hash of the canonical action and resource version',
  'Approver identity, role, decision, time, expiry, reason',
  'One-time nonce so an approval cannot be silently replayed',
];

export const AUDIT_EVENTS = [
  { event: 'run.started', carries: 'initiating principal, model/version, session, tenant, trace id' },
  { event: 'context.ingested', carries: 'source, trust class, hash/reference, guardrail result' },
  { event: 'action.proposed', carries: 'action + schema version, normalized parameters, risk calculation' },
  { event: 'policy.decided', carries: 'allow/deny/approval-required, policy version, rules applied' },
  { event: 'approval.requested / approval.decided', carries: 'canonical digest, approver, role, decision, expiry' },
  { event: 'execution.dispatched / acknowledged', carries: 'executor identity, idempotency key, provider receipt' },
  { event: 'effect.verified / unknown / failed', carries: 'verification method, observed state, error class' },
  { event: 'compensation', carries: 'original action, new authorization, outcome' },
];

export const UNTRUSTED_DEFENSES = [
  { defense: 'Provenance labels', detail: 'Every item marked: system instruction / trusted data / user input / external untrusted / tool output' },
  { defense: 'Partitioned context', detail: 'Untrusted content never concatenated into developer or system instructions — presented as data in a separate field' },
  { defense: 'Quarantine extraction', detail: 'A no-tool, no-secret component pulls a narrow typed summary before the privileged planner sees it' },
  { defense: 'Deterministic gate', detail: 'Schema, authorization, egress policy, recipient constraints, and approval rechecked at the execution boundary' },
  { defense: 'Blast-radius limit', detail: 'Executor gets one short-lived credential with limited network/file/data access for one action' },
  { defense: 'Attack-path tests', detail: 'Direct, indirect, encoded, multilingual, tool-output, and retrieval-injection examples in release evals' },
];

export const EVALS = [
  { family: 'Contract conformance', assertion: 'Extra, malformed, or cross-tenant fields never reach execution', gate: 'Deterministic tests: 100% pass' },
  { family: 'AuthN / AuthZ', assertion: 'An authenticated but unprivileged caller is denied', gate: 'Integration tests: 100% pass' },
  { family: 'Approval binding', assertion: 'Changing recipient/amount/resource version invalidates prior approval', gate: 'Integration tests: 100% pass' },
  { family: 'Tool selection', assertion: 'Only allowed business tools with canonical arguments', gate: 'Labelled cases; error rate tracked by tier' },
  { family: 'Prompt injection', assertion: 'Untrusted pages/docs/tool output cannot induce disallowed effects', gate: 'Attack-success + blast-radius tests' },
  { family: 'Data egress', assertion: 'Secrets and other tenants’ data cannot reach a connector', gate: 'Canary/DLP tests with denial evidence' },
  { family: 'Reliability', assertion: 'Timeouts, duplicates, and provider 5xx create no duplicate effects', gate: 'Chaos tests; duplicate-effect target = 0' },
  { family: 'Verification', assertion: 'HTTP 200 without postcondition becomes pending/unknown, never verified', gate: 'Simulated-provider suite' },
  { family: 'Human factors', assertion: 'Approvers detect material recipient/amount/scope changes', gate: 'Blinded usability/security review' },
];

export const CODE_PROPOSAL = `from pydantic import BaseModel, Literal
import hashlib, json

SideEffect = Literal["read_only", "draft", "reversible_write", "external", "irreversible"]

class ActionProposal(BaseModel):
    action_id: str
    schema_version: str
    side_effect_class: SideEffect
    parameters: dict
    principal: str
    tenant: str

def policy_decision(p: ActionProposal) -> tuple[str, str]:
    """Runs OUTSIDE the LLM. allow | deny | approval_required."""
    if p.side_effect_class == "read_only":
        return "allow", "T0 typed read"
    if p.side_effect_class == "draft":
        return "allow", "T1 staging write, provenance kept"
    if p.side_effect_class == "reversible_write":
        return "allow", "T2 + idempotency key + postcondition read"
    return "approval_required", "T3/T4: exact-action approval"

def canonical_digest(p: ActionProposal) -> str:
    # Approval binds to THIS digest: change a parameter, invalid approval.
    blob = json.dumps(p.model_dump(), sort_keys=True)
    return hashlib.sha256(blob.encode()).hexdigest()

def handle(proposal: dict) -> dict:
    p = ActionProposal(**proposal)              # schema gate
    verdict, why = policy_decision(p)           # deterministic, not generated
    if verdict == "approval_required":
        ask_approval(canonical_digest(p), p)    # human sees canonical effect
    if verdict == "deny":
        ledger.write("policy.decided", decision="deny", why=why)
        return {"status": "denied"}
    # Broker — not the planner — holds the constrained authority.
    return broker.execute(p, authority=scoped_credential(p, ttl_seconds=60))`;

export const CODE_STATEMACHINE = `# "Tool call succeeded" is not a business result.
from enum import Enum

class Effect(Enum):
    PENDING = "pending"        # dispatched, not yet verified
    UNKNOWN = "unknown"        # cannot establish outcome -> reconciliation queue
    FAILED = "failed"          # authoritative read says no effect
    VERIFIED = "verified"      # postcondition / signed receipt observed

def dispatch(action, idempotency_key):
    # Persist intent + key BEFORE dispatch. Key binds tenant + action +
    # canonical parameter digest — never a chat turn.
    ledger.write("execution.dispatched", key=idempotency_key)
    try:
        receipt = provider.call(action)
    except Timeout:
        return Effect.UNKNOWN           # provider may have committed anyway
    return verify(receipt)              # authoritative read-back, not the 200

def recover(state, action):
    if state is Effect.UNKNOWN:
        return reconcile(action)        # compare intent vs observed state
    if state is Effect.FAILED:
        return compensate(action)       # new forward action offsetting the old
    return state

# retry    = same intended effect, same key
# rollback = restore prior state inside a transactional boundary
# compensate = a NEW action offsetting a prior effect
# reconcile = compare intent with authoritative state`;
