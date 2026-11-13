import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Alt hostnames that must 308 to the apex canonical host. The primary
// mechanism is Vercel's domain-level redirects (dashboard/API — see
// CLAUDE.md "Domain Redirects"); this app-level list is a safety net so a
// dashboard regression can never serve the full site on a duplicate host
// again. vercel.json redirects do NOT work on Next.js projects — this is
// the only redirect config that belongs in the repo.
const ALT_HOSTS = [
  "www.konectr.app",
  "konectrapp.com",
  "www.konectrapp.com",
  "konectr.my",
  "www.konectr.my",
  "konectrcircle.com",
  "www.konectrcircle.com",
];

// Baseline hardening headers (none were set before 2026-09-23; Vercel already sends HSTS without includeSubDomains — left alone because not every konectr.app subdomain is known to be HTTPS-only).
// No full CSP on purpose: Tally, PostHog, reCAPTCHA and the consent-gated ad
// pixels each need their own allowlist — add one only with a report-only trial.
// frame-ancestors allows tally.so because the waitlist form may land on /thanks
// inside its own iframe on completion.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self' https://tally.so" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  async redirects() {
    return [
      ...ALT_HOSTS.map((host) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: "https://konectr.app/:path*",
        permanent: true,
      })),
      // 🔴 The root MUST redirect permanently. next-intl's middleware sends
      // "/" to the detected locale with a 307, and a 307 tells Google the
      // move is temporary — so Google kept "https://konectr.app/" as the
      // canonical and marked /en "Duplicate, Google chose different
      // canonical than user" (URL Inspection, 2026-09-08). Nothing on the
      // site could be indexed through the homepage. This rule runs before
      // middleware, so the 308 wins. Cost, accepted by the founder: the
      // root no longer content-negotiates — everyone lands on /en and
      // switches locale from the picker. Do not make this temporary.
      { source: "/", destination: "/en", permanent: true },
      // 2026-09-16: the seven untranslated locales were removed (they served
      // byte-identical English). Google has ~160 URLs indexed under each prefix;
      // without these rules the middleware sends /ms/x to /en/ms/x (a 404).
      // Permanent so the duplicates consolidate onto /en.
      {
        source: "/:locale(ms|zh-HK|de|th|ko|ja|vi)",
        destination: "/en",
        permanent: true,
      },
      {
        source: "/:locale(ms|zh-HK|de|th|ko|ja|vi)/:path*",
        destination: "/en/:path*",
        permanent: true,
      },
      // 2026-11-10: two retired blog posts were deleted from
      // src/content/blog/index.ts. Send their indexed URLs to the blog index
      // instead of a 404.
      {
        source: "/en/blog/:slug(strangers-to-friends|vibe-matching-explained)",
        destination: "/en/blog",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
