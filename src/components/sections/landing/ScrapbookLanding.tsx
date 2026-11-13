// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
//
// Scrapbook landing page (konectr-mvp#669). Almost nobody scrolls past the first
// screen, so the hero carries the whole job: brand line, one store button matched
// to the phone, and real faces. City comes from the link (?c=bkk), never from a
// location prompt; only KL is spoken about as a city with plans running.

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ANDROID_STORE_URL, IOS_STORE_URL, detectPlatform, type Platform } from "@/lib/smartLink";
import { getUtmFields } from "@/lib/attribution";
import { CITIES, resolveCity, withCampaign, type CityKey } from "@/lib/landingCity";
import "./scrapbook.css";

type Store = "ios" | "android";
type PosthogLike = { capture: (event: string, props?: Record<string, unknown>) => void };

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.6 2.3c-.3.3-.5.8-.5 1.4v16.6c0 .6.2 1.1.5 1.4l.1.1 9.3-9.3v-.2L3.7 2.2l-.1.1z" />
      <path d="M16.1 15.6 13 12.5v-.2l3.1-3.1.1.1 3.7 2.1c1 .6 1 1.6 0 2.2l-3.7 2.1-.1-.1z" />
      <path d="M16.2 15.5 13 12.3 3.6 21.7c.3.4.9.4 1.5.1l11.1-6.3" />
      <path d="M16.2 8.5 5.1 2.2c-.6-.4-1.2-.3-1.5.1L13 11.7l3.2-3.2z" />
    </svg>
  );
}

/** Platform and city are browser facts, so both are read after hydration. */
function useVisit() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [city, setCity] = useState<CityKey | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlatform(detectPlatform());
    setCity(resolveCity(window.location.search));
  }, []);

  return { platform, city };
}

const PICKS = [
  { key: "brunch", src: "/images/activities/brunch.jpg" },
  { key: "kayaking", src: "/images/activities/kayaking.jpg" },
  { key: "photowalk", src: "/images/activities/photowalk.jpg" },
  { key: "badminton", src: "/images/landing/badminton.jpg" },
  { key: "boardgames", src: "/images/activities/games.jpg" },
  { key: "dragonboat", src: "/images/activities/dragonboat.jpg" },
] as const;

export function ScrapbookLanding() {
  const t = useTranslations("home.landing");
  const { platform, city } = useVisit();
  const heroCta = useRef<HTMLDivElement>(null);
  const [barShown, setBarShown] = useState(false);

  // The sticky bar appears once the hero button has scrolled away.
  useEffect(() => {
    const el = heroCta.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => {
      setBarShown(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Android gets Play first. iPhone, desktop and the server render get the App Store first.
  const first: Store = platform === "android" ? "android" : "ios";
  const second: Store = first === "ios" ? "android" : "ios";

  const href = (store: Store, source: string) =>
    withCampaign(store === "ios" ? IOS_STORE_URL : ANDROID_STORE_URL, store, {
      source,
      city,
      utmSource: typeof window === "undefined" ? undefined : getUtmFields().utm_source,
    });

  // Event names kept from the beta era so the PostHog hero funnel stays continuous.
  const track = (store: Store, source: string) => () => {
    const ph = (window as unknown as { posthog?: PosthogLike }).posthog;
    const props = { source, city: city ?? "none", variant: "scrapbook" };
    if (store === "ios") ph?.capture("clicked_testflight_cta", { platform, ...props });
    else ph?.capture("clicked_beta_cta", { mode: "open", platform: "android", ...props });
  };

  const storeButton = (store: Store, source: string, alt = false, id?: string) => (
    <a
      id={id}
      className={alt ? "lp-store lp-store-alt" : "lp-store"}
      href={href(store, source)}
      onClick={track(store, source)}
    >
      {store === "ios" ? <AppleIcon /> : <PlayIcon />}
      <span>{t(store === "ios" ? "appStore" : "googlePlay")}</span>
    </a>
  );

  const qr = (
    <div className="lp-qr">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/landing/qr-get.svg" alt="" width={104} height={104} />
      {t("qr")}
    </div>
  );

  return (
    <div className="lp">
      <header className="lp-hero">
        <div className="lp-wrap lp-grid">
          {/* Not animated: the h1 is the LCP element. */}
          <h1>
            <span>{t("headline.a")}</span>
            <span>{t("headline.b")}</span>
            <span>{t("headline.c")}</span>
          </h1>

          <div className="lp-pile">
            <figure className="lp-pol">
              <div className="lp-photo">
                <Image src="/images/email/friends-group.jpg" alt={t("polaroids.one.alt")} fill priority sizes="(min-width: 900px) 280px, 43vw" />
              </div>
              <figcaption>{t("polaroids.one.caption")}</figcaption>
            </figure>
            <figure className="lp-pol">
              <div className="lp-photo">
                <Image src="/images/homepage/hero.jpg" alt={t("polaroids.two.alt")} fill priority sizes="(min-width: 900px) 280px, 43vw" />
              </div>
              <figcaption>{t("polaroids.two.caption")}</figcaption>
            </figure>
            <figure className="lp-pol">
              <div className="lp-photo">
                <Image src="/images/activities/food.jpg" alt={t("polaroids.three.alt")} fill priority sizes="(min-width: 900px) 280px, 43vw" />
              </div>
              <figcaption>{t("polaroids.three.caption")}</figcaption>
            </figure>
            <span className="lp-stk lp-stk-plan">{t("stickers.plan")}</span>
            <span className="lp-stk lp-stk-crew">{t("stickers.crew")}</span>
          </div>

          <div className="lp-sub">
            <p>{city === "kl" ? t("subKl") : t("sub")}</p>
            {city && city !== "kl" && <p className="lp-city">{t("cityNew", { city: CITIES[city] })}</p>}
          </div>

          <div className="lp-cta">
            <div>
              <div className="lp-cta-row" ref={heroCta}>
                {storeButton(first, "home_hero", false, first === "ios" ? "cta-testflight" : "cta-play")}
                {storeButton(second, "home_hero", true)}
              </div>
              <a className="lp-also" href={href(second, "home_hero_alt")} onClick={track(second, "home_hero_alt")}>
                {t(second === "android" ? "alsoAndroid" : "alsoIphone")}
              </a>
              <p className="lp-free">{t("free")}</p>
            </div>
            {qr}
          </div>
        </div>
      </header>

      <section id="how" className="lp-band">
        <div className="lp-wrap">
          <h2>{t("how.title")}</h2>
          <ol className="lp-steps">
            <li>
              <div className="lp-step-photo">
                <Image src="/images/homepage/after.jpg" alt={t("how.one.alt")} fill sizes="(min-width: 900px) 340px, 330px" />
              </div>
              <h3>{t("how.one.title")}</h3>
              <p>{t("how.one.text")}</p>
              <div className="lp-demo">
                <span className="lp-chip lp-chip-on">{t("how.one.chipActivity")}</span>
                <span className="lp-chip">{t("how.one.chipPlace")}</span>
                <span className="lp-chip">{t("how.one.chipTime")}</span>
              </div>
            </li>
            <li>
              <div className="lp-step-photo">
                <Image src="/images/about/our-story.jpg" alt={t("how.two.alt")} fill sizes="(min-width: 900px) 340px, 330px" />
              </div>
              <h3>{t("how.two.title")}</h3>
              <p>{t("how.two.text")}</p>
              <div className="lp-demo">
                <span aria-hidden>
                  <span className="lp-face">AM</span>
                  <span className="lp-face">JL</span>
                  <span className="lp-face">SK</span>
                </span>
                <span className="lp-chip">{t("how.two.joined")}</span>
              </div>
            </li>
            <li>
              <div className="lp-step-photo">
                <Image src="/images/activities/nature.jpg" alt={t("how.three.alt")} fill sizes="(min-width: 900px) 340px, 330px" />
              </div>
              <h3>{t("how.three.title")}</h3>
              <p>{t("how.three.text")}</p>
              <div className="lp-demo">
                <span className="lp-bubble">{t("how.three.bubbleMe")}</span>
                <span className="lp-bubble lp-bubble-them">{t("how.three.bubbleThem")}</span>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* id kept from the old page: the footer "Activities" link points at /#vibes. */}
      <section id="vibes" className="lp-band">
        <div className="lp-wrap">
          <h2>{t("pick.title")}</h2>
          <div className="lp-acts">
            {PICKS.map((pick) => (
              <a key={pick.key} className="lp-act" href={href(first, "home_pick")} onClick={track(first, "home_pick")}>
                <div className="lp-photo">
                  <Image src={pick.src} alt={t(`pick.items.${pick.key}.alt`)} fill sizes="(min-width: 900px) 170px, 45vw" />
                </div>
                <span>{t(`pick.items.${pick.key}.label`)}</span>
              </a>
            ))}
          </div>
          <p className="lp-more">{t("pick.more")}</p>
        </div>
      </section>

      <section className="lp-band">
        <div className="lp-wrap lp-facts">
          {(["free", "group", "women"] as const).map((fact) => (
            <div key={fact}>
              <strong>
                <mark>{t(`facts.${fact}.mark`)}</mark>
                {t(`facts.${fact}.rest`)}
              </strong>
              <p>{t(`facts.${fact}.text`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* id kept from the old page: "Get the app" on inner pages falls back to /#waitlist. */}
      <section id="waitlist" className="lp-end">
        <div className="lp-wrap lp-end-row">
          <div>
            <h2>{t("end.title")}</h2>
            <p>{t("end.text")}</p>
          </div>
          <div className="lp-cta">
            <div className="lp-cta-row">
              {storeButton("ios", "home_footer")}
              {storeButton("android", "home_footer", true)}
            </div>
            {qr}
          </div>
        </div>
      </section>

      <div className="lp-bar" data-show={barShown} aria-hidden={!barShown}>
        <Image className="lp-bar-mark" src="/logos/konectr-mark-white-tight.svg" alt="" width={34} height={34} />
        <div>
          <b>{t("bar.name")}</b>
          {t("bar.text")}
        </div>
        <a href={href(first, "home_sticky")} onClick={track(first, "home_sticky")} tabIndex={barShown ? 0 : -1}>
          {t("bar.cta")}
        </a>
      </div>
    </div>
  );
}
