import Image from "next/image";
import { useLanguage } from "./LanguageProvider";

export function EventTimeline() {
  const { t } = useLanguage();

  return (
    <section className="timeline section-band reveal" id="dinamica">
      <div className="timeline__backdrop" aria-hidden="true">
        <Image src="/images/images_3.png" alt="" fill sizes="100vw" />
      </div>
      <div className="timeline__content">
        <div className="section-heading section-heading--timeline">
          <div>
            <p className="eyebrow">{t.timeline.eyebrow}</p>
            <h2 className="section-title">{t.timeline.title}</h2>
          </div>
          <p>{t.timeline.description}</p>
        </div>
        <ol className="timeline__track">
          {t.timeline.items.map((item, index) => (
            <li className="timeline__item" key={item.title}>
              <span className="timeline__number">{String(index + 1).padStart(2, "0")}</span>
              <small>{item.label}</small>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
