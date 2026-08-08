export type TicketType = {
  id: string;
  name: string;
  price?: number;
  description: string;
  enabled: boolean;
};

export const eventConfig = {
  eventName: "Crystal Moon",
  organizer: "K-BANG",
  tagline: "Donde el escenario es tuyo",
  eventDate: "2026-08-22T00:00:00-06:00",
  eventDateLabel: "22 de agosto de 2026",
  eventTimeLabel: "Hora por confirmar",
  eventLocation: "Tec de Monterrey, Campus CCM",
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
