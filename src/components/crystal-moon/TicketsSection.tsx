import Image from "next/image";
import { eventConfig } from "@/lib/event-config";
import { formatCurrency } from "@/lib/registration";

type TicketsSectionProps = {
  onReserve: () => void;
};

export function TicketsSection({ onReserve }: TicketsSectionProps) {
  const ticket = eventConfig.ticketTypes[0];
  const displayPrice = ticket.price && ticket.price > 0 ? ticket.price : null;

  return (
    <section className="tickets section-band reveal" id="boletos">
      <div className="tickets__visual" aria-hidden="true">
        <Image src="/images/images_4.png" alt="" fill sizes="(max-width: 900px) 100vw, 60vw" />
      </div>
      <div className="tickets__content">
        <p className="eyebrow">Boletos</p>
        <h2>Tu lugar frente al escenario empieza aquí</h2>
        <p>
          Registra tu interés y sé parte de una noche de competencia, música y
          dirección visual creada para vivirse en primera fila.
        </p>
        <div className="tickets__value-list" aria-label="Beneficios del registro">
          <span>Acceso al evento</span>
          <span>Confirmación por correo</span>
          <span>Comunidad abierta</span>
        </div>
      </div>
      <article className="ticket-card">
        <div className="ticket-card__date" aria-hidden="true">
          <strong>22</strong>
          <span>AGO<br />2026</span>
        </div>
        <div className="ticket-card__body">
          <span className="ticket-card__label">Registro de interés abierto</span>
          <h3>{ticket.name}</h3>
          <p>{ticket.description}</p>
          <strong className="ticket-card__price">
            {displayPrice ? formatCurrency(displayPrice) : "Preventa próximamente"}
          </strong>
          <small>Te avisaremos cuando se publiquen precio y detalles de pago.</small>
          <button className="button button--primary" onClick={onReserve}>
            Reservar mi boleto <span aria-hidden="true">↗</span>
          </button>
        </div>
      </article>
    </section>
  );
}
