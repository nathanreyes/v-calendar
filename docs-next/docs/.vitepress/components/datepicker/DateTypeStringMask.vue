<template>
  <DateDisplay
    v-model="customer.birthday"
    :model-config="modelConfig"
    is-required
  />
</template>
<script setup>
import { reactive, ref } from 'vue';
const customer = reactive({
  name: 'Nathan Reyes',
  birthday: '1983-01-21',
});
const modelConfig = ref({
  type: 'string',
  mask: 'YYYY-MM-DD',
});
</script>
