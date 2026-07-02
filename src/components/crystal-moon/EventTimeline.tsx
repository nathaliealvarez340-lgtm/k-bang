const timeline = [
  {
    title: "Moonrise",
    text: "El inicio de la noche. Presentación de participantes y apertura del escenario.",
  },
  {
    title: "Moonlight Stage",
    text: "Las presentaciones de baile toman el centro de la experiencia.",
  },
  {
    title: "Crystal Moment",
    text: "El punto más intenso de la noche: finalistas, batalla final o momento decisivo.",
  },
  {
    title: "Starlight Winner",
    text: "La premiación y cierre de una noche diseñada para brillar.",
  },
];

export function EventTimeline() {
  return (
    <section className="timeline section-band" id="dinamica">
      <div className="section-heading">
        <p className="eyebrow">Dinámica del evento</p>
        <h2>De la primera luz a la premiación</h2>
      </div>
      <ol className="timeline__track">
        {timeline.map((item, index) => (
          <li className="timeline__item" key={item.title}>
            <span className="timeline__number">{index + 1}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
