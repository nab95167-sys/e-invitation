"use client";

import { useState, useRef } from "react";
import QRCode from "qrcode";
import {
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Heart,
  Music,
  Film,
  Gift,
  Sparkles,
  UploadCloud,
  Play,
  Square,
  Volume2,
  Image as ImageIcon,
  Upload,
  Trash2,
  ExternalLink,
  Palette,
  Check,
  Sliders,
  Plus,
  Phone,
  Clock,
  FileText,
  QrCode,
  RotateCcw,
  X,
  Copy,
  Send,
  Share2,
  MessageCircle,
  Download,
  Users,
} from "lucide-react";
import { normalizeAudioUrl } from "@/components/invitation/MusicPlayer";

export interface ThemePreset {
  id: string;
  nameKm: string;
  nameEn: string;
  primary: string;
  accent: string;
  envelope: string;
  lining?: string;
  card: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "royal_khmer_purple",
    nameKm: "ស្វាយរាជវាំង & ទឹកមាស",
    nameEn: "Royal Purple & Gold",
    primary: "#250e44",
    accent: "#d9b15a",
    envelope: "#431475",
    lining: "#2b0b4d",
    card: "#280d4c",
  },
  {
    id: "luxury_gold",
    nameKm: "មាសប្រណីត & ស្រាសំប៉ាញ",
    nameEn: "Luxury Gold & Champagne",
    primary: "#1a160c",
    accent: "#e5b85c",
    envelope: "#2e2515",
    lining: "#241d11",
    card: "#19140b",
  },
  {
    id: "modern_obsidian",
    nameKm: "សម័យទំនើប Charcoal & Gold",
    nameEn: "Modern Obsidian & Gold",
    primary: "#141821",
    accent: "#e5c07b",
    envelope: "#202634",
    lining: "#181e2a",
    card: "#181e2b",
  },
  {
    id: "romantic_blossom",
    nameKm: "ផ្កាកុលាបមង្គល & Rose Gold",
    nameEn: "Romantic Blossom & Rose Gold",
    primary: "#331222",
    accent: "#f3a9b8",
    envelope: "#4e1b34",
    lining: "#3a1226",
    card: "#381526",
  },
  {
    id: "emerald_green",
    nameKm: "ត្បូងមរកត & ទឹកមាស",
    nameEn: "Imperial Emerald & Gold",
    primary: "#0b291d",
    accent: "#d4af37",
    envelope: "#12432f",
    lining: "#0d3424",
    card: "#082016",
  },
  {
    id: "ruby_red",
    nameKm: "ត្បូងទទឹម / ក្រហមកុលាប & ទឹកមាស",
    nameEn: "Royal Ruby & Gold",
    primary: "#2b0b14",
    accent: "#e5a93c",
    envelope: "#4d1222",
    lining: "#360b18",
    card: "#22070f",
  },
  {
    id: "midnight_sapphire",
    nameKm: "ខៀវរាត្រី & ទឹកមាស",
    nameEn: "Midnight Sapphire & Gold",
    primary: "#0b1a30",
    accent: "#dfb76c",
    envelope: "#132b4f",
    lining: "#0f223e",
    card: "#081324",
  },
  {
    id: "classic_ivory",
    nameKm: "ភ្លុកដំរីបុរាណ & ទឹកមាស",
    nameEn: "Classic Ivory & Gold",
    primary: "#2c2720",
    accent: "#d9b15a",
    envelope: "#473e33",
    lining: "#342e26",
    card: "#211d17",
  },
];

export interface TemplateDesign {
  id: string;
  nameKm: string;
  nameEn: string;
  descKm: string;
  badge: string;
  previewBg: string;
  previewAccent: string;
  features: string[];
}

export const TEMPLATE_DESIGNS: TemplateDesign[] = [
  {
    id: "royal-heritage",
    nameKm: "បុរាណរាជវង្សខ្មែរ (Royal Heritage)",
    nameEn: "Royal Khmer Heritage",
    descKm: "ក្បូរក្បាច់បុរាណខ្មែរប្រណីត អក្សរមូលឆ្លាក់មាស ស័ក្តិសមសម្រាប់មង្គលការប្រពៃណីខ្មែរដ៏ឧត្តុង្គឧត្តម",
    badge: "🏛️ ពេញនិយមបំផុត (Recommended)",
    previewBg: "#250e44",
    previewAccent: "#d9b15a",
    features: ["ក្បាច់ភ្ញីបុរាណខ្មែរ", "អក្សរមូលឆ្លាក់មាស", "ស៊ុមមាសរាជវង្ស"],
  },
  {
    id: "modern-minimal",
    nameKm: "សម័យទំនើបប្រណីត (Modern Luxury)",
    nameEn: "Modern Luxury Editorial",
    descKm: "ទម្រង់ស្អាតស្អំ បែបអភិជនទំនើប បន្ទាត់មាសភ្លោះស្តើង រួមជាមួយកាតកញ្ចក់ Glassmorphism ថ្លៃថ្នូរ",
    badge: "✨ ទំនើបទាន់សម័យ",
    previewBg: "#161b26",
    previewAccent: "#e5c07b",
    features: ["បន្ទាត់ភ្លោះ Fine Line", "កាតកញ្ចក់ថ្លា Frosted Glass", "ស្ទីលអក្សរទំនើប"],
  },
  {
    id: "romantic-floral",
    nameKm: "មន្តស្នេហ៍ផ្កាមង្គល (Romantic Blossom)",
    nameEn: "Romantic Blossom & Floral",
    descKm: "រំលេចដោយកម្រងផ្កាស្ម័គ្រ និងក្បាច់រំលេចទន់ភ្លន់ ផ្តល់នូវភាពផ្អែមល្ហែម និងបរិយាកាសស្នេហាដ៏កក់ក្តៅ",
    badge: "🌸 មនោសញ្ចេតនា",
    previewBg: "#331422",
    previewAccent: "#f3a9b8",
    features: ["កាតរាងស្រទាប់ផ្កា", "សម្លេងពណ៌ផ្កាកុលាប & Rose Gold", "ភាពទន់ភ្លន់រ៉ូមែនទិក"],
  },
  {
    id: "celestial-midnight",
    nameKm: "រាត្រីតារារាជវង្ស (Celestial Midnight)",
    nameEn: "Celestial Midnight & Gold",
    descKm: "ផ្ទៃមេឃរាត្រីខៀវក្រម៉ៅ អមដោយពន្លឺតារាចាំងផ្លេក និងត្រាឃ្មុំរះភ្លឺចែងចាំងដូចពេជ្រ",
    badge: "🌌 អាថ៌កំបាំងរាត្រី",
    previewBg: "#0a1324",
    previewAccent: "#e9c46a",
    features: ["ពន្លឺផ្កាយរះចែងចាំង", "រស្មី Aura មាសក្នុងរាត្រី", "កាតរំលេចពន្លឺ Luminous"],
  },
  {
    id: "imperial-emerald",
    nameKm: "សួនផ្កាមរកតអធិរាជ (Imperial Emerald)",
    nameEn: "Imperial Emerald Botanical Garden",
    descKm: "ពណ៌បៃតងត្បូងមរកតរាជវាំង រំលេចដោយទងផ្កា និងវល្លិមាសធម្មជាតិ បង្កើតបរិយាកាសស្រស់បំព្រងដូចសួនរាជបុប្ផា",
    badge: "🌿 ធម្មជាតិរាជវាំង",
    previewBg: "#0b291d",
    previewAccent: "#d4af37",
    features: ["វល្លិទងផ្កាមាស", "សម្លេងត្បូងមរកត Botanical", "អារម្មណ៍ស្រស់បំព្រង"],
  },
  {
    id: "golden-elegance",
    nameKm: "មាសបុរាណប្រណីត (Pure Gold Elegance)",
    nameEn: "Pure Gold Elegance & Champagne",
    descKm: "ពណ៌ទឹកមាសសុទ្ធ និងក្រដាសសូត្រពណ៌ភ្លុកដំរីបុរាណ បង្ហាញពីកិត្យានុភាពខ្ពង់ខ្ពស់ និងភាពរុងរឿងជានិរន្តរ៍",
    badge: "👑 កិត្យានុភាពខ្ពស់",
    previewBg: "#221a0d",
    previewAccent: "#f0c058",
    features: ["ទឹកមាសសុទ្ធចាំងផ្លេក", "ផ្ទៃក្រដាសសូត្រ Champagne", "ស៊ុមមាសរាជវាំងបុរាណ"],
  },
  {
    id: "ruby-majesty",
    nameKm: "ត្បូងទទឹមរាជវាំង (Royal Ruby Majesty)",
    nameEn: "Royal Ruby Majesty",
    descKm: "ផ្ទៃក្រហមត្បូងទទឹមដ៏ឧត្តុង្គឧត្តម លម្អដោយក្បូរក្បាច់មាសឆើតឆាយ ស័ក្តិសមសម្រាប់ពិធីមង្គលការដ៏មហិមា",
    badge: "💎 ឧត្តមភាពរាជវាំង",
    previewBg: "#2e0813",
    previewAccent: "#e5a93c",
    features: ["ក្រហមត្បូងទទឹមឆើតឆាយ", "ក្បាច់មាសរាជវាំងរំលេច", "ភាពថ្លៃថ្នូរឧត្តម"],
  },
  {
    id: "glass-crystal",
    nameKm: "កែវចរណៃប្រណីត (Crystal Glassmorphism)",
    nameEn: "Crystal Glassmorphism & Neon Glow",
    descKm: "រចនាប័ទ្មកាតកញ្ចក់គ្រីស្តាល់ថ្លាឆ្លុះ ពន្លឺពន្លឺរស្មីមាសស្រទន់បែបឌីជីថលជំនាន់ថ្មី ទំនើប និងទាក់ទាញបំផុត",
    badge: "🔮 ទំនើបអស្ចារ្យ",
    previewBg: "#110b1a",
    previewAccent: "#f4ca64",
    features: ["កាតកញ្ចក់គ្រីស្តាល់ 3D", "ពន្លឺ Neon Gold Glow", "ផ្ទៃឆ្លុះព្រាលៗ Frosted Blur"],
  },
];

export interface AnimationStyle {
  id: string;
  nameKm: string;
  nameEn: string;
  icon: string;
  descKm: string;
  previewColor: string;
}

export const ANIMATION_STYLES: AnimationStyle[] = [
  {
    id: "falling-petals",
    nameKm: "🌸 ផ្កាមង្គលរោយរាយ (Falling Blossom Petals)",
    nameEn: "Romantic Falling Blossom Petals",
    icon: "🌸",
    descKm: "ស្រទាប់ផ្កាកុលាប និងផ្កាមង្គលរសាត់ធ្លាក់រោយរាយដោយទន់ភ្លន់ បង្កើតបរិយាកាសស្នេហាដ៏ផ្អែមល្ហែម",
    previewColor: "#f472b6",
  },
  {
    id: "golden-stardust",
    nameKm: "✨ កម្ទេចមាសភ្លឺចិញ្ចាច (Golden Stardust & Sparkles)",
    nameEn: "Golden Stardust & Twinkling Sparkles",
    icon: "✨",
    descKm: "កម្ទេចមាសភ្លឺផ្លេកចែងចាំងរំលេចពន្លឺដូចផ្កាយរះក្នុងរាត្រី បន្ថែមភាពប្រណីតហ្លួងដ៏អស្ចារ្យ",
    previewColor: "#fbbf24",
  },
  {
    id: "flutter-butterflies",
    nameKm: "🦋 មេអំបៅមាសហោះហើរ (Fluttering Butterflies)",
    nameEn: "Fluttering Golden Butterflies",
    icon: "🦋",
    descKm: "មេអំបៅមាសហោះហើរជាគូៗឆ្លងកាត់អេក្រង់ តំណាងឱ្យចំណងស្នេហ៍សុភមង្គល និងភាពរីករាយ",
    previewColor: "#eab308",
  },
  {
    id: "floating-hearts",
    nameKm: "💖 បេះដូងស្នេហាហោះ (Floating Love Hearts)",
    nameEn: "Floating Translucent Love Hearts",
    icon: "💖",
    descKm: "ពពកបេះដូងស្នេហាថ្លាហោះរសាត់ឡើងលើថ្នមៗ រំលេចក្តីស្រឡាញ់ដ៏បរិសុទ្ធរបស់គូស្វាមីភរិយា",
    previewColor: "#ec4899",
  },
  {
    id: "royal-fireworks",
    nameKm: "🎆 កាំជ្រួចអបអរសាទរ (Royal Fireworks & Confetti)",
    nameEn: "Royal Celebratory Fireworks & Confetti",
    icon: "🎆",
    descKm: "កាំជ្រួចមាស និងកម្ទេចភ្លើងអបអរសាទរបាញ់រំលេចស្រាលៗ ស័ក្តិសមសម្រាប់ថ្ងៃជោគជ័យមហាមង្គល",
    previewColor: "#f97316",
  },
  {
    id: "none",
    nameKm: "🛑 គ្មានចលនា (Static / Off)",
    nameEn: "Static / No Ambient Particles",
    icon: "🛑",
    descKm: "បិទចលនា Particles ខាងក្រោយ (សន្សំសំចៃថ្មទូរស័ព្ទ និងសម្រាប់អ្នកចូលចិត្តភាពស្ងប់ស្ងាត់)",
    previewColor: "#9ca3af",
  },
];

export interface SealStyle {
  id: string;
  nameKm: string;
  icon: string;
  desc: string;
}

export const SEAL_STYLES: SealStyle[] = [
  { id: "crown", nameKm: "ម្កុដរាជវង្ស (Royal Crown)", icon: "👑", desc: "ត្រាម្កុដរាជវង្សខ្មែរប្រណីត" },
  { id: "lotus", nameKm: "ផ្កាឈូកទិព្វ (Sacred Lotus)", icon: "🪷", desc: "ត្រាក្បាច់ផ្កាឈូកសិរីមង្គល" },
  { id: "monogram", nameKm: "អក្សរកាត់គូស្នេហ៍ (Interlocking Monogram)", icon: "❦", desc: "ត្រាអក្សរកាត់ឈ្មោះកូនកំលោះ-កូនក្រមុំ" },
  { id: "knot", nameKm: "ចំណងស្នេហ៍អមតៈ (Eternal Love Knot)", icon: "♾️", desc: "ត្រាចំណងស្នេហ៍រឹងមាំជានិរន្តរ៍" },
];

export interface FrameStyle {
  id: string;
  nameKm: string;
  desc: string;
}

export const FRAME_STYLES: FrameStyle[] = [
  { id: "ornate-kbach", nameKm: "ក្បូរក្បាច់មាសបុរាណ (Ornate Khmer Kbach)", desc: "ក្បាច់ភ្ញី និងជ្រុងមាសបុរាណ" },
  { id: "dual-line", nameKm: "បន្ទាត់មាសភ្លោះ (Dual Fine Gold Line)", desc: "បន្ទាត់ភ្លោះបែបទំនើបប្រណីត" },
  { id: "scalloped", nameKm: "ស៊ុមរាងកោងស្ថាបត្យកម្ម (Royal Scalloped Arch)", desc: "ស៊ុមកោងរាងព្រះបរមរាជវាំង" },
];

export const parseThemeConfig = (raw: string) => {
  const defaultTheme = {
    preset: "royal_khmer_purple",
    templateStyle: "royal-heritage",
    sealStyle: "crown",
    frameStyle: "ornate-kbach",
    animationStyle: "falling-petals",
    ...THEME_PRESETS[0],
  };
  if (!raw) return defaultTheme;
  try {
    if (typeof raw === "string" && raw.startsWith("{")) {
      const parsed = JSON.parse(raw);
      let base = THEME_PRESETS[0];
      if (parsed.preset && parsed.preset !== "custom") {
        const found = THEME_PRESETS.find((p) => p.id === parsed.preset);
        if (found) base = found;
      }
      return {
        ...base,
        preset: parsed.preset || base.id,
        templateStyle: parsed.templateStyle || "royal-heritage",
        sealStyle: parsed.sealStyle || "crown",
        frameStyle: parsed.frameStyle || "ornate-kbach",
        animationStyle: parsed.animationStyle || "falling-petals",
        primary: parsed.primary || base.primary,
        accent: parsed.accent || base.accent,
        envelope: parsed.envelope || base.envelope,
        lining: parsed.lining || parsed.envelope || base.lining,
        card: parsed.card || base.card,
        nameKm: parsed.nameKm || base.nameKm,
        nameEn: parsed.nameEn || base.nameEn,
        id: parsed.preset || base.id,
      };
    }
  } catch (e) {}

  const match = THEME_PRESETS.find((p) => p.id === raw);
  if (match) {
    return {
      preset: match.id,
      templateStyle: "royal-heritage",
      sealStyle: "crown",
      frameStyle: "ornate-kbach",
      animationStyle: "falling-petals",
      ...match,
    };
  }
  return defaultTheme;
};

export interface ProgrammeRow {
  time: string;
  name: string;
}

export interface ProgrammeDay {
  dayTitle: string;
  rows: ProgrammeRow[];
}

export const DEFAULT_PROGRAMME: ProgrammeDay[] = [
  {
    dayTitle: "កម្មវិធីទី១ (ពិធីសែនក្រុងពាលី & សូត្រមន្ត)",
    rows: [
      { time: "ម៉ោង ០៣:០០ រសៀល", name: "ពិធីសែនក្រុងពាលី" },
      { time: "ម៉ោង ០៤:០០ រសៀល", name: "ពិធីសូត្រមន្តចម្រើនព្រះបរិត្ត" },
      { time: "ម៉ោង ០៥:០០ ល្ងាច", name: "ពិធីជុំពេលា និងជាវខាន់ស្លា" },
      { time: "ម៉ោង ០៦:៣០ ល្ងាច", name: "អញ្ជើញភ្ញៀវកិត្តិយសពិសាអាហារពេលល្ងាច" },
    ],
  },
  {
    dayTitle: "កម្មវិធីទី២ (ពិធីហែជំនូន កាត់សក់ សំពះផ្ទឹម & ពិធីជប់លៀង)",
    rows: [
      { time: "ម៉ោង ០៦:៣០ ព្រឹក", name: "ជួបជុំភ្ញៀវកិត្តិយសដើម្បីរៀបចំហែជំនូន" },
      { time: "ម៉ោង ០៧:០០ ព្រឹក", name: "ពិធីហែជំនូនកំណត់ចូលរោងជ័យ" },
      { time: "ម៉ោង ០៧:៣០ ព្រឹក", name: "ពិធីចៅមហានិយាយជើងការ សែនព្រេន រៀបរាប់ផ្លែឈើ និងពិសាភោជនាហារពេលព្រឹក" },
      { time: "ម៉ោង ០៨:០០ ព្រឹក", name: "ពិធីបំពាក់ចិញ្ចៀនអាពាហ៍ពិពាហ៍" },
      { time: "ម៉ោង ០៩:០០ ព្រឹក", name: "ពិធីកាត់សក់បង្កក់សិរី កូនប្រុស-កូនស្រី" },
      { time: "ម៉ោង ១១:០០ ព្រឹក", name: "ពិធីសំពះផ្ទឹមចងដៃ បង្វិលពពិល និងព្រះថោងតោងស្បៃ" },
      { time: "ម៉ោង ១២:០០ ថ្ងៃត្រង់", name: "អញ្ជើញភ្ញៀវកិត្តិយសពិសាអាហារថ្ងៃត្រង់ បញ្ចប់កិច្ចអាពាហ៍ពិពាហ៍ពេលព្រឹក" },
      { time: "ម៉ោង ០៤:០០ រសៀល", name: "អញ្ជើញភ្ញៀវកិត្តិយសពិសាភោជនាហារពេលល្ងាច ដោយមេត្រីភាព" },
    ],
  },
];

export interface ContactItem {
  label: string;
  tel: string;
}

export const DEFAULT_CONTACTS: ContactItem[] = [
  { label: "096 7 717 278", tel: "+855967717278" },
  { label: "070 895 623", tel: "+85570895623" },
];

export interface BankAccountConfig {
  bankName: string;
  accountNumber: string;
  accountName: string;
  qrImageUrl: string;
}

export const parseBankInfo = (raw: string | null | undefined): BankAccountConfig => {
  if (!raw) return { bankName: "ABA Bank", accountNumber: "000 123 456", accountName: "PHAY RAKSMEY", qrImageUrl: "" };
  try {
    if (raw.startsWith("{")) {
      const parsed = JSON.parse(raw);
      return {
        bankName: parsed.bankName || "ABA Bank",
        accountNumber: parsed.accountNumber || "",
        accountName: parsed.accountName || "",
        qrImageUrl: parsed.qrImageUrl || "",
      };
    }
  } catch (e) {}
  return { bankName: "Bank Account", accountNumber: raw, accountName: "", qrImageUrl: "" };
};

export const parseProgramme = (raw: string | null | undefined): ProgrammeDay[] => {
  if (!raw) return DEFAULT_PROGRAMME;
  try {
    if (raw.startsWith("[")) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return DEFAULT_PROGRAMME;
};

export const parseContacts = (raw: string | null | undefined): ContactItem[] => {
  if (!raw) return DEFAULT_CONTACTS;
  try {
    if (raw.startsWith("[")) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return DEFAULT_CONTACTS;
};

export const parseLetterConfig = (raw: string | null | undefined) => {
  const defaultLetter = {
    honor: "មានកិត្តិយសសូមគោរពអញ្ជើញ",
    body: "ឯកឧត្តម អ្នកឧកញ៉ា លោកជំទាវ លោក លោកស្រី អ្នកនាង កញ្ញា និង ប្រិយមិត្តអញ្ជើញចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយស ដើម្បីប្រសិទ្ធពរជ័យសិរីសួស្តី ជ័យមង្គលក្នុង ពិធីរៀបអាពាហ៍ពិពាហ៍ កូនប្រុស-ស្រី របស់យើងខ្ញុំ",
    quote: "",
  };
  if (!raw) return defaultLetter;
  try {
    if (raw.startsWith("{")) {
      const parsed = JSON.parse(raw);
      return {
        honor: parsed.honor || defaultLetter.honor,
        body: parsed.body || defaultLetter.body,
        quote: parsed.quote || "",
      };
    }
  } catch (e) {}
  return { ...defaultLetter, quote: raw };
};

interface EventClientProps {
  initialEvent: any;
  initialMedia?: any[];
  initialGuests?: any[];
}

export default function EventClient({ initialEvent, initialMedia, initialGuests }: EventClientProps) {
  const [formData, setFormData] = useState({
    id: initialEvent.id,
    slug: initialEvent.slug || "davita-and-meassa",
    title: initialEvent.title || "",
    groomName: initialEvent.groomName || "",
    groomParents: initialEvent.groomParents || "",
    groomPhotoUrl: initialEvent.groomPhotoUrl || "",
    brideName: initialEvent.brideName || "",
    brideParents: initialEvent.brideParents || "",
    bridePhotoUrl: initialEvent.bridePhotoUrl || "",
    quote: initialEvent.quote || "",
    story: initialEvent.story || "",
    eventDate: initialEvent.eventDate
      ? new Date(initialEvent.eventDate).toISOString().split("T")[0]
      : "",
    ceremonyTime: initialEvent.ceremonyTime || "",
    receptionTime: initialEvent.receptionTime || "",
    venueName: initialEvent.venueName || "",
    venueAddress: initialEvent.venueAddress || "",
    googleMapsUrl: initialEvent.googleMapsUrl || "",
    coverImageUrl: initialEvent.coverImageUrl || "",
    musicUrl: initialEvent.musicUrl || "",
    videoUrl: initialEvent.videoUrl || "",
    dressCode: initialEvent.dressCode || "",
    bankAccountInfo: initialEvent.bankAccountInfo || "",
    theme: initialEvent.theme || "royal_khmer_purple",
    lunarDate:
      initialEvent.lunarDate ||
      "ត្រូវនឹងថ្ងៃអាទិត្យ ៦កើត ខែកត្ដិក ឆ្នាំមមី អដ្ឋស័ក ព.ស.២៥៧០",
    contacts: initialEvent.contacts || JSON.stringify(DEFAULT_CONTACTS),
    programme: initialEvent.programme || JSON.stringify(DEFAULT_PROGRAMME),
    couplePhotoUrl: initialEvent.couplePhotoUrl || "/img/cozy-2000.webp",
    venuePhotoUrl: initialEvent.venuePhotoUrl || "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Programme state
  const [programmeDays, setProgrammeDays] = useState<ProgrammeDay[]>(() =>
    parseProgramme(initialEvent.programme)
  );

  // Contacts state
  const [contactsList, setContactsList] = useState<ContactItem[]>(() =>
    parseContacts(initialEvent.contacts)
  );

  // Bank Info state
  const [bankConfig, setBankConfig] = useState<BankAccountConfig>(() =>
    parseBankInfo(initialEvent.bankAccountInfo)
  );

  // Letter / Words state
  const [letterConfig, setLetterConfig] = useState(() =>
    parseLetterConfig(initialEvent.quote)
  );

  // Theme & Custom Color state
  const [themeConfig, setThemeConfig] = useState(() =>
    parseThemeConfig(initialEvent.theme || "royal_khmer_purple")
  );
  const [customMode, setCustomMode] = useState(
    () => themeConfig.preset === "custom"
  );
  const [themeSubTab, setThemeSubTab] = useState<"template" | "color" | "ornaments" | "animations" | "share">("template");
  const [savingTheme, setSavingTheme] = useState(false);
  const [themeSaveSuccess, setThemeSaveSuccess] = useState<string | null>(null);

  // Link Send to User / Personalized Sharing state
  const [guestList] = useState<any[]>(initialGuests || []);
  const [selectedGuestCode, setSelectedGuestCode] = useState<string>("");
  const [guestNameInput, setGuestNameInput] = useState("ឯកឧត្តម លោកជំទាវ");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedFullMessage, setCopiedFullMessage] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const getPersonalizedUrl = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const cleanName = guestNameInput.trim();
    const queryParts: string[] = [];
    if (selectedGuestCode) {
      queryParts.push(`code=${encodeURIComponent(selectedGuestCode)}`);
    }
    if (cleanName) {
      queryParts.push(`to=${encodeURIComponent(cleanName)}`);
    }
    const qs = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
    const activeSlug = (formData.slug || initialEvent.slug || "davita-and-meassa").trim();
    return `${origin}/invite/${activeSlug}${qs}`;
  };

  const getKhmerShareMessage = () => {
    const url = getPersonalizedUrl();
    const guest = guestNameInput.trim() || "ភ្ញៀវកិត្តិយស";
    return `សូមគោរពអញ្ជើញ ${guest}
ចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយសក្នុងពិធីអាពាហ៍ពិពាហ៍របស់យើងខ្ញុំ
🤵 កូនកំលោះ: ${formData.groomName || "ដាវីតា​"}
👰 កូនក្រមុំ: ${formData.brideName || "មេស សា"}
📅 កាលបរិច្ឆេទ: ${formData.eventDate || "សិរីសួស្តីអាពាហ៍ពិពាហ៍"}
📍 ទីតាំង: ${formData.venueName || formData.venueAddress || "ភ្នំពេញ"}

សូមចុចលើតំណភ្ជាប់ខាងក្រោមដើម្បីបើកធៀបការឌីជីថល (Digital Invitation):
${url}`;
  };

  const handleOpenQrCode = async () => {
    const url = getPersonalizedUrl();
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 340,
        margin: 2,
        color: {
          dark: themeConfig.primary || "#250e44",
          light: "#ffffff",
        },
      });
      setQrCodeDataUrl(dataUrl);
      setIsQrModalOpen(true);
    } catch (e) {
      console.error("QR Code error:", e);
    }
  };

  const colorDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const saveThemeToDb = async (themeObject: any, customSuccessMsg?: string) => {
    setSavingTheme(true);
    setError(null);
    try {
      const stringified = JSON.stringify(themeObject);
      setFormData((f: any) => ({ ...f, theme: stringified }));
      const res = await fetch("/api/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: initialEvent.id,
          theme: stringified,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save theme to database");
      }
      const msg = customSuccessMsg || "✓ បានកែប្រែ និងរក្សាទុកស្ទីលពណ៌ដោយជោគជ័យ! (Theme & Colors saved)";
      setSuccess(msg);
      setThemeSaveSuccess(msg);
      setTimeout(() => setThemeSaveSuccess(null), 5000);
    } catch (err: any) {
      console.error("Theme auto-save error:", err);
      setError(err.message || "Failed to auto-save template");
      setThemeSaveSuccess(null);
    } finally {
      setSavingTheme(false);
    }
  };

  const updateTemplateStyle = async (styleId: string) => {
    if (colorDebounceTimerRef.current) {
      clearTimeout(colorDebounceTimerRef.current);
    }
    let newPalette: any = {
      primary: "#250e44",
      accent: "#d9b15a",
      envelope: "#431475",
      lining: "#2b0b4d",
      card: "#280d4c",
      sealStyle: "crown",
      frameStyle: "ornate-kbach",
      animationStyle: "golden-stardust",
      preset: "royal_khmer_purple",
    };

    if (styleId === "modern-minimal") {
      newPalette = {
        primary: "#141821",
        accent: "#e5c07b",
        envelope: "#202634",
        lining: "#181e2a",
        card: "#181e2b",
        sealStyle: "monogram",
        frameStyle: "dual-line",
        animationStyle: "none",
        preset: "luxury_gold",
      };
    } else if (styleId === "romantic-floral") {
      newPalette = {
        primary: "#331222",
        accent: "#f3a9b8",
        envelope: "#4e1b34",
        lining: "#3a1226",
        card: "#381526",
        sealStyle: "lotus",
        frameStyle: "scalloped",
        animationStyle: "falling-petals",
        preset: "romantic_blossom",
      };
    } else if (styleId === "celestial-midnight") {
      newPalette = {
        primary: "#081224",
        accent: "#e9c46a",
        envelope: "#112344",
        lining: "#0c1a33",
        card: "#0c1932",
        sealStyle: "knot",
        frameStyle: "dual-line",
        animationStyle: "golden-stardust",
        preset: "midnight_sapphire",
      };
    } else if (styleId === "imperial-emerald") {
      newPalette = {
        primary: "#0b291d",
        accent: "#d4af37",
        envelope: "#12432f",
        lining: "#0d3424",
        card: "#082016",
        sealStyle: "lotus",
        frameStyle: "ornate-kbach",
        animationStyle: "flutter-butterflies",
        preset: "emerald_green",
      };
    } else if (styleId === "golden-elegance") {
      newPalette = {
        primary: "#1f180d",
        accent: "#f0c058",
        envelope: "#332612",
        lining: "#261c0c",
        card: "#1b1409",
        sealStyle: "crown",
        frameStyle: "ornate-kbach",
        animationStyle: "golden-stardust",
        preset: "luxury_gold",
      };
    } else if (styleId === "ruby-majesty") {
      newPalette = {
        primary: "#2b0b14",
        accent: "#e5a93c",
        envelope: "#4d1222",
        lining: "#360b18",
        card: "#22070f",
        sealStyle: "knot",
        frameStyle: "ornate-kbach",
        animationStyle: "royal-fireworks",
        preset: "ruby_red",
      };
    } else if (styleId === "glass-crystal") {
      newPalette = {
        primary: "#0f0c18",
        accent: "#f3cc69",
        envelope: "#1f1930",
        lining: "#161222",
        card: "#141020",
        sealStyle: "monogram",
        frameStyle: "scalloped",
        animationStyle: "floating-hearts",
        preset: "modern_obsidian",
      };
    }

    const updated = {
      ...themeConfig,
      ...newPalette,
      templateStyle: styleId,
    };

    setThemeConfig(updated);
    setFormData((f: any) => ({ ...f, theme: JSON.stringify(updated) }));
    await saveThemeToDb(
      updated,
      `✓ បានជ្រើសរើស និងរក្សាទុកពុម្ពគំរូ "${TEMPLATE_DESIGNS.find((t) => t.id === styleId)?.nameKm}" ដោយជោគជ័យ!`
    );
  };

  const updateAnimationStyle = async (animId: string) => {
    if (colorDebounceTimerRef.current) {
      clearTimeout(colorDebounceTimerRef.current);
    }
    const updated = { ...themeConfig, animationStyle: animId };
    setThemeConfig(updated);
    setFormData((f: any) => ({ ...f, theme: JSON.stringify(updated) }));
    await saveThemeToDb(
      updated,
      `✓ បានផ្លាស់ប្តូរ និងរក្សាទុកគំនូរជីវចល "${ANIMATION_STYLES.find((a) => a.id === animId)?.nameKm}"!`
    );
  };

  const updateSealStyle = async (sealId: string) => {
    if (colorDebounceTimerRef.current) {
      clearTimeout(colorDebounceTimerRef.current);
    }
    const updated = { ...themeConfig, sealStyle: sealId };
    setThemeConfig(updated);
    setFormData((f: any) => ({ ...f, theme: JSON.stringify(updated) }));
    await saveThemeToDb(
      updated,
      `✓ បានរក្សាទុកត្រាឃ្មុំ "${SEAL_STYLES.find((s) => s.id === sealId)?.nameKm}" ដោយជោគជ័យ!`
    );
  };

  const updateFrameStyle = async (frameId: string) => {
    if (colorDebounceTimerRef.current) {
      clearTimeout(colorDebounceTimerRef.current);
    }
    const updated = { ...themeConfig, frameStyle: frameId };
    setThemeConfig(updated);
    setFormData((f: any) => ({ ...f, theme: JSON.stringify(updated) }));
    await saveThemeToDb(
      updated,
      `✓ បានរក្សាទុកស៊ុមធៀបការ "${FRAME_STYLES.find((fr) => fr.id === frameId)?.nameKm}" ដោយជោគជ័យ!`
    );
  };

  const selectPreset = async (preset: ThemePreset) => {
    if (colorDebounceTimerRef.current) {
      clearTimeout(colorDebounceTimerRef.current);
    }
    const updated = {
      ...themeConfig,
      preset: preset.id,
      primary: preset.primary,
      accent: preset.accent,
      envelope: preset.envelope,
      lining: preset.lining || preset.envelope,
      card: preset.card,
      nameKm: preset.nameKm,
      nameEn: preset.nameEn,
      id: preset.id,
    };
    setCustomMode(false);
    setThemeConfig(updated);
    setFormData((f: any) => ({ ...f, theme: JSON.stringify(updated) }));
    await saveThemeToDb(updated, `✓ បានរក្សាទុកស្ទីលពណ៌ "${preset.nameKm}" ដោយជោគជ័យ!`);
  };

  const updateCustomColor = (
    key: "primary" | "accent" | "envelope" | "lining" | "card",
    val: string
  ) => {
    const updated = {
      ...themeConfig,
      preset: "custom",
      [key]: val,
    };
    setCustomMode(true);
    setThemeConfig(updated);
    setFormData((f: any) => ({
      ...f,
      theme: JSON.stringify(updated),
    }));

    if (colorDebounceTimerRef.current) {
      clearTimeout(colorDebounceTimerRef.current);
    }

    // Debounce 400ms before auto-saving to SQLite to avoid racing / stuttering
    colorDebounceTimerRef.current = setTimeout(async () => {
      // Avoid saving broken hex strings while user is in middle of typing
      if (val.startsWith("#") && val.length < 4) return;
      await saveThemeToDb(updated, `✓ បានរក្សាទុកពណ៌ផ្ទាល់ខ្លួន (${key}: ${val}) ដោយជោគជ័យ!`);
    }, 400);
  };

  const handleManualSaveCustomTheme = async () => {
    if (colorDebounceTimerRef.current) {
      clearTimeout(colorDebounceTimerRef.current);
    }
    await saveThemeToDb(
      themeConfig,
      `✓ បានរក្សាទុកការរចនា និងពណ៌ផ្ទាល់ខ្លួនទាំងអស់ដោយជោគជ័យ! (All custom designs & colors saved)`
    );
  };

  // Image upload state
  const [uploadingImageField, setUploadingImageField] = useState<
    | "coverImageUrl"
    | "groomPhotoUrl"
    | "bridePhotoUrl"
    | "couplePhotoUrl"
    | "qrImageUrl"
    | "venuePhotoUrl"
    | null
  >(null);

  const handleImageUpload = async (
    field:
      | "coverImageUrl"
      | "groomPhotoUrl"
      | "bridePhotoUrl"
      | "couplePhotoUrl"
      | "qrImageUrl"
      | "venuePhotoUrl",
    file: File
  ) => {
    if (!file) return;

    setUploadingImageField(field);
    setError(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Image upload failed");
      }

      // Update local state
      let updatedBank = bankConfig;
      if (field === "qrImageUrl") {
        updatedBank = { ...bankConfig, qrImageUrl: data.url };
        setBankConfig(updatedBank);
        setFormData((f) => ({
          ...f,
          bankAccountInfo: JSON.stringify(updatedBank),
        }));
      } else {
        setFormData((prev) => ({ ...prev, [field]: data.url }));
      }

      // Automatically persist to database immediately
      const autoSavePayload: any = { id: initialEvent.id };
      if (field === "qrImageUrl") {
        autoSavePayload.bankAccountInfo = JSON.stringify(updatedBank);
      } else {
        autoSavePayload[field] = data.url;
      }

      const saveRes = await fetch("/api/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(autoSavePayload),
      });

      if (!saveRes.ok) {
        const errData = await saveRes.json().catch(() => ({}));
        throw new Error(errData.error || "Photo uploaded but failed to save to event.");
      }

      setSuccess(`✓ Photo "${file.name}" uploaded and saved automatically to your wedding celebration!`);
    } catch (err: any) {
      setError(err.message || "Failed to upload image file");
    } finally {
      setUploadingImageField(null);
    }
  };

  // Gallery Photos state & handlers
  const [mediaList, setMediaList] = useState<any[]>(initialMedia || []);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    setError(null);
    try {
      const added: any[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });
        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData.error || `Failed to upload ${file.name}`);
        }
        const { url } = await uploadRes.json();

        const createRes = await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: initialEvent.id,
            title: file.name.replace(/\.[^/.]+$/, ""),
            mediaType: "PHOTO",
            url,
            category: "GALLERY",
          }),
        });
        if (createRes.ok) {
          const { item } = await createRes.json();
          added.push(item);
        } else {
          const errData = await createRes.json().catch(() => ({}));
          throw new Error(errData.error || `Failed to save ${file.name} to gallery`);
        }
      }
      setMediaList((prev) => [...added, ...prev]);
      setSuccess(`✓ បានបន្ថែមរូបថត ${added.length} សន្លឹកទៅកាន់កម្រងរូបភាពអាពាហ៍ពិពាហ៍ដោយជោគជ័យ!`);
    } catch (err: any) {
      setError(err.message || "Failed to upload gallery photos");
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm("តើអ្នកប្រាកដជាចង់លុបរូបថតនេះចេញពីកម្រងរូបភាពមែនទេ?")) return;
    try {
      const res = await fetch(`/api/media?id=${mediaId}`, { method: "DELETE" });
      if (res.ok) {
        setMediaList((prev) => prev.filter((m) => m.id !== mediaId));
        setSuccess("បានលុបរូបថតដោយជោគជ័យ!");
      }
    } catch (e: any) {
      setError("Failed to delete photo");
    }
  };

  // Background Music Audio preview & handlers
  const audioFileInputRef = useRef<HTMLInputElement | null>(null);
  const [audioUploading, setAudioUploading] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioUploading(true);
    setPreviewError(null);
    setError(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Audio upload failed");
      }

      setFormData((prev) => ({ ...prev, musicUrl: data.url }));

      // Immediately auto-save musicUrl to database
      await fetch("/api/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: initialEvent.id, musicUrl: data.url }),
      });

      setSuccess(`✓ Audio file "${file.name}" uploaded and saved automatically!`);

      // If preview was playing, update preview
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        setPreviewPlaying(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload audio file");
    } finally {
      setAudioUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const togglePreview = () => {
    setPreviewError(null);
    const resolved = normalizeAudioUrl(formData.musicUrl);

    if (resolved.type === "youtube") {
      alert("YouTube audio can be tested directly on the invitation page preview!");
      return;
    }

    if (!previewAudioRef.current) {
      previewAudioRef.current = new Audio(resolved.streamUrl);
      previewAudioRef.current.onended = () => setPreviewPlaying(false);
      previewAudioRef.current.onerror = () => {
        setPreviewError("Could not play this audio URL. Please check the link or upload an MP3 file directly.");
        setPreviewPlaying(false);
      };
    } else {
      previewAudioRef.current.src = resolved.streamUrl;
    }

    if (previewPlaying) {
      previewAudioRef.current.pause();
      setPreviewPlaying(false);
    } else {
      previewAudioRef.current
        .play()
        .then(() => setPreviewPlaying(true))
        .catch((err) => {
          setPreviewError("Failed to play: Browser blocked autoplay or invalid audio link.");
          setPreviewPlaying(false);
        });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const payload = {
        ...formData,
        theme: JSON.stringify(themeConfig),
        programme: JSON.stringify(programmeDays),
        contacts: JSON.stringify(contactsList),
        bankAccountInfo: JSON.stringify(bankConfig),
        quote: JSON.stringify(letterConfig),
      };

      const res = await fetch("/api/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update event settings");
      }

      setSuccess("Wedding details successfully saved and updated!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2C2A29]">
            Wedding Event Configuration
          </h1>
          <p className="text-xs text-[#3E444A]/70 mt-1">
            Customize couple details, ceremonial schedule, venue navigation, music, and registry.
          </p>
        </div>

        <a
          href={`/invite/${formData.slug || initialEvent.slug}?code=vip-guest-01`}
          target="_blank"
          className="px-5 py-2.5 rounded-2xl bg-white border border-[#D4AF37]/30 text-xs font-semibold text-[#2C2A29] flex items-center gap-2 hover:bg-[#FAF8F5] transition-all shadow-sm w-fit"
        >
          <Sparkles className="w-4 h-4 text-[#AA7C11]" />
          <span>View Live Invitation</span>
        </a>
      </div>

      {/* 🔗 Comprehensive Link Send to User / Personalized Sharing Hub */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#FAF8F5] via-white to-[#F5EEDC]/40 border-2 border-[#D4AF37]/50 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D4AF37]/20 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-3 py-1 rounded-full bg-[#AA7C11]/15 text-[#AA7C11] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />
                <span>តំណភ្ជាប់ផ្ញើជូនភ្ញៀវ (Link Send to User)</span>
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ផ្សាយផ្ទាល់ (Live &amp; Active)
              </span>
            </div>
            <p className="text-xs text-[#3E444A]/80">
              បញ្ចូលឈ្មោះភ្ញៀវ ដើម្បីបង្កើតតំណភ្ជាប់ធៀបការពិសេសផ្ទាល់ខ្លួន និងផ្ញើទៅកាន់ Telegram, WhatsApp ឬ Messenger ដោយចុចតែម្តង (1-Click Share)!
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenQrCode}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#D4AF37]/40 text-xs font-semibold text-[#2C2A29] hover:bg-[#FAF8F5] flex items-center gap-1.5 transition shadow-2xs active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5 text-[#AA7C11]" />
              <span>មើល QR Code</span>
            </button>
            <a
              href={getPersonalizedUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:brightness-105 transition active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>បើកមើលធៀបការ (Open View)</span>
            </a>
          </div>
        </div>

        {/* Guest List Picker if available */}
        {guestList.length > 0 && (
          <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-2.5">
            <span className="text-xs font-bold text-amber-900 shrink-0 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-700" />
              <span>ជ្រើសពីបញ្ជីភ្ញៀវ ({guestList.length} នាក់)៖</span>
            </span>
            <select
              value={selectedGuestCode}
              onChange={(e) => {
                const code = e.target.value;
                setSelectedGuestCode(code);
                if (code) {
                  const g = guestList.find((item: any) => item.invitationCode === code);
                  if (g) setGuestNameInput(g.name);
                }
              }}
              className="flex-1 px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-medium text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              <option value="">-- ឬជ្រើសរើសឈ្មោះភ្ញៀវពី Database --</option>
              {guestList.map((g: any) => (
                <option key={g.id} value={g.invitationCode}>
                  {g.name} ({g.category || "VIP"} - {g.invitationCode})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Personalized Guest Input & Quick Chips */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-xs font-bold text-[#2C2A29] uppercase tracking-wide shrink-0">
              ឈ្មោះភ្ញៀវលើធៀបការ (Guest Name):
            </label>
            <div className="relative flex-1">
              <input
                type="text"
                value={guestNameInput}
                onChange={(e) => {
                  setGuestNameInput(e.target.value);
                  setSelectedGuestCode("");
                }}
                placeholder="ឧទាហរណ៍៖ ឯកឧត្តម លោកជំទាវ, លោកពូ អ្នកមីង, មិត្តភក្តិ..."
                className="w-full px-3.5 py-2 bg-white border border-[#D4AF37]/40 rounded-xl text-xs font-medium text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#AA7C11]/30"
              />
              {guestNameInput && (
                <button
                  type="button"
                  onClick={() => {
                    setGuestNameInput("");
                    setSelectedGuestCode("");
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick preset name chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] uppercase font-bold text-[#3E444A]/60">ជ្រើសរើសរហ័ស (Quick):</span>
            
            {/* Public General Link Button (No guest name attached) */}
            <button
              type="button"
              onClick={() => {
                setGuestNameInput("");
                setSelectedGuestCode("");
              }}
              className={`text-[11px] px-2.5 py-0.5 rounded-lg border transition font-semibold flex items-center gap-1 ${
                !guestNameInput
                  ? "bg-emerald-700 text-white border-emerald-700 shadow-2xs"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              <span>🌐 តំណភ្ជាប់ទូទៅ (Public Link គ្មានឈ្មោះ)</span>
            </button>

            {[
              "ឯកឧត្តម លោកជំទាវ",
              "លោកពូ អ្នកមីង",
              "បងប្រុស បងស្រី",
              "លោកគ្រូ អ្នកគ្រូ",
              "មិត្តភក្តិ & ក្រុមគ្រួសារ",
              "ភ្ញៀវកិត្តិយស (VIP Guest)",
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setGuestNameInput(chip);
                  setSelectedGuestCode("");
                }}
                className={`text-[11px] px-2.5 py-0.5 rounded-lg border transition ${
                  guestNameInput === chip
                    ? "bg-[#AA7C11] text-white border-[#AA7C11]"
                    : "bg-white text-[#2C2A29] border-gray-200 hover:border-[#D4AF37]"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Generated Live URL Display Bar */}
        <div className="p-3 rounded-2xl bg-white border border-[#D4AF37]/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5 flex-1 min-w-0">
            <span className="text-[10px] text-[#3E444A]/60 uppercase font-bold block">
              តំណភ្ជាប់ផ្ទាល់ខ្លួនសម្រាប់ភ្ញៀវ (Personalized Guest URL):
            </span>
            <div className="font-mono text-xs text-[#AA7C11] truncate select-all">
              {getPersonalizedUrl()}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(getPersonalizedUrl());
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
                setSuccess("✓ បានចម្លងតំណភ្ជាប់ធៀបការភ្ញៀវរួចរាល់! (Copied guest link)");
              }}
              className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#D4AF37]/40 hover:bg-[#F3E5AB]/30 text-xs font-semibold text-[#2C2A29] flex items-center gap-1.5 transition active:scale-95"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#AA7C11]" />}
              <span>{copiedLink ? "បានចម្លង!" : "ចម្លង Link"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(getKhmerShareMessage());
                setCopiedFullMessage(true);
                setTimeout(() => setCopiedFullMessage(false), 2000);
                setSuccess("✓ បានចម្លងសារអញ្ជើញជាភាសាខ្មែរផ្លូវការរួចរាល់! (Copied formal invitation message)");
              }}
              className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#D4AF37]/40 hover:bg-[#F3E5AB]/30 text-xs font-semibold text-[#2C2A29] flex items-center gap-1.5 transition active:scale-95"
            >
              {copiedFullMessage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5 text-[#AA7C11]" />}
              <span>{copiedFullMessage ? "បានចម្លងសារ!" : "ចម្លងសារអញ្ជើញ"}</span>
            </button>

            {/* 1-Click Telegram Share */}
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(getPersonalizedUrl())}&text=${encodeURIComponent(getKhmerShareMessage())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#229ED9] text-white text-xs font-semibold hover:brightness-105 flex items-center gap-1.5 shadow-2xs transition active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram</span>
            </a>

            {/* 1-Click WhatsApp Share */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(getKhmerShareMessage())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#25D366] text-white text-xs font-semibold hover:brightness-105 flex items-center gap-1.5 shadow-2xs transition active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* 💡 Visual explanation breakdown answering "Why links look similar" */}
        <div className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#D4AF37]/30 text-xs text-[#3E444A] space-y-2">
          <div className="font-bold text-[#AA7C11] flex items-center justify-between gap-2 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span>💡 ហេតុអ្វីបានជា Link មើលទៅដូចគ្នា? (Why links have the same base?)</span>
            </span>
            <a
              href="/dashboard/guests"
              className="text-[11px] text-[#AA7C11] underline hover:text-[#7A5807] font-semibold flex items-center gap-1"
            >
              <Users className="w-3 h-3" />
              <span>ទៅកាន់បញ្ជីភ្ញៀវទាំងអស់ (Manage Guests Page) &rarr;</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] leading-relaxed">
            <div className="p-2.5 rounded-xl bg-white border border-[#D4AF37]/20 shadow-2xs space-y-1">
              <span className="font-bold text-[#2C2A29] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>១. ផ្នែកដើម Link មង្គលការ (Base Wedding URL)</span>
              </span>
              <div className="font-mono text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded truncate">
                /invite/{formData.slug || initialEvent.slug}
              </div>
              <p className="text-gray-500 text-[10px]">
                គឺជាអាសយដ្ឋានគេហទំព័រមង្គលការរបស់កូនកំលោះ និងកូនក្រមុំ (កំណត់តាមផ្ទាំងខាងក្រោម)។
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-[#D4AF37]/20 shadow-2xs space-y-1">
              <span className="font-bold text-[#2C2A29] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>២. ផ្នែកចុងក្រោយ ឈ្មោះភ្ញៀវ (Personalized Query)</span>
              </span>
              <div className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded truncate">
                {guestNameInput ? `?to=${encodeURIComponent(guestNameInput)}` : "(គ្មានឈ្មោះ - Public Link)"}
              </div>
              <p className="text-gray-500 text-[10px]">
                គឺជាឈ្មោះផ្ទាល់ខ្លួនរបស់ភ្ញៀវនីមួយៗ។ នៅពេលភ្ញៀវបើក Link នោះ ប្រព័ន្ធនឹងស្រង់ឈ្មោះនោះមកបង្ហាញលើស្រោមសំបុត្រ 3D ស្វ័យប្រវត្តិ!
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-800 text-xs flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Event Title & Cover */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/25 shadow-card space-y-6">
          <div className="flex items-center gap-2 font-serif text-lg font-bold text-[#2C2A29]">
            <Sparkles className="w-5 h-5 text-[#AA7C11]" />
            <span>Celebration Header &amp; Background Cover</span>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#3E444A] mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          {/* Custom Wedding URL Slug */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#D4AF37]/30 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#AA7C11]">
                🔗 តំណភ្ជាប់គេហទំព័រមង្គលការ (Wedding URL Link / Custom Slug) *
              </label>
              <button
                type="button"
                onClick={() => {
                  const groomClean = (formData.groomName || "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
                  const brideClean = (formData.brideName || "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
                  const autoSlug = (groomClean && brideClean) ? `${groomClean}-and-${brideClean}` : "davita-and-meassa";
                  setFormData((prev) => ({ ...prev, slug: autoSlug }));
                }}
                className="text-[11px] text-[#AA7C11] hover:underline font-semibold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>បង្កើតតាមឈ្មោះកូនកំលោះ &amp; កូនក្រមុំ</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-500 bg-white px-3 py-2.5 rounded-xl border border-gray-200 shrink-0">
                /invite/
              </span>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => {
                  const cleaned = e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9\-]/g, "-")
                    .replace(/-+/g, "-");
                  setFormData({ ...formData, slug: cleaned });
                }}
                placeholder="davita-and-meassa"
                className="flex-1 px-4 py-2.5 bg-white border border-[#D4AF37]/40 rounded-xl text-xs font-mono font-bold text-[#AA7C11] focus:outline-none focus:ring-2 focus:ring-[#AA7C11]/30"
              />
            </div>
            <p className="text-[11px] text-[#3E444A]/70">
              អាសយដ្ឋាន URL នេះនឹងប្រើប្រាស់សម្រាប់បង្កើតតំណភ្ជាប់ (Link) ផ្ញើជូនភ្ញៀវ និង QR Code ទាំងអស់។ ឧទាហរណ៍៖ <span className="font-mono text-amber-800 font-semibold">/invite/{formData.slug || "davita-and-meassa"}</span>
            </p>
          </div>

          {/* Hero & Envelope Background Cover */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#D4AF37]/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#AA7C11] flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" />
                  Hero &amp; 3D Envelope Gate Background Image
                </span>
                <p className="text-[11px] text-[#3E444A]/70 mt-0.5">
                  This background image appears immediately on both the 3D Envelope Gate and the main invitation.
                </p>
              </div>

              {/* Upload file button */}
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D4AF37]/40 text-xs font-semibold text-[#2C2A29] hover:bg-[#FAF8F5] transition shadow-xs w-fit">
                <Upload className="w-3.5 h-3.5 text-[#AA7C11]" />
                <span>{uploadingImageField === "coverImageUrl" ? "Uploading..." : "Upload Photo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingImageField === "coverImageUrl"}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload("coverImageUrl", file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 pt-1 items-center">
              <span className="text-[10px] uppercase font-bold text-[#3E444A]/60">Presets:</span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, coverImageUrl: "/img/hero-2000.webp" })}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                  formData.coverImageUrl === "/img/hero-2000.webp"
                    ? "bg-[#AA7C11] text-white border-[#AA7C11]"
                    : "bg-white text-[#2C2A29] border-gray-200 hover:border-[#D4AF37]"
                }`}
              >
                🪷 Lotus Lanterns (Default)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, coverImageUrl: "/img/cozy-2000.webp" })}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                  formData.coverImageUrl === "/img/cozy-2000.webp"
                    ? "bg-[#AA7C11] text-white border-[#AA7C11]"
                    : "bg-white text-[#2C2A29] border-gray-200 hover:border-[#D4AF37]"
                }`}
              >
                🏡 Wooden House
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, coverImageUrl: "/img/words-2000.webp" })}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                  formData.coverImageUrl === "/img/words-2000.webp"
                    ? "bg-[#AA7C11] text-white border-[#AA7C11]"
                    : "bg-white text-[#2C2A29] border-gray-200 hover:border-[#D4AF37]"
                }`}
              >
                🏛️ Arch Pavilion
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, coverImageUrl: "/img/pond-2000.webp" })}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                  formData.coverImageUrl === "/img/pond-2000.webp"
                    ? "bg-[#AA7C11] text-white border-[#AA7C11]"
                    : "bg-white text-[#2C2A29] border-gray-200 hover:border-[#D4AF37]"
                }`}
              >
                🌿 Lotus Pond
              </button>
            </div>

            {/* Preview & Manual URL */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center pt-1">
              <div className="sm:col-span-1">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-black/10 flex items-center justify-center">
                  {formData.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.coverImageUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/img/hero-2000.webp";
                      }}
                    />
                  ) : (
                    <span className="text-[10px] text-gray-400">No Image</span>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3 space-y-1">
                <input
                  type="text"
                  value={formData.coverImageUrl}
                  onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                  placeholder="e.g. /img/hero-2000.webp or /uploads/..."
                  className="w-full px-3 py-2 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
                />
                <p className="text-[10px] text-[#3E444A]/60">
                  Must be an image file (JPG, PNG, WEBP) or an uploaded photo from your device.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wedding Design, Template Styles & Customizer */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/25 shadow-card space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#D4AF37]/15 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-serif text-lg font-bold text-[#2C2A29]">
                <Palette className="w-5 h-5 text-[#AA7C11]" />
                <span>Wedding Design &amp; Theme Customizer (រចនាប័ទ្មធៀបការ &amp; ស្ទីលពណ៌)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {savingTheme ? (
                  <span className="text-[11px] text-[#AA7C11] font-bold animate-pulse flex items-center gap-1">
                    <Sparkles className="w-3 h-3 animate-spin" />
                    <span>កំពុងរក្សាទុកការកែសម្រួល... (Auto-Saving...)</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>រាល់ការជ្រើសរើសត្រូវបានរក្សាទុកដោយស្វ័យប្រវត្តិ (Auto-Saved &amp; Live)</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* 5 Main Customizer Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#FAF8F5] border border-[#D4AF37]/30">
                <button
                  type="button"
                  onClick={() => setThemeSubTab("template")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    themeSubTab === "template"
                      ? "bg-[#AA7C11] text-white shadow-xs"
                      : "text-[#3E444A] hover:bg-white"
                  }`}
                >
                  🏛️ Templates ({TEMPLATE_DESIGNS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setThemeSubTab("color")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    themeSubTab === "color"
                      ? "bg-[#AA7C11] text-white shadow-xs"
                      : "text-[#3E444A] hover:bg-white"
                  }`}
                >
                  🎨 Color Palette (ស្ទីលពណ៌)
                </button>
                <button
                  type="button"
                  onClick={() => setThemeSubTab("ornaments")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    themeSubTab === "ornaments"
                      ? "bg-[#AA7C11] text-white shadow-xs"
                      : "text-[#3E444A] hover:bg-white"
                  }`}
                >
                  ⚜️ Seal &amp; Frame (ត្រា &amp; ស៊ុម)
                </button>
                <button
                  type="button"
                  onClick={() => setThemeSubTab("animations")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    themeSubTab === "animations"
                      ? "bg-[#AA7C11] text-white shadow-xs"
                      : "text-[#3E444A] hover:bg-white"
                  }`}
                >
                  ✨ Animations ({ANIMATION_STYLES.length})
                </button>
                <button
                  type="button"
                  onClick={() => setThemeSubTab("share")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    themeSubTab === "share"
                      ? "bg-[#AA7C11] text-white shadow-xs"
                      : "text-[#3E444A] hover:bg-white"
                  }`}
                >
                  🔗 Send Link to User (ផ្ញើ Link)
                </button>
              </div>

              {/* Direct Live Preview Button */}
              <a
                href={getPersonalizedUrl()}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs font-bold shadow-luxury hover:brightness-110 transition flex items-center gap-1.5"
              >
                <span>👁️ Live Preview</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* TAB 1: TEMPLATE DESIGNS */}
          {themeSubTab === "template" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-[#AA7C11] uppercase tracking-wider">
                    Select Wedding Template Design (ជ្រើសរើសទម្រង់រចនាធៀបការ {TEMPLATE_DESIGNS.length} បែប)
                  </h4>
                  <p className="text-xs text-[#3E444A]/80 mt-0.5">
                    ជ្រើសរើសរចនាប័ទ្មធៀបការដែលអ្នកពេញចិត្ត។ រចនាប័ទ្មនីមួយៗមានទម្រង់ក្បូរក្បាច់ ស៊ុមសន្លឹកប័ណ្ណ និងបរិយាកាសខុសៗគ្នា។
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TEMPLATE_DESIGNS.map((tpl) => {
                  const isSelected = (themeConfig.templateStyle || "royal-heritage") === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => updateTemplateStyle(tpl.id)}
                      className={`relative p-5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                        isSelected
                          ? "border-[#AA7C11] ring-2 ring-[#AA7C11]/30 bg-[#FAF8F5] shadow-md"
                          : "border-gray-200 hover:border-[#D4AF37]/50 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#AA7C11] mb-1.5">
                            {tpl.badge}
                          </span>
                          <div className="font-serif text-sm font-bold text-[#2C2A29]">
                            {tpl.nameKm}
                          </div>
                          <div className="text-[11px] font-medium text-[#3E444A]/60">
                            {tpl.nameEn}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#AA7C11] text-white flex items-center justify-center shrink-0 mt-1">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#3E444A]/80 leading-relaxed">
                        {tpl.descKm}
                      </p>

                      {tpl.features && tpl.features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {tpl.features.map((feat) => (
                            <span key={feat} className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#D4AF37]/30 text-[#AA7C11] font-medium shadow-2xs">
                              ✓ {feat}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-[10px] text-[#3E444A]/60">Aesthetic Preview:</span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-5 h-5 rounded-lg border border-black/10 shadow-xs"
                            style={{ backgroundColor: tpl.previewBg }}
                          />
                          <span
                            className="w-5 h-5 rounded-lg border border-black/10 shadow-xs"
                            style={{ backgroundColor: tpl.previewAccent }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: COLOR PALETTE & CUSTOM COLORS */}
          {themeSubTab === "color" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-xs text-[#3E444A]/80 leading-relaxed">
                  កំណត់ពណ៌សម្រាប់ធៀបការទាំងមូល រួមទាំងពណ៌ស្រោមសំបុត្រ (3D Envelope), ពណ៌ពេលចុចបើកប្រអប់សំបុត្រ (Open Box Flap &amp; Inside Letter Card), និងពណ៌ផ្ទៃខាងក្រោយទាំងអស់។
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setCustomMode(false)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                      !customMode
                        ? "bg-[#AA7C11] text-white shadow-xs"
                        : "bg-[#FAF8F5] text-[#3E444A] hover:bg-gray-100"
                    }`}
                  >
                    Curated Themes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomMode(true);
                      setThemeConfig((prev: any) => {
                        const updated = { ...prev, preset: "custom" };
                        setFormData((f) => ({ ...f, theme: JSON.stringify(updated) }));
                        return updated;
                      });
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                      customMode
                        ? "bg-[#AA7C11] text-white shadow-xs"
                        : "bg-[#FAF8F5] text-[#3E444A] hover:bg-gray-100"
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    Custom Color
                  </button>
                </div>
              </div>

              {/* Preset Cards Grid */}
              {!customMode && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {THEME_PRESETS.map((p) => {
                    const isSelected = themeConfig.preset === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => selectPreset(p)}
                        className={`relative p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                          isSelected
                            ? "border-[#AA7C11] ring-2 ring-[#AA7C11]/30 bg-[#FAF8F5] shadow-sm"
                            : "border-gray-200 hover:border-[#D4AF37]/50 bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-xs text-[#2C2A29] flex items-center gap-1.5">
                              <span>{p.nameKm}</span>
                            </div>
                            <div className="text-[11px] text-[#3E444A]/60">{p.nameEn}</div>
                          </div>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-[#AA7C11] text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                        {/* Color Swatches */}
                        <div className="flex items-center gap-2 pt-1">
                          <div className="flex items-center -space-x-1.5">
                            <span
                              className="w-6 h-6 rounded-full border-2 border-white shadow-xs shrink-0"
                              style={{ backgroundColor: p.primary }}
                              title={`Background: ${p.primary}`}
                            />
                            <span
                              className="w-6 h-6 rounded-full border-2 border-white shadow-xs shrink-0"
                              style={{ backgroundColor: p.envelope }}
                              title={`Envelope Box Exterior: ${p.envelope}`}
                            />
                            <span
                              className="w-6 h-6 rounded-full border-2 border-white shadow-xs shrink-0"
                              style={{ backgroundColor: p.lining || p.envelope }}
                              title={`Open Box Flap Inside: ${p.lining || p.envelope}`}
                            />
                            <span
                              className="w-6 h-6 rounded-full border-2 border-white shadow-xs shrink-0"
                              style={{ backgroundColor: p.card }}
                              title={`Inside Card: ${p.card}`}
                            />
                            <span
                              className="w-6 h-6 rounded-full border-2 border-white shadow-xs shrink-0"
                              style={{ backgroundColor: p.accent }}
                              title={`Gold Foil: ${p.accent}`}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-[#3E444A]/60 uppercase ml-auto">
                            {p.accent}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Custom Color Pickers & Live 3D Box Preview */}
              {customMode && (
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#D4AF37]/35 space-y-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D4AF37]/20">
                    <div>
                      <div className="text-xs font-bold text-[#AA7C11] uppercase tracking-wider flex items-center gap-2">
                        <span>🎨 Custom Color Pickers (កែសម្រួលពណ៌នីមួយៗតាមចិត្ត)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                          Live &amp; Auto-Save
                        </span>
                      </div>
                      <p className="text-[11px] text-[#3E444A]/80 mt-1">
                        លោកអ្នកអាចកែពណ៌គ្រប់ផ្នែកទាំងអស់នៃធៀបការ រួមទាំងពណ៌ពេលចុចបើកប្រអប់ (Flap Inside) ស្រោមសំបុត្រ និងសន្លឹកប័ណ្ណខាងក្នុង។
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {themeSaveSuccess && (
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs animate-in fade-in">
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>បានរក្សាទុក! (Saved)</span>
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={handleManualSaveCustomTheme}
                        disabled={savingTheme}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-[#AA7C11] hover:bg-[#8F680D] active:scale-95 text-white shadow-md flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>{savingTheme ? "កំពុងរក្សាទុក..." : "💾 រក្សាទុកពណ៌ភ្លាមៗ (Save Colors)"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Starter Presets */}
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2">
                    <span className="text-[11px] font-bold text-[#2C2A29] block">
                      ⚡ ចាប់ផ្តើមរហ័សពីពណ៌គំរូ (Quick Starter Palette):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {THEME_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            const updated = {
                              ...themeConfig,
                              preset: "custom",
                              primary: preset.primary,
                              accent: preset.accent,
                              envelope: preset.envelope,
                              lining: preset.lining || preset.envelope,
                              card: preset.card,
                            };
                            setThemeConfig(updated);
                            setFormData((f: any) => ({ ...f, theme: JSON.stringify(updated) }));
                            saveThemeToDb(updated, `✓ បានចម្លងស្ទីលពណ៌ "${preset.nameKm}" មកក្នុង Custom Palette!`);
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] border border-gray-200 hover:border-[#AA7C11] bg-[#FAF8F5] flex items-center gap-1.5 transition hover:scale-105"
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: preset.envelope }}
                          />
                          <span className="font-medium text-[#2C2A29]">{preset.nameKm.split(" & ")[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Interactive 3D Envelope Box Miniature Preview */}
                  <div className="p-4 rounded-xl bg-gradient-to-b from-[#181224] to-[#0c0914] border border-[#D4AF37]/40 shadow-inner flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center md:text-left">
                      <div className="text-xs font-bold text-[#fbefc0] flex items-center justify-center md:justify-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#d9b15a]" />
                        <span>រូបរាងប្រអប់ពេលចុចបើក (3D Envelope Open Box Preview)</span>
                      </div>
                      <p className="text-[11px] text-white/70 max-w-sm">
                        មើលការផ្លាស់ប្តូរពណ៌ក្នុងពេលជាក់ស្តែង (Real-time Preview): តួប្រអប់ខាងក្រៅ, គម្របខាងក្នុងពេលបើក, និងសន្លឹកប័ណ្ណធៀបការ
                      </p>
                    </div>

                    {/* Miniature 3D Box Illustration */}
                    <div className="relative w-48 h-32 flex items-center justify-center shrink-0">
                      {/* Envelope Back Body */}
                      <div
                        className="absolute bottom-1 w-36 h-24 rounded-lg shadow-2xl border transition-colors duration-300"
                        style={{
                          backgroundColor: themeConfig.envelope,
                          borderColor: themeConfig.accent,
                        }}
                      />

                      {/* Inside Letter Card (sliding out) */}
                      <div
                        className="absolute bottom-5 w-30 h-20 rounded-md shadow-lg border transition-colors duration-300 flex flex-col items-center justify-center p-2 text-center"
                        style={{
                          backgroundColor: themeConfig.card,
                          borderColor: `${themeConfig.accent}80`,
                        }}
                      >
                        <div
                          className="w-16 h-1 rounded-full mb-1 transition-colors duration-300"
                          style={{ backgroundColor: themeConfig.accent }}
                        />
                        <span
                          className="text-[9px] font-bold tracking-wider uppercase transition-colors duration-300"
                          style={{ color: themeConfig.accent }}
                        >
                          ធៀបអាពាហ៍ពិពាហ៍
                        </span>
                        <div className="w-10 h-0.5 bg-current opacity-30 mt-1" />
                      </div>

                      {/* Open Flap Back / Lining (Pointing Upward - Visible when Opened) */}
                      <div
                        className="absolute bottom-20 w-36 h-12 transition-colors duration-300 shadow-md border-t border-l border-r"
                        style={{
                          backgroundColor: themeConfig.lining || themeConfig.envelope,
                          borderColor: `${themeConfig.accent}60`,
                          clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)",
                        }}
                        title={`Flap Inside (Lining): ${themeConfig.lining || themeConfig.envelope}`}
                      />

                      {/* Envelope Pocket Front Bottom V-Fold */}
                      <div
                        className="absolute bottom-1 w-36 h-14 rounded-b-lg border-b border-l border-r transition-colors duration-300 pointer-events-none"
                        style={{
                          backgroundColor: themeConfig.envelope,
                          borderColor: `${themeConfig.accent}50`,
                          clipPath: "polygon(0% 0%, 50% 60%, 100% 0%, 100% 100%, 0% 100%)",
                        }}
                      />

                      {/* Gold Wax Seal Badge */}
                      <div
                        className="absolute bottom-5 w-6 h-6 rounded-full shadow-md flex items-center justify-center text-[10px] transition-colors duration-300 pointer-events-none border"
                        style={{
                          backgroundColor: themeConfig.accent,
                          borderColor: "#ffffff40",
                          color: "#1a160c",
                        }}
                      >
                        {themeConfig.sealStyle === "lotus"
                          ? "🪷"
                          : themeConfig.sealStyle === "monogram"
                          ? "❦"
                          : themeConfig.sealStyle === "knot"
                          ? "♾️"
                          : "👑"}
                      </div>
                    </div>
                  </div>

                  {/* 5 Color Pickers Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
                    {/* 1. Primary Background */}
                    <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-gray-200 hover:border-[#AA7C11]/50 transition shadow-2xs">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#2C2A29]">
                          1. ផ្ទៃខាងក្រោយទូទៅ
                        </label>
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0"
                          style={{ backgroundColor: themeConfig.primary }}
                        />
                      </div>
                      <p className="text-[10px] text-[#3E444A]/60">Primary Background</p>
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="color"
                          value={themeConfig.primary}
                          onChange={(e) => updateCustomColor("primary", e.target.value)}
                          className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-white shrink-0"
                          title="Click to select Primary Color"
                        />
                        <input
                          type="text"
                          value={themeConfig.primary}
                          onChange={(e) => updateCustomColor("primary", e.target.value)}
                          className="w-full px-2 py-1.5 text-xs font-mono uppercase bg-[#FAF8F5] border border-gray-200 rounded-lg text-center"
                        />
                      </div>
                    </div>

                    {/* 2. Envelope Exterior Box */}
                    <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-gray-200 hover:border-[#AA7C11]/50 transition shadow-2xs">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#2C2A29]">
                          2. ប្រអប់ &amp; ស្រោមក្រៅ
                        </label>
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0"
                          style={{ backgroundColor: themeConfig.envelope }}
                        />
                      </div>
                      <p className="text-[10px] text-[#3E444A]/60">Envelope Box Exterior</p>
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="color"
                          value={themeConfig.envelope}
                          onChange={(e) => updateCustomColor("envelope", e.target.value)}
                          className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-white shrink-0"
                          title="Click to select Envelope Color"
                        />
                        <input
                          type="text"
                          value={themeConfig.envelope}
                          onChange={(e) => updateCustomColor("envelope", e.target.value)}
                          className="w-full px-2 py-1.5 text-xs font-mono uppercase bg-[#FAF8F5] border border-gray-200 rounded-lg text-center"
                        />
                      </div>
                    </div>

                    {/* 3. Open Box Flap Inside / Lining */}
                    <div className="space-y-1.5 bg-gradient-to-br from-amber-50/70 to-white p-3.5 rounded-xl border-2 border-[#D4AF37] hover:border-[#AA7C11] transition shadow-xs">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#AA7C11] flex items-center gap-1">
                          <span>3. គម្របពេលចុចបើក ⭐</span>
                        </label>
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0"
                          style={{ backgroundColor: themeConfig.lining || themeConfig.envelope }}
                        />
                      </div>
                      <p className="text-[10px] text-[#AA7C11]/90 font-medium">Open Box Flap Inside (Lining)</p>
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="color"
                          value={themeConfig.lining || themeConfig.envelope}
                          onChange={(e) => updateCustomColor("lining", e.target.value)}
                          className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-white shrink-0 ring-2 ring-[#AA7C11]/30"
                          title="Click to select Open Box Flap Inside Color"
                        />
                        <input
                          type="text"
                          value={themeConfig.lining || themeConfig.envelope}
                          onChange={(e) => updateCustomColor("lining", e.target.value)}
                          className="w-full px-2 py-1.5 text-xs font-mono uppercase bg-[#FAF8F5] border border-amber-300 rounded-lg text-center font-bold text-[#AA7C11]"
                        />
                      </div>
                    </div>

                    {/* 4. Inside Letter Card */}
                    <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-gray-200 hover:border-[#AA7C11]/50 transition shadow-2xs">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#2C2A29]">
                          4. សន្លឹកប័ណ្ណខាងក្នុង
                        </label>
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0"
                          style={{ backgroundColor: themeConfig.card }}
                        />
                      </div>
                      <p className="text-[10px] text-[#3E444A]/60">Inside Letter Card</p>
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="color"
                          value={themeConfig.card}
                          onChange={(e) => updateCustomColor("card", e.target.value)}
                          className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-white shrink-0"
                          title="Click to select Inside Card Color"
                        />
                        <input
                          type="text"
                          value={themeConfig.card}
                          onChange={(e) => updateCustomColor("card", e.target.value)}
                          className="w-full px-2 py-1.5 text-xs font-mono uppercase bg-[#FAF8F5] border border-gray-200 rounded-lg text-center"
                        />
                      </div>
                    </div>

                    {/* 5. Accent Gold Foil */}
                    <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-gray-200 hover:border-[#AA7C11]/50 transition shadow-2xs">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#2C2A29]">
                          5. ទឹកមាស &amp; ក្បាច់ឆ្លាក់
                        </label>
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0"
                          style={{ backgroundColor: themeConfig.accent }}
                        />
                      </div>
                      <p className="text-[10px] text-[#3E444A]/60">Accent &amp; Gold Foil</p>
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="color"
                          value={themeConfig.accent}
                          onChange={(e) => updateCustomColor("accent", e.target.value)}
                          className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-white shrink-0"
                          title="Click to select Accent Color"
                        />
                        <input
                          type="text"
                          value={themeConfig.accent}
                          onChange={(e) => updateCustomColor("accent", e.target.value)}
                          className="w-full px-2 py-1.5 text-xs font-mono uppercase bg-[#FAF8F5] border border-gray-200 rounded-lg text-center"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Bar for Custom Colors */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#D4AF37]/20 bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
                    <div className="text-xs text-[#3E444A]/80 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#AA7C11] shrink-0" />
                      <span>ពណ៌ទាំង ៥ នេះត្រូវបានរក្សាទុកដោយស្វ័យប្រវត្តិ ហើយលោកអ្នកក៏អាចចុចប៊ូតុងខាងស្តាំដើម្បីរក្សាទុកដោយផ្ទាល់បានភ្លាមៗ។</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {themeSaveSuccess && (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>{themeSaveSuccess}</span>
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={handleManualSaveCustomTheme}
                        disabled={savingTheme}
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-105 active:scale-95 text-white shadow-md flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>{savingTheme ? "កំពុងរក្សាទុក..." : "💾 រក្សាទុកពណ៌ទាំងអស់ (Save All Colors)"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WAX SEAL & FRAME STYLES */}
          {themeSubTab === "ornaments" && (
            <div className="space-y-6">
              {/* Wax Seal Selector */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-[#AA7C11] uppercase tracking-wider">
                    Wax Seal Crest Style (រចនាប័ទ្មត្រាឃ្មុំបើកសំបុត្រ)
                  </h4>
                  <p className="text-xs text-[#3E444A]/70 mt-0.5">
                    ជ្រើសរើសរូបសញ្ញាត្រាឃ្មុំបិទលើស្រោមសំបុត្រ 3D Envelope ដែលភ្ញៀវត្រូវចុចបើក។
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SEAL_STYLES.map((seal) => {
                    const isSelected = (themeConfig.sealStyle || "crown") === seal.id;
                    return (
                      <button
                        key={seal.id}
                        type="button"
                        onClick={() => updateSealStyle(seal.id)}
                        className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                          isSelected
                            ? "border-[#AA7C11] ring-2 ring-[#AA7C11]/30 bg-[#FAF8F5] shadow-xs"
                            : "border-gray-200 hover:border-[#D4AF37]/50 bg-white"
                        }`}
                      >
                        <span className="text-2xl">{seal.icon}</span>
                        <span className="text-xs font-bold text-[#2C2A29]">{seal.nameKm}</span>
                        <span className="text-[10px] text-[#3E444A]/60">{seal.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card Frame Selector */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div>
                  <h4 className="text-xs font-bold text-[#AA7C11] uppercase tracking-wider">
                    Card Frame &amp; Border Style (ក្បូរក្បាច់ស៊ុមសន្លឹកធៀប)
                  </h4>
                  <p className="text-xs text-[#3E444A]/70 mt-0.5">
                    ជ្រើសរើសទម្រង់ស៊ុមក្បាច់ព័ទ្ធជុំវិញសន្លឹកប័ណ្ណលិខិតអញ្ជើញ។
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {FRAME_STYLES.map((frame) => {
                    const isSelected = (themeConfig.frameStyle || "ornate-kbach") === frame.id;
                    return (
                      <button
                        key={frame.id}
                        type="button"
                        onClick={() => updateFrameStyle(frame.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                          isSelected
                            ? "border-[#AA7C11] ring-2 ring-[#AA7C11]/30 bg-[#FAF8F5] shadow-xs"
                            : "border-gray-200 hover:border-[#D4AF37]/50 bg-white"
                        }`}
                      >
                        <span className="text-xs font-bold text-[#2C2A29]">{frame.nameKm}</span>
                        <span className="text-[11px] text-[#3E444A]/60">{frame.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANIMATIONS & PARTICLE EFFECTS */}
          {themeSubTab === "animations" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-[#AA7C11] uppercase tracking-wider">
                    Select Invitation Animation &amp; Effects (ជ្រើសរើសចលនា &amp; គំនូរជីវចល {ANIMATION_STYLES.length} បែប)
                  </h4>
                  <p className="text-xs text-[#3E444A]/80 mt-0.5">
                    ជ្រើសរើសចលនា Particles ខាងក្រោយដែលអណ្តែតលើអេក្រង់ធៀបការ (ផ្កាធ្លាក់, កម្ទេចមាស, មេអំបៅ, បេះដូង, ឬកាំជ្រួច)។
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ANIMATION_STYLES.map((anim) => {
                  const isSelected = (themeConfig.animationStyle || "falling-petals") === anim.id;
                  return (
                    <button
                      key={anim.id}
                      type="button"
                      onClick={() => updateAnimationStyle(anim.id)}
                      className={`relative p-5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                        isSelected
                          ? "border-[#AA7C11] ring-2 ring-[#AA7C11]/30 bg-[#FAF8F5] shadow-md"
                          : "border-gray-200 hover:border-[#D4AF37]/50 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-2xs border border-black/5"
                            style={{ backgroundColor: `${anim.previewColor}18` }}
                          >
                            {anim.icon}
                          </span>
                          <div>
                            <div className="font-serif text-xs font-bold text-[#2C2A29]">
                              {anim.nameKm}
                            </div>
                            <div className="text-[10px] text-[#3E444A]/60 font-medium">
                              {anim.nameEn}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#AA7C11] text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#3E444A]/80 leading-relaxed">
                        {anim.descKm}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-[10px] text-[#3E444A]/60">Status:</span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-[#AA7C11]/20 text-[#AA7C11]"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {isSelected ? "✓ កំពុងប្រើ (Active)" : "ជ្រើសរើស (Select)"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: SHARE LINK CONSOLE */}
          {themeSubTab === "share" && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50/50 to-white border border-[#D4AF37]/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-[#AA7C11] uppercase tracking-wider flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5" />
                      <span>ផ្ញើតំណភ្ជាប់ធៀបការជូនភ្ញៀវ (Send Invitation Link to Guest)</span>
                    </h4>
                    <p className="text-xs text-[#3E444A]/80">
                      បង្កើតតំណភ្ជាប់ឈ្មោះភ្ញៀវផ្ទាល់ខ្លួន និងចែករំលែកតាមបណ្តាញសង្គម ឬបង្កើត QR Code សម្រាប់បោះពុម្ព។
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenQrCode}
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-[#D4AF37]/40 text-xs font-semibold text-[#2C2A29] hover:bg-[#FAF8F5] flex items-center gap-1.5 transition shadow-2xs w-fit"
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#AA7C11]" />
                    <span>ទាញយក QR Code</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-[#2C2A29] uppercase">
                      បញ្ចូលឈ្មោះភ្ញៀវ (Guest Name):
                    </label>
                    <input
                      type="text"
                      value={guestNameInput}
                      onChange={(e) => setGuestNameInput(e.target.value)}
                      placeholder="ឧ. ឯកឧត្តម លោកជំទាវ..."
                      className="w-full px-3 py-2 bg-white border border-[#D4AF37]/40 rounded-xl text-xs font-medium text-[#2C2A29]"
                    />
                  </div>
                  <div className="space-y-1 flex flex-col justify-end">
                    <span className="text-[10px] text-[#3E444A]/60 block mb-0.5">សកម្មភាពរហ័ស (Actions):</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(getPersonalizedUrl());
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 2000);
                          setSuccess("✓ បានចម្លងតំណភ្ជាប់ធៀបការភ្ញៀវរួចរាល់!");
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#D4AF37]/40 hover:bg-[#FAF8F5] text-xs font-bold text-[#2C2A29] flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#AA7C11]" />}
                        <span>{copiedLink ? "បានចម្លង" : "ចម្លង Link"}</span>
                      </button>

                      <a
                        href={getPersonalizedUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>បើកមើល</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200/60 flex flex-wrap items-center gap-2">
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(getPersonalizedUrl())}&text=${encodeURIComponent(getKhmerShareMessage())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-[#229ED9] text-white text-xs font-semibold hover:brightness-105 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Share Telegram</span>
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(getKhmerShareMessage())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-[#25D366] text-white text-xs font-semibold hover:brightness-105 flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Share WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(getKhmerShareMessage());
                      setCopiedFullMessage(true);
                      setTimeout(() => setCopiedFullMessage(false), 2000);
                      setSuccess("✓ បានចម្លងសារអញ្ជើញជាភាសាខ្មែរផ្លូវការរួចរាល់!");
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white border border-[#D4AF37]/40 text-[#2C2A29] text-xs font-semibold hover:bg-gray-50 flex items-center gap-1.5"
                  >
                    {copiedFullMessage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5 text-[#AA7C11]" />}
                    <span>ចម្លងសារអញ្ជើញពេញលេញ</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Live Preview Card */}
          <div className="p-5 rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#FAF8F5] to-white space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#AA7C11] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Live Design &amp; Open Box Preview (ផ្ទាំងមើលគំរូរចនាប័ទ្មជាក់ស្ដែង)
              </span>
              <div className="flex items-center gap-2 text-[11px] text-[#3E444A]/70">
                <span>Design: <strong className="text-[#2C2A29]">{themeConfig.templateStyle || "royal-heritage"}</strong></span>
                <span>·</span>
                <span>Preset: <strong className="text-[#2C2A29]">{themeConfig.preset}</strong></span>
              </div>
            </div>

            <div
              className="rounded-2xl p-6 transition-all duration-300 flex flex-col md:flex-row items-center justify-around gap-6 relative overflow-hidden shadow-inner"
              style={{
                backgroundColor: themeConfig.primary,
                border: `1.5px solid ${themeConfig.accent}50`,
              }}
            >
              {/* Mini Envelope Box Preview */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: themeConfig.accent }}>
                  ✉️ 3D Envelope (ពេលបិទ)
                </span>
                <div
                  className="w-48 h-32 rounded-xl relative shadow-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: themeConfig.envelope,
                    border: `1px solid ${themeConfig.accent}60`,
                    boxShadow: `0 12px 28px rgba(0,0,0,0.45)`,
                  }}
                >
                  {/* Flap triangle */}
                  <div
                    className="absolute top-0 left-0 right-0 h-16 transition-all duration-300"
                    style={{
                      clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                      backgroundColor: themeConfig.envelope,
                      filter: "brightness(1.12)",
                      borderBottom: `1px solid ${themeConfig.accent}40`,
                    }}
                  />
                  {/* Wax Seal */}
                  <div
                    className="w-9 h-9 rounded-full shadow-lg z-10 flex items-center justify-center font-serif text-[11px] font-bold"
                    style={{
                      backgroundColor: themeConfig.accent,
                      color: "#1a1200",
                      border: "1.5px solid #fff5cc",
                    }}
                  >
                    {themeConfig.sealStyle === "lotus"
                      ? "🪷"
                      : themeConfig.sealStyle === "knot"
                      ? "♾️"
                      : themeConfig.sealStyle === "monogram"
                      ? "❦"
                      : "👑"}
                  </div>
                  {/* Gold monogram / date */}
                  <div
                    className="absolute bottom-2 text-[10px] font-serif tracking-widest uppercase font-semibold"
                    style={{ color: themeConfig.accent }}
                  >
                    {formData.groomName ? formData.groomName.split(" ").pop() : "Groom"} &amp;{" "}
                    {formData.brideName ? formData.brideName.split(" ").pop() : "Bride"}
                  </div>
                </div>
              </div>

              {/* Arrow or plus indicator */}
              <div className="text-sm font-bold" style={{ color: themeConfig.accent }}>
                ➔ Open Box ➔
              </div>

              {/* Mini Inside Open Box & Card Preview */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: themeConfig.accent }}>
                  📜 Inside Card (ពេលចុចបើកប្រអប់)
                </span>
                <div
                  className="w-48 h-32 rounded-xl p-3 relative shadow-xl flex flex-col items-center justify-between text-center transition-all duration-300"
                  style={{
                    backgroundColor: themeConfig.card,
                    border: `1.5px solid ${themeConfig.accent}`,
                    boxShadow: `0 14px 30px rgba(0,0,0,0.5)`,
                  }}
                >
                  <div
                    className="text-[9px] uppercase font-bold tracking-widest"
                    style={{ color: themeConfig.accent }}
                  >
                    សិរីសួស្តីអាពាហ៍ពិពាហ៍
                  </div>
                  <div className="font-serif text-xs font-bold leading-tight" style={{ color: "#ffffff" }}>
                    {formData.groomName || "កូនកំលោះ"}
                    <br />
                    <span style={{ color: themeConfig.accent }}>&amp;</span>
                    <br />
                    {formData.brideName || "កូនក្រមុំ"}
                  </div>
                  <div
                    className="text-[8px] font-mono tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${themeConfig.accent}25`,
                      color: themeConfig.accent,
                      border: `1px solid ${themeConfig.accent}50`,
                    }}
                  >
                    {formData.eventDate ? new Date(formData.eventDate).toLocaleDateString() : "Wedding Date"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Groom & Bride Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/25 shadow-card space-y-6">
          <div className="flex items-center gap-2 font-serif text-lg font-bold text-[#2C2A29]">
            <Heart className="w-5 h-5 text-[#AA7C11]" />
            <span>The Happy Couple</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Groom */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#D4AF37]/20">
              <span className="text-xs font-bold uppercase tracking-wider text-[#AA7C11] block">
                Groom Details
              </span>
              <div>
                <label className="block text-[11px] font-semibold text-[#3E444A] mb-1">
                  Groom's Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.groomName}
                  onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D4AF37]/30 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#3E444A] mb-1">
                  Parents' Names
                </label>
                <input
                  type="text"
                  value={formData.groomParents}
                  onChange={(e) => setFormData({ ...formData, groomParents: e.target.value })}
                  placeholder="Mr. &amp; Mrs. Sterling"
                  className="w-full px-3 py-2 bg-white border border-[#D4AF37]/30 rounded-xl text-xs"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-[#3E444A]">
                    Groom / Couple Photo
                  </label>
                  <label className="cursor-pointer text-[10px] font-semibold text-[#AA7C11] hover:underline flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>{uploadingImageField === "groomPhotoUrl" ? "Uploading..." : "Upload Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingImageField === "groomPhotoUrl"}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload("groomPhotoUrl", file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-black/5 shrink-0 flex items-center justify-center">
                    {formData.groomPhotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={formData.groomPhotoUrl}
                        alt="Groom Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/img/cozy-2000.webp";
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={formData.groomPhotoUrl}
                    onChange={(e) => setFormData({ ...formData, groomPhotoUrl: e.target.value })}
                    placeholder="/img/cozy-2000.webp or /uploads/..."
                    className="w-full px-3 py-2 bg-white border border-[#D4AF37]/30 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Bride */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#D4AF37]/20">
              <span className="text-xs font-bold uppercase tracking-wider text-[#AA7C11] block">
                Bride Details
              </span>
              <div>
                <label className="block text-[11px] font-semibold text-[#3E444A] mb-1">
                  Bride's Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.brideName}
                  onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D4AF37]/30 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#3E444A] mb-1">
                  Parents' Names
                </label>
                <input
                  type="text"
                  value={formData.brideParents}
                  onChange={(e) => setFormData({ ...formData, brideParents: e.target.value })}
                  placeholder="Mr. &amp; Mrs. Montgomery"
                  className="w-full px-3 py-2 bg-white border border-[#D4AF37]/30 rounded-xl text-xs"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-[#3E444A]">
                    Bride / Arch Photo
                  </label>
                  <label className="cursor-pointer text-[10px] font-semibold text-[#AA7C11] hover:underline flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>{uploadingImageField === "bridePhotoUrl" ? "Uploading..." : "Upload Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingImageField === "bridePhotoUrl"}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload("bridePhotoUrl", file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-black/5 shrink-0 flex items-center justify-center">
                    {formData.bridePhotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={formData.bridePhotoUrl}
                        alt="Bride Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/img/words-2000.webp";
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={formData.bridePhotoUrl}
                    onChange={(e) => setFormData({ ...formData, bridePhotoUrl: e.target.value })}
                    placeholder="/img/words-2000.webp or /uploads/..."
                    className="w-full px-3 py-2 bg-white border border-[#D4AF37]/30 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Center Couple Photo */}
            <div className="md:col-span-2 space-y-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#D4AF37]/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#AA7C11] block">
                    Center Couple Portrait (រូបថតគូស្នេហ៍ / ផ្ទឹម)
                  </span>
                  <p className="text-[11px] text-[#3E444A]/70 mt-0.5">
                    រូបថតនេះបង្ហាញនៅចំកណ្តាលចន្លោះកូនកំលោះ និងកូនក្រមុំ ក្នុងផ្នែក The Couple
                  </p>
                </div>
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D4AF37]/40 text-xs font-semibold text-[#2C2A29] hover:bg-[#FAF8F5] transition shadow-xs w-fit">
                  <Upload className="w-3.5 h-3.5 text-[#AA7C11]" />
                  <span>{uploadingImageField === "couplePhotoUrl" ? "Uploading..." : "Upload Photo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingImageField === "couplePhotoUrl"}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload("couplePhotoUrl", file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-black/5 shrink-0 flex items-center justify-center">
                  {formData.couplePhotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.couplePhotoUrl}
                      alt="Couple Photo Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/img/cozy-2000.webp";
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <input
                  type="text"
                  value={formData.couplePhotoUrl}
                  onChange={(e) => setFormData({ ...formData, couplePhotoUrl: e.target.value })}
                  placeholder="/img/cozy-2000.webp or /uploads/..."
                  className="w-full px-3 py-2 bg-white border border-[#D4AF37]/30 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Invitation Letter & Words Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/25 shadow-card space-y-6">
          <div className="flex items-center gap-2 font-serif text-lg font-bold text-[#2C2A29]">
            <FileText className="w-5 h-5 text-[#AA7C11]" />
            <span>Invitation Letter &amp; Lunar Calendar (សេចក្ដីគោរពអញ្ជើញ &amp; អត្ថន័យធៀបការ)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#3E444A] mb-1">
                Khmer Lunar Calendar Date (កាលបរិច្ឆេទតាមចន្ទគតិ)
              </label>
              <input
                type="text"
                value={formData.lunarDate}
                onChange={(e) => setFormData({ ...formData, lunarDate: e.target.value })}
                placeholder="ត្រូវនឹងថ្ងៃអាទិត្យ ៦កើត ខែកត្ដិក ឆ្នាំមមី អដ្ឋស័ក ព.ស.២៥៧០"
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
              />
              <p className="text-[10px] text-[#3E444A]/60 mt-1">
                បង្ហាញនៅក្របមុខ និងក្នុងលិខិតអញ្ជើញផ្លូវការ
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#3E444A] mb-1">
                Invitation Honor Title (ចំណងជើងសេចក្តីគោរពអញ្ជើញ)
              </label>
              <input
                type="text"
                value={letterConfig.honor}
                onChange={(e) => setLetterConfig({ ...letterConfig, honor: e.target.value })}
                placeholder="មានកិត្តិយសសូមគោរពអញ្ជើញ"
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#3E444A] mb-1">
              Invitation Letter Body (អត្ថន័យសេចក្តីគោរពអញ្ជើញ)
            </label>
            <textarea
              rows={3}
              value={letterConfig.body}
              onChange={(e) => setLetterConfig({ ...letterConfig, body: e.target.value })}
              placeholder="ឯកឧត្តម អ្នកឧកញ៉ា លោកជំទាវ លោក លោកស្រី អ្នកនាង កញ្ញា និង ប្រិយមិត្តអញ្ជើញចូលរួមជាអធិបតី..."
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29] leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#3E444A] mb-1">
                Love Quote / Word of Welcome (ពាក្យស្លោកស្នេហា ឬស្វាគមន៍)
              </label>
              <input
                type="text"
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                placeholder="ស្នេហាពិត គឺការរួមដំណើរកសាងអនាគតជាមួយគ្នា"
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#3E444A] mb-1">
                Love Story (ដំណើររឿងស្នេហា)
              </label>
              <textarea
                rows={2}
                value={formData.story}
                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                placeholder="រឿងរ៉ាវនៃក្តីស្រលាញ់ និងការជួបគ្នា..."
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
              />
            </div>
          </div>
        </div>

        {/* Traditional Wedding Programme Schedule Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/25 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D4AF37]/15 pb-4">
            <div className="flex items-center gap-2 font-serif text-lg font-bold text-[#2C2A29]">
              <Clock className="w-5 h-5 text-[#AA7C11]" />
              <span>Wedding Programme Schedule (កម្មវិធីមង្គលការប្រពៃណីខ្មែរ)</span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm("តើអ្នកចង់កំណត់កម្មវិធីប្រពៃណីខ្មែរពេញលេញ (១២ ពិធី) ឡើងវិញមែនទេ?")) {
                  setProgrammeDays(DEFAULT_PROGRAMME);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D4AF37]/40 bg-[#FAF8F5] text-xs font-semibold text-[#AA7C11] hover:bg-white transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>កំណត់ ១២ ពិធីឡើងវិញ (Reset)</span>
            </button>
          </div>

          <p className="text-xs text-[#3E444A]/80 leading-relaxed">
            លោកអ្នកអាចកែសម្រួលពេលវេលា និងឈ្មោះពិធីនីមួយៗ បន្ថែមពិធីថ្មី ឬលុបចេញតាមកម្មវិធីជាក់ស្ដែងរបស់លោកអ្នក។
          </p>

          <div className="space-y-6">
            {programmeDays.map((day, dIdx) => (
              <div key={dIdx} className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#D4AF37]/25 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-[#AA7C11] uppercase tracking-wider mb-1">
                      ចំណងជើងថ្ងៃកម្មវិធី (Day {dIdx + 1} Title)
                    </label>
                    <input
                      type="text"
                      value={day.dayTitle}
                      onChange={(e) => {
                        const newDays = [...programmeDays];
                        newDays[dIdx].dayTitle = e.target.value;
                        setProgrammeDays(newDays);
                      }}
                      className="w-full px-3 py-2 bg-white border border-[#D4AF37]/30 rounded-xl text-xs font-semibold text-[#2C2A29]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newDays = [...programmeDays];
                      newDays[dIdx].rows.push({ time: "ម៉ោង ...", name: "ឈ្មោះពិធីថ្មី" });
                      setProgrammeDays(newDays);
                    }}
                    className="self-end sm:self-auto inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#AA7C11] text-white text-xs font-semibold hover:brightness-105 transition shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ បន្ថែមពិធី</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {day.rows.map((row, rIdx) => (
                    <div key={rIdx} className="flex items-center gap-2 sm:gap-3 bg-white p-2.5 rounded-xl border border-gray-200">
                      <span className="w-6 text-center text-xs font-bold text-[#AA7C11]/70 shrink-0">
                        {rIdx + 1}.
                      </span>
                      <input
                        type="text"
                        value={row.time}
                        placeholder="ម៉ោង..."
                        onChange={(e) => {
                          const newDays = [...programmeDays];
                          newDays[dIdx].rows[rIdx].time = e.target.value;
                          setProgrammeDays(newDays);
                        }}
                        className="w-32 sm:w-44 px-2.5 py-1.5 bg-[#FAF8F5] border border-gray-200 rounded-lg text-xs font-mono shrink-0"
                      />
                      <input
                        type="text"
                        value={row.name}
                        placeholder="ឈ្មោះពិធីមង្គលការ..."
                        onChange={(e) => {
                          const newDays = [...programmeDays];
                          newDays[dIdx].rows[rIdx].name = e.target.value;
                          setProgrammeDays(newDays);
                        }}
                        className="flex-1 px-2.5 py-1.5 bg-[#FAF8F5] border border-gray-200 rounded-lg text-xs text-[#2C2A29]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newDays = [...programmeDays];
                          newDays[dIdx].rows.splice(rIdx, 1);
                          setProgrammeDays(newDays);
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0"
                        title="លុបពិធីនេះ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wedding Photo Gallery Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/25 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-serif text-lg font-bold text-[#2C2A29]">
              <ImageIcon className="w-5 h-5 text-[#AA7C11]" />
              <span>Wedding Photo Gallery (កម្រងរូបថតអនុស្សាវរីយ៍)</span>
            </div>

            <div className="flex items-center gap-3">
              <label className="cursor-pointer px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#D4AF37]/40 text-xs font-semibold text-[#AA7C11] hover:bg-[#D4AF37]/10 flex items-center gap-2 transition-all shadow-sm">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingGallery ? "កំពុងផ្ទុកឡើង..." : "Upload Photos (+រូបថត)"}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploadingGallery}
                  className="hidden"
                  onChange={handleGalleryUpload}
                />
              </label>

              <a
                href="/dashboard/media"
                className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-medium text-[#3E444A] hover:bg-gray-50 flex items-center gap-1.5 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                <span>Media Manager</span>
              </a>
            </div>
          </div>

          <p className="text-xs text-[#3E444A]/70">
            រូបថតដែលបានផ្ទុកឡើងនៅទីនេះ នឹងបង្ហាញដោយស្វ័យប្រវត្តិនៅលើទំព័រលិខិតអញ្ជើញ (Photo Gallery &amp; Story) សម្រាប់ភ្ញៀវទស្សនា។
          </p>

          {mediaList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {mediaList.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#D4AF37]/30 bg-[#FAF8F5] shadow-sm hover:shadow-md transition-all"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.title || "Wedding Photo"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteMedia(item.id)}
                      className="self-end p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition-colors"
                      title="លុបរូបថត"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-white/90 truncate font-medium">
                      {item.title || "Photo"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-[#D4AF37]/30 bg-[#FAF8F5]">
              <ImageIcon className="w-8 h-8 text-[#AA7C11]/50 mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#2C2A29]">មិនទាន់មានរូបថតនៅក្នុងកម្រងរូបភាពនៅឡើយទេ</p>
              <p className="text-[11px] text-[#3E444A]/60 mt-1">
                ចុចប៊ូតុង "Upload Photos (+រូបថត)" ខាងលើដើម្បីជ្រើសរើសរូបថតមង្គលការរបស់អ្នក។
              </p>
            </div>
          )}
        </div>

        {/* Date, Schedule & Venue */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/25 shadow-card space-y-4">
          <div className="flex items-center gap-2 font-serif text-lg font-bold text-[#2C2A29]">
            <Calendar className="w-5 h-5 text-[#AA7C11]" />
            <span>Date &amp; Venue</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#3E444A] mb-1">
                Event Date *
              </label>
              <input
                type="date"
                required
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#3E444A] mb-1">
                Ceremony Time
              </label>
              <input
                type="text"
                value={formData.ceremonyTime}
                onChange={(e) => setFormData({ ...formData, ceremonyTime: e.target.value })}
                placeholder="4:00 PM - 5:30 PM"
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-[#3E444A] mb-1">
                Reception Time
              </label>
              <input
                type="text"
                value={formData.receptionTime}
                onChange={(e) => setFormData({ ...formData, receptionTime: e.target.value })}
                placeholder="6:30 PM - 11:00 PM"
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[#3E444A] mb-1">
                Venue Name *
              </label>
              <input
                type="text"
                required
                value={formData.venueName}
                onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#3E444A] mb-1">
                Google Maps Link
              </label>
              <input
                type="text"
                value={formData.googleMapsUrl}
                onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#3E444A] mb-1">
              Venue Physical Address *
            </label>
            <input
              type="text"
              required
              value={formData.venueAddress}
              onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
            />
          </div>

          {/* Venue / Location Photo Upload */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#D4AF37]/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#AA7C11] flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" />
                  រូបភាពទីកន្លែង (Venue / Location Photo)
                </span>
                <p className="text-[11px] text-[#3E444A]/70 mt-0.5">
                  ថតរូបភាពទីតាំងប្រព្រឹត្តការ ឬផ្ទះខាងស្រី/ខាងប្រុស ដើម្បីបង្ហាញជូនភ្ញៀវវិញ្ញាបនប័ត្រ
                </p>
              </div>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D4AF37]/40 text-xs font-semibold text-[#2C2A29] hover:bg-[#FAF8F5] transition shadow-xs w-fit shrink-0">
                <Upload className="w-3.5 h-3.5 text-[#AA7C11]" />
                <span>{uploadingImageField === "venuePhotoUrl" ? "Uploading..." : "Upload Venue Photo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingImageField === "venuePhotoUrl"}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload("venuePhotoUrl", file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
              <div className="sm:col-span-1">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-black/10 flex items-center justify-center">
                  {formData.venuePhotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.venuePhotoUrl}
                      alt="Venue Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[#3E444A]/40">
                      <MapPin className="w-8 h-8" />
                      <span className="text-[10px]">No Venue Photo</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3 space-y-2">
                <input
                  type="text"
                  value={formData.venuePhotoUrl}
                  onChange={(e) => setFormData({ ...formData, venuePhotoUrl: e.target.value })}
                  placeholder="e.g. /uploads/venue.jpg or https://..."
                  className="w-full px-3 py-2 bg-white border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
                />
                {formData.venuePhotoUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, venuePhotoUrl: "" })}
                    className="text-[11px] text-red-500 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove Photo</span>
                  </button>
                )}
                <p className="text-[10px] text-[#3E444A]/60">
                  រូបភាពនេះបង្ហាញក្នុងផ្នែក Venue នៃធៀបការ ។ ត្រូវជា JPG, PNG ឬ WEBP ។
                </p>
              </div>
            </div>
          </div>

          {/* Contact Numbers for Venue & RSVP */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#D4AF37]/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#AA7C11] flex items-center gap-1.5">
                <Phone className="w-4 h-4" />
                Contact Phone Numbers (លេខទូរស័ព្ទទំនាក់ទំនង &amp; ព័ត៌មានជំនួយ)
              </span>
              <button
                type="button"
                onClick={() => setContactsList([...contactsList, { label: "012 ...", tel: "+855..." }])}
                className="text-xs font-semibold text-[#AA7C11] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>+ បន្ថែមលេខ</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contactsList.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-gray-200">
                  <input
                    type="text"
                    value={c.label}
                    placeholder="e.g. 096 7 717 278"
                    onChange={(e) => {
                      const updated = [...contactsList];
                      updated[idx].label = e.target.value;
                      if (!updated[idx].tel || updated[idx].tel.startsWith("+855")) {
                        updated[idx].tel = "+855" + e.target.value.replace(/[^0-9]/g, "").replace(/^0/, "");
                      }
                      setContactsList(updated);
                    }}
                    className="flex-1 px-2.5 py-1.5 bg-[#FAF8F5] border border-gray-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={c.tel}
                    placeholder="+855..."
                    onChange={(e) => {
                      const updated = [...contactsList];
                      updated[idx].tel = e.target.value;
                      setContactsList(updated);
                    }}
                    className="w-32 px-2.5 py-1.5 bg-[#FAF8F5] border border-gray-200 rounded-lg text-xs font-mono"
                  />
                  {contactsList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = contactsList.filter((_, i) => i !== idx);
                        setContactsList(updated);
                      }}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Music, Video & Gift registry */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/25 shadow-card space-y-4">
          <div className="flex items-center gap-2 font-serif text-lg font-bold text-[#2C2A29]">
            <Music className="w-5 h-5 text-[#AA7C11]" />
            <span>Music, Video &amp; Digital Gift Registry</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase text-[#3E444A]">
                  Background Music Audio
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={audioFileInputRef}
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => audioFileInputRef.current?.click()}
                    disabled={audioUploading}
                    className="px-3 py-1 rounded-xl bg-[#FAF8F5] border border-[#D4AF37]/40 text-[#AA7C11] text-[11px] font-semibold hover:bg-[#F3E5AB]/30 flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{audioUploading ? "Uploading..." : "Upload Music File"}</span>
                  </button>

                  {formData.musicUrl && (
                    <button
                      type="button"
                      onClick={togglePreview}
                      className={`px-3 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                        previewPlaying
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {previewPlaying ? (
                        <>
                          <Square className="w-3 h-3 fill-red-600" />
                          <span>Stop Preview</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-emerald-600" />
                          <span>Test Play Audio</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <input
                type="text"
                value={formData.musicUrl}
                onChange={(e) => {
                  setFormData({ ...formData, musicUrl: e.target.value });
                  setPreviewError(null);
                }}
                placeholder="https://...mp3 or /uploads/... or YouTube URL"
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />

              {previewError && (
                <p className="text-[11px] text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{previewError}</span>
                </p>
              )}

              {/* Supported formats guidance & presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] text-[#3E444A]/70 uppercase font-bold tracking-wider">
                  Quick Presets:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      musicUrl:
                        "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3",
                    })
                  }
                  className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-[#F3E5AB]/40 text-[10px] text-[#2C2A29] border border-stone-200"
                >
                  Romantic Piano
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      musicUrl:
                        "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=wedding-piano-10339.mp3",
                    })
                  }
                  className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-[#F3E5AB]/40 text-[10px] text-[#2C2A29] border border-stone-200"
                >
                  Canon in D (Acoustic)
                </button>
              </div>

              <p className="text-[11px] text-stone-500 leading-relaxed">
                Supports: Uploaded audio files (MP3, WAV, M4A, OGG), Google Drive links, Dropbox, direct audio links, or YouTube background playback.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[#3E444A] mb-1">
                Featured Teaser Video (YouTube Embed or MP4)
              </label>
              <input
                type="text"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/embed/..."
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#3E444A] mb-1">
              Dress Code Instructions
            </label>
            <input
              type="text"
              value={formData.dressCode}
              onChange={(e) => setFormData({ ...formData, dressCode: e.target.value })}
              placeholder="Black Tie / Formal Evening Attire"
              className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-xl text-xs text-[#2C2A29]"
            />
          </div>

          {/* Digital Gift & KHQR Upload */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#D4AF37]/25">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#AA7C11] flex items-center gap-1.5">
                  <Gift className="w-4 h-4" />
                  Digital Gift &amp; Bank KHQR (ចំណងដៃឌីជីថល &amp; រូបភាព QR Code / ABA)
                </span>
                <p className="text-[11px] text-[#3E444A]/70 mt-0.5">
                  ភ្ញៀវអាចស្កេន QR Code ឬចុចចម្លងលេខកុងធនាគារដើម្បីចូលរួមចំណងដៃឌីជីថល
                </p>
              </div>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D4AF37]/40 text-xs font-semibold text-[#AA7C11] hover:bg-white transition shadow-xs w-fit">
                <QrCode className="w-3.5 h-3.5" />
                <span>{uploadingImageField === "qrImageUrl" ? "Uploading..." : "Upload QR Image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingImageField === "qrImageUrl"}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload("qrImageUrl", file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-[#3E444A] uppercase mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankConfig.bankName}
                  onChange={(e) => setBankConfig({ ...bankConfig, bankName: e.target.value })}
                  placeholder="e.g. ABA Bank / ACLEDA"
                  className="w-full px-2.5 py-1.5 bg-white border border-[#D4AF37]/30 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#3E444A] uppercase mb-1">Account Number</label>
                <input
                  type="text"
                  value={bankConfig.accountNumber}
                  onChange={(e) => setBankConfig({ ...bankConfig, accountNumber: e.target.value })}
                  placeholder="000 123 456"
                  className="w-full px-2.5 py-1.5 bg-white border border-[#D4AF37]/30 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#3E444A] uppercase mb-1">Account Name</label>
                <input
                  type="text"
                  value={bankConfig.accountName}
                  onChange={(e) => setBankConfig({ ...bankConfig, accountName: e.target.value })}
                  placeholder="PHAY RAKSMEY"
                  className="w-full px-2.5 py-1.5 bg-white border border-[#D4AF37]/30 rounded-lg text-xs uppercase"
                />
              </div>
            </div>

            {/* QR Image Preview */}
            {bankConfig.qrImageUrl && (
              <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#D4AF37]/30 bg-white p-1 shrink-0 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={bankConfig.qrImageUrl} alt="QR Code" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-[#2C2A29] block">KHQR Code Image Uploaded</span>
                  <span className="text-[10px] text-[#3E444A]/60 truncate block">{bankConfig.qrImageUrl}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setBankConfig({ ...bankConfig, qrImageUrl: "" })}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs"
                  title="Remove QR Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Save Status Feedback */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 text-red-800 text-xs flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-[#3E444A]/70 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#AA7C11]" />
            <span>ព័ត៌មានទាំងអស់រួមទាំងការរចនា និងស្ទីលពណ៌នឹងត្រូវបានធ្វើបច្ចុប្បន្នភាពលើប្រព័ន្ធភ្លាមៗ។</span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs font-semibold shadow-luxury hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "កំពុងរក្សាទុក... (Saving Changes...)" : "រក្សាទុកព័ត៌មានទាំងអស់ (Save Event Details)"}</span>
          </button>
        </div>
      </form>

      {/* QR Code Preview & Download Modal */}
      {isQrModalOpen && qrCodeDataUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-[#D4AF37]/40 shadow-2xl space-y-5 text-center relative">
            <button
              type="button"
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#AA7C11]/15 text-[#AA7C11] font-bold uppercase tracking-wider">
                QR Code ធៀបការឌីជីថល
              </span>
              <h3 className="font-serif text-lg font-bold text-[#2C2A29]">
                ស្កេនដើម្បីបើកធៀបការ
              </h3>
              <p className="text-xs text-[#3E444A]/70">
                {guestNameInput ? `សម្រាប់៖ ${guestNameInput}` : "តំណភ្ជាប់ធៀបការផ្ទាល់"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#FAF8F5] to-white border-2 border-[#D4AF37]/40 inline-block shadow-inner mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeDataUrl}
                alt="Invitation QR Code"
                className="w-56 h-56 mx-auto object-contain rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <a
                href={qrCodeDataUrl}
                download={`wedding-qr-${formData.slug || initialEvent.slug}.png`}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:brightness-105 transition active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>ទាញយកជារូបភាព (Download QR Image)</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(getPersonalizedUrl());
                  setSuccess("✓ បានចម្លងតំណភ្ជាប់ធៀបការភ្ញៀវរួចរាល់!");
                  setIsQrModalOpen(false);
                }}
                className="w-full py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-[#2C2A29] transition"
              >
                ចម្លងតំណភ្ជាប់ (Copy Link) &amp; បិទ
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Floating Toast Notification for Immediate Visibility */}
      {(themeSaveSuccess || success || error) && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 transition-all duration-300 max-w-md ${
            error
              ? "bg-[#2b0b14] text-red-100 border-red-400"
              : "bg-[#16092b] text-[#fbefc0] border-[#d9b15a]"
          }`}
        >
          {error ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <div className="text-xs">
            <div className="font-bold text-white">
              {error ? "មានបញ្ហា (Error)" : "ជោគជ័យ! (Success)"}
            </div>
            <div className="text-[11px] opacity-90">{error || themeSaveSuccess || success}</div>
          </div>
          <button
            type="button"
            onClick={() => {
              setThemeSaveSuccess(null);
              setSuccess(null);
              setError(null);
            }}
            className="ml-auto text-white/70 hover:text-white text-xs font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
