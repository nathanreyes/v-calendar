<template>
  <DateDisplay v-model.string="date" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
const date = ref('2000-01-01T12:00:00.000Z');
</script>
