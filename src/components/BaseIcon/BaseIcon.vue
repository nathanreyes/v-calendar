<template>
  <svg v-if="icon" class="vc-base-icon" :width="width" :height="height">
    <component :is="icon" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as icons from './icons';

const props = defineProps({
  name: { type: String, required: true },
  width: { type: String },
  height: { type: String },
  viewBox: { type: String },
});

const width = computed(() => props.width || icon.value.width || '26');

const height = computed(() => props.height || icon.value.height || '26');

console.log('icons', icons);
const icon = computed(() => (icons as any)[props.name]);
</script>

<style lang="css">
@import './base-icon.css';
</style>
