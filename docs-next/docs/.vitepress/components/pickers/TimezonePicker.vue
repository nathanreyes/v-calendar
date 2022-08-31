<template>
  <BasePicker label="Timezone:" :options="options" />
</template>

<script setup>
import { ref } from 'vue';

const options = ref([
  {
    value: '',
    label: 'Local',
  },
  {
    value: 'utc',
    label: 'UTC',
  },
]);
</script>
