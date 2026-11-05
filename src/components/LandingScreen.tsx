import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { BIRTHDAY_CONFIG } from '../data';
import { TangledLanternSky } from './TangledLanternSky';

interface LandingScreenProps {
  onYes: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onYes }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  
  const [noCount, setNoCount] = useState(0);
  const [noButtonPosition, setNoButtonPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Smooth cinematic entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.1 }
      )
      .fromTo(
        headingRef.current,
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.0 },
        '-=0.6'
      )
      .fromTo(
        buttonsRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 1.0 },
        '-=0.5'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleNoHover = () => {
    // Playful dodge when hovered or tapped
    const randomX = (Math.random() - 0.5) * 160;
    const randomY = (Math.random() - 0.5) * 70;
    setNoButtonPosition({ x: randomX, y: randomY });
    setNoCount((prev) => prev + 1);
  };

  const getNoMessage = () => {
    if (noCount === 0) return 'No';
    if (noCount === 1) return 'Are you sure? 🥺';
    if (noCount === 2) return 'Think again! ✨';
    if (noCount === 3) return 'Please say yes! 🌸';
    return 'Click Yes! ♡';
  };

  return (
    <div
      ref={containerRef}
      id="screen-landing"
      className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden text-center select-none"
      style={{
        background: 'linear-gradient(180deg, #050616 0%, #0c0f2d 24%, #1c1240 52%, #2f144b 76%, #45174e 90%, #561a49 100%)',
      }}
    >
      {/* Real Animated HTML/SVG Floating Sky Lanterns, Starfield, Distant Castle & Lake Environment */}
      <TangledLanternSky />

      {/* Decorative Golden Corner Frames matching Reference Image */}
      {/* Top Left: SPECIAL DELIVERY ♡ */}
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8 pointer-events-none z-20">
        <div className="relative pl-3 pt-2 pb-1 pr-3">
          {/* Outer corner bracket */}
          <div className="absolute top-0 left-0 border-l border-t border-[#FFE4A0] w-12 sm:w-16 h-12 sm:h-16 opacity-45" />
          {/* Inner corner bracket */}
          <div className="absolute top-1.5 left-1.5 border-l border-t border-[#FFE4A0] w-9 sm:w-12 h-9 sm:h-12 opacity-25" />
          <span className="sans-subtitle text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-[#FFEAA7] opacity-75 font-medium flex items-center gap-1.5">
            SPECIAL DELIVERY <span className="text-[9px] text-[#FFA834]">♡</span>
          </span>
        </div>
      </div>

      {/* Main Centered Content (Completely Unboxed, letting background & lanterns shine through) */}
      <main className="relative z-20 w-full max-w-xl mx-auto px-5 py-4 flex flex-col items-center justify-center text-center -translate-y-2 sm:-translate-y-4">
        {/* Main Heading with Tangled Golden Warmth & Script Calligraphy */}
        <h1
          ref={headingRef}
          id="landing-heading"
          className="tracking-tight leading-[1.14] flex flex-col items-center justify-center text-center"
        >
          <span
            className="font-serif-title font-medium text-[#FFFDF8] block"
            style={{
              fontSize: 'clamp(28px, 7.5vw, 42px)',
              textShadow: '0 0 20px rgba(255, 215, 120, 0.45), 0 0 45px rgba(255, 160, 50, 0.25)',
            }}
          >
            Happy Birthday,
          </span>
          <span
            className="font-script font-medium text-[#FFECC0] mt-1 sm:mt-1.5 flex items-center justify-center gap-2 sm:gap-3"
            style={{
              fontSize: 'clamp(38px, 11vw, 62px)',
              textShadow: '0 0 24px rgba(255, 210, 100, 0.6), 0 0 55px rgba(255, 140, 40, 0.35)',
            }}
          >
            <span className="text-[#FFD269] text-xl sm:text-2xl font-light opacity-85">✦</span>
            <span className="relative inline-block">
              {BIRTHDAY_CONFIG.herName}
              <span
                className="absolute font-script text-[#FFD0A0] italic pointer-events-none"
                style={{
                  fontSize: 'clamp(11px, 2.2vw, 16px)',
                  right: 0,
                  top: '100%',
                  lineHeight: 1.1,
                  textShadow: '0 0 12px rgba(255, 180, 80, 0.5)',
                  marginTop: '-2px',
                }}
              >
                my love
              </span>
            </span>
            <span className="text-[#FFD269] text-xl sm:text-2xl font-light opacity-85">✦</span>
          </span>
        </h1>

        {/* Subtitle & Romantic Question with Soft Warm Glow */}
        <div
          ref={subtitleRef}
          id="landing-subtitle"
          className="flex flex-col items-center mt-3 sm:mt-4 mb-6 sm:mb-8 max-w-xs sm:max-w-md text-center"
        >
          <p
            className="font-serif-title italic text-[#FDF0E2] opacity-95 text-[15px] sm:text-[18px] leading-relaxed"
            style={{
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.65), 0 0 20px rgba(255, 220, 150, 0.2)',
            }}
          >
            {BIRTHDAY_CONFIG.landingSubtitle}
          </p>
          
          {/* Delicate Divider — ♡ — */}
          <div className="flex items-center justify-center gap-2.5 mt-2.5 opacity-70 text-[#FFE4A0] text-xs">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#FFE4A0]" />
            <span className="text-[#FFB86C] text-[10px]">♡</span>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#FFE4A0]" />
          </div>

          <p
            className="sans-subtitle text-[12px] sm:text-[13px] tracking-widest uppercase text-[#FFE5B4] opacity-85 mt-2 font-normal flex items-center gap-1.5"
            style={{ textShadow: '0 1px 10px rgba(0, 0, 0, 0.6)' }}
          >
            Will you be a part of it? <span className="text-[#FFD269]">✦</span>
          </p>
        </div>

        {/* Interaction Buttons with Playful Curved Dashed Arrow */}
        <div className="relative w-full max-w-xs sm:max-w-sm flex items-center justify-center">
          {/* Curved Dashed Golden Arrow pointing towards No button (from reference image) */}
          <div className="absolute -top-7 right-2 sm:right-4 pointer-events-none opacity-70 hidden xs:block">
            <svg width="55" height="42" viewBox="0 0 60 48" fill="none">
              <path
                d="M 6 10 C 28 2, 54 10, 52 34 C 50 40, 42 42, 28 42"
                stroke="#FFE28A"
                strokeWidth="1.5"
                strokeDasharray="3 3.5"
                strokeLinecap="round"
              />
              <path
                d="M 33 37 L 26 42 L 33 47"
                stroke="#FFE28A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div
            ref={buttonsRef}
            id="landing-buttons"
            className="flex flex-row items-center justify-center gap-5 sm:gap-6 w-full"
          >
            {/* YES BUTTON - Warm golden/cream button with luminous inner glow */}
            <button
              id="landing-yes-button"
              type="button"
              onClick={onYes}
              className="sans-subtitle bg-gradient-to-r from-[#FFE8A3] via-[#FFCA5C] to-[#FFA734] text-[#2C1318] px-8 sm:px-11 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-semibold tracking-wider hover:brightness-105 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-[0_0_26px_rgba(255,190,65,0.55)] hover:shadow-[0_0_36px_rgba(255,215,100,0.75)] flex items-center justify-center gap-2 border border-[#FFF5D0]/60"
            >
              <span>Yes</span>
              <span className="text-[#FF6F00] text-xs">✦</span>
            </button>

            {/* NO BUTTON - Semi-transparent dark purple background with delicate golden border & playful dodge */}
            <button
              id="landing-no-button"
              type="button"
              onMouseEnter={handleNoHover}
              onTouchStart={handleNoHover}
              onClick={handleNoHover}
              style={{
                transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`,
                transition: 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              className="sans-subtitle bg-[#2A1238]/50 backdrop-blur-xs border border-[#FFE4A0]/35 text-[#FFECC0]/90 hover:text-[#FFECC0] hover:bg-[#FFE4A0]/15 px-6 sm:px-9 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-light tracking-wider transition-all duration-150 cursor-pointer"
            >
              {getNoMessage()}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
