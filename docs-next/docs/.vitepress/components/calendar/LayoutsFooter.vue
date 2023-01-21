<template>
  <VCalendar ref="calendar">
    <template #footer>
      <div class="w-full px-4 pb-3">
        <button
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-full px-3 py-1 rounded-md"
          @click="moveToday"
        >
          Today
        </button>
      </div>
    </template>
  </VCalendar>
</template>

<script setup>
import { ref } from 'vue';

const calendar = ref(null);

function moveToday() {
  calendar.value.move(new Date());
}
</script>
