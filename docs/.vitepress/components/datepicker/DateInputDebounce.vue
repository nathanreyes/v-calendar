<template>
  <DateDisplay v-model="date" :input-debounce="500">
    <template #default="{ inputValue, inputEvents }">
      <BaseInput :value="inputValue" v-on="inputEvents" />
    </template>
  </DateDisplay>
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
</script>
