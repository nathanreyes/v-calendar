<template>
  <VDatePicker v-model="date" color="indigo" ref="picker">
    <template #footer>
      <div class="w-full px-3 pb-3">
        <button
          class="bg-indigo-600 hover:bg-indigo-700 focus:ring-2 text-white font-bold w-full px-3 py-1 rounded-md"
          @click="setToday"
        >
          Today
        </button>
      </div>
    </template>
  </VDatePicker>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const date = ref(new Date());
const picker = ref(null);
function setToday() {
  picker.value.updateValue(new Date(), { moveToValue: true });
}
</script>
