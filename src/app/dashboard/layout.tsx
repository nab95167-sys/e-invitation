import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SidebarNav from "@/components/dashboard/SidebarNav";
import {
  Heart,
  LogOut,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const userEvent = await prisma.event.findFirst({
    where: session.role === "SUPERADMIN" ? {} : { userId: session.userId },
    select: { slug: true },
  });
  const eventSlug = userEvent?.slug || "davita-and-meassa";

  const roleColors: Record<string, string> = {
    SUPERADMIN: "bg-red-100 text-red-800 border-red-200",
    COUPLE: "bg-emerald-100 text-emerald-800 border-emerald-200",
    ORGANIZER: "bg-purple-100 text-purple-800 border-purple-200",
    GUEST: "bg-stone-100 text-stone-800 border-stone-200",
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-[#D4AF37]/20 flex flex-col justify-between shrink-0 shadow-xs">
        <div>
          {/* Logo / Brand */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] flex items-center justify-center shadow-luxury group-hover:scale-105 transition-transform">
                <Heart className="w-4 h-4 text-[#2C2A29] fill-[#2C2A29]" />
              </div>
              <span className="font-serif text-xl font-bold tracking-wide text-[#2C2A29]">
                Royal<span className="text-[#AA7C11]">Invite</span>
              </span>
            </Link>
          </div>

          {/* User Profile Pill */}
          <div className="p-3.5 mx-3 mt-3 rounded-2xl bg-[#FAF8F5] border border-[#D4AF37]/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2C2A29] truncate">{session.name}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  roleColors[session.role] || "bg-stone-100"
                }`}
              >
                {session.role}
              </span>
            </div>
            <span className="text-[11px] text-[#3E444A]/60 block truncate mt-0.5">
              {session.email}
            </span>
          </div>

          {/* High-Performance Client Nav with instant click states & prefetching */}
          <div className="mt-2">
            <SidebarNav userRole={session.role} />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-stone-100 space-y-2">
          <Link
            href={`/invite/${eventSlug}?code=vip-guest-01`}
            target="_blank"
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#D4AF37]/15 text-[#AA7C11] text-xs font-semibold hover:bg-[#D4AF37]/25 transition-all shadow-xs"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Preview Invite</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl text-stone-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
