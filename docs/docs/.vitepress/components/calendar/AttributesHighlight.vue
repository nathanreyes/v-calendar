<template>
  <VCalendar :attributes="attrs" />
</template>

<script setup>
import { ref } from 'vue';

const attrs = ref([
  {
    key: 'today',
    highlight: true,
    dates: new Date(),
  },
]);
</script>
