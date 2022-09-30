<template>
  <DateDisplay v-model.range="range" :popover="popover" :columns="2">
    <template #popover="{ inputValue, inputEvents }">
      <div
        class="flex justify-center items-center range-wrapper bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-500"
      >
        <input
          class="flex-grow w-32 px-2 py-1 text-center focus:outline-none focus:ring-2 rounded-md"
          :value="inputValue.start"
          v-on="inputEvents.start"
        />
        <IconArrowRight />
        <input
          class="flex-grow w-32 px-2 py-1 text-center focus:outline-none focus:ring-2 rounded-md"
          :value="inputValue.end"
          v-on="inputEvents.end"
        />
      </div>
    </template>
  </DateDisplay>
</template>

<script setup>
import { ref } from 'vue';
const range = ref({ start: new Date(2020, 0, 6), end: new Date(2020, 0, 10) });
const popover = ref({
  target: '.range-wrapper',
});
</script>
