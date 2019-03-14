<template>
  <!-- Content row -->
  <div class="vc-day-popover-row">
    <!-- Indicator -->
    <div v-if="!hideIndicator && indicator" class="vc-day-popover-row-indicator">
      <span :style="indicator.style" :class="indicator.class"></span>
    </div>
    <!-- Content -->
    <div class="vc-day-popover-row-content">
      <slot>This is the default content slot.</slot>
    </div>
  </div>
</template>

<script>
import { childMixin } from '@/utils/mixins';
export default {
  mixins: [childMixin],
  props: {
    attribute: Object,
    hideIndicator: Boolean,
  },
  computed: {
    indicator() {
      const { highlight, dot, bar } = this.attribute;
      if (highlight) {
        const { color, isDark } = highlight.start;
        return {
          class: this.theme.getConfig('bgAccentHigh', {
            color,
            isDark: !isDark,
          }),
          style: {
            width: '10px',
            height: '5px',
            borderRadius: '3px',
          },
        };
      }
      if (dot) {
        const { color, isDark } = dot.start;
        return {
          class: this.theme.getConfig('bgAccentHigh', {
            color,
            isDark: !isDark,
          }),
          style: {
            width: '5px',
            height: '5px',
            borderRadius: '50%',
          },
        };
      }
      if (bar) {
        const { color, isDark } = bar.start;
        return {
          class: this.theme.getConfig('bgAccentHigh', {
            color,
            isDark: !isDark,
          }),
          style: {
            width: '10px',
            height: '3px',
          },
        };
      }
      // if (content) {
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
  padding: 0 0 2px 0
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
