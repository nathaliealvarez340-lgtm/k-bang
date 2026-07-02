type HeaderProps = {
  onReserve: () => void;
};

export function Header({ onReserve }: HeaderProps) {
  return (
    <header className="site-header">
      <a className="brand" href="#evento" aria-label="K-BANG Crystal Moon">
        <span className="brand__mark">K</span>
        <span>
          <strong>K-BANG</strong>
          <small>Crystal Moon</small>
        </span>
      </a>
      <nav className="site-nav" aria-label="Navegación principal">
        <a href="#evento">Evento</a>
        <a href="#dinamica">Dinámica</a>
        <a href="#boletos">Boletos</a>
        <a href="#faq">FAQ</a>
      </nav>
      <button className="button button--header" onClick={onReserve}>
        Reservar boleto
      </button>
    </header>
  );
}
