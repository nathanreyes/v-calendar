<template>
  <DateDisplay v-model="date" mode="dateTime" :rules="rules" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
const rules = ref({
  hours: { min: 12, max: 20 },
  minutes: { interval: 5 },
});
</script>
