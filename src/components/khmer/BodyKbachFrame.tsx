"use client";

import KbachCorner from "./KbachCorner";

interface BodyKbachFrameProps {
  children?: React.ReactNode;
}

export default function BodyKbachFrame({ children }: BodyKbachFrameProps) {
  return (
    <>
      {/* Fixed Full-Screen Body Frame Overlay (Pointer events none so clicks pass through) */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        {/* Outer Gold Border Frame */}
        <div className="absolute inset-1.5 sm:inset-3 border-2 border-[#D4AF37]/60 rounded-2xl sm:rounded-3xl shadow-luxury-lg pointer-events-none" />

        {/* Inner Delicate Hairline Border */}
        <div className="absolute inset-2.5 sm:inset-5 border border-[#AA7C11]/30 rounded-xl sm:rounded-2xl pointer-events-none" />
        <div className="absolute inset-3.5 sm:inset-6 border border-dashed border-[#F3E5AB]/40 rounded-lg sm:rounded-xl pointer-events-none" />

        {/* 4 Grand Kbach Khmer Corner Filigrees */}
        <div className="absolute top-1 left-1 sm:top-2.5 sm:left-2.5">
          <KbachCorner position="top-left" size={80} className="w-14 h-14 sm:w-24 sm:h-24" />
        </div>
        <div className="absolute top-1 right-1 sm:top-2.5 sm:right-2.5">
          <KbachCorner position="top-right" size={80} className="w-14 h-14 sm:w-24 sm:h-24" />
        </div>
        <div className="absolute bottom-1 left-1 sm:bottom-2.5 sm:left-2.5">
          <KbachCorner position="bottom-left" size={80} className="w-14 h-14 sm:w-24 sm:h-24" />
        </div>
        <div className="absolute bottom-1 right-1 sm:bottom-2.5 sm:right-2.5">
          <KbachCorner position="bottom-right" size={80} className="w-14 h-14 sm:w-24 sm:h-24" />
        </div>

        {/* Top-Center Royal Khmer Crest Medallion */}
        <div className="absolute top-1 sm:top-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="px-4 py-1 rounded-b-2xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDF] border-x border-b border-[#D4AF37]/60 shadow-md flex items-center gap-1.5 backdrop-blur-sm">
            {/* Left flourish */}
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
              <path
                d="M 18 6 C 12 6, 6 2, 2 6 C 0 8, 4 10, 8 8 C 12 6, 16 6, 18 6 Z"
                fill="#D4AF37"
              />
            </svg>

            <span className="font-moul text-[10px] sm:text-xs text-gold-gradient tracking-wider">
              សិរីសួស្តី
            </span>

            {/* Right flourish */}
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" style={{ transform: "scaleX(-1)" }}>
              <path
                d="M 18 6 C 12 6, 6 2, 2 6 C 0 8, 4 10, 8 8 C 12 6, 16 6, 18 6 Z"
                fill="#D4AF37"
              />
            </svg>
          </div>
        </div>

        {/* Bottom-Center Traditional Khmer Lotus Finial */}
        <div className="absolute bottom-1 sm:bottom-2.5 left-1/2 -translate-x-1/2">
          <div className="px-3 py-0.5 rounded-t-xl bg-gradient-to-t from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDF] border-x border-t border-[#D4AF37]/60 shadow-sm backdrop-blur-sm">
            <svg width="28" height="12" viewBox="0 0 28 12" fill="none">
              <path
                d="M 14 1 C 11 5, 10 9, 14 11 C 18 9, 17 5, 14 1 Z"
                fill="#D4AF37"
              />
              <circle cx="14" cy="6" r="1.5" fill="#FFFFFF" />
              <circle cx="8" cy="8" r="1" fill="#AA7C11" />
              <circle cx="20" cy="8" r="1" fill="#AA7C11" />
            </svg>
          </div>
        </div>

        {/* Left & Right Vertical Center Ornaments */}
        <div className="hidden md:block absolute top-1/2 left-1.5 sm:left-3 -translate-y-1/2">
          <svg width="10" height="32" viewBox="0 0 10 32" fill="none">
            <path d="M 5 0 L 5 32" stroke="#D4AF37" strokeWidth="1" />
            <circle cx="5" cy="16" r="3" fill="#D4AF37" />
            <circle cx="5" cy="16" r="1.5" fill="#FFFFFF" />
          </svg>
        </div>
        <div className="hidden md:block absolute top-1/2 right-1.5 sm:right-3 -translate-y-1/2">
          <svg width="10" height="32" viewBox="0 0 10 32" fill="none">
            <path d="M 5 0 L 5 32" stroke="#D4AF37" strokeWidth="1" />
            <circle cx="5" cy="16" r="3" fill="#D4AF37" />
            <circle cx="5" cy="16" r="1.5" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {/* Main Page Content */}
      <div className="relative z-0">{children}</div>
    </>
  );
}
