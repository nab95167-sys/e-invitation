"use client";

import { useEffect, useState } from "react";
import { Language, translations } from "@/lib/translations";

interface CountdownTimerProps {
  targetDate: string | Date;
  lang?: Language;
}

export default function CountdownTimer({ targetDate, lang = "km" }: CountdownTimerProps) {
  const t = translations[lang] || translations.km;
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: t.days, value: timeLeft.days },
    { label: t.hours, value: timeLeft.hours },
    { label: t.minutes, value: timeLeft.minutes },
    { label: t.seconds, value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6 my-8">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="flex flex-col items-center justify-center w-16 h-20 sm:w-24 sm:h-28 rounded-2xl bg-white/80 backdrop-blur-md border border-[#D4AF37]/30 shadow-card"
        >
          <span className="font-serif text-2xl sm:text-4xl font-bold text-[#AA7C11]">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#3E444A]/70 font-semibold mt-1">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
