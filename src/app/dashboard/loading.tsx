export default function DashboardLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Sleek Golden Progress Shimmer */}
      <div className="h-1 w-full bg-[#D4AF37]/15 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] rounded-full animate-pulse w-3/4" />
      </div>

      {/* Gentle Header Placeholder */}
      <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/15">
        <div className="space-y-1.5">
          <div className="h-3 w-28 bg-[#D4AF37]/20 rounded-full animate-pulse" />
          <div className="h-7 w-52 bg-stone-200/70 rounded-xl animate-pulse" />
        </div>
        <div className="h-9 w-32 bg-[#D4AF37]/15 rounded-xl animate-pulse" />
      </div>

      {/* Lightweight Content Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white/70 border border-[#D4AF37]/15 shadow-sm space-y-3"
          >
            <div className="h-3 w-24 bg-stone-200/70 rounded-full animate-pulse" />
            <div className="h-6 w-16 bg-stone-200 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
