const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4242/api';
export const SERVER_URL = API_URL.replace(/\/api\/?$/, '');

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || 'Request failed');
    error.details = data.details;
    throw error;
  }
  return data;
}

export async function api(path, options = {}) {
  const headers = options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' };
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  return parseResponse(response);
}

export function uploadQuoteRequest(slug, formData) {
  return api(`/public/${slug}/requests`, {
    method: 'POST',
    body: formData,
  });
}
