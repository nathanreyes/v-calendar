<template>
  <VDatePicker v-model.range="range" mode="datetime">
    <template v-slot="{ inputValue, inputEvents }">
      <div class="flex justify-center items-center space-x-2">
        <input
          :value="inputValue.start"
          v-on="inputEvents.start"
          class="bg-white rounded border border-gray-300 px-2 py-1"
        /><span> &mdash; </span>
        <input
          :value="inputValue.end"
          v-on="inputEvents.end"
          class="bg-white rounded border border-gray-300 px-2 py-1"
        />
      </div>
    </template>
  </VDatePicker>
</template>
<script setup>
import { ref } from 'vue';

const range = ref(null);
</script>
