<template>
  <router-link
    class="text-gray-700 hover:text-indigo-600"
    :to="link"
    @focusout.native="focusoutAction"
    v-if="!isExternal(link)"
    :exact="exact"
    >{{ item.text }}</router-link
  >
  <a
    v-else
    class="text-gray-700 hover:text-indigo-600"
    :href="link"
    @focusout="focusoutAction"
    :target="isMailto(link) || isTel(link) ? null : '_blank'"
    :rel="isMailto(link) || isTel(link) ? null : 'noopener noreferrer'"
  >
    {{ item.text }}
    <OutboundLink />
  </a>
</template>

<script>
import { isExternal, isMailto, isTel, ensureExt } from '../util';

export default {
  props: {
    item: {
      required: true,
    },
  },

  computed: {
    link() {
      return ensureExt(this.item.link);
    },

    exact() {
      if (this.$site.locales) {
        return Object.keys(this.$site.locales).some(
          rootLink => rootLink === this.link,
        );
      }
      return this.link === '/';
    },
  },

  methods: {
    isExternal,
    isMailto,
    isTel,
    focusoutAction() {
      this.$emit('focusout');
    },
  },
};
</script>
