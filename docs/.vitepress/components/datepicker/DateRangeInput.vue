<template>
  <DateDisplay v-model.range="range">
    <template #default="props">
      <BaseRangeInput v-bind="props" />
    </template>
  </DateDisplay>
</template>

<script setup>
import { ref } from 'vue';

const range = ref({
  start: new Date(2020, 9, 12),
  end: new Date(2020, 9, 16),
});
</script>
