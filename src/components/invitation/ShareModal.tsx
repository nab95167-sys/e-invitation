"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Share2, Copy, Check, MessageCircle, Send, QrCode, Calendar, X } from "lucide-react";
import { Language, translations } from "@/lib/translations";

interface ShareModalProps {
  groomName: string;
  brideName: string;
  guestName?: string | null;
  invitationUrl: string;
  eventDate: string | Date;
  venueName: string;
  venueAddress: string;
  lang?: Language;
}

export default function ShareModal({
  groomName,
  brideName,
  guestName,
  invitationUrl,
  eventDate,
  venueName,
  venueAddress,
  lang = "km",
}: ShareModalProps) {
  const t = translations[lang] || translations.km;
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    if (invitationUrl) {
      QRCode.toDataURL(invitationUrl, { width: 300, margin: 2, color: { dark: "#2C2A29", light: "#FAF8F5" } })
        .then((url) => setQrDataUrl(url))
        .catch(console.error);
    }
  }, [invitationUrl]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(invitationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = lang === "km"
    ? `សូមគោរពអញ្ជើញ ${guestName || "ភ្ញៀវកិត្តិយស"},\n\nចូលរួមពិធីមង្គលការសិរីសួស្តីរវាង ${groomName} & ${brideName}!\n\nសូមបើកមើលលិខិតអញ្ជើញឌីជីថល និងឆ្លើយតបការចូលរួម (RSVP) តាមតំណភ្ជាប់នេះ:\n${invitationUrl}`
    : `Dear ${guestName || "Distinguished Guest"},\n\nYou are cordially invited to celebrate the wedding of ${groomName} & ${brideName}!\n\nPlease open your personalized digital invitation and RSVP below:\n${invitationUrl}`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(invitationUrl)}&text=${encodeURIComponent(
    lang === "km" ? `លិខិតអញ្ជើញអាពាហ៍ពិពាហ៍: ${groomName} & ${brideName}` : `Wedding Invitation: ${groomName} & ${brideName}`
  )}`;

  // Google Calendar Link Generator
  const startDate = new Date(eventDate);
  const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours duration
  const formatGCalDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    lang === "km" ? `ពិធីមង្គលការ: ${groomName} & ${brideName}` : `Wedding: ${groomName} & ${brideName}`
  )}&dates=${formatGCalDate(startDate)}/${formatGCalDate(endDate)}&details=${encodeURIComponent(
    lang === "km" ? `យើងខ្ញុំពិតជារីករាយក្នុងការជួបលោកអ្នក! មើលលិខិតអញ្ជើញ: ${invitationUrl}` : `We can't wait to celebrate with you! View your invitation: ${invitationUrl}`
  )}&location=${encodeURIComponent(`${venueName}, ${venueAddress}`)}`;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/90 border border-[#D4AF37]/40 shadow-luxury hover:bg-[#FAF8F5] text-xs font-semibold text-[#2C2A29] transition-all hover:scale-105"
      >
        <Share2 className="w-4 h-4 text-[#AA7C11]" />
        <span>{t.shareButton}</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div
            lang={lang}
            className="relative max-w-md w-full bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-luxury-lg border border-[#D4AF37]/40 font-khmer"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-[#3E444A]/60 hover:text-[#2C2A29] p-1.5 rounded-full hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="text-[11px] uppercase tracking-wider text-[#AA7C11] font-semibold block mb-1">
                {t.shareTitleKh}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#2C2A29]">
                {t.shareTitleEn}
              </h3>
              <p className="text-xs text-[#3E444A]/70 mt-1">
                {t.shareDesc}
              </p>
            </div>

            {/* QR Code Presentation */}
            {qrDataUrl && (
              <div className="flex flex-col items-center justify-center mb-6 p-4 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-sm">
                <img src={qrDataUrl} alt="Invitation QR Code" className="w-40 h-40 rounded-xl" />
                <span className="text-[11px] text-[#3E444A]/70 mt-2 font-medium">
                  {t.vipMobilePass}
                </span>
              </div>
            )}

            {/* Quick Share Buttons */}
            <div className="space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-[#25D366] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm hover:brightness-105 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.shareWhatsapp}</span>
              </a>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-[#229ED9] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm hover:brightness-105 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{t.shareTelegram}</span>
              </a>

              <a
                href={gcalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-white border border-[#D4AF37]/40 text-[#2C2A29] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#FAF8F5] transition-all"
              >
                <Calendar className="w-4 h-4 text-[#AA7C11]" />
                <span>{t.addToGoogleCalendar}</span>
              </a>

              <div className="pt-2">
                <button
                  onClick={copyToClipboard}
                  className="w-full py-3 px-4 rounded-2xl bg-[#FAF8F5] border border-[#D4AF37]/30 text-xs text-[#2C2A29] flex items-center justify-between hover:bg-white transition-all"
                >
                  <span className="truncate max-w-[240px] text-stone-600">{invitationUrl}</span>
                  <span className="font-semibold text-[#AA7C11] flex items-center gap-1 shrink-0">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? t.copied : t.copyLink}</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
