"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { eventConfig, hasConfirmedPaymentDetails } from "@/lib/event-config";
import {
  calculateTotal,
  createReference,
  formatCurrency,
  getTicket,
  submitRegistration,
  type AttendeeRole,
  type RegistrationData,
  type RegistrationFormData,
} from "@/lib/registration";

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Step = "datos" | "pago" | "comprobante" | "exito";

const initialForm: RegistrationFormData = {
  fullName: "",
  email: "",
  phone: "",
  ticketType: eventConfig.ticketTypes[0].id,
  quantity: 1,
  role: "publico",
  comments: "",
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState<Step>("datos");
  const [form, setForm] = useState<RegistrationFormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reference, setReference] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [registration, setRegistration] = useState<RegistrationData | null>(
    null,
  );
  const modalRef = useRef<HTMLDivElement>(null);

  const ticket = useMemo(() => getTicket(form.ticketType), [form.ticketType]);
  const total = useMemo(
    () => calculateTotal(form.ticketType, form.quantity),
    [form.quantity, form.ticketType],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setReference(createReference());
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => modalRef.current?.focus(), 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setStep("datos");
      setErrors({});
      setProofFile(null);
      setRegistration(null);
      setForm(initialForm);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const updateField = <K extends keyof RegistrationFormData>(
    key: K,
    value: RegistrationFormData[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const validateData = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Escribe tu nombre completo.";
    }

    if (!isValidEmail(form.email)) {
      nextErrors.email = "Escribe un correo válido.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Escribe tu teléfono o WhatsApp.";
    }

    if (form.quantity < 1) {
      nextErrors.quantity = "Selecciona al menos 1 boleto.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goToPayment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateData()) {
      setStep("pago");
    }
  };

  const finishRegistration = async () => {
    const registrationData: RegistrationData = {
      ...form,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      comments: form.comments?.trim(),
      reference,
      total,
      ticketLabel: ticket.name,
      eventName: eventConfig.eventName,
      eventDate: eventConfig.eventDate,
      eventLocation: eventConfig.eventLocation,
      proofFileName: proofFile?.name,
      createdAt: new Date().toISOString(),
    };

    await submitRegistration(registrationData);
    setRegistration(registrationData);
    setStep("exito");
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        aria-labelledby="checkout-title"
        aria-modal="true"
        className="checkout"
        onMouseDown={(event) => event.stopPropagation()}
        ref={modalRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="checkout__header">
          <div>
            <p className="eyebrow">Reserva Crystal Moon</p>
            <h2 id="checkout-title">
              {step === "exito" ? "Registro enviado" : "Reserva tu boleto"}
            </h2>
          </div>
          <button
            aria-label="Cerrar reserva"
            className="icon-button"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        {step !== "exito" && (
          <div className="checkout__steps" aria-label="Progreso de reserva">
            {["datos", "pago", "comprobante"].map((item, index) => (
              <span className={step === item ? "is-active" : ""} key={item}>
                {index + 1}. {item}
              </span>
            ))}
          </div>
        )}

        {step === "datos" && (
          <form className="checkout__form" onSubmit={goToPayment}>
            <label>
              Nombre completo
              <input
                autoComplete="name"
                value={form.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
              />
              {errors.fullName && <small>{errors.fullName}</small>}
            </label>
            <label>
              Correo electrónico
              <input
                autoComplete="email"
                inputMode="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
              {errors.email && <small>{errors.email}</small>}
            </label>
            <label>
              Teléfono / WhatsApp
              <input
                autoComplete="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
              {errors.phone && <small>{errors.phone}</small>}
            </label>
            <div className="checkout__grid">
              <label>
                Tipo de boleto
                <select
                  value={form.ticketType}
                  onChange={(event) =>
                    updateField("ticketType", event.target.value)
                  }
                >
                  {eventConfig.ticketTypes
                    .filter((item) => item.enabled)
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </label>
              <label>
                Cantidad
                <input
                  min={1}
                  type="number"
                  value={form.quantity}
                  onChange={(event) =>
                    updateField("quantity", Number(event.target.value))
                  }
                />
                {errors.quantity && <small>{errors.quantity}</small>}
              </label>
            </div>
            <fieldset>
              <legend>¿Participas o asistes como público?</legend>
              {[
                ["participante", "Participante"],
                ["publico", "Público"],
                ["staff", "Staff / Invitado"],
              ].map(([value, label]) => (
                <label className="radio-pill" key={value}>
                  <input
                    checked={form.role === value}
                    name="role"
                    type="radio"
                    value={value}
                    onChange={(event) =>
                      updateField("role", event.target.value as AttendeeRole)
                    }
                  />
                  {label}
                </label>
              ))}
            </fieldset>
            <label>
              Comentarios opcionales
              <textarea
                rows={3}
                value={form.comments}
                onChange={(event) => updateField("comments", event.target.value)}
              />
            </label>
            <button className="button button--primary" type="submit">
              Continuar a pago
            </button>
          </form>
        )}

        {step === "pago" && (
          <div className="checkout__body">
            <OrderSummary
              quantity={form.quantity}
              reference={reference}
              ticketName={ticket.name}
              total={total}
            />
            <div className="payment-box">
              <h3>Datos de pago</h3>
              {hasConfirmedPaymentDetails ? (
                <>
                  <p>{eventConfig.payment.bankName}</p>
                  <p>{eventConfig.payment.accountHolder}</p>
                  <code>{eventConfig.payment.clabe}</code>
                  <button
                    className="button button--secondary"
                    onClick={() =>
                      navigator.clipboard.writeText(eventConfig.payment.clabe)
                    }
                    type="button"
                  >
                    Copiar CLABE
                  </button>
                </>
              ) : (
                <p className="payment-box__pending">
                  Datos de pago por confirmar. La interfaz queda lista para
                  activar transferencia cuando K-BANG confirme banco, titular y
                  CLABE.
                </p>
              )}
              <p>{eventConfig.payment.instructions}</p>
            </div>
            <div className="checkout__actions">
              <button
                className="button button--secondary"
                onClick={() => setStep("datos")}
                type="button"
              >
                Volver
              </button>
              <button
                className="button button--primary"
                onClick={() => setStep("comprobante")}
                type="button"
              >
                Subir comprobante
              </button>
            </div>
          </div>
        )}

        {step === "comprobante" && (
          <div className="checkout__body">
            <OrderSummary
              quantity={form.quantity}
              reference={reference}
              ticketName={ticket.name}
              total={total}
            />
            <label className="upload-box">
              <span>Comprobante de pago</span>
              <input
                accept=".pdf,.jpg,.jpeg,.png,.heic,image/heic,application/pdf,image/jpeg,image/png"
                type="file"
                onChange={(event) =>
                  setProofFile(event.target.files?.[0] ?? null)
                }
              />
              <strong>
                {proofFile
                  ? proofFile.name
                  : "PDF, JPG, PNG o HEIC. Se guardará localmente por ahora."}
              </strong>
            </label>
            <p className="checkout__note">
              TODO: conectar esta subida a storage y asociar el archivo con la
              referencia de registro cuando exista backend.
            </p>
            <div className="checkout__actions">
              <button
                className="button button--secondary"
                onClick={() => setStep("pago")}
                type="button"
              >
                Volver
              </button>
              <button
                className="button button--primary"
                onClick={finishRegistration}
                type="button"
              >
                Enviar registro
              </button>
            </div>
          </div>
        )}

        {step === "exito" && registration && (
          <div className="success-panel">
            <span className="success-panel__moon" aria-hidden="true" />
            <h3>Tu registro fue enviado.</h3>
            <p>
              Revisaremos tu comprobante y te enviaremos la confirmación de tu
              boleto por correo.
            </p>
            <dl>
              <div>
                <dt>Nombre</dt>
                <dd>{registration.fullName}</dd>
              </div>
              <div>
                <dt>Correo</dt>
                <dd>{registration.email}</dd>
              </div>
              <div>
                <dt>Boletos</dt>
                <dd>
                  {registration.quantity} · {registration.ticketLabel}
                </dd>
              </div>
              <div>
                <dt>Referencia</dt>
                <dd>{registration.reference}</dd>
              </div>
            </dl>
            <button className="button button--primary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderSummary({
  quantity,
  reference,
  ticketName,
  total,
}: {
  quantity: number;
  reference: string;
  ticketName: string;
  total: number | null;
}) {
  return (
    <div className="order-summary">
      <h3>Resumen</h3>
      <div>
        <span>Boleto</span>
        <strong>{ticketName}</strong>
      </div>
      <div>
        <span>Cantidad</span>
        <strong>{quantity}</strong>
      </div>
      <div>
        <span>Total</span>
        <strong>{formatCurrency(total)}</strong>
      </div>
      <div>
        <span>Referencia</span>
        <strong>{reference}</strong>
      </div>
    </div>
  );
}
