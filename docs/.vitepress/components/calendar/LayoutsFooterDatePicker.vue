<template>
  <DateDisplay v-model="date" mode="dateTime">
    <template #footer>
      <div
        class="w-full px-4 py-3 border-t border-gray-300 dark:border-gray-700"
      >
        <button
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-full px-3 py-1 rounded-md"
          @click="date = null"
        >
          Clear
        </button>
      </div>
    </template>
  </DateDisplay>
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
</script>
