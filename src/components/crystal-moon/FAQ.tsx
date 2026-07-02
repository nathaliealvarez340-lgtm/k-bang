const faqs = [
  {
    question: "¿Dónde será el evento?",
    answer: "El lugar está por confirmarse entre Carpa Estudiantil o Auditorio Glaxo.",
  },
  {
    question: "¿Cuándo es Crystal Moon?",
    answer: "Crystal Moon está programado para el sábado 22 de agosto de 2026.",
  },
  {
    question: "¿Puedo asistir aunque no participe?",
    answer: "Sí. El registro permite indicar si asistes como público, participante o staff/invitado.",
  },
  {
    question: "¿Cómo confirmo mi boleto?",
    answer: "Completa tu registro, revisa la referencia generada y sube tu comprobante cuando los datos de pago estén confirmados.",
  },
  {
    question: "¿Qué pasa después de subir mi comprobante?",
    answer: "El equipo revisará tu comprobante y enviará la confirmación de tu boleto por correo.",
  },
];

export function FAQ() {
  return (
    <section className="faq section-band" id="faq">
      <div className="section-heading">
        <p className="eyebrow">FAQ</p>
        <h2>Preguntas frecuentes</h2>
      </div>
      <div className="faq__list">
        {faqs.map((faq) => (
          <details key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
