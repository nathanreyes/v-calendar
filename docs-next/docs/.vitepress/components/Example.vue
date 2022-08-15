<script setup>
defineProps({
  centered: Boolean,
  dark: Boolean,
});
</script>
<template>
  <div :class="{ dark }">
    <div
      class="py-6 px-8 my-4 border-y bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
      :class="[{ 'flex flex-col justify-center items-center': centered }]"
    >
      <slot />
    </div>
  </div>
</template>
