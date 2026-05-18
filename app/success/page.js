export default function SuccessPage() {
  return (
    <section className="panel confirmation narrow">
      <p className="eyebrow">Payment submitted</p>
      <h1>Thanks. Your quote request is in.</h1>
      <p>The provider will see your request and payment status in their dashboard once Stripe confirms the checkout session.</p>
      <a className="button primary" href="/">Done</a>
    </section>
  );
}
