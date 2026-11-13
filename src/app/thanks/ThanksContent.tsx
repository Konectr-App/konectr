// © Konectr 2026. All rights reserved.
// Client half of /thanks — fires the waitlist conversion event to every
// enabled tracker exactly once, and only after /api/thanks-verify confirms the
// Tally response id (rid) matches a fresh webhook-recorded signup. Anyone
// loading /thanks without a verified rid sees the same page but fires zero
// events. All tracker calls are defensive: PostHog is prod-only, ad pixels are
// consent-gated, so any of these may be absent.

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import StoreCTAs from '@/components/StoreCTAs';
import { mayFireConversion } from './mayFireConversion';

declare global {
  interface Window {
    posthog?: { capture: (event: string, props?: Record<string, unknown>) => void };
  }
}

// Full send_to value for the Google Ads conversion action, e.g. "AW-123/AbCd".
const GADS_CONVERSION_SIGNUP = process.env.NEXT_PUBLIC_GADS_CONVERSION_SIGNUP;

const FIRED_KEY = 'konectr_thanks_fired';

export default function ThanksContent({ rid }: { rid?: string }) {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(FIRED_KEY)) return;
    } catch {
      // storage unavailable — fall through, worst case is a re-fire on refresh
    }
    // No rid means the load didn't come from the Tally redirect — render the
    // page, fire nothing.
    if (!rid) return;

    let cancelled = false;
    let interval: number | undefined;
    let stop: number | undefined;

    const fired = { ph: false, fb: false, g: !GADS_CONVERSION_SIGNUP };
    const attempt = () => {
      try {
        if (!fired.ph && window.posthog) {
          window.posthog.capture('waitlist_joined', { source: 'tally_redirect' });
          fired.ph = true;
        }
        if (!fired.fb && window.fbq) {
          window.fbq('track', 'CompleteRegistration');
          fired.fb = true;
        }
        if (!fired.g && window.gtag) {
          window.gtag('event', 'conversion', { send_to: GADS_CONVERSION_SIGNUP });
          fired.g = true;
        }
        if (fired.ph || fired.fb || fired.g) {
          sessionStorage.setItem(FIRED_KEY, '1');
        }
      } catch {
        // tracking must never break the page
      }
      return fired.ph && fired.fb && fired.g;
    };

    fetch(`/api/thanks-verify?rid=${encodeURIComponent(rid)}`)
      .then((res) => {
        if (cancelled || !mayFireConversion(rid, res.status)) return;
        // Trackers load asynchronously (PostHog afterInteractive, ad pixels
        // only after the consent read) — a single fire races them and loses
        // the conversion. Retry each tracker until it exists, up to 10s; fire
        // each at most once. Session-flagged so refresh never double-counts.
        if (attempt()) return;
        interval = window.setInterval(() => {
          if (attempt()) window.clearInterval(interval);
        }, 500);
        stop = window.setTimeout(() => window.clearInterval(interval), 10_000);
      })
      .catch(() => {
        // verify unreachable — fail closed, fire nothing
      });

    return () => {
      cancelled = true;
      if (interval !== undefined) window.clearInterval(interval);
      if (stop !== undefined) window.clearTimeout(stop);
    };
  }, [rid]);

  return (
    <main className="min-h-[100dvh] bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-10 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Thanks! Konectr is live.
        </h1>
        <p className="text-muted-foreground mb-8">
          Konectr is free on the App Store and Google Play. Get the app and find a plan this week.
        </p>
        <div className="mb-6">
          <StoreCTAs platform={null} source="thanks" />
        </div>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-xl bg-primary text-[#1F1F1F] font-semibold hover:opacity-90"
        >
          Back to konectr.app
        </Link>
      </div>
    </main>
  );
}
