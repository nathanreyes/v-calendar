<template>
  <Example centered>
    <DatePicker mode="dateTime" v-model="range" :timezone="timezone" is-range />
    <TimezonePicker v-model="timezone" />
  </Example>
</template>

<script setup>
import { ref, computed } from 'vue';

const timezone = ref('UTC');
const range = {
  start: Date.UTC(2020, 0, 6),
  end: Date.UTC(2020, 0, 10),
};
</script>
