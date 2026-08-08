import { eventConfig } from "@/lib/event-config";

type FooterProps = {
  onReserve: () => void;
};

export function Footer({ onReserve }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="site-footer__cta">
        <p className="eyebrow">K-BANG presenta</p>
        <h2><span className="font-citadel">Crystal</span> Moon</h2>
        <p>{eventConfig.tagline}</p>
        <button className="button button--primary" onClick={onReserve}>
          Reservar mi boleto <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div className="site-footer__meta">
        <strong>K-BANG · Crystal Moon</strong>
        <span>{eventConfig.eventDateLabel}</span>
        <span>{eventConfig.eventLocation}</span>
        <small>© 2026 K-BANG</small>
      </div>
    </footer>
  );
}
