import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const OUT_DIR = path.resolve('public/frames');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const WIDTH = 1440;
const HEIGHT = 900;
const TOTAL_FRAMES = 120;

// Helper: easeInOutCubic
function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// Generate SVG string for frame index i (1 to TOTAL_FRAMES)
function generateFrameSvg(frameIndex) {
  const t = (frameIndex - 1) / (TOTAL_FRAMES - 1); // 0.0 to 1.0

  // Central Coordinates
  const centerX = WIDTH / 2;
  const baseY = HEIGHT * 0.88;
  const towerHeight = HEIGHT * 0.75; // ~675px tall

  // WIDE BUILDING: Spanning ~62% of viewport width (860px wide on 1440px canvas)
  const towerWidth = 860;
  const leftWingWidth = 290;
  const rightWingWidth = 290;
  const centerBayWidth = 280;

  const numFloors = 22;
  const floorHeight = towerHeight / numFloors;

  // Sky colors: Dark moody stormy clouds on top, warm amber sunset horizon glow on right
  const skyTop = `rgb(${Math.round(8 + t * 4)}, ${Math.round(8 + t * 4)}, ${Math.round(11 + t * 12)})`;
  const skyBottom = `rgb(${Math.round(18 + t * 12)}, ${Math.round(16 + t * 10)}, ${Math.round(20 + t * 10)})`;
  
  // Sunset horizon glow (especially on the right side as in reference images 2 & 3)
  const amberGlowOpacity = 0.25 + t * 0.35;

  // When t > 0.58, the center building block minimises and moves back in perspective
  const recedeT = clamp((t - 0.58) / 0.42, 0, 1);
  const recedeEase = easeInOutCubic(recedeT);
  const buildingScale = 1.0 - recedeEase * 0.22; // Smoothly minimises from 1.0 to 0.78
  const buildingRecedeY = recedeEase * 18; // Moves back towards horizon

  let horizonSvg = '';
  let buildingSvg = '';

  // 1. Distant Horizon and Skyline Silhouette (Remains full-bleed across background)
  horizonSvg += `
    <!-- Low horizon silhouette with city and trees -->
    <path d="M0,${HEIGHT * 0.84} L120,${HEIGHT * 0.82} L240,${HEIGHT * 0.83} L380,${HEIGHT * 0.8} L520,${HEIGHT * 0.84} L${WIDTH * 0.6},${HEIGHT * 0.84} L${WIDTH * 0.75},${HEIGHT * 0.8} L${WIDTH * 0.88},${HEIGHT * 0.82} L${WIDTH},${HEIGHT * 0.84} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z" fill="#090a0d" opacity="0.85"/>
    <path d="M0,${HEIGHT * 0.87} L160,${HEIGHT * 0.86} L340,${HEIGHT * 0.865} L${WIDTH * 0.65},${HEIGHT * 0.865} L${WIDTH * 0.85},${HEIGHT * 0.855} L${WIDTH},${HEIGHT * 0.87} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z" fill="#0e0f14"/>
  `;

  // 2. Foundation Plinth / Ground Podium
  const plinthWidth = towerWidth * 1.25;
  buildingSvg += `
    <!-- Wide Foundation Plinth -->
    <rect x="${centerX - plinthWidth / 2}" y="${baseY - 18}" width="${plinthWidth}" height="25" fill="#13141a" stroke="#22242f" stroke-width="1.2"/>
    <rect x="${centerX - towerWidth * 0.58}" y="${baseY - 32}" width="${towerWidth * 1.16}" height="14" fill="#181a22" stroke="#2a2c39" stroke-width="1"/>
  `;

  // 3. Central Elevator & Structural Core Tower (Visible especially early on)
  const coreWidth = 140;
  const coreProgress = clamp(t * 1.3, 0, 1);
  const currentCoreH = towerHeight * coreProgress;
  buildingSvg += `
    <!-- Central Heavy Structural Core -->
    <g opacity="${0.6 + (1 - t) * 0.4}">
      <rect x="${centerX - coreWidth / 2}" y="${baseY - currentCoreH}" width="${coreWidth}" height="${currentCoreH}" fill="#14151c" stroke="#2c2e3d" stroke-width="1.5"/>
      <!-- Multi-rail vertical steel elevator shafts -->
      <line x1="${centerX - 45}" y1="${baseY}" x2="${centerX - 45}" y2="${baseY - currentCoreH}" stroke="#3b3e52" stroke-width="2"/>
      <line x1="${centerX - 15}" y1="${baseY}" x2="${centerX - 15}" y2="${baseY - currentCoreH}" stroke="#3b3e52" stroke-width="2"/>
      <line x1="${centerX + 15}" y1="${baseY}" x2="${centerX + 15}" y2="${baseY - currentCoreH}" stroke="#3b3e52" stroke-width="2"/>
      <line x1="${centerX + 45}" y1="${baseY}" x2="${centerX + 45}" y2="${baseY - currentCoreH}" stroke="#3b3e52" stroke-width="2"/>
    </g>
  `;

  // 4. FLOATING 3D SLABS & BEAMS (Image 1 reference: floating wide across the screen)
  if (t < 0.7) {
    const floatEase = easeInOutCubic(clamp(t / 0.65, 0, 1));
    const floatDisperse = (1 - floatEase);

    // Render floating slabs on left and right in 3D perspective
    const floatingItems = [
      { side: -1, xOffset: -520, yOffset: -380, w: 280, h: 42, rot: -24, thick: 20 },
      { side: -1, xOffset: -410, yOffset: -180, w: 320, h: 48, rot: 18, thick: 22 },
      { side: -1, xOffset: -480, yOffset: 40, w: 260, h: 38, rot: -14, thick: 18 },
      { side: -1, xOffset: -320, yOffset: -280, w: 240, h: 36, rot: 28, thick: 16 },
      { side: 1, xOffset: 520, yOffset: -360, w: 310, h: 46, rot: 22, thick: 22 },
      { side: 1, xOffset: 420, yOffset: -160, w: 340, h: 50, rot: -18, thick: 24 },
      { side: 1, xOffset: 490, yOffset: 60, w: 270, h: 40, rot: 15, thick: 18 },
      { side: 1, xOffset: 330, yOffset: -260, w: 250, h: 38, rot: -26, thick: 16 },
    ];

    floatingItems.forEach((item, idx) => {
      const curX = centerX + item.xOffset * floatDisperse + (item.side * (towerWidth * 0.35)) * floatEase;
      const curY = (baseY - towerHeight * 0.5) + item.yOffset * floatDisperse;
      const curRot = item.rot * floatDisperse;
      const opacity = clamp(floatDisperse * 1.5, 0, 1);

      if (opacity > 0.05) {
        buildingSvg += `
          <g transform="translate(${curX}, ${curY}) rotate(${curRot})" opacity="${opacity}">
            <!-- 3D Slab Top Face -->
            <polygon points="0,0 ${item.w},-15 ${item.w + 40},${item.h - 15} 40,${item.h}" fill="#353847" stroke="#4a4e63" stroke-width="1.2"/>
            <!-- 3D Slab Front Face with thickness -->
            <polygon points="40,${item.h} ${item.w + 40},${item.h - 15} ${item.w + 40},${item.h - 15 + item.thick} 40,${item.h + item.thick}" fill="#232530" stroke="#3b3e4f" stroke-width="1"/>
            <!-- 3D Slab Left Face -->
            <polygon points="0,0 40,${item.h} 40,${item.h + item.thick} 0,${item.thick}" fill="#1b1c24" stroke="#303342" stroke-width="1"/>
            <!-- Steel I-Beam flange attached -->
            <rect x="25" y="${item.h + item.thick}" width="16" height="40" fill="#4d3e26" stroke="#d4a853" stroke-width="0.8" opacity="0.8"/>
            <rect x="18" y="${item.h + item.thick + 36}" width="30" height="6" fill="#665233" stroke="#d4a853" stroke-width="0.8" opacity="0.8"/>
          </g>
        `;
      }
    });

    // Floating steel trusses and diagonal beams
    if (t < 0.5) {
      buildingSvg += `
        <g opacity="${(1 - t / 0.5) * 0.9}">
          <!-- Left diagonal I-beam -->
          <line x1="${centerX - 620}" y1="${baseY - 500}" x2="${centerX - 240}" y2="${baseY - 250}" stroke="#424557" stroke-width="14" stroke-linecap="round"/>
          <line x1="${centerX - 620}" y1="${baseY - 500}" x2="${centerX - 240}" y2="${baseY - 250}" stroke="#d4a853" stroke-width="1.5" stroke-dasharray="8,6"/>
          <!-- Right diagonal I-beam -->
          <line x1="${centerX + 620}" y1="${baseY - 480}" x2="${centerX + 260}" y2="${baseY - 220}" stroke="#424557" stroke-width="14" stroke-linecap="round"/>
          <line x1="${centerX + 620}" y1="${baseY - 480}" x2="${centerX + 260}" y2="${baseY - 220}" stroke="#d4a853" stroke-width="1.5" stroke-dasharray="8,6"/>
        </g>
      `;
    }
  }

  // 5. ASSEMBLED WIDE BUILDING: Floors, Cantilevered Balconies, Glass Curtain Wings
  // Building geometry:
  // Center Bay: [centerX - centerBayWidth/2, centerX + centerBayWidth/2]
  // Left Wing: [centerX - towerWidth/2, centerX - centerBayWidth/2]
  // Right Wing: [centerX + centerBayWidth/2, centerX + towerWidth/2]

  const centerLeftX = centerX - centerBayWidth / 2;
  const centerRightX = centerX + centerBayWidth / 2;
  const towerLeftX = centerX - towerWidth / 2;
  const towerRightX = centerX + towerWidth / 2;

  for (let f = 0; f < numFloors; f++) {
    const floorProgressStart = (f / numFloors) * 0.45;
    const floorT = clamp((t - floorProgressStart) / 0.35, 0, 1);
    const floorEase = easeInOutCubic(floorT);

    const targetFloorY = baseY - (f + 1) * floorHeight;
    const disperseY = (1 - floorEase) * (320 + (f % 5) * 70);
    const curFloorY = targetFloorY - disperseY;

    // Floor opacity
    const floorOpacity = clamp(0.25 + floorT * 0.75, 0, 1);

    // Floor slabs & Balcony Plates
    buildingSvg += `
      <g opacity="${floorOpacity}">
        <!-- LEFT WING SLAB -->
        <polygon points="${towerLeftX},${curFloorY + 6} ${centerLeftX},${curFloorY + 2} ${centerLeftX},${curFloorY + 8} ${towerLeftX},${curFloorY + 12}" fill="#262936" stroke="#3d4254" stroke-width="1"/>
        
        <!-- RIGHT WING SLAB -->
        <polygon points="${centerRightX},${curFloorY + 2} ${towerRightX},${curFloorY + 6} ${towerRightX},${curFloorY + 12} ${centerRightX},${curFloorY + 8}" fill="#2b2d38" stroke="#444657" stroke-width="1"/>

        <!-- CENTER CANTILEVERED BALCONY (Projects forward in 3D perspective) -->
        <polygon points="${centerLeftX - 12},${curFloorY} ${centerRightX + 12},${curFloorY} ${centerRightX + 24},${curFloorY + 10} ${centerLeftX - 24},${curFloorY + 10}" fill="#2f3240" stroke="#4e5269" stroke-width="1.2"/>
        <!-- Front edge of balcony plate -->
        <rect x="${centerLeftX - 24}" y="${curFloorY + 10}" width="${centerBayWidth + 48}" height="5" fill="#3a3e50" stroke="#5a5e78" stroke-width="0.8"/>

        <!-- Prominent Architectural Round Columns supporting the balconies (as in Reference Image 2) -->
        ${floorT > 0.65 ? `
          <!-- Left balcony pillar -->
          <rect x="${centerLeftX + 35}" y="${targetFloorY + 15}" width="16" height="${floorHeight - 15}" rx="3" fill="#3c3f52" stroke="#585c75" stroke-width="1"/>
          <!-- Right balcony pillar -->
          <rect x="${centerRightX - 51}" y="${targetFloorY + 15}" width="16" height="${floorHeight - 15}" rx="3" fill="#44475c" stroke="#636782" stroke-width="1"/>
          <!-- Glass Balustrade / Railing across balcony -->
          <rect x="${centerLeftX - 20}" y="${curFloorY - 12}" width="${centerBayWidth + 40}" height="12" fill="url(#balustradeGrad)" opacity="0.75" stroke="#727999" stroke-width="0.6"/>
        ` : ''}

        <!-- Construction Sparks during assembly -->
        ${floorT > 0.25 && floorT < 0.95 && f % 3 === (frameIndex % 3) ? `
          <circle cx="${centerLeftX + 40}" cy="${curFloorY + 5}" r="3.5" fill="#ffb443"/>
          <line x1="${centerLeftX + 30}" y1="${curFloorY + 5}" x2="${centerLeftX + 50}" y2="${curFloorY + 5}" stroke="#fff" stroke-width="1"/>
        ` : ''}
      </g>
    `;

    // 6. GLASS CURTAIN WALL FACADE WINGS (starts around t > 0.35)
    const glassProgressStart = 0.35 + (f / numFloors) * 0.45;
    const glassT = clamp((t - glassProgressStart) / 0.25, 0, 1);
    const glassEase = easeInOutCubic(glassT);

    if (glassEase > 0) {
      const isUpperPenthouse = f >= numFloors - 6;
      const lightProgress = clamp((t - 0.7) / 0.3, 0, 1);

      // Warm interior illumination
      const interiorLight = isUpperPenthouse
        ? `rgba(212, 168, 83, ${0.15 + lightProgress * 0.65})`
        : `rgba(230, 200, 140, ${0.05 + lightProgress * 0.35})`;

      buildingSvg += `
        <g opacity="${glassEase}">
          <!-- LEFT WING CURTAIN GLASS -->
          <polygon points="${towerLeftX + 4},${targetFloorY + 12} ${centerLeftX - 4},${targetFloorY + 8} ${centerLeftX - 4},${targetFloorY + floorHeight} ${towerLeftX + 4},${targetFloorY + floorHeight}" fill="url(#leftGlassGrad)" opacity="0.9"/>
          
          <!-- LEFT WING VERTICAL MULLIONS (Crisp vertical architectural lines) -->
          <line x1="${towerLeftX + 50}" y1="${targetFloorY + 11}" x2="${towerLeftX + 50}" y2="${targetFloorY + floorHeight}" stroke="#474c61" stroke-width="1"/>
          <line x1="${towerLeftX + 100}" y1="${targetFloorY + 10}" x2="${towerLeftX + 100}" y2="${targetFloorY + floorHeight}" stroke="#474c61" stroke-width="1"/>
          <line x1="${towerLeftX + 150}" y1="${targetFloorY + 9}" x2="${towerLeftX + 150}" y2="${targetFloorY + floorHeight}" stroke="#474c61" stroke-width="1"/>
          <line x1="${towerLeftX + 200}" y1="${targetFloorY + 8}" x2="${towerLeftX + 200}" y2="${targetFloorY + floorHeight}" stroke="#474c61" stroke-width="1"/>
          <line x1="${towerLeftX + 250}" y1="${targetFloorY + 8}" x2="${towerLeftX + 250}" y2="${targetFloorY + floorHeight}" stroke="#474c61" stroke-width="1"/>

          <!-- RIGHT WING CURTAIN GLASS (Reflects warm amber twilight sunset glow) -->
          <polygon points="${centerRightX + 4},${targetFloorY + 8} ${towerRightX - 4},${targetFloorY + 12} ${towerRightX - 4},${targetFloorY + floorHeight} ${centerRightX + 4},${targetFloorY + floorHeight}" fill="url(#rightSunsetGlassGrad)" opacity="0.92"/>
          
          <!-- RIGHT WING VERTICAL MULLIONS -->
          <line x1="${centerRightX + 45}" y1="${targetFloorY + 8}" x2="${centerRightX + 45}" y2="${targetFloorY + floorHeight}" stroke="#635544" stroke-width="1"/>
          <line x1="${centerRightX + 95}" y1="${targetFloorY + 9}" x2="${centerRightX + 95}" y2="${targetFloorY + floorHeight}" stroke="#635544" stroke-width="1"/>
          <line x1="${centerRightX + 145}" y1="${targetFloorY + 10}" x2="${centerRightX + 145}" y2="${targetFloorY + floorHeight}" stroke="#635544" stroke-width="1"/>
          <line x1="${centerRightX + 195}" y1="${targetFloorY + 10}" x2="${centerRightX + 195}" y2="${targetFloorY + floorHeight}" stroke="#635544" stroke-width="1"/>
          <line x1="${centerRightX + 245}" y1="${targetFloorY + 11}" x2="${centerRightX + 245}" y2="${targetFloorY + floorHeight}" stroke="#635544" stroke-width="1"/>

          <!-- CENTER TERRACE INTERIOR RECESSED GLASS & LIGHTING -->
          <rect x="${centerLeftX + 10}" y="${targetFloorY + 14}" width="${centerBayWidth - 20}" height="${floorHeight - 16}" fill="${interiorLight}"/>
          <rect x="${centerLeftX + 10}" y="${targetFloorY + 14}" width="${centerBayWidth - 20}" height="${floorHeight - 16}" fill="url(#centerInteriorGrad)" opacity="0.6"/>

          <!-- Warm interior furniture / penthouse salon silhouettes at high completion -->
          ${t > 0.8 && f % 2 === 0 ? `
            <rect x="${centerLeftX + 60}" y="${targetFloorY + floorHeight - 8}" width="${centerBayWidth - 120}" height="4" fill="#d4a853" opacity="0.55"/>
          ` : ''}
        </g>
      `;
    }
  }

  // 7. MONUMENTAL ROOF PAVILION & OVERHANGING CROWN CANOPY (Reference Image 3)
  const crownT = clamp((t - 0.65) / 0.3, 0, 1);
  const crownEase = easeInOutCubic(crownT);
  const crownY = baseY - towerHeight;
  const crownDisperse = (1 - crownEase) * 240;

  // Overhanging roof canopy is wider than the tower itself: 940px wide!
  const canopyWidth = towerWidth + 80; // 940px wide
  const canopyLeftX = centerX - canopyWidth / 2;
  const canopyRightX = centerX + canopyWidth / 2;

  if (crownEase > 0) {
    buildingSvg += `
      <!-- Monumental Overhanging Crown Canopy Structure -->
      <g transform="translate(0, ${-crownDisperse})" opacity="${crownEase}">
        <!-- Cantilevered Overhanging Flat Roof Slab -->
        <polygon points="${canopyLeftX},${crownY - 15} ${canopyRightX},${crownY - 15} ${canopyRightX - 30},${crownY + 8} ${canopyLeftX + 30},${crownY + 8}" fill="#242733" stroke="#4e536b" stroke-width="1.8"/>
        <rect x="${canopyLeftX}" y="${crownY - 24}" width="${canopyWidth}" height="9" fill="#35394a" stroke="#606682" stroke-width="1.2"/>

        <!-- Slanted glass atrium penthouse pavilion beneath canopy -->
        <polygon points="${towerLeftX + 40},${crownY + 8} ${towerRightX - 40},${crownY + 8} ${towerRightX - 80},${crownY + 50} ${towerLeftX + 80},${crownY + 50}" fill="url(#crownGlassGrad)" stroke="#d4a853" stroke-width="1" opacity="0.85"/>

        <!-- Vertical Architectural Spires & Fins (as in Reference Image 3) -->
        <line x1="${centerX - 180}" y1="${crownY - 24}" x2="${centerX - 180}" y2="${crownY - 75}" stroke="#d4a853" stroke-width="2.5"/>
        <line x1="${centerX - 60}" y1="${crownY - 24}" x2="${centerX - 60}" y2="${crownY - 95}" stroke="#d4a853" stroke-width="2.5"/>
        <line x1="${centerX + 60}" y1="${crownY - 24}" x2="${centerX + 60}" y2="${crownY - 95}" stroke="#d4a853" stroke-width="2.5"/>
        <line x1="${centerX + 180}" y1="${crownY - 24}" x2="${centerX + 180}" y2="${crownY - 75}" stroke="#d4a853" stroke-width="2.5"/>

        <!-- Outer beacon antennas -->
        <line x1="${canopyLeftX + 60}" y1="${crownY - 24}" x2="${canopyLeftX + 60}" y2="${crownY - 60}" stroke="#91753c" stroke-width="1.5"/>
        <line x1="${canopyRightX - 60}" y1="${crownY - 24}" x2="${canopyRightX - 60}" y2="${crownY - 60}" stroke="#91753c" stroke-width="1.5"/>

        <!-- Aircraft warning red beacon dots -->
        <circle cx="${centerX - 60}" cy="${crownY - 95}" r="3" fill="#ff4444" opacity="${0.6 + Math.sin(frameIndex * 0.4) * 0.4}"/>
        <circle cx="${centerX + 60}" cy="${crownY - 95}" r="3" fill="#ff4444" opacity="${0.6 + Math.sin(frameIndex * 0.4) * 0.4}"/>

        <!-- Warm golden architectural wash glow under canopy -->
        <polygon points="${towerLeftX + 60},${crownY + 8} ${towerRightX - 60},${crownY + 8} ${towerRightX - 40},${crownY + 80} ${towerLeftX + 40},${crownY + 80}" fill="url(#goldCrownWash)" opacity="${0.25 + crownEase * 0.35}"/>
      </g>
    `;
  }

  // 8. Tower Hairline Architectural Edges & Silhouette (High Completion t > 0.75)
  if (t > 0.75) {
    const edgeT = (t - 0.75) / 0.25;
    buildingSvg += `
      <!-- Warm Gold Hairline Facade Profile Accents -->
      <line x1="${towerLeftX}" y1="${baseY}" x2="${canopyLeftX + 30}" y2="${crownY + 8}" stroke="#d4a853" stroke-width="1.2" opacity="${edgeT * 0.75}"/>
      <line x1="${towerRightX}" y1="${baseY}" x2="${canopyRightX - 30}" y2="${crownY + 8}" stroke="#d4a853" stroke-width="1.2" opacity="${edgeT * 0.75}"/>
      <!-- Center bay boundary vertical lines -->
      <line x1="${centerLeftX}" y1="${baseY}" x2="${centerLeftX}" y2="${crownY + 8}" stroke="#d4a853" stroke-width="0.8" opacity="${edgeT * 0.5}"/>
      <line x1="${centerRightX}" y1="${baseY}" x2="${centerRightX}" y2="${crownY + 8}" stroke="#d4a853" stroke-width="0.8" opacity="${edgeT * 0.5}"/>
    `;
  }

  // Assemble Complete SVG
  return `
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Moody Sky Gradient -->
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${skyTop}" />
          <stop offset="65%" stop-color="${skyBottom}" />
          <stop offset="100%" stop-color="#090a0d" />
        </linearGradient>

        <!-- Warm Sunset Horizon Glow on the Right (as in reference photos) -->
        <radialGradient id="sunsetGlowRight" cx="82%" cy="65%" r="45%">
          <stop offset="0%" stop-color="#d49b4b" stop-opacity="${amberGlowOpacity}" />
          <stop offset="50%" stop-color="#996a33" stop-opacity="${amberGlowOpacity * 0.5}" />
          <stop offset="100%" stop-color="#0a0a0b" stop-opacity="0" />
        </radialGradient>

        <!-- Left Wing Glass Shimmer (Cool twilight slate) -->
        <linearGradient id="leftGlassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#242836" stop-opacity="0.9" />
          <stop offset="50%" stop-color="#3c4359" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#212430" stop-opacity="0.95" />
        </linearGradient>

        <!-- Right Wing Glass Shimmer (Reflecting warm sunset bronze/amber) -->
        <linearGradient id="rightSunsetGlassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#2d2d38" stop-opacity="0.9" />
          <stop offset="60%" stop-color="#544738" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#735a3d" stop-opacity="0.9" />
        </linearGradient>

        <!-- Balustrade Glass Gradient -->
        <linearGradient id="balustradeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#8088ad" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#3b3f54" stop-opacity="0.3" />
        </linearGradient>

        <!-- Center Interior Shimmer -->
        <linearGradient id="centerInteriorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1b1c24" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#0e0f14" stop-opacity="0.8" />
        </linearGradient>

        <!-- Crown Glass Gradient -->
        <linearGradient id="crownGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#353b4d" stop-opacity="0.9" />
          <stop offset="50%" stop-color="#695b45" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#222530" stop-opacity="0.95" />
        </linearGradient>

        <!-- Gold Crown Wash Glow -->
        <linearGradient id="goldCrownWash" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#d4a853" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#d4a853" stop-opacity="0" />
        </linearGradient>

        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Sky Background -->
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#skyGrad)" />

      <!-- Sunset Atmospheric Glow (Right Horizon) -->
      <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="url(#sunsetGlowRight)" />

      <!-- Moody Dark Clouds (Top & Sides) -->
      <ellipse cx="${WIDTH * 0.2}" cy="${HEIGHT * 0.3}" rx="${WIDTH * 0.28}" ry="${HEIGHT * 0.16}" fill="#0d0e14" opacity="0.65" filter="url(#softGlow)"/>
      <ellipse cx="${WIDTH * 0.85}" cy="${HEIGHT * 0.35}" rx="${WIDTH * 0.32}" ry="${HEIGHT * 0.18}" fill="#14131a" opacity="0.6" filter="url(#softGlow)"/>

      <!-- Distant Horizon Skyline (full bleed across background) -->
      ${horizonSvg}

      <!-- Center Building Block ONLY: Minimises and moves back as user scrolls -->
      <g transform="translate(${centerX}, ${baseY}) scale(${buildingScale}) translate(${-centerX}, ${-baseY + buildingRecedeY})">
        ${buildingSvg}
      </g>

      <!-- Ground plane shadow & border (full bleed) -->
      <line x1="0" y1="${baseY + 7}" x2="${WIDTH}" y2="${baseY + 7}" stroke="#181a24" stroke-width="1.5"/>
      <rect x="0" y="${baseY + 8}" width="${WIDTH}" height="${HEIGHT - baseY}" fill="#08080a"/>
    </svg>
  `;
}

// Generate all 120 frames in batch
async function main() {
  console.log(`Generating ${TOTAL_FRAMES} WIDE architectural frames in ${OUT_DIR}...`);
  const startTime = Date.now();

  const batchSize = 10;
  for (let b = 0; b < TOTAL_FRAMES; b += batchSize) {
    const end = Math.min(b + batchSize, TOTAL_FRAMES);
    const promises = [];

    for (let i = b + 1; i <= end; i++) {
      const frameNumStr = String(i).padStart(4, '0');
      const filename = path.join(OUT_DIR, `frame_${frameNumStr}.webp`);
      const svg = generateFrameSvg(i);

      promises.push(
        sharp(Buffer.from(svg))
          .webp({ quality: 88, effort: 3 })
          .toFile(filename)
      );
    }

    await Promise.all(promises);
    process.stdout.write(`\rProgress: ${end} / ${TOTAL_FRAMES} frames generated`);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nAll ${TOTAL_FRAMES} wide frames successfully generated in ${duration}s!`);
}

main().catch(err => {
  console.error("Frame generation error:", err);
  process.exit(1);
});
