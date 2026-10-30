"use client";

import { useState } from "react";
import { Heart, Trash2, CheckCircle2, MessageSquare, Sparkles } from "lucide-react";

interface Wish {
  id: string;
  senderName: string;
  relationship?: string | null;
  message: string;
  isApproved: boolean;
  createdAt: string | Date;
}

interface WishesClientProps {
  initialWishes: Wish[];
  eventSlug?: string;
}

export default function WishesClient({ initialWishes, eventSlug }: WishesClientProps) {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this wish?")) return;

    try {
      const res = await fetch(`/api/wishes?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setWishes(wishes.filter((w) => w.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2C2A29]">
            Guestbook Wishes &amp; Blessings
          </h1>
          <p className="text-xs text-[#3E444A]/70 mt-1">
            Review and moderate heartfelt notes and prayers shared by your wedding guests.
          </p>
        </div>

        <a
          href={`/invite/${eventSlug || 'davita-and-meassa'}?code=vip-guest-01#wishes`}
          target="_blank"
          className="px-4 py-2.5 rounded-2xl bg-white border border-[#D4AF37]/30 text-xs font-semibold text-[#2C2A29] flex items-center gap-2 hover:bg-[#FAF8F5] transition-all shadow-sm w-fit"
        >
          <Sparkles className="w-4 h-4 text-[#AA7C11]" />
          <span>View Live Guestbook</span>
        </a>
      </div>

      <div className="space-y-4">
        {wishes.map((w) => (
          <div
            key={w.id}
            className="p-6 rounded-3xl bg-white border border-[#D4AF37]/25 shadow-card flex items-start justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#AA7C11]">
                  <Heart className="w-4 h-4 fill-[#D4AF37]" />
                </div>
                <div>
                  <span className="font-serif font-bold text-base text-[#2C2A29]">
                    {w.senderName}
                  </span>
                  {w.relationship && (
                    <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#AA7C11] border border-[#D4AF37]/20 font-semibold">
                      {w.relationship}
                    </span>
                  )}
                </div>
                <span className="text-stone-400 text-xs ml-2">
                  {new Date(w.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-sm text-[#3E444A] pl-10 font-light">"{w.message}"</p>
            </div>

            <button
              onClick={() => handleDelete(w.id)}
              className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
              title="Delete wish"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {wishes.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#D4AF37]/20 text-stone-400">
            No wishes received yet.
          </div>
        )}
      </div>
    </div>
  );
}
