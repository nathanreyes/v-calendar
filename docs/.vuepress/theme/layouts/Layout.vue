<template>
  <div :class="pageClasses" @touchstart="onTouchStart" @touchend="onTouchEnd">
    <Navbar v-if="shouldShowNavbar" @toggle-sidebar="toggleSidebar" />
    <div class="relative flex w-full max-w-5xl mx-auto">
      <!--Sidebar mask-->
      <div
        v-if="isSidebarOpen"
        class="md:hidden fixed inset-0 w-screen h-full z-10 bg-black opacity-75"
        @click="toggleSidebar(false)"
        @scroll.stop.prevent
      ></div>
      <!--Mobile sidebar-->
      <div
        class="md:hidden z-10"
        :class="[isSidebarOpen ? 'absolute' : 'hidden']"
      >
        <Sidebar
          :items="sidebarItems"
          @toggle-sidebar="toggleSidebar"
          show-nav-links
        >
          <slot name="sidebar-top" #top />
          <slot name="sidebar-bottom" #bottom />
        </Sidebar>
      </div>
      <!--Desktop sidebar-->
      <div class="flex-shrink-0 hidden md:block md:relative z-10 w-72">
        <Sidebar :items="sidebarItems" @toggle-sidebar="toggleSidebar">
          <slot name="sidebar-top" #top />
          <slot name="sidebar-bottom" #bottom />
        </Sidebar>
      </div>
      <!--Main page-->
      <div :class="['flex-grow', 'overflow-y-auto']">
        <!--Home page-->
        <Home v-if="$page.frontmatter.home" />
        <!--Other pages-->
        <Page v-else :sidebar-items="sidebarItems">
          <slot name="page-top" #top />
          <slot name="page-bottom" #bottom />
        </Page>
        <!--Bottom page navigation-->
        <PageNav v-bind="{ sidebarItems }" />
      </div>
    </div>
  </div>
</template>

<script>
import Home from '@theme/components/Home.vue';
import Navbar from '@theme/components/Navbar.vue';
import Page from '@theme/components/Page.vue';
import PageNav from '@theme/components/PageNav.vue';
import Sidebar from '@theme/components/Sidebar.vue';
import { resolveSidebarItems } from '../util';

export default {
  components: { Home, Page, PageNav, Sidebar, Navbar },
  data() {
    return {
      isSidebarOpen: false,
    };
  },
  computed: {
    shouldShowNavbar() {
      const { themeConfig } = this.$site;
      const { frontmatter } = this.$page;
      if (frontmatter.navbar === false || themeConfig.navbar === false) {
        return false;
      }
      return (
        this.$title ||
        themeConfig.logo ||
        themeConfig.repo ||
        themeConfig.nav ||
        this.$themeLocaleConfig.nav
      );
    },
    shouldShowSidebar() {
      const { frontmatter } = this.$page;
      return (
        !frontmatter.home &&
        frontmatter.sidebar !== false &&
        this.sidebarItems.length
      );
    },
    sidebarItems() {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath,
      );
    },
    pageClasses() {
      const userPageClass = this.$page.frontmatter.pageClass;
      return [
        {
          'no-navbar': !this.shouldShowNavbar,
          'sidebar-open': this.isSidebarOpen,
          'no-sidebar': !this.shouldShowSidebar,
        },
        userPageClass,
      ];
    },
  },
  watch: {
    isSidebarOpen(val) {
      document.body.style = val ? 'overflow:hidden' : '';
    },
  },
  mounted() {
    this.$router.afterEach(() => {
      this.isSidebarOpen = false;
    });
  },
  methods: {
    toggleSidebar(to) {
      this.isSidebarOpen = typeof to === 'boolean' ? to : !this.isSidebarOpen;
      this.$emit('toggle-sidebar', this.isSidebarOpen);
    },
    // side swipe
    onTouchStart(e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };
    },
    onTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x;
      const dy = e.changedTouches[0].clientY - this.touchStart.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true);
        } else {
          this.toggleSidebar(false);
        }
      }
    },
  },
};
</script>

<style lang="stylus">
body, html, .app {
  height: 100%;
}
</style>
