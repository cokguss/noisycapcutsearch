import axios from "axios";
import type { TabKind, Template } from "./types";

const PROXY_API = "https://api.ikyyxd.my.id/v2l/proxy-free/ikyy-xsample";
const BASE_URL = "https://www.capcut.com";
const API_ENDPOINT = "/kep/api/getSimilarTemplates";

const PROXY_TTL_MS = 10 * 60_000;
const RESULT_TTL_MS = 5 * 60_000;
/* Empty results must not stick: a keyword can gain templates any minute,
   and a stale "0 results" reads as a broken site. */
const EMPTY_RESULT_TTL_MS = 30_000;
/* Direct connection first: from residential networks CapCut answers in
   a few hundred ms while most of the free pool is 403/407-blocked.
   Proxies stay as fallback for hosts CapCut refuses (datacenter IPs). */
const DIRECT_TIMEOUT_MS = 8000;
const PROXY_TIMEOUT_MS = 12000;
const RACE_SIZE = 4;
const MAX_RACES = 2;
/* After one failed direct attempt, skip it for a while instead of
   paying its timeout on every search. */
const DIRECT_COOLDOWN_MS = 5 * 60_000;

const PROXY_FORMAT = /^\d{1,3}(\.\d{1,3}){3}:\d{1,5}:[^:\s]+:[^:\s]+$/;

const EMPTY_PAYLOAD_MSG = "CapCut replied with an empty payload.";

interface ProxyState {
  list: string[];
  fetchedAt: number;
}

let proxyState: ProxyState | null = null;
let proxyFlight: Promise<string[]> | null = null;
let directDisabledUntil = 0;
const resultCache = new Map<string, { at: number; items: Template[] }>();

async function loadProxies(): Promise<string[]> {
  if (proxyState && Date.now() - proxyState.fetchedAt < PROXY_TTL_MS) {
    return proxyState.list;
  }
  if (!proxyFlight) {
    proxyFlight = axios
      .get<string[]>(PROXY_API, { timeout: 12000 })
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data.filter((p): p is string => typeof p === "string" && PROXY_FORMAT.test(p.trim()))
          : [];
        if (list.length === 0) throw new Error("Proxy pool came back empty.");
        proxyState = { list, fetchedAt: Date.now() };
        return list;
      })
      .finally(() => {
        proxyFlight = null;
      });
  }
  try {
    return await proxyFlight;
  } catch (err) {
    if (proxyState) return proxyState.list; // stale beats dead
    throw err;
  }
}

function proxyConfig(entry: string) {
  const [host, port, username, password] = entry.trim().split(":");
  return {
    host,
    port: Number.parseInt(port, 10),
    auth: { username, password },
    protocol: "http" as const,
  };
}

function tabsFor(tab: TabKind): string[] {
  if (tab === "both") return ["video", "image"];
  return [tab];
}

function mapTemplate(raw: Record<string, unknown>, kind: "video" | "image"): Template | null {
  const sd = (raw.structuredData ?? {}) as Record<string, any>;
  const id = raw.templateId ?? sd.templateId;
  if (!id) return null;

  const coverUrl = (raw.coverUrl ?? sd.thumbnailUrl ?? "") as string;
  if (!coverUrl) return null;

  const contentUrl = typeof sd.contentUrl === "string" ? sd.contentUrl : "";
  const videoUrl =
    (raw.videoUrl as string) || (contentUrl.includes("mime_type=video") ? contentUrl : "");
  const previewUrl = kind === "image" && contentUrl ? contentUrl : "";

  const stats = sd.interactionStatistic ?? {};
  const title = String(raw.title ?? sd.name ?? "").trim();

  return {
    id: String(id),
    title: title || "Untitled template",
    description: String(raw.titleDesc ?? sd.description ?? ""),
    useCount: Number(raw.useCount ?? stats.useCount ?? 0) || 0,
    likeCount: Number(raw.likeCount ?? stats.likeCount ?? 0) || 0,
    commentCount: Number(raw.commentCount ?? 0) || 0,
    durationMs: Number(raw.templateDuration ?? sd.duration ?? 0) || 0,
    coverUrl,
    videoUrl,
    kind,
    previewUrl,
    url:
      (typeof sd.url === "string" && sd.url) ||
      `https://www.capcut.com/template-detail/${id}`,
    creator: String(sd.creator?.name ?? ""),
  };
}

export interface SearchArgs {
  keyword: string;
  tab: TabKind;
  size: number;
  language?: string;
  regionCode?: string;
}

function requestHeaders() {
  return {
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36",
    Accept: "*/*",
    "Content-Type": "application/json",
    Origin: BASE_URL,
    Referer: `${BASE_URL}/template`,
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
  };
}

function extractItems(data: Record<string, any>): Template[] {
  const videoTemplates = data?.videoTemplateList?.videoTemplates;
  const imageTemplates = data?.imageTemplateList?.imageTemplates;

  /* CapCut soft-blocks some proxy IPs with status 1000 and an empty
     data object. A real reply always carries at least one list key,
     so a payload without them is degraded, not "no results". */
  if (!Array.isArray(videoTemplates) && !Array.isArray(imageTemplates)) {
    throw new Error(EMPTY_PAYLOAD_MSG);
  }

  return [
    ...((videoTemplates ?? []) as Record<string, unknown>[]).map((raw) =>
      mapTemplate(raw, "video"),
    ),
    ...((imageTemplates ?? []) as Record<string, unknown>[]).map((raw) =>
      mapTemplate(raw, "image"),
    ),
    /* Video entries without media (AI/photo uploads CapCut lists without
       a video) are dropped: the site only shows templates it can preview. */
  ].filter((t): t is Template => t !== null && !(t.kind === "video" && !t.videoUrl));
}

function cachePut(key: string, items: Template[]) {
  resultCache.set(key, { at: Date.now(), items });
  if (resultCache.size > 60) {
    const oldest = resultCache.keys().next().value;
    if (oldest) resultCache.delete(oldest);
  }
}

async function postAttempt(
  args: SearchArgs,
  proxy?: ReturnType<typeof proxyConfig>,
): Promise<Template[]> {
  const client = axios.create({
    baseURL: BASE_URL,
    proxy,
    timeout: proxy ? PROXY_TIMEOUT_MS : DIRECT_TIMEOUT_MS,
    headers: requestHeaders(),
  });

  const res = await client.post(API_ENDPOINT, {
    keyword: args.keyword,
    tabs: tabsFor(args.tab),
    language: args.language ?? "en",
    regionCode: args.regionCode ?? "US",
    size: args.size,
  });

  if (res.data?.status !== 1000) {
    throw new Error(`CapCut replied with status ${res.data?.status ?? "unknown"}.`);
  }
  return extractItems(res.data.data ?? {}).slice(0, args.size);
}

export async function searchTemplates(
  args: SearchArgs,
): Promise<{ items: Template[]; tookMs: number }> {
  const started = Date.now();
  const language = args.language ?? "en";
  const regionCode = args.regionCode ?? "US";
  const cacheKey = `${args.keyword.toLowerCase()}|${args.tab}|${args.size}|${language}|${regionCode}`;

  const cached = resultCache.get(cacheKey);
  if (
    cached &&
    Date.now() - cached.at < (cached.items.length > 0 ? RESULT_TTL_MS : EMPTY_RESULT_TTL_MS)
  ) {
    return { items: cached.items, tookMs: Date.now() - started };
  }

  let lastError = "no route answered.";
  let sawEmptyOk = false;

  /* Fast path: straight from this host, no proxy in the middle. */
  if (Date.now() >= directDisabledUntil) {
    try {
      const items = await postAttempt(args);
      cachePut(cacheKey, items);
      return { items, tookMs: Date.now() - started };
    } catch (err) {
      lastError = (err as Error).message || lastError;
      if ((err as Error).message === EMPTY_PAYLOAD_MSG) {
        /* The route works and CapCut answered; only this keyword came
           back empty. Keep direct enabled. */
        sawEmptyOk = true;
      } else {
        directDisabledUntil = Date.now() + DIRECT_COOLDOWN_MS;
      }
    }
  }

  /* Fallback: race a small batch of public proxies at once, first clean
     reply wins; a second batch if the whole first one fails. */
  const proxies = await loadProxies();
  const queue = [...proxies].sort(() => Math.random() - 0.5);

  for (let race = 0; race < MAX_RACES; race++) {
    const batch = queue.slice(race * RACE_SIZE, race * RACE_SIZE + RACE_SIZE);
    if (batch.length === 0) break;
    try {
      const items = await Promise.any(
        batch.map((entry) => postAttempt(args, proxyConfig(entry))),
      );
      cachePut(cacheKey, items);
      return { items, tookMs: Date.now() - started };
    } catch (err) {
      const errors = (err as AggregateError).errors as Error[] | undefined;
      lastError = errors?.[0]?.message || (err as Error).message || lastError;
      for (const e of errors ?? []) {
        if (e?.message === EMPTY_PAYLOAD_MSG) sawEmptyOk = true;
      }
    }
  }

  /* Every route that answered said "no templates for this keyword",
     and none reported a network failure. Report it as an honest empty
     result instead of a connection error. */
  if (sawEmptyOk) {
    cachePut(cacheKey, []);
    return { items: [], tookMs: Date.now() - started };
  }

  throw new Error(
    `Could not reach CapCut directly or through the proxy pool (${lastError}).`,
  );
}
