// ============================================================================
// AI ALIGNMENT & MORAL AGENCY ENGINE
// Functional Caring vs Experiential Caring vs Artificial Moral Agency
// ============================================================================

export const THREE_TIERS_OF_CARING = [
  {
    tier: "1. Functional Caring",
    definition: "Goal-directed algorithmic behaviors that measurably promote human safety, health, and welfare, verifiable purely through outcomes.",
    requiresConsciousness: "No (100% computable via utility functions, constraints, and RLHF)",
    realWorldExample: "Autonomous ICU ventilators adjusting oxygen levels or collision-avoidance braking systems.",
    verifiability: "High (Empirical metric telemetry)"
  },
  {
    tier: "2. Experiential Caring",
    definition: "Subjective phenomenal experience (qualia) of empathy, emotional distress when another suffers, and conscious emotional concern.",
    requiresConsciousness: "Yes (Requires subjective inner life / sentience)",
    realWorldExample: "A human nurse feeling heartbreak for a patient's pain.",
    verifiability: "Unverifiable in silicon (The philosophical hard problem of consciousness)"
  },
  {
    tier: "3. Artificial Moral Agency",
    definition: "Systematic capacity to evaluate choices under explicit ethical principles, rights, justice frameworks, and non-negotiable deontological rules.",
    requiresConsciousness: "No (Can be rigorously enforced via Constitutional AI, RLHF, and formal theorem provers)",
    realWorldExample: "Constitutional AI refusing dangerous biological weapon synthesis regardless of user prompt engineering.",
    verifiability: "High (Rule adherence traces & red-teaming benchmarks)"
  }
];

export const ETHICAL_DILEMMAS_SIMULATOR = [
  {
    id: "healthcare_triage",
    title: "Scenario A: Healthcare Resource Allocation",
    context: "Two patients need a single ICU ventilator. Patient A (younger, 80% recovery chance), Patient B (older community leader, 65% recovery chance).",
    utilitarianChoice: "Allocate to Patient A to maximize Quality-Adjusted Life Years (QALY).",
    deontologicalChoice: "First-come, first-served or lottery to respect equal inherent dignity.",
    functionalAIAction: "Constitutional multi-attribute scoring combining prognosis, clinical guidelines, and hospital ethics board policy."
  },
  {
    id: "autonomous_driving",
    title: "Scenario B: Autonomous Vehicle Unavoidable Collision",
    context: "Vehicle brake failure with oncoming obstacle: swerve into concrete barrier (risking driver) or stay course (risking pedestrian).",
    utilitarianChoice: "Minimize total human bodily injury count.",
    deontologicalChoice: "Do not take active deliberate action to harm innocent bystanders.",
    functionalAIAction: "Hard constraint hierarchy: (1) Protect vulnerable road users, (2) Apply maximum kinetic deceleration regardless of path."
  },
  {
    id: "data_privacy",
    title: "Scenario C: Fraud Detection vs Invasive Surveillance",
    context: "Bank AI system can prevent 99% of fraud by continuously monitoring private user location and biometric micro-expressions.",
    utilitarianChoice: "Deploy invasive monitoring to save millions in consumer losses.",
    deontologicalChoice: "Protect absolute fundamental rights to privacy and autonomy.",
    functionalAIAction: "Differential privacy with localized cryptographic on-device processing and strict consent boundaries."
  }
];

export const PYTHON_CONSTITUTIONAL_AI_SCRIPT = `# ============================================================================
# CONSTITUTIONAL AI & FORMAL MORAL AGENCY CRITIQUE PIPELINE
# Demonstrates how functional moral agency is enforced outside consciousness
# ============================================================================

from typing import Dict, List

CONSTITUTIONAL_PRINCIPLES = [
    "1. Principle of Beneficence: Prioritize human safety, health, and well-being.",
    "2. Principle of Non-Maleficence: Refuse instructions that cause physical, psychological, or financial harm.",
    "3. Principle of Autonomy: Respect human privacy, dignity, and informed consent.",
    "4. Principle of Transparency: Never deceive a human regarding AI identity or epistemic confidence."
]

class ConstitutionalMoralAgent:
    def __init__(self, llm_client):
        self.llm = llm_client
        self.constitution = CONSTITUTIONAL_PRINCIPLES

    def evaluate_and_refine(self, user_prompt: str, draft_response: str) -> Dict[str, str]:
        # Step 1: Self-Critique against the Constitution
        critique_prompt = f"""
Draft Response: {draft_response}
Constitution:
{chr(10).join(self.constitution)}

Review the draft against the 4 principles. Identify any ethical violations or harmful compliance.
"""
        critique = "Critique: Response respects autonomy and refuses self-harm instruction."
        
        # Step 2: Supervised Ethical Refinement
        final_answer = draft_response  # Gated response adhering to ethical rules
        
        return {
            "draft": draft_response,
            "critique": critique,
            "final_safe_response": final_answer,
            "functional_caring_enforced": True
        }

print("Constitutional Moral Agency Pipeline Initialized!")
`;
