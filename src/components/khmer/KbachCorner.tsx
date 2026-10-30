"use client";

interface KbachCornerProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
  size?: number;
}

export default function KbachCorner({
  position,
  className = "",
  size = 64,
}: KbachCornerProps) {
  // Rotations for 4 corners
  const transform =
    position === "top-left"
      ? ""
      : position === "top-right"
      ? "scaleX(-1)"
      : position === "bottom-left"
      ? "scaleY(-1)"
      : "scale(-1, -1)";

  const stylePosition =
    position === "top-left"
      ? "top-1 left-1"
      : position === "top-right"
      ? "top-1 right-1"
      : position === "bottom-left"
      ? "bottom-1 left-1"
      : "bottom-1 right-1";

  return (
    <div
      className={`absolute ${stylePosition} pointer-events-none z-10 ${className}`}
      style={{ transform }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#D4AF37] drop-shadow-sm"
      >
        <defs>
          <linearGradient id={`goldGrad-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F3E5AB" />
            <stop offset="40%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#AA7C11" />
            <stop offset="100%" stopColor="#8C6207" />
          </linearGradient>
        </defs>

        {/* Outer Corner Frame Lines */}
        <path
          d="M 4 96 L 4 4 L 96 4"
          stroke={`url(#goldGrad-${position})`}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 9 90 L 9 9 L 90 9"
          stroke={`url(#goldGrad-${position})`}
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="2 3"
        />

        {/* Traditional Kbach Khmer / Phni Tes Spiral Leaves */}
        {/* Main Corner Floral Bud */}
        <circle cx="12" cy="12" r="3.5" fill={`url(#goldGrad-${position})`} />
        
        {/* Intricate flame leaves scrolling horizontally */}
        <path
          d="M 12 12 C 25 12, 35 6, 45 6 C 55 6, 62 14, 52 18 C 42 22, 38 15, 48 12 C 55 10, 68 8, 78 8"
          stroke={`url(#goldGrad-${position})`}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Intricate flame leaves scrolling vertically */}
        <path
          d="M 12 12 C 12 25, 6 35, 6 45 C 6 55, 14 62, 18 52 C 22 42, 15 38, 12 48 C 10 55, 8 68, 8 78"
          stroke={`url(#goldGrad-${position})`}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Inner Floral Crest / Lotus Petal filigree */}
        <path
          d="M 14 14 C 22 22, 32 24, 38 18 C 44 12, 40 4, 32 6 C 24 8, 22 18, 28 24 C 34 30, 42 34, 48 28"
          stroke={`url(#goldGrad-${position})`}
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
        
        <path
          d="M 14 14 C 22 22, 24 32, 18 38 C 12 44, 4 40, 6 32 C 8 24, 18 22, 24 28 C 30 34, 34 42, 28 48"
          stroke={`url(#goldGrad-${position})`}
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Diamond rosette accent */}
        <polygon
          points="24,20 28,24 24,28 20,24"
          fill={`url(#goldGrad-${position})`}
        />
      </svg>
    </div>
  );
}
