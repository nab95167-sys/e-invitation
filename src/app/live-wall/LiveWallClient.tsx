"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import {
  Sparkles,
  Maximize2,
  Minimize2,
  Heart,
  MessageSquare,
  QrCode,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Wish {
  id: string;
  senderName: string;
  message: string;
  relationship?: string | null;
  createdAt: string | Date;
}

interface LiveWallClientProps {
  eventId: string;
  eventSlug: string;
  groomName: string;
  brideName: string;
  eventDate?: string | null;
  couplePhotoUrl?: string | null;
  venueName?: string | null;
  initialWishes: Wish[];
}

export default function LiveWallClient({
  eventId,
  eventSlug,
  groomName,
  brideName,
  eventDate,
  couplePhotoUrl,
  venueName,
  initialWishes,
}: LiveWallClientProps) {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate QR Code pointing to invitation
  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const inviteUrl = `${origin}/invite/${eventSlug}`;
    QRCode.toDataURL(inviteUrl, {
      width: 280,
      margin: 1,
      color: { dark: "#1A1612", light: "#FFF9EE" },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [eventSlug]);

  // Auto-rotate wishes every 7 seconds
  useEffect(() => {
    if (wishes.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % wishes.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [wishes.length]);

  // Poll for new wishes every 12 seconds
  useEffect(() => {
    const pollWishes = async () => {
      try {
        const res = await fetch(`/api/wishes?eventId=${eventId}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.wishes)) {
          setWishes(data.wishes);
        }
      } catch (e) {
        // quiet error
      }
    };
    const interval = setInterval(pollWishes, 12000);
    return () => clearInterval(interval);
  }, [eventId]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const currentWish = wishes[currentIndex] || {
    senderName: "ភ្ញៀវកិត្តិយស",
    message: "សូមជូនពរជ័យ សិរីសួស្តី ជ័យមង្គល វិបុលសុខគ្រប់ប្រការ និងស្រឡាញ់គ្នារហូតដល់ចាស់កោងខ្នង!",
    relationship: "មិត្តភក្តិ",
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0D0B0E] text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Background Ambience & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/30 via-[#140F18]/80 to-[#0A080C] pointer-events-none" />

      {/* Floating subtle sparkles animation layer */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* ============================================================ */}
      {/* TOP BAR: EVENT LOGO, TIME & FULLSCREEN TOGGLE                 */}
      {/* ============================================================ */}
      <header className="relative z-10 p-6 md:p-8 flex items-center justify-between border-b border-amber-500/15 backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-[#1A161F] rounded-[14px] flex items-center justify-center">
              <Heart className="w-5 h-5 text-amber-400 fill-amber-400/50" />
            </div>
          </div>
          <div>
            <span className="text-amber-400/80 text-[11px] font-bold tracking-widest uppercase block font-sans">
              Royal Wedding Celebration
            </span>
            <span className="text-stone-300 text-xs font-khmer">
              {venueName || "ពិធីសិរីសួស្តីអាពាហ៍ពិពាហ៍"}
            </span>
          </div>
        </div>

        {/* Live Clock & Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-amber-300/80 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{currentTime}</span>
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-stone-200 transition-all border border-white/10 cursor-pointer"
            title="ប្តូរ Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* MAIN CONTENT: COUPLE TITLE & ACTIVE WISH CAROUSEL            */}
      {/* ============================================================ */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center p-6 md:p-12 gap-8 max-w-7xl mx-auto w-full">
        {/* Left / Center: Couple Branding & Active Wish Card */}
        <div className="flex-1 w-full flex flex-col items-center text-center space-y-6">
          {/* Header Title */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-khmer">
              <Sparkles className="w-3.5 h-3.5" />
              <span>សិរីសួស្តីអាពាហ៍ពិពាហ៍</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#F9E4B7] via-[#D4AF37] to-[#AA7C11] bg-clip-text text-transparent drop-shadow-sm font-khmer leading-tight">
              {groomName} &amp; {brideName}
            </h1>
          </div>

          {/* Active Wish Frame */}
          <div className="w-full max-w-2xl bg-gradient-to-b from-white/10 to-white/5 p-8 sm:p-10 rounded-3xl border-2 border-amber-400/40 shadow-2xl backdrop-blur-md relative overflow-hidden transition-all duration-500">
            {/* Khmer Floral Ornaments */}
            <div className="absolute top-2 left-3 text-amber-400/30 text-xl select-none font-serif">❖</div>
            <div className="absolute top-2 right-3 text-amber-400/30 text-xl select-none font-serif">❖</div>
            <div className="absolute bottom-2 left-3 text-amber-400/30 text-xl select-none font-serif">❖</div>
            <div className="absolute bottom-2 right-3 text-amber-400/30 text-xl select-none font-serif">❖</div>

            {/* Wish Message */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-amber-300">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider">ពាក្យជូនពរពីភ្ញៀវ</span>
              </div>

              <blockquote className="font-khmer text-lg sm:text-2xl text-stone-100 font-medium leading-relaxed italic px-4">
                “{currentWish.message}”
              </blockquote>

              <div className="pt-4 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-center gap-2 font-khmer">
                <span className="font-bold text-base sm:text-lg text-amber-300">
                  {currentWish.senderName}
                </span>
                {currentWish.relationship && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-200">
                    {currentWish.relationship}
                  </span>
                )}
              </div>
            </div>

            {/* Progress bar for rotation */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
              <div
                key={currentIndex}
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 animate-[progress_7s_linear]"
                style={{
                  animation: "progress 7s linear",
                }}
              />
            </div>
          </div>

          {/* Navigation Dots */}
          {wishes.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev - 1 + wishes.length) % wishes.length)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-stone-300 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-xs text-stone-400 font-mono">
                {currentIndex + 1} / {wishes.length}
              </div>
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % wishes.length)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-stone-300 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Guest QR Scanner Invitation Card */}
        <div className="w-full sm:w-80 bg-gradient-to-b from-[#1C1722]/90 to-[#120E17]/95 p-6 rounded-3xl border border-amber-500/30 shadow-2xl flex flex-col items-center text-center space-y-4 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-amber-200 font-khmer">
              ស្កេនដើម្បីជូនពរ!
            </h3>
            <p className="text-[11px] text-stone-300 font-khmer">
              សូមប្រើទូរស័ព្ទរបស់លោកអ្នកស្កេន QR នេះ ដើម្បីផ្ញើសារជូនពរឡើងលើផ្ទាំងអេក្រង់នេះភ្លាមៗ។
            </p>
          </div>

          {/* QR Code */}
          <div className="p-3 bg-[#FFF9EE] rounded-2xl shadow-inner border-2 border-amber-400/60">
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="Scan to Send Wish"
                className="w-44 h-44 rounded-lg object-contain"
              />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center text-stone-400 text-xs">
                Generating QR...
              </div>
            )}
          </div>

          <div className="text-[10px] text-amber-400/80 font-sans tracking-wider uppercase flex items-center gap-1 font-semibold">
            <span>Live Wedding Guestbook</span>
            <Sparkles className="w-3 h-3" />
          </div>
        </div>
      </main>

      {/* ============================================================ */}
      {/* BOTTOM FOOTER TICKER                                         */}
      {/* ============================================================ */}
      <footer className="relative z-10 p-4 border-t border-amber-500/15 bg-black/40 backdrop-blur-xs flex items-center justify-between text-xs text-stone-400 font-khmer">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-300 font-semibold">កំពុងផ្សាយផ្ទាល់ (Live System)</span>
          <span className="hidden sm:inline text-stone-500">· ទទួលបានសារជូនពរសរុប {wishes.length}</span>
        </div>

        <div className="text-stone-400 text-[11px]">
          Royal Wedding Invitation &amp; Live Celebration Platform
        </div>
      </footer>
    </div>
  );
}
