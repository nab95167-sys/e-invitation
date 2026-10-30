"use client";

import { useState } from "react";
import { Send, Heart, MessageSquare, AlertCircle, Sparkles } from "lucide-react";

import KbachDivider from "@/components/khmer/KbachDivider";
import KbachCorner from "@/components/khmer/KbachCorner";
import { Language, translations } from "@/lib/translations";

interface WishItem {
  id: string;
  senderName: string;
  relationship?: string | null;
  message: string;
  createdAt: string | Date;
}

interface WishesSectionProps {
  initialWishes: WishItem[];
  eventSlug: string;
  defaultGuestName?: string | null;
  lang?: Language;
}

export default function WishesSection({
  initialWishes,
  eventSlug,
  defaultGuestName,
  lang = "km",
}: WishesSectionProps) {
  const t = translations[lang] || translations.km;
  const [wishes, setWishes] = useState<WishItem[]>(initialWishes);
  const [name, setName] = useState(defaultGuestName || "");
  const [relationship, setRelationship] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventSlug,
          senderName: name,
          relationship,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit wish");
      }

      setWishes([data.wish, ...wishes]);
      setMessage("");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section lang={lang} className="py-20 px-6 max-w-4xl mx-auto font-khmer">
      <div className="text-center mb-12">
        <span className="font-moul text-base text-[#AA7C11] block mb-1">
          {t.wishesHeadingKh}
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2A29] mb-1">
          {t.wishesHeadingEn}
        </h2>
        <KbachDivider width={200} className="my-2" />
        <p className="text-sm text-[#3E444A]/80">
          {t.wishesDesc}
        </p>
      </div>

      {/* Wish Submission Box with Kbach corners */}
      <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDF] rounded-3xl p-6 sm:p-8 shadow-luxury-lg border-2 border-[#D4AF37]/40 mb-12 relative overflow-hidden">
        <KbachCorner position="top-left" size={48} />
        <KbachCorner position="top-right" size={48} />
        <KbachCorner position="bottom-left" size={48} />
        <KbachCorner position="bottom-right" size={48} />
        <div className="absolute inset-2 border border-[#D4AF37]/30 rounded-2xl pointer-events-none" />
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.wishSuccess}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-1.5">
                {t.yourName}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Emily Watson"
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-sm text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-1.5">
                {t.relationship}
              </label>
              <input
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder={t.relationshipPlaceholder}
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-sm text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-1.5">
              {t.heartfeltWish}
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.wishPlaceholder}
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-sm text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs font-semibold shadow-luxury hover:brightness-105 transition-all flex items-center justify-center gap-2 ml-auto disabled:opacity-50"
          >
            {loading ? (
              <span>{t.sending}</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>{t.postBlessing}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Wishes Stream */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {wishes.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-[#D4AF37]/20 shadow-sm hover:border-[#D4AF37]/40 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#AA7C11]">
                  <Heart className="w-4 h-4 fill-[#D4AF37]" />
                </div>
                <div>
                  <span className="font-serif font-bold text-base text-[#2C2A29]">
                    {item.senderName}
                  </span>
                  {item.relationship && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#AA7C11] border border-[#D4AF37]/20">
                      {item.relationship}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[11px] text-[#3E444A]/60">
                {new Date(item.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <p className="text-sm text-[#3E444A] pl-10 leading-relaxed font-light">
              "{item.message}"
            </p>
          </div>
        ))}

        {wishes.length === 0 && (
          <div className="text-center py-8 text-sm text-[#3E444A]/60">
            {t.noWishesYet}
          </div>
        )}
      </div>
    </section>
  );
}
