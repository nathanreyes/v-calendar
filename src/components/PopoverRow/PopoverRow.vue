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
import { defineComponent, computed } from 'vue';
import { useCalendarContext } from '../../use/calendar';

export default defineComponent({
  name: 'PopoverRow',
  props: {
    attribute: Object,
  },
  setup(props) {
    const { theme } = useCalendarContext();
    const indicator = computed(() => {
      const { highlight, dot, bar, popover } = props.attribute;
      if (popover && popover.hideIndicator) return null;
      if (highlight) {
        const { color, isDark } = highlight.start;
        return {
          style: {
            ...theme.value.bgAccentHigh({
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
            ...theme.value.bgAccentHigh({
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
            ...theme.value.bgAccentHigh({
              color,
              isDark: !isDark,
            }),
            width: '10px',
            height: '3px',
          },
        };
      }
      return null;
    });
    return {
      indicator,
    };
  },
});
</script>
