<template>
  <!--Default tab button-->
  <div
    class="lg:hidden font-display text-lg text-white px-4 py-1 rounded-full"
    :class="{ 'bg-white text-accent-600': selected }"
  >
    {{ title }}
  </div>
  <!--Large tab button-->
  <div
    class="hidden lg:block px-5 py-6 rounded-l-xl text-left"
    :class="
      selected
        ? 'bg-white/10 ring-1 ring-white/1 ring-inset'
        : 'hover:bg-white/5'
    "
  >
    <h3 class="font-display text-lg text-white">
      {{ title }}
    </h3>
    <p class="hidden lg:block text-sm text-white mt-2">
      {{ summary }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; summary: string; selected: boolean }>();
</script>
