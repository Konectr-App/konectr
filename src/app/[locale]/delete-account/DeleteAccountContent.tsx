// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
//
// EVERY CLAIM ON THIS PAGE MUST MATCH WHAT process_account_deletions() ACTUALLY
// DOES. See docs/ACCOUNT_DELETION_DESIGN.md in the konectr-mvp repo.
//
// In particular, the founder decision on messages (D1) is that message CONTENT is
// KEPT and only the identity is detached. This page says so plainly and must not
// be softened into implying full erasure — that would be the misrepresentation
// Google Play removes apps for, and it would be untrue.

"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";

const inApp = [
  "Open Konectr and go to the You tab (Profile on versions before 2.1)",
  "Tap Settings (the gear)",
  "Scroll to the bottom and tap Delete account",
  "Confirm — your profile is hidden from everyone straight away",
];

const removed = [
  "Your name, photos, bio, interests, languages, prompt answers and date of birth",
  "Your email address and phone number",
  "Your profile, cover and pinned photos, deleted from our storage",
  "Your availability, moods, streaks, stats and badges",
  "Your Circle, circle lists and pending circle requests",
  "Your notification settings and notification tokens",
  "Your referral code and rewards",
];

const anonymised = [
  {
    what: "Messages you sent",
    detail:
      "The messages stay in the conversations you were part of, so the other people's chat history still makes sense. They are no longer linked to you, your name or your profile — they appear from a deleted user.",
  },
  {
    what: "Activities you joined",
    detail:
      "Attendance records stay so that other people's plans keep the right number of people. Your identity is removed from them.",
  },
  {
    what: "Venue photos and edits you contributed",
    detail: "Kept for the venue, no longer attributed to you.",
  },
];

const retained = [
  {
    what: "Safety reports and violations",
    detail:
      "If you reported someone, or were reported, we keep that record. Deleting an account must not be a way to erase a report about you. Your identity is removed from reports you filed.",
  },
  {
    what: "Blocks placed against you",
    detail:
      "If someone blocked you, that block stays, so they remain protected.",
  },
  {
    what: "A record that the deletion happened",
    detail:
      "We keep proof that you asked and that we acted, with no personal details attached.",
  },
];

export function DeleteAccountContent() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-12"
      >
        {/* In-app route */}
        <section>
          <h2 className="mb-3 text-2xl font-bold">Delete in the app</h2>
          <p className="mb-5 text-muted-foreground">
            This is the fastest way and it takes about ten seconds.
          </p>
          <ol className="space-y-3">
            {inApp.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* No-app route — the reason this page is required */}
        <section>
          <h2 className="mb-3 text-2xl font-bold">
            Deleting without the app
          </h2>
          <p className="mb-4 text-muted-foreground">
            If you have uninstalled Konectr or cannot sign in, email us and we
            will do it for you. You do not need to reinstall anything.
          </p>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="mb-2">
              Email{" "}
              <a
                href="mailto:privacy@konectr.app?subject=Account%20deletion%20request"
                className="font-semibold text-primary underline underline-offset-4"
              >
                privacy@konectr.app
              </a>{" "}
              from the address you signed up with, with the subject{" "}
              <span className="font-medium">Account deletion request</span>.
            </p>
            <p className="text-sm text-muted-foreground">
              We reply within 5 working days. We may ask one question to confirm
              it is really your account — that is to stop someone else deleting
              it.
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section>
          <h2 className="mb-3 text-2xl font-bold">What happens, and when</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="font-semibold">Straight away</p>
              <p className="text-muted-foreground">
                Your profile disappears. Nobody can find you, match with you or
                message you. You are signed out.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="font-semibold">For the next 30 days</p>
              <p className="text-muted-foreground">
                You can change your mind. Sign back in and cancel the deletion,
                and everything comes back exactly as it was. Nothing is erased
                during this period.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="font-semibold">After 30 days</p>
              <p className="text-muted-foreground">
                Your personal data is permanently erased. This cannot be undone
                and we cannot recover it for you afterwards.
              </p>
            </div>
          </div>
        </section>

        {/* Deleted */}
        <section>
          <h2 className="mb-3 text-2xl font-bold">What is permanently deleted</h2>
          <ul className="space-y-2">
            {removed.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1 text-primary">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Anonymised — the honest part */}
        <section>
          <h2 className="mb-3 text-2xl font-bold">
            What stays, without your name on it
          </h2>
          <p className="mb-5 text-muted-foreground">
            Some things involve other people, so removing them outright would
            damage their experience. We keep these, but they are no longer
            connected to you.
          </p>
          <div className="space-y-4">
            {anonymised.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-5"
              >
                <p className="font-semibold">{item.what}</p>
                <p className="text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Retained */}
        <section>
          <h2 className="mb-3 text-2xl font-bold">
            What we keep, and why
          </h2>
          <div className="space-y-4">
            {retained.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-5"
              >
                <p className="font-semibold">{item.what}</p>
                <p className="text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Export */}
        <section>
          <h2 className="mb-3 text-2xl font-bold">
            Want a copy before you go?
          </h2>
          <p className="text-muted-foreground">
            You can download your data from{" "}
            <span className="font-medium">
              Settings → Your data → Download my data
            </span>{" "}
            (on versions before 2.1: Settings → Download Your Data → Export Data){" "}
            before deleting, or ask us at{" "}
            <a
              href="mailto:privacy@konectr.app?subject=Data%20export%20request"
              className="font-semibold text-primary underline underline-offset-4"
            >
              privacy@konectr.app
            </a>
            .
          </p>
        </section>

        <section className="border-t border-border pt-8 text-sm text-muted-foreground">
          <p>
            Konectr handles personal data under the Malaysian Personal Data
            Protection Act 2010. Full detail in our{" "}
            <Link
              href="/privacy"
              className="font-medium text-primary underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            . Questions: privacy@konectr.app
          </p>
        </section>
      </motion.div>
    </div>
  );
}
