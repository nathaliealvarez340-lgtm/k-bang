import { eventConfig } from "@/lib/event-config";

const faqs = [
  {
    question: "¿Dónde será el evento?",
    answer: "Crystal Moon se realizará en el Tec de Monterrey, Campus Ciudad de México (CCM).",
  },
  {
    question: "¿Cuándo es Crystal Moon?",
    answer: `El evento está programado para el ${eventConfig.eventDateLong}. ${eventConfig.eventTimeLabel}.`,
  },
  {
    question: "¿Puedo asistir aunque no participe?",
    answer: "Sí. Crystal Moon está abierto a Comunidad Tec, Exatecs y público externo, ya sea como participante o asistente.",
  },
  {
    question: "¿Cómo reservo mi boleto?",
    answer: "Completa el registro de interés con tus datos. El equipo de K-BANG compartirá precio, forma de pago y los siguientes pasos cuando estén confirmados.",
  },
  {
    question: "¿Cuándo recibiré mi confirmación?",
    answer: "Después de completar el proceso de reserva y validación de pago, recibirás la confirmación de tu boleto por correo.",
  },
];

export function FAQ() {
  return (
    <section className="faq section-band reveal" id="faq">
      <div className="faq__intro">
        <p className="eyebrow">FAQ</p>
        <h2 className="section-title">Lo que necesitas saber antes de la noche</h2>
        <p>Información breve y clara para preparar tu experiencia Crystal Moon.</p>
      </div>
      <div className="faq__list">
        {faqs.map((faq) => (
          <details key={faq.question} name="crystal-moon-faq">
            <summary>
              {faq.question}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
