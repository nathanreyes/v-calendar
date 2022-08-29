<template>
  <div class="flex justify-center space-x-3 mb-4">
    <div
      class="flex space-x-2 hover:cursor-pointer text-sm font-medium hover:text-gray-500"
      v-for="option in options"
      :key="option.value"
    >
      <input
        v-model="timeAccuracy"
        type="radio"
        :value="option.value"
        :id="option.label"
        class="hover:cursor-pointer"
      />
      <label :for="option.label" class="hover:cursor-pointer">
        {{ option.label }}
      </label>
    </div>
  </div>
  <DateDisplay v-model="date" mode="dateTime" :time-accuracy="timeAccuracy" />
</template>
<script setup>
import { ref } from 'vue';
const date = ref(new Date());
const timeAccuracy = ref(2);
const options = ref([
  {
    value: 1,
    label: '1 (hours)',
  },
  {
    value: 2,
    label: '2 (minutes)',
  },
  {
    value: 3,
    label: '3 (seconds)',
  },
  {
    value: 4,
    label: '4 (milliseconds)',
  },
]);
</script>
