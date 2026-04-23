import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0F4C3A",  // verde-dinheiro
          accent:  "#7ED957",  // verde-limão (CTA/lucro)
          bg:      "#FAF7F0",  // off-white cremoso
          ink:     "#1C1C1C",  // grafite
          warn:    "#C75B3A",  // terracota (prejuízo)
        },
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "serif"],
        sans:    ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
} satisfies Config;
