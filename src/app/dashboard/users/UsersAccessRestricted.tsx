"use client";

import Link from "next/link";
import {
  ShieldAlert,
  Lock,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  User,
} from "lucide-react";
import type { TokenPayload } from "@/lib/auth";

interface UsersAccessRestrictedProps {
  user: TokenPayload;
}

export default function UsersAccessRestricted({ user }: UsersAccessRestrictedProps) {
  const roleDescriptions: Record<string, string> = {
    GUEST: "គណនីភ្ញៀវ/អ្នកមើល (Restricted Viewer) - គ្មានសិទ្ធិធ្វើសកម្មភាព ឬកែប្រែទិន្នន័យលើប្រព័ន្ធឡើយ (No system permissions).",
    ORGANIZER: "គណនីអ្នកសម្របសម្រួល (Event Coordinator) - មានសិទ្ធិត្រឹមតែស្វាគមន៍ និង Check-in ភ្ញៀវប៉ុណ្ណោះ។",
    COUPLE: "គណនីម្ចាស់កម្មវិធី (Wedding Host) - មានសិទ្ធិកែប្រែព័ត៌មានមង្គលការ និងភ្ញៀវរបស់ខ្លួន។",
    SUPERADMIN: "គណនីអ្នកគ្រប់គ្រងជាន់ខ្ពស់ (Superadmin) - មានសិទ្ធិពេញលេញលើប្រព័ន្ធទាំងមូល។",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Access Denied Hero Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-amber-300/60 shadow-card text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-[#D4AF37] to-red-400" />

        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto mb-4 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase font-bold tracking-widest text-amber-700 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
          Security Access Control • ការការពារសិទ្ធិ
        </span>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2A29] mt-3">
          សិទ្ធិប្រើប្រាស់ត្រូវបានការពារ (Access Restricted)
        </h1>

        <p className="text-sm text-[#3E444A]/80 max-w-xl mx-auto mt-2 font-khmer">
          ផ្នែកគ្រប់គ្រងអ្នកប្រើប្រាស់ និងកំណត់សិទ្ធិ (Manage User Roles) ត្រូវបានការពារដោយសុវត្ថិភាព។ គណនីរបស់អ្នកមិនមានសិទ្ធិគ្រប់គ្រាន់ក្នុងការចូលកែប្រែ ឬបន្ថែមសិទ្ធិលើប្រព័ន្ធឡើយ។
        </p>

        {/* Current User Badge */}
        <div className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#D4AF37]/30 text-left">
          <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#AA7C11]">
            <User className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#2C2A29] block">{user.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-500">{user.email}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-amber-100 text-amber-800 border border-amber-300">
                តួនាទី: {user.role}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-stone-500 mt-4 max-w-lg mx-auto">
          {roleDescriptions[user.role] || "គណនីរបស់អ្នកមិនមានសិទ្ធិកម្រិត Administrator ឡើយ។"}
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs sm:text-sm font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ត្រឡប់ទៅផ្ទាំងគ្រប់គ្រង (Back to Dashboard)</span>
          </Link>
        </div>
      </div>

      {/* Security RBAC Role Matrix Explanation */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/25 shadow-card space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
          <ShieldCheck className="w-5 h-5 text-[#AA7C11]" />
          <div>
            <h3 className="font-serif font-bold text-lg text-[#2C2A29]">
              តារាងកំណត់សិទ្ធិអ្នកប្រើប្រាស់ (System Role &amp; Permission Matrix)
            </h3>
            <p className="text-xs text-stone-500">
              ប្រព័ន្ធសុវត្ថិភាពចែកសិទ្ធិប្រើប្រាស់យ៉ាងតឹងរ៉ឹងទៅតាមតួនាទីនីមួយៗ
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#3E444A]/80 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3.5 font-semibold">តួនាទី (Security Role)</th>
                <th className="py-3 px-3 font-semibold text-center">មើលលិខិត &amp; ពរជ័យ</th>
                <th className="py-3 px-3 font-semibold text-center">កែប្រែកម្មវិធី &amp; Theme</th>
                <th className="py-3 px-3 font-semibold text-center">គ្រប់គ្រងភ្ញៀវ &amp; RSVP</th>
                <th className="py-3 px-3 font-semibold text-center">គ្រប់គ្រងអ្នកប្រើ &amp; សិទ្ធិ</th>
                <th className="py-3 px-3 font-semibold text-center">លុបទិន្នន័យលើប្រព័ន្ធ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr className="hover:bg-[#FAF8F5]">
                <td className="py-3 px-3.5 font-semibold text-red-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  SUPERADMIN
                </td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✔️</td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✔️</td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✔️</td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✔️</td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✔️</td>
              </tr>
              <tr className="hover:bg-[#FAF8F5]">
                <td className="py-3 px-3.5 font-semibold text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  COUPLE (ម្ចាស់ពិធី)
                </td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✔️</td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✔️</td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✔️</td>
                <td className="py-3 px-3 text-center text-stone-400 font-semibold">🔒 Helper/Viewer Only</td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✔️ (Own Data)</td>
              </tr>
              <tr className="hover:bg-[#FAF8F5]">
                <td className="py-3 px-3.5 font-semibold text-purple-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  ORGANIZER (អ្នកសម្របសម្រួល)
                </td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✔️</td>
                <td className="py-3 px-3 text-center text-stone-300">❌</td>
                <td className="py-3 px-3 text-center text-purple-600 font-semibold">Check-in Only</td>
                <td className="py-3 px-3 text-center text-stone-300">❌</td>
                <td className="py-3 px-3 text-center text-stone-300">❌</td>
              </tr>
              <tr className="hover:bg-[#FAF8F5] bg-amber-50/40">
                <td className="py-3 px-3.5 font-semibold text-amber-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  GUEST / VIEWER (គ្មានសិទ្ធិ)
                </td>
                <td className="py-3 px-3 text-center text-emerald-600 font-bold">✔️</td>
                <td className="py-3 px-3 text-center text-red-500 font-bold">❌ គ្មានសិទ្ធិ</td>
                <td className="py-3 px-3 text-center text-red-500 font-bold">❌ គ្មានសិទ្ធិ</td>
                <td className="py-3 px-3 text-center text-red-500 font-bold">❌ គ្មានសិទ្ធិ</td>
                <td className="py-3 px-3 text-center text-red-500 font-bold">❌ គ្មានសិទ្ធិ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
