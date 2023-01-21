<template>
  <BasePicker label="Mode:" :options="options" />
</template>

<script setup>
import { ref } from 'vue';

const options = ref([
  {
    value: 'date',
    label: 'Date',
  },
  {
    value: 'dateTime',
    label: 'Date Time',
  },
  {
    value: 'time',
    label: 'Time',
  },
]);
</script>
