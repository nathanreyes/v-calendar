<template>
  <Calendar :attributes="attributes" />
</template>

<script setup>
import { ref } from 'vue';

const attributes = [
  {
    highlight: true,
    dates: [
      new Date(2022, 10, 2),
      new Date(2022, 10, 7),
      new Date(2022, 10, 17),
      new Date(2022, 10, 23),
    ],
  },
];
</script>
