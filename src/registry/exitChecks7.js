/**
 * Exit-check bank G — positional encoding, TRPO→GRPO, enterprise-grade,
 * functools tricks. Same shape as exitChecks.js.
 */
export const EXIT_CHECKS_G = {
  posencoding: [
    { q: 'Shuffle test proves…', o: ['Attention without p is order-blind', 'Attention is slow', 'Embeddings fail', 'Softmax breaks'], a: 0, e: 'Same values rearranged → identical scores, story gone.' },
    { q: 'Sinusoidal clocks give…', o: ['Smooth neighborhoods + stable relative offsets', 'Random IDs', 'Wall-clock time', 'Longer context'], a: 0, e: '+7 means the same from 3→10 or 20→27.' },
    { q: 'Irregular series need…', o: ['Timestamps/calendar/gap features, not just position', 'Longer windows', 'Higher temperature', 'More layers'], a: 0, e: 'Position ≠ time when spacing varies.' }
  ],
  trpo2grpo: [
    { q: 'In LLM RL, the policy is…', o: ['Token distribution = the weights', 'The reward model', 'The dataset', 'The prompt'], a: 0, e: 'Rewards reshape πθ toward better tokens.' },
    { q: 'PPO replaced TRPO’s hard KL with…', o: ['A clipped surrogate objective', 'No constraint', 'Bigger batches', 'More models'], a: 0, e: 'Same caution, simple optimization.' },
    { q: 'GRPO drops…', o: ['The value model, via group z-scores', 'The reward model', 'The policy', 'Training'], a: 0, e: 'A_i=(r_i−μ)/σ — DeepSeek’s efficiency edge.' }
  ],
  enterprisegrade: [
    { q: 'Best enterprise AI bets…', o: ['Mundane forecast/anomaly/classify plays', 'Moonshots only', 'Chatbots only', 'Art generation'], a: 0, e: '10–20% compounding edges beat revolutions.' },
    { q: 'Apple Card lesson…', o: ['Proxy features re-infer dropped attributes', 'Gender inputs required', 'Models are fair', 'Data volume fixes bias'], a: 0, e: 'Suppression never removes the signal.' },
    { q: 'Label-free drift canaries…', o: ['Feature + prediction drift', 'Concept drift', 'Label drift', 'No drift'], a: 0, e: 'Ground truth arrives late; proxies carry the near term.' },
    { q: 'The six data requirements begin with…', o: ['Semantic clarity — one term, one meaning, enforced at write time', 'Bigger models', 'More GPUs', 'Longer prompts'], a: 0, e: 'Without shared meaning, entity resolution and everything downstream inherits the ambiguity.' },
    { q: 'Temporal awareness exists so agents…', o: ['See when facts became and stopped being true — stale context is visible, not silent', 'Run faster queries', 'Skip governance', 'Avoid vector search'], a: 0, e: 'Valid time on every fact kills confident answers built on last quarter’s numbers.' },
    { q: 'Why can’t vector-only retrieval carry multi-step agent reasoning?', o: ['Nearest neighbors cannot join entities, filter by valid time, or traverse relations', 'Vectors are too large', 'Embeddings expire', 'Agents refuse embeddings'], a: 0, e: 'Operational reasoning needs joins, time, and graphs — a contextual layer, not a bigger index.' }
  ],
  functools: [
    { q: '@total_ordering needs…', o: ['__eq__ plus one ordering method', 'All six dunders', 'No methods', 'Only __init__'], a: 0, e: 'Derives the rest — too slow for hot paths.' },
    { q: 'partial() freezes…', o: ['Leading args into families', 'Return values', 'Exceptions', 'Imports'], a: 0, e: 'One base function, many preset variants.' },
    { q: '@singledispatch routes on…', o: ['First-argument type', 'Return type', 'Arity', 'Name'], a: 0, e: 'Type overloads without if-chains.' }
  ]
};
