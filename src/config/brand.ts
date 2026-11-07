// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

// Konectr Brand Configuration
// Reference: Mobile app kinetic_colors.dart

export const brand = {
  name: "Konectr",
  tagline: "Real adventures with real people, right now.",
  launchDate: "June 2026",

  colors: {
    // Primary palette
    sunsetOrange: "#FF774D",
    solarAmber: "#FFC845",
    graphiteGrey: "#1F1F1F",
    cloudWhite: "#FAFAFA",

    // Gradients
    gradientPrimary: "linear-gradient(135deg, #FF774D 0%, #ff5722 100%)",
    gradientSecondary: "linear-gradient(135deg, #FFC845 0%, #fbbf24 100%)",
  },

  fonts: {
    heading: "'Satoshi', sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },

  social: {
    facebook: "https://www.facebook.com/Konectr/about",
    instagram: "https://www.instagram.com/konectr.app/",
    twitter: "https://www.x.com/konectrapp",
    linkedin: "https://www.linkedin.com/company/konectr/",
    tiktok: "https://www.tiktok.com/@konectrapp",
  },

  contact: {
    email: "hello@konectr.app",
  },

  assets: {
    logoOrange:
      "https://cdn.prod.website-files.com/6857df346d4e4bd260786fbd/686328457e3945d8a146fbaf_Konectr_Orange_SSVG_2.avif",
    logoWhite:
      "https://cdn.prod.website-files.com/6857df346d4e4bd260786fbd/68632845dc59b4147eb517f6_Konectr_NoBG_Logo.svg",
  },

  waitlist: {
    tallyFormId: "mY1xRq",
    tallyEmbedUrl:
      "https://tally.so/embed/mY1xRq?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1",
  },
} as const;

export type BrandColors = typeof brand.colors;
export type BrandSocial = typeof brand.social;
