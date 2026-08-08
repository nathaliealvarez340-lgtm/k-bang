"use client";

import { useEffect, useRef, useState } from "react";

type HeaderProps = {
  onReserve: () => void;
};

export function Header({ onReserve }: HeaderProps) {
  const [isLanguageOpen, setLanguageOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setLanguageOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLanguageOpen(false);
    };

    document.addEventListener("pointerdown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header className="site-header">
      <a className="brand" href="#evento" aria-label="K-BANG, volver al inicio">
        <strong>K-BANG</strong>
        <span>Crystal Moon</span>
      </a>
      <nav className="site-nav" aria-label="Navegación principal">
        <a href="#que-es">Qué es</a>
        <a href="#experiencia">Experiencia</a>
        <a href="#dinamica">Evento</a>
        <a href="#boletos">Boletos</a>
        <a href="#faq">FAQ</a>
      </nav>
      <div className="site-header__actions">
        <div className="language-menu" ref={languageMenuRef}>
          <button
            className="language-menu__trigger"
            type="button"
            aria-label="Seleccionar idioma"
            aria-expanded={isLanguageOpen}
            aria-controls="language-options"
            onClick={() => setLanguageOpen((current) => !current)}
          >
            <span className="language-icon" aria-hidden="true">🌐</span>
          </button>
          <div className="language-menu__dropdown" data-open={isLanguageOpen} id="language-options">
            <button type="button" onClick={() => setLanguageOpen(false)}>Español</button>
            <button type="button" onClick={() => setLanguageOpen(false)}>English</button>
          </div>
        </div>
        <button className="button button--header" onClick={onReserve}>
          <span className="button--header__full">Reservar boleto</span>
          <span className="button--header__short">Boletos</span>
        </button>
      </div>
    </header>
  );
}
