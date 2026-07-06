/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Orbitron", "Inter", "ui-sans-serif", "system-ui"],
        body: ["Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        void: "#070914",
        night: "#101426",
        plasma: "#8b5cf6",
        cyan: "#22d3ee",
        danger: "#ff2e63",
        ink: "#dbeafe",
      },
      boxShadow: {
        neon: "0 0 24px rgba(34, 211, 238, 0.28), 0 0 48px rgba(139, 92, 246, 0.18)",
        redglow: "0 0 22px rgba(255, 46, 99, 0.26)",
      },
      backgroundImage: {
        scanline:
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
        grid:
          "linear-gradient(rgba(34,211,238,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,.12) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
