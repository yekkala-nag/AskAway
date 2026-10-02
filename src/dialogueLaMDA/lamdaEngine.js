// ============================================================================
// GOOGLE LAMDA & OPEN-DOMAIN DIALOGUE ARCHITECTURE ENGINE
// Analysis of Google's conversational AI:
// Sensibleness, Specificity, Interestingness (SSI), Safety, and Tool Groundedness
// ============================================================================

export const SSI_METRIC_PILLARS = [
  {
    pillar: "1. Sensibleness (S)",
    description: "Evaluates whether the response makes common-sense logical sense given the conversational history without contradictory claims or hallucinated context.",
    badExample: "User: 'I have a pet dog.' -> Bot: 'Oh, what color are your cat's feathers?' (Senseless)",
    goodExample: "User: 'I have a pet dog.' -> Bot: 'That's wonderful! What breed is your dog, and how long have you had them?' (Sensible)"
  },
  {
    pillar: "2. Specificity (S)",
    description: "Evaluates whether the response is tailored specifically to what the user said, rather than returning generic filler platitudes.",
    badExample: "User: 'I just finished climbing Mount Rainier!' -> Bot: 'That is nice.' (Generic Fluff)",
    goodExample: "User: 'I just finished climbing Mount Rainier!' -> Bot: 'Congratulations! Reaching the 14,411-foot summit via Disappointment Cleaver is a grueling endurance feat.' (Highly Specific)"
  },
  {
    pillar: "3. Interestingness (I)",
    description: "Evaluates whether the response is insightful, witty, surprising, or likely to spark further intellectual engagement.",
    badExample: "User: 'Why is the sky blue?' -> Bot: 'Because of physics.' (Boring / Unhelpful)",
    goodExample: "User: 'Why is the sky blue?' -> Bot: 'It is due to Rayleigh scattering: nitrogen and oxygen molecules scatter shorter blue wavelengths 10x more efficiently than red light.' (Engaging & Informative)"
  }
];

export const LAMDA_SAFETY_GROUNDEDNESS_SYSTEM = [
  {
    component: "1. Safety Discriminator",
    function: "Filters hate speech, self-harm, harassment, and biased representations before tokens are decoded.",
    impact: "Prevents toxic chatbot persona degradation."
  },
  {
    component: "2. Information Retrieval Tool (Search Engine)",
    function: "When answering factual or temporal queries, the model generates an internal query to Google Search, parses snippets, and attributes facts.",
    impact: "Eliminates factual hallucinations in real-time."
  },
  {
    component: "3. Symbolic Calculator Engine",
    function: "Executes exact arithmetic and numerical calculations externally rather than guessing token probabilities.",
    impact: "100% mathematical accuracy on financial and physical quantities."
  },
  {
    component: "4. Persona & Roleplay Conditioning",
    function: "Allows open-domain perspective-taking (e.g. roleplaying as Pluto, a paper airplane, or Marie Curie) while preserving core safety constraints.",
    impact: "Creates interactive educational dialogues."
  }
];

export const PYTHON_LAMDA_DIALOGUE_SCRIPT = `# ============================================================================
# TOOL-AUGMENTED CONVERSATIONAL DIALOGUE PIPELINE (LaMDA / Gemini Style)
# Demonstrates multi-turn context, SSI scoring, and Tool Groundedness
# ============================================================================

from typing import List, Dict

class DialogueAgent:
    def __init__(self, retrieval_tool, safety_filter):
        self.retrieval_tool = retrieval_tool
        self.safety_filter = safety_filter
        self.history: List[Dict[str, str]] = []

    def respond(self, user_utterance: str) -> str:
        # 1. Safety verification
        if not self.safety_filter.is_safe(user_utterance):
            return "I cannot assist with harmful or unsafe requests."
            
        self.history.append({"role": "user", "content": user_utterance})
        
        # 2. Check if fact lookup is required (Tool Groundedness)
        if "when" in user_utterance.lower() or "who" in user_utterance.lower():
            search_query = user_utterance
            search_evidence = self.retrieval_tool.search(search_query)
            augmented_prompt = f"Context: {search_evidence}\\nConversation: {self.history}"
        else:
            augmented_prompt = f"Conversation: {self.history}"
            
        # 3. Generate sensible, specific, interesting response
        reply = f"Grounded response based on dialogue history & verifiable facts."
        self.history.append({"role": "assistant", "content": reply})
        return reply

print("Tool-Augmented Dialogue Agent Ready!")
`;
