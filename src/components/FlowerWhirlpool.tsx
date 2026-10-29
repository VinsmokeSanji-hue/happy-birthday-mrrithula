import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface FlowerWhirlpoolProps {
  onStartSplit?: () => void;
  onComplete: () => void;
}

interface FlowerParticle {
  arm: number;
  band: number;
  lane: number;
  entry: number;
  depth: number;
  foreground: number;
  shape: number;
  stretch: number;
  colorIndex: number;
  phase: number;
  turbulence: number;
  x?: number;
  y?: number;
  size?: number;
  rotation?: number;
  opacity?: number;
}

interface VortexState {
  w: number;
  h: number;
  dpr: number;
  arms: number;
  count: number;
  maxRadius: number;
  flowers: FlowerParticle[];
  start: number;
  splitting: boolean;
  held: boolean;
  resizeVersion: number;
  profile: {
    frames: number;
    field: number;
    blit: number;
  };
}

const flowerPalette = ['#fffafd', '#fff1f6', '#ffd8e7', '#f7b8cf', '#f9ccd9', '#ffc4d6'];

const smooth = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function flowerCanvasDpr(): number {
  const mobile = window.innerWidth < 700;
  const cores = navigator.hardwareConcurrency || 4;
  return Math.min(
    window.devicePixelRatio || 1,
    mobile ? (cores <= 4 ? 1 : 1.25) : cores <= 4 ? 1.25 : 1.5
  );
}

function createFlowerSprite(shape: number, color: string, blur: number): HTMLCanvasElement {
  const size = 160;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const mid = size / 2;
  const petals = 4 + shape;
  canvas.width = size;
  canvas.height = size;
  ctx.translate(mid, mid);
  ctx.fillStyle = color;
  if (blur) ctx.filter = `blur(${blur}px)`;
  for (let i = 0; i < petals; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / petals);
    ctx.beginPath();
    ctx.ellipse(0, -29, 17 + shape, 38 + shape * 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.filter = 'none';
  ctx.fillStyle = '#fffdfd';
  ctx.beginPath();
  ctx.arc(0, 6, 7, 0, Math.PI * 2);
  ctx.fill();
  return canvas;
}

let flowerSprites: HTMLCanvasElement[] = [];

function buildFlowerSprites() {
  if (flowerSprites.length) return;
  flowerSprites = flowerPalette.flatMap((color) =>
    [0, 1, 2].flatMap((shape) => [0, 0.75, 1.8].map((blur) => createFlowerSprite(shape, color, blur)))
  );
}

export const FlowerWhirlpool: React.FC<FlowerWhirlpoolProps> = ({ onStartSplit, onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fullCanvasRef = useRef<HTMLCanvasElement>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);

  const onStartSplitRef = useRef(onStartSplit);
  const onCompleteRef = useRef(onComplete);
  onStartSplitRef.current = onStartSplit;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onStartSplitRef.current?.();
      onCompleteRef.current?.();
      return;
    }

    buildFlowerSprites();

    const fullCanvas = fullCanvasRef.current;
    const leftCanvas = leftCanvasRef.current;
    const rightCanvas = rightCanvasRef.current;
    if (!fullCanvas || !leftCanvas || !rightCanvas) return;

    const flowerField = document.createElement('canvas');
    const flowerAtmosphere = document.createElement('canvas');

    const flowerCanvases = [fullCanvas, leftCanvas, rightCanvas];
    let flowerFieldCtx: CanvasRenderingContext2D | null = null;
    let flowerResizeVersion = 0;
    let flowerFrame = 0;
    let isTransitionBusy = true;
    let splitTimeoutId: ReturnType<typeof setTimeout> | null = null;

    function resizeFlowerCanvases(): { w: number; h: number; dpr: number } {
      const dpr = flowerCanvasDpr();
      const w = window.innerWidth;
      const h = window.innerHeight;
      const pxW = Math.max(1, Math.round(w * dpr));
      const pxH = Math.max(1, Math.round(h * dpr));

      for (const canvas of [...flowerCanvases, flowerField, flowerAtmosphere]) {
        canvas.width = pxW;
        canvas.height = pxH;
      }
      for (const canvas of flowerCanvases) {
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      flowerFieldCtx = flowerField.getContext('2d');
      if (flowerFieldCtx) flowerFieldCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const atmosphereCtx = flowerAtmosphere.getContext('2d');
      if (atmosphereCtx) {
        atmosphereCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const maxRadius = Math.hypot(w, h) * 1.08;
        const haze = atmosphereCtx.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, maxRadius * 0.78);
        haze.addColorStop(0, 'rgba(255,249,252,.32)');
        haze.addColorStop(0.55, 'rgba(255,214,231,.53)');
        haze.addColorStop(1, 'rgba(240,170,198,.82)');
        atmosphereCtx.fillStyle = haze;
        atmosphereCtx.fillRect(0, 0, w, h);
      }

      return { w, h, dpr };
    }

    function paintFlower(ctx: CanvasRenderingContext2D, f: FlowerParticle, blurLevel: number) {
      const sprite = flowerSprites[f.colorIndex * 9 + f.shape * 3 + blurLevel];
      if (!sprite) return;
      const diameter = (f.size || 20) * 2.08;
      ctx.save();
      ctx.translate(f.x || 0, f.y || 0);
      ctx.rotate(f.rotation || 0);
      ctx.globalAlpha = f.opacity || 1;
      ctx.drawImage(sprite, (-diameter * f.stretch) / 2, -diameter / 2, diameter * f.stretch, diameter);
      ctx.restore();
    }

    function renderVortex(now: number, state: VortexState) {
      if (!flowerFieldCtx) return;
      const elapsed = (now - state.start) / 1000;
      const progress = Math.min(elapsed / 2.6, 1);
      const expansion = smooth(progress);
      const subtle = Math.max(0, elapsed - 2.6) * 0.22;
      const { w, h, maxRadius, flowers } = state;

      const fieldStart = performance.now();
      flowerFieldCtx.clearRect(0, 0, w, h);
      // Transparent at t=0, gradually blooms into subtle atmospheric haze as flowers spiral in
      flowerFieldCtx.globalAlpha = 0.05 + 0.95 * expansion;
      flowerFieldCtx.fillStyle = '#ffdbe6';
      flowerFieldCtx.fillRect(0, 0, w, h);
      flowerFieldCtx.drawImage(flowerAtmosphere, 0, 0, w * state.dpr, h * state.dpr, 0, 0, w, h);
      flowerFieldCtx.globalAlpha = 1;

      for (const f of flowers) {
        const born = Math.max(0, Math.min(1, (progress - f.entry) / Math.max(0.2, 0.86 - f.entry)));
        if (!born) continue;
        const growth = smooth(born);
        const depthScale = 0.48 + f.depth * 1.08;
        const radial = maxRadius * f.band * Math.pow(growth, 1.32) * (0.8 + 0.2 * f.depth);
        const angle =
          (f.arm * Math.PI * 2) / state.arms +
          f.lane +
          expansion * (0.55 + f.depth * 0.25) +
          (radial / maxRadius) * 4.75 +
          f.turbulence * Math.sin(elapsed * 2.3 + f.phase) +
          subtle;
        f.x = w / 2 + Math.cos(angle) * radial;
        f.y = h / 2 + Math.sin(angle) * radial * 0.82;
        f.size = (7 + f.depth * 22 + f.foreground * 25) * depthScale * (0.45 + 0.9 * growth) * (1 + expansion * 0.38);
        f.rotation = angle * 1.65 + f.phase + elapsed * (0.25 + f.depth * 0.7);
        f.opacity = (0.25 + f.depth * 0.54) * Math.min(1, growth * 3);
        paintFlower(flowerFieldCtx, f, f.foreground && progress > 0.55 ? 2 : f.depth < 0.35 ? 1 : 0);
      }
      state.profile.field += performance.now() - fieldStart;

      const blitStart = performance.now();
      const surfaces = state.splitting ? [leftCanvas, rightCanvas] : [fullCanvas];
      for (const canvas of surfaces) {
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        const dpr = state.dpr;
        ctx.clearRect(0, 0, w, h);
        if (state.splitting) {
          const left = canvas === leftCanvas;
          const sx = left ? 0 : w / 2;
          const dx = sx;
          ctx.drawImage(flowerField, sx * dpr, 0, (w / 2) * dpr, h * dpr, dx, 0, w / 2, h);
        } else {
          ctx.drawImage(flowerField, 0, 0, w * dpr, h * dpr, 0, 0, w, h);
        }
      }
      state.profile.blit += performance.now() - blitStart;
      state.profile.frames++;
    }

    const size = resizeFlowerCanvases();
    const arms = 5;
    const cores = navigator.hardwareConcurrency || 4;
    const count = size.w < 600 ? (cores <= 4 ? 460 : 580) : cores <= 4 ? 760 : 960;
    const maxRadius = Math.hypot(size.w, size.h) * 1.08;

    const flowers: FlowerParticle[] = Array.from({ length: count }, (_, i) => {
      const foreground = i > count * 0.83 ? 1 : 0;
      const depth = foreground ? 0.72 + Math.random() * 0.28 : Math.pow(Math.random(), 0.68);
      return {
        arm: i % arms,
        band: 0.06 + Math.pow(Math.random(), 0.68) * 1.02,
        lane: (Math.random() - 0.5) * (0.19 + Math.random() * 0.34),
        entry: Math.random() * 0.72,
        depth,
        foreground,
        shape: Math.floor(Math.random() * 3),
        stretch: 0.78 + Math.random() * 0.48,
        colorIndex: Math.floor(Math.random() * flowerPalette.length),
        phase: Math.random() * Math.PI * 2,
        turbulence: 0.025 + Math.random() * 0.075,
      };
    }).sort((a, b) => a.depth - b.depth);

    const state: VortexState = {
      ...size,
      arms,
      count,
      maxRadius,
      flowers,
      start: performance.now(),
      splitting: false,
      held: false,
      resizeVersion: flowerResizeVersion,
      profile: { frames: 0, field: 0, blit: 0 },
    };

    // Render initial frame immediately so there is zero latency/blank flash
    renderVortex(performance.now(), state);

    const onResize = () => {
      flowerResizeVersion++;
    };
    window.addEventListener('resize', onResize, { passive: true });

    const beginSplit = () => {
      if (!isTransitionBusy) return;
      state.splitting = true;
      renderVortex(performance.now(), state);

      if (fullCanvas) fullCanvas.style.display = 'none';
      if (leftCanvas) leftCanvas.style.display = 'block';
      if (rightCanvas) rightCanvas.style.display = 'block';

      const finish = () => {
        cancelAnimationFrame(flowerFrame);
        isTransitionBusy = false;
        onCompleteRef.current?.();
      };

      if (window.gsap) {
        gsap
          .timeline({ onComplete: finish })
          .to(leftCanvas, { xPercent: -104, duration: 0.72, ease: 'power4.inOut' }, 0)
          .to(rightCanvas, { xPercent: 104, duration: 0.72, ease: 'power4.inOut' }, 0);
      } else {
        leftCanvas.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-104%)' }], {
          duration: 720,
          easing: 'cubic-bezier(.22,.8,.2,1)',
          fill: 'forwards',
        });
        rightCanvas.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(104%)' }], {
          duration: 720,
          easing: 'cubic-bezier(.22,.8,.2,1)',
          fill: 'forwards',
        });
        setTimeout(finish, 730);
      }
    };

    const draw = (now: number) => {
      if (!isTransitionBusy) return;
      if (state.resizeVersion !== flowerResizeVersion) {
        const next = resizeFlowerCanvases();
        state.w = next.w;
        state.h = next.h;
        state.dpr = next.dpr;
        state.maxRadius = Math.hypot(next.w, next.h) * 1.08;
        state.resizeVersion = flowerResizeVersion;
      }
      renderVortex(now, state);
      if (!state.held && now - state.start >= 2400) {
        state.held = true;
        // The vortex is now completely full and opaque. Switch view to Scrapbook behind the curtain
        onStartSplitRef.current?.();
        splitTimeoutId = setTimeout(beginSplit, 600);
      }
      if (isTransitionBusy && !state.splitting) {
        flowerFrame = requestAnimationFrame(draw);
      }
    };

    flowerFrame = requestAnimationFrame(draw);

    return () => {
      isTransitionBusy = false;
      if (splitTimeoutId) clearTimeout(splitTimeoutId);
      cancelAnimationFrame(flowerFrame);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="flower-transition"
      className="fixed inset-0 z-50 pointer-events-auto overflow-hidden select-none bg-transparent"
    >
      {/* Main Full Vortex Canvas */}
      <canvas
        ref={fullCanvasRef}
        className="flower-vortex flower-vortex-full absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Sliced Left and Right Canvases for Curtain Split Reveal */}
      <canvas
        ref={leftCanvasRef}
        className="flower-vortex flower-vortex-slice flower-vortex-slice--left absolute inset-0 w-full h-full pointer-events-none"
        style={{ display: 'none' }}
      />
      <canvas
        ref={rightCanvasRef}
        className="flower-vortex flower-vortex-slice flower-vortex-slice--right absolute inset-0 w-full h-full pointer-events-none"
        style={{ display: 'none' }}
      />
    </div>
  );
};

