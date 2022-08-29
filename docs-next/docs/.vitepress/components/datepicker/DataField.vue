<template>
  <div class="flex items-baseline space-x-2">
    <span
      class="flex-shrink-0 text-gray-500 dark:text-gray-400 font-semibold tracking-wide"
      >{{ label }}</span
    >
    <span class="flex-grow font-medium"><slot /></span>
  </div>
</template>

<script setup>
defineProps({
  label: String,
});
</script>
