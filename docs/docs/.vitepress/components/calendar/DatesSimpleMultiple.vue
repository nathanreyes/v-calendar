<template>
  <VCalendar :attributes="attributes" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const attributes = ref([
  {
    highlight: true,
    dates: [
      new Date(2022, 10, 2),
      new Date(2022, 10, 7),
      new Date(2022, 10, 12),
      new Date(2022, 10, 17),
      new Date(2022, 10, 23),
    ],
  },
]);
</script>
