import { getProviderBySlug, getProviderSettings, saveProviderSettings } from '../services/providerService.js';

export async function fetchProvider(_req, res) {
  const settings = await getProviderSettings();
  res.json({ settings });
}

export async function upsertProvider(req, res) {
  const settings = await saveProviderSettings(req.body);
  res.json({ settings });
}

export async function fetchPublicProvider(req, res) {
  const settings = await getProviderBySlug(req.params.slug);
  if (!settings) {
    res.status(404).json({ error: 'Quote page not found' });
    return;
  }
  res.json({ settings });
}
