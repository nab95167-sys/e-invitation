export interface ThemeConfig {
  id: string;
  preset?: string;
  nameKm?: string;
  nameEn?: string;
  primary: string;       // Page background & glow
  accent: string;        // Gold / border / kbach accent
  envelope: string;      // The envelope box outer body ("the box")
  lining: string;        // Inside flap & envelope interior ("open box")
  card: string;          // Revealed invitation card
  sealStyle?: string;    // "crown" | "lotus" | "monogram" | "knot"
  frameStyle?: string;   // "ornate-kbach" | "dual-line" | "scalloped"
  animationStyle?: string;// "falling-petals" | "golden-stardust" | "flutter-butterflies" | "floating-hearts" | "royal-fireworks" | "none"
  envelopeGroom?: string;
  envelopeBride?: string;
  envelopeTitle?: string;
  envelopeSub?: string;
  envelopeGreeting?: string;
}

export const THEME_PRESETS: ThemeConfig[] = [
  {
    id: "royal_khmer_purple",
    preset: "royal_khmer_purple",
    nameKm: "ស្វាយរាជវាំង & ទឹកមាស (Royal Purple)",
    nameEn: "Royal Khmer Purple & Gold",
    primary: "#250e44",
    accent: "#d9b15a",
    envelope: "#431475",
    lining: "#2b0b4d",
    card: "#280d4c",
  },
  {
    id: "midnight_sapphire",
    preset: "midnight_sapphire",
    nameKm: "ខៀវរាត្រី & ទឹកមាស (Midnight Sapphire)",
    nameEn: "Midnight Sapphire & Gold",
    primary: "#0b1a30",
    accent: "#dfb76c",
    envelope: "#132b4f",
    lining: "#0f223e",
    card: "#081324",
  },
  {
    id: "luxury_gold",
    preset: "luxury_gold",
    nameKm: "មាសប្រណីត & ស្រាសំប៉ាញ (Luxury Gold)",
    nameEn: "Luxury Gold & Champagne",
    primary: "#1a160c",
    accent: "#e5b85c",
    envelope: "#2e2515",
    lining: "#241d11",
    card: "#19140b",
  },
  {
    id: "royal_khmer_olive",
    preset: "royal_khmer_olive",
    nameKm: "បៃតងអូលីវ & ទឹកមាស (Royal Olive)",
    nameEn: "Royal Khmer Olive & Gold",
    primary: "#101209",
    accent: "#d9b15a",
    envelope: "#1d2010",
    lining: "#2a2f16",
    card: "#181a0e",
  },
  {
    id: "emerald_green",
    preset: "emerald_green",
    nameKm: "ត្បូងមរកត & ទឹកមាស (Imperial Emerald)",
    nameEn: "Imperial Emerald & Gold",
    primary: "#0b291d",
    accent: "#d4af37",
    envelope: "#12432f",
    lining: "#0d3424",
    card: "#082016",
  },
  {
    id: "ruby_red",
    preset: "ruby_red",
    nameKm: "ត្បូងទទឹម / ក្រហមកុលាប & ទឹកមាស (Royal Ruby)",
    nameEn: "Royal Ruby & Gold",
    primary: "#2b0b14",
    accent: "#e5a93c",
    envelope: "#4d1222",
    lining: "#360b18",
    card: "#22070f",
  },
  {
    id: "modern_obsidian",
    preset: "modern_obsidian",
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
    preset: "romantic_blossom",
    nameKm: "ផ្កាកុលាបមង្គល & Rose Gold",
    nameEn: "Romantic Blossom & Rose Gold",
    primary: "#331222",
    accent: "#f3a9b8",
    envelope: "#4e1b34",
    lining: "#3a1226",
    card: "#381526",
  },
  {
    id: "classic_ivory",
    preset: "classic_ivory",
    nameKm: "ភ្លុកដំរីបុរាណ & ទឹកមាស",
    nameEn: "Classic Ivory & Gold",
    primary: "#2c2720",
    accent: "#d9b15a",
    envelope: "#473e33",
    lining: "#342e26",
    card: "#211d17",
  },
];

export function hexToRgba(hex: string, alpha: number = 1): string {
  if (!hex || typeof hex !== "string") return `rgba(0,0,0,${alpha})`;
  let clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  if (clean.length < 6) return `rgba(0,0,0,${alpha})`;
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function parseThemeConfig(raw?: string | null): ThemeConfig {
  const defaultTheme: ThemeConfig = {
    ...THEME_PRESETS[0],
    sealStyle: "crown",
    frameStyle: "ornate-kbach",
    animationStyle: "falling-petals",
    envelopeTitle: "សិរីសួស្ដីអាពាហ៍ពិពាហ៍",
    envelopeSub: "The Wedding Invitation",
    envelopeGreeting: "សូមគោរពអញ្ជើញ · CORDIALLY INVITING",
  };

  if (!raw) return defaultTheme;

  try {
    if (typeof raw === "string" && raw.trim().startsWith("{")) {
      const parsed = JSON.parse(raw);
      // Determine base from preset if present
      let base = defaultTheme;
      if (parsed.preset && parsed.preset !== "custom") {
        const found = THEME_PRESETS.find((p) => p.id === parsed.preset);
        if (found) base = { ...found };
      }

      return {
        id: parsed.id || parsed.preset || base.id,
        preset: parsed.preset || base.id,
        nameKm: parsed.nameKm || base.nameKm,
        nameEn: parsed.nameEn || base.nameEn,
        // Custom colors take precedence over base preset!
        primary: parsed.primary || base.primary,
        accent: parsed.accent || base.accent,
        envelope: parsed.envelope || base.envelope,
        lining: parsed.lining || parsed.envelope || base.lining,
        card: parsed.card || base.card,
        sealStyle: parsed.sealStyle || base.sealStyle || "crown",
        frameStyle: parsed.frameStyle || base.frameStyle || "ornate-kbach",
        animationStyle: parsed.animationStyle || base.animationStyle || "falling-petals",
        envelopeGroom: parsed.envelopeGroom || "",
        envelopeBride: parsed.envelopeBride || "",
        envelopeTitle: parsed.envelopeTitle || "សិរីសួស្ដីអាពាហ៍ពិពាហ៍",
        envelopeSub: parsed.envelopeSub || "The Wedding Invitation",
        envelopeGreeting: parsed.envelopeGreeting || "សូមគោរពអញ្ជើញ · CORDIALLY INVITING",
      };
    }
  } catch (err) {
    console.warn("Could not parse theme JSON:", err);
  }

  // Check if raw is a preset id (e.g. "midnight_sapphire")
  const match = THEME_PRESETS.find((p) => p.id === raw);
  if (match) {
    return {
      ...match,
      sealStyle: "crown",
      frameStyle: "ornate-kbach",
      animationStyle: "falling-petals",
      envelopeTitle: "សិរីសួស្ដីអាពាហ៍ពិពាហ៍",
      envelopeSub: "The Wedding Invitation",
      envelopeGreeting: "សូមគោរពអញ្ជើញ · CORDIALLY INVITING",
    };
  }

  return defaultTheme;
}
