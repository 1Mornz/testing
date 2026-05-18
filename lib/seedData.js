import { readJson, writeJson } from './jsonStore';

const demoProvider = {
  id: 'demo-provider',
  businessName: 'BrightSide Home Services',
  serviceCategory: 'Home repair and handyman',
  serviceArea: 'Detroit metro area',
  contactEmail: 'hello@brightside.example',
  contactPhone: '(313) 555-0184',
  depositAmount: 35,
  depositRequired: false,
  businessDescription: 'Fast, practical repair estimates for small home projects, punch lists, and maintenance jobs.',
  slug: 'brightside-home-services',
  createdAt: '2026-05-18T12:00:00.000Z',
  updatedAt: '2026-05-18T12:00:00.000Z',
  demo: true,
};

const demoRequests = [
  {
    id: 'demo-request-1',
    providerSlug: demoProvider.slug,
    customerName: 'Maya Thompson',
    phone: '(313) 555-0142',
    email: 'maya@example.com',
    serviceNeeded: 'Drywall repair and paint touch-up',
    location: 'Ferndale, MI',
    description: 'Two damaged drywall areas in a hallway after moving furniture. Looking for a clean patch and paint match.',
    timeframe: 'This month',
    budgetRange: '$250 - $500',
    status: 'reviewing',
    deposit: {
      enabled: true,
      required: false,
      amount: 35,
      status: 'paid',
      stripeCheckoutSessionId: 'demo_checkout_session',
      stripePaymentIntentId: 'demo_payment_intent',
      paidAt: '2026-05-18T12:20:00.000Z',
    },
    photos: [],
    createdAt: '2026-05-18T12:10:00.000Z',
    updatedAt: '2026-05-18T12:20:00.000Z',
  },
  {
    id: 'demo-request-2',
    providerSlug: demoProvider.slug,
    customerName: 'Andre Wilson',
    phone: '(248) 555-0177',
    email: 'andre@example.com',
    serviceNeeded: 'Kitchen faucet replacement',
    location: 'Royal Oak, MI',
    description: 'Need an old faucet replaced. I already bought the new fixture and want a quote for labor.',
    timeframe: 'Next week',
    budgetRange: '$100 - $250',
    status: 'new',
    deposit: {
      enabled: true,
      required: false,
      amount: 35,
      status: 'unpaid',
      stripeCheckoutSessionId: null,
      stripePaymentIntentId: null,
      paidAt: null,
    },
    photos: [],
    createdAt: '2026-05-18T13:05:00.000Z',
    updatedAt: '2026-05-18T13:05:00.000Z',
  },
];

export async function seedDemoData({ force = false } = {}) {
  const provider = await readJson('settings.json');
  const requests = await readJson('requests.json');
  if (force || !provider) await writeJson('settings.json', demoProvider);
  if (force || (!requests.length && (!provider || provider.demo))) await writeJson('requests.json', demoRequests);
}
