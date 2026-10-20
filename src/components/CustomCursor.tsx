import React, { useEffect, useRef, useState } from 'react';
import { useCursor } from '../context/CursorContext';
import { useTheme } from '../context/ThemeContext';

export const CustomCursor: React.FC = () => {
  const { cursorType, cursorText } = useCursor();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on non-touch devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    if (isTouch) return;

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    const loop = () => {
      // Smooth lerp easing
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const isDrag = cursorType === 'drag';
  const isHover = cursorType === 'hover';

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor pointer-events-none fixed top-0 left-0 z-50 flex items-center justify-center transition-[width,height,background-color,border-color,opacity] duration-300 ease-luxury ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${
        isDrag
          ? 'w-16 h-16 bg-[#d4a853] text-[#0a0a0b] font-medium text-xs tracking-wider rounded-full shadow-[0_0_30px_rgba(212,168,83,0.6)] ring-1 ring-black/10 backdrop-blur-sm'
          : isHover
          ? `w-10 h-10 bg-transparent border rounded-full ${
              isDark ? 'border-[#d4a853] shadow-[0_0_15px_rgba(212,168,83,0.4)]' : 'border-[#b88d3b] shadow-[0_0_15px_rgba(184,141,59,0.3)] ring-1 ring-black/10'
            }`
          : `w-3 h-3 rounded-full ${
              isDark ? 'bg-[#d4a853] shadow-[0_0_12px_rgba(212,168,83,0.9)]' : 'bg-[#b88d3b] shadow-[0_0_10px_rgba(184,141,59,0.7)] ring-1 ring-black/20'
            }`
      }`}
      style={{ willChange: 'transform' }}
    >
      {isDrag && (
        <span className="select-none uppercase font-semibold text-[10px] tracking-widest text-[#0a0a0b]">
          {cursorText || 'Drag'}
        </span>
      )}
    </div>
  );
};
