<template>
  <VCalendar :attributes="attrs" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const today: Date = new Date();

const attrs = ref([
  {
    key: 'today',
    highlight: true,
    dates: new Date(),
  },
  {
    highlight: 'red',
    dates: [new Date(today)],
  },
]);
</script>
