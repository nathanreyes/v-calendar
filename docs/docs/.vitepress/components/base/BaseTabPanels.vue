<template>
  <div class="relative flex-grow mt-4 lg:mt-0">
    <render />
  </div>
</template>

<script setup lang="ts">
import { useSlots, cloneVNode } from 'vue';

const slots = useSlots();
const items = slots.default
  ? slots.default().map((slot, i) => {
      return cloneVNode(slot, { index: i });
    })
  : [];
const render = () => items;
</script>
