import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '../config/site';
import { useSmoothScroll } from './SmoothScrollProvider';
import { useTheme } from '../context/ThemeContext';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const initialBrandRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [loadProgress, setLoadProgress] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const { scrollTo } = useSmoothScroll();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const totalFrames = siteConfig.hero.totalFrames;

  // Render a specific frame onto the canvas
  const renderFrame = useCallback((frameIndex: number, scale = 1) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Apply scale centered
    if (scale !== 1) {
      ctx.translate(width / 2, height / 2);
      ctx.scale(scale, scale);
      ctx.translate(-width / 2, -height / 2);
    }

    const img = imagesRef.current[frameIndex];
    if (img && img.complete && img.naturalWidth > 0) {
      // Cover fit calculation
      const hRatio = width / img.naturalWidth;
      const vRatio = height / img.naturalHeight;
      const ratio = Math.max(hRatio, vRatio);
      const shiftX = (width - img.naturalWidth * ratio) / 2;
      const shiftY = (height - img.naturalHeight * ratio) / 2;

      ctx.drawImage(
        img,
        0,
        0,
        img.naturalWidth,
        img.naturalHeight,
        shiftX,
        shiftY,
        img.naturalWidth * ratio,
        img.naturalHeight * ratio
      );
    } else {
      // Procedural fallback rendering if frame image not loaded
      renderProceduralFallback(ctx, width, height, frameIndex / (totalFrames - 1));
    }

    ctx.restore();
  }, [totalFrames]);

  // Procedural fallback renderer
  const renderProceduralFallback = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    t: number
  ) => {
    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#0a0d14');
    grad.addColorStop(0.7, '#13141f');
    grad.addColorStop(1, '#0a0a0b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const baseY = height * 0.88;
    const towerH = height * 0.74;
    const towerW = Math.min(880, width * 0.64);
    const floors = 22;
    const floorH = towerH / floors;

    // Draw wide assembling tower
    for (let i = 0; i < floors; i++) {
      const startT = (i / floors) * 0.45;
      const progress = Math.min(1, Math.max(0, (t - startT) / 0.35));
      const targetY = baseY - (i + 1) * floorH;
      const disperse = (1 - progress) * (240 + (i % 4) * 60);
      const curY = targetY - disperse;
      const w = towerW;
      const x = centerX - w / 2;

      ctx.fillStyle = progress > 0.8 ? '#242835' : '#2f3344';
      ctx.fillRect(x, curY, w, 4);

      if (progress > 0.65) {
        ctx.strokeStyle = '#4a5068';
        ctx.lineWidth = 0.8;
        ctx.strokeRect(x, targetY, w, floorH);

        // Center cantilevered balcony
        ctx.fillStyle = '#3a3f54';
        ctx.fillRect(centerX - 130, curY, 260, 6);
      }
    }
  };

  // Preload frame images
  useEffect(() => {
    let isCancelled = false;
    let loaded = 0;
    const images: HTMLImageElement[] = [];

    const onFrameLoad = () => {
      if (isCancelled) return;
      loaded++;
      const pct = Math.round((loaded / totalFrames) * 100);
      setLoadProgress(pct);

      if (loaded === 1) {
        // Draw initial frame as soon as frame 1 arrives
        renderFrame(0, 1);
      }

      if (loaded >= totalFrames) {
        setIsPreloaded(true);
      }
    };

    const onFrameError = () => {
      if (isCancelled) return;
      loaded++;
      const pct = Math.round((loaded / totalFrames) * 100);
      setLoadProgress(pct);
      if (loaded >= totalFrames) {
        setIsPreloaded(true);
      }
    };

    // Preload loop
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNumStr = String(i).padStart(4, '0');
      img.src = `${siteConfig.hero.framePathPrefix}${frameNumStr}.webp`;
      img.onload = onFrameLoad;
      img.onerror = onFrameError;
      images.push(img);
    }

    imagesRef.current = images;

    // Safety timeout: reveal page after 3.5s max even if network stalls
    const timeout = setTimeout(() => {
      if (!isCancelled) {
        setIsPreloaded(true);
      }
    }, 3500);

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [totalFrames, renderFrame]);

  // Canvas resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      renderFrame(currentFrameRef.current);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderFrame]);

  // GSAP ScrollTrigger Sequence Setup
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      renderFrame(totalFrames - 1, 1);
      if (headlineRef.current) {
        headlineRef.current.style.opacity = '1';
        headlineRef.current.style.transform = 'translateY(0)';
      }
      if (initialBrandRef.current) {
        initialBrandRef.current.style.display = 'none';
      }
      return;
    }

    const frameObj = { frame: 0, canvasScale: 1, fadeBlack: 0 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 0.5,
          start: 'top top',
          end: '+=300%',
          onUpdate: (self) => {
            // Self progress 0 to 1
            const frameIndex = Math.min(
              totalFrames - 1,
              Math.floor(self.progress * (totalFrames - 1))
            );
            currentFrameRef.current = frameIndex;
            renderFrame(frameIndex, 1);
          },
        },
      });

      // Frame progression 0 to 119 over the scroll
      tl.to(frameObj, {
        frame: totalFrames - 1,
        ease: 'none',
        duration: 1,
      }, 0);

      // Initial Center Brand Name (HYVORA) fades out smoothly as scroll starts
      if (initialBrandRef.current) {
        tl.to(
          initialBrandRef.current,
          {
            opacity: 0,
            y: -30,
            duration: 0.18,
            ease: 'power2.out',
          },
          0
        );
      }

      // Scroll indicator fade out immediately on first scroll
      if (scrollIndicatorRef.current) {
        tl.to(
          scrollIndicatorRef.current,
          { opacity: 0, y: 15, duration: 0.1, ease: 'power2.out' },
          0
        );
      }

      // Headline "Where Earth Meets Elegance" fades in and rises 40px at about 55% of the scrub
      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.25, ease: 'power3.out' },
          0.55
        );
      }

      // At 93% the text and canvas fade to black/ivory as the section hands off
      if (headlineRef.current && overlayRef.current) {
        tl.to(
          headlineRef.current,
          { opacity: 0, y: -20, duration: 0.05, ease: 'power2.in' },
          0.92
        );
        tl.to(
          overlayRef.current,
          { opacity: 1, duration: 0.08, ease: 'power2.inOut' },
          0.92
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [totalFrames, renderFrame]);

  return (
    <>
      {/* Preload Progress Screen */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-700 ease-luxury ${
          isDark ? 'bg-[#0a0a0b] text-cream' : 'bg-[#f4f1ea] text-[#0a0a0b]'
        } ${
          isPreloaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex flex-col items-center max-w-sm w-full px-8 text-center">
          {/* Gold Monogram */}
          <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center mb-8 relative">
            <span className="font-serif text-gold text-2xl font-light">
              {siteConfig.brand.monogram}
            </span>
            <div className="absolute inset-0 rounded-full border-t border-gold animate-spin duration-1000" />
          </div>

          <p className="text-[10px] tracking-ultra uppercase text-gold mb-3">
            INITIALIZING ARCHITECTURAL VISION
          </p>
          <h2 className="font-serif text-2xl font-light mb-6">
            {siteConfig.brand.name}
          </h2>

          {/* Progress Bar */}
          <div className={`w-full h-[2px] rounded-full overflow-hidden mb-3 relative ${
            isDark ? 'bg-[#18181f]' : 'bg-[#e2ddd3]'
          }`}>
            <div
              className="h-full bg-gradient-to-r from-gold/50 via-gold to-gold-light transition-all duration-200"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <div className={`w-full flex justify-between items-center text-[10px] font-mono ${
            isDark ? 'text-cream/50' : 'text-[#0a0a0b]/60'
          }`}>
            <span>PRELOADING SEQUENCE</span>
            <span className="text-gold">{loadProgress}%</span>
          </div>
        </div>
      </div>

      {/* Hero Pinned Viewport Container */}
      <section
        ref={containerRef}
        id="hero"
        className={`relative w-full h-screen overflow-hidden select-none transition-colors duration-500 ${
          isDark ? 'bg-[#0a0a0b]' : 'bg-[#f4f1ea]'
        }`}
      >
        {/* Sequence Canvas - 100% full-bleed viewport */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full object-cover block transition-[filter,opacity] duration-500 ${
            isDark
              ? 'filter brightness-[1.03] contrast-[1.07] saturate-[1.05]'
              : 'filter invert-[0.92] hue-rotate-180 contrast-[1.06] brightness-[1.02] opacity-90'
          }`}
        />

        {/* Light Mode Soft Tone Harmonizer */}
        {!isDark && (
          <div className="absolute inset-0 pointer-events-none bg-[#f4f1ea]/20 mix-blend-color" />
        )}

        {/* Cinematic Vignette Overlay */}
        <div
          className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
            isDark
              ? 'bg-gradient-to-b from-[#0a0a0b]/40 via-transparent to-[#0a0a0b]/70'
              : 'bg-gradient-to-b from-[#f4f1ea]/60 via-transparent to-[#f4f1ea]/80'
          }`}
        />

        {/* Handoff Blackout / Ivory Overlay at 95% scrub */}
        <div
          ref={overlayRef}
          className={`absolute inset-0 pointer-events-none opacity-0 ${
            isDark ? 'bg-[#0a0a0b]' : 'bg-[#f4f1ea]'
          }`}
        />

        {/* Initial Center Brand Name: HYVORA (Visible at the very beginning) */}
        <div
          ref={initialBrandRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none z-10"
        >
          <div className="max-w-4xl mx-auto flex flex-col items-center space-y-3 sm:space-y-4">
            <span
              className={`text-[10px] sm:text-xs tracking-ultra uppercase font-medium transition-colors duration-300 ${
                isDark ? 'text-gold drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]' : 'text-[#b88d3b]'
              }`}
            >
              PRIVATE RESIDENCES
            </span>
            <h1
              className={`font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-[0.2em] pl-[0.2em] uppercase transition-colors duration-300 ${
                isDark
                  ? 'text-[#f2efe9] drop-shadow-[0_6px_40px_rgba(0,0,0,0.95)]'
                  : 'text-[#0a0a0b] drop-shadow-[0_4px_24px_rgba(184,141,59,0.18)]'
              }`}
            >
              {siteConfig.brand.name}
            </h1>
            <div
              className={`w-16 sm:w-24 h-[1px] bg-gradient-to-r from-transparent to-transparent opacity-80 ${
                isDark ? 'via-gold' : 'via-[#b88d3b]'
              }`}
            />
            <p
              className={`font-serif italic text-base sm:text-xl md:text-2xl font-light tracking-wide transition-colors duration-300 ${
                isDark ? 'text-gold/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]' : 'text-[#b88d3b]'
              }`}
            >
              {siteConfig.brand.tagline}
            </p>
          </div>
        </div>

        {/* Hero Headline Overlay (Rises and Fades In at ~65% Scrub) */}
        <div
          ref={headlineRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none opacity-0"
        >
          <div className="max-w-4xl mx-auto space-y-4">
            <p
              className={`text-[11px] md:text-xs tracking-ultra uppercase font-medium transition-colors duration-300 ${
                isDark ? 'text-gold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]' : 'text-[#b88d3b]'
              }`}
            >
              SANCTUARY OF THE HORIZON
            </p>
            <h2
              className={`font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.08] transition-colors duration-300 ${
                isDark
                  ? 'text-[#f2efe9] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]'
                  : 'text-[#0a0a0b] drop-shadow-[0_4px_24px_rgba(184,141,59,0.18)]'
              }`}
            >
              {siteConfig.hero.headline}{' '}
              <em
                className={`italic font-normal ${
                  isDark ? 'text-gold' : 'text-[#b88d3b]'
                }`}
              >
                {siteConfig.hero.headlineAccent}
              </em>
            </h2>
            <p
              className={`max-w-xl mx-auto text-sm md:text-base font-light leading-relaxed pt-2 transition-colors duration-300 ${
                isDark
                  ? 'text-[#f2efe9]/85 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]'
                  : 'text-[#0a0a0b]/80'
              }`}
            >
              {siteConfig.hero.subheadline}
            </p>
          </div>
        </div>

        {/* Scroll Indicator (Bottom) */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer pointer-events-auto transition-colors duration-300"
          onClick={() => {
            const nextEl = document.getElementById('properties');
            if (nextEl) scrollTo(nextEl);
          }}
        >
          <span
            className={`text-[10px] tracking-widest_luxury uppercase font-medium transition-colors ${
              isDark
                ? 'text-[#f2efe9]/80 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]'
                : 'text-[#0a0a0b]/75'
            }`}
          >
            {siteConfig.hero.scrollIndicatorText}
          </span>
          <div
            className={`w-5 h-8 rounded-full border flex items-start justify-center p-1.5 backdrop-blur-sm transition-colors ${
              isDark
                ? 'border-gold/50 bg-black/30'
                : 'border-[#b88d3b]/50 bg-white/70 shadow-sm'
            }`}
          >
            <div
              className={`w-1 h-2 rounded-full animate-bounce ${
                isDark ? 'bg-gold' : 'bg-[#b88d3b]'
              }`}
            />
          </div>
          <ChevronDown
            size={14}
            className={`animate-pulse ${
              isDark ? 'text-gold/80' : 'text-[#b88d3b]'
            }`}
          />
        </div>
      </section>
    </>
  );
};
