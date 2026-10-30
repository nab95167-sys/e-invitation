"use client";

import { useEffect, useState } from "react";
import { RaksmeyDivider } from "./RaksmeyOrnaments";
import { Language } from "@/lib/translations";

interface RaksmeyCountdownProps {
  targetDate: Date | string;
  lang: Language;
}

export default function RaksmeyCountdown({
  targetDate,
  lang,
}: RaksmeyCountdownProps) {
  const isKm = lang === "km";
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
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const toKhmerNumber = (num: number) => {
    if (!isKm) return String(num).padStart(2, "0");
    const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
    return String(num)
      .padStart(2, "0")
      .split("")
      .map((d) => khmerDigits[parseInt(d, 10)] ?? d)
      .join("");
  };

  const units = [
    { label: isKm ? "ថ្ងៃ" : "Days", value: timeLeft.days },
    { label: isKm ? "ម៉ោង" : "Hours", value: timeLeft.hours },
    { label: isKm ? "នាទី" : "Minutes", value: timeLeft.minutes },
    { label: isKm ? "វិនាទី" : "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section className="relative py-16 px-4 bg-[#14160b] overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(217,177,90,0.12)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <span className="font-script text-3xl sm:text-4xl text-[#d9b15a] block mb-1">
          Counting Down
        </span>
        <h2 className="font-moul text-base sm:text-lg text-[#fbefc0] tracking-wider uppercase mb-2">
          {isKm ? "រាប់ថយក្រោយដល់ថ្ងៃមង្គលការ" : "Until The Big Day"}
        </h2>
        <div className="flex justify-center text-[#d9b15a]/70 my-3 w-36 sm:w-48 mx-auto">
          <RaksmeyDivider className="w-full h-auto" />
        </div>

        {/* 4 Countdown Arched Blocks */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mx-auto mt-6">
          {units.map((unit, idx) => (
            <div
              key={idx}
              className="relative p-3 sm:p-5 rounded-2xl bg-[#1d2010] border border-[#d9b15a]/40 shadow-xl flex flex-col items-center justify-center backdrop-blur-sm group hover:border-[#f5d77f] transition-all"
            >
              <div className="font-moul text-2xl sm:text-4xl text-[#ffffff] foil tracking-wider">
                {toKhmerNumber(unit.value)}
              </div>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#d9b15a] mt-1">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
