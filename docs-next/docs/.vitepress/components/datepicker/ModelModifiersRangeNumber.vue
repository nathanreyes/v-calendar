<template>
  <DateDisplay v-model.range.number="range" />
</template>

<script setup>
import { ref, computed } from 'vue';
const range = ref({ start: 1578290400000, end: 1578636000000 });
</script>
