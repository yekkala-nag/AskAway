// ── Agentic UI: putting analytics where users work (email) — data & pure logic ──

export const PROBLEM = {
  lines: [
    { point: 'Domain experts rely on outdated knowledge', detail: 'Analysts cannot validate every real-time update; data sits in repositories people never open' },
    { point: 'Specialists are not data experts', detail: 'Asking a decision-maker to become a data analyst is the wrong requirement' },
    { point: 'Stakeholders struggle to convert ML output', detail: 'A model result becomes a business decision only when a human interprets it' },
  ],
  twoWays: [
    { way: 'Pull — bring humans into new tools', cost: 'New interface, new skill set, new habit; adoption stalls' },
    { way: 'Push — bring the agent into existing tools', cost: 'The workflow arrives where the person already works; no-code keeps it maintainable' },
  ],
};

export const WORKFLOWS = [
  {
    id: 'intake',
    name: 'Workflow 1 — Order intake & forecasting',
    trigger: 'Inbound purchase-order email',
    steps: [
      { n: 1, step: 'Receive order via email', detail: 'Trigger node watches the intake mailbox' },
      { n: 2, step: 'Filter inbound purchase orders', detail: 'Non-PO mail is ignored before any parsing cost' },
      { n: 3, step: 'LLM parses PO & delivery date', detail: 'Extract structured line items (SKU, qty), delivery date, PO number' },
      { n: 4, step: 'Data submission', detail: 'Rows append to a shared sheet — the operational source of truth' },
    ],
    output: 'Structured order rows ready for planning — no copy-paste, no re-keying',
    code: null,
  },
  {
    id: 'ww',
    name: 'Workflow 2 — Demand planning with optimization',
    trigger: 'CSV attachment on a planning-request email',
    steps: [
      { n: 1, step: 'Receive planning email + CSV', detail: 'Trigger + extract attachment' },
      { n: 2, step: 'POST to planning endpoint', detail: 'Send parameters to the Wagner–Whitin service' },
      { n: 3, step: 'Parse parameters', detail: 'Setup cost, holding cost, currency, boxes, months — agent tool' },
      { n: 4, step: 'Run the optimization tool', detail: 'Dynamic programming over the horizon' },
      { n: 5, step: 'Reply email with the plan', detail: 'Total demand, periods, per-month quantities, batches, total cost' },
    ],
    output: 'A costed batch schedule back in the requester’s inbox',
    code: null,
  },
];

export const WW_EXAMPLE = {
  cost1: 600,
  cost2: 5000,
  naiveTotal: 1500,
  problem: 'Store A keeps buying in large batches: low ordering cost, inventory piles up. Store B orders exactly what is needed: inventory cost disappears, ordering cost explodes.',
  bet: 'There must be a middle ground — a dynamic programming algorithm that finds the optimal balance.',
};

// ── Wagner–Whitin lot-sizing (dynamic programming, backtrace) ──
export function wagnerWhitin(demands, setupCost, holdingCost) {
  const T = demands.length;
  const INF = Infinity;

  // cost of covering periods i..j (1-indexed) in one batch produced at i
  const batchCost = (i, j) => {
    const batch = demands.slice(i - 1, j).reduce((a, b) => a + b, 0);
    let remaining = batch;
    let endInv = 0;
    for (let k = i; k <= j; k++) {
      remaining -= demands[k - 1];
      endInv += remaining;
    }
    return setupCost + endInv * holdingCost;
  };

  // F[j] = min total cost to cover periods 1..j
  const F = Array(T + 1).fill(INF);
  const back = Array(T + 1).fill(-1);
  F[0] = 0;
  for (let j = 1; j <= T; j++) {
    for (let i = 1; i <= j; i++) {
      const total = F[i - 1] + batchCost(i, j);
      if (total < F[j]) {
        F[j] = total;
        back[j] = i;
      }
    }
  }

  const batches = [];
  let j = T;
  while (j >= 1) {
    const i = back[j];
    const qty = demands.slice(i - 1, j).reduce((a, b) => a + b, 0);
    batches.push({ start: i, end: j, qty });
    j = i - 1;
  }
  batches.reverse();
  return { total: F[T], batches };
}

export function naivePolicies(demands, setupCost, holdingCost) {
  const T = demands.length;
  // Policy A: single batch for the whole horizon
  const totalDemand = demands.reduce((a, b) => a + b, 0);
  let singleInv = 0;
  let remaining = totalDemand;
  for (let k = 0; k < T; k++) {
    remaining -= demands[k];
    singleInv += remaining;
  }
  const singleCost = setupCost + singleInv * holdingCost;
  // Lot-for-lot: order every period
  const lotCost = T * setupCost;
  return {
    single: { cost: singleCost, batches: 1 },
    lotForLot: { cost: lotCost, batches: T },
  };
}

export const PARSE_FIELDS = [
  { field: 'setup_cost', label: 'Cost per order / batch' },
  { field: 'holding_cost', label: 'Cost to hold one unit per period' },
  { field: 'currency', label: 'Applied to every money figure in the reply' },
  { field: 'boxes', label: 'Number of boxes (parameters)' },
  { field: 'months', label: 'Planning horizon length' },
];

export const EMAIL_AGENT_PATTERNS = [
  { pattern: 'Trigger → filter → extract → append', where: 'Order intake', note: 'Cheap checks run before expensive LLM calls' },
  { pattern: 'Attachment → tool → structured reply', where: 'Demand planning', note: 'The agent owns parsing; the API owns arithmetic' },
  { pattern: 'Clarify before executing', where: 'Both', note: 'Ambiguous quantity or missing cost → ask, don’t guess' },
];

export const CODE_ENDPOINT = `# The optimization endpoint the workflow agent calls.
# Deterministic math stays in code — the agent only parses and narrates.
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class PlanRequest(BaseModel):
    demands: list[int]          # one entry per period (boxes)
    setup_cost: float           # cost per batch
    holding_cost: float         # cost per unit per period

@app.post("/plan")
def plan(req: PlanRequest):
    if not req.demands:
        raise HTTPException(422, "empty demand series")
    if req.setup_cost < 0 or req.holding_cost < 0:
        raise HTTPException(422, "costs must be non-negative")
    result = wagner_whitin(req.demands, req.setup_cost, req.holding_cost)
    return {
        "total_cost": result.total,
        "batches": [
            {"start_period": b.start, "end_period": b.end, "quantity": b.qty}
            for b in result.batches
        ],
    }`;

export const CODE_AGENT_TOOL = `# Agent tool: parse the email, call the endpoint, narrate the plan.
def planning_tool(email: Message) -> str:
    # 1. Deterministic parse of the human-readable parameters
    params = parse_fields(
        email.body,
        fields=["setup_cost", "holding_cost", "currency", "boxes", "months"],
    )
    missing = [f for f, v in params.items() if v in (None, "")]
    if missing:
        return clarify_request(missing)          # ask, don't guess

    # 2. The agent never computes the optimum itself — it calls the service
    payload = {
        "demands": extract_demand_series(email.attachment),
        "setup_cost": params["setup_cost"],
        "holding_cost": params["holding_cost"],
    }
    plan = http_post("/plan", payload)

    # 3. Reply in the inbox, in business language
    return render_email_reply(
        total_demand=sum(payload["demands"]),
        periods=len(payload["demands"]),
        batches=plan["batches"],
        total_cost=plan["total_cost"],
        currency=params["currency"],
    )`;
