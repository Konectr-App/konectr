// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

// Centralized page-metadata builder: self-referencing canonicals, path-correct
// hreflang alternates, and page-specific OpenGraph/Twitter tags on the apex
// host. The [locale] layout deliberately carries NO alternates/openGraph so
// nothing here gets shadowed by layout-level homepage values.

import type { Metadata } from "next";
import { locales } from "@/i18n/config";

export const BASE_URL = "https://konectr.app";

const DEFAULT_OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Konectr: Your plan. New people. Nearby.",
};

// Share-link card for /a/[code] and /r/[code]. The URL must be ABSOLUTE: those
// routes sit outside the [locale] layout that sets metadataBase, so a relative
// path is never resolved — and WhatsApp/iMessage silently drop a non-absolute
// og:image, which is why shared invites unfurled with no picture at all.
export const SHARE_OG_IMAGE = {
  url: `${BASE_URL}/og-share.jpg`,
  width: 1200,
  height: 630,
  alt: "Konectr: Your plan. New people. Nearby.",
};

type PageMetadataInput = {
  locale: string;
  /** Path after the locale prefix, starting with "/" ("" for the homepage). */
  path: string;
  title: string;
  description: string;
  ogType?: "website" | "article";
  /** ISO 8601 date; only emitted when ogType is "article". */
  publishedTime?: string;
  /** Absolute or site-relative image URLs; falls back to the sitewide og-image. */
  images?: string[];
};

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  ogType = "website",
  publishedTime,
  images,
}: PageMetadataInput): Metadata {
  const url = `${BASE_URL}/${locale}${path}`;
  const ogImages = images && images.length > 0 ? images : [DEFAULT_OG_IMAGE.url];

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${BASE_URL}/${loc}${path}`])
      ),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Konectr",
      locale,
      type: ogType,
      ...(ogType === "article" && publishedTime ? { publishedTime } : {}),
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
    },
  };
}

/** Trims a description to 160 chars without rewriting it (meta-description limit). */
export function trimDescription(text: string, max = 160): string {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}
