import React from "react";

/**
 * AskAway brand mark — chat bubble + question mark + circuit traces + forward arrow.
 * Navy (#1B3A6B) → teal (#14B8A6) gradient on a transparent ground so it sits
 * natively on light tiles, dark surfaces, and the favicon without a pasted patch look.
 */
export function AskAwayLogo({ size = 32, style = {}, className = "" }) {
  const uid = React.useId().replace(/:/g, "");
  const bubbleGrad = `askBubble-${uid}`;
  const traceGrad = `askTrace-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="18 14 96 96"
      fill="none"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
      aria-label="AskAway Logo"
      role="img"
    >
      <defs>
        <linearGradient id={bubbleGrad} x1="0%" y1="0%" x2="100%" y2="30%">
          <stop offset="0%" stopColor="#1B3A6B" />
          <stop offset="55%" stopColor="#0E7C96" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
        <linearGradient id={traceGrad} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8FA6BE" />
          <stop offset="100%" stopColor="#6B8AA5" />
        </linearGradient>
      </defs>

      {/* 1. Circuit traces (behind the question mark, subtle) */}
      <g stroke={`url(#${traceGrad})`} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.85">
        {/* Left bank */}
        <path d="M30 38 H38 L43 43 H50" />
        <path d="M30 47 H40 L44 51 H49" />
        <path d="M30 56 H37 L42 51" />
        {/* Right bank */}
        <path d="M86 38 H78 L73 43 H68" />
        <path d="M86 47 H76 L72 51 H69" />
        <path d="M86 56 H79 L74 51" />
      </g>
      <g fill="none" stroke="#8FA6BE" strokeWidth="1.6" opacity="0.85">
        <circle cx="52" cy="43" r="2.4" />
        <circle cx="51" cy="51" r="2.4" />
        <circle cx="66" cy="43" r="2.4" />
        <circle cx="67" cy="51" r="2.4" />
        <circle cx="75" cy="57" r="2.2" />
        <circle cx="41" cy="57" r="2.2" />
      </g>

      {/* 2. Chat bubble outline (gap at bottom-center where the arrow emerges) */}
      <path
        d="M66 70 H74 Q86 70 86 58 V36 Q86 24 74 24 H42 Q30 24 30 36 V58 Q30 70 42 70 H50"
        stroke={`url(#${bubbleGrad})`}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* 3. Bubble tail (bottom-left) */}
      <path
        d="M46 68 L37 92 L58 69"
        stroke={`url(#${bubbleGrad})`}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* 4. Question mark */}
      <path
        d="M50 40 C50 30 56 26 62 26 C70 26 75 31 75 38 C75 45 68 48 64 53 C61 56 60 59 60 62"
        stroke={`url(#${bubbleGrad})`}
        strokeWidth="8.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="60" cy="67.5" r="4.2" fill="#14B8A6" />

      {/* 5. Forward arrow (bubble tail morphs into action) */}
      <path
        d="M56 84 C51 84 49.5 77.5 55 75.5 C59 74.2 62 76.5 61.5 79.5"
        stroke="#14B8A6"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="58" y1="84" x2="86" y2="84" stroke="#14B8A6" strokeWidth="7" strokeLinecap="round" />
      <polygon points="86,76 86,92 98,84" fill="#14B8A6" />
    </svg>
  );
}

export default AskAwayLogo;
