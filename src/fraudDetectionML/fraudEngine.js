// ============================================================================
// FRAUD DETECTION ML: 6 MODELS & PRODUCTION TRADEOFFS ENGINE
// Banking fraud study:
// Evaluation Metrics vs Real-World Production SLA, Explainability & Cost Matrix
// ============================================================================

export const SIX_FRAUD_MODELS = [
  {
    name: "Logistic Regression (L2)",
    offlineAuroc: 0.882,
    f1Score: 0.741,
    latencyMs: 1.2,
    memoryMb: 4,
    explainability: "High (Direct linear feature coefficients)",
    productionStatus: "Baseline (Used in tier-1 microsecond filter)",
    notes: "Super fast, but cannot capture complex non-linear merchant fraud rings."
  },
  {
    name: "Random Forest",
    offlineAuroc: 0.945,
    f1Score: 0.862,
    latencyMs: 38.0,
    memoryMb: 850,
    explainability: "Medium (Tree ensemble feature importances)",
    productionStatus: "Rejected (Heavy memory footprint & slow p99 latency)",
    notes: "High accuracy, but large tree depths cause memory spikes under 10k QPS."
  },
  {
    name: "XGBoost",
    offlineAuroc: 0.978,
    f1Score: 0.912,
    latencyMs: 14.5,
    memoryMb: 45,
    explainability: "High (TreeSHAP exact Shapley values)",
    productionStatus: "Strong Contender",
    notes: "Excellent accuracy-latency balance; standard industry workhorse."
  },
  {
    name: "LightGBM",
    offlineAuroc: 0.976,
    f1Score: 0.910,
    latencyMs: 4.8,
    memoryMb: 18,
    explainability: "High (Fast TreeSHAP calculation in <2ms)",
    productionStatus: "🏆 SELECTED FOR PRODUCTION DEPLOYMENT",
    notes: "Histogram-based binning achieves 3x faster inference than XGBoost with sub-5ms latency."
  },
  {
    name: "CatBoost",
    offlineAuroc: 0.984,
    f1Score: 0.925,
    latencyMs: 22.0,
    memoryMb: 60,
    explainability: "Medium-High",
    productionStatus: "Highest Offline Score, But Not in Prod",
    notes: "Won on offline test split by 0.008 AUROC, but 22ms latency violated bank 15ms gateway SLA."
  },
  {
    name: "Deep Neural Network (MLP)",
    offlineAuroc: 0.952,
    f1Score: 0.870,
    latencyMs: 12.0,
    memoryMb: 120,
    explainability: "Low (Black-box neural representations)",
    productionStatus: "Rejected (Failed compliance explainability audit)",
    notes: "Requires expensive GPU inference; regulatory bank audits demand clear rejection reasons."
  }
];

export const CALCULATE_COST_MATRIX = (threshold = 0.5, costFP = 50, costFN = 500, totalTransactions = 100000) => {
  // Fraud distribution: 1% actual fraud (1,000 cases), 99% legitimate (99,000 cases)
  const actualFraud = 1000;
  const actualLegit = 99000;

  // As threshold drops from 1.0 to 0.0:
  // Lower threshold captures more fraud (reduces FN), but flags more legitimate users (increases FP)
  const sensitivity = 1.0 / (1.0 + Math.exp(10 * (threshold - 0.25))); // Sigmoidal capture rate
  const falseAlarmRate = Math.exp(-6 * threshold);

  const tp = Math.min(actualFraud, Math.round(actualFraud * sensitivity));
  const fn = actualFraud - tp;
  const fp = Math.min(actualLegit, Math.round(actualLegit * falseAlarmRate * 0.05));
  const tn = actualLegit - fp;

  const totalCost = (fp * costFP) + (fn * costFN);

  return {
    threshold,
    tp,
    fn,
    fp,
    tn,
    costFP: fp * costFP,
    costFN: fn * costFN,
    totalCost,
    precision: tp + fp > 0 ? (tp / (tp + fp)) : 0,
    recall: actualFraud > 0 ? (tp / actualFraud) : 0
  };
};

export const PYTHON_FRAUD_COST_OPTIMIZER_SCRIPT = `# ============================================================================
# PRODUCTION COST-SENSITIVE THRESHOLD OPTIMIZER & SHAP EXPLAINABILITY
# Demonstrates LightGBM training, custom loss matrix, and TreeSHAP reason codes
# ============================================================================

import numpy as np
import lightgbm as lgb
import shap

# 1. Bank Financial Cost Matrix
COST_FALSE_POSITIVE = 50.0   # Blocked card / customer support churn
COST_FALSE_NEGATIVE = 500.0  # Direct fraud loss (stolen funds chargeback)

def find_optimal_threshold(y_true, y_prob):
    thresholds = np.linspace(0.01, 0.99, 100)
    costs = []
    
    for t in thresholds:
        y_pred = (y_prob >= t).astype(int)
        fp = np.sum((y_pred == 1) & (y_true == 0))
        fn = np.sum((y_pred == 0) & (y_true == 1))
        total_cost = (fp * COST_FALSE_POSITIVE) + (fn * COST_FALSE_NEGATIVE)
        costs.append((t, total_cost, fp, fn))
        
    best_t, min_cost, best_fp, best_fn = min(costs, key=lambda x: x[1])
    print(f"Optimal Decision Threshold: {best_t:.3f} | Minimized Total Loss: \${min_cost:,.2f}")
    return best_t

# 2. Regulatory Compliance: TreeSHAP Fast Feature Attribution
def generate_decline_reason_codes(model, transaction_sample):
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(transaction_sample)
    
    # Top 3 features driving the fraud score
    top_reasons = np.argsort(-np.abs(shap_values[0]))[:3]
    return top_reasons
`;
