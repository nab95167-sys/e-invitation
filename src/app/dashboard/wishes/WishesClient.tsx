"use client";

import { useState } from "react";
import {
  Heart,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Plus,
  MessageSquare,
  Sparkles,
  Search,
  Eye,
  EyeOff,
  X,
  Check,
  Calendar,
  User,
  Tag,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export interface Wish {
  id: string;
  eventId?: string;
  senderName: string;
  relationship?: string | null;
  message: string;
  isApproved: boolean;
  createdAt: string | Date;
}

interface WishesClientProps {
  initialWishes: Wish[];
  eventId?: string;
  eventSlug?: string;
}

export default function WishesClient({
  initialWishes,
  eventId,
  eventSlug = "so-vith-and-ma-na",
}: WishesClientProps) {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "APPROVED" | "PENDING">("ALL");

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Wish | null>(null);

  // Form states
  const [addForm, setAddForm] = useState({
    senderName: "",
    relationship: "",
    message: "",
    isApproved: true,
  });
  const [editForm, setEditForm] = useState<{
    id: string;
    senderName: string;
    relationship: string;
    message: string;
    isApproved: boolean;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // 1. ADD WISH
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.senderName.trim() || !addForm.message.trim()) {
      setErrorMsg("សូមបញ្ចូលឈ្មោះ និងខ្លឹមសារពាក្យជូនពរ / Please enter sender name and message.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          eventSlug,
          senderName: addForm.senderName.trim(),
          relationship: addForm.relationship.trim() || null,
          message: addForm.message.trim(),
          isApproved: addForm.isApproved,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.wish) {
        setWishes([data.wish, ...wishes]);
        setIsAddOpen(false);
        setAddForm({
          senderName: "",
          relationship: "",
          message: "",
          isApproved: true,
        });
        showToast("✓ បានបន្ថែមពាក្យជូនពរដោយជោគជ័យ! / Wish added successfully!");
      } else {
        setErrorMsg(data.error || "Failed to add wish.");
      }
    } catch (err) {
      setErrorMsg("Error adding wish. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 2. OPEN EDIT MODAL
  const openEditModal = (wish: Wish) => {
    setEditForm({
      id: wish.id,
      senderName: wish.senderName,
      relationship: wish.relationship || "",
      message: wish.message,
      isApproved: wish.isApproved,
    });
    setErrorMsg("");
    setIsEditOpen(true);
  };

  // 3. EDIT WISH SUBMIT
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm || !editForm.senderName.trim() || !editForm.message.trim()) {
      setErrorMsg("សូមបញ្ចូលឈ្មោះ និងខ្លឹមសារពាក្យជូនពរ / Name and message are required.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/wishes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editForm.id,
          senderName: editForm.senderName.trim(),
          relationship: editForm.relationship.trim() || null,
          message: editForm.message.trim(),
          isApproved: editForm.isApproved,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.wish) {
        setWishes(wishes.map((w) => (w.id === editForm.id ? data.wish : w)));
        setIsEditOpen(false);
        setEditForm(null);
        showToast("✓ បានកែប្រែពាក្យជូនពរដោយជោគជ័យ! / Wish updated successfully!");
      } else {
        setErrorMsg(data.error || "Failed to update wish.");
      }
    } catch (err) {
      setErrorMsg("Error updating wish.");
    } finally {
      setLoading(false);
    }
  };

  // 4. QUICK TOGGLE APPROVED / PUBLISHED
  const handleToggleApproved = async (wish: Wish) => {
    const nextStatus = !wish.isApproved;
    try {
      const res = await fetch("/api/wishes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: wish.id,
          isApproved: nextStatus,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setWishes(wishes.map((w) => (w.id === wish.id ? { ...w, isApproved: nextStatus } : w)));
        showToast(
          nextStatus
            ? "✓ បានអនុម័តបង្ហាញលើគេហទំព័រ / Published to public guestbook!"
            : "✕ បានលាក់ពាក្យជូនពរ / Hidden from public guestbook."
        );
      }
    } catch (err) {
      console.error("Toggle approval error", err);
    }
  };

  // 5. DELETE WISH
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/wishes?id=${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setWishes(wishes.filter((w) => w.id !== deleteTarget.id));
        setDeleteTarget(null);
        showToast("✓ បានលុបពាក្យជូនពរដោយជោគជ័យ / Wish deleted successfully.");
      } else {
        alert("Failed to delete wish.");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting wish.");
    } finally {
      setLoading(false);
    }
  };

  // Filtered wishes
  const filteredWishes = wishes.filter((w) => {
    const matchSearch =
      w.senderName.toLowerCase().includes(search.toLowerCase()) ||
      w.message.toLowerCase().includes(search.toLowerCase()) ||
      (w.relationship && w.relationship.toLowerCase().includes(search.toLowerCase()));

    if (!matchSearch) return false;

    if (statusFilter === "APPROVED") return w.isApproved;
    if (statusFilter === "PENDING") return !w.isApproved;
    return true;
  });

  const totalCount = wishes.length;
  const approvedCount = wishes.filter((w) => w.isApproved).length;
  const pendingCount = totalCount - approvedCount;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-[#1d2010] border border-[#d9b15a] text-[#fbefc0] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-5 h-5 text-[#d9b15a]" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/25 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-bold text-[#AA7C11] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#D4AF37]/30">
              Guestbook &amp; Blessings
            </span>
            <span className="text-xs text-stone-400">({totalCount} សរុប)</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2A29]">
            សៀវភៅជូនពរ និងមតិប្រសិទ្ធពរជ័យ
          </h1>
          <p className="text-xs sm:text-sm text-[#3E444A]/75 mt-1 font-khmer">
            គ្រប់គ្រង កែប្រែ បន្ថែម ឬលុបពាក្យជូនពរ និងសារប្រសិទ្ធពរពីភ្ញៀវកិត្តិយសរបស់អ្នក។
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Add New Wish Button */}
          <button
            onClick={() => {
              setErrorMsg("");
              setIsAddOpen(true);
            }}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs sm:text-sm font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ បន្ថែមពាក្យជូនពរ (Add Wish)</span>
          </button>

          {/* View Live Guestbook Link */}
          <a
            href={`/invite/${eventSlug}#wishes`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-white border border-[#D4AF37]/30 text-xs sm:text-sm font-semibold text-[#2C2A29] flex items-center gap-2 hover:bg-[#FAF8F5] transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#AA7C11]" />
            <span>មើលផ្ទាល់</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </a>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          onClick={() => setStatusFilter("ALL")}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            statusFilter === "ALL"
              ? "bg-[#FAF8F5] border-[#D4AF37] shadow-sm ring-1 ring-[#D4AF37]"
              : "bg-white border-[#D4AF37]/20 hover:border-[#D4AF37]/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">ពាក្យជូនពរទាំងអស់ (Total)</span>
            <MessageSquare className="w-4 h-4 text-[#AA7C11]" />
          </div>
          <div className="mt-2 text-2xl font-serif font-bold text-[#2C2A29]">{totalCount}</div>
        </div>

        <div
          onClick={() => setStatusFilter("APPROVED")}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            statusFilter === "APPROVED"
              ? "bg-emerald-50 border-emerald-400 shadow-sm ring-1 ring-emerald-400"
              : "bg-white border-emerald-100 hover:border-emerald-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-700 font-medium">បានបង្ហាញ (Published)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-serif font-bold text-emerald-800">{approvedCount}</div>
        </div>

        <div
          onClick={() => setStatusFilter("PENDING")}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            statusFilter === "PENDING"
              ? "bg-amber-50 border-amber-400 shadow-sm ring-1 ring-amber-400"
              : "bg-white border-amber-100 hover:border-amber-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-700 font-medium">បានលាក់ (Hidden / Pending)</span>
            <EyeOff className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-serif font-bold text-amber-800">{pendingCount}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-[#D4AF37]/20 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ស្វែងរកតាមឈ្មោះ ឬខ្លឹមសារពាក្យជូនពរ... (Search wishes)..."
            className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all ${
              statusFilter === "ALL"
                ? "bg-[#2C2A29] text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            ទាំងអស់ ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter("APPROVED")}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all ${
              statusFilter === "APPROVED"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            បង្ហាញ ({approvedCount})
          </button>
          <button
            onClick={() => setStatusFilter("PENDING")}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all ${
              statusFilter === "PENDING"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            លាក់ ({pendingCount})
          </button>
        </div>
      </div>

      {/* Wishes List */}
      <div className="space-y-4">
        {filteredWishes.map((w) => (
          <div
            key={w.id}
            className={`p-5 sm:p-6 rounded-3xl bg-white border transition-all shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              w.isApproved
                ? "border-[#D4AF37]/25 hover:border-[#D4AF37]/50"
                : "border-amber-200 bg-amber-50/20"
            }`}
          >
            <div className="space-y-2.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    w.isApproved
                      ? "bg-[#D4AF37]/15 text-[#AA7C11]"
                      : "bg-stone-100 text-stone-400"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      w.isApproved ? "fill-[#D4AF37] text-[#AA7C11]" : "text-stone-400"
                    }`}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-serif font-bold text-base sm:text-lg text-[#2C2A29]">
                    {w.senderName}
                  </span>

                  {w.relationship && (
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FAF8F5] text-[#AA7C11] border border-[#D4AF37]/30 font-medium">
                      {w.relationship}
                    </span>
                  )}

                  <span className="text-stone-400 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(w.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="ml-auto">
                  {w.isApproved ? (
                    <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>បង្ហាញលើគេហទំព័រ (Public)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                      <EyeOff className="w-3 h-3 text-amber-600" />
                      <span>បានលាក់ទុក (Hidden)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Message Quote */}
              <div className="pl-11 pr-2">
                <p className="text-sm sm:text-base text-[#3E444A] font-light leading-relaxed font-khmer bg-[#FAF8F5]/60 p-3.5 rounded-2xl border border-stone-100">
                  &ldquo;{w.message}&rdquo;
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS (Toggle Status, Edit, Delete) */}
            <div className="flex items-center gap-2 shrink-0 md:self-center border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
              {/* Quick Publish / Hide Toggle */}
              <button
                onClick={() => handleToggleApproved(w)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  w.isApproved
                    ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                }`}
                title={w.isApproved ? "Hide wish from live site" : "Approve & show wish"}
              >
                {w.isApproved ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>លាក់ (Hide)</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>បង្ហាញ (Publish)</span>
                  </>
                )}
              </button>

              {/* Edit Button */}
              <button
                onClick={() => openEditModal(w)}
                className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D4AF37]/40 text-[#AA7C11] text-xs font-semibold hover:bg-[#D4AF37]/15 flex items-center gap-1.5 transition-all"
                title="Edit this wish"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>កែប្រែ (Edit)</span>
              </button>

              {/* Delete Button */}
              <button
                onClick={() => setDeleteTarget(w)}
                className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-100 flex items-center gap-1.5 transition-all"
                title="Delete this wish"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>លុប (Delete)</span>
              </button>
            </div>
          </div>
        ))}

        {filteredWishes.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#D4AF37]/20 text-stone-400 space-y-3">
            <MessageSquare className="w-10 h-10 mx-auto text-stone-300" />
            <p className="text-sm font-medium text-stone-500">
              {search
                ? `រកមិនឃើញពាក្យជូនពរដែលត្រូវនឹង "${search}" ឡើយ`
                : "មិនទាន់មានពាក្យជូនពរនៅឡើយទេ"}
            </p>
            <button
              onClick={() => {
                setErrorMsg("");
                setIsAddOpen(true);
              }}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-white text-xs font-semibold hover:bg-[#AA7C11] transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>បន្ថែមពាក្យជូនពរដំបូង (Add First Wish)</span>
            </button>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: ADD NEW WISH                                        */}
      {/* ============================================================ */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#D4AF37]/40 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#FAF8F5] to-white border-b border-[#D4AF37]/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#AA7C11]">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#2C2A29]">
                    បន្ថែមពាក្យជូនពរថ្មី (Add Wish)
                  </h3>
                  <p className="text-[11px] text-[#3E444A]/70">
                    បញ្ចូលពាក្យជូនពរថ្មីជំនួសភ្ញៀវ ឬសាច់ញាតិ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddSubmit} className="p-5 sm:p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Sender Name */}
              <div>
                <label className="block text-xs font-bold text-[#2C2A29] mb-1.5">
                  ឈ្មោះអ្នកជូនពរ (Sender Name) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={addForm.senderName}
                    onChange={(e) => setAddForm({ ...addForm, senderName: e.target.value })}
                    placeholder="ឧទាហរណ៍៖ លោកពូ សុខា ឬ កញ្ញា សុភាព"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Relationship Tag */}
              <div>
                <label className="block text-xs font-bold text-[#2C2A29] mb-1.5">
                  ត្រូវជាអ្វី / ទំនាក់ទំនង (Relationship / Tag)
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={addForm.relationship}
                    onChange={(e) => setAddForm({ ...addForm, relationship: e.target.value })}
                    placeholder="ឧទាហរណ៍៖ មិត្តភក្តិ, បងប្អូនជីដូនមួយ, មិត្តរួមការងារ"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
                {/* Suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {["មិត្តភក្តិ", "បងប្អូន", "សាច់ញាតិ", "មិត្តរួមការងារ", "Friend", "Family"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setAddForm({ ...addForm, relationship: tag })}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-[#D4AF37]/20 text-stone-600 transition-colors"
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-[#2C2A29] mb-1.5">
                  ខ្លឹមសារពាក្យជូនពរ (Blessing Message) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={addForm.message}
                  onChange={(e) => setAddForm({ ...addForm, message: e.target.value })}
                  placeholder="សូមប្រសិទ្ធពរជ័យ សិរីសួស្តី ជ័យមង្គល វិបុលសុខគ្រប់ប្រការ..."
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] resize-none"
                />
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#D4AF37]/20">
                <div>
                  <span className="text-xs font-bold text-[#2C2A29] block">
                    បង្ហាញលើគេហទំព័រ (Publish Publicly)
                  </span>
                  <span className="text-[11px] text-stone-500">
                    អនុញ្ញាតឱ្យភ្ញៀវដទៃទៀតមើលឃើញពាក្យជូនពរនេះ
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={addForm.isApproved}
                  onChange={(e) => setAddForm({ ...addForm, isApproved: e.target.checked })}
                  className="w-4 h-4 text-[#D4AF37] rounded focus:ring-[#D4AF37] cursor-pointer"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-stone-600 hover:bg-stone-100 transition-all"
                >
                  បោះបង់ (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white shadow hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  {loading ? (
                    <span>កំពុងរក្សាទុក...</span>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>រក្សាទុកពាក្យជូនពរ (Save Wish)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: EDIT WISH                                           */}
      {/* ============================================================ */}
      {isEditOpen && editForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#D4AF37]/40 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#FAF8F5] to-white border-b border-[#D4AF37]/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#AA7C11]">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#2C2A29]">
                    កែប្រែពាក្យជូនពរ (Update Wish)
                  </h3>
                  <p className="text-[11px] text-[#3E444A]/70">
                    កែសម្រួលឈ្មោះ ទំនាក់ទំនង ឬខ្លឹមសារពាក្យជូនពរ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} className="p-5 sm:p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Sender Name */}
              <div>
                <label className="block text-xs font-bold text-[#2C2A29] mb-1.5">
                  ឈ្មោះអ្នកជូនពរ (Sender Name) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={editForm.senderName}
                    onChange={(e) => setEditForm({ ...editForm, senderName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Relationship Tag */}
              <div>
                <label className="block text-xs font-bold text-[#2C2A29] mb-1.5">
                  ត្រូវជាអ្វី / ទំនាក់ទំនង (Relationship / Tag)
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={editForm.relationship}
                    onChange={(e) => setEditForm({ ...editForm, relationship: e.target.value })}
                    placeholder="ឧទាហរណ៍៖ មិត្តភក្តិ, បងប្អូនជីដូនមួយ"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-[#2C2A29] mb-1.5">
                  ខ្លឹមសារពាក្យជូនពរ (Blessing Message) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={editForm.message}
                  onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] resize-none"
                />
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#D4AF37]/20">
                <div>
                  <span className="text-xs font-bold text-[#2C2A29] block">
                    បង្ហាញលើគេហទំព័រ (Publish Publicly)
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {editForm.isApproved
                      ? "ពាក្យជូនពរនេះកំពុងបង្ហាញជាសាធារណៈ"
                      : "ពាក្យជូនពរនេះត្រូវបានលាក់ទុក"}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={editForm.isApproved}
                  onChange={(e) => setEditForm({ ...editForm, isApproved: e.target.checked })}
                  className="w-4 h-4 text-[#D4AF37] rounded focus:ring-[#D4AF37] cursor-pointer"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-stone-600 hover:bg-stone-100 transition-all"
                >
                  បោះបង់ (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white shadow hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  {loading ? (
                    <span>កំពុងធ្វើបច្ចុប្បន្នភាព...</span>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>ធ្វើបច្ចុប្បន្នភាព (Update)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: CONFIRM DELETE                                      */}
      {/* ============================================================ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-red-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif font-bold text-lg text-[#2C2A29]">
                តើអ្នកពិតជាចង់លុបពាក្យជូនពរនេះមែនទេ?
              </h3>
              <p className="text-xs text-stone-500">
                Are you sure you want to delete the wish from{" "}
                <span className="font-semibold text-stone-700">{deleteTarget.senderName}</span>?
                សកម្មភាពនេះមិនអាចត្រឡប់វិញបានឡើយ។
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 font-light italic">
              &ldquo;{deleteTarget.message}&rdquo;
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-stone-600 hover:bg-stone-100 transition-all"
              >
                បោះបង់ (Cancel)
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-red-600 text-white shadow-md hover:bg-red-700 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5"
              >
                {loading ? "កំពុងលុប..." : "យល់ព្រមលុប (Delete)"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
