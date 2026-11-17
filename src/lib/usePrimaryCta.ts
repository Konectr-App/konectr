// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

"use client";

import { useEffect, useState } from "react";
import { ANDROID_STORE_URL, IOS_STORE_URL, detectPlatform, type Platform } from "@/lib/smartLink";

type PosthogLike = { capture: (event: string, props?: Record<string, unknown>) => void };
function capture(event: string, props: Record<string, unknown>) {
  (window as unknown as { posthog?: PosthogLike }).posthog?.capture(event, props);
}

export type PrimaryCta = {
  href: string;
  label: string;
  id?: string;
  onClick?: () => void;
};

/**
 * The one "get Konectr" destination for every marketing CTA (hero, nav, section
 * buttons). Android → Google Play; iOS, desktop and the server render (platform
 * not yet known) → the App Store.
 *
 * No next-intl dependency, so pages outside [locale] (e.g. /hyrox) can use it.
 * `source` tags the click event so hero vs nav vs section clicks are separable.
 */
export function usePrimaryCta(source: string): PrimaryCta {
  const [platform, setPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    // Platform reads navigator, so it must be detected after hydration; a lazy
    // initial state would diverge from the SSR (null → App Store) markup.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlatform(detectPlatform());
  }, []);

  if (platform === "android") {
    return {
      href: ANDROID_STORE_URL,
      label: "Get it on Google Play",
      id: source === "home_hero" ? "cta-play" : undefined,
      onClick: () => capture("clicked_beta_cta", { mode: "open", platform: "android", source }),
    };
  }
  return {
    href: IOS_STORE_URL,
    label: "Download on the App Store",
    id: source === "home_hero" ? "cta-testflight" : undefined,
    onClick: () => capture("clicked_testflight_cta", { platform, source }),
  };
}
