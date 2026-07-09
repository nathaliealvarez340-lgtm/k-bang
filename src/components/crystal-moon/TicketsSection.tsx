import { eventConfig } from "@/lib/event-config";
import { formatCurrency } from "@/lib/registration";

type TicketsSectionProps = {
  onReserve: () => void;
};

export function TicketsSection({ onReserve }: TicketsSectionProps) {
  const ticket = eventConfig.ticketTypes[0];
  const displayPrice = ticket.price && ticket.price > 0 ? ticket.price : null;

  return (
    <section className="tickets section-band spatial-panel reveal" id="boletos">
      <div className="tickets__content">
        <p className="eyebrow">Boletos</p>
        <h2>Tu entrada a la noche donde el escenario despierta</h2>
        <p>
          Reserva ahora y asegura tu lugar en una experiencia de baile con
          estética lunar, energía de escenario y una atmósfera pensada para
          recordar la noche completa.
        </p>
        <div className="tickets__value-list" aria-label="Beneficios del boleto">
          <span>Acceso al evento</span>
          <span>Referencia única</span>
          <span>Confirmación por correo</span>
        </div>
      </div>
      <article className="ticket-card">
        <span className="ticket-card__label">Reserva abierta</span>
        <h3>{ticket.name}</h3>
        <p>{ticket.description}</p>
        <strong>{formatCurrency(displayPrice)}</strong>
        <small>Pago y comprobante listos para activarse al confirmar datos bancarios.</small>
        <button className="button button--primary" onClick={onReserve}>
          Reservar boleto
        </button>
      </article>
    </section>
  );
}
