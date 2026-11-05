import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Sparkles, ArrowRight, Camera, Star, Loader2, AlertCircle } from 'lucide-react';
import { BIRTHDAY_CONFIG } from '../data';

interface ScrapbookScreenProps {
  onNext: () => void;
}

export const ScrapbookScreen: React.FC<ScrapbookScreenProps> = ({ onNext }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);

  // Cloud-synced photos state
  const [photo1, setPhoto1] = useState<string | null>(null);
  const [photo2, setPhoto2] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [uploadingSlot, setUploadingSlot] = useState<1 | 2 | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  // Fetch persisted images from Supabase Storage via backend on mount
  useEffect(() => {
    let isMounted = true;

    async function loadCloudPhotos() {
      try {
        const res = await fetch('/api/photos');
        if (!res.ok) {
          throw new Error(`Failed to load photos (status ${res.status})`);
        }
        const data = await res.json();
        if (data.success && isMounted) {
          if (data.photos?.polaroid) {
            setPhoto1(data.photos.polaroid);
          }
          if (data.photos?.['special-memory']) {
            setPhoto2(data.photos['special-memory']);
          }
        }
      } catch (err) {
        console.warn('[Scrapbook] Cloud photo retrieval notice:', err);
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    }

    loadCloudPhotos();

    return () => {
      isMounted = false;
    };
  }, []);

  // GSAP Animations
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

  // Handle uploading image to Supabase Storage via backend API
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, slot: 1 | 2) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so re-selecting the exact same file also triggers onChange
    e.target.value = '';

    // Frontend validation
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WEBP, GIF).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size is too large. Please select a photo under 10MB.');
      return;
    }

    setErrorMessage(null);
    setUploadingSlot(slot);

    // Create an instant local preview while uploading to cloud
    const localPreviewUrl = URL.createObjectURL(file);
    if (slot === 1) setPhoto1(localPreviewUrl);
    else setPhoto2(localPreviewUrl);

    try {
      const formData = new FormData();
      formData.append('slot', slot === 1 ? 'polaroid' : 'special-memory');
      formData.append('image', file);

      const res = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save photo to cloud storage.');
      }

      // Update with the permanent cloud URL from Supabase
      if (slot === 1) {
        setPhoto1(data.url);
      } else {
        setPhoto2(data.url);
      }
    } catch (err: any) {
      console.error('[Upload error]', err);
      setErrorMessage(err.message || 'Could not upload photo. Please verify cloud credentials.');
    } finally {
      setUploadingSlot(null);
    }
  };

  // Calendar setup for config month/year
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

  const titleLetters = ['H', 'A', 'P', 'P', 'Y', ' ', 'B', 'I', 'R', 'T', 'H', 'D', 'A', 'Y'];

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
        {/* Error notification banner if cloud upload or fetch failed */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50/95 border border-red-200 rounded-xl flex items-center justify-between text-xs text-red-700 animate-fadeIn shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="ml-2 font-bold hover:text-red-900 cursor-pointer text-sm"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

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
            <div dangerouslySetInnerHTML={{ __html: BIRTHDAY_CONFIG.scrapbookGreeting }} />
          </div>
          <div className="scrap-float absolute -bottom-3 -right-2 bg-white text-[#6D5A75] border border-[#F0BCD0] sans-subtitle px-3 py-0.5 rounded-full text-xs tracking-wider uppercase font-semibold shadow-xs">
            {BIRTHDAY_CONFIG.scrapbookSpecialTag}
          </div>
        </div>

        {/* Scrapbook Grid: Photo Slot 1 + Calendar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-4 items-start">
          {/* Photo Slot 1 (Polaroid card) */}
          <div className="scrap-photo relative flex flex-col items-center">
            <div
              onClick={() => fileInputRef1.current?.click()}
              className="taped-photo w-full aspect-4/3 bg-white p-2.5 rounded-xl shadow-xs border border-[#E8D5FF] cursor-pointer hover:shadow-md transition-all group transform -rotate-1 hover:rotate-0 relative overflow-hidden"
            >
              <input
                ref={fileInputRef1}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingSlot === 1}
                onChange={(e) => handleFileUpload(e, 1)}
              />
              <div className="w-full h-full bg-[#FAF5FF] rounded-lg flex flex-col items-center justify-center overflow-hidden border border-[#D8BFD8]/60 relative">
                {initialLoading && !photo1 ? (
                  <div className="flex flex-col items-center justify-center p-2 text-[#8A7394]">
                    <Loader2 className="w-5 h-5 animate-spin text-[#9C6CC9] mb-1" />
                    <span className="text-[10px]">Loading photo...</span>
                  </div>
                ) : photo1 ? (
                  <>
                    <img src={photo1} alt="Birthday Memory 1" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-medium gap-1 backdrop-blur-[1px]">
                      <Camera className="w-4 h-4" />
                      <span>Change photo ♡</span>
                    </div>
                  </>
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

                {/* Uploading Spinner Overlay */}
                {uploadingSlot === 1 && (
                  <div className="absolute inset-0 bg-[#FAF5FF]/90 backdrop-blur-xs flex flex-col items-center justify-center z-20">
                    <Loader2 className="w-6 h-6 animate-spin text-[#9C6CC9] mb-1" />
                    <span className="text-[11px] font-medium text-[#6D5A75]">Saving to cloud...</span>
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

        {/* Photo Slot 2 (Special Memory Card) */}
        <div className="scrap-photo relative my-2">
          <div
            onClick={() => fileInputRef2.current?.click()}
            className="taped-photo w-full max-w-[290px] mx-auto aspect-16/9 bg-white p-2.5 rounded-xl shadow-xs border border-[#E8D5FF] cursor-pointer hover:shadow-md transition-all group transform rotate-1 hover:rotate-0 relative overflow-hidden"
          >
            <input
              ref={fileInputRef2}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingSlot === 2}
              onChange={(e) => handleFileUpload(e, 2)}
            />
            <div className="w-full h-full bg-[#FAF5FF] rounded-lg flex items-center justify-center overflow-hidden border border-[#D8BFD8]/60 relative">
              {initialLoading && !photo2 ? (
                <div className="flex items-center gap-2 text-[#8A7394]">
                  <Loader2 className="w-4 h-4 animate-spin text-[#9C6CC9]" />
                  <span className="text-xs">Loading memory...</span>
                </div>
              ) : photo2 ? (
                <>
                  <img src={photo2} alt="Birthday Memory 2" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1.5 backdrop-blur-[1px]">
                    <Camera className="w-4 h-4" />
                    <span>Change memory ✨</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-[#6D5A75]">
                  <Star className="w-4 h-4 text-[#D8BFD8] fill-[#D8BFD8]" />
                  <span className="font-serif-title italic text-sm">
                    A special memory for Mrrithula ✨
                  </span>
                </div>
              )}

              {/* Uploading Spinner Overlay */}
              {uploadingSlot === 2 && (
                <div className="absolute inset-0 bg-[#FAF5FF]/90 backdrop-blur-xs flex flex-col items-center justify-center z-20">
                  <Loader2 className="w-6 h-6 animate-spin text-[#9C6CC9] mb-1" />
                  <span className="text-[11px] font-medium text-[#6D5A75]">Saving to cloud...</span>
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
