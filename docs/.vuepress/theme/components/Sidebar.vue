<template>
  <aside
    class="fixed top-0 pt-12 md:pt-16 pb-6 px-3 md:pt-20 bg-white w-72 h-full overflow-y-auto"
  >
    <div class="sticky top-0">
      <NavLinks v-if="showNavLinks" is-vertical />
      <carbon-ads v-if="showAds" />
      <slot name="top" />
      <SidebarLinks :depth="0" :items="items" />
      <slot name="bottom" />
    </div>
  </aside>
</template>

<script>
import CarbonAds from '@theme/components/CarbonAds.vue';
import SidebarLinks from '@theme/components/SidebarLinks.vue';
import NavLinks from '@theme/components/NavLinks.vue';

export default {
  name: 'Sidebar',
  components: { CarbonAds, SidebarLinks, NavLinks },
  props: {
    items: Array,
    showNavLinks: Boolean,
    showAds: Boolean,
  },
};
</script>
