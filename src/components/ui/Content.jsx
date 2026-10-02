/**
 * Content Components — Diagram, CodeBlock, Stepper, Table, Hero, Accordion, Tabs
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { getModuleColors } from '../../design-system/tokens.js';
import { Container } from '../layout/Primitives.jsx';
import { Button, Badge, Divider } from './Core.jsx';
import { SHOWCASE, frameStyles, FrameHeader, FrameCaption, iconForModule } from './SpectrumFrame.jsx';
import { spectrumAccentForModule } from '../../design-system/diagramTokens.js';

// ============================================
// Diagram — Interactive SVG with fullscreen zoom
// ============================================
export function Diagram({ src, alt, caption, title, maxWidth = '1280px', accent = '#5EC4C8', moduleId, style, ...props }) {
  const [zoomed, setZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const open = () => { 
    if (!isMountedRef.current) return;
    setScale(1); 
    setZoomed(true); 
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden'; 
  };
  const close = () => { 
    if (!isMountedRef.current) return;
    setZoomed(false); 
    if (typeof document !== 'undefined') document.body.style.overflow = ''; 
  };
  const zoomIn = (e) => { e?.stopPropagation(); setScale(s => Math.min(s + 0.25, 3)); };
  const zoomOut = (e) => { e?.stopPropagation(); setScale(s => Math.max(s - 0.25, 0.5)); };
  const reset = (e) => { e?.stopPropagation(); setScale(1); };
  const tint = moduleId ? spectrumAccentForModule(moduleId) : accent;
  const frame = frameStyles(tint);

  useEffect(() => {
    if (!zoomed || !isMountedRef.current) return;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => { 
      document.removeEventListener('keydown', onKey); 
      if (isMountedRef.current && typeof document !== 'undefined') document.body.style.overflow = ''; 
    };
  }, [zoomed]);

  return (
    <>
      <figure style={{ margin: 0, ...style }} {...props}>
        <div
          style={{
            ...frame.figure,
            cursor: 'zoom-in',
            transition: 'box-shadow var(--ds-motion-duration-base)',
          }}
          onClick={open}
          onMouseEnter={e => e.currentTarget.style.boxShadow = frame.figureHover}
          onMouseLeave={e => e.currentTarget.style.boxShadow = frame.figureRest}
        >
          {(title || caption) && (
            <FrameHeader
              color={tint}
              icon={iconForModule(moduleId)}
              title={title || 'Diagram'}
              hint="⌘ Click to zoom"
            />
          )}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 'var(--ds-space-4)', minHeight: '200px', background: SHOWCASE.bg }}>
            <img src={src} alt={alt} style={{ width: '100%', maxWidth, height: 'auto', display: 'block' }} />
          </div>
          {caption && <FrameCaption color={tint}>{caption}</FrameCaption>}
        </div>
      </figure>

      {zoomed && (
        <div
          onClick={close}
          style={{
            position: 'fixed', inset: 0, zIndex: 'var(--ds-zIndex-modal)',
            background: 'var(--ds-color-overlay-modal)', backdropFilter: 'blur(8px)',
            display: 'flex', flexDirection: 'column',
            animation: 'fadeIn var(--ds-motion-duration-fast) var(--ds-motion-easing-standard)',
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: 'var(--ds-space-4) var(--ds-space-6)',
            background: 'rgba(28, 25, 23, 0.9)', backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--ds-color-border-strong)',
          }}>
            <h3 style={{ fontSize: 'var(--ds-font-size-h4)', fontWeight: 'var(--ds-font-weight-semibold)', color: 'var(--ds-color-text-inverse)' }}>{title || alt}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-2)' }}>
              <Button variant="ghost" size="sm" onClick={zoomOut} aria-label="Zoom out">−</Button>
              <Button variant="ghost" size="sm" onClick={reset} aria-label="Reset zoom">{Math.round(scale * 100)}%</Button>
              <Button variant="ghost" size="sm" onClick={zoomIn} aria-label="Zoom in">+</Button>
              <Divider orientation="vertical" style={{ height: '24px', margin: '0 var(--ds-space-2)' }} />
              <Button variant="secondary" size="sm" onClick={close}>Close</Button>
            </div>
          </div>
          <div onClick={e => e.stopPropagation()} onWheel={e => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); e.deltaY < 0 ? zoomIn() : zoomOut(); } }} style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--ds-space-6)' }}>
            <div style={{ background: 'var(--ds-color-bg-surface)', borderRadius: 'var(--ds-radius-lg)', boxShadow: 'var(--ds-shadow-xl)', padding: 'var(--ds-space-6)', transform: `scale(${scale})`, transformOrigin: 'center center', minWidth: '500px' }}>
              <img src={src} alt={alt} style={{ width: '100%', maxWidth: 'none', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================
// CodeBlock — Syntax highlighted, copyable, line numbers
// ============================================
export function CodeBlock({ code, language = 'text', filename, highlightLines, showLineNumbers = true, style, ...props }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { console.warn('Copy failed'); }
  };

  const lines = code.split('\n');
  const maxLineNum = lines.length.toString().length;

  return (
    <div style={{ borderRadius: 'var(--ds-radius-lg)', overflow: 'hidden', background: 'var(--ds-color-brand-editor, #0F1219)', border: '1px solid rgba(94,196,200,0.25)', ...style }} {...props}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--ds-space-3) var(--ds-space-4)', background: 'var(--ds-color-brand-editor, #0F1219)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-3)' }}>
          <span style={{ display: 'inline-flex', gap: '5px' }} aria-hidden="true">
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#5EC4C8' }} />
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#F0A89A' }} />
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#C9B8E8' }} />
          </span>
          {filename && <span style={{ fontSize: 'var(--ds-font-size-caption)', color: '#B8B8C4', fontFamily: 'var(--ds-font-family-mono)' }}>{filename}</span>}
          <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'var(--ds-font-weight-medium)' }}>{language}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={copy} aria-label={copied ? 'Copied' : 'Copy code'}>
          {copied ? '✓ Copied' : 'Copy'}
        </Button>
      </div>
      <pre style={{ margin: 0, padding: 'var(--ds-space-4)', overflow: 'auto', fontSize: 'var(--ds-font-size-code)', lineHeight: 'var(--ds-font-lineHeight-relaxed)', fontFamily: 'var(--ds-font-family-mono)', color: '#E7E5E4', tabSize: 2 }}>
        {showLineNumbers && (
          <span style={{ display: 'inline-block', width: `${maxLineNum}ch`, marginRight: 'var(--ds-space-4)', textAlign: 'right', color: 'var(--ds-color-text-tertiary)', userSelect: 'none', pointerEvents: 'none', whiteSpace: 'pre' }}>
            {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
          </span>
        )}
        <code style={{ display: 'inline-block', whiteSpace: 'pre' }}>
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                background: highlightLines?.includes(i + 1) ? 'rgba(240, 168, 154, 0.18)' : 'transparent',
                padding: '0 var(--ds-space-2)',
                borderRadius: 'var(--ds-radius-sm)',
              }}
            >
              {line || ' '}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

// ============================================
// Stepper — Animated multi-step process
// ============================================
export function Stepper({ steps, activeStep = 0, onStepClick, autoPlay = false, interval = 2000, style, ...props }) {
  const [currentStep, setCurrentStep] = useState(activeStep);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setCurrentStep(activeStep);
  }, [activeStep]);

  useEffect(() => {
    if (!autoPlay || playing) return;
    const timer = setTimeout(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, interval);
    return () => clearTimeout(timer);
  }, [currentStep, autoPlay, playing, interval, steps.length]);

  const handleStepClick = (index) => {
    setCurrentStep(index);
    setPlaying(false);
    onStepClick?.(index);
  };

  return (
    <div style={{ ...style }} {...props}>
      <ol style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-4)', listStyle: 'none', padding: 0 }}>
        {steps.map((step, index) => {
          const isActive = index === currentStep || step.status === 'current';
          const isCompleted = step.status === 'complete' || (step.status !== 'upcoming' && index < currentStep);
          const stepColor = step.color || 'var(--ds-color-module-foundations-primary)';
          const labelText = step.label || step.title || `Step ${index + 1}`;
          const detailText = step.detail || step.description || '';

          return (
            <li key={index} style={{ transition: 'all var(--ds-motion-duration-base) var(--ds-motion-easing-standard)' }}>
              <button
                onClick={() => handleStepClick(index)}
                style={{
                  display: 'flex',
                  gap: 'var(--ds-space-4)',
                  padding: 'var(--ds-space-4)',
                  background: isActive ? `${stepColor}15` : 'var(--ds-color-bg-surface)',
                  border: `1px solid ${isActive ? stepColor : 'var(--ds-color-border-subtle)'}`,
                  borderRadius: 'var(--ds-radius-lg)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'all var(--ds-motion-duration-fast)',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--ds-color-bg-surfaceHover)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'var(--ds-color-bg-surface)'; }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '36px', height: '36px', borderRadius: 'var(--ds-radius-full)',
                  background: isCompleted ? stepColor : isActive ? `${stepColor}25` : 'var(--ds-color-bg-surfaceHover)',
                  border: `2px solid ${isCompleted || isActive ? stepColor : 'var(--ds-color-border-default)'}`,
                  color: isCompleted ? 'white' : isActive ? stepColor : 'var(--ds-color-text-secondary)',
                  fontWeight: 'var(--ds-font-weight-bold)',
                  fontSize: isCompleted || isActive ? 'var(--ds-font-size-body)' : 'var(--ds-font-size-bodySm)',
                  flexShrink: 0,
                  transition: 'all var(--ds-motion-duration-base)',
                }}>
                  {isCompleted ? '✓' : step.icon || (index + 1)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-1)', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 'var(--ds-font-size-bodyLg)',
                      fontWeight: 'var(--ds-font-weight-bold)',
                      color: isActive ? stepColor : 'var(--ds-color-text-primary)'
                    }}>
                      {labelText}
                    </span>
                    {isActive && (
                      <span style={{
                        fontSize: 'var(--ds-font-size-caption)',
                        fontWeight: 'var(--ds-font-weight-bold)',
                        color: stepColor,
                        background: `${stepColor}20`,
                        padding: '2px 10px',
                        borderRadius: 'var(--ds-radius-full)'
                      }}>
                        Active Step
                      </span>
                    )}
                  </div>
                  {detailText && (
                    <p style={{
                      fontSize: 'var(--ds-font-size-body)',
                      color: 'var(--ds-color-text-secondary)',
                      lineHeight: 'var(--ds-font-lineHeight-relaxed)',
                      margin: '4px 0 0 0'
                    }}>
                      {detailText}
                    </p>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ol>
      {autoPlay && steps.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--ds-space-2)', marginTop: 'var(--ds-space-4)' }}>
          <Button variant="ghost" size="sm" onClick={() => setPlaying(!playing)}>{playing ? 'Pause' : 'Play'}</Button>
          <Button variant="ghost" size="sm" onClick={() => { setCurrentStep(0); setPlaying(false); }}>Reset</Button>
        </div>
      )}
    </div>
  );
}

// ============================================
// Table — Sortable, responsive
// ============================================
export function Table({ columns, data, sortable = true, striped = true, hover = true, style, ...props }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortable) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig, sortable]);

  const handleSort = (key) => {
    if (!sortable) return;
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', ...style }} {...props}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ds-font-size-bodySm)' }}>
        <thead>
          <tr style={{ background: 'var(--ds-color-bg-surfaceHover)', borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
            {columns.map(col => (
              <th
                key={col.key}
                style={{
                  padding: 'var(--ds-space-3) var(--ds-space-4)',
                  textAlign: col.align || 'left',
                  fontWeight: 'var(--ds-font-weight-semibold)',
                  color: 'var(--ds-color-text-secondary)',
                  fontSize: 'var(--ds-font-size-caption)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--ds-font-letterSpacing-wide)',
                  whiteSpace: 'nowrap',
                  cursor: sortable && col.sortable !== false ? 'pointer' : 'default',
                  userSelect: 'none',
                }}
                onClick={() => handleSort(col.key)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-1)' }}>
                  {col.header}
                  {sortable && col.sortable !== false && sortConfig.key === col.key && (
                    <span style={{ fontSize: '0.7em' }}>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} style={{
              background: striped && rowIndex % 2 === 1 ? 'var(--ds-color-bg-surfaceHover)' : 'var(--ds-color-bg-surface)',
              borderBottom: rowIndex < data.length - 1 ? '1px solid var(--ds-color-border-subtle)' : 'none',
              transition: 'background var(--ds-motion-duration-fast)',
            }}>
              {columns.map(col => (
                <td key={col.key} style={{ padding: 'var(--ds-space-3) var(--ds-space-4)', textAlign: col.align || 'left', color: 'var(--ds-color-text-primary)', whiteSpace: 'nowrap' }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{ padding: 'var(--ds-space-10)', textAlign: 'center', color: 'var(--ds-color-text-tertiary)' }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

import { useMemo } from 'react';

// ============================================
// Hero — Tab entry point with metrics and actions
// ============================================
export function Hero({ moduleId, title, description, metrics = [], actions = [], children, style, ...props }) {
  const moduleColors = getModuleColors(moduleId);

  return (
    <section style={{
      padding: 'var(--ds-space-10) var(--ds-space-6)',
      background: `linear-gradient(135deg, ${moduleColors.light} 0%, var(--ds-color-bg-surface) 100%)`,
      borderBottom: '1px solid var(--ds-color-border-subtle)',
      borderRadius: '0 0 var(--ds-radius-xl) var(--ds-radius-xl)',
      margin: 'calc(-1 * var(--ds-space-6)) calc(-1 * var(--ds-space-6)) var(--ds-space-10)',
      ...style,
    }} {...props}>
      <Container size="normal">
        <div style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-3)' }}>
            <Badge variant="module" moduleId={moduleId} size="sm">{props.moduleLabel || moduleId}</Badge>
          </div>
          <h1 style={{ fontSize: 'var(--ds-font-size-display)', fontWeight: 'var(--ds-font-weight-bold)', lineHeight: 'var(--ds-font-lineHeight-tight)', letterSpacing: 'var(--ds-font-letterSpacing-tight)', color: 'var(--ds-color-text-primary)', marginBottom: 'var(--ds-space-4)' }}>
            {title}
          </h1>
          {description && (
            <p style={{ fontSize: 'var(--ds-font-size-bodyLg)', color: 'var(--ds-color-text-secondary)', lineHeight: 'var(--ds-font-lineHeight-loose)', marginBottom: 'var(--ds-space-8)', maxWidth: '640px' }}>
              {description}
            </p>
          )}
          {metrics.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-space-6)', marginBottom: 'var(--ds-space-8)' }}>
              {metrics.map((m, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-1)' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'var(--ds-font-weight-bold)', color: moduleColors.dark, lineHeight: 1, fontFamily: 'var(--ds-font-family-display)' }}>{m.value}</div>
                  <div style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>{m.label}</div>
                </div>
              ))}
            </div>
          )}
          {actions.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-space-3)' }}>
              {actions.map((a, i) => (
                <Button key={i} variant={a.variant || 'primary'} size="md" onClick={a.onClick} href={a.href}>
                  {a.label}
                </Button>
              ))}
            </div>
          )}
          {children}
        </div>
      </Container>
    </section>
  );
}

// ============================================
// Accordion — Collapsible sections
// ============================================
export function Accordion({ items, allowMultiple = false, style, ...props }) {
  const [expanded, setExpanded] = useState(allowMultiple ? [] : null);

  const toggle = (index) => {
    setExpanded(prev => {
      if (allowMultiple) {
        return prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index];
      }
      return prev === index ? null : index;
    });
  };

  const isExpanded = (index) => allowMultiple ? expanded.includes(index) : expanded === index;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-3)', ...style }} {...props}>
      {items.map((item, index) => (
        <div key={index} style={{ border: '1px solid var(--ds-color-border-subtle)', borderRadius: 'var(--ds-radius-lg)', overflow: 'hidden', background: 'var(--ds-color-bg-surface)' }}>
          <button
            onClick={() => toggle(index)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: 'var(--ds-space-4) var(--ds-space-5)', background: 'none', border: 'none',
              textAlign: 'left', cursor: 'pointer', fontSize: 'var(--ds-font-size-body)',
              fontWeight: 'var(--ds-font-weight-medium)', color: 'var(--ds-color-text-primary)',
              fontFamily: 'var(--ds-font-family-sans)',
            }}
            aria-expanded={isExpanded(index)}
          >
            <span>{item.title}</span>
            <span style={{
              fontSize: '1.25rem', color: 'var(--ds-color-text-tertiary)',
              transition: 'transform var(--ds-motion-duration-base)',
              transform: isExpanded(index) ? 'rotate(180deg)' : 'rotate(0deg)',
            }}>▾</span>
          </button>
          <div style={{
            maxHeight: isExpanded(index) ? '1000px' : 0,
            overflow: 'hidden',
            transition: 'max-height var(--ds-motion-duration-slow) var(--ds-motion-easing-standard)',
          }}>
            <div style={{ padding: '0 var(--ds-space-5) var(--ds-space-5)', borderTop: '1px solid var(--ds-color-border-subtle)' }}>
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// Tabs — Horizontal tab list with animated indicator
// ============================================
export function Tabs({ tabs, activeTab, onChange, variant = 'pills', style, ...props }) {
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const containerRef = useRef(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!mountedRef.current || !containerRef.current) return;
    const activeBtn = containerRef.current.querySelector(`[data-tab-id="${activeTab}"]`);
    if (activeBtn) {
      const rect = activeBtn.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      setIndicatorStyle({
        width: rect.width,
        left: rect.left - containerRect.left,
      });
    }
  }, [activeTab, tabs]);

  return (
    <div style={{ ...style }} {...props}>
      <div
        ref={containerRef}
        style={{ position: 'relative', display: 'flex', gap: 'var(--ds-space-1)', background: variant === 'pills' ? 'var(--ds-color-bg-surfaceHover)' : 'transparent', padding: variant === 'pills' ? 'var(--ds-space-1)' : 0, borderRadius: variant === 'pills' ? 'var(--ds-radius-lg)' : 0, border: variant === 'line' ? 'none' : '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' }}
      >
        {variant === 'line' && (
          <div style={{
            position: 'absolute', bottom: -1, height: 3, background: 'var(--ds-color-module-foundations-primary)',
            borderRadius: '3px 3px 0 0', transition: 'all var(--ds-motion-duration-base) var(--ds-motion-easing-spring)',
            ...indicatorStyle,
          }} />
        )}
        {tabs.map(tab => (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--ds-space-2)',
              padding: variant === 'pills' ? 'var(--ds-space-2) var(--ds-space-4)' : 'var(--ds-space-3) var(--ds-space-4)',
              background: variant === 'pills' && activeTab === tab.id ? 'var(--ds-color-bg-surface)' : 'transparent',
              border: 'none', borderRadius: variant === 'pills' ? 'var(--ds-radius-md)' : 0,
              color: activeTab === tab.id ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-text-secondary)',
              fontSize: 'var(--ds-font-size-bodySm)', fontWeight: 'var(--ds-font-weight-medium)',
              fontFamily: 'var(--ds-font-family-sans)', cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all var(--ds-motion-duration-fast)',
              boxShadow: variant === 'pills' && activeTab === tab.id ? 'var(--ds-shadow-xs)' : 'none',
            }}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
            {tab.badge && <Badge variant="default" size="sm">{tab.badge}</Badge>}
          </button>
        ))}
      </div>
    </div>
  );
}