import { nanoid } from 'nanoid';
import { readJson, writeJson } from '../storage/jsonStore.js';

const statuses = new Set(['new', 'reviewing', 'quoted', 'booked', 'rejected']);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateQuoteRequest(input) {
  const errors = {};
  const required = ['customerName', 'phone', 'email', 'serviceNeeded', 'location', 'description'];

  for (const field of required) {
    if (!String(input[field] || '').trim()) errors[field] = 'Required';
  }

  if (input.email && !emailRegex.test(input.email)) {
    errors.email = 'Enter a valid email address';
  }

  return errors;
}

export async function listRequests() {
  const requests = await readJson('requests.json');
  return [...requests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getRequest(id) {
  const requests = await readJson('requests.json');
  return requests.find((request) => request.id === id) || null;
}

export async function createRequest(input, provider, files = []) {
  const errors = validateQuoteRequest(input);
  if (Object.keys(errors).length) {
    const error = new Error('Quote request is invalid');
    error.status = 400;
    error.details = errors;
    throw error;
  }

  const now = new Date().toISOString();
  const depositAmount = Number(provider?.depositAmount || 0);
  const depositsEnabled = depositAmount > 0;
  const request = {
    id: nanoid(14),
    providerSlug: provider.slug,
    customerName: input.customerName.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    serviceNeeded: input.serviceNeeded.trim(),
    location: input.location.trim(),
    description: input.description.trim(),
    timeframe: String(input.timeframe || '').trim(),
    budgetRange: String(input.budgetRange || '').trim(),
    status: 'new',
    deposit: {
      enabled: depositsEnabled,
      required: Boolean(provider.depositRequired && depositsEnabled),
      amount: depositsEnabled ? depositAmount : 0,
      status: depositsEnabled ? 'unpaid' : 'not_required',
      stripeCheckoutSessionId: null,
      stripePaymentIntentId: null,
      paidAt: null,
    },
    photos: files.map((file) => ({
      id: nanoid(10),
      originalName: file.originalname,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
    })),
    createdAt: now,
    updatedAt: now,
  };

  const requests = await readJson('requests.json');
  requests.push(request);
  await writeJson('requests.json', requests);
  return request;
}

export async function updateRequestStatus(id, status) {
  if (!statuses.has(status)) {
    const error = new Error('Invalid request status');
    error.status = 400;
    throw error;
  }

  const requests = await readJson('requests.json');
  const index = requests.findIndex((request) => request.id === id);
  if (index === -1) return null;

  requests[index] = {
    ...requests[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  await writeJson('requests.json', requests);
  return requests[index];
}

export async function markRequestPaid(id, stripeData = {}) {
  const requests = await readJson('requests.json');
  const index = requests.findIndex((request) => request.id === id);
  if (index === -1) return null;

  requests[index] = {
    ...requests[index],
    deposit: {
      ...requests[index].deposit,
      status: 'paid',
      stripeCheckoutSessionId: stripeData.sessionId || requests[index].deposit.stripeCheckoutSessionId,
      stripePaymentIntentId: stripeData.paymentIntentId || requests[index].deposit.stripePaymentIntentId,
      paidAt: new Date().toISOString(),
    },
    updatedAt: new Date().toISOString(),
  };

  await writeJson('requests.json', requests);
  return requests[index];
}

export async function attachCheckoutSession(id, sessionId) {
  const requests = await readJson('requests.json');
  const index = requests.findIndex((request) => request.id === id);
  if (index === -1) return null;

  requests[index] = {
    ...requests[index],
    deposit: {
      ...requests[index].deposit,
      stripeCheckoutSessionId: sessionId,
    },
    updatedAt: new Date().toISOString(),
  };

  await writeJson('requests.json', requests);
  return requests[index];
}
