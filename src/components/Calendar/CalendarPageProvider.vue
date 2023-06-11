<template>
  <slot />
</template>

<script setup lang="ts">
import { Page } from '../../utils/page';
import { createPage } from '../../use/page';

const props = defineProps<{
  page: Page;
}>();

createPage(props.page);
</script>
