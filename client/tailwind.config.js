/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: "#0F0F1A",
          secondary: "#1A1A2E",
          tertiary: "#16213E",
          hover: "#1E1E3A",
        },
        accent: {
          DEFAULT: "#7C3AED",
          hover: "#6D28D9",
          light: "#A78BFA",
        },
        message: {
          sent: "#7C3AED",
          received: "#1E1E3A",
        },
        online: "#10B981",
        text: {
          primary: "#F1F5F9",
          secondary: "#94A3B8",
          muted: "#475569",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.06)",
          active: "rgba(124,58,237,0.5)",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        bounce1: "bounce 1s infinite",
        bounce2: "bounce 1s infinite 0.15s",
        bounce3: "bounce 1s infinite 0.30s",
      },
    },
  },
  plugins: [],
}