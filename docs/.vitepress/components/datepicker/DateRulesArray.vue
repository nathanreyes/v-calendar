<template>
  <DateDisplay v-model="date" mode="dateTime" :rules="rules" />
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
const rules = ref({
  hours: [7, 15, 18, 22],
});
</script>
