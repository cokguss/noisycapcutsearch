"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";
import { useI18n } from "./LanguageProvider";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const { t } = useI18n();
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === "light" || current === "dark") setTheme(current);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("noisy-theme", next);
    } catch {
      /* storage blocked, session-only theme is fine */
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? t.nav.themeDark : t.nav.themeLight}
      className="grid h-10 w-10 place-items-center rounded-full border border-line bg-elev text-fg transition-all duration-200 hover:border-line-strong hover:text-accent-text active:scale-95"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
