<template>
  <DateDisplay v-model="date" :mode="mode">
    <DateModePicker v-model="mode" />
  </DateDisplay>
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
const mode = ref('date');
</script>
