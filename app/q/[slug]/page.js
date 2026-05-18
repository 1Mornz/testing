'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

const emptyForm = {
  customerName: '',
  phone: '',
  email: '',
  serviceNeeded: '',
  location: '',
  description: '',
  timeframe: '',
  budgetRange: '',
};

export default function PublicQuotePage() {
  const params = useParams();
  const [provider, setProvider] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorText, setErrorText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [checkoutBlocked, setCheckoutBlocked] = useState(false);
  const [files, setFiles] = useState([]);
  const [payDeposit, setPayDeposit] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [quizAnswers, setQuizAnswers] = useState({});
  const canChooseDeposit = useMemo(() => Number(provider?.depositAmount || 0) > 0 && !provider?.depositRequired, [provider]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/public/${params.slug}`).then((res) => res.json()),
      fetch('/api/payments/config').then((res) => res.json()),
    ]).then(([providerData, paymentData]) => {
      if (providerData.error) {
        setError(providerData.error);
        return;
      }
      setProvider(providerData.settings);
      setPaymentMessage(paymentData.message || '');
      setPayDeposit(Boolean(providerData.settings.depositRequired));
    }).finally(() => setLoading(false));
  }, [params.slug]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setErrorText('');
    setCheckoutBlocked(false);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      body.append('quizAnswers', JSON.stringify((provider.quizQuestions || []).map((question) => ({
        questionId: question.id,
        questionLabel: question.label,
        answer: quizAnswers[question.id] || '',
      }))));
      files.forEach((file) => body.append('photos', file));
      const response = await fetch(`/api/public/${params.slug}/requests`, { method: 'POST', body });
      const data = await response.json();
      if (!response.ok) throw data;

      const shouldPay = provider.depositRequired || payDeposit;
      if (shouldPay && data.request.deposit.enabled) {
        const checkoutResponse = await fetch(`/api/requests/${data.request.id}/checkout`, { method: 'POST' });
        const checkout = await checkoutResponse.json();
        if (checkoutResponse.ok) {
          window.location.href = checkout.url;
          return;
        }
        setCheckoutBlocked(true);
      }
      setSubmitted(true);
    } catch (err) {
      setErrorText(err.details ? Object.values(err.details).join(', ') : err.error || 'Unable to submit request');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <section className="panel empty">Loading quote page...</section>;
  if (error) return <section className="panel not-found"><h1>Quote page not found</h1><p>{error}</p></section>;

  return (
    <div className="public-layout">
      <aside className="panel public-card">
        <p className="eyebrow">{provider.serviceCategory}</p>
        <h1>{provider.businessName}</h1>
        <p>{provider.businessDescription}</p>
        <dl className="details compact">
          <dt>Service area</dt><dd>{provider.serviceArea}</dd>
          <dt>Email</dt><dd>{provider.contactEmail}</dd>
          <dt>Phone</dt><dd>{provider.contactPhone}</dd>
        </dl>
        {provider.depositAmount > 0 && <p className="deposit-note">Quote deposit: ${provider.depositAmount} {provider.depositRequired ? 'required' : 'optional'}</p>}
        {paymentMessage && <p className="warning">{paymentMessage}</p>}
      </aside>
      {!submitted ? (
        <form className="panel form-grid" onSubmit={submit}>
          <h2 className="full">Request a quote</h2>
          {provider.quizEnabled && provider.quizQuestions?.length ? (
            <section className="qualification-section full">
              <p className="eyebrow">Qualification quiz</p>
              <h2>Help {provider.businessName} confirm fit.</h2>
              <p className="muted">Your answers help the provider prioritize qualified projects before deposit payment.</p>
              {provider.quizQuestions.map((question) => (
                <label className="full" key={question.id}>{question.label}
                  {question.type === 'yesno' ? (
                    <select required={question.required} value={quizAnswers[question.id] || ''} onChange={(e) => setQuizAnswers((current) => ({ ...current, [question.id]: e.target.value }))}>
                      <option value="">Choose an answer</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  ) : null}
                  {question.type === 'multiple' ? (
                    <select required={question.required} value={quizAnswers[question.id] || ''} onChange={(e) => setQuizAnswers((current) => ({ ...current, [question.id]: e.target.value }))}>
                      <option value="">Choose an answer</option>
                      {(question.options || []).map((option) => <option value={option} key={option}>{option}</option>)}
                    </select>
                  ) : null}
                  {question.type === 'short' ? (
                    <input required={question.required} value={quizAnswers[question.id] || ''} onChange={(e) => setQuizAnswers((current) => ({ ...current, [question.id]: e.target.value }))} />
                  ) : null}
                </label>
              ))}
            </section>
          ) : null}
          <label>Name<input value={form.customerName} onChange={(e) => update('customerName', e.target.value)} required /></label>
          <label>Phone<input value={form.phone} onChange={(e) => update('phone', e.target.value)} required /></label>
          <label>Email<input value={form.email} onChange={(e) => update('email', e.target.value)} type="email" required /></label>
          <label>Service needed<input value={form.serviceNeeded} onChange={(e) => update('serviceNeeded', e.target.value)} required /></label>
          <label>Location<input value={form.location} onChange={(e) => update('location', e.target.value)} required /></label>
          <label>Preferred timeframe<input value={form.timeframe} onChange={(e) => update('timeframe', e.target.value)} /></label>
          <label>Budget range<input value={form.budgetRange} onChange={(e) => update('budgetRange', e.target.value)} placeholder="$500 - $1,000" /></label>
          <label>Photos<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} /></label>
          <label className="full">Project description<textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows="6" required /></label>
          {canChooseDeposit && <label className="check-row full"><input checked={payDeposit} onChange={(e) => setPayDeposit(e.target.checked)} type="checkbox" /> Pay the ${provider.depositAmount} quote deposit after submitting</label>}
          {errorText && <p className="error-text full">{errorText}</p>}
          <button className="button primary full" type="submit" disabled={submitting}>{submitting ? 'Submitting...' : (provider.depositRequired || payDeposit ? 'Submit and pay deposit' : 'Submit quote request')}</button>
        </form>
      ) : (
        <section className="panel confirmation">
          <h2>Request received</h2>
          <p>Your quote request was submitted to {provider.businessName}.</p>
          {checkoutBlocked && <p className="warning">Payment is not configured for this demo, so the request is saved as unpaid.</p>}
          <a className="button secondary" href="/">Back to QuoteGate</a>
        </section>
      )}
    </div>
  );
}
