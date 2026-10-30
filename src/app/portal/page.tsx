import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Heart,
  ShieldCheck,
  Sparkles,
  Share2,
  Users,
  Image as ImageIcon,
  QrCode,
  Music,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let eventSlug = "so-vith-and-ma-na";
  try {
    const event = await prisma.event.findFirst({ select: { slug: true } });
    if (event?.slug) {
      eventSlug = event.slug;
    }
  } catch (err) {
    console.warn("Could not query event for portal during build/runtime:", err);
  }
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2C2A29]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FAF8F5]/85 border-b border-[#D4AF37]/20 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] flex items-center justify-center shadow-luxury">
              <Heart className="w-5 h-5 text-[#2C2A29] fill-[#2C2A29]" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-wide text-[#2C2A29]">
                Royal<span className="text-[#D4AF37]">Invite</span>
              </span>
              <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-[#AA7C11] ml-2 font-medium">
                Wedding Platform
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href={`/invite/${eventSlug}?code=vip-guest-01`}
              className="text-sm font-medium text-[#2C2A29] hover:text-[#AA7C11] transition-colors hidden md:inline-flex items-center gap-1"
            >
              <span>Live Invitation Preview</span>
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-sm font-medium shadow-luxury hover:shadow-luxury-lg hover:scale-[1.02] transition-all duration-200"
            >
              Client & Admin Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#F3E5AB]/30 to-[#E8C5C8]/25 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-xs font-semibold text-[#AA7C11] uppercase tracking-wider mb-8 animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen High Security Wedding E-Invitation</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl font-bold tracking-tight text-[#2C2A29] mb-6 leading-tight">
            Celebrate Love with{" "}
            <span className="font-script text-[#AA7C11] text-6xl sm:text-8xl font-normal block sm:inline">
              Timeless Elegance
            </span>{" "}
            &amp; Enterprise Security
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-[#3E444A]/80 font-light mb-10 leading-relaxed">
            Create mesmerizing, interactive digital wedding invitations with wax-seal envelope animations,
            personalized guest links, photo &amp; video memories, role-based controls, and instant RSVP tracking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/invite/${eventSlug}?code=vip-guest-01`}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#AA7C11] text-white font-medium text-base shadow-luxury-lg hover:brightness-105 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Experience Guest Invitation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-[#D4AF37]/30 text-[#2C2A29] font-medium text-base hover:bg-[#FAF8F5] hover:border-[#D4AF37] transition-all duration-200 flex items-center justify-center gap-2 shadow-card"
            >
              <Users className="w-4 h-4 text-[#AA7C11]" />
              <span>Sign In to Dashboard</span>
            </Link>
          </div>

          {/* Quick Demo Credentials pill */}
          <div className="mt-8 inline-flex items-center gap-2 text-xs text-[#3E444A]/70 bg-white/70 backdrop-blur-sm border border-[#D4AF37]/20 px-4 py-2 rounded-xl">
            <span className="font-semibold text-[#AA7C11]">Demo Accounts:</span>
            <span>Admin: <code>admin@wedding.com</code></span>
            <span>•</span>
            <span>Couple: <code>alex.sophia@wedding.com</code></span>
            <span>•</span>
            <span>Pass: <code>Wedding@2026</code></span>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 bg-white/70 border-y border-[#D4AF37]/15">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2A29] mb-4">
              Engineered with Royal Aesthetics &amp; Modern Architecture
            </h2>
            <p className="text-base text-[#3E444A]/80 font-light">
              Everything couples and planners need to orchestrate a seamless, unforgettable wedding guest journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: High Security */}
            <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all hover:shadow-luxury group">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center text-[#AA7C11] mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2C2A29] mb-2">
                High Security &amp; Tokenized Links
              </h3>
              <p className="text-sm text-[#3E444A]/80 leading-relaxed mb-4">
                Anti-tamper invitation tokens, encrypted JWT sessions, HttpOnly cookies, rate-limited APIs to eliminate spam, and sanitization to block XSS and malicious scripts.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-[#AA7C11]">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero guest ID enumeration</span>
              </div>
            </div>

            {/* Feature 2: Personalized Sharing */}
            <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all hover:shadow-luxury group">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center text-[#AA7C11] mb-6 group-hover:scale-110 transition-transform">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2C2A29] mb-2">
                Personalized Sharing &amp; QR Codes
              </h3>
              <p className="text-sm text-[#3E444A]/80 leading-relaxed mb-4">
                Share uniquely tailored invitations directly via WhatsApp, Telegram, or SMS. Generate individualized QR codes for VIP table check-in.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-[#AA7C11]">
                <QrCode className="w-3.5 h-3.5" />
                <span>1-click WhatsApp message dispatch</span>
              </div>
            </div>

            {/* Feature 3: Photo & Video Upload */}
            <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all hover:shadow-luxury group">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center text-[#AA7C11] mb-6 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2C2A29] mb-2">
                Photo &amp; Video Memories
              </h3>
              <p className="text-sm text-[#3E444A]/80 leading-relaxed mb-4">
                Upload pre-wedding photo galleries and stream high-definition wedding teasers or YouTube videos with an interactive lightbox viewer.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-[#AA7C11]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>MIME-validated secure uploads</span>
              </div>
            </div>

            {/* Feature 4: Role-Based Management */}
            <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all hover:shadow-luxury group">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center text-[#AA7C11] mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2C2A29] mb-2">
                Role-Based Access Control (RBAC)
              </h3>
              <p className="text-sm text-[#3E444A]/80 leading-relaxed mb-4">
                Dedicated interfaces for Superadmins, Couples, and Event Organizers. Restrict sensitive guest lists while empowering coordinators.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-[#AA7C11]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Admin, Couple, Planner tiers</span>
              </div>
            </div>

            {/* Feature 5: Real-time RSVP Tracking */}
            <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all hover:shadow-luxury group">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center text-[#AA7C11] mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2C2A29] mb-2">
                Real-Time RSVP &amp; Guestbook
              </h3>
              <p className="text-sm text-[#3E444A]/80 leading-relaxed mb-4">
                Monitor headcount, dietary requirements (vegetarian, halal, allergies), table assignments, and celebrate real-time wishes from loved ones.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-[#AA7C11]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>CSV guest export in 1 click</span>
              </div>
            </div>

            {/* Feature 6: Ambient Music & Envelope FX */}
            <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all hover:shadow-luxury group">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center text-[#AA7C11] mb-6 group-hover:scale-110 transition-transform">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2C2A29] mb-2">
                Interactive Music &amp; Envelope
              </h3>
              <p className="text-sm text-[#3E444A]/80 leading-relaxed mb-4">
                Guests are greeted with an authentic wax seal opening animation, floating flower petals, and gentle background piano melodies.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-[#AA7C11]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mobile-first responsive design</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#FAF8F5] border-t border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
            <span className="font-serif font-bold text-[#2C2A29]">Royal E-Invitation System</span>
          </div>
          <p className="text-xs text-[#3E444A]/70">
            Crafted for unforgettable wedding memories. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-xs text-[#AA7C11]">
            <Link href="/login" className="hover:underline">Dashboard Login</Link>
            <Link href={`/invite/${eventSlug}?code=vip-guest-01`} className="hover:underline">Sample Invitation</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
