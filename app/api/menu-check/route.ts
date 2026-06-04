import { NextResponse } from "next/server";

// TEMPORARY diagnostic. Hit /api/menu-check on the live site to see exactly what
// the server sees. Returns no secret — only booleans, status, and item count.
// Delete this route once the menu works.
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.MENU_WEBHOOK_URL?.trim();
  const key = process.env.MENU_WEBHOOK_KEY?.trim();

  const out: Record<string, unknown> = {
    hasUrl: !!url,
    hasKey: !!key,
    keyLength: key ? key.length : 0,
    urlHost: (() => {
      if (!url) return null;
      try {
        return new URL(url).host;
      } catch {
        return "INVALID_URL";
      }
    })(),
    urlEndsWithExec: url ? url.endsWith("/exec") : null,
  };

  if (url && key) {
    try {
      const u = new URL(url);
      u.searchParams.set("key", key);
      const res = await fetch(u.toString(), { cache: "no-store", redirect: "follow" });
      out.httpStatus = res.status;
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        out.webhookOk = data.ok ?? null;
        out.webhookError = data.error ?? null;
        out.itemCount = Array.isArray(data.items) ? data.items.length : null;
        // Diagnostic: show each item's name + the raw fields the webhook sends,
        // so we can confirm whether `available`/out_of_menu is coming through.
        if (Array.isArray(data.items)) {
          const first = data.items[0] ?? {};
          out.itemKeys = Object.keys(first); // e.g. does it include "available"?
          out.items = data.items.map((it: Record<string, unknown>) => ({
            name: it.name,
            available: it.available,
          }));
        }
      } catch {
        out.parsedJson = false;
        out.bodyPreview = text.slice(0, 120);
      }
    } catch (e) {
      out.fetchError = String(e instanceof Error ? e.message : e);
    }
  }

  return NextResponse.json(out);
}
