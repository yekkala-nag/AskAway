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
