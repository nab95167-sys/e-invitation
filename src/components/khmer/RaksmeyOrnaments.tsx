"use client";

import React from "react";

// Global linear gradient defs used by ornaments
export function FoilDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <linearGradient id="g-foil" x1="0" y1="0" x2="1" y2=".35" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#9c7124" />
          <stop offset=".25" stopColor="#d9b15a" />
          <stop offset=".45" stopColor="#fbefc0" />
          <stop offset=".62" stopColor="#d9b15a" />
          <stop offset=".85" stopColor="#9c7124" />
          <stop offset="1" stopColor="#d9b15a" />
        </linearGradient>
        <clipPath id="clip-scallop" clipPathUnits="objectBoundingBox">
          <path d="M0.02 0.02 Q0.07 0.002 0.12 0.02 Q0.18 0.002 0.24 0.02 Q0.3 0.002 0.36 0.02 Q0.42 0.002 0.48 0.02 Q0.54 0.002 0.6 0.02 Q0.66 0.002 0.72 0.02 Q0.78 0.002 0.84 0.02 Q0.9 0.002 0.98 0.02 Q0.998 0.07 0.98 0.12 Q0.998 0.18 0.98 0.24 Q0.998 0.3 0.98 0.36 Q0.998 0.42 0.98 0.48 Q0.998 0.54 0.98 0.6 Q0.998 0.66 0.98 0.72 Q0.998 0.78 0.98 0.84 Q0.998 0.9 0.98 0.98 Q0.9 0.998 0.84 0.98 Q0.78 0.998 0.72 0.98 Q0.66 0.998 0.6 0.98 Q0.54 0.998 0.48 0.98 Q0.42 0.998 0.36 0.98 Q0.3 0.998 0.24 0.98 Q0.18 0.998 0.12 0.98 Q0.07 0.998 0.02 0.98 Q0.002 0.9 0.02 0.84 Q0.002 0.78 0.02 0.72 Q0.002 0.66 0.02 0.6 Q0.002 0.54 0.02 0.48 Q0.002 0.42 0.02 0.36 Q0.002 0.3 0.02 0.24 Q0.002 0.18 0.02 0.12 Q0.002 0.07 0.02 0.02 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

// 1. Royal Crest Ornament
export function RaksmeyCrest({ className = "w-48 h-auto mx-auto" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <img
        src="/raksmey-assets/crest.svg"
        alt="Royal Crest"
        className="w-full h-auto filter drop-shadow-[0_2px_8px_rgba(217,177,90,0.4)]"
      />
    </div>
  );
}

// 2. Royal Corner Filigree
export function RaksmeyCorner({
  position = "top-left",
  size,
  flipX = false,
  flipY = false,
  className = "",
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: number;
  flipX?: boolean;
  flipY?: boolean;
  className?: string;
}) {
  let scaleTransform = "";
  if (flipX && flipY) scaleTransform = "scale-[-1]";
  else if (flipX) scaleTransform = "scale-x-[-1]";
  else if (flipY) scaleTransform = "scale-y-[-1]";

  const transformMap = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 scale-x-[-1]",
    "bottom-left": "bottom-0 left-0 scale-y-[-1]",
    "bottom-right": "bottom-0 right-0 scale-[-1]",
  };

  const posClass = flipX || flipY ? "" : `absolute ${transformMap[position]}`;

  return (
    <div
      className={`pointer-events-none z-10 transition-transform ${posClass} ${scaleTransform} ${className}`}
      style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
    >
      <img
        src="/raksmey-assets/corner.svg"
        alt="Kbach Corner"
        className="w-full h-full object-contain filter drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
      />
    </div>
  );
}

// 3. Royal Divider
export function RaksmeyDivider({ className = "my-4 mx-auto", width = 280 }: { className?: string; width?: number }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ maxWidth: `${width}px` }}>
      <img
        src="/raksmey-assets/divider.svg"
        alt="Kbach Divider"
        className="w-full h-auto object-contain filter drop-shadow-[0_1px_4px_rgba(217,177,90,0.3)]"
      />
    </div>
  );
}

// 4. Royal Medallion
export function RaksmeyMedallion({ size = 80, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`inline-block ${className}`} style={{ width: `${size}px`, height: `${size}px` }}>
      <img
        src="/raksmey-assets/medallion.svg"
        alt="Kbach Medallion"
        className="w-full h-full object-contain filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
      />
    </div>
  );
}

// 5. Flap Border
export function RaksmeyFlapBorder({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <img
        src="/raksmey-assets/flapborder.svg"
        alt="Flap Border"
        className="w-full h-auto object-contain filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
      />
    </div>
  );
}

// 6. Flying / Resting Gold Butterfly
export function RaksmeyButterfly({ className = "w-10 h-10", isResting = false }: { className?: string; isResting?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 80"
      className={`butterfly ${isResting ? "is-resting" : ""} ${className}`}
      fill="none"
      stroke="url(#g-foil)"
      strokeWidth="1.6"
    >
      <g className="wing-l">
        <path d="M50 40 C35 10 10 12 5 28 C2 40 25 45 50 40 Z" fill="url(#g-foil)" fillOpacity="0.4" />
        <path d="M50 40 C30 45 15 55 20 68 C24 75 42 60 50 40 Z" fill="url(#g-foil)" fillOpacity="0.3" />
      </g>
      <g className="wing-r">
        <path d="M50 40 C65 10 90 12 95 28 C98 40 75 45 50 40 Z" fill="url(#g-foil)" fillOpacity="0.4" />
        <path d="M50 40 C70 45 85 55 80 68 C76 75 58 60 50 40 Z" fill="url(#g-foil)" fillOpacity="0.3" />
      </g>
      <ellipse cx="50" cy="40" rx="2.5" ry="12" fill="url(#g-foil)" />
      <path d="M49 28 C47 20 42 16 38 14" stroke="url(#g-foil)" strokeWidth="1" />
      <path d="M51 28 C53 20 58 16 62 14" stroke="url(#g-foil)" strokeWidth="1" />
    </svg>
  );
}

// 7. Angkor Wat Silhouette
export function RaksmeyAngkor({ className = "w-full max-w-lg mx-auto" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 800 220" className="w-full h-auto text-[#d9b15a] opacity-90 overflow-visible" fill="none" stroke="currentColor">
        <g strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          {/* Central Sanctuary Spire */}
          <path d="M400 20 L403 35 L401 50 L407 65 L403 80 L412 110 L418 150 L425 180 L400 180 L375 180 L382 150 L388 110 L397 80 L393 65 L399 50 L397 35 Z" fill="url(#g-foil)" fillOpacity="0.3" stroke="url(#g-foil)" />
          {/* Inner Towers */}
          <path d="M330 60 L333 75 L331 90 L336 105 L332 120 L338 150 L345 180 L315 180 L322 150 L328 120 L324 105 L329 90 L327 75 Z" fill="url(#g-foil)" fillOpacity="0.25" stroke="url(#g-foil)" />
          <path d="M470 60 L473 75 L471 90 L476 105 L472 120 L478 150 L485 180 L455 180 L462 150 L468 120 L464 105 L469 90 L467 75 Z" fill="url(#g-foil)" fillOpacity="0.25" stroke="url(#g-foil)" />
          {/* Outer Towers */}
          <path d="M260 90 L262 105 L260 120 L265 135 L262 150 L270 180 L250 180 L258 150 L255 135 L260 120 L258 105 Z" fill="url(#g-foil)" fillOpacity="0.2" stroke="url(#g-foil)" />
          <path d="M540 90 L542 105 L540 120 L545 135 L542 150 L550 180 L530 180 L538 150 L535 135 L540 120 L538 105 Z" fill="url(#g-foil)" fillOpacity="0.2" stroke="url(#g-foil)" />
          {/* Base galleries & terraces */}
          <path d="M100 180 L700 180" strokeWidth="2.5" stroke="url(#g-foil)" />
          <path d="M80 190 L720 190" strokeWidth="2" stroke="url(#g-foil)" />
          <path d="M60 200 L740 200" strokeWidth="1.5" stroke="url(#g-foil)" />
        </g>
      </svg>
    </div>
  );
}
