import React, { useId } from 'react';

interface StarData {
  id: number;
  top: number;
  left: number;
  size: number;
  minOp: number;
  maxOp: number;
  duration: number;
  delay: number;
  isSparkle?: boolean;
}

interface LanternData {
  id: number;
  depth: 'far' | 'mid' | 'near';
  left: number; // percentage across screen
  width: number; // in px
  riseDuration: number; // in seconds
  riseDelay: number; // in seconds (negative for immediate stagger)
  driftType: 'A' | 'B';
  swayDuration: number;
  swayDistance: number;
  swayRotation: number;
  flickerDuration: number;
  flickerDelay: number;
  opacity: number;
  blur?: number;
}

// 45 twinkling stars & soft golden sparkles across upper & middle sky
const STARS_DATA: StarData[] = [
  { id: 1, top: 3, left: 7, size: 1.5, minOp: 0.2, maxOp: 0.85, duration: 3.2, delay: -1.2 },
  { id: 2, top: 6, left: 22, size: 2.4, minOp: 0.35, maxOp: 1, duration: 4.1, delay: -2.5, isSparkle: true },
  { id: 3, top: 11, left: 38, size: 1.2, minOp: 0.15, maxOp: 0.7, duration: 2.8, delay: -0.4 },
  { id: 4, top: 5, left: 58, size: 1.8, minOp: 0.25, maxOp: 0.9, duration: 3.6, delay: -1.8 },
  { id: 5, top: 8, left: 76, size: 2.6, minOp: 0.4, maxOp: 1, duration: 4.4, delay: -3.1, isSparkle: true },
  { id: 6, top: 14, left: 93, size: 1.4, minOp: 0.2, maxOp: 0.75, duration: 3.0, delay: -0.9 },
  { id: 7, top: 17, left: 14, size: 1.6, minOp: 0.2, maxOp: 0.8, duration: 3.5, delay: -2.2 },
  { id: 8, top: 21, left: 31, size: 1.2, minOp: 0.1, maxOp: 0.65, duration: 2.7, delay: -1.5 },
  { id: 9, top: 18, left: 49, size: 2.2, minOp: 0.3, maxOp: 0.95, duration: 3.9, delay: -0.7, isSparkle: true },
  { id: 10, top: 24, left: 68, size: 1.4, minOp: 0.2, maxOp: 0.75, duration: 3.3, delay: -2.9 },
  { id: 11, top: 20, left: 84, size: 1.9, minOp: 0.3, maxOp: 0.85, duration: 4.0, delay: -1.1 },
  { id: 12, top: 28, left: 6, size: 1.3, minOp: 0.15, maxOp: 0.7, duration: 2.9, delay: -2.4 },
  { id: 13, top: 31, left: 23, size: 2.3, minOp: 0.35, maxOp: 1, duration: 4.2, delay: -0.3, isSparkle: true },
  { id: 14, top: 27, left: 43, size: 1.1, minOp: 0.1, maxOp: 0.6, duration: 2.6, delay: -1.7 },
  { id: 15, top: 34, left: 61, size: 1.6, minOp: 0.2, maxOp: 0.8, duration: 3.4, delay: -3.3 },
  { id: 16, top: 30, left: 79, size: 1.3, minOp: 0.15, maxOp: 0.75, duration: 3.1, delay: -0.8 },
  { id: 17, top: 37, left: 96, size: 2.4, minOp: 0.3, maxOp: 0.95, duration: 3.8, delay: -2.0, isSparkle: true },
  { id: 18, top: 41, left: 11, size: 1.4, minOp: 0.2, maxOp: 0.7, duration: 3.2, delay: -1.4 },
  { id: 19, top: 44, left: 27, size: 1.2, minOp: 0.15, maxOp: 0.65, duration: 2.8, delay: -2.7 },
  { id: 20, top: 40, left: 52, size: 1.7, minOp: 0.2, maxOp: 0.8, duration: 3.6, delay: -0.5 },
  { id: 21, top: 46, left: 72, size: 1.3, minOp: 0.1, maxOp: 0.7, duration: 3.0, delay: -1.9 },
  { id: 22, top: 43, left: 89, size: 2.0, minOp: 0.25, maxOp: 0.85, duration: 3.7, delay: -3.0, isSparkle: true },
  { id: 23, top: 50, left: 4, size: 1.1, minOp: 0.15, maxOp: 0.6, duration: 2.5, delay: -0.6 },
  { id: 24, top: 54, left: 18, size: 1.8, minOp: 0.2, maxOp: 0.8, duration: 3.5, delay: -2.1 },
  { id: 25, top: 52, left: 36, size: 1.3, minOp: 0.1, maxOp: 0.65, duration: 2.9, delay: -1.3 },
  { id: 26, top: 56, left: 65, size: 1.5, minOp: 0.2, maxOp: 0.75, duration: 3.3, delay: -2.8 },
  { id: 27, top: 51, left: 81, size: 2.5, minOp: 0.35, maxOp: 0.95, duration: 4.3, delay: -0.2, isSparkle: true },
  { id: 28, top: 60, left: 10, size: 1.2, minOp: 0.15, maxOp: 0.6, duration: 2.7, delay: -1.6 },
  { id: 29, top: 63, left: 29, size: 1.6, minOp: 0.2, maxOp: 0.75, duration: 3.4, delay: -3.2 },
  { id: 30, top: 59, left: 56, size: 1.4, minOp: 0.15, maxOp: 0.7, duration: 3.1, delay: -0.9 },
  { id: 31, top: 65, left: 75, size: 1.7, minOp: 0.2, maxOp: 0.8, duration: 3.7, delay: -2.3 },
  { id: 32, top: 62, left: 91, size: 1.3, minOp: 0.15, maxOp: 0.65, duration: 2.8, delay: -1.0 },
  { id: 33, top: 69, left: 15, size: 1.5, minOp: 0.2, maxOp: 0.7, duration: 3.2, delay: -2.6 },
  { id: 34, top: 71, left: 39, size: 1.2, minOp: 0.1, maxOp: 0.6, duration: 2.6, delay: -0.4 },
  { id: 35, top: 68, left: 54, size: 1.8, minOp: 0.25, maxOp: 0.8, duration: 3.8, delay: -1.7 },
  { id: 36, top: 72, left: 71, size: 1.3, minOp: 0.15, maxOp: 0.65, duration: 3.0, delay: -3.4 },
  { id: 37, top: 74, left: 86, size: 2.2, minOp: 0.3, maxOp: 0.9, duration: 4.1, delay: -1.1, isSparkle: true },
];

// 36 Floating sky lanterns across 3 depths with realistic staggered parameters
// Carefully staggered negative delays ensure the entire vertical sky (from 0% to 100%)
// is fully populated immediately on first render!
const LANTERNS_DATA: LanternData[] = [
  // --- FAR LANTERNS (Tiny, subtle blur, gentle rise, dreamy distance) ---
  { id: 1, depth: 'far', left: 4, width: 13, riseDuration: 42, riseDelay: -5.4, driftType: 'A', swayDuration: 7.2, swayDistance: 9, swayRotation: 2.5, flickerDuration: 4.2, flickerDelay: -1.1, opacity: 0.55, blur: 1.0 },
  { id: 2, depth: 'far', left: 12, width: 16, riseDuration: 38, riseDelay: -19.2, driftType: 'B', swayDuration: 8.1, swayDistance: 11, swayRotation: 3, flickerDuration: 4.8, flickerDelay: -2.4, opacity: 0.62, blur: 0.8 },
  { id: 3, depth: 'far', left: 21, width: 12, riseDuration: 44, riseDelay: -32.7, driftType: 'A', swayDuration: 7.5, swayDistance: 8, swayRotation: 2, flickerDuration: 3.9, flickerDelay: -0.5, opacity: 0.5, blur: 1.1 },
  { id: 4, depth: 'far', left: 32, width: 17, riseDuration: 36, riseDelay: -14.8, driftType: 'B', swayDuration: 6.8, swayDistance: 12, swayRotation: 3, flickerDuration: 4.5, flickerDelay: -3.2, opacity: 0.65, blur: 0.7 },
  { id: 5, depth: 'far', left: 43, width: 14, riseDuration: 40, riseDelay: -28.3, driftType: 'A', swayDuration: 8.4, swayDistance: 10, swayRotation: 2.5, flickerDuration: 4.1, flickerDelay: -1.8, opacity: 0.52, blur: 1.0 },
  { id: 6, depth: 'far', left: 52, width: 15, riseDuration: 37, riseDelay: -7.5, driftType: 'B', swayDuration: 7.7, swayDistance: 10, swayRotation: 2.5, flickerDuration: 4.6, flickerDelay: -2.9, opacity: 0.6, blur: 0.8 },
  { id: 7, depth: 'far', left: 63, width: 18, riseDuration: 35, riseDelay: -22.6, driftType: 'A', swayDuration: 6.9, swayDistance: 13, swayRotation: 3.5, flickerDuration: 3.8, flickerDelay: -0.9, opacity: 0.68, blur: 0.6 },
  { id: 8, depth: 'far', left: 73, width: 13, riseDuration: 43, riseDelay: -16.1, driftType: 'B', swayDuration: 8.6, swayDistance: 9, swayRotation: 2, flickerDuration: 4.9, flickerDelay: -3.7, opacity: 0.54, blur: 1.1 },
  { id: 9, depth: 'far', left: 82, width: 16, riseDuration: 39, riseDelay: -35.9, driftType: 'A', swayDuration: 7.3, swayDistance: 11, swayRotation: 3, flickerDuration: 4.3, flickerDelay: -1.4, opacity: 0.62, blur: 0.7 },
  { id: 10, depth: 'far', left: 91, width: 12, riseDuration: 41, riseDelay: -11.3, driftType: 'B', swayDuration: 7.9, swayDistance: 8, swayRotation: 2.5, flickerDuration: 4.0, flickerDelay: -2.2, opacity: 0.5, blur: 1.2 },
  { id: 11, depth: 'far', left: 98, width: 17, riseDuration: 36, riseDelay: -27.4, driftType: 'A', swayDuration: 6.7, swayDistance: 12, swayRotation: 3, flickerDuration: 4.7, flickerDelay: -0.7, opacity: 0.66, blur: 0.7 },
  { id: 12, depth: 'far', left: 27, width: 15, riseDuration: 39, riseDelay: -3.1, driftType: 'B', swayDuration: 7.4, swayDistance: 10, swayRotation: 2.5, flickerDuration: 4.2, flickerDelay: -2.1, opacity: 0.58, blur: 0.9 },

  // --- MIDGROUND LANTERNS (Medium, warm golden glow, clear visibility) ---
  { id: 13, depth: 'mid', left: -2, width: 28, riseDuration: 28, riseDelay: -8.2, driftType: 'A', swayDuration: 6.4, swayDistance: 16, swayRotation: 4, flickerDuration: 3.7, flickerDelay: -1.5, opacity: 0.82 },
  { id: 14, depth: 'mid', left: 8, width: 32, riseDuration: 30, riseDelay: -21.8, driftType: 'B', swayDuration: 6.9, swayDistance: 18, swayRotation: 4.5, flickerDuration: 4.2, flickerDelay: -3.0, opacity: 0.86 },
  { id: 15, depth: 'mid', left: 17, width: 26, riseDuration: 26, riseDelay: -4.6, driftType: 'A', swayDuration: 5.8, swayDistance: 15, swayRotation: 3.5, flickerDuration: 3.5, flickerDelay: -0.8, opacity: 0.8 },
  { id: 16, depth: 'mid', left: 25, width: 34, riseDuration: 29, riseDelay: -17.9, driftType: 'B', swayDuration: 7.1, swayDistance: 19, swayRotation: 4.5, flickerDuration: 4.5, flickerDelay: -2.7, opacity: 0.88 },
  { id: 17, depth: 'mid', left: 36, width: 29, riseDuration: 27, riseDelay: -11.4, driftType: 'A', swayDuration: 6.2, swayDistance: 16, swayRotation: 4, flickerDuration: 3.6, flickerDelay: -1.9, opacity: 0.84 },
  { id: 18, depth: 'mid', left: 47, width: 33, riseDuration: 31, riseDelay: -24.5, driftType: 'B', swayDuration: 6.8, swayDistance: 18, swayRotation: 4.5, flickerDuration: 4.0, flickerDelay: -3.4, opacity: 0.87 },
  { id: 19, depth: 'mid', left: 57, width: 27, riseDuration: 25, riseDelay: -7.8, driftType: 'A', swayDuration: 6.0, swayDistance: 15, swayRotation: 3.5, flickerDuration: 3.8, flickerDelay: -0.6, opacity: 0.82 },
  { id: 20, depth: 'mid', left: 66, width: 35, riseDuration: 32, riseDelay: -28.1, driftType: 'B', swayDuration: 7.3, swayDistance: 20, swayRotation: 5, flickerDuration: 4.4, flickerDelay: -2.1, opacity: 0.89 },
  { id: 21, depth: 'mid', left: 75, width: 30, riseDuration: 28, riseDelay: -15.3, driftType: 'A', swayDuration: 6.5, swayDistance: 17, swayRotation: 4, flickerDuration: 3.9, flickerDelay: -3.8, opacity: 0.85 },
  { id: 22, depth: 'mid', left: 85, width: 33, riseDuration: 29, riseDelay: -2.7, driftType: 'B', swayDuration: 6.7, swayDistance: 18, swayRotation: 4.5, flickerDuration: 4.1, flickerDelay: -1.3, opacity: 0.87 },
  { id: 23, depth: 'mid', left: 94, width: 28, riseDuration: 27, riseDelay: -19.2, driftType: 'A', swayDuration: 6.1, swayDistance: 16, swayRotation: 3.8, flickerDuration: 3.7, flickerDelay: -2.5, opacity: 0.83 },
  { id: 24, depth: 'mid', left: 101, width: 31, riseDuration: 30, riseDelay: -10.5, driftType: 'B', swayDuration: 6.6, swayDistance: 17, swayRotation: 4, flickerDuration: 4.2, flickerDelay: -1.8, opacity: 0.86 },
  { id: 25, depth: 'mid', left: 14, width: 30, riseDuration: 28, riseDelay: -26.0, driftType: 'A', swayDuration: 6.3, swayDistance: 17, swayRotation: 4, flickerDuration: 3.9, flickerDelay: -1.6, opacity: 0.85 },
  { id: 26, depth: 'mid', left: 70, width: 31, riseDuration: 29, riseDelay: -6.4, driftType: 'B', swayDuration: 6.5, swayDistance: 17, swayRotation: 4, flickerDuration: 4.0, flickerDelay: -2.8, opacity: 0.86 },

  // --- FOREGROUND LANTERNS (Large, luminous, detailed Tangled sun crest & flame) ---
  // Large prominent ones positioned near sides as in the reference image
  { id: 27, depth: 'near', left: 5, width: 56, riseDuration: 21, riseDelay: -3.9, driftType: 'A', swayDuration: 5.6, swayDistance: 22, swayRotation: 5, flickerDuration: 3.3, flickerDelay: -1.2, opacity: 0.98 },
  { id: 28, depth: 'near', left: 16, width: 48, riseDuration: 23, riseDelay: -14.4, driftType: 'B', swayDuration: 6.0, swayDistance: 20, swayRotation: 4.5, flickerDuration: 3.8, flickerDelay: -2.8, opacity: 0.95 },
  { id: 29, depth: 'near', left: 34, width: 44, riseDuration: 22, riseDelay: -8.1, driftType: 'A', swayDuration: 5.8, swayDistance: 18, swayRotation: 4, flickerDuration: 3.5, flickerDelay: -0.4, opacity: 0.94 },
  { id: 30, depth: 'near', left: 64, width: 50, riseDuration: 20, riseDelay: -16.6, driftType: 'B', swayDuration: 5.7, swayDistance: 21, swayRotation: 5, flickerDuration: 3.4, flickerDelay: -2.2, opacity: 0.96 },
  { id: 31, depth: 'near', left: 79, width: 68, riseDuration: 19, riseDelay: -5.7, driftType: 'A', swayDuration: 5.2, swayDistance: 24, swayRotation: 6, flickerDuration: 3.2, flickerDelay: -1.7, opacity: 1.0 }, // Big top-right lantern from reference
  { id: 32, depth: 'near', left: 91, width: 48, riseDuration: 22, riseDelay: -12.0, driftType: 'B', swayDuration: 5.9, swayDistance: 20, swayRotation: 4.5, flickerDuration: 3.6, flickerDelay: -3.1, opacity: 0.95 },
  { id: 33, depth: 'near', left: -4, width: 54, riseDuration: 21, riseDelay: -18.3, driftType: 'B', swayDuration: 5.5, swayDistance: 22, swayRotation: 5, flickerDuration: 3.5, flickerDelay: -0.9, opacity: 0.96 },
  { id: 34, depth: 'near', left: 88, width: 52, riseDuration: 23, riseDelay: -1.5, driftType: 'A', swayDuration: 6.1, swayDistance: 21, swayRotation: 4.8, flickerDuration: 3.7, flickerDelay: -2.4, opacity: 0.97 },
  { id: 35, depth: 'near', left: 24, width: 46, riseDuration: 22, riseDelay: -19.8, driftType: 'B', swayDuration: 5.8, swayDistance: 19, swayRotation: 4.2, flickerDuration: 3.6, flickerDelay: -1.5, opacity: 0.94 },
  { id: 36, depth: 'near', left: 72, width: 45, riseDuration: 21.5, riseDelay: -10.9, driftType: 'A', swayDuration: 5.6, swayDistance: 19, swayRotation: 4.5, flickerDuration: 3.4, flickerDelay: -2.6, opacity: 0.95 },
];

export const TangledLanternSky: React.FC = () => {
  const gradientId = useId();

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* 1. Global SVG Definitions for Lanterns */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          {/* Paper Gradient */}
          <linearGradient id={`paperGrad-${gradientId}`} x1="30" y1="4" x2="30" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFA63D" />
            <stop offset="35%" stopColor="#FFBA4A" />
            <stop offset="70%" stopColor="#FFD369" />
            <stop offset="100%" stopColor="#FFEAA7" />
          </linearGradient>

          {/* Internal Flame Radiant Light */}
          <radialGradient id={`flameGlow-${gradientId}`} cx="30" cy="56" r="32" fx="30" fy="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#FFF19E" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FFA128" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#E65100" stopOpacity="0" />
          </radialGradient>

          {/* Top Paper Curve Soft Highlight */}
          <linearGradient id={`topHighlight-${gradientId}`} x1="30" y1="4" x2="30" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFF8DB" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFA63D" stopOpacity="0" />
          </linearGradient>

          {/* Castle Window Glow */}
          <radialGradient id={`castleLightGlow-${gradientId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF9DC" stopOpacity="1" />
            <stop offset="50%" stopColor="#FFC850" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FF9010" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* 2. Twinkling Stars in Upper & Middle Sky */}
      <div className="absolute inset-0 w-full h-[85%] overflow-hidden pointer-events-none z-1">
        {STARS_DATA.map((star) => (
          <div
            key={star.id}
            className="absolute"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              ['--star-min-op' as any]: star.minOp,
              ['--star-max-op' as any]: star.maxOp,
              animation: `starTwinkleGlow ${star.duration}s infinite ease-in-out ${star.delay}s`,
            }}
          >
            {star.isSparkle ? (
              <svg
                viewBox="0 0 16 16"
                className="w-full h-full overflow-visible"
                style={{
                  width: `${star.size * 2.8}px`,
                  height: `${star.size * 2.8}px`,
                  transform: 'translate(-30%, -30%)',
                }}
              >
                <path
                  d="M8 0 L9.2 6.8 L16 8 L9.2 9.2 L8 16 L6.8 9.2 L0 8 L6.8 6.8 Z"
                  fill="#FFF7D6"
                  opacity="0.95"
                />
              </svg>
            ) : (
              <div
                className="w-full h-full rounded-full bg-[#FFFBEA]"
                style={{
                  boxShadow: `0 0 ${star.size * 2.5}px rgba(255, 245, 200, 0.85)`,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* 3. Continuously Rising Sky Lanterns Across Entire Viewport Height */}
      {/* Notice: top is fixed at 0. translateY travels from 112vh (below bottom) to -35vh (above top). */}
      {/* With staggered negative delays, the sky is fully alive with floating lanterns at every height! */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-5">
        {LANTERNS_DATA.map((lantern) => {
          const height = Math.round(lantern.width * 1.28);
          const isNear = lantern.depth === 'near';
          const isMid = lantern.depth === 'mid';

          return (
            <div
              key={lantern.id}
              className="absolute pointer-events-none"
              style={{
                top: 0,
                left: `${lantern.left}%`,
                width: `${lantern.width}px`,
                height: `${height}px`,
                zIndex: isNear ? 18 : isMid ? 8 : 3,
                animation: `lanternFloatUp ${lantern.riseDuration}s linear infinite ${lantern.riseDelay}s`,
                filter: lantern.blur ? `blur(${lantern.blur}px)` : undefined,
                opacity: lantern.opacity,
              }}
            >
              {/* Inner Sway Container (left/right drift + gentle rotation) */}
              <div
                className="w-full h-full"
                style={{
                  ['--drift-x' as any]: `${lantern.swayDistance}px`,
                  ['--drift-x-neg' as any]: `-${lantern.swayDistance}px`,
                  ['--drift-rot' as any]: `${lantern.swayRotation}deg`,
                  ['--drift-rot-neg' as any]: `-${lantern.swayRotation}deg`,
                  animation: `${lantern.driftType === 'A' ? 'lanternDriftA' : 'lanternDriftB'} ${lantern.swayDuration}s ease-in-out infinite alternate`,
                }}
              >
                {/* Flicker & Glow Container */}
                <div
                  className="w-full h-full"
                  style={{
                    ['--lantern-glow-sm' as any]: isNear ? '18px' : isMid ? '10px' : '6px',
                    ['--lantern-glow-lg' as any]: isNear ? '34px' : isMid ? '22px' : '12px',
                    animation: `lanternFlickerWarm ${lantern.flickerDuration}s ease-in-out infinite alternate ${lantern.flickerDelay}s`,
                  }}
                >
                  {/* Tangled-Inspired SVG Paper Lantern */}
                  <svg
                    viewBox="0 0 60 76"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full overflow-visible"
                  >
                    {/* Lantern Paper Body */}
                    <path
                      d="M 14 20 C 14 8, 22 4, 30 4 C 38 4, 46 8, 46 20 L 44 63 C 44 67, 39 69, 30 69 C 21 69, 16 67, 16 63 Z"
                      fill={`url(#paperGrad-${gradientId})`}
                    />

                    {/* Paper Bamboo Ribs (Curved vertical ribs) */}
                    <path
                      d="M 23 6 C 20 25, 20 48, 23 68"
                      stroke="#D86000"
                      strokeWidth="0.8"
                      strokeOpacity="0.32"
                      fill="none"
                    />
                    <path
                      d="M 37 6 C 40 25, 40 48, 37 68"
                      stroke="#D86000"
                      strokeWidth="0.8"
                      strokeOpacity="0.32"
                      fill="none"
                    />
                    <path
                      d="M 30 4 L 30 69"
                      stroke="#D86000"
                      strokeWidth="0.6"
                      strokeOpacity="0.22"
                      fill="none"
                    />

                    {/* Top Dome Subtle Highlight */}
                    <path
                      d="M 14 20 C 14 8, 22 4, 30 4 C 38 4, 46 8, 46 20 Z"
                      fill={`url(#topHighlight-${gradientId})`}
                    />

                    {/* Tangled Royal Sun Crest Motif (Delicate golden symbol on the paper) */}
                    <circle cx="30" cy="35" r="5.5" fill="#FFEBA0" fillOpacity="0.55" />
                    <path
                      d="M 30 25 L 30 28 M 30 42 L 30 45 M 20 35 L 23 35 M 37 35 L 40 35 M 23 28 L 25.2 30.2 M 34.8 39.8 L 37 42 M 23 42 L 25.2 39.8 M 34.8 30.2 L 37 28"
                      stroke="#FFEBA0"
                      strokeWidth="0.9"
                      strokeOpacity="0.5"
                      strokeLinecap="round"
                    />

                    {/* Inner Flame Radial Illumination */}
                    <path
                      d="M 14 20 C 14 8, 22 4, 30 4 C 38 4, 46 8, 46 20 L 44 63 C 44 67, 39 69, 30 69 C 21 69, 16 67, 16 63 Z"
                      fill={`url(#flameGlow-${gradientId})`}
                    />

                    {/* Bright Core Flame at Bottom Base */}
                    <ellipse cx="30" cy="58" rx="4.5" ry="6.5" fill="#FFFFFF" opacity="0.95" />
                    <ellipse cx="30" cy="58" rx="7.5" ry="9" fill="#FFF275" opacity="0.65" />

                    {/* Bottom Bamboo Ring / Rim */}
                    <ellipse
                      cx="30"
                      cy="67"
                      rx="14"
                      ry="3.5"
                      fill="#3B1400"
                      fillOpacity="0.75"
                      stroke="#FFB300"
                      strokeWidth="0.8"
                    />
                    <ellipse cx="30" cy="67" rx="8" ry="2" fill="#1A0700" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Horizon: Magical Tangled Fairytale Castle & Luminous Harbor */}
      <div className="absolute bottom-0 left-0 w-full h-[125px] sm:h-[165px] md:h-[195px] overflow-hidden pointer-events-none z-10 flex flex-col justify-end">
        {/* Soft Warm Sunset/Lantern Atmospheric Bloom radiating behind Castle */}
        <div
          className="absolute bottom-0 left-0 w-full h-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 90%, rgba(255, 155, 45, 0.65) 0%, rgba(225, 75, 80, 0.4) 35%, rgba(100, 20, 75, 0.18) 65%, transparent 100%)',
          }}
        />

        {/* Soft Dusky Purple Mist above the water */}
        <div
          className="absolute bottom-[20px] left-0 w-full h-[60px] opacity-45 blur-md pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(95, 25, 78, 0.6) 0%, rgba(65, 18, 68, 0.25) 60%, transparent 100%)',
          }}
        />

        {/* Fairytale Castle & Hillside Kingdom Silhouette with Glowing Windows & Lit Water Gate */}
        <div className="relative w-full flex justify-center items-end px-2 sm:px-6">
          <svg
            viewBox="0 0 800 160"
            preserveAspectRatio="xMidYMax meet"
            className="w-full max-w-[850px] h-[100px] sm:h-[140px] md:h-[170px] overflow-visible drop-shadow-[0_-5px_18px_rgba(255,140,40,0.25)]"
          >
            {/* Distant background mountain & hillside ridge silhouettes */}
            <path
              d="M 0 160 L 0 148 Q 55 138 115 142 Q 170 134 220 140 Q 260 128 310 134 Q 350 120 400 122 Q 450 120 490 134 Q 540 128 580 140 Q 630 134 685 142 Q 745 138 800 148 L 800 160 Z"
              fill="#060210"
              opacity="0.8"
            />

            {/* Main Castle Complex & Hillside Kingdom Silhouette */}
            <path
              d="M 0 160 L 0 152 Q 60 146 120 149 Q 180 144 235 148 L 248 144 L 248 132 L 254 126 L 260 132 L 260 146 L 275 143 L 286 137 L 292 125 L 302 117 L 312 125 L 312 140 L 324 138 L 330 128 L 336 120 L 344 128 L 344 142 L 358 138 L 364 116 L 368 110 L 374 116 L 374 138 L 382 136 L 386 86 L 392 76 L 398 68 L 400 52 L 402 68 L 408 76 L 414 86 L 418 136 L 426 138 L 426 116 L 432 110 L 436 116 L 442 138 L 456 142 L 464 128 L 470 120 L 476 128 L 482 138 L 494 140 L 494 125 L 504 117 L 514 125 L 520 137 L 531 143 L 546 146 L 546 132 L 552 126 L 558 132 L 558 144 L 571 148 Q 626 144 686 149 Q 746 146 800 152 L 800 160 Z"
              fill="#0A041B"
            />

            {/* Grand Corona High Keep (Central Tower) */}
            <path
              d="M 388 136 L 388 78 L 394 66 L 398 32 L 400 18 L 402 32 L 406 66 L 412 78 L 412 136 Z"
              fill="#0D0524"
            />
            {/* Golden Pennant Flag on Top Spire */}
            <path d="M 400 18 L 400 8 L 407 12 L 400 15" stroke="#FFD166" strokeWidth="1.2" fill="#FFD166" />

            {/* Left Flanking Citadel Spire */}
            <path
              d="M 358 138 L 358 92 L 364 80 L 368 56 L 372 80 L 378 92 L 378 138 Z"
              fill="#0A041B"
            />
            <path d="M 368 56 L 368 46 L 373 49 L 368 52" stroke="#FFD166" strokeWidth="0.9" fill="#FFD166" />

            {/* Right Flanking Citadel Spire */}
            <path
              d="M 422 138 L 422 92 L 428 80 L 432 58 L 436 80 L 442 92 L 442 138 Z"
              fill="#0A041B"
            />
            <path d="M 432 58 L 432 48 L 437 51 L 432 54" stroke="#FFD166" strokeWidth="0.9" fill="#FFD166" />

            {/* Secondary Mid-Towers */}
            <path d="M 334 140 L 334 105 L 340 94 L 344 76 L 348 94 L 354 105 L 354 140 Z" fill="#080317" />
            <path d="M 344 76 L 344 68 L 348 71 L 344 73" stroke="#FFD166" strokeWidth="0.8" fill="#FFD166" />

            <path d="M 446 140 L 446 105 L 452 94 L 456 78 L 460 94 L 466 105 L 466 140 Z" fill="#080317" />
            <path d="M 456 78 L 456 70 L 460 73 L 456 75" stroke="#FFD166" strokeWidth="0.8" fill="#FFD166" />

            {/* Outer Watchtowers */}
            <path d="M 296 142 L 296 112 L 302 102 L 306 90 L 310 102 L 316 112 L 316 142 Z" fill="#070215" />
            <path d="M 484 142 L 484 112 L 490 102 L 494 92 L 498 102 L 504 112 L 504 142 Z" fill="#070215" />

            {/* Grand Arched Water Gate at Castle Base with Radiating Warm Light */}
            <path d="M 386 160 L 386 136 C 386 126, 414 126, 414 136 L 414 160 Z" fill="#FF9E28" fillOpacity="0.9" />
            <path d="M 391 160 L 391 140 C 391 132, 409 132, 409 140 L 409 160 Z" fill="#FFF4AA" />

            {/* Secondary Arched Gateways */}
            <path d="M 342 160 L 342 144 C 342 138, 356 138, 356 144 L 356 160 Z" fill="#FF8E20" fillOpacity="0.8" />
            <path d="M 444 160 L 444 144 C 444 138, 458 138, 458 144 L 458 160 Z" fill="#FF8E20" fillOpacity="0.8" />

            {/* Glowing Castle Windows with Gentle Twinkle */}
            {/* Main Keep Windows */}
            <circle cx="400" cy="52" r="1.8" fill="#FFF099" style={{ animation: 'castleWindowTwinkle 3.2s ease-in-out infinite' }} />
            <circle cx="400" cy="66" r="1.8" fill="#FFDE7A" style={{ animation: 'castleWindowTwinkle 2.8s ease-in-out infinite 0.7s' }} />
            <circle cx="400" cy="80" r="2.0" fill="#FFF099" style={{ animation: 'castleWindowTwinkle 3.5s ease-in-out infinite 1.2s' }} />
            <circle cx="394" cy="94" r="1.7" fill="#FFD460" style={{ animation: 'castleWindowTwinkle 4.1s ease-in-out infinite 0.3s' }} />
            <circle cx="406" cy="94" r="1.7" fill="#FFD460" style={{ animation: 'castleWindowTwinkle 3.9s ease-in-out infinite 1.8s' }} />
            <circle cx="394" cy="110" r="1.7" fill="#FFE27A" style={{ animation: 'castleWindowTwinkle 3.3s ease-in-out infinite 1.0s' }} />
            <circle cx="406" cy="110" r="1.7" fill="#FFE27A" style={{ animation: 'castleWindowTwinkle 3.7s ease-in-out infinite 2.2s' }} />

            {/* Left Tower Windows */}
            <circle cx="368" cy="72" r="1.6" fill="#FFF099" style={{ animation: 'castleWindowTwinkle 3.0s ease-in-out infinite 0.5s' }} />
            <circle cx="368" cy="88" r="1.7" fill="#FFDE7A" style={{ animation: 'castleWindowTwinkle 3.6s ease-in-out infinite 1.4s' }} />
            <circle cx="364" cy="102" r="1.5" fill="#FFD460" style={{ animation: 'castleWindowTwinkle 2.9s ease-in-out infinite 2.1s' }} />

            {/* Right Tower Windows */}
            <circle cx="432" cy="74" r="1.6" fill="#FFF099" style={{ animation: 'castleWindowTwinkle 3.3s ease-in-out infinite 0.9s' }} />
            <circle cx="432" cy="90" r="1.7" fill="#FFDE7A" style={{ animation: 'castleWindowTwinkle 3.8s ease-in-out infinite 1.7s' }} />
            <circle cx="436" cy="104" r="1.5" fill="#FFD460" style={{ animation: 'castleWindowTwinkle 4.0s ease-in-out infinite 0.2s' }} />

            {/* Secondary Towers & Village Lit Windows */}
            <circle cx="344" cy="90" r="1.4" fill="#FFE27A" style={{ animation: 'castleWindowTwinkle 3.4s ease-in-out infinite 0.6s' }} />
            <circle cx="344" cy="108" r="1.5" fill="#FFD050" style={{ animation: 'castleWindowTwinkle 2.7s ease-in-out infinite 1.3s' }} />
            <circle cx="456" cy="92" r="1.4" fill="#FFE27A" style={{ animation: 'castleWindowTwinkle 3.1s ease-in-out infinite 1.1s' }} />
            <circle cx="456" cy="110" r="1.5" fill="#FFD050" style={{ animation: 'castleWindowTwinkle 4.2s ease-in-out infinite 0.4s' }} />

            <circle cx="306" cy="106" r="1.3" fill="#FFE27A" style={{ animation: 'castleWindowTwinkle 3.7s ease-in-out infinite 2.0s' }} />
            <circle cx="494" cy="108" r="1.3" fill="#FFE27A" style={{ animation: 'castleWindowTwinkle 3.5s ease-in-out infinite 1.6s' }} />

            {/* Harbor Promenade String Lanterns along the waterfront */}
            <circle cx="280" cy="143" r="1.6" fill="#FFB733" />
            <circle cx="300" cy="141" r="1.6" fill="#FFB733" />
            <circle cx="320" cy="140" r="1.7" fill="#FFC84D" />
            <circle cx="340" cy="139" r="1.8" fill="#FFD266" />
            <circle cx="360" cy="138" r="1.8" fill="#FFE082" />
            <circle cx="440" cy="138" r="1.8" fill="#FFE082" />
            <circle cx="460" cy="139" r="1.8" fill="#FFD266" />
            <circle cx="480" cy="140" r="1.7" fill="#FFC84D" />
            <circle cx="500" cy="141" r="1.6" fill="#FFB733" />
            <circle cx="520" cy="143" r="1.6" fill="#FF9A26" />
          </svg>
        </div>

        {/* Soft, Seamless Water Reflection extending into bottom */}
        <div
          className="w-full h-[14px] sm:h-[20px] pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(8, 3, 20, 0.95) 0%, rgba(5, 2, 14, 1) 100%)',
          }}
        >
          {/* Glowing Water Reflection of Castle Water Gate */}
          <div
            className="w-36 sm:w-52 mx-auto h-full"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 180, 65, 0.55) 0%, rgba(255, 130, 35, 0.2) 50%, transparent 85%)',
              filter: 'blur(3px)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
