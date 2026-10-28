import { createContext, useContext, useEffect, useState } from "react";

const THEME_STORAGE_KEY = "porto_theme_preference";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      // Clean up any stale or accidental dark storage from previous tests
      localStorage.removeItem("porto_theme");

      const urlParams = new URLSearchParams(window.location.search);
      const paramTheme = urlParams.get("theme");
      if (paramTheme === "dark" || paramTheme === "light") {
        return paramTheme;
      }

      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "dark" || stored === "light") {
        return stored;
      }
    } catch {
      // ignore storage errors
    }
    // Default is strictly Light Mode as requested
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
