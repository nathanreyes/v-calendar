<script setup>
import { ref } from 'vue';
const calendar = ref(null);

async function move() {
  // Move forwards 1 month (wait for transition)
  await calendar.value.moveBy(1);
  // Move backwards 1 month (wait for transition)
  await calendar.value.moveBy(-1);
}
</script>
<template>
  <BaseButton @click="move" class="mb-4"> Move </BaseButton>
  <VCalendar ref="calendar" />
</template>
