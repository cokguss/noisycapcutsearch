"use client";

import Link from "next/link";
import { useI18n } from "./LanguageProvider";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1400px] px-5 pt-12 pb-8 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <p className="max-w-[46ch] text-sm leading-relaxed text-dim">{t.footer.disclaimer}</p>
          <div className="space-y-2 font-mono text-xs text-dim md:text-right">
            <p>{t.footer.api}</p>
            <p>{t.footer.sourced}</p>
            <p className="flex gap-4 md:justify-end">
              <Link
                href="/privacy"
                className="underline underline-offset-4 transition-colors duration-200 hover:text-accent-text"
              >
                {t.footer.privacy}
              </Link>
              <Link
                href="/terms"
                className="underline underline-offset-4 transition-colors duration-200 hover:text-accent-text"
              >
                {t.footer.terms}
              </Link>
            </p>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="mt-12 overflow-hidden text-[clamp(4.5rem,18vw,15rem)] font-black uppercase leading-[0.78] tracking-[-0.05em]"
        >
          <span className="stroke-word">{t.footer.wordmark}</span>
          <span className="text-accent-text">.</span>
        </div>
      </div>
    </footer>
  );
}
