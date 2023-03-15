<template>
  <DateWithValue v-model.range="range" :disabled-dates="disabledDates" />
</template>

<script setup>
import { ref } from 'vue';
const range = ref(null);
const disabledDates = ref([
  {
    repeat: {
      weekdays: [4, 5],
    },
  },
]);
</script>
