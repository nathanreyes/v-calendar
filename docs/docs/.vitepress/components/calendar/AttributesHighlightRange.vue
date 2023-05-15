<template>
  <VCalendar
    :initial-page="{ month: 1, year: 2019 }"
    :attributes="attributes"
  />
</template>

<script setup>
import { ref } from 'vue';

const attributes = ref([
  {
    highlight: {
      start: { fillMode: 'outline' },
      base: { fillMode: 'light' },
      end: { fillMode: 'outline' },
    },
    dates: { start: new Date(2019, 0, 14), end: new Date(2019, 0, 18) },
  },
]);
</script>
