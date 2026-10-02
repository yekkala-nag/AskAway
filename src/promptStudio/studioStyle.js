export const C = {
  bg: '#0F1219', surface: '#161B26', s2: '#1C2433', s3: '#243044',
  border: '#2A3548', text: '#E2E8F0', muted: '#B8B8C4',
  teal: '#5EC4C8', coral: '#E8837A', lav: '#C9B8E8',
  ok: '#6BD4A0', bad: '#E8837A', warn: '#E8C37A',
};
export const mono = { fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" };
export const sectionStyle = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 18 };
export const labelStyle = (color) => ({ color, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12, ...mono });
export const btn = (color = C.teal) => ({ background: 'transparent', border: `1px solid ${color}`, color, borderRadius: 6, padding: '6px 12px', fontSize: 11, cursor: 'pointer', ...mono });
export const inputStyle = { background: C.bg, border: `1px solid ${C.border}`, color: C.text, padding: '7px 10px', borderRadius: 6, fontSize: 11, ...mono };
export const pageWrap = { maxWidth: 1100, margin: '0 auto', padding: '24px 20px 60px' };
export const h1 = { color: C.text, fontSize: 20, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.01em' };
export const sub = { color: C.muted, fontSize: 12.5, lineHeight: 1.65, margin: '0 0 18px', maxWidth: 760 };

export function chipStyle(active, color = C.teal) {
  return {
    background: active ? `${color}22` : C.s2,
    border: `1px solid ${active ? color : C.border}`,
    color: active ? color : C.muted,
    borderRadius: 12, padding: '4px 10px', fontSize: 11, cursor: 'pointer', ...mono,
  };
}
