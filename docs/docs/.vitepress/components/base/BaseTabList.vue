<template>
  <div
    class="flex lg:flex-col lg:px-0 space-x-2 lg:space-x-0 max-w-full px-4 pb-4 sm:pb-0 lg:mt-6 sm:mx-auto whitespace-nowrap overflow-x-auto sm:overflow-visible overflow-y-hidden"
  >
    <render />
  </div>
</template>

<script setup lang="ts">
import { useSlots, cloneVNode } from 'vue';

const slots = useSlots();
const render = () =>
  slots.default
    ? slots.default().map((slot, i) => {
        return cloneVNode(slot, { index: i });
      })
    : [];
</script>
