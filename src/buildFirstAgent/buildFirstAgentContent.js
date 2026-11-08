// Build Your First Agent — Step-by-step tutorial for building a customer service AI agent.
// Content sanitized: external author/site references and CTAs removed.
// Code samples reproduced with framework-specific imports kept (semantically essential).

export const TRACK_OVERVIEW = {
  audience: "Engineers who want a hands-on, step-by-step tutorial for building a complete AI agent from scratch.",
  prerequisites: "Basic Python knowledge; familiarity with AI agent concepts (see AI Agent Foundations tab).",
  pacing: "5 sub-tabs, ~20 minutes to cover.",
  outcomes: [
    "Set up a development environment for AI agent development.",
    "Build a customer service agent with memory, tools, and escalation logic.",
    "Implement tool integration with a knowledge base (vector search).",
    "Understand production readiness steps (error handling, monitoring, testing).",
  ],
};

export const SYSTEM_REQUIREMENTS = [
  { category: "Software", items: ["Python 3.8 or higher", "Node.js 16+ (for web interface)", "Git for version control", "Code editor (VS Code recommended)"] },
  { category: "API Access", items: ["OpenAI API key (GPT-4 recommended)", "Vector database access (Pinecone/Weaviate)", "Cloud deployment account (optional)"] },
];

export const AGENT_CODE = `from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.memory import ConversationBufferWindowMemory
from langchain.tools import Tool
import os

class CustomerServiceAgent:
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4",
            temperature=0.1,
            api_key=os.getenv("OPENAI_API_KEY")
        )

        self.memory = ConversationBufferWindowMemory(
            k=10,  # Keep last 10 exchanges
            memory_key="chat_history",
            return_messages=True
        )

        self.tools = self._create_tools()
        self.agent = self._create_agent()

    def _create_tools(self):
        """Define the tools available to the agent"""
        return [
            Tool(
                name="search_knowledge_base",
                description="Search the company knowledge base for information",
                func=self.search_knowledge_base
            ),
            Tool(
                name="escalate_to_human",
                description="Escalate complex issues to human agents",
                func=self.escalate_to_human
            ),
            Tool(
                name="check_order_status",
                description="Check the status of a customer order by order ID",
                func=self.check_order_status
            )
        ]

    def _create_agent(self):
        """Create the agent with prompt and tools"""
        prompt = ChatPromptTemplate.from_messages([
            ("system", self._get_system_prompt()),
            ("human", "{input}"),
            ("assistant", "{agent_scratchpad}")
        ])

        agent = create_openai_functions_agent(
            llm=self.llm,
            tools=self.tools,
            prompt=prompt
        )

        return AgentExecutor(
            agent=agent,
            tools=self.tools,
            memory=self.memory,
            max_iterations=5,
            verbose=True
        )

    def _get_system_prompt(self):
        return """You are a helpful customer service agent for TechCorp.
        Your role is to assist customers with their inquiries professionally and efficiently.

        Guidelines:
        - Always be polite and empathetic
        - Use available tools to find accurate information
        - If you cannot resolve an issue, escalate to a human agent
        - Keep responses concise but informative
        - Ask clarifying questions when needed

        Available tools:
        1. search_knowledge_base: Find information in the company knowledge base
        2. escalate_to_human: Transfer complex issues to human agents
        3. check_order_status: Look up order information by order ID
        """

    def search_knowledge_base(self, query: str) -> str:
        """Search the knowledge base for relevant information"""
        knowledge_items = {
            "return policy": "Our return policy allows returns within 30 days of purchase with original receipt.",
            "shipping": "Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days.",
            "warranty": "All products come with a 1-year manufacturer warranty covering defects.",
            "payment": "We accept all major credit cards, PayPal, and bank transfers."
        }

        for key, value in knowledge_items.items():
            if key.lower() in query.lower():
                return value

        return "I couldn't find specific information about that. Let me escalate this to a human agent."

    def escalate_to_human(self, reason: str) -> str:
        """Escalate the conversation to a human agent"""
        return f"I'm transferring you to a human agent who can better assist with: {reason}. Please hold while I connect you."

    def check_order_status(self, order_id: str) -> str:
        """Check order status by order ID"""
        if order_id.startswith("ORD"):
            return f"Order {order_id} is currently being processed and will ship within 2 business days."
        else:
            return "Please provide a valid order ID starting with 'ORD'."

    def chat(self, message: str) -> str:
        """Process a user message and return agent response"""
        try:
            response = self.agent.invoke({"input": message})
            return response["output"]
        except Exception as e:
            return f"I'm sorry, I encountered an error: {str(e)}. Let me escalate this to a human agent."

# Usage example
if __name__ == "__main__":
    agent = CustomerServiceAgent()

    print("Customer Service Agent initialized!")
    print("Type 'quit' to exit\\n")

    while True:
        user_input = input("Customer: ")
        if user_input.lower() == 'quit':
            break

        response = agent.chat(user_input)
        print(f"Agent: {response}\\n")`;

export const AGENT_KEY_COMPONENTS = [
  { component: "LLM integration", detail: "Temperature control, model selection, API key management" },
  { component: "Conversation memory", detail: "Buffer window memory with configurable exchange limit" },
  { component: "Tool definition", detail: "Search, escalate, check order status" },
  { component: "System prompt", detail: "Behavior guidelines, tool descriptions, escalation rules" },
];

export const AGENT_BEST_PRACTICES = [
  "Error handling and graceful degradation",
  "Clear tool descriptions for the LLM",
  "Memory limits to prevent context overflow",
  "Escalation paths for complex scenarios",
];

export const KNOWLEDGE_BASE_CODE = `import chromadb
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter

class KnowledgeBase:
    def __init__(self, data_path="./knowledge"):
        self.embeddings = OpenAIEmbeddings()
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        self.vectorstore = self._load_knowledge_base(data_path)

    def _load_knowledge_base(self, data_path):
        """Load and index knowledge base documents"""
        documents = self._load_documents(data_path)
        chunks = self.text_splitter.split_documents(documents)
        vectorstore = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            persist_directory="./chroma_db"
        )
        return vectorstore

    def search(self, query: str, k: int = 3) -> str:
        """Search knowledge base and return relevant information"""
        try:
            docs = self.vectorstore.similarity_search(query, k=k)
            if not docs:
                return "No relevant information found in knowledge base."
            combined_info = "\\n\\n".join([doc.page_content for doc in docs])
            return f"Based on our knowledge base:\\n{combined_info}"
        except Exception as e:
            return f"Error searching knowledge base: {str(e)}"

    def _load_documents(self, data_path):
        """Load documents from various sources"""
        pass`;

export const NEXT_STEPS_ENHANCE = [
  "Add more sophisticated tools and APIs",
  "Implement advanced memory systems",
  "Add multi-modal capabilities (images, voice)",
  "Implement custom evaluation metrics",
];

export const NEXT_STEPS_PRODUCTION = [
  "Add comprehensive error handling",
  "Implement monitoring and logging",
  "Set up automated testing",
  "Configure security and rate limiting",
];

export const WHAT_YOU_BUILD = [
  "Natural language processing for customer inquiries",
  "Knowledge base integration for accurate responses",
  "Human escalation logic for complex issues",
  "Conversation memory for context retention",
  "Tool integration for order status checks",
];
