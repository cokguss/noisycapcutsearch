"use client";

import type { CSSProperties } from "react";

interface CoverMarqueeProps {
  covers: string[];
  loading: boolean;
}

function fillTiles(covers: string[], minimum: number): string[] {
  if (covers.length === 0) return [];
  const out: string[] = [];
  while (out.length < Math.max(minimum, covers.length)) {
    out.push(covers[out.length % covers.length]);
  }
  return out;
}

function Column({
  tiles,
  loading,
  reverse,
  speed,
}: {
  tiles: string[];
  loading: boolean;
  reverse: boolean;
  speed: string;
}) {
  const style = { "--marquee-speed": speed } as CSSProperties;
  const track = (
    <>
      {tiles.map((cover, i) =>
        loading ? (
          <div key={`s-${i}`} className="shimmer mb-4 aspect-[9/16] rounded-2xl" />
        ) : (
          <div key={`c-${i}`} className="mb-4 aspect-[9/16] overflow-hidden rounded-2xl border border-line bg-elev">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        ),
      )}
    </>
  );

  return (
    <div className="flex-1 overflow-hidden">
      <div
        className={`marquee-col ${reverse ? "marquee-col--reverse" : ""}`}
        style={style}
        aria-hidden="true"
      >
        {track}
        {track}
      </div>
    </div>
  );
}

export function CoverMarquee({ covers, loading }: CoverMarqueeProps) {
  const tiles = loading ? Array.from({ length: 6 }, (_, i) => `skeleton-${i}`) : fillTiles(covers, 8);
  const columnA = tiles.filter((_, i) => i % 2 === 0);
  const columnB = tiles.filter((_, i) => i % 2 === 1);

  return (
    <div className="marquee-hold relative mask-fade-y flex h-[280px] -rotate-[1.5deg] gap-4 sm:h-[380px] lg:h-[560px]">
      <Column tiles={columnA} loading={loading} reverse={false} speed="42s" />
      <Column tiles={columnB} loading={loading} reverse speed="52s" />
    </div>
  );
}
