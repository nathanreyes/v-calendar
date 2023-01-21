<template>
  <DateDisplay v-model.range="range" />
</template>

<script setup>
import { ref, computed } from 'vue';
const range = ref({ start: new Date(2020, 0, 6), end: new Date(2020, 0, 10) });
</script>
