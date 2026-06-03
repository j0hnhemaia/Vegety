/**
 * Vegety — Menu Webhook (Google Apps Script Web App)
 * ---------------------------------------------------
 * Serves the "Menu" sheet as JSON, secured by a shared secret.
 *
 * IMPORTANT: you do NOT redeploy when you change the menu data. The web app
 * reads the sheet LIVE on every request (cached 30s). Editing rows is enough.
 * Use "🌿 Vegety → Publish menu" to clear the cache for an instant refresh.
 * Redeploy is only needed if you change THIS code.
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
var CACHE_KEY = "menu_json";
var CACHE_TTL_SECONDS = 30;

/* ----------------------------- Custom menu ----------------------------- */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🌿 Vegety")
    .addItem("Publish menu", "publishMenu")
    .addToUi();
}

/** Clears the cache so the website shows the latest rows immediately. */
function publishMenu() {
  CacheService.getScriptCache().remove(CACHE_KEY);
}

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
  var cache = CacheService.getScriptCache();
  var cached = cache.get(CACHE_KEY);
  if (cached) return JSON.parse(cached);

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return [];

  // Row 0 = headers: name | category | price | image | description
  // (id is generated here from the row number; the sheet has no id/rating columns)
  var items = rows
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

  cache.put(CACHE_KEY, JSON.stringify(items), CACHE_TTL_SECONDS);
  return items;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
