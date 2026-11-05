import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { BIRTHDAY_CONFIG } from '../data';

interface FinalScreenProps {
  onRestart?: () => void;
}

export const FinalScreen: React.FC<FinalScreenProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.9 }
      )
      .fromTo(
        collageRef.current,
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo(
        '.final-card-item',
        { opacity: 0, y: 18, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.5)' },
        '-=0.4'
      );

      // Subtle float for collage stickers
      gsap.to('.final-float', {
        y: -5,
        rotation: 3,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.25,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      id="screen-final"
      className="relative w-full min-h-[100dvh] bg-gradient-to-b from-[#FDF0FF] via-[#F8F4FF] to-[#E8D5FF] text-[#4A3B52] py-8 sm:py-12 px-3 sm:px-6 overflow-y-auto overflow-x-hidden flex flex-col items-center justify-start select-none"
    >
      {/* Decorative Corner Accents */}
      <div className="absolute top-6 left-6 border-l border-t border-[#4A3B52] w-10 sm:w-14 h-10 sm:h-14 opacity-25 pointer-events-none" />
      <div className="absolute top-8 left-8 sans-subtitle text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#4A3B52] opacity-45 pointer-events-none font-medium">
        Celebration
      </div>

      <div className="absolute bottom-6 right-6 border-r border-b border-[#4A3B52] w-10 sm:w-14 h-10 sm:h-14 opacity-25 pointer-events-none" />

      {/* Floating Organic Petals */}
      <div className="absolute top-1/4 right-8 pointer-events-none opacity-40">
        <svg width="40" height="40" viewBox="0 0 100 100" fill="#D8BFD8">
          <path d="M50 0 C60 30 90 40 100 50 C90 60 60 70 50 100 C40 70 10 60 0 50 C10 40 40 30 50 0" />
        </svg>
      </div>

      {/* Main Collage Card */}
      <div
        ref={collageRef}
        id="final-collage-card"
        className="relative w-full max-w-[480px] bg-white/95 backdrop-blur-xs rounded-3xl p-6 sm:p-8 organic-card-shadow border border-[#D8BFD8] my-auto"
      >
        {/* Top Mini Note: Card 1 */}
        <div className="flex items-start justify-between mb-3.5">
          <div className="final-card-item relative p-3 sm:p-3.5 bg-[#FAF5FF] rounded-2xl border border-[#D8BFD8] shadow-xs transform -rotate-2 max-w-[200px] text-center">
            <p className="sans-subtitle text-[11px] sm:text-xs text-[#8A7394] font-medium tracking-wide mb-1">
              tiny reminder ♡
            </p>
            <p className="font-serif-title italic text-xs sm:text-sm text-[#4A3B52] font-medium leading-snug">
              you're pretty<br />
              special, you know?
            </p>
          </div>

          <div className="final-float text-3xl transform rotate-6 filter drop-shadow-xs">
            🌸 ✦
          </div>
        </div>

        {/* Center Main Note */}
        <div className="final-card-item relative my-3 sm:my-4 p-4 sm:p-5 bg-[#FAF5FF] text-[#4A3B52] rounded-2xl organic-card-shadow border border-[#D8BFD8] transform rotate-1">
          <div className="w-16 h-3.5 mx-auto mb-3 rounded-full washi-tape-pink opacity-80 transform -rotate-1" />
          <p className="font-serif-title italic text-sm sm:text-base text-[#4A3B52] leading-relaxed text-center font-medium">
            “And that's a little reminder<br />
            that you're pretty special.<br />
            So keep smiling, keep being you,<br />
            and please don't become<br />
            too responsible…<br />
            you're already cute enough.” <span className="not-italic text-[#C282B5]">♡</span>
          </p>
          <p className="mt-3 pt-2.5 border-t border-[#E8D5FF]/60 text-xs sm:text-sm text-[#7D6B84] leading-relaxed text-center font-normal">
            I hope this little surprise<br />
            made your day a tiny bit brighter.
          </p>
        </div>

        {/* Side captions collage items: Card 2 & Card 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3 sm:my-4">
          {/* Card 2 */}
          <div className="final-card-item p-3.5 sm:p-4 bg-white rounded-xl border border-[#E8D5FF] shadow-xs transform -rotate-1">
            <p className="sans-subtitle text-[11px] sm:text-xs text-[#8A7394] font-medium tracking-wide mb-1">
              remember this:
            </p>
            <p className="font-serif-title italic text-xs sm:text-sm text-[#4A3B52] font-medium leading-snug">
              you deserve<br />
              beautiful things ♡
            </p>
          </div>

          {/* Card 3 */}
          <div className="final-card-item p-3.5 sm:p-4 bg-white rounded-xl border border-[#E8D5FF] shadow-xs transform rotate-1">
            <p className="font-serif-title text-xs sm:text-sm text-[#4A3B52] font-medium leading-snug">
              don't forget to smile,<br />
              you look more beautiful<br />
              when you smile.
            </p>
            <p className="mt-2 text-[11px] sm:text-xs text-[#8A7394] italic font-serif-title">
              (you're always beautiful ♡)
            </p>
          </div>
        </div>

        {/* Date and Love Signature Badge */}
        <div className="flex items-center justify-between mt-5 pt-3 border-t border-[#E8D5FF]">
          <div className="text-xs text-[#6D5A75] font-serif-title">
            <span>For </span>
            <span className="relative inline-block">
              <strong className="text-[#4A3B52] font-serif-title italic text-base font-bold">
                {BIRTHDAY_CONFIG.herName}
              </strong>
              <span
                className="absolute font-script text-[#8A6070] italic pointer-events-none"
                style={{
                  fontSize: '11px',
                  right: 0,
                  top: '100%',
                  lineHeight: 1.1,
                  marginTop: '1px',
                  whiteSpace: 'nowrap',
                }}
              >
                my love
              </span>
            </span>
          </div>
          <div className="text-xs sans-subtitle uppercase tracking-widest text-[#8A7394]">
            {BIRTHDAY_CONFIG.finalDateLabel}
          </div>
        </div>
      </div>
    </div>
  );
};
