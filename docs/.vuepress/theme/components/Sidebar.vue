<template>
  <aside
    class="fixed top-0 pt-12 md:pt-16 pb-6 px-3 md:pt-20 bg-white w-72 h-full overflow-y-auto"
  >
    <div class="sticky top-0">
      <NavLinks v-if="showNavLinks" is-vertical />
      <slot name="top" />
      <SidebarLinks :depth="0" :items="items" />
      <slot name="bottom" />
    </div>
  </aside>
</template>

<script>
import SidebarLinks from '@theme/components/SidebarLinks.vue';
import NavLinks from '@theme/components/NavLinks.vue';

export default {
  name: 'Sidebar',
  components: { SidebarLinks, NavLinks },
  props: {
    items: Array,
    showNavLinks: Boolean,
  },
};
</script>
