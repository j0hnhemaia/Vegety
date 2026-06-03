/**
 * Vegety — Menu Webhook (Google Apps Script Web App)
 * ---------------------------------------------------
 * Serves the "Menu" sheet as JSON, secured by a shared secret.
 *
 * IMPORTANT: you do NOT redeploy when you change the menu data. The web app
 * reads the sheet LIVE on every request — edit a row, refresh the site, done.
 * Redeploy (New version) is only needed if you change THIS code.
 *
 * SECURITY MODEL
 *  - Secret lives in Script Properties (WEBHOOK_KEY), never in this file/repo.
 *  - Every request must present the key; compared in CONSTANT TIME.
 *  - Key is sent in the POST body (not the URL) → never lands in access logs.
 *  - The Next.js caller holds the key in a server-only env var, so it never
 *    reaches the browser. HTTPS enforced by Apps Script.
 *
 * SETUP
 *  1. Sheet → Extensions → Apps Script → paste this file → Save.
 *  2. Sheet tab named "Menu", row 1 headers: name | category | price | image | description
 *     (or import apps-script/menu-seed.csv).
 *  3. Set the secret: Project Settings (gear) → Script properties →
 *     add property  WEBHOOK_KEY = <a long random string>. Use the SAME value as
 *     MENU_WEBHOOK_KEY in your .env / Vercel.
 *  4. Deploy → New deployment → Web app
 *       - Execute as: Me
 *       - Who has access: Anyone   (access is gated by the key, not Google login)
 *     Copy the /exec URL → MENU_WEBHOOK_URL.
 */

var SHEET_NAME = "Menu";

/* ----------------------------- Web app --------------------------------- */

function doGet(e) {
  return handle_(e);
}

function doPost(e) {
  return handle_(e);
}

function handle_(e) {
  try {
    if (!checkAuth_(e)) return json_({ ok: false, error: "unauthorized" });
    return json_({ ok: true, items: readMenu_() });
  } catch (err) {
    return json_({ ok: false, error: "server_error" });
  }
}

function checkAuth_(e) {
  var expected = PropertiesService.getScriptProperties().getProperty("WEBHOOK_KEY");
  if (!expected) return false;
  var provided = extractKey_(e);
  if (!provided) return false;
  return constantTimeEquals_(provided, expected);
}

function extractKey_(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      var body = JSON.parse(e.postData.contents);
      if (body && body.key) return String(body.key);
    } catch (ignore) {}
  }
  if (e && e.parameter && e.parameter.key) return String(e.parameter.key);
  return "";
}

function constantTimeEquals_(a, b) {
  var ba = Utilities.newBlob(a).getBytes();
  var bb = Utilities.newBlob(b).getBytes();
  var diff = ba.length ^ bb.length;
  var n = Math.max(ba.length, bb.length);
  for (var i = 0; i < n; i++) {
    var x = i < ba.length ? ba[i] : 0;
    var y = i < bb.length ? bb[i] : 0;
    diff |= x ^ y;
  }
  return diff === 0;
}

function readMenu_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return [];

  // Row 0 = headers: name | category | price | image | description
  // (id is generated here from the row number; the sheet has no id/rating columns)
  return rows
    .slice(1)
    .filter(function (r) {
      return String(r[0] || "").trim() !== "";
    })
    .map(function (r, i) {
      return {
        id: String(i + 1),
        name: String(r[0] || "").trim(),
        category: String(r[1] || "Uncategorised").trim(),
        price: parseFloat(r[2]) || 0,
        image: String(r[3] || "").trim(),
        description: String(r[4] || "").trim(),
      };
    });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/* ---------------------- On-demand revalidation ------------------------- */
/**
 * Pings the Next.js site to purge its cache the moment the sheet changes, so
 * menu edits appear IMMEDIATELY (no waiting for the site's time-based fallback).
 *
 * SETUP (one time):
 *  1. Project Settings (gear) → Script properties → add:
 *       REVALIDATE_URL    = https://<your-site>/api/revalidate
 *       REVALIDATE_SECRET = <a long random string>   (same value in Vercel)
 *  2. Triggers (clock icon) → Add Trigger:
 *       Choose function:  onSheetChange
 *       Event source:     From spreadsheet
 *       Event type:       On change
 *       Save → authorize when prompted (an INSTALLABLE trigger is required;
 *       simple triggers cannot make external requests).
 *
 * "On change" covers cell edits, row/column inserts and deletes, so any menu
 * change triggers a revalidation. Best-effort: if the ping fails, the site's
 * `revalidate: 60` fallback still picks the edit up within a minute.
 */
function onSheetChange(e) {
  try {
    var props = PropertiesService.getScriptProperties();
    var url = props.getProperty("REVALIDATE_URL");
    var secret = props.getProperty("REVALIDATE_SECRET");
    if (!url || !secret) return;

    UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({ secret: secret }),
      muteHttpExceptions: true,
    });
  } catch (err) {
    // Best-effort only — the site's time-based ISR fallback self-heals.
  }
}
