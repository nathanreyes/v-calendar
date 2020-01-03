<template>
  <svg
    class="vc-svg-icon"
    :width="width"
    :height="height"
    :viewBox="viewBox"
    v-on="$listeners"
  >
    <path :d="path" />
  </svg>
</template>

<script>
const _defSize = '26px';
const _defViewBox = '0 0 32 32';

const icons = {
  'left-arrow': {
    viewBox: '0 -1 16 34',
    path:
      'M11.196 10c0 0.143-0.071 0.304-0.179 0.411l-7.018 7.018 7.018 7.018c0.107 0.107 0.179 0.268 0.179 0.411s-0.071 0.304-0.179 0.411l-0.893 0.893c-0.107 0.107-0.268 0.179-0.411 0.179s-0.304-0.071-0.411-0.179l-8.321-8.321c-0.107-0.107-0.179-0.268-0.179-0.411s0.071-0.304 0.179-0.411l8.321-8.321c0.107-0.107 0.268-0.179 0.411-0.179s0.304 0.071 0.411 0.179l0.893 0.893c0.107 0.107 0.179 0.25 0.179 0.411z',
  },
  'right-arrow': {
    viewBox: '-5 -1 16 34',
    path:
      'M10.625 17.429c0 0.143-0.071 0.304-0.179 0.411l-8.321 8.321c-0.107 0.107-0.268 0.179-0.411 0.179s-0.304-0.071-0.411-0.179l-0.893-0.893c-0.107-0.107-0.179-0.25-0.179-0.411 0-0.143 0.071-0.304 0.179-0.411l7.018-7.018-7.018-7.018c-0.107-0.107-0.179-0.268-0.179-0.411s0.071-0.304 0.179-0.411l0.893-0.893c0.107-0.107 0.268-0.179 0.411-0.179s0.304 0.071 0.411 0.179l8.321 8.321c0.107 0.107 0.179 0.268 0.179 0.411z',
  },
};

export default {
  props: ['name'],
  data() {
    return {
      width: _defSize,
      height: _defSize,
      viewBox: _defViewBox,
      path: '',
      isBaseline: false,
    };
  },
  mounted() {
    this.updateIcon();
  },
  watch: {
    name() {
      this.updateIcon();
    },
  },
  methods: {
    updateIcon() {
      const icon = icons[this.name];
      if (icon) {
        this.width = icon.width || _defSize;
        this.height = icon.height || _defSize;
        this.viewBox = icon.viewBox;
        this.path = icon.path;
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.vc-svg-icon {
  display: inline-block;
  stroke: currentColor;
  stroke-width: 0;
  & path {
    fill: currentColor;
  }
}
</style>
