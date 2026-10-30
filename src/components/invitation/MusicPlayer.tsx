"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Music, Volume2, VolumeX, AlertCircle } from "lucide-react";

import { Language, translations } from "@/lib/translations";

interface MusicPlayerProps {
  musicUrl?: string | null;
  autoPlayTrigger?: boolean;
  lang?: Language;
}

// Helper to convert Google Drive, Dropbox, or other cloud URLs to direct audio stream links
export function normalizeAudioUrl(url: string | null | undefined): {
  type: "audio" | "youtube";
  streamUrl: string;
  youtubeId?: string;
} {
  if (!url || typeof url !== "string") {
    return {
      type: "audio",
      streamUrl:
        "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3",
    };
  }

  const trimmed = url.trim();

  // 1. YouTube detection
  const ytRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const ytMatch = trimmed.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      streamUrl: `https://www.youtube.com/embed/${ytMatch[1]}?enablejsapi=1&autoplay=1&loop=1&playlist=${ytMatch[1]}`,
      youtubeId: ytMatch[1],
    };
  }

  // 2. Google Drive conversion
  const gdriveRegex = /drive\.google\.com\/(?:file\/d\/([a-zA-Z0-9_-]+)|open\?id=([a-zA-Z0-9_-]+))/;
  const gdMatch = trimmed.match(gdriveRegex);
  if (gdMatch) {
    const fileId = gdMatch[1] || gdMatch[2];
    return {
      type: "audio",
      streamUrl: `https://docs.google.com/uc?export=download&id=${fileId}`,
    };
  }

  // 3. Dropbox conversion (dl=0 -> raw=1)
  if (trimmed.includes("dropbox.com")) {
    return {
      type: "audio",
      streamUrl: trimmed.replace(/[?&]dl=0/, "").concat(trimmed.includes("?") ? "&raw=1" : "?raw=1"),
    };
  }

  // 4. Default direct stream link (or local /uploads/...)
  return {
    type: "audio",
    streamUrl: trimmed,
  };
}

export default function MusicPlayer({ musicUrl, autoPlayTrigger, lang = "km" }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const t = translations[lang];

  const fallbackMusic =
    "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3";

  const resolved = useMemo(() => normalizeAudioUrl(musicUrl), [musicUrl]);
  const [currentSrc, setCurrentSrc] = useState(resolved.streamUrl);

  useEffect(() => {
    setHasError(false);
    setCurrentSrc(resolved.streamUrl);
  }, [resolved.streamUrl]);

  // Handle play/pause toggle
  const toggleMusic = () => {
    if (resolved.type === "youtube") {
      // Toggle YouTube iframe
      setIsPlaying((prev) => {
        const nextState = !prev;
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({
              event: "command",
              func: nextState ? "playVideo" : "pauseVideo",
              args: [],
            }),
            "*"
          );
        }
        return nextState;
      });
      return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasError(false);
        })
        .catch((err) => {
          console.warn("Audio play prevented or failed:", err);
          // Retry with fallback if not already fallback
          if (currentSrc !== fallbackMusic) {
            setCurrentSrc(fallbackMusic);
            setTimeout(() => {
              audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }, 100);
          } else {
            setIsPlaying(false);
          }
        });
    }
  };

  // Autoplay trigger (e.g., when wax seal / invitation envelope is clicked)
  useEffect(() => {
    if (autoPlayTrigger && !isPlaying) {
      if (resolved.type === "youtube") {
        setIsPlaying(true);
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: "command", func: "playVideo", args: [] }),
            "*"
          );
        }
      } else if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay blocked by browser policy until user interacts
            setIsPlaying(false);
          });
      }
    }
  }, [autoPlayTrigger, resolved.type]);

  const handleAudioError = () => {
    console.warn("Custom music URL failed to load. Falling back to default romantic piano music.");
    setHasError(true);
    if (currentSrc !== fallbackMusic) {
      setCurrentSrc(fallbackMusic);
      if (audioRef.current) {
        audioRef.current.load();
        if (isPlaying) {
          audioRef.current.play().catch(() => setIsPlaying(false));
        }
      }
    }
  };

  return (
    <>
      {resolved.type === "youtube" ? (
        <iframe
          ref={iframeRef}
          src={resolved.streamUrl}
          className="hidden w-0 h-0 opacity-0 pointer-events-none"
          allow="autoplay"
        />
      ) : (
        <audio
          key={currentSrc}
          ref={audioRef}
          src={currentSrc}
          loop
          preload="auto"
          onError={handleAudioError}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* Floating Music Control Pill (positioned within luxury body frame) */}
      <button
        onClick={toggleMusic}
        aria-label="Toggle background music"
        className={`fixed bottom-7 right-7 sm:bottom-8 sm:right-8 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full backdrop-blur-md border transition-all duration-300 shadow-luxury-lg font-khmer ${
          isPlaying
            ? "bg-[#D4AF37] text-white border-white/40 ring-4 ring-[#D4AF37]/20"
            : "bg-white/90 text-[#AA7C11] border-[#D4AF37]/30 hover:bg-[#FAF8F5]"
        }`}
      >
        <div
          className={`relative ${isPlaying ? "animate-spin" : ""}`}
          style={{ animationDuration: "6s" }}
        >
          <Music className="w-4 h-4" />
        </div>
        <span className="text-xs font-medium tracking-wide">
          {isPlaying ? t.musicPlaying : t.playMusic}
        </span>
        {isPlaying ? (
          <Volume2 className="w-4 h-4 text-white animate-pulse" />
        ) : (
          <VolumeX className="w-4 h-4 text-[#AA7C11]/70" />
        )}
      </button>
    </>
  );
}
