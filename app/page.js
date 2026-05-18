const benefits = [
  ['Paid quote requests', 'Collect a small deposit before spending time on estimates for low-intent leads.'],
  ['Better intake', 'Ask for the job details, photos, budget, location, and timing you need upfront.'],
  ['Simple operations', 'Review requests, payment status, and pipeline stage from one quiet dashboard.'],
];

const steps = [
  ['1', 'Create your page', 'Add your services, service area, contact details, and deposit rules.'],
  ['2', 'Share one link', 'Send customers to a public quote page or print the QR code.'],
  ['3', 'Review better leads', 'Open the dashboard and move requests from new to booked.'],
];

export default function LandingPage() {
  return (
    <>
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <p className="eyebrow">QuoteGate for service providers</p>
          <h1>Stop giving free quotes to people who never book.</h1>
          <p className="subheadline">Launch a polished quote request page that collects job details, photos, and optional deposits before you spend time estimating.</p>
          <div className="actions">
            <a className="button primary" href="/login">Login to dashboard</a>
            <a className="button secondary light" href="/q/brightside-home-services">View demo quote page</a>
          </div>
          <div className="hero-proof">
            <span>JSON-backed MVP</span>
            <span>Stripe-ready deposits</span>
            <span>Photo uploads</span>
          </div>
        </div>
        <div className="hero-product-panel">
          <div className="panel-topline">
            <span>BrightSide Home Services</span>
            <strong>$35 deposit</strong>
          </div>
          <div className="lead-preview">
            <span className="badge badge-new">new</span>
            <h2>Drywall repair and paint touch-up</h2>
            <p>Two damaged areas in a hallway after moving furniture. Photos attached.</p>
            <div className="lead-preview-meta">
              <span>Ferndale, MI</span>
              <span>$250 - $500</span>
            </div>
          </div>
          <div className="mini-metrics">
            <div><strong>18</strong><span>Requests</span></div>
            <div><strong>11</strong><span>Qualified</span></div>
            <div><strong>6</strong><span>Paid</span></div>
          </div>
        </div>
      </section>

      <section className="section-heading">
        <p className="eyebrow">Why it works</p>
        <h2>Create a paid quote request page in minutes.</h2>
      </section>
      <section className="benefits polished">
        {benefits.map(([title, copy]) => (
          <article className="card feature-card" key={title}>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section className="steps-band">
        {steps.map(([number, title, copy]) => (
          <article className="step-card" key={title}>
            <span>{number}</span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>
    </>
  );
}
