import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        headline: ["var(--font-headline)", "Georgia", "serif"],
      },
      colors: {
        // Semantic tokens (values live in globals.css)
        ink: "rgb(var(--ink) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        "line-strong": "rgb(var(--line-strong) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        accent: "rgb(var(--violet) / <alpha-value>)",
        live: "rgb(var(--live) / <alpha-value>)",
        // Landing-page violet family, evolved from the Syntra accent #CB3CFF
        plum: {
          950: "#0A0212",
          900: "#14061D",
          800: "#220A2E",
          700: "#33103F",
        },
        wine: "#4B1246",
        ultra: "#7B2FE0",
        mauve: "#A47BB5",
        lav: "#EBDDF5",
        paper: "#F3ECF5",
        // Legacy tokens used by the existing dashboard
        dark: {
          1: "#01000F",
          2: "#CB3CFF",
          3: "#000519",
          4: "#040019",
          5: "#05001E",
        },
        blue: {
          1: "#0E78F9",
        },
        sky: {
          1: "#C9DDFF",
          2: "#ECF0FF",
          3: "#F5FCFF",
        },
        orange: {
          1: "#FF742E",
        },
        purple: {
          1: "#830EF9",
        },
        yellow: {
          1: "#F9A90E",
        },
      },
      keyframes: {
        "pulse-live": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      boxShadow: {
        raised:
          "0 1px 0 0 rgb(255 255 255 / 0.06) inset, 0 8px 24px -8px rgb(0 0 0 / 0.6)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-live": "pulse-live 2s ease-in-out infinite",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
