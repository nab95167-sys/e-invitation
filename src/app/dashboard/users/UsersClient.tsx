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
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string | Date;
}

interface UsersClientProps {
  initialUsers: User[];
  currentUserId: string;
}

export default function UsersClient({ initialUsers, currentUserId }: UsersClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "COUPLE",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

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
      setFormData({ name: "", email: "", password: "", role: "COUPLE" });
      setSuccess("New user created successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: newRole }),
      });

      if (res.ok) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUserId) {
      alert("You cannot delete your own account.");
      return;
    }
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/users?id=${userId}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2C2A29]">
            User &amp; Role Management (RBAC)
          </h1>
          <p className="text-xs text-[#3E444A]/70 mt-1">
            Assign security roles (Superadmin, Couple, Event Coordinator/Organizer) to govern platform access.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs font-semibold flex items-center gap-2 shadow-luxury hover:brightness-105 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create New User</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-[#D4AF37]/25 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-stone-100 text-[#3E444A]/70 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Name &amp; Email</th>
                <th className="py-3.5 px-4 font-semibold">Security Role</th>
                <th className="py-3.5 px-4 font-semibold">Role Description</th>
                <th className="py-3.5 px-4 font-semibold">Registered Date</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#FAF8F5]">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#2C2A29] block text-sm">{u.name}</span>
                    <span className="text-stone-500 text-xs">{u.email}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      disabled={u.id === currentUserId}
                      className="px-3 py-1.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-xs font-semibold focus:outline-none"
                    >
                      <option value="SUPERADMIN">SUPERADMIN</option>
                      <option value="COUPLE">COUPLE</option>
                      <option value="ORGANIZER">ORGANIZER</option>
                      <option value="GUEST">GUEST</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-stone-500 text-xs">
                    {u.role === "SUPERADMIN" && "Full system & role control"}
                    {u.role === "COUPLE" && "Event editor, RSVPs, photo/video"}
                    {u.role === "ORGANIZER" && "Guest check-in & table coordinator"}
                    {u.role === "GUEST" && "Invitation viewing & wishes"}
                  </td>

                  <td className="py-3.5 px-4 text-stone-500 text-xs">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {u.id !== currentUserId && (
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsAddOpen(false)}
        >
          <div
            className="relative max-w-md w-full bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-luxury-lg border border-[#D4AF37]/40"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-[#2C2A29] mb-1">
              Create New System User
            </h3>
            <p className="text-xs text-[#3E444A]/70 mb-6">
              Assign credentials and appropriate role privilege level.
            </p>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#3E444A] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Victoria Sterling"
                  className="w-full px-4 py-2.5 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#3E444A] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@wedding.com"
                  className="w-full px-4 py-2.5 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#3E444A] mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#3E444A] mb-1">
                  Assigned Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
                >
                  <option value="COUPLE">COUPLE (Event Bride/Groom)</option>
                  <option value="ORGANIZER">ORGANIZER (Wedding Planner/Coordinator)</option>
                  <option value="SUPERADMIN">SUPERADMIN (Full System Access)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs font-semibold shadow-luxury hover:brightness-105 transition-all mt-4"
              >
                {loading ? "Creating..." : "Save User Account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
