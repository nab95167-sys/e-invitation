"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { RaksmeyCorner, RaksmeyCrest, RaksmeyFlapBorder } from "./RaksmeyOrnaments";
import { Language } from "@/lib/translations";
import { ThemeConfig, hexToRgba, parseThemeConfig } from "@/lib/theme";

interface RaksmeyEnvelopeGateProps {
  groomName: string;
  brideName: string;
  guestName?: string;
  lang: Language;
  themeConfig?: ThemeConfig;
  onOpen: () => void;
}

export default function RaksmeyEnvelopeGate({
  groomName,
  brideName,
  guestName,
  lang,
  themeConfig: propThemeConfig,
  onOpen,
}: RaksmeyEnvelopeGateProps) {
  const theme = propThemeConfig || parseThemeConfig(null);
  const [openingStage, setOpeningStage] = useState<"closed" | "opening" | "opened">("closed");
  const [isRemoved, setIsRemoved] = useState(false);

  const isKm = lang === "km";

  // Derive display names (allowing custom envelope overrides)
  const displayGroom = theme.envelopeGroom || groomName;
  const displayBride = theme.envelopeBride || brideName;
  const displayTitle = theme.envelopeTitle || (isKm ? "សិរីសួស្តីអាពាហ៍ពិពាហ៍" : "The Wedding Invitation");
  const displaySub = theme.envelopeSub || "Save Our Date";
  const displayGreeting = theme.envelopeGreeting || (isKm ? "សូមគោរពអញ្ជើញ" : "Cordially Invited");

  // Derive couple initials for the wax seal
  const gChar = displayGroom.trim().charAt(0) || "ក";
  const bChar = displayBride.trim().charAt(0) || "ក";
  const coupleInitials = isKm ? `${gChar} · ${bChar}` : `${gChar.toUpperCase()} & ${bChar.toUpperCase()}`;

  const triggerGoldenConfetti = () => {
    try {
      confetti({
        particleCount: 55,
        spread: 75,
        origin: { y: 0.55, x: 0.5 },
        colors: [theme.accent, "#F3E5AB", "#D4AF37", theme.envelope, "#FFFFFF"],
        ticks: 200,
        gravity: 0.8,
        scalar: 1.15,
      });
      setTimeout(() => {
        confetti({
          particleCount: 30,
          angle: 60,
          spread: 60,
          origin: { x: 0.25, y: 0.6 },
          colors: [theme.accent, "#F3E5AB", "#FFFFFF"],
        });
        confetti({
          particleCount: 30,
          angle: 120,
          spread: 60,
          origin: { x: 0.75, y: 0.6 },
          colors: [theme.accent, "#F3E5AB", "#FFFFFF"],
        });
      }, 200);
    } catch (e) {
      // Fallback
    }
  };

  const handleOpenClick = () => {
    if (openingStage !== "closed") return;

    // Stage 1: Seal breaks, flap begins unfolding, confetti burst
    setOpeningStage("opening");
    triggerGoldenConfetti();

    // Stage 2: Flap completely open, card rises up out of open box
    setTimeout(() => {
      setOpeningStage("opened");
    }, 450);

    // Stage 3: Notify parent & dismiss gate
    setTimeout(() => {
      onOpen();
    }, 1400);

    setTimeout(() => {
      setIsRemoved(true);
    }, 2100);
  };

  if (isRemoved) return null;

  const isOpeningOrOpened = openingStage !== "closed";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={openingStage === "opened" ? { opacity: 0, scale: 1.05 } : { opacity: 1 }}
        exit={{ opacity: 0, scale: 1.08 }}
        transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
        className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-hidden select-none ${
          openingStage === "opened" ? "pointer-events-none" : ""
        }`}
        style={{
          backgroundColor: theme.primary,
          backgroundImage: `radial-gradient(circle at 50% 35%, ${hexToRgba(theme.envelope, 0.95)} 0%, ${hexToRgba(theme.primary, 0.98)} 75%)`,
        }}
      >
        {/* Ambient background particles & warm glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(ellipse at center, ${hexToRgba(theme.accent, 0.18)} 0%, transparent 70%)`,
          }}
        />

        {/* 3D Envelope Container with Perspective */}
        <div
          className="relative w-full max-w-[430px] sm:max-w-[490px] mx-auto"
          style={{ perspective: "1600px" }}
        >
          {/* THE BOX (Envelope Body) */}
          <motion.div
            animate={
              openingStage === "opened"
                ? { y: 15, scale: 0.98 }
                : { y: 0, scale: 1 }
            }
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center overflow-visible border transition-colors duration-500"
            style={{
              backgroundColor: theme.envelope,
              borderColor: hexToRgba(theme.accent, 0.45),
              boxShadow: `0 25px 60px -15px rgba(0,0,0,0.9), 0 0 40px ${hexToRgba(theme.accent, 0.22)}`,
            }}
          >
            {/* Subtle paper silk texture */}
            <div
              className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-20 pointer-events-none bg-repeat"
              style={{
                backgroundImage: `radial-gradient(${hexToRgba(theme.accent, 0.4)} 1px, transparent 1px)`,
                backgroundSize: "18px 18px",
              }}
            />

            {/* 4 Kbach Ornate Corners */}
            <div className="absolute top-2.5 left-2.5 pointer-events-none" style={{ color: theme.accent }}>
              <RaksmeyCorner className="w-9 sm:w-11 h-9 sm:h-11" />
            </div>
            <div className="absolute top-2.5 right-2.5 pointer-events-none" style={{ color: theme.accent }}>
              <RaksmeyCorner className="w-9 sm:w-11 h-9 sm:h-11" flipX />
            </div>
            <div className="absolute bottom-2.5 left-2.5 pointer-events-none" style={{ color: theme.accent }}>
              <RaksmeyCorner className="w-9 sm:w-11 h-9 sm:h-11" flipY />
            </div>
            <div className="absolute bottom-2.5 right-2.5 pointer-events-none" style={{ color: theme.accent }}>
              <RaksmeyCorner className="w-9 sm:w-11 h-9 sm:h-11" flipX flipY />
            </div>

            {/* Top Flap Back / OPEN BOX LINING (Visible when Flap Opens) */}
            <motion.div
              initial={false}
              animate={
                isOpeningOrOpened
                  ? { rotateX: -180, zIndex: 1 }
                  : { rotateX: 0, zIndex: 20 }
              }
              transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
              style={{
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
              }}
              className="absolute -top-1 left-0 right-0 h-28 sm:h-32 rounded-t-2xl pointer-events-none"
            >
              {/* Front Flap (Closed state) */}
              <div
                className="absolute inset-0 rounded-t-2xl border-t border-l border-r shadow-md flex items-center justify-center transition-colors duration-500"
                style={{
                  backgroundColor: theme.envelope,
                  borderColor: hexToRgba(theme.accent, 0.5),
                  backfaceVisibility: "hidden",
                  clipPath: "polygon(0% 0%, 50% 68%, 100% 0%, 100% 100%, 0% 100%)",
                }}
              >
                <div className="opacity-70 -mt-8" style={{ color: theme.accent }}>
                  <RaksmeyFlapBorder className="w-32 sm:w-36 h-auto" />
                </div>
              </div>

              {/* Inside Lining (OPEN BOX STATE - Revealed when Flap Flips Open!) */}
              <div
                className="absolute inset-0 rounded-t-2xl border-t border-l border-r shadow-2xl flex items-center justify-center transition-colors duration-500"
                style={{
                  backgroundColor: theme.lining,
                  borderColor: hexToRgba(theme.accent, 0.65),
                  transform: "rotateY(180deg) rotateZ(180deg)",
                  backfaceVisibility: "hidden",
                  clipPath: "polygon(0% 100%, 50% 15%, 100% 100%)",
                }}
              >
                {/* Decorative silk lining pattern */}
                <div
                  className="w-full h-full opacity-35"
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, ${hexToRgba(theme.accent, 0.25)} 0, ${hexToRgba(theme.accent, 0.25)} 1px, transparent 0, transparent 12px)`,
                  }}
                />
              </div>
            </motion.div>

            {/* INSIDE INVITATION CARD (Slides out in Open Box stage) */}
            <motion.div
              animate={
                openingStage === "opened"
                  ? { y: -80, opacity: 1, scale: 1.02 }
                  : { y: 0, opacity: 0.95, scale: 1 }
              }
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 rounded-xl p-4 sm:p-5 border transition-all duration-500 shadow-md"
              style={{
                backgroundColor: theme.card,
                borderColor: hexToRgba(theme.accent, 0.45),
              }}
            >
              {/* Royal Crest */}
              <div className="flex justify-center mb-1 drop-shadow-md" style={{ color: theme.accent }}>
                <RaksmeyCrest className="w-20 sm:w-24 h-auto" />
              </div>

              {/* Wedding Title Header */}
              <div
                className="font-moul text-xs sm:text-sm tracking-widest uppercase mb-1 drop-shadow-sm"
                style={{ color: "#fbefc0" }}
              >
                {displayTitle}
              </div>
              <div
                className="font-script text-lg sm:text-xl mb-3"
                style={{ color: theme.accent }}
              >
                {displaySub}
              </div>

              {/* Groom & Bride Names */}
              <div
                className="py-2.5 px-3 rounded-lg border mb-3 shadow-inner transition-colors duration-500"
                style={{
                  backgroundColor: hexToRgba(theme.lining, 0.55),
                  borderColor: hexToRgba(theme.accent, 0.35),
                }}
              >
                <div className="font-moul text-base sm:text-lg text-[#ffffff] leading-relaxed drop-shadow">
                  {displayGroom}
                </div>
                <div className="font-serif italic text-xs my-0.5" style={{ color: theme.accent }}>
                  &amp;
                </div>
                <div className="font-moul text-base sm:text-lg text-[#ffffff] leading-relaxed drop-shadow">
                  {displayBride}
                </div>
              </div>

              {/* VIP Guest Invitation Badge */}
              <div
                className="relative my-2.5 px-3 py-2 rounded-xl border transition-colors duration-500"
                style={{
                  background: `linear-gradient(90deg, ${hexToRgba(theme.envelope, 0.45)} 0%, ${hexToRgba(theme.lining, 0.75)} 50%, ${hexToRgba(theme.envelope, 0.45)} 100%)`,
                  borderColor: hexToRgba(theme.accent, 0.5),
                }}
              >
                <p
                  className="text-[10px] uppercase tracking-wider font-semibold mb-0.5"
                  style={{ color: theme.accent }}
                >
                  {displayGreeting}
                </p>
                <p className="font-moul text-sm sm:text-base text-[#ffffff] font-bold drop-shadow">
                  {guestName || (isKm ? "ភ្ញៀវកិត្តិយស" : "Honored Guest")}
                </p>
              </div>
            </motion.div>

            {/* WAX SEAL / OPEN BOX TRIGGER BUTTON */}
            <div className="relative z-30 mt-4 flex flex-col items-center">
              <button
                type="button"
                onClick={handleOpenClick}
                disabled={isOpeningOrOpened}
                className="group relative flex flex-col items-center focus:outline-none cursor-pointer"
                aria-label="Open Invitation"
              >
                {/* Pulsing halo */}
                <div
                  className="absolute -inset-2.5 rounded-full blur-md animate-pulse transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: hexToRgba(theme.accent, 0.35) }}
                />

                {/* Wax Seal Circle */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  animate={isOpeningOrOpened ? { scale: 1.25, opacity: 0 } : { scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2.5px] shadow-[0_8px_25px_rgba(0,0,0,0.65),inset_0_2px_4px_rgba(255,255,255,0.4)] flex items-center justify-center transition-transform"
                  style={{
                    background: `linear-gradient(135deg, #F3E5AB 0%, ${theme.accent} 50%, #7F5C1E 100%)`,
                  }}
                >
                  {/* Wax Seal Core */}
                  <div
                    className="w-full h-full rounded-full border flex flex-col items-center justify-center shadow-inner transition-colors duration-500"
                    style={{
                      backgroundColor: theme.lining || "#8a1c14",
                      borderColor: hexToRgba(theme.accent, 0.7),
                    }}
                  >
                    {/* Seal Emblem: Crown, Lotus, Monogram, Knot, or Initials */}
                    {theme.sealStyle === "crown" ? (
                      <span className="text-xl sm:text-2xl drop-shadow">👑</span>
                    ) : theme.sealStyle === "lotus" ? (
                      <span className="text-xl sm:text-2xl drop-shadow">🪷</span>
                    ) : theme.sealStyle === "knot" ? (
                      <span className="text-xl sm:text-2xl drop-shadow">♾️</span>
                    ) : theme.sealStyle === "monogram" ? (
                      <span className="text-lg sm:text-xl drop-shadow text-white font-script">❦</span>
                    ) : (
                      <span className="font-moul text-xs sm:text-sm text-[#fbefc0] tracking-wider drop-shadow">
                        {coupleInitials}
                      </span>
                    )}
                    <span className="text-[7.5px] uppercase tracking-widest text-[#fbefc0]/90 font-bold mt-0.5">
                      {isKm ? "បើក" : "Open"}
                    </span>
                  </div>
                </motion.div>

                {/* Instruction caption */}
                <motion.span
                  animate={isOpeningOrOpened ? { opacity: 0 } : { opacity: 1 }}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium tracking-wide transition-colors"
                  style={{ color: "#fbefc0" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-ping"
                    style={{ backgroundColor: theme.accent }}
                  />
                  <span>{isKm ? "ចុចត្រាដើម្បីបើកសំបុត្រ (Tap Seal to Open)" : "Tap seal to open invitation"}</span>
                </motion.span>
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
