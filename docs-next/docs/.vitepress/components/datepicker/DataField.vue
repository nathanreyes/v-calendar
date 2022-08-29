<template>
  <div class="flex items-baseline space-x-2">
    <span
      class="text-gray-500 dark:text-gray-400 font-semibold tracking-wide w-24 text-right"
      >{{ label }}</span
    >
    <span class="font-medium"><slot /></span>
  </div>
</template>

<script setup>
defineProps({
  label: String,
});
</script>
