/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "Impact", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        neo: {
          bg: "#f3fbf4",
          green: "#86efac", // Dominant Light Green (Neo Mint)
          lightgreen: "#bbf7d0",
          palegreen: "#dcfce7",
          forest: "#166534",
          deep: "#052e16",
          yellow: "#fef08a",
          amber: "#fde047",
          cream: "#fefce8",
          sky: "#bae6fd",
          lavender: "#e9d5ff",
          rose: "#fecdd3",
          orange: "#fed7aa",
          border: "#000000",
          darkbg: "#0f1117",
          darkcard: "#181b22",
          darkborder: "#ffffff",
        },
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px #000000",
        "brutal-sm": "2px 2px 0px 0px #000000",
        "brutal-lg": "6px 6px 0px 0px #000000",
        "brutal-xl": "8px 8px 0px 0px #000000",
        "brutal-dark": "4px 4px 0px 0px #ffffff",
        "brutal-dark-sm": "2px 2px 0px 0px #ffffff",
        "brutal-dark-lg": "6px 6px 0px 0px #ffffff",
        "brutal-dark-xl": "8px 8px 0px 0px #ffffff",
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
