'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import StatusBadge from '@/components/StatusBadge';
import DashboardGate from '@/components/dashboard/DashboardGate';

export default function RequestDetailPage() {
  const params = useParams();
  const [request, setRequest] = useState(null);
  const [status, setStatus] = useState('new');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/requests/${params.id}`).then((res) => res.json()).then((data) => {
      if (data.error) {
        setError(data.error);
        return;
      }
      setRequest(data.request);
      setStatus(data.request.status);
    });
  }, [params.id]);

  async function saveStatus(nextStatus) {
    setStatus(nextStatus);
    const response = await fetch(`/api/requests/${request.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    const data = await response.json();
    if (response.ok) setRequest(data.request);
  }

  if (error) return <DashboardGate><section className="panel error-text">{error}</section></DashboardGate>;
  if (!request) return <DashboardGate><section className="panel empty">Loading request...</section></DashboardGate>;

  return (
    <DashboardGate>
      <section className="page-heading">
        <div>
          <p className="eyebrow">Request detail</p>
          <h1>{request.customerName}</h1>
          <p>{request.serviceNeeded} in {request.location}</p>
        </div>
        <a className="button secondary" href="/dashboard">Back to dashboard</a>
      </section>
      <div className="detail-grid">
        <article className="panel">
          <div className="detail-head">
            <StatusBadge value={request.status} />
            <select value={status} onChange={(event) => saveStatus(event.target.value)}>
              <option value="new">new</option>
              <option value="reviewing">reviewing</option>
              <option value="quoted">quoted</option>
              <option value="booked">booked</option>
              <option value="rejected">rejected</option>
            </select>
          </div>
          <dl className="details">
            <dt>Customer</dt><dd>{request.customerName}</dd>
            <dt>Email</dt><dd><a href={`mailto:${request.email}`}>{request.email}</a></dd>
            <dt>Phone</dt><dd>{request.phone}</dd>
            <dt>Location</dt><dd>{request.location}</dd>
            <dt>Timeframe</dt><dd>{request.timeframe || 'Not specified'}</dd>
            <dt>Budget</dt><dd>{request.budgetRange || 'Not specified'}</dd>
            <dt>Created</dt><dd>{new Date(request.createdAt).toLocaleString()}</dd>
          </dl>
          <h2>Project description</h2>
          <p className="preline">{request.description}</p>
        </article>
        <aside className="panel">
          <h2>Deposit</h2>
          <p className="deposit-amount">{request.deposit.amount ? `$${request.deposit.amount}` : 'No deposit'}</p>
          <p>Status: <strong>{request.deposit.status}</strong></p>
          {request.deposit.stripeCheckoutSessionId && <p className="muted">Checkout: {request.deposit.stripeCheckoutSessionId}</p>}
          {request.deposit.stripePaymentIntentId && <p className="muted">Payment: {request.deposit.stripePaymentIntentId}</p>}
        </aside>
        <article className="panel full-width">
          <h2>Photos</h2>
          {request.photos.length ? (
            <div className="photo-grid">
              {request.photos.map((photo) => (
                <a href={photo.url} key={photo.id} target="_blank" rel="noreferrer">
                  <img src={photo.url} alt={photo.originalName} />
                </a>
              ))}
            </div>
          ) : <p className="empty">No photos were uploaded.</p>}
        </article>
      </div>
    </DashboardGate>
  );
}
