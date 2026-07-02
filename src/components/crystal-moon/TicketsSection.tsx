import { eventConfig } from "@/lib/event-config";
import { formatCurrency } from "@/lib/registration";

type TicketsSectionProps = {
  onReserve: () => void;
};

export function TicketsSection({ onReserve }: TicketsSectionProps) {
  const ticket = eventConfig.ticketTypes[0];
  const displayPrice = ticket.price && ticket.price > 0 ? ticket.price : null;

  return (
    <section className="tickets section-band" id="boletos">
      <div className="tickets__content">
        <p className="eyebrow">Boletos</p>
        <h2>Reserva tu lugar bajo la Crystal Moon</h2>
        <p>
          Aparta tus boletos y sube tu comprobante cuando estén confirmados los
          datos de pago. El flujo queda listo para conectar con backend,
          storage y correo de confirmación.
        </p>
      </div>
      <article className="ticket-card">
        <span className="ticket-card__label">Disponible</span>
        <h3>{ticket.name}</h3>
        <p>{ticket.description}</p>
        <strong>{formatCurrency(displayPrice)}</strong>
        <button className="button button--primary" onClick={onReserve}>
          Reservar boleto
        </button>
      </article>
    </section>
  );
}
