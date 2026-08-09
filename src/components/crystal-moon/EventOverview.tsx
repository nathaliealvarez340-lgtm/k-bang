import type { CSSProperties } from "react";

const overviewCards = [
  {
    number: "01",
    title: "Competencia",
    text: "Talento, técnica y presencia frente a un público que vive cada coreografía.",
  },
  {
    number: "02",
    title: "Espectáculo",
    text: "Una puesta en escena inspirada en la noche, la luna y el pulso del performance.",
  },
  {
    number: "03",
    title: "Comunidad",
    text: "Comunidad Tec, Exatecs y público externo reunidos por la danza y la cultura pop.",
  },
  {
    number: "04",
    title: "Experiencia visual",
    text: "Luz, cristales y profundidad escénica para convertir cada momento en imagen.",
  },
];

export function EventOverview() {
  return (
    <section className="overview section-band reveal" id="que-es">
      <div className="overview__intro">
        <p className="eyebrow">Qué es Crystal Moon</p>
        <h2 className="section-title">El escenario cambia cuando llega la noche</h2>
        <p>
          Crystal Moon es un concurso de baile donde cada presentación se vuelve
          parte de una experiencia lunar: energía en vivo, dirección visual y una
          comunidad reunida para celebrar el performance.
        </p>
        <span className="overview__signature">Donde el escenario es tuyo</span>
      </div>
      <div className="overview__grid">
        {overviewCards.map((card, index) => (
          <article
            className="feature-card"
            key={card.title}
            style={{ "--card-index": index } as CSSProperties}
          >
            <span className="feature-card__number">{card.number}</span>
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
