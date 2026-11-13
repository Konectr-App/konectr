// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

"use client";

import { motion } from "framer-motion";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { usePrimaryCta } from "@/lib/usePrimaryCta";

const values = [
  {
    icon: "🤝",
    title: "Real Connection",
    description:
      "We believe genuine friendships happen face-to-face, not through screens.",
  },
  {
    icon: "⚡",
    title: "Spontaneity",
    description:
      "Life's best moments are unplanned. We make it easy to be spontaneous.",
  },
  {
    icon: "🛡️",
    title: "Safety First",
    description:
      "Every member signs in with a one-time code. Every meetup is in public. Your safety is our priority.",
  },
  {
    icon: "🌍",
    title: "Inclusive Community",
    description:
      "Everyone belongs. We're building a space where all people can find their tribe.",
  },
];


export function AboutContent() {
  const cta = usePrimaryCta("about_cta");
  return (
    <main className="bg-background">
      {/* Story Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="text-3xl md:text-4xl font-black text-foreground mb-6"
                style={{ fontFamily: "'Satoshi', sans-serif" }}
              >
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  It started with a simple observation: we&apos;re more connected
                  than ever, yet lonelier than ever before.
                </p>
                <p>
                  Every day, millions of people scroll through social media,
                  collecting likes and followers, but feeling increasingly
                  isolated. We&apos;ve traded real conversations for comments,
                  genuine friendships for follower counts.
                </p>
                <p>
                  We asked ourselves: <strong>What if there was a better way?</strong>
                </p>
                <p>
                  What if technology could be a bridge to real-world connection,
                  not a replacement for it? What if instead of showing you what
                  others are doing, an app could help you do things with others?
                </p>
                <p className="text-foreground font-medium">
                  That&apos;s why we built Konectr.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <ImagePlaceholder
                aspectRatio="video"
                src="/images/about/our-story.jpg"
                alt="Group of friends enjoying time together outdoors"
                className="rounded-3xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Our Mission
            </span>
            <h2
              className="text-3xl md:text-5xl font-black text-foreground mt-4 mb-6"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Get people off their phones and into real life
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We&apos;re building the anti-social network. An app designed to be
              used less, so you can live more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
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
              What We Believe
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              These values guide everything we build
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/50 transition-colors"
              >
                <span className="text-4xl block mb-4">{value.icon}</span>
                <h3
                  className="text-lg font-bold text-foreground mb-2"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-3xl md:text-4xl font-black text-foreground mb-4"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Your plan. New people. Nearby.
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Be part of the community that&apos;s bringing real connection back.
            </p>
            <Button
              size="lg"
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8"
              asChild
            >
              {cta.href === "#waitlist" ? (
                <Link href="/#waitlist">Get the app</Link>
              ) : (
                <a href={cta.href} onClick={cta.onClick}>Get the app</a>
              )}
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
