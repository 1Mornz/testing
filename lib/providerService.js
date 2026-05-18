import { nanoid } from 'nanoid';
import { readJson, writeJson } from './jsonStore.js';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateProvider(input) {
  const errors = {};
  for (const field of ['businessName', 'serviceCategory', 'serviceArea', 'contactEmail', 'contactPhone', 'slug']) {
    if (!String(input[field] || '').trim()) errors[field] = 'Required';
  }
  if (input.contactEmail && !emailRegex.test(input.contactEmail)) errors.contactEmail = 'Enter a valid email address';
  if (input.slug && !slugRegex.test(input.slug)) errors.slug = 'Use lowercase letters, numbers, and hyphens only';
  const amount = Number(input.depositAmount || 0);
  if (Number.isNaN(amount) || amount < 0 || amount > 10000) errors.depositAmount = 'Enter a deposit between 0 and 10000';
  return errors;
}

export async function getProviderSettings() {
  return readJson('settings.json');
}

export async function getProviderBySlug(slug) {
  const settings = await getProviderSettings();
  if (!settings || settings.slug !== slug) return null;
  return settings;
}

export async function saveProviderSettings(input) {
  const errors = validateProvider(input);
  if (Object.keys(errors).length) {
    const error = new Error('Provider settings are invalid');
    error.status = 400;
    error.details = errors;
    throw error;
  }

  const existing = await getProviderSettings();
  const now = new Date().toISOString();
  return writeJson('settings.json', {
    id: existing?.id || nanoid(12),
    businessName: input.businessName.trim(),
    serviceCategory: input.serviceCategory.trim(),
    serviceArea: input.serviceArea.trim(),
    contactEmail: input.contactEmail.trim(),
    contactPhone: input.contactPhone.trim(),
    depositAmount: Number(input.depositAmount || 0),
    depositRequired: Boolean(input.depositRequired),
    businessDescription: String(input.businessDescription || '').trim(),
    slug: input.slug.trim().toLowerCase(),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    demo: false,
  });
}
