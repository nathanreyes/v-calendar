<template>
  <div class="w-full max-w-sm">
    <form
      class="bg-white dark:bg-gray-900 shadow-md rounded px-8 pt-6 pb-8"
      @submit.prevent
    >
      <label
        class="block text-gray-600 dark:text-gray-400 text-sm font-bold mb-2"
        for="date"
        >Select Date</label
      >
      <div class="flex w-full">
        <VDatePicker v-model="date" :popover="popover">
          <template v-slot="{ inputValue, inputEvents }">
            <input
              id="date"
              class="px-2 py-1 bg-white border border-gray-300 rounded-l focus:outline-none focus:border focus:ring-2 dark:bg-gray-700 dark:border-gray-500"
              :class="{ 'border-red-600 dark:border-red-400': errorMessage }"
              :value="inputValue"
              v-on="inputEvents"
            />
          </template>
        </VDatePicker>
        <button
          type="button"
          class="text-white font-bold py-2 px-4 rounded-r user-select-none focus:outline-none"
          :class="date ? 'bg-red-500' : 'bg-red-300'"
          :disabled="!date"
          @click="date = null"
        >
          Clear
        </button>
      </div>
      <p
        class="text-red-600 dark:text-red-400 text-xs italic mt-1"
        v-if="errorMessage"
      >
        {{ errorMessage }}
      </p>
      <p class="text-blue-500 text-xs font-bold mt-1" v-else>
        We got it. Thanks!
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const date = ref(null);
const errorMessage = computed(() => {
  if (!date.value) return 'Date is required';
  return '';
});
const popover = ref({
  visibility: 'hover',
});
</script>
