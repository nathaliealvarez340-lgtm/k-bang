import { useLanguage } from "./LanguageProvider";

type FooterProps = {
  onReserve: () => void;
};

export function Footer({ onReserve }: FooterProps) {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="site-footer__cta">
        <p className="eyebrow">K-BANG {t.footer.presenter}</p>
        <h2 className="section-title section-title--footer"><span className="font-citadel">Crystal</span> Moon</h2>
        <p>{t.footer.tagline}</p>
        <button className="button button--primary" onClick={onReserve}>
          {t.footer.reserve} <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div className="site-footer__meta">
        <strong>K-BANG · Crystal Moon</strong>
        <span>{t.hero.date}</span>
        <span>{t.hero.place}</span>
        <small>© 2026 K-BANG</small>
      </div>
    </footer>
  );
}
