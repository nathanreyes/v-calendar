<template>
  <Calendar :attributes="attributes" />
</template>

<script setup>
import { ref } from 'vue';

const attributes = [
  {
    highlight: true,
    dates: [new Date()],
  },
];
</script>
