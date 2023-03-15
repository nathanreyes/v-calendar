<template>
  <div class="flex items-center space-x-2 text-sm font-semibold">
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
