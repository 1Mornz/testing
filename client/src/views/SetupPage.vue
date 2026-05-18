<template>
  <section class="page-heading">
    <div>
      <p class="eyebrow">Provider setup</p>
      <h1>Create your quote page</h1>
      <p>Configure the public page customers use to request quotes.</p>
    </div>
  </section>

  <div class="split">
    <form class="panel form-grid" @submit.prevent="save">
      <label>Business name<input v-model="form.businessName" required /></label>
      <label>Service category<input v-model="form.serviceCategory" required /></label>
      <label>Service area<input v-model="form.serviceArea" required /></label>
      <label>Contact email<input v-model="form.contactEmail" type="email" required /></label>
      <label>Contact phone<input v-model="form.contactPhone" required /></label>
      <label>Quote page slug<input v-model="form.slug" required placeholder="brightside-home-services" /></label>
      <label>Deposit amount<input v-model.number="form.depositAmount" type="number" min="0" step="1" /></label>
      <label class="check-row"><input v-model="form.depositRequired" type="checkbox" /> Require deposit before estimating</label>
      <label class="full">Business description<textarea v-model="form.businessDescription" rows="5"></textarea></label>
      <div class="form-actions full">
        <button class="button primary" type="submit" :disabled="saving">{{ saving ? 'Saving...' : 'Save quote page' }}</button>
        <p v-if="message" class="success-text">{{ message }}</p>
        <p v-if="error" class="error-text">{{ error }}</p>
      </div>
    </form>

    <aside class="panel">
      <h2>Share page</h2>
      <p v-if="publicUrl" class="muted">Send this URL to customers or print the QR code.</p>
      <div v-if="publicUrl" class="share-box">
        <input :value="publicUrl" readonly />
        <button class="button secondary" @click="copyUrl">Copy</button>
      </div>
      <img v-if="qrCode" class="qr" :src="qrCode" alt="Public quote page QR code" />
      <a v-if="qrCode" class="button secondary" :href="qrCode" download="quotegate-qr.png">Download QR</a>
      <p v-else class="empty">Save a page to generate a public URL and QR code.</p>
    </aside>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import QRCode from 'qrcode';
import { api } from '../lib/api';

const form = reactive({
  businessName: '',
  serviceCategory: '',
  serviceArea: '',
  contactEmail: '',
  contactPhone: '',
  depositAmount: 0,
  depositRequired: false,
  businessDescription: '',
  slug: '',
});
const saving = ref(false);
const message = ref('');
const error = ref('');
const qrCode = ref('');
const publicUrl = computed(() => (form.slug ? `${window.location.origin}/q/${form.slug}` : ''));

async function load() {
  const { settings } = await api('/provider');
  if (settings) Object.assign(form, settings);
}

async function makeQr() {
  qrCode.value = publicUrl.value ? await QRCode.toDataURL(publicUrl.value, { margin: 1, width: 220 }) : '';
}

async function save() {
  saving.value = true;
  error.value = '';
  message.value = '';
  try {
    const { settings } = await api('/provider', { method: 'PUT', body: JSON.stringify(form) });
    Object.assign(form, settings);
    await makeQr();
    message.value = 'Quote page saved.';
  } catch (err) {
    error.value = err.details ? Object.values(err.details).join(', ') : err.message;
  } finally {
    saving.value = false;
  }
}

async function copyUrl() {
  await navigator.clipboard.writeText(publicUrl.value);
  message.value = 'Public URL copied.';
}

watch(() => form.slug, makeQr);
onMounted(async () => {
  await load();
  await makeQr();
});
</script>
