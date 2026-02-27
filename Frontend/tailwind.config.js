/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",      // Scans for Tailwind classes in app folder
    "./components/**/*.{js,jsx,ts,tsx}" // Scans for Tailwind classes in components folder
  ],

  presets: [require("nativewind/preset")], // Adds NativeWind defaults

  theme: {
    extend: {}, // You can add custom colors, fonts, spacing, etc.
  },

  plugins: [], // Add Tailwind plugins here (forms, typography, etc.)
};
