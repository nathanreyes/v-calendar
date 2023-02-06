<template>
  <div class="lg:hidden" :class="containerClass">
    <button
      class="font-display text-lg text-white px-4 py-1"
      :class="{ 'bg-white text-accent-600 rounded-full': selected }"
      @click="select"
    >
      {{ title }}
    </button>
    <!-- <p class="lg:block text-sm text-white mt-2" :class="{ hidden: !selected }">
      {{ summary }}
    </p> -->
  </div>
  <button class="hidden lg:block" :class="containerClass" @click="select">
    <h3 class="font-display text-lg text-white hidden lg:block">
      {{ title }}
    </h3>
    <p class="hidden lg:block text-sm text-white mt-2">
      {{ summary }}
    </p>
  </button>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useTabs } from './BaseTabs.vue';

const props = defineProps<{ title: string; summary: string; index: number }>();

const { selectedIndex } = useTabs();
const selected = computed(() => selectedIndex.value === props.index);

const containerClass = computed(() => {
  const result = ['lg:px-4 lg:py-6 lg:rounded-l-xl'];
  if (selected.value) {
    result.push('lg:bg-white/10 lg:ring-1 lg:ring-white/1 lg:ring-inset');
  } else {
    result.push();
  }
  return result;
});

function select() {
  selectedIndex.value = props.index;
}
</script>
