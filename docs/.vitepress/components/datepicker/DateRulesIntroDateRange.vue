<template>
  <DateDisplay v-model.range="range" :mode="mode" :rules="rules">
    <template #header>
      <DateModePicker v-model="mode" />
    </template>
  </DateDisplay>
</template>

<script setup>
import { ref } from 'vue';
const range = ref({ start: new Date(2020, 0, 6), end: new Date(2020, 0, 10) });
const mode = ref('date');
const rules = ref([
  {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  },
  {
    hours: 23,
    minutes: 59,
    seconds: 59,
    milliseconds: 999,
  },
]);
</script>
