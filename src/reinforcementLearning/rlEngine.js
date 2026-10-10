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

// ============================================================================
// TABULAR Q-LEARNING: TIC-TAC-TOE (deterministic, node-importable)
// Every board-and-move pair maps to an expected long-term payoff in a plain
// object table - no neural network needed for small games. The agent starts
// with zero knowledge and plays thousands of episodes against a fixed random
// opponent; per-block wins climb and losses fall (the learning-curve
// signature). Epsilon-greedy exploration supplies the explore-vs-exploit
// tradeoff (see bandit subtab). Seeded RNG reuse keeps sessions deterministic.
// ============================================================================

// Reward shaping: win +1, draw +0.5, loss -1, illegal move gets a large
// negative penalty so invalid moves train out fast. Ongoing moves score 0;
// the discount gamma carries future reward backwards through the update.
export const QLEARN_REWARDS = {
  win: 1,
  draw: 0.5,
  loss: -1,
  invalid: -5,
  ongoing: 0
};
export const QLEARN_INVALID_PENALTY = -5;

// Board cells: 0 = empty, 1 = learning agent (X), 2 = random opponent (O).
export function encodeBoard(board) {
  var out = '';
  for (var i = 0; i < 9; i++) out += board[i] ? String(board[i]) : '0';
  return out;
}

export function availableMoves(board) {
  var moves = [];
  for (var i = 0; i < 9; i++) if (!board[i]) moves.push(i);
  return moves;
}

var QLEARN_WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// Returns 'X' | 'O' | 'draw' | null (game still in progress).
export function checkWinner(board) {
  for (var i = 0; i < QLEARN_WIN_LINES.length; i++) {
    var line = QLEARN_WIN_LINES[i];
    var a = board[line[0]];
    if (a !== 0 && a === board[line[1]] && a === board[line[2]]) {
      return a === 1 ? 'X' : 'O';
    }
  }
  for (var j = 0; j < 9; j++) if (!board[j]) return null;
  return 'draw';
}

// Q-table helpers on a plain object table keyed by state + ':' + action.
// Unknown entries read as 0 (agent starts with zero knowledge).
export function qGet(table, stateKey, action) {
  var v = table ? table[stateKey + ':' + action] : undefined;
  return (typeof v === 'number' && isFinite(v)) ? v : 0;
}

export function qSet(table, stateKey, action, value) {
  var v = Number(value);
  table[stateKey + ':' + action] = isFinite(v) ? v : 0;
  return table;
}

// Q-learning update: how strongly new experience (alpha) overwrites the old
// value, and how much future rewards count (gamma times best next value).
export function qUpdate(prevQ, reward, nextMax, alpha, gamma) {
  var q = Number(prevQ);
  if (!isFinite(q)) q = 0;
  var r = Number(reward);
  if (!isFinite(r)) r = 0;
  var nm = Number(nextMax);
  if (!isFinite(nm)) nm = 0;
  var a = alpha === undefined ? 0.2 : Number(alpha);
  if (!isFinite(a) || a < 0) a = 0;
  if (a > 1) a = 1;
  var g = gamma === undefined ? 0.9 : Number(gamma);
  if (!isFinite(g) || g < 0) g = 0;
  if (g > 1) g = 1;
  return q + a * (r + g * nm - q);
}

// Best Q-value over all 9 cells in a state (unknown cells read as 0).
function qMaxValue(table, stateKey) {
  var best = qGet(table, stateKey, 0);
  for (var a = 1; a < 9; a++) {
    var v = qGet(table, stateKey, a);
    if (v > best) best = v;
  }
  return best;
}

// Train a tabular agent: thousands of episodes against a fixed random
// opponent. The agent may attempt any of the 9 cells; illegal attempts earn
// the large invalid penalty (same-board update) and the turn is retried, so
// the invalid-move rate starts high and trains down. Deterministic per seed.
export function runQLearningSession(config) {
  var cfg = config || {};
  var episodes = cfg.episodes === undefined ? 2000 : Math.floor(Number(cfg.episodes));
  if (!isFinite(episodes) || episodes < 1) episodes = 1;
  if (episodes > 20000) episodes = 20000;
  var alpha = cfg.alpha === undefined ? 0.2 : Number(cfg.alpha);
  if (!isFinite(alpha) || alpha < 0) alpha = 0;
  if (alpha > 1) alpha = 1;
  var gamma = cfg.gamma === undefined ? 0.9 : Number(cfg.gamma);
  if (!isFinite(gamma) || gamma < 0) gamma = 0;
  if (gamma > 1) gamma = 1;
  var epsilon = cfg.epsilon === undefined ? 0.15 : Number(cfg.epsilon);
  if (!isFinite(epsilon) || epsilon < 0) epsilon = 0;
  if (epsilon > 1) epsilon = 1;
  var seed = cfg.seed === undefined ? 21 : Number(cfg.seed);
  if (!isFinite(seed)) seed = 21;

  var rng = createSeededRng(seed);
  var table = {};
  var blockCount = episodes >= 10 ? 10 : episodes;
  var blockSize = Math.ceil(episodes / blockCount);
  var blocks = [];
  for (var b = 0; b < blockCount; b++) {
    blocks.push({ block: b + 1, episodes: 0, wins: 0, draws: 0, losses: 0, invalids: 0 });
  }
  var wins = 0;
  var draws = 0;
  var losses = 0;
  var totalInvalids = 0;
  var totalAgentMoves = 0;
  var finalBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  var finalResult = null;

  for (var ep = 0; ep < episodes; ep++) {
    var board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var bi = Math.min(blockCount - 1, Math.floor(ep / blockSize));
    var epInvalids = 0;
    var result = null;
    var guard = 0;
    while (result === null && guard < 500) {
      guard++;
      var stateKey = encodeBoard(board);
      var action;
      if (rng() < epsilon) {
        action = Math.floor(rng() * 9);
      } else {
        action = 0;
        var bestV = qGet(table, stateKey, 0);
        for (var a = 1; a < 9; a++) {
          var v = qGet(table, stateKey, a);
          if (v > bestV) {
            bestV = v;
            action = a;
          }
        }
      }
      totalAgentMoves++;
      if (board[action] !== 0) {
        epInvalids++;
        var prevInvalid = qGet(table, stateKey, action);
        var nextMaxSame = qMaxValue(table, stateKey);
        qSet(table, stateKey, action, qUpdate(prevInvalid, QLEARN_INVALID_PENALTY, nextMaxSame, alpha, gamma));
        continue;
      }
      board[action] = 1;
      var w = checkWinner(board);
      if (w === 'X' || w === 'draw') {
        var rWin = w === 'X' ? QLEARN_REWARDS.win : QLEARN_REWARDS.draw;
        var prevWin = qGet(table, stateKey, action);
        qSet(table, stateKey, action, qUpdate(prevWin, rWin, 0, alpha, gamma));
        result = w === 'X' ? 'win' : 'draw';
      } else {
        var options = availableMoves(board);
        var pick = options[Math.floor(rng() * options.length)];
        board[pick] = 2;
        var w2 = checkWinner(board);
        if (w2 === 'O' || w2 === 'draw') {
          var rEnd = w2 === 'O' ? QLEARN_REWARDS.loss : QLEARN_REWARDS.draw;
          var prevEnd = qGet(table, stateKey, action);
          qSet(table, stateKey, action, qUpdate(prevEnd, rEnd, 0, alpha, gamma));
          result = w2 === 'O' ? 'loss' : 'draw';
        } else {
          var nextKey = encodeBoard(board);
          var prevMid = qGet(table, stateKey, action);
          qSet(table, stateKey, action, qUpdate(prevMid, QLEARN_REWARDS.ongoing, qMaxValue(table, nextKey), alpha, gamma));
        }
      }
    }
    if (result === null) result = 'draw';
    if (result === 'win') {
      wins++;
      blocks[bi].wins++;
    } else if (result === 'draw') {
      draws++;
      blocks[bi].draws++;
    } else {
      losses++;
      blocks[bi].losses++;
    }
    blocks[bi].episodes++;
    blocks[bi].invalids += epInvalids;
    totalInvalids += epInvalids;
    finalBoard = board.slice();
    finalResult = result;
  }

  return {
    episodes: episodes,
    alpha: alpha,
    gamma: gamma,
    epsilon: epsilon,
    seed: seed,
    blocks: blocks,
    wins: wins,
    draws: draws,
    losses: losses,
    tableSize: Object.keys(table).length,
    invalidMoveRate: totalAgentMoves > 0 ? totalInvalids / totalAgentMoves : 0,
    totalInvalids: totalInvalids,
    totalAgentMoves: totalAgentMoves,
    table: table,
    finalBoard: finalBoard,
    finalResult: finalResult
  };
}

// Top Q-table entries sorted by value descending (mini table inspector).
export function topQEntries(table, limit) {
  var n = limit === undefined ? 8 : Math.floor(Number(limit));
  if (!isFinite(n) || n < 1) n = 1;
  var rows = [];
  for (var key in table) {
    if (!Object.prototype.hasOwnProperty.call(table, key)) continue;
    var sep = key.lastIndexOf(':');
    rows.push({
      key: key,
      state: key.slice(0, sep),
      action: Number(key.slice(sep + 1)),
      value: Number(table[key])
    });
  }
  rows.sort(function (x, y) { return y.value - x.value; });
  return rows.slice(0, n);
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
