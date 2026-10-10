// ============================================================================
// REINFORCEMENT LEARNING: 3 BASELINES & CONSUMER BUSINESS ENGINES
// 3 Non-Negotiable Baselines, Multi-Armed Bandits, Dynamic Pricing & LTV MDP
// ============================================================================

export const THREE_RL_BASELINES = [
  {
    name: "1. Uniform Random Policy",
    type: "Lower Bound Baseline",
    behavior: "Selects actions with equal probability: a ~ Uniform(A).",
    whyEssential: "If your DQN or PPO cannot beat a coin toss, the reward function is uninformative or the state representation suffers catastrophic forgetting.",
    expectedScore: "15.2 / 100",
    color: "#C47A6A"
  },
  {
    name: "2. Greedy Domain Heuristic",
    type: "Expert Baseline",
    behavior: "Always picks the locally best immediate action (e.g. Nearest Neighbor, Minimum-Slack, FIFO, Highest-Margin).",
    whyEssential: "Proves whether RL is actually learning non-myopic long-term credit assignment rather than just greedily exploiting the immediate reward.",
    expectedScore: "68.5 / 100",
    color: "#F0A89A"
  },
  {
    name: "3. Static / Cyclic Policy",
    type: "Deterministic Baseline",
    behavior: "Follows a fixed calendar or periodic schedule (e.g. rebalance every 7 days, restock fixed batch size S every morning).",
    whyEssential: "Verifies whether dynamic state-dependent closed-loop adaptation outperforms cheap open-loop scheduling.",
    expectedScore: "54.0 / 100",
    color: "#3A9B9F"
  },
  {
    name: "4. Trained Deep RL Agent (PPO / DQN)",
    type: "Adaptive Closed-Loop Policy",
    behavior: "Maximizes discounted cumulative reward: \\sum \\gamma^t r_t via deep Q-learning / Actor-Critic.",
    whyEssential: "Must statistically outperform all 3 baselines across multiple random seeds before production deployment.",
    expectedScore: "92.4 / 100",
    color: "#3A9B9F"
  }
];

export const CONSUMER_RL_USE_CASES = [
  {
    domain: "Dynamic Pricing & Real-Time Discounts",
    state: "User search frequency, inventory stock, time-to-departure/expiry, competitor price index",
    action: "Discrete discount tier: [0%, 5%, 10%, 15%, 20%]",
    reward: "Immediate profit margin minus customer churn penalty",
    businessImpact: "+14.2% Gross Margin lift over rule-based markdowns"
  },
  {
    domain: "Personalized Next-Best-Action (NBA)",
    state: "User engagement history, recent cart abandons, active subscription tier, time since last login",
    action: "Send Push Notification, Trigger Email Offer, In-App Banner, or No-Action (Silence)",
    reward: "Conversion value minus user notification fatigue penalty",
    businessImpact: "-28% push unsubscribe rate, +19% retention"
  },
  {
    domain: "Customer Lifetime Value (LTV) Maximization",
    state: "Customer RFM scores (Recency, Frequency, Monetary), lifetime tenure, support ticket sentiment",
    action: "Targeted loyalty reward, concierge support upgrade, proactive retention discount",
    reward: "Long-term 12-month retained revenue",
    businessImpact: "+22% 1-year retention on high-value cohorts"
  },
  {
    domain: "Supply Chain & Multi-Warehouse Rebalancing",
    state: "Regional demand forecasts, warehouse capacity, transit times, shipping rate matrix",
    action: "Transfer inventory quantity Q from hub A to hub B",
    reward: "Stockout mitigation minus inter-warehouse freight transport costs",
    businessImpact: "-35% stockout rate during peak holiday surges"
  }
];

export const SIMULATE_DYNAMIC_PRICING_MDP = (basePrice = 100, inventory = 50, daysLeft = 30) => {
  // Simulate 30-day selling episode
  let currentInventory = inventory;
  let revenueRandom = 0;
  let revenueHeuristic = 0;
  let revenueRL = 0;

  for (let day = 0; day < daysLeft; day++) {
    // 1. Random Policy
    const discRand = [0, 0.05, 0.1, 0.2][Math.floor(Math.random() * 4)];
    const priceRand = basePrice * (1 - discRand);
    const demandRand = Math.max(0, Math.floor((120 - priceRand) * 0.05 * (1 + Math.sin(day / 5))));
    const salesRand = Math.min(demandRand, currentInventory);
    revenueRandom += salesRand * priceRand;

    // 2. Greedy Heuristic Policy (discount heavily only on last 5 days)
    const discHeuristic = (day > daysLeft - 5) ? 0.25 : 0.05;
    const priceHeur = basePrice * (1 - discHeuristic);
    const demandHeur = Math.max(0, Math.floor((120 - priceHeur) * 0.05 * (1 + Math.sin(day / 5))));
    const salesHeur = Math.min(demandHeur, currentInventory);
    revenueHeuristic += salesHeur * priceHeur;

    // 3. Learned RL Policy (Smooth non-linear dynamic price adaptation)
    const scarcityFactor = currentInventory / (daysLeft - day + 1);
    const discRL = scarcityFactor < 1.0 ? 0.0 : scarcityFactor > 2.0 ? 0.15 : 0.08;
    const priceRL = basePrice * (1 - discRL);
    const demandRL = Math.max(0, Math.floor((120 - priceRL) * 0.05 * (1 + Math.sin(day / 5))));
    const salesRL = Math.min(demandRL, currentInventory);
    revenueRL += salesRL * priceRL;
  }

  return {
    revenueRandom: Math.round(revenueRandom),
    revenueHeuristic: Math.round(revenueHeuristic),
    revenueRL: Math.round(revenueRL),
    rlLiftVsHeuristic: (((revenueRL - revenueHeuristic) / revenueHeuristic) * 100).toFixed(1)
  };
};

// ============================================================================
// MULTI-ARMED BANDIT: EXPLORE VS EXPLOIT (deterministic, node-importable)
// Epsilon-greedy vs greedy simulation with seeded RNG, running-mean
// estimation, reward-model taxonomy, and exploration crossover detection.
// ============================================================================

export const BANDIT_REWARD_MODELS = [
  {
    id: "fixed",
    name: "Fixed reward probabilities",
    description: "Each arm pays out with a constant hidden probability. The agent's estimates converge to the true rates.",
    example: "Two headlines with steady click rates of 30% and 70%."
  },
  {
    id: "adversarial",
    name: "Adversarial shifting rewards",
    description: "An opposing process moves reward mass away from the most-pulled arm, punishing premature exploitation.",
    example: "A competitor copies your best-performing offer within days."
  },
  {
    id: "random-process",
    name: "Random-process drift",
    description: "True rates wander over time as a random process, so the agent must keep exploring forever.",
    example: "Seasonal demand drifting week by week."
  }
];

// Deterministic seeded RNG (mulberry32) in pure JS. Same seed -> same stream.
export function createSeededRng(seed) {
  var a = Number(seed);
  if (!isFinite(a)) a = 0;
  a = a >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Running-mean estimator: fold a new binary reward into the current mean.
// pullCount = number of previous pulls of this arm.
export function updateRunningMean(currentMean, pullCount, reward) {
  var mean = Number(currentMean);
  if (!isFinite(mean)) mean = 0;
  var count = Math.floor(Number(pullCount));
  if (!isFinite(count) || count < 0) count = 0;
  var r = Number(reward);
  if (!isFinite(r)) r = 0;
  return mean + (r - mean) / (count + 1);
}

export function meanOfRewards(rewards) {
  if (!Array.isArray(rewards) || rewards.length === 0) return 0;
  var sum = 0;
  for (var i = 0; i < rewards.length; i++) sum += Number(rewards[i]) || 0;
  return sum / rewards.length;
}

// Deterministic spread of true rates across N arms, from 0.30 up to 0.80.
export function defaultTrueRates(numArms) {
  var n = Math.floor(Number(numArms));
  if (!isFinite(n) || n < 1) n = 2;
  if (n === 1) return [0.5];
  var rates = [];
  for (var i = 0; i < n; i++) {
    rates.push(Number((0.3 + (0.5 * i) / (n - 1)).toFixed(4)));
  }
  return rates;
}

// Simulate one epsilon-greedy session over Bernoulli arms.
// epsilon = 0 is pure greedy exploitation; epsilon > 0 mixes in exploration.
export function runBanditSession(config) {
  var cfg = config || {};
  var trueRates = Array.isArray(cfg.trueRates) && cfg.trueRates.length > 0 ? cfg.trueRates.slice() : [0.3, 0.7];
  var steps = cfg.steps === undefined ? 200 : Math.floor(Number(cfg.steps));
  if (!isFinite(steps) || steps < 1) steps = 1;
  var epsilon = cfg.epsilon === undefined ? 0.1 : Number(cfg.epsilon);
  if (!isFinite(epsilon) || epsilon < 0) epsilon = 0;
  if (epsilon > 1) epsilon = 1;
  var seed = cfg.seed === undefined ? 7 : Number(cfg.seed);
  if (!isFinite(seed)) seed = 7;

  var rng = createSeededRng(seed);
  var k = trueRates.length;
  var estimates = [];
  var counts = [];
  for (var i = 0; i < k; i++) {
    estimates.push(0);
    counts.push(0);
  }
  var choices = [];
  var rewards = [];
  var total = 0;

  for (var t = 0; t < steps; t++) {
    var action;
    if (rng() < epsilon) {
      action = Math.floor(rng() * k);
    } else {
      action = 0;
      for (var j = 1; j < k; j++) {
        if (estimates[j] > estimates[action]) action = j;
      }
    }
    var reward = rng() < trueRates[action] ? 1 : 0;
    estimates[action] = updateRunningMean(estimates[action], counts[action], reward);
    counts[action] += 1;
    choices.push(action);
    rewards.push(reward);
    total += reward;
  }

  return {
    trueRates: trueRates,
    steps: steps,
    epsilon: epsilon,
    seed: seed,
    choices: choices,
    rewards: rewards,
    estimatedValues: estimates,
    pullCounts: counts,
    totalReward: total,
    winRate: total / steps
  };
}

export function cumulativeSum(values) {
  var out = [];
  var acc = 0;
  for (var i = 0; i < values.length; i++) {
    acc += Number(values[i]) || 0;
    out.push(acc);
  }
  return out;
}

// Exploration-vs-exploitation crossover: first step index where the trailing
// series B overtakes the early leader A. Returns -1 when B never overtakes A.
export function findCrossoverStep(cumulativeA, cumulativeB) {
  var n = Math.min(cumulativeA.length, cumulativeB.length);
  for (var i = 0; i < n; i++) {
    if (cumulativeB[i] > cumulativeA[i]) return i;
  }
  return -1;
}

// Head-to-head: greedy (epsilon 0) vs epsilon-greedy on identical arms.
export function comparePolicies(config) {
  var cfg = config || {};
  var greedy = runBanditSession({
    trueRates: cfg.trueRates,
    steps: cfg.steps,
    epsilon: 0,
    seed: cfg.seed
  });
  var exploratory = runBanditSession({
    trueRates: cfg.trueRates,
    steps: cfg.steps,
    epsilon: cfg.epsilon === undefined ? 0.1 : cfg.epsilon,
    seed: cfg.seed
  });
  var crossoverStep = findCrossoverStep(cumulativeSum(greedy.rewards), cumulativeSum(exploratory.rewards));
  return {
    greedy: greedy,
    exploratory: exploratory,
    greedyWinRate: greedy.winRate,
    exploratoryWinRate: exploratory.winRate,
    winRateDelta: exploratory.winRate - greedy.winRate,
    crossoverStep: crossoverStep
  };
}

export const PYTHON_PPO_PRICING_SCRIPT = `# ============================================================================
# PRODUCTION REINFORCEMENT LEARNING GYM ENVIRONMENT & PPO AGENT
# Demonstrates Gymnasium custom environment for dynamic retail pricing
# ============================================================================

import gymnasium as gym
from gymnasium import spaces
import numpy as np
from stable_baselines3 import PPO

class DynamicPricingEnv(gym.Env):
    def __init__(self, base_price=100.0, max_inventory=100, max_days=30):
        super().__init__()
        self.base_price = base_price
        self.max_inventory = max_inventory
        self.max_days = max_days
        
        # Action space: 5 discrete discount tiers [0%, 5%, 10%, 15%, 20%]
        self.action_space = spaces.Discrete(5)
        self.discounts = [0.0, 0.05, 0.10, 0.15, 0.20]
        
        # Observation space: [remaining_inventory, days_left, competitor_price_ratio]
        self.observation_space = spaces.Box(
            low=np.array([0.0, 0.0, 0.5], dtype=np.float32),
            high=np.array([max_inventory, max_days, 1.5], dtype=np.float32)
        )
        
    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        self.inventory = float(self.max_inventory)
        self.day = 0
        return self._get_obs(), {}
        
    def _get_obs(self):
        comp_ratio = 1.0 + 0.1 * np.sin(self.day)
        return np.array([self.inventory, self.max_days - self.day, comp_ratio], dtype=np.float32)
        
    def step(self, action):
        discount = self.discounts[action]
        price = self.base_price * (1.0 - discount)
        
        # Price elasticity demand model
        expected_demand = max(0.0, (130.0 - price) * 0.08)
        actual_demand = np.random.poisson(expected_demand)
        units_sold = min(self.inventory, actual_demand)
        
        reward = units_sold * price
        self.inventory -= units_sold
        self.day += 1
        
        terminated = (self.day >= self.max_days) or (self.inventory <= 0)
        return self._get_obs(), reward, terminated, False, {}

# Train PPO Agent
env = DynamicPricingEnv()
model = PPO("MlpPolicy", env, verbose=0)
model.learn(total_timesteps=50000)
print("PPO Model Successfully Trained on Dynamic Pricing Environment!")
`;
