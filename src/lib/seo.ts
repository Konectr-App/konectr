// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

// Centralized SEO utilities for structured data generation

import { ANDROID_STORE_URL, IOS_STORE_URL } from "@/lib/smartLink";

const BASE_URL = "https://konectr.app";

type BreadcrumbItem = {
  name: string;
  url: string;
};

/**
 * Generates a BreadcrumbList JSON-LD schema.
 * Pass items in order from root to current page.
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

type HowToStep = {
  name: string;
  text: string;
};

/**
 * Generates a HowTo JSON-LD schema for step-by-step guides.
 */
export function generateHowToSchema(
  name: string,
  description: string,
  steps: HowToStep[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step) => ({
      "@type": "HowToStep",
      name: step.name,
      text: step.text,
    })),
  };
}

/**
 * MobileApplication structured data for the Konectr mobile app (Track A3).
 * MobileApplication is the more specific schema.org subtype of
 * SoftwareApplication for app-store-distributed apps — better for app rich
 * results and AI-engine citation. No aggregateRating: ratings must be genuine
 * and on-page, or Google can issue a manual penalty.
 */
export const APP_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "Konectr",
  operatingSystem: "iOS, Android",
  applicationCategory: "SocialNetworkingApplication",
  downloadUrl: [IOS_STORE_URL, ANDROID_STORE_URL],
  installUrl: [IOS_STORE_URL, ANDROID_STORE_URL],
  description:
    "Konectr is an activity-first social meetup app, live in Kuala Lumpur. Say what you're up for (coffee, a hike, the gym, dinner), when and where, and match with people nearby who want the same thing. No swiping; badges, not star ratings.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "MYR",
  },
  countriesSupported: "MY",
  publisher: {
    "@type": "Organization",
    name: "Konectr",
    url: "https://konectr.app",
  },
  author: {
    "@type": "Organization",
    name: "Konectr",
  },
};
