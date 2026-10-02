// ============================================================================
// AI OBSERVABILITY ENGINE — traces, evals, LangSmith vs Langfuse, sampling
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const SIGNAL_TABLE = [
  { signal: "Traces + spans", captures: "prompt → retrieval → rerank → generate latency/cost per step", alert: "p95 step latency; cost per task" },
  { signal: "Scores as spans", captures: "precision/recall/faithfulness logged per run", alert: "band slip Ship→Gate" },
  { signal: "Feedback + overrides", captures: "thumbs, HITL edits, gate decisions", alert: "override-rate spike" },
  { signal: "Prompts + versions", captures: "component@version pinned to every span", alert: "floating-version span" }
];

export const PLATFORM_TABLE = [
  { dim: "LangSmith", note: "Deep LangChain-native tracing + evals; $$ at scale" },
  { dim: "Langfuse", note: "OSS, self-hostable, scores + prompts; own the data" },
  { dim: "OTel + warehouse", note: "Vendor-neutral spans → your SQL; most work" }
];

// ── Why LLM observability differs from classic APM ──────────────────────────
export const WHY_TABLE = [
  { dim: "Non-determinism", apm: "Same request → same result; a diff is a regression", llm: "Same request → different output; you must score quality, not diff bytes" },
  { dim: "The unit of failure", apm: "HTTP 500 or timeout", llm: "200 OK with a subtly wrong, stale or unsafe answer" },
  { dim: "Cost is a metric", apm: "CPU/memory afterthought", llm: "Tokens × price is a first-class SLI — a 'cheap bug' doubles the bill" },
  { dim: "Failure is probabilistic", apm: "Bug reproduces", llm: "1-in-50 hallucination: needs sampling + scores, not one repro" },
  { dim: "The inputs are user data", apm: "Request logs", llm: "Prompts may hold PII → redact before trace export" }
];

// ── What to measure (golden-signal style for LLM apps) ──────────────────────
export const METRIC_TABLE = [
  { metric: "End-to-end latency", unit: "p50 / p95 ms", why: "user-perceived speed; alert when p95 jumps after a deploy", type: "latency" },
  { metric: "Per-step latency", unit: "retrieval / rerank / generate ms", why: "localizes which hop regressed — essential in multi-hop RAG", type: "latency" },
  { metric: "Token spend", unit: "tokens per task + $/day", why: "cost regression is silent; watch tokens/task, not just $/day", type: "cost" },
  { metric: "Error + retry rate", unit: "% of runs, by type", why: "truncated output, tool failures, schema violations", type: "reliability" },
  { metric: "Quality scores", unit: "faithfulness / relevance / toxicity", why: "the actual product behavior — logged as spans", type: "quality" },
  { metric: "User feedback", unit: "thumbs-up rate, HITL overrides", why: "ground truth arriving for free — route it into eval sets", type: "quality" }
];

// ── Evals in production (offline vs online) ─────────────────────────────────
export const PROD_EVAL_TABLE = [
  { mode: "Offline (CI)", how: "fixed dataset → run new prompt/model → compare to golden scores", catches: "regression before deploy", cadence: "on every change", honest: "dataset drifts from real traffic — refresh monthly" },
  { mode: "Online sampling", how: "score 1–5% of live traffic with LLM-as-judge or rules", catches: "slow quality decay, model/provider changes", cadence: "continuous", honest: "judge is itself fallible — calibrate on human-labeled subset" },
  { mode: "Online feedback", how: "thumbs, edits, 'copy failure' events joined to the trace", catches: "what scores miss (tone, usefulness)", cadence: "continuous", honest: "biased to extremes — happy users don't click" },
  { mode: "Canary", how: "new version to N% traffic; compare score bands vs control", catches: "everything above, on the release", cadence: "per deploy", honest: "needs enough traffic for the band gap to be significant" }
];

// ── Alert rules + illustrative dashboard ────────────────────────────────────
export const ALERT_RULES = [
  { rule: "p95 end-to-end > 2× 7-day baseline", action: "page on-call", why: "user-visible latency regression" },
  { rule: "faithfulness band slips Ship → Gate", action: "block deploy / roll back", why: "quality regression caught by online judge" },
  { rule: "tokens/task +30% vs yesterday", action: "slack #finops", why: "prompt or model change quietly inflated cost" },
  { rule: "error rate > 2% for 10 min", action: "page + keep 100% traces", why: "errors are always fully sampled — investigate now" }
];

export const DASHBOARD_ROWS = [
  { name: "p95 end-to-end", value: "1.9 s", band: "ok", note: "baseline 2.1 s" },
  { name: "p95 retrieval step", value: "640 ms", band: "warn", note: "+38% after rerank change" },
  { name: "tokens / task", value: "4,120", band: "ok", note: "baseline 4,050" },
  { name: "error rate", value: "0.4%", band: "ok", note: "100% of errors traced" },
  { name: "faithfulness (sampled)", value: "0.94", band: "ok", note: "Ship band ≥ 0.92" },
  { name: "thumbs-up rate", value: "81%", band: "warn", note: "-6 pts vs last week" }
];


// ── Simulator: sampling vs detection ────────────────────────────────────────
export const SAMPLING_PLAN = (tasksPerDay = 100000, samplePct = 5, bytesPerTraceKB = 40) => {
  const stored = tasksPerDay * samplePct / 100;
  const gbDay = stored * bytesPerTraceKB / 1e6;
  const detectLag = samplePct >= 20 ? "~minutes" : samplePct >= 5 ? "~1 hour" : "~half day";
  return {
    storedPerDay: Math.round(stored), gbPerDay: +gbDay.toFixed(2), gbPerMonth: +(gbDay * 30).toFixed(1),
    detectLag, advice: samplePct < 5 ? "Too thin for incidents — raise errors to 100%, keep success sampled." : "Sane default: 100% errors + 5% success + full canary windows."
  };
};

export const PYTHON_OBS_CODE = `# ============================================================================
# OBSERVABILITY: OTel spans + score logging + sampled retention
# ============================================================================
from opentelemetry import trace
tracer = trace.get_tracer("rag")

def run_task(task_id: str, sample: bool):
    with tracer.start_as_current_span("rag.task") as span:
        span.set_attribute("task.id", task_id)
        span.set_attribute("prompt.version", "base-policy@2")  # pinned!
        # ... retrieval / rerank / generate child spans ...
        span.set_attribute("eval.faithfulness", 0.97)          # scores as spans
        if not sample:
            span.set_attribute("sampled", False)               # drop at export
        return {"ok": True}

# Export: 100% error traces + 5% success + full canary windows.
`;
