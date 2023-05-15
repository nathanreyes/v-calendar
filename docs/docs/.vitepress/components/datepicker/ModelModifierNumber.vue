<template>
  <DateDisplay v-model.number="dateNum" timezone="utc" />
</template>

<script setup>
import { ref } from 'vue';
const dateNum = ref(0);
</script>
