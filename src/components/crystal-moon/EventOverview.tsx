import type { CSSProperties } from "react";
import { useLanguage } from "./LanguageProvider";
import { ResponsiveCardCarousel } from "./ResponsiveCardCarousel";

export function EventOverview() {
  const { locale, t } = useLanguage();

  return (
    <section className="overview section-band reveal" id="que-es">
      <div className="overview__intro">
        <p className="eyebrow">{t.overview.eyebrow}</p>
        <h2 className="section-title">{t.overview.title}</h2>
        <p>{t.overview.description}</p>
        <span className="overview__signature">{t.overview.signature}</span>
      </div>
      <ResponsiveCardCarousel
        className="overview__grid"
        items={t.overview.cards}
        label={t.overview.eyebrow}
        locale={locale}
        renderItem={(card, index) => (
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
        )}
      />
    </section>
  );
}
