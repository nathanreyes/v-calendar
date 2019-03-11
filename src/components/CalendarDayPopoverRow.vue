<template>
  <!-- Content row -->
  <div class="vc-day-popover-row">
    <!-- Indicator -->
    <div v-if="!hideIndicator && indicatorStyle" class="vc-day-popover-row-indicator">
      <span :style="indicatorStyle"></span>
    </div>
    <!-- Content -->
    <div class="vc-day-popover-row-content">
      <slot>This is the default content slot.</slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    attribute: Object,
    hideIndicator: Boolean,
  },
  computed: {
    indicatorStyle() {
      const { highlight, dot, bar } = this.attribute;
      if (highlight) {
        return {
          backgroundColor: highlight.backgroundColor,
          width: '10px',
          height: '5px',
          borderRadius: '3px',
          opacity: highlight.opacity,
        };
      }
      if (dot) {
        return {
          backgroundColor: dot.backgroundColor,
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          opacity: dot.opacity,
        };
      }
      if (bar) {
        return {
          backgroundColor: bar.backgroundColor,
          width: '10px',
          height: '3px',
          opacity: bar.opacity,
        };
      }
      // if (contentStyle) {
      //   return {
      //     backgroundColor: contentStyle.color,
      //     width: '5px',
      //     height: '5px',
      //   };
      // }
      return null;
    },
  },
};
</script>

<style lang='sass' scoped>

@import '../styles/vars.sass'

.vc-day-popover-row
  display: flex
  align-items: center
  padding: 2px 5px
  transition: all $day-content-transition-time
  &:not(:first-child)
    margin-top: 3px
  .vc-day-popover-row-indicator
    display: flex
    justify-content: center
    align-items: center
    flex-grow: 0
    width: 15px
    margin-right: 3px
    span
      transition: all $day-content-transition-time
  .vc-day-popover-row-content
    display: flex
    align-items: center
    flex-wrap: none
    flex-grow: 1
    width: max-content
    transition: all $day-content-transition-time

</style>
