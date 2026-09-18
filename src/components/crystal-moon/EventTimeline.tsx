import { useLanguage } from "./LanguageProvider";
import { ResponsiveCardCarousel } from "./ResponsiveCardCarousel";

export function EventTimeline() {
  const { locale, t } = useLanguage();

  return (
    <section className="timeline section-band reveal" id="dinamica">
      <div className="timeline__content">
        <div className="section-heading section-heading--timeline">
          <div>
            <p className="eyebrow">{t.timeline.eyebrow}</p>
            <h2 className="section-title">{t.timeline.title}</h2>
          </div>
          <p>{t.timeline.description}</p>
        </div>
        <ResponsiveCardCarousel
          as="ol"
          className="timeline__track"
          items={t.timeline.items}
          label={t.timeline.eyebrow}
          locale={locale}
          renderItem={(item, index) => (
            <li className="timeline__item" key={item.title}>
              <span className="timeline__number">{String(index + 1).padStart(2, "0")}</span>
              <small>{item.label}</small>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          )}
        />
      </div>
    </section>
  );
}
