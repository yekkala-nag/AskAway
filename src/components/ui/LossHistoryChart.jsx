import React from 'react';
import { SHOWCASE, frameStyles, FrameHeader } from './SpectrumFrame.jsx';
import { spectrumAccentForModule } from '../../design-system/diagramTokens.js';

const ACCENT = spectrumAccentForModule('foundations');
const SERIES = '#A78BFA';

const LossHistoryChart = ({
  history,
  width = '100%',
  height = 200,
  title = 'Loss Convergence',
}) => {
  if (!history || history.length === 0) return null;

  const mseValues = history.map(d => d.mse);
  const minVal = Math.min(...mseValues);
  const maxVal = Math.max(...mseValues);
  const range = maxVal - minVal || 1;
  const padding = 40;
  const viewBoxWidth = 500;
  const viewBoxHeight = height;
  const innerWidth = viewBoxWidth - 2 * padding;
  const innerHeight = viewBoxHeight - 2 * padding;

  const xScale = (step, maxStep) => padding + (step / maxStep) * innerWidth;
  const yScale = (val) => padding + innerHeight - ((val - minVal) / range) * innerHeight;
  const maxStep = history[history.length - 1]?.step || 1;

  const path = history.map(d => `${xScale(d.step, maxStep)},${yScale(d.mse)}`).join(' ');

  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks }, (_, i) => minVal + (range * i) / (yTicks - 1));

  const xTicks = Math.min(6, history.length);
  const xTickSteps = Array.from({ length: xTicks }, (_, i) => Math.round(i * maxStep / (xTicks - 1)));

  const frame = frameStyles(ACCENT);

  return (
    <div style={{ ...frame.figure, width: '100%' }}>
      <FrameHeader color={ACCENT} icon="chart" title={title} />
      <div style={{ padding: 'var(--ds-space-4)', background: SHOWCASE.bg }}>
      <div style={{ width: '100%', maxWidth: 600 }}>
        <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block', width: '100%', height: 'auto', background: 'var(--ds-color-bg-canvas)', borderRadius: 'var(--ds-radius-sm)' }} role="img" aria-label="MSE loss convergence over gradient descent steps">
          <title>MSE Loss Convergence History</title>
          <desc>Line chart showing how MSE loss decreases over gradient descent iterations</desc>
          <defs>
            <linearGradient id="historyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={SERIES} stopOpacity="0.3" />
              <stop offset="100%" stopColor={SERIES} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Y-axis grid lines & labels */}
          {yTickValues.map((val, i) => {
            const y = yScale(val);
            return (
              <g key={`y-${i}`}>
                <line x1={padding} y1={y} x2={viewBoxWidth - padding} y2={y} stroke="var(--ds-color-border-subtle)" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x={padding - 8} y={y + 4} textAnchor="end" fontSize="9" fill="var(--ds-color-text-tertiary)" fontFamily="DM Mono, monospace">
                  {val.toFixed(val >= 10 ? 0 : 1)}
                </text>
              </g>
            );
          })}

          {/* X-axis grid lines & labels */}
          {xTickSteps.map((step, i) => {
            const x = xScale(step, maxStep);
            return (
              <g key={`x-${i}`}>
                <line x1={x} y1={padding} x2={x} y2={viewBoxHeight - padding} stroke="var(--ds-color-border-subtle)" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x={x} y={viewBoxHeight - padding + 16} textAnchor="middle" fontSize="9" fill="var(--ds-color-text-tertiary)" fontFamily="DM Mono, monospace">
                  {step}
                </text>
              </g>
            );
          })}

          {/* Axes */}
          <line x1={padding} y1={padding} x2={padding} y2={viewBoxHeight - padding} stroke="var(--ds-color-border)" strokeWidth="1" />
          <line x1={padding} y1={viewBoxHeight - padding} x2={viewBoxWidth - padding} y2={viewBoxHeight - padding} stroke="var(--ds-color-border)" strokeWidth="1" />

          {/* Area under curve */}
          <path
            d={`M${padding},${viewBoxHeight - padding} L${path} L${viewBoxWidth - padding},${viewBoxHeight - padding} Z`}
            fill="url(#historyGradient)"
          />

          {/* Curve line */}
          <path
            d={`M${path}`}
            stroke={SERIES}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {history.map((d, i) => (
            <circle
              key={i}
              cx={xScale(d.step, maxStep)}
              cy={yScale(d.mse)}
              r={i === history.length - 1 ? 5 : 3}
              fill={i === history.length - 1 ? SERIES : 'var(--ds-color-bg-canvas)'}
              stroke={SERIES}
              strokeWidth={i === history.length - 1 ? 0 : 2}
            />
          ))}

          {/* Axis labels */}
          <text x={viewBoxWidth / 2} y={viewBoxHeight - 6} textAnchor="middle" fontSize="10" fill="var(--ds-color-text-secondary)" fontWeight="500">
            Gradient Descent Step
          </text>
          <text x={8} y={viewBoxHeight / 2} textAnchor="middle" transform={`rotate(-90, 8, ${viewBoxHeight / 2})`} fontSize="10" fill="var(--ds-color-text-secondary)" fontWeight="500">
            MSE Loss
          </text>
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--ds-space-2)', fontSize: 'var(--ds-font-size-caption)', color: SHOWCASE.sub }}>
        <span>Steps: {history.length}</span>
        <span>Final MSE: {history[history.length - 1]?.mse?.toFixed(1) ?? 'N/A'}</span>
      </div>
      </div>
    </div>
  );
};

export default LossHistoryChart;