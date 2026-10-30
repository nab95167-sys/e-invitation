export default function DashboardLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/15">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-[#D4AF37]/20 rounded-full" />
          <div className="h-8 w-64 bg-stone-200/80 rounded-2xl" />
          <div className="h-3 w-48 bg-stone-200/60 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-32 bg-[#D4AF37]/20 rounded-full" />
          <div className="h-10 w-28 bg-stone-200 rounded-full" />
        </div>
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-6 rounded-3xl bg-white border border-[#D4AF37]/20 shadow-card space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-stone-200 rounded-full" />
              <div className="w-9 h-9 rounded-2xl bg-[#D4AF37]/15" />
            </div>
            <div className="h-8 w-20 bg-stone-200 rounded-xl" />
            <div className="h-2.5 w-32 bg-stone-100 rounded-full" />
          </div>
        ))}
      </div>

      {/* Main Section Skeleton */}
      <div className="p-8 rounded-3xl bg-white border border-[#D4AF37]/20 shadow-card space-y-4">
        <div className="h-5 w-48 bg-[#D4AF37]/25 rounded-full" />
        <div className="space-y-3 pt-2">
          <div className="h-12 w-full bg-[#FAF8F5] rounded-2xl border border-stone-100" />
          <div className="h-12 w-full bg-[#FAF8F5] rounded-2xl border border-stone-100" />
          <div className="h-12 w-full bg-[#FAF8F5] rounded-2xl border border-stone-100" />
        </div>
      </div>
    </div>
  );
}
