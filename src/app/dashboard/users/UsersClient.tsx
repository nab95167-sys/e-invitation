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
  Palette,
  Users,
  QrCode,
  Image as ImageIcon,
  MessageSquare,
  Sliders,
  ExternalLink,
  Settings2,
  Info,
  ChevronRight,
  ShieldX,
  RotateCcw,
  CheckSquare,
  Square,
} from "lucide-react";

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions?: string | string[] | null;
  createdAt: string | Date;
}

interface UsersClientProps {
  initialUsers: SystemUser[];
  currentUserId: string;
  currentUserRole?: string;
}

export interface PermissionItem {
  id: string;
  symbol: string;
  nameKh: string;
  nameEn: string;
  descKh: string;
  icon: any;
  category: "view" | "operation" | "admin";
}

export const PERMISSION_ITEMS: PermissionItem[] = [
  {
    id: "view_invitation",
    symbol: "👁️",
    nameKh: "មើលលិខិតអញ្ជើញ & សារជូនពរ",
    nameEn: "View Invitation & Wishes",
    descKh: "ចូលមើលទំព័រលិខិតអញ្ជើញ កាលវិភាគ កម្មវិធី និងសារជូនពរ",
    icon: Eye,
    category: "view",
  },
  {
    id: "checkin_guests",
    symbol: "🎟️",
    nameKh: "Check-in ភ្ញៀវ & ស្កេន QR Code",
    nameEn: "Guest Check-in & QR Scan",
    descKh: "ស្កេន QR Code បញ្ជាក់វត្តមានភ្ញៀវ និងកត់ត្រាតុអង្គុយ",
    icon: QrCode,
    category: "operation",
  },
  {
    id: "manage_guests",
    symbol: "👥",
    nameKh: "គ្រប់គ្រងបញ្ជីភ្ញៀវកិត្តិយស",
    nameEn: "Manage Guest List",
    descKh: "បន្ថែម កែប្រែ នាំចេញ Excel និងបែងចែកតុភ្ញៀវ",
    icon: Users,
    category: "operation",
  },
  {
    id: "edit_event_theme",
    symbol: "🎨",
    nameKh: "កែប្រែកម្មវិធី & រចនាប័ទ្ម Theme",
    nameEn: "Edit Event, Colors & Theme",
    descKh: "កែសម្រួលព័ត៌មានមង្គលការ ពណ៌ អក្សរ តន្ត្រី និងរូបភាពទីតាំង",
    icon: Palette,
    category: "operation",
  },
  {
    id: "manage_media",
    symbol: "🖼️",
    nameKh: "គ្រប់គ្រងរូបថត & វីដេអូ Gallery",
    nameEn: "Photos & Media Gallery",
    descKh: "Upload រូបភាពមង្គលការ រៀបចំលំដាប់រូប និងលុបរូបថត",
    icon: ImageIcon,
    category: "operation",
  },
  {
    id: "manage_wishes",
    symbol: "💬",
    nameKh: "គ្រប់គ្រងពាក្យជូនពរ Guestbook",
    nameEn: "Guestbook Wishes & Blessings",
    descKh: "បន្ថែម កែប្រែ បង្ហាញ ឬលាក់ និងលុបសារជូនពររបស់ភ្ញៀវ",
    icon: MessageSquare,
    category: "operation",
  },
  {
    id: "manage_roles",
    symbol: "🛡️",
    nameKh: "គ្រប់គ្រងតួនាទី & សិទ្ធិអ្នកប្រើ",
    nameEn: "Manage User Roles & Access",
    descKh: "បង្កើតគណនី កំណត់តួនាទី និងគ្រប់គ្រងសិទ្ធិបុគ្គលិក",
    icon: ShieldCheck,
    category: "admin",
  },
  {
    id: "delete_data",
    symbol: "🗑️",
    nameKh: "លុបទិន្នន័យប្រព័ន្ធសំខាន់ៗ",
    nameEn: "System Data Wipe / Delete",
    descKh: "លុបព្រឹត្តិការណ៍មង្គលការ បញ្ជីភ្ញៀវទាំងអស់ ឬប្រព័ន្ធទិន្នន័យ",
    icon: Trash2,
    category: "admin",
  },
];

export interface RoleDef {
  role: string;
  symbol: string;
  titleKh: string;
  titleEn: string;
  badgeBg: string;
  badgeText: string;
  borderCol: string;
  activeBorder: string;
  activeBg: string;
  descKh: string;
  descEn: string;
  allowedPermissions: string[];
}

export const ROLE_DEFINITIONS: Record<string, RoleDef> = {
  GUEST: {
    role: "GUEST",
    symbol: "🔒",
    titleKh: "អ្នកទស្សនា (គ្មានសិទ្ធិកែប្រែ)",
    titleEn: "GUEST / Restricted Viewer",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-900 border-amber-300",
    borderCol: "border-amber-200",
    activeBorder: "border-amber-500 ring-2 ring-amber-400/30",
    activeBg: "bg-amber-50/70",
    descKh: "គណនីកម្រិតសូន្យ: អាចចូលមើលបានតែលិខិតអញ្ជើញ មិនអាចកែប្រែ ឬលុបទិន្នន័យអ្វីបានឡើយ។",
    descEn: "Zero-permission viewer: read-only access to invitation, zero editing rights.",
    allowedPermissions: ["view_invitation"],
  },
  ORGANIZER: {
    role: "ORGANIZER",
    symbol: "🟣",
    titleKh: "អ្នកសម្របសម្រួល (បុគ្គលិក)",
    titleEn: "ORGANIZER / Check-in Staff",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-900 border-purple-300",
    borderCol: "border-purple-200",
    activeBorder: "border-purple-500 ring-2 ring-purple-400/30",
    activeBg: "bg-purple-50/70",
    descKh: "បុគ្គលិកសម្របសម្រួល: អាចមើលបញ្ជីភ្ញៀវ និងស្កេន Check-in ភ្ញៀវចូលតុ។ គ្មានសិទ្ធិកែ Theme ឬលុបទិន្នន័យ។",
    descEn: "Event coordinator: guest list view & QR check-in. Cannot edit theme or delete data.",
    allowedPermissions: ["view_invitation", "checkin_guests"],
  },
  COUPLE: {
    role: "COUPLE",
    symbol: "🟢",
    titleKh: "ម្ចាស់ពិធីមង្គលការ (កូនកំលោះ-ក្រមុំ)",
    titleEn: "COUPLE / Wedding Host",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-900 border-emerald-300",
    borderCol: "border-emerald-200",
    activeBorder: "border-emerald-500 ring-2 ring-emerald-400/30",
    activeBg: "bg-emerald-50/70",
    descKh: "ម្ចាស់កម្មវិធី: សិទ្ធិកែប្រែកម្មវិធី ពណ៌ Theme រូបថត បញ្ជីភ្ញៀវ និងពាក្យជូនពរទាំងស្រុង។",
    descEn: "Wedding host: full control over event details, theme, guests, media and wishes.",
    allowedPermissions: [
      "view_invitation",
      "checkin_guests",
      "manage_guests",
      "edit_event_theme",
      "manage_media",
      "manage_wishes",
    ],
  },
  SUPERADMIN: {
    role: "SUPERADMIN",
    symbol: "🔴",
    titleKh: "មេគ្រប់គ្រងប្រព័ន្ធជាន់ខ្ពស់",
    titleEn: "SUPERADMIN / Full System Admin",
    badgeBg: "bg-red-100",
    badgeText: "text-red-900 border-red-300",
    borderCol: "border-red-200",
    activeBorder: "border-red-500 ring-2 ring-red-400/30",
    activeBg: "bg-red-50/70",
    descKh: "អភិបាលប្រព័ន្ធពេញលេញ: សិទ្ធិទាំងអស់លើប្រព័ន្ធ រួមទាំងគ្រប់គ្រង Admin និងលុបទិន្នន័យ។",
    descEn: "Full administrative access: all permissions including user management and system wipe.",
    allowedPermissions: [
      "view_invitation",
      "checkin_guests",
      "manage_guests",
      "edit_event_theme",
      "manage_media",
      "manage_wishes",
      "manage_roles",
      "delete_data",
    ],
  },
};

export function parseUserPermissions(user: { role: string; permissions?: string | string[] | null }): string[] {
  if (user.permissions) {
    try {
      const parsed = typeof user.permissions === "string" ? JSON.parse(user.permissions) : user.permissions;
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // fallback
    }
  }
  return ROLE_DEFINITIONS[user.role]?.allowedPermissions || ROLE_DEFINITIONS.GUEST.allowedPermissions;
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

  // Inspector / Quick Edit Modal
  const [inspectUser, setInspectUser] = useState<SystemUser | null>(null);
  const [inspectSelectedRole, setInspectSelectedRole] = useState<string>("GUEST");
  const [inspectPermissions, setInspectPermissions] = useState<string[]>([]);
  const [inspectActivePerm, setInspectActivePerm] = useState<string | null>(null);

  // Create User Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "GUEST",
  });
  const [formPermissions, setFormPermissions] = useState<string[]>([
    ...ROLE_DEFINITIONS.GUEST.allowedPermissions,
  ]);
  const [selectedPermDetails, setSelectedPermDetails] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isSuperadmin = currentUserRole === "SUPERADMIN";

  // When Role changes in Create User Form
  const handleSelectRoleInCreate = (newRole: string) => {
    setFormData((prev) => ({ ...prev, role: newRole }));
    setFormPermissions([...(ROLE_DEFINITIONS[newRole]?.allowedPermissions || [])]);
  };

  // Toggle check/uncheck on permission in Create User Form
  const toggleFormPermission = (permId: string) => {
    setFormPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  // Quick buttons for Create Form
  const checkAllFormPermissions = () => {
    setFormPermissions(PERMISSION_ITEMS.map((p) => p.id));
  };
  const uncheckAllFormPermissions = () => {
    setFormPermissions([]);
  };
  const resetFormPermissionsToRole = () => {
    setFormPermissions([...(ROLE_DEFINITIONS[formData.role]?.allowedPermissions || [])]);
  };

  // Handle Create User Submit
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
        body: JSON.stringify({
          ...formData,
          permissions: formPermissions,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");

      setUsers([data.user, ...users]);
      setIsAddOpen(false);
      setFormData({ name: "", email: "", password: "", role: "GUEST" });
      setFormPermissions([...ROLE_DEFINITIONS.GUEST.allowedPermissions]);
      setSuccess(`✓ បានបង្កើតគណនី ${data.user.name} (${data.user.role}) ដោយជោគជ័យ!`);
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Inspector Functions
  const openInspector = (user: SystemUser) => {
    setInspectUser(user);
    setInspectSelectedRole(user.role);
    setInspectPermissions(parseUserPermissions(user));
    setInspectActivePerm(null);
    setError(null);
  };

  const handleSelectRoleInInspector = (newRole: string) => {
    setInspectSelectedRole(newRole);
    setInspectPermissions([...(ROLE_DEFINITIONS[newRole]?.allowedPermissions || [])]);
  };

  const toggleInspectPermission = (permId: string) => {
    setInspectPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  };

  const checkAllInspectPermissions = () => {
    setInspectPermissions(PERMISSION_ITEMS.map((p) => p.id));
  };
  const uncheckAllInspectPermissions = () => {
    setInspectPermissions([]);
  };
  const resetInspectPermissionsToRole = () => {
    setInspectPermissions([...(ROLE_DEFINITIONS[inspectSelectedRole]?.allowedPermissions || [])]);
  };

  const handleSaveInspectUser = async () => {
    if (!inspectUser) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: inspectUser.id,
          role: inspectSelectedRole,
          permissions: inspectPermissions,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update permissions");

      setUsers(
        users.map((u) =>
          u.id === inspectUser.id
            ? { ...u, role: inspectSelectedRole, permissions: inspectPermissions }
            : u
        )
      );
      setInspectUser(null);
      setSuccess(`✓ បានរក្សាទុកការកែប្រែសិទ្ធិរបស់ ${inspectUser.name} (${inspectSelectedRole}) ដោយជោគជ័យ!`);
      setTimeout(() => setSuccess(null), 3500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRoleChange = async (userId: string, newRole: string) => {
    setError(null);
    try {
      const defaultPerms = ROLE_DEFINITIONS[newRole]?.allowedPermissions || [];
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: newRole, permissions: defaultPerms }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");

      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole, permissions: defaultPerms } : u))
      );
      if (inspectUser && inspectUser.id === userId) {
        setInspectUser({ ...inspectUser, role: newRole, permissions: defaultPerms });
      }
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

  const availableRolesForCreation = isSuperadmin
    ? ["GUEST", "ORGANIZER", "COUPLE", "SUPERADMIN"]
    : ["GUEST", "ORGANIZER"];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/25 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-bold text-[#AA7C11] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#D4AF37]/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#AA7C11]" />
              Role-Based Access Control (RBAC) &amp; Checkboxes
            </span>
            <span className="text-xs text-stone-400">({users.length} គណនី)</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2A29]">
            គ្រប់គ្រងអ្នកប្រើប្រាស់ &amp; សិទ្ធិ (User Roles &amp; Permissions)
          </h1>
          <p className="text-xs sm:text-sm text-[#3E444A]/75 mt-1 font-khmer">
            អ្នកអាចចុច <strong className="text-[#AA7C11]">ធីក (Check) ឬដកធីក (Uncheck)</strong> លើប្រអប់សិទ្ធិ និងនិមិត្តសញ្ញានីមួយៗដោយសេរី ទាំងពេលបង្កើតគណនីថ្មី និងពេលកែប្រែសិទ្ធិ។
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setIsAddOpen(true);
          }}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
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
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] border border-[#D4AF37]/30 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100/70 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#2C2A29]">
                តារាងនិមិត្តសញ្ញាតួនាទី &amp; សិទ្ធិសុវត្ថិភាព (Role Symbols &amp; Checkboxes)
              </h4>
              <p className="text-[11px] text-[#3E444A]/80 font-khmer">
                ចុចលើតួនាទីដើម្បីច្រោះបញ្ជី ឬចុចលើប៊ូតុង <strong className="text-stone-800">"ពិនិត្យសិទ្ធិ"</strong> ក្នុងតារាងដើម្បីធីក (Check) ឬដកធីក (Uncheck) សិទ្ធិ៖
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Role Quick-Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {Object.values(ROLE_DEFINITIONS).map((r) => (
            <div
              key={r.role}
              onClick={() => setRoleFilter(roleFilter === r.role ? "ALL" : r.role)}
              className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center gap-2 ${
                roleFilter === r.role
                  ? `${r.activeBorder} ${r.activeBg} font-bold shadow-xs`
                  : "bg-white border-stone-200 hover:border-[#D4AF37]/50"
              }`}
            >
              <span className="text-base">{r.symbol}</span>
              <div className="min-w-0">
                <span className="block font-bold text-stone-800 truncate text-[11px]">
                  {r.role}
                </span>
                <span className="text-[10px] text-stone-500 truncate block">
                  {r.allowedPermissions.length} សិទ្ធិលំនាំដើម
                </span>
              </div>
            </div>
          ))}
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
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all cursor-pointer ${
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
              className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all flex items-center gap-1 cursor-pointer ${
                roleFilter === "SUPERADMIN"
                  ? "bg-red-600 text-white font-bold"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              <span>🔴</span>
              <span>Superadmin</span>
            </button>
          )}
          <button
            onClick={() => setRoleFilter("COUPLE")}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all flex items-center gap-1 cursor-pointer ${
              roleFilter === "COUPLE"
                ? "bg-emerald-600 text-white font-bold"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            <span>🟢</span>
            <span>Couple</span>
          </button>
          <button
            onClick={() => setRoleFilter("ORGANIZER")}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all flex items-center gap-1 cursor-pointer ${
              roleFilter === "ORGANIZER"
                ? "bg-purple-600 text-white font-bold"
                : "bg-purple-50 text-purple-700 hover:bg-purple-100"
            }`}
          >
            <span>🟣</span>
            <span>Organizer</span>
          </button>
          <button
            onClick={() => setRoleFilter("GUEST")}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all flex items-center gap-1 cursor-pointer ${
              roleFilter === "GUEST"
                ? "bg-amber-600 text-white font-bold"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            <span>🔒</span>
            <span>Viewer (No Permissions)</span>
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
                <th className="py-3.5 px-4 font-semibold">សិទ្ធិ Checkboxes &amp; Symbols</th>
                <th className="py-3.5 px-4 font-semibold">កាលបរិច្ឆេទ</th>
                <th className="py-3.5 px-4 font-semibold text-right">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.map((u) => {
                const isMe = u.id === currentUserId;
                const isTargetSuper = u.role === "SUPERADMIN";
                const roleDef = ROLE_DEFINITIONS[u.role] || ROLE_DEFINITIONS.GUEST;
                const effectivePerms = parseUserPermissions(u);
                const hasCustomPerms =
                  JSON.stringify([...effectivePerms].sort()) !==
                  JSON.stringify([...(roleDef.allowedPermissions || [])].sort());

                return (
                  <tr key={u.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    {/* User Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shadow-xs border ${
                            u.role === "SUPERADMIN"
                              ? "bg-red-100 text-red-700 border-red-200"
                              : u.role === "COUPLE"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : u.role === "ORGANIZER"
                              ? "bg-purple-100 text-purple-700 border-purple-200"
                              : "bg-amber-100 text-amber-800 border-amber-200"
                          }`}
                        >
                          <span className="mr-0.5">{roleDef.symbol}</span>
                          <span>{u.name.charAt(0).toUpperCase()}</span>
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

                    {/* Role Display / Quick Select */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {isSuperadmin ? (
                          <select
                            value={u.role}
                            onChange={(e) => handleQuickRoleChange(u.id, e.target.value)}
                            disabled={isMe}
                            className="px-2.5 py-1.5 bg-white border border-[#D4AF37]/40 rounded-xl text-xs font-bold text-[#2C2A29] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] disabled:opacity-60 cursor-pointer shadow-xs"
                          >
                            <option value="SUPERADMIN">🔴 SUPERADMIN (មេប្រព័ន្ធ)</option>
                            <option value="COUPLE">🟢 COUPLE (ម្ចាស់ពិធី)</option>
                            <option value="ORGANIZER">🟣 ORGANIZER (អ្នកសម្របសម្រួល)</option>
                            <option value="GUEST">🔒 GUEST (គ្មានសិទ្ធិ - Read-Only)</option>
                          </select>
                        ) : (
                          <div>
                            {isTargetSuper ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
                                <span>🔴</span>
                                <span>SUPERADMIN</span>
                              </span>
                            ) : (
                              <select
                                value={u.role}
                                onChange={(e) => handleQuickRoleChange(u.id, e.target.value)}
                                disabled={isMe || isTargetSuper}
                                className="px-2.5 py-1.5 bg-white border border-[#D4AF37]/40 rounded-xl text-xs font-bold text-[#2C2A29] focus:outline-none focus:border-[#D4AF37] disabled:opacity-60 cursor-pointer shadow-xs"
                              >
                                <option value="COUPLE" disabled>🟢 COUPLE</option>
                                <option value="ORGANIZER">🟣 ORGANIZER (Staff)</option>
                                <option value="GUEST">🔒 GUEST (No Permission)</option>
                              </select>
                            )}
                          </div>
                        )}
                        <span className="text-[10px] text-stone-400 block font-khmer">
                          {roleDef.titleKh}
                        </span>
                      </div>
                    </td>

                    {/* Permissions Symbols & Checkbox Badges */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5">
                        {/* Summary Pill */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>
                              {effectivePerms.length} / {PERMISSION_ITEMS.length} សិទ្ធិបានធីក (Checked)
                            </span>
                          </span>

                          {hasCustomPerms && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                              ⚡ សិទ្ធិកំណត់ផ្ទាល់ខ្លួន (Custom)
                            </span>
                          )}
                        </div>

                        {/* Clickable Symbols & Text Grid */}
                        <div className="flex flex-wrap items-center gap-1">
                          {PERMISSION_ITEMS.map((perm) => {
                            const isChecked = effectivePerms.includes(perm.id);
                            return (
                              <button
                                key={perm.id}
                                type="button"
                                onClick={() => openInspector(u)}
                                title={`${perm.nameKh} (${perm.nameEn}): ${
                                  isChecked ? "បានធីកអនុញ្ញាត (Checked / Allowed)" : "មិនបានធីក (Unchecked)"
                                }`}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                                  isChecked
                                    ? "bg-emerald-50/80 border border-emerald-300 text-emerald-900 hover:bg-emerald-100 shadow-2xs"
                                    : "bg-stone-100/40 text-stone-400 line-through opacity-50 border border-dashed border-stone-200"
                                }`}
                              >
                                <span>{perm.symbol}</span>
                                <span className="font-khmer">{perm.nameKh.split(" ")[0]}</span>
                                {isChecked ? (
                                  <span className="text-emerald-700 font-bold">☑</span>
                                ) : (
                                  <span className="text-stone-400 font-bold">☐</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-stone-500 text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openInspector(u)}
                          className="px-2.5 py-1.5 rounded-xl border border-[#D4AF37]/50 bg-[#FAF8F5] hover:bg-[#D4AF37]/20 text-[#AA7C11] font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
                          title="ពិនិត្យ និងធីក/ដកធីកសិទ្ធិ (Inspect & Check/Uncheck Permissions)"
                        >
                          <CheckSquare className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">ធីក / កែសិទ្ធិ</span>
                        </button>

                        {!isMe && (!isTargetSuper || isSuperadmin) && (
                          <button
                            onClick={() => setDeleteTarget(u)}
                            className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
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
      {/* MODAL 1: CREATE USER WITH CLICKABLE CHECKBOXES & SYMBOLS     */}
      {/* ============================================================ */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D4AF37]/40 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#AA7C11]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2C2A29]">
                    បង្កើតអ្នកប្រើប្រាស់ថ្មី (Create User &amp; Assign Permissions)
                  </h3>
                  <p className="text-[11px] text-[#3E444A]/70 font-khmer">
                    ចុចជ្រើសរើសតួនាទី និងអាច <strong className="text-amber-800">ធីក (Check) ឬដកធីក (Uncheck)</strong> សិទ្ធិនីមួយៗដោយសេរី
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

            <form onSubmit={handleCreateUser} className="space-y-5 pt-4">
              {/* Basic Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-[#2C2A29] mb-1.5 font-khmer">
                    ឈ្មោះពេញ (Full Name) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="ឧ. សុខ វិសាល / Victoria"
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-[#2C2A29] mb-1.5 font-khmer">
                    អ៊ីមែលចូលប្រើ (Login Email) <span className="text-red-500">*</span>
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
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-[#2C2A29] mb-1.5 font-khmer">
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* ROLE SELECTION CARDS */}
              <div>
                <label className="block text-xs font-bold text-[#2C2A29] mb-2 font-khmer flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-[#AA7C11]" />
                    <span>ជ្រើសរើសតួនាទីគោល (Select Base Role)</span>
                  </span>
                  <span className="text-[11px] font-normal text-stone-400">
                    តួនាទីបច្ចុប្បន្ន: <strong className="text-stone-700">{formData.role}</strong>
                  </span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {availableRolesForCreation.map((roleKey) => {
                    const r = ROLE_DEFINITIONS[roleKey];
                    const isSelected = formData.role === roleKey;

                    return (
                      <div
                        key={roleKey}
                        onClick={() => handleSelectRoleInCreate(roleKey)}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-2 text-left ${
                          isSelected
                            ? `${r.activeBorder} ${r.activeBg} shadow-sm`
                            : "border-stone-200 bg-white hover:border-[#D4AF37]/50 hover:bg-[#FAF8F5]/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl p-1.5 rounded-xl bg-white shadow-2xs border border-stone-100">
                              {r.symbol}
                            </span>
                            <div>
                              <div className="font-bold text-xs sm:text-sm text-[#2C2A29] flex items-center gap-1.5">
                                <span>{r.role}</span>
                                {roleKey === "GUEST" && (
                                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                                    Default Viewer
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-stone-600 block font-khmer">
                                {r.titleKh}
                              </span>
                            </div>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center border text-xs shrink-0 transition-all ${
                              isSelected
                                ? "bg-[#D4AF37] text-white border-[#AA7C11]"
                                : "border-stone-300 bg-white"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        <p className="text-[11px] text-stone-500 font-khmer leading-snug">
                          {r.descKh}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* GRANULAR PERMISSIONS WITH CHECKBOXES (CHECK / UNCHECK) */}
              <div className="bg-[#FAF8F5] p-4 sm:p-5 rounded-3xl border border-[#D4AF37]/35 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#D4AF37]/20">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#AA7C11]" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#2C2A29]">
                        កំណត់សិទ្ធិលម្អិតតាម Checkbox (Granular Permissions)
                      </h4>
                      <p className="text-[10px] text-stone-500 font-khmer">
                        ចុចលើប្រអប់ Checkbox ឬកាតសិទ្ធិដើម្បី <strong className="text-emerald-700">ធីក (Check)</strong> ឬ <strong className="text-stone-700">ដកធីក (Uncheck)</strong>
                      </p>
                    </div>
                  </div>

                  {/* Quick Check/Uncheck Tools */}
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={checkAllFormPermissions}
                      className="px-2 py-1 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-[10px] font-semibold text-stone-700 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                      title="ជ្រើសរើសធីកទាំងអស់"
                    >
                      <CheckSquare className="w-3 h-3 text-emerald-600" />
                      <span>ធីកទាំងអស់ (Check All)</span>
                    </button>
                    <button
                      type="button"
                      onClick={uncheckAllFormPermissions}
                      className="px-2 py-1 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-[10px] font-semibold text-stone-700 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                      title="ដកធីកទាំងអស់"
                    >
                      <Square className="w-3 h-3 text-stone-400" />
                      <span>ដកធីក (Uncheck All)</span>
                    </button>
                    <button
                      type="button"
                      onClick={resetFormPermissionsToRole}
                      className="px-2 py-1 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 rounded-lg text-[10px] font-bold text-[#AA7C11] flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                      title="កំណត់ឡើងវិញតាម Role"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Role</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>
                    សិទ្ធិដែលបានធីកអនុញ្ញាត: <strong className="text-emerald-700">{formPermissions.length}</strong> / {PERMISSION_ITEMS.length}
                  </span>
                  {formPermissions.length === 0 && (
                    <span className="text-amber-800 text-[11px] font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      🔒 គ្មានសិទ្ធិអ្វីទាំងអស់ (Zero Permissions)
                    </span>
                  )}
                </div>

                {/* 2-Column Checkbox Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PERMISSION_ITEMS.map((perm) => {
                    const isChecked = formPermissions.includes(perm.id);
                    const isExpanded = selectedPermDetails === perm.id;

                    return (
                      <div
                        key={perm.id}
                        className={`p-3 rounded-2xl border transition-all text-xs flex flex-col justify-between gap-1.5 ${
                          isChecked
                            ? "bg-white border-emerald-400/80 shadow-xs ring-1 ring-emerald-400/20"
                            : "bg-white/60 border-stone-200 hover:border-stone-300 opacity-80"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          {/* Left: Checkbox + Symbol + Text */}
                          <div
                            onClick={() => toggleFormPermission(perm.id)}
                            className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                          >
                            <div
                              className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
                                isChecked
                                  ? "bg-emerald-600 border-emerald-700 text-white shadow-2xs"
                                  : "border-stone-300 bg-white hover:border-stone-400"
                              }`}
                            >
                              {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>

                            <span className="text-lg p-1 rounded-lg bg-[#FAF8F5] border border-stone-200/80 shrink-0">
                              {perm.symbol}
                            </span>

                            <div className="min-w-0">
                              <span
                                className={`font-bold text-[11px] block truncate font-khmer ${
                                  isChecked ? "text-[#2C2A29]" : "text-stone-500"
                                }`}
                              >
                                {perm.nameKh}
                              </span>
                              <span className="text-[10px] text-stone-400 truncate block">
                                {perm.nameEn}
                              </span>
                            </div>
                          </div>

                          {/* Right: Status Pill & Info Toggle */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              onClick={() => toggleFormPermission(perm.id)}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer select-none border ${
                                isChecked
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  : "bg-stone-100 text-stone-500 border-stone-200"
                              }`}
                            >
                              {isChecked ? "✓ បានធីក" : "☐ មិនបានធីក"}
                            </span>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPermDetails(isExpanded ? null : perm.id);
                              }}
                              className="text-stone-400 hover:text-stone-600 p-1 rounded-md hover:bg-stone-100 cursor-pointer"
                              title="មើលការពន្យល់"
                            >
                              <Info className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Expandable Explanation Details */}
                        {isExpanded && (
                          <div className="mt-1 pt-2 border-t border-stone-100 text-[10px] text-stone-600 font-khmer animate-in fade-in">
                            <p className="mb-1">{perm.descKh}</p>
                            <span className="text-stone-400 block">
                              {isChecked
                                ? "✓ គណនីនេះត្រូវបានអនុញ្ញាតឱ្យប្រើប្រាស់មុខងារនេះ។"
                                : "✕ គណនីនេះត្រូវបានបិទសិទ្ធិមិនឱ្យប្រើប្រាស់មុខងារនេះឡើយ។"}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
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
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs font-bold shadow hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {loading ? (
                    <span>កំពុងបង្កើត...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>បង្កើតគណនី (Save User &amp; Permissions)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: INSPECT & CHECK/UNCHECK PERMISSIONS FOR A USER      */}
      {/* ============================================================ */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D4AF37]/40 max-h-[90vh] overflow-y-auto space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FAF8F5] to-amber-100/50 border border-[#D4AF37]/40 flex items-center justify-center text-xl shadow-xs">
                  {ROLE_DEFINITIONS[inspectSelectedRole]?.symbol || "🛡️"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2C2A29]">
                      ពិនិត្យ &amp; កែសម្រួលសិទ្ធិ: {inspectUser.name}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500">
                    {inspectUser.email} &bull; តួនាទីបច្ចុប្បន្ន: <strong className="text-[#AA7C11]">{inspectUser.role}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInspectUser(null)}
                className="text-stone-400 hover:text-stone-600 p-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Clickable Role Switcher Cards with Symbols & Text */}
            <div>
              <label className="block text-xs font-bold text-[#2C2A29] mb-2 font-khmer flex items-center justify-between">
                <span>ចុចផ្លាស់ប្តូរតួនាទី (Switch Role):</span>
                {inspectSelectedRole !== inspectUser.role && (
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    * មានការផ្លាស់ប្តូរដែលមិនទាន់រក្សាទុក
                  </span>
                )}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(isSuperadmin
                  ? ["GUEST", "ORGANIZER", "COUPLE", "SUPERADMIN"]
                  : ["GUEST", "ORGANIZER"]
                ).map((roleKey) => {
                  const r = ROLE_DEFINITIONS[roleKey];
                  const isSelected = inspectSelectedRole === roleKey;
                  const isUserActiveRole = inspectUser.role === roleKey;

                  return (
                    <div
                      key={roleKey}
                      onClick={() => handleSelectRoleInInspector(roleKey)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-1.5 text-left ${
                        isSelected
                          ? `${r.activeBorder} ${r.activeBg} shadow-sm`
                          : "border-stone-200 bg-white hover:border-[#D4AF37]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{r.symbol}</span>
                          <div>
                            <div className="font-bold text-xs sm:text-sm text-[#2C2A29] flex items-center gap-1.5">
                              <span>{r.role}</span>
                              {isUserActiveRole && (
                                <span className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded font-bold">
                                  Current
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-stone-500 font-khmer block">
                              {r.titleKh}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border text-xs shrink-0 ${
                            isSelected
                              ? "bg-[#D4AF37] text-white border-[#AA7C11]"
                              : "border-stone-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <p className="text-[10px] text-stone-500 font-khmer">
                        {r.descKh}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Checkboxes Section (Check / Uncheck individual permissions) */}
            <div className="bg-[#FAF8F5] p-4 sm:p-5 rounded-3xl border border-[#D4AF37]/35 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#D4AF37]/20">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#AA7C11]" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#2C2A29]">
                      កែសម្រួលសិទ្ធិដោយ Check / Uncheck
                    </h4>
                    <p className="text-[10px] text-stone-500 font-khmer">
                      អ្នកអាចចុចធីក (Check) ឬដកធីក (Uncheck) សិទ្ធិនីមួយៗដោយសេរីសម្រាប់អ្នកប្រើនេះ៖
                    </p>
                  </div>
                </div>

                {/* Quick Check/Uncheck Tools */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={checkAllInspectPermissions}
                    className="px-2 py-1 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-[10px] font-semibold text-stone-700 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                    title="ជ្រើសរើសធីកទាំងអស់"
                  >
                    <CheckSquare className="w-3 h-3 text-emerald-600" />
                    <span>ធីកទាំងអស់</span>
                  </button>
                  <button
                    type="button"
                    onClick={uncheckAllInspectPermissions}
                    className="px-2 py-1 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-[10px] font-semibold text-stone-700 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                    title="ដកធីកទាំងអស់"
                  >
                    <Square className="w-3 h-3 text-stone-400" />
                    <span>ដកធីក</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetInspectPermissionsToRole}
                    className="px-2 py-1 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 rounded-lg text-[10px] font-bold text-[#AA7C11] flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                    title="កំណត់ឡើងវិញតាម Role"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Role</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                <span>
                  សិទ្ធិដែលបានធីកអនុញ្ញាត: <strong className="text-emerald-700">{inspectPermissions.length}</strong> / {PERMISSION_ITEMS.length}
                </span>
                {inspectPermissions.length === 0 && (
                  <span className="text-amber-800 text-[11px] font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    🔒 គ្មានសិទ្ធិអ្វីទាំងអស់ (Zero Permissions)
                  </span>
                )}
              </div>

              {/* 2-Column Checkboxes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PERMISSION_ITEMS.map((perm) => {
                  const isChecked = inspectPermissions.includes(perm.id);
                  const isExpanded = inspectActivePerm === perm.id;

                  return (
                    <div
                      key={perm.id}
                      className={`p-3 rounded-2xl border transition-all text-xs flex flex-col justify-between gap-1.5 ${
                        isChecked
                          ? "bg-white border-emerald-400/80 shadow-xs ring-1 ring-emerald-400/20"
                          : "bg-white/60 border-stone-200 hover:border-stone-300 opacity-80"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        {/* Left: Checkbox + Symbol + Text */}
                        <div
                          onClick={() => toggleInspectPermission(perm.id)}
                          className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                        >
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
                              isChecked
                                ? "bg-emerald-600 border-emerald-700 text-white shadow-2xs"
                                : "border-stone-300 bg-white hover:border-stone-400"
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>

                          <span className="text-lg p-1 rounded-lg bg-[#FAF8F5] border border-stone-200/80 shrink-0">
                            {perm.symbol}
                          </span>

                          <div className="min-w-0">
                            <span
                              className={`font-bold text-[11px] block truncate font-khmer ${
                                isChecked ? "text-[#2C2A29]" : "text-stone-500"
                              }`}
                            >
                              {perm.nameKh}
                            </span>
                            <span className="text-[10px] text-stone-400 truncate block">
                              {perm.nameEn}
                            </span>
                          </div>
                        </div>

                        {/* Right: Status Pill & Info Toggle */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            onClick={() => toggleInspectPermission(perm.id)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer select-none border ${
                              isChecked
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : "bg-stone-100 text-stone-500 border-stone-200"
                            }`}
                          >
                            {isChecked ? "✓ បានធីក" : "☐ មិនបានធីក"}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setInspectActivePerm(isExpanded ? null : perm.id);
                            }}
                            className="text-stone-400 hover:text-stone-600 p-1 rounded-md hover:bg-stone-100 cursor-pointer"
                            title="មើលការពន្យល់"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Expandable Explanation Details */}
                      {isExpanded && (
                        <div className="mt-1 pt-2 border-t border-stone-100 text-[10px] text-stone-600 font-khmer animate-in fade-in">
                          <p className="mb-1">{perm.descKh}</p>
                          <span className="text-stone-400 block">
                            {isChecked
                              ? `✓ អនុញ្ញាតឱ្យ ${inspectUser.name} ប្រើមុខងារនេះ។`
                              : `✕ ហាមឃាត់មិនឱ្យប្រើមុខងារនេះឡើយ។`}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setInspectUser(null)}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl text-stone-600 hover:bg-stone-100 transition-all cursor-pointer"
              >
                បោះបង់ (Cancel)
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleSaveInspectUser}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs font-bold shadow hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {loading ? (
                  <span>កំពុងរក្សាទុក...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>រក្សាទុកសិទ្ធិ (Save Role &amp; Permissions)</span>
                  </>
                )}
              </button>
            </div>
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
    </div>
  );
}