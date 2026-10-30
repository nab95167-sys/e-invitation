"use client";

import { useState } from "react";
import { RaksmeyCorner, RaksmeyCrest, RaksmeyFlapBorder } from "./RaksmeyOrnaments";
import { Language } from "@/lib/translations";

interface RaksmeyEnvelopeGateProps {
  groomName: string;
  brideName: string;
  guestName?: string;
  lang: Language;
  onOpen: () => void;
}

export default function RaksmeyEnvelopeGate({
  groomName,
  brideName,
  guestName,
  lang,
  onOpen,
}: RaksmeyEnvelopeGateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    onOpen();
    setTimeout(() => {
      setIsRemoved(true);
    }, 1100);
  };

  if (isRemoved) return null;

  const isKm = lang === "km";

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0d0f07] transition-all duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] ${
        isOpen ? "opacity-0 -translate-y-8 pointer-events-none scale-105" : "opacity-100"
      }`}
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 35%, rgba(42,47,22,0.95) 0%, rgba(13,15,7,0.98) 75%), url('/raksmey-assets/tex/paper-olive.webp')",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Ambient background particles / warm glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d9b15a]/10 via-transparent to-transparent pointer-events-none" />

      {/* Main Envelope Box Card */}
      <div className="relative w-full max-w-[420px] sm:max-w-[480px] mx-4 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(217,177,90,0.2)] border border-[#d9b15a]/40 bg-[#1d2010] p-6 sm:p-9 text-center overflow-hidden">
        {/* Paper texture overlay */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none bg-repeat"
          style={{ backgroundImage: "url('/raksmey-assets/tex/paper-olive.webp')" }}
        />

        {/* 4 Kbach Ornate Corners */}
        <div className="absolute top-2 left-2 text-[#d9b15a]/80">
          <RaksmeyCorner className="w-10 h-10" />
        </div>
        <div className="absolute top-2 right-2 text-[#d9b15a]/80">
          <RaksmeyCorner className="w-10 h-10" flipX />
        </div>
        <div className="absolute bottom-2 left-2 text-[#d9b15a]/80">
          <RaksmeyCorner className="w-10 h-10" flipY />
        </div>
        <div className="absolute bottom-2 right-2 text-[#d9b15a]/80">
          <RaksmeyCorner className="w-10 h-10" flipX flipY />
        </div>

        {/* Flap top ornament */}
        <div className="flex justify-center -mt-3 mb-2 text-[#d9b15a]/60">
          <RaksmeyFlapBorder className="w-36 h-auto" />
        </div>

        {/* Royal Crest */}
        <div className="flex justify-center text-[#d9b15a] mb-2 drop-shadow-md">
          <RaksmeyCrest className="w-24 sm:w-28 h-auto" />
        </div>

        {/* Wedding Title Header */}
        <div className="font-moul text-xs sm:text-sm text-[#fbefc0] tracking-widest uppercase mb-1 drop-shadow-sm">
          {isKm ? "សិរីសួស្តីអាពាហ៍ពិពាហ៍" : "The Wedding Invitation"}
        </div>
        <div className="font-script text-xl sm:text-2xl text-[#d9b15a] mb-4">
          Save Our Date
        </div>

        {/* Groom & Bride Names */}
        <div className="py-2.5 px-3 rounded-lg bg-[#2a2f16]/70 border border-[#d9b15a]/30 mb-5 shadow-inner">
          <div className="font-moul text-base sm:text-lg text-[#fbefc0] leading-relaxed">
            {groomName}
          </div>
          <div className="font-serif italic text-xs text-[#d9b15a] my-0.5">&amp;</div>
          <div className="font-moul text-base sm:text-lg text-[#fbefc0] leading-relaxed">
            {brideName}
          </div>
        </div>

        {/* VIP Guest Invitation Badge */}
        <div className="relative my-4 px-4 py-3 rounded-xl bg-gradient-to-r from-[#2a2f16]/40 via-[#3a4120]/70 to-[#2a2f16]/40 border border-[#d9b15a]/50">
          <p className="text-[11px] uppercase tracking-wider text-[#d9b15a] font-semibold mb-1">
            {isKm ? "សូមគោរពអញ្ជើញ" : "Cordially Invited"}
          </p>
          <p className="font-moul text-sm sm:text-base text-[#ffffff] font-bold drop-shadow">
            {guestName || (isKm ? "ភ្ញៀវកិត្តិយស" : "Honored Guest")}
          </p>
        </div>

        {/* Interactive Gold Wax Seal Button */}
        <div className="mt-5 flex flex-col items-center">
          <button
            type="button"
            onClick={handleOpen}
            className="group relative flex flex-col items-center focus:outline-none"
            aria-label="Open Invitation"
          >
            {/* Pulsing halo */}
            <div className="absolute -inset-2 rounded-full bg-[#d9b15a]/25 blur-md animate-pulse group-hover:bg-[#d9b15a]/40 transition-all" />

            {/* Wax Seal Circle */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#f5d77f] via-[#c99a3e] to-[#7f5c1e] p-[2px] shadow-[0_8px_20px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.4)] transition-all duration-300 group-hover:scale-105 active:scale-95 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#8a1c14] border border-[#f5d77f]/50 flex flex-col items-center justify-center shadow-inner">
                <span className="font-moul text-sm sm:text-base text-[#fbefc0] tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {isKm ? "រ · ភ" : "R · P"}
                </span>
                <span className="text-[8px] uppercase tracking-widest text-[#fbefc0]/80 font-bold -mt-0.5">
                  {isKm ? "បើក" : "Open"}
                </span>
              </div>
            </div>

            {/* Instruction caption */}
            <span className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-medium text-[#fbefc0]/90 tracking-wide group-hover:text-[#f5d77f] transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d9b15a] animate-ping" />
              {isKm ? "ចុចដើម្បីបើកសំបុត្រ" : "Tap seal to open invitation"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
