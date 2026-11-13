// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true
});

export const config = {
  matcher: [
    // Match all pathnames except for
    // - /api routes
    // - /_next (Next.js internals)
    // - /_vercel (Vercel internals)
    // - /a (activity share links - no locale prefix)
    // - /r (referral links - no locale prefix)
    // - /venue-interview (hidden form - no locale prefix)
    // - /unsubscribe (email unsub handler - no locale prefix)
    // - /thanks (Tally waitlist redirect / conversion page - no locale prefix)
    // - /cookies (cookie policy linked from the consent banner - no locale prefix)
    // - /leaderboard (public weekly leaderboard - no locale prefix)
    // - /hyrox (HYROX KL campaign hub - no locale prefix)
    // - /get (store redirect for the landing page QR code - no locale prefix)
    // - /c (campaign hub landings /c/[key] - no locale prefix)
    // - /h (Konectr Hub public pages /h/[slug] - no locale prefix)
    // - Static files (images, etc.)
    '/((?!api|_next|_vercel|a/|r/|c/|h/|venue-interview|unsubscribe|thanks|cookies|leaderboard|hyrox|get$|.*\\..*).*)'
  ]
};
