import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '../config/site';
import { useCursor } from '../context/CursorContext';
import { useTheme } from '../context/ThemeContext';
import { ArrowUpRight, Check, MessageCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FinalCTAProps {
  onOpenBooking: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenBooking }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineLettersRef = useRef<HTMLSpanElement[]>([]);
  const formCardRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const { setCursor, resetCursor } = useCursor();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    interest: 'Penthouse Collection',
  });

  const prefixText = "Ready to Find Your ";
  const accentText = "Perfect Place?";

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Invert colors: Dark starts #0a0a0b -> inverts to #f4f1ea. Light starts #f4f1ea -> inverts to #0a0a0b.
    const startBg = isDark ? '#0a0a0b' : '#f4f1ea';
    const targetBg = isDark ? '#f4f1ea' : '#0a0a0b';
    const startText = isDark ? '#f2efe9' : '#0a0a0b';
    const targetText = isDark ? '#0a0a0b' : '#f2efe9';

    const ctx = gsap.context(() => {
      // 1. Theme Inversion scrubbed
      if (!prefersReducedMotion) {
        gsap.fromTo(
          containerRef.current,
          {
            backgroundColor: startBg,
            color: startText,
          },
          {
            backgroundColor: targetBg,
            color: targetText,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              end: 'top 30%',
              scrub: 0.6,
            },
          }
        );
      } else {
        if (containerRef.current) {
          containerRef.current.style.backgroundColor = targetBg;
          containerRef.current.style.color = targetText;
        }
      }

      // 2. Letter-by-letter headline reveal (SplitText-style hand crafted with spans, staggered 0.02s)
      if (headlineLettersRef.current.length > 0) {
        gsap.fromTo(
          headlineLettersRef.current,
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.02,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 65%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Form card slide up
      if (formCardRef.current) {
        gsap.fromTo(
          formCardRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formCardRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isDark]);

  const handleQuickForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setFormData({ name: '', contact: '', interest: 'Penthouse Collection' });
    }, 3500);
  };

  return (
    <div
      ref={containerRef}
      id="contact"
      className="relative w-full pt-28 md:pt-40 pb-16 px-6 md:px-12 transition-colors duration-700 overflow-hidden"
      style={{ backgroundColor: isDark ? '#0a0a0b' : '#f4f1ea' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Eyebrow Label */}
        <p className="text-[10px] md:text-xs tracking-ultra uppercase text-[#b88d3b] font-semibold mb-6">
          {siteConfig.ctaSection.eyebrow}
        </p>

        {/* Letter-by-letter Hand-Crafted Headline */}
        <h2
          className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-center tracking-tight leading-[1.12] mb-6 max-w-4xl"
          aria-label={`${prefixText} ${accentText}`}
        >
          {/* Prefix letters */}
          <span className="inline-block whitespace-normal">
            {prefixText.split('').map((char, idx) => (
              <span
                key={`p-${idx}`}
                ref={(el) => {
                  if (el) headlineLettersRef.current[idx] = el;
                }}
                className="inline-block opacity-0"
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>

          {/* Gold Italic Accent letters */}
          <em className="inline-block italic not-italic font-normal">
            {accentText.split('').map((char, idx) => {
              const letterIndex = prefixText.length + idx;
              return (
                <span
                  key={`a-${idx}`}
                  ref={(el) => {
                    if (el) headlineLettersRef.current[letterIndex] = el;
                  }}
                  className="inline-block opacity-0 text-[#b88d3b]"
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </em>
        </h2>

        <p className="text-sm md:text-base opacity-75 font-light text-center max-w-xl mb-12 leading-relaxed">
          {siteConfig.ctaSection.subtext}
        </p>

        {/* Action Form / Contact Card */}
        <div
          ref={formCardRef}
          className={`w-full max-w-2xl backdrop-blur-md rounded-2xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] mb-20 border ${
            isDark
              ? 'bg-white/80 border-[#111114]/10 text-[#0a0a0b]'
              : 'bg-[#18181f]/90 border-white/10 text-[#f2efe9]'
          }`}
        >
          {formSent ? (
            <div className="py-8 flex flex-col items-center text-center space-y-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isDark ? 'bg-[#111114] text-gold' : 'bg-gold text-[#0a0a0b]'
              }`}>
                <Check size={24} />
              </div>
              <h4 className="font-serif text-2xl">Confidential Dispatch Initiated</h4>
              <p className="text-xs opacity-75 max-w-sm">
                Our Managing Partner will transmit the private investment prospectus directly to your secure channel.
              </p>
            </div>
          ) : (
            <form onSubmit={handleQuickForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-1 font-medium">
                    Your Name
                  </label>
                  <input
                    required
                    type="text"
                    inputMode="text"
                    autoComplete="name"
                    placeholder="Lord / Lady / Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full rounded-xl px-4 py-3 sm:py-2.5 text-sm sm:text-xs focus:outline-none focus:border-[#b88d3b] transition-colors border ${
                      isDark
                        ? 'bg-[#f4f1ea]/80 border-[#111114]/15 text-[#111114]'
                        : 'bg-[#111114]/80 border-white/10 text-[#f2efe9]'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-1 font-medium">
                    Email / Direct Mobile
                  </label>
                  <input
                    required
                    type="text"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="contact@entity.com"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className={`w-full rounded-xl px-4 py-3 sm:py-2.5 text-sm sm:text-xs focus:outline-none focus:border-[#b88d3b] transition-colors border ${
                      isDark
                        ? 'bg-[#f4f1ea]/80 border-[#111114]/15 text-[#111114]'
                        : 'bg-[#111114]/80 border-white/10 text-[#f2efe9]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest opacity-60 mb-1 font-medium">
                  Collection Interest
                </label>
                <select
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className={`w-full rounded-xl px-4 py-3 sm:py-2.5 text-sm sm:text-xs focus:outline-none focus:border-[#b88d3b] transition-colors border ${
                    isDark
                      ? 'bg-[#f4f1ea]/80 border-[#111114]/15 text-[#111114]'
                      : 'bg-[#111114]/80 border-white/10 text-[#f2efe9]'
                  }`}
                >
                  <option value="Penthouse Belvedere" className="text-black">The Penthouse Belvedere ($28.5M)</option>
                  <option value="Horizon Sky Suite" className="text-black">The Horizon Sky Suite ($18.2M)</option>
                  <option value="Aurora Grand Duplex" className="text-black">The Aurora Grand Duplex ($34.0M)</option>
                  <option value="Zenith Garden Pavilion" className="text-black">The Zenith Garden Pavilion ($14.8M)</option>
                  <option value="Entire Portfolio" className="text-black">Full Off-Market Monograph</option>
                </select>
              </div>

              {/* Dark/Gold Pill "Get in touch" Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 justify-between">
                <button
                  type="submit"
                  onMouseEnter={() => setCursor('hover')}
                  onMouseLeave={resetCursor}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 group active:scale-95 shadow-md ${
                    isDark
                      ? 'bg-[#111114] text-[#f2efe9] hover:bg-gold hover:text-[#0a0a0b] hover:shadow-[0_10px_25px_rgba(212,168,83,0.3)]'
                      : 'bg-gold text-[#0a0a0b] hover:bg-white hover:text-[#0a0a0b] hover:shadow-[0_10px_25px_rgba(212,168,83,0.4)]'
                  }`}
                >
                  <span>Get in Touch</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>

                <div className="flex items-center justify-between sm:justify-start gap-4">
                  <a
                    href={`https://wa.me/${siteConfig.footer.contacts.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello HYVORA, I would like to request the private investment monograph.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex sm:hidden items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={onOpenBooking}
                    onMouseEnter={() => setCursor('hover')}
                    onMouseLeave={resetCursor}
                    className="text-xs uppercase tracking-wider font-semibold text-[#b88d3b] hover:underline underline-offset-4 py-1"
                  >
                    Or schedule private visit →
                  </button>
                </div>
              </div>

              <p className="text-[10px] opacity-50 text-center pt-2">
                {siteConfig.ctaSection.consultationNotice}
              </p>
            </form>
          )}
        </div>

        {/* Minimal Luxury Footer */}
        <footer
          ref={footerRef}
          className="w-full pt-12 border-t border-current/15"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Wordmark and Monograph */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full border border-current/40 flex items-center justify-center font-serif text-xs font-semibold">
                  {siteConfig.brand.monogram}
                </span>
                <span className="font-sans text-xs tracking-widest uppercase font-semibold">
                  {siteConfig.brand.name}
                </span>
              </div>
              <p className="text-xs opacity-75 font-light leading-relaxed">
                {siteConfig.footer.description}
              </p>
            </div>

            {/* Global Offices */}
            <div>
              <h5 className="text-[10px] font-semibold tracking-ultra uppercase text-[#b88d3b] mb-3">
                GLOBAL PRESENCE
              </h5>
              <div className="space-y-2 text-xs opacity-85">
                {siteConfig.footer.locations.map((loc) => (
                  <div key={loc.city}>
                    <span className="font-semibold">{loc.city}:</span>{' '}
                    <span className="opacity-75">{loc.address}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inquiries */}
            <div>
              <h5 className="text-[10px] font-semibold tracking-ultra uppercase text-[#b88d3b] mb-3">
                DIRECT CHANNELS
              </h5>
              <div className="space-y-1.5 text-xs opacity-85">
                <p>
                  <span className="opacity-60">Private Client:</span>{' '}
                  <a href={`mailto:${siteConfig.footer.contacts.inquiries}`} className="hover:underline">
                    {siteConfig.footer.contacts.inquiries}
                  </a>
                </p>
                <p>
                  <span className="opacity-60">Family Office Desk:</span>{' '}
                  <a href={`tel:${siteConfig.footer.contacts.phone.replace(/[^0-9+]/g, '')}`} className="font-mono hover:underline">
                    {siteConfig.footer.contacts.phone}
                  </a>
                </p>
                <p>
                  <span className="opacity-60">Press & Monograph:</span>{' '}
                  <a href={`mailto:${siteConfig.footer.contacts.press}`} className="hover:underline">
                    {siteConfig.footer.contacts.press}
                  </a>
                </p>
              </div>
            </div>

            {/* Legal and Accreditation */}
            <div>
              <h5 className="text-[10px] font-semibold tracking-ultra uppercase text-[#b88d3b] mb-3">
                GOVERNANCE
              </h5>
              <div className="space-y-1 text-xs opacity-75">
                {siteConfig.footer.legalLinks.map((l) => (
                  <div key={l.label}>
                    <a href={l.href} className="hover:text-[#b88d3b] transition-colors">
                      {l.label}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-current/10 flex flex-col sm:flex-row items-center justify-between text-[11px] opacity-60 gap-4">
            <p>{siteConfig.footer.copyright}</p>
            <p className="font-serif italic text-xs text-[#b88d3b]">
              "{siteConfig.brand.tagline}"
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
