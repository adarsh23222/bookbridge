/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
        sans:  ["Outfit", "sans-serif"],
        mono:  ["JetBrains Mono", "monospace"],
      },
      colors: {
        bg:       "#0A0A0B",
        surface:  "#141417",
        surface2: "#1D1D21",
        border:   "#27272A",
        accent:   "#E27D60",
        sage:     "#658354",
        muted:    "#A1A1AA",
      },
      borderRadius: {
        lg: "0",
        md: "0",
        sm: "0",
      },
      keyframes: {
        "accordion-down": { from: { height: 0 }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up":   { from: { height: "var(--radix-accordion-content-height)" }, to: { height: 0 } },
        fadeUp: {
          from: { opacity: 0, transform: "translateY(20px)" },
          to:   { opacity: 1, transform: "translateY(0)" },
        },
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-up":        "fadeUp 0.8s ease-out both",
        "marquee":        "marquee 40s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
