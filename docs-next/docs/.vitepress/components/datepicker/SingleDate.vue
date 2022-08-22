<script setup>
import { ref } from 'vue';
const date = ref(new Date());
</script>
<template>
  <Example centered>
    <DatePicker v-model="date" />
    <div class="mt-2">{{ date ? date.toISOString() : 'Empty' }}</div>
  </Example>
</template>
