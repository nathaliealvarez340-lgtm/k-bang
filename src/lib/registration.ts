import { eventConfig, type TicketType } from "./event-config";

export type AttendeeRole = "participante" | "publico" | "staff";

export type RegistrationFormData = {
  fullName: string;
  email: string;
  phone: string;
  ticketType: string;
  quantity: number;
  role: AttendeeRole;
  comments?: string;
};

export type RegistrationData = RegistrationFormData & {
  reference: string;
  total: number | null;
  ticketLabel: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  proofFileName?: string;
  createdAt: string;
};

export function createReference(date = new Date()) {
  const stamp = date.toISOString().slice(0, 10).replaceAll("-", "");
  const token =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 4)
      : Math.random().toString(36).slice(2, 6);

  return `CM-${stamp}-${token.toUpperCase()}`;
}

export function getTicket(ticketId: string): TicketType {
  return (
    eventConfig.ticketTypes.find((ticket) => ticket.id === ticketId) ??
    eventConfig.ticketTypes[0]
  );
}

export function calculateTotal(ticketId: string, quantity: number) {
  const ticket = getTicket(ticketId);

  if (!ticket.price || ticket.price <= 0) {
    return null;
  }

  return ticket.price * quantity;
}

export function formatCurrency(total: number | null) {
  if (total === null) {
    return "Precio por confirmar";
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(total);
}

export async function submitRegistration(registration: RegistrationData) {
  // TODO: Connect this placeholder to an API route, persistent database,
  // storage for proof files, and Resend email delivery.
  if (typeof window !== "undefined") {
    const existing = window.localStorage.getItem("crystalMoonRegistrations");
    const registrations = existing ? JSON.parse(existing) : [];
    registrations.push(registration);
    window.localStorage.setItem(
      "crystalMoonRegistrations",
      JSON.stringify(registrations),
    );
  }

  return { ok: true, registration };
}
