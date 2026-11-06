"use client";

import { useState, useMemo } from "react";
import {
  Gift,
  DollarSign,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Trash2,
  Pencil,
  Check,
  X,
  CreditCard,
  Banknote,
  Users,
  Heart,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";

export interface GiftItem {
  id: string;
  eventId: string;
  guestId?: string | null;
  guestName: string;
  side: string; // GROOM, BRIDE, BOTH
  currency: string; // USD, KHR
  amount: number;
  paymentMethod: string; // CASH, TRANSFER, OTHER
  notes?: string | null;
  recordedBy?: string | null;
  createdAt: string | Date;
  guest?: {
    id: string;
    name: string;
    category: string;
    tableNumber?: string | null;
  } | null;
}

interface GuestOption {
  id: string;
  name: string;
  category: string;
  tableNumber?: string | null;
}

interface GiftsClientProps {
  initialGifts: any[];
  guests: GuestOption[];
  eventId: string;
  eventSlug: string;
  groomName: string;
  brideName: string;
}

export default function GiftsClient({
  initialGifts,
  guests,
  eventId,
  eventSlug,
  groomName,
  brideName,
}: GiftsClientProps) {
  const [gifts, setGifts] = useState<GiftItem[]>(initialGifts);
  const [search, setSearch] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("ALL");
  const [sideFilter, setSideFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");

  // Add Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    guestId: "",
    guestName: "",
    side: "BOTH",
    currency: "USD",
    amount: "",
    paymentMethod: "CASH",
    notes: "",
  });

  // Edit Modal State
  const [editGift, setEditGift] = useState<GiftItem | null>(null);
  const [editFormData, setEditFormData] = useState({
    guestId: "",
    guestName: "",
    side: "BOTH",
    currency: "USD",
    amount: "",
    paymentMethod: "CASH",
    notes: "",
  });

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<GiftItem | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Quick Amount Presets
  const usdPresets = [20, 30, 50, 100, 200];
  const khrPresets = [50000, 100000, 200000, 400000, 500000];

  // Global Metrics
  const metrics = useMemo(() => {
    let totalUSD = 0;
    let totalKHR = 0;
    let groomUSD = 0;
    let groomKHR = 0;
    let brideUSD = 0;
    let brideKHR = 0;
    let cashUSD = 0;
    let cashKHR = 0;
    let transferUSD = 0;
    let transferKHR = 0;

    gifts.forEach((g) => {
      const amt = Number(g.amount) || 0;
      if (g.currency === "USD") {
        totalUSD += amt;
        if (g.side === "GROOM") groomUSD += amt;
        else if (g.side === "BRIDE") brideUSD += amt;

        if (g.paymentMethod === "TRANSFER") transferUSD += amt;
        else cashUSD += amt;
      } else {
        totalKHR += amt;
        if (g.side === "GROOM") groomKHR += amt;
        else if (g.side === "BRIDE") brideKHR += amt;

        if (g.paymentMethod === "TRANSFER") transferKHR += amt;
        else cashKHR += amt;
      }
    });

    return {
      count: gifts.length,
      totalUSD,
      totalKHR,
      groomUSD,
      groomKHR,
      brideUSD,
      brideKHR,
      cashUSD,
      cashKHR,
      transferUSD,
      transferKHR,
    };
  }, [gifts]);

  // Filtered Gifts
  const filteredGifts = useMemo(() => {
    return gifts.filter((g) => {
      const matchSearch =
        g.guestName.toLowerCase().includes(search.toLowerCase()) ||
        (g.notes && g.notes.toLowerCase().includes(search.toLowerCase()));

      if (!matchSearch) return false;
      if (currencyFilter !== "ALL" && g.currency !== currencyFilter) return false;
      if (sideFilter !== "ALL" && g.side !== sideFilter) return false;
      if (methodFilter !== "ALL" && g.paymentMethod !== methodFilter) return false;
      return true;
    });
  }, [gifts, search, currencyFilter, sideFilter, methodFilter]);

  // Handle Quick Add Submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const amt = parseFloat(formData.amount);
    if (isNaN(amt) || amt <= 0) {
      setError("សូមបញ្ចូលចំនួនទឹកប្រាក់ឲ្យបានត្រឹមត្រូវ (Please enter a valid amount)");
      return;
    }

    if (!formData.guestName.trim()) {
      setError("សូមបញ្ចូលឈ្មោះអ្នកចងដៃ (Guest name is required)");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          guestId: formData.guestId || null,
          guestName: formData.guestName,
          side: formData.side,
          currency: formData.currency,
          amount: amt,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add gift");

      setGifts([data.gift, ...gifts]);
      setIsAddOpen(false);
      setFormData({
        guestId: "",
        guestName: "",
        side: "BOTH",
        currency: "USD",
        amount: "",
        paymentMethod: "CASH",
        notes: "",
      });
      setSuccess(`✓ បានកត់ត្រាចំណងដៃ ${data.gift.guestName} (${data.gift.currency === "USD" ? `$${data.gift.amount}` : `${data.gift.amount.toLocaleString()} ៛`}) ដោយជោគជ័យ!`);
      setTimeout(() => setSuccess(null), 3500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (gift: GiftItem) => {
    setEditGift(gift);
    setEditFormData({
      guestId: gift.guestId || "",
      guestName: gift.guestName,
      side: gift.side,
      currency: gift.currency,
      amount: String(gift.amount),
      paymentMethod: gift.paymentMethod,
      notes: gift.notes || "",
    });
    setError(null);
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editGift) return;
    setError(null);

    const amt = parseFloat(editFormData.amount);
    if (isNaN(amt) || amt <= 0) {
      setError("សូមបញ្ចូលចំនួនទឹកប្រាក់ឲ្យបានត្រឹមត្រូវ");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/gifts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editGift.id,
          guestId: editFormData.guestId || null,
          guestName: editFormData.guestName,
          side: editFormData.side,
          currency: editFormData.currency,
          amount: amt,
          paymentMethod: editFormData.paymentMethod,
          notes: editFormData.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update gift");

      setGifts(gifts.map((g) => (g.id === editGift.id ? data.gift : g)));
      setEditGift(null);
      setSuccess(`✓ បានកែប្រែទិន្នន័យចំណងដៃ ${data.gift.guestName} ដោយជោគជ័យ!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/gifts?id=${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete gift");

      setGifts(gifts.filter((g) => g.id !== deleteTarget.id));
      setDeleteTarget(null);
      setSuccess("✓ បានលុបកំណត់ត្រាចំណងដៃដោយជោគជ័យ");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    window.open(`/api/gifts?eventId=${eventId}&export=csv`, "_blank");
  };

  // Trigger Native Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* ============================================================ */}
      {/* TOP HEADER                                                    */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/25 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs uppercase tracking-wider font-bold text-[#AA7C11] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#D4AF37]/30 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-[#AA7C11]" />
              Digital Wedding Gift Ledger
            </span>
            <span className="text-xs text-stone-400">({gifts.length} អ្នកចងដៃ)</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2A29]">
            សៀវភៅកត់ចំណងដៃ (Wedding Gifts &amp; Cash Tracker)
          </h1>
          <p className="text-xs sm:text-sm text-[#3E444A]/75 mt-1 font-khmer">
            កត់ត្រា និងបូកសរុបប្រាក់ចំណងដៃទាំងដុល្លារ ($) និងរៀល (៛) ដោយស្វ័យប្រវត្ត មិនបារម្ភរឿងច្រឡំ ឬបាត់សៀវភៅ។
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1.5 border border-stone-200 shadow-2xs hover:border-stone-300 transition-all cursor-pointer"
            title="ទាញយកជា Excel/CSV"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1.5 border border-stone-200 shadow-2xs hover:border-stone-300 transition-all cursor-pointer"
            title="បោះពុម្ពសៀវភៅចំណងដៃ"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span className="hidden sm:inline">បោះពុម្ព (Print)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setError(null);
              setIsAddOpen(true);
            }}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ កត់ចំណងដៃថ្មី (Record Gift)</span>
          </button>
        </div>
      </div>

      {/* Success / Error Alerts */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-200 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* SUMMARY STATS CARDS (REAL-TIME TOTALS)                       */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total USD */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-white p-5 rounded-3xl border border-amber-300/60 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-900 font-khmer">សរុបប្រាក់ដុល្លារ</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center font-bold text-sm">
              $
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-950">
            ${metrics.totalUSD.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 pt-2 border-t border-amber-200/50 flex items-center justify-between text-[11px] text-amber-800 font-khmer">
            <span>💵 សាច់ប្រាក់: ${metrics.cashUSD.toLocaleString()}</span>
            <span>📱 វេរ: ${metrics.transferUSD.toLocaleString()}</span>
          </div>
        </div>

        {/* Card 2: Total KHR */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-50 to-white p-5 rounded-3xl border border-emerald-300/60 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-900 font-khmer">សរុបប្រាក់រៀល</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-800 flex items-center justify-center font-bold text-sm">
              ៛
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-extrabold text-emerald-950">
            {metrics.totalKHR.toLocaleString("en-US")} <span className="text-base font-khmer">៛</span>
          </div>
          <div className="mt-2 pt-2 border-t border-emerald-200/50 flex items-center justify-between text-[11px] text-emerald-800 font-khmer">
            <span>💵 សាច់ប្រាក់: {metrics.cashKHR.toLocaleString()} ៛</span>
            <span>📱 វេរ: {metrics.transferKHR.toLocaleString()} ៛</span>
          </div>
        </div>

        {/* Card 3: Total Contributors */}
        <div className="bg-gradient-to-br from-blue-500/10 via-blue-50 to-white p-5 rounded-3xl border border-blue-300/60 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-900 font-khmer">ចំនួនអ្នកចងដៃសរុប</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-extrabold text-blue-950">
            {metrics.count} <span className="text-base font-khmer">នាក់</span>
          </div>
          <p className="text-[11px] text-blue-700/80 mt-2 pt-2 border-t border-blue-200/50 font-khmer">
            គណនីភ្ញៀវដែលបានកត់ត្រារួចរាល់
          </p>
        </div>

        {/* Card 4: Groom vs Bride Breakdown */}
        <div className="bg-gradient-to-br from-purple-500/10 via-purple-50 to-white p-5 rounded-3xl border border-purple-300/60 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-900 font-khmer">បែងចែកតាមភាគី</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-800 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1.5 text-xs text-purple-950">
            <div className="flex items-center justify-between font-khmer">
              <span className="font-semibold text-purple-900">🤵 ខាងកូនកំលោះ:</span>
              <span className="font-bold">${metrics.groomUSD.toLocaleString()} / {metrics.groomKHR.toLocaleString()} ៛</span>
            </div>
            <div className="flex items-center justify-between font-khmer">
              <span className="font-semibold text-pink-700">👰 ខាងកូនក្រមុំ:</span>
              <span className="font-bold">${metrics.brideUSD.toLocaleString()} / {metrics.brideKHR.toLocaleString()} ៛</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SEARCH & FILTERS BAR                                         */}
      {/* ============================================================ */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#D4AF37]/20 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ស្វែងរកតាមឈ្មោះអ្នកចង ឬកំណត់ចំណាំ (Search name, note)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all font-khmer"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Currency Filter */}
          <select
            value={currencyFilter}
            onChange={(e) => setCurrencyFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="ALL">រូបិយប័ណ្ណទាំងអស់</option>
            <option value="USD">ដុល្លារ ($ USD)</option>
            <option value="KHR">រៀល (៛ KHR)</option>
          </select>

          {/* Side Filter */}
          <select
            value={sideFilter}
            onChange={(e) => setSideFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="ALL">ភាគីទាំងអស់</option>
            <option value="GROOM">ខាងកូនកំលោះ (Groom)</option>
            <option value="BRIDE">ខាងកូនក្រមុំ (Bride)</option>
            <option value="BOTH">ទាំងសងខាង (Both)</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-stone-200 text-xs font-semibold text-stone-700 focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="ALL">វិធីទូទាត់ទាំងអស់</option>
            <option value="CASH">សាច់ប្រាក់ (Cash)</option>
            <option value="TRANSFER">វេរធនាគារ (Transfer)</option>
          </select>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TABLE OF GIFTS LEDGER                                        */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl border border-[#D4AF37]/25 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200/80 bg-[#FAF8F5] text-stone-600 text-xs font-semibold">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">ឈ្មោះអ្នកចងដៃ (Guest Name)</th>
                <th className="py-3.5 px-4">ភាគី (Side)</th>
                <th className="py-3.5 px-4">ចំនួនទឹកប្រាក់ (Amount)</th>
                <th className="py-3.5 px-4">វិធីទូទាត់ (Method)</th>
                <th className="py-3.5 px-4">កត់សម្គាល់ (Notes)</th>
                <th className="py-3.5 px-4">កាលបរិច្ឆេទ</th>
                <th className="py-3.5 px-4 text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-[#2C2A29]">
              {filteredGifts.map((gift, idx) => {
                const isUSD = gift.currency === "USD";
                return (
                  <tr key={gift.id} className="hover:bg-amber-50/30 transition-colors">
                    {/* Index */}
                    <td className="py-3.5 px-4 text-center text-stone-400 font-medium">
                      {idx + 1}
                    </td>

                    {/* Guest Name & Table Number */}
                    <td className="py-3.5 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm font-khmer">{gift.guestName}</span>
                        {gift.guest?.tableNumber && (
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-[10px] text-stone-600 font-bold border border-stone-200">
                            តុ #{gift.guest.tableNumber}
                          </span>
                        )}
                        {gift.guest?.category && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-50 text-amber-700 border border-amber-200">
                            {gift.guest.category}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Side */}
                    <td className="py-3.5 px-4">
                      {gift.side === "GROOM" && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200 font-khmer">
                          🤵 កូនកំលោះ
                        </span>
                      )}
                      {gift.side === "BRIDE" && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-pink-100 text-pink-800 border border-pink-200 font-khmer">
                          👰 កូនក្រមុំ
                        </span>
                      )}
                      {gift.side === "BOTH" && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 font-khmer">
                          💛 ទាំងសងខាង
                        </span>
                      )}
                    </td>

                    {/* Amount & Currency */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-xl font-bold font-serif text-sm ${
                          isUSD
                            ? "bg-amber-100/80 text-amber-950 border border-amber-300"
                            : "bg-emerald-100/80 text-emerald-950 border border-emerald-300"
                        }`}
                      >
                        {isUSD ? `$${gift.amount.toLocaleString()}` : `${gift.amount.toLocaleString()} ៛`}
                      </span>
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4">
                      {gift.paymentMethod === "TRANSFER" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 font-khmer">
                          <CreditCard className="w-3 h-3" />
                          <span>វេរធនាគារ (Transfer)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-stone-100 text-stone-700 border border-stone-200 font-khmer">
                          <Banknote className="w-3 h-3 text-emerald-600" />
                          <span>សាច់ប្រាក់ (Cash)</span>
                        </span>
                      )}
                    </td>

                    {/* Notes */}
                    <td className="py-3.5 px-4 text-stone-500 font-khmer text-[11px]">
                      {gift.notes || <span className="text-stone-300">-</span>}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                      {new Date(gift.createdAt).toLocaleDateString("km-KH", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(gift)}
                          className="px-2.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1 transition-all shadow-2xs active:scale-95 cursor-pointer"
                          title="កែប្រែចំណងដៃ"
                        >
                          <Pencil className="w-3.5 h-3.5 text-amber-700" />
                          <span>កែប្រែ</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(gift)}
                          className="px-2.5 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-1 transition-all shadow-2xs active:scale-95 cursor-pointer"
                          title="លុបចំណងដៃ"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                          <span>លុប</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredGifts.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400 font-khmer">
                    មិនទាន់មានទិន្នន័យចំណងដៃនៅឡើយទេ។ ចុចលើប៊ូតុង <strong className="text-amber-800">+ កត់ចំណងដៃថ្មី</strong> ដើម្បីចាប់ផ្តើម។
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: QUICK ADD GIFT                                      */}
      {/* ============================================================ */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D4AF37]/40 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#AA7C11]">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2C2A29]">
                    កត់ចំណងដៃថ្មី (Record Wedding Gift)
                  </h3>
                  <p className="text-[11px] text-[#3E444A]/70 font-khmer">
                    បញ្ចូលឈ្មោះភ្ញៀវ ចំនួនទឹកប្រាក់ និងវិធីទូទាត់
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 pt-4">
              {/* Select Existing Guest OR Type Name */}
              <div>
                <label className="block text-xs font-bold text-[#2C2A29] mb-1.5 font-khmer">
                  ឈ្មោះអ្នកចងដៃ (Guest Name) <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {/* Select from existing guests */}
                  <select
                    value={formData.guestId}
                    onChange={(e) => {
                      const selId = e.target.value;
                      if (!selId) {
                        setFormData({ ...formData, guestId: "" });
                      } else {
                        const matched = guests.find((g) => g.id === selId);
                        if (matched) {
                          setFormData({
                            ...formData,
                            guestId: matched.id,
                            guestName: matched.name,
                            notes: matched.tableNumber ? `តុលេខ #${matched.tableNumber}` : formData.notes,
                          });
                        }
                      }
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#D4AF37] bg-[#FAF8F5] font-khmer"
                  >
                    <option value="">-- រើសពីបញ្ជីភ្ញៀវដែលមានស្រាប់ (Optional) --</option>
                    {guests.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.category}){g.tableNumber ? ` - តុ #${g.tableNumber}` : ""}
                      </option>
                    ))}
                  </select>

                  {/* Or Manual Custom Name Input */}
                  <input
                    type="text"
                    required
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    placeholder="វាយបញ្ចូលឈ្មោះអ្នកចងដៃនៅទីនេះ..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#D4AF37] font-khmer"
                  />
                </div>
              </div>

              {/* Side (កូនកំលោះ / កូនក្រមុំ / ទាំងសងខាង) */}
              <div>
                <label className="block text-xs font-bold text-[#2C2A29] mb-1.5 font-khmer">
                  ភ្ញៀវខាងណា (Side)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "GROOM", label: "🤵 ខាងកូនកំលោះ", col: "border-purple-300 bg-purple-50 text-purple-900" },
                    { id: "BRIDE", label: "👰 ខាងកូនក្រមុំ", col: "border-pink-300 bg-pink-50 text-pink-900" },
                    { id: "BOTH", label: "💛 ទាំងសងខាង", col: "border-amber-300 bg-amber-50 text-amber-900" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, side: s.id })}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        formData.side === s.id
                          ? `${s.col} ring-2 ring-amber-400/30 font-bold shadow-2xs`
                          : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Currency Toggle & Amount Input */}
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#2C2A29] font-khmer">
                    ចំនួនទឹកប្រាក់ &amp; រូបិយប័ណ្ណ <span className="text-red-500">*</span>
                  </label>
                  {/* Currency Switcher */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, currency: "USD" })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        formData.currency === "USD"
                          ? "bg-amber-500 text-white shadow-2xs"
                          : "text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      $ USD
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, currency: "KHR" })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        formData.currency === "KHR"
                          ? "bg-emerald-600 text-white shadow-2xs"
                          : "text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      ៛ KHR
                    </button>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-stone-400 font-khmer">រើសរហ័ស:</span>
                  {(formData.currency === "USD" ? usdPresets : khrPresets).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setFormData({ ...formData, amount: String(val) })}
                      className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 text-xs font-bold hover:bg-amber-50 hover:border-amber-300 transition-all cursor-pointer shadow-2xs"
                    >
                      {formData.currency === "USD" ? `$${val}` : `${(val / 1000).toLocaleString()}k ៛`}
                    </button>
                  ))}
                </div>

                {/* Amount Input */}
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-400 text-sm">
                    {formData.currency === "USD" ? "$" : "៛"}
                  </span>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder={formData.currency === "USD" ? "ឧ. 50" : "ឧ. 200000"}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Payment Method (Cash vs Transfer) */}
              <div>
                <label className="block text-xs font-bold text-[#2C2A29] mb-1.5 font-khmer">
                  វិធីទូទាត់ (Payment Method)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: "CASH" })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      formData.paymentMethod === "CASH"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-400/20 shadow-2xs"
                        : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>សាច់ប្រាក់ (Cash)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: "TRANSFER" })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      formData.paymentMethod === "TRANSFER"
                        ? "border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-400/20 shadow-2xs"
                        : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>វេរធនាគារ (ABA/Bakong)</span>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-[#2C2A29] mb-1.5 font-khmer">
                  កត់សម្គាល់បន្ថែម (Notes - Optional)
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="ឧ. បងប្អូនជីដូនមួយ, មិត្តវិទ្យាល័យ, តុលេខ ០៥..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#D4AF37] font-khmer"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold rounded-xl text-stone-600 hover:bg-stone-100 transition-all cursor-pointer"
                >
                  បោះបង់ (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {loading ? (
                    <span>កំពុងកត់ត្រា...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>រក្សាទុកចំណងដៃ (Save Gift)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: EDIT GIFT                                           */}
      {/* ============================================================ */}
      {editGift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-300/60 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2C2A29]">
                    កែប្រែចំណងដៃ (Edit Gift Record)
                  </h3>
                  <p className="text-[11px] text-[#3E444A]/70 font-khmer">
                    កែសម្រួលឈ្មោះ ចំនួនទឹកប្រាក់ ឬវិធីទូទាត់
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditGift(null)}
                className="text-stone-400 hover:text-stone-600 p-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
              {/* Guest Name */}
              <div>
                <label className="block text-xs font-bold text-[#2C2A29] mb-1.5 font-khmer">
                  ឈ្មោះអ្នកចងដៃ (Guest Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.guestName}
                  onChange={(e) => setEditFormData({ ...editFormData, guestName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#D4AF37] font-khmer"
                />
              </div>

              {/* Side */}
              <div>
                <label className="block text-xs font-bold text-[#2C2A29] mb-1.5 font-khmer">
                  ភាគី (Side)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "GROOM", label: "🤵 កូនកំលោះ", col: "border-purple-300 bg-purple-50 text-purple-900" },
                    { id: "BRIDE", label: "👰 កូនក្រមុំ", col: "border-pink-300 bg-pink-50 text-pink-900" },
                    { id: "BOTH", label: "💛 ទាំងសងខាង", col: "border-amber-300 bg-amber-50 text-amber-900" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setEditFormData({ ...editFormData, side: s.id })}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                        editFormData.side === s.id
                          ? `${s.col} ring-2 ring-amber-400/30 shadow-2xs`
                          : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Currency & Amount */}
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#2C2A29] font-khmer">
                    ចំនួនទឹកប្រាក់ <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setEditFormData({ ...editFormData, currency: "USD" })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        editFormData.currency === "USD"
                          ? "bg-amber-500 text-white"
                          : "text-stone-500"
                      }`}
                    >
                      $ USD
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditFormData({ ...editFormData, currency: "KHR" })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        editFormData.currency === "KHR"
                          ? "bg-emerald-600 text-white"
                          : "text-stone-500"
                      }`}
                    >
                      ៛ KHR
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-400 text-sm">
                    {editFormData.currency === "USD" ? "$" : "៛"}
                  </span>
                  <input
                    type="number"
                    step="any"
                    required
                    value={editFormData.amount}
                    onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm font-bold focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-[#2C2A29] mb-1.5 font-khmer">
                  វិធីទូទាត់
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditFormData({ ...editFormData, paymentMethod: "CASH" })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      editFormData.paymentMethod === "CASH"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                        : "border-stone-200 bg-white text-stone-600"
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>សាច់ប្រាក់ (Cash)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditFormData({ ...editFormData, paymentMethod: "TRANSFER" })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      editFormData.paymentMethod === "TRANSFER"
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-stone-200 bg-white text-stone-600"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>វេរធនាគារ (Transfer)</span>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-[#2C2A29] mb-1.5 font-khmer">
                  កំណត់ចំណាំ
                </label>
                <input
                  type="text"
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#D4AF37] font-khmer"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditGift(null)}
                  className="px-4 py-2.5 text-xs font-semibold rounded-xl text-stone-600 hover:bg-stone-100 transition-all cursor-pointer"
                >
                  បោះបង់ (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {loading ? (
                    <span>កំពុងរក្សាទុក...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>រក្សាទុកការកែប្រែ</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: DELETE CONFIRMATION                                 */}
      {/* ============================================================ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-red-200 shadow-2xl max-w-md w-full overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif font-bold text-lg text-[#2C2A29]">
                តើអ្នកពិតជាចង់លុបចំណងដៃនេះមែនទេ?
              </h3>
              <p className="text-xs text-stone-500 font-khmer">
                តើអ្នកប្រាកដថាចង់លុបកំណត់ត្រាចំណងដៃរបស់ <strong className="text-stone-800">{deleteTarget.guestName}</strong> ចំនួន{" "}
                <strong className="text-stone-800">
                  {deleteTarget.currency === "USD" ? `$${deleteTarget.amount}` : `${deleteTarget.amount.toLocaleString()} ៛`}
                </strong>{" "}
                ដែរឬទេ?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-stone-600 hover:bg-stone-100 transition-all cursor-pointer"
              >
                បោះបង់ (Cancel)
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-red-600 text-white shadow hover:bg-red-700 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? "កំពុងលុប..." : "យល់ព្រមលុប (Delete)"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PRINT-ONLY VIEW (A4 ELEGANT WEDDING LEDGER)                  */}
      {/* ============================================================ */}
      <div className="hidden print:block p-8 bg-white text-black font-serif">
        <div className="text-center border-b-2 border-amber-600 pb-4 mb-6">
          <h2 className="text-2xl font-bold font-khmer">សៀវភៅកត់ចំណងដៃអាពាហ៍ពិពាហ៍</h2>
          <p className="text-lg mt-1 font-khmer">{groomName} &amp; {brideName}</p>
          <div className="flex justify-center gap-6 text-sm mt-3 font-khmer font-sans">
            <span>សរុបប្រាក់ដុល្លារ៖ <strong>${metrics.totalUSD.toLocaleString()}</strong></span>
            <span>|</span>
            <span>សរុបប្រាក់រៀល៖ <strong>{metrics.totalKHR.toLocaleString()} ៛</strong></span>
            <span>|</span>
            <span>អ្នកចងដៃសរុប៖ <strong>{metrics.count} នាក់</strong></span>
          </div>
        </div>

        <table className="w-full text-left text-xs border border-stone-300">
          <thead>
            <tr className="bg-stone-100 border-b border-stone-300 font-khmer font-bold">
              <th className="p-2 border-r border-stone-300 w-10 text-center">#</th>
              <th className="p-2 border-r border-stone-300">ឈ្មោះអ្នកចងដៃ</th>
              <th className="p-2 border-r border-stone-300">ភាគី</th>
              <th className="p-2 border-r border-stone-300">ចំនួនទឹកប្រាក់</th>
              <th className="p-2 border-r border-stone-300">វិធីទូទាត់</th>
              <th className="p-2">កត់សម្គាល់</th>
            </tr>
          </thead>
          <tbody>
            {gifts.map((g, i) => (
              <tr key={g.id} className="border-b border-stone-200">
                <td className="p-2 border-r border-stone-200 text-center">{i + 1}</td>
                <td className="p-2 border-r border-stone-200 font-khmer font-semibold">{g.guestName}</td>
                <td className="p-2 border-r border-stone-200 font-khmer">
                  {g.side === "GROOM" ? "ខាងកូនកំលោះ" : g.side === "BRIDE" ? "ខាងកូនក្រមុំ" : "ទាំងសងខាង"}
                </td>
                <td className="p-2 border-r border-stone-200 font-bold">
                  {g.currency === "USD" ? `$${g.amount}` : `${g.amount.toLocaleString()} ៛`}
                </td>
                <td className="p-2 border-r border-stone-200 font-khmer">
                  {g.paymentMethod === "TRANSFER" ? "វេរធនាគារ" : "សាច់ប្រាក់"}
                </td>
                <td className="p-2 font-khmer">{g.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
