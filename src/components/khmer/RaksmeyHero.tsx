"use client";

import { useEffect, useRef } from "react";
import { RaksmeyCrest, RaksmeyDivider } from "./RaksmeyOrnaments";
import { Language } from "@/lib/translations";

interface RaksmeyHeroProps {
  groomName: string;
  brideName: string;
  eventDate: Date | string;
  lang: Language;
}

export default function RaksmeyHero({
  groomName,
  brideName,
  eventDate,
  lang,
}: RaksmeyHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isKm = lang === "km";

  // Firefly ember particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particleCount = 35;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -(Math.random() * 0.6 + 0.2),
      opacity: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * 0.03 + 0.01,
      maxOpacity: Math.random() * 0.8 + 0.3,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.pulse;

        if (p.opacity > p.maxOpacity || p.opacity < 0.15) {
          p.pulse = -p.pulse;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 215, 127, ${Math.max(0, p.opacity)})`;
        ctx.shadowColor = "#f5d77f";
        ctx.shadowBlur = 8;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="top" className="relative min-h-[95vh] sm:min-h-screen flex flex-col items-center justify-between pt-24 pb-14 px-4 overflow-hidden">
      {/* Background Image with layered vignette */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(max-width: 640px)" srcSet="/raksmey-assets/img/hero-m-640.webp" />
          <img
            src="/raksmey-assets/img/hero-2000.webp"
            alt="Raksmey & Pheakdey Wedding"
            className="w-full h-full object-cover object-[center_30%] filter brightness-[0.72] contrast-[1.05]"
          />
        </picture>
        {/* Soft olive gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1d2010] via-transparent to-[#1d2010]/70" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#1d2010]/30 to-[#1d2010]/80" />
      </div>

      {/* Firefly Embers Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Top Wedding Monogram & Title */}
      <div className="relative z-20 flex flex-col items-center text-center animate-fade-in max-w-xl mx-auto">
        {/* Gold Crest */}
        <div className="text-[#d9b15a] mb-3 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          <RaksmeyCrest className="w-24 sm:w-32 h-auto" />
        </div>

        {/* Wedding Khmer Header */}
        <h2 className="font-moul text-sm sm:text-base text-[#fbefc0] tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mb-1">
          {isKm ? "សិរីសួស្តីអាពាហ៍ពិពាហ៍" : "The Wedding Invitation"}
        </h2>
        <p className="font-script text-2xl sm:text-3xl text-[#d9b15a] drop-shadow">
          Together Forever
        </p>

        {/* Gold Ornate Divider */}
        <div className="text-[#d9b15a]/70 my-2 w-48 sm:w-64">
          <RaksmeyDivider className="w-full h-auto" />
        </div>
      </div>

      {/* Center Couple Names Lockup */}
      <div className="relative z-20 flex flex-col items-center text-center my-auto py-6">
        <div className="backdrop-blur-sm bg-[#1d2010]/40 px-6 sm:px-10 py-5 rounded-2xl border border-[#d9b15a]/30 shadow-2xl">
          <h1 className="font-moul text-2xl sm:text-4xl text-[#ffffff] tracking-wide drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] foil">
            {groomName}
          </h1>

          <div className="flex items-center justify-center gap-3 my-2 text-[#d9b15a]">
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#d9b15a]" />
            <span className="font-script text-3xl sm:text-4xl leading-none">&amp;</span>
            <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#d9b15a]" />
          </div>

          <h1 className="font-moul text-2xl sm:text-4xl text-[#ffffff] tracking-wide drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] foil">
            {brideName}
          </h1>
        </div>
      </div>

      {/* Bottom Date Chips & Khmer Lunar Date */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-lg mx-auto">
        {/* 4 Date Chips Row */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
          {/* Day of Week */}
          <div className="min-w-[64px] sm:min-w-[76px] px-2.5 py-1.5 rounded-lg bg-[#2a2f16]/90 border border-[#d9b15a]/50 text-center shadow-lg backdrop-blur-md">
            <span className="text-[10px] text-[#d9b15a] uppercase tracking-wider block font-medium">
              {isKm ? "ថ្ងៃ" : "Day"}
            </span>
            <span className="font-moul text-xs sm:text-sm text-[#fbefc0]">
              {isKm ? "អាទិត្យ" : "Sunday"}
            </span>
          </div>

          {/* Date Number */}
          <div className="min-w-[56px] sm:min-w-[68px] px-2.5 py-1.5 rounded-lg bg-[#2a2f16]/90 border border-[#d9b15a]/70 text-center shadow-lg backdrop-blur-md ring-1 ring-[#d9b15a]/30">
            <span className="text-[10px] text-[#d9b15a] uppercase tracking-wider block font-medium">
              {isKm ? "ថ្ងៃទី" : "Date"}
            </span>
            <span className="font-moul text-sm sm:text-base text-[#ffffff]">
              {isKm ? "១៥" : "15"}
            </span>
          </div>

          {/* Month */}
          <div className="min-w-[64px] sm:min-w-[76px] px-2.5 py-1.5 rounded-lg bg-[#2a2f16]/90 border border-[#d9b15a]/50 text-center shadow-lg backdrop-blur-md">
            <span className="text-[10px] text-[#d9b15a] uppercase tracking-wider block font-medium">
              {isKm ? "ខែ" : "Month"}
            </span>
            <span className="font-moul text-xs sm:text-sm text-[#fbefc0]">
              {isKm ? "វិច្ឆិកា" : "Nov"}
            </span>
          </div>

          {/* Year */}
          <div className="min-w-[56px] sm:min-w-[68px] px-2.5 py-1.5 rounded-lg bg-[#2a2f16]/90 border border-[#d9b15a]/50 text-center shadow-lg backdrop-blur-md">
            <span className="text-[10px] text-[#d9b15a] uppercase tracking-wider block font-medium">
              {isKm ? "ឆ្នាំ" : "Year"}
            </span>
            <span className="font-moul text-xs sm:text-sm text-[#fbefc0]">
              {isKm ? "២០២៦" : "2026"}
            </span>
          </div>
        </div>

        {/* Traditional Khmer Lunar Calendar Line */}
        <p className="font-khmer text-xs sm:text-sm text-[#fbefc0]/90 tracking-wide drop-shadow-md px-4 py-1 rounded-full bg-[#1d2010]/60 border border-[#d9b15a]/30">
          {isKm
            ? "ត្រូវនឹងថ្ងៃ ៦កើត ខែកត្តិក ឆ្នាំរោង ឆស័ក ព.ស. ២៥៧០"
            : "November 15, 2026 · Traditional Cambodian Wedding Ceremony"}
        </p>

        {/* Scroll indicator */}
        <a
          href="#words"
          className="mt-6 flex flex-col items-center text-[#d9b15a]/80 hover:text-[#fbefc0] transition-colors group"
          aria-label="Scroll to ceremony details"
        >
          <span className="text-[10px] tracking-widest uppercase font-serif mb-1 group-hover:tracking-wider transition-all">
            {isKm ? "រមូរចុះក្រោម" : "Scroll Down"}
          </span>
          <svg
            className="w-4 h-4 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
