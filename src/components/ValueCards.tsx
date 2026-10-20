import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig, type ValueCard } from '../config/site';
import { Building2, ShieldCheck, Compass, MapPin, ArrowUpRight } from 'lucide-react';
import { useCursor } from '../context/CursorContext';
import { useTheme } from '../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

// Icon mapping helper
const renderIcon = (name: string, isDark: boolean) => {
  const iconColor = isDark ? 'text-gold' : 'text-[#b88d3b]';
  switch (name) {
    case 'Building2':
      return <Building2 size={20} className={iconColor} />;
    case 'ShieldCheck':
      return <ShieldCheck size={20} className={iconColor} />;
    case 'Compass':
      return <Compass size={20} className={iconColor} />;
    case 'MapPin':
      return <MapPin size={20} className={iconColor} />;
    default:
      return <Building2 size={20} className={iconColor} />;
  }
};

export const ValueCards: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingWordsRef = useRef<HTMLSpanElement[]>([]);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const { setCursor, resetCursor } = useCursor();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Masked slide-up for heading words
      if (headingWordsRef.current.length > 0) {
        gsap.fromTo(
          headingWordsRef.current,
          { y: '105%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 2. 2x2 Grid cards stagger in
      if (cardsRef.current.length > 0) {
        gsap.fromTo(
          cardsRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Card cursor 3D tilt handler (±4 deg)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4; // Max ±4 deg
    const rotateY = ((x - centerX) / centerX) * 4;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;
  };

  const handleMouseLeave = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    resetCursor();
  };

  return (
    <section
      ref={sectionRef}
      id="properties"
      className={`relative w-full py-28 md:py-36 px-6 md:px-12 overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-[#0a0a0b] text-[#f2efe9]' : 'bg-[#f4f1ea] text-[#0a0a0b]'
      }`}
    >
      {/* Subtle background ambient lighting */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] blur-[140px] pointer-events-none rounded-full transition-opacity duration-500 ${
        isDark ? 'bg-gold/5' : 'bg-gold/15'
      }`} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 space-y-4">
          <p className={`text-[10px] md:text-xs tracking-ultra uppercase font-medium ${
            isDark ? 'text-gold' : 'text-[#b88d3b]'
          }`}>
            {siteConfig.valueSection.eyebrow}
          </p>

          <h2 className={`font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.15] ${
            isDark ? 'text-cream' : 'text-[#0a0a0b]'
          }`}>
            <span className="inline-block overflow-hidden pb-1">
              <span
                ref={(el) => {
                  if (el) headingWordsRef.current[0] = el;
                }}
                className="inline-block"
              >
                {siteConfig.valueSection.headingPrefix}
              </span>
            </span>{' '}
            <span className="inline-block overflow-hidden pb-1">
              <span
                ref={(el) => {
                  if (el) headingWordsRef.current[1] = el;
                }}
                className="inline-block"
              >
                <em className={`italic font-normal ${
                  isDark ? 'text-gold' : 'text-[#b88d3b]'
                }`}>
                  {siteConfig.valueSection.headingAccent}
                </em>
              </span>
            </span>
          </h2>

          <p className={`text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed pt-2 ${
            isDark ? 'text-cream-muted' : 'text-[#635f58]'
          }`}>
            {siteConfig.valueSection.subtext}
          </p>
        </div>

        {/* 2x2 Grid of Image-Background Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {siteConfig.valueSection.cards.map((card: ValueCard, index: number) => (
            <div
              key={card.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={() => handleMouseLeave(index)}
              className={`group relative h-[380px] md:h-[430px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-luxury border ${
                isDark
                  ? 'bg-[#111114] border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.5)]'
                  : 'bg-[#111114] border-[#0a0a0b]/15 shadow-[0_20px_45px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06)]'
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
              }}
            >
              {/* Background Architectural Photo - 100% Crisp, Vibrant, Razor Sharp (ZERO smoke!) */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-luxury group-hover:scale-[1.06] filter brightness-[1.02] contrast-[1.05]"
                style={{ backgroundImage: `url(${card.image})` }}
              />

              {/* Localized Bottom Gradient - Leaves the upper portion of the photo completely clear, provides deep contrast for text */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                style={{
                  background:
                    'linear-gradient(to top, rgba(10, 10, 11, 0.94) 0%, rgba(10, 10, 11, 0.78) 32%, rgba(10, 10, 11, 0.32) 52%, transparent 70%)',
                }}
              />

              {/* Gold Hairline Border that draws in on hover */}
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-gold/70 group-hover:shadow-[inset_0_0_25px_rgba(212,168,83,0.2),0_20px_45px_rgba(0,0,0,0.5)] transition-all duration-500 pointer-events-none" />

              {/* Card Header & Content */}
              <div className="relative h-full flex flex-col justify-between p-8 md:p-10 z-10">
                {/* Top bar: Icon & Tag (Luxury Frosted Glass Pills) */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full backdrop-blur-md border border-white/20 bg-black/45 text-gold flex items-center justify-center transition-all duration-300 group-hover:border-gold/60 group-hover:bg-black/65 shadow-lg">
                    {renderIcon(card.icon, true)}
                  </div>
                  <span className="text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-full backdrop-blur-md border border-gold/40 bg-black/55 text-gold shadow-md font-mono font-medium">
                    {card.tag}
                  </span>
                </div>

                {/* Bottom text: Title and 2-line description with razor-sharp contrast */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl md:text-3xl font-light text-[#f2efe9] group-hover:text-gold transition-colors duration-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                      {card.title}
                    </h3>
                    <div className="w-8 h-8 rounded-full border border-white/25 text-white/90 bg-black/35 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:border-gold group-hover:text-gold group-hover:bg-gold/15 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shadow-md">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>

                  <p className="text-xs md:text-sm font-light text-[#f2efe9]/85 leading-relaxed line-clamp-2 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
