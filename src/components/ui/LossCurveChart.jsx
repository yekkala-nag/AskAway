import React from 'react';
import { SHOWCASE, frameStyles, FrameHeader } from './SpectrumFrame.jsx';
import { spectrumAccentForModule } from '../../design-system/diagramTokens.js';

const ACCENT = spectrumAccentForModule('foundations');

const LossCurveChart = ({
  data,
  currentW,
  currentB,
  metric = 'mse',
  width = '100%',
  height = 280,
  title = 'Loss Curve',
}) => {
  if (!data || data.length === 0) return null;

  const metricData = data.map(d => d[metric]);
  const minVal = Math.min(...metricData);
  const maxVal = Math.max(...metricData);
  const range = maxVal - minVal || 1;
  const padding = 40;
  // Use a fixed logical width for viewBox, actual size controlled by CSS
  const viewBoxWidth = 500;
  const viewBoxHeight = height;
  const innerWidth = viewBoxWidth - 2 * padding;
  const innerHeight = viewBoxHeight - 2 * padding;

  const xScale = (i) => padding + (i / (data.length - 1)) * innerWidth;
  const yScale = (val) => padding + innerHeight - ((val - minVal) / range) * innerHeight;

  const path = data.map((d, i) => `${xScale(i)},${yScale(d[metric])}`).join(' ');

  const currentFit = data.find(d => Math.abs(d.interceptB - currentB) < 5);
  const currentX = currentFit ? xScale(data.indexOf(currentFit)) : null;
  const currentY = currentFit ? yScale(currentFit[metric]) : null;

  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks }, (_, i) => minVal + (range * i) / (yTicks - 1));

  const xTicks = 5;
  const xTickIndices = Array.from({ length: xTicks }, (_, i) => Math.round(i * (data.length - 1) / (xTicks - 1)));

  const frame = frameStyles(ACCENT);

  return (
    <div style={{ ...frame.figure, width: '100%' }}>
      <FrameHeader color={ACCENT} icon="chart" title={`${title} (${metric.toUpperCase()})`} />
      <div style={{ padding: 'var(--ds-space-4)', background: SHOWCASE.bg }}>
      <div style={{ width: '100%', maxWidth: 600 }}>
        <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block', width: '100%', height: 'auto', background: 'var(--ds-color-bg-canvas)', borderRadius: 'var(--ds-radius-sm)' }} role="img" aria-label={`${metric.toUpperCase()} loss curve vs intercept b at fixed slope w=${currentW}`}>
          <title>{`${metric.toUpperCase()} Loss vs Intercept (b)`}</title>
          <desc>Parabolic curve showing how loss changes as intercept b varies from 0 to 200, with current position marked</desc>
          <defs>
            <linearGradient id="lossGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--ds-color-module-foundations-primary)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--ds-color-module-foundations-primary)" stopOpacity="0" />
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
          {xTickIndices.map((idx, i) => {
            const x = xScale(idx);
            const bVal = data[idx]?.interceptB ?? 0;
            return (
              <g key={`x-${i}`}>
                <line x1={x} y1={padding} x2={x} y2={viewBoxHeight - padding} stroke="var(--ds-color-border-subtle)" strokeWidth="0.5" strokeDasharray="2,2" />
                <text x={x} y={viewBoxHeight - padding + 16} textAnchor="middle" fontSize="9" fill="var(--ds-color-text-tertiary)" fontFamily="DM Mono, monospace">
                  {bVal}
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
            fill="url(#lossGradient)"
          />

          {/* Curve line */}
          <path
            d={`M${path}`}
            stroke="var(--ds-color-module-foundations-primary)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Current position marker */}
          {currentX !== null && currentY !== null && (
            <g>
              <circle cx={currentX} cy={currentY} r={6} fill="var(--ds-color-bg-canvas)" stroke="var(--ds-color-module-foundations-primary)" strokeWidth="2.5" />
              <circle cx={currentX} cy={currentY} r={3} fill="var(--ds-color-module-foundations-primary)" />
              <text x={currentX} y={currentY - 12} textAnchor="middle" fontSize="10" fill="var(--ds-color-text-primary)" fontWeight="600" fontFamily="DM Mono, monospace">
                Current
              </text>
            </g>
          )}

          {/* Axis labels */}
          <text x={viewBoxWidth / 2} y={viewBoxHeight - 6} textAnchor="middle" fontSize="10" fill="var(--ds-color-text-secondary)" fontWeight="500">
            Intercept (b)
          </text>
          <text x={8} y={viewBoxHeight / 2} textAnchor="middle" transform={`rotate(-90, 8, ${viewBoxHeight / 2})`} fontSize="10" fill="var(--ds-color-text-secondary)" fontWeight="500">
            {metric.toUpperCase()} Loss
          </text>
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--ds-space-2)', fontSize: 'var(--ds-font-size-caption)', color: SHOWCASE.sub }}>
        <span>w (slope) fixed at: {currentW}</span>
        <span>Range: b ∈ [0, 200]</span>
      </div>
      </div>
    </div>
  );
};

export default LossCurveChart;