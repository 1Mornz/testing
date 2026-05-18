'use client';

import { useEffect, useMemo, useState } from 'react';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/services?q=${encodeURIComponent(query)}`)
        .then((response) => response.json())
        .then((data) => setServices(data.services || []))
        .finally(() => setLoading(false));
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);

  const serviceAreas = useMemo(() => Array.from(new Set(services.map((service) => service.serviceArea))).slice(0, 5), [services]);

  return (
    <>
      <section className="directory-hero">
        <div>
          <p className="eyebrow">Service marketplace</p>
          <h1>Find quote-ready local service providers.</h1>
          <p>Search public QuoteGate pages, compare deposit requirements, and go directly to a provider’s quote request form.</p>
        </div>
        <div className="directory-search">
          <label>Search services, areas, or businesses<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="handyman, roofing, Detroit..." /></label>
          <div className="quick-filters">
            {serviceAreas.map((area) => <button key={area} onClick={() => setQuery(area)}>{area}</button>)}
          </div>
        </div>
      </section>

      <section className="service-grid">
        {loading ? <div className="panel empty full-width">Searching services...</div> : null}
        {!loading && !services.length ? <div className="panel empty full-width">No public services match that search yet.</div> : null}
        {!loading && services.map((service) => (
          <article className="service-card" key={service.id}>
            <div>
              <p className="eyebrow">{service.serviceCategory}</p>
              <h2>{service.businessName}</h2>
              <p>{service.businessDescription}</p>
            </div>
            <dl className="details compact">
              <dt>Area</dt><dd>{service.serviceArea}</dd>
              <dt>Deposit</dt><dd>{service.depositAmount > 0 ? `$${service.depositAmount}${service.depositRequired ? ' required' : ' optional'}` : 'No deposit'}</dd>
              <dt>Quiz</dt><dd>{service.quizEnabled ? `${service.quizQuestions?.length || 0} questions` : 'Not required'}</dd>
            </dl>
            <a className="button primary" href={`/q/${service.slug}`}>Request quote</a>
          </article>
        ))}
      </section>
    </>
  );
}
