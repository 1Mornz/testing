'use client';

import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import DashboardGate from '@/components/dashboard/DashboardGate';

const emptyForm = {
  businessName: '',
  serviceCategory: '',
  serviceArea: '',
  contactEmail: '',
  contactPhone: '',
  depositAmount: 0,
  depositRequired: false,
  publicListingEnabled: true,
  quizEnabled: true,
  quizQuestions: [],
  businessDescription: '',
  slug: '',
};

export default function SetupPage() {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [origin, setOrigin] = useState('');
  const publicUrl = useMemo(() => form.slug && origin ? `${origin}/q/${form.slug}` : '', [form.slug, origin]);

  useEffect(() => {
    setOrigin(window.location.origin);
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

  function addQuestion() {
    setForm((current) => ({
      ...current,
      quizQuestions: [
        ...(current.quizQuestions || []),
        { id: `draft-${Date.now()}`, label: '', type: 'yesno', required: true, options: '', preferredAnswers: '', disqualifyingAnswers: '' },
      ],
    }));
  }

  function updateQuestion(index, field, value) {
    setForm((current) => ({
      ...current,
      quizQuestions: (current.quizQuestions || []).map((question, questionIndex) => questionIndex === index ? { ...question, [field]: value } : question),
    }));
  }

  function removeQuestion(index) {
    setForm((current) => ({
      ...current,
      quizQuestions: (current.quizQuestions || []).filter((_question, questionIndex) => questionIndex !== index),
    }));
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
    <DashboardGate>
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
          <label className="check-row"><input checked={Boolean(form.publicListingEnabled)} onChange={(e) => update('publicListingEnabled', e.target.checked)} type="checkbox" /> List this service publicly</label>
          <label className="check-row"><input checked={Boolean(form.quizEnabled)} onChange={(e) => update('quizEnabled', e.target.checked)} type="checkbox" /> Use qualification quiz</label>
          <label className="full">Business description<textarea value={form.businessDescription} onChange={(e) => update('businessDescription', e.target.value)} rows="5" /></label>
          <section className="quiz-builder full">
            <div className="section-row">
              <div>
                <h2>Qualification quiz</h2>
                <p className="muted">Ask up to 8 questions before a customer pays a deposit.</p>
              </div>
              <button className="button secondary" type="button" onClick={addQuestion}>Add question</button>
            </div>
            {(form.quizQuestions || []).map((question, index) => (
              <div className="quiz-builder-card" key={question.id || index}>
                <label className="full">Question<input value={question.label || ''} onChange={(e) => updateQuestion(index, 'label', e.target.value)} placeholder="Is the project in our service area?" /></label>
                <label>Type
                  <select value={question.type || 'short'} onChange={(e) => updateQuestion(index, 'type', e.target.value)}>
                    <option value="yesno">Yes / No</option>
                    <option value="multiple">Multiple choice</option>
                    <option value="short">Short answer</option>
                  </select>
                </label>
                <label className="check-row"><input checked={Boolean(question.required)} onChange={(e) => updateQuestion(index, 'required', e.target.checked)} type="checkbox" /> Required</label>
                {question.type === 'multiple' && <label className="full">Options, one per line<textarea value={Array.isArray(question.options) ? question.options.join('\n') : question.options || ''} onChange={(e) => updateQuestion(index, 'options', e.target.value)} rows="3" /></label>}
                <label>Preferred answers<textarea value={Array.isArray(question.preferredAnswers) ? question.preferredAnswers.join('\n') : question.preferredAnswers || ''} onChange={(e) => updateQuestion(index, 'preferredAnswers', e.target.value)} rows="3" placeholder="yes&#10;repair" /></label>
                <label>Disqualifying answers<textarea value={Array.isArray(question.disqualifyingAnswers) ? question.disqualifyingAnswers.join('\n') : question.disqualifyingAnswers || ''} onChange={(e) => updateQuestion(index, 'disqualifyingAnswers', e.target.value)} rows="3" placeholder="no&#10;inspection only" /></label>
                <button className="button secondary full" type="button" onClick={() => removeQuestion(index)}>Remove question</button>
              </div>
            ))}
          </section>
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
    </DashboardGate>
  );
}
