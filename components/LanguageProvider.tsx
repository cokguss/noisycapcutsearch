"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import { dict, type Dict, type Lang } from "@/lib/i18n";

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
}

const I18nContext = createContext<I18nValue>({
  lang: "en",
  setLang: () => {},
  t: dict.en,
});

const STORAGE_KEY = "noisy-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "id" || stored === "en") setLangState(stored);
    } catch {
      /* storage blocked, English for the session */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage blocked, session-only language is fine */
    }
  }, []);

  return (
    <I18nContext.Provider value={{ lang, setLang, t: dict[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}

const OPTIONS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "id", label: "ID" },
];

export function LangToggle() {
  const { lang, setLang } = useI18n();
  const reduce = useReducedMotion();

  const spring = reduce
    ? { duration: 0 }
    : ({ type: "spring", stiffness: 420, damping: 36 } as const);

  return (
    <div
      role="group"
      aria-label={dict[lang].nav.language}
      className="inline-flex h-10 items-center rounded-full border border-line bg-elev p-1"
    >
      {OPTIONS.map((option) => {
        const active = lang === option.code;
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLang(option.code)}
            aria-pressed={active}
            className="relative grid h-8 w-8 place-items-center rounded-full"
          >
            {active ? (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 rounded-full bg-accent"
                transition={spring}
                aria-hidden="true"
              />
            ) : null}
            <span
              className={`relative z-10 font-mono text-[11px] font-semibold tracking-[0.04em] transition-colors duration-200 ${
                active ? "text-accent-fg" : "text-dim"
              }`}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
