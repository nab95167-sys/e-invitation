"use client";

import { useState } from "react";
import { Sparkles, Heart, Gift, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

import KbachCorner from "@/components/khmer/KbachCorner";
import KbachDivider from "@/components/khmer/KbachDivider";
import { Language, translations } from "@/lib/translations";

interface EnvelopeOpeningProps {
  groomName: string;
  brideName: string;
  guestName?: string | null;
  onOpen: () => void;
  lang?: Language;
}

export default function EnvelopeOpening({
  groomName,
  brideName,
  guestName,
  onOpen,
  lang = "km",
}: EnvelopeOpeningProps) {
  const [openingState, setOpeningState] = useState<"closed" | "opening" | "opened">("closed");
  const t = translations[lang] || translations.km;

  const triggerConfetti = () => {
    try {
      // Golden luxury sparkle burst
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.5, x: 0.5 },
        colors: ["#D4AF37", "#AA7C11", "#F3E5AB", "#FAF8F5", "#E8C5C8"],
        ticks: 200,
        gravity: 0.8,
        scalar: 1.1,
      });

      setTimeout(() => {
        confetti({
          particleCount: 30,
          angle: 60,
          spread: 60,
          origin: { x: 0.2, y: 0.6 },
          colors: ["#D4AF37", "#F3E5AB", "#AA7C11"],
        });
        confetti({
          particleCount: 30,
          angle: 120,
          spread: 60,
          origin: { x: 0.8, y: 0.6 },
          colors: ["#D4AF37", "#F3E5AB", "#AA7C11"],
        });
      }, 250);
    } catch (e) {
      // Graceful fallback if canvas is not ready
    }
  };

  const handleOpenClick = () => {
    if (openingState !== "closed") return;

    // Stage 1: Ribbon untie & confetti burst
    setOpeningState("opening");
    triggerConfetti();

    // Stage 2: Flaps open, inner card rises up
    setTimeout(() => {
      setOpeningState("opened");
    }, 450);

    // Stage 3: Smooth transition into main wedding website
    setTimeout(() => {
      onOpen();
    }, 2200);
  };

  const isOpeningOrOpened = openingState !== "closed";

  return (
    <AnimatePresence>
      <motion.div
        lang={lang}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.08 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-[#181512]/90 via-[#141210]/95 to-[#0A0908] backdrop-blur-xl overflow-hidden font-khmer select-none"
      >
        {/* Floating Ambient Golden Fairy Dust Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: `${(i * 6.25) % 100}vw`,
                y: "105vh",
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                y: "-10vh",
                opacity: [0, 0.7, 0.9, 0],
                scale: [0.5, 1.2, 0.8],
              }}
              transition={{
                duration: 8 + (i % 6) * 1.5,
                repeat: Infinity,
                delay: (i % 8) * 0.9,
                ease: "linear",
              }}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] blur-[1px] shadow-[0_0_12px_#D4AF37]"
            />
          ))}

          {/* Radial Auspicious Spotlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#D4AF37]/15 via-[#AA7C11]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* 3D Box Container with Perspective */}
        <div
          className="relative w-full max-w-xl mx-auto"
          style={{ perspective: "1500px" }}
        >
          {/* Main Royal Gift Box Outer Shell */}
          <div className="relative rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-[#2A2318] via-[#1E1912] to-[#120F0B] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(212,175,55,0.25)] border-2 border-[#D4AF37]/60 overflow-hidden">
            
            {/* INNER TRAY: The Velvet Bed & The Rising Royal Invitation Card */}
            <div className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDF] rounded-2xl p-6 sm:p-10 text-center shadow-inner overflow-hidden border border-[#D4AF37]/40 min-h-[500px] flex flex-col justify-between">
              {/* Inner 4 Kbach Corners */}
              <KbachCorner position="top-left" size={60} />
              <KbachCorner position="top-right" size={60} />
              <KbachCorner position="bottom-left" size={60} />
              <KbachCorner position="bottom-right" size={60} />

              <div className="absolute inset-3 border border-[#D4AF37]/40 rounded-xl pointer-events-none" />
              <div className="absolute inset-4 border border-dashed border-[#AA7C11]/25 rounded-lg pointer-events-none" />

              {/* Shimmer sweep animation over revealed card */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isOpeningOrOpened ? { opacity: [0, 1, 0], x: ["-100%", "200%"] } : {}}
                transition={{ duration: 1.5, delay: 0.6 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 pointer-events-none"
              />

              {/* Top Traditional Calligraphy */}
              <div className="relative z-10 pt-2">
                <span className="font-moul text-xl sm:text-2xl text-gold-gradient tracking-wide block drop-shadow-sm">
                  {t.weddingCelebration}
                </span>
                <span className="text-[11px] uppercase tracking-widest text-[#AA7C11] font-semibold block mt-1">
                  {t.royalWeddingCelebration}
                </span>
                <KbachDivider width={200} className="my-2.5 mx-auto" />
              </div>

              {/* Couple Names in Royal Calligraphy */}
              <div className="relative z-10 my-3">
                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#2C2A29] leading-tight tracking-tight">
                  {groomName}{" "}
                  <span className="font-script text-[#AA7C11] text-4xl sm:text-6xl font-normal">
                    &amp;
                  </span>{" "}
                  {brideName}
                </h2>
                <p className="font-script text-xl sm:text-2xl text-[#AA7C11] mt-2">
                  {t.honorOfPresence}
                </p>
              </div>

              {/* Guest Personalized VIP Badge */}
              <div className="relative z-10 my-2 p-4 rounded-2xl bg-white/90 border border-[#D4AF37]/50 shadow-luxury max-w-sm mx-auto">
                <span className="font-khmer text-xs text-[#AA7C11] font-bold block mb-0.5">
                  {t.cordiallyInvited}
                </span>
                <span className="font-serif text-lg sm:text-2xl font-bold text-[#2C2A29] block">
                  {guestName || t.distinguishedGuest}
                </span>
              </div>

              {/* Bottom Auspicious Note & Opening State Indication */}
              <div className="relative z-10 pb-2">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FAF8F5] border border-[#D4AF37]/40 text-xs text-[#AA7C11] font-semibold">
                  <Sparkles className="w-4 h-4 text-[#AA7C11] animate-spin" style={{ animationDuration: "8s" }} />
                  <span>{isOpeningOrOpened ? "សូមស្វាគមន៍ / Welcome" : t.tapToOpen}</span>
                </div>
              </div>
            </div>

            {/* 3D FRENCH DOORS / FOLIO BOX FLAPS OVERLAY */}
            {/* LEFT FLAP */}
            <motion.div
              initial={false}
              animate={
                isOpeningOrOpened
                  ? { rotateY: -115, opacity: 0.1, x: "-8%" }
                  : { rotateY: 0, opacity: 1, x: "0%" }
              }
              transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
              style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
              className="absolute top-2 bottom-2 left-2 w-[50.2%] bg-gradient-to-r from-[#FAF4E6] via-[#F3E8CE] to-[#E8D9B5] rounded-l-2xl border-y-2 border-l-2 border-[#D4AF37] shadow-[5px_0_25px_rgba(0,0,0,0.35)] overflow-hidden z-20 pointer-events-none"
            >
              <KbachCorner position="top-left" size={60} />
              <KbachCorner position="bottom-left" size={60} />
              <div className="absolute inset-3 border-y border-l border-[#D4AF37]/50 rounded-l-xl" />
              {/* Left Door Silk Texture Lines */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `radial-gradient(#AA7C11 1px, transparent 1px)`,
                  backgroundSize: "16px 16px",
                }}
              />
              {/* Half Gold Ribbon */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-14 bg-gradient-to-b from-[#F3E5AB] via-[#D4AF37] to-[#AA7C11] shadow-md border-y border-[#F3E5AB]/60" />
            </motion.div>

            {/* RIGHT FLAP */}
            <motion.div
              initial={false}
              animate={
                isOpeningOrOpened
                  ? { rotateY: 115, opacity: 0.1, x: "8%" }
                  : { rotateY: 0, opacity: 1, x: "0%" }
              }
              transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
              style={{ transformOrigin: "right center", transformStyle: "preserve-3d" }}
              className="absolute top-2 bottom-2 right-2 w-[50.2%] bg-gradient-to-l from-[#FAF4E6] via-[#F3E8CE] to-[#E8D9B5] rounded-r-2xl border-y-2 border-r-2 border-[#D4AF37] shadow-[-5px_0_25px_rgba(0,0,0,0.35)] overflow-hidden z-20 pointer-events-none"
            >
              <KbachCorner position="top-right" size={60} />
              <KbachCorner position="bottom-right" size={60} />
              <div className="absolute inset-3 border-y border-r border-[#D4AF37]/50 rounded-r-xl" />
              {/* Right Door Silk Texture Lines */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `radial-gradient(#AA7C11 1px, transparent 1px)`,
                  backgroundSize: "16px 16px",
                }}
              />
              {/* Half Gold Ribbon */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-14 bg-gradient-to-b from-[#F3E5AB] via-[#D4AF37] to-[#AA7C11] shadow-md border-y border-[#F3E5AB]/60" />
            </motion.div>

            {/* CENTER ROYAL WAX SEAL & GOLDEN EMBOSSED MEDALLION */}
            <AnimatePresence>
              {!isOpeningOrOpened && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.35, opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.45 }}
                  className="absolute inset-0 z-30 flex flex-col items-center justify-center p-4 pointer-events-auto cursor-pointer"
                  onClick={handleOpenClick}
                >
                  {/* Decorative Vertical Gold Ribbon */}
                  <div className="absolute top-0 bottom-0 w-14 bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA7C11] shadow-lg border-x border-[#F3E5AB]/60 -z-10" />

                  {/* Pulsing Aura Rings */}
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] rounded-full blur-md opacity-75 group-hover:opacity-100 animate-pulseSlow transition-opacity" />
                    
                    {/* Royal Wax Seal Core */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#AA7C11] via-[#D4AF37] to-[#8C6207] shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_2px_6px_rgba(255,255,255,0.6)] flex items-center justify-center border-3 border-[#F3E5AB] ring-4 ring-[#D4AF37]/50 group-hover:scale-105 active:scale-95 transition-transform duration-300">
                      
                      {/* Inner Ring with Auspicious Khmer Inscription */}
                      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-[#FFFDF9]/80 flex flex-col items-center justify-center bg-[#996F0E]/30">
                        <Heart className="w-6 h-6 text-white fill-white drop-shadow mb-0.5 group-hover:scale-110 transition-transform" />
                        <span className="font-khmer text-[10px] sm:text-xs font-bold text-white tracking-widest drop-shadow">
                          {t.serei}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Open Button with Golden Shimmer */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpenClick}
                    className="mt-8 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5BF42] to-[#AA7C11] text-white font-bold text-xs uppercase tracking-wider shadow-[0_10px_25px_-5px_rgba(212,175,55,0.5)] border border-[#FFFDF9]/60 hover:brightness-110 transition-all flex items-center gap-2.5 z-40"
                  >
                    <Gift className="w-4 h-4 text-white animate-bounce" />
                    <span>{t.openBox}</span>
                    <ChevronRight className="w-4 h-4 text-white/90" />
                  </motion.button>

                  <span className="text-[11px] text-[#F3E5AB]/90 font-medium mt-3 drop-shadow tracking-wide">
                    {t.tapToOpen}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
