<template>
  <VCalendar :attributes="attributes" />
</template>

<script setup>
import { ref } from 'vue';

const attributes = ref([
  {
    highlight: 'blue',
    dates: [{ start: new Date(2022, 10, 7), span: 3 }],
  },
]);
</script>
