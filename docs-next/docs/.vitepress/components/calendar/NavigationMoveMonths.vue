<script setup>
import { ref } from 'vue';
const calendar = ref(null);

async function move() {
  // Move forwards 5 months (wait for transition)
  await calendar.value.move(5);
  // Move backwards 5 months (wait for transition)
  await calendar.value.move(-5);
}
</script>
<template>
  <BaseButton @click="move" class="mb-4"> Move </BaseButton>
  <Calendar ref="calendar" />
</template>
