<template>
  <!-- Content row -->
  <div class="vc-day-popover-row">
    <!-- Indicator -->
    <div v-if="indicator" class="vc-day-popover-row-indicator">
      <span :style="indicator.style" :class="indicator.class" />
    </div>
    <!-- Content -->
    <div class="vc-day-popover-row-content">
      <slot>{{
        attribute.popover ? attribute.popover.label : 'No content provided'
      }}</slot>
    </div>
  </div>
</template>

<script>
import { childMixin } from '../../utils/mixins';

export default {
  name: 'PopoverRow',
  mixins: [childMixin],
  props: {
    attribute: Object,
  },
  computed: {
    indicator() {
      const { highlight, dot, bar, popover } = this.attribute;
      if (popover && popover.hideIndicator) return null;
      if (highlight) {
        const { color, isDark } = highlight.start;
        return {
          style: {
            ...this.theme.bgAccentHigh({
              color,
              isDark: !isDark,
            }),
            width: '10px',
            height: '5px',
            borderRadius: '3px',
          },
        };
      }
      if (dot) {
        const { color, isDark } = dot.start;
        return {
          style: {
            ...this.theme.bgAccentHigh({
              color,
              isDark: !isDark,
            }),
            width: '5px',
            height: '5px',
            borderRadius: '50%',
          },
        };
      }
      if (bar) {
        const { color, isDark } = bar.start;
        return {
          style: {
            ...this.theme.bgAccentHigh({
              color,
              isDark: !isDark,
            }),
            width: '10px',
            height: '3px',
          },
        };
      }
      return null;
    },
  },
};
</script>
