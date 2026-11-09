// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { fadeInUp, viewportOnce } from "@/lib/animations";
import { Heading } from "@/components/shared";

// Community member photos
const communityPhotos = [
  "/images/avatars/avatar-1.jpg",
  "/images/avatars/avatar-2.jpg",
  // avatar-3..5.jpg are solid-black files — they rendered as three black discs.
];

export function JoinMovement() {
  const t = useTranslations("home.joinMovement");

  return (
    <section
      id="about"
      className="py-24 md:py-32 bg-gradient-to-b from-foreground to-foreground dark:from-foreground dark:to-background text-white relative overflow-hidden"
    >
      {/* Floating background elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/20 blur-3xl"
        animate={{
          y: [0, 20, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-secondary/20 blur-3xl"
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <Heading level={2} size="xl" animated={false} className="text-white mb-4">
            {t("title")}
          </Heading>
        </motion.div>

        {/* Quote card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          custom={0.2}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
        >
          {/* Quote icon */}
          <span className="text-5xl text-primary/80 block mb-6">&ldquo;</span>

          {/* Quote text */}
          <p className="text-xl md:text-2xl leading-relaxed text-white/90 mb-8">
            {t("quote")}
            <span className="text-primary font-semibold">
              {" "}{t("quoteHighlight")}
            </span>{" "}
            {t("quoteEnd")}
          </p>

          {/* Author */}
          <p className="text-secondary font-semibold">{t("author")}</p>
        </motion.div>

        {/* Stats / Social proof */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="grid grid-cols-3 gap-4 mt-12"
        >
          {[
            { emoji: "🌟", labelKey: "earlyAdopters" },
            { emoji: "🏢", labelKey: "klVenues" },
            { emoji: "⏱️", labelKey: "realMoments" },
          ].map((stat, index) => (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center p-4 rounded-2xl bg-white/5"
            >
              <span className="text-3xl mb-2 block">{stat.emoji}</span>
              <span className="text-white/60 text-sm">{t(`stats.${stat.labelKey}`)}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Community avatars */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={{ delay: 0.6 }}
          className="flex justify-center items-center gap-2 mt-12"
        >
          <div className="flex -space-x-3">
            {communityPhotos.map((photo, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full border-2 border-foreground overflow-hidden relative"
              >
                <Image
                  src={photo}
                  alt={`Community member ${i + 1}`}
                  fill
                  className="object-cover"
                  quality={100}
                  unoptimized
                />
              </div>
            ))}
          </div>
          <span className="text-white/60 text-sm ml-4">
            {t("joinCommunity")}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
