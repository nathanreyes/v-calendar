<template>
  <div class="space-y-2">
    <div class="flex justify-center space-x-1">
      <button
        v-for="color in colors_1"
        :key="color.value"
        :class="colorClass(color)"
        @click="selectedColor = color"
      >
        {{ color.label }}
      </button>
    </div>
    <div class="flex justify-center space-x-1">
      <button
        v-for="color in colors_2"
        :key="color.value"
        :class="colorClass(color)"
        @click="selectedColor = color"
      >
        {{ color.label }}
      </button>
    </div>
    <div
      v-if="showDarkMode"
      class="flex justify-center items-center space-x-2 pt-2"
    >
      <input id="darkmode" type="checkbox" v-model="isDark" />
      <label for="darkmode"> Dark Mode </label>
    </div>
  </div>

  <div class="flex justify-center mt-6">
    <VCalendar
      :initial-page="{ month: 4, year: 2019 }"
      :color="selectedColor.value"
      :attributes="attrs"
      :is-dark="isDark"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  showDarkMode: Boolean,
});

const colors = ref([
  {
    value: 'gray',
    label: 'Gray',
    class:
      'text-gray-800 hover:bg-gray-200 border-gray-500 dark:text-gray-200 dark:hover:bg-gray-700',
    selectedClass:
      'bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 dark:border-gray-500',
  },
  {
    value: 'red',
    label: 'Red',
    class:
      'text-red-800 hover:bg-red-200 border-red-500 dark:text-red-200 dark:hover:bg-red-700',
    selectedClass:
      'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 dark:border-red-500',
  },
  {
    value: 'orange',
    label: 'Orange',
    class:
      'text-orange-800 hover:bg-orange-200 border-orange-500 dark:text-orange-200 dark:hover:bg-orange-700',
    selectedClass:
      'bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 dark:border-orange-500',
  },
  {
    value: 'yellow',
    label: 'Yellow',
    class:
      'text-yellow-800 hover:bg-yellow-200 border-yellow-500 dark:text-yellow-200 dark:hover:bg-yellow-700',
    selectedClass:
      'bg-yellow-600 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:border-yellow-500',
  },
  {
    value: 'green',
    label: 'Green',
    class:
      'text-green-800 hover:bg-green-200 border-green-500 dark:text-green-200 dark:hover:bg-green-700',
    selectedClass:
      'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 dark:border-green-500',
  },
  {
    value: 'teal',
    label: 'Teal',
    class:
      'text-teal-800 hover:bg-teal-200 border-teal-500 dark:text-teal-200 dark:hover:bg-teal-700',
    selectedClass:
      'bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 dark:border-teal-500',
  },
  {
    value: 'blue',
    label: 'Blue',
    class:
      'text-blue-800 hover:bg-blue-200 border-blue-500 dark:text-blue-200 dark:hover:bg-blue-700',
    selectedClass:
      'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 dark:border-blue-500',
  },
  {
    value: 'indigo',
    label: 'Indigo',
    class:
      'text-indigo-800 hover:bg-indigo-200 border-indigo-500 dark:text-indigo-200 dark:hover:bg-indigo-700',
    selectedClass:
      'bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:border-indigo-500',
  },
  {
    value: 'purple',
    label: 'Purple',
    class:
      'text-purple-800 hover:bg-purple-200 border-purple-500 dark:text-purple-200 dark:hover:bg-purple-700',
    selectedClass:
      'bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 dark:border-purple-500',
  },
  {
    value: 'pink',
    label: 'Pink',
    class:
      'text-pink-800 hover:bg-pink-200 border-pink-500 dark:text-pink-200 dark:hover:bg-pink-700',
    selectedClass:
      'bg-pink-500 dark:hover:bg-pink-700 dark:hover:bg-pink-700 dark:border-pink-500',
  },
]);
const selectedColor = ref(colors.value.find(c => c.value === 'blue'));
const colors_1 = colors.value.slice(0, 5);
const colors_2 = colors.value.slice(5, 10);
const isDark = ref(props.showDarkMode ? false : undefined);

const attrs = ref([
  {
    key: 'test',
    highlight: true,
    dates: { start: new Date(2019, 3, 15), end: new Date(2019, 3, 19) },
  },
]);

function colorClass(color) {
  const sharedClasses = `inline-block text-sm border rounded py-1 focus:outline-none w-20 dark:hover:text-white`;
  if (color === selectedColor.value) {
    return `${sharedClasses} ${color.selectedClass} text-white font-medium`;
  }
  return `${sharedClasses} ${color.class}`;
}
</script>
