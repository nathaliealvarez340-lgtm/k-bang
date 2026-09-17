import { useLanguage } from "./LanguageProvider";

export function FAQ() {
  const { t } = useLanguage();

  return (
    <section className="faq section-band reveal" id="faq">
      <div className="faq__intro">
        <p className="eyebrow">{t.faq.eyebrow}</p>
        <h2 className="section-title">{t.faq.title}</h2>
        <p>{t.faq.description}</p>
      </div>
      <div className="faq__list">
        {t.faq.items.map((faq) => (
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
