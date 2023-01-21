<template>
  <BasePicker label="Time Accuracy:" :options="options" />
</template>

<script setup>
import { ref } from 'vue';

const options = ref([
  {
    value: 1,
    label: '1 (hours)',
  },
  {
    value: 2,
    label: '2 (minutes)',
  },
  {
    value: 3,
    label: '3 (seconds)',
  },
  {
    value: 4,
    label: '4 (milliseconds)',
  },
]);
</script>
