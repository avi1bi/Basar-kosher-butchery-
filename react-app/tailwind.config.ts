import type { Config } from "tailwindcss";

// Brand tokens — mirror the CSS variables in src/index.css so new components can use
// classes like `bg-burgundy text-gold font-serif`.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "var(--ink)", 2: "var(--ink-2)" },
        muted: "var(--muted)",
        line: "var(--line)",
        cream: "var(--cream)",
        paper: "var(--paper)",
        oxblood: { DEFAULT: "var(--oxblood)", dark: "var(--oxblood-dark)" },
        gold: { DEFAULT: "var(--brass)", light: "var(--brass-light)" },
        burgundy: { DEFAULT: "var(--charcoal)", deep: "var(--charcoal-deep)", 2: "var(--charcoal-2)" },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Times New Roman"', "serif"],
        sans: ['"Jost"', '"Helvetica Neue"', "Arial", "sans-serif"],
        hebrew: ['"Frank Ruhl Libre"', '"Cormorant Garamond"', "serif"],
      },
      maxWidth: { wrap: "1240px" },
    },
  },
  plugins: [],
} satisfies Config;
