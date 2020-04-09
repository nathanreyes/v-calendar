<template>
  <header class="fixed w-full bg-white border-b px-4 z-20">
    <div
      class="w-full h-12 md:h-16 flex justify-between items-center max-w-6xl mx-auto"
    >
      <!--Left side-->
      <div class="flex items-center">
        <!--Menu button-->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="inline-block md:hidden w-5 h-5 fill-current text-gray-700 cursor-pointer hover:text-gray-600"
          @click="$emit('toggle-sidebar')"
        >
          <path
            class="secondary"
            fill-rule="evenodd"
            d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
          />
        </svg>
        <!--Title link-->
        <router-link
          :to="$localePath"
          class="text-lg md:text-xl font-semibold truncate ml-3 hover:opacity-50"
        >
          {{ $siteTitle }}
        </router-link>
      </div>
      <!--Right size-->
      <div
        class="flex items-center pl-6"
        :style="
          linksWrapMaxWidth ? { 'max-width': linksWrapMaxWidth + 'px' } : {}
        "
      >
        <AlgoliaSearchBox v-if="isAlgoliaSearch" :options="algolia" />
        <SearchBox
          v-else-if="
            $site.themeConfig.search !== false &&
              $page.frontmatter.search !== false
          "
        />
        <NavLinks class="hidden md:block" />
      </div>
    </div>
  </header>
</template>

<script>
import AlgoliaSearchBox from '@AlgoliaSearchBox';
import SearchBox from '@SearchBox';
import NavLinks from '@theme/components/NavLinks.vue';

export default {
  components: { NavLinks, SearchBox, AlgoliaSearchBox },
  data() {
    return {
      linksWrapMaxWidth: null,
    };
  },
  mounted() {
    const MOBILE_DESKTOP_BREAKPOINT = 719; // refer to config.styl
    const NAVBAR_VERTICAL_PADDING =
      parseInt(css(this.$el, 'paddingLeft')) +
      parseInt(css(this.$el, 'paddingRight'));
    const handleLinksWrapWidth = () => {
      if (document.documentElement.clientWidth < MOBILE_DESKTOP_BREAKPOINT) {
        this.linksWrapMaxWidth = null;
      } else {
        this.linksWrapMaxWidth =
          this.$el.offsetWidth -
          NAVBAR_VERTICAL_PADDING -
          ((this.$refs.siteName && this.$refs.siteName.offsetWidth) || 0);
      }
    };
    handleLinksWrapWidth();
    window.addEventListener('resize', handleLinksWrapWidth, false);
  },
  computed: {
    algolia() {
      return (
        this.$themeLocaleConfig.algolia || this.$site.themeConfig.algolia || {}
      );
    },

    isAlgoliaSearch() {
      return this.algolia && this.algolia.apiKey && this.algolia.indexName;
    },
  },
};

function css(el, property) {
  // NOTE: Known bug, will return 'auto' if style value is 'auto'
  const win = el.ownerDocument.defaultView;
  // null means not to return pseudo styles
  return win.getComputedStyle(el, null)[property];
}
</script>
