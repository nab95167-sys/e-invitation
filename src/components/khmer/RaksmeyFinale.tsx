"use client";

import { useState } from "react";
import { RaksmeyCrest, RaksmeyDivider } from "./RaksmeyOrnaments";
import { Language } from "@/lib/translations";
import { Share2, Check, Copy, Send } from "lucide-react";

interface RaksmeyFinaleProps {
  groomName: string;
  brideName: string;
  invitationUrl: string;
  lang: Language;
}

export default function RaksmeyFinale({
  groomName,
  brideName,
  invitationUrl,
  lang,
}: RaksmeyFinaleProps) {
  const isKm = lang === "km";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(invitationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = isKm
    ? `សូមគោរពអញ្ជើញចូលរួមពិធីសិរីសួស្តីអាពាហ៍ពិពាហ៍ ${groomName} & ${brideName}`
    : `Wedding Invitation: ${groomName} & ${brideName}`;

  return (
    <footer className="relative py-20 px-4 bg-[#0d0f07] text-center overflow-hidden border-t border-[#d9b15a]/30">
      {/* Background warm radial lighting */}
      <div className="absolute inset-0 bg-radial-gradient from-[#2a2f16]/30 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* 7 Sacred Flickering Candles */}
        <div className="flex items-end justify-center gap-3 sm:gap-5 mb-10">
          {[42, 54, 62, 72, 62, 54, 42].map((height, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Flame */}
              <div
                className="w-3 h-5 rounded-full bg-gradient-to-t from-[#ff8c00] via-[#ffd700] to-[#ffffff] shadow-[0_0_12px_#ffd700] animate-pulse"
                style={{
                  animationDuration: `${1.2 + (i % 3) * 0.4}s`,
                  transformOrigin: "bottom center",
                }}
              />
              {/* Candle Body */}
              <div
                className="w-3 sm:w-4 rounded-t-sm bg-gradient-to-r from-[#d9b15a] via-[#f7e6b5] to-[#c99a3e] shadow-md border-t border-white/40"
                style={{ height: `${height}px` }}
              />
            </div>
          ))}
        </div>

        {/* Crest */}
        <div className="flex justify-center text-[#d9b15a] mb-4">
          <RaksmeyCrest className="w-20 sm:w-24 h-auto" />
        </div>

        {/* Thank You Note */}
        <h2 className="font-moul text-lg sm:text-2xl text-[#ffffff] foil mb-3">
          {isKm ? "សូមថ្លែងអំណរគុណយ៉ាងជ្រាលជ្រៅ" : "With Heartfelt Gratitude"}
        </h2>
        <p className="font-khmer text-xs sm:text-sm text-[#f3ebdb]/90 leading-relaxed max-w-xl mx-auto mb-6">
          {isKm
            ? "វត្តមាន និងការជូនពរដ៏កក់ក្តៅរបស់លោកអ្នក គឺជាកិត្តិយស និងជាអនុស្សាវរីយ៍ដ៏មានតម្លៃបំផុតសម្រាប់ជីវិតអាពាហ៍ពិពាហ៍របស់យើងខ្ញុំ។"
            : "Your kind presence, prayers, and heartfelt wishes will forever illuminate the beginning of our new journey together."}
        </p>

        <p className="font-script text-2xl sm:text-3xl text-[#d9b15a] mb-8">
          {groomName} &amp; {brideName}
        </p>

        <div className="flex justify-center text-[#d9b15a]/70 my-4 w-40 sm:w-56 mx-auto">
          <RaksmeyDivider className="w-full h-auto" />
        </div>

        {/* Social Share Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 my-8">
          {/* Telegram Share */}
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(invitationUrl)}&text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-[#229ED9]/20 border border-[#229ED9]/50 text-[#229ED9] text-xs font-semibold hover:bg-[#229ED9] hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram</span>
          </a>

          {/* Facebook Share */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(invitationUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-[#1877F2]/20 border border-[#1877F2]/50 text-[#1877F2] text-xs font-semibold hover:bg-[#1877F2] hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Facebook</span>
          </a>

          {/* Copy Link Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 rounded-full bg-[#2a2f16] border border-[#d9b15a]/70 text-[#fbefc0] text-xs font-semibold hover:bg-[#d9b15a] hover:text-[#1d2010] transition-all flex items-center gap-1.5 shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-bold">
                  {isKm ? "បានចម្លងតំណភ្ជាប់!" : "Link Copied!"}
                </span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#d9b15a]" />
                <span>{isKm ? "ចម្លងតំណភ្ជាប់សំបុត្រ" : "Copy Invitation Link"}</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Monogram & Year */}
        <div className="pt-8 border-t border-white/10 text-center text-[11px] text-white/40 font-khmer">
          <p>© 2026 ផៃ រស្មី &amp; មាស ភក្ដី · សិរីសួស្តីអាពាហ៍ពិពាហ៍</p>
          <p className="mt-1 text-[10px] text-[#d9b15a]/60">
            E-Invitation Khmer Traditional Royal Wedding
          </p>
        </div>
      </div>
    </footer>
  );
}
