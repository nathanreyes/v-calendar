<template>
  <Example centered>
    <TimezonePicker v-model="timezone" />
    <DatePicker mode="dateTime" v-model.range="range" :timezone="timezone" />
  </Example>
</template>

<script setup>
import { ref } from 'vue';

const timezone = ref('UTC');
const range = {
  start: Date.UTC(2020, 0, 6),
  end: Date.UTC(2020, 0, 10),
};
</script>
