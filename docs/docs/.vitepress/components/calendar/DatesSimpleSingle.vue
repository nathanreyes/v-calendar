<template>
  <VCalendar :attributes="attributes" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const attributes = ref([
  {
    highlight: true,
    dates: new Date(),
  },
]);
</script>
