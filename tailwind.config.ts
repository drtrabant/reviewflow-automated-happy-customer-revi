import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Google-trust blues
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#4285f4", // Google blue
          600: "#3b78dc",
          700: "#2d60b3",
          800: "#1e4a8e",
          900: "#153a72",
          950: "#0d2652",
        },
        // Success greens - positive reviews, confirmations
        success: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        // Warning ambers - star ratings, attention states
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b", // Primary star color
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        // Danger reds - negative sentiment, errors, destructive actions
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
        // Neutral grays - text, backgrounds, borders
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
        // Star rating specific
        star: {
          filled: "#f59e0b",
          empty: "#d4d4d4",
          hover: "#fbbf24",
        },
        // Google brand colors for review platform recognition
        google: {
          blue: "#4285f4",
          red: "#ea4335",
          yellow: "#fbbc05",
          green: "#34a853",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "SF Mono",
          "Menlo",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      fontSize: {
        // Big dashboard numbers - gas station price sign, not Bloomberg terminal
        "display-lg": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-md": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-sm": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }],
        // Stat numbers for dashboard
        "stat": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
      },
      screens: {
        // Mobile-first breakpoints optimized for field service workers on phones
        xs: "375px",   // iPhone SE and up
        sm: "640px",   // Large phones / small tablets
        md: "768px",   // Tablets
        lg: "1024px",  // Small laptops (less likely for our users)
        xl: "1280px",  // Desktop (admin/setup only)
        "2xl": "1536px",
      },
      spacing: {
        // Touch-friendly tap targets (minimum 44px per WCAG)
        "tap": "2.75rem",     // 44px - minimum touch target
        "tap-lg": "3rem",     // 48px - comfortable touch target
        "tap-xl": "3.5rem",   // 56px - large CTA buttons
      },
      borderRadius: {
        "card": "0.75rem",    // 12px - card corners
        "button": "0.625rem", // 10px - button corners
        "input": "0.5rem",    // 8px - input corners
        "badge": "9999px",    // Pill shape for badges/tags
      },
      boxShadow: {
        "card": "0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
        "button": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "button-active": "0 0 0 3px rgba(66, 133, 244, 0.3)",
        "input-focus": "0 0 0 3px rgba(66, 133, 244, 0.2)",
        "elevated": "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
        "sms": "0 2px 8px 0 rgba(0, 0, 0, 0.06)", // SMS bubble shadow
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "pulse-gentle": "pulseGentle 2s ease-in-out infinite",
        "count-up": "fadeIn 0.5s ease-out",
        "star-fill": "starFill 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseGentle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        starFill: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      maxWidth: {
        "mobile": "28rem",   // 448px - max width for mobile card layouts
        "content": "40rem",  // 640px - max content width for readability
        "dashboard": "64rem", // 1024px - dashboard max width
      },
    },
  },
  plugins: [],
};

export default config;