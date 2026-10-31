"use client";

import { useState, useRef, useEffect } from "react";
import { Language } from "@/lib/translations";
import { parseThemeConfig } from "@/lib/theme";
import { FoilDefs } from "./RaksmeyOrnaments";
import RaksmeyHud from "./RaksmeyHud";
import RaksmeyEnvelopeGate from "./RaksmeyEnvelopeGate";
import RaksmeyHero from "./RaksmeyHero";
import RaksmeyWords from "./RaksmeyWords";
import RaksmeyCouple from "./RaksmeyCouple";
import RaksmeyCountdown from "./RaksmeyCountdown";
import RaksmeyProgramme from "./RaksmeyProgramme";
import RaksmeyGallery from "./RaksmeyGallery";
import RaksmeyVenue from "./RaksmeyVenue";
import RaksmeyGift from "./RaksmeyGift";
import RaksmeyRsvpAndWishes from "./RaksmeyRsvpAndWishes";
import RaksmeyFinale from "./RaksmeyFinale";

interface RaksmeyThemeViewProps {
  event: any;
  guest: any;
  baseUrl: string;
}

export default function RaksmeyThemeView({
  event,
  guest,
  baseUrl,
}: RaksmeyThemeViewProps) {
  const [lang, setLang] = useState<Language>("km");
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const effectiveOrigin = typeof window !== "undefined" && window.location.origin ? window.location.origin : baseUrl;
  const invitationUrl = guest?.invitationCode
    ? `${effectiveOrigin}/invite/${event.slug}?code=${guest.invitationCode}`
    : `${effectiveOrigin}/invite/${event.slug}`;

  // Audio stream
  const musicSource =
    event.musicUrl ||
    "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3";

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio play blocked", err));
    }
  };

  const handleEnvelopeOpen = () => {
    setIsOpened(true);
    // Start music on envelope open interaction
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.log("Audio autoplay prevented", err);
        });
    }
  };

  const themeConfig = parseThemeConfig(event.theme);

  return (
    <div
      lang={lang}
      className="min-h-screen text-[#f3ebdb] relative overflow-hidden font-khmer transition-colors duration-500"
      style={{
        backgroundColor: themeConfig.primary,
        ["--theme-primary" as any]: themeConfig.primary,
        ["--theme-accent" as any]: themeConfig.accent,
        ["--theme-envelope" as any]: themeConfig.envelope,
        ["--theme-lining" as any]: themeConfig.lining,
        ["--theme-card" as any]: themeConfig.card,
      }}
    >
      {/* SVG Global Foil Filter Definitions */}
      <FoilDefs />

      {/* Hidden Audio Player */}
      <audio
        ref={audioRef}
        src={musicSource}
        loop
        preload="auto"
        onEnded={() => setIsPlaying(false)}
      />

      {/* 1. 3D Wax-Seal Envelope Gate with Dynamic Custom Box & Open Box Colors */}
      <RaksmeyEnvelopeGate
        groomName={event.groomName}
        brideName={event.brideName}
        guestName={guest?.name}
        lang={lang}
        themeConfig={themeConfig}
        onOpen={handleEnvelopeOpen}
      />

      {/* 2. Floating Top HUD & Navigation */}
      <RaksmeyHud
        currentLang={lang}
        onLanguageChange={setLang}
        isPlaying={isPlaying}
        onToggleMusic={toggleMusic}
      />

      {/* 3. Hero Section with Cover Photo, Canvas Fireflies, Gold Crest & Date Chips */}
      <RaksmeyHero
        groomName={event.groomName}
        brideName={event.brideName}
        eventDate={event.eventDate}
        lang={lang}
      />

      {/* 4. Words of Honor & Parents' Blessings */}
      <RaksmeyWords
        groomParents={event.groomParents}
        brideParents={event.brideParents}
        lang={lang}
      />

      {/* 5. The Groom & The Bride */}
      <RaksmeyCouple
        groomName={event.groomName}
        brideName={event.brideName}
        lang={lang}
      />

      {/* 6. Live Countdown Timer */}
      <RaksmeyCountdown
        targetDate={event.eventDate}
        lang={lang}
      />

      {/* 7. 2-Day Wedding Programme & Ceremonies */}
      <RaksmeyProgramme lang={lang} />

      {/* 8. Sweet Memories Photo Gallery */}
      <RaksmeyGallery lang={lang} />

      {/* 9. Venue & Directions Map */}
      <RaksmeyVenue
        venueName={event.venueName}
        venueAddress={event.venueAddress}
        googleMapsUrl={event.googleMapsUrl}
        venuePhotoUrl={event.venuePhotoUrl}
        lang={lang}
      />

      {/* 10. Gift Registry (KHQR & ABA) */}
      <RaksmeyGift lang={lang} />

      {/* 11. RSVP Confirmation & Lotus Pond Wishes Guestbook */}
      <RaksmeyRsvpAndWishes
        eventSlug={event.slug}
        guest={guest}
        initialWishes={event.wishes}
        lang={lang}
      />

      {/* 12. Finale with 7 Flickering Candles & Social Sharing */}
      <RaksmeyFinale
        groomName={event.groomName}
        brideName={event.brideName}
        invitationUrl={invitationUrl}
        lang={lang}
      />
    </div>
  );
}
