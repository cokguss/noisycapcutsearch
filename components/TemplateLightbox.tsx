"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowSquareOut, Check, Copy, CursorClick, Heart, Info, Timer, X } from "@phosphor-icons/react";
import { formatCount, formatDuration } from "@/lib/format";
import { useI18n } from "./LanguageProvider";
import type { Template } from "@/lib/types";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    /* clipboard API can be blocked, fall back to a hidden textarea */
  }
  try {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(field);
    return ok;
  } catch {
    return false;
  }
}

interface TemplateLightboxProps {
  template: Template;
  onClose: () => void;
}

/* Hand the template off to the CapCut app without ever navigating the
   search page away. Android Chrome resolves intent:// inside a new tab
   (app opens when installed; otherwise that tab lands on capcut.com via
   its browser_fallback_url). iOS gets the capcut:// scheme from the
   same tab; when the app never takes over, the web page opens in a new
   tab instead. Desktop always opens capcut.com in a new tab. The scheme
   matches CapCut's own smart-app-banner metadata. */
function openTemplate(template: Template) {
  const ua = navigator.userAgent;
  const isAndroid = /android/i.test(ua);
  const isIOS = /iphone|ipad|ipod/i.test(ua);

  if (!isAndroid && !isIOS) {
    window.open(template.url, "_blank", "noopener,noreferrer");
    return;
  }

  if (isAndroid) {
    const intent =
      `intent://template/detail?template_id=${template.id}#Intent;scheme=capcut;package=com.lemon.lvoverseas;S.browser_fallback_url=${encodeURIComponent(template.url)};end`;
    const win = window.open(intent, "_blank");
    if (!win) window.location.href = intent; // popup blocked: last resort
    return;
  }

  let handedOff = false;
  const onVisibility = () => {
    if (document.hidden) handedOff = true;
  };
  const onPageHide = () => {
    handedOff = true;
  };
  const cleanup = () => {
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", onPageHide);
  };
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", onPageHide);
  window.location.href = `capcut://template/detail?template_id=${template.id}`;
  window.setTimeout(() => {
    cleanup();
    if (!handedOff && !document.hidden) window.open(template.url, "_blank");
  }, 1500);
}

export function TemplateLightbox({ template, onClose }: TemplateLightboxProps) {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const copyLink = async () => {
    const result = await copyText(template.url);
    setCopied(result);
    if (result) window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 md:p-8"
    >
      <button
        type="button"
        aria-label={t.lightbox.close}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-sm"
      />

      <motion.div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`${template.title} ${t.lightbox.previewLabel}`}
        initial={reduce ? false : { opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.32, ease: EASE }}
        className="relative z-10 grid max-h-[92dvh] w-full max-w-4xl grid-cols-1 gap-5 overflow-y-auto rounded-2xl border border-line bg-elev p-4 focus:outline-none md:grid-cols-[minmax(0,300px)_1fr] md:gap-7 md:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.lightbox.close}
          className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full border border-line bg-elev/90 text-dim backdrop-blur-sm transition-colors duration-200 hover:border-line-strong hover:text-fg md:right-5 md:top-5"
        >
          <X size={18} />
        </button>
        {template.videoUrl ? (
          <video
            key={template.id}
            src={template.videoUrl}
            poster={template.coverUrl}
            controls
            autoPlay
            loop
            playsInline
            className="aspect-[9/16] w-full rounded-xl border border-line bg-black object-contain"
          />
        ) : (
          <div className="relative aspect-[9/16] w-full overflow-hidden rounded-xl border border-line bg-sunken">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={template.previewUrl || template.coverUrl}
              alt={template.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="flex min-w-0 flex-col">
          <h2 className="text-2xl font-black uppercase leading-[1.05] tracking-[-0.02em] md:pr-12 md:text-3xl">
            {template.title}
          </h2>

          {template.description ? (
            <p className="mt-3 break-words font-mono text-xs leading-relaxed text-dim">
              {template.description}
            </p>
          ) : null}

          {template.creator ? (
            <p className="mt-3 text-sm text-dim">
              {t.lightbox.by} <span className="font-semibold text-fg">{template.creator}</span>
            </p>
          ) : null}

          {template.kind === "image" ? (
            <p className="mt-3 flex items-start gap-2 rounded-xl border border-line bg-bg px-3.5 py-2.5 text-xs leading-relaxed text-dim">
              <Info size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
              {t.lightbox.imageNote}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-xs text-dim">
            <span className="flex items-center gap-1.5">
              <CursorClick size={14} aria-hidden="true" />
              {formatCount(template.useCount)} {t.lightbox.uses}
            </span>
            <span className="flex items-center gap-1.5">
              <Heart size={14} aria-hidden="true" />
              {formatCount(template.likeCount)} {t.lightbox.likes}
            </span>
            {template.durationMs > 0 ? (
              <span className="flex items-center gap-1.5">
                <Timer size={14} aria-hidden="true" />
                {formatDuration(template.durationMs)}
              </span>
            ) : null}
          </div>

          <div className="mt-auto pt-6">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openTemplate(template)}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-[0.06em] text-accent-fg transition-transform duration-200 hover:-translate-y-px active:scale-[0.97]"
              >
                {t.lightbox.useTemplate}
                <ArrowSquareOut size={16} />
              </button>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold transition-colors duration-200 hover:border-accent hover:text-accent-text"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? t.lightbox.copied : t.lightbox.copyLink}
              </button>
            </div>
            <p className="mt-3 font-mono text-[11px] text-dim">{t.lightbox.hint}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
