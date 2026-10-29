import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface CakeScreenProps {
  onNext: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  g: number;
  w: number;
  h: number;
  r: number;
  vr: number;
  c: string;
  life: number;
  max: number;
}

export const CakeScreen: React.FC<CakeScreenProps> = ({ onNext }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const burstRef = useRef<(() => void) | null>(null);
  const celebratedRef = useRef(false);
  const [isCelebrated, setIsCelebrated] = useState(false);
  const [isNextVisible, setIsNextVisible] = useState(false);

  useEffect(() => {
    celebratedRef.current = false;
    setIsCelebrated(false);
    setIsNextVisible(false);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let parts: Particle[] = [];

    const resize = () => {
      const d = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * d;
      canvas.height = window.innerHeight * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();

    const burst = () => {
      const colors = [
        '#ffe29a',
        '#de3767',
        '#176aa0',
        '#ee5c3e',
        '#f7c95c',
        '#fff1ca',
      ];

      const n = window.innerWidth < 600 ? 170 : 270;

      parts = Array.from({ length: n }, (_, i) => {
        const a = Math.random() * 6.283;
        const s = 5 + Math.random() * 13;

        return {
          x: window.innerWidth / 2,
          y: window.innerHeight * 0.5,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s - 4,
          g: 0.18,
          w: 4 + Math.random() * 8,
          h: 8 + Math.random() * 13,
          r: Math.random() * 6,
          vr: (Math.random() - 0.5) * 0.36,
          c: colors[i % 6],
          life: 0,
          max: 110 + Math.random() * 80,
        };
      });

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      const tick = () => {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        let live = false;

        for (const p of parts) {
          if (++p.life > p.max) continue;

          live = true;

          p.x += p.vx;
          p.y += p.vy;

          p.vy += p.g;
          p.vx *= 0.992;

          p.r += p.vr;

          ctx.globalAlpha = 1 - p.life / p.max;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.r);
          ctx.fillStyle = p.c;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }

        ctx.globalAlpha = 1;

        if (live) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };

      tick();
    };

    burstRef.current = burst;

    // GSAP Animation Timeline for Cake entrance
    const gsapCtx = gsap.context(() => {
      const drop = (tl: gsap.core.Timeline, selector: string, at?: string | number) => {
        tl.set(
          selector,
          {
            xPercent: -50,
            y: -window.innerHeight * 1.15,
            autoAlpha: 0,
            scaleX: 1,
            scaleY: 1,
          },
          at
        )
          .to(
            selector,
            {
              y: 10,
              autoAlpha: 1,
              duration: 0.3,
              ease: 'power4.in',
            },
            '>'
          )
          .to(selector, {
            y: -24,
            scaleX: 1.075,
            scaleY: 0.925,
            duration: 0.065,
            ease: 'power2.out',
          })
          .to(selector, {
            y: 5,
            scaleX: 0.985,
            scaleY: 1.025,
            duration: 0.08,
            ease: 'power2.in',
          })
          .to(selector, {
            y: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 0.1,
            ease: 'power3.out',
          });
      };

      const tl = gsap.timeline();

      drop(tl, '.bottom', 0.08);
      drop(tl, '.middle', '+=0.01');
      drop(tl, '.top', '+=0.01');

      tl.set('.candles', {
        xPercent: -50,
        y: 0,
        autoAlpha: 0,
        scale: 0.55,
        transformOrigin: '50% 100%',
      })
        .to(
          '.candles',
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.38,
            ease: 'back.out(2.4)',
          },
          '+=0.08'
        )
        .to(
          '.wish',
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.35,
            ease: 'power3.out',
          },
          '+=0.05'
        )
        .to(
          '.controls',
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.3,
            ease: 'power3.out',
          },
          '-=0.1'
        );
    }, containerRef);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      gsapCtx.revert();
    };
  }, []);

  const handleBlow = () => {
    if (celebratedRef.current) return;
    celebratedRef.current = true;
    setIsCelebrated(true);

    if (burstRef.current) {
      burstRef.current();
    }

    const tl = gsap.timeline();

    gsap.set('.flame', {
      autoAlpha: 1,
      scale: 1,
    });

    tl.to(
      '.wish, .controls',
      {
        autoAlpha: 0,
        y: -12,
        duration: 0.35,
        ease: 'power2.in',
      },
      0
    )
      .to(
        '.decor',
        {
          autoAlpha: 1,
          duration: 0.2,
        },
        0.04
      )
      .to(
        '.banner',
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: 'back.out(1.7)',
        },
        0.04
      )
      .fromTo(
        '.balloon',
        {
          scale: 0.3,
          rotation: -10,
        },
        {
          scale: 1,
          rotation: 0,
          duration: 0.58,
          stagger: 0.06,
          ease: 'back.out(1.8)',
        },
        0.1
      )
      .to(
        '#next-control',
        {
          autoAlpha: 1,
          y: -8,
          duration: 0.35,
          ease: 'power3.out',
          onStart: () => {
            setIsNextVisible(true);
          },
        },
        0.72
      );
  };

  return (
    <section
      ref={containerRef}
      id="screen-cake"
      aria-label="Birthday cake animation"
      className="original-cake-wrapper"
    >
      <style>{`
        .original-cake-wrapper {
          --cream: #ffe5a2;
          --ink: #35160f;
          --text: #2b1813;
          position: relative;
          width: 100%;
          height: 100dvh;
          min-height: 100dvh;
          padding: 0;
          color: var(--cream);
          background: radial-gradient(
            ellipse at 50% 46%,
            #a45f43 0%,
            #7a422f 43%,
            #4a241b 100%
          );
          font-family: Georgia, "Times New Roman", serif;
          user-select: none;
          overflow: hidden;
        }

        .original-cake-wrapper #cake-scene {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          isolation: isolate;
        }

        .original-cake-wrapper .ambient {
          position: absolute;
          inset: 0;
          opacity: 0.28;
          pointer-events: none;
          background-image:
            radial-gradient(circle at 15% 22%, #ffe49c 0 3px, transparent 4px),
            radial-gradient(circle at 83% 22%, #ffd97c 0 3px, transparent 4px),
            radial-gradient(circle at 10% 72%, #ffe49c 0 3px, transparent 4px),
            radial-gradient(circle at 89% 69%, #ffe49c 0 3px, transparent 4px);
          background-size:
            154px 137px,
            186px 184px,
            160px 158px,
            177px 181px;
          transition: opacity 0.5s ease;
        }

        .original-cake-wrapper #cake-scene.celebrating .ambient {
          opacity: 1;
        }

        /* HAPPY BIRTHDAY banner */
        .original-cake-wrapper .banner {
          position: absolute;
          z-index: 4;
          top: 16px;
          left: 50%;
          width: min(88vw, 540px);
          transform: translateX(-50%) translateY(-35px) scale(0.85);
          opacity: 0;
          text-align: center;
          filter: drop-shadow(0 5px 0 #4a241b);
        }

        .original-cake-wrapper .banner span {
          display: block;
          padding: 7px 14px;
          border: 3px solid var(--ink);
          color: #3d2019;
          background: #ffe5a2;
          font: 900 clamp(27px, 7vw, 52px) / 0.92 Impact, sans-serif;
          letter-spacing: 0.08em;
          transform: skewY(-3deg);
        }

        .original-cake-wrapper .banner span + span {
          background: #d69a57;
          font-size: clamp(32px, 8vw, 62px);
          transform: skewY(3deg);
        }

        /* Celebration decorations */
        .original-cake-wrapper .decor {
          position: absolute;
          inset: 0;
          z-index: 3;
          opacity: 0;
          pointer-events: none;
        }

        .original-cake-wrapper .balloon {
          position: absolute;
          width: clamp(60px, 14vw, 112px);
          aspect-ratio: 0.76;
          border: 3px solid var(--ink);
          border-radius: 50% 50% 47% 47%;
          box-shadow:
            inset -11px -11px #360c133b,
            inset 11px 11px #fff2;
        }

        .original-cake-wrapper .balloon:before {
          content: "";
          position: absolute;
          width: 19%;
          height: 22%;
          top: 14%;
          left: 20%;
          border-radius: 50%;
          background: #ffe98e;
          transform: rotate(-27deg);
        }

        .original-cake-wrapper .balloon:after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          height: clamp(86px, 18vh, 170px);
          border-left: 2px solid #2f1612;
          transform: rotate(4deg);
        }

        .original-cake-wrapper .b1 { top: 11%; left: -2%; background: #d83367; }
        .original-cake-wrapper .b2 { top: 13%; right: -2%; background: #176b9e; }
        .original-cake-wrapper .b3 { right: 3%; bottom: 7%; background: #e13b63; }
        .original-cake-wrapper .b4 { bottom: 7%; left: -3%; background: #176b9e; }

        .original-cake-wrapper .streamer {
          position: absolute;
          width: 14px;
          height: 110px;
          border: 5px solid;
          border-color: #f8d57c transparent transparent #f8d57c;
          border-radius: 50%;
          transform: rotate(22deg);
        }

        .original-cake-wrapper .s1 { top: 6%; left: 24%; }
        .original-cake-wrapper .s2 {
          top: 18%;
          right: 23%;
          border-color: #e03c63 transparent transparent #e03c63;
          transform: rotate(-30deg);
        }
        .original-cake-wrapper .s3 { bottom: 18%; left: 16%; }
        .original-cake-wrapper .s4 {
          right: 16%;
          bottom: 22%;
          border-color: #176aa0 transparent transparent #176aa0;
          transform: rotate(40deg);
        }

        /* Celebration particles */
        .original-cake-wrapper #particles {
          position: absolute;
          inset: 0;
          z-index: 10;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        /* Wish title */
        .original-cake-wrapper .wish {
          position: absolute;
          z-index: 6;
          top: max(17vh, 110px);
          left: 50%;
          width: 100%;
          transform: translateX(-50%);
          opacity: 0;
          text-align: center;
          font-size: clamp(29px, 7vw, 48px);
          font-style: italic;
          text-shadow:
            0 3px #54251a,
            0 0 23px #ffd97c88;
        }

        /* Cake stage */
        .original-cake-wrapper .stage {
          position: absolute;
          z-index: 5;
          left: 50%;
          bottom: max(7vh, 42px);
          width: min(78vw, 410px);
          height: min(62vh, 540px);
          transform: translateX(-50%);
          transform-origin: bottom;
        }

        .original-cake-wrapper .cake {
          position: absolute;
          inset: 0;
        }

        /* Cake tiers */
        .original-cake-wrapper .tier {
          position: absolute;
          left: 50%;
          opacity: 0;
          visibility: hidden;
          will-change: transform, opacity;
          border: 4px solid var(--ink);
          background: linear-gradient(
            100deg,
            #592317 0 10%,
            #8d4931 24%,
            #bd7651 45%,
            #7c3827 77%,
            #4e1b14
          );
          box-shadow:
            inset 0 10px #ffd4942e,
            0 10px #2f110c3d;
          overflow: hidden;
        }

        .original-cake-wrapper .tier:before {
          content: "";
          position: absolute;
          top: -8px;
          left: -3%;
          width: 106%;
          height: 24px;
          border: 3px solid var(--ink);
          border-radius: 50%;
          background: linear-gradient(#b26a48, #71301f);
        }

        .original-cake-wrapper .tier:after {
          content: "";
          position: absolute;
          top: 25px;
          left: 0;
          right: 0;
          height: 32px;
          background: radial-gradient(
            ellipse at 12px 0,
            #5b1c13 0 11px,
            transparent 12px
          ) 0 0 / 40px 33px repeat-x;
          filter: drop-shadow(0 3px #32110d);
        }

        .original-cake-wrapper .bottom {
          bottom: 27px;
          width: 89%;
          height: 130px;
          border-radius: 26px 26px 18px;
          background:
            radial-gradient(circle at 18% 65%, #4d1b15 0 7px, transparent 8px),
            radial-gradient(circle at 48% 72%, #4d1b15 0 8px, transparent 9px),
            radial-gradient(circle at 80% 63%, #4d1b15 0 6px, transparent 7px),
            linear-gradient(100deg, #602519, #aa603e, #71301f);
        }

        .original-cake-wrapper .middle {
          bottom: 143px;
          width: 68%;
          height: 108px;
          border-radius: 23px 23px 17px;
          background:
            repeating-linear-gradient(
              0deg,
              transparent 0 22px,
              #f0b678 23px 27px
            ),
            linear-gradient(100deg, #5c2117, #b86c48, #612217);
        }

        .original-cake-wrapper .top {
          bottom: 246px;
          width: 47%;
          height: 90px;
          border-radius: 20px 20px 14px;
        }

        /* Plate */
        .original-cake-wrapper .plate {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 99%;
          height: 45px;
          transform: translateX(-50%);
          border: 4px solid var(--ink);
          border-radius: 50%;
          background: radial-gradient(
            ellipse,
            #fff6e2 0 49%,
            #d6b7a0 50% 56%,
            #fff1d6 57% 66%,
            #4a2118 67% 72%,
            transparent 73%
          );
        }

        /* Candles */
        .original-cake-wrapper .candles {
          position: absolute;
          z-index: 2;
          left: 50%;
          bottom: 330px;
          width: clamp(132px, 53%, 220px);
          height: 95px;
          padding: 0 5px;
          opacity: 0;
          visibility: hidden;
          display: flex;
          justify-content: center;
          gap: 7px;
          align-items: end;
          overflow: visible;
          will-change: transform, opacity;
        }

        .original-cake-wrapper .candle {
          position: relative;
          flex: 0 0 14px;
          width: 14px;
          height: 69px;
          border: 3px solid var(--ink);
          border-radius: 4px;
          background: repeating-linear-gradient(
            135deg,
            #f4d38e 0 5px,
            #72422b 5px 9px
          );
        }

        .original-cake-wrapper .candle:nth-child(2),
        .original-cake-wrapper .candle:nth-child(4) {
          height: 76px;
        }

        .original-cake-wrapper .candle:nth-child(3) {
          height: 82px;
        }

        .original-cake-wrapper .candle.extra {
          display: none;
        }

        /* Flame */
        .original-cake-wrapper .flame {
          position: absolute;
          bottom: calc(100% + 4px);
          left: 50%;
          width: 19px;
          height: 31px;
          transform: translateX(-50%);
          border-radius: 60% 45% 60% 45%;
          background: radial-gradient(
            circle at 50% 70%,
            #fff8bd 0 22%,
            #ffce54 24% 45%,
            #f07b21 48% 70%,
            transparent 72%
          );
          filter: drop-shadow(0 0 9px #ffb837);
          animation: originalFlicker 0.55s infinite alternate ease-in-out;
        }

        @keyframes originalFlicker {
          from {
            transform: translateX(-50%) scale(0.91, 0.98) rotate(-3deg);
          }
          to {
            transform: translateX(-50%) scale(1.05, 1.1) rotate(3deg);
          }
        }

        /* Buttons */
        .original-cake-wrapper .controls,
        .original-cake-wrapper .next-control {
          position: absolute;
          z-index: 7;
          bottom: max(18px, env(safe-area-inset-bottom));
          left: 50%;
          width: min(88vw, 330px);
          transform: translateX(-50%);
          opacity: 0;
          text-align: center;
        }

        .original-cake-wrapper .cake-button {
          appearance: none;
          border: 2px solid #32120d;
          border-radius: 999px;
          padding: 13px 22px;
          background: linear-gradient(#ffe9a8, #e9a747);
          color: #421b12;
          font: 700 16px Georgia, "Times New Roman", serif;
          cursor: pointer;
          box-shadow:
            0 5px #5e291b,
            0 0 0 0 #ffd97c88;
          animation: originalPulse 1.8s infinite;
        }

        .original-cake-wrapper .cake-button:active {
          transform: translateY(2px);
        }

        @keyframes originalPulse {
          50% {
            box-shadow:
              0 5px #5e291b,
              0 0 0 13px #ffd97c00;
          }
        }

        .original-cake-wrapper .next-control {
          z-index: 8;
          pointer-events: none;
        }

        .original-cake-wrapper .next-control.visible {
          pointer-events: auto;
        }

        @media (max-height: 630px) {
          .original-cake-wrapper .stage {
            height: 430px;
            bottom: 18px;
          }
          .original-cake-wrapper .wish {
            top: 74px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .original-cake-wrapper *,
          .original-cake-wrapper *:before,
          .original-cake-wrapper *:after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div id="cake-scene" className={isCelebrated ? 'celebrating' : ''}>
        <canvas ref={canvasRef} id="particles" />
        <div className="ambient" />

        <header className="banner">
          <span>HAPPY</span>
          <span>BIRTHDAY</span>
        </header>

        <div className="decor">
          <i className="balloon b1" />
          <i className="balloon b2" />
          <i className="balloon b3" />
          <i className="balloon b4" />

          <i className="streamer s1" />
          <i className="streamer s2" />
          <i className="streamer s3" />
          <i className="streamer s4" />
        </div>

        <div className="wish">Make a Wish</div>

        <div className="stage">
          <div className="cake">
            <div className="plate" />

            <div className="tier bottom" />
            <div className="tier middle" />
            <div className="tier top" />

            <div className="candles">
              <div className="candle">
                <i className="flame" />
              </div>

              <div className="candle extra" style={{ display: isCelebrated ? 'block' : 'none' }}>
                <i className="flame" />
              </div>

              <div className="candle extra" style={{ display: isCelebrated ? 'block' : 'none' }}>
                <i className="flame" />
              </div>

              <div className="candle extra" style={{ display: isCelebrated ? 'block' : 'none' }}>
                <i className="flame" />
              </div>

              <div className="candle extra" style={{ display: isCelebrated ? 'block' : 'none' }}>
                <i className="flame" />
              </div>
            </div>
          </div>
        </div>

        <div className="controls">
          <button
            type="button"
            className="cake-button"
            id="blow"
            onClick={handleBlow}
          >
            Blow the Candle
          </button>
        </div>

        <div
          className={`next-control ${isNextVisible ? 'visible' : ''}`}
          id="next-control"
        >
          <button
            type="button"
            className="cake-button"
            id="cake-next"
            onClick={onNext}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};
