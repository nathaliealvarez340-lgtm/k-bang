export type TicketType = {
  id: string;
  name: string;
  price?: number;
  description: string;
  enabled: boolean;
};

const eventDate = "2026-11-07T00:00:00-06:00";
const dateParts = new Intl.DateTimeFormat("es-MX", {
  timeZone: "America/Mexico_City",
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).formatToParts(new Date(eventDate));
const datePart = (type: "weekday" | "day" | "month" | "year") =>
  dateParts.find((part) => part.type === type)?.value ?? "";
const day = datePart("day");
const month = datePart("month");
const year = datePart("year");
const weekday = datePart("weekday");

export const eventConfig = {
  eventName: "Crystal Moon",
  organizer: "K-BANG",
  tagline: "Donde el escenario es tuyo",
  eventDate,
  eventDateLabel: `${day} de ${month}, ${year}`,
  eventDateLong: `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${day} de ${month} de ${year}`,
  eventMonthYear: `${month.charAt(0).toUpperCase()}${month.slice(1)} ${year}`,
  eventDay: day,
  eventMonthShort: month.slice(0, 3).toUpperCase(),
  eventYear: year,
  eventTimeLabel: "Hora por confirmar",
  eventLocation: "Tec de Monterrey, CCM",
  eventHeroLocation: "Tec de Monterrey · Campus CCM",
  eventAudience: "Para Comunidad Tec, Exatecs y Externos",
  contactEmail: "CONTACTO_POR_DEFINIR",
  ticketTypes: [
    {
      id: "general",
      name: "Boleto general",
      price: 0,
      description: "Acceso general al evento Crystal Moon",
      enabled: true,
    },
  ] satisfies TicketType[],
  payment: {
    bankName: "BANCO_POR_DEFINIR",
    accountHolder: "NOMBRE_POR_DEFINIR",
    clabe: "CLABE_POR_DEFINIR",
    instructions:
      "Realiza la transferencia y sube tu comprobante para confirmar tu lugar.",
  },
};

export const hasConfirmedPaymentDetails =
  eventConfig.payment.clabe !== "CLABE_POR_DEFINIR";
