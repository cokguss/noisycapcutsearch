import { NextRequest, NextResponse } from "next/server";
import { searchTemplates } from "@/lib/capcut";
import type { SearchPayload, TabKind } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TABS: TabKind[] = ["video", "image", "both"];

export async function GET(req: NextRequest): Promise<NextResponse<SearchPayload>> {
  const params = req.nextUrl.searchParams;
  const keyword = (params.get("keyword") ?? "").replace(/\s+/g, " ").trim().slice(0, 80);

  if (!keyword) {
    return NextResponse.json(
      { ok: false, error: "Give me a keyword to search for." },
      { status: 400 },
    );
  }

  const rawTab = params.get("tab") ?? "video";
  const tab = (TABS as string[]).includes(rawTab) ? (rawTab as TabKind) : "video";
  const size = Math.min(30, Math.max(1, Number.parseInt(params.get("size") ?? "", 10) || 20));

  try {
    const { items, tookMs } = await searchTemplates({ keyword, tab, size });
    return NextResponse.json(
      { ok: true, keyword, tab, count: items.length, tookMs, results: items },
      {
        headers: {
          /* An empty snapshot must never be pinned by shared caches,
             or refreshes keep serving "0 results" after CapCut recovers. */
          "Cache-Control":
            items.length > 0
              ? "public, s-maxage=300, stale-while-revalidate=600"
              : "no-store",
        },
      },
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message || "Search failed." },
      { status: 502 },
    );
  }
}
