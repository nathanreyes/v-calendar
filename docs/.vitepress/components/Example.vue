<script setup>
defineProps({
  centered: Boolean,
  dark: Boolean,
  noCode: Boolean,
});
</script>
<template>
  <div
    class="not-prose py-6 px-8 bg-gray-100 border-y sm:border dark:bg-black dark:border-gray-600 sm:rounded-lg -mx-6 sm:mx-0"
    :class="[
      { 'flex flex-col justify-center items-center': centered, dark },
      noCode ? 'my-8' : 'mt-8 -mb-4 sm:mb-4',
    ]"
  >
    <slot />
  </div>
</template>
