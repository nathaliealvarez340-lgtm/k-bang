"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { eventConfig, hasConfirmedPaymentDetails } from "@/lib/event-config";
import {
  calculateTotal,
  createReference,
  formatCurrency,
  submitRegistration,
  type AttendeeRole,
  type RegistrationData,
  type RegistrationFormData,
} from "@/lib/registration";
import { useLanguage } from "./LanguageProvider";

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
  const { locale, t } = useLanguage();
  const [step, setStep] = useState<Step>("datos");
  const [form, setForm] = useState<RegistrationFormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<"fullName" | "email" | "phone" | "quantity", boolean>>>({});
  const [isSubmitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [reference, setReference] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [registration, setRegistration] = useState<RegistrationData | null>(
    null,
  );
  const modalRef = useRef<HTMLDivElement>(null);

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
      setSubmitting(false);
      setSubmitError(false);
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
    setErrors((current) => ({ ...current, [key]: false }));
  };

  const validateData = () => {
    const nextErrors: typeof errors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = true;
    }

    if (!isValidEmail(form.email)) {
      nextErrors.email = true;
    }

    if (!form.phone.trim()) {
      nextErrors.phone = true;
    }

    if (form.quantity < 1) {
      nextErrors.quantity = true;
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
    if (isSubmitting) return;
    setSubmitting(true);
    setSubmitError(false);

    const registrationData: RegistrationData = {
      ...form,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      comments: form.comments?.trim(),
      reference,
      total,
      ticketLabel: t.tickets.ticketName,
      eventName: eventConfig.eventName,
      eventDate: eventConfig.eventDate,
      eventLocation: eventConfig.eventLocation,
      proofFileName: proofFile?.name,
      createdAt: new Date().toISOString(),
    };

    try {
      await submitRegistration(registrationData);
      setRegistration(registrationData);
      setStep("exito");
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
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
            <p className="eyebrow">{t.checkout.eyebrow}</p>
            <h2 id="checkout-title">
              {step === "exito" ? t.checkout.sentTitle : t.checkout.title}
            </h2>
          </div>
          <button
            aria-label={t.checkout.closeAria}
            className="icon-button"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        {step !== "exito" && (
          <div className="checkout__steps" aria-label={t.checkout.progressAria}>
            {(["datos", "pago", "comprobante"] as const).map((item, index) => (
              <span className={step === item ? "is-active" : ""} key={item}>
                {index + 1}. {t.checkout.steps[item]}
              </span>
            ))}
          </div>
        )}

        {step === "datos" && (
          <form className="checkout__form" onSubmit={goToPayment}>
            <label>
              {t.checkout.fullName}
              <input
                autoComplete="name"
                value={form.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
              />
              {errors.fullName && <small>{t.checkout.errors.fullName}</small>}
            </label>
            <label>
              {t.checkout.email}
              <input
                autoComplete="email"
                inputMode="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
              {errors.email && <small>{t.checkout.errors.email}</small>}
            </label>
            <label>
              {t.checkout.phone}
              <input
                autoComplete="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
              {errors.phone && <small>{t.checkout.errors.phone}</small>}
            </label>
            <div className="checkout__grid">
              <label>
                {t.checkout.ticketType}
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
                        {t.tickets.ticketName}
                      </option>
                    ))}
                </select>
              </label>
              <label>
                {t.checkout.quantity}
                <input
                  min={1}
                  type="number"
                  value={form.quantity}
                  onChange={(event) =>
                    updateField("quantity", Number(event.target.value))
                  }
                />
                {errors.quantity && <small>{t.checkout.errors.quantity}</small>}
              </label>
            </div>
            <fieldset>
              <legend>{t.checkout.roleLegend}</legend>
              {(["participante", "publico", "staff"] as const).map((value) => (
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
                  {t.checkout.roles[value]}
                </label>
              ))}
            </fieldset>
            <label>
              {t.checkout.comments}
              <textarea
                rows={3}
                value={form.comments}
                onChange={(event) => updateField("comments", event.target.value)}
              />
            </label>
            <button className="button button--primary" type="submit">
              {t.checkout.continuePayment}
            </button>
          </form>
        )}

        {step === "pago" && (
          <div className="checkout__body">
            <OrderSummary
              quantity={form.quantity}
              reference={reference}
              ticketName={t.tickets.ticketName}
              total={total}
            />
            <div className="payment-box">
              <h3>{t.checkout.paymentTitle}</h3>
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
                    {t.checkout.copyClabe}
                  </button>
                </>
              ) : (
                <p className="payment-box__pending">
                  {t.checkout.paymentPending}
                </p>
              )}
              <p>{t.checkout.paymentInstructions}</p>
            </div>
            <div className="checkout__actions">
              <button
                className="button button--secondary"
                onClick={() => setStep("datos")}
                type="button"
              >
                {t.checkout.back}
              </button>
              <button
                className="button button--primary"
                onClick={() => setStep("comprobante")}
                type="button"
              >
                {t.checkout.uploadProof}
              </button>
            </div>
          </div>
        )}

        {step === "comprobante" && (
          <div className="checkout__body">
            <OrderSummary
              quantity={form.quantity}
              reference={reference}
              ticketName={t.tickets.ticketName}
              total={total}
            />
            <label className="upload-box">
              <span>{t.checkout.proofLabel}</span>
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
                  : t.checkout.proofHint}
              </strong>
            </label>
            <p className="checkout__note">
              {t.checkout.proofNote}
            </p>
            <div className="checkout__actions">
              <button
                className="button button--secondary"
                onClick={() => setStep("pago")}
                type="button"
              >
                {t.checkout.back}
              </button>
              <button
                className="button button--primary"
                onClick={finishRegistration}
                disabled={isSubmitting}
                type="button"
              >
                {isSubmitting ? t.checkout.sending : t.checkout.sendRegistration}
              </button>
            </div>
            {submitError && <p role="alert">{t.checkout.errors.submit}</p>}
          </div>
        )}

        {step === "exito" && registration && (
          <div className="success-panel">
            <span className="success-panel__moon" aria-hidden="true" />
            <h3>{t.checkout.successTitle}</h3>
            <p>{t.checkout.successDescription}</p>
            <dl>
              <div>
                <dt>{t.checkout.name}</dt>
                <dd>{registration.fullName}</dd>
              </div>
              <div>
                <dt>{t.checkout.emailShort}</dt>
                <dd>{registration.email}</dd>
              </div>
              <div>
                <dt>{t.checkout.tickets}</dt>
                <dd>
                  {registration.quantity} · {t.tickets.ticketName}
                </dd>
              </div>
              <div>
                <dt>{t.checkout.reference}</dt>
                <dd>{registration.reference}</dd>
              </div>
            </dl>
            <button className="button button--primary" onClick={onClose}>
              {t.checkout.close}
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
  const { locale, t } = useLanguage();

  return (
    <div className="order-summary">
      <h3>{t.checkout.summary}</h3>
      <div>
        <span>{t.checkout.ticket}</span>
        <strong>{ticketName}</strong>
      </div>
      <div>
        <span>{t.checkout.quantity}</span>
        <strong>{quantity}</strong>
      </div>
      <div>
        <span>{t.checkout.total}</span>
        <strong>{formatCurrency(total, locale)}</strong>
      </div>
      <div>
        <span>{t.checkout.reference}</span>
        <strong>{reference}</strong>
      </div>
    </div>
  );
}
