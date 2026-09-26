"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { GithubLogo, Hash, TelegramLogo } from "@phosphor-icons/react";
import { useI18n } from "./LanguageProvider";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const AVATAR_URL = "https://i.ibb.co.com/B26wXHQz/5790755155543265404-120.jpg";

const LINKS = [
  { key: "telegram" as const, href: "https://t.me/noisy02", label: "noisy02" },
  { key: "channel" as const, href: "https://t.me/noisytechh", label: "@noisytechh" },
  { key: "github" as const, href: "https://github.com/cokguss", label: "cokguss" },
];

/* ---------------------------------------------------------------
   Typing animation: time-based reveal, so it keeps real pace even
   when the browser throttles timers. Snippets loop: type, hold,
   clear, next.
   ---------------------------------------------------------------- */
type Line = { text: string; className?: string };

const SNIPPETS: Line[][] = [
  [
    { text: "const noisy = await search({", className: "text-fg" },
    { text: '  keyword: "beat sync",', className: "text-dim" },
    { text: '  tab: "video",', className: "text-dim" },
    { text: "  size: 24,", className: "text-dim" },
    { text: "});", className: "text-fg" },
    { text: "", className: "text-dim" },
    { text: "for (const t of noisy.results) {", className: "text-fg" },
    { text: "  t.preview(); // no redirects", className: "text-accent-text" },
    { text: "}", className: "text-fg" },
  ],
  [
    { text: "// hasil cache 5 menit", className: "text-dim" },
    { text: "export const getCached = async (q: string) => {", className: "text-fg" },
    { text: "  const hit = cache.get(q);", className: "text-dim" },
    { text: "  if (hit) return hit;", className: "text-accent-text" },
    { text: "", className: "text-dim" },
    { text: "  const res = await capcut.search(q);", className: "text-fg" },
    { text: "  cache.set(q, res, 300);", className: "text-dim" },
    { text: "  return res;", className: "text-fg" },
    { text: "};", className: "text-fg" },
  ],
  [
    { text: "> noisy dev --lang id", className: "text-accent-text" },
    { text: "proxy pool: 64 healthy", className: "text-dim" },
    { text: "index: capcut.com [ok]", className: "text-dim" },
    { text: "faq: 6 items", className: "text-dim" },
    { text: "legal: privacy + terms", className: "text-dim" },
    { text: "", className: "text-dim" },
    { text: "ready in 240ms", className: "text-fg" },
    { text: "http://localhost:3100", className: "text-accent-text" },
    { text: "", className: "text-dim" },
  ],
];

const TYPE_MS = 26;
const HOLD_MS = 2600;
const GAP_MS = 480;
const TICK_MS = 60;

export function DeveloperSection() {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const scopeRef = useRef<HTMLDivElement>(null);
  const inView = useInView(scopeRef, { once: false, margin: "-80px" });

  const snippetIndexRef = useRef(0);
  const timerRef = useRef<number | undefined>(undefined);
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [caretOn, setCaretOn] = useState(true);

  const snippet = useMemo(() => SNIPPETS[snippetIndex], [snippetIndex]);

  /* Flat "units": every char plus its trailing newline. */
  const { lineStarts, totalUnits } = useMemo(() => {
    const starts: number[] = [];
    let pos = 0;
    for (const line of snippet) {
      starts.push(pos);
      pos += line.text.length + 1;
    }
    return { lineStarts: starts, totalUnits: pos };
  }, [snippet]);

  const reveal = useMemo(() => {
    return (target: number): string[] => {
      const out: string[] = [];
      for (let i = 0; i < snippet.length; i++) {
        const len = snippet[i].text.length;
        const avail = target - lineStarts[i];
        if (avail <= 0) break;
        out.push(snippet[i].text.slice(0, Math.min(len, avail)));
        if (avail <= len) break;
      }
      return out;
    };
  }, [snippet, lineStarts]);

  const staticLines = useMemo(() => snippet.map((line) => line.text), [snippet]);

  useEffect(() => {
    if (reduce || !inView) {
      setTypedLines(staticLines);
      return;
    }

    let cancelled = false;
    let phase: "gap" | "typing" | "hold" = "gap";
    let phaseStart = performance.now();

    const schedule = (ms: number) => {
      timerRef.current = window.setTimeout(run, ms);
    };

    const run = () => {
      if (cancelled) return;
      const elapsed = performance.now() - phaseStart;

      if (phase === "gap") {
        if (elapsed >= GAP_MS) {
          setTypedLines([]);
          phase = "typing";
          phaseStart = performance.now();
          schedule(TICK_MS);
        } else {
          schedule(Math.min(GAP_MS - elapsed, TICK_MS));
        }
        return;
      }

      if (phase === "typing") {
        const target = Math.floor(elapsed / TYPE_MS);
        if (target >= totalUnits) {
          setTypedLines(staticLines);
          phase = "hold";
          phaseStart = performance.now();
          schedule(HOLD_MS);
          return;
        }
        setTypedLines(reveal(target));
        schedule(TICK_MS);
        return;
      }

      /* hold */
      if (elapsed >= HOLD_MS) {
        const next = (snippetIndexRef.current + 1) % SNIPPETS.length;
        snippetIndexRef.current = next;
        setTypedLines([]);
        setSnippetIndex(next);
        return; /* effect re-runs because `snippet` changed */
      }
      schedule(HOLD_MS - elapsed);
    };

    schedule(GAP_MS);

    return () => {
      cancelled = true;
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [inView, reduce, snippet, staticLines, reveal, totalUnits]);

  /* JS-driven caret blink: CSS animations started after load do not
     tick inside some embedded webviews, a state toggle always does. */
  useEffect(() => {
    if (reduce) {
      setCaretOn(true);
      return;
    }
    const id = window.setInterval(() => setCaretOn((on) => !on), 530);
    return () => window.clearInterval(id);
  }, [reduce]);

  const caretRow = useMemo(() => {
    const last = typedLines.length - 1;
    if (last < 0) return 0;
    const partial = typedLines[last].length < snippet[last].text.length;
    return partial ? last : Math.min(typedLines.length, snippet.length - 1);
  }, [typedLines, snippet]);

  const icons = {
    telegram: TelegramLogo,
    channel: Hash,
    github: GithubLogo,
  } as const;

  return (
    <section id="developer" ref={scopeRef} className="scroll-mt-20 border-t border-line">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Identity card */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="rounded-2xl border border-line bg-elev p-6 md:p-8"
        >
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={AVATAR_URL}
                alt={t.dev.name}
                width={192}
                height={192}
                loading="lazy"
                decoding="async"
                className="h-24 w-24 rounded-full border border-line-strong object-cover md:h-28 md:w-28"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full ring-2 ring-accent ring-offset-2 ring-offset-elev"
              />
              <span className="pulse-dot absolute bottom-1.5 right-1.5 h-3.5 w-3.5 rounded-full border-2 border-elev bg-accent" />
            </div>

            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
                {t.dev.eyebrow}
              </p>
              <h2 className="mt-1.5 text-[clamp(1.6rem,3vw,2.25rem)] font-black uppercase leading-none tracking-[-0.03em]">
                {t.dev.headingA} <span className="text-accent-text">{t.dev.name}</span>
              </h2>
              <p className="mt-2 text-sm text-dim">{t.dev.role}</p>
            </div>
          </div>

          <p className="mt-5 max-w-[44ch] text-sm leading-relaxed text-dim">{t.dev.bio}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {LINKS.map((link) => {
              const Icon = icons[link.key];
              return (
                <a
                  key={link.key}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t.dev.viewProfile} ${t.dev[link.key]} ${link.label}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-line bg-bg px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-px hover:border-accent hover:text-accent-text active:scale-[0.97]"
                >
                  <Icon
                    size={16}
                    aria-hidden="true"
                    className="text-dim transition-colors duration-200 group-hover:text-accent-text"
                  />
                  {link.label}
                </a>
              );
            })}
          </div>
        </motion.div>

        {/* Code window with typing animation */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="overflow-hidden rounded-2xl border border-line bg-elev shadow-[0_24px_60px_-40px_var(--shadow-tint)]"
        >
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            <span className="font-mono text-[11px] text-dim">{t.dev.file}</span>
            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
              {t.dev.lang}
            </span>
          </div>

          <div className="min-h-[19rem] overflow-x-auto px-4 py-5 font-mono text-[12.5px] leading-[1.7] md:min-h-[21rem] md:px-6 md:text-[13px]">
            {snippet.map((line, index) => {
              if (index > caretRow) return null;
              const typed = typedLines[index] ?? "";
              return (
                <div key={`${snippetIndex}-${index}`} className="flex gap-3 md:gap-4">
                  <span
                    aria-hidden="true"
                    className="w-5 shrink-0 select-none text-right text-dim/70"
                  >
                    {index + 1}
                  </span>
                  <span className={line.className ? `${line.className} whitespace-pre` : "whitespace-pre"}>
                    {typed}
                    {index === caretRow ? (
                      <span
                        aria-hidden="true"
                        className={`code-caret ${caretOn ? "opacity-100" : "opacity-0"}`}
                      />
                    ) : null}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-line px-4 py-3 md:px-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">
              {t.dev.status}
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={snippetIndex}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 1 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="font-mono text-[11px] text-accent-text"
              >
                {t.dev.done}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
