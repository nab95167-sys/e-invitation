"use client";

import KbachCorner from "./KbachCorner";

interface KbachFrameProps {
  children: React.ReactNode;
  className?: string;
  cornerSize?: number;
  innerClassName?: string;
  showTopEmblem?: boolean;
}

export default function KbachFrame({
  children,
  className = "",
  cornerSize = 56,
  innerClassName = "",
  showTopEmblem = true,
}: KbachFrameProps) {
  return (
    <div
      className={`relative p-2 sm:p-3 rounded-3xl bg-gradient-to-b from-[#FAF6EE] via-[#FFFDF9] to-[#F5EFE3] border-2 border-[#D4AF37]/50 shadow-luxury-lg overflow-hidden ${className}`}
    >
      {/* 4 Traditional Kbach Khmer Corners */}
      <KbachCorner position="top-left" size={cornerSize} />
      <KbachCorner position="top-right" size={cornerSize} />
      <KbachCorner position="bottom-left" size={cornerSize} />
      <KbachCorner position="bottom-right" size={cornerSize} />

      {/* Decorative inner hairline border */}
      <div className="absolute inset-2 sm:inset-3 border border-[#D4AF37]/40 rounded-2xl pointer-events-none z-10" />

      {/* Subtle traditional Angkorian lattice watermark */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] bg-repeat"
        style={{
          backgroundImage: `radial-gradient(#AA7C11 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Top Center Emblem (if enabled) */}
      {showTopEmblem && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <svg width="40" height="18" viewBox="0 0 40 18" fill="none">
            <path
              d="M 20 2 C 16 6, 14 12, 20 16 C 26 12, 24 6, 20 2 Z"
              fill="#D4AF37"
            />
            <circle cx="20" cy="9" r="1.5" fill="#FFFDF9" />
            <circle cx="12" cy="11" r="1" fill="#AA7C11" />
            <circle cx="28" cy="11" r="1" fill="#AA7C11" />
          </svg>
        </div>
      )}

      {/* Inner Content */}
      <div className={`relative z-10 p-4 sm:p-8 ${innerClassName}`}>{children}</div>
    </div>
  );
}
