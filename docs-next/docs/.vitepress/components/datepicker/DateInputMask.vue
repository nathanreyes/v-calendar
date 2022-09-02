<template>
  <DateDisplay v-model="date" :masks="masks" show-input />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
const masks = ref({
  input: 'YYYY-MM-DD',
});
</script>
