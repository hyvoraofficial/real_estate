# HYVORA — Luxury Architectural Real Estate

> *“Where Earth Meets Elegance”*

A single-page luxury real estate website built with Vite, React, TypeScript, Tailwind CSS, GSAP ScrollTrigger, and Lenis smooth scrolling.

---

## Features & Highlights

- **Scroll-Scrubbed Building Assembly Hero (Pinned)**:
  - 120-frame image sequence scrubbed by scroll position with GSAP ScrollTrigger (`pin: true, scrub: 0.5, end: "+=300%"`).
  - Preloaded with an initial cinematic progress bar (0% to 100%).
  - Smooth cover-fit canvas rendering with high-DPI retina support and procedural fallback.
  - Headline fades in and rises 40px at 65% scrub; canvas scales from 1.0 to 1.08; fades to black at 95% scrub for section hand-off.
- **Refining the Art of Modern Living (Value Cards)**:
  - Masked slide-up reveal for heading typography.
  - 2x2 grid with staggered scroll entrance (`opacity: 0 -> 1, y: 60 -> 0`).
  - Interactive 3D cursor tilt (±4°) and gold hairline border transition on card hover.
- **Gold Colour-Block Wipe Transition**:
  - Full-viewport `#d4a853` warm gold band that wipes up via scrubbed `clip-path: inset(100% 0 0 0)` to `inset(0% 0 0 0)`.
  - 4 outlined luxury benchmark icons and labels fade in when the viewport is enveloped.
- **Interactive Spatial Experience (3D Floor Plans)**:
  - CSS 3D cylindrical carousel (`perspective: 1200px`) with 4 bespoke architectural layouts.
  - Scroll entrance where sheets unfold from angled to flat.
  - Touch/pointer horizontal drag with velocity inertia and spring snap (`back.out`).
  - Interactive gold pill drag hint that stretches on hover to reveal the current plan name.
  - Keyboard navigation (Left / Right arrow keys) and architectural specification modal.
- **Final CTA & Theme Inversion**:
  - Hand-crafted letter-by-letter headline reveal ("Ready to Find Your *Perfect Place*?") staggered at 0.02s.
  - Scrubbed background color inversion from obsidian dark (`#0a0a0b`) to warm ivory (`#f4f1ea`) and dark text.
  - Direct inquiry form and private consultation booking modal.
- **Eased Custom Cursor**:
  - Gold dot that follows mouse with smooth lerp easing.
  - Automatically transforms into a larger gold badge with "DRAG" text over the 3D floor plans.
  - Automatically hidden on touch devices and small viewports.
- **Dark & Light Luxury Themes**:
  - Global theme toggle in the header (Sun/Moon icon with smooth micro-animation) and mobile menu.
  - Dark Theme: Cinematic obsidian (`#0a0a0b`), sleek surfaces (`#111114`), warm gold accents (`#d4a853`), and cream typography (`#f2efe9`).
  - Light Theme: Warm ivory parchment (`#f4f1ea`), crisp white surfaces, antique bronze gold accents (`#b88d3b`), and dark contrast typography (`#0a0a0b`).
  - System preference detection and persistent preference in `localStorage`.
- **Global Smooth Scroll & Accessibility**:
  - Lenis smooth inertia scroll synchronized with GSAP ticker and `ScrollTrigger.update()`.
  - Respects `prefers-reduced-motion` with static states.

---

## Project Structure

```
├── public/
│   ├── favicon.svg             # Luxury gold monogram favicon
│   └── frames/                 # 120 Hero assembly WebP frames (frame_0001.webp - frame_0120.webp)
├── scripts/
│   └── generate_frames.js      # Procedural 120-frame generator using Sharp
├── src/
│   ├── config/
│   │   └── site.ts             # Central configuration (Brand name, copy, links, plans, footer)
│   ├── context/
│   │   └── CursorContext.tsx   # Custom cursor state provider
│   ├── components/
│   │   ├── SmoothScrollProvider.tsx # Lenis + GSAP ScrollTrigger sync provider
│   │   ├── CustomCursor.tsx    # Eased gold cursor with drag mode
│   │   ├── Nav.tsx             # Fixed minimal navigation with backdrop blur
│   │   ├── Hero.tsx            # Pinned canvas sequence hero
│   │   ├── ValueCards.tsx      # 2x2 cards with 3D tilt & masked headings
│   │   ├── ColorBlockTransition.tsx # Gold wipe transition with 4 feature icons
│   │   ├── FloorPlanCarousel.tsx   # 3D drag-with-inertia floor plan set
│   │   ├── FinalCTA.tsx        # Letter reveal, theme inversion & footer
│   │   └── BookingModal.tsx    # Private viewing reservation modal
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css               # Design system tokens, serif typography & utilities
├── tailwind.config.js
└── package.json
```

---

## Configuration & Brand Customization

All copy, brand names, navigation links, and floor plan specifications are centralized in a single file:

```ts
// src/config/site.ts
export const siteConfig = {
  brand: {
    name: "HYVORA",
    monogram: "H",
    tagline: "Where Earth Meets Elegance",
    ...
  },
  navigation: { ... },
  hero: { ... },
  valueSection: { ... },
  colorBlock: { ... },
  floorPlansSection: { ... },
  ctaSection: { ... },
  footer: { ... }
};
```

To rebrand or update copy, simply modify `src/config/site.ts`.

---

## How to Swap In Real Hero Video Frames

The hero expects 120 frames located in `/public/frames/` named `frame_0001.webp` through `frame_0120.webp`.

1. Generate a 3D architectural animation of your building assembling (approx. 5 seconds at 24fps = 120 frames).
2. Export as MP4 (`hero.mp4`).
3. Extract WebP frames using `ffmpeg`:
   ```bash
   ffmpeg -i hero.mp4 -vf "fps=24,scale=1920:-1" -c:v libwebp -quality 85 public/frames/frame_%04d.webp
   ```
4. If you have fewer or more frames, update `hero.totalFrames` in `src/config/site.ts`.
5. To regenerate the default procedural frames anytime, run:
   ```bash
   node scripts/generate_frames.js
   ```

---

## How to Customize Floor Plans

The floor plans are defined in `src/config/site.ts` under `siteConfig.floorPlansSection.plans`.

To replace with custom blueprints:
- Place SVG or vector plans inside `src/components/FloorPlanCarousel.tsx` under `renderBlueprintSvg()`, or
- Pass image URLs directly in the plan object in `siteConfig.floorPlansSection.plans`.

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

The site will be running at `http://localhost:5173`.

### 3. Build for production
```bash
npm run build
```
