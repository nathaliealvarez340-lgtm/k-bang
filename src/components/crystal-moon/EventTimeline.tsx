import Image from "next/image";

const timeline = [
  {
    title: "Moonrise",
    label: "Apertura",
    text: "La noche comienza: bienvenida, presentación de participantes y primera luz del escenario.",
  },
  {
    title: "Moonlight Stage",
    label: "Performance",
    text: "Las coreografías toman el centro y la energía del público acompaña cada presentación.",
  },
  {
    title: "Crystal Moment",
    label: "Momento decisivo",
    text: "Finalistas y momentos clave elevan la competencia hasta su punto más intenso.",
  },
  {
    title: "Starlight Winner",
    label: "Cierre",
    text: "Premiación, celebración y el último destello de una noche hecha para recordarse.",
  },
];

export function EventTimeline() {
  return (
    <section className="timeline section-band reveal" id="dinamica">
      <div className="timeline__backdrop" aria-hidden="true">
        <Image src="/images/images_3.png" alt="" fill sizes="100vw" />
      </div>
      <div className="timeline__content">
        <div className="section-heading section-heading--timeline">
          <div>
            <p className="eyebrow">Dinámica del evento</p>
            <h2>Cuatro momentos. Una sola noche.</h2>
          </div>
          <p>Un recorrido que crece en energía hasta llegar al momento que todos esperan.</p>
        </div>
        <ol className="timeline__track">
          {timeline.map((item, index) => (
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
