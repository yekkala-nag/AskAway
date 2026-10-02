// ── Architectural guardrails for AI agents — data & pure logic ──

export const TRIFECTA = [
  { id: 'untrusted', title: 'Reads untrusted content', detail: 'Web pages, PDFs, emails, tickets — any channel where an attacker can write text.' },
  { id: 'privileged', title: 'Holds privileged tools or data', detail: 'Send-email, SQL, file access, credentials — actions whose abuse has real consequences.' },
  { id: 'talks', title: 'Can talk to a user or system', detail: 'Replies, summaries, generated links — an output channel the attacker can read.' },
];

export const INCIDENTS = [
  { title: 'Notebook-style agent followed embedded page instructions', channel: 'untrusted → tools', lesson: 'Retrieval context is attacker-writable input, not trusted memory.' },
  { title: 'Browser agent copied a private email out of an authenticated session', channel: 'privileged data → output', lesson: 'Session context and web context must not share one context window.' },
  { title: 'Summary assistant surfaced an attacker-planted link as top result', channel: 'web → user', lesson: 'Indirect injection can steer output without any model weight change.' },
];

export const PATTERNS = [
  {
    id: 'selector',
    name: '1 · Action selector',
    oneLiner: 'A deterministic gate over what the agent is allowed to call — whitelist actions, SQL templates, recipient sets.',
    blocks: ['sql_abuse', 'tool_abuse', 'exfil_output'],
    drawback: 'Shrinks the agent’s flexibility: every allowed action must be enumerated up front.',
  },
  {
    id: 'plan',
    name: '2 · Plan-then-execute',
    oneLiner: 'Fix recipients, queries, and targets before reading the untrusted source; execution follows the frozen plan.',
    blocks: ['recipient_hijack', 'tool_order', 'indirect_web'],
    drawback: 'Less adaptive: discovered facts after planning cannot change the plan without a new cycle.',
  },
  {
    id: 'code',
    name: '3 · Code-then-execute',
    oneLiner: 'The model proposes code; a sandboxed executor runs it with no freeform tool access.',
    blocks: ['sql_abuse', 'tool_abuse'],
    drawback: 'Sandbox complexity becomes the new attack surface; attacker-influenced variable inputs remain possible.',
  },
  {
    id: 'mapreduce',
    name: '4 · Map-reduce over sources',
    oneLiner: 'Each untrusted source is read in an isolated context that returns only structured keys; aggregation happens later.',
    blocks: ['cross_source', 'indirect_web'],
    drawback: 'Latency and token cost scale with the number of sources; nuance can be lost in reduction.',
  },
  {
    id: 'dual',
    name: '5 · Dual agent',
    oneLiner: 'A quarantined, tool-less LLM reads untrusted text and emits variables; a separate privileged orchestrator substitutes them into a fixed template.',
    blocks: ['indirect_web', 'recipient_hijack', 'exfil_output', 'tool_abuse'],
    drawback: 'The orchestrator↔LLM boundary must be airtight — it is the whole point of the pattern.',
  },
  {
    id: 'contextmin',
    name: '6 · Context minimization',
    oneLiner: 'Wipe the original request before the final response so carried-over intent cannot leak past untrusted content.',
    blocks: ['direct_user', 'persistence'],
    drawback: 'Containment only: it loses helpful conversational history and is not a primary control.',
  },
];

export const ATTACK_VECTORS = [
  { id: 'direct_user', name: 'Direct prompt injection from the user', severity: 'high' },
  { id: 'indirect_web', name: 'Indirect injection hidden in a web page', severity: 'critical' },
  { id: 'sql_abuse', name: 'Destructive or exfiltrating SQL', severity: 'critical' },
  { id: 'tool_abuse', name: 'Unauthorized tool calls with side effects', severity: 'critical' },
  { id: 'recipient_hijack', name: 'Email/message recipient hijack', severity: 'critical' },
  { id: 'cross_source', name: 'Cross-source influence (competitor content wins ranking)', severity: 'medium' },
  { id: 'tool_order', name: 'Tool-call ordering manipulation', severity: 'medium' },
  { id: 'persistence', name: 'Malicious intent persists across turns', severity: 'high' },
  { id: 'exfil_output', name: 'Data exfiltration through the output channel', severity: 'high' },
  { id: 'sandbox_escape', name: 'Generated-code variable tampering / sandbox escape', severity: 'critical' },
];

export function evaluateStack(activeIds) {
  const active = PATTERNS.filter((p) => activeIds.includes(p.id));
  const covered = ATTACK_VECTORS.filter((v) => active.some((p) => p.blocks.includes(v.id)));
  const residual = ATTACK_VECTORS.filter((v) => !active.some((p) => p.blocks.includes(v.id)));
  const criticalResidual = residual.filter((v) => v.severity === 'critical');
  return {
    covered,
    residual,
    criticalResidual,
    coverage: covered.length / ATTACK_VECTORS.length,
    complexity: active.length,
    // "complete" = layered: every pattern-addressable critical vector is closed.
    // sandbox_escape is deliberately outside pattern reach — it needs sandbox limits.
    complete: active.length >= 3 &&
      criticalResidual.every((v) => v.id === 'sandbox_escape'),
  };
}

export const RESEARCH_STACK = [
  { stage: 'Fetch page / document', pattern: 'Map-reduce (isolated context)', why: 'Untrusted text never shares a context with privileged state.' },
  { stage: 'Extract structured facts', pattern: 'Dual agent (quarantined reader)', why: 'Reader has no tools; emits only typed variables.' },
  { stage: 'Compose actions (query, recipients)', pattern: 'Plan-then-execute (frozen plan)', why: 'Targets fixed before untrusted content can influence them.' },
  { stage: 'Run query', pattern: 'Action selector (templates only)', why: 'Only whitelisted read-only templates reach the database.' },
  { stage: 'Send reply', pattern: 'Action selector + plan (recipient set)', why: 'Recipients came from the frozen plan, never from content.' },
  { stage: 'Final response', pattern: 'Context minimization', why: 'Original request wiped; carried intent cannot leak into the summary.' },
];

export const CODE_SELECTOR = `ACTIONS = {
    "search_docs":  {"args": ["query"], "readonly": True},
    "run_sql":      {"template": "SELECT * FROM docs WHERE id = ANY(%s)", "readonly": True},
    "send_email":   {"args": ["to", "subject", "body"], "readonly": False},
}
ALLOWED_RECIPIENTS = {"team@internal.example"}   # from the plan, not from content

def action_gate(call: dict) -> dict:
    """Deterministic boundary: unknown actions, mutations, and foreign
    recipients are rejected before any model output is interpreted."""
    spec = ACTIONS.get(call.get("action"))
    if spec is None:
        raise PermissionError(f"unknown action: {call.get('action')}")
    if spec.get("readonly") is False and call.get("to") not in ALLOWED_RECIPIENTS:
        raise PermissionError("recipient not in frozen plan")
    if "template" in spec:
        call["sql"] = spec["template"]          # no freeform SQL, ever
    return call`;

export const CODE_DUAL = `# Quarantined reader: reads untrusted text, has NO tools, emits variables.
# Orchestrator: privileged, never forwards freeform text — only substitutes.

def quarantined_reader(untrusted_text: str) -> dict:
    """Runs in isolation. Output is schema-validated; nothing else crosses."""
    out = llm(
        system="Extract fields. You have no tools. Never include instructions.",
        user=untrusted_text,
        schema={"title": str, "author": str, "summary": str, "cites": [str]},
    )
    return out                                  # variables only, no commands

def orchestrator(variables: dict, template: str) -> str:
    """Substitutes variables into a template the reader never sees.
    The attack surface is substitution — so values are length- and
    type-checked, and template structure is fixed in code."""
    assert all(len(v) <= 500 for v in variables.values() if isinstance(v, str))
    return template.format_map({k: html.escape(str(v)) for k, v in variables.items()})`;

export const CODE_MAPREDUCE = `def read_sources(sources: list[str]) -> dict:
    """One isolated context per untrusted source -> structured keys only."""
    partials = []
    for src in sources:
        # fresh context: no other source, no user request, no memory
        keys = llm(
            system="Return JSON keys: claims[], links[], entities[]. Nothing else.",
            user=fetch(src),
            json=True,
        )
        partials.append(keys)
    return aggregate(partials)   # deterministic merge; second LLM call sees
                                 # only merged keys — never raw source text`;
