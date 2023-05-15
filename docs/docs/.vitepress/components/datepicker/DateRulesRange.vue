<template>
  <DateDisplay v-model.range="range" :rules="rules" />
</template>

<script setup>
import { ref } from 'vue';
const range = ref({ start: new Date(2020, 0, 6), end: new Date(2020, 0, 10) });
const rules = ref([{}, {}]);
</script>
