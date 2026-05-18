<template>
  <section v-if="loading" class="panel empty">Loading quote page...</section>
  <section v-else-if="error" class="panel not-found">
    <h1>Quote page not found</h1>
    <p>{{ error }}</p>
  </section>
  <div v-else class="public-layout">
    <aside class="panel public-card">
      <p class="eyebrow">{{ provider.serviceCategory }}</p>
      <h1>{{ provider.businessName }}</h1>
      <p>{{ provider.businessDescription }}</p>
      <dl class="details compact">
        <dt>Service area</dt><dd>{{ provider.serviceArea }}</dd>
        <dt>Email</dt><dd>{{ provider.contactEmail }}</dd>
        <dt>Phone</dt><dd>{{ provider.contactPhone }}</dd>
      </dl>
      <p v-if="provider.depositAmount > 0" class="deposit-note">
        Quote deposit: ${{ provider.depositAmount }}
        <span v-if="provider.depositRequired">required</span>
        <span v-else>optional</span>
      </p>
      <p v-if="paymentMessage" class="warning">{{ paymentMessage }}</p>
    </aside>

    <form v-if="!submitted" class="panel form-grid" @submit.prevent="submit">
      <h2 class="full">Request a quote</h2>
      <label>Name<input v-model="form.customerName" required /></label>
      <label>Phone<input v-model="form.phone" required /></label>
      <label>Email<input v-model="form.email" type="email" required /></label>
      <label>Service needed<input v-model="form.serviceNeeded" required /></label>
      <label>Location<input v-model="form.location" required /></label>
      <label>Preferred timeframe<input v-model="form.timeframe" /></label>
      <label>Budget range<input v-model="form.budgetRange" placeholder="$500 - $1,000" /></label>
      <label>Photos<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple @change="setFiles" /></label>
      <label class="full">Project description<textarea v-model="form.description" rows="6" required></textarea></label>
      <label v-if="canChooseDeposit" class="check-row full">
        <input v-model="payDeposit" type="checkbox" /> Pay the ${{ provider.depositAmount }} quote deposit after submitting
      </label>
      <p v-if="errorText" class="error-text full">{{ errorText }}</p>
      <button class="button primary full" type="submit" :disabled="submitting">{{ submitting ? 'Submitting...' : buttonText }}</button>
    </form>

    <section v-else class="panel confirmation">
      <h2>Request received</h2>
      <p>Your quote request was submitted to {{ provider.businessName }}.</p>
      <p v-if="checkoutBlocked" class="warning">Payment is not configured for this demo, so the request is saved as unpaid.</p>
      <RouterLink class="button secondary" to="/">Back to QuoteGate</RouterLink>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { api, uploadQuoteRequest } from '../lib/api';

const route = useRoute();
const provider = ref(null);
const paymentMessage = ref('');
const loading = ref(true);
const error = ref('');
const errorText = ref('');
const submitting = ref(false);
const submitted = ref(false);
const checkoutBlocked = ref(false);
const files = ref([]);
const payDeposit = ref(false);
const form = reactive({
  customerName: '',
  phone: '',
  email: '',
  serviceNeeded: '',
  location: '',
  description: '',
  timeframe: '',
  budgetRange: '',
});

const depositsEnabled = computed(() => Number(provider.value?.depositAmount || 0) > 0);
const canChooseDeposit = computed(() => depositsEnabled.value && !provider.value.depositRequired);
const buttonText = computed(() => {
  if (provider.value?.depositRequired) return 'Submit and pay deposit';
  if (payDeposit.value) return 'Submit and pay deposit';
  return 'Submit quote request';
});

function setFiles(event) {
  files.value = Array.from(event.target.files || []);
}

async function submit() {
  submitting.value = true;
  errorText.value = '';
  checkoutBlocked.value = false;
  try {
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => body.append(key, value));
    files.value.forEach((file) => body.append('photos', file));
    const { request } = await uploadQuoteRequest(route.params.slug, body);
    const shouldPay = provider.value.depositRequired || payDeposit.value;
    if (shouldPay && request.deposit.enabled) {
      try {
        const checkout = await api(`/requests/${request.id}/checkout`, { method: 'POST', body: JSON.stringify({}) });
        window.location.href = checkout.url;
        return;
      } catch (err) {
        checkoutBlocked.value = true;
      }
    }
    submitted.value = true;
  } catch (err) {
    errorText.value = err.details ? Object.values(err.details).join(', ') : err.message;
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  try {
    const [{ settings }, payment] = await Promise.all([api(`/public/${route.params.slug}`), api('/payments/config')]);
    provider.value = settings;
    paymentMessage.value = payment.message || '';
    payDeposit.value = Boolean(settings.depositRequired);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>
