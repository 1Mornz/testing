<template>
  <section class="page-heading">
    <div>
      <p class="eyebrow">Request detail</p>
      <h1>{{ request?.customerName || 'Quote request' }}</h1>
      <p v-if="request">{{ request.serviceNeeded }} in {{ request.location }}</p>
    </div>
    <RouterLink class="button secondary" to="/dashboard">Back to dashboard</RouterLink>
  </section>

  <section v-if="error" class="panel error-text">{{ error }}</section>
  <section v-else-if="!request" class="panel empty">Loading request...</section>
  <div v-else class="detail-grid">
    <article class="panel">
      <div class="detail-head">
        <StatusBadge :value="request.status" />
        <select v-model="status" @change="saveStatus">
          <option value="new">new</option>
          <option value="reviewing">reviewing</option>
          <option value="quoted">quoted</option>
          <option value="booked">booked</option>
          <option value="rejected">rejected</option>
        </select>
      </div>
      <dl class="details">
        <dt>Customer</dt><dd>{{ request.customerName }}</dd>
        <dt>Email</dt><dd><a :href="`mailto:${request.email}`">{{ request.email }}</a></dd>
        <dt>Phone</dt><dd>{{ request.phone }}</dd>
        <dt>Location</dt><dd>{{ request.location }}</dd>
        <dt>Timeframe</dt><dd>{{ request.timeframe || 'Not specified' }}</dd>
        <dt>Budget</dt><dd>{{ request.budgetRange || 'Not specified' }}</dd>
        <dt>Created</dt><dd>{{ new Date(request.createdAt).toLocaleString() }}</dd>
      </dl>
      <h2>Project description</h2>
      <p class="preline">{{ request.description }}</p>
    </article>

    <aside class="panel">
      <h2>Deposit</h2>
      <p class="deposit-amount">{{ request.deposit.amount ? `$${request.deposit.amount}` : 'No deposit' }}</p>
      <p>Status: <strong>{{ request.deposit.status }}</strong></p>
      <p v-if="request.deposit.stripeCheckoutSessionId" class="muted">Checkout: {{ request.deposit.stripeCheckoutSessionId }}</p>
      <p v-if="request.deposit.stripePaymentIntentId" class="muted">Payment: {{ request.deposit.stripePaymentIntentId }}</p>
    </aside>

    <article class="panel full-width">
      <h2>Photos</h2>
      <div v-if="request.photos.length" class="photo-grid">
        <a v-for="photo in request.photos" :key="photo.id" :href="`${SERVER_URL}${photo.url}`" target="_blank" rel="noreferrer">
          <img :src="`${SERVER_URL}${photo.url}`" :alt="photo.originalName" />
        </a>
      </div>
      <p v-else class="empty">No photos were uploaded.</p>
    </article>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { api, SERVER_URL } from '../lib/api';
import StatusBadge from '../components/StatusBadge.vue';

const route = useRoute();
const request = ref(null);
const status = ref('new');
const error = ref('');

async function load() {
  try {
    const data = await api(`/requests/${route.params.id}`);
    request.value = data.request;
    status.value = data.request.status;
  } catch (err) {
    error.value = err.message;
  }
}

async function saveStatus() {
  const data = await api(`/requests/${request.value.id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: status.value }),
  });
  request.value = data.request;
}

onMounted(load);
</script>
