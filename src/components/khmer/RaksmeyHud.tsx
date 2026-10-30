"use client";

import { useEffect, useState } from "react";
import { Language, translations } from "@/lib/translations";
import { RaksmeyButterfly } from "./RaksmeyOrnaments";

interface RaksmeyHudProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  isPlaying: boolean;
  onToggleMusic: () => void;
}

export default function RaksmeyHud({
  currentLang,
  onLanguageChange,
  isPlaying,
  onToggleMusic,
}: RaksmeyHudProps) {
  const t = translations[currentLang] || translations.km;
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setIsScrolled(scrollY > 200);
      if (docHeight > 0) {
        setScrollProgress(Math.min(1, Math.max(0, scrollY / docHeight)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Floating HUD Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3.5 transition-all duration-500 pointer-events-none ${
          isScrolled ? "bg-[#1d2010]/85 backdrop-blur-md border-b border-[#d9b15a]/30 shadow-lg" : ""
        }`}
      >
        {/* Top-Left: Royal Monogram */}
        <a
          href="#top"
          className="pointer-events-auto flex items-center gap-2 group transition-transform hover:scale-105"
          aria-label="Back to top"
        >
          <div className="w-10 h-10 rounded-full border border-[#d9b15a]/70 bg-[#2a2f16]/90 flex items-center justify-center shadow-md">
            <span className="font-moul text-sm text-[#fbefc0] tracking-wider group-hover:text-[#d9b15a]">
              {currentLang === "km" ? "រ · ភ" : "R · P"}
            </span>
          </div>
          <span className="hidden sm:inline font-script text-lg text-[#fbefc0]/80">
            Raksmey &amp; Pheakdey
          </span>
        </a>

        {/* Top-Right: Language Switcher & Equalizer Music Toggle */}
        <div className="pointer-events-auto flex items-center gap-2.5">
          {/* Language Toggle Chip */}
          <button
            type="button"
            onClick={() => onLanguageChange(currentLang === "km" ? "en" : "km")}
            className="h-9 px-3.5 rounded-full bg-[#1d2010]/80 backdrop-blur-md border border-[#d9b15a]/60 text-xs font-semibold text-[#fbefc0] shadow-sm hover:border-[#fbefc0] hover:bg-[#2a2f16] transition-all flex items-center gap-1.5"
            aria-label="Switch Language"
          >
            <span className={currentLang === "km" ? "font-bold text-[#d9b15a]" : "opacity-75"}>
              ខ្មែរ
            </span>
            <span className="opacity-40">/</span>
            <span className={currentLang === "en" ? "font-bold text-[#d9b15a]" : "opacity-75"}>
              EN
            </span>
          </button>

          {/* Music Equalizer Button */}
          <button
            type="button"
            onClick={onToggleMusic}
            className={`h-9 px-3 rounded-full backdrop-blur-md border border-[#d9b15a]/60 text-xs font-semibold transition-all flex items-center gap-2 shadow-sm ${
              isPlaying
                ? "bg-[#2a2f16] text-[#d9b15a] ring-2 ring-[#d9b15a]/40"
                : "bg-[#1d2010]/80 text-[#fbefc0]/60 hover:text-[#fbefc0]"
            }`}
            aria-label="Toggle Music"
          >
            <span className={`bars ${isPlaying ? "is-playing text-[#d9b15a]" : "text-[#fbefc0]/40"}`}>
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="hidden sm:inline text-[11px] uppercase tracking-wider font-medium">
              {isPlaying ? (currentLang === "km" ? "ចាក់តន្ត្រី" : "Music On") : (currentLang === "km" ? "បិទសំឡេង" : "Music Off")}
            </span>
          </button>
        </div>
      </header>

      {/* Right Screen Vine Progress Bar */}
      <div className="fixed top-[20vh] bottom-[20vh] right-2.5 w-[2px] bg-[#d9b15a]/25 z-40 hidden md:block pointer-events-none">
        <div
          className="w-full bg-[#d9b15a] transition-all duration-150 origin-top"
          style={{ height: `${scrollProgress * 100}%` }}
        />
        <div
          className="w-2.5 h-2.5 bg-[#fbefc0] rotate-45 -translate-x-[4px] shadow-sm transition-all duration-150"
          style={{ marginTop: "-5px" }}
        />
      </div>

      {/* Floating Sticky RSVP Pill (Appears upon scrolling) */}
      <div
        className={`fixed bottom-6 right-6 z-40 transition-all duration-500 transform ${
          isScrolled ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
        }`}
      >
        <a
          href="#rsvp"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#9c7124] via-[#d9b15a] to-[#9c7124] text-[#1d2010] text-xs font-bold uppercase tracking-wider shadow-[0_8px_25px_rgba(217,177,90,0.5)] border border-[#fbefc0] hover:brightness-110 active:scale-95 transition-all"
        >
          <span>{t.rsvpButton}</span>
        </a>
      </div>
    </>
  );
}
