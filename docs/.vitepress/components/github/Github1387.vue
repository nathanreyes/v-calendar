<template>
  <VDatePicker v-model="date" locale="de">
    <template #default="{ inputValue, inputEvents }">
      <input
        :value="inputValue"
        v-on="inputEvents"
        class="px-2 py-1 bg-white text-gray-800 rounded"
      />
    </template>
  </VDatePicker>
</template>

<script setup>
import { ref } from 'vue';

const date = ref(new Date());
</script>
