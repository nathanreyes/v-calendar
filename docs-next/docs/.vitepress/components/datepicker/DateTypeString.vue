<template>
  <DateDisplay v-model="date" :model-config="modelConfig" />
</template>
<script setup>
import { ref } from 'vue';
const date = ref('2000-01-01T12:00:00.000Z');
const modelConfig = ref({
  type: 'string',
});
</script>
