import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SmoothScrollProvider } from './components/SmoothScrollProvider';
import { CursorProvider } from './context/CursorContext';
import { CustomCursor } from './components/CustomCursor';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { ValueCards } from './components/ValueCards';
import { ColorBlockTransition } from './components/ColorBlockTransition';
import { FloorPlanCarousel } from './components/FloorPlanCarousel';
import { FinalCTA } from './components/FinalCTA';
import { BookingModal } from './components/BookingModal';

export const App: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <ThemeProvider>
      <CursorProvider>
        <SmoothScrollProvider>
          <div className="relative min-h-screen overflow-x-hidden selection:bg-[#d4a853] selection:text-[#0a0a0b] transition-colors duration-500">
            {/* Custom Eased Cursor */}
            <CustomCursor />

            {/* Fixed Minimal Navigation with Theme Toggle */}
            <Nav onOpenBooking={() => setIsBookingOpen(true)} />

            {/* Main Cinematic Scroll Sequence */}
            <main>
              {/* 1. Hero: Scroll-Scrubbed Building Assembly */}
              <Hero />

              {/* 2. Refining the Art of Modern Living (Value Cards) */}
              <ValueCards />

              {/* 3. Gold Colour-Block Transition */}
              <ColorBlockTransition />

              {/* 4. Interactive Spatial Experience (Floor Plans 3D) */}
              <FloorPlanCarousel />

              {/* 5. Final CTA + Theme Inversion + Footer */}
              <FinalCTA onOpenBooking={() => setIsBookingOpen(true)} />
            </main>

            {/* Booking Modal */}
            <BookingModal
              isOpen={isBookingOpen}
              onClose={() => setIsBookingOpen(false)}
            />
          </div>
        </SmoothScrollProvider>
      </CursorProvider>
    </ThemeProvider>
  );
};

export default App;
