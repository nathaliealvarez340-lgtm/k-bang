"use client";

import { useState } from "react";

type HeaderProps = {
  onReserve: () => void;
};

export function Header({ onReserve }: HeaderProps) {
  const [isLanguageOpen, setLanguageOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand" href="#evento" aria-label="K-BANG">
        <strong>K-BANG</strong>
      </a>
      <nav className="site-nav" aria-label="Navegación principal">
        <a href="#que-es">Qué es</a>
        <a href="#dinamica">Evento</a>
        <a href="#boletos">Boletos</a>
        <a href="#faq">FAQ</a>
      </nav>
      <div className="site-header__actions">
        <div className="language-menu">
          <button
            className="language-menu__trigger"
            type="button"
            aria-label="Seleccionar idioma"
            aria-expanded={isLanguageOpen}
            onClick={() => setLanguageOpen((current) => !current)}
          >
            <span className="language-icon" aria-hidden="true" />
          </button>
          <div className="language-menu__dropdown" data-open={isLanguageOpen}>
            <button type="button">Español</button>
            <button type="button">English</button>
          </div>
        </div>
        <button className="button button--header" onClick={onReserve}>
          Reservar boleto
        </button>
      </div>
    </header>
  );
}
