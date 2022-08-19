<template>
  <Example centered>
    <Calendar :attributes="attrs" />
  </Example>
</template>

<script setup>
import { ref } from 'vue';

const attrs = ref([
  {
    key: 'today',
    highlight: true,
    dates: new Date(),
  },
]);
</script>
