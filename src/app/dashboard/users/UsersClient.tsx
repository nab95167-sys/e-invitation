"use client";

import { useState } from "react";
import {
  ShieldAlert,
  UserPlus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Shield,
  Key,
  Lock,
  Eye,
  EyeOff,
  User,
  Mail,
  Search,
  Filter,
  ShieldCheck,
  Check,
  Sparkles,
} from "lucide-react";

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string | Date;
}

interface UsersClientProps {
  initialUsers: SystemUser[];
  currentUserId: string;
  currentUserRole?: string;
}

export default function UsersClient({
  initialUsers,
  currentUserId,
  currentUserRole = "SUPERADMIN",
}: UsersClientProps) {
  const [users, setUsers] = useState<SystemUser[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SystemUser | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "GUEST", // Default to safest, zero-permission role
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isSuperadmin = currentUserRole === "SUPERADMIN";

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password.length < 6) {
      setError("លេខសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ / Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");

      setUsers([data.user, ...users]);
      setIsAddOpen(false);
      setFormData({ name: "", email: "", password: "", role: "GUEST" });
      setSuccess(`✓ បានបង្កើតគណនី ${data.user.name} (${data.user.role}) ដោយជោគជ័យ!`);
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setError(null);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");

      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setSuccess(`✓ បានផ្លាស់ប្តូរសិទ្ធិទៅជា ${newRole} ដោយជោគជ័យ`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/users?id=${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");

      setUsers(users.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
      setSuccess("✓ បានលុបគណនីអ្នកប្រើប្រាស់ដោយជោគជ័យ");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (roleFilter === "ALL") return true;
    return u.role === roleFilter;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/25 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-bold text-[#AA7C11] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#D4AF37]/30">
              Role-Based Access Control (RBAC)
            </span>
            <span className="text-xs text-stone-400">({users.length} គណនី)</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2A29]">
            គ្រប់គ្រងអ្នកប្រើប្រាស់ &amp; សិទ្ធិ (User Roles &amp; Security)
          </h1>
          <p className="text-xs sm:text-sm text-[#3E444A]/75 mt-1 font-khmer">
            បន្ថែមអ្នកប្រើប្រាស់ថ្មី កំណត់តួនាទី ឬបង្កើតគណនីមើល <strong className="text-amber-800">គ្មានសិទ្ធិកែប្រែលើប្រព័ន្ធ (Restricted Viewer)</strong> ដោយសុវត្ថិភាពខ្ពស់។
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setIsAddOpen(true);
          }}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ បង្កើតអ្នកប្រើប្រាស់ (Create User)</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-200 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Permission Security Guide Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] border border-[#D4AF37]/30 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100/70 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#2C2A29]">
              សុវត្ថិភាពគណនីកម្រិតទាប (Restricted "GUEST" Zero-Permission Security)
            </h4>
            <p className="text-[11px] text-[#3E444A]/80 font-khmer">
              គណនីប្រភេទ <span className="font-bold text-amber-900">GUEST / VIEWER</span> មិនមានសិទ្ធិកែប្រែព័ត៌មានមង្គលការ, មិនអាចបន្ថែម/លុបភ្ញៀវ, មិនអាច Upload រូបភាព និងមិនអាចប៉ះពាល់ទិន្នន័យប្រព័ន្ធបានឡើយ។
            </p>
          </div>
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
            placeholder="ស្វែងរកតាមឈ្មោះ ឬ Email... (Search user by name or email)..."
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

        <div className="flex flex-wrap items-center gap-1.5 self-end sm:self-center">
          <button
            onClick={() => setRoleFilter("ALL")}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all ${
              roleFilter === "ALL"
                ? "bg-[#2C2A29] text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            ទាំងអស់ ({users.length})
          </button>
          {isSuperadmin && (
            <button
              onClick={() => setRoleFilter("SUPERADMIN")}
              className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all ${
                roleFilter === "SUPERADMIN"
                  ? "bg-red-600 text-white"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              Superadmin
            </button>
          )}
          <button
            onClick={() => setRoleFilter("COUPLE")}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all ${
              roleFilter === "COUPLE"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            Couple
          </button>
          <button
            onClick={() => setRoleFilter("ORGANIZER")}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all ${
              roleFilter === "ORGANIZER"
                ? "bg-purple-600 text-white"
                : "bg-purple-50 text-purple-700 hover:bg-purple-100"
            }`}
          >
            Organizer
          </button>
          <button
            onClick={() => setRoleFilter("GUEST")}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all ${
              roleFilter === "GUEST"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            🔒 Viewer (No Permissions)
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-[#D4AF37]/25 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-stone-100 text-[#3E444A]/80 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">ឈ្មោះ &amp; អ៊ីមែល (User)</th>
                <th className="py-3.5 px-4 font-semibold">តួនាទី (Security Role)</th>
                <th className="py-3.5 px-4 font-semibold">សិទ្ធិប្រើប្រាស់លើប្រព័ន្ធ (System Permissions)</th>
                <th className="py-3.5 px-4 font-semibold">កាលបរិច្ឆេទបង្កើត</th>
                <th className="py-3.5 px-4 font-semibold text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.map((u) => {
                const isMe = u.id === currentUserId;
                const isTargetSuper = u.role === "SUPERADMIN";

                return (
                  <tr key={u.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    {/* User Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            u.role === "SUPERADMIN"
                              ? "bg-red-100 text-red-700"
                              : u.role === "COUPLE"
                              ? "bg-emerald-100 text-emerald-700"
                              : u.role === "ORGANIZER"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#2C2A29] text-sm">{u.name}</span>
                            {isMe && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 font-medium">
                                (អ្នកផ្ទាល់)
                              </span>
                            )}
                          </div>
                          <span className="text-stone-400 text-xs block">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role Dropdown */}
                    <td className="py-3.5 px-4">
                      {isSuperadmin ? (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          disabled={isMe}
                          className="px-3 py-1.5 bg-[#FAF8F5] border border-[#D4AF37]/35 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#D4AF37] disabled:opacity-60 cursor-pointer"
                        >
                          <option value="SUPERADMIN">🔴 SUPERADMIN</option>
                          <option value="COUPLE">🟢 COUPLE</option>
                          <option value="ORGANIZER">🟣 ORGANIZER</option>
                          <option value="GUEST">🔒 GUEST (No Permission)</option>
                        </select>
                      ) : (
                        <div>
                          {isTargetSuper ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
                              <ShieldAlert className="w-3 h-3" />
                              <span>SUPERADMIN</span>
                            </span>
                          ) : (
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              disabled={isMe || isTargetSuper}
                              className="px-3 py-1.5 bg-[#FAF8F5] border border-[#D4AF37]/35 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#D4AF37] disabled:opacity-60 cursor-pointer"
                            >
                              <option value="COUPLE" disabled>COUPLE</option>
                              <option value="ORGANIZER">🟣 ORGANIZER (Staff)</option>
                              <option value="GUEST">🔒 GUEST (No Permission)</option>
                            </select>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Permissions Description */}
                    <td className="py-3.5 px-4">
                      {u.role === "SUPERADMIN" && (
                        <div className="flex items-center gap-1.5 text-xs text-red-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
                          <span>សិទ្ធិពេញលេញលើប្រព័ន្ធទាំងមូល (Full System Admin)</span>
                        </div>
                      )}
                      {u.role === "COUPLE" && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>ម្ចាស់កម្មវិធី (កែប្រែកម្មវិធី ភ្ញៀវ រូបថត &amp; សារជូនពរ)</span>
                        </div>
                      )}
                      {u.role === "ORGANIZER" && (
                        <div className="flex items-center gap-1.5 text-xs text-purple-800 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                          <span>អ្នកសម្របសម្រួល (Check-in ភ្ញៀវ &amp; មើលតារាងតុ)</span>
                        </div>
                      )}
                      {u.role === "GUEST" && (
                        <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 w-fit">
                          <Lock className="w-3 h-3 text-amber-600" />
                          <span>🔒 គ្មានសិទ្ធិ (Read-Only Viewer: មិនអាចកែប្រែអ្វីបានឡើយ)</span>
                        </div>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-stone-500 text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {!isMe && (!isTargetSuper || isSuperadmin) && (
                        <button
                          onClick={() => setDeleteTarget(u)}
                          className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-400">
                    រកមិនឃើញអ្នកប្រើប្រាស់ឡើយ។
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL: CREATE USER WITH ROLE AND PERMISSION BREAKDOWN         */}
      {/* ============================================================ */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D4AF37]/40 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#AA7C11]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2C2A29]">
                    បង្កើតអ្នកប្រើប្រាស់ថ្មី (Create User)
                  </h3>
                  <p className="text-[11px] text-[#3E444A]/70">
                    កំណត់ព័ត៌មានគណនី និងកម្រិតសិទ្ធិប្រើប្រាស់លើប្រព័ន្ធ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1.5 rounded-full hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 pt-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#2C2A29] mb-1.5">
                  ឈ្មោះពេញ (Full Name) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ឧ. សុខ វិសាល ឬ Victoria Sterling"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-[#2C2A29] mb-1.5">
                  អាសយដ្ឋាន Email (Login Email) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@wedding.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-[#2C2A29] mb-1.5">
                  លេខសម្ងាត់ (Password - យ៉ាងហោច ៦ តួអក្សរ) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Security Role Selector */}
              <div>
                <label className="block text-xs font-bold text-[#2C2A29] mb-1.5">
                  កំណត់កម្រិតសិទ្ធិ (Assigned Security Role) <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] font-semibold"
                >
                  <option value="GUEST">🔒 GUEST / VIEWER (គ្មានសិទ្ធិលើប្រព័ន្ធ - No System Permissions)</option>
                  <option value="ORGANIZER">🟣 ORGANIZER (អ្នកសម្របសម្រួល - Check-in Staff)</option>
                  {isSuperadmin && <option value="COUPLE">🟢 COUPLE (ម្ចាស់ពិធីមង្គលការ - Wedding Host)</option>}
                  {isSuperadmin && <option value="SUPERADMIN">🔴 SUPERADMIN (មេគ្រប់គ្រងប្រព័ន្ធពេញលេញ)</option>}
                </select>
              </div>

              {/* DYNAMIC PERMISSION BREAKDOWN CARD */}
              <div
                className={`p-4 rounded-2xl border text-xs space-y-2 transition-all ${
                  formData.role === "GUEST"
                    ? "bg-amber-50 border-amber-300 text-amber-900"
                    : formData.role === "ORGANIZER"
                    ? "bg-purple-50 border-purple-200 text-purple-900"
                    : formData.role === "COUPLE"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-red-50 border-red-200 text-red-900"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {formData.role === "GUEST" && "សិទ្ធិគណនី: គ្មានសិទ្ធិកែប្រែប្រព័ន្ធ (Zero-Permission Read-Only)"}
                    {formData.role === "ORGANIZER" && "សិទ្ធិគណនី: អ្នកសម្របសម្រួល (Guest Check-in)"}
                    {formData.role === "COUPLE" && "សិទ្ធិគណនី: ម្ចាស់ពិធី (Wedding Host)"}
                    {formData.role === "SUPERADMIN" && "សិទ្ធិគណនី: អ្នកគ្រប់គ្រងប្រព័ន្ធជាន់ខ្ពស់ (Superadmin)"}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1.5 pt-1 text-[11px]">
                  {formData.role === "GUEST" ? (
                    <>
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <span>✔️ ចូលមើលលិខិតអញ្ជើញ និងពាក្យជូនពរ (View Invitation &amp; Wishes)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-red-600 font-semibold">
                        <span>❌ គ្មានសិទ្ធិកែប្រែកម្មវិធី ឬ Theme (Cannot edit event)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-red-600 font-semibold">
                        <span>❌ គ្មានសិទ្ធិបន្ថែម កែ ឬលុបភ្ញៀវ (Cannot manage guests)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-red-600 font-semibold">
                        <span>❌ គ្មានសិទ្ធិ Upload ឬលុបរូបភាព (Cannot upload media)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-red-600 font-semibold">
                        <span>❌ គ្មានសិទ្ធិគ្រប់គ្រងអ្នកប្រើដទៃ (Cannot manage users)</span>
                      </div>
                    </>
                  ) : formData.role === "ORGANIZER" ? (
                    <>
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <span>✔️ មើលបញ្ជីភ្ញៀវ និង Check-in ភ្ញៀវចូលរួម (Guest Check-in)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-500">
                        <span>❌ គ្មានសិទ្ធិកែប្រែព័ត៌មានមង្គលការ ឬលុបទិន្នន័យឡើយ</span>
                      </div>
                    </>
                  ) : formData.role === "COUPLE" ? (
                    <>
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <span>✔️ សិទ្ធិពេញលេញលើមង្គលការខ្លួន (កែប្រែព័ត៌មាន ភ្ញៀវ រូបថត &amp; សារ)</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5 text-red-700 font-medium">
                        <span>✔️ សិទ្ធិពេញលេញលើប្រព័ន្ធទាំងមូល រួមទាំងគ្រប់គ្រង Admin ទាំងអស់</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
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
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs font-bold shadow hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  {loading ? (
                    <span>កំពុងបង្កើត...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>បង្កើតគណនី (Save User)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: DELETE CONFIRMATION                                   */}
      {/* ============================================================ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-red-200 shadow-2xl max-w-md w-full overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif font-bold text-lg text-[#2C2A29]">
                តើអ្នកពិតជាចង់លុបគណនីនេះមែនទេ?
              </h3>
              <p className="text-xs text-stone-500 font-khmer">
                តើអ្នកប្រាកដថាចង់លុបគណនី <strong className="text-stone-800">{deleteTarget.name}</strong> ({deleteTarget.email}) ដែរឬទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានឡើយ។
              </p>
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
                className="px-5 py-2 text-xs font-bold rounded-xl bg-red-600 text-white shadow hover:bg-red-700 active:scale-95 disabled:opacity-50 transition-all"
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
