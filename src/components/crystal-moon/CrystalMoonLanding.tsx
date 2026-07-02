"use client";

import { useState } from "react";
import { eventConfig } from "@/lib/event-config";
import { CheckoutModal } from "./CheckoutModal";
import { Countdown } from "./Countdown";
import { EventOverview } from "./EventOverview";
import { EventTimeline } from "./EventTimeline";
import { FAQ } from "./FAQ";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { TicketsSection } from "./TicketsSection";

export function CrystalMoonLanding() {
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  const openCheckout = () => setCheckoutOpen(true);
  const closeCheckout = () => setCheckoutOpen(false);

  return (
    <>
      <Header onReserve={openCheckout} />
      <main>
        <section className="hero" id="evento">
          <div className="hero__stars" aria-hidden="true" />
          <div className="hero__content">
            <p className="eyebrow">K-BANG presenta</p>
            <h1>Crystal Moon</h1>
            <p className="hero__tagline">{eventConfig.tagline}</p>
            <p className="hero__copy">
              Un concurso de baile creado para transformar el escenario en una
              noche lunar: talento, energía, creatividad y presencia escénica
              bajo el brillo de Crystal Moon.
            </p>
            <div className="hero__meta" aria-label="Información del evento">
              <span>{eventConfig.eventDateLabel}</span>
              <span>{eventConfig.eventLocation}</span>
            </div>
            <div className="hero__actions">
              <button className="button button--primary" onClick={openCheckout}>
                Reservar mi boleto
              </button>
              <a className="button button--secondary" href="#dinamica">
                Ver dinámica
              </a>
            </div>
          </div>
          <div className="hero__visual" aria-hidden="true">
            <div className="moon-orbit moon-orbit--outer" />
            <div className="moon-orbit moon-orbit--inner" />
            <div className="crystal-moon">
              <span className="crystal-moon__dancer" />
            </div>
            <div className="hero__spark hero__spark--one" />
            <div className="hero__spark hero__spark--two" />
          </div>
          <Countdown targetDate={eventConfig.eventDate} />
        </section>

        <EventOverview />

        <section className="experience section-band">
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
      </main>
      <Footer />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={closeCheckout} />
    </>
  );
}
