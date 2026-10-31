/**
 * CommandPalette — Global Search Modal (⌘K / Ctrl+K / "/")
 * Lazy-loaded: only enters the bundle when the palette is opened.
 * MiniSearch-powered: fuzzy + prefix + synonyms, grouped by module,
 * highlighted matches, "did you mean", and "More like this".
 * Index lazy-loads on first open via the search service.
 */

import { useState, useRef, useEffect } from 'react';
import { UMBRELLA_TOPICS } from '../../registry/tabsRegistry.js';
import { highlightSegments } from '../../search/highlight.js';
import { useModalA11y } from '../../hooks/useModalA11y.js';
import { Button } from './Core.jsx';

const SEARCH_MODULE_META = Object.fromEntries(
  UMBRELLA_TOPICS.map((m) => [m.id, { title: m.title, icon: m.icon }])
);

/** Group ranked results by module, preserving each group's internal rank order. */
function groupResultsByModule(results) {
  const groups = [];
  const byModule = new Map();
  for (const r of results) {
    const key = r.module || 'other';
    if (!byModule.has(key)) {
      const meta = SEARCH_MODULE_META[key] || { title: key, icon: '📦' };
      const g = { module: key, title: meta.title, icon: meta.icon, items: [] };
      byModule.set(key, g);
      groups.push(g);
    }
    byModule.get(key).items.push(r);
  }
  return groups;
}

function HighlightedText({ text, terms }) {
  const segments = highlightSegments(text, terms);
  return (
    <>
      {segments.map((seg, i) =>
        seg.match ? (
          <mark
            key={i}
            style={{ background: 'rgba(58,155,159,0.18)', color: 'inherit', borderRadius: '2px', padding: '0 1px' }}
          >
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </>
  );
}

function PaletteResultRow({ item, index, isSelected, registryTab, onSelect, onMoreLikeThis }) {
  const moduleMeta = item.module ? UMBRELLA_TOPICS.find((m) => m.id === item.module) : null;
  const moduleLabel = moduleMeta ? `${moduleMeta.icon || ''} ${moduleMeta.title || item.module}` : '';
  const terms = item.matchedTerms || item.terms || [];
  return (
    <div style={{ display: 'flex', alignItems: 'stretch' }}>
      <button
        id={`cp-opt-${index}`}
        role="option"
        aria-selected={isSelected}
        onClick={onSelect}
        style={{
          flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '12px',
          padding: '9px 12px 9px 16px', background: isSelected ? 'rgba(58,155,159,0.08)' : 'transparent',
          border: 'none', textAlign: 'left', cursor: 'pointer', transition: 'background 0.1s ease',
          fontFamily: 'inherit'
        }}
      >
        <span style={{ fontSize: '1rem', width: '24px', textAlign: 'center', flexShrink: 0 }}>{registryTab?.icon || '📄'}</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#1A1D26', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <HighlightedText text={item.title || registryTab?.label || item.id} terms={terms} />
            {item.type === 'simulator' && (
              <span
                style={{
                  marginLeft: '6px', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.04em',
                  textTransform: 'uppercase', color: '#7A6BA8', background: 'rgba(155,137,196,0.14)',
                  border: '1px solid rgba(155,137,196,0.28)', borderRadius: '9999px',
                  padding: '1px 6px', verticalAlign: 'middle'
                }}
              >
                simulator
              </span>
            )}
          </span>
          {item.summary ? (
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '1px' }}>
              <HighlightedText text={item.summary} terms={terms} />
            </span>
          ) : null}
          {moduleLabel ? (
            <span style={{ display: 'block', fontSize: '0.65rem', color: '#9CA3AF', marginTop: '1px' }}>{moduleLabel.trim()}</span>
          ) : null}
        </span>
      </button>
      <button
        onClick={onMoreLikeThis}
        title={`More like this: ${item.title || item.id}`}
        aria-label={`More topics like ${item.title || item.id}`}
        style={{
          flexShrink: 0, alignSelf: 'center', margin: '0 10px 0 0',
          padding: '4px 8px', borderRadius: '6px', fontSize: '0.62rem', fontWeight: 600,
          color: '#3A9B9F', background: 'transparent', border: '1px solid #E5E7EB', cursor: 'pointer',
          fontFamily: 'inherit', whiteSpace: 'nowrap'
        }}
      >
        More like this
      </button>
    </div>
  );
}

export function CommandPalette({ isOpen, onClose, tabs, onSelectTab }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState([]);
  const [groups, setGroups] = useState([]);
  const [didYouMean, setDidYouMean] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [similarTo, setSimilarTo] = useState(null); // { id, title, items }
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const { ref: dialogRef } = useModalA11y(isOpen, onClose, { dismissable: false, autofocus: false });

  // Preload the index as soon as the palette opens (first-open lazy load)
  useEffect(() => {
    if (isOpen) {
      import('../../search/search.js')
        .then((m) => m.ensureReady())
        .catch(() => {});
    }
  }, [isOpen]);

  // Debounce keystrokes before hitting the index
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery((query || '').trim()), 150);
    return () => clearTimeout(t);
  }, [query]);

  // Run search (or show default list when the query is empty)
  useEffect(() => {
    let cancelled = false;
    if (!isOpen) {
      return undefined;
    }
    if (!debouncedQuery) {
      setResults([]);
      setGroups([]);
      setDidYouMean(null);
      setSearchLoading(false);
      setSearchError(false);
      return undefined;
    }
    setSearchLoading(true);
    import('../../search/search.js')
      .then(async (m) => {
        const [found, suggestion] = await Promise.all([
          m.search(debouncedQuery, { limit: 20 }),
          m.suggest(debouncedQuery),
        ]);
        return { found, suggestion };
      })
      .then(({ found, suggestion }) => {
        if (cancelled) return;
        setResults(found);
        setGroups(groupResultsByModule(found));
        setDidYouMean(found.length === 0 ? suggestion : null);
        setSearchError(false);
        setSearchLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setResults([]);
          setGroups([]);
          setDidYouMean(null);
          setSearchError(true);
          setSearchLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, isOpen]);

  // "More like this" mode
  useEffect(() => {
    let cancelled = false;
    if (!similarTo) return undefined;
    import('../../search/search.js')
      .then((m) => m.similar(similarTo.id, { limit: 8 }))
      .then((items) => {
        if (!cancelled) setSimilarTo((s) => (s && s.id === similarTo.id ? { ...s, items } : s));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [similarTo?.id]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setDebouncedQuery('');
      setSimilarTo(null);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard selection must always be visible (WAI-ARIA combobox pattern)
  useEffect(() => {
    const el = document.getElementById(`cp-opt-${selectedIndex}`);
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, isOpen, results, similarTo]);

  const defaultItems = !debouncedQuery && !similarTo
    ? tabs.slice(0, 10).map((t) => ({ id: t.id, title: t.label, module: t.umbrellaId, matchedTerms: [], summary: '' }))
    : [];
  const listItems = similarTo
    ? (similarTo.items || []).map((r) => ({
        id: r.id,
        title: r.title,
        module: r.module,
        matchedTerms: [],
        summary: r.summary || '',
        type: r.type,
      }))
    : (debouncedQuery ? results : defaultItems);
  const listCount = listItems.length;

  useEffect(() => {
    setSelectedIndex((i) => Math.max(0, Math.min(i, Math.max(0, listCount - 1))));
  }, [listCount]);

  const selectItem = (item) => {
    if (!item) return;
    onSelectTab(item.id);
    onClose();
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (similarTo) { setSimilarTo(null); setSelectedIndex(0); }
        else onClose();
      } else if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, Math.max(0, listCount - 1))); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
      else if (e.key === 'Home') { e.preventDefault(); setSelectedIndex(0); }
      else if (e.key === 'End') { e.preventDefault(); setSelectedIndex(Math.max(0, listCount - 1)); }
      else if (e.key === 'Enter') { e.preventDefault(); selectItem(listItems[selectedIndex]); }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, listItems, listCount, selectedIndex, onClose, onSelectTab, similarTo]);

  if (!isOpen) return null;

  // Grouped rendering for search results; flat list for default/similar modes
  const renderRows = () => {
    if (similarTo) {
      return (
        <>
          <div style={{ padding: '8px 16px', borderBottom: '1px solid #F1F3F5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4B5563', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              More like: {similarTo.title}
            </span>
            <button
              onClick={() => { setSimilarTo(null); setSelectedIndex(0); }}
              style={{ background: 'none', border: 'none', color: '#3A9B9F', fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
            >
              ← Back to results
            </button>
          </div>
          {listItems.length === 0 ? (
            <div role="presentation" style={{ padding: '28px', textAlign: 'center', color: '#9CA3AF', fontSize: '0.82rem' }}>
              No related topics found.
            </div>
          ) : (
            listItems.map((item, i) => (
              <PaletteResultRow
                key={item.id}
                item={item}
                index={i}
                isSelected={i === selectedIndex}
                registryTab={tabs.find((t) => t.id === item.id)}
                onSelect={() => selectItem(item)}
                onMoreLikeThis={() => { setSimilarTo({ id: item.id, title: item.title }); setSelectedIndex(0); }}
              />
            ))
          )}
        </>
      );
    }
    if (!debouncedQuery) {
      return listItems.map((item, i) => (
        <PaletteResultRow
          key={item.id}
          item={item}
          index={i}
          isSelected={i === selectedIndex}
          registryTab={tabs.find((t) => t.id === item.id)}
          onSelect={() => selectItem(item)}
          onMoreLikeThis={() => { setSimilarTo({ id: item.id, title: item.title }); setSelectedIndex(0); }}
        />
      ));
    }
    if (searchError) {
      return (
        <div role="presentation" style={{ padding: '28px', textAlign: 'center', color: '#9CA3AF', fontSize: '0.82rem' }}>
          Search is temporarily unavailable. Please retry.
        </div>
      );
    }
    if (results.length === 0 && searchLoading) {
      return (
        <div role="presentation" style={{ padding: '28px', textAlign: 'center', color: '#9CA3AF', fontSize: '0.82rem' }}>
          Searching…
        </div>
      );
    }
    if (results.length === 0) {
      return (
        <div role="presentation" style={{ padding: '28px', textAlign: 'center', color: '#9CA3AF', fontSize: '0.82rem' }}>
          <div>No results for “{debouncedQuery}”</div>
          {didYouMean?.suggestion && (
            <div style={{ marginTop: '10px', fontSize: '0.8rem' }}>
              Did you mean{' '}
              <button
                onClick={() => { setQuery(didYouMean.suggestion); setDebouncedQuery(didYouMean.suggestion); setSelectedIndex(0); inputRef.current?.focus(); }}
                style={{ background: 'none', border: 'none', color: '#3A9B9F', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}
              >
                “{didYouMean.suggestion}”
              </button>
              ?
            </div>
          )}
        </div>
      );
    }
    // Grouped by module: headers ordered by each group's best rank
    let flatIdx = 0;
    const effectiveGroups = groups.length
      ? groups
      : [{ module: null, title: '', icon: '', items: results }];
    return effectiveGroups.map((g) => (
      <div key={g.module || 'all'}>
        {g.module ? (
          <div
            role="presentation"
            style={{
              padding: '8px 16px 4px', fontSize: '0.62rem', fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9CA3AF',
              background: '#FAFBFC', borderBottom: '1px solid #F1F3F5'
            }}
          >
            {g.icon} {g.title}
          </div>
        ) : null}
        {g.items.map((item) => {
          const i = flatIdx++;
          return (
            <PaletteResultRow
              key={item.id}
              item={item}
              index={i}
              isSelected={i === selectedIndex}
              registryTab={tabs.find((t) => t.id === item.id)}
              onSelect={() => selectItem(item)}
              onMoreLikeThis={() => { setSimilarTo({ id: item.id, title: item.title || item.id }); setSelectedIndex(0); }}
            />
          );
        })}
      </div>
    ));
  };

  return (
    <>
    <div
      onClick={onClose}
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'rgba(0,0,0,0.3)',
      }}
    />
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="command-palette"
      style={{
        position: 'fixed', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: 'min(640px, 90vw)', zIndex: 60,
        background: '#FFFFFF', border: '1px solid #E5E7EB',
        borderRadius: '12px', boxShadow: '0 20px 25px rgba(0,0,0,0.08), 0 8px 10px rgba(0,0,0,0.04)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "SF Pro Text", system-ui, sans-serif',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
      role="dialog" aria-modal="true" aria-label="Command palette"
    >
      <div style={{ padding: '12px', borderBottom: '1px solid #E5E7EB' }}>
        <div className="ds-field-focus" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F1F3F5', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '8px 12px' }}>
          <span aria-hidden="true" style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="cp-listbox"
            aria-autocomplete="list"
            aria-activedescendant={listCount ? `cp-opt-${selectedIndex}` : undefined}
            aria-label="Search topics"
            placeholder="Search topics (typos OK — try 'MCP' or 'stop hallucinations')..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); if (similarTo) setSimilarTo(null); }}
            style={{ background: 'none', border: 'none', outline: 'none', fontSize: '0.88rem', color: '#1A1D26', width: '100%', fontFamily: 'inherit' }}
          />
          <kbd style={{ fontSize: '0.6rem', padding: '2px 6px', background: '#FFFFFF', borderRadius: '4px', border: '1px solid #E5E7EB', color: '#9CA3AF', fontWeight: 600 }}>⌘K</kbd>
        </div>
      </div>
      <div id="cp-listbox" role="listbox" aria-label="Topics" style={{ maxHeight: '380px', overflowY: 'auto' }}>
        {renderRows()}
      </div>
      <div
        className="bottom-nav"
        style={{
          padding: '8px 16px',
          paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
          borderTop: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
          {listCount} matching topic{listCount === 1 ? '' : 's'} · ↑↓ navigate · Enter open
        </span>
        <Button variant="ghost" size="sm" onClick={onClose}>Close (Esc)</Button>
      </div>
    </div>
    </>
  );
}
