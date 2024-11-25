import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        default: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
      },
      colors: {
        background: {
          DEFAULT: "hsl(var(--background))",
          accent: "var(--primary-background)",
        },
        "ds-100": {
          DEFAULT: "var(--ds-background-100)",
        },
        "ds-200": {
          DEFAULT: "var(--ds-background-200)",
        },
        "ds-red-100": {
          DEFAULT: "var(--ds-red-100)",
        },
        "ds-red-200": {
          DEFAULT: "var(--ds-red-200)",
        },
        "ds-red-900": {
          DEFAULT: "var(--ds-red-900)",
        },
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          accent: "var(--primary-accent)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "hsl(var(--accent-foreground))",
          muted: "hsl(var(--accent-muted))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
