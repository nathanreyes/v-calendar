<template>
  <VCalendar :attributes="attributes" />
</template>

<script setup>
import { ref } from 'vue';

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const attributes = ref([
  {
    key: 'today',
    highlight: {
      color: 'purple',
      fillMode: 'solid',
      contentClass: 'italic',
    },
    dates: new Date(year, month, 12),
  },
  {
    highlight: {
      color: 'purple',
      fillMode: 'light',
    },
    dates: new Date(year, month, 13),
  },
  {
    highlight: {
      color: 'purple',
      fillMode: 'outline',
    },
    dates: new Date(year, month, 14),
  },
]);
</script>
