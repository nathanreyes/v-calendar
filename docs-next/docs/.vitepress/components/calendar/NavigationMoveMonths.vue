<script setup>
import { ref } from 'vue';
const calendar = ref(null);

async function move() {
  // Move forwards 1 month (wait for transition)
  await calendar.value.move(1);
  // Move backwards 1 month (wait for transition)
  await calendar.value.move(-1);
}
</script>
<template>
  <BaseButton @click="move" class="mb-4"> Move </BaseButton>
  <Calendar ref="calendar" />
</template>
