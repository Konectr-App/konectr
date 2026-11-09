// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContactContent } from "./ContactContent";
import { generateBreadcrumbSchema } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/contact",
    title: "Contact Konectr — Venues, Press & Support",
    description:
      "Get in touch with the Konectr team in Kuala Lumpur: venues, press, feedback, and support.",
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    { name: "Contact", url: `/${locale}/contact` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHeader
        title="Get in Touch"
        subtitle="We'd love to hear from you"
        badge="Contact Us"
      />
      <ContactContent />
    </>
  );
}
