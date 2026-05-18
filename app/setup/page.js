'use client';

import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';

const emptyForm = {
  businessName: '',
  serviceCategory: '',
  serviceArea: '',
  contactEmail: '',
  contactPhone: '',
  depositAmount: 0,
  depositRequired: false,
  businessDescription: '',
  slug: '',
};

export default function SetupPage() {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState('');
  const publicUrl = useMemo(() => form.slug ? `${window.location.origin}/q/${form.slug}` : '', [form.slug]);

  useEffect(() => {
    fetch('/api/provider').then((res) => res.json()).then(({ settings }) => {
      if (settings) setForm(settings);
    });
  }, []);

  useEffect(() => {
    if (!publicUrl) {
      setQrCode('');
      return;
    }
    QRCode.toDataURL(publicUrl, { margin: 1, width: 220 }).then(setQrCode);
  }, [publicUrl]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/provider', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      setForm(data.settings);
      setMessage('Quote page saved.');
    } catch (err) {
      setError(err.details ? Object.values(err.details).join(', ') : err.error || 'Unable to save settings');
    } finally {
      setSaving(false);
    }
  }

  async function copyUrl() {
    await navigator.clipboard.writeText(publicUrl);
    setMessage('Public URL copied.');
  }

  return (
    <>
      <section className="page-heading">
        <div>
          <p className="eyebrow">Provider setup</p>
          <h1>Create your quote page</h1>
          <p>Configure the public page customers use to request quotes.</p>
        </div>
      </section>
      <div className="split">
        <form className="panel form-grid" onSubmit={save}>
          <label>Business name<input value={form.businessName} onChange={(e) => update('businessName', e.target.value)} required /></label>
          <label>Service category<input value={form.serviceCategory} onChange={(e) => update('serviceCategory', e.target.value)} required /></label>
          <label>Service area<input value={form.serviceArea} onChange={(e) => update('serviceArea', e.target.value)} required /></label>
          <label>Contact email<input value={form.contactEmail} onChange={(e) => update('contactEmail', e.target.value)} type="email" required /></label>
          <label>Contact phone<input value={form.contactPhone} onChange={(e) => update('contactPhone', e.target.value)} required /></label>
          <label>Quote page slug<input value={form.slug} onChange={(e) => update('slug', e.target.value)} required placeholder="brightside-home-services" /></label>
          <label>Deposit amount<input value={form.depositAmount} onChange={(e) => update('depositAmount', Number(e.target.value))} type="number" min="0" step="1" /></label>
          <label className="check-row"><input checked={form.depositRequired} onChange={(e) => update('depositRequired', e.target.checked)} type="checkbox" /> Require deposit before estimating</label>
          <label className="full">Business description<textarea value={form.businessDescription} onChange={(e) => update('businessDescription', e.target.value)} rows="5" /></label>
          <div className="form-actions full">
            <button className="button primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save quote page'}</button>
            {message && <p className="success-text">{message}</p>}
            {error && <p className="error-text">{error}</p>}
          </div>
        </form>
        <aside className="panel">
          <h2>Share page</h2>
          {publicUrl ? <p className="muted">Send this URL to customers or print the QR code.</p> : null}
          {publicUrl ? <div className="share-box"><input value={publicUrl} readOnly /><button className="button secondary" onClick={copyUrl}>Copy</button></div> : null}
          {qrCode ? <img className="qr" src={qrCode} alt="Public quote page QR code" /> : <p className="empty">Save a page to generate a public URL and QR code.</p>}
          {qrCode ? <a className="button secondary" href={qrCode} download="quotegate-qr.png">Download QR</a> : null}
        </aside>
      </div>
    </>
  );
}
