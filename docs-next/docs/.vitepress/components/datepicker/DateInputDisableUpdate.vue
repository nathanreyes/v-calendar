<template>
  <DateDisplay v-model="date" :update-on-input="false" show-input />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
</script>
