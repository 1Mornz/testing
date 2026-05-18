<template>
  <section class="page-heading">
    <div>
      <p class="eyebrow">Provider dashboard</p>
      <h1>Quote requests</h1>
      <p>Review submitted requests and track quote status.</p>
    </div>
    <RouterLink class="button primary" to="/setup">Edit page</RouterLink>
  </section>

  <section v-if="settings" class="panel dashboard-share">
    <div>
      <h2>{{ settings.businessName }}</h2>
      <p class="muted">{{ publicUrl }}</p>
    </div>
    <RouterLink class="button secondary" :to="`/q/${settings.slug}`">Open public page</RouterLink>
  </section>

  <section class="panel">
    <div v-if="loading" class="empty">Loading requests...</div>
    <div v-else-if="!requests.length" class="empty">No quote requests yet. Share your public page to start collecting leads.</div>
    <div v-else class="request-list">
      <RouterLink v-for="request in requests" :key="request.id" class="request-row" :to="`/dashboard/requests/${request.id}`">
        <div>
          <strong>{{ request.customerName }}</strong>
          <p>{{ request.serviceNeeded }} • {{ request.location }}</p>
        </div>
        <div class="row-meta">
          <StatusBadge :value="request.status" />
          <span :class="['payment-pill', request.deposit.status]">{{ paymentLabel(request) }}</span>
          <time>{{ new Date(request.createdAt).toLocaleDateString() }}</time>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { api } from '../lib/api';
import StatusBadge from '../components/StatusBadge.vue';

const loading = ref(true);
const requests = ref([]);
const settings = ref(null);
const publicUrl = computed(() => (settings.value ? `${window.location.origin}/q/${settings.value.slug}` : ''));

function paymentLabel(request) {
  if (request.deposit.status === 'paid') return 'paid';
  if (request.deposit.status === 'not_required') return 'no deposit';
  return request.deposit.required ? 'required unpaid' : 'unpaid';
}

onMounted(async () => {
  try {
    const [{ requests: list }, { settings: provider }] = await Promise.all([api('/requests'), api('/provider')]);
    requests.value = list;
    settings.value = provider;
  } finally {
    loading.value = false;
  }
});
</script>
