<template>
  <div
    class="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0 text-sm font-semibold"
  >
    <span
      class="flex-shrink-0 text-gray-500 dark:text-gray-400 tracking-wide"
      >{{ label }}</span
    >
    <span class="flex-grow"><slot /></span>
  </div>
</template>

<script setup>
defineProps({
  label: String,
});
</script>
