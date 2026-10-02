// ============================================================================
// TOPIC MODELING TECHNIQUES FOR 2026 ENGINE
// Seeded KeyNMF, LLM Summarization Preprocessing, Zero-Shot LLM Topic Labeling & 25-Yr Trend Tracking
// ============================================================================

export const SEEDED_SCENARIOS = [
  {
    id: "eurozone_expansion",
    seedPhrase: "Expansion of the Eurozone and Monetary Union",
    category: "Eurozone Integration",
    description: "Conditions KeyNMF to focus on Euro adoption, convergence criteria, and member state expansion across Europe.",
    seedExponent: 3.0,
    documentsEvaluated: 279,
    topKeywords: ["gdp", "economic", "euro", "growth", "economy", "assessment", "analysis", "macroeconomic", "convergence", "adoption"],
    discoveredTopics: [
      { id: 0, title: "Eurozone GDP & Macroeconomic Growth", words: ["gdp", "economic", "euro", "growth", "economy", "assessment", "analysis", "macroeconomic", "measures", "expected"], relevance: 0.94 },
      { id: 1, title: "Price Stability & Interest Rates", words: ["inflation", "rates", "inflationary", "stability", "euro", "rate", "economy", "economic", "ecb", "expectations"], relevance: 0.88 },
      { id: 2, title: "Fiscal Reforms & Governing Policy", words: ["euro", "fiscal", "stability", "countries", "reforms", "question", "governing", "policy", "european", "policies"], relevance: 0.82 },
      { id: 3, title: "ECB Communications & Media Relations", words: ["ecb", "frankfurt", "communications", "media", "europa", "question", "eu", "refinancing", "statement", "press"], relevance: 0.76 }
    ],
    fsmRelevanceScore: 0.91,
    prunedJunkTopics: 6
  },
  {
    id: "subprime_liquidity",
    seedPhrase: "Subprime Mortgage Default & Interbank Liquidity Crisis",
    category: "Financial Stability",
    description: "Extracts topics specifically related to credit crunch, emergency bank liquidity, and central bank asset purchase programs (2007-2012).",
    seedExponent: 3.5,
    documentsEvaluated: 279,
    topKeywords: ["liquidity", "interbank", "credit", "m3", "loans", "banks", "refinancing", "emergency", "collateral", "haircut"],
    discoveredTopics: [
      { id: 0, title: "Emergency Bank Liquidity & Collateral", words: ["liquidity", "banks", "refinancing", "collateral", "interbank", "haircut", "facilities", "tenders", "overnight", "lending"], relevance: 0.97 },
      { id: 1, title: "Credit Growth & Monetary Aggregates (M3/M1)", words: ["m3", "credit", "monetary", "growth", "lending", "liquidity", "loans", "financial", "money", "m1"], relevance: 0.92 },
      { id: 2, title: "Financial Market Tensions & Risk Assessment", words: ["risks", "downside", "growth", "tensions", "financial", "markets", "uncertainty", "volatility", "contagion", "spreads"], relevance: 0.86 }
    ],
    fsmRelevanceScore: 0.95,
    prunedJunkTopics: 8
  },
  {
    id: "post_covid_inflation",
    seedPhrase: "Post-COVID Supply Chain Bottlenecks and Double-Digit Inflation",
    category: "Inflation Shock",
    description: "Conditions the model to isolate energy price shocks, wage-price spirals, and rapid interest rate hikes (2021-2024).",
    seedExponent: 4.0,
    documentsEvaluated: 279,
    topKeywords: ["hicp", "inflation", "energy", "bottlenecks", "wages", "pressures", "tightening", "restrictive", "hiking", "target"],
    discoveredTopics: [
      { id: 0, title: "HICP Inflation & Energy Price Shocks", words: ["inflation", "hicp", "expectations", "expected", "wage", "energy", "prices", "price", "medium", "pressures"], relevance: 0.98 },
      { id: 1, title: "Monetary Policy Stance & Rate Tightening", words: ["policy", "monetary", "rate", "fiscal", "rates", "decisions", "transmission", "measures", "restrictive", "stance"], relevance: 0.93 },
      { id: 2, title: "Governing Council Consensus & Rate Hikes", words: ["council", "governing", "rate", "decision", "meeting", "refinancing", "consensus", "unanimous", "ensure", "rates"], relevance: 0.89 }
    ],
    fsmRelevanceScore: 0.96,
    prunedJunkTopics: 7
  }
];

export const PREPROCESSING_COMPARISON = {
  rawText: {
    label: "Option A: Raw Text (No Preprocessing)",
    avgTokenLength: 4200,
    transformerFits: "Truncated at 512 tokens (88% text lost)",
    topicQualityScore: 62,
    junkTopicsPct: 35,
    bicOptimalTopics: 18,
    issues: "High-dimensional embedding space causes Euclidean distance inflation ($S^3$ signal separation problem). Models generate boilerplate ECB legal disclaimers as junk topics."
  },
  chunkedText: {
    label: "Option B: Fixed-Size Text Chunking",
    avgTokenLength: 450,
    transformerFits: "100% tokens processed across 10-15 chunks/doc",
    topicQualityScore: 78,
    junkTopicsPct: 18,
    bicOptimalTopics: 14,
    issues: "Chunks lose overall document context; introductory press conference opening statements split away from Q&A discussions, causing duplicate fragmented topics."
  },
  llmSummary: {
    label: "Option C: 2026 LLM Preprocessing & Summarization (GPT-5-nano / Open LLM)",
    avgTokenLength: 280,
    transformerFits: "100% semantic key points fit in context window",
    topicQualityScore: 96,
    junkTopicsPct: 2,
    bicOptimalTopics: 10,
    advantages: "LLM extracts 5-8 crisp bullet points per speech, stripping legal boilerplate and tokenization noise. KeyNMF matrix factorization runs 4x faster with zero context loss."
  }
};

export const TWENTY_FIVE_YEAR_TRENDS = [
  { year: 2002, eurozoneIntegration: 42, monetaryPolicy: 28, liquidityCrisis: 10, inflationShock: 20 },
  { year: 2004, eurozoneIntegration: 48, monetaryPolicy: 24, liquidityCrisis: 8, inflationShock: 20 },
  { year: 2006, eurozoneIntegration: 35, monetaryPolicy: 32, liquidityCrisis: 12, inflationShock: 21 },
  { year: 2008, eurozoneIntegration: 18, monetaryPolicy: 25, liquidityCrisis: 45, inflationShock: 12 },
  { year: 2010, eurozoneIntegration: 22, monetaryPolicy: 30, liquidityCrisis: 38, inflationShock: 10 },
  { year: 2012, eurozoneIntegration: 20, monetaryPolicy: 46, liquidityCrisis: 24, inflationShock: 10 },
  { year: 2014, eurozoneIntegration: 15, monetaryPolicy: 58, liquidityCrisis: 18, inflationShock: 9 },
  { year: 2016, eurozoneIntegration: 12, monetaryPolicy: 62, liquidityCrisis: 16, inflationShock: 10 },
  { year: 2018, eurozoneIntegration: 14, monetaryPolicy: 52, liquidityCrisis: 18, inflationShock: 16 },
  { year: 2020, eurozoneIntegration: 10, monetaryPolicy: 55, liquidityCrisis: 25, inflationShock: 10 },
  { year: 2022, eurozoneIntegration: 8, monetaryPolicy: 28, liquidityCrisis: 12, inflationShock: 52 },
  { year: 2024, eurozoneIntegration: 9, monetaryPolicy: 32, liquidityCrisis: 11, inflationShock: 48 },
  { year: 2026, eurozoneIntegration: 11, monetaryPolicy: 40, liquidityCrisis: 10, inflationShock: 39 }
];

export const LLM_TOPIC_LABELS = [
  {
    topicId: 0,
    label: "HICP Inflation & Price Dynamics",
    description: "Assesses Harmonised Index of Consumer Prices (HICP), wage pressures, energy price shocks, and medium-term inflation expectations.",
    keywords: ["inflation", "hicp", "expectations", "expected", "wage", "energy", "prices", "price", "medium", "pressures"],
    prevalence: "24.5%",
    trendPeak: "2022-2023 (Double-Digit Inflation Crisis)"
  },
  {
    topicId: 1,
    label: "Interest Rate Decisions & Key ECB Policy",
    description: "Outlines Governing Council interest rate adjustments, deposit facility rates, refinancing operations, and monetary policy stance.",
    keywords: ["ecb", "rates", "unchanged", "kept", "key", "rate", "liquidity", "banks", "market", "exchange"],
    prevalence: "21.2%",
    trendPeak: "2011 & 2022 (Rate Hike Cycles)"
  },
  {
    topicId: 2,
    label: "Monetary Aggregates & Bank Credit (M3/M1)",
    description: "Tracks credit creation, commercial bank lending growth, money supply dynamics (M3, M1), and banking sector liquidity.",
    keywords: ["m3", "credit", "monetary", "growth", "lending", "liquidity", "loans", "financial", "money", "m1"],
    prevalence: "16.8%",
    trendPeak: "2008 (Global Financial Crisis)"
  },
  {
    topicId: 3,
    label: "Euro Area Macroeconomic Real GDP Growth",
    description: "Evaluates GDP growth projections, real economic activity, quarterly demand, exports, and macroeconomic forecast models.",
    keywords: ["gdp", "growth", "real", "economic", "projections", "quarter", "demand", "q2", "expected", "economy"],
    prevalence: "14.4%",
    trendPeak: "2004 & 2017 (Economic Expansion)"
  },
  {
    topicId: 4,
    label: "Eurozone Integration & Structural Fiscal Reforms",
    description: "Focuses on Stability and Growth Pact compliance, structural economic reforms, fiscal consolidation, and Euro adoption.",
    keywords: ["euro", "area", "economy", "banknotes", "reforms", "fiscal", "convergence", "countries", "european", "pact"],
    prevalence: "12.1%",
    trendPeak: "2002-2004 (Euro Banknote Launch & Union Enlargement)"
  },
  {
    topicId: 5,
    label: "Economic Outlook & Downside Risk Assessment",
    description: "Identifies downside and upside risks to economic growth, geopolitical tensions, trade tariffs, and global economic uncertainty.",
    keywords: ["risks", "downside", "growth", "balanced", "outlook", "upside", "prices", "tensions", "potential", "global"],
    prevalence: "11.0%",
    trendPeak: "2020 (Pandemic Shock)"
  }
];
