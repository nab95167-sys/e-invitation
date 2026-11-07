"use client";

import { useState, useEffect, useRef } from "react";
import {
  QrCode,
  X,
  CheckCircle2,
  Gift,
  Search,
  Users,
  MapPin,
  Sparkles,
  Camera,
  RefreshCw,
} from "lucide-react";

interface Guest {
  id: string;
  name: string;
  phoneNumber?: string | null;
  email?: string | null;
  invitationCode: string;
  category: string;
  tableNumber?: string | null;
  maxGuests: number;
  rsvpStatus: string;
  attendeesCount: number;
  notes?: string | null;
}

interface GuestQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: Guest[];
  onCheckInGuest: (guestId: string) => Promise<void>;
  eventSlug: string;
}

export default function GuestQrScannerModal({
  isOpen,
  onClose,
  guests,
  onCheckInGuest,
  eventSlug,
}: GuestQrScannerModalProps) {
  const [scannedCode, setScannedCode] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [manualInput, setManualInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const scannerRef = useRef<any>(null);

  // Match scanned code against guest invitation codes or URLs
  const findGuestByCode = (rawText: string): Guest | null => {
    if (!rawText) return null;
    const text = rawText.trim();

    // Check direct code match
    const directMatch = guests.find(
      (g) => g.invitationCode.toLowerCase() === text.toLowerCase()
    );
    if (directMatch) return directMatch;

    // Check if code was inside URL (e.g. ?code=xxx or /invite/xxx?code=yyy)
    try {
      const url = new URL(text.startsWith("http") ? text : `http://dummy.com/${text}`);
      const codeParam = url.searchParams.get("code");
      if (codeParam) {
        const urlMatch = guests.find(
          (g) => g.invitationCode.toLowerCase() === codeParam.toLowerCase()
        );
        if (urlMatch) return urlMatch;
      }
    } catch {
      // not a url
    }

    // Fallback: search by name substring
    const nameMatch = guests.find((g) =>
      g.name.toLowerCase().includes(text.toLowerCase())
    );
    return nameMatch || null;
  };

  const handleScanSuccess = (decodedText: string) => {
    setScannedCode(decodedText);
    const guest = findGuestByCode(decodedText);
    if (guest) {
      setSelectedGuest(guest);
      setScanError(null);
      // Play soft chime if supported
      try {
        const audio = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU");
        audio.play().catch(() => {});
      } catch {}
    } else {
      setSelectedGuest(null);
      setScanError(`រកមិនឃើញទិន្នន័យភ្ញៀវសម្រាប់កូដ: "${decodedText}"`);
    }
  };

  // Start or Stop html5-qrcode
  useEffect(() => {
    if (!isOpen) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
      setIsScanning(false);
      setSelectedGuest(null);
      setScannedCode("");
      setScanError(null);
      setCheckInSuccess(false);
      return;
    }

    let isMounted = true;

    async function initScanner() {
      try {
        const { Html5QrcodeScanner } = await import("html5-qrcode");
        if (!isMounted) return;

        // Clear existing instance if any
        if (scannerRef.current) {
          await scannerRef.current.clear().catch(() => {});
        }

        const scanner = new Html5QrcodeScanner(
          "qr-reader-container",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true,
          },
          /* verbose= */ false
        );

        scanner.render(
          (text) => {
            handleScanSuccess(text);
          },
          (err) => {
            // Ignore frame-level detection errors
          }
        );

        scannerRef.current = scanner;
        setIsScanning(true);
      } catch (err: any) {
        console.warn("Camera init failed:", err);
        setScanError("មិនអាចបើកកាមេរ៉ាបានទេ (សូមអនុញ្ញាត Camera Permission ឬវាយកូដដោយផ្ទាល់)");
      }
    }

    const timer = setTimeout(initScanner, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [isOpen]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    const guest = findGuestByCode(manualInput.trim());
    if (guest) {
      setSelectedGuest(guest);
      setScanError(null);
    } else {
      setSelectedGuest(null);
      setScanError(`រកមិនឃើញភ្ញៀវដែលមានកូដ ឬឈ្មោះ: "${manualInput}"`);
    }
  };

  const handleConfirmCheckIn = async () => {
    if (!selectedGuest) return;
    try {
      setIsUpdating(true);
      await onCheckInGuest(selectedGuest.id);
      setSelectedGuest({
        ...selectedGuest,
        rsvpStatus: "ATTENDING",
      });
      setCheckInSuccess(true);
      setTimeout(() => setCheckInSuccess(false), 3000);
    } catch (e: any) {
      alert("មានបញ្ហាក្នុងការកត់វត្តមាន: " + (e?.message || ""));
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-white border-b border-[#D4AF37]/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#AA7C11] flex items-center justify-center text-white shadow-xs">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#2C2A29] text-sm">
                Scan QR Code ឆែកវត្តមានរហ័ស
              </h3>
              <p className="text-[11px] text-stone-500">
                ពិនិត្យវត្តមាន & លេខតុភ្ញៀវនៅរោងការ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Camera Viewport */}
          <div className="rounded-2xl overflow-hidden border border-[#D4AF37]/30 bg-black relative min-h-[260px] flex items-center justify-center">
            <div id="qr-reader-container" className="w-full text-white" />
          </div>

          {/* Manual Input Fallback */}
          <form onSubmit={handleManualSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="ឬវាយលេខកូដ / ឈ្មោះភ្ញៀវស្វែងរក..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#D4AF37]/30 rounded-2xl text-xs text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 text-white rounded-2xl text-xs font-semibold hover:bg-black transition-colors"
            >
              ស្វែងរក
            </button>
          </form>

          {/* Error Notice */}
          {scanError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{scanError}</span>
            </div>
          )}

          {/* Guest Result Card */}
          {selectedGuest && (
            <div className="p-4 rounded-2xl bg-white border-2 border-[#D4AF37] shadow-luxury space-y-3 animate-in zoom-in-95 duration-150">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2C2A29] text-base">
                      {selectedGuest.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#D4AF37]/30 text-[#AA7C11]">
                      {selectedGuest.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-mono">
                    Code: {selectedGuest.invitationCode}
                  </span>
                </div>

                {/* Table Number Badge */}
                <div className="text-right">
                  <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37]/15 to-[#F3E5AB]/40 border border-[#D4AF37]/40 text-[#AA7C11]">
                    <span className="text-[10px] block font-medium">តុលេខ (Table)</span>
                    <span className="text-sm font-bold">
                      {selectedGuest.tableNumber ? `តុ ${selectedGuest.tableNumber}` : "មិនទាន់កំណត់"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and count */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100 text-stone-600">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-stone-400" />
                  <span>ចំនួនអញ្ជើញ: <b>{selectedGuest.maxGuests} នាក់</b></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span>វត្តមាន:</span>
                  {selectedGuest.rsvpStatus === "ATTENDING" ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> បានចូលរួម
                    </span>
                  ) : (
                    <span className="text-amber-700 font-semibold">រង់ចាំ / មិនទាន់</span>
                  )}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmCheckIn}
                  disabled={isUpdating || selectedGuest.rsvpStatus === "ATTENDING"}
                  className={`flex-1 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    selectedGuest.rsvpStatus === "ATTENDING"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default"
                      : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {selectedGuest.rsvpStatus === "ATTENDING"
                      ? "✓ បានកត់វត្តមានរួចហើយ"
                      : isUpdating
                      ? "កំពុងកត់..."
                      : "កត់វត្តមាន (Check-in)"}
                  </span>
                </button>

                <a
                  href={`/dashboard/gifts?guestId=${selectedGuest.id}&guestName=${encodeURIComponent(
                    selectedGuest.name
                  )}`}
                  target="_blank"
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:brightness-105 transition-all"
                >
                  <Gift className="w-4 h-4" />
                  <span>កត់ចំណងដៃ</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-stone-100 text-center">
          <p className="text-[11px] text-stone-500">
            ដាក់ QR Code ភ្ញៀវក្នុងប្រអប់កាមេរ៉ា ដើម្បីបង្ហាញព័ត៌មានដោយស្វ័យប្រវត្តិ
          </p>
        </div>
      </div>
    </div>
  );
}
