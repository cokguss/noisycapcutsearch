"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { ResultsSection } from "./ResultsSection";
import { FaqSection } from "./FaqSection";
import { DeveloperSection } from "./DeveloperSection";
import { TemplateLightbox } from "./TemplateLightbox";
import { Footer } from "./Footer";
import type { SearchPayload, TabKind, Template } from "@/lib/types";

type Status = "loading" | "success" | "error";

const DEFAULT_KEYWORD = "aesthetic";
const DEFAULT_TAB: TabKind = "video";

export default function SearchApp() {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>("loading");
  const [keyword, setKeyword] = useState(DEFAULT_KEYWORD);
  const [tab, setTab] = useState<TabKind>(DEFAULT_TAB);
  const [results, setResults] = useState<Template[]>([]);
  const [error, setError] = useState("");
  const [tookMs, setTookMs] = useState(0);
  const [selected, setSelected] = useState<Template | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const runSearch = useCallback(async (nextKeyword: string, nextTab: TabKind) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setKeyword(nextKeyword);
    setTab(nextTab);
    setStatus("loading");
    setError("");

    try {
      const res = await fetch(
        `/api/search?keyword=${encodeURIComponent(nextKeyword)}&tab=${nextTab}&size=24`,
        { signal: controller.signal },
      );
      const payload = (await res.json()) as SearchPayload;
      if (!payload.ok) throw new Error(payload.error);
      setResults(payload.results);
      setTookMs(payload.tookMs);
      setStatus("success");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError((err as Error).message || "Something went wrong.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void runSearch(DEFAULT_KEYWORD, DEFAULT_TAB);
    return () => abortRef.current?.abort();
  }, [runSearch]);

  const handleSearch = useCallback(
    (nextKeyword: string, nextTab: TabKind) => {
      void runSearch(nextKeyword, nextTab);
      document.getElementById("results")?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    },
    [runSearch, reduce],
  );

  const covers = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const result of results) {
      if (result.coverUrl && !seen.has(result.coverUrl)) {
        seen.add(result.coverUrl);
        out.push(result.coverUrl);
      }
      if (out.length >= 12) break;
    }
    return out;
  }, [results]);

  return (
    <>
      <Nav />
      {status === "loading" ? (
        <div className="fixed inset-x-0 top-16 z-50 h-[2px] overflow-hidden" aria-hidden="true">
          <div className="progress-line h-full w-full bg-accent" />
        </div>
      ) : null}
      <main>
        <Hero
          covers={covers}
          coversLoading={covers.length === 0}
          searchLoading={status === "loading"}
          activeKeyword={keyword}
          onSearch={handleSearch}
        />
        <ResultsSection
          status={status}
          keyword={keyword}
          tab={tab}
          results={results}
          error={error}
          tookMs={tookMs}
          onRetry={() => void runSearch(keyword, tab)}
          onSuggest={(suggestion) => handleSearch(suggestion, tab)}
          onOpen={setSelected}
        />
        <FaqSection />
        <DeveloperSection />
      </main>
      <Footer />
      <AnimatePresence>
        {selected ? (
          <TemplateLightbox template={selected} onClose={() => setSelected(null)} />
        ) : null}
      </AnimatePresence>
    </>
  );
}
