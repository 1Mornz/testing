import { getProviderBySlug } from '../services/providerService.js';
import { createRequest, getRequest, listRequests, updateRequestStatus } from '../services/requestService.js';

export async function createQuoteRequest(req, res) {
  const provider = await getProviderBySlug(req.params.slug);
  if (!provider) {
    res.status(404).json({ error: 'Quote page not found' });
    return;
  }

  const request = await createRequest(req.body, provider, req.files || []);
  res.status(201).json({ request });
}

export async function fetchRequests(_req, res) {
  const requests = await listRequests();
  res.json({ requests });
}

export async function fetchRequest(req, res) {
  const request = await getRequest(req.params.id);
  if (!request) {
    res.status(404).json({ error: 'Quote request not found' });
    return;
  }
  res.json({ request });
}

export async function patchRequestStatus(req, res) {
  const request = await updateRequestStatus(req.params.id, req.body.status);
  if (!request) {
    res.status(404).json({ error: 'Quote request not found' });
    return;
  }
  res.json({ request });
}
