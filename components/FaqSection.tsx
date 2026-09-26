"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Minus, Plus } from "@phosphor-icons/react";
import { useI18n } from "./LanguageProvider";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function FaqSection() {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const items = t.faq.items;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 border-t border-line bg-sunken/40">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
            {t.faq.eyebrow}
          </p>
          <h2 className="mt-3 text-[clamp(1.75rem,3.4vw,2.5rem)] font-black uppercase leading-none tracking-[-0.03em]">
            {t.faq.headingA}
            <br />
            <span className="text-accent-text">{t.faq.headingB}</span>
          </h2>
          <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-dim">{t.faq.lead}</p>
        </div>

        <div className="border-t border-line">
          {items.map((item, index) => {
            const isOpen = open === index;
            return (
              <div key={item.q} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    className="group flex w-full items-start gap-4 py-5 text-left md:gap-6"
                  >
                    <span className="mt-1 font-mono text-[11px] leading-none text-dim transition-colors duration-200 group-hover:text-accent-text">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-base font-semibold leading-snug tracking-[-0.01em] transition-colors duration-200 group-hover:text-accent-text md:text-lg">
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors duration-200 ${
                        isOpen
                          ? "border-accent bg-accent text-accent-fg"
                          : "border-line text-dim group-hover:border-accent group-hover:text-accent-text"
                      }`}
                    >
                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="panel"
                      id={`faq-panel-${index}`}
                      initial={reduce ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.34, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[62ch] pb-6 pl-[calc(1rem+2ch)] pr-9 text-sm leading-relaxed text-dim md:pl-[calc(1.5rem+2ch)]">
                        {item.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
