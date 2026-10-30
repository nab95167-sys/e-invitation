"use client";

import { RaksmeyAngkor, RaksmeyCorner, RaksmeyDivider } from "./RaksmeyOrnaments";
import { Language } from "@/lib/translations";
import { MapPin, Navigation, Phone, ExternalLink } from "lucide-react";

interface RaksmeyVenueProps {
  venueName?: string;
  venueAddress?: string;
  googleMapsUrl?: string;
  lang: Language;
}

export default function RaksmeyVenue({
  venueName = "គេហដ្ឋានខាងស្រី (The Bride’s Residence)",
  venueAddress = "ភូមិព្រែកហូរលិច១ សង្កាត់ព្រែកហូរ ក្រុងតាខ្មៅ ខេត្តកណ្តាល",
  googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=11.45128,104.93335",
  lang,
}: RaksmeyVenueProps) {
  const isKm = lang === "km";

  const contacts = [
    { label: isKm ? "ទំនាក់ទំនងខាងស្រី" : "Bride's Family", phone: "096 7 717 278" },
    { label: isKm ? "ទំនាក់ទំនងខាងប្រុស" : "Groom's Family", phone: "077 721 829" },
  ];

  return (
    <section id="venue" className="relative py-20 px-4 bg-[#101209] overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-radial-gradient from-[#2a2f16]/30 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header with Angkor Wat Silhouette */}
        <div className="text-center mb-10">
          <div className="flex justify-center text-[#d9b15a]/80 mb-3">
            <RaksmeyAngkor className="w-28 sm:w-36 h-auto" />
          </div>
          <span className="font-script text-3xl sm:text-4xl text-[#d9b15a] block mb-1">
            Location &amp; Directions
          </span>
          <h2 className="font-moul text-base sm:text-xl text-[#fbefc0] tracking-wide">
            {isKm ? "ទីតាំងប្រារព្ធពិធីមង្គលការ" : "Wedding Venue & Map"}
          </h2>
          <div className="flex justify-center text-[#d9b15a]/70 my-3 w-40 sm:w-56 mx-auto">
            <RaksmeyDivider className="w-full h-auto" />
          </div>
        </div>

        {/* Venue Card */}
        <div className="relative rounded-3xl bg-[#1d2010] border border-[#d9b15a]/40 shadow-2xl p-6 sm:p-10 overflow-hidden">
          {/* Corner Ornaments */}
          <div className="absolute top-2 left-2 text-[#d9b15a]/60">
            <RaksmeyCorner className="w-10 h-10" />
          </div>
          <div className="absolute top-2 right-2 text-[#d9b15a]/60">
            <RaksmeyCorner className="w-10 h-10" flipX />
          </div>

          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2a2f16] border border-[#d9b15a]/50 text-[#d9b15a] text-xs font-semibold uppercase tracking-wider mb-3">
              <MapPin className="w-3.5 h-3.5" />
              {isKm ? "ទីកន្លែងទទួលភ្ញៀវ" : "Reception Location"}
            </div>
            <h3 className="font-moul text-lg sm:text-2xl text-[#ffffff] foil mb-2">
              {venueName}
            </h3>
            <p className="font-khmer text-sm sm:text-base text-[#f3ebdb]/90 leading-relaxed">
              {venueAddress}
            </p>

            {/* Direct Google Maps Action Button */}
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#d9b15a] to-[#c99a3e] text-[#1d2010] font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                <Navigation className="w-4 h-4" />
                {isKm ? "បើកផែនទី Google Maps" : "Get Directions (Google Maps)"}
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>

          {/* Interactive Google Maps Iframe */}
          <div className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden border border-[#d9b15a]/40 shadow-inner">
            <iframe
              src="https://maps.google.com/maps?q=11.45128,104.93335&hl=km&z=15&output=embed"
              className="w-full h-full border-0 filter contrast-[1.05] brightness-[0.95]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Wedding Venue Map"
            />
          </div>

          {/* Phone Contact Helpline */}
          <div className="mt-8 pt-6 border-t border-[#d9b15a]/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contacts.map((contact, idx) => (
              <a
                key={idx}
                href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#2a2f16]/70 border border-[#d9b15a]/30 hover:border-[#d9b15a] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1d2010] border border-[#d9b15a]/60 flex items-center justify-center text-[#d9b15a] group-hover:scale-105 transition-all">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] uppercase tracking-wider text-[#d9b15a] font-medium block">
                      {contact.label}
                    </span>
                    <span className="font-moul text-xs sm:text-sm text-[#ffffff]">
                      {contact.phone}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[#fbefc0]/60 group-hover:text-[#d9b15a] transition-colors">
                  {isKm ? "ហៅទូរស័ព្ទ" : "Call"} &rarr;
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
