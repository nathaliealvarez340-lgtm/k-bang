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
    alt: "Grupo de baile sobre un escenario lunar",
    eyebrow: "Energía en escena",
    title: "El performance toma la noche",
    className: "experience-card--lead",
  },
  {
    src: "/images/images_2.png",
    alt: "Instalación escénica de luna y cristales",
    eyebrow: "Dirección visual",
    title: "Una atmósfera que transforma cada presentación",
    className: "experience-card--moon",
  },
  {
    src: "/images/images_3.png",
    alt: "Escenario iluminado con paneles azules",
    eyebrow: "Crystal Stage",
    title: "Luz, música y un cierre para recordar",
    className: "experience-card--stage",
  },
];

export function CrystalMoonLanding() {
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
            <p className="hero__presenter"><span>K-BANG</span> presenta</p>
            <p className="hero__kicker">Tec de Monterrey · Campus CCM · Agosto 2026</p>
            <h1>
              <span className="font-citadel">Crystal</span>
              <span className="hero__moon">Moon</span>
            </h1>
            <p className="hero__tagline">Donde el escenario es tuyo</p>
            <button className="button button--primary" onClick={openCheckout}>
              Reservar mi boleto <span aria-hidden="true">↗</span>
            </button>
          </div>

          <div className="hero__utility hero-intro hero-intro--utility">
            <div className="hero-event-meta" aria-label="Información del evento">
              <div className="hero-event-meta__item">
                <EventIcon name="calendar" />
                <span><small>Fecha</small>22 de agosto, 2026</span>
              </div>
              <div className="hero-event-meta__item">
                <EventIcon name="clock" />
                <span><small>Horario</small>Hora por confirmar</span>
              </div>
              <div className="hero-event-meta__item">
                <EventIcon name="location" />
                <span><small>Lugar</small>Tec de Monterrey, CCM</span>
              </div>
              <div className="hero-event-meta__item">
                <EventIcon name="people" />
                <span><small>Audiencia</small>Comunidad Tec, Exatecs y Externos</span>
              </div>
            </div>
            <div className="hero__countdown">
              <p>La noche comienza en</p>
              <Countdown targetDate={eventConfig.eventDate} />
            </div>
          </div>
        </section>

        <div className="panel-stack">
          <EventOverview />

          <section className="experience section-band reveal" id="experiencia">
            <div className="section-heading section-heading--split">
              <div>
                <p className="eyebrow">La experiencia</p>
                <h2>Una noche diseñada para sentirse en movimiento</h2>
              </div>
              <p>
                Baile, luz y una escenografía lunar se encuentran en una experiencia
                donde cada presentación forma parte del espectáculo.
              </p>
            </div>
            <div className="experience__gallery">
              {experiencePanels.map((panel, index) => (
                <figure className={`experience-card ${panel.className}`} key={panel.src}>
                  <Image
                    src={panel.src}
                    alt={panel.alt}
                    fill
                    sizes={index === 0 ? "(max-width: 760px) 100vw, 62vw" : "(max-width: 760px) 100vw, 36vw"}
                  />
                  <figcaption>
                    <span>{panel.eyebrow}</span>
                    <strong>{panel.title}</strong>
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
