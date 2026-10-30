"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, HeartHandshake, Utensils, AlertCircle, Sparkles } from "lucide-react";

import KbachCorner from "@/components/khmer/KbachCorner";
import KbachDivider from "@/components/khmer/KbachDivider";

import { Language, translations } from "@/lib/translations";

interface GuestData {
  name: string;
  invitationCode: string;
  rsvpStatus: string;
  attendeesCount: number;
  maxGuests: number;
  dietaryRestrictions?: string | null;
  tableNumber?: string | null;
}

interface RSVPSectionProps {
  guest: GuestData | null;
  lang?: Language;
}

export default function RSVPSection({ guest, lang = "km" }: RSVPSectionProps) {
  const t = translations[lang];
  const [status, setStatus] = useState<"ATTENDING" | "DECLINED">(
    guest?.rsvpStatus === "DECLINED" ? "DECLINED" : "ATTENDING"
  );
  const [attendees, setAttendees] = useState<number>(guest?.attendeesCount || 1);
  const [diet, setDiet] = useState<string>(guest?.dietaryRestrictions || "");
  const [notes, setNotes] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(guest?.rsvpStatus !== "PENDING");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guest) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationCode: guest.invitationCode,
          rsvpStatus: status,
          attendeesCount: status === "ATTENDING" ? attendees : 0,
          dietaryRestrictions: diet,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit RSVP");
      }

      setSubmitted(true);

      if (status === "ATTENDING") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#D4AF37", "#F3E5AB", "#E8C5C8", "#AA7C11"],
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rsvp" lang={lang} className="py-20 px-6 max-w-3xl mx-auto font-khmer">
      <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDF] rounded-3xl p-8 sm:p-12 shadow-luxury-lg border-2 border-[#D4AF37]/50 relative overflow-hidden">
        {/* 4 Kbach Khmer Corners */}
        <KbachCorner position="top-left" size={60} />
        <KbachCorner position="top-right" size={60} />
        <KbachCorner position="bottom-left" size={60} />
        <KbachCorner position="bottom-right" size={60} />

        <div className="absolute inset-3 border border-[#D4AF37]/40 rounded-2xl pointer-events-none" />

        {/* Decorative Header */}
        <div className="text-center mb-8 relative z-10">
          <span className="font-moul text-base text-[#AA7C11] block mb-1">
            {t.rsvpHeadingKh}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2A29] mb-1">
            {t.rsvpHeadingEn}
          </h2>
          <KbachDivider width={180} className="my-2" />
          <p className="text-sm text-[#3E444A]/80 max-w-md mx-auto">
            {t.rsvpDesc}
          </p>

          {guest && (
            <div className="mt-4 inline-block px-5 py-2 rounded-full bg-white/90 border border-[#D4AF37]/40 text-xs font-semibold text-[#AA7C11] shadow-sm">
              <span className="text-[#3E444A]/70 font-normal">{t.reservedFor} </span>
              <span className="text-[#2C2A29] font-bold">{guest.name}</span>
              {guest.tableNumber && (
                <span className="ml-2 text-stone-500 font-normal">({guest.tableNumber})</span>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 text-[#AA7C11] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2C2A29] mb-2">
              {status === "ATTENDING" ? t.rsvpSuccessAccept : t.rsvpSuccessDecline}
            </h3>
            <p className="text-sm text-[#3E444A]/80 mb-6 max-w-md mx-auto">
              {status === "ATTENDING"
                ? `${t.attendeesCountLabel.replace("{count}", String(guest?.maxGuests || 2))}`
                : t.rsvpSuccessDecline}
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs text-[#AA7C11] underline hover:text-[#8C6207]"
            >
              {t.updateResponse}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status radio choices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                  status === "ATTENDING"
                    ? "border-[#D4AF37] bg-[#F7E7CE]/20 shadow-sm"
                    : "border-stone-200 hover:border-[#D4AF37]/50"
                }`}
              >
                <input
                  type="radio"
                  name="rsvpStatus"
                  value="ATTENDING"
                  checked={status === "ATTENDING"}
                  onChange={() => setStatus("ATTENDING")}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    status === "ATTENDING"
                      ? "border-[#D4AF37] bg-[#D4AF37]"
                      : "border-stone-300"
                  }`}
                >
                  {status === "ATTENDING" && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div>
                  <span className="font-serif font-bold text-base text-[#2C2A29] block">
                    {t.acceptRsvp}
                  </span>
                  <span className="text-xs text-[#3E444A]/70">{t.acceptRsvpDesc}</span>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                  status === "DECLINED"
                    ? "border-stone-400 bg-stone-50 shadow-sm"
                    : "border-stone-200 hover:border-stone-400"
                }`}
              >
                <input
                  type="radio"
                  name="rsvpStatus"
                  value="DECLINED"
                  checked={status === "DECLINED"}
                  onChange={() => setStatus("DECLINED")}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    status === "DECLINED"
                      ? "border-stone-500 bg-stone-500"
                      : "border-stone-300"
                  }`}
                >
                  {status === "DECLINED" && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div>
                  <span className="font-serif font-bold text-base text-[#2C2A29] block">
                    {t.declineRsvp}
                  </span>
                  <span className="text-xs text-[#3E444A]/70">{t.declineRsvpDesc}</span>
                </div>
              </label>
            </div>

            {status === "ATTENDING" && (
              <>
                {/* Guest Count */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-2">
                    {t.attendeesCountLabel.replace("{count}", String(guest?.maxGuests || 2))}
                  </label>
                  <select
                    value={attendees}
                    onChange={(e) => setAttendees(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-2xl text-sm text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    {Array.from({ length: guest?.maxGuests || 2 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? t.person : t.persons}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dietary Requirements */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-2 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-[#AA7C11]" />
                    <span>{t.dietaryLabel}</span>
                  </label>
                  <input
                    type="text"
                    value={diet}
                    onChange={(e) => setDiet(e.target.value)}
                    placeholder={t.dietaryPlaceholder}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-2xl text-sm text-[#2C2A29] placeholder-[#3E444A]/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
              </>
            )}

            {/* Note / Message */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-2 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-[#AA7C11]" />
                <span>{t.notesLabel}</span>
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.notesPlaceholder}
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-2xl text-sm text-[#2C2A29] placeholder-[#3E444A]/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !guest}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#AA7C11] text-white font-medium text-sm shadow-luxury hover:brightness-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block animate-pulse">{t.submittingRsvp}</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.confirmRsvpButton}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
