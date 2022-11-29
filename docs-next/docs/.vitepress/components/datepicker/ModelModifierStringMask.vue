<template>
  <DateDisplay v-model.string="customer.birthday" :masks="masks" />
</template>

<script setup>
import { reactive, ref } from 'vue';

const customer = reactive({
  name: 'Nathan Reyes',
  birthday: '1983-01-21',
});
const masks = ref({
  modelValue: 'YYYY-MM-DD',
});
</script>
