// ============================================================================
// ENTERPRISE-GRADE AI ENGINE (end-to-end thinking)
// Mundane beats moonshots; data diligence; bias; good-enough; MLOps; buy-in
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const VALUE_PLAYS = [
  { play: "Forecasting", ex: "Stock next week, price next month", why: "Compounding efficiency gains" },
  { play: "Anomaly detection", ex: "Fraud, intrusion, rogue access", why: "Asymmetric payoff on rare events" },
  { play: "Classification", ex: "Lead scoring, credit risk", why: "Better decisions at scale" }
];

export const DATA_DILIGENCE = [
  { check: "Target nature", detail: "Imbalanced label? → preprocessing + metric choice" },
  { check: "Time role", detail: "Timestamp everything — no future leaking into features" },
  { check: "Gaps (MAR vs MNAR)", detail: "Source + nature dictate treatment" },
  { check: "Seasonality", detail: "Exploit cycles, don't memorize them" },
  { check: "Correlations + SME story", detail: "True relation or spurious noise?" },
  { check: "External augmentation", detail: "Weather etc. where causal" }
];

export const BIAS_TRAPS = [
  { trap: "COMPAS", lesson: "Optimized accuracy, 2x false positives by ethnicity" },
  { trap: "Apple Card", lesson: "Gender-blind inputs still inferred gender from proxies" },
  { trap: "Suppression fallacy", lesson: "Dropping the column never drops the signal" }
];

export const DEPLOY_QUESTIONS = [
  "Fast enough at scale on available hardware?",
  "Deployable into existing backends + data feeds?",
  "Outputs reachable and actionable by owners?",
  "Benefit weighed against asymmetric error cost?"
];

export const DRIFT_TYPES = [
  { drift: "Concept", means: "P(y|x) changed — model existence itself can cause it", needs: "Labels" },
  { drift: "Label", means: "P(y) shifted (e.g. pandemic defaults)", needs: "Labels" },
  { drift: "Feature", means: "P(x) moved (new criteria, new conditions)", needs: "No labels" },
  { drift: "Prediction", means: "P(ŷ) shifted — multivariate canary", needs: "No labels" }
];

// ── Simulator: enterprise readiness score ───────────────────────────────────
export const READINESS_SCORE = (flags = { data: true, bias: false, perf: true, deploy: false, monitor: false, buyin: true }) => {
  const W = { data: 25, bias: 20, perf: 15, deploy: 15, monitor: 15, buyin: 10 };
  const NAMES = { data: "Data diligence done", bias: "Bias tested + policy set", perf: "Good-enough benchmarked", deploy: "4 deploy questions answered", monitor: "Integrity/health/drift monitored", buyin: "XAI + exec sponsorship" };
  const score = Object.entries(flags).reduce((a, [k, v]) => a + (v ? W[k] : 0), 0);
  const firstFix = Object.entries(flags).find(([, v]) => !v);
  return {
    score,
    verdict: score >= 85 ? "Enterprise-grade — ship with monitoring." : score >= 60 ? "Promising — close the gaps below first." : "Not yet — piecemeal AI dies here.",
    firstFix: firstFix ? NAMES[firstFix[0]] : "None — hold the bar.",
    reminder: "87% of AI projects never reach production. End-to-end or end of story."
  };
};

export const PYTHON_ENTERPRISE_CODE = `# ============================================================================
# ENTERPRISE READINESS: weighted gate + drift monitor sketch
# ============================================================================
WEIGHTS = {"data": 25, "bias": 20, "perf": 15,
           "deploy": 15, "monitor": 15, "buyin": 10}

def readiness(flags: dict) -> dict:
    score = sum(WEIGHTS[k] for k, v in flags.items() if v)
    verdict = ("SHIP" if score >= 85 else
               "CLOSE-GAPS" if score >= 60 else "NOT-YET")
    missing = [k for k, v in flags.items() if not v]
    return {"score": score, "verdict": verdict,
            "first_fix": missing[0] if missing else None}

def drift_watch(kind: str) -> str:
    needs_labels = {"concept", "label"}
    return ("needs labels (slow signal)" if kind in needs_labels
            else "label-free early canary")
`;
