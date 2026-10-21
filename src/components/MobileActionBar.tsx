import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Calendar, Compass } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSmoothScroll } from './SmoothScrollProvider';
import { siteConfig } from '../config/site';

interface MobileActionBarProps {
  onOpenBooking: () => void;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({ onOpenBooking }) => {
  const { theme } = useTheme();
  const { scrollTo } = useSmoothScroll();
  const isDark = theme === 'dark';
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Phone and WhatsApp numbers from config
  const rawPhone = siteConfig.footer.contacts.phone.replace(/[^0-9+]/g, '');
  const encodedWhatsappMsg = encodeURIComponent(
    `Hello HYVORA, I would like to inquire about the Private Residences at ${siteConfig.brand.name}.`
  );
  const whatsappUrl = `https://wa.me/${rawPhone.replace('+', '')}?text=${encodedWhatsappMsg}`;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show at the top or bottom of page
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY + 15) {
        // Scrolling down: keep accessible for prospective buyers
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY - 10) {
        // Scrolling up
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <aside
      aria-label="Mobile Quick Actions"
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-all duration-300 ease-luxury ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
      }`}
    >
      {/* Floating Island Container with Safe Area Inset */}
      <div className="px-3 pb-3 pt-1">
        <div
          className={`relative mx-auto max-w-md rounded-2xl p-2 flex items-center justify-between gap-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.55)] border backdrop-blur-2xl transition-all duration-500 ${
            isDark
              ? 'bg-[#0e0e12]/92 border-gold/30 text-[#f2efe9]'
              : 'bg-[#f4f1ea]/92 border-[#b88d3b]/30 text-[#0a0a0b] shadow-[0_10px_35px_rgba(0,0,0,0.15)]'
          }`}
        >
          {/* Subtle gold ambient glow */}
          <div
            className={`absolute inset-0 rounded-2xl pointer-events-none opacity-40 transition-opacity ${
              isDark
                ? 'bg-gradient-to-r from-gold/10 via-transparent to-gold/10'
                : 'bg-gradient-to-r from-gold/15 via-transparent to-gold/15'
            }`}
          />

          {/* Quick Call Action */}
          <a
            href={`tel:${rawPhone}`}
            aria-label="Call Private Client Desk"
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all active:scale-95 group ${
              isDark
                ? 'hover:bg-white/5 text-[#f2efe9]/80 hover:text-gold active:bg-white/10'
                : 'hover:bg-black/5 text-[#0a0a0b]/80 hover:text-[#b88d3b] active:bg-black/10'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-0.5 border transition-colors ${
                isDark
                  ? 'border-white/10 bg-white/5 text-gold group-hover:border-gold'
                  : 'border-black/10 bg-black/5 text-[#b88d3b] group-hover:border-[#b88d3b]'
              }`}
            >
              <Phone size={15} />
            </div>
            <span className="text-[10px] font-mono tracking-wider uppercase font-medium">
              Call
            </span>
          </a>

          {/* WhatsApp Direct Chat Action */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all active:scale-95 group ${
              isDark
                ? 'hover:bg-white/5 text-[#f2efe9]/80 hover:text-emerald-400 active:bg-white/10'
                : 'hover:bg-black/5 text-[#0a0a0b]/80 hover:text-emerald-600 active:bg-black/10'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-0.5 border transition-colors ${
                isDark
                  ? 'border-white/10 bg-white/5 text-emerald-400 group-hover:border-emerald-400'
                  : 'border-black/10 bg-black/5 text-emerald-600 group-hover:border-emerald-600'
              }`}
            >
              <MessageCircle size={15} />
            </div>
            <span className="text-[10px] font-mono tracking-wider uppercase font-medium">
              WhatsApp
            </span>
          </a>

          {/* Floor Plans Quick Scroll */}
          <button
            onClick={() => {
              const plansEl = document.getElementById('plans');
              if (plansEl) scrollTo(plansEl, -60);
            }}
            aria-label="View Floor Plans"
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all active:scale-95 group ${
              isDark
                ? 'hover:bg-white/5 text-[#f2efe9]/80 hover:text-gold active:bg-white/10'
                : 'hover:bg-black/5 text-[#0a0a0b]/80 hover:text-[#b88d3b] active:bg-black/10'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-0.5 border transition-colors ${
                isDark
                  ? 'border-white/10 bg-white/5 text-gold group-hover:border-gold'
                  : 'border-black/10 bg-black/5 text-[#b88d3b] group-hover:border-[#b88d3b]'
              }`}
            >
              <Compass size={15} />
            </div>
            <span className="text-[10px] font-mono tracking-wider uppercase font-medium">
              3D Plans
            </span>
          </button>

          {/* Primary CTA: Book a Private Viewing */}
          <button
            onClick={onOpenBooking}
            aria-label="Book a Private Viewing"
            className={`flex-[1.5] py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 font-sans text-xs uppercase tracking-wider font-semibold active:scale-95 shadow-lg ${
              isDark
                ? 'bg-gradient-to-r from-[#d4a853] to-[#e6c57d] text-[#0a0a0b] shadow-[0_4px_20px_rgba(212,168,83,0.4)] hover:brightness-110'
                : 'bg-gradient-to-r from-[#b88d3b] to-[#d4a853] text-[#fdfcf9] shadow-[0_4px_20px_rgba(184,141,59,0.35)] hover:brightness-110'
            }`}
          >
            <Calendar size={14} className="shrink-0" />
            <span className="whitespace-nowrap font-medium text-[11px] sm:text-xs">
              Book Visit
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};
