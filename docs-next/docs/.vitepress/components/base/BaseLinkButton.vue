<template>
  <a
    class="flex items-center font-semibold space-x-2 text-sm text-white px-4 py-2 rounded-lg"
    :class="
      accent
        ? 'text-accent-800 bg-accent-100 hover:bg-accent-200 dark:text-white dark:bg-accent-500 dark:hover:bg-accent-700'
        : 'text-gray-900 bg-gray-200 hover:bg-gray-300 dark:text-white dark:bg-gray-500 dark:hover:bg-gray-700'
    "
    :href="href"
    :target="isExternal ? '_blank' : ''"
  >
    <span><slot /></span>
    <Component
      v-if="icon"
      :is="icon"
      class="w-4 h-4"
      :class="
        accent
          ? 'text-accent-500 dark:text-accent-300'
          : 'text-gray-500 dark:text-gray-300'
      "
    />
  </a>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  href: String,
  accent: Boolean,
  icon: String,
});

const isExternal = computed(() => props.href.startsWith('https://'));
</script>
