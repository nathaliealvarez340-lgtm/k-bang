import type { CSSProperties } from "react";
import { useLanguage } from "./LanguageProvider";

export function EventOverview() {
  const { t } = useLanguage();

  return (
    <section className="overview section-band reveal" id="que-es">
      <div className="overview__intro">
        <p className="eyebrow">{t.overview.eyebrow}</p>
        <h2 className="section-title">{t.overview.title}</h2>
        <p>{t.overview.description}</p>
        <span className="overview__signature">{t.overview.signature}</span>
      </div>
      <div className="overview__grid">
        {t.overview.cards.map((card, index) => (
          <article
            className="feature-card"
            key={card.title}
            style={{ "--card-index": index } as CSSProperties}
          >
            <span className="feature-card__number">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
