import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteConfig, type FloorPlan } from '../config/site';
import { useCursor } from '../context/CursorContext';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, ArrowRight, MoveHorizontal } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Helper to draw clean luxury SVG architectural blueprints
const renderBlueprintSvg = (type: string) => {
  switch (type) {
    case 'penthouse':
      return (
        <svg viewBox="0 0 600 420" className="w-full h-full" fill="none" stroke="#1c1e24" strokeWidth="1.2">
          {/* Outer Boundary & Wrap Terrace */}
          <rect x="30" y="30" width="540" height="360" rx="4" stroke="#8b8780" strokeWidth="1" strokeDasharray="4,4" />
          <rect x="70" y="60" width="460" height="300" fill="#fcfbf8" stroke="#1c1e24" strokeWidth="2.5" />

          {/* Compass Rose */}
          <g transform="translate(535, 65)">
            <circle cx="0" cy="0" r="14" stroke="#d4a853" strokeWidth="0.8" />
            <polygon points="0,-12 4,0 0,-3 -4,0" fill="#d4a853" />
            <text x="0" y="-15" textAnchor="middle" fontSize="9" fill="#d4a853" fontFamily="sans-serif" fontWeight="bold">N</text>
          </g>

          {/* Room Partitions */}
          {/* Grand Salon */}
          <rect x="70" y="60" width="260" height="180" stroke="#1c1e24" strokeWidth="1.8" />
          <text x="200" y="130" textAnchor="middle" fontSize="11" fill="#1c1e24" fontFamily="serif" letterSpacing="1">GRAND SALON</text>
          <text x="200" y="148" textAnchor="middle" fontSize="9" fill="#8b8780" fontFamily="sans-serif">32' × 24' • Ceiling 14.5'</text>
          {/* Furniture marks */}
          <rect x="150" y="85" width="100" height="35" rx="3" stroke="#8b8780" strokeWidth="1" />
          <circle cx="200" cy="180" r="22" stroke="#d4a853" strokeWidth="1" fill="none" />

          {/* Master Bedroom Wing */}
          <rect x="330" y="60" width="200" height="150" stroke="#1c1e24" strokeWidth="1.8" />
          <text x="430" y="125" textAnchor="middle" fontSize="11" fill="#1c1e24" fontFamily="serif" letterSpacing="1">PRIMARY SUITE</text>
          <text x="430" y="142" textAnchor="middle" fontSize="9" fill="#8b8780" fontFamily="sans-serif">24' × 18' • Harbor View</text>
          <rect x="390" y="75" width="80" height="40" stroke="#8b8780" strokeWidth="1" />

          {/* Primary Bath & Spa */}
          <rect x="330" y="210" width="200" height="90" stroke="#1c1e24" strokeWidth="1.8" />
          <text x="430" y="250" textAnchor="middle" fontSize="10" fill="#1c1e24" fontFamily="serif">SPA ENSUITE</text>
          <ellipse cx="460" cy="270" rx="20" ry="12" stroke="#d4a853" strokeWidth="1.2" />

          {/* Private Express Elevator Foyer */}
          <rect x="70" y="240" width="120" height="120" stroke="#1c1e24" strokeWidth="1.8" fill="#f4f1ea" />
          <text x="130" y="295" textAnchor="middle" fontSize="10" fill="#1c1e24" fontFamily="serif">PRIVATE FOYER</text>
          <line x1="70" y1="240" x2="190" y2="360" stroke="#8b8780" strokeWidth="0.8" strokeDasharray="2,2" />
          <line x1="190" y1="240" x2="70" y2="360" stroke="#8b8780" strokeWidth="0.8" strokeDasharray="2,2" />

          {/* Chef's Kitchen & Wine Room */}
          <rect x="190" y="240" width="140" height="120" stroke="#1c1e24" strokeWidth="1.8" />
          <text x="260" y="295" textAnchor="middle" fontSize="10" fill="#1c1e24" fontFamily="serif">CHEF'S ATELIER</text>
          <rect x="220" y="320" width="80" height="20" stroke="#8b8780" strokeWidth="1" fill="#fdfcf9" />

          {/* Cantilevered Plunge Pool on Terrace */}
          <rect x="360" y="315" width="160" height="35" rx="2" stroke="#d4a853" strokeWidth="1.5" fill="#f0ebde" />
          <text x="440" y="337" textAnchor="middle" fontSize="9" fill="#b88d3b" fontFamily="sans-serif" letterSpacing="1">HEATED SKY POOL</text>

          {/* Architectural Dimension Marks */}
          <line x1="70" y1="45" x2="530" y2="45" stroke="#8b8780" strokeWidth="0.8" />
          <text x="300" y="42" textAnchor="middle" fontSize="8" fill="#8b8780" fontFamily="sans-serif">92' - 4" OVERALL SPAN</text>
        </svg>
      );
    case 'horizon':
      return (
        <svg viewBox="0 0 600 420" className="w-full h-full" fill="none" stroke="#1c1e24" strokeWidth="1.2">
          <rect x="40" y="40" width="520" height="340" rx="4" stroke="#8b8780" strokeWidth="1" strokeDasharray="4,4" />
          <polygon points="80,70 520,70 470,350 80,350" fill="#fcfbf8" stroke="#1c1e24" strokeWidth="2.5" />
          {/* Compass */}
          <g transform="translate(525, 75)">
            <circle cx="0" cy="0" r="12" stroke="#d4a853" strokeWidth="0.8" />
            <polygon points="0,-10 3,0 0,-2 -3,0" fill="#d4a853" />
            <text x="0" y="-13" textAnchor="middle" fontSize="8" fill="#d4a853" fontFamily="sans-serif">N</text>
          </g>
          {/* Rooms */}
          <rect x="80" y="70" width="220" height="150" stroke="#1c1e24" strokeWidth="1.8" />
          <text x="190" y="140" textAnchor="middle" fontSize="11" fill="#1c1e24" fontFamily="serif" letterSpacing="1">CORNER OBSERVATORY</text>
          <rect x="300" y="70" width="220" height="150" stroke="#1c1e24" strokeWidth="1.8" />
          <text x="410" y="140" textAnchor="middle" fontSize="11" fill="#1c1e24" fontFamily="serif" letterSpacing="1">EXECUTIVE SUITE</text>
          <rect x="80" y="220" width="240" height="130" stroke="#1c1e24" strokeWidth="1.8" />
          <text x="200" y="285" textAnchor="middle" fontSize="11" fill="#1c1e24" fontFamily="serif" letterSpacing="1">GALLERY & DINING</text>
          <polygon points="320,220 490,220 470,350 320,350" stroke="#1c1e24" strokeWidth="1.8" />
          <text x="400" y="285" textAnchor="middle" fontSize="11" fill="#1c1e24" fontFamily="serif" letterSpacing="1">TERRACE LANAI</text>
        </svg>
      );
    case 'duplex':
      return (
        <svg viewBox="0 0 600 420" className="w-full h-full" fill="none" stroke="#1c1e24" strokeWidth="1.2">
          <rect x="50" y="40" width="500" height="340" rx="4" stroke="#8b8780" strokeWidth="1" strokeDasharray="4,4" />
          <rect x="70" y="60" width="460" height="300" fill="#fcfbf8" stroke="#1c1e24" strokeWidth="2.5" />
          {/* Compass */}
          <g transform="translate(530, 65)">
            <circle cx="0" cy="0" r="12" stroke="#d4a853" strokeWidth="0.8" />
            <polygon points="0,-10 3,0 0,-2 -3,0" fill="#d4a853" />
          </g>
          {/* Double height void */}
          <rect x="100" y="90" width="240" height="160" stroke="#d4a853" strokeWidth="1.8" strokeDasharray="6,4" fill="#fbf8f0" />
          <text x="220" y="165" textAnchor="middle" fontSize="11" fill="#b88d3b" fontFamily="serif" letterSpacing="1">DOUBLE-HEIGHT VOID (21 FT)</text>
          {/* Spiral Architectural Staircase */}
          <circle cx="390" cy="170" r="35" stroke="#1c1e24" strokeWidth="1.8" />
          <circle cx="390" cy="170" r="10" stroke="#d4a853" strokeWidth="1" />
          <text x="390" y="225" textAnchor="middle" fontSize="9" fill="#8b8780">MONUMENTAL STAIR</text>
          <rect x="100" y="270" width="400" height="70" stroke="#1c1e24" strokeWidth="1.8" />
          <text x="300" y="310" textAnchor="middle" fontSize="11" fill="#1c1e24" fontFamily="serif" letterSpacing="1">PRIVATE HEATED LAP POOL & LOGGIA</text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 600 420" className="w-full h-full" fill="none" stroke="#1c1e24" strokeWidth="1.2">
          <rect x="50" y="40" width="500" height="340" rx="4" stroke="#8b8780" strokeWidth="1" strokeDasharray="4,4" />
          <rect x="80" y="70" width="440" height="280" fill="#fcfbf8" stroke="#1c1e24" strokeWidth="2.5" />
          <rect x="110" y="90" width="180" height="150" stroke="#1c1e24" strokeWidth="1.8" />
          <text x="200" y="165" textAnchor="middle" fontSize="11" fill="#1c1e24" fontFamily="serif" letterSpacing="1">GARDEN SALON</text>
          <rect x="310" y="90" width="180" height="150" stroke="#1c1e24" strokeWidth="1.8" />
          <text x="400" y="165" textAnchor="middle" fontSize="11" fill="#1c1e24" fontFamily="serif" letterSpacing="1">ZENITH SANCTUARY</text>
          <rect x="110" y="260" width="380" height="70" stroke="#d4a853" strokeWidth="1.8" fill="#f8f5ee" />
          <text x="300" y="300" textAnchor="middle" fontSize="11" fill="#b88d3b" fontFamily="serif" letterSpacing="1">WATER COURTYARD & REFLECTING POOL</text>
        </svg>
      );
  }
};

export const FloorPlanCarousel: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const sheetsGroupRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<FloorPlan | null>(null);

  const { setCursor, resetCursor } = useCursor();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const plans = siteConfig.floorPlansSection.plans;
  const numPlans = plans.length;
  const anglePerPlan = 360 / numPlans; // 90 deg for 4 plans

  // High performance refs for butter-smooth 60/120 FPS transforms without React re-render churn
  const currentAngleRef = useRef<number>(0);
  const activeIndexRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; angle: number; time: number }>({ x: 0, angle: 0, time: 0 });
  const velocityRef = useRef<number>(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Apply rotation angle directly to the DOM with zero React re-render overhead during motion
  const applyRotation = useCallback((angle: number) => {
    currentAngleRef.current = angle;
    if (sheetsGroupRef.current) {
      sheetsGroupRef.current.style.transform = `rotateY(${angle}deg)`;
    }
    // Update active index state only when the dominant face changes
    const normalized = ((-angle % 360) + 360) % 360;
    const newIdx = Math.round(normalized / anglePerPlan) % numPlans;
    if (newIdx !== activeIndexRef.current) {
      activeIndexRef.current = newIdx;
      setActiveIndex(newIdx);
    }
  }, [anglePerPlan, numPlans]);

  // Scroll Entrance: sheets start rotated about ±18deg on X, folded, then unfold to flat
  useEffect(() => {
    if (!sectionRef.current || !sheetsGroupRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sheetsGroupRef.current,
        {
          rotateX: 18,
          scale: 0.88,
          opacity: 0.3,
        },
        {
          rotateX: 0,
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'top 20%',
            scrub: 0.6,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Pointer drag event handlers with silky inertia
  const handlePointerDown = (e: React.PointerEvent) => {
    if (tweenRef.current) {
      tweenRef.current.kill();
    }
    isDraggingRef.current = true;
    setCursor('drag', 'DRAG');
    dragStartRef.current = {
      x: e.clientX,
      angle: currentAngleRef.current,
      time: performance.now(),
    };
    velocityRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const now = performance.now();
    const dt = Math.max(1, now - dragStartRef.current.time);

    // Ultra smooth drag sensitivity
    const degDelta = deltaX * 0.35;
    const newAngle = dragStartRef.current.angle + degDelta;

    velocityRef.current = (degDelta / dt) * 16;
    applyRotation(newAngle);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    resetCursor();
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    // Apply inertia and snap smoothly to nearest card face with power3 deceleration
    const current = currentAngleRef.current;
    const vel = Math.max(-20, Math.min(20, velocityRef.current));
    
    // Target snap calculation
    const predictedAngle = current + vel * 6.5;
    const snapped = Math.round(predictedAngle / anglePerPlan) * anglePerPlan;

    if (tweenRef.current) tweenRef.current.kill();

    const animObj = { angle: current };
    tweenRef.current = gsap.to(animObj, {
      angle: snapped,
      duration: 0.85,
      ease: 'power3.out',
      onUpdate: () => {
        applyRotation(animObj.angle);
      },
      onComplete: () => {
        applyRotation(snapped);
      },
    });
  };

  // Ultra smooth rotational navigation to specific index
  const rotateTo = useCallback((index: number) => {
    if (tweenRef.current) tweenRef.current.kill();

    const current = currentAngleRef.current;
    const targetNominal = -index * anglePerPlan;

    // Calculate shortest rotational delta to avoid awkward full spins
    let delta = (targetNominal - current) % 360;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    const targetAngle = current + delta;
    const animObj = { angle: current };

    tweenRef.current = gsap.to(animObj, {
      angle: targetAngle,
      duration: 0.85,
      ease: 'power3.out',
      onUpdate: () => {
        applyRotation(animObj.angle);
      },
      onComplete: () => {
        applyRotation(targetAngle);
        activeIndexRef.current = index;
        setActiveIndex(index);
      },
    });
  }, [anglePerPlan, applyRotation]);

  const handlePrev = () => {
    const prev = (activeIndexRef.current - 1 + numPlans) % numPlans;
    rotateTo(prev);
  };

  const handleNext = () => {
    const next = (activeIndexRef.current + 1) % numPlans;
    rotateTo(next);
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  const currentPlan = plans[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="plans"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`relative w-full py-14 md:py-20 px-6 md:px-12 overflow-hidden focus:outline-none transition-colors duration-500 ${
        isDark ? 'bg-[#0a0a0b] text-[#f2efe9]' : 'bg-[#f4f1ea] text-[#0a0a0b]'
      }`}
      aria-label="Floor Plans 3D Interactive Carousel"
    >
      {/* Background Soft Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] blur-[150px] pointer-events-none rounded-full transition-opacity duration-500 ${
        isDark ? 'bg-gold/10' : 'bg-gold/20'
      }`} />

      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 md:mb-8 space-y-2">
          <p className={`text-[10px] md:text-xs tracking-ultra uppercase font-medium ${
            isDark ? 'text-gold' : 'text-[#b88d3b]'
          }`}>
            {siteConfig.floorPlansSection.label}
          </p>

          <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[1.1] ${
            isDark ? 'text-cream' : 'text-[#0a0a0b]'
          }`}>
            {siteConfig.floorPlansSection.headingPrefix}{' '}
            <em className={`italic font-normal ${
              isDark ? 'text-gold' : 'text-[#b88d3b]'
            }`}>
              {siteConfig.floorPlansSection.headingAccent}
            </em>
          </h2>

          <p className={`text-xs md:text-sm font-light tracking-wide flex items-center justify-center gap-2 ${
            isDark ? 'text-cream/70' : 'text-[#635f58]'
          }`}>
            <MoveHorizontal size={14} className={`${isDark ? 'text-gold' : 'text-[#b88d3b]'} animate-pulse`} />
            <span>{siteConfig.floorPlansSection.instruction}</span>
          </p>
        </div>

        {/* 3D Carousel Stage */}
        <div
          ref={carouselContainerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onMouseEnter={() => setCursor('drag', 'DRAG')}
          onMouseLeave={() => {
            resetCursor();
            if (isDraggingRef.current) {
              isDraggingRef.current = false;
            }
          }}
          className="relative w-full max-w-4xl h-[420px] sm:h-[460px] md:h-[470px] perspective-1200 cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
        >
          {/* Floating Desktop Side Arrow Left */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous Floor Plan"
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={resetCursor}
            className={`hidden lg:flex absolute left-2 xl:-left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full items-center justify-center transition-all duration-300 shadow-xl cursor-pointer group active:scale-95 ${
              isDark
                ? 'bg-[#15161c]/95 border-2 border-gold/60 text-gold hover:bg-gold hover:text-[#0a0a0b] hover:border-gold hover:shadow-[0_0_25px_rgba(212,168,83,0.5)]'
                : 'bg-white border-2 border-[#b88d3b] text-[#b88d3b] hover:bg-[#b88d3b] hover:text-white hover:border-[#b88d3b] shadow-[0_4px_20px_rgba(0,0,0,0.12)]'
            }`}
          >
            <ArrowLeft size={20} strokeWidth={2.5} className="transition-transform group-hover:-translate-x-0.5" />
          </button>

          {/* Floating Desktop Side Arrow Right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next Floor Plan"
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={resetCursor}
            className={`hidden lg:flex absolute right-2 xl:-right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full items-center justify-center transition-all duration-300 shadow-xl cursor-pointer group active:scale-95 ${
              isDark
                ? 'bg-[#15161c]/95 border-2 border-gold/60 text-gold hover:bg-gold hover:text-[#0a0a0b] hover:border-gold hover:shadow-[0_0_25px_rgba(212,168,83,0.5)]'
                : 'bg-white border-2 border-[#b88d3b] text-[#b88d3b] hover:bg-[#b88d3b] hover:text-white hover:border-[#b88d3b] shadow-[0_4px_20px_rgba(0,0,0,0.12)]'
            }`}
          >
            <ArrowRight size={20} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Rotatable 3D Set */}
          <div
            ref={sheetsGroupRef}
            className="relative w-full max-w-[340px] sm:max-w-[460px] md:max-w-[580px] h-[370px] sm:h-[410px] md:h-[420px] preserve-3d will-change-transform"
            style={{
              transform: 'rotateY(0deg)',
            }}
          >
            {plans.map((plan, i) => {
              const faceAngle = i * anglePerPlan;
              // Radius of carousel cylinder in 3D
              const translateZ = 340;
              const isSelected = i === activeIndex;

              return (
                <div
                  key={plan.id}
                  onClick={() => !isSelected && rotateTo(i)}
                  className={`absolute inset-0 rounded-2xl p-6 sm:p-7 bg-[#fdfcf9] text-[#111114] shadow-dark-sheet border border-gold/30 flex flex-col justify-between transition-all duration-500 backface-hidden cursor-pointer ${
                    isSelected ? 'opacity-100 ring-2 ring-gold/40' : 'opacity-40 hover:opacity-75'
                  }`}
                  style={{
                    transform: `rotateY(${faceAngle}deg) translateZ(${translateZ}px)`,
                    boxShadow: isSelected
                      ? '0 30px 60px -15px rgba(0,0,0,0.8), 0 0 40px rgba(212,168,83,0.35)'
                      : '0 20px 40px rgba(0,0,0,0.6)',
                  }}
                >
                  {/* Blueprint Top Header Bar */}
                  <div className="flex items-start justify-between border-b border-[#111114]/10 pb-3">
                    <div>
                      <span className="text-[10px] tracking-widest uppercase font-semibold text-[#b88d3b]">
                        {plan.level}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl text-[#111114] font-semibold mt-0.5">
                        {plan.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-[#111114]">
                        {plan.price}
                      </span>
                      <p className="text-[10px] text-[#8b8780] font-mono">{plan.area}</p>
                    </div>
                  </div>

                  {/* SVG Blueprint Drawing */}
                  <div className="relative my-auto w-full h-[190px] sm:h-[220px] flex items-center justify-center p-2 bg-[#faf8f4] rounded-lg border border-[#111114]/5 overflow-hidden">
                    {renderBlueprintSvg(plan.svgType)}
                  </div>

                  {/* Blueprint Bottom Spec Tags */}
                  <div className="pt-3 border-t border-[#111114]/10 flex items-center justify-between text-[11px] font-sans text-[#5c5853]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                      {plan.beds}
                    </span>
                    <span>{plan.baths}</span>
                    <span>Ceilings: {plan.ceiling}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlanDetails(plan);
                      }}
                      className="px-2.5 py-1 rounded bg-[#111114] text-[#f2efe9] text-[10px] font-medium hover:bg-gold hover:text-[#0a0a0b] transition-colors"
                    >
                      Specs
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Navigation Arrows & Controls Under Card */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 z-20">
          {/* Previous Arrow Button */}
          <button
            id="carousel-prev-btn"
            onClick={handlePrev}
            aria-label="Previous Floor Plan"
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={resetCursor}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer group active:scale-95 ${
              isDark
                ? 'bg-[#15161c] border-2 border-gold/60 text-gold hover:bg-gold hover:text-[#0a0a0b] hover:border-gold hover:shadow-[0_0_30px_rgba(212,168,83,0.5)]'
                : 'bg-white border-2 border-[#b88d3b] text-[#b88d3b] hover:bg-[#b88d3b] hover:text-white hover:border-[#b88d3b] hover:shadow-[0_4px_25px_rgba(184,141,59,0.35)] shadow-black/10'
            }`}
          >
            <ArrowLeft size={22} strokeWidth={2.5} className="transition-transform group-hover:-translate-x-0.5" />
          </button>

          {/* Dots & Counter Pill */}
          <div className={`flex items-center gap-3.5 px-5 py-2.5 rounded-full border backdrop-blur-md shadow-md transition-colors ${
            isDark 
              ? 'bg-[#15161c]/90 border-gold/30 text-cream' 
              : 'bg-white/95 border-[#b88d3b]/30 text-[#0a0a0b]'
          }`}>
            <span className={`text-xs font-mono font-semibold tracking-wider ${
              isDark ? 'text-gold' : 'text-[#b88d3b]'
            }`}>
              0{activeIndex + 1} <span className={isDark ? 'text-white/30' : 'text-black/30'}>/</span> 0{numPlans}
            </span>

            <div className={`w-[1px] h-3.5 ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />

            <div className="flex items-center gap-2">
              {plans.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => rotateTo(idx)}
                  aria-label={`Go to ${p.name}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    idx === activeIndex
                      ? isDark ? 'w-6 h-2 bg-gold' : 'w-6 h-2 bg-[#b88d3b]'
                      : isDark ? 'w-2 h-2 bg-white/30 hover:bg-white/70' : 'w-2 h-2 bg-black/30 hover:bg-black/70'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Next Arrow Button */}
          <button
            id="carousel-next-btn"
            onClick={handleNext}
            aria-label="Next Floor Plan"
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={resetCursor}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer group active:scale-95 ${
              isDark
                ? 'bg-[#15161c] border-2 border-gold/60 text-gold hover:bg-gold hover:text-[#0a0a0b] hover:border-gold hover:shadow-[0_0_30px_rgba(212,168,83,0.5)]'
                : 'bg-white border-2 border-[#b88d3b] text-[#b88d3b] hover:bg-[#b88d3b] hover:text-white hover:border-[#b88d3b] hover:shadow-[0_4px_25px_rgba(184,141,59,0.35)] shadow-black/10'
            }`}
          >
            <ArrowRight size={22} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Gold Pill Element: Drag Hint at bottom that stretches into a pill on hover and shows plan name */}
        <div className="mt-8 flex justify-center">
          <div
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={resetCursor}
            className={`group relative cursor-pointer flex items-center justify-center transition-all duration-500 ease-luxury px-4 py-2 rounded-full border backdrop-blur-md hover:px-7 ${
              isDark
                ? 'border-gold/40 bg-gold/5 hover:border-gold hover:bg-gold/15 hover:shadow-[0_0_25px_rgba(212,168,83,0.3)] text-gold'
                : 'border-[#b88d3b]/40 bg-[#b88d3b]/10 hover:border-[#b88d3b] hover:bg-[#b88d3b]/20 hover:shadow-[0_0_20px_rgba(184,141,59,0.25)] text-[#b88d3b]'
            }`}
          >
            {/* Dot with arrow icon */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full animate-ping group-hover:hidden ${isDark ? 'bg-gold' : 'bg-[#b88d3b]'}`} />
              <span className={`w-2 h-2 rounded-full group-hover:hidden ${isDark ? 'bg-gold' : 'bg-[#b88d3b]'}`} />
              <MoveHorizontal size={14} className={`${isDark ? 'text-gold' : 'text-[#b88d3b]'} hidden group-hover:block transition-all`} />
              
              {/* Dynamic Plan Name shown on pill stretch */}
              <span className={`text-[11px] font-sans uppercase font-medium tracking-widest whitespace-nowrap ${isDark ? 'text-gold' : 'text-[#b88d3b]'}`}>
                {currentPlan.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Details Modal / Drawer */}
      {selectedPlanDetails && (
        <div className={`fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center p-6 ${
          isDark ? 'bg-[#0a0a0b]/85' : 'bg-black/40'
        }`}>
          <div className={`max-w-lg w-full border rounded-2xl p-8 relative shadow-2xl transition-colors ${
            isDark
              ? 'bg-[#111114] border-gold/30 text-[#f2efe9]'
              : 'bg-[#ffffff] border-black/10 text-[#0a0a0b]'
          }`}>
            <button
              onClick={() => setSelectedPlanDetails(null)}
              className={`absolute top-5 right-5 text-sm uppercase tracking-wider transition-colors ${
                isDark ? 'text-cream/50 hover:text-cream' : 'text-black/50 hover:text-black'
              }`}
            >
              ✕ Close
            </button>
            <span className={`text-[10px] tracking-ultra uppercase font-semibold ${
              isDark ? 'text-gold' : 'text-[#b88d3b]'
            }`}>
              ARCHITECTURAL SPECIFICATION
            </span>
            <h3 className={`font-serif text-2xl md:text-3xl mt-1 mb-3 ${
              isDark ? 'text-cream' : 'text-[#0a0a0b]'
            }`}>
              {selectedPlanDetails.name}
            </h3>
            <p className={`text-xs font-light leading-relaxed mb-6 ${
              isDark ? 'text-cream/70' : 'text-[#555555]'
            }`}>
              {selectedPlanDetails.description}
            </p>

            <div className={`grid grid-cols-2 gap-4 text-xs border-t border-b py-4 mb-6 ${
              isDark ? 'border-white/10' : 'border-black/10'
            }`}>
              <div>
                <span className={`block ${isDark ? 'text-cream/40' : 'text-black/50'}`}>Total Area</span>
                <span className="font-mono font-medium">{selectedPlanDetails.area}</span>
              </div>
              <div>
                <span className={`block ${isDark ? 'text-cream/40' : 'text-black/50'}`}>Ceiling Clearance</span>
                <span className="font-mono font-medium">{selectedPlanDetails.ceiling}</span>
              </div>
              <div>
                <span className={`block ${isDark ? 'text-cream/40' : 'text-black/50'}`}>Bedrooms / Baths</span>
                <span className="font-mono font-medium">{selectedPlanDetails.beds} • {selectedPlanDetails.baths}</span>
              </div>
              <div>
                <span className={`block ${isDark ? 'text-cream/40' : 'text-black/50'}`}>Private Terrace</span>
                <span className="font-mono font-medium">{selectedPlanDetails.terrace}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className={`text-[10px] uppercase ${isDark ? 'text-cream/40' : 'text-black/50'}`}>Valuation</span>
                <p className={`font-serif text-xl ${isDark ? 'text-gold' : 'text-[#b88d3b]'}`}>{selectedPlanDetails.price}</p>
              </div>
              <button
                onClick={() => setSelectedPlanDetails(null)}
                className={`px-6 py-2.5 rounded-full font-medium text-xs tracking-wider uppercase transition-colors ${
                  isDark
                    ? 'bg-gold text-[#0a0a0b] hover:bg-gold-light'
                    : 'bg-[#0a0a0b] text-[#f4f1ea] hover:bg-[#b88d3b]'
                }`}
              >
                Inquire Layout
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
