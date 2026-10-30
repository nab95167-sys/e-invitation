"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { RaksmeyDivider, RaksmeyCorner, RaksmeyButterfly } from "./RaksmeyOrnaments";
import { Language } from "@/lib/translations";
import { Check, Heart, Send, Sparkles, UserCheck, MessageSquare } from "lucide-react";

interface RaksmeyRsvpAndWishesProps {
  eventSlug: string;
  guest?: any;
  initialWishes?: any[];
  lang: Language;
}

export default function RaksmeyRsvpAndWishes({
  eventSlug,
  guest,
  initialWishes = [],
  lang,
}: RaksmeyRsvpAndWishesProps) {
  const isKm = lang === "km";

  // RSVP state
  const [rsvpStatus, setRsvpStatus] = useState<"ATTENDING" | "DECLINED">(
    guest?.rsvpStatus === "DECLINED" ? "DECLINED" : "ATTENDING"
  );
  const [attendeesCount, setAttendeesCount] = useState<number>(guest?.attendeesCount || 1);
  const [notes, setNotes] = useState<string>(guest?.notes || "");
  const [guestNameInput, setGuestNameInput] = useState(guest?.name || "");
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(Boolean(guest?.rsvpStatus && guest.rsvpStatus !== "PENDING"));

  // Wishes state
  const [wishes, setWishes] = useState<any[]>(initialWishes);
  const [senderName, setSenderName] = useState(guest?.name || "");
  const [wishMessage, setWishMessage] = useState("");
  const [wishLoading, setWishLoading] = useState(false);
  const [wishSuccess, setWishSuccess] = useState(false);

  useEffect(() => {
    fetchWishes();
  }, [eventSlug]);

  const fetchWishes = async () => {
    try {
      const res = await fetch(`/api/wishes?slug=${eventSlug}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.wishes)) {
        setWishes(data.wishes);
      }
    } catch (err) {
      console.error("Failed to fetch wishes", err);
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveName = guest?.name || guestNameInput.trim();
    if (!guest?.invitationCode && !effectiveName) {
      alert(isKm ? "សូមបញ្ចូលឈ្មោះរបស់អ្នកដើម្បីឆ្លើយតប RSVP" : "Please enter your name to RSVP.");
      return;
    }
    setRsvpLoading(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationCode: guest?.invitationCode,
          guestName: effectiveName,
          eventSlug,
          rsvpStatus,
          attendeesCount,
          notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRsvpSuccess(true);
      } else {
        alert(data.error || "RSVP failed");
      }
    } catch (err) {
      alert("Error submitting RSVP");
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !wishMessage.trim()) return;
    setWishLoading(true);
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventSlug,
          senderName: senderName.trim(),
          message: wishMessage.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWishSuccess(true);
        setWishMessage("");
        fetchWishes();
        setTimeout(() => setWishSuccess(false), 4000);
      } else {
        alert(data.error || "Wish submission failed");
      }
    } catch (err) {
      alert("Error submitting wish");
    } finally {
      setWishLoading(false);
    }
  };

  return (
    <section id="rsvp" className="relative py-20 px-4 bg-[#101209] overflow-hidden">
      {/* Background lotus pond image with dark vignette */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/raksmey-assets/img/pond-1280.webp"
          alt="Lotus pond ambient background"
          fill
          className="object-cover object-center filter brightness-[0.35] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101209] via-transparent to-[#101209]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="font-script text-3xl sm:text-4xl text-[#d9b15a] block mb-1">
            RSVP &amp; Blessings
          </span>
          <h2 className="font-moul text-base sm:text-xl text-[#fbefc0] tracking-wide">
            {isKm ? "ឆ្លើយតបការចូលរួម និងជូនពរ" : "Confirm Attendance & Send Wishes"}
          </h2>
          <div className="flex justify-center text-[#d9b15a]/70 my-3 w-40 sm:w-56 mx-auto">
            <RaksmeyDivider className="w-full h-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: RSVP Form */}
          <div className="lg:col-span-6 relative rounded-3xl bg-[#1d2010]/90 backdrop-blur-md border border-[#d9b15a]/50 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-4 text-[#d9b15a]">
              <UserCheck className="w-5 h-5" />
              <h3 className="font-moul text-sm sm:text-base text-[#ffffff]">
                {isKm ? "ការឆ្លើយតបការអញ្ជើញ (RSVP)" : "Your Attendance Confirmation"}
              </h3>
            </div>

            <form onSubmit={handleRsvpSubmit} className="space-y-4">
              {guest ? (
                /* Guest VIP name badge */
                <div className="p-3 rounded-xl bg-[#2a2f16]/70 border border-[#d9b15a]/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#d9b15a] font-semibold block">
                      {isKm ? "ភ្ញៀវកិត្តិយស" : "Honored Guest"}
                    </span>
                    <span className="font-moul text-xs sm:text-sm text-[#ffffff]">
                      {guest.name}
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#d9b15a]/20 border border-[#d9b15a]/40 text-[#f5d77f]">
                    {guest.maxGuests} {isKm ? "នាក់" : "pax"}
                  </span>
                </div>
              ) : (
                /* Name input for public guests */
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#fbefc0]">
                    {isKm ? "ឈ្មោះភ្ញៀវកិត្តិយស" : "Your Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={guestNameInput}
                    onChange={(e) => setGuestNameInput(e.target.value)}
                    placeholder={isKm ? "បញ្ចូលឈ្មោះរបស់អ្នក..." : "Enter your full name..."}
                    className="w-full px-3 py-2 rounded-xl bg-[#14160b] border border-[#d9b15a]/30 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#d9b15a]"
                  />
                </div>
              )}

                {/* Attending / Decline options */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRsvpStatus("ATTENDING")}
                    className={`py-3 px-3 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center justify-center gap-1 ${
                      rsvpStatus === "ATTENDING"
                        ? "bg-[#2a2f16] border-[#d9b15a] text-[#f5d77f] ring-2 ring-[#d9b15a]/40"
                        : "bg-[#14160b] border-white/10 text-white/70 hover:border-white/30"
                    }`}
                  >
                    <Check className="w-4 h-4 text-[#d9b15a]" />
                    <span>{isKm ? "ចូលរួមដោយរីករាយ" : "Joyfully Attend"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRsvpStatus("DECLINED")}
                    className={`py-3 px-3 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center justify-center gap-1 ${
                      rsvpStatus === "DECLINED"
                        ? "bg-[#2a2f16] border-red-400 text-red-300 ring-2 ring-red-500/40"
                        : "bg-[#14160b] border-white/10 text-white/70 hover:border-white/30"
                    }`}
                  >
                    <span className="text-sm">&times;</span>
                    <span>{isKm ? "សោកស្តាយ មិនបានចូលរួម" : "Cannot Attend"}</span>
                  </button>
                </div>

                {/* Guest Count if attending */}
                {rsvpStatus === "ATTENDING" && (
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-medium text-[#fbefc0]">
                      {isKm ? "ចំនួនអ្នកចូលរួម" : "Number of Guests"}
                    </label>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(guest?.maxGuests || 2, 4) }, (_, i) => i + 1).map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setAttendeesCount(num)}
                          className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${
                            attendeesCount === num
                              ? "bg-[#d9b15a] text-[#1d2010] border-[#f5d77f]"
                              : "bg-[#14160b] border-white/10 text-white/80 hover:border-[#d9b15a]"
                          }`}
                        >
                          {num} {isKm ? "នាក់" : "pax"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes input */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-medium text-[#fbefc0]">
                    {isKm ? "កំណត់ចំណាំ ឬពាក្យជូនពរបន្ថែម" : "Special Notes / Dietary / Wishes"}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={isKm ? "សរសេរកំណត់ចំណាំនៅទីនេះ..." : "Write any note here..."}
                    className="w-full px-3 py-2 rounded-xl bg-[#14160b] border border-[#d9b15a]/30 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#d9b15a]"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={rsvpLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d9b15a] via-[#e5c16e] to-[#c99a3e] text-[#1d2010] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {rsvpLoading ? (
                    <span>{isKm ? "កំពុងរក្សាទុក..." : "Submitting..."}</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isKm ? "បញ្ជាក់ការឆ្លើយតប" : "Confirm RSVP"}</span>
                    </>
                  )}
                </button>

                {rsvpSuccess && (
                  <p className="text-center text-xs text-emerald-400 font-semibold animate-fade-in">
                    ✓ {isKm ? "បានបញ្ជាក់ការឆ្លើយតបរួចរាល់! សូមអរគុណ" : "RSVP confirmed successfully! Thank you"}
                  </p>
                )}
              </form>
          </div>

          {/* Column 2: Wishes Guestbook */}
          <div className="lg:col-span-6 relative rounded-3xl bg-[#1d2010]/90 backdrop-blur-md border border-[#d9b15a]/50 p-6 sm:p-8 shadow-2xl flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4 text-[#d9b15a]">
              <MessageSquare className="w-5 h-5" />
              <h3 className="font-moul text-sm sm:text-base text-[#ffffff]">
                {isKm ? "ពាក្យជូនពរដល់គូស្វាមីភរិយា" : "Wishes &amp; Blessings"}
              </h3>
            </div>

            {/* Post Wish Form */}
            <form onSubmit={handleWishSubmit} className="space-y-3 mb-6">
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder={isKm ? "ឈ្មោះរបស់អ្នក..." : "Your Name..."}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#14160b] border border-[#d9b15a]/30 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#d9b15a]"
              />

              <div className="relative">
                <textarea
                  rows={3}
                  value={wishMessage}
                  onChange={(e) => setWishMessage(e.target.value)}
                  placeholder={
                    isKm
                      ? "សរសេរពាក្យជូនពរដល់កូនកំលោះ និងកូនក្រមុំ..."
                      : "Send warm wishes and love to the newlyweds..."
                  }
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#14160b] border border-[#d9b15a]/30 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#d9b15a]"
                />
              </div>

              <button
                type="submit"
                disabled={wishLoading}
                className="w-full py-2.5 rounded-xl bg-[#2a2f16] border border-[#d9b15a]/70 text-[#fbefc0] hover:bg-[#d9b15a] hover:text-[#1d2010] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                {wishLoading ? (
                  <span>{isKm ? "កំពុងផ្ញើ..." : "Sending..."}</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-[#d9b15a]" />
                    <span>{isKm ? "ផ្ញើពាក្យជូនពរ" : "Send Blessing"}</span>
                  </>
                )}
              </button>

              {wishSuccess && (
                <p className="text-center text-xs text-emerald-400 font-semibold animate-fade-in">
                  ✓ {isKm ? "ពាក្យជូនពរត្រូវបានផ្ញើដោយជោគជ័យ!" : "Wish posted successfully!"}
                </p>
              )}
            </form>

            {/* Wishes Scrollable List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {wishes.length > 0 ? (
                wishes.map((wish, idx) => (
                  <div
                    key={wish.id || idx}
                    className="p-3.5 rounded-2xl bg-[#14160b]/80 border border-[#d9b15a]/25 shadow-sm space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-moul text-xs text-[#d9b15a]">
                        {wish.senderName}
                      </span>
                      <span className="text-[10px] text-white/40">
                        {new Date(wish.createdAt).toLocaleDateString(isKm ? "km-KH" : "en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="font-khmer text-xs text-[#f3ebdb]/90 leading-relaxed">
                      {wish.message}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-white/40 text-xs">
                  {isKm
                    ? "មិនទាន់មានពាក្យជូនពរនៅឡើយទេ។ សូមក្លាយជាអ្នកដំបូងដែលជូនពរ!"
                    : "No wishes yet. Be the first to send your blessings!"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
