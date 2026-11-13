// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ATTRIBUTION_SNIPPET } from "@/lib/attribution";
import AdsConsent from "@/components/AdsConsent";

export const metadata: Metadata = {
  title: "Konectr: Your plan. New people. Nearby.",
  description:
    "Your plan. New people. Nearby. Post a run, a hike or a coffee and people nearby join you.",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#1F1F1F" },
  ],
  // Google Search Console ownership. Tag renders only once the founder adds
  // NEXT_PUBLIC_GSC_VERIFICATION to Vercel env (no redeploy-time code change).
  verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION },
};

// PostHog product analytics — cookieless (no consent banner needed; PDPA/GDPR
// safe: no cookies/localStorage, users are hashed server-side per day).
// Requires "Cookieless server hash mode" enabled in PostHog project settings.
// Prod-only so preview deploys and local dev never pollute the project.
// The official stub queues capture() calls made before array.js loads, which
// keeps early CTA clicks (Hero.tsx, StoreCTAs.tsx) from dropping.
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
const POSTHOG_ENABLED =
  !!POSTHOG_KEY && process.env.VERCEL_ENV === "production";

const POSTHOG_SNIPPET = `!function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||((p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",p.onerror=function(){p=null},(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init(${JSON.stringify(POSTHOG_KEY)}, {api_host: ${JSON.stringify(POSTHOG_HOST)}, defaults: '2026-05-30', cookieless_mode: 'always'});`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/inter-latin-wght-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        {/* Paid-traffic attribution capture (sessionStorage, first-party, no cookies) */}
        <Script
          id="attribution-capture"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: ATTRIBUTION_SNIPPET }}
        />
        {/* PostHog product analytics (cookieless, prod-only) */}
        {POSTHOG_ENABLED && (
          <Script
            id="posthog"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: POSTHOG_SNIPPET }}
          />
        )}
      </head>
      <body
        className="font-sans antialiased"
      >
        {children}
        {/* Ad pixels + consent banner — renders nothing until pixel env IDs are set */}
        <AdsConsent />
        <Script
          id="remove-vercel-badge"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function removeVercelBadge() {
                var selectors = [
                  'a[href*="vercel.com"][target="_blank"]',
                  'a[href*="vercel.com/home"]',
                  '[data-testid="vercel-badge"]',
                  'a[aria-label*="Vercel"]'
                ];
                selectors.forEach(function(sel) {
                  document.querySelectorAll(sel).forEach(function(el) { el.remove(); });
                });
              }
              document.addEventListener('DOMContentLoaded', removeVercelBadge);
              setTimeout(removeVercelBadge, 1000);
            `,
          }}
        />
      </body>
    </html>
  );
}
