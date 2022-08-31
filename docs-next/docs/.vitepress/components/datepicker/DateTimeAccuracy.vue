<template>
  <TimeAccuracyPicker v-model="timeAccuracy" />
  <DateDisplay v-model="date" mode="dateTime" :time-accuracy="timeAccuracy" />
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
const timeAccuracy = ref(3);
</script>
