<template>
  <svg
    :class='["icon", { "baseline": baseline }]'
    v-bind='$attrs'
    v-on='$listeners'>
    <use :xlink:href='glyph' />
  </svg>
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

<style scoped>
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  align-self: center;
  position: relative;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  line-height: 1;
}

.icon:hover {
  fill-opacity: 0.5;
}

.icon svg {
  width: 1em;
  height: 1em;
}

.icon.baseline svg {
  bottom: -0.125em;
  position: absolute;
}
</style>