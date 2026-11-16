// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getAllPosts } from "@/lib/notion";
import { allPosts as staticPosts } from "@/content/blog";
import { getIndexablePlans, getPublicHubSlugs } from "@/lib/supabase";

// Plans come and go hourly; rebuild the sitemap instead of freezing it at deploy.
export const revalidate = 3600;

const baseUrl = "https://konectr.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Same dual source as the blog pages: Notion first, static fallback —
  // a Notion-only post must appear here, not just on the rendered index.
  let posts = await getAllPosts();
  if (posts.length === 0) {
    posts = staticPosts;
  }
  const now = new Date();

  // Static pages
  const staticPages = ["", "/about", "/how-it-works", "/safety", "/gamification", "/contact", "/blog", "/faq", "/feedback", "/terms", "/privacy", "/delete-account", "/child-safety"];

  // Generate entries for all locales and static pages
  const staticEntries = staticPages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: page === "" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${baseUrl}/${loc}${page}`])
        ),
      },
    }))
  );

  // Generate entries for all blog posts across all locales; post dates are
  // human-formatted strings, so fall back to build time when unparseable.
  const blogEntries = posts.flatMap((post) => {
    const parsed = new Date(post.date);
    const lastModified = isNaN(parsed.getTime()) ? now : parsed;
    return locales.map((locale) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${baseUrl}/${loc}/blog/${post.slug}`])
        ),
      },
    }));
  });

  // Non-locale campaign / standalone routes (excluded from next-intl routing)
  const standaloneEntries = [
    {
      url: `${baseUrl}/hyrox`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  // Upcoming public plans, so answer engines can cite a joinable /a/ page.
  const planEntries = (await getIndexablePlans()).map((plan) => ({
    url: `${baseUrl}/a/${plan.share_code}`,
    lastModified: now,
    changeFrequency: "hourly" as const,
    priority: 0.7,
  }));

  // Live Konectr Hubs (PF-45); same predicate as the /h/ page, so no 404s.
  const hubEntries = (await getPublicHubSlugs()).map((hub) => ({
    url: `${baseUrl}/h/${hub.slug}`,
    lastModified: new Date(hub.updated_at),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries, ...standaloneEntries, ...planEntries, ...hubEntries];
}
