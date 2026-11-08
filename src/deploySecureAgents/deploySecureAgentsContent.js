// Deploy & Secure Agents — Hosting, deployment, scaling, security, compliance, and data protection.
// Content sanitized: external author/site references and CTAs removed.
// Code samples reproduced with framework-specific imports kept (semantically essential).

export const TRACK_OVERVIEW = {
  audience: "Engineers who need to take an AI agent from development to production with proper hosting, scaling, security, and compliance.",
  prerequisites: "Familiarity with AI agent concepts and basic deployment experience.",
  pacing: "6 sub-tabs, ~25 minutes to cover.",
  outcomes: [
    "Choose the right cloud platform and deployment strategy for an AI agent.",
    "Implement horizontal and vertical scaling with performance optimization.",
    "Apply security best practices: auth, input validation, prompt injection prevention, encryption.",
    "Navigate compliance frameworks (GDPR, SOC 2, HIPAA, PCI DSS, FedRAMP).",
    "Set up monitoring, incident response, and security checklists.",
  ],
};

export const THREE_PILLARS = [
  { pillar: "Performance", description: "Ensure your agent responds quickly and handles concurrent requests efficiently.", details: ["Response time optimization", "Concurrent request handling", "Caching strategies", "Resource optimization"] },
  { pillar: "Reliability", description: "Build resilient systems that gracefully handle failures and maintain uptime.", details: ["Error handling & recovery", "Health checks & monitoring", "Failover mechanisms", "Backup strategies"] },
  { pillar: "Observability", description: "Gain insights into your agent's behavior and performance in production.", details: ["Logging & tracing", "Metrics collection", "Alerting systems", "Performance analytics"] },
];

export const SCALING_STRATEGIES = [
  { strategy: "Horizontal Scaling", description: "Add more instances to handle increased load.", details: ["Load balancing: Distribute requests across multiple agent instances", "Auto-scaling: Automatically adjust capacity based on demand", "Session affinity: Route users to the same instance for consistency"] },
  { strategy: "Vertical Scaling", description: "Increase resources of existing instances.", details: ["CPU optimization: Increase processing power for complex reasoning", "Memory expansion: Handle larger contexts and conversation history", "GPU acceleration: Speed up model inference and embeddings"] },
];

export const PERFORMANCE_TIPS = [
  { category: "Caching", tips: ["Cache frequent API responses", "Store embeddings for repeated queries", "Use Redis for session data", "Implement CDN for static assets"] },
  { category: "Database Optimization", tips: ["Index frequently queried fields", "Use read replicas for scaling", "Implement connection pooling", "Archive old conversation data"] },
  { category: "Model Optimization", tips: ["Use appropriate model sizes", "Implement request batching", "Optimize prompt engineering", "Consider model quantization"] },
];

export const DEPLOYMENT_CHECKLIST = [
  { phase: "Pre-Deployment", items: ["Environment variables configured", "Database migrations tested", "API keys and secrets secured", "Load testing completed", "Error handling verified"] },
  { phase: "Post-Deployment", items: ["Monitoring and alerts configured", "Backup systems verified", "Health checks enabled", "Performance metrics tracked", "Security scans completed"] },
];

export const SECURITY_VULNERABILITIES = [
  { vulnerability: "Prompt Injection", description: "Malicious users try to manipulate the agent's behavior through crafted inputs.", mitigation: "Input sanitization, prompt templates, context isolation, output validation" },
  { vulnerability: "Data Leakage", description: "Sensitive information exposed through agent responses or logs.", mitigation: "Data classification, access controls, log sanitization, encryption at rest" },
  { vulnerability: "Tool Abuse", description: "Unauthorized access or misuse of integrated tools and APIs.", mitigation: "Tool restrictions, permission scoping, audit logging, rate limiting" },
];

export const COMPLIANCE_FRAMEWORKS = [
  { framework: "GDPR", requirements: ["Right to be forgotten: implement data deletion capabilities", "Data minimization: collect and process only necessary personal data", "Consent management: obtain explicit consent for data processing", "Data portability: allow users to export their data"] },
  { framework: "SOC 2", requirements: ["Security: protection against unauthorized access", "Availability: system uptime and operational performance", "Processing integrity: accuracy and completeness of system processing", "Confidentiality: protection of confidential information"] },
  { framework: "HIPAA (Healthcare)", requirements: ["PHI encryption requirements", "Access logging and monitoring", "Business Associate Agreements", "Data breach notification"] },
  { framework: "PCI DSS (Financial)", requirements: ["Payment data protection", "Secure network architecture", "Regular security testing", "Vulnerability management"] },
  { framework: "FedRAMP (Government)", requirements: ["Continuous monitoring", "Third-party assessments", "Incident response plans", "Data residency requirements"] },
];

export const SECURITY_CHECKLIST = [
  { category: "Authentication", items: ["Multi-factor authentication enabled", "Strong password policies enforced", "Session management implemented", "JWT tokens properly secured"] },
  { category: "Data Protection", items: ["Encryption at rest configured", "TLS/HTTPS for all endpoints", "PII anonymization implemented", "Data backup and recovery tested"] },
  { category: "Monitoring", items: ["Security event logging enabled", "Anomaly detection configured", "Incident response plan documented", "Regular security audits scheduled"] },
];

export const RBAC_ROLES = [
  { role: "Admin", permissions: "Full agent configuration access" },
  { role: "Developer", permissions: "Code and deployment rights" },
  { role: "Viewer", permissions: "Read-only monitoring access" },
  { role: "User", permissions: "Limited interaction permissions" },
];

export const ENCRYPTION_STRATEGIES = [
  { strategy: "At Rest", details: "Fernet symmetric encryption for sensitive data fields (user input, agent response, context)" },
  { strategy: "In Transit", details: "TLS 1.3 for all communications, certificate pinning, end-to-end encryption, secure WebSocket connections" },
];

export const PRIVACY_BY_DESIGN = [
  { principle: "Data Minimization", details: "Collect only necessary information, implement automatic data expiry, use pseudonymization, regular data audits" },
  { principle: "Anonymization", details: "Remove/mask PII (emails, phones, credit cards, SSNs) from logs and responses" },
];

export const INCIDENT_RESPONSE = [
  "Detection and analysis of security events",
  "Immediate containment and isolation",
  "Investigation and evidence collection",
  "Recovery and system restoration",
  "Post-incident analysis and improvements",
];

export const AUTH_CODE = `import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta

class AuthService:
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"])
        self.secret_key = "your-secret-key"

    def verify_token(self, token: str):
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            raise Exception("Token expired")
        except jwt.InvalidTokenError:
            raise Exception("Invalid token")`;

export const INPUT_SANITIZATION_CODE = `import re

def sanitize_input(user_input: str) -> str:
    """Prevent prompt injection attacks"""

    dangerous_patterns = [
        r"ignore previous instructions",
        r"forget everything above",
        r"system prompt",
        r"\\bGPT\\b",
        r"\\bassistant\\b:",
        r"\\bhuman\\b:",
    ]

    sanitized = user_input
    for pattern in dangerous_patterns:
        sanitized = re.sub(pattern, "[FILTERED]", sanitized, flags=re.IGNORECASE)

    max_length = 1000
    if len(sanitized) > max_length:
        sanitized = sanitized[:max_length] + "..."

    return sanitized`;

export const ENCRYPTION_CODE = `from cryptography.fernet import Fernet
import os

class DataEncryption:
    def __init__(self):
        self.key = os.environ.get('ENCRYPTION_KEY') or Fernet.generate_key()
        self.cipher = Fernet(self.key)

    def encrypt_data(self, data: str) -> bytes:
        return self.cipher.encrypt(data.encode())

    def decrypt_data(self, encrypted_data: bytes) -> str:
        return self.cipher.decrypt(encrypted_data).decode()

    def encrypt_conversation(self, conversation_data):
        sensitive_fields = ['user_input', 'agent_response', 'context']
        for field in sensitive_fields:
            if field in conversation_data:
                conversation_data[field] = self.encrypt_data(conversation_data[field])
        return conversation_data`;

export const ANONYMIZATION_CODE = `import hashlib
import re

def anonymize_pii(text: str) -> str:
    """Remove or mask personally identifiable information"""

    text = re.sub(r'\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
                  '[EMAIL]', text)
    text = re.sub(r'\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b', '[PHONE]', text)
    text = re.sub(r'\\b\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}\\b',
                  '[CARD]', text)
    text = re.sub(r'\\b\\d{3}-?\\d{2}-?\\d{4}\\b', '[SSN]', text)

    return text

def hash_user_id(user_id: str) -> str:
    """Create anonymous hash of user ID"""
    return hashlib.sha256(user_id.encode()).hexdigest()[:16]`;

export const DOCKER_COMPOSE = `version: '3.8'
services:
  ai-agent:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=\${RDS_URL}
      - REDIS_URL=\${ELASTICACHE_URL}
    depends_on:
      - redis

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf`;
