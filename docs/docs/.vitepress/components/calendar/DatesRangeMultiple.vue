<template>
  <VCalendar :attributes="attributes" />
</template>

<script setup>
import { ref } from 'vue';

const attributes = ref([
  {
    highlight: 'blue',
    dates: [
      new Date(2022, 10, 4),
      [new Date(2022, 10, 7), new Date(2022, 10, 9)],
    ],
  },
  {
    highlight: 'red',
    dates: [[new Date(2022, 10, 17), new Date(2022, 10, 19)]],
  },
  {
    highlight: 'green',
    dates: [[new Date(2022, 10, 20), new Date(2022, 10, 24)]],
  },
]);
</script>
