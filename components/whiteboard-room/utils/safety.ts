"use client";

import DOMPurify from "dompurify";

// Everything a card renders arrives from the room's event log. The server
// only lets the trainer write board events and rejects obvious script URLs,
// but every viewer still sanitises what it renders — the Word card injects
// HTML, and several cards embed iframes/links — so a bad payload can never
// run script in a student's logged-in Celoris session.

/** Word (.docx → HTML via mammoth) content, safe to put in innerHTML. */
export function sanitizeDocHtml(html: string): string {
  if (typeof window === "undefined") return "";
  return DOMPurify.sanitize(html || "", {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["style", "form", "input", "button", "textarea", "select", "iframe", "object", "embed", "script"],
    FORBID_ATTR: ["srcset", "action", "formaction"],
    ALLOW_DATA_ATTR: false,
  });
}

/** Only plain https:// links are allowed for embeds and "open" links. */
export function safeHttpsUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url.trim());
    return u.protocol === "https:" ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

/** Image cards: https URLs or inline raster images only (no SVG — it can carry script). */
export function safeImageSrc(src: string | undefined | null): string | undefined {
  if (!src) return undefined;
  const s = src.trim();
  if (/^data:image\/(png|jpe?g|gif|webp);base64,[A-Za-z0-9+/=\s]+$/i.test(s)) return s;
  return safeHttpsUrl(s);
}

export function isYouTubeId(id: string | undefined | null): id is string {
  return !!id && /^[A-Za-z0-9_-]{6,20}$/.test(id);
}
