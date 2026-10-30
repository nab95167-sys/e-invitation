"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Image as ImageIcon,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  Lock,
} from "lucide-react";

interface SidebarNavProps {
  userRole?: string;
}

interface NavItem {
  name: string;
  nameKm?: string;
  href: string;
  icon: any;
  superadminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: "Overview",
    nameKm: "ទិដ្ឋភាពទូទៅ",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Guests & RSVPs",
    nameKm: "ភ្ញៀវ & RSVP",
    href: "/dashboard/guests",
    icon: Users,
  },
  {
    name: "Event Details & Theme",
    nameKm: "ព័ត៌មាន & ម៉ូដកម្មវិធី",
    href: "/dashboard/event",
    icon: Calendar,
  },
  {
    name: "Photos & Videos",
    nameKm: "រូបភាព & វីដេអូ",
    href: "/dashboard/media",
    icon: ImageIcon,
  },
  {
    name: "Guestbook Wishes",
    nameKm: "សៀវភៅជូនពរ",
    href: "/dashboard/wishes",
    icon: MessageSquare,
  },
  {
    name: "Manage User Roles",
    nameKm: "គ្រប់គ្រងអ្នកប្រើ & សិទ្ធិ",
    href: "/dashboard/users",
    icon: ShieldAlert,
  },
];

export default function SidebarNav({ userRole }: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Instant optimistic active state for 0ms lag feedback
  const [optimisticPath, setOptimisticPath] = useState<string | null>(null);

  // Sync optimistic path when real pathname changes
  useEffect(() => {
    setOptimisticPath(null);
  }, [pathname]);

  // Aggressive background prefetching on mount: caches all pages in memory
  useEffect(() => {
    NAV_ITEMS.forEach((item) => {
      if (!item.superadminOnly || userRole === "SUPERADMIN") {
        router.prefetch(item.href);
      }
    });
  }, [router, userRole]);

  const activeRoute = optimisticPath || pathname;

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    // If already on the exact same page, prevent redundant navigation
    if (pathname === href) {
      e.preventDefault();
      return;
    }
    // Instantly reflect active state in UI with 0ms delay
    setOptimisticPath(href);
  };

  return (
    <nav className="p-3 space-y-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/dashboard"
            ? activeRoute === "/dashboard"
            : activeRoute.startsWith(item.href);
        const isRestricted =
          item.href === "/dashboard/users" &&
          userRole !== "SUPERADMIN" &&
          userRole !== "COUPLE";

        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={true}
            onClick={(e) => handleLinkClick(item.href, e)}
            onMouseEnter={() => {
              try {
                router.prefetch(item.href);
              } catch (_) {}
            }}
            className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all duration-100 ${
              isActive
                ? "bg-gradient-to-r from-[#D4AF37]/25 to-[#AA7C11]/15 text-[#845e0d] font-bold border border-[#D4AF37]/45 shadow-sm translate-x-0.5"
                : "text-[#3E444A] hover:bg-[#FAF8F5] hover:text-[#AA7C11] hover:translate-x-0.5"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-[#D4AF37] text-white shadow-xs"
                    : "bg-stone-100/70 text-[#AA7C11] group-hover:bg-[#D4AF37]/20"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="tracking-wide leading-tight">{item.name}</span>
                {item.nameKm && (
                  <span className="text-[10px] text-stone-400 font-normal leading-tight">
                    {item.nameKm}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {isRestricted && (
                <span
                  title="Requires Admin Privileges"
                  className="p-1 rounded-md bg-stone-100 text-stone-400 group-hover:text-amber-700 group-hover:bg-amber-50 transition-colors"
                >
                  <Lock className="w-3 h-3" />
                </span>
              )}

              {isActive ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[#AA7C11] animate-pulse" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
