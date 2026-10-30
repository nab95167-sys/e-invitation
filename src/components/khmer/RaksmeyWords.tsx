"use client";

import Image from "next/image";
import { RaksmeyCorner, RaksmeyDivider, RaksmeyMedallion } from "./RaksmeyOrnaments";
import { Language } from "@/lib/translations";

interface RaksmeyWordsProps {
  groomParents?: string;
  brideParents?: string;
  lang: Language;
}

export default function RaksmeyWords({
  groomParents = "លោក ផៃ សុខន និង អ្នកស្រី យ៉ាន់ ចាន់ណារ៉ា",
  brideParents = "លោក ហែម សាវឿន និង អ្នកស្រី សៅ ណឺង",
  lang,
}: RaksmeyWordsProps) {
  const isKm = lang === "km";

  return (
    <section id="words" className="relative py-20 px-4 bg-[#14160b] overflow-hidden">
      {/* Background ambient texture */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{ backgroundImage: "url('/raksmey-assets/tex/paper-olive.webp')" }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Main Card with Arched Photo and Parents Details */}
        <div className="relative rounded-3xl bg-[#1d2010] border border-[#d9b15a]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-6 sm:p-12 overflow-hidden">
          {/* Corner Ornaments */}
          <div className="absolute top-3 left-3 text-[#d9b15a]/70">
            <RaksmeyCorner className="w-12 h-12" />
          </div>
          <div className="absolute top-3 right-3 text-[#d9b15a]/70">
            <RaksmeyCorner className="w-12 h-12" flipX />
          </div>
          <div className="absolute bottom-3 left-3 text-[#d9b15a]/70">
            <RaksmeyCorner className="w-12 h-12" flipY />
          </div>
          <div className="absolute bottom-3 right-3 text-[#d9b15a]/70">
            <RaksmeyCorner className="w-12 h-12" flipX flipY />
          </div>

          {/* Section Header */}
          <div className="text-center mb-8">
            <span className="font-script text-3xl sm:text-4xl text-[#d9b15a] block mb-1">
              Words of Honor
            </span>
            <h2 className="font-moul text-base sm:text-xl text-[#fbefc0] tracking-wide">
              {isKm ? "សេចក្តីថ្លែងអំណរគុណ និងការគោរពអញ្ជើញ" : "Celebration of Holy Matrimony"}
            </h2>
            <div className="flex justify-center text-[#d9b15a]/70 my-3 w-40 sm:w-56 mx-auto">
              <RaksmeyDivider className="w-full h-auto" />
            </div>
          </div>

          {/* Grid Layout: Arched Portrait Photo + Formal Invitation Statement */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Arched Couple Photo */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-64 sm:w-72 aspect-[3/4] rounded-t-full rounded-b-2xl overflow-hidden border-2 border-[#d9b15a]/70 p-1.5 bg-[#2a2f16] shadow-2xl">
                <div className="relative w-full h-full rounded-t-full rounded-b-xl overflow-hidden">
                  <Image
                    src="/raksmey-assets/img/words-1280.webp"
                    alt="Raksmey and Pheakdey"
                    fill
                    className="object-cover object-center filter brightness-[0.95] contrast-[1.05]"
                  />
                </div>
              </div>
            </div>

            {/* Formal Cambodian Invitation Wording */}
            <div className="md:col-span-7 flex flex-col justify-center text-center md:text-left space-y-5">
              <div className="font-moul text-sm text-[#d9b15a] tracking-wider uppercase">
                {isKm ? "សូមគោរពអញ្ជើញ" : "Cordially Invited"}
              </div>

              <p className="font-khmer text-sm sm:text-base leading-relaxed text-[#f3ebdb]">
                {isKm ? (
                  <>
                    យើងខ្ញុំមានកិត្តិយសដ៏ខ្ពង់ខ្ពស់ សូមគោរពអញ្ជើញ ឯកឧត្តម លោកជំទាវ លោក លោកស្រី
                    អ្នកនាងកញ្ញា និងប្រិយមិត្តជិតឆ្ងាយទាំងអស់ មេត្តាអញ្ជើញចូលរួមជាអធិបតី
                    និងជាភ្ញៀវកិត្តិយស ក្នុងពិធីសិរីសួស្តីអាពាហ៍ពិពាហ៍
                    កូនប្រុស-កូនស្រីរបស់យើងខ្ញុំ។
                  </>
                ) : (
                  <>
                    Together with our beloved parents, we joyfully request the honour of your
                    presence to witness and celebrate the union of our marriage ceremony and banquet.
                  </>
                )}
              </p>

              {/* Parents columns */}
              <div className="pt-4 border-t border-[#d9b15a]/30 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                {/* Groom's Parents */}
                <div className="p-3.5 rounded-xl bg-[#2a2f16]/60 border border-[#d9b15a]/30 shadow-sm">
                  <span className="text-[11px] font-semibold text-[#d9b15a] uppercase tracking-wider block mb-1">
                    {isKm ? "មាតាបិតាខាងប្រុស" : "Groom's Parents"}
                  </span>
                  <p className="font-khmer text-xs sm:text-sm text-[#ffffff] font-medium leading-relaxed">
                    {groomParents}
                  </p>
                </div>

                {/* Bride's Parents */}
                <div className="p-3.5 rounded-xl bg-[#2a2f16]/60 border border-[#d9b15a]/30 shadow-sm">
                  <span className="text-[11px] font-semibold text-[#d9b15a] uppercase tracking-wider block mb-1">
                    {isKm ? "មាតាបិតាខាងស្រី" : "Bride's Parents"}
                  </span>
                  <p className="font-khmer text-xs sm:text-sm text-[#ffffff] font-medium leading-relaxed">
                    {brideParents}
                  </p>
                </div>
              </div>

              {/* Sacred quote */}
              <p className="font-script text-xl sm:text-2xl text-[#d9b15a] text-center pt-2">
                &ldquo;Two souls, one heartfelt journey of love&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
