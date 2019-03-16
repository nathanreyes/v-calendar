<template>
  <!-- Content row -->
  <div class="vc-day-popover-row">
    <!-- Indicator -->
    <div v-if="indicator" class="vc-day-popover-row-indicator">
      <span :style="indicator.style" :class="indicator.class"></span>
    </div>
    <!-- Content -->
    <div class="vc-day-popover-row-content">
      <slot>No content provided</slot>
    </div>
  </div>
</template>

<script>
import { childMixin } from '@/utils/mixins';
export default {
  mixins: [childMixin],
  props: {
    attribute: Object,
  },
  computed: {
    indicator() {
      const { highlight, dot, bar, content } = this.attribute;
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
      } else if (dot) {
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
      } else if (bar) {
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
      } else if (content) {
        const { color, isDark } = content.start;
        return {
          class: this.theme.getConfig('contentContrast', {
            color,
            isDark: !isDark,
          }),
        };
      }
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

</style>
