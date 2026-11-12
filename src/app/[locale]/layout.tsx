// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { locales, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { APP_STRUCTURED_DATA } from "@/lib/seo";
import { brand } from "@/config/brand";

const baseUrl = "https://konectr.app";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Canonical, hreflang, and OpenGraph/Twitter tags are set PER PAGE via
// buildPageMetadata (src/lib/metadata.ts). Do not add alternates/openGraph
// here: layout-level values shadow every page that doesn't override them,
// which is exactly the every-page-canonicals-to-the-homepage bug this
// replaced (SEO remediation, Aug 2026).
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: "Konectr: Your plan. New people. Nearby.",
      template: "%s | Konectr",
    },
    description:
      "Meet new people in Kuala Lumpur through real activities. Konectr helps you find friends for coffee, hiking, fitness & more. Join free.",
    metadataBase: new URL(baseUrl),
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the locale
  const messages = await getMessages();

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Konectr",
      url: "https://konectr.app",
      logo: "https://konectr.app/logos/konectr-icon-orange.svg",
      // Same source as the footer icons — hand-copied URLs here had drifted
      // from the real profiles.
      sameAs: Object.values(brand.social),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Konectr",
      url: "https://konectr.app",
    },
    APP_STRUCTURED_DATA,
  ];

  return (
    <div lang={locale}>
      {structuredData.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      <NextIntlClientProvider messages={messages}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Navigation />
          {children}
          <Footer />
        </ThemeProvider>
      </NextIntlClientProvider>
    </div>
  );
}
