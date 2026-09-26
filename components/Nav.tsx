"use client";

import { ThemeToggle } from "./ThemeToggle";
import { LangToggle, useI18n } from "./LanguageProvider";

export function Nav() {
  const { t } = useI18n();

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-5 md:px-8">
        <a
          href="/"
          className="text-xl font-black uppercase leading-none tracking-[-0.04em] md:text-2xl"
        >
          Noisy<span className="text-accent-text">.</span>
        </a>
        <div className="flex items-center gap-3 md:gap-4">
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-dim sm:block">
            {t.nav.tagline}
          </span>
          <LangToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
