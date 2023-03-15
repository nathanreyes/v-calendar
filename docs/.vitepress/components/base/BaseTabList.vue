<template>
  <div>
    <render />
  </div>
</template>

<script setup lang="ts">
import { useSlots, cloneVNode, RendererNode } from 'vue';

const slots = useSlots();
const render = () => {
  if (slots.default) {
    const node = slots.default();
    let children: any[] = [];
    if (typeof node[0].type === 'symbol') {
      children = (node[0] as RendererNode).children;
    } else {
      children = node;
    }
    return children.map((child, i) => {
      return cloneVNode(child, { index: i });
    });
  }
  return null;
};
</script>
