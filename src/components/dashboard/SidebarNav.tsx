"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Image as ImageIcon,
  MessageSquare,
  ShieldAlert,
  Loader2,
  ChevronRight,
} from "lucide-react";

interface SidebarNavProps {
  userRole?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
  superadminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Guests & RSVPs",
    href: "/dashboard/guests",
    icon: Users,
  },
  {
    name: "Event Details & Theme",
    href: "/dashboard/event",
    icon: Calendar,
  },
  {
    name: "Photos & Videos",
    href: "/dashboard/media",
    icon: ImageIcon,
  },
  {
    name: "Guestbook Wishes",
    href: "/dashboard/wishes",
    icon: MessageSquare,
  },
  {
    name: "Manage User Roles",
    href: "/dashboard/users",
    icon: ShieldAlert,
    superadminOnly: true,
  },
];

export default function SidebarNav({ userRole }: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [navigatingHref, setNavigatingHref] = useState<string | null>(null);

  // Clear navigating state when pathname changes
  useEffect(() => {
    setNavigatingHref(null);
  }, [pathname]);

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    if (pathname === href) {
      e.preventDefault();
      return;
    }
    setNavigatingHref(href);
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <nav className="p-3 space-y-1">
      {NAV_ITEMS.filter((item) => !item.superadminOnly || userRole === "SUPERADMIN").map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
        const isLoading = navigatingHref === item.href && isPending;

        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={true}
            onClick={(e) => handleNavClick(item.href, e)}
            onMouseEnter={() => {
              try {
                router.prefetch(item.href);
              } catch (_) {}
            }}
            className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all duration-150 ${
              isActive
                ? "bg-gradient-to-r from-[#D4AF37]/25 to-[#AA7C11]/15 text-[#845e0d] font-bold border border-[#D4AF37]/45 shadow-sm"
                : "text-[#3E444A] hover:bg-[#FAF8F5] hover:text-[#AA7C11]"
            } ${isLoading ? "opacity-80" : ""}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-[#D4AF37] text-white shadow-xs"
                    : "bg-stone-100/70 text-[#AA7C11] group-hover:bg-[#D4AF37]/20"
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              <span className="tracking-wide">{item.name}</span>
            </div>

            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#AA7C11] animate-pulse" />
            )}

            {!isActive && !isLoading && (
              <ChevronRight className="w-3.5 h-3.5 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
