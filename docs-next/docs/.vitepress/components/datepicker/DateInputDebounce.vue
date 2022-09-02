<template>
  <DateDisplay v-model="date" :input-debounce="500" show-input />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
</script>
