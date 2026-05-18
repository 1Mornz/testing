'use client';

import { useEffect, useMemo, useState } from 'react';
import StatusBadge from '@/components/StatusBadge';
import DashboardGate from '@/components/dashboard/DashboardGate';

function paymentLabel(request) {
  if (request.deposit.status === 'paid') return 'paid';
  if (request.deposit.status === 'not_required') return 'no deposit';
  return request.deposit.required ? 'required unpaid' : 'unpaid';
}

export default function DashboardPage() {
  const [requests, setRequests] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState('');
  const publicUrl = useMemo(() => settings && origin ? `${origin}/q/${settings.slug}` : '', [settings, origin]);

  useEffect(() => {
    setOrigin(window.location.origin);
    Promise.all([fetch('/api/requests').then((res) => res.json()), fetch('/api/provider').then((res) => res.json())])
      .then(([requestData, providerData]) => {
        setRequests(requestData.requests || []);
        setSettings(providerData.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const paidCount = requests.filter((request) => request.deposit.status === 'paid').length;
  const unpaidCount = requests.filter((request) => request.deposit.status === 'unpaid').length;
  const newCount = requests.filter((request) => request.status === 'new').length;

  return (
    <DashboardGate>
      <section className="page-heading">
        <div>
          <p className="eyebrow">Provider dashboard</p>
          <h1>Quote requests</h1>
          <p>Review submitted requests and track quote status.</p>
        </div>
        <a className="button primary" href="/setup">Edit page</a>
      </section>
      {settings && (
        <section className="panel dashboard-share">
          <div>
            <h2>{settings.businessName}</h2>
            <p className="muted">{publicUrl}</p>
          </div>
          <a className="button secondary" href={`/q/${settings.slug}`}>Open public page</a>
        </section>
      )}
      <section className="metric-grid">
        <article className="metric-card"><span>Total requests</span><strong>{requests.length}</strong></article>
        <article className="metric-card"><span>New leads</span><strong>{newCount}</strong></article>
        <article className="metric-card"><span>Paid deposits</span><strong>{paidCount}</strong></article>
        <article className="metric-card"><span>Unpaid deposits</span><strong>{unpaidCount}</strong></article>
      </section>
      <section className="panel">
        {loading ? <div className="empty">Loading requests...</div> : null}
        {!loading && !requests.length ? <div className="empty">No quote requests yet. Share your public page to start collecting leads.</div> : null}
        {!loading && requests.length ? (
          <div className="request-list">
            {requests.map((request) => (
              <a className="request-row" href={`/dashboard/requests/${request.id}`} key={request.id}>
                <div>
                  <strong>{request.customerName}</strong>
                  <p>{request.serviceNeeded} - {request.location}</p>
                </div>
                <div className="row-meta">
                  <StatusBadge value={request.status} />
                  <span className={`payment-pill ${request.deposit.status}`}>{paymentLabel(request)}</span>
                  <time>{new Date(request.createdAt).toLocaleDateString()}</time>
                </div>
              </a>
            ))}
          </div>
        ) : null}
      </section>
    </DashboardGate>
  );
}
