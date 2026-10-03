/**
 * Layout Primitives — Composable, responsive, accessible
 */

import { useState, useEffect, useRef } from 'react';
import { useModalA11y } from '../../hooks/useModalA11y.js';

// ============================================
// Page — Root layout with sidebar + main
// ============================================
// ============================================
// Page — Root layout with sidebar + main (Responsive Mobile/Tablet)
// ============================================
export function Page({ children, sidebar, header, sidebarCollapsed, onSidebarToggle, mobileOpen, onCloseMobile }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile drawer: trap focus while open, restore it on close (desktop unaffected)
  const drawerOpen = isMobile && !!mobileOpen;
  const { ref: drawerRef, onBackdrop } = useModalA11y(drawerOpen, onCloseMobile, { dismissable: true, autofocus: true });

  const sidebarWidth = isMobile
    ? (mobileOpen ? '320px' : '0px')
    : (sidebarCollapsed ? '72px' : '320px');

  return (
    <div className="app-page" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--ds-color-bg-canvas)', position: 'relative' }}>
      {/* MOBILE BACKDROP OVERLAY */}
      {isMobile && mobileOpen && (
        <div
          onClick={onBackdrop}
          role="presentation"
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99,
            backdropFilter: 'blur(3px)',
            transition: 'opacity 0.2s ease',
          }}
        />
      )}

      {/* HEADER — full-width, fixed at top, never scrolls */}
      {header && (
        <div style={{ flexShrink: 0, position: 'relative', zIndex: 'var(--ds-zIndex-sticky)', background: 'var(--ds-color-bg-canvas)' }}>
          {header}
        </div>
      )}

      {/* BODY: sidebar + main side by side, fills remaining height */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

        {/* SIDEBAR CONTAINER */}
        <div
          ref={drawerRef}
          id="main-sidebar"
          aria-hidden={isMobile && !mobileOpen}
          inert={isMobile && !mobileOpen ? true : undefined}
          role={drawerOpen ? 'dialog' : undefined}
          aria-modal={drawerOpen ? true : undefined}
          aria-label={drawerOpen ? 'Navigation menu' : undefined}
          style={{
            height: '100%',
            position: isMobile ? 'fixed' : 'relative',
            top: 0, left: 0,
            background: 'var(--ds-color-bg-surface)',
            borderRight: '1px solid var(--ds-color-border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: isMobile ? 100 : 'var(--ds-zIndex-sidebar)',
            width: sidebarWidth,
            minWidth: sidebarWidth,
            transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
            boxShadow: isMobile && mobileOpen ? '0 20px 40px rgba(0,0,0,0.4)' : 'none'
          }}>
          {sidebar}
        </div>

        <main id="main-content" tabIndex={-1} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', outline: 'none' }} role="main">
          <div data-scroll style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// ============================================
// Container — Constrained content width (Responsive)
// ============================================
export function Container({ children, size = 'normal', className, style, ...props }) {
  const sizeMap = {
    narrow: '640px',
    normal: '960px',
    wide: '1280px',
    full: '100%',
  };
  return (
    <div style={{
      width: '100%',
      margin: '0 auto',
      padding: '0 clamp(16px, 3vw, 24px)',
      maxWidth: sizeMap[size],
      boxSizing: 'border-box',
      ...style
    }} className={className} {...props}>
      {children}
    </div>
  );
}

// ============================================
// Section — Semantic content block
// ============================================
export function Section({ children, variant = 'default', className, style, ...props }) {
  const variantStyles = {
    default: {},
    bordered: { border: '1px solid #E5E7EB', borderRadius: '12px', padding: 'clamp(16px, 2.5vw, 24px)', background: '#FFFFFF' },
    elevated: { boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)', borderRadius: '12px', padding: 'clamp(16px, 2.5vw, 24px)', background: '#FFFFFF' },
    hero: { borderRadius: '12px', background: 'linear-gradient(135deg, #FFFFFF 0%, #F7F8FA 100%)', border: '1px solid #E5E7EB', padding: 'clamp(20px, 3vw, 32px)' },
  };
  const sectionStyles = {
    section: { marginBottom: 'var(--ds-space-8)' },
  };
  return (
    <section style={{ ...sectionStyles.section, ...variantStyles[variant], ...style }} className={className} {...props}>
      {children}
    </section>
  );
}

Section.Header = function SectionHeader({ children, style, ...props }) {
  return <header style={{ marginBottom: 'var(--ds-space-4)', ...style }} {...props}>{children}</header>;
};

Section.Body = function SectionBody({ children, style, ...props }) {
  return <div style={{ ...style }} {...props}>{children}</div>;
};

Section.Footer = function SectionFooter({ children, style, ...props }) {
  return <footer style={{ marginTop: 'var(--ds-space-6)', paddingTop: 'var(--ds-space-4)', borderTop: '1px solid var(--ds-color-border-subtle)', ...style }} {...props}>{children}</footer>;
};

// ============================================
// Grid — Responsive grid layout (Auto-wrapping)
// ============================================
export function Grid({ children, columns = { base: 1 }, gap = 'md', className, style, ...props }) {
  const gapMap = { sm: 'var(--ds-space-3)', md: 'var(--ds-space-5)', lg: 'var(--ds-space-8)' };
  const gapVal = typeof gap === 'string' && gapMap[gap] ? gapMap[gap] : typeof gap === 'number' ? `${gap * 4}px` : gap;

  let colStyle = `repeat(1, 1fr)`;

  if (typeof columns === 'number') {
    if (columns >= 6) colStyle = `repeat(auto-fit, minmax(min(100%, 80px), 1fr))`;
    else if (columns >= 4) colStyle = `repeat(auto-fit, minmax(min(100%, 200px), 1fr))`;
    else if (columns === 3) colStyle = `repeat(auto-fit, minmax(min(100%, 240px), 1fr))`;
    else if (columns === 2) colStyle = `repeat(auto-fit, minmax(min(100%, 280px), 1fr))`;
    else colStyle = `repeat(${columns}, 1fr)`;
  } else if (columns && typeof columns === 'object') {
    colStyle = `repeat(${columns.base || 1}, 1fr)`;
  }

  const gridStyles = {
    grid: { display: 'grid', width: '100%', gridTemplateColumns: colStyle, gap: gapVal },
  };
  return (
    <div style={{ ...gridStyles.grid, ...style }} className={className} {...props}>
      {children}
    </div>
  );
}

Grid.Item = function GridItem({ children, span, style, ...props }) {
  const gridStyles = { gridItem: { minWidth: 0 } };
  return <div style={{ ...gridStyles.gridItem, gridColumn: span ? `span ${span}` : undefined, ...style }} {...props}>{children}</div>;
};

// ============================================
// Flex — Simple flex container
// ============================================
export function Flex({ children, direction = 'row', align = 'stretch', justify = 'flex-start', gap = 'md', wrap = false, style, ...props }) {
  const gapMap = { none: 0, xs: 'var(--ds-space-1)', sm: 'var(--ds-space-2)', md: 'var(--ds-space-4)', lg: 'var(--ds-space-6)', xl: 'var(--ds-space-8)' };
  const flexStyles = { flex: { display: 'flex' } };
  return (
    <div style={{ ...flexStyles.flex, flexDirection: direction, alignItems: align, justifyContent: justify, gap: gapMap[gap], flexWrap: wrap ? 'wrap' : 'nowrap', ...style }} {...props}>
      {children}
    </div>
  );
}

// ============================================
// Stack — Vertical stack with consistent spacing
// ============================================
export function Stack({ children, gap = 'md', align = 'stretch', style, ...props }) {
  const gapMap = { none: 0, xs: 'var(--ds-space-1)', sm: 'var(--ds-space-2)', md: 'var(--ds-space-4)', lg: 'var(--ds-space-6)', xl: 'var(--ds-space-8)' };
  const stackStyles = { stack: { display: 'flex', flexDirection: 'column', width: '100%' }, stackItem: { width: '100%' } };
  const childArray = Array.isArray(children) ? children : [children];
  return (
    <div style={{ ...stackStyles.stack, gap: gapMap[gap], alignItems: align, ...style }} {...props}>
      {childArray.map((child, i) => (
        <div key={i} style={stackStyles.stackItem}>{child}</div>
      ))}
    </div>
  );
}