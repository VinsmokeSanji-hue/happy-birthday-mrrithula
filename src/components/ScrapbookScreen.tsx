import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Sparkles, Heart, ArrowRight, Camera, Star } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../data';

interface ScrapbookScreenProps {
  onNext: () => void;
}

export const ScrapbookScreen: React.FC<ScrapbookScreenProps> = ({ onNext }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  
  // Interactive photos state (with default charming illustrations & support for custom photo upload)
  const [photo1, setPhoto1] = useState<string | null>(null);
  const [photo2, setPhoto2] = useState<string | null>(null);
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 }
      )
      .fromTo(
        bookRef.current,
        { opacity: 0, y: 30, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9 },
        '-=0.4'
      )
      .fromTo(
        '.scrap-tile',
        { opacity: 0, y: -18, rotation: () => (Math.random() - 0.5) * 20 },
        { opacity: 1, y: 0, rotation: () => (Math.random() - 0.5) * 8, duration: 0.5, stagger: 0.04, ease: 'back.out(2)' },
        '-=0.5'
      )
      .fromTo(
        ['.scrap-card', '.scrap-photo', '.scrap-cal'],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
        '-=0.3'
      )
      .fromTo(
        '#scrapbook-next-btn',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' },
        '-=0.2'
      );

      // Gentle floating doodles
      gsap.to('.scrap-float', {
        y: -6,
        rotation: 4,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.3,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, slot: 1 | 2) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (slot === 1) setPhoto1(event.target?.result as string);
        else setPhoto2(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calendar setup for November 2026 (or config month)
  const renderCalendar = () => {
    const monthName = BIRTHDAY_CONFIG.birthdayMonth;
    const year = BIRTHDAY_CONFIG.birthdayYear;
    const highlightedDay = BIRTHDAY_CONFIG.birthdayDay;
    
    // Month details: Nov 2026 starts on Sunday (index 0)
    const daysInMonth = 30;
    const startDayOffset = 0; // Nov 1 2026 is Sunday

    const days = [];
    for (let i = 0; i < startDayOffset; i++) {
      days.push(<span key={`empty-${i}`} className="h-6" />);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const isBirthday = d === highlightedDay;
      days.push(
        <span
          key={`day-${d}`}
          className={`h-6 sm:h-7 flex items-center justify-center text-xs font-serif rounded-full transition-transform ${
            isBirthday
              ? 'bg-[#d94f78] text-white font-bold shadow-xs scale-110 ring-2 ring-pink-300 ring-offset-1'
              : 'text-[#4a2e3b] hover:bg-pink-100/50'
          }`}
        >
          {d}
        </span>
      );
    }

    return (
      <div className="scrap-cal relative p-3 sm:p-4 bg-[#fffdf5] rounded-xl border border-[#d98ba0]/40 shadow-sm transform rotate-1 hover:rotate-0 transition-transform duration-300">
        <div className="flex items-baseline justify-between mb-2 pb-1 border-b border-pink-200 text-[#8e3f5d]">
          <span className="font-handwriting text-xl sm:text-2xl font-bold tracking-wide">{monthName}</span>
          <span className="text-xs font-serif font-bold text-pink-500">{year}</span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[10px] font-bold text-pink-400">
          <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {days}
        </div>
        <div className="mt-2 text-center text-[11px] font-handwriting text-[#9c4763] font-bold">
          🎂 Special Birthday Day!
        </div>
      </div>
    );
  };

  const titleLetters = ['H','A','P','P','Y',' ','B','I','R','T','H','D','A','Y'];

  return (
    <div
      ref={containerRef}
      id="screen-scrapbook"
      style={{
        background: 'linear-gradient(135deg, #FFE0DE 0%, #FFE9DE 50%, #F8D4D4 100%)',
      }}
      className="relative w-full min-h-[100dvh] overflow-y-auto overflow-x-hidden py-8 sm:py-12 px-3 sm:px-6 flex flex-col items-center justify-start select-none text-[#4A3B52]"
    >
      {/* Decorative Corner Accents */}
      <div className="absolute top-6 left-6 border-l border-t border-[#4A3B52] w-10 sm:w-14 h-10 sm:h-14 opacity-25 pointer-events-none" />
      <div className="absolute top-8 left-8 sans-subtitle text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#4A3B52] opacity-45 pointer-events-none font-medium">
        Memories & Moments
      </div>

      <div className="absolute bottom-6 right-6 border-r border-b border-[#4A3B52] w-10 sm:w-14 h-10 sm:h-14 opacity-25 pointer-events-none" />

      {/* Main Physical Scrapbook Container */}
      <div
        ref={bookRef}
        id="scrapbook-card"
        className="relative w-full max-w-[500px] bg-[#FFF9F7]/92 backdrop-blur-xs rounded-3xl p-5 sm:p-7 organic-card-shadow border border-[#E8CECA] my-auto"
      >
        {/* Top Header Row with Wish Tag */}
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className="scrap-float inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FAF5FF] text-[#6D5A75] sans-subtitle text-xs tracking-wider uppercase font-semibold rounded-full border border-[#D8BFD8] shadow-xs">
            <span>Make a wish</span>
            <Sparkles className="w-3.5 h-3.5 text-[#9C6CC9]" />
          </div>
          <div className="scrap-float text-3xl transform rotate-6 filter drop-shadow-xs">
            🌸
          </div>
        </div>

        {/* Cutout Title: "HAPPY BIRTHDAY" */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 my-2 sm:my-3">
          {titleLetters.map((char, index) => {
            if (char === ' ') {
              return <div key={`space-${index}`} className="w-full h-1" />;
            }
            const colors = [
              'bg-[#F3E5F5] text-[#4A3B52] border-[#D8BFD8]',
              'bg-[#FFF0F7] text-[#6D5A75] border-[#F4A7C0]',
              'bg-[#E8D5FF] text-[#4A3B52] border-[#C4A6C4]',
              'bg-[#FAF5FF] text-[#552C80] border-[#D1B3FF]',
              'bg-[#E6E6FA] text-[#4A3B52] border-[#B9B9E8]',
            ];
            const colorClass = colors[index % colors.length];

            return (
              <span
                key={`tile-${index}`}
                className={`scrap-tile inline-flex items-center justify-center w-7 h-8 sm:w-8 sm:h-9 rounded-lg font-serif-title font-bold text-lg sm:text-xl shadow-xs border ${colorClass}`}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Washi Tape Strip */}
        <div className="w-24 h-3.5 mx-auto my-3 rounded-full washi-tape-pink opacity-80 transform rotate-1" />

        {/* Scrapbook Personal Greeting Note */}
        <div className="scrap-card relative p-4 sm:p-5 bg-[#FFF9FA]/90 rounded-2xl border-2 border-dashed border-[#F0BCD0] shadow-xs my-3 sm:my-4">
          <div className="font-serif-title text-sm sm:text-[15px] text-[#4A3B52] leading-[1.8] sm:leading-[1.85]">
            <div
              dangerouslySetInnerHTML={{ __html: BIRTHDAY_CONFIG.scrapbookGreeting }}
            />
          </div>
          <div className="scrap-float absolute -bottom-3 -right-2 bg-white text-[#6D5A75] border border-[#F0BCD0] sans-subtitle px-3 py-0.5 rounded-full text-xs tracking-wider uppercase font-semibold shadow-xs">
            {BIRTHDAY_CONFIG.scrapbookSpecialTag}
          </div>
        </div>

        {/* Scrapbook Grid: Photo Slot 1 + Calendar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-4 items-start">
          {/* Photo Slot 1 */}
          <div className="scrap-photo relative flex flex-col items-center">
            <div
              onClick={() => fileInputRef1.current?.click()}
              className="taped-photo w-full aspect-4/3 bg-white p-2.5 rounded-xl shadow-xs border border-[#E8D5FF] cursor-pointer hover:shadow-md transition-all group transform -rotate-1 hover:rotate-0"
            >
              <input
                ref={fileInputRef1}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 1)}
              />
              <div className="w-full h-full bg-[#FAF5FF] rounded-lg flex flex-col items-center justify-center overflow-hidden border border-[#D8BFD8]/60 relative">
                {photo1 ? (
                  <img src={photo1} alt="Birthday Memory 1" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2">
                    <div className="w-9 h-9 mx-auto rounded-full bg-[#E8D5FF] flex items-center justify-center text-[#6D5A75] mb-1 group-hover:scale-110 transition-transform">
                      <Camera className="w-4 h-4" />
                    </div>
                    <span className="sans-subtitle text-xs font-medium text-[#4A3B52] block">
                      Add a photo ♡
                    </span>
                    <span className="text-[10px] text-[#8A7394]">tap to upload</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Handcrafted Calendar */}
          <div className="w-full">
            {renderCalendar()}
          </div>
        </div>

        {/* Photo Slot 2 (Optional Memory Card) */}
        <div className="scrap-photo relative my-2">
          <div
            onClick={() => fileInputRef2.current?.click()}
            className="taped-photo w-full max-w-[290px] mx-auto aspect-16/9 bg-white p-2.5 rounded-xl shadow-xs border border-[#E8D5FF] cursor-pointer hover:shadow-md transition-all group transform rotate-1 hover:rotate-0"
          >
            <input
              ref={fileInputRef2}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 2)}
            />
            <div className="w-full h-full bg-[#FAF5FF] rounded-lg flex items-center justify-center overflow-hidden border border-[#D8BFD8]/60 relative">
              {photo2 ? (
                <img src={photo2} alt="Birthday Memory 2" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center gap-2 text-[#6D5A75]">
                  <Star className="w-4 h-4 text-[#D8BFD8] fill-[#D8BFD8]" />
                  <span className="font-serif-title italic text-sm">
                    A special memory for Mrrithula ✨
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="mt-6 flex justify-end">
          <button
            id="scrapbook-next-btn"
            type="button"
            onClick={onNext}
            className="sans-subtitle group px-6 py-3 bg-white text-[#6D5A75] border border-[#D8BFD8] hover:bg-[#F3E5F5] active:scale-95 text-sm font-medium tracking-wider uppercase rounded-full organic-btn-shadow transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <span>Read Letter</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
