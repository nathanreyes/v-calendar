<template>
  <DateDisplay
    v-model="date"
    :mode="mode"
    :time-accuracy="timeAccuracy"
    rules="auto"
  >
    <template #header>
      <DateModePicker v-model="mode" />
      <TimeAccuracyPicker v-model="timeAccuracy" />
    </template>
  </DateDisplay>
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
const mode = ref('date');
const timeAccuracy = ref(2);
</script>
