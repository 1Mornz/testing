import { nanoid } from 'nanoid';
import { readJson, writeJson } from './jsonStore.js';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeQuizQuestion(question, index) {
  const type = ['short', 'yesno', 'multiple'].includes(question.type) ? question.type : 'short';
  const optionsSource = Array.isArray(question.options) ? question.options : String(question.options || '').split('\n');
  const preferredSource = Array.isArray(question.preferredAnswers) ? question.preferredAnswers : String(question.preferredAnswers || '').split('\n');
  const disqualifyingSource = Array.isArray(question.disqualifyingAnswers) ? question.disqualifyingAnswers : String(question.disqualifyingAnswers || '').split('\n');
  const options = optionsSource
    .map((option) => option.trim())
    .filter(Boolean);
  const preferredAnswers = preferredSource
    .map((answer) => answer.trim().toLowerCase())
    .filter(Boolean);
  const disqualifyingAnswers = disqualifyingSource
    .map((answer) => answer.trim().toLowerCase())
    .filter(Boolean);

  return {
    id: question.id || nanoid(10),
    label: String(question.label || '').trim(),
    type,
    required: Boolean(question.required),
    options: type === 'multiple' ? options : [],
    preferredAnswers,
    disqualifyingAnswers,
    sortOrder: Number(question.sortOrder ?? index),
  };
}

export function validateProvider(input) {
  const errors = {};
  for (const field of ['businessName', 'serviceCategory', 'serviceArea', 'contactEmail', 'contactPhone', 'slug']) {
    if (!String(input[field] || '').trim()) errors[field] = 'Required';
  }
  if (input.contactEmail && !emailRegex.test(input.contactEmail)) errors.contactEmail = 'Enter a valid email address';
  if (input.slug && !slugRegex.test(input.slug)) errors.slug = 'Use lowercase letters, numbers, and hyphens only';
  const amount = Number(input.depositAmount || 0);
  if (Number.isNaN(amount) || amount < 0 || amount > 10000) errors.depositAmount = 'Enter a deposit between 0 and 10000';

  const quiz = Array.isArray(input.quizQuestions) ? input.quizQuestions : [];
  if (quiz.length > 8) errors.quizQuestions = 'Use up to 8 qualification questions';
  quiz.forEach((question, index) => {
    const options = Array.isArray(question.options) ? question.options.join('\n') : String(question.options || '');
    if (question.label && question.type === 'multiple' && !options.trim()) {
      errors[`quiz-${index}`] = 'Multiple choice questions need options';
    }
  });

  return errors;
}

async function migrateLegacyProvider() {
  const providers = await readJson('providers.json');
  if (providers.length) return providers;

  const settings = await readJson('settings.json');
  if (!settings) return providers;

  const migrated = [{
    ...settings,
    publicListingEnabled: settings.publicListingEnabled ?? true,
    quizEnabled: settings.quizEnabled ?? true,
    quizQuestions: settings.quizQuestions || [],
  }];
  await writeJson('providers.json', migrated);
  return migrated;
}

export async function listProviders() {
  return migrateLegacyProvider();
}

export async function listPublicProviders(query = '') {
  const providers = await listProviders();
  const term = query.trim().toLowerCase();
  return providers
    .filter((provider) => provider.publicListingEnabled)
    .filter((provider) => {
      if (!term) return true;
      return [
        provider.businessName,
        provider.serviceCategory,
        provider.serviceArea,
        provider.businessDescription,
      ].some((value) => String(value || '').toLowerCase().includes(term));
    })
    .sort((a, b) => a.businessName.localeCompare(b.businessName));
}

export async function getProviderSettings() {
  const providers = await listProviders();
  return providers[0] || null;
}

export async function getProviderBySlug(slug) {
  const providers = await listProviders();
  return providers.find((provider) => provider.slug === slug) || null;
}

export async function saveProviderSettings(input) {
  const errors = validateProvider(input);
  if (Object.keys(errors).length) {
    const error = new Error('Provider settings are invalid');
    error.status = 400;
    error.details = errors;
    throw error;
  }

  const providers = await listProviders();
  const existingIndex = providers.findIndex((provider) => provider.id === input.id || provider.slug === input.slug);
  const existing = existingIndex >= 0 ? providers[existingIndex] : null;
  const now = new Date().toISOString();
  const quizQuestions = (Array.isArray(input.quizQuestions) ? input.quizQuestions : [])
    .map(normalizeQuizQuestion)
    .filter((question) => question.label);

  const provider = {
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
    publicListingEnabled: Boolean(input.publicListingEnabled),
    quizEnabled: Boolean(input.quizEnabled),
    quizQuestions,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    demo: false,
  };

  if (existingIndex >= 0) providers[existingIndex] = provider;
  else providers.push(provider);

  await writeJson('providers.json', providers);
  await writeJson('settings.json', provider);
  return provider;
}
