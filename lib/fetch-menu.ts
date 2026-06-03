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
      };
    })
    .filter((m) => m.name.length > 0);
}

export async function fetchMenu(): Promise<MenuItem[]> {
  if (!WEBHOOK_URL || !WEBHOOK_KEY) return [];

  try {
    // Build the URL safely: overrides any pasted ?key, encodes correctly.
    const u = new URL(WEBHOOK_URL);
    u.searchParams.set("key", WEBHOOK_KEY);
    const res = await fetch(u.toString(), {
      // ISR: cache the response, tagged "menu". Sheet edits purge this cache
      // instantly via /api/revalidate (called by the Apps Script onSheetChange
      // trigger); `revalidate: 60` is a self-healing fallback if a ping is missed.
      next: { revalidate: 60, tags: ["menu"] },
      redirect: "follow", // Apps Script 302-redirects to googleusercontent
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);

    const data = (await res.json()) as WebhookResponse;
    if (!data.ok) throw new Error(data.error || "webhook error");

    return sanitize(data.items);
  } catch (err) {
    console.error("fetchMenu failed:", err);
    return [];
  }
}
