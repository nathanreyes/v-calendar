<template>
  <div
    :class='["svg-icon", { "baseline": baseline }]'
    v-bind='$attrs'
    v-on='$listeners'
    v-html='glyph'
    v-once>
  </div>
</template>

<script>
export default {
  props: {
    glyph: null,
    baseline: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang='scss' scoped>
.svg-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  align-self: center;
  position: relative;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  line-height: 1;
  font-size: 1rem;
  &:hover {
    fill-opacity: 0.5;
  }
  & /deep/ svg {
    width: 100%;
    height: 100%;
  }
}

</style>