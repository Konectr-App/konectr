// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Link, usePathname } from "@/i18n/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "./ui/button";
import { brand } from "@/config/brand";
import { usePrimaryCta } from "@/lib/usePrimaryCta";

export function Navigation() {
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const { scrollY } = useScroll();
  const cta = usePrimaryCta("nav");

  // Check if on homepage (pathname is "/" after locale is stripped by next-intl)
  const isHomepage = pathname === "/";

  // Theme-aware nav surface: white in light mode, graphite (matches --card oklch(0.18 0 0))
  // in dark mode. Hardcoding white turned the floating pill bright white on scroll in dark mode.
  const navRgb = resolvedTheme === "dark" ? "24, 24, 24" : "255, 255, 255";

  // Transform values based on scroll
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    [`rgba(${navRgb}, 0)`, `rgba(${navRgb}, 0.95)`]
  );
  const backdropBlur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(20px)"]);
  const padding = useTransform(scrollY, [0, 100], ["16px 32px", "12px 24px"]);
  const boxShadow = useTransform(
    scrollY,
    [0, 100],
    ["0 0 0 rgba(0,0,0,0)", "0 8px 32px rgba(0,0,0,0.08)"]
  );

  // Nav renders in SSR markup (no mount gate) so it's present on first paint / for
  // crawlers. Pre-scroll background is transparent regardless of theme, so there's no
  // visible hydration delta; suppressHydrationWarning guards the scrolled-refresh edge.
  return (
    <motion.nav
      suppressHydrationWarning
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full border border-border/50 dark:border-border"
      style={{
        backgroundColor,
        backdropFilter: backdropBlur,
        WebkitBackdropFilter: backdropBlur,
        padding,
        boxShadow,
      }}
    >
      <div className="flex items-center gap-6">
        {/* Full logo on inner pages; the mark alone on the homepage, where the hero carries the brand line. */}
        <Link href="/" className="flex shrink-0 items-center hover:opacity-80 transition-opacity" aria-label="Konectr">
          {isHomepage ? (
            <Image src="/logos/konectr-icon-orange.svg" alt="" width={32} height={32} className="h-8 w-8" priority />
          ) : (
            <Image
              src={brand.assets.logoOrange}
              alt="Konectr"
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
          )}
        </Link>

        {/* Nav Links - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink href="/how-it-works">{t("howItWorks")}</NavLink>
          <NavLink href="/about">{t("about")}</NavLink>
          <NavLink href="/safety">{t("safety")}</NavLink>
          <NavLink href="/blog">{t("blog")}</NavLink>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          {/* Visible on phones too — it was sm+ only, so mobile had no CTA until the hero. */}
          <Button
            size="sm"
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            asChild
          >
            {cta.href === "#waitlist" ? (
              <Link href="/#waitlist">{t("joinWaitlist")}</Link>
            ) : (
              <a href={cta.href} onClick={cta.onClick}>
                {/* Short label on phones so the pill fits beside the mark. */}
                <span className="sm:hidden">{t("getApp")}</span>
                <span className="hidden sm:inline">{cta.label}</span>
              </a>
            )}
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-[width] group-hover:w-full" />
    </Link>
  );
}
