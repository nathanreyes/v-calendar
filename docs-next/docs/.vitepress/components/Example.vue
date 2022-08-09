<script setup>
defineProps({
  centered: Boolean,
  dark: Boolean,
});
</script>
<template>
  <div
    class="py-6 px-8 my-4 border-y"
    :class="[
      { 'flex justify-center items-center': centered },
      dark ? 'bg-gray-700' : 'bg-gray-50',
    ]"
  >
    <slot />
  </div>
</template>
