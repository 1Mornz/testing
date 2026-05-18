'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('provider@quotegate.test');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function login(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      window.localStorage.setItem('quotegateSession', JSON.stringify(data));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.error || 'Unable to log in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="login-screen">
      <div className="login-copy">
        <p className="eyebrow">Provider access</p>
        <h1>Manage every quote request from one focused workspace.</h1>
        <p>Log in with the JSON-backed test account to review requests, update statuses, and edit the public quote page.</p>
      </div>
      <form className="panel login-card" onSubmit={login}>
        <h2>Login</h2>
        <label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required /></label>
        <label>Password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required /></label>
        {error && <p className="error-text">{error}</p>}
        <button className="button primary" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login to dashboard'}</button>
        <p className="muted">Test account: provider@quotegate.test / password123</p>
      </form>
    </section>
  );
}
