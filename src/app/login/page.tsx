"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#F3E5AB]/40 to-[#E8C5C8]/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] flex items-center justify-center shadow-luxury group-hover:scale-105 transition-transform">
            <Heart className="w-6 h-6 text-[#2C2A29] fill-[#2C2A29]" />
          </div>
        </Link>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#2C2A29]">
          Portal Sign In
        </h2>
        <p className="mt-2 text-sm text-[#3E444A]/80">
          Access the Wedding Command Center &amp; Security Controls
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white/90 backdrop-blur-md py-8 px-6 shadow-luxury-lg rounded-3xl sm:px-10 border border-[#D4AF37]/25">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 animate-fadeIn">
              <ShieldCheck className="w-5 h-5 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A]">
                Email Address
              </label>
              <div className="mt-2 relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#AA7C11]/60">
                  <Mail className="h-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@wedding.com"
                  className="block w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-2xl text-sm text-[#2C2A29] placeholder-[#3E444A]/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E444A]">
                Password
              </label>
              <div className="mt-2 relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#AA7C11]/60">
                  <Lock className="h-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-2xl text-sm text-[#2C2A29] placeholder-[#3E444A]/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#AA7C11] text-white font-medium text-sm shadow-luxury hover:brightness-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block animate-pulse">Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-8 pt-6 border-t border-[#D4AF37]/20">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#AA7C11] mb-3 text-center">
              Quick Demo Login (Click to test roles)
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => fillDemo("admin@wedding.com", "Admin@123456")}
                className="w-full text-left px-3 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F3E5AB]/40 border border-[#D4AF37]/20 text-xs flex items-center justify-between transition-colors"
              >
                <div>
                  <span className="font-semibold text-[#2C2A29]">Super Administrator</span>
                  <span className="block text-[11px] text-[#3E444A]/70">admin@wedding.com</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#AA7C11] text-[10px] font-bold">
                  SUPERADMIN
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo("alex.sophia@wedding.com", "Wedding@2026")}
                className="w-full text-left px-3 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F3E5AB]/40 border border-[#D4AF37]/20 text-xs flex items-center justify-between transition-colors"
              >
                <div>
                  <span className="font-semibold text-[#2C2A29]">Couple (Alex &amp; Sophia)</span>
                  <span className="block text-[11px] text-[#3E444A]/70">alex.sophia@wedding.com</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  COUPLE
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo("organizer@wedding.com", "Organizer@2026")}
                className="w-full text-left px-3 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F3E5AB]/40 border border-[#D4AF37]/20 text-xs flex items-center justify-between transition-colors"
              >
                <div>
                  <span className="font-semibold text-[#2C2A29]">Event Coordinator</span>
                  <span className="block text-[11px] text-[#3E444A]/70">organizer@wedding.com</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                  ORGANIZER
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
