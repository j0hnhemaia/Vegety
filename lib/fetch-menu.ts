import "server-only";
import type { MenuItem } from "./types";

// ---------------------------------------------------------------------------
// Server-only menu fetch. Imports "server-only" so this module can NEVER be
// bundled into client code — the secret cannot leak to the browser.
//
// Env (server-only, NOT prefixed with NEXT_PUBLIC_):
//   MENU_WEBHOOK_URL  – the Apps Script /exec web app URL
//   MENU_WEBHOOK_KEY  – the shared secret (matches Script Property WEBHOOK_KEY)
//
// The key is sent as a query param over HTTPS (the whole URL is encrypted in
// transit). Apps Script /exec reliably handles GET; its POST endpoint 405s for
// server-to-server requests, so we use GET. The request runs server-side on
// Vercel, so the key never reaches the browser.
//
// The menu reflects the sheet only — if env is missing or the sheet is empty,
// we return an empty list (the page shows its empty state), never placeholder data.
// ---------------------------------------------------------------------------

const WEBHOOK_URL = process.env.MENU_WEBHOOK_URL?.trim();
const WEBHOOK_KEY = process.env.MENU_WEBHOOK_KEY?.trim();

type WebhookResponse = { ok: boolean; items?: MenuItem[]; error?: string };

function sanitize(items: unknown): MenuItem[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((raw): MenuItem => {
      const r = raw as Record<string, unknown>;
      return {
        id: String(r.id ?? ""),
        name: String(r.name ?? "").trim(),
        category: String(r.category ?? "Uncategorised").trim(),
        price: Number(r.price) || 0,
        image: String(r.image ?? "").trim(),
        description: String(r.description ?? "").trim(),
        available: r.available !== false, // default available unless flagged
      };
    })
    .filter((m) => m.name.length > 0);
}

// One attempt at the webhook, with a hard timeout so a hung request can't stall
// the whole page render. Throws on any failure.
async function fetchOnce(): Promise<MenuItem[]> {
  const u = new URL(WEBHOOK_URL!);
  u.searchParams.set("key", WEBHOOK_KEY!);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000); // Apps Script is slow (~7-11s)
  try {
    const res = await fetch(u.toString(), {
      // Short cache + tag. Pages serve instantly from cache; the slow webhook
      // only runs in the background on revalidation, never blocking a user.
      // The "menu" tag lets a sheet edit trigger an instant refresh.
      next: { revalidate: 10, tags: ["menu"] },
      redirect: "follow", // Apps Script 302-redirects to googleusercontent
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);

    const data = (await res.json()) as WebhookResponse;
    if (!data.ok) throw new Error(data.error || "webhook error");

    return sanitize(data.items);
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchMenu(): Promise<MenuItem[]> {
  // No source configured → genuinely empty (page shows its empty state).
  if (!WEBHOOK_URL || !WEBHOOK_KEY) return [];

  // Retry transient failures (the webhook is slow and occasionally times out).
  // CRITICAL: on total failure we THROW, not return []. Throwing makes the ISR
  // regeneration fail, so Next keeps serving the LAST GOOD menu instead of
  // caching an empty "No dishes found" page. A successful empty response (real
  // empty sheet) still returns [] normally.
  let lastErr: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await fetchOnce();
    } catch (err) {
      lastErr = err;
      console.error(`fetchMenu attempt ${attempt} failed:`, err);
      if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 500));
    }
  }
  throw new Error(`fetchMenu failed after retries: ${String(lastErr)}`);
}
