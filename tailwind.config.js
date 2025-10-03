/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#7C3AED",
        accent: "#F59E0B",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
        surface: "#FFFFFF",
        background: "#F9FAFB"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 4px 8px rgba(0, 0, 0, 0.1)",
        "card-hover": "0 6px 12px rgba(0, 0, 0, 0.15)"
      }
    },
  },
  plugins: [],
};