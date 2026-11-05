import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../data';

interface LetterScreenProps {
  onNext: () => void;
}

export const LetterScreen: React.FC<LetterScreenProps> = ({ onNext }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const envelopeWrapRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const paperSheetRef = useRef<HTMLDivElement>(null);
  const waxSealRef = useRef<HTMLDivElement>(null);
  const letterModalRef = useRef<HTMLDivElement>(null);
  const continueBtnRef = useRef<HTMLButtonElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isLetterVisible, setIsLetterVisible] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Smooth subtle entrance of envelope
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.9, ease: 'power2.out' }
      );

      gsap.fromTo(
        envelopeWrapRef.current,
        { opacity: 0, y: 28, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out', delay: 0.15 }
      );

      // Gentle floating pulse for envelope
      gsap.to(envelopeWrapRef.current, {
        y: -5,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleOpenEnvelope = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        setIsOpen(true);
        setIsLetterVisible(true);
        animateLetterContent();
      },
    });

    // 1. Envelope lifts gently and seal cracks/fades
    tl.to(envelopeWrapRef.current, {
      y: -15,
      scale: 1.02,
      duration: 0.35,
      ease: 'power2.out',
    })
    .to(
      waxSealRef.current,
      {
        scale: 1.25,
        opacity: 0,
        duration: 0.28,
      },
      '-=0.2'
    )
    // 2. Flap opens smoothly using 3D perspective fold
    .to(
      flapRef.current,
      {
        rotateX: 180,
        duration: 0.55,
        transformOrigin: 'top center',
        ease: 'power2.inOut',
      },
      '-=0.15'
    )
    // 3. Paper begins emerging from envelope pocket
    .to(
      paperSheetRef.current,
      {
        y: -140,
        scale: 1.05,
        duration: 0.65,
        ease: 'power2.out',
      },
      '-=0.25'
    )
    // 4. Subtle sparkles glint
    .fromTo(
      '.letter-sparkle',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 0.8, duration: 0.4, stagger: 0.08, ease: 'back.out(2)' },
      '-=0.3'
    );
  };

  const animateLetterContent = () => {
    // Show full reading card with staggered fades
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.fromTo(
      letterModalRef.current,
      { opacity: 0, scale: 0.94, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
    .fromTo(
      '.letter-line-1',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.3'
    )
    .fromTo(
      '.letter-line-2',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.3'
    )
    .fromTo(
      '.letter-line-3',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.3'
    )
    .fromTo(
      '.letter-line-4',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.3'
    )
    .fromTo(
      continueBtnRef.current,
      { opacity: 0, y: 16, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
      '+=0.1'
    );
  };

  return (
    <div
      ref={containerRef}
      id="screen-letter"
      className="relative w-full min-h-[100dvh] h-[100dvh] flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-[#FDF0FF] via-[#F8F4FF] to-[#E8D5FF] text-[#4A3B52] overflow-y-auto overflow-x-hidden select-none"
    >
      {/* Decorative Corner Accents */}
      <div className="absolute top-6 left-6 border-l border-t border-[#4A3B52] w-10 sm:w-14 h-10 sm:h-14 opacity-25 pointer-events-none" />
      <div className="absolute top-8 left-8 sans-subtitle text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#4A3B52] opacity-45 pointer-events-none font-medium">
        Personal Note
      </div>

      <div className="absolute bottom-6 right-6 border-r border-b border-[#4A3B52] w-10 sm:w-14 h-10 sm:h-14 opacity-25 pointer-events-none" />
      
      {/* Floating Organic Petals in background */}
      <div className="absolute top-1/4 right-10 pointer-events-none opacity-40">
        <svg width="36" height="36" viewBox="0 0 100 100" fill="#D8BFD8">
          <path d="M50 0 C60 30 90 40 100 50 C90 60 60 70 50 100 C40 70 10 60 0 50 C10 40 40 30 50 0" />
        </svg>
      </div>

      {/* Sparkles around envelope */}
      <div className="letter-sparkle absolute text-[#9C6CC9] opacity-0 pointer-events-none top-1/4 left-1/4">
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="letter-sparkle absolute text-[#D8BFD8] opacity-0 pointer-events-none top-1/3 right-1/4">
        <Sparkles className="w-4 h-4" />
      </div>

      {!isLetterVisible ? (
        /* Envelope Initial Presentation */
        <div className="flex flex-col items-center justify-center z-10 w-full max-w-sm my-auto">
          {/* Header Title */}
          <div className="text-center mb-6">
            <h2 className="font-serif-title text-2xl sm:text-3xl text-[#4A3B52] font-semibold tracking-wide flex items-center justify-center gap-2">
              <span>{BIRTHDAY_CONFIG.letterTitle}</span>
            </h2>
            <p className="font-serif-title italic text-base sm:text-lg text-[#6D5A75] opacity-80 mt-1">
              A quiet message from the heart
            </p>
          </div>

          {/* Interactive 3D Envelope */}
          <div
            ref={envelopeWrapRef}
            onClick={handleOpenEnvelope}
            className="relative w-[280px] sm:w-[320px] h-[190px] sm:h-[210px] cursor-pointer group transition-transform duration-300 active:scale-98"
            style={{ perspective: 1000 }}
          >
            {/* Envelope Back Body */}
            <div className="absolute inset-0 bg-[#FAF5FF] rounded-2xl border border-[#D8BFD8] organic-card-shadow overflow-visible">
              {/* Paper Sheet emerging during animation */}
              <div
                ref={paperSheetRef}
                className="absolute inset-x-3 top-2 bottom-3 bg-white rounded-xl border border-[#E8D5FF] shadow-xs p-4 flex flex-col items-center justify-center text-center opacity-90 z-0"
              >
                <div className="w-12 h-1 bg-[#D8BFD8]/70 rounded mb-2" />
                <div className="w-20 h-1 bg-[#D8BFD8]/50 rounded" />
              </div>

              {/* Envelope Pocket Left/Right/Bottom Fold (SVG) */}
              <svg
                viewBox="0 0 320 210"
                className="absolute inset-0 w-full h-full z-10 pointer-events-none drop-shadow-xs"
                preserveAspectRatio="none"
              >
                {/* Left Triangle */}
                <polygon points="0,0 0,210 160,115" fill="#FAF4FD" stroke="#D8BFD8" strokeWidth="0.8" />
                {/* Right Triangle */}
                <polygon points="320,0 320,210 160,115" fill="#F6EFFB" stroke="#D8BFD8" strokeWidth="0.8" />
                {/* Bottom Triangle */}
                <polygon points="0,210 320,210 160,105" fill="#FAF5FF" stroke="#D8BFD8" strokeWidth="0.8" />
              </svg>

              {/* Envelope Flap (Top triangle that folds open) */}
              <div
                ref={flapRef}
                className="absolute top-0 left-0 right-0 h-[110px] z-20"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <svg
                  viewBox="0 0 320 110"
                  className="w-full h-full drop-shadow-xs"
                  preserveAspectRatio="none"
                >
                  <polygon
                    points="0,0 320,0 160,110"
                    fill="#F2E5F6"
                    stroke="#D8BFD8"
                    strokeWidth="1"
                  />
                </svg>
              </div>

              {/* Handwritten Address on Envelope Front */}
              <div className="absolute bottom-5 left-6 z-15 pointer-events-none font-serif-title italic text-lg sm:text-xl text-[#6D5A75] font-semibold tracking-wide transform -rotate-2">
                For Mrrithula ♡
              </div>

              {/* Wax Seal / Heart Stamp at center of flap */}
              <div
                ref={waxSealRef}
                className="absolute top-[88px] sm:top-[98px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white shadow-md border border-[#D8BFD8] flex items-center justify-center group-hover:scale-110 transition-transform"
              >
                <Heart className="w-4 h-4 text-[#8A7394] fill-[#D8BFD8]" />
              </div>
            </div>
          </div>

          {/* Tap to Open Hint */}
          <div className="mt-8 text-center animate-pulse">
            <span className="sans-subtitle text-xs tracking-widest uppercase text-[#6D5A75] font-medium">
              ✦ tap to open ✦
            </span>
          </div>
        </div>
      ) : (
        /* Full Letter Card Experience */
        <div
          ref={letterModalRef}
          className="relative w-full max-w-[480px] bg-white/95 backdrop-blur-xs rounded-3xl p-6 sm:p-9 organic-card-shadow border border-[#D8BFD8] my-auto flex flex-col z-20"
        >
          {/* Delicate Top Accent */}
          <div className="flex items-center justify-between border-b border-[#E8D5FF] pb-3 mb-5">
            <div className="flex items-center gap-1.5 sans-subtitle text-xs uppercase tracking-widest text-[#6D5A75] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#9C6CC9]" />
              <span>Personal Letter</span>
            </div>
            <span className="font-serif-title italic text-sm sm:text-base text-[#4A3B52] font-semibold">
              For Mrrithula ♡
            </span>
          </div>

          {/* Letter Title */}
          <h2 className="letter-line-1 font-serif-title text-2xl sm:text-3xl text-[#4A3B52] font-bold mb-4">
            {BIRTHDAY_CONFIG.letterTitle}
          </h2>

          {/* Letter Body: Preserving original exact text */}
          <div className="space-y-4 font-serif-title text-sm sm:text-base text-[#4A3B52] leading-relaxed">
            <p className="letter-line-2 font-bold text-[#4A3B52]">
              {BIRTHDAY_CONFIG.letterGreeting}
            </p>
            <p className="letter-line-3 text-[#6D5A75] font-normal leading-relaxed">
              {BIRTHDAY_CONFIG.letterParagraph1}
            </p>
            <p className="letter-line-4 text-[#6D5A75] font-normal leading-relaxed">
              {BIRTHDAY_CONFIG.letterParagraph2}
            </p>
            <p className="letter-line-4 pt-2 font-serif-title italic text-lg sm:text-xl text-[#4A3B52] font-semibold">
              {BIRTHDAY_CONFIG.letterSignoff}
            </p>
          </div>

          {/* Continue Button */}
          <div className="mt-8 pt-4 border-t border-[#E8D5FF] flex justify-end">
            <button
              ref={continueBtnRef}
              id="letter-continue-btn"
              type="button"
              onClick={onNext}
              className="sans-subtitle group px-7 py-3 bg-white text-[#6D5A75] border border-[#D8BFD8] hover:bg-[#F3E5F5] active:scale-95 text-sm font-medium tracking-wider uppercase rounded-full organic-btn-shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
