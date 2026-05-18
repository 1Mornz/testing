# QuoteGate MVP

QuoteGate is a self-serve paid quote request page app for service providers. Providers create one public quote page, customers submit project details and photos, and the provider reviews requests from a simple dashboard. Optional quote deposits use Stripe Checkout when configured.

This version is a Next.js App Router app with local JSON file storage only.

## Stack

- Next.js App Router
- React
- Local JSON persistence in `data/`
- Local image uploads in `uploads/`
- Stripe Checkout for optional quote deposits
- Vanilla CSS in `app/globals.css`

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Default local URL:

```text
http://localhost:3000
```

Useful routes:

- Landing page: `/`
- Provider setup: `/setup`
- Dashboard: `/dashboard`
- Demo quote page: `/q/brightside-home-services`

Build and run production locally:

```bash
npm run build
npm run start
```

Seed or reset demo data:

```bash
npm run seed
```

## Environment Variables

```bash
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:3000
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Stripe is optional for local demo use. If `STRIPE_SECRET_KEY` is missing, the app still runs and clearly shows that payments are not configured. Quote requests can still be submitted and reviewed as unpaid.

For Stripe webhooks, point Stripe CLI or Dashboard webhooks at:

```bash
http://localhost:3000/api/stripe/webhook
```

## JSON Storage

The app creates `data/settings.json` and `data/requests.json` automatically. Reads and writes go through `lib/jsonStore.js`, which initializes missing files and replaces malformed JSON with a fresh default after backing up the malformed file.

Demo data is inserted only when no provider settings or requests exist. Running `npm run seed` resets the demo provider and sample requests.

## Uploads

Customer photos are stored locally in `uploads/` and served from `/uploads/<filename>`. Uploads are limited to common image formats (`jpg`, `png`, `webp`, `gif`), up to 5 MB each, with up to 6 photos per request.

On serverless deployments, local filesystem writes are not durable. This MVP intentionally keeps local JSON/uploads per the spec; production should move persistence to durable storage.

## Test the MVP Flow

1. Open `/setup`, edit the provider page, and save.
2. Open the public quote URL or `/q/brightside-home-services`.
3. Submit a quote request with project details and optional photos.
4. Open `/dashboard` and view the new request.
5. Open the request detail page and update its status.
6. If Stripe keys are configured, submit a request with deposit payment and complete Checkout.
7. If Stripe keys are not configured, confirm the request is saved and marked unpaid.

## MVP Limitations

- Single provider page only.
- No authentication or multi-user teams.
- No external database or production-grade file locking.
- Local JSON and uploaded files are not durable on serverless hosting.
- No custom domains, scheduling, CRM pipeline, SMS, or advanced analytics.
- Stripe payment status depends on webhook delivery.
