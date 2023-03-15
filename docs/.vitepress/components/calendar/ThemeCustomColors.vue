<script setup>
import { ref } from 'vue';

const attrs = ref([
  {
    highlight: true,
    dates: new Date(),
  },
]);
</script>

<template>
  <Example centered>
    <VCalendar color="sky-blue" :attributes="attrs" />
  </Example>
</template>

<style>
/* Sky blue */
.vc-sky-blue {
  --vc-accent-50: #f0f9ff;
  --vc-accent-100: #e0f2fe;
  --vc-accent-200: #bae6fd;
  --vc-accent-300: #7dd3fc;
  --vc-accent-400: #38bdf8;
  --vc-accent-500: #0ea5e9;
  --vc-accent-600: #0284c7;
  --vc-accent-700: #0369a1;
  --vc-accent-800: #075985;
  --vc-accent-900: #0c4a6e;
}
</style>
