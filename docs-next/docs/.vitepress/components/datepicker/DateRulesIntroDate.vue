<template>
  <DateDisplay v-model="date" :mode="mode" :rules="rules">
    <template #header>
      <DateModePicker v-model="mode" />
    </template>
  </DateDisplay>
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
const mode = ref('date');
const rules = ref({
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
});
</script>
