import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Heart,
  Image as ImageIcon,
  ArrowUpRight,
  Sparkles,
  QrCode,
  Calendar,
} from "lucide-react";

export default async function DashboardOverviewPage() {
  const session = await getSession();

  // Find event
  const event = await prisma.event.findFirst({
    where: session?.role === "SUPERADMIN" ? {} : { userId: session?.userId },
    include: {
      guests: true,
      wishes: true,
      media: true,
    },
  });

  if (!event) {
    return (
      <div className="p-8 bg-white rounded-3xl border border-[#D4AF37]/30 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#2C2A29] mb-2">No Wedding Event Found</h2>
        <p className="text-sm text-[#3E444A]/80 mb-4">Please create or configure your wedding celebration first.</p>
        <Link
          href="/dashboard/event"
          className="px-6 py-2.5 rounded-full bg-[#D4AF37] text-white text-xs font-semibold"
        >
          Setup Event
        </Link>
      </div>
    );
  }

  const guests = event.guests;
  const totalGuests = guests.length;
  const attendingGuests = guests.filter((g) => g.rsvpStatus === "ATTENDING");
  const declinedGuests = guests.filter((g) => g.rsvpStatus === "DECLINED");
  const pendingGuests = guests.filter((g) => g.rsvpStatus === "PENDING");

  const totalHeadcount = attendingGuests.reduce((acc, curr) => acc + curr.attendeesCount, 0);
  const attendanceRate = totalGuests > 0 ? Math.round((attendingGuests.length / totalGuests) * 100) : 0;

  const totalPhotos = event.media.filter((m) => m.mediaType === "PHOTO").length;
  const totalVideos = event.media.filter((m) => m.mediaType === "VIDEO").length;

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#AA7C11] font-semibold">
            Wedding Control Center
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2A29]">
            {event.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#3E444A]/70 mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#AA7C11]" />
            <span>Event Date: {new Date(event.eventDate).toLocaleDateString()}</span>
            <span>•</span>
            <span>Venue: {event.venueName}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/guests"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs font-semibold shadow-luxury hover:brightness-105 transition-all flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Manage Guests</span>
          </Link>
          {guests.length > 0 ? (
            <Link
              href={`/invite/${event.slug}?code=${encodeURIComponent(guests[0].invitationCode)}&to=${encodeURIComponent(guests[0].name)}`}
              target="_blank"
              className="px-5 py-2.5 rounded-full bg-white border border-[#D4AF37]/30 text-[#2C2A29] text-xs font-semibold shadow-card hover:bg-[#FAF8F5] transition-all flex items-center gap-1.5"
            >
              <span>Live Guest Pass</span>
              <ArrowUpRight className="w-4 h-4 text-[#AA7C11]" />
            </Link>
          ) : (
            <Link
              href={`/invite/${event.slug}`}
              target="_blank"
              className="px-5 py-2.5 rounded-full bg-white border border-[#D4AF37]/30 text-[#2C2A29] text-xs font-semibold shadow-card hover:bg-[#FAF8F5] transition-all flex items-center gap-1.5"
            >
              <span>Live Preview</span>
              <ArrowUpRight className="w-4 h-4 text-[#AA7C11]" />
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Guests */}
        <div className="p-6 rounded-3xl bg-white border border-[#D4AF37]/25 shadow-card hover:shadow-luxury transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3E444A]">
              Total Invitations
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 flex items-center justify-center text-[#AA7C11]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2A29]">
              {totalGuests}
            </span>
            <span className="text-xs text-stone-500 font-medium">Invited Parties</span>
          </div>
          <span className="text-[11px] text-[#AA7C11] font-semibold mt-2 block">
            {totalHeadcount} Confirmed Headcount
          </span>
        </div>

        {/* Attending RSVPs */}
        <div className="p-6 rounded-3xl bg-white border border-[#D4AF37]/25 shadow-card hover:shadow-luxury transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3E444A]">
              Joyfully Attending
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-emerald-800">
              {attendingGuests.length}
            </span>
            <span className="text-xs text-emerald-600 font-medium">({attendanceRate}%)</span>
          </div>
          <span className="text-[11px] text-stone-500 mt-2 block">
            {pendingGuests.length} still pending response
          </span>
        </div>

        {/* Declined RSVPs */}
        <div className="p-6 rounded-3xl bg-white border border-[#D4AF37]/25 shadow-card hover:shadow-luxury transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3E444A]">
              Unable to Attend
            </span>
            <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-600">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-stone-700">
              {declinedGuests.length}
            </span>
            <span className="text-xs text-stone-400 font-medium">Declined</span>
          </div>
          <span className="text-[11px] text-stone-500 mt-2 block">
            Wishes received via guestbook
          </span>
        </div>

        {/* Guestbook Wishes */}
        <div className="p-6 rounded-3xl bg-white border border-[#D4AF37]/25 shadow-card hover:shadow-luxury transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3E444A]">
              Blessings &amp; Media
            </span>
            <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-700">
              <Heart className="w-5 h-5 fill-rose-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#2C2A29]">
              {event.wishes.length}
            </span>
            <span className="text-xs text-stone-500 font-medium">Wishes</span>
          </div>
          <span className="text-[11px] text-stone-500 mt-2 block">
            {totalPhotos} Photos • {totalVideos} Videos
          </span>
        </div>
      </div>

      {/* Recent Guest Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 cols: Recent Guests */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/25 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold text-[#2C2A29]">
              Recent Guest RSVP Activity
            </h2>
            <Link
              href="/dashboard/guests"
              className="text-xs font-semibold text-[#AA7C11] hover:underline"
            >
              View Full Guest List ({totalGuests})
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-[#3E444A]/70 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Guest</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Seats</th>
                  <th className="pb-3 font-semibold">Invite Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {guests.slice(0, 5).map((g) => (
                  <tr key={g.id} className="hover:bg-[#FAF8F5]">
                    <td className="py-3 font-semibold text-[#2C2A29]">{g.name}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#D4AF37]/30 text-[#AA7C11] text-[10px] font-medium">
                        {g.category}
                      </span>
                    </td>
                    <td className="py-3">
                      {g.rsvpStatus === "ATTENDING" && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Attending
                        </span>
                      )}
                      {g.rsvpStatus === "DECLINED" && (
                        <span className="inline-flex items-center gap-1 text-stone-500 font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> Declined
                        </span>
                      )}
                      {g.rsvpStatus === "PENDING" && (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-stone-700 font-medium">
                      {g.attendeesCount} / {g.maxGuests}
                    </td>
                    <td className="py-3 font-mono text-stone-500">{g.invitationCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right col: Quick Operations */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/25 shadow-card space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#2C2A29]">
            Quick Shortcuts
          </h2>

          <div className="space-y-3">
            <Link
              href="/dashboard/guests"
              className="w-full p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#F3E5AB]/30 border border-[#D4AF37]/20 flex items-center justify-between text-xs font-semibold text-[#2C2A29] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center text-[#AA7C11] group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <span>Add &amp; Share Guest Invites</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#AA7C11]" />
            </Link>

            <Link
              href="/dashboard/media"
              className="w-full p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#F3E5AB]/30 border border-[#D4AF37]/20 flex items-center justify-between text-xs font-semibold text-[#2C2A29] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center text-[#AA7C11] group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <span>Upload Photos &amp; Videos</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#AA7C11]" />
            </Link>

            <Link
              href="/dashboard/event"
              className="w-full p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#F3E5AB]/30 border border-[#D4AF37]/20 flex items-center justify-between text-xs font-semibold text-[#2C2A29] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center text-[#AA7C11] group-hover:scale-105 transition-transform">
                  <Calendar className="w-4 h-4" />
                </div>
                <span>Edit Venue &amp; Schedule</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#AA7C11]" />
            </Link>

            <Link
              href="/dashboard/wishes"
              className="w-full p-4 rounded-2xl bg-[#FAF8F5] hover:bg-[#F3E5AB]/30 border border-[#D4AF37]/20 flex items-center justify-between text-xs font-semibold text-[#2C2A29] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center text-[#AA7C11] group-hover:scale-105 transition-transform">
                  <Heart className="w-4 h-4" />
                </div>
                <span>Moderate Wishes ({event.wishes.length})</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#AA7C11]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
