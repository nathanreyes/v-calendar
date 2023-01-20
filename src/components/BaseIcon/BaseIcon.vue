<template>
  <component :is="icon" :width="width" :height="height" class="vc-base-icon" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as icons from './icons';

const props = defineProps({
  name: { type: String, required: true },
  width: { type: String },
  height: { type: String },
  size: { type: String, default: '26' },
  viewBox: { type: String },
});

const width = computed(() => props.width || props.size);
const height = computed(() => props.height || props.size);
const icon = computed(() => (icons as any)[`Icon${props.name}`]);
</script>

<style lang="css">
.vc-base-icon {
  display: inline-block;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
}
</style>
