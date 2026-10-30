"use client";

import { useState } from "react";
import Image from "next/image";
import { RaksmeyDivider, RaksmeyCorner } from "./RaksmeyOrnaments";
import { Language } from "@/lib/translations";
import { Gift, Copy, Check, QrCode } from "lucide-react";

interface RaksmeyGiftProps {
  lang: Language;
}

export default function RaksmeyGift({ lang }: RaksmeyGiftProps) {
  const isKm = lang === "km";
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <section id="gift" className="relative py-20 px-4 bg-[#14160b] overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="font-script text-3xl sm:text-4xl text-[#d9b15a] block mb-1">
            Wedding Registry
          </span>
          <h2 className="font-moul text-base sm:text-xl text-[#fbefc0] tracking-wide">
            {isKm ? "ចំណងដៃអាពាហ៍ពិពាហ៍" : "Wedding Gifts &amp; Blessings"}
          </h2>
          <div className="flex justify-center text-[#d9b15a]/70 my-3 w-40 sm:w-56 mx-auto">
            <RaksmeyDivider className="w-full h-auto" />
          </div>
          <p className="font-khmer text-xs sm:text-sm text-[#f3ebdb]/80 max-w-lg mx-auto">
            {isKm
              ? "វត្តមានដ៏ឧត្តុង្គឧត្តមរបស់លោកអ្នក គឺជាកាដូដ៏មានតម្លៃបំផុតសម្រាប់ពួកយើង។ ប្រសិនបើលោកអ្នកមានបំណងជូនពរជាចំណងដៃ លោកអ្នកអាចស្កេន QR កូដខាងក្រោមបាន។"
              : "Your presence is our greatest gift. Should you wish to honor us with a wedding gift, you may scan the QR codes below."}
          </p>
        </div>

        {/* 2 Gift Cards: KHQR & ABA PAY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Card 1: KHQR Bakong */}
          <div className="relative rounded-2xl bg-[#1d2010] border border-[#d9b15a]/50 p-6 text-center shadow-xl flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e11d48]/15 border border-[#e11d48]/40 text-[#f43f5e] text-xs font-bold uppercase tracking-wider mb-4">
              <QrCode className="w-3.5 h-3.5" />
              KHQR · Bakong
            </div>

            {/* QR Image */}
            <div className="relative w-48 h-48 rounded-xl overflow-hidden border-2 border-[#d9b15a]/40 bg-white p-2 shadow-inner mb-4">
              <div className="relative w-full h-full">
                <Image
                  src="/raksmey-assets/gift/khqr.webp"
                  alt="KHQR Wedding Gift QR"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="font-moul text-sm text-[#ffffff] mb-1">
              {isKm ? "មាស ភក្ដី" : "MEAS PHEAKDEY"}
            </div>
            <p className="text-xs text-[#d9b15a] font-mono mb-4">096 7 717 278</p>

            <button
              type="button"
              onClick={() => handleCopy("khqr", "0967717278")}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2a2f16] border border-[#d9b15a]/60 text-xs font-semibold text-[#fbefc0] hover:border-[#f5d77f] hover:bg-[#343b1c] transition-all flex items-center justify-center gap-2"
            >
              {copiedKey === "khqr" ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">
                    {isKm ? "បានចម្លងលេខគណនី!" : "Copied to clipboard!"}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#d9b15a]" />
                  <span>{isKm ? "ចម្លងលេខទូរស័ព្ទ / គណនី" : "Copy Account Number"}</span>
                </>
              )}
            </button>
          </div>

          {/* Card 2: ABA PAY */}
          <div className="relative rounded-2xl bg-[#1d2010] border border-[#d9b15a]/50 p-6 text-center shadow-xl flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#005f73]/25 border border-[#005f73]/50 text-[#0ea5e9] text-xs font-bold uppercase tracking-wider mb-4">
              <Gift className="w-3.5 h-3.5" />
              ABA Bank · ABA PAY
            </div>

            {/* ABA Image */}
            <div className="relative w-48 h-48 rounded-xl overflow-hidden border-2 border-[#d9b15a]/40 bg-white p-2 shadow-inner mb-4">
              <div className="relative w-full h-full">
                <Image
                  src="/raksmey-assets/gift/aba.webp"
                  alt="ABA PAY Wedding Gift QR"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="font-moul text-sm text-[#ffffff] mb-1">
              PHEKEDEY MEAS
            </div>
            <p className="text-xs text-[#d9b15a] font-mono mb-4">004 021 993 | USD</p>

            <button
              type="button"
              onClick={() => handleCopy("aba", "004021993")}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2a2f16] border border-[#d9b15a]/60 text-xs font-semibold text-[#fbefc0] hover:border-[#f5d77f] hover:bg-[#343b1c] transition-all flex items-center justify-center gap-2"
            >
              {copiedKey === "aba" ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">
                    {isKm ? "បានចម្លងលេខគណនី!" : "Copied to clipboard!"}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#d9b15a]" />
                  <span>{isKm ? "ចម្លងលេខគណនី ABA" : "Copy ABA Account"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
