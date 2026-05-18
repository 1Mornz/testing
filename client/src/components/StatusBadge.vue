<template>
  <span class="badge" :class="`badge-${value}`">{{ label }}</span>
</template>

<script setup>
const props = defineProps({ value: { type: String, required: true } });
const label = props.value.replace('_', ' ');
</script>
