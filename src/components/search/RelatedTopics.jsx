/**
 * RelatedTopics — "Related topics" section rendered under every tab.
 * Manual links from search-index.json related[] rank first, then
 * similar.json neighbors (topical embeddings), self excluded.
 * Lazy-loads the search index via the shared search service.
 */

import { useState, useEffect } from 'react';
import { getTabById, UMBRELLA_TOPICS } from '../../registry/tabsRegistry.js';

const moduleTitle = (id) => UMBRELLA_TOPICS.find((m) => m.id === id)?.title || '';

export default function RelatedTopics({ tabId, onSelectTab }) {
  const [items, setItems] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setItems(null);
    // Defer until idle so first paint never competes with the index fetch
    const schedule =
      typeof requestIdleCallback === 'function'
        ? requestIdleCallback
        : (cb) => setTimeout(cb, 300);
    const handle = schedule(() => {
      import('../../search/searchService.js')
        .then((m) => m.getRelatedTopics(tabId, { limit: 6 }))
        .then((res) => {
          if (!cancelled) setItems(res);
        })
        .catch(() => {
          if (!cancelled) setItems([]);
        });
    });
    return () => {
      cancelled = true;
      if (typeof cancelIdleCallback === 'function' && typeof handle === 'number') cancelIdleCallback(handle);
      else clearTimeout(handle);
    };
  }, [tabId]);

  if (!items || items.length === 0) return null;

  return (
    <section
      aria-label="Related topics"
      style={{
        margin: 'var(--ds-space-8, 32px) 0 var(--ds-space-4, 16px)',
        padding: 'var(--ds-space-5, 20px)',
        background: 'var(--ds-color-bg-surface, #FFFFFF)',
        border: '1px solid var(--ds-color-border-subtle, #E5E7EB)',
        borderRadius: 'var(--ds-radius-lg, 12px)',
      }}
    >
      <div
        style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--ds-color-text-tertiary, #9CA3AF)',
          marginBottom: 'var(--ds-space-3, 12px)',
        }}
      >
        Related topics
      </div>
      <div
        role="list"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 'var(--ds-space-2, 8px)',
        }}
      >
        {items.map((item) => {
          const reg = getTabById(item.id);
          return (
            <button
              key={item.id}
              role="listitem"
              onClick={() => onSelectTab?.(item.id)}
              title={
                item.source === 'manual'
                  ? `${item.title} — curated link`
                  : `${item.title} — similar topic`
              }
              className="ds-hoverable"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: 'var(--ds-radius-md, 8px)',
                background: 'var(--ds-color-bg-canvas, #F7F8FA)',
                border: '1px solid transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.12s ease',
                width: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--ds-color-border-subtle, #E5E7EB)';
                e.currentTarget.style.background = 'var(--ds-color-bg-surfaceHover, #F1F3F5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.background = 'var(--ds-color-bg-canvas, #F7F8FA)';
              }}
            >
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{reg?.icon || '📄'}</span>
              <span style={{ minWidth: 0, flex: 1 }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--ds-color-text-primary, #1A1D26)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.title}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.65rem',
                    color: 'var(--ds-color-text-tertiary, #9CA3AF)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {moduleTitle(item.module)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
