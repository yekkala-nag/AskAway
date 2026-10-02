import React from "react";

/**
 * AskAway brand mark — official logo art (chat bubble + question mark +
 * circuit traces + forward arrow), pre-cut to a transparent background so
 * it sits natively on light tiles, tinted heroes, and dark surfaces
 * without a pasted-patch look.
 *
 * Source: brand PNG → edge/glow flood-fill cutout (public/assets/askaway-mark.png).
 * The full stacked lockup lives at public/assets/askaway-logo.png.
 */
export function AskAwayLogo({ size = 32, style = {}, className = "", alt = "AskAway" }) {
  return (
    <img
      src="/assets/askaway-mark.png"
      alt={alt}
      draggable={false}
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
        objectFit: "contain",
        ...style,
      }}
    />
  );
}

export default AskAwayLogo;
