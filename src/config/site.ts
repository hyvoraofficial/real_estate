export interface NavLink {
  label: string;
  href: string;
}

export interface ValueCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  tag: string;
}

export interface ColorBlockFeature {
  icon: string;
  title: string;
  detail: string;
}

export interface FloorPlan {
  id: string;
  name: string;
  tagline: string;
  level: string;
  area: string;
  beds: string;
  baths: string;
  ceiling: string;
  terrace: string;
  price: string;
  svgType: 'penthouse' | 'horizon' | 'duplex' | 'pavilion';
  description: string;
}

export interface SiteConfig {
  brand: {
    name: string;
    monogram: string;
    tagline: string;
    taglineHtml: string; // Contains <em> for gold italic accent
    establishedYear: number;
  };
  navigation: {
    links: NavLink[];
    ctaText: string;
  };
  hero: {
    totalFrames: number;
    framePathPrefix: string;
    headline: string;
    headlineAccent: string;
    subheadline: string;
    scrollIndicatorText: string;
  };
  valueSection: {
    eyebrow: string;
    headingPrefix: string;
    headingAccent: string;
    subtext: string;
    cards: ValueCard[];
  };
  colorBlock: {
    quote: string;
    features: ColorBlockFeature[];
  };
  floorPlansSection: {
    label: string;
    headingPrefix: string;
    headingAccent: string;
    instruction: string;
    plans: FloorPlan[];
  };
  ctaSection: {
    eyebrow: string;
    headingPrefix: string;
    headingAccent: string;
    subtext: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    consultationNotice: string;
  };
  footer: {
    description: string;
    locations: { city: string; address: string }[];
    contacts: {
      inquiries: string;
      press: string;
      phone: string;
    };
    copyright: string;
    legalLinks: { label: string; href: string }[];
  };
}

export const siteConfig: SiteConfig = {
  brand: {
    name: "HYVORA",
    monogram: "H",
    tagline: "Where Earth Meets Elegance",
    taglineHtml: "Where Earth Meets <em>Elegance</em>",
    establishedYear: 2024,
  },

  navigation: {
    links: [
      { label: "Residences", href: "#properties" },
      { label: "Philosophy", href: "#philosophy" },
      { label: "Floor Plans", href: "#plans" },
      { label: "Inquire", href: "#contact" },
    ],
    ctaText: "Book a Visit",
  },

  hero: {
    totalFrames: 120,
    framePathPrefix: "/frames/frame_",
    headline: "Where Earth Meets",
    headlineAccent: "Elegance",
    subheadline: "An architectural landmark sculpted from monolithic titanium, crystalline glass, and timeless poise.",
    scrollIndicatorText: "Scroll to Assemble",
  },

  valueSection: {
    eyebrow: "A NEW HORIZON OF OPULENCE",
    headingPrefix: "Refining the Art of",
    headingAccent: "Modern Living",
    subtext: "Every square meter is calibrated for effortless tranquility, rare architectural pedigree, and panoramic privacy above the metropolis.",
    cards: [
      {
        id: "curated-properties",
        title: "Curated Properties",
        description: "Bespoke sky villas and waterfront sanctuaries handpicked for connoisseurs of rare architectural scale.",
        icon: "Building2",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
        tag: "Tier-One Portfolio",
      },
      {
        id: "verified-listings",
        title: "Verified Listings",
        description: "Every asset passes forensic biometric deed verification, engineering audits, and discreet legal provenance.",
        icon: "ShieldCheck",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
        tag: "100% Certified",
      },
      {
        id: "end-to-end-support",
        title: "End-to-End Support",
        description: "Dedicated private family office concierge managing off-market acquisition, tax structuring, and bespoke interior commissioning.",
        icon: "Compass",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
        tag: "Discreet Concierge",
      },
      {
        id: "neighborhood-insights",
        title: "Neighborhood Insights",
        description: "Predictive micro-market intelligence, direct helipad clearance, private marina moorings, and cultural enclave proximity.",
        icon: "MapPin",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
        tag: "Macro Intelligence",
      },
    ],
  },

  colorBlock: {
    quote: "A symphony of bronze, cantilevered stone, and twilight air.",
    features: [
      {
        icon: "Plane",
        title: "Private Helipad",
        detail: "Direct rooftop transit connection with 4-minute downtown clearance",
      },
      {
        icon: "ConciergeBell",
        title: "24/7 Butler & Sommelier",
        detail: "White-glove private dining and rare vintage cellar management",
      },
      {
        icon: "Leaf",
        title: "LEED Platinum",
        detail: "Geothermal climate envelope and ultra-pure air filtration",
      },
      {
        icon: "Sparkles",
        title: "Italian Stone Finishes",
        detail: "Bookmatched Calacatta marble and handcrafted brushed brass",
      },
    ],
  },

  floorPlansSection: {
    label: "FLOOR PLANS",
    headingPrefix: "Interactive Spatial",
    headingAccent: "Experience",
    instruction: "Click and drag to explore residences in 3D space",
    plans: [
      {
        id: "penthouse-belvedere",
        name: "The Penthouse Belvedere",
        tagline: "Triplex Crown Jewel with 360° Infinity Terrace",
        level: "Level 68 - 70",
        area: "8,450 sq ft / 785 m²",
        beds: "5 Bedroom Suites",
        baths: "6.5 Baths",
        ceiling: "14.5 ft / 4.4 m",
        terrace: "2,100 sq ft Private Deck",
        price: "From $28,500,000",
        svgType: "penthouse",
        description: "Featuring a 22-foot double-height salon, private express glass elevator, sky spa with heated plunge pool, and panoramic view of the harbor skyline.",
      },
      {
        id: "horizon-sky-suite",
        name: "The Horizon Sky Suite",
        tagline: "Panoramic Corner Sanctuary with Cantilevered Balconies",
        level: "Level 52 - 54",
        area: "5,820 sq ft / 540 m²",
        beds: "4 Bedroom Suites",
        baths: "4.5 Baths",
        ceiling: "12.0 ft / 3.65 m",
        terrace: "950 sq ft Wrap Terrace",
        price: "From $18,200,000",
        svgType: "horizon",
        description: "Designed for effortless entertaining with seamless indoor-outdoor transitions, a chef's show kitchen with Boffi cabinetry, and a primary sanctuary with dual steam suites.",
      },
      {
        id: "aurora-grand-duplex",
        name: "The Aurora Grand Duplex",
        tagline: "Double-Height Atrium with Private Heated Lap Pool",
        level: "Level 38 - 40",
        area: "10,200 sq ft / 947 m²",
        beds: "6 Bedroom Suites",
        baths: "7.5 Baths",
        ceiling: "21.0 ft / 6.4 m",
        terrace: "3,200 sq ft Garden Terrace",
        price: "From $34,000,000",
        svgType: "duplex",
        description: "The grandest estate within the tower: bespoke bronze architectural staircase, interior botanical atrium, temperature-controlled 1,200 bottle wine vault, and full staff quarters.",
      },
      {
        id: "zenith-garden-pavilion",
        name: "The Zenith Garden Pavilion",
        tagline: "Suspended Terrace Oasis with Reflecting Pools",
        level: "Level 22 - 24",
        area: "4,600 sq ft / 427 m²",
        beds: "3 Bedroom Suites",
        baths: "3.5 Baths",
        ceiling: "11.5 ft / 3.5 m",
        terrace: "1,400 sq ft Water Garden",
        price: "From $14,800,000",
        svgType: "pavilion",
        description: "Serene low-altitude residence enveloped in living Japanese maple trees, floating acoustic water courtyards, and tranquil light wells designed for meditative luxury.",
      },
    ],
  },

  ctaSection: {
    eyebrow: "PRIVATE ACQUISITION",
    headingPrefix: "Ready to Find Your",
    headingAccent: "Perfect Place?",
    subtext: "Private viewings are arranged strictly by private invitation or qualified family office inquiry. Discover available residences before public release.",
    primaryButtonText: "Book a Private Viewing",
    secondaryButtonText: "Download Confidential Monograph",
    consultationNotice: "All inquiries are bound by non-disclosure and handled exclusively by our private partners.",
  },

  footer: {
    description: "HYVORA is a premier private real estate development advisory specializing in landmark residential architecture across key global capitals.",
    locations: [
      { city: "New York", address: "740 Fifth Avenue, Floor 42" },
      { city: "London", address: "14 Berkeley Square, Mayfair" },
      { city: "Geneva", address: "18 Quai du Mont-Blanc" },
      { city: "Dubai", address: "Gate Village 03, DIFC" },
    ],
    contacts: {
      inquiries: "contact.hyvora@gmail.com",
      press: "contact.hyvora@gmail.com",
      phone: "+91 8217512581",
    },
    copyright: "© 2026 HYVORA. All rights reserved.",
    legalLinks: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Agency", href: "#" },
      { label: "Anti-Money Laundering", href: "#" },
      { label: "Code of Ethics", href: "#" },
    ],
  },
};
