<script setup>
defineProps({
  centered: Boolean,
  dark: Boolean,
});
</script>
<template>
  <div
    class="py-6 px-8 my-4 border-y dark:bg-gray-900 dark:border-gray-600"
    :class="[
      { 'flex flex-col justify-center items-center': centered },
      dark ? 'bg-gray-700' : 'bg-gray-50',
    ]"
  >
    <slot />
  </div>
</template>
