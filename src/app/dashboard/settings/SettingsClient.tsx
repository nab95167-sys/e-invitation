"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Download,
  Send,
  CheckCircle2,
  AlertTriangle,
  User,
  KeyRound,
  Database,
  Bell,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Info,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date | string;
}

interface SettingsClientProps {
  user: UserProfile;
  stats: {
    totalGuests: number;
    totalGifts: number;
    totalWishes: number;
    totalEvents: number;
  };
}

export default function SettingsClient({ user, stats }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<"security" | "backup" | "telegram" | "health">("security");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Telegram test state
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [telegramResult, setTelegramResult] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Backup state
  const [backupLoading, setBackupLoading] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!currentPassword || !newPassword) {
      setPasswordMessage({ type: "error", text: "សូមបញ្ចូលលេខសម្ងាត់បច្ចុប្បន្ន និងលេខសម្ងាត់ថ្មី" });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "លេខសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច ៦ តួអក្សរ" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "លេខសម្ងាត់ថ្មី និងការផ្ទៀងផ្ទាត់មិនដូចគ្នាទេ" });
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "បរាជ័យក្នុងការផ្លាស់ប្តូរលេខសម្ងាត់");
      }
      setPasswordMessage({ type: "success", text: "🎉 " + data.message });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordMessage({ type: "error", text: err.message || "មានបញ្ហាកើតឡើង" });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleTelegramTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setTelegramResult(null);

    if (!botToken.trim() || !chatId.trim()) {
      setTelegramResult({ type: "error", text: "សូមបញ្ចូល Bot Token និង Chat ID ជាមុនសិន" });
      return;
    }

    try {
      setTelegramLoading(true);
      const res = await fetch("/api/telegram/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botToken: botToken.trim(), chatId: chatId.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "បរាជ័យក្នុងការផ្ញើសារតេស្ត");
      }
      setTelegramResult({ type: "success", text: "✓ " + data.message });
    } catch (err: any) {
      setTelegramResult({ type: "error", text: err.message || "មានបញ្ហាក្នុងការផ្ញើសារ" });
    } finally {
      setTelegramLoading(false);
    }
  };

  const handleDownloadBackup = async () => {
    try {
      setBackupLoading(true);
      const res = await fetch("/api/backup");
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to download backup");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const dateStr = new Date().toISOString().split("T")[0];
      a.download = `wedding-full-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      alert("បរាជ័យក្នុងការទាញយកទិន្នន័យ: " + e.message);
    } finally {
      setBackupLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#AA7C11] text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>High Security & Platform Controls</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#2C2A29]">
            ការកំណត់ & សុវត្ថិភាពប្រព័ន្ធ (Settings & Security)
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            គ្រប់គ្រងលេខសម្ងាត់ផ្ទាល់ខ្លួន, ការពារការលួចចូល, ទាញយកទិន្នន័យបម្រុងទុក និងភ្ជាប់ Telegram Bot
          </p>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 p-3 bg-white border border-[#D4AF37]/30 rounded-2xl shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#AA7C11] flex items-center justify-center text-white font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="text-xs font-bold text-[#2C2A29]">{user.name}</div>
            <div className="text-[11px] text-stone-500">{user.email}</div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {user.role}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-stone-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "security"
              ? "bg-white text-[#2C2A29] shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <KeyRound className="w-3.5 h-3.5 text-[#AA7C11]" />
          <span>ប្តូរលេខសម្ងាត់ (Password)</span>
        </button>

        <button
          onClick={() => setActiveTab("backup")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "backup"
              ? "bg-white text-[#2C2A29] shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <Database className="w-3.5 h-3.5 text-blue-600" />
          <span>ទិន្នន័យបម្រុងទុក (Full Backup)</span>
        </button>

        <button
          onClick={() => setActiveTab("telegram")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "telegram"
              ? "bg-white text-[#2C2A29] shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <Bell className="w-3.5 h-3.5 text-sky-600" />
          <span>Telegram Bot Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab("health")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "health"
              ? "bg-white text-[#2C2A29] shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>ស្ថានភាពសុវត្ថិភាព (Security Health)</span>
        </button>
      </div>

      {/* Tab 1: Change Password */}
      {activeTab === "security" && (
        <div className="bg-white border border-[#D4AF37]/30 rounded-3xl p-6 shadow-luxury space-y-6 max-w-xl animate-in fade-in duration-200">
          <div>
            <h2 className="text-base font-bold text-[#2C2A29] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#AA7C11]" />
              <span>ផ្លាស់ប្តូរលេខសម្ងាត់ផ្ទាល់ខ្លួន (Change Password)</span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              សូមប្រើលេខសម្ងាត់ដែលមានតួអក្សរធំ តូច លេខ និងសញ្ញា ដើម្បីធានាសុវត្ថិភាពខ្ពស់បំផុត
            </p>
          </div>

          {passwordMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
                passwordMessage.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {passwordMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{passwordMessage.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                លេខសម្ងាត់បច្ចុប្បន្ន (Current Password)
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="បញ្ចូលលេខសម្ងាត់ចាស់របស់អ្នក..."
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-2xl text-xs text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                លេខសម្ងាត់ថ្មី (New Password)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="យ៉ាងហោចណាស់ ៦ តួអក្សរ..."
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-2xl text-xs text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                ផ្ទៀងផ្ទាត់លេខសម្ងាត់ថ្មី (Confirm New Password)
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="បញ្ចូលលេខសម្ងាត់ថ្មីម្តងទៀត..."
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-2xl text-xs text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs font-bold shadow-luxury hover:brightness-105 transition-all flex items-center justify-center gap-2"
            >
              {passwordLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>កំពុងផ្លាស់ប្តូរ...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>រក្សាទុកលេខសម្ងាត់ថ្មី</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: System Backup */}
      {activeTab === "backup" && (
        <div className="bg-white border border-[#D4AF37]/30 rounded-3xl p-6 shadow-luxury space-y-6 max-w-2xl animate-in fade-in duration-200">
          <div>
            <h2 className="text-base font-bold text-[#2C2A29] flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span>ទាញយកទិន្នន័យបម្រុងទុក (One-Click Full Database Backup)</span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              រក្សាទុកទិន្នន័យទាំងអស់នៃមង្គលការ (ភ្ញៀវ, កត់ចំណងដៃ, ពាក្យជូនពរ, រូបភាព) ជា File JSON ក្នុងកុំព្យូទ័រ
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-center">
              <span className="text-lg font-bold text-[#2C2A29]">{stats.totalGuests}</span>
              <span className="text-[11px] text-stone-500 block">ភ្ញៀវសរុប</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-center">
              <span className="text-lg font-bold text-amber-700">{stats.totalGifts}</span>
              <span className="text-[11px] text-stone-500 block">កត់ចំណងដៃ</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-center">
              <span className="text-lg font-bold text-emerald-700">{stats.totalWishes}</span>
              <span className="text-[11px] text-stone-500 block">ពាក្យជូនពរ</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-center">
              <span className="text-lg font-bold text-purple-700">{stats.totalEvents}</span>
              <span className="text-[11px] text-stone-500 block">កម្មវិធី</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              <span>ការការពារទិន្នន័យ ១០០% (Zero Data Loss)</span>
            </div>
            <p className="text-[11px] text-blue-800/80 leading-relaxed">
              អ្នកអាចទាញយក Backup នេះបានគ្រប់ពេល មុន ឬក្រោយថ្ងៃមង្គលការ។ ទិន្នន័យនេះរួមបញ្ចូលទាំងតារាងភ្ញៀវ, ចំនួនទឹកប្រាក់ចំណងដៃ, និងប្រវត្តិទាំងអស់។
            </p>
          </div>

          <button
            onClick={handleDownloadBackup}
            disabled={backupLoading}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            {backupLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>កំពុងបង្កើត File Backup...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>ទាញយក Full Database Backup (.json)</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Tab 3: Telegram Bot */}
      {activeTab === "telegram" && (
        <div className="bg-white border border-[#D4AF37]/30 rounded-3xl p-6 shadow-luxury space-y-6 max-w-xl animate-in fade-in duration-200">
          <div>
            <h2 className="text-base font-bold text-[#2C2A29] flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-600" />
              <span>ភ្ជាប់ការជូនដំណឹងទៅកាន់ Telegram (Telegram Bot Alerts)</span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              ទទួលបានការផ្ញើសារភ្លាមៗចូលក្នុង Telegram Group រាល់ពេលមានភ្ញៀវ RSVP, ជូនពរ, ឬកត់ចំណងដៃ
            </p>
          </div>

          {telegramResult && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
                telegramResult.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {telegramResult.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{telegramResult.text}</span>
            </div>
          )}

          <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-2xl text-xs text-sky-900 space-y-1">
            <span className="font-bold">របៀបបង្កើត Telegram Bot ក្នុង ៣ ជំហាន៖</span>
            <ol className="list-decimal pl-4 space-y-0.5 text-[11px] text-sky-800">
              <li>ចូល Telegram ស្វែងរក <b>@BotFather</b> រួចចុច <code>/newbot</code> ដើម្បីយក Bot Token</li>
              <li>បង្កើត Group Telegram រួច Add Bot ចូលទៅក្នុង Group នោះ</li>
              <li>យក Chat ID របស់ Group នោះមកដាក់ខាងក្រោម រួចចុច Test</li>
            </ol>
          </div>

          <form onSubmit={handleTelegramTest} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Telegram Bot Token
              </label>
              <input
                type="text"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="ឧ. 7123456789:AAHk..."
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-2xl text-xs text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Telegram Chat ID (ឬ Group ID)
              </label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="ឧ. -1001234567890 ឬ @mychannel"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-2xl text-xs text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              disabled={telegramLoading}
              className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              {telegramLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>កំពុងផ្ញើសារតេស្ត...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>ផ្ញើសារសាកល្បង (Test Connection)</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Security Health */}
      {activeTab === "health" && (
        <div className="bg-white border border-[#D4AF37]/30 rounded-3xl p-6 shadow-luxury space-y-6 max-w-2xl animate-in fade-in duration-200">
          <div>
            <h2 className="text-base font-bold text-[#2C2A29] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>ស្ថានភាពសុវត្ថិភាពប្រព័ន្ធ (Security Health Status)</span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              ការការពារគ្រប់កម្រិត (Network Edge, Route Blocking, Brute-Force Defense)
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900">Next.js Edge Middleware Firewall</h4>
                <p className="text-[11px] text-emerald-800/80 mt-0.5">
                  ការពារគ្រប់ផ្លូវ `/dashboard/*` និង APIs ដោយស្វ័យប្រវត្តិនៅកម្រិត Edge Network។ រាល់ Request ដែលគ្មាន Token ត្រូវបាន Block ភ្លាមៗ។
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900">Brute-Force Attack Lockout Protection</h4>
                <p className="text-[11px] text-emerald-800/80 mt-0.5">
                  ប្រព័ន្ធចាក់សោរ IP ឬគណនីរយៈពេល ១៥ នាទី បើព្យាយាមបញ្ចូលលេខសម្ងាត់ខុស ៥ ដងជាប់គ្នា ការពារ Hacker ប្រើប្រាស់ Bot ទាយលេខសម្ងាត់។
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900">Zero Hardcoded Backdoors</h4>
                <p className="text-[11px] text-emerald-800/80 mt-0.5">
                  លេខសម្ងាត់ Fallback សង្គ្រោះត្រូវបានដកចេញទាំងស្រុង។ ការ Login ផ្ទៀងផ្ទាត់ជាមួយ Database តាមរយៈ Hash bcrypt (10 rounds) តែប៉ុណ្ណោះ។
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900">Strict HTTP Security Headers</h4>
                <p className="text-[11px] text-emerald-800/80 mt-0.5">
                  បំពាក់ `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, និង `Strict-Transport-Security` ការពារ Clickjacking & MIME sniffing។
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
