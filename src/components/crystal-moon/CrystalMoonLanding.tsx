"use client";

import { useEffect, useState } from "react";
import { eventConfig } from "@/lib/event-config";
import { BackgroundVideo } from "./BackgroundVideo";
import { CheckoutModal } from "./CheckoutModal";
import { Countdown } from "./Countdown";
import { EventOverview } from "./EventOverview";
import { EventTimeline } from "./EventTimeline";
import { FAQ } from "./FAQ";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ScrollProgress } from "./ScrollProgress";
import { TicketsSection } from "./TicketsSection";

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
          }
        });
      },
      { rootMargin: "0px 0px -16% 0px", threshold: 0.2 },
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
          <BackgroundVideo />
          <span className="star-field star-field--near" />
          <span className="star-field star-field--far" />
          <span className="nebula nebula--blue" />
          <span className="nebula nebula--rose" />
          <span className="orbital-line orbital-line--one" />
          <span className="orbital-line orbital-line--two" />
        </div>

        <section className="hero spatial-panel" id="evento">
          <div className="hero__content hero-intro">
            <p className="hero__kicker">Tec de Monterrey · Campus CCM · Agosto 2026</p>
            <h1>
              <span className="font-citadel italic">Crystal</span>
              <span> Moon</span>
            </h1>
            <p className="hero__tagline">Donde el escenario es tuyo</p>
            <div className="hero__actions">
              <button className="button button--primary" onClick={openCheckout}>
                Reservar mi boleto
              </button>
            </div>
          </div>

          <div className="hero__scene hero-intro hero-intro--scene" aria-hidden="true">
            <span className="lunar-halo" />
            <span className="stage-veil stage-veil--left" />
            <span className="stage-veil stage-veil--right" />
            <span className="crystal-shard crystal-shard--one" />
            <span className="crystal-shard crystal-shard--two" />
            <span className="crystal-shard crystal-shard--three" />
            <span className="constellation-dot constellation-dot--one" />
            <span className="constellation-dot constellation-dot--two" />
            <span className="constellation-dot constellation-dot--three" />
          </div>

          <div className="hero__countdown hero-intro hero-intro--countdown">
            <Countdown targetDate={eventConfig.eventDate} />
          </div>
        </section>

        <div className="panel-stack">
          <EventOverview />

          <section className="experience section-band spatial-panel reveal">
            <div className="section-heading">
              <p className="eyebrow">La experiencia</p>
              <h2>Una noche hecha para brillar</h2>
            </div>
            <div className="experience__layout">
              <div className="experience__panel experience__panel--stage">
                <span>Escenario lunar</span>
                <strong>Luz, presencia y una atmósfera de performance.</strong>
              </div>
              <div className="experience__panel">
                <span>Decoración nocturna</span>
                <strong>Estrellas, cristales, telas y detalles dorados.</strong>
              </div>
              <div className="experience__panel">
                <span>Detalles temáticos</span>
                <strong>Snacks, invitaciones y tickets con estética lunar.</strong>
              </div>
            </div>
          </section>

          <EventTimeline />
          <TicketsSection onReserve={openCheckout} />
          <FAQ />
        </div>
      </main>
      <Footer />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={closeCheckout} />
    </>
  );
}
