/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00C853", // The bright green from your UI
          hover: "#009624",    // A darker green for hover states
          light: "#B9F6CA",    // Light green for backgrounds
        },
        dark: {
          900: "#121212", // Sidebar/Footer background
          800: "#1E1E1E", // Card background (dark mode)
          700: "#2C2C2C", // Border color
        },
        gray: {
          50: "#F9FAFB", // Main app background
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Professional font
        mono: ['Fira Code', 'monospace'], // For the code editor
      }
    },
  },
  plugins: [],
}