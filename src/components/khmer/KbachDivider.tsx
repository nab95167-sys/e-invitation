"use client";

interface KbachDividerProps {
  className?: string;
  width?: number;
}

export default function KbachDivider({ className = "", width = 280 }: KbachDividerProps) {
  return (
    <div className={`flex items-center justify-center my-6 ${className}`}>
      <svg
        width={width}
        height="32"
        viewBox="0 0 300 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#D4AF37] max-w-full drop-shadow-sm"
      >
        <defs>
          <linearGradient id="kbachGoldDivider" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#AA7C11" stopOpacity="0.1" />
            <stop offset="25%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#F3E5AB" />
            <stop offset="75%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#AA7C11" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Left scrolling trailing line */}
        <path
          d="M 10 16 C 40 16, 60 12, 85 16 C 105 19, 120 14, 135 16"
          stroke="url(#kbachGoldDivider)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="20" cy="16" r="2" fill="#D4AF37" />
        <circle cx="60" cy="14" r="1.5" fill="#AA7C11" />
        <circle cx="100" cy="17" r="1.5" fill="#AA7C11" />

        {/* Right scrolling trailing line */}
        <path
          d="M 290 16 C 260 16, 240 12, 215 16 C 195 19, 180 14, 165 16"
          stroke="url(#kbachGoldDivider)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="280" cy="16" r="2" fill="#D4AF37" />
        <circle cx="240" cy="14" r="1.5" fill="#AA7C11" />
        <circle cx="200" cy="17" r="1.5" fill="#AA7C11" />

        {/* Center Khmer Lotus / Sacred Flame Motif */}
        {/* Central Lotus Petal */}
        <path
          d="M 150 4 C 145 10, 142 18, 150 28 C 158 18, 155 10, 150 4 Z"
          fill="url(#kbachGoldDivider)"
        />
        
        {/* Left Petal / Wing */}
        <path
          d="M 148 10 C 141 12, 134 16, 136 24 C 140 25, 144 24, 148 20 Z"
          fill="url(#kbachGoldDivider)"
        />
        
        {/* Right Petal / Wing */}
        <path
          d="M 152 10 C 159 12, 166 16, 164 24 C 160 25, 156 24, 152 20 Z"
          fill="url(#kbachGoldDivider)"
        />

        {/* Tiny golden central pearl */}
        <circle cx="150" cy="18" r="2.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
