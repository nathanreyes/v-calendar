<template>
  <DatePicker v-model.range="range">
    <template #default="{ inputValue, inputEvents }">
      <div class="flex justify-center items-center">
        <BaseInput :value="inputValue.start" v-on="inputEvents.start" />
        <svg
          class="text-gray-400 dark:text-gray-500 w-4 h-4 mx-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
        <BaseInput :value="inputValue.end" v-on="inputEvents.end" />
      </div>
    </template>
  </DatePicker>
</template>

<script setup>
import { ref } from 'vue';

const range = ref({
  start: new Date(2020, 9, 12),
  end: new Date(2020, 9, 16),
});
</script>
