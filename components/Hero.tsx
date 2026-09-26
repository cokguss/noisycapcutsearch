"use client";

import { motion, useReducedMotion, type MotionProps } from "motion/react";
import { CoverMarquee } from "./CoverMarquee";
import { SearchForm } from "./SearchForm";
import { useI18n } from "./LanguageProvider";
import type { TabKind } from "@/lib/types";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function rise(reduce: boolean | null, delay: number): MotionProps {
  if (reduce) return {};
  return {
    initial: { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  };
}

interface HeroProps {
  covers: string[];
  coversLoading: boolean;
  searchLoading: boolean;
  activeKeyword: string;
  onSearch: (keyword: string, tab: TabKind) => void;
}

export function Hero({
  covers,
  coversLoading,
  searchLoading,
  activeKeyword,
  onSearch,
}: HeroProps) {
  const reduce = useReducedMotion();
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden pt-24 pb-14 md:pb-16">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 md:px-8 lg:min-h-[100dvh] lg:grid-cols-[1.12fr_0.88fr] lg:gap-16 lg:pb-24">
        <div className="lg:pr-4">
          <motion.h1
            {...rise(reduce, 0.05)}
            className="max-w-[13ch] text-[clamp(2.75rem,7.2vw,4.5rem)] font-black uppercase leading-[0.92] tracking-[-0.035em]"
          >
            {t.hero.titleA}{" "}
            <span className="text-accent-text">{t.hero.titleB}</span>
          </motion.h1>

          <motion.p
            {...rise(reduce, 0.16)}
            className="mt-5 max-w-[46ch] text-base leading-relaxed text-dim md:text-lg"
          >
            {t.hero.sub}
          </motion.p>

          <motion.div {...rise(reduce, 0.27)}>
            <SearchForm
              loading={searchLoading}
              activeKeyword={activeKeyword}
              onSearch={onSearch}
            />
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
        >
          <CoverMarquee covers={covers} loading={coversLoading} />
        </motion.div>
      </div>
    </section>
  );
}
