import { eventConfig } from "@/lib/event-config";
import { formatCurrency } from "@/lib/registration";
import { useLanguage } from "./LanguageProvider";

type TicketsSectionProps = {
  onReserve: () => void;
};

export function TicketsSection({ onReserve }: TicketsSectionProps) {
  const { locale, t } = useLanguage();
  const ticket = eventConfig.ticketTypes[0];
  const displayPrice = ticket.price && ticket.price > 0 ? ticket.price : null;

  return (
    <section className="tickets section-band reveal" id="boletos">
      <div className="tickets__content">
        <p className="eyebrow">{t.tickets.eyebrow}</p>
        <h2 className="section-title">{t.tickets.title}</h2>
        <p>{t.tickets.description}</p>
        <div className="tickets__value-list" aria-label={t.tickets.benefitsAria}>
          {t.tickets.benefits.map((benefit) => <span key={benefit}>{benefit}</span>)}
        </div>
      </div>
      <article className="ticket-card">
        <div className="ticket-card__date" aria-hidden="true">
          <strong>{eventConfig.eventDay}</strong>
          <span>{eventConfig.eventMonthShort}<br />{eventConfig.eventYear}</span>
        </div>
        <div className="ticket-card__body">
          <span className="ticket-card__label">{t.tickets.registrationOpen}</span>
          <h3>{t.tickets.ticketName}</h3>
          <p>{t.tickets.ticketDescription}</p>
          <strong className="ticket-card__price">
            {displayPrice ? formatCurrency(displayPrice, locale) : t.tickets.presale}
          </strong>
          <small>{t.tickets.note}</small>
          <button className="button button--primary" onClick={onReserve}>
            {t.tickets.reserve} <span aria-hidden="true">↗</span>
          </button>
        </div>
      </article>
    </section>
  );
}
