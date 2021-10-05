<template>
  <div class="py-6">
    <div class="flex space-x-2 mb-2">
      <button @click="movePrevWeek">Previous</button>
      <button @click="moveNextWeek">Next</button>
    </div>
    <Calendar />
    <!-- <DatePicker v-model="date" /> -->
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const week = ref(1);
    const date = ref(new Date());
    return {
      week,
      date,
      moveNextWeek() {
        week.value = Math.min(week.value + 1, 6);
      },
      movePrevWeek() {
        week.value = Math.max(week.value - 1, 0);
      },
    };
  },
});
</script>
