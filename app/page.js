import Counter from "./counter";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="counter-panel" aria-labelledby="counter-title">
        <p className="eyebrow">Simple Next.js App</p>
        <h1 id="counter-title">Counter</h1>
        <Counter />
      </section>
    </main>
  );
}
