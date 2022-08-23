<template>
  <DateWithValue v-model="date" mode="dateTime" :rules="rules" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(new Date());
const rules = ref({
  seconds: 0,
  milliseconds: 0,
});
</script>
