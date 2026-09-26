"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CursorClick, Heart, Play, Timer } from "@phosphor-icons/react";
import { formatCount, formatDuration } from "@/lib/format";
import { useI18n } from "./LanguageProvider";
import type { Template } from "@/lib/types";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface TemplateCardProps {
  template: Template;
  index: number;
  onOpen: (template: Template) => void;
}

export function TemplateCard({ template, index, onOpen }: TemplateCardProps) {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement>(null);

  const startPreview = () => {
    const video = videoRef.current;
    if (!video) return;
    const played = video.play();
    if (played) played.catch(() => {});
  };

  const stopPreview = () => {
    videoRef.current?.pause();
  };

  const open = () => onOpen(template);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`${t.card.preview} ${template.title}`}
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      }}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: Math.min(index * 0.04, 0.55),
        ease: EASE,
      }}
      className="group block cursor-pointer"
    >
      <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border border-line bg-elev transition-colors duration-300 group-hover:border-line-strong">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={template.coverUrl}
          alt={template.title}
          width={405}
          height={720}
          loading={index < 5 ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
        />
        {template.videoUrl ? (
          <video
            ref={videoRef}
            src={template.videoUrl}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        ) : null}
        {template.videoUrl ? (
          <span className="pointer-events-none absolute bottom-2.5 right-2.5 grid h-9 w-9 translate-y-2 place-items-center rounded-full bg-accent text-accent-fg opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Play size={16} />
          </span>
        ) : null}
      </div>

      <h3 className="mt-3 line-clamp-2 text-[15px] font-semibold leading-snug transition-colors duration-200 group-hover:text-accent-text">
        {template.title}
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-dim">
        <span className="flex items-center gap-1">
          <CursorClick size={13} aria-hidden="true" />
          {formatCount(template.useCount)}
        </span>
        <span className="flex items-center gap-1">
          <Heart size={13} aria-hidden="true" />
          {formatCount(template.likeCount)}
        </span>
        {template.durationMs > 0 ? (
          <span className="flex items-center gap-1">
            <Timer size={13} aria-hidden="true" />
            {formatDuration(template.durationMs)}
          </span>
        ) : null}
      </div>
    </motion.div>
  );
}
