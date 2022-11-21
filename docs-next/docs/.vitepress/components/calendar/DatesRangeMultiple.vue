<template>
  <Calendar :attributes="attributes" />
</template>

<script setup>
import { ref } from 'vue';

const attributes = [
  {
    highlight: 'blue',
    dates: [
      new Date(2022, 10, 4),
      { start: new Date(2022, 10, 7), end: new Date(2022, 10, 9) },
    ],
  },
  {
    highlight: 'red',
    dates: [{ start: new Date(2022, 10, 17), end: new Date(2022, 10, 19) }],
  },
  {
    highlight: 'green',
    dates: [{ start: new Date(2022, 10, 20), end: new Date(2022, 10, 24) }],
  },
];
</script>
