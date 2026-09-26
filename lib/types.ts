export type TabKind = "video" | "image" | "both";

export interface Template {
  id: string;
  title: string;
  description: string;
  useCount: number;
  likeCount: number;
  commentCount: number;
  durationMs: number;
  coverUrl: string;
  videoUrl: string;
  /* Image templates ship a full-res still instead of a video. Video
     entries without media never reach the UI. */
  kind: "video" | "image";
  previewUrl: string;
  url: string;
  creator: string;
}

export interface SearchSuccess {
  ok: true;
  keyword: string;
  tab: TabKind;
  count: number;
  tookMs: number;
  results: Template[];
}

export interface SearchFailure {
  ok: false;
  error: string;
}

export type SearchPayload = SearchSuccess | SearchFailure;
