// © Konectr 2026. All rights reserved.
// Thank-you page — the Tally waitlist form redirects here on completion,
// which turns a cross-origin iframe submit into a first-party, pixel-trackable
// conversion URL. Outside [locale] on purpose: Tally accepts exactly one
// redirect URL. Excluded from locale routing in src/middleware.ts.

import type { Metadata } from 'next';
import ThanksContent from './ThanksContent';

export const metadata: Metadata = {
  title: 'Thanks | Konectr',
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ rid?: string }>;
}

export default async function ThanksPage({ searchParams }: Props) {
  // rid = Tally response id, piped into the redirect URL by the Tally form.
  // ThanksContent fires conversion pixels only after /api/thanks-verify
  // confirms it; without it the page renders identically but fires nothing.
  const { rid } = await searchParams;
  return <ThanksContent rid={rid} />;
}
