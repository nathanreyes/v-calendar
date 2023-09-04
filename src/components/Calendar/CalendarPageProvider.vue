<template>
  <slot />
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import { createPage } from '../../use/page';
import type { Page } from '../../utils/page';

const props = defineProps<{
  page: Page;
}>();

createPage(toRef(props, 'page'));
</script>
