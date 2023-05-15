<template>
  <DateDisplay v-model="date" :mode="mode">
    <template #header>
      <DateModePicker v-model="mode" />
    </template>
  </DateDisplay>
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
const mode = ref('date');
</script>
