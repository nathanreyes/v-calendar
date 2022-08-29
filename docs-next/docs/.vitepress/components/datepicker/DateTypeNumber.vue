<template>
  <DateDisplay
    v-model.string="date"
    :model-config="modelConfig"
    timezone="utc"
  />
</template>
<script setup>
import { ref } from 'vue';
const date = ref(0);
const modelConfig = ref({
  type: 'number',
});
</script>
