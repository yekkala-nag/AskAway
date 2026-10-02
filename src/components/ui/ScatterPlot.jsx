import React from 'react';
import { SHOWCASE, frameStyles, FrameHeader } from './SpectrumFrame.jsx';
import { spectrumAccentForModule } from '../../design-system/diagramTokens.js';

const ACCENT = spectrumAccentForModule('foundations');

const ScatterPlot = ({
  points,
  slopeW,
  interceptB,
  targetX = 2.4,
  width = 500,
  height = 300,
  title = 'House Price vs Size',
}) => {
  if (!points || points.length === 0) return null;

  // x values are in 1000s of sq ft
  const xValues = points.map(p => p.size / 1000);
  const yValues = points.map(p => p.actualPrice);
  const predValues = points.map(p => p.predictedPrice);

  const minX = Math.min(...xValues, targetX, 0);
  const maxX = Math.max(...xValues, targetX);
  const minY = Math.min(...yValues, ...predValues, slopeW * targetX + interceptB, 0);
  const maxY = Math.max(...yValues, ...predValues, slopeW * targetX + interceptB);

  const xRange = maxX - minX || 1;
  const yRange = maxY - minY || 1;
  const padding = 50;
  const innerWidth = width - 2 * padding;
  const innerHeight = height - 2 * padding;

  const xScale = (x) => padding + ((x - minX) / xRange) * innerWidth;
  const yScale = (y) => padding + innerHeight - ((y - minY) / yRange) * innerHeight;

  // Regression line points
  const lineStartX = minX;
  const lineEndX = maxX;
  const lineStartY = slopeW * lineStartX + interceptB;
  const lineEndY = slopeW * lineEndX + interceptB;

  // Target prediction
  const targetY = slopeW * targetX + interceptB;
  const targetScreenX = xScale(targetX);
  const targetScreenY = yScale(targetY);

  const xTicks = 5;
  const xTickValues = Array.from({ length: xTicks }, (_, i) => minX + (xRange * i) / (xTicks - 1));

  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks }, (_, i) => minY + (yRange * i) / (yTicks - 1));

  const frame = frameStyles(ACCENT);

  return (
    <div style={{ ...frame.figure, width: '100%' }}>
      <FrameHeader color={ACCENT} icon="chart" title={`${title} (ŷ = ${slopeW.toFixed(1)}·x + ${interceptB.toFixed(1)})`} />
      <div style={{ padding: 'var(--ds-space-4)', background: SHOWCASE.bg }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', background: 'var(--ds-color-bg-canvas)', borderRadius: 'var(--ds-radius-sm)' }}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--ds-color-module-foundations-primary)" />
          </marker>
        </defs>

        {/* Y-axis grid lines & labels */}
        {yTickValues.map((val, i) => {
          const y = yScale(val);
          return (
            <g key={`y-${i}`}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="var(--ds-color-border-subtle)" strokeWidth="0.5" strokeDasharray="2,2" />
              <text x={padding - 8} y={y + 4} textAnchor="end" fontSize="9" fill="var(--ds-color-text-tertiary)" fontFamily="DM Mono, monospace">
                ${val.toFixed(0)}k
              </text>
            </g>
          );
        })}

        {/* X-axis grid lines & labels */}
        {xTickValues.map((val, i) => {
          const x = xScale(val);
          return (
            <g key={`x-${i}`}>
              <line x1={x} y1={padding} x2={x} y2={height - padding} stroke="var(--ds-color-border-subtle)" strokeWidth="0.5" strokeDasharray="2,2" />
              <text x={x} y={height - padding + 16} textAnchor="middle" fontSize="9" fill="var(--ds-color-text-tertiary)" fontFamily="DM Mono, monospace">
                {val.toFixed(1)}k sq ft
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="var(--ds-color-border)" strokeWidth="1" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--ds-color-border)" strokeWidth="1" />

        {/* Regression line */}
        <line
          x1={xScale(lineStartX)}
          y1={yScale(lineStartY)}
          x2={xScale(lineEndX)}
          y2={yScale(lineEndY)}
          stroke="var(--ds-color-module-foundations-primary)"
          strokeWidth="2.5"
          strokeDasharray="5,3"
          markerEnd="url(#arrowhead)"
        />

        {/* Actual data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={xScale(p.size / 1000)}
              cy={yScale(p.actualPrice)}
              r={8}
              fill="#3A9B9F"
              stroke="white"
              strokeWidth="2"
            />
            <text
              x={xScale(p.size / 1000)}
              y={yScale(p.actualPrice) - 14}
              textAnchor="middle"
              fontSize="10"
              fill="var(--ds-color-text-primary)"
              fontWeight="600"
              fontFamily="DM Mono, monospace"
            >
              ${p.actualPrice}k
            </text>
            {/* Residual line */}
            {p.residual !== 0 && (
              <line
                x1={xScale(p.size / 1000)}
                y1={yScale(p.actualPrice)}
                x2={xScale(p.size / 1000)}
                y2={yScale(p.predictedPrice)}
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="3,3"
                opacity={0.7}
              />
            )}
            {/* Predicted point on line */}
            <circle
              cx={xScale(p.size / 1000)}
              cy={yScale(p.predictedPrice)}
              r={5}
              fill="var(--ds-color-module-foundations-primary)"
              stroke="white"
              strokeWidth="1.5"
            />
          </g>
        ))}

        {/* Mark's house prediction */}
        <g>
          <line
            x1={targetScreenX}
            y1={height - padding}
            x2={targetScreenX}
            y2={targetScreenY}
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          <circle
            cx={targetScreenX}
            cy={targetScreenY}
            r={10}
            fill="#f59e0b"
            stroke="white"
            strokeWidth="2"
          />
          <text
            x={targetScreenX}
            y={targetScreenY - 16}
            textAnchor="middle"
            fontSize="11"
            fill="#f59e0b"
            fontWeight="700"
            fontFamily="DM Mono, monospace"
          >
            Mark: ${targetY.toFixed(0)}k
          </text>
          <text
            x={targetScreenX}
            y={height - padding + 28}
            textAnchor="middle"
            fontSize="10"
            fill="var(--ds-color-text-secondary)"
            fontFamily="DM Mono, monospace"
          >
            2.4k sq ft
          </text>
        </g>

        {/* Legend */}
        <g style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace' }}>
          <circle cx={width - 120} cy={padding + 15} r={5} fill="#3A9B9F" />
          <text x={width - 110} y={padding + 20} fill="var(--ds-color-text-secondary)">Actual Price</text>
          <circle cx={width - 120} cy={padding + 35} r={5} fill="var(--ds-color-module-foundations-primary)" />
          <text x={width - 110} y={padding + 40} fill="var(--ds-color-text-secondary)">Predicted (on line)</text>
          <line x1={width - 130} y1={padding + 52} x2={width - 110} y2={padding + 52} stroke="var(--ds-color-module-foundations-primary)" strokeWidth="2" strokeDasharray="5,3" />
          <text x={width - 110} y={padding + 57} fill="var(--ds-color-text-secondary)">Regression Line</text>
          <circle cx={width - 120} cy={padding + 72} r={5} fill="#f59e0b" />
          <text x={width - 110} y={padding + 77} fill="var(--ds-color-text-secondary)">Mark's House</text>
          <line x1={width - 130} y1={padding + 89} x2={width - 110} y2={padding + 89} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.7" />
          <text x={width - 110} y={padding + 94} fill="var(--ds-color-text-secondary)">Residual Error</text>
        </g>

        {/* Axis labels */}
        <text x={width / 2} y={height - 8} textAnchor="middle" fontSize="11" fill="var(--ds-color-text-secondary)" fontWeight="500">
          House Size (1000s sq ft)
        </text>
        <text x={12} y={height / 2} textAnchor="middle" transform={`rotate(-90, 12, ${height / 2})`} fontSize="11" fill="var(--ds-color-text-secondary)" fontWeight="500">
          Price ($1000s)
        </text>
      </svg>
      </div>
    </div>
  );
};

export default ScatterPlot;