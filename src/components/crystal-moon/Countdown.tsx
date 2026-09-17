import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

type CountdownProps = {
  targetDate: string;
};

function getTimeLeft(targetDate: string) {
  const difference = new Date(targetDate).getTime() - Date.now();
  const safeDifference = Math.max(difference, 0);

  return {
    days: Math.floor(safeDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((safeDifference / (1000 * 60 * 60)) % 24),
    min: Math.floor((safeDifference / (1000 * 60)) % 60),
    sec: Math.floor((safeDifference / 1000) % 60),
  };
}

export function Countdown({ targetDate }: CountdownProps) {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    min: 0,
    sec: 0,
  });

  useEffect(() => {
    setTimeLeft(getTimeLeft(targetDate));

    const interval = window.setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="countdown" aria-label={t.countdown.aria}>
      {Object.values(timeLeft).map((value, index) => (
        <div className="countdown__item" key={index}>
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{t.countdown.units[index]}</span>
        </div>
      ))}
    </div>
  );
}
