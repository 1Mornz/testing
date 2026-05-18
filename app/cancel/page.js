export default function CancelPage() {
  return (
    <section className="panel confirmation narrow">
      <p className="eyebrow">Checkout canceled</p>
      <h1>Your request was saved, but the deposit was not paid.</h1>
      <p>You can contact the provider directly or submit a new quote request when ready.</p>
      <a className="button primary" href="/">Back to QuoteGate</a>
    </section>
  );
}
