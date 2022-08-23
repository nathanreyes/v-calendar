<template>
  <DateWithValue v-model="date" mode="dateTime" :rules="rules" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
const rules = ref({
  hours: [15, 18, 20],
  minutes: {
    interval: 5,
  },
});
</script>
