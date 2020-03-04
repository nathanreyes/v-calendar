<template>
  <nav
    :class="[isVertical ? 'py-2 border-b' : '']"
    v-if="userLinks.length || repoLink"
  >
    <!--User links-->
    <div
      class="font-medium"
      :class="[
        isVertical ? 'block px-6 py-2' : 'inline-block text-sm px-3 py-0',
      ]"
      v-for="item in userLinks"
      :key="item.link"
    >
      <DropdownLink v-if="item.type === 'links'" :item="item" />
      <NavLink v-else :item="item" />
    </div>
    <!--Repo link-->
    <a
      v-if="repoLink"
      :href="repoLink"
      class="inline-block md:text-sm font-medium px-6 md:px-3 py-2 md:py-0"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ repoLabel }}
      <OutboundLink />
    </a>
  </nav>
</template>

<script>
import DropdownLink from '@theme/components/DropdownLink.vue';
import { resolveNavLinkItem } from '../util';
import NavLink from '@theme/components/NavLink.vue';

export default {
  components: { NavLink, DropdownLink },
  props: {
    isVertical: Boolean,
  },
  computed: {
    userNav() {
      return this.$themeLocaleConfig.nav || this.$site.themeConfig.nav || [];
    },
    nav() {
      const { locales } = this.$site;
      if (locales && Object.keys(locales).length > 1) {
        const currentLink = this.$page.path;
        const routes = this.$router.options.routes;
        const themeLocales = this.$site.themeConfig.locales || {};
        const languageDropdown = {
          text: this.$themeLocaleConfig.selectText || 'Languages',
          ariaLabel: this.$themeLocaleConfig.ariaLabel || 'Select language',
          items: Object.keys(locales).map(path => {
            const locale = locales[path];
            const text =
              (themeLocales[path] && themeLocales[path].label) || locale.lang;
            let link;
            // Stay on the current page
            if (locale.lang === this.$lang) {
              link = currentLink;
            } else {
              // Try to stay on the same page
              link = currentLink.replace(this.$localeConfig.path, path);
              // fallback to homepage
              if (!routes.some(route => route.path === link)) {
                link = path;
              }
            }
            return { text, link };
          }),
        };
        return [...this.userNav, languageDropdown];
      }
      return this.userNav;
    },
    userLinks() {
      return (this.nav || []).map(link => {
        return Object.assign(resolveNavLinkItem(link), {
          items: (link.items || []).map(resolveNavLinkItem),
        });
      });
    },
    repoLink() {
      const { repo } = this.$site.themeConfig;
      if (repo) {
        return /^https?:/.test(repo) ? repo : `https://github.com/${repo}`;
      }
      return null;
    },
    repoLabel() {
      if (!this.repoLink) return;
      if (this.$site.themeConfig.repoLabel) {
        return this.$site.themeConfig.repoLabel;
      }

      const repoHost = this.repoLink.match(/^https?:\/\/[^/]+/)[0];
      const platforms = ['GitHub', 'GitLab', 'Bitbucket'];
      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i];
        if (new RegExp(platform, 'i').test(repoHost)) {
          return platform;
        }
      }

      return 'Source';
    },
  },
};
</script>
