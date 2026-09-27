import React from "react";

export function LuminaLogo({ size = 32, style = {}, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
      aria-label="Lumina AI Logo"
    >
      <defs>
        {/* Background Halo Glow */}
        <radialGradient id="haloGlow" cx="50%" cy="38%" r="45%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35"/>
          <stop offset="60%" stopColor="#818CF8" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0"/>
        </radialGradient>

        {/* Bulb Dome Gradient (Cyan to Amber Sunburst) */}
        <radialGradient id="bulbDome" cx="40%" cy="32%" r="55%">
          <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.3"/>
          <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.15"/>
          <stop offset="85%" stopColor="#F59E0B" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#F97316" stopOpacity="0.4"/>
        </radialGradient>

        {/* Central Neural Core Radial Glow */}
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF"/>
          <stop offset="35%" stopColor="#A5F3FC"/>
          <stop offset="70%" stopColor="#38BDF8"/>
          <stop offset="100%" stopColor="#0284C7"/>
        </radialGradient>

        {/* Neural Tendril Gradient */}
        <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE"/>
          <stop offset="50%" stopColor="#38BDF8"/>
          <stop offset="100%" stopColor="#0284C7"/>
        </linearGradient>

        {/* Left Book Pages (Cyan / Azure) */}
        <linearGradient id="leftPageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8"/>
          <stop offset="50%" stopColor="#0284C7"/>
          <stop offset="100%" stopColor="#312E81"/>
        </linearGradient>

        {/* Right Book Pages (Amber / Gold / Flame) */}
        <linearGradient id="rightPageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047"/>
          <stop offset="50%" stopColor="#F59E0B"/>
          <stop offset="100%" stopColor="#C2410C"/>
        </linearGradient>

        {/* Screw Base Metallic Gradient */}
        <linearGradient id="screwGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4338CA"/>
          <stop offset="50%" stopColor="#818CF8"/>
          <stop offset="100%" stopColor="#312E81"/>
        </linearGradient>

        {/* Glow Filter */}
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      {/* 1. Ambient Circular Halo */}
      <circle cx="60" cy="46" r="38" fill="url(#haloGlow)" />
      <circle cx="60" cy="46" r="32" fill="url(#bulbDome)" stroke="url(#neuralGrad)" strokeWidth="1.2" strokeOpacity="0.4" />

      {/* 2. Neural Sunburst Synapses (Radiating Tentacles & Terminal Nodes) */}
      <g filter="url(#softGlow)">
        {/* Central Core */}
        <circle cx="60" cy="45" r="9" fill="url(#coreGlow)" />
        <circle cx="60" cy="45" r="5" fill="#FFFFFF" opacity="0.9" />

        {/* Tendril 1: Top Right */}
        <path d="M63 38 Q 66 30 73 31" stroke="url(#neuralGrad)" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        <circle cx="73" cy="31" r="3.2" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1"/>

        {/* Tendril 2: Top Left */}
        <path d="M57 38 Q 54 28 58 24" stroke="url(#neuralGrad)" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        <circle cx="58" cy="24" r="3.2" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1"/>

        {/* Tendril 3: Far Left */}
        <path d="M52 44 Q 44 42 41 46" stroke="url(#neuralGrad)" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        <circle cx="41" cy="46" r="3.2" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1"/>

        {/* Tendril 4: Bottom Left */}
        <path d="M54 50 Q 48 57 44 57" stroke="url(#neuralGrad)" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        <circle cx="44" cy="57" r="3" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1"/>

        {/* Tendril 5: Far Right */}
        <path d="M68 45 Q 76 43 81 48" stroke="url(#neuralGrad)" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        <circle cx="81" cy="48" r="3.2" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1"/>

        {/* Tendril 6: Top-Left Branch */}
        <path d="M54 41 Q 48 37 45 35" stroke="url(#neuralGrad)" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <circle cx="45" cy="35" r="2.8" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1"/>

        {/* Tendril 7: Bottom Stem into Book */}
        <path d="M60 54 Q 60 62 60 67" stroke="url(#neuralGrad)" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      </g>

      {/* 3. Open Book Wings / Illuminated Pages (Left: Cyan/Blue, Right: Amber/Gold) */}
      <g>
        {/* Left Outer Page Wing */}
        <path d="M60 68 C 50 63 36 63 26 70 C 29 73 34 76 40 76 C 48 76 56 73 60 76 Z" fill="url(#leftPageGrad)" opacity="0.95"/>
        {/* Left Secondary Page */}
        <path d="M60 71 C 52 67 40 68 31 75 C 34 78 39 81 46 80 C 52 80 57 77 60 79 Z" fill="#0284C7" opacity="0.8"/>
        {/* Left Inner Page */}
        <path d="M60 74 C 54 71 44 73 37 80 C 40 82 45 84 50 83 C 55 83 58 81 60 82 Z" fill="#38BDF8" opacity="0.9"/>

        {/* Right Outer Page Wing */}
        <path d="M60 68 C 70 63 84 63 94 70 C 91 73 86 76 80 76 C 72 76 64 73 60 76 Z" fill="url(#rightPageGrad)" opacity="0.95"/>
        {/* Right Secondary Page */}
        <path d="M60 71 C 68 67 80 68 89 75 C 86 78 81 81 74 80 C 68 80 63 77 60 79 Z" fill="#F59E0B" opacity="0.85"/>
        {/* Right Inner Page */}
        <path d="M60 74 C 66 71 76 73 83 80 C 80 82 75 84 70 83 C 65 83 62 81 60 82 Z" fill="#FBBF24" opacity="0.9"/>

        {/* Central Book Spine Crease */}
        <path d="M60 67 L 60 84" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.8"/>
      </g>

      {/* 4. Lightbulb Screw Base & Contact (Violet/Indigo Threads) */}
      <g>
        {/* Thread Ring 1 */}
        <path d="M50 87 C 54 85 66 85 70 87 C 69 90 51 90 50 87 Z" fill="url(#screwGrad)"/>
        {/* Thread Ring 2 */}
        <path d="M52 91 C 55 89 65 89 68 91 C 67 94 53 94 52 91 Z" fill="url(#screwGrad)"/>
        {/* Thread Ring 3 / Contact Base */}
        <path d="M54 95 C 57 93 63 93 66 95 C 65 98 55 98 54 95 Z" fill="#312E81"/>
      </g>
    </svg>
  );
}

export default LuminaLogo;
