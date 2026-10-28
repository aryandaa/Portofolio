import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`neo-btn rounded-xl px-3.5 py-1.5 text-xs uppercase tracking-wider ${
        isDark
          ? "bg-neo-yellow text-black hover:bg-amber-300 dark:bg-neo-yellow dark:text-black"
          : "bg-neo-yellow text-black hover:bg-amber-300"
      } ${className}`}
    >
      <span className="flex h-4 w-4 items-center justify-center">
        {isDark ? (
          <Moon className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
        ) : (
          <Sun className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
        )}
      </span>
      <span>{isDark ? "DARK MODE" : "LIGHT MODE"}</span>
    </button>
  );
}
