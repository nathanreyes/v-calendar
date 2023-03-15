<template>
  <VCalendar
    :initial-page="{ month: 1, year: 2018 }"
    :attributes="attributes"
  />
</template>

<script setup>
import { ref } from 'vue';

const attributes = ref([
  {
    // Boolean
    content: true,
    dates: [new Date(2018, 0, 1), new Date(2018, 0, 10), new Date(2018, 0, 22)],
  },
  {
    // String
    content: 'red',
    dates: [new Date(2018, 0, 4), new Date(2018, 0, 10), new Date(2018, 0, 15)],
  },
  {
    // Object
    content: {
      color: 'purple',
      style: {
        fontStyle: 'italic',
      },
    },
    dates: [
      new Date(2018, 0, 12),
      new Date(2018, 0, 26),
      new Date(2018, 0, 15),
    ],
  },
]);
</script>
