<template>
  <Example>
    <div class="flex justify-center mb-1">
      <button
        v-for="color in colors_1"
        :key="color.value"
        class="mx-1"
        :class="colorClass(color)"
        @click="selectedColor = color"
      >
        {{ color.label }}
      </button>
    </div>
    <div class="flex justify-center mb-2">
      <button
        v-for="color in colors_2"
        :key="color.value"
        class="mx-1"
        :class="colorClass(color)"
        @click="selectedColor = color"
      >
        {{ color.label }}
      </button>
    </div>
    <div class="flex justify-center">
      <Calendar
        :initial-page="{ month: 4, year: 2019 }"
        :color="selectedColor.value"
        :attributes="attrs"
      />
    </div>
  </Example>
</template>
<script setup>
import { ref } from 'vue';

const colors = ref([
  {
    value: 'gray',
    label: 'Gray',
    class:
      'text-gray-800 hover:bg-gray-100 border-gray-500 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-700',
    selectedClass: 'bg-gray-500 dark:hover:bg-gray-700',
  },
  {
    value: 'red',
    label: 'Red',
    class:
      'text-red-800 hover:bg-red-100 border-red-500 dark:text-red-200 dark:hover:bg-red-700 dark:border-red-700',
    selectedClass: 'bg-red-500 dark:hover:bg-red-700',
  },
  {
    value: 'orange',
    label: 'Orange',
    class:
      'text-orange-800 hover:bg-orange-100 border-orange-500 dark:text-orange-200 dark:hover:bg-orange-700',
    selectedClass: 'bg-orange-500 dark:hover:bg-orange-700',
  },
  {
    value: 'yellow',
    label: 'Yellow',
    class:
      'text-yellow-800 hover:bg-yellow-100 border-yellow-500 dark:text-yellow-200 dark:hover:bg-yellow-700',
    selectedClass: 'bg-yellow-500 dark:hover:bg-yellow-700',
  },
  {
    value: 'green',
    label: 'Green',
    class:
      'text-green-800 hover:bg-green-100 border-green-500 dark:text-green-200 dark:hover:bg-green-700',
    selectedClass: 'bg-green-500 dark:hover:bg-green-700',
  },
  {
    value: 'teal',
    label: 'Teal',
    class:
      'text-teal-800 hover:bg-teal-100 border-teal-500 dark:text-teal-200 dark:hover:bg-teal-700',
    selectedClass: 'bg-teal-500 dark:hover:bg-teal-700',
  },
  {
    value: 'blue',
    label: 'Blue',
    class:
      'text-blue-800 hover:bg-blue-100 border-blue-500 dark:text-blue-200 dark:hover:bg-blue-700',
    selectedClass: 'bg-blue-500 dark:hover:bg-blue-700',
  },
  {
    value: 'indigo',
    label: 'Indigo',
    class:
      'text-indigo-800 hover:bg-indigo-100 border-indigo-500 dark:text-indigo-200 dark:hover:bg-indigo-700',
    selectedClass: 'bg-indigo-500 dark:hover:bg-indigo-700',
  },
  {
    value: 'purple',
    label: 'Purple',
    class:
      'text-purple-800 hover:bg-purple-100 border-purple-500 dark:text-purple-200 dark:hover:bg-purple-700',
    selectedClass: 'bg-purple-500 dark:hover:bg-purple-700',
  },
  {
    value: 'pink',
    label: 'Pink',
    class:
      'text-pink-800 hover:bg-pink-100 border-pink-500 dark:text-pink-200 dark:hover:bg-pink-700',
    selectedClass: 'bg-pink-500 dark:hover:bg-pink-700',
  },
]);

const selectedColor = ref(colors.value.find(c => c.value === 'blue'));
const colors_1 = colors.value.slice(0, 5);
const colors_2 = colors.value.slice(5, 10);
const attrs = ref([
  {
    key: 'test',
    highlight: true,
    dates: { start: new Date(2019, 3, 15), end: new Date(2019, 3, 19) },
  },
]);

function colorClass(color) {
  const sharedClasses = `inline-block text-sm border rounded py-1 mb-2 focus:outline-none w-16 dark:hover:text-white`;
  if (color === this.selectedColor) {
    return `${sharedClasses} ${color.selectedClass} text-white font-semibold`;
  }
  return `${sharedClasses} ${color.class} font-medium`;
}
</script>
