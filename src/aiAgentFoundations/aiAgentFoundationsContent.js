// AI Agent Foundations — Understanding AI agents, core architecture, Think-Act-Observe workflow,
// popular frameworks (LangChain, LangGraph, LlamaIndex, CrewAI, n8n, Agno), and specialized protocols (A2A, MCP, AgentOps).
// Content sanitized: external author/site references and CTAs removed.
// Framework deep-dives reproduced in full.

export const TRACK_OVERVIEW = {
  audience: "Engineers and learners who want a solid foundation in AI agent concepts, architecture, and the framework landscape before building.",
  prerequisites: "Basic programming experience; no prior AI/ML knowledge required.",
  pacing: "5 sub-tabs, ~25 minutes to cover.",
  outcomes: [
    "Define what an AI agent is and list its 5 key characteristics.",
    "Explain the core architecture (AI Brain, Memory, Tools, Perception/Reasoning/Action/Memory layers).",
    "Walk through the Think-Act-Observe workflow.",
    "Compare 6 popular frameworks and choose the right one for a given use case.",
    "Describe specialized protocols (A2A, MCP) and monitoring tools (AgentOps).",
  ],
};

export const KEY_CHARACTERISTICS = [
  { characteristic: "Autonomy", description: "They operate independently with minimal human oversight" },
  { characteristic: "Perception", description: "They gather and process information from their environment" },
  { characteristic: "Reasoning", description: "They can break down complex problems and plan solutions" },
  { characteristic: "Action", description: "They execute tasks using integrated tools and APIs" },
  { characteristic: "Learning", description: "They improve performance based on experience and feedback" },
];

export const ARCHITECTURE_COMPONENTS = [
  { component: "Perception Layer", description: "Processes inputs from various sources like text, images, APIs, and sensors to understand the current state." },
  { component: "Reasoning Engine", description: "Analyzes information, makes decisions, and plans actions based on goals and constraints." },
  { component: "Action Interface", description: "Executes decisions through tool calls, API interactions, or direct responses." },
  { component: "Memory System", description: "Maintains context across interactions and learns from experiences to improve future performance." },
];

export const THINK_ACT_OBSERVE = [
  {
    step: "Think",
    description: "The agent analyzes the current situation, processes available information, and formulates a plan.",
    details: ["Parse input and context", "Analyze available options", "Plan optimal approach", "Consider constraints"],
  },
  {
    step: "Act",
    description: "The agent executes its plan by taking concrete actions through available tools and interfaces.",
    details: ["Execute planned actions", "Use appropriate tools", "Make API calls", "Generate responses"],
  },
  {
    step: "Observe",
    description: "The agent evaluates the results of its actions and updates its understanding for future decisions.",
    details: ["Assess action outcomes", "Update memory", "Learn from feedback", "Adjust strategy"],
  },
];

export const FRAMEWORKS = [
  {
    name: "LangChain",
    tagline: "The Comprehensive Ecosystem",
    description: "A comprehensive framework for developing applications with language models, offering extensive tool integration and community support.",
    features: ["Extensive tool library", "Memory management", "Chain composition", "Vector stores", "Document loaders"],
    strengths: ["Large community", "Comprehensive documentation", "Rich ecosystem", "Production ready"],
    bestFor: ["Enterprise applications", "RAG systems", "Chatbots", "Document processing"],
  },
  {
    name: "LangGraph",
    tagline: "Advanced Workflow Management",
    description: "Built on LangChain, provides graph-based workflow management for complex, stateful agent applications.",
    features: ["Graph-based workflows", "State management", "Conditional routing", "Parallel execution", "Error handling"],
    strengths: ["Visual workflow design", "Complex logic handling", "Stateful operations", "Built on LangChain"],
    bestFor: ["Complex workflows", "Multi-step processes", "Conditional logic", "State machines"],
  },
  {
    name: "LlamaIndex",
    tagline: "Data-Centric Agent Development",
    description: "Specialized framework for building data-aware applications with excellent indexing and retrieval capabilities.",
    features: ["Data indexing", "Query engines", "RAG optimization", "Multi-modal support", "Knowledge graphs"],
    strengths: ["Data handling", "Retrieval optimization", "Multi-modal", "Research-backed"],
    bestFor: ["Knowledge bases", "Document search", "RAG applications", "Data analysis"],
  },
  {
    name: "CrewAI",
    tagline: "Multi-Agent Team Coordination",
    description: "Framework designed for orchestrating teams of AI agents working together on complex tasks.",
    features: ["Multi-agent coordination", "Role-based agents", "Task delegation", "Collaboration tools", "Team workflows"],
    strengths: ["Team coordination", "Role specialization", "Task distribution", "Collaboration focus"],
    bestFor: ["Team automation", "Complex projects", "Collaborative tasks", "Workflow orchestration"],
  },
  {
    name: "n8n",
    tagline: "Visual Workflow Automation",
    description: "No-code/low-code platform for creating automated workflows with AI agent capabilities.",
    features: ["Visual workflow editor", "No-code approach", "Extensive integrations", "Self-hosted option", "Community nodes"],
    strengths: ["User-friendly", "Visual design", "No coding required", "Extensive integrations"],
    bestFor: ["Business automation", "Integration workflows", "Rapid prototyping", "Non-technical users"],
  },
  {
    name: "Agno Framework",
    tagline: "High-Performance Multi-Agent Development",
    description: "Modern framework optimized for performance and scalability in multi-agent environments.",
    features: ["High performance", "Scalable architecture", "Modern design", "Multi-agent support", "Cloud native"],
    strengths: ["Performance optimized", "Modern architecture", "Scalability", "Cloud ready"],
    bestFor: ["High-performance apps", "Scalable systems", "Cloud deployments", "Enterprise solutions"],
  },
];

export const FRAMEWORK_SELECTION = [
  { audience: "Beginners", recommendation: "Start with LangChain for comprehensive learning or n8n for visual, no-code approach." },
  { audience: "Complex Workflows", recommendation: "Use LangGraph for advanced state management or CrewAI for multi-agent coordination." },
  { audience: "Data-Heavy Applications", recommendation: "Choose LlamaIndex for optimized data handling and retrieval capabilities." },
  { audience: "Enterprise & Scale", recommendation: "Consider Agno Framework for high-performance requirements or LangChain for proven production use." },
];

export const SELECTION_CRITERIA = [
  "Community & Support",
  "Development Experience",
  "Ecosystem & Tools",
  "Production Readiness",
];

export const SPECIALIZED_FRAMEWORKS = [
  {
    name: "Hugging Face Agents Course",
    tagline: "Learning Foundation",
    description: "Comprehensive educational resources and tools for learning AI agent development. Offers hands-on experience with state-of-the-art models and practical implementation techniques.",
    highlights: ["Interactive notebooks and tutorials", "Access to cutting-edge models", "Community-driven learning", "Real-world project examples"],
    benefits: ["Free and accessible education", "Industry best practices", "Model Hub integration", "Community support"],
    perfectFor: "Developers new to AI agents who want structured learning with access to the latest models and techniques.",
  },
  {
    name: "A2A Protocol",
    tagline: "Agent-to-Agent Communication",
    description: "Enables seamless communication between different AI agents, allowing them to share information, coordinate tasks, and work together efficiently in distributed systems.",
    features: ["Standardized communication format", "Secure message exchange", "Task delegation mechanisms", "Resource sharing capabilities", "Coordination protocols"],
    useCases: ["Multi-agent orchestration", "Distributed problem solving", "Resource optimization", "Collaborative workflows", "Cross-platform integration"],
  },
  {
    name: "Model Context Protocol (MCP)",
    tagline: "Universal AI Integration Standard",
    description: "Provides a standardized way for AI applications to integrate with external data sources and tools, enabling seamless interoperability across different platforms and services.",
    coreCapabilities: ["Universal integration standard", "Cross-platform compatibility", "Secure data access", "Real-time synchronization"],
    benefits: ["Reduced integration complexity", "Faster development cycles", "Improved interoperability", "Vendor independence"],
    applications: ["Enterprise AI integration", "Multi-vendor environments", "Data pipeline automation", "AI platform federation"],
  },
  {
    name: "AgentOps",
    tagline: "Production Monitoring & Operations",
    description: "Comprehensive monitoring, debugging, and management tools for AI agents in production environments. Offers real-time insights into agent performance, behavior analysis, and operational metrics.",
    monitoring: ["Real-time performance metrics", "Conversation tracking and analysis", "Error detection and alerting", "Usage analytics and insights"],
    operations: ["Automated deployment pipelines", "Version control and rollbacks", "A/B testing capabilities", "Cost optimization tools"],
    enterprise: ["SOC 2 compliance, audit trails, access controls", "Multi-tenant architecture, horizontal scaling, load balancing", "API access, webhook support, third-party tool connectivity"],
  },
];

export const FUTURE_TRENDS = [
  "Standardization of agent communication",
  "Universal integration protocols",
  "Enhanced monitoring and operations",
  "Cross-platform compatibility",
];

export const FUTURE_IMPACT = [
  "Reduced development complexity",
  "Improved production reliability",
  "Better enterprise adoption",
  "Enhanced collaboration capabilities",
];
