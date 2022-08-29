<template>
  <select
    class="inline-block appearance-none w-full text-gray-700 bg-gray-200 border border-gray-200 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ml-2 dark:text-gray-300 dark:bg-gray-700"
    id="position"
  >
    <option
      v-for="option in options"
      :key="option.label || option.value"
      :value="option.value"
    >
      {{ option.label || option.value }}
    </option>
  </select>
</template>

<script setup>
defineProps({
  options: Array,
});
</script>
