"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { useCompactLayout } from "./useCompactLayout";

type HeaderProps = {
  onReserve: () => void;
};

export function Header({ onReserve }: HeaderProps) {
  const { locale, setLocale, t } = useLanguage();
  const compact = useCompactLayout();
  const [isLanguageOpen, setLanguageOpen] = useState(false);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setLanguageOpen(false);
      }
      if (!mobileNavRef.current?.contains(event.target as Node)) {
        setMobileNavOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLanguageOpen(false);
        setMobileNavOpen(false);
      }
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
      <a className="brand" href="#evento" aria-label={t.header.brandAria}>
        <strong>K-BANG</strong>
        <span>Crystal Moon</span>
      </a>
      <nav className="site-nav" aria-label={t.header.navigationAria}>
        <a href="#que-es">{t.header.about}</a>
        <a href="#experiencia">{t.header.experience}</a>
        <a href="#dinamica">{t.header.event}</a>
        <a href="#boletos">{t.header.tickets}</a>
        <a href="#faq">{t.header.faq}</a>
      </nav>
      <div className="site-header__actions">
        {compact && (
          <div className="mobile-nav" ref={mobileNavRef}>
            <button
              className="mobile-nav__trigger"
              type="button"
              aria-label={t.header.navigationAria}
              aria-expanded={isMobileNavOpen}
              aria-controls="mobile-navigation"
              onClick={() => { setMobileNavOpen((open) => !open); setLanguageOpen(false); }}
            >
              <span aria-hidden="true">☰</span>
            </button>
            <nav className="mobile-nav__panel" id="mobile-navigation" aria-label={t.header.navigationAria} hidden={!isMobileNavOpen}>
              <a href="#que-es" onClick={() => setMobileNavOpen(false)}>{t.header.about}</a>
              <a href="#experiencia" onClick={() => setMobileNavOpen(false)}>{t.header.experience}</a>
              <a href="#dinamica" onClick={() => setMobileNavOpen(false)}>{t.header.event}</a>
              <a href="#boletos" onClick={() => setMobileNavOpen(false)}>{t.header.tickets}</a>
              <a href="#faq" onClick={() => setMobileNavOpen(false)}>{t.header.faq}</a>
            </nav>
          </div>
        )}
        <div className="language-menu" ref={languageMenuRef}>
          <button
            className="language-menu__trigger"
            type="button"
            aria-label={t.header.languageAria}
            aria-expanded={isLanguageOpen}
            aria-controls="language-options"
            onClick={() => { setLanguageOpen((current) => !current); setMobileNavOpen(false); }}
          >
            <span className="language-icon" aria-hidden="true">🌐</span>
          </button>
          <div className="language-menu__dropdown" data-open={isLanguageOpen} id="language-options">
            <button type="button" aria-pressed={locale === "es"} onClick={() => { setLocale("es"); setLanguageOpen(false); }}>{t.header.spanish}</button>
            <button type="button" aria-pressed={locale === "en"} onClick={() => { setLocale("en"); setLanguageOpen(false); }}>{t.header.english}</button>
          </div>
        </div>
        <button className="button button--header" onClick={onReserve}>
          <span className="button--header__full">{t.header.reserve}</span>
          <span className="button--header__short">{t.header.tickets}</span>
        </button>
      </div>
    </header>
  );
}
