"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Gift,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";

import EnvelopeOpening from "@/components/invitation/EnvelopeOpening";
import MusicPlayer from "@/components/invitation/MusicPlayer";
import CountdownTimer from "@/components/invitation/CountdownTimer";
import GallerySection from "@/components/invitation/GallerySection";
import RSVPSection from "@/components/invitation/RSVPSection";
import WishesSection from "@/components/invitation/WishesSection";
import ShareModal from "@/components/invitation/ShareModal";
import KbachFrame from "@/components/khmer/KbachFrame";
import KbachCorner from "@/components/khmer/KbachCorner";
import KbachDivider from "@/components/khmer/KbachDivider";
import BodyKbachFrame from "@/components/khmer/BodyKbachFrame";
import LanguageToggle from "@/components/khmer/LanguageToggle";
import { Language, translations } from "@/lib/translations";
import RaksmeyThemeView from "@/components/khmer/RaksmeyThemeView";

interface InvitationClientProps {
  event: any;
  guest: any;
  baseUrl: string;
}

export default function InvitationClient({
  event,
  guest,
  baseUrl,
}: InvitationClientProps) {
  // Always render the luxury interactive Khmer theme view
  return <RaksmeyThemeView event={event} guest={guest} baseUrl={baseUrl} />;

  const [lang, setLang] = useState<Language>("km");
  const t = translations[lang] || translations.km;
  const [isOpened, setIsOpened] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  const effectiveOrigin = typeof window !== "undefined" && window.location.origin ? window.location.origin : baseUrl;
  const invitationUrl = guest?.invitationCode
    ? `${effectiveOrigin}/invite/${event.slug}?code=${guest.invitationCode}`
    : `${effectiveOrigin}/invite/${event.slug}`;

  const copyBankInfo = () => {
    if (!event.bankAccountInfo) return;
    navigator.clipboard.writeText(event.bankAccountInfo);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const weddingDateFormatted = new Date(event.eventDate).toLocaleDateString(
    lang === "km" ? "km-KH" : "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <BodyKbachFrame>
      <div lang={lang} className="min-h-screen bg-[#FAF8F5] text-[#2C2A29] relative overflow-hidden font-khmer">
        {/* Floating Language Switcher Toggle */}
        <LanguageToggle
          currentLang={lang}
          onLanguageChange={setLang}
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[60]"
        />

        {/* 1. Interactive Wax-Seal Envelope with Kbach Khmer Frame */}
        <EnvelopeOpening
          groomName={event.groomName}
          brideName={event.brideName}
          guestName={guest?.name}
          onOpen={() => setIsOpened(true)}
          lang={lang}
        />

        {/* 2. Floating Romantic Music Player */}
        <MusicPlayer musicUrl={event.musicUrl} autoPlayTrigger={isOpened} lang={lang} />

        {/* 3. Hero Header Section */}
        <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden">
          {/* Background Image with luxury soft overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={
                event.coverImageUrl ||
                "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80"
              }
              alt="Wedding Cover"
              className="w-full h-full object-cover brightness-[0.70] filter blur-[1px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/45 to-black/50" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-white">
            {/* Khmer Traditional Auspicious Header */}
            <div className="mb-4">
              <span className="font-moul text-2xl sm:text-4xl text-gold-gradient tracking-wide block drop-shadow-md">
                {t.weddingCelebration}
              </span>
              <span className="text-xs uppercase tracking-widest text-[#F3E5AB] font-semibold block mt-1 drop-shadow">
                {t.royalWeddingCelebration}
              </span>
            </div>

            <KbachDivider width={260} className="my-3 opacity-90" />

            {/* Groom & Bride Names */}
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-4 drop-shadow-lg text-white">
              {event.groomName}{" "}
              <span className="font-script text-[#F3E5AB] text-6xl sm:text-8xl md:text-9xl font-normal">
                &amp;
              </span>{" "}
              {event.brideName}
            </h1>

            <p className="font-serif italic text-lg sm:text-2xl text-stone-100 max-w-2xl mx-auto mb-8 drop-shadow">
              {event.quote || '"Joined together in friendship, united forever in love."'}
            </p>

            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-[#D4AF37]/40 text-sm font-medium text-white mb-8 shadow-luxury">
              <Calendar className="w-4 h-4 text-[#F3E5AB]" />
              <span>{weddingDateFormatted}</span>
            </div>

            {/* Real-time Countdown */}
            <div className="text-[#2C2A29]">
              <CountdownTimer targetDate={event.eventDate} lang={lang} />
            </div>

            {/* Quick Share and Navigation Actions */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <a
                href="#rsvp"
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#AA7C11] text-white font-semibold text-xs uppercase tracking-wider shadow-luxury-lg hover:scale-105 transition-all"
              >
                {t.rsvpButton}
              </a>

              <ShareModal
                groomName={event.groomName}
                brideName={event.brideName}
                guestName={guest?.name}
                invitationUrl={invitationUrl}
                eventDate={event.eventDate}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                lang={lang}
              />
            </div>
          </div>
        </section>

        {/* 4. Couple Profiles with Kbach Khmer Frames */}
        <section className="py-24 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-moul text-xl sm:text-2xl text-[#AA7C11] block mb-1">
              {t.happyCouple}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2A29]">
              {t.groomAndBride}
            </h2>
            <KbachDivider width={200} className="my-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
            {/* Groom Card in Kbach Khmer Frame */}
            <KbachFrame cornerSize={56} className="h-full">
              <div className="text-center">
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden p-1.5 border-2 border-[#D4AF37] shadow-luxury mb-6 ring-4 ring-[#D4AF37]/20">
                  <img
                    src={
                      event.groomPhotoUrl ||
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={event.groomName}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <span className="font-moul text-sm text-[#AA7C11] block mb-1">
                  {t.groomTitle}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#2C2A29] mb-1">
                  {event.groomName}
                </h3>
                <span className="text-xs uppercase tracking-wider text-[#AA7C11] font-semibold block mb-4">
                  {t.theGroom}
                </span>

                {event.groomParents && (
                  <div className="pt-4 border-t border-[#D4AF37]/20">
                    <span className="font-khmer text-xs text-[#AA7C11] font-semibold block mb-0.5">
                      {t.groomParentsTitle}
                    </span>
                    <p className="text-xs text-[#3E444A]/80 font-medium">
                      {event.groomParents}
                    </p>
                  </div>
                )}
              </div>
            </KbachFrame>

            {/* Bride Card in Kbach Khmer Frame */}
            <KbachFrame cornerSize={56} className="h-full">
              <div className="text-center">
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden p-1.5 border-2 border-[#D4AF37] shadow-luxury mb-6 ring-4 ring-[#D4AF37]/20">
                  <img
                    src={
                      event.bridePhotoUrl ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={event.brideName}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <span className="font-moul text-sm text-[#AA7C11] block mb-1">
                  {t.brideTitle}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#2C2A29] mb-1">
                  {event.brideName}
                </h3>
                <span className="text-xs uppercase tracking-wider text-[#AA7C11] font-semibold block mb-4">
                  {t.theBride}
                </span>

                {event.brideParents && (
                  <div className="pt-4 border-t border-[#D4AF37]/20">
                    <span className="font-khmer text-xs text-[#AA7C11] font-semibold block mb-0.5">
                      {t.brideParentsTitle}
                    </span>
                    <p className="text-xs text-[#3E444A]/80 font-medium">
                      {event.brideParents}
                    </p>
                  </div>
                )}
              </div>
            </KbachFrame>
          </div>

          {/* Love Story Framed in Kbach Khmer */}
          {event.story && (
            <div className="mt-16 max-w-3xl mx-auto">
              <KbachFrame cornerSize={48}>
                <div className="text-center py-2">
                  <span className="font-moul text-base text-[#AA7C11] block mb-1">
                    {t.loveStoryTitle}
                  </span>
                  <span className="font-script text-2xl text-[#AA7C11] block mb-3">
                    {t.ourLoveStory}
                  </span>
                  <p className="text-sm sm:text-base text-[#3E444A]/85 leading-relaxed font-light italic max-w-xl mx-auto">
                    "{event.story}"
                  </p>
                </div>
              </KbachFrame>
            </div>
          )}
        </section>

        {/* 5. Schedule & Venue Details with Kbach Khmer Frames */}
        <section className="py-20 px-6 bg-white/70 border-y border-[#D4AF37]/25 relative">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="font-moul text-lg sm:text-xl text-[#AA7C11] block mb-1">
                {t.scheduleHeader}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2A29]">
                {t.ceremonyAndReception}
              </h2>
              <KbachDivider width={220} className="my-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Wedding Ceremony */}
              <KbachFrame cornerSize={50} className="h-full">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center text-[#AA7C11] mb-4 shadow-sm">
                      <Heart className="w-6 h-6 fill-[#D4AF37]" />
                    </div>
                    <span className="font-moul text-xs text-[#AA7C11] block mb-1">
                      {t.ceremonyTitle}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#2C2A29] mb-4">
                      {t.ceremonySubtitle}
                    </h3>
                    <div className="space-y-3 text-sm text-[#3E444A]/80 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#AA7C11]" />
                        <span>{weddingDateFormatted}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#AA7C11]" />
                        <span>{event.ceremonyTime || "4:00 PM - 5:30 PM"}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#AA7C11] shrink-0 mt-0.5" />
                        <span>{event.venueName} — Main Sanctuary</span>
                      </div>
                    </div>
                  </div>

                  {event.dressCode && (
                    <div className="p-3 rounded-2xl bg-white border border-[#D4AF37]/20 text-xs text-[#3E444A]/70">
                      <span className="font-semibold text-[#AA7C11]">{t.dressCodeLabel}</span>{" "}
                      {event.dressCode}
                    </div>
                  )}
                </div>
              </KbachFrame>

              {/* Reception */}
              <KbachFrame cornerSize={50} className="h-full">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center text-[#AA7C11] mb-4 shadow-sm">
                      <Sparkles className="w-6 h-6 text-[#AA7C11]" />
                    </div>
                    <span className="font-moul text-xs text-[#AA7C11] block mb-1">
                      {t.receptionSubtitle}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#2C2A29] mb-4">
                      {t.receptionTitle}
                    </h3>
                    <div className="space-y-3 text-sm text-[#3E444A]/80 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#AA7C11]" />
                        <span>{weddingDateFormatted}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#AA7C11]" />
                        <span>{event.receptionTime || "6:30 PM - 11:00 PM"}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#AA7C11] shrink-0 mt-0.5" />
                        <span>{event.venueAddress}</span>
                      </div>
                    </div>
                  </div>

                  {event.googleMapsUrl && (
                    <a
                      href={event.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-2xl bg-white border border-[#D4AF37]/40 text-xs font-semibold text-[#2C2A29] flex items-center justify-center gap-2 hover:bg-[#F3E5AB]/30 transition-all shadow-sm"
                    >
                      <MapPin className="w-4 h-4 text-[#AA7C11]" />
                      <span>{t.openMapButton}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-stone-400 ml-auto" />
                    </a>
                  )}
                </div>
              </KbachFrame>
            </div>
          </div>
        </section>

        {/* 6. Media Gallery (Photos & Video) */}
        <GallerySection items={event.media || []} videoUrl={event.videoUrl} lang={lang} />

        {/* 7. Wedding Gift / Digital Envelope Registry with Kbach Frame */}
        {event.bankAccountInfo && (
          <section className="py-16 px-6 max-w-3xl mx-auto text-center">
            <KbachFrame cornerSize={48}>
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center text-[#AA7C11] mx-auto mb-3">
                <Gift className="w-6 h-6" />
              </div>
              <span className="font-moul text-base text-[#AA7C11] block mb-1">
                {t.giftTitle}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#2C2A29] mb-2">
                {t.giftHeading}
              </h3>
              <p className="text-xs sm:text-sm text-[#3E444A]/80 max-w-md mx-auto mb-6">
                {t.giftDesc}
              </p>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#D4AF37]/40 inline-flex flex-col sm:flex-row items-center gap-4 max-w-lg mx-auto shadow-sm">
                <span className="text-xs font-mono text-[#2C2A29] break-all font-semibold">
                  {event.bankAccountInfo}
                </span>
                <button
                  onClick={copyBankInfo}
                  className="px-4 py-2 rounded-xl bg-white border border-[#D4AF37]/40 text-xs font-semibold text-[#AA7C11] flex items-center gap-1.5 hover:bg-[#FAF8F5] transition-all shrink-0 shadow-sm"
                >
                  {copiedBank ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedBank ? t.copied : t.copyAccount}</span>
                </button>
              </div>
            </KbachFrame>
          </section>
        )}

        {/* 8. Interactive RSVP Section */}
        <RSVPSection guest={guest} lang={lang} />

        {/* 9. Live Wishes Guestbook */}
        <WishesSection
          initialWishes={event.wishes || []}
          eventSlug={event.slug}
          defaultGuestName={guest?.name}
          lang={lang}
        />

        {/* 10. Footer with Kbach Divider */}
        <footer className="py-16 bg-[#FAF8F5] border-t border-[#D4AF37]/20 text-center">
          <Heart className="w-6 h-6 text-[#D4AF37] fill-[#D4AF37] mx-auto mb-2 animate-pulseSlow" />
          <span className="font-moul text-base text-[#AA7C11] block mb-1">
            {t.thankYou}
          </span>
          <p className="font-moul text-2xl font-bold text-[#2C2A29] mb-1">
            {event.groomName} &amp; {event.brideName}
          </p>
          <p className="text-xs text-[#3E444A]/60">
            {t.thankYouDesc}
          </p>
          <KbachDivider width={160} className="mt-4 opacity-80" />
        </footer>
      </div>
  </BodyKbachFrame>
  );
}
