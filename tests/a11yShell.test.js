import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const indexHtml = read('index.html');
const globalStyles = read('src/design-system/globalStyles.js');
const appNew = read('src/AppNew.jsx');
const primitives = read('src/components/layout/Primitives.jsx');
const navigation = read('src/components/ui/Navigation.jsx');

// ── index.html ──
test('zoom is not blocked (WCAG 1.4.4)', () => {
  assert.ok(!/user-scalable\s*=\s*no/.test(indexHtml), 'user-scalable=no forbidden');
  assert.ok(!/maximum-scale/.test(indexHtml), 'maximum-scale forbidden');
});

test('root uses dvh with vh fallback to avoid mobile URL-bar jumps', () => {
  assert.match(indexHtml, /height:\s*100vh;/);
  assert.match(indexHtml, /height:\s*100dvh;/);
});

test('html has smooth scrolling, disabled under reduced motion', () => {
  assert.match(indexHtml, /scroll-behavior:\s*smooth/);
  assert.match(indexHtml, /prefers-reduced-motion[\s\S]*?scroll-behavior:\s*auto/);
});

// ── global styles ──
test('skip-link styles exist and reveal on focus', () => {
  assert.match(globalStyles, /\.ds-skip-link/);
  assert.match(globalStyles, /\.ds-skip-link:focus\s*\{[^}]*top:\s*12px/);
});

test('focus ring is :focus-visible gated with high contrast + smooth transition', () => {
  assert.match(globalStyles, /:focus-visible/);
  assert.ok(!/:root\s*\{[^}]*outline:\s*none/.test(globalStyles), 'no global outline:none');
  assert.match(globalStyles, /outline:\s*2px solid var\(--ds-color-border-focus\)/);
  assert.match(globalStyles, /box-shadow:\s*0 0 0 4px rgba\(58,\s*155,\s*159/);
  assert.match(globalStyles, /transition:[^;]*outline-color/);
});

test('reduced-motion override still exists', () => {
  assert.match(globalStyles, /@media \(prefers-reduced-motion: reduce\)/);
});

test('coarse-pointer targets: 24px floor + 44px chrome minimum', () => {
  const coarse = globalStyles.slice(globalStyles.indexOf('@media (pointer: coarse)'));
  assert.ok(coarse.length > 0, 'coarse pointer block exists');
  assert.match(coarse, /min-width:\s*24px/);
  assert.match(coarse, /min-height:\s*44px/);
  assert.match(coarse, /min-width:\s*44px/);
  assert.match(coarse, /touch-action:\s*manipulation/);
});

test('hover effects gated behind hover-capable fine pointers', () => {
  assert.match(globalStyles, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.match(globalStyles, /@media not \(hover: hover\) and \(pointer: coarse\)/);
});

test('scroll regions are smooth + overscroll-contained', () => {
  assert.match(globalStyles, /\[data-scroll\][^{]*\{[^}]*scroll-behavior:\s*smooth/);
  assert.match(globalStyles, /\[data-scroll\][^{]*\{[^}]*overscroll-behavior:\s*contain/);
});

test('app shell height uses dvh fallback', () => {
  assert.match(globalStyles, /\.app-page\s*\{[^}]*height:\s*100vh;[^}]*height:\s*100dvh;/);
});

// ── app shell ──
test('skip link is the first focusable element and targets main content', () => {
  const skipIdx = appNew.indexOf('Skip to main content');
  assert.ok(skipIdx > 0, 'skip link present');
  assert.match(appNew, /href="#main-content"/);
  assert.match(appNew, /className="ds-skip-link"/);
  // skip link must appear before TopBar in the header tree
  assert.ok(skipIdx < appNew.indexOf('<TopBar'), 'skip link precedes TopBar');
});

test('footer hover states use the CSS class, not stuck-prone JS handlers', () => {
  assert.ok(!/onMouseEnter=\{\(e\) => \(e\.currentTarget\.style\.color = '#5EC4C8'\)\}/.test(appNew),
    'no inline color-flip mouse handlers left in AppNew footer');
  const hoverables = appNew.match(/ds-hoverable/g) || [];
  assert.ok(hoverables.length >= 4, 'footer link + 3 legal buttons use .ds-hoverable');
});

// ── layout primitives ──
test('page root dvh class, scroll region flagged, drawer is a modal dialog', () => {
  assert.match(primitives, /className="app-page"/);
  assert.match(primitives, /data-scroll/);
  assert.match(primitives, /role=\{drawerOpen \? 'dialog' : undefined\}/);
  assert.match(primitives, /aria-modal=\{drawerOpen \? true : undefined\}/);
  assert.match(primitives, /useModalA11y/);
  assert.match(primitives, /addEventListener\('resize', handleResize, \{ passive: true \}\)/);
});

// ── navigation ──
test('command palette implements the ARIA combobox pattern', () => {
  assert.match(navigation, /role="combobox"/);
  assert.match(navigation, /aria-activedescendant/);
  assert.match(navigation, /id="cp-listbox"/);
  assert.match(navigation, /role="listbox"/);
  assert.match(navigation, /role="option"/);
  assert.match(navigation, /aria-selected=\{i === selectedIndex\}/);
  assert.match(navigation, /scrollIntoView\(\{ block: 'nearest' \}\)/);
  assert.match(navigation, /e\.key === 'Home'/);
  assert.match(navigation, /e\.key === 'End'/);
});

test('sidebar has roving Arrow Up/Down focus with field-guard', () => {
  assert.match(navigation, /handleNavKeyDown/);
  assert.match(navigation, /ArrowDown/);
  assert.match(navigation, /isField/);
  assert.match(navigation, /aria-expanded=\{isExpanded\}/);
  assert.match(navigation, /aria-controls=\{isExpanded/);
});

test('hamburger exposes expanded state and controls the drawer', () => {
  assert.match(navigation, /aria-expanded=\{!!mobileOpen\}/);
  assert.match(navigation, /aria-controls="main-sidebar"/);
});

test('topic pagination supports Arrow Left/Right', () => {
  assert.match(navigation, /aria-label="Topic position navigation"/);
  assert.match(navigation, /'\.aw-btn-prev'/);
  assert.match(navigation, /'\.aw-btn-next'/);
});

test('brand logo div is keyboard operable', () => {
  assert.match(navigation, /aria-label="AskAway home — go to Overview"/);
  assert.match(navigation, /role="button"\s*\n\s*tabIndex=\{0\}/);
});
