import React, { useState, useEffect } from 'react';

export const LegalModal = ({ isOpen, initialTab = 'privacy', onClose }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(9, 13, 22, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.15s ease'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '85vh',
          background: '#0d111d',
          border: '1px solid #1f293d',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#e2e8f0',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.2rem 1.5rem',
            borderBottom: '1px solid #1f293d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#121626'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.2rem' }}>⚖️</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                Legal & Compliance Disclosures
              </h3>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>
                Modern AI Engineering Knowledge Base · Last Updated: 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Modal"
            style={{
              background: 'transparent',
              border: '1px solid #2d3748',
              borderRadius: '6px',
              color: '#94a3b8',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: '#090d16',
            borderBottom: '1px solid #1f293d'
          }}
        >
          {[
            { id: 'privacy', label: 'Privacy Policy', icon: '🔒' },
            { id: 'terms', label: 'Terms of Service', icon: '📜' },
            { id: 'trademarks', label: 'Trademarks & Fair Use', icon: '™' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.45rem 0.9rem',
                borderRadius: '6px',
                border: activeTab === tab.id ? '1px solid #5EC4C8' : '1px solid transparent',
                background: activeTab === tab.id ? 'rgba(94, 196, 200, 0.12)' : 'transparent',
                color: activeTab === tab.id ? '#5EC4C8' : '#94a3b8',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div
          style={{
            padding: '1.5rem',
            overflowY: 'auto',
            fontSize: '0.85rem',
            lineHeight: 1.7,
            color: '#cbd5e1'
          }}
        >
          {activeTab === 'privacy' && (
            <div>
              <h4 style={{ color: '#f8fafc', margin: '0 0 0.8rem 0', fontSize: '1rem' }}>
                Privacy Policy & Data Notice
              </h4>
              <p>
                <strong>1. Zero Data Selling & Commercial Tracking:</strong> This website is an educational, non-commercial technical knowledge repository curated by <strong>Nagaraj Y</strong>. We do not sell, rent, monetize, or broker any personal data or usage metrics.
              </p>
              <p>
                <strong>2. Local Device Storage:</strong> We use browser <code>localStorage</code> and <code>sessionStorage</code> strictly to retain user interface preferences, active tabs, bookmark configurations, and interactive simulation state directly on your client machine. No personal identity information is transmitted to any third-party marketing servers.
              </p>
              <p>
                <strong>3. Infrastructure & Edge Logs:</strong> Hosting and content delivery are provided via the Vercel Edge Network. Like all HTTP services, edge nodes process standard ephemeral connection headers (IP address, user-agent, request timestamp) for security defense, DDoS mitigation, and server performance.
              </p>
              <p>
                <strong>4. GDPR & CCPA/CPRA Rights:</strong> Because this site does not maintain persistent user accounts or central databases of personal data, no data profiling or cross-site tracking occurs. If you have questions regarding data privacy, contact the curator via GitHub repository issues.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div>
              <h4 style={{ color: '#f8fafc', margin: '0 0 0.8rem 0', fontSize: '1rem' }}>
                Terms of Service & Usage Agreement
              </h4>
              <p>
                <strong>1. Non-Commercial Educational Purpose:</strong> All materials, interactive simulators, architecture diagrams, code samples, and evaluation benchmarks provided on this website are published solely for independent academic research, technical study, and educational demonstration.
              </p>
              <p>
                <strong>2. "AS IS" Warranty Disclaimer:</strong> TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, THIS SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING WITHOUT LIMITATION WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>
                <strong>3. Limitation of Liability:</strong> In no event shall the author, contributors, or copyright holders be liable for any direct, indirect, incidental, special, punitive, or consequential damages arising from the use of, or inability to use, code samples, system prompts, or configuration blueprints presented on this website.
              </p>
              <p>
                <strong>4. Independent Verification Required:</strong> AI models, cost calculators, latency budgets, and security guardrails are rapidly evolving experimental technologies. Users are responsible for independently verifying all code and safety architecture before deploying to production environments.
              </p>
            </div>
          )}

          {activeTab === 'trademarks' && (
            <div>
              <h4 style={{ color: '#f8fafc', margin: '0 0 0.8rem 0', fontSize: '1rem' }}>
                Trademarks, Copyrights & Fair Use Declaration
              </h4>
              <p>
                <strong>1. Nominative Fair Use:</strong> All product names, logos, brands, trademarks, and registered trademarks mentioned or depicted on this website are the property of their respective owners.
              </p>
              <p>
                <strong>2. Non-Affiliation:</strong> Reference to specific commercial models, vendors, or frameworks (including, but not limited to, Anthropic, Claude, OpenAI, ChatGPT, DeepSeek, Meta, Llama, Google Gemini, Hugging Face, LangChain, Qdrant, Pinecone, or AWS) is made strictly for identification, technical critique, comparative analysis, and academic commentary under the doctrine of Nominative Fair Use (15 U.S.C. § 1125(c)(3) and 17 U.S.C. § 107).
              </p>
              <p>
                <strong>3. No Endorsement:</strong> Mention of third-party products or services does not constitute or imply any endorsement, sponsorship, partnership, or recommendation by the respective trademark holders, nor does it imply affiliation with the platform or its author.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '0.9rem 1.5rem',
            borderTop: '1px solid #1f293d',
            background: '#121626',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '0.45rem 1.2rem',
              background: '#5EC4C8',
              color: '#090d16',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'opacity 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
