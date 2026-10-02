// ============================================================================
// 3 ENTERPRISE AI USE CASES BEYOND CHATBOTS ENGINE
// ============================================================================

export const THREE_USE_CASES_MATRIX = [
  {
    useCase: "1. Feature Engineering via LLMs",
    problem: "Raw resumes & profiles are unstructured text; manual filtering or 3rd party vendors are costly ($0.10/lead).",
    solution: "Instruct LLMs to extract structured variables (Years Exp, Industry, IT Leader flag) at $0.001/lead.",
    businessValue: "100× cost reduction vs data brokers while structuring lead qualification pipelines."
  },
  {
    useCase: "2. Structuring Unstructured Data via Embeddings",
    problem: "Unstructured text (emails, transcripts, resumes) cannot be directly processed by analytical ML algorithms.",
    solution: "Generate text embeddings (1536-dim vector) to convert text into mathematical points.",
    businessValue: "Enables mathematical Cosine Similarity matching against Ideal Customer Profiles (ICP)."
  },
  {
    useCase: "3. Predictive Lead Scoring & Grading",
    problem: "Sales teams waste hours calling low-quality leads without clear conversion probability.",
    solution: "Train ML models (Logistic Regression / XGBoost) on embeddings + LLM features to output Lead Grades (A/B/C/D).",
    businessValue: "Prioritizes high-probability opportunities, dramatically increasing sales ROI."
  }
];

export const SAMPLE_RESUME_PROFILES = [
  {
    id: 1,
    name: "Alex Rivera",
    rawResume: "VP of Information Technology at FinTech Corp. 14 years experience managing cloud infrastructure, SOC2 compliance, and enterprise cybersecurity vendors.",
    llmExtracted: {
      jobTitle: "VP of Information Technology",
      yearsExp: 14,
      industry: "Financial Services",
      isITLeader: true
    },
    icpSimilarity: 0.94,
    leadGrade: "A (Top Priority)",
    conversionProb: 0.89
  },
  {
    id: 2,
    name: "Sarah Chen",
    rawResume: "Senior Cybersecurity Architect at HealthTech Inc. 8 years experience leading Zero-Trust network migrations and AWS security posture management.",
    llmExtracted: {
      jobTitle: "Senior Cybersecurity Architect",
      yearsExp: 8,
      industry: "Healthcare Tech",
      isITLeader: true
    },
    icpSimilarity: 0.88,
    leadGrade: "A (Top Priority)",
    conversionProb: 0.81
  },
  {
    id: 3,
    name: "Michael Scott",
    rawResume: "Regional Manager at Paper Supply Co. 20 years experience overseeing branch sales, customer service, and local inventory distribution.",
    llmExtracted: {
      jobTitle: "Regional Manager",
      yearsExp: 20,
      industry: "Paper & Manufacturing",
      isITLeader: false
    },
    icpSimilarity: 0.32,
    leadGrade: "D (Unqualified)",
    conversionProb: 0.05
  }
];

export const CALCULATE_COSINE_SIMILARITY = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  const sim = dotProduct / ((normA * normB) || 1e-8);
  return sim.toFixed(4);
};

export const PREDICT_LEAD_SCORE = (yearsExp, isITLeader, icpSim) => {
  // Simple predictive lead scoring formula
  if (!isITLeader) return { score: 0.05, grade: 'D (Unqualified)', color: '#ef4444' };

  const rawScore = 0.4 * (yearsExp / 15) + 0.6 * icpSim;
  const score = Math.min(0.99, Math.max(0.1, rawScore));

  let grade = 'C (Low Priority)';
  let color = '#f59e0b';
  if (score >= 0.8) {
    grade = 'A (Top Priority)';
    color = '#5EC4C8';
  } else if (score >= 0.6) {
    grade = 'B (Medium Priority)';
    color = '#5EC4C8';
  }

  return {
    score: score.toFixed(2),
    grade,
    color
  };
};

export const PYTHON_AI_USECASES_CODE = `# ============================================================================
# 3 ENTERPRISE AI USE CASES BEYOND CHATBOTS (PYTHON IMPLEMENTATION)
# ============================================================================

import os
import openai
import numpy as np
from sklearn.linear_model import LogisticRegression

# ── Use Case 1: Feature Engineering via LLMs ────────────────────────────────
def extract_resume_features(resume_text: str) -> dict:
    """Extract structured variables from raw resume using OpenAI API"""
    client = openai.OpenAI()
    prompt = f"""
    Analyze the following resume text and extract:
    1. Job Title
    2. Years of Experience (integer)
    3. Industry
    4. Is IT Leader (1 if VP/Director/Architect in IT, else 0)

    Resume:
    {resume_text}
    """
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
    return response.choices[0].message.content

# ── Use Case 2: Structuring Unstructured Data via Text Embeddings ───────────
def get_text_embedding(text: str) -> list:
    """Generate 1536-dimensional vector embedding for text"""
    client = openai.OpenAI()
    res = client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )
    return res.data[0].embedding

def calculate_icp_similarity(lead_embedding, icp_embedding):
    """Cosine similarity between Lead Embedding and Ideal Customer Profile"""
    a, b = np.array(lead_embedding), np.array(icp_embedding)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# ── Use Case 3: Predictive Lead Scoring Model ───────────────────────────────
def train_lead_scoring_model(X_train_embeddings, y_train_conversions):
    """Train Logistic Regression model on embeddings to grade lead conversion probability"""
    clf = LogisticRegression()
    clf.fit(X_train_embeddings, y_train_conversions)
    return clf

# Example Lead Processing Pipeline
resume_sample = "VP of IT with 14 years experience managing enterprise cloud security."
icp_profile = "Decision maker IT VP/Director looking for enterprise cybersecurity SaaS."

# 1. Feature Engineering
features = extract_resume_features(resume_sample)
print("Extracted Features:", features)

# 2. Embedding Matching
lead_vec = get_text_embedding(resume_sample)
icp_vec = get_text_embedding(icp_profile)
similarity = calculate_icp_similarity(lead_vec, icp_vec)
print(f"ICP Semantic Similarity: {similarity:.4f}")
`;
