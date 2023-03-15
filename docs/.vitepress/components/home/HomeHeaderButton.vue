<template>
  <button
    class="text-xl sm:text-3xl font-display px-3 sm:px-4 py-2 sm:py-3 rounded-lg"
    :class="
      selected
        ? 'bg-white/70 dark:bg-white/50 ring-1 ring-white/1 ring-inset'
        : 'hover:bg-white/20'
    "
  >
    <span
      :class="
        selected
          ? 'text-transparent bg-gradient-to-r from-accent-700 dark:from-accent-800 to-blue-600 dark:to-blue-700 bg-clip-text'
          : 'text-white opacity-50'
      "
    >
      <slot />
    </span>
  </button>
</template>

<script setup>
defineProps({
  selected: Boolean,
});
</script>
