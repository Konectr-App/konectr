// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const safetyFeaturesMeta = [
  { key: "phoneVerified", icon: "✅" },
  { key: "publicVenuesOnly", icon: "📍" },
  { key: "quickReporting", icon: "🚨" },
  { key: "threeStrikeSystem", icon: "⚖️" },
  { key: "privateMessaging", icon: "🔒" },
  { key: "appLock", icon: "🔐" },
  // PF-46. Full row so the grid stays even.
  { key: "womenOnly", icon: "👭", wide: true },
] as const;

const guidelinesMeta = ["beRespectful", "beHonest", "beSafe"] as const;
const tipsMeta = ["beforeMeeting", "duringMeetup", "afterMeetup"] as const;

export function SafetyContent() {
  const t = useTranslations("safety");

  return (
    <main className="bg-background">
      {/* Safety Features */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl md:text-4xl font-black text-foreground mb-4"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              {t("features.title")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              {t("features.subtitle")}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyFeaturesMeta.map((feature, index) => (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-card rounded-2xl p-6 border border-border/50${
                  "wide" in feature && feature.wide ? " sm:col-span-2 lg:col-span-3" : ""
                }`}
              >
                <span className="text-4xl block mb-4">{feature.icon}</span>
                <h3
                  className="text-lg font-bold text-foreground mb-2"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  {t(`features.items.${feature.key}.title`)}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t(`features.items.${feature.key}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl md:text-4xl font-black text-foreground mb-4"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              {t("guidelines.title")}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("guidelines.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {guidelinesMeta.map((key, index) => {
              const points = t.raw(`guidelines.${key}.points`) as string[];
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-8 border border-border/50"
                >
                  <h3
                    className="text-xl font-bold text-foreground mb-4"
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                  >
                    {t(`guidelines.${key}.title`)}
                  </h3>
                  <ul className="space-y-3">
                    {points.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-primary mt-0.5">•</span>
                        <span className="text-muted-foreground text-sm">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          {/* PF-46 policy line (founder-approved 2026-10-11). Anchor is linked from the FAQ. */}
          <motion.div
            id="women-only"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 bg-card rounded-2xl p-8 border border-border/50 scroll-mt-24"
          >
            <h3
              className="text-xl font-bold text-foreground mb-4"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              {t("guidelines.womenOnly.title")}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("guidelines.womenOnly.body")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl md:text-4xl font-black text-foreground mb-4"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              {t("tips.title")}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("tips.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {tipsMeta.map((key, index) => {
              const items = t.raw(`tips.${key}.items`) as string[];
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 font-bold text-white ${
                      index === 0
                        ? "bg-primary"
                        : index === 1
                        ? "bg-secondary text-foreground"
                        : "bg-green-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <h3
                    className="text-xl font-bold text-foreground mb-4"
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                  >
                    {t(`tips.${key}.title`)}
                  </h3>
                  <ul className="space-y-3">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-primary">✓</span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-foreground dark:bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-3xl md:text-4xl font-black mb-4"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              {t("support.title")}
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              {t("support.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8"
                asChild
              >
                <Link href="/contact">{t("support.contactSupport")}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white text-white hover:bg-white/10 font-semibold px-8"
                asChild
              >
                <Link href="mailto:support@konectr.app">
                  support@konectr.app
                </Link>
              </Button>
            </div>
            <p className="text-white/60 text-sm mt-8">
              {t("support.emergencyNote")}
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
