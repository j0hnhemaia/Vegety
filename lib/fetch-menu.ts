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
// The key is sent in the POST body (not the URL) over HTTPS, so it never
// appears in access logs. The menu reflects the sheet only — if env is missing
// or the sheet is empty, we return an empty list (the page shows its empty
// state) rather than any placeholder data.
// ---------------------------------------------------------------------------

const WEBHOOK_URL = process.env.MENU_WEBHOOK_URL;
const WEBHOOK_KEY = process.env.MENU_WEBHOOK_KEY;

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
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: WEBHOOK_KEY }),
      cache: "no-store",
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
