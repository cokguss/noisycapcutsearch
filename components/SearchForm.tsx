"use client";

import { useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useI18n } from "./LanguageProvider";
import type { TabKind } from "@/lib/types";

export const SUGGESTIONS = ["beat sync", "aesthetic", "vlog", "lyrics"];

interface SearchFormProps {
  loading: boolean;
  activeKeyword: string;
  onSearch: (keyword: string, tab: TabKind) => void;
}

export function SearchForm({ loading, activeKeyword, onSearch }: SearchFormProps) {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const tabLabels: Record<TabKind, string> = {
    video: t.search.video,
    image: t.search.image,
    both: t.search.both,
  };
  const [draft, setDraft] = useState("");
  const [tab, setTab] = useState<TabKind>("video");
  const inputRef = useRef<HTMLInputElement>(null);

  const spring = reduce
    ? { duration: 0 }
    : ({ type: "spring", stiffness: 420, damping: 36 } as const);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const keyword = draft.trim();
    if (!keyword) {
      inputRef.current?.focus();
      return;
    }
    onSearch(keyword, tab);
  };

  const switchTab = (next: TabKind) => {
    if (next === tab) return;
    setTab(next);
    if (activeKeyword) onSearch(activeKeyword, next);
  };

  const trySuggestion = (keyword: string) => {
    setDraft(keyword);
    onSearch(keyword, tab);
  };

  return (
    <div className="mt-7">
      <div className="inline-flex rounded-full border border-line bg-elev p-1" role="tablist" aria-label={t.search.ariaType}>
        {(["video", "image"] as TabKind[]).map((tabKey) => (
          <button
            key={tabKey}
            type="button"
            role="tab"
            aria-selected={tab === tabKey}
            onClick={() => switchTab(tabKey)}
            className="relative rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-200"
          >
            {tab === tabKey && (
              <motion.span
                layoutId="template-type-pill"
                className="absolute inset-0 rounded-full bg-accent"
                transition={spring}
                aria-hidden="true"
              />
            )}
            <span className={`relative z-10 ${tab === tabKey ? "text-accent-fg" : "text-dim"}`}>
              {tabLabels[tabKey]}
            </span>
          </button>
        ))}
      </div>

      <form
        onSubmit={submit}
        className="mt-3 flex items-center gap-2 rounded-full border border-line bg-elev p-2 pl-5 shadow-[0_20px_50px_-28px_var(--shadow-tint)] transition-colors duration-200 focus-within:border-line-strong"
      >
        <MagnifyingGlass size={20} className="shrink-0 text-dim" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          inputMode="search"
          autoComplete="off"
          aria-label={t.search.ariaSearch}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t.search.placeholder}
          className="min-w-0 flex-1 bg-transparent py-2.5 text-base text-fg outline-none placeholder:text-dim"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-full bg-accent px-5 py-3 text-sm font-bold uppercase tracking-[0.06em] text-accent-fg transition-transform duration-200 hover:-translate-y-px active:scale-[0.97] disabled:cursor-wait disabled:opacity-70 md:px-7"
        >
          {loading ? t.search.submitting : t.search.submit}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
          {t.search.tryLabel}
        </span>
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => trySuggestion(suggestion)}
            className="rounded-full border border-line px-3.5 py-1.5 text-[13px] text-dim transition-colors duration-200 hover:border-accent hover:text-accent-text"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
