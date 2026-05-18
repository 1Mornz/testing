'use client';

import { useEffect, useState } from 'react';

export default function DashboardGate({ children }) {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem('quotegateSession');
    setSession(raw ? JSON.parse(raw) : null);
    setReady(true);
  }, []);

  function logout() {
    window.localStorage.removeItem('quotegateSession');
    window.location.href = '/login';
  }

  if (!ready) return <section className="panel empty">Checking dashboard access...</section>;

  if (!session) {
    return (
      <section className="auth-required">
        <div className="panel auth-card">
          <p className="eyebrow">Provider dashboard</p>
          <h1>Log in to manage quote requests.</h1>
          <p className="muted">Use the test provider account stored in local JSON to access setup, requests, and payment status.</p>
          <a className="button primary" href="/login">Log in</a>
        </div>
      </section>
    );
  }

  return (
    <div className="dashboard-app">
      <aside className="dashboard-sidebar">
        <a className="dashboard-logo" href="/dashboard">QuoteGate</a>
        <nav>
          <a href="/dashboard">Requests</a>
          <a href="/services">Service directory</a>
          <a href="/setup">Quote page</a>
          <a href="/q/brightside-home-services">Public demo</a>
        </nav>
        <div className="dashboard-user">
          <span>{session.user.name}</span>
          <small>{session.user.email}</small>
          <button className="button secondary" onClick={logout}>Logout</button>
        </div>
      </aside>
      <div className="dashboard-main">{children}</div>
    </div>
  );
}
