# Vegety - Healthy Food Landing + Dynamic Menu

Next.js 15 (App Router) + Tailwind. Pure frontend, no backend. Built for UK cafés &
restaurants, deployable on the Vercel free plan.

## Pages
- `/` - landing page (hero, special dish, fresh veg, popular menu, chefs, testimonials, newsletter, footer)
- `/menu` - dynamic menu with live **search** + **category filter**

## Data source
Menu comes from a Google Sheet via a **secured Apps Script webhook**. The secret is
**server-only** (fetched in a Server Component, never shipped to the browser).
Until you configure it, the app uses built-in mock data (`lib/mock-menu.ts`).

### Sheet format
Tab named `Menu`, row 1 headers in this exact order:

| name | category | price | image | description |
|------|----------|-------|-------|-------------|

(`id` is generated automatically; there are no `id`/`rating` columns.)

### Go live
1. Deploy the webhook - see [`apps-script/README.md`](apps-script/README.md)
   (paste `apps-script/Code.gs`, run `setupKey()`, deploy as a Web App).
2. Copy `.env.example` to `.env.local` and fill in:
   ```
   MENU_WEBHOOK_URL=<the Apps Script /exec URL>
   MENU_WEBHOOK_KEY=<the secret from setupKey()>
   ```
3. On Vercel, add the same two vars in Project → Settings → Environment Variables.

## Develop
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Notes
- No booking, cart, or sign-in (removed from the reference by request).
- Newsletter box is visual only (no data stored/sent).
- Demo images load from Unsplash; swap for your own dish photos in the sheet `image` column.
