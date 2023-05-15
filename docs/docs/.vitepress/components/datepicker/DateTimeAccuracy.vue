<template>
  <DateDisplay v-model="date" mode="dateTime" :time-accuracy="timeAccuracy">
    <template #header>
      <TimeAccuracyPicker v-model="timeAccuracy" />
    </template>
  </DateDisplay>
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
const timeAccuracy = ref(3);
</script>
