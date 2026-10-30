"use client";

import { Language } from "@/lib/translations";

interface LanguageToggleProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  className?: string;
}

export default function LanguageToggle({
  currentLang,
  onLanguageChange,
  className = "",
}: LanguageToggleProps) {
  return (
    <div
      className={`inline-flex items-center p-1 rounded-full bg-white/95 backdrop-blur-md border-2 border-[#D4AF37]/60 shadow-luxury-lg transition-all hover:scale-105 ${className}`}
    >
      <button
        type="button"
        onClick={() => onLanguageChange("km")}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
          currentLang === "km"
            ? "bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white shadow-sm"
            : "text-[#3E444A]/80 hover:text-[#AA7C11]"
        }`}
      >
        <span className="text-sm">🇰🇭</span>
        <span className="font-khmer text-xs">ខ្មែរ</span>
      </button>

      <button
        type="button"
        onClick={() => onLanguageChange("en")}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
          currentLang === "en"
            ? "bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white shadow-sm"
            : "text-[#3E444A]/80 hover:text-[#AA7C11]"
        }`}
      >
        <span className="text-sm">🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
}
