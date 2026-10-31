"use client";

import { useState } from "react";
import QRCode from "qrcode";
import {
  Users,
  UserPlus,
  Download,
  UploadCloud,
  Search,
  MessageCircle,
  Copy,
  Check,
  QrCode,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  Sparkles,
  FileText,
  ExternalLink,
  Share2,
  Send,
  Calendar,
  MapPin,
  Heart,
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
  dietaryRestrictions?: string | null;
  notes?: string | null;
  viewsCount: number;
  isOpened: boolean;
}

interface GuestsClientProps {
  initialGuests: Guest[];
  eventId: string;
  eventSlug: string;
  groomName: string;
  brideName: string;
  eventDate?: string;
  venueName?: string;
  coverImageUrl?: string | null;
  baseUrl: string;
}

export default function GuestsClient({
  initialGuests,
  eventId,
  eventSlug,
  groomName,
  brideName,
  eventDate,
  venueName,
  coverImageUrl,
  baseUrl,
}: GuestsClientProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeQrModal, setActiveQrModal] = useState<{ name: string; url: string; qr: string } | null>(null);
  const [activeShareGuest, setActiveShareGuest] = useState<Guest | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [linkOnlyCopied, setLinkOnlyCopied] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New guest form state
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    category: "Friend",
    tableNumber: "",
    maxGuests: 2,
    customCode: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Edit guest form state
  const [editFormData, setEditFormData] = useState<{
    id: string;
    name: string;
    phoneNumber: string;
    email: string;
    category: string;
    tableNumber: string;
    maxGuests: number;
    rsvpStatus: string;
    attendeesCount: number;
    notes: string;
  } | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // CSV Import state
  const [csvText, setCsvText] = useState("");
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvError, setCsvError] = useState("");

  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.invitationCode.toLowerCase().includes(search.toLowerCase()) ||
      (g.email && g.email.toLowerCase().includes(search.toLowerCase())) ||
      (g.phoneNumber && g.phoneNumber.includes(search));

    const matchesStatus = statusFilter === "ALL" || g.rsvpStatus === statusFilter;
    const matchesCategory = categoryFilter === "ALL" || g.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getEffectiveBaseUrl = () => {
    if (typeof window !== "undefined" && window.location.origin) {
      return window.location.origin;
    }
    return baseUrl || "";
  };

  const getGuestInvitationUrl = (guest: Guest) => {
    const origin = getEffectiveBaseUrl();
    const toParam = guest.name ? `&to=${encodeURIComponent(guest.name)}` : "";
    return `${origin}/invite/${eventSlug}?code=${encodeURIComponent(guest.invitationCode)}${toParam}`;
  };

  const getGuestInvitationMessage = (guest: Guest) => {
    const link = getGuestInvitationUrl(guest);
    let dateStr = "";
    if (eventDate) {
      try {
        const d = new Date(eventDate);
        dateStr = d.toLocaleDateString("km-KH", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch (e) {}
    }

    return `💌 លិខិតគោរពអញ្ជើញអាពាហ៍ពិពាហ៍ឌីជីថល (Digital Wedding Invitation)

សូមគោរពអញ្ជើញ៖ ${guest.name}
ចូលរួមពិធីសិរីសួស្តីអាពាហ៍ពិពាហ៍រវាង៖
🤵 ${groomName}  &  👰 ${brideName}

${dateStr ? `📅 កាលបរិច្ឆេទ៖ ${dateStr}\n` : ""}${venueName ? `📍 ទីតាំង៖ ${venueName}\n` : ""}
✨ សូមចុចតំណភ្ជាប់ខាងក្រោម ដើម្បីបើកមើលធៀបការ 3D និងឆ្លើយតបការចូលរួម (RSVP)៖
👉 ${link}

សូមអរគុណយ៉ាងជ្រាលជ្រៅ!`;
  };

  const handleCopyLink = (code: string, id: string, name?: string) => {
    const origin = getEffectiveBaseUrl();
    const toParam = name ? `&to=${encodeURIComponent(name)}` : "";
    const link = `${origin}/invite/${eventSlug}?code=${encodeURIComponent(code)}${toParam}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShowQr = async (guest: Guest) => {
    const link = getGuestInvitationUrl(guest);
    const qr = await QRCode.toDataURL(link, { width: 300, margin: 2 });
    setActiveQrModal({ name: guest.name, url: link, qr });
  };

  const handleShareTelegram = (guest: Guest) => {
    const link = getGuestInvitationUrl(guest);
    const text = getGuestInvitationMessage(guest);
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
    window.open(tgUrl, "_blank");
  };

  const handleShareWhatsApp = (guest: Guest) => {
    const text = getGuestInvitationMessage(guest);
    const phone = guest.phoneNumber ? guest.phoneNumber.replace(/[^0-9]/g, "") : "";
    const waUrl = phone
      ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  const handleShareMessenger = (guest: Guest) => {
    const link = getGuestInvitationUrl(guest);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, "_blank");
  };

  const handleCopyFullMessage = (guest: Guest) => {
    const text = getGuestInvitationMessage(guest);
    navigator.clipboard.writeText(text);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleCopyCleanLink = (guest: Guest) => {
    const link = getGuestInvitationUrl(guest);
    navigator.clipboard.writeText(link);
    setLinkOnlyCopied(true);
    setTimeout(() => setLinkOnlyCopied(false), 2000);
  };

  const handleCreateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setFormLoading(true);
    setFormError("");

    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add guest");
      }

      setGuests([data.guest, ...guests]);
      setIsAddModalOpen(false);
      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        category: "Friend",
        tableNumber: "",
        maxGuests: 2,
        customCode: "",
      });
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenEdit = (guest: Guest) => {
    setEditFormData({
      id: guest.id,
      name: guest.name,
      phoneNumber: guest.phoneNumber || "",
      email: guest.email || "",
      category: guest.category || "Friend",
      tableNumber: guest.tableNumber || "",
      maxGuests: guest.maxGuests || 2,
      rsvpStatus: guest.rsvpStatus || "PENDING",
      attendeesCount: guest.attendeesCount || 1,
      notes: guest.notes || "",
    });
    setEditError("");
    setIsEditModalOpen(true);
  };

  const handleUpdateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData || !editFormData.name.trim()) return;
    setEditLoading(true);
    setEditError("");

    try {
      const res = await fetch("/api/guests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editFormData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update guest");
      }

      setGuests(guests.map((g) => (g.id === data.guest.id ? { ...g, ...data.guest } : g)));
      setIsEditModalOpen(false);
      setEditFormData(null);
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteGuest = async (id: string) => {
    if (!confirm("Are you sure you want to remove this guest?")) return;

    try {
      const res = await fetch(`/api/guests?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setGuests(guests.filter((g) => g.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleImportCsv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;
    setCsvLoading(true);
    setCsvError("");

    try {
      const lines = csvText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      const addedList: Guest[] = [];

      for (const line of lines) {
        // Support format: Name, Phone, Category, Table, MaxGuests
        const parts = line.split(",").map((p) => p.trim());
        const name = parts[0];
        if (!name || name.toLowerCase() === "name") continue; // skip header

        const phoneNumber = parts[1] || "";
        const category = parts[2] || "Friend";
        const tableNumber = parts[3] || "";
        const maxGuests = parseInt(parts[4], 10) || 2;

        const res = await fetch("/api/guests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId,
            name,
            phoneNumber,
            category,
            tableNumber,
            maxGuests,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.guest) addedList.push(data.guest);
        }
      }

      setGuests([...addedList, ...guests]);
      setCsvText("");
      setIsUploadModalOpen(false);
    } catch (err: any) {
      setCsvError(err.message || "Failed to import CSV");
    } finally {
      setCsvLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) setCsvText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2C2A29]">
            Guest &amp; RSVP Management
          </h1>
          <p className="text-xs text-[#3E444A]/70 mt-1">
            Add, update, upload CSV, and delete invitations with instant 3D envelope previews.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`/api/guests?eventId=${eventId}&export=csv`}
            className="px-4 py-2.5 rounded-2xl bg-white border border-[#D4AF37]/30 text-xs font-semibold text-[#2C2A29] flex items-center gap-2 hover:bg-[#FAF8F5] transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-[#AA7C11]" />
            <span>Export CSV</span>
          </a>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white border border-[#D4AF37]/30 text-xs font-semibold text-[#2C2A29] flex items-center gap-2 hover:bg-[#FAF8F5] transition-all shadow-sm"
          >
            <UploadCloud className="w-4 h-4 text-[#AA7C11]" />
            <span>Upload CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs font-semibold flex items-center gap-2 shadow-luxury hover:brightness-105 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Guest</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-3xl bg-white border border-[#D4AF37]/20 shadow-card flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, code, phone..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-2xl text-xs text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-2xl text-xs text-[#2C2A29] focus:outline-none"
          >
            <option value="ALL">All RSVPs</option>
            <option value="ATTENDING">Attending</option>
            <option value="PENDING">Pending</option>
            <option value="DECLINED">Declined</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-2xl text-xs text-[#2C2A29] focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="VIP">VIP</option>
            <option value="Family">Family</option>
            <option value="Friend">Friend</option>
            <option value="Colleague">Colleague</option>
          </select>
        </div>
      </div>

      {/* Guests Table */}
      <div className="bg-white rounded-3xl border border-[#D4AF37]/20 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-stone-100 text-[#3E444A]/70 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Guest Name</th>
                <th className="py-3.5 px-4 font-semibold">Category &amp; Table</th>
                <th className="py-3.5 px-4 font-semibold">RSVP Status</th>
                <th className="py-3.5 px-4 font-semibold">Confirmed / Max</th>
                <th className="py-3.5 px-4 font-semibold">Dietary &amp; Notes</th>
                <th className="py-3.5 px-4 font-semibold text-center">Share Actions</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredGuests.map((g) => (
                <tr key={g.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                  <td className="py-3 px-4">
                    <a
                      href={`/invite/${eventSlug}?code=${encodeURIComponent(g.invitationCode)}&to=${encodeURIComponent(g.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#2C2A29] hover:text-[#AA7C11] hover:underline inline-flex items-center gap-1.5 text-sm group"
                      title="Click to view personalized invitation"
                    >
                      <span>{g.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#AA7C11]" />
                    </a>
                    <span className="text-[11px] text-stone-500 font-mono block">
                      Code: {g.invitationCode}
                    </span>
                    {g.phoneNumber && (
                      <span className="block text-[11px] text-stone-400">{g.phoneNumber}</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#D4AF37]/30 text-[#AA7C11] font-semibold text-[10px] block w-fit mb-1">
                      {g.category}
                    </span>
                    <span className="text-stone-500 text-[11px]">
                      {g.tableNumber || "No table"}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    {g.rsvpStatus === "ATTENDING" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Attending
                      </span>
                    )}
                    {g.rsvpStatus === "DECLINED" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 font-semibold text-[11px]">
                        <XCircle className="w-3.5 h-3.5" /> Declined
                      </span>
                    )}
                    {g.rsvpStatus === "PENDING" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold text-[11px]">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-stone-700 font-medium">
                    <span className="text-sm font-bold text-[#2C2A29]">{g.attendeesCount}</span>
                    <span className="text-stone-400 text-xs"> / {g.maxGuests} seats</span>
                  </td>

                  <td className="py-3 px-4 text-stone-600 max-w-[200px] truncate">
                    {g.dietaryRestrictions ? (
                      <span className="block text-stone-800 font-medium truncate">
                        🥗 {g.dietaryRestrictions}
                      </span>
                    ) : null}
                    {g.notes ? (
                      <span className="block text-stone-400 text-[11px] italic truncate">
                        "{g.notes}"
                      </span>
                    ) : (
                      !g.dietaryRestrictions && <span className="text-stone-400">-</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Luxury Share Modal Button */}
                      <button
                        onClick={() => setActiveShareGuest(g)}
                        title="ផ្ញើធៀបការ និងចែករំលែក (Send & Share Digital Invitation)"
                        className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:brightness-105 active:scale-95 transition-all"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>ផ្ញើធៀប</span>
                      </button>

                      {/* Telegram Quick Share */}
                      <button
                        onClick={() => handleShareTelegram(g)}
                        title="ផ្ញើតាម Telegram"
                        className="p-1.5 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>

                      {/* WhatsApp Button */}
                      <button
                        onClick={() => handleShareWhatsApp(g)}
                        title="Share on WhatsApp"
                        className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>

                      {/* Copy Link Button */}
                      <button
                        onClick={() => handleCopyLink(g.invitationCode, g.id, g.name)}
                        title="Copy Invitation Link"
                        className="p-1.5 rounded-xl bg-[#FAF8F5] text-[#AA7C11] hover:bg-[#F3E5AB]/40 transition-colors"
                      >
                        {copiedId === g.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      {/* QR Code Button */}
                      <button
                        onClick={() => handleShowQr(g)}
                        title="View Guest QR Code Pass"
                        className="p-1.5 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(g)}
                        title="Edit Guest Details (UPDATE)"
                        className="p-1.5 rounded-xl text-stone-400 hover:text-[#AA7C11] hover:bg-[#F3E5AB]/30 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGuest(g.id)}
                        title="Delete Guest (DELETE)"
                        className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredGuests.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    No guests matched your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Guest Modal (ADD) */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="relative max-w-md w-full bg-[#FAF8F5] rounded-3xl p-6 border border-[#D4AF37]/40 shadow-luxury-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-[#2C2A29] mb-1">
              Add New Wedding Guest
            </h3>
            <p className="text-xs text-[#3E444A]/70 mb-4">
              Create a personalized token and customized invitation pass.
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateGuest} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., ឯកឧត្តម និង លោកជំទាវ"
                  className="w-full px-4 py-2.5 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="012 345 678"
                    className="w-full px-4 py-2.5 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="guest@mail.com"
                    className="w-full px-4 py-2.5 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29] focus:outline-none"
                  >
                    <option value="VIP">VIP</option>
                    <option value="Family">Family</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-1">
                    Table No.
                  </label>
                  <input
                    type="text"
                    value={formData.tableNumber}
                    onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                    placeholder="Table 05"
                    className="w-full px-3 py-2.5 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-1">
                    Max Pax
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.maxGuests}
                    onChange={(e) => setFormData({ ...formData, maxGuests: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-1">
                  Custom Invitation Code (Optional)
                </label>
                <input
                  type="text"
                  value={formData.customCode}
                  onChange={(e) => setFormData({ ...formData, customCode: e.target.value })}
                  placeholder="e.g. vip-guest-01"
                  className="w-full px-4 py-2.5 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs font-semibold shadow-luxury hover:brightness-105 transition-all mt-4"
              >
                {formLoading ? "Creating..." : "Save Guest & Generate Pass"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Guest Modal (UPDATE) */}
      {isEditModalOpen && editFormData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="relative max-w-md w-full bg-[#FAF8F5] rounded-3xl p-6 border border-[#D4AF37]/40 shadow-luxury-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-[#2C2A29] mb-1">
              Update Guest Information
            </h3>
            <p className="text-xs text-[#3E444A]/70 mb-4">
              Modify guest name, seating arrangement, and RSVP attendance status.
            </p>

            {editError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdateGuest} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editFormData.phoneNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-1">
                    Category
                  </label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29] focus:outline-none"
                  >
                    <option value="VIP">VIP</option>
                    <option value="Family">Family</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-1">
                    Table No.
                  </label>
                  <input
                    type="text"
                    value={editFormData.tableNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, tableNumber: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-1">
                    Max Pax
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={editFormData.maxGuests}
                    onChange={(e) => setEditFormData({ ...editFormData, maxGuests: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-1">
                    RSVP Status
                  </label>
                  <select
                    value={editFormData.rsvpStatus}
                    onChange={(e) => setEditFormData({ ...editFormData, rsvpStatus: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29] focus:outline-none"
                  >
                    <option value="ATTENDING">Attending</option>
                    <option value="PENDING">Pending</option>
                    <option value="DECLINED">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-1">
                    Confirmed Guests
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={editFormData.attendeesCount}
                    onChange={(e) => setEditFormData({ ...editFormData, attendeesCount: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  placeholder="Special dietary or notes..."
                  className="w-full px-4 py-2.5 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={editLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs font-semibold shadow-luxury hover:brightness-105 transition-all mt-4"
              >
                {editLoading ? "Updating..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Upload CSV Modal (UPLOAD) */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div
            className="relative max-w-lg w-full bg-[#FAF8F5] rounded-3xl p-6 border border-[#D4AF37]/40 shadow-luxury-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <UploadCloud className="w-5 h-5 text-[#AA7C11]" />
              <h3 className="font-serif text-xl font-bold text-[#2C2A29]">
                Upload / Import Guest List
              </h3>
            </div>
            <p className="text-xs text-[#3E444A]/70 mb-4">
              Upload a <code>.csv</code> file or paste guest rows in format: <br />
              <code className="text-[#AA7C11] bg-white px-1.5 py-0.5 rounded border border-[#D4AF37]/30">
                Name, Phone, Category, Table, MaxPax
              </code>
            </p>

            {csvError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {csvError}
              </div>
            )}

            <form onSubmit={handleImportCsv} className="space-y-4">
              <div className="border-2 border-dashed border-[#D4AF37]/40 rounded-2xl p-4 text-center bg-white/70 hover:bg-[#FFFDF9] transition-colors relative">
                <input
                  type="file"
                  accept=".csv,text/plain"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <FileText className="w-8 h-8 text-[#AA7C11] mx-auto mb-1" />
                <span className="text-xs font-semibold text-[#2C2A29] block">
                  Click to select CSV file from your computer
                </span>
                <span className="text-[10px] text-stone-400">or paste text below</span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A] mb-1">
                  Or Paste Guest Rows
                </label>
                <textarea
                  rows={5}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder={`ឯកឧត្តម និង លោកជំទាវ, 012345678, VIP, Table 1, 2\nលោក ហេង សុខា, 098765432, Friend, Table 3, 2`}
                  className="w-full p-3 bg-white border border-[#D4AF37]/30 rounded-xl text-xs font-mono text-[#2C2A29] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={csvLoading || !csvText.trim()}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs font-semibold shadow-luxury hover:brightness-105 transition-all disabled:opacity-50"
              >
                {csvLoading ? "Importing Guests..." : "Import Guests Now"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Pass Preview Modal */}
      {activeQrModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setActiveQrModal(null)}
        >
          <div
            className="relative max-w-sm w-full bg-[#FAF8F5] rounded-3xl p-6 text-center border border-[#D4AF37]/40 shadow-luxury-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveQrModal(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[11px] uppercase tracking-wider text-[#AA7C11] font-semibold block mb-1">
              VIP Digital Pass
            </span>
            <h3 className="font-serif text-xl font-bold text-[#2C2A29] mb-4">
              {activeQrModal.name}
            </h3>

            <div className="bg-white p-4 rounded-2xl border border-[#D4AF37]/30 shadow-sm inline-block mb-4">
              <img src={activeQrModal.qr} alt="Guest QR Pass" className="w-48 h-48 rounded-xl" />
            </div>

            <p className="text-[11px] text-stone-500 mb-4 truncate px-2 font-mono">
              {activeQrModal.url}
            </p>

            <button
              onClick={() => {
                navigator.clipboard.writeText(activeQrModal.url);
                alert("Copied invite link to clipboard!");
              }}
              className="w-full py-2.5 rounded-xl bg-[#D4AF37] text-white text-xs font-semibold shadow-sm hover:brightness-105"
            >
              Copy Link
            </button>
          </div>
        </div>
      )}

      {/* Luxury Guest Invitation Share Modal */}
      {activeShareGuest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
          onClick={() => {
            setActiveShareGuest(null);
            setShareCopied(false);
            setLinkOnlyCopied(false);
          }}
        >
          <div
            className="relative max-w-lg w-full bg-[#FAF8F5] rounded-3xl p-6 sm:p-7 border border-[#D4AF37]/50 shadow-luxury-lg max-h-[92vh] overflow-y-auto space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setActiveShareGuest(null);
                setShareCopied(false);
                setLinkOnlyCopied(false);
              }}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#AA7C11] font-bold block">
                ⚜️ Digital Royal Invitation
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2C2A29]">
                ផ្ញើធៀបការឌីជីថល (Send Invitation)
              </h3>
              <p className="text-xs text-stone-500">
                ចែករំលែកធៀបការផ្ទាល់ខ្លួនប្រណីតទៅកាន់ភ្ញៀវកិត្តិយស
              </p>
            </div>

            {/* Visual Invitation Card Preview */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#250e44] to-[#120522] text-[#fbefc0] border-2 border-[#D4AF37]/60 shadow-xl space-y-3 relative overflow-hidden">
              <div className="flex items-start justify-between gap-2 border-b border-[#D4AF37]/30 pb-3">
                <div>
                  <span className="text-[10px] text-[#d9b15a] uppercase tracking-widest font-bold block">
                    សូមគោរពអញ្ជើញ (CORDIALLY INVITED)
                  </span>
                  <h4 className="font-serif text-lg sm:text-xl font-bold text-white mt-0.5 line-clamp-1">
                    {activeShareGuest.name}
                  </h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#250e44] text-[10px] font-bold uppercase tracking-wider shrink-0 shadow-xs">
                  {activeShareGuest.category}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-[#fbefc0]/90">
                <div className="flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-[#d9b15a] shrink-0" />
                  <span className="font-medium">
                    មង្គលការ៖ <strong className="text-white">{groomName} &amp; {brideName}</strong>
                  </span>
                </div>
                {eventDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#d9b15a] shrink-0" />
                    <span>
                      {new Date(eventDate).toLocaleDateString("km-KH", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {venueName && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#d9b15a] shrink-0" />
                    <span className="line-clamp-1">{venueName}</span>
                  </div>
                )}
              </div>

              {/* Unique Pass Capsule */}
              <div className="p-2 rounded-xl bg-black/40 border border-[#D4AF37]/40 flex items-center justify-between gap-2 text-[11px] font-mono">
                <span className="text-[#d9b15a] truncate">
                  Code: <strong className="text-white">{activeShareGuest.invitationCode}</strong>
                  {activeShareGuest.tableNumber ? ` · ${activeShareGuest.tableNumber}` : ""}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#d9b15a]/20 text-[#fbefc0] shrink-0">
                  {activeShareGuest.maxGuests} Seats
                </span>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#2C2A29] block">
                🚀 ចុចផ្ញើ ១-Click ទៅកាន់បណ្តាញសង្គម៖
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Telegram */}
                <button
                  type="button"
                  onClick={() => handleShareTelegram(activeShareGuest)}
                  className="py-2.5 px-3 rounded-xl bg-[#229ED9] hover:bg-[#1D8BC0] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Telegram</span>
                </button>

                {/* WhatsApp */}
                <button
                  type="button"
                  onClick={() => handleShareWhatsApp(activeShareGuest)}
                  className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>

                {/* Messenger / Facebook */}
                <button
                  type="button"
                  onClick={() => handleShareMessenger(activeShareGuest)}
                  className="py-2.5 px-3 rounded-xl bg-[#0084FF] hover:bg-[#0074E0] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Facebook</span>
                </button>
              </div>
            </div>

            {/* Formatted Message Preview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#2C2A29]">
                  📝 សារអញ្ជើញផ្លូវការ (Invitation Message Preview):
                </label>
                <button
                  type="button"
                  onClick={() => handleCopyFullMessage(activeShareGuest)}
                  className="text-xs font-semibold text-[#AA7C11] hover:underline flex items-center gap-1"
                >
                  {shareCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">បានចម្លងជោគជ័យ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>ចម្លងសារ</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                readOnly
                rows={6}
                value={getGuestInvitationMessage(activeShareGuest)}
                className="w-full p-3 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 leading-relaxed font-sans focus:outline-none select-all"
              />
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-stone-200 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleCopyFullMessage(activeShareGuest)}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-105 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
              >
                {shareCopied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{shareCopied ? "✓ បានចម្លងសាររួចរាល់!" : "📋 ចម្លងសារអញ្ជើញទាំងមូល"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopyCleanLink(activeShareGuest)}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-white border border-[#D4AF37]/40 hover:bg-[#FAF8F5] text-[#2C2A29] text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs"
              >
                {linkOnlyCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{linkOnlyCopied ? "✓ បានចម្លង Link!" : "🔗 ចម្លងតែ Link"}</span>
              </button>

              <a
                href={getGuestInvitationUrl(activeShareGuest)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs"
              >
                <ExternalLink className="w-4 h-4" />
                <span>👁️ បើកមើលធៀប</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
