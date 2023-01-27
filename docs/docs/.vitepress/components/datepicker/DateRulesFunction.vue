<template>
  <DateDisplay v-model="date" mode="dateTime" :rules="rules" is24hr />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
const rules = ref({
  hours: (hour, { weekday }) => {
    if ([1, 7].includes(weekday)) return hour >= 8 && hour <= 12;
    return true;
  },
});
</script>
