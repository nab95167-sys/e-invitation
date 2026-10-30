"use client";

import { useState } from "react";
import Image from "next/image";
import { RaksmeyDivider } from "./RaksmeyOrnaments";
import { Language } from "@/lib/translations";
import { X, ZoomIn } from "lucide-react";

interface RaksmeyGalleryProps {
  photos?: string[];
  lang: Language;
}

export default function RaksmeyGallery({ photos, lang }: RaksmeyGalleryProps) {
  const isKm = lang === "km";
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const defaultPhotos = [
    {
      src: "/raksmey-assets/img/hero-2000.webp",
      alt: "Raksmey & Pheakdey Wedding Portrait",
      span: "col-span-1 md:col-span-2 row-span-2",
    },
    {
      src: "/raksmey-assets/img/words-1280.webp",
      alt: "Couple Traditional Attire",
      span: "col-span-1",
    },
    {
      src: "/raksmey-assets/img/cozy-1280.webp",
      alt: "Sweet Moment Together",
      span: "col-span-1",
    },
    {
      src: "/raksmey-assets/img/pond-1280.webp",
      alt: "Romantic Evening Lotus Pond",
      span: "col-span-1 md:col-span-2",
    },
  ];

  return (
    <section id="gallery" className="relative py-20 px-4 bg-[#14160b] overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="font-script text-3xl sm:text-4xl text-[#d9b15a] block mb-1">
            Sweet Memories
          </span>
          <h2 className="font-moul text-base sm:text-xl text-[#fbefc0] tracking-wide">
            {isKm ? "កម្រងរូបភាពអនុស្សាវរីយ៍" : "Our Wedding Moments"}
          </h2>
          <div className="flex justify-center text-[#d9b15a]/70 my-3 w-40 sm:w-56 mx-auto">
            <RaksmeyDivider className="w-full h-auto" />
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {defaultPhotos.map((photo, index) => (
            <div
              key={index}
              onClick={() => setSelectedPhoto(photo.src)}
              className={`relative rounded-2xl overflow-hidden border border-[#d9b15a]/40 bg-[#1d2010] shadow-xl cursor-pointer group min-h-[260px] ${photo.span}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105 filter brightness-[0.92] group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1d2010]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                <span className="font-khmer text-xs text-[#fbefc0] font-medium drop-shadow">
                  {photo.alt}
                </span>
                <div className="w-8 h-8 rounded-full bg-[#d9b15a]/90 text-[#1d2010] flex items-center justify-center">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#1d2010] border border-[#d9b15a] text-[#fbefc0] flex items-center justify-center hover:scale-110 transition-all z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="relative max-w-4xl max-h-[85vh] w-full h-[75vh] rounded-2xl overflow-hidden border border-[#d9b15a]/60 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedPhoto}
              alt="Enlarged photo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
