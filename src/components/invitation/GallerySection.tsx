"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, X, Image as ImageIcon, Film } from "lucide-react";
import { Language, translations } from "@/lib/translations";

interface MediaItem {
  id: string;
  title?: string | null;
  mediaType: string;
  url: string;
  caption?: string | null;
  category: string;
}

interface GallerySectionProps {
  items: MediaItem[];
  videoUrl?: string | null;
  lang?: Language;
}

export default function GallerySection({ items, videoUrl, lang = "km" }: GallerySectionProps) {
  const t = translations[lang] || translations.km;
  const [filter, setFilter] = useState<"ALL" | "PHOTO" | "VIDEO">("ALL");
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);

  const filteredItems = items.filter((item) => {
    if (filter === "ALL") return true;
    return item.mediaType === filter;
  });

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-xs uppercase tracking-widest text-[#AA7C11] font-semibold block mb-2">
          {t.visualMemories}
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2C2A29] mb-4">
          {t.momentsInLove}
        </h2>
        <div className="w-24 h-0.5 bg-[#D4AF37] mx-auto mb-6" />

        {/* Filter Tabs */}
        <div className="inline-flex p-1 rounded-full bg-white/80 border border-[#D4AF37]/30 shadow-sm">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              filter === "ALL"
                ? "bg-[#D4AF37] text-white shadow-luxury"
                : "text-[#3E444A] hover:text-[#AA7C11]"
            }`}
          >
            {t.allMoments}
          </button>
          <button
            onClick={() => setFilter("PHOTO")}
            className={`px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filter === "PHOTO"
                ? "bg-[#D4AF37] text-white shadow-luxury"
                : "text-[#3E444A] hover:text-[#AA7C11]"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{t.photos}</span>
          </button>
          <button
            onClick={() => setFilter("VIDEO")}
            className={`px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filter === "VIDEO"
                ? "bg-[#D4AF37] text-white shadow-luxury"
                : "text-[#3E444A] hover:text-[#AA7C11]"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>{t.videos}</span>
          </button>
        </div>
      </div>

      {/* Featured Teaser Video if provided */}
      {videoUrl && (
        <div className="mb-12 max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-luxury-lg border border-[#D4AF37]/30 aspect-video bg-black relative">
          {videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be") ? (
            <iframe
              src={videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video src={videoUrl} controls className="w-full h-full object-cover" />
          )}
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveMedia(item)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl aspect-[4/5] bg-stone-100 shadow-card border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-300"
          >
            {item.mediaType === "VIDEO" ? (
              <div className="w-full h-full flex items-center justify-center bg-stone-900 text-white relative">
                <video src={item.url} className="w-full h-full object-cover opacity-60" muted />
                <div className="absolute w-14 h-14 rounded-full bg-[#D4AF37]/90 text-white flex items-center justify-center shadow-luxury group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </div>
              </div>
            ) : (
              <img
                src={item.url}
                alt={item.title || "Wedding Memory"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 text-white">
              <span className="font-serif text-lg font-bold">{item.title || "Wedding Moment"}</span>
              {item.caption && <span className="text-xs text-white/80 mt-1">{item.caption}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setActiveMedia(null)}
        >
          <button
            onClick={() => setActiveMedia(null)}
            className="absolute top-6 right-6 text-white hover:text-[#D4AF37] p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {activeMedia.mediaType === "VIDEO" ? (
              <video
                src={activeMedia.url}
                controls
                autoPlay
                className="max-h-[75vh] w-auto max-w-full rounded-2xl shadow-luxury-lg"
              />
            ) : (
              <img
                src={activeMedia.url}
                alt={activeMedia.title || "Wedding Memory"}
                className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-luxury-lg"
              />
            )}
            {activeMedia.caption && (
              <p className="mt-4 text-center text-white/90 text-sm max-w-lg">
                {activeMedia.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
