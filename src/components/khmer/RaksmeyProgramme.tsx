"use client";

import { useState } from "react";
import { RaksmeyDivider, RaksmeyMedallion } from "./RaksmeyOrnaments";
import { Language } from "@/lib/translations";
import { Clock, Sun, Sparkles, Utensils, Music, Heart } from "lucide-react";

interface RaksmeyProgrammeProps {
  lang: Language;
}

export default function RaksmeyProgramme({ lang }: RaksmeyProgrammeProps) {
  const isKm = lang === "km";
  const [activeDay, setActiveDay] = useState<1 | 2>(2);

  const day1Schedule = [
    {
      time: isKm ? "២:០០ រសៀល" : "2:00 PM",
      title: isKm ? "ពិធីក្រុងពាលី" : "Krong Peali Ceremony",
      desc: isKm
        ? "ពិធីបួងសួងសុំការអនុញ្ញាតម្ចាស់ទឹកម្ចាស់ដី ដើម្បីសេចក្តីសុខចម្រើន"
        : "Traditional earth guardian offering and blessing prayer.",
      icon: Sun,
    },
    {
      time: isKm ? "៣:០០ រសៀល" : "3:00 PM",
      title: isKm ? "ពិធីសូត្រមន្តចម្រើនព្រះបរិត្ត" : "Monks Blessing & Chanting",
      desc: isKm
        ? "ព្រះសង្ឃចម្រើនព្រះបរិត្ត ប្រោះព្រំទឹកមន្តសិរីសួស្តី"
        : "Sacred Buddhist monks prayer and holy water blessing.",
      icon: Sparkles,
    },
    {
      time: isKm ? "៤:៣០ រសៀល" : "4:30 PM",
      title: isKm ? "ពិធីសែនព្រេនដូនតា" : "Ancestral Honoring Rite",
      desc: isKm
        ? "ពិធីជម្រាប និងដឹងគុណដល់បុព្វការីជន និងជីដូនជីតា"
        : "Honoring ancestors and receiving parental blessings.",
      icon: Heart,
    },
  ];

  const day2Schedule = [
    {
      time: isKm ? "៦:៣០ ព្រឹក" : "6:30 AM",
      title: isKm ? "ពិធីហែកំណត់ (ហែកូនកំលោះ)" : "Groom's Procession",
      desc: isKm
        ? "ក្បួនហែជំនូនផ្លែឈើ និងគ្រឿងបណ្ណាការចូលគេហដ្ឋានខាងស្រី"
        : "The traditional parade bearing fruits and wedding gifts to the bride's house.",
      icon: Sun,
    },
    {
      time: isKm ? "៧:៣០ ព្រឹក" : "7:30 AM",
      title: isKm ? "ពិសាអាហារពេលព្រឹក" : "Morning Breakfast",
      desc: isKm
        ? "ទទួលភ្ញៀវកិត្តិយសពិសាអាហារពេលព្រឹកយ៉ាងស្និទ្ធស្នាល"
        : "Welcoming guests for warm morning refreshments and breakfast.",
      icon: Utensils,
    },
    {
      time: isKm ? "៨:៣០ ព្រឹក" : "8:30 AM",
      title: isKm ? "ពិធីកាត់សក់បង្កក់សិរី" : "Hair Cutting Rite (Gat Sah)",
      desc: isKm
        ? "តំណាងឱ្យការលាងជម្រះអតីតកាល និងស្វាគមន៍ការចាប់ផ្តើមថ្មីពោរពេញដោយសុភមង្គល"
        : "Symbolic purification rite cleansing the couple for new beginnings.",
      icon: Sparkles,
    },
    {
      time: isKm ? "១០:៣០ ព្រឹក" : "10:30 AM",
      title: isKm ? "ពិធីបង្វិលពពិល និងសែនចងដៃ" : "Candle Circling & Thread Tying",
      desc: isKm
        ? "បង្វិលពពិល ៧ ជុំ និងចងអំបោះក្រហមជូនពរជ័យសិរីសួស្តី"
        : "Circling of 7 sacred candles (Bangvel Popil) & red thread wrist-tying ceremony.",
      icon: Heart,
    },
    {
      time: isKm ? "១១:៣០ ថ្ងៃត្រង់" : "11:30 AM",
      title: isKm ? "ពិធីពិសាភោជនាហារថ្ងៃត្រង់" : "Lunch Reception",
      desc: isKm
        ? "ជួបជុំសាច់ញាតិ និងមិត្តភក្តិពិសាអាហារថ្ងៃត្រង់"
        : "Family and guest fellowship lunch banquet.",
      icon: Utensils,
    },
    {
      time: isKm ? "៤:០០ រសៀល" : "4:00 PM Onwards",
      title: isKm ? "ពិធីទទួលបដិសណ្ឋារកិច្ច និងពិសាភោជនាហារពេលល្ងាច" : "Evening Wedding Banquet & Party",
      desc: isKm
        ? "ពិធីពិសាភោជនាហារពេលល្ងាច ពិធីកាត់នំ និងរាំកម្សាន្តសប្បាយរីករាយ"
        : "Evening banquet, champagne toast, cake cutting, and celebratory dancing.",
      icon: Music,
    },
  ];

  const currentSchedule = activeDay === 1 ? day1Schedule : day2Schedule;

  return (
    <section id="programme" className="relative py-20 px-4 bg-[#101209] overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-radial-gradient from-[#2a2f16]/30 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="font-script text-3xl sm:text-4xl text-[#d9b15a] block mb-1">
            Ceremony &amp; Celebration
          </span>
          <h2 className="font-moul text-base sm:text-xl text-[#fbefc0] tracking-wide">
            {isKm ? "កម្មវិធីមង្គលការប្រពៃណីខ្មែរ" : "Wedding Itinerary"}
          </h2>
          <div className="flex justify-center text-[#d9b15a]/70 my-3 w-40 sm:w-56 mx-auto">
            <RaksmeyDivider className="w-full h-auto" />
          </div>
        </div>

        {/* Day 1 / Day 2 Tabs */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-10">
          <button
            type="button"
            onClick={() => setActiveDay(1)}
            className={`px-5 py-2.5 rounded-full border text-xs sm:text-sm font-semibold transition-all shadow-md ${
              activeDay === 1
                ? "bg-[#d9b15a] text-[#1d2010] border-[#f5d77f] ring-2 ring-[#d9b15a]/50"
                : "bg-[#1d2010] text-[#fbefc0]/80 border-[#d9b15a]/40 hover:border-[#d9b15a]"
            }`}
          >
            <span className="block font-moul">
              {isKm ? "ថ្ងៃទី ១ · សៅរ៍ ១៤ វិច្ឆិកា" : "Day 1 · Sat 14 Nov"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDay(2)}
            className={`px-5 py-2.5 rounded-full border text-xs sm:text-sm font-semibold transition-all shadow-md ${
              activeDay === 2
                ? "bg-[#d9b15a] text-[#1d2010] border-[#f5d77f] ring-2 ring-[#d9b15a]/50"
                : "bg-[#1d2010] text-[#fbefc0]/80 border-[#d9b15a]/40 hover:border-[#d9b15a]"
            }`}
          >
            <span className="block font-moul">
              {isKm ? "ថ្ងៃទី ២ · អាទិត្យ ១៥ វិច្ឆិកា" : "Day 2 · Sun 15 Nov"}
            </span>
          </button>
        </div>

        {/* Timeline List */}
        <div className="relative pl-6 sm:pl-10 border-l-2 border-[#d9b15a]/30 space-y-6 sm:space-y-8 max-w-2xl mx-auto">
          {currentSchedule.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1d2010] border-2 border-[#d9b15a] flex items-center justify-center text-[#d9b15a] shadow-lg group-hover:scale-110 group-hover:bg-[#2a2f16] transition-all">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Content Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#1d2010]/80 border border-[#d9b15a]/30 shadow-lg backdrop-blur-sm group-hover:border-[#d9b15a] transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#2a2f16] border border-[#d9b15a]/50 text-[#d9b15a]">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </span>
                  </div>

                  <h3 className="font-moul text-sm sm:text-base text-[#ffffff] foil tracking-wide mb-1">
                    {item.title}
                  </h3>
                  <p className="font-khmer text-xs sm:text-sm text-[#f3ebdb]/80 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
