<template>
  <p class="text-gray-200 text-center font-medium mt-4 mb-6 px-4 lg:hidden">
    {{ summary }}
  </p>
  <slot />
</template>

<script setup lang="ts">
defineProps<{ summary: string }>();
</script>
