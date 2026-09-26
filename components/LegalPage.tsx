"use client";

import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { useI18n } from "./LanguageProvider";

interface LegalPageProps {
  docKey: "privacy" | "terms";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function LegalPage({ docKey }: LegalPageProps) {
  const { t } = useI18n();
  const doc = t.docs[docKey];

  return (
    <>
      <Nav />
      <main className="pt-16">
        <div className="mx-auto max-w-[1400px] px-5 pt-12 pb-24 md:px-8 md:pt-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-dim transition-colors duration-200 hover:text-accent-text"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            {t.legal.back}
          </Link>

          <div className="mt-8 max-w-[60ch]">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
              {t.legal.eyebrow}
            </p>
            <h1 className="mt-3 text-[clamp(2.25rem,6vw,4rem)] font-black uppercase leading-[0.95] tracking-[-0.035em]">
              {doc.title}
            </h1>
            <p className="mt-4 font-mono text-xs text-dim">
              {t.legal.lastUpdated} {doc.updated}
            </p>
            <p className="mt-5 text-base leading-relaxed text-dim">{doc.intro}</p>
          </div>

          <div className="mt-14 border-t border-line">
            {doc.sections.map((section, index) => (
              <section
                key={section.heading}
                id={slugify(section.heading)}
                className="grid scroll-mt-24 gap-x-10 gap-y-4 border-b border-line py-9 md:grid-cols-[5.5rem_minmax(0,1fr)] lg:grid-cols-[7rem_minmax(0,1fr)]"
              >
                <div className="flex items-baseline gap-3 md:block">
                  <span className="font-mono text-[11px] leading-none text-accent-text">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-sm font-bold uppercase tracking-[0.08em] md:mt-3">
                    {section.heading}
                  </h2>
                </div>

                <div className="max-w-[68ch]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-relaxed text-dim md:text-base">
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets ? (
                    <ul className="mt-4 space-y-2.5">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex gap-3 text-sm leading-relaxed text-dim md:text-base"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-10 max-w-[68ch] text-sm leading-relaxed text-dim">{t.legal.contact}</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
