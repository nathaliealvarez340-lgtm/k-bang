export function BackgroundVideo() {
  return (
    <div className="cosmic-video-layer" aria-hidden="true">
      <video
        className="cosmic-video"
        src="/videos/fondo-kbang.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="cosmic-video-overlay" />
    </div>
  );
}
