// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: [
      'Konectr ("we", "us", "our") operates the Konectr mobile application (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.',
      "By using Konectr, you agree to the collection and use of information in accordance with this policy.",
    ],
  },
  {
    id: "company",
    // INTERIM (2026-06-25, pending legal counsel review): PDPA data-controller
    // identification added ahead of beta. Final entity + governing law confirmed
    // at incorporation. See docs/COMPLIANCE_POSTURE.md + Section 15 (consent/breach).
    title: "2. Data Controller & Company Information",
    content: [
      'For the purposes of the Malaysian Personal Data Protection Act 2010 ("PDPA"), the data controller (the PDPA "data user") responsible for your personal data is Deepak Porwal (founder of Konectr), operating from Kuala Lumpur, Malaysia, contactable at privacy@konectr.app. Konectr is in the process of incorporation; upon completion, the incorporated entity will become the data controller and this section will be updated.',
    ],
    details: [
      {
        label: "Data Controller",
        value: "Deepak Porwal — founder, Konectr (incorporation in progress)",
      },
      {
        label: "Contact Address",
        value:
          "Kuala Lumpur, Federal Territory of Kuala Lumpur 50000, Malaysia",
      },
      { label: "Data Protection Contact", value: "privacy@konectr.app" },
      { label: "Website", value: "https://konectr.app" },
    ],
  },
  {
    id: "data-collection",
    title: "3. Data We Collect",
    dataCategories: [
      {
        category: "Personal Information",
        icon: "👤",
        items: [
          // Auth moved from SMS OTP to email OTP in June 2026.
          "Email address (for sign-in and account recovery)",
          "Phone number (optional, if you choose to add it)",
          "Name (display name for your profile)",
          "Date of birth (you must be 18 or over to create an account)",
          "Gender (for profile display, and to control access to women-only activities)",
          "Profile photo (optional)",
          "Bio, interests, and languages spoken",
          "Pinned photos (up to three, with optional captions) and answers to profile prompts (optional)",
          "What you say you are looking for (optional — it stays until you change or clear it)",
          "Photos you send in a plan's chat, and any of those you or another attendee choose to publish to This Week",
        ],
      },
      {
        category: "Location Data",
        icon: "📍",
        items: [
          "Your precise location while the app is open, used on your device to find plans within 5 km of you — plans show a venue, never your position",
          "Your city, so we show you the right area",
          "A location you choose to share in a chat (visible to that chat for 15 minutes)",
          "Your location at the moment you confirm a meetup, used only to verify attendance",
        ],
      },
      {
        category: "Activity Data",
        icon: "🎯",
        items: [
          "Venues visited (to suggest similar activities)",
          "Activities you started",
          "Matches made (to improve matching algorithm)",
          // Was: "stored encrypted, auto-deleted after 90 days". Neither held —
          // nothing deleted messages, and "encrypted" invited an end-to-end
          // reading we do not support. See the retention table below.
          "Messages sent (retained while the conversation exists)",
        ],
      },
      {
        category: "Usage Data",
        icon: "📊",
        items: [
          "App interactions (features used, screens viewed)",
          "Crash logs (to fix bugs and improve stability)",
          "Device information (OS version, app version, device model)",
        ],
      },
    ],
  },
  {
    id: "data-use",
    title: "4. How We Use Your Data",
    useItems: [
      "Match you with other users for in-person activities",
      "Use your profile gender to control access to women-only activities: only members whose profile gender is Woman can see or join them",
      "Verify your identity and maintain a safe community",
      "Improve our Service through analytics",
      "Comply with legal obligations under PDPA 2010",
      "Send service-related notifications",
      "Prevent fraud and abuse",
    ],
    neverDo: [
      "Send marketing emails without your explicit consent",
      "Sell your data to third parties",
      "Use your data for purposes unrelated to the Service",
    ],
  },
  {
    id: "data-sharing",
    title: "5. Data Sharing",
    subsections: [
      {
        subtitle: "With Other Users",
        content:
          "We share your profile information (name, photo, bio, interests), approximate location, and activity preferences with matched users.",
      },
      {
        subtitle: "Who sees your profile photo",
        content:
          "Your profile and cover photos are shown only to people who share a plan with you (including past plans), people in your Circle, people you've messaged, and anyone you've sent a Circle or join request to. They are never shown to someone you've blocked. Everyone else, including anyone who opens a shared plan link, sees your initials instead. If you choose to appear on the public leaderboard, your profile photo is shown there too.",
      },
      {
        subtitle: "Who sees your social links",
        content:
          "The social links you add to your profile (such as Instagram, TikTok, LinkedIn, X or Facebook) are shown only to people who share a plan with you (including past plans) and people in your Circle. They are never shown to someone you've blocked or who has blocked you. If you hold the Konectr Captain badge, your links are shown to every signed-in Konectr member. You can change or remove them at any time in Edit profile, and they are deleted with your account.",
      },
      {
        subtitle: "This Week wall (photos you choose to publish)",
        content:
          "A photo sent in a plan's group chat can be shared to This Week by anyone who was on that plan. A published photo is visible to every signed-in Konectr member in your city for 14 days, shown only as the venue, the kind of plan and the group size — never a name, a date, or a link to the plan. Any attendee of that plan can take it down at any time, we review every photo before it goes live, location data is stripped from the image, and the file is deleted from our storage when the 14 days end. Only share photos that everyone in them is comfortable with.",
      },
      {
        subtitle: "Pinned photos and prompts",
        content:
          "Your pinned photos and prompt answers are shown to people in your Circle, your matches and anyone who has joined a plan with you, never to someone you have blocked. If you turn on \"Show photos & prompts to everyone\" in Privacy Settings, every signed-in Konectr member can see them. Location data is stripped from pinned photos. If we hide one after a report, it stays visible to you with a notice. You can remove them at any time, and they are deleted with your account.",
      },
      {
        subtitle: "We NEVER Share",
        bullets: [
          "Your phone number",
          "Your exact location",
          "Your private messages with others",
          "Your personal contact information",
        ],
      },
      {
        subtitle: "Service Providers",
        content:
          "We work with these service providers, each of which processes data only to perform its function for us: Supabase (database, authentication and file storage, hosted in Singapore); Firebase Cloud Messaging and Firebase Crashlytics (push delivery and crash reports); PostHog (first-party product analytics and masked session recordings, hosted in the United States); Brevo (transactional and lifecycle email); Mapbox (map display and reverse geocoding — the map SDK on your device may send anonymised usage telemetry to Mapbox); Google Places (venue search and venue photos); and Google ML Kit (on-device translation model downloads). None of them may use your data for their own purposes.",
      },
    ],
  },
  {
    id: "rights",
    title: "6. Your Rights Under PDPA 2010",
    rights: [
      {
        right: "Right to Access",
        detail: "Request a copy of your personal data in JSON format.",
      },
      {
        right: "Right to Correction",
        detail: "Update or correct inaccurate information in your profile.",
      },
      {
        right: "Right to Deletion",
        detail: "Delete your account. Personal data is erased within 30 days; see Section 10 for what is anonymised or retained and why.",
      },
      {
        right: "Right to Data Portability",
        detail: "Export your data in a structured, machine-readable format.",
      },
      {
        right: "Right to Withdraw Consent",
        detail: "Stop us from processing your data at any time.",
      },
      {
        right: "Right to Complaint",
        detail:
          "File a complaint with the Personal Data Protection Commissioner.",
      },
    ],
  },
  {
    id: "location",
    title: "7. Location Data Specifics",
    protections: [
      {
        icon: "🚫",
        text: "NEVER tracked in background \u2014 only when the app is active",
      },
      {
        icon: "🔵",
        text: "Plans and profiles never store your position — only the venue you picked",
      },
      {
        icon: "🗑️",
        text: "A location you share in a chat expires after 15 minutes; any coordinates we hold are erased when your account is deleted",
      },
      {
        icon: "⚙️",
        text: "You can disable location permissions in device settings anytime",
      },
    ],
  },
  {
    id: "children",
    title: "8. Children\u2019s Privacy",
    content: [
      "Konectr is strictly 18+ only. You must enter a date of birth showing you are 18 or over to create an account; we do not verify identity documents. We do not knowingly collect data from anyone under 18. Accounts found to belong to minors are removed.",
      "If we learn we have collected personal data from anyone under 18, we will delete that information immediately. Parents should contact privacy@konectr.app if they discover their child is using Konectr.",
    ],
  },
  {
    id: "security",
    title: "9. Data Security",
    securityGroups: [
      {
        category: "Technical Safeguards",
        items: [
          "Messages are encrypted in transit and at rest; they are not end-to-end encrypted, so we can act on safety reports",
          "Encrypted data storage via Singapore data center",
          "Secure HTTPS transmission for all data transfers",
          "Row-level security: each account can read only the data it is allowed to see",
        ],
      },
      {
        category: "Organizational Safeguards",
        items: [
          "Access to production data is limited to the founder",
          "Security review of every change that touches personal data",
          "Data breaches are reported to affected users and the Commissioner as PDPA requires",
        ],
      },
    ],
  },
  {
    id: "retention",
    title: "10. Data Retention",
    // CORRECTED 2026-08-05. The previous version of this table described
    // automatic deletion schedules that were never implemented: messages
    // "auto-deleted after 90 days" (88 of 142 were older), activity history
    // "anonymized after 6 months" (220 rows older, oldest Dec 2024), location
    // "auto-deleted after 30 days" (390 of 583 older). A published retention
    // period is a commitment under PDPA 2010 — do not state one here unless a
    // mechanism enforces it AND you have confirmed that mechanism has actually
    // run. See docs/ACCOUNT_DELETION_DESIGN.md.
    retentionItems: [
      { data: "Active accounts", period: "Retained while your account is open" },
      {
        data: "Deleted accounts",
        period:
          "Hidden immediately, 30 days to change your mind, then permanently erased",
      },
      {
        data: "Messages",
        period:
          "Retained while the conversation exists. If you delete your account, your messages stay in other people's conversations but are no longer linked to you",
      },
      {
        data: "Activity and availability history",
        period: "Retained while your account is open",
      },
      {
        data: "Location data",
        period: "Chat location shares expire after 15 minutes. Meetup-confirmation coordinates are kept while your account is open and erased on deletion",
      },
      {
        data: "Crash logs",
        period: "Retained for 90 days by Firebase Crashlytics",
      },
      {
        data: "Safety reports",
        period:
          "Retained after account deletion, so that deleting an account cannot erase a report",
      },
      // PF-46, founder answer 7 (2026-10-11). This is a PDPA commitment (see the
      // header above): the women_only_bans purge was NOT live in prod on
      // 2026-10-11 (no function or cron job touches the table). Do not deploy
      // this row until that purge exists and has run.
      {
        data: "Women-only ban list (web RSVPs)",
        period:
          "If a starter removes you from a women-only activity you joined on the web, we keep your email address and a one-way hash of your phone number for 12 months after the ban ends, then delete them",
      },
    ],
  },
  {
    id: "international",
    title: "11. International Data Transfers",
    content: [
      "Your data is stored in Singapore (via Supabase Asia region). We are building Konectr to the standards set by Malaysia's PDPA 2010 and the EU GDPR — the rights described in this policy, including access, correction, download, and deletion, are honoured today. Our formal compliance review is still in progress, and we will say so here when it is complete.",
      "When transferring data internationally, we ensure adequate safeguards including standard contractual clauses, data processing agreements, and compliance with local data protection laws.",
    ],
  },
  {
    id: "cookies",
    title: "12. Cookies and Tracking",
    content: [
      "The Konectr mobile app does not use advertising cookies, advertising SDKs, or cross-app tracking. In-app analytics are first-party (crash reporting, feature usage, and masked session recordings of how the app is used, with on-screen text and images hidden; tied to your account ID, never sold or shared for advertising).",
      "Our website (konectr.app) uses: PostHog product analytics in cookieless mode (no cookies or device storage), including session recordings of page interactions with form inputs masked; and — only if you accept the cookie banner — Meta and Google advertising pixels that measure whether our ads brought you here. Declining or ignoring the banner keeps all advertising pixels off. Full details: konectr.app/cookies.",
      "We do NOT sell your personal data to advertisers, build advertising profiles of you, or track you across other apps.",
    ],
  },
  {
    id: "changes",
    title: "13. Changes to Privacy Policy",
    content: [
      "We may update this policy periodically. You will be notified via in-app notification. Continued use after changes constitutes acceptance. Major changes require explicit re-consent.",
    ],
  },
  {
    id: "contact",
    title: "14. Contact & Complaints",
    details: [
      { label: "Privacy Questions", value: "privacy@konectr.app" },
      { label: "General Support", value: "support@konectr.app" },
      { label: "Legal Matters", value: "legal@konectr.app" },
      { label: "Response Time", value: "Within 48\u201372 hours" },
    ],
    content: [
      "If you are not satisfied with our response, you may escalate to the Personal Data Protection Department, Ministry of Communications and Digital, Level 5, MCMC Tower 1, Jalan Impact, Cyberjaya, 63000 Selangor, Malaysia (pdpa@pdp.gov.my).",
    ],
  },
  {
    // INTERIM (2026-06-25, pending legal counsel review): explicit PDPA consent +
    // breach-notification clause added ahead of beta. See docs/COMPLIANCE_POSTURE.md.
    id: "pdpa-consent",
    title: "15. Consent & Data Breach Notification (PDPA 2010)",
    content: [
      "By creating a Konectr account and using the Service, you give your explicit consent to the collection, use, and disclosure of your personal data as described in this Policy, including processing by our service providers located outside Malaysia (for example, data hosting in Singapore). Where we rely on your consent, you may withdraw it at any time by contacting privacy@konectr.app or by deleting your account. Withdrawal does not affect processing carried out before withdrawal, or processing we are required by law to perform.",
      "Data breach notification: if a personal data breach occurs that is likely to cause significant harm, we will notify the Personal Data Protection Commissioner as soon as practicable (and within 72 hours where required) and will inform affected users without unnecessary delay and, in any case, no later than 7 days after we notify the Commissioner. We maintain an incident-response process to contain, assess, and remediate breaches.",
    ],
  },
];

export function PrivacyContent() {
  return (
    <main className="bg-background">
      {/* Last Updated */}
      <section className="pt-12 pb-4">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-muted-foreground text-sm">
            Last Updated: October 11, 2026 &middot; Effective Date: December 10,
            2025
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-6 border border-border/50"
          >
            <h2
              className="text-lg font-bold text-foreground mb-4"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Contents
            </h2>
            <nav className="grid sm:grid-cols-2 gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </motion.div>
        </div>
      </section>

      {/* Sections */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.02 }}
              className="scroll-mt-24"
            >
              <h2
                className="text-2xl font-bold text-foreground mb-4"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                {section.title}
              </h2>

              {/* Content paragraphs */}
              {section.content?.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-muted-foreground leading-relaxed mb-3"
                >
                  {paragraph}
                </p>
              ))}

              {/* Details (key-value pairs) */}
              {section.details && (
                <div className="bg-card rounded-xl p-5 border border-border/50 mt-3">
                  <dl className="space-y-2">
                    {section.details.map((detail, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:gap-2">
                        <dt className="text-sm font-medium text-foreground min-w-[140px]">
                          {detail.label}:
                        </dt>
                        <dd className="text-sm text-muted-foreground">
                          {detail.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Data categories */}
              {section.dataCategories && (
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  {section.dataCategories.map((cat, i) => (
                    <div
                      key={i}
                      className="bg-card rounded-xl p-5 border border-border/50"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{cat.icon}</span>
                        <h4 className="text-sm font-bold text-foreground">
                          {cat.category}
                        </h4>
                      </div>
                      <ul className="space-y-1.5">
                        {cat.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="text-primary mt-0.5 text-xs">
                              •
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Data use items */}
              {section.useItems && (
                <>
                  <div className="mt-3">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      We use your information to:
                    </h3>
                    <ul className="space-y-1.5">
                      {section.useItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-primary">✓</span>
                          <span className="text-muted-foreground text-sm">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {section.neverDo && (
                    <div className="mt-4 bg-green-50 dark:bg-green-950/30 rounded-xl p-5 border border-green-200 dark:border-green-900/50">
                      <h4 className="text-sm font-bold text-green-800 dark:text-green-300 mb-2">
                        We do NOT:
                      </h4>
                      <ul className="space-y-1.5">
                        {section.neverDo.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-400 mt-0.5 text-xs">
                              ✕
                            </span>
                            <span className="text-green-800 dark:text-green-300 text-sm">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {/* Subsections */}
              {section.subsections?.map((sub, i) => (
                <div key={i} className="mt-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {sub.subtitle}
                  </h3>
                  {sub.content && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                      {sub.content}
                    </p>
                  )}
                  {sub.bullets && (
                    <ul className="space-y-1.5">
                      {sub.bullets.map((bullet, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span className="text-red-500 mt-0.5 text-xs">
                            ✕
                          </span>
                          <span className="text-muted-foreground text-sm">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/* Rights */}
              {section.rights && (
                <div className="space-y-3 mt-4">
                  {section.rights.map((right, i) => (
                    <div
                      key={i}
                      className="bg-card rounded-xl p-4 border border-border/50"
                    >
                      <h4 className="text-sm font-bold text-foreground mb-1">
                        {right.right}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {right.detail}
                      </p>
                    </div>
                  ))}
                  <p className="text-muted-foreground text-sm mt-2">
                    To exercise these rights, contact:{" "}
                    <a
                      href="mailto:privacy@konectr.app"
                      className="text-primary hover:underline"
                    >
                      privacy@konectr.app
                    </a>
                  </p>
                </div>
              )}

              {/* Location protections */}
              {section.protections && (
                <div className="space-y-3 mt-4">
                  {section.protections.map((p, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-2xl">{p.icon}</span>
                      <span className="text-muted-foreground text-sm pt-1">
                        {p.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Security groups */}
              {section.securityGroups && (
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  {section.securityGroups.map((group, i) => (
                    <div
                      key={i}
                      className="bg-card rounded-xl p-5 border border-border/50"
                    >
                      <h4 className="text-sm font-bold text-foreground mb-3">
                        {group.category}
                      </h4>
                      <ul className="space-y-1.5">
                        {group.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span className="text-muted-foreground text-sm">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Retention table */}
              {section.retentionItems && (
                <div className="bg-card rounded-xl border border-border/50 overflow-hidden mt-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left p-3 font-medium text-foreground">
                          Data Type
                        </th>
                        <th className="text-left p-3 font-medium text-foreground">
                          Retention Period
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.retentionItems.map((item, i) => (
                        <tr
                          key={i}
                          className="border-b border-border/30 last:border-0"
                        >
                          <td className="p-3 text-foreground font-medium">
                            {item.data}
                          </td>
                          <td className="p-3 text-muted-foreground">
                            {item.period}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-foreground dark:bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-white/80 text-lg mb-4">
              This Privacy Policy is governed by the laws of Malaysia. Any
              disputes shall be resolved in the courts of Kuala Lumpur.
            </p>
            <p className="text-white/60 text-sm">
              Questions? Contact us at{" "}
              <a
                href="mailto:privacy@konectr.app"
                className="text-primary hover:underline"
              >
                privacy@konectr.app
              </a>{" "}
              &middot; Also read our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
