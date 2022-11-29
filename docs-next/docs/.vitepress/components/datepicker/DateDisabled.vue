<template>
  <DateDisplay v-model="date" :disabled-dates="disabledDates" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
const disabledDates = ref([
  {
    repeat: {
      weekdays: [4, 5],
    },
  },
]);
</script>
