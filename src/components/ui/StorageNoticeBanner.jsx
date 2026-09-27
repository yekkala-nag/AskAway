import React, { useState, useEffect } from 'react';

export const StorageNoticeBanner = ({ onOpenPrivacy }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consented = localStorage.getItem('ai_rag_storage_consent');
      if (!consented) {
        // Show after a brief delay so page loads smoothly
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Storage access blocked or restricted
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem('ai_rag_storage_consent', 'acknowledged');
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Storage and Privacy Notice"
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '20px',
        right: '20px',
        maxWidth: '520px',
        zIndex: 9999,
        background: '#0d111d',
        border: '1px solid rgba(94, 196, 200, 0.3)',
        borderRadius: '10px',
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.5)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        animation: 'slideUp 0.25s ease',
        color: '#e2e8f0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1 }}>
        <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>🍪</span>
        <div style={{ fontSize: '11.5px', color: '#94a3b8', lineHeight: 1.45 }}>
          <strong style={{ color: '#f8fafc' }}>Local Storage & Privacy Notice:</strong> This educational site stores your tab history and interactive state locally on your device. We do not use commercial tracking cookies or sell your personal data.{' '}
          <button
            onClick={onOpenPrivacy}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: '#5EC4C8',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '11.5px',
              fontWeight: 600
            }}
          >
            Privacy Details
          </button>
        </div>
      </div>

      <button
        onClick={handleDismiss}
        style={{
          background: '#5EC4C8',
          color: '#090d16',
          border: 'none',
          borderRadius: '6px',
          padding: '6px 12px',
          fontSize: '11px',
          fontWeight: 700,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        Acknowledge
      </button>
    </div>
  );
};
