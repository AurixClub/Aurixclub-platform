"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

// Theme control: a compact accessible toggle for the AURIX navigation on desktop and mobile.
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const syncTheme = () => {
      const nextIsLight = document.documentElement.dataset.theme === "light";
      setIsLight(nextIsLight);
      document.documentElement.classList.toggle("dark", !nextIsLight);
    };

    const saved = window.localStorage.getItem("aurix-theme");
    const nextIsLight = saved === "light";
    document.documentElement.dataset.theme = nextIsLight ? "light" : "dark";
    syncTheme();

    window.addEventListener("storage", syncTheme);
    window.addEventListener("aurix-theme-change", syncTheme);
    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener("aurix-theme-change", syncTheme);
    };
  }, []);

  const toggleTheme = () => {
    const nextIsLight = !isLight;
    document.documentElement.dataset.theme = nextIsLight ? "light" : "dark";
    document.documentElement.classList.toggle("dark", !nextIsLight);
    window.localStorage.setItem("aurix-theme", nextIsLight ? "light" : "dark");
    window.dispatchEvent(new Event("aurix-theme-change"));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className={`theme-toggle inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition-colors hover:border-blue-300/40 hover:bg-white/[0.1] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${className}`}
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
