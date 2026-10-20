import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '../config/site';
import { useTheme } from '../context/ThemeContext';
import { Plane, ConciergeBell, Leaf, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const ColorBlockTransition: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const goldBandRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!containerRef.current || !goldBandRef.current || !contentRef.current) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      goldBandRef.current.style.clipPath = 'inset(0% 0 0 0)';
      contentRef.current.style.opacity = '1';
      return;
    }

    const ctx = gsap.context(() => {
      // Timeline pinned between section 2 and 3
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          start: 'top top',
          end: '+=150%',
          scrub: 0.6,
        },
      });

      // Gold band wipes up from bottom: clip-path inset(100% 0 0 0) to inset(0% 0 0 0)
      tl.fromTo(
        goldBandRef.current,
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', ease: 'none', duration: 0.55 },
        0
      );

      // Four small outlined icons and labels fade in once gold band covers viewport (around 0.5 to 0.8)
      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.25 },
        0.5
      );

      if (itemsRef.current.length > 0) {
        tl.fromTo(
          itemsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.05, ease: 'power2.out', duration: 0.25 },
          0.55
        );
      }

      // Holds for a moment, then scrolls away smoothly
      tl.to({}, { duration: 0.2 });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getFeatureIcon = (name: string) => {
    switch (name) {
      case 'Plane':
        return <Plane size={24} strokeWidth={1.5} className="text-[#0a0a0b]" />;
      case 'ConciergeBell':
        return <ConciergeBell size={24} strokeWidth={1.5} className="text-[#0a0a0b]" />;
      case 'Leaf':
        return <Leaf size={24} strokeWidth={1.5} className="text-[#0a0a0b]" />;
      case 'Sparkles':
        return <Sparkles size={24} strokeWidth={1.5} className="text-[#0a0a0b]" />;
      default:
        return <Sparkles size={24} strokeWidth={1.5} className="text-[#0a0a0b]" />;
    }
  };

  return (
    <div
      ref={containerRef}
      id="philosophy"
      className={`relative w-full h-screen overflow-hidden select-none transition-colors duration-500 ${
        isDark ? 'bg-[#0a0a0b]' : 'bg-[#f4f1ea]'
      }`}
    >
      {/* Background layer before wipe */}
      <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
        <p className={`font-serif italic text-2xl md:text-3xl max-w-2xl transition-colors ${
          isDark ? 'text-cream/40' : 'text-[#0a0a0b]/40'
        }`}>
          "{siteConfig.colorBlock.quote}"
        </p>
      </div>

      {/* Full-width Gold (#d4a853) Band Wiping Up from bottom */}
      <div
        ref={goldBandRef}
        className="absolute inset-0 w-full h-full bg-[#d4a853] flex flex-col justify-center items-center px-6 md:px-12 z-20 shadow-[0_0_80px_rgba(212,168,83,0.4)]"
        style={{ clipPath: 'inset(100% 0 0 0)' }}
      >
        {/* Subtle decorative gold textures */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0a0a0b_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Content Container that fades in once gold band covers viewport */}
        <div
          ref={contentRef}
          className="relative max-w-6xl mx-auto w-full text-[#0a0a0b] flex flex-col items-center opacity-0 z-10"
        >
          {/* Subtle architectural pill label */}
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0a0a0b]/25 bg-[#0a0a0b]/5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0b]" />
            <span className="text-[10px] tracking-ultra uppercase font-semibold text-[#0a0a0b]">
              UNCOMPROMISING LUXURY BENCHMARKS
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#0a0a0b] font-light text-center mb-14 tracking-tight max-w-3xl">
            Where Craft Meets the{' '}
            <span className="font-serif italic font-normal text-[#0a0a0b]">Absolute</span>
          </h2>

          {/* Four Small Outlined Icons with Labels */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 w-full">
            {siteConfig.colorBlock.features.map((feature, i) => (
              <div
                key={feature.title}
                ref={(el) => {
                  if (el) itemsRef.current[i] = el;
                }}
                className="flex flex-col items-center text-center p-6 rounded-xl border border-[#0a0a0b]/15 bg-[#0a0a0b]/[0.03] backdrop-blur-sm transition-transform duration-300 hover:scale-[1.03]"
              >
                {/* Outlined Icon Circle */}
                <div className="w-14 h-14 rounded-full border border-[#0a0a0b]/30 flex items-center justify-center mb-5 bg-[#d4a853] shadow-sm">
                  {getFeatureIcon(feature.icon)}
                </div>

                <h3 className="font-sans text-xs md:text-sm font-semibold tracking-wider uppercase text-[#0a0a0b] mb-2">
                  {feature.title}
                </h3>

                <p className="font-sans text-xs text-[#0a0a0b]/80 font-normal leading-relaxed">
                  {feature.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
