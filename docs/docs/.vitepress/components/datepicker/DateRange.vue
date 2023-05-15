<template>
  <Example centered>
    <VDatePicker v-model.range="range" />
    <div class="mt-2">{{ JSON.stringify(range) }}</div>
  </Example>
</template>

<script setup>
import { ref } from 'vue';

const range = ref({
  start: new Date(2020, 0, 6),
  end: new Date(2020, 0, 10),
});
</script>
