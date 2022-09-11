<template>
  <DateDisplay v-model="date" :select-attribute="selectAttribute" />
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
const selectAttribute = ref({ dot: true });
</script>
