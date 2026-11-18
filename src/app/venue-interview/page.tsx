// © Konectr 2026. All rights reserved.
// Hidden venue discovery interview form — not indexed, not linked from nav

import type { Metadata } from "next";
import { formKeyRequired } from "@/lib/formKey";
import VenueInterviewForm from "./VenueInterviewForm";

export const metadata: Metadata = {
  title: "Venue Discovery Interview — Konectr",
  robots: { index: false, follow: false },
};

// Read on each request, so setting or rotating the key needs no rebuild of this page.
export const dynamic = "force-dynamic";

export default function VenueInterviewPage() {
  // Only whether a key is needed reaches the browser, never the key (#257). formKeyRequired reads the
  // env var the way the API check does, so the field shows exactly when a request would be refused.
  return <VenueInterviewForm keyRequired={formKeyRequired(process.env.INTERVIEW_FORM_KEY)} />;
}
