<template>
  <DateDisplay v-model="date" mode="dateTime" :rules="rules" />
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date(2000, 0, 15));
const rules = {
  hours: 3,
  minutes: { interval: 5 },
  seconds: 4,
  milliseconds: 500,
};
</script>
