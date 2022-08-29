<template>
  <DateDisplay v-model="date" mode="dateTime" :rules="rules" is-range />
</template>

<script setup>
import { ref } from 'vue';

const date = ref({
  start: new Date(2022, 7, 15),
  end: new Date(2022, 7, 19),
});
const rules = ref({
  hours: [2, 4, 7, 10, 14, 15, 16],
  minutes: { interval: 2 },
  milliseconds: 0,
});
</script>
