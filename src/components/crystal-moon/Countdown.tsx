import { useEffect, useState } from "react";

type CountdownProps = {
  targetDate: string;
};

function getTimeLeft(targetDate: string) {
  const difference = new Date(targetDate).getTime() - Date.now();
  const safeDifference = Math.max(difference, 0);

  return {
    días: Math.floor(safeDifference / (1000 * 60 * 60 * 24)),
    horas: Math.floor((safeDifference / (1000 * 60 * 60)) % 24),
    min: Math.floor((safeDifference / (1000 * 60)) % 60),
    seg: Math.floor((safeDifference / 1000) % 60),
  };
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    días: 0,
    horas: 0,
    min: 0,
    seg: 0,
  });

  useEffect(() => {
    setTimeLeft(getTimeLeft(targetDate));

    const interval = window.setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="countdown" aria-label="Cuenta regresiva al evento">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div className="countdown__item" key={label}>
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
