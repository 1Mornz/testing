<template>
  <section class="hero">
    <div class="hero-copy">
      <p class="eyebrow">Paid quote request pages for service providers</p>
      <h1>Stop giving free quotes to people who never book.</h1>
      <p class="subheadline">QuoteGate helps service providers collect job details, photos, and optional quote deposits before spending time on estimates.</p>
      <div class="actions">
        <RouterLink class="button primary" to="/setup">Create your quote page</RouterLink>
        <RouterLink class="button secondary" :to="demoLink">View demo quote page</RouterLink>
      </div>
    </div>
  </section>

  <section class="benefits">
    <article v-for="benefit in benefits" :key="benefit.title" class="card">
      <h2>{{ benefit.title }}</h2>
      <p>{{ benefit.copy }}</p>
    </article>
  </section>
</template>

<script setup>
const demoLink = '/q/brightside-home-services';
const benefits = [
  { title: 'Filter unserious leads', copy: 'Ask for the right details and optionally collect a small deposit before estimating.' },
  { title: 'Collect better job details', copy: 'Customers submit service needs, budget, timing, location, and project notes in one place.' },
  { title: 'Request photos upfront', copy: 'Photo uploads help providers estimate faster and reduce back-and-forth.' },
  { title: 'Share one simple link', copy: 'Use the public quote page URL or QR code on cards, trucks, and social profiles.' },
  { title: 'Manage requests', copy: 'Review new, quoted, booked, and rejected requests from a focused dashboard.' },
  { title: 'Works without a database', copy: 'This MVP stores everything in local JSON files for simple local operation.' },
];
</script>
