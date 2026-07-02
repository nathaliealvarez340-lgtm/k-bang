const overviewCards = [
  {
    title: "Competencia",
    text: "Talento, técnica y energía frente al público.",
  },
  {
    title: "Espectáculo",
    text: "Una puesta en escena inspirada en la noche y la luna.",
  },
  {
    title: "Comunidad",
    text: "Participantes y asistentes celebrando el performance.",
  },
  {
    title: "Experiencia visual",
    text: "Cristales, estrellas, brillo elegante y luz lunar.",
  },
];

export function EventOverview() {
  return (
    <section className="overview section-band">
      <div className="section-heading">
        <p className="eyebrow">Qué es Crystal Moon</p>
        <h2>Un concurso de baile con atmósfera de escenario lunar</h2>
        <p>
          Crystal Moon es una experiencia artística y visual donde bailarines y
          asistentes viven una noche inspirada en la magia de la luna. Una
          competencia diseñada para brillar, conectar y celebrar el performance.
        </p>
      </div>
      <div className="overview__grid">
        {overviewCards.map((card) => (
          <article className="feature-card" key={card.title}>
            <span className="feature-card__glint" aria-hidden="true" />
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
