<template>
  <main class="px-4 mx-auto w-full">
    <slot name="top" />
    <Content />
    <PageEdit />
    <slot name="bottom" />
  </main>
</template>

<script>
import PageEdit from '@theme/components/PageEdit.vue';

export default {
  components: { PageEdit },
  props: ['sidebarItems'],
};
</script>

<style lang="stylus">
@require '../styles/wrapper.styl';
</style>
