<template>
  <slot />
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import { Page } from '../../utils/page';
import { createPage } from '../../use/page';

const props = defineProps<{
  page: Page;
}>();

createPage(toRef(props, 'page'));
</script>
