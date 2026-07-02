import { eventConfig } from "@/lib/event-config";

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Crystal Moon · K-BANG</strong>
        <p>{eventConfig.tagline}</p>
      </div>
      <div>
        <span>{eventConfig.eventDateLabel}</span>
        <span>{eventConfig.eventLocation}</span>
        <span>Contacto temporal por definir</span>
      </div>
    </footer>
  );
}
