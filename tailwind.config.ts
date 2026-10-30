import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          gold: "#D4AF37",
          "gold-light": "#F3E5AB",
          "gold-dark": "#AA7C11",
          rose: "#E8C5C8",
          "rose-light": "#FDF6F6",
          "rose-dark": "#B37076",
          champagne: "#F7E7CE",
          cream: "#FAF8F5",
          sand: "#EFEBE4",
          charcoal: "#2C2A29",
          slate: "#3E444A",
          burgundy: "#6B1D2F",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        script: ["var(--font-great-vibes)", "cursive"],
        khmer: ["var(--font-khmer)", "'Kantumruy Pro'", "'Kantumruy'", "sans-serif"],
        moul: ["var(--font-moul)", "'Moul'", "'Kantumruy Pro'", "serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseSlow: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-out forwards",
        slideUp: "slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        float: "float 4s ease-in-out infinite",
        pulseSlow: "pulseSlow 3s ease-in-out infinite",
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(212, 175, 55, 0.2)",
        "luxury-lg": "0 20px 40px -15px rgba(212, 175, 55, 0.25)",
        card: "0 4px 20px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
