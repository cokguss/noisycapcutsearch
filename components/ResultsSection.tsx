"use client";

import { AnimatePresence, motion } from "motion/react";
import { MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";
import { TemplateCard } from "./TemplateCard";
import { SUGGESTIONS } from "./SearchForm";
import { useI18n } from "./LanguageProvider";
import { fill } from "@/lib/i18n";
import type { TabKind, Template } from "@/lib/types";

type Status = "loading" | "success" | "error";

interface ResultsSectionProps {
  status: Status;
  keyword: string;
  tab: TabKind;
  results: Template[];
  error: string;
  tookMs: number;
  onRetry: () => void;
  onSuggest: (keyword: string) => void;
  onOpen: (template: Template) => void;
}

const GRID =
  "grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6";

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.24 },
};

export function ResultsSection({
  status,
  keyword,
  tab,
  results,
  error,
  tookMs,
  onRetry,
  onSuggest,
  onOpen,
}: ResultsSectionProps) {
  const { t } = useI18n();

  const statusLine =
    status === "loading"
      ? t.results.loading
      : status === "error"
        ? t.results.noResultsYet
        : tookMs >= 100
          ? fill(t.results.resultsIn, { n: results.length, t: (tookMs / 1000).toFixed(1) })
          : fill(t.results.results, { n: results.length });

  return (
    <section id="results" className="scroll-mt-20 border-t border-line">
      <div className="mx-auto max-w-[1400px] px-5 pt-14 pb-24 md:px-8 md:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 pb-7">
          <h2 className="text-[clamp(1.75rem,3.4vw,2.5rem)] font-black uppercase leading-none tracking-[-0.03em]">
            {status === "error" ? (
              t.results.searchFailed
            ) : (
              <>
                {status === "loading" ? t.results.searching : t.results.templatesFor}{" "}
                <span className="text-accent-text">“{keyword}”</span>
              </>
            )}
          </h2>
          <p className="font-mono text-xs text-dim">{statusLine}</p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {status === "loading" ? (
            <motion.div key="loading" {...fade} className={GRID} aria-hidden="true">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i}>
                  <div className="shimmer aspect-[9/16] rounded-2xl" />
                  <div className="shimmer mt-3 h-3.5 w-4/5 rounded-full" />
                  <div className="shimmer mt-2 h-3 w-2/5 rounded-full" />
                </div>
              ))}
            </motion.div>
          ) : null}

          {status === "error" ? (
            <motion.div key="error" {...fade}>
              <div className="max-w-2xl rounded-2xl border border-line bg-elev p-7 md:p-9">
                <div className="flex items-center gap-2 text-accent-text">
                  <WarningCircle size={20} aria-hidden="true" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em]">
                    {t.results.connectionProblem}
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-black uppercase tracking-[-0.02em]">
                  {t.results.couldNotReach}
                </h3>
                <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-dim md:text-base">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-5 rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-[0.06em] text-accent-fg transition-transform duration-200 hover:-translate-y-px active:scale-[0.97]"
                >
                  {t.results.retry}
                </button>
              </div>
            </motion.div>
          ) : null}

          {status === "success" && results.length > 0 ? (
            <motion.div
              key={`grid-${keyword}-${tab}`}
              {...fade}
              className={GRID}
            >
              {results.map((template, index) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  index={index}
                  onOpen={onOpen}
                />
              ))}
            </motion.div>
          ) : null}

          {status === "success" && results.length === 0 ? (
            <motion.div key={`empty-${keyword}-${tab}`} {...fade}>
              <div className="max-w-2xl rounded-2xl border border-line bg-elev p-7 md:p-9">
                <MagnifyingGlass size={32} className="text-dim" aria-hidden="true" />
                <h3 className="mt-4 text-2xl font-black uppercase tracking-[-0.02em]">
                  {t.results.nothingFor} “{keyword}”
                </h3>
                <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-dim md:text-base">
                  {t.results.emptyBody}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => onSuggest(suggestion)}
                      className="rounded-full border border-line px-3.5 py-1.5 text-[13px] text-dim transition-colors duration-200 hover:border-accent hover:text-accent-text"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
