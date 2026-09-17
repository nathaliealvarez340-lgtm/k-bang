"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useState } from "react";
import { eventConfig } from "@/lib/event-config";
import { CheckoutModal } from "./CheckoutModal";
import { Countdown } from "./Countdown";
import { EventIcon } from "./EventIcon";
import { EventOverview } from "./EventOverview";
import { EventTimeline } from "./EventTimeline";
import { FAQ } from "./FAQ";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { LanguageProvider, useLanguage } from "./LanguageProvider";
import { ScrollProgress } from "./ScrollProgress";
import { TicketsSection } from "./TicketsSection";

const desktopHero = getImageProps({
  src: "/images/hero_desktop.png",
  alt: "",
  width: 1536,
  height: 1024,
  sizes: "100vw",
  priority: true,
}).props;

const mobileHero = getImageProps({
  src: "/images/hero_mobile.png",
  alt: "",
  width: 864,
  height: 1536,
  sizes: "100vw",
}).props;

const experiencePanels = [
  {
    src: "/images/images_1.png",
    className: "experience-card--lead",
  },
  {
    src: "/images/images_2.png",
    className: "experience-card--moon",
  },
  {
    src: "/images/images_3.png",
    className: "experience-card--stage",
  },
];

export function CrystalMoonLanding() {
  return (
    <LanguageProvider>
      <LandingContent />
    </LanguageProvider>
  );
}

function LandingContent() {
  const { t } = useLanguage();
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  const openCheckout = () => setCheckoutOpen(true);
  const closeCheckout = () => setCheckoutOpen(false);

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <ScrollProgress />
      <Header onReserve={openCheckout} />
      <main className="cosmic-page">
        <div className="cosmic-background" aria-hidden="true">
          <span className="star-field star-field--near" />
          <span className="star-field star-field--far" />
          <span className="nebula nebula--blue" />
          <span className="nebula nebula--rose" />
        </div>

        <section className="hero" id="evento">
          <picture className="hero__picture" aria-hidden="true">
            <source media="(max-width: 760px)" srcSet={mobileHero.srcSet} />
            <img {...desktopHero} alt="" className="hero__media" />
          </picture>
          <div className="hero__scrim" aria-hidden="true" />

          <div className="hero__content hero-intro">
            <p className="hero__presenter"><span>K-BANG</span> {t.hero.presenter}</p>
            <p className="hero__kicker">{t.hero.location} · {t.hero.monthYear}</p>
            <h1>
              <span className="font-citadel">Crystal</span>
              <span className="hero__moon">Moon</span>
            </h1>
            <p className="hero__tagline">{t.hero.tagline}</p>
            <button className="button button--primary hero__cta" onClick={openCheckout}>
              {t.hero.reserve} <span aria-hidden="true">↗</span>
            </button>
          </div>

          <div className="hero__utility hero-intro hero-intro--utility">
            <div className="hero-event-meta" aria-label={t.hero.infoAria}>
              <div className="hero-event-meta__item">
                <EventIcon name="calendar" />
                <span><small>{t.hero.dateLabel}</small>{t.hero.date}</span>
              </div>
              <div className="hero-event-meta__item">
                <EventIcon name="clock" />
                <span><small>{t.hero.timeLabel}</small>{t.hero.time}</span>
              </div>
              <div className="hero-event-meta__item">
                <EventIcon name="location" />
                <span><small>{t.hero.placeLabel}</small>{t.hero.place}</span>
              </div>
              <div className="hero-event-meta__item">
                <EventIcon name="people" />
                <span><small>{t.hero.audienceLabel}</small>{t.hero.audience}</span>
              </div>
            </div>
            <div className="hero__countdown">
              <p>{t.hero.countdownIntro}</p>
              <Countdown targetDate={eventConfig.eventDate} />
            </div>
          </div>
        </section>

        <div className="panel-stack">
          <EventOverview />

          <section className="experience section-band reveal" id="experiencia">
            <div className="section-heading section-heading--split">
              <div>
                <p className="eyebrow">{t.experience.eyebrow}</p>
                <h2 className="section-title">{t.experience.title}</h2>
              </div>
              <p>{t.experience.description}</p>
            </div>
            <div className="experience__gallery">
              {experiencePanels.map((panel, index) => (
                <figure className={`experience-card ${panel.className}`} key={panel.src}>
                  <Image
                    src={panel.src}
                    alt={t.experience.panels[index].alt}
                    fill
                    sizes={index === 0 ? "(max-width: 760px) 100vw, 62vw" : "(max-width: 760px) 100vw, 36vw"}
                  />
                  <figcaption>
                    <span>{t.experience.panels[index].eyebrow}</span>
                    <strong>{t.experience.panels[index].title}</strong>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <EventTimeline />
          <TicketsSection onReserve={openCheckout} />
          <FAQ />
        </div>
      </main>
      <Footer onReserve={openCheckout} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={closeCheckout} />
    </>
  );
}
