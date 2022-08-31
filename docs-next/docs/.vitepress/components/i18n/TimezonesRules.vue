<template>
  <DateDisplay v-model.range="range" :rules="rules" timezone="UTC" />
</template>

<script setup>
import { ref } from 'vue';

const range = ref({
  start: new Date(2020, 0, 6),
  end: new Date(2020, 0, 10),
});
const rules = ref({
  hours: 12,
  minutes: 0,
  seconds: 0,
});
</script>
