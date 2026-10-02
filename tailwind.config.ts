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
        background: "var(--background)",
        foreground: "var(--foreground)",
        hirelane: {
          blue: "#0047FF",
          "blue-hover": "#0038CC",
          "blue-light": "#EEF2FF",
          dark: "#0F172A",
          muted: "#64748B",
          border: "#E2E8F0",
          card: "#FFFFFF",
          surface: "#F8FAFC",
        },
      },
      borderRadius: {
        card: "14px",
        button: "8px",
      },
    },
  },
  plugins: [],
};
export default config;
