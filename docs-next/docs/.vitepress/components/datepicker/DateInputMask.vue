<template>
  <DatePicker v-model="date" :masks="masks">
    <template v-slot="{ inputValue, inputEvents }">
      <BaseInput :value="inputValue" v-on="inputEvents" />
    </template>
  </DatePicker>
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
const masks = ref({
  input: 'YYYY-MM-DD',
});
</script>
