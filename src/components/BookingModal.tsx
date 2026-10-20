import React, { useState } from 'react';
import { siteConfig } from '../config/site';
import { useTheme } from '../context/ThemeContext';
import { X, Check, ShieldCheck } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    residence: 'The Penthouse Belvedere',
    date: '',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xl animate-fadeIn ${
      isDark ? 'bg-[#0a0a0b]/80' : 'bg-black/40'
    }`}>
      <div className={`relative w-full max-w-lg rounded-2xl p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.6)] border transition-colors ${
        isDark
          ? 'bg-[#111114] border-gold/30 text-[#f2efe9]'
          : 'bg-[#ffffff] border-black/10 text-[#0a0a0b]'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-6 right-6 transition-colors p-1 ${
            isDark ? 'text-cream/50 hover:text-gold' : 'text-black/50 hover:text-[#b88d3b]'
          }`}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="py-12 flex flex-col items-center text-center space-y-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isDark ? 'bg-gold/15 border border-gold text-gold' : 'bg-[#b88d3b]/15 border border-[#b88d3b] text-[#b88d3b]'
            }`}>
              <Check size={32} />
            </div>
            <h3 className="font-serif text-3xl">Consultation Requested</h3>
            <p className="text-sm opacity-75 max-w-sm leading-relaxed">
              Our Private Client Director will contact you within 2 business hours under confidential protocol.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className={`text-[10px] tracking-ultra uppercase font-semibold ${
                isDark ? 'text-gold' : 'text-[#b88d3b]'
              }`}>
                PRIVATE RESERVATION
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl mt-1">
                Book a Private Viewing
              </h3>
              <p className="text-xs opacity-60 mt-1">
                Discreet in-person presentation or virtual architectural tour.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-[11px] uppercase tracking-wider opacity-60 mb-1">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="Lord / Lady / Dr. / Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full rounded-lg px-4 py-2.5 text-xs focus:outline-none transition-colors border ${
                    isDark
                      ? 'bg-[#18181f] border-white/10 text-cream focus:border-gold'
                      : 'bg-[#f4f1ea] border-black/10 text-[#0a0a0b] focus:border-[#b88d3b]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider opacity-60 mb-1">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="client@familyoffice.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full rounded-lg px-4 py-2.5 text-xs focus:outline-none transition-colors border ${
                      isDark
                        ? 'bg-[#18181f] border-white/10 text-cream focus:border-gold'
                        : 'bg-[#f4f1ea] border-black/10 text-[#0a0a0b] focus:border-[#b88d3b]'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider opacity-60 mb-1">
                    Direct Phone
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 82175 12581"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full rounded-lg px-4 py-2.5 text-xs focus:outline-none transition-colors border ${
                      isDark
                        ? 'bg-[#18181f] border-white/10 text-cream focus:border-gold'
                        : 'bg-[#f4f1ea] border-black/10 text-[#0a0a0b] focus:border-[#b88d3b]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider opacity-60 mb-1">
                  Residence of Interest
                </label>
                <select
                  value={formData.residence}
                  onChange={(e) => setFormData({ ...formData, residence: e.target.value })}
                  className={`w-full rounded-lg px-4 py-2.5 text-xs focus:outline-none transition-colors border ${
                    isDark
                      ? 'bg-[#18181f] border-white/10 text-cream focus:border-gold'
                      : 'bg-[#f4f1ea] border-black/10 text-[#0a0a0b] focus:border-[#b88d3b]'
                  }`}
                >
                  {siteConfig.floorPlansSection.plans.map((p) => (
                    <option key={p.id} value={p.name} className={isDark ? 'bg-[#111114]' : 'bg-[#ffffff]'}>
                      {p.name} ({p.price})
                    </option>
                  ))}
                  <option value="Full Floor Inquire" className={isDark ? 'bg-[#111114]' : 'bg-[#ffffff]'}>
                    Custom Full-Floor Combination
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider opacity-60 mb-1">
                  Preferred Date & Time Window
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full rounded-lg px-4 py-2.5 text-xs focus:outline-none transition-colors border ${
                    isDark
                      ? 'bg-[#18181f] border-white/10 text-cream focus:border-gold'
                      : 'bg-[#f4f1ea] border-black/10 text-[#0a0a0b] focus:border-[#b88d3b]'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] opacity-60 pt-1">
              <ShieldCheck size={14} className={isDark ? 'text-gold' : 'text-[#b88d3b]'} />
              <span>Strict non-disclosure protocol observed.</span>
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 rounded-full font-medium text-xs tracking-widest uppercase transition-all ${
                isDark
                  ? 'bg-gold text-[#0a0a0b] hover:bg-gold-light hover:shadow-[0_0_25px_rgba(212,168,83,0.4)]'
                  : 'bg-[#0a0a0b] text-[#f4f1ea] hover:bg-[#b88d3b] hover:shadow-[0_0_25px_rgba(184,141,59,0.3)]'
              }`}
            >
              Confirm Reservation Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
