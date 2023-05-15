<template>
  <DateDisplay v-if="!isRange" v-model="date" />
  <DateDisplay v-else v-model.range="range" />
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  isRange: Boolean,
});

const date = ref(new Date());
const range = ref({ start: new Date(2020, 0, 6), end: new Date(2020, 0, 10) });
</script>
