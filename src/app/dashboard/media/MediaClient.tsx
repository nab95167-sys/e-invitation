"use client";

import { useState } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  Film,
  Trash2,
  Plus,
  Play,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Edit2,
  X,
  Sparkles,
} from "lucide-react";

interface MediaItem {
  id: string;
  title?: string | null;
  mediaType: string;
  url: string;
  caption?: string | null;
  category: string;
  sortOrder?: number;
}

interface MediaClientProps {
  initialMedia: MediaItem[];
  eventId: string;
  eventSlug?: string;
}

export default function MediaClient({ initialMedia, eventId, eventSlug }: MediaClientProps) {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form for URL embed (ADD)
  const [showUrlForm, setShowUrlForm] = useState(false);
  const [urlTitle, setUrlTitle] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [urlType, setUrlType] = useState<"PHOTO" | "VIDEO">("PHOTO");
  const [urlCaption, setUrlCaption] = useState("");

  // Edit item state (UPDATE)
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  // Remove All state
  const [isRemoveAllOpen, setIsRemoveAllOpen] = useState(false);
  const [removeAllLoading, setRemoveAllLoading] = useState(false);

  const handleRemoveAllConfirm = async () => {
    setRemoveAllLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/media?all=true&eventId=${eventId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove all media items.");

      setMedia([]);
      setIsRemoveAllOpen(false);
      setSuccess(`✓ បានលុបរូបភាព និងវីដេអូទាំងអស់ (${data.count ?? 0}) ដោយជោគជ័យ!`);
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to delete all media.");
    } finally {
      setRemoveAllLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      const addedItems: MediaItem[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        // Upload to server
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          throw new Error(errData.error || `Failed to upload ${file.name}`);
        }

        const { url } = await uploadRes.json();
        const mediaType = file.type.startsWith("video/") ? "VIDEO" : "PHOTO";

        // Create MediaItem record in DB
        const createRes = await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId,
            title: file.name.replace(/\.[^/.]+$/, ""),
            mediaType,
            url,
            caption: "",
            category: "GALLERY",
          }),
        });

        if (createRes.ok) {
          const { item } = await createRes.json();
          addedItems.push(item);
        } else {
          const errData = await createRes.json().catch(() => ({}));
          throw new Error(errData.error || `Failed to save ${file.name} to media gallery.`);
        }
      }

      setMedia([...addedItems, ...media]);
      setSuccess(`✓ Successfully uploaded and indexed ${addedItems.length} media item(s).`);
    } catch (err: any) {
      setError(err.message || "Error uploading media files.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleAddUrlMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          title: urlTitle.trim() || (urlType === "VIDEO" ? "Wedding Video" : "Wedding Photo"),
          mediaType: urlType,
          url: urlInput.trim(),
          caption: urlCaption.trim(),
          category: "GALLERY",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add media item");
      }

      const { item } = await res.json();
      setMedia([item, ...media]);
      setSuccess("Media item added successfully.");
      setUrlInput("");
      setUrlTitle("");
      setUrlCaption("");
      setShowUrlForm(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setEditLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/media", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingItem.id,
          title: editingItem.title,
          caption: editingItem.caption,
          category: editingItem.category,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update media item");
      }

      const { item } = await res.json();
      setMedia(media.map((m) => (m.id === item.id ? { ...m, ...item } : m)));
      setSuccess("Media details updated.");
      setEditingItem(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media item?")) return;

    try {
      const res = await fetch(`/api/media?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMedia(media.filter((item) => item.id !== id));
        setSuccess("Media removed.");
      }
    } catch (err) {
      setError("Failed to delete media item.");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2C2A29]">
            Photo Gallery &amp; Media
          </h1>
          <p className="text-xs text-[#3E444A]/70 mt-1">
            Upload, add, update captions, and delete wedding photos &amp; video teasers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {media.length > 0 && (
            <button
              onClick={() => setIsRemoveAllOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-semibold text-red-600 flex items-center gap-2 transition-all shadow-sm active:scale-95"
              title="Delete all media files"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              <span>លុបទាំងអស់ ({media.length}) / Remove All</span>
            </button>
          )}

          <a
            href={`/invite/${eventSlug || 'davita-and-meassa'}?code=vip-guest-01#gallery`}
            target="_blank"
            className="px-4 py-2.5 rounded-2xl bg-white border border-[#D4AF37]/30 text-xs font-semibold text-[#2C2A29] flex items-center gap-2 hover:bg-[#FAF8F5] transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#AA7C11]" />
            <span>View Live Gallery</span>
          </a>
          <button
            onClick={() => setShowUrlForm(!showUrlForm)}
            className="px-4 py-2.5 rounded-2xl bg-white border border-[#D4AF37]/30 text-xs font-semibold text-[#2C2A29] flex items-center gap-2 hover:bg-[#FAF8F5] transition-all shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#AA7C11]" />
            <span>{showUrlForm ? "Hide Embed Form" : "Embed External Video / Image"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Embed form (ADD) */}
      {showUrlForm && (
        <form
          onSubmit={handleAddUrlMedia}
          className="p-6 rounded-3xl bg-white border border-[#D4AF37]/30 shadow-card space-y-4"
        >
          <h3 className="font-serif text-lg font-bold text-[#2C2A29]">
            Embed Video or External Photo
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#3E444A] mb-1">
                Type
              </label>
              <select
                value={urlType}
                onChange={(e) => setUrlType(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
              >
                <option value="PHOTO">Photo (Image URL)</option>
                <option value="VIDEO">Video (YouTube embed or MP4)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#3E444A] mb-1">
                Title
              </label>
              <input
                type="text"
                value={urlTitle}
                onChange={(e) => setUrlTitle(e.target.value)}
                placeholder="e.g., Pre-wedding Photo"
                className="w-full px-4 py-2 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#3E444A] mb-1">
                URL *
              </label>
              <input
                type="url"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-white text-xs font-semibold hover:brightness-105"
            >
              Add to Gallery
            </button>
          </div>
        </form>
      )}

      {/* Upload Dropzone (UPLOAD) */}
      <div className="border-2 border-dashed border-[#D4AF37]/40 rounded-3xl p-8 sm:p-12 text-center bg-white/70 hover:bg-[#FFFDF9] transition-colors relative">
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-3xl bg-[#D4AF37]/15 flex items-center justify-center text-[#AA7C11] mb-4 shadow-luxury">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#2C2A29] mb-1">
            {uploading ? "Uploading & Validating Files..." : "Upload Photos & Videos"}
          </h3>
          <p className="text-xs text-[#3E444A]/70 max-w-sm mb-4">
            Drag &amp; drop high-resolution photographs (JPG, PNG, WEBP) or pre-wedding video files (MP4, WEBM).
          </p>
          <span className="px-4 py-2 rounded-full bg-[#FAF8F5] border border-[#D4AF37]/30 text-xs font-semibold text-[#AA7C11]">
            Browse Files from Computer
          </span>
        </div>
      </div>

      {/* Gallery Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {media.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-stone-100 border border-[#D4AF37]/20 shadow-card"
          >
            {item.mediaType === "VIDEO" ? (
              <div className="w-full h-full flex items-center justify-center bg-stone-900 relative">
                {item.url.includes("youtube") ? (
                  <iframe src={item.url} className="w-full h-full pointer-events-none" />
                ) : (
                  <video src={item.url} className="w-full h-full object-cover opacity-60" muted />
                )}
                <div className="absolute w-10 h-10 rounded-full bg-[#D4AF37]/80 flex items-center justify-center text-white">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
              </div>
            ) : (
              <img
                src={item.url}
                alt={item.title || "Gallery"}
                className="w-full h-full object-cover"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white">
              <div className="flex justify-end gap-1.5">
                <button
                  onClick={() => setEditingItem(item)}
                  title="Edit Caption / Details"
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-[#D4AF37] text-white transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  title="Delete Photo"
                  className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <span className="font-bold text-xs truncate block">{item.title || "Photo"}</span>
                {item.caption && (
                  <span className="text-[10px] text-white/80 block line-clamp-1">{item.caption}</span>
                )}
                <span className="text-[9px] uppercase tracking-wider text-[#F3E5AB] block mt-0.5">
                  {item.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Media Modal (UPDATE) */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setEditingItem(null)}
        >
          <div
            className="relative max-w-sm w-full bg-[#FAF8F5] rounded-3xl p-6 border border-[#D4AF37]/40 shadow-luxury-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-lg font-bold text-[#2C2A29] mb-3">
              Update Photo Details
            </h3>

            <form onSubmit={handleUpdateItem} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#3E444A] mb-1">Title</label>
                <input
                  type="text"
                  value={editingItem.title || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3E444A] mb-1">Caption</label>
                <input
                  type="text"
                  value={editingItem.caption || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3E444A] mb-1">Category</label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
                >
                  <option value="GALLERY">Gallery Grid</option>
                  <option value="STORY">Story &amp; Timeline</option>
                  <option value="HIGHLIGHT">Highlight Reel</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={editLoading}
                className="w-full py-2.5 rounded-xl bg-[#D4AF37] text-white text-xs font-semibold hover:brightness-105 mt-2"
              >
                {editLoading ? "Saving..." : "Save Details"}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Remove All Confirmation Modal */}
      {isRemoveAllOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-red-200 shadow-2xl max-w-md w-full overflow-hidden p-6 sm:p-8 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-serif font-bold text-xl text-[#2C2A29]">
                តើអ្នកពិតជាចង់លុបរូបភាព និងវីដេអូទាំងអស់មែនទេ?
              </h3>
              <p className="text-xs text-stone-500 font-khmer leading-relaxed">
                សកម្មភាពនេះនឹងលុបរូបភាព និងវីដេអូចំនួន <strong className="text-red-600 font-bold">{media.length} ឯកសារ</strong> ចេញពីវិចិត្រសាលមង្គលការរបស់អ្នកជាអចិន្ត្រៃយ៍។ សកម្មភាពនេះមិនអាចត្រឡប់វិញបានឡើយ។
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-red-50/70 border border-red-200/60 text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>Are you sure you want to delete all {media.length} photos and videos? This action cannot be undone.</span>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsRemoveAllOpen(false)}
                className="px-5 py-2.5 text-xs font-semibold rounded-xl text-stone-600 hover:bg-stone-100 transition-all"
              >
                បោះបង់ (Cancel)
              </button>
              <button
                type="button"
                onClick={handleRemoveAllConfirm}
                disabled={removeAllLoading}
                className="px-6 py-2.5 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5"
              >
                {removeAllLoading ? (
                  <span>កំពុងលុប...</span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>យល់ព្រមលុបទាំងអស់ (Remove All)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
