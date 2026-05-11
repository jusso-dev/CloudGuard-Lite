import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring))",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary))",
          foreground: "oklch(var(--primary-foreground))"
        },
        muted: {
          DEFAULT: "oklch(var(--muted))",
          foreground: "oklch(var(--muted-foreground))"
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))"
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive))",
          foreground: "oklch(var(--destructive-foreground))"
        },
        success: {
          DEFAULT: "oklch(var(--success))",
          foreground: "oklch(var(--success-foreground))"
        },
        warning: {
          DEFAULT: "oklch(var(--warning))",
          foreground: "oklch(var(--warning-foreground))"
        }
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem"
      },
      boxShadow: {
        panel: "0 1px 2px oklch(0.31 0.03 232 / 0.08), 0 8px 24px oklch(0.31 0.03 232 / 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
