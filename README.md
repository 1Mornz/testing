# QuoteGate MVP

QuoteGate is a self-serve paid quote request page app for service providers. Providers create one public quote page, customers submit project details and photos, and the provider reviews requests from a simple dashboard. Optional quote deposits use Stripe Checkout when configured.

This MVP uses local JSON file storage only. There is no external database, ORM, Supabase, Firebase, MongoDB, or Prisma.

## Stack

- Vue 3 with Vite in `client/`
- Node.js and Express in `server/`
- Local JSON persistence in `data/`
- Local image uploads in `uploads/`
- Stripe Checkout for optional quote deposits

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The default URLs are:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4242/api`
- Demo quote page: `http://localhost:5173/q/brightside-home-services`

Run only one side when needed:

```bash
npm run client:dev
npm run server:dev
```

Build the frontend:

```bash
npm run build
```

Seed or reset demo data:

```bash
npm run seed
```

## Environment Variables

Create `.env` from `.env.example`.

```bash
PORT=4242
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:4242
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Stripe is optional for local demo use. If `STRIPE_SECRET_KEY` is missing, the app still runs and clearly shows that payments are not configured. Quote requests can still be submitted and reviewed as unpaid.

For Stripe webhooks, point Stripe CLI or Dashboard webhooks at:

```bash
http://localhost:4242/api/stripe/webhook
```

Listen locally with Stripe CLI:

```bash
stripe listen --forward-to localhost:4242/api/stripe/webhook
```

Set the printed webhook signing secret as `STRIPE_WEBHOOK_SECRET`.

## JSON Storage

The server creates `data/settings.json` and `data/requests.json` automatically. Reads and writes go through `server/src/storage/jsonStore.js`, which initializes missing files and replaces malformed JSON with a fresh default after backing up the malformed file.

Demo data is inserted only when no provider settings or requests exist. Running `npm run seed` resets the demo provider and sample requests.

## Uploads

Customer photos are stored locally in `uploads/` and served from `/uploads/<filename>`. Uploads are limited to common image formats (`jpg`, `png`, `webp`, `gif`), up to 5 MB each, with up to 6 photos per request.

## Test the MVP Flow

1. Open `http://localhost:5173`.
2. Go to `Setup`, edit the provider page, and save.
3. Copy or open the public quote URL from setup or dashboard.
4. Submit a quote request with project details and optional photos.
5. Open `Dashboard` and view the new request.
6. Open the request detail page and update its status.
7. If Stripe keys are configured, submit a request with deposit payment and complete Checkout.
8. If Stripe keys are not configured, confirm the request is saved and marked unpaid.

## MVP Limitations

- Single provider page only.
- No authentication or multi-user teams.
- No external database or production-grade file locking.
- No custom domains, scheduling, CRM pipeline, SMS, or advanced analytics.
- Stripe payment status depends on webhook delivery.

## Suggested Next Steps

- Add lightweight provider authentication.
- Move persistence to a production database when ready.
- Add email notifications for new requests.
- Add request export and archive tools.
- Add branding customization for public quote pages.
