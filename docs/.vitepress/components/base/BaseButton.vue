<template>
  <a v-if="url" :href="url" :class="elClass">
    <slot />
  </a>
  <button v-else :class="elClass">
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  light: Boolean,
  url: String,
});

const elClass = computed(() => {
  const base =
    'inline-flex justify-center items-center px-4 py-2 font-semibold text-sm rounded-lg';
  if (props.light)
    return `${base} bg-accent-100 hover:bg-accent-200 text-accent-600`;
  return `${base} bg-accent-600 hover:bg-accent-700 text-white`;
});
</script>
