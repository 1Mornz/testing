const benefits = [
  ['Filter unserious leads', 'Ask for the right details and optionally collect a small deposit before estimating.'],
  ['Collect better job details', 'Customers submit service needs, budget, timing, location, and project notes in one place.'],
  ['Request photos upfront', 'Photo uploads help providers estimate faster and reduce back-and-forth.'],
  ['Require quote deposits', 'Use Stripe Checkout for small quote deposits when payment keys are configured.'],
  ['Share one simple link', 'Use the public quote page URL or QR code on cards, trucks, and social profiles.'],
  ['Manage requests', 'Review new, quoted, booked, and rejected requests from a focused dashboard.'],
];

export default function LandingPage() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Paid quote request pages for service providers</p>
          <h1>Stop giving free quotes to people who never book.</h1>
          <p className="subheadline">QuoteGate helps service providers collect job details, photos, and optional quote deposits before spending time on estimates.</p>
          <div className="actions">
            <a className="button primary" href="/setup">Create your quote page</a>
            <a className="button secondary" href="/q/brightside-home-services">View demo quote page</a>
          </div>
        </div>
      </section>
      <section className="benefits">
        {benefits.map(([title, copy]) => (
          <article className="card" key={title}>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>
    </>
  );
}
