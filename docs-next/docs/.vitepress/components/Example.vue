<script setup>
defineProps({
  centered: Boolean,
  dark: Boolean,
});
</script>
<template>
  <div :class="{ dark }">
    <div
      class="py-6 px-8 my-4 bg-gray-100 border dark:bg-black dark:border-gray-600 rounded-lg"
      :class="[{ 'flex flex-col justify-center items-center': centered }]"
    >
      <slot />
    </div>
  </div>
</template>
