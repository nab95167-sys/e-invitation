"use client";

import Image from "next/image";
import { RaksmeyButterfly, RaksmeyDivider, RaksmeyMedallion } from "./RaksmeyOrnaments";
import { Language } from "@/lib/translations";

interface RaksmeyCoupleProps {
  groomName: string;
  brideName: string;
  lang: Language;
}

export default function RaksmeyCouple({
  groomName,
  brideName,
  lang,
}: RaksmeyCoupleProps) {
  const isKm = lang === "km";

  return (
    <section id="couple" className="relative py-20 px-4 bg-[#101209] overflow-hidden">
      {/* Background glow & texture */}
      <div className="absolute inset-0 bg-radial-gradient from-[#2a2f16]/30 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="text-center mb-12">
          <span className="font-script text-3xl sm:text-4xl text-[#d9b15a] block mb-1">
            The Groom &amp; The Bride
          </span>
          <h2 className="font-moul text-base sm:text-xl text-[#fbefc0] tracking-wide">
            {isKm ? "គូស្វាមីភរិយា" : "The Happy Couple"}
          </h2>
          <div className="flex justify-center text-[#d9b15a]/70 my-3 w-40 sm:w-56 mx-auto">
            <RaksmeyDivider className="w-full h-auto" />
          </div>
        </div>

        {/* 3-Column Layout: Groom Profile | Scalloped Couple Photo | Bride Profile */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Groom Profile */}
          <div className="md:col-span-4 flex flex-col items-center md:items-end text-center md:text-right space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#2a2f16] border border-[#d9b15a]/60 flex items-center justify-center text-[#d9b15a] shadow-lg">
              <span className="font-moul text-base text-[#fbefc0]">រ</span>
            </div>
            <span className="text-xs uppercase tracking-widest text-[#d9b15a] font-semibold">
              {isKm ? "កូនប្រុស" : "The Groom"}
            </span>
            <h3 className="font-moul text-xl sm:text-2xl text-[#ffffff] foil">
              {groomName}
            </h3>
            <p className="font-serif italic text-sm text-[#d9b15a]/90">
              PHEAY RAKSMEY
            </p>
            <p className="font-khmer text-xs sm:text-sm text-[#f3ebdb]/80 leading-relaxed max-w-xs">
              {isKm
                ? "បុរសមានចិត្តមេត្តា រួសរាយរាក់ទាក់ និងស្មោះត្រង់ ត្រៀមខ្លួនជាបង្អែកដ៏រឹងមាំសម្រាប់គ្រួសារថ្មី។"
                : "A gentleman of loyalty and warmth, ready to build an eternal home of joy and peace."}
            </p>
          </div>

          {/* Center: Vintage Scalloped Couple Photo */}
          <div className="md:col-span-4 flex flex-col items-center justify-center relative">
            {/* Flying decorative butterfly */}
            <div className="absolute -top-4 -right-2 z-20 text-[#d9b15a] drop-shadow-md animate-pulse">
              <RaksmeyButterfly className="w-8 h-8 rotate-12" />
            </div>

            <div className="relative w-64 sm:w-72 aspect-[4/5] rounded-[2.5rem] overflow-hidden p-2 bg-gradient-to-b from-[#f5d77f]/40 via-[#d9b15a]/20 to-[#2a2f16] shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-[#d9b15a]/60">
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
                <Image
                  src="/raksmey-assets/img/cozy-1280.webp"
                  alt="Raksmey & Pheakdey in cozy pose"
                  fill
                  className="object-cover object-center filter brightness-[0.98] contrast-[1.05]"
                />
              </div>
            </div>

            {/* Medallion beneath photo */}
            <div className="mt-4 text-[#d9b15a] flex items-center justify-center">
              <RaksmeyMedallion className="w-10 h-10" />
            </div>
          </div>

          {/* Right: Bride Profile */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#2a2f16] border border-[#d9b15a]/60 flex items-center justify-center text-[#d9b15a] shadow-lg">
              <span className="font-moul text-base text-[#fbefc0]">ភ</span>
            </div>
            <span className="text-xs uppercase tracking-widest text-[#d9b15a] font-semibold">
              {isKm ? "កូនស្រី" : "The Bride"}
            </span>
            <h3 className="font-moul text-xl sm:text-2xl text-[#ffffff] foil">
              {brideName}
            </h3>
            <p className="font-serif italic text-sm text-[#d9b15a]/90">
              MEAS PHEAKDEY
            </p>
            <p className="font-khmer text-xs sm:text-sm text-[#f3ebdb]/80 leading-relaxed max-w-xs">
              {isKm
                ? "ស្ត្រីមានស្នាមញញឹមស្រស់បំព្រង សុភាពរាបសារ និងទន់ភ្លន់ ដែលនាំមកនូវភាពកក់ក្តៅជានិច្ច។"
                : "Graceful, kind-hearted, bringing gentle radiance and eternal warmth to this union."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
