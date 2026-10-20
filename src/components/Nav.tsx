import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig } from '../config/site';
import { useSmoothScroll } from './SmoothScrollProvider';
import { useCursor } from '../context/CursorContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Sun, Moon } from 'lucide-react';

interface NavProps {
  onOpenBooking: () => void;
}

export const Nav: React.FC<NavProps> = ({ onOpenBooking }) => {
  const navRef = useRef<HTMLElement>(null);
  const { scrollTo } = useSmoothScroll();
  const { setCursor, resetCursor } = useCursor();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Nav fade-in on page mount
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 }
      );
    }

    // ScrollTrigger to detect when user scrolls past hero
    const trigger = ScrollTrigger.create({
      start: '120px top',
      onEnter: () => setIsScrolled(true),
      onLeaveBack: () => setIsScrolled(false),
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    scrollTo(href, -80);
  };

  const isDark = theme === 'dark';

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ease-luxury ${
          isScrolled
            ? isDark
              ? 'py-4 bg-[#0a0a0b]/85 backdrop-blur-md border-b border-[#d4a853]/15 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
              : 'py-4 bg-[#f4f1ea]/90 backdrop-blur-md border-b border-[#0a0a0b]/10 shadow-[0_10px_30px_rgba(0,0,0,0.06)]'
            : 'py-6 bg-gradient-to-b from-[#0a0a0b]/60 via-[#0a0a0b]/20 to-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Wordmark (Left) */}
          <a
            href="#"
            onClick={(e) => handleNavClick(e, '#')}
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={resetCursor}
            className="group flex items-center gap-3 transition-colors duration-300"
            aria-label={`${siteConfig.brand.name} Home`}
          >
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm transition-all duration-300 ${
              isDark
                ? 'border border-gold/50 text-gold group-hover:border-gold group-hover:bg-gold/10'
                : 'border border-[#b88d3b]/60 text-[#b88d3b] group-hover:border-[#b88d3b]'
            } group-hover:scale-105 shadow-sm`}>
              {siteConfig.brand.monogram}
            </span>
            <span className={`font-sans text-xs tracking-widest_luxury uppercase font-semibold transition-colors ${
              isDark ? 'text-[#f2efe9] drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]' : 'text-[#0a0a0b]'
            }`}>
              {siteConfig.brand.name}
            </span>
          </a>

          {/* Nav Links (Center, Desktop) */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10" aria-label="Main Navigation">
            {siteConfig.navigation.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={resetCursor}
                className={`relative text-xs tracking-widest uppercase transition-colors duration-300 py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] hover:after:w-full after:transition-all after:duration-300 ${
                  isDark
                    ? 'text-[#f2efe9]/80 hover:text-[#f2efe9] after:bg-gold drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]'
                    : 'text-[#0a0a0b]/75 hover:text-[#0a0a0b] after:bg-[#b88d3b]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Area: Theme Toggle + Book a Visit (Right) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
              aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border cursor-pointer ${
                isDark
                  ? 'border-white/20 text-gold hover:border-gold hover:bg-white/10 shadow-sm'
                  : 'border-black/15 text-[#b88d3b] hover:border-[#b88d3b] hover:bg-black/5 shadow-sm'
              }`}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Book a Visit Pill Button */}
            <button
              onClick={onOpenBooking}
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
              className={`relative px-6 py-2 rounded-full border text-xs tracking-widest uppercase font-medium transition-all duration-300 active:scale-95 ${
                isDark
                  ? 'border-gold/60 text-gold hover:bg-gold hover:text-[#0a0a0b] hover:shadow-[0_0_20px_rgba(212,168,83,0.4)] hover:border-gold'
                  : 'border-[#b88d3b]/70 text-[#b88d3b] hover:bg-[#b88d3b] hover:text-[#f4f1ea] hover:shadow-[0_0_20px_rgba(184,141,59,0.3)] hover:border-[#b88d3b]'
              }`}
            >
              {siteConfig.navigation.ctaText}
            </button>
          </div>

          {/* Mobile Right Controls: Theme + Menu */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'text-gold' : 'text-[#b88d3b]'
              }`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className={`p-2 transition-colors ${
                isDark ? 'text-[#f2efe9] hover:text-gold' : 'text-[#0a0a0b] hover:text-[#b88d3b]'
              }`}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-0 z-30 transition-all duration-500 md:hidden flex flex-col justify-center px-8 backdrop-blur-xl ${
          isDark ? 'bg-[#0a0a0b]/95 text-cream' : 'bg-[#f4f1ea]/95 text-[#0a0a0b]'
        } ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-6 text-center">
          {siteConfig.navigation.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-serif text-3xl hover:text-gold transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-6 flex flex-col gap-4 max-w-xs mx-auto w-full">
            <button
              onClick={toggleTheme}
              className={`py-2.5 rounded-full border text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
                isDark
                  ? 'border-white/20 text-gold'
                  : 'border-black/20 text-[#b88d3b]'
              }`}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
              <span>{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 rounded-full border border-gold text-gold text-sm tracking-widest uppercase hover:bg-gold hover:text-[#0a0a0b] transition-all"
            >
              {siteConfig.navigation.ctaText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
