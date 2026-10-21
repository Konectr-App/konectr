// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using Konectr, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, do not use the Service.",
      "These Terms constitute a legally binding agreement between you and Konectr.",
    ],
  },
  {
    id: "company",
    // INTERIM (2026-06-25, pending legal counsel review): operating party named
    // ahead of beta; final entity + governing law confirmed at incorporation.
    // Mirrors Privacy Policy §2. See docs/COMPLIANCE_POSTURE.md.
    title: "2. Company Information",
    content: [
      "Konectr is currently operated by Deepak Porwal (founder) from Kuala Lumpur, Malaysia, pending incorporation. Upon completion of incorporation, the incorporated entity will become the service provider under these Terms and this section will be updated.",
    ],
    details: [
      {
        label: "Service Provider",
        value: "Deepak Porwal — founder, Konectr (incorporation in progress)",
      },
      {
        label: "Registered Address",
        value:
          "Kuala Lumpur, Federal Territory of Kuala Lumpur 50000, Malaysia",
      },
      { label: "Contact Email", value: "legal@konectr.app" },
      { label: "Website", value: "www.konectr.app" },
    ],
  },
  {
    id: "eligibility",
    title: "3. Eligibility",
    content: ["To use Konectr, you must:"],
    bullets: [
      "Be at least 18 years old",
      "Be legally able to form binding contracts under Malaysia law",
      "Not be prohibited from using the Service under any applicable law",
      "Not have been previously banned from Konectr",
      "Provide accurate and truthful information during registration",
    ],
  },
  {
    id: "account",
    title: "4. Account Registration",
    subsections: [
      {
        subtitle: "Account Creation",
        bullets: [
          "Provide accurate, current, and complete information during registration",
          "Maintain one account per person (multiple accounts are prohibited)",
          "Verify your email address with the one-time code we send you",
          "Keep your login credentials secure and confidential",
        ],
      },
      {
        subtitle: "Account Security",
        content: "You are responsible for:",
        bullets: [
          "All activity that occurs under your account",
          "Maintaining the security of your password",
          "Notifying us immediately of any unauthorized access",
        ],
      },
      {
        subtitle: "Account Suspension",
        content:
          "We may suspend or terminate your account if you violate these Terms or engage in fraudulent activity.",
      },
    ],
  },
  {
    id: "conduct",
    title: "5. User Conduct",
    content: ["You agree NOT to:"],
    conductGroups: [
      {
        category: "Harassment & Safety",
        items: [
          "Harass, threaten, intimidate, or stalk other users",
          "Engage in hate speech or discriminatory behavior",
          "Share others' personal information without consent",
          "Impersonate any person or entity",
        ],
      },
      {
        category: "Fraudulent Behavior",
        items: [
          "Use fake, stolen, or misleading profile information",
          "Create multiple accounts (one per person only)",
          "Manipulate the matching algorithm or game the system",
          "Engage in catfishing or deceptive practices",
        ],
      },
      {
        category: "Commercial & Spam",
        items: [
          "Solicit money, donations, or financial contributions",
          "Promote businesses or commercial services (unless approved venue partners)",
          "Send spam, mass messages, or generic invitations",
          "Engage in MLM, pyramid schemes, or similar activities",
        ],
      },
      {
        category: "Inappropriate Content",
        items: [
          "Post illegal, harmful, offensive, or sexually explicit content",
          "Share nudity or pornographic material",
          "Promote violence, self-harm, or dangerous activities",
          "Distribute malware, viruses, or harmful code",
        ],
      },
    ],
    // PF-46 policy line, founder-approved 2026-10-11 ("Hosts" → "Starters").
    note: {
      title: "Women-only activities",
      content:
        "Women-only activities are open only to members whose profile gender is Woman. Whoever started a women-only activity can remove anyone from it, and so can Konectr. Misrepresenting your gender to access a women-only space is a Community Guidelines violation and results in immediate suspension. You can change your profile gender once; after that, changes require contacting support.",
    },
  },
  {
    id: "safety",
    title: "6. Meeting Safety Guidelines",
    content: [
      "Konectr facilitates in-person meetups. By using the Service, you agree to:",
    ],
    safetyItems: [
      "Always meet in public venues (cafes, parks, restaurants, gyms, public spaces)",
      "Tell a friend or family member your plans and location",
      "Never share personal contact info (address, phone number) until you feel safe",
      "Trust your instincts \u2013 leave immediately if you feel uncomfortable",
      "Report suspicious behavior using the in-app report button",
    ],
    disclaimer:
      "Konectr is NOT responsible for user behavior during in-person meetups, injuries or damages that occur offline, verification of user identities, or safety of venues. You meet other users at your own risk.",
  },
  {
    id: "content-ownership",
    title: "7. Content Ownership",
    subsections: [
      {
        subtitle: "Your Content",
        content: "You own the content you create:",
        bullets: [
          "Profile information (photos, bio, interests)",
          "Activity descriptions and posts",
          "Messages, photos and communications",
        ],
      },
      {
        subtitle: "License to Konectr",
        content: "By posting content, you grant us a non-exclusive, royalty-free, worldwide license to display, store, and moderate your content. This license terminates when you delete your account.",
      },
      {
        subtitle: "Photos published to This Week",
        content: "When you or another attendee of a plan publish a chat photo to This Week, you confirm that everyone shown in it is comfortable with it being seen by other Konectr members in your city for up to 14 days. We may remove any published photo at our discretion, and any attendee of that plan may remove it at any time.",
      },
      {
        subtitle: "Our Intellectual Property",
        content: "Konectr owns the app, code, design, branding, trademarks, logos, and all proprietary technology including matching algorithms.",
      },
      {
        subtitle: "Third-Party Image Credits",
        content: "Certain images used within the Konectr app and website, including splash screen photographs, are sourced from Unsplash and Unsplash+ under their respective licences. These images are not the property of Konectr and remain the intellectual property of their respective photographers. If you are a photographer and would like your image removed, please contact us at hello@konectr.app and we will remove it promptly.",
      },
    ],
  },
  {
    id: "strikes",
    title: "8. Three-Strike System",
    strikes: [
      {
        strike: "Strike 1: Warning",
        detail: "Issued when 3 different people report you. A notification explains the violation. No account restrictions.",
      },
      {
        strike: "Strike 2: Temporary Suspension",
        detail: "Issued at 6 reporters. 7-day account suspension. No access to the Service during suspension.",
      },
      {
        strike: "Strike 3: Ban",
        detail:
          "Issued at 9 reporters. Six-month ban from the Service. Creating a new account to evade a ban is prohibited. Strikes decay after 3 months without new reports.",
      },
    ],
    content: [
      "Serious violations (harassment, threats, illegal activities, underage use, fake profiles, doxxing) bypass this system and result in immediate permanent ban.",
      "You may appeal a strike within 14 days by sending details to legal@konectr.app.",
    ],
  },
  {
    id: "termination",
    title: "9. Termination",
    subsections: [
      {
        subtitle: "You May Terminate Anytime",
        content:
          "Delete your account from Profile > Settings > Delete Account, or at konectr.app/delete-account. Your profile is hidden immediately and you have 30 days to change your mind; after that your personal data is erased. Messages, attendance records and photos you published to This Week are kept but detached from you, and safety reports are retained. The full list is at konectr.app/delete-account.",
      },
      {
        subtitle: "Effects of Termination",
        bullets: [
          "Immediate: Profile hidden from all users",
          "Within 30 days: Personal data permanently erased; messages and attendance anonymised; safety reports retained",
          "Photos you sent in chats are removed from storage",
        ],
      },
    ],
  },
  {
    id: "disclaimers",
    title: "10. Disclaimers & Liability",
    content: [
      'Konectr is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied.',
      "We do not guarantee uninterrupted service, accuracy of user-provided information, successful matches or meetups, safety of in-person interactions, or error-free operation.",
      "Our total liability is limited to the amount you paid us in the last 12 months, or RM0 if you have never paid us. Konectr is free at the time of writing.",
    ],
  },
  {
    id: "disputes",
    title: "11. Dispute Resolution",
    content: [
      "These Terms are governed by the laws of Malaysia. Any disputes shall be resolved exclusively in the courts of Kuala Lumpur.",
      "Interim note: governing law and jurisdiction are provisional and will be updated upon Konectr's incorporation (see Section 2). We will continue to handle Malaysian users' personal data in accordance with the Malaysian Personal Data Protection Act 2010 to the extent it applies to our processing (for example, where we are established in Malaysia or process personal data using equipment in Malaysia).",
      "Before taking legal action, you agree to contact legal@konectr.app and allow 30 days for resolution. If informal resolution fails, either party may propose binding arbitration under the rules of the Asian International Arbitration Centre (AIAC).",
    ],
  },
  {
    id: "changes",
    title: "12. Changes to Terms",
    content: [
      "We may update these Terms periodically. You will receive 30 days advance notice via in-app notification and email. Continued use after changes constitutes acceptance. Major changes require explicit re-acceptance.",
    ],
  },
  {
    id: "contact",
    title: "13. Contact Information",
    details: [
      { label: "General Inquiries", value: "support@konectr.app" },
      { label: "Legal Matters", value: "legal@konectr.app" },
      {
        label: "Address",
        value:
          "Konectr, Kuala Lumpur, Federal Territory of Kuala Lumpur 50000, Malaysia",
      },
    ],
  },
];

export function TermsContent() {
  return (
    <main className="bg-background">
      {/* Last Updated */}
      <section className="pt-12 pb-4">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-muted-foreground text-sm">
            Last Updated: October 21, 2026 &middot; Effective Date: December
            10, 2025
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

              {/* Simple bullet list */}
              {section.bullets && (
                <ul className="space-y-2 mt-3">
                  {section.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-primary mt-0.5">•</span>
                      <span className="text-muted-foreground text-sm">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

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
                          <span className="text-primary mt-0.5">•</span>
                          <span className="text-muted-foreground text-sm">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/* Conduct groups */}
              {section.conductGroups && (
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  {section.conductGroups.map((group, i) => (
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
                            <span className="text-red-500 mt-0.5 text-xs">
                              ✕
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

              {/* Note under the conduct groups */}
              {section.note && (
                <div className="bg-card rounded-xl p-5 border border-border/50 mt-4">
                  <h4 className="text-sm font-bold text-foreground mb-2">
                    {section.note.title}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {section.note.content}
                  </p>
                </div>
              )}

              {/* Safety items + disclaimer */}
              {section.safetyItems && (
                <>
                  <ul className="space-y-2 mt-3">
                    {section.safetyItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-primary">✓</span>
                        <span className="text-muted-foreground text-sm">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {section.disclaimer && (
                    <div className="mt-4 bg-red-50 dark:bg-red-950/30 rounded-xl p-5 border border-red-200 dark:border-red-900/50">
                      <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                        {section.disclaimer}
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Strikes */}
              {section.strikes && (
                <div className="space-y-3 mt-4">
                  {section.strikes.map((strike, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 bg-card rounded-xl p-4 border border-border/50"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                          i === 0
                            ? "bg-yellow-500"
                            : i === 1
                            ? "bg-orange-500"
                            : "bg-red-500"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">
                          {strike.strike}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {strike.detail}
                        </p>
                      </div>
                    </div>
                  ))}
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
              By using Konectr, you acknowledge that you have read, understood,
              and agree to be bound by these Terms of Service.
            </p>
            <p className="text-white/60 text-sm">
              Questions? Contact us at{" "}
              <a
                href="mailto:legal@konectr.app"
                className="text-primary hover:underline"
              >
                legal@konectr.app
              </a>{" "}
              &middot; Also read our{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
