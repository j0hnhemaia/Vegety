import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// On-demand revalidation endpoint.
//
// Called by the Google Apps Script `onSheetChange` trigger the instant the
// "Menu" sheet changes, so edits appear on the site immediately instead of
// waiting for the time-based ISR fallback (lib/fetch-menu.ts `revalidate: 60`).
//
// It purges the "menu" Data Cache tag; the next request to / or /menu then
// re-renders with fresh sheet data.
//
// Security: gated by REVALIDATE_SECRET (server-only env var, NOT NEXT_PUBLIC_).
// Set the SAME value in Vercel and in the Apps Script Script Property of the
// same name. The secret is compared in constant time.
//
//   POST /api/revalidate    body: { "secret": "<REVALIDATE_SECRET>" }
//
// Manual test:
//   curl -X POST https://<site>/api/revalidate \
//     -H "content-type: application/json" -d '{"secret":"<REVALIDATE_SECRET>"}'
// ---------------------------------------------------------------------------

export const dynamic = "force-dynamic";

function constantTimeEquals(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  let diff = ba.length ^ bb.length;
  const n = Math.max(ba.length, bb.length);
  for (let i = 0; i < n; i++) {
    diff |= (i < ba.length ? ba[i] : 0) ^ (i < bb.length ? bb[i] : 0);
  }
  return diff === 0;
}

async function providedSecret(req: Request): Promise<string> {
  // Prefer the POST body (keeps the secret out of access logs), fall back to a
  // query param for easy manual testing.
  if (req.method === "POST") {
    try {
      const body = (await req.json()) as { secret?: unknown };
      if (typeof body?.secret === "string") return body.secret;
    } catch {
      // ignore non-JSON / empty bodies
    }
  }
  return new URL(req.url).searchParams.get("secret") ?? "";
}

async function handle(req: Request) {
  const expected = process.env.REVALIDATE_SECRET?.trim();
  if (!expected) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  const provided = await providedSecret(req);
  if (!provided || !constantTimeEquals(provided, expected)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  revalidateTag("menu");
  return NextResponse.json({ ok: true, revalidated: true, now: Date.now() });
}

export async function POST(req: Request) {
  return handle(req);
}

export async function GET(req: Request) {
  return handle(req);
}
