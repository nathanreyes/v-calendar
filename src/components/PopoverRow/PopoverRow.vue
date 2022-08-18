<template>
  <!-- Content row -->
  <div class="vc-day-popover-row">
    <!-- Indicator -->
    <div v-if="indicator" class="vc-day-popover-row-indicator">
      <span :style="indicator.style" :class="indicator.class" />
    </div>
    <!-- Content -->
    <div class="vc-day-popover-row-label">
      <slot>{{
        attribute.popover ? attribute.popover.label : 'No content provided'
      }}</slot>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'PopoverRow',
  props: {
    attribute: Object,
    day: Object,
  },
  setup(props) {
    const indicator = computed(() => {
      const { content, highlight, dot, bar, popover } = props.attribute;
      if (popover && popover.hideIndicator) return null;
      if (content) {
        return {
          class: `vc-bar vc-day-popover-row-bar vc-attr vc-${content.base.color}`,
        };
      }
      if (highlight) {
        return {
          class: `vc-highlight-bg-solid vc-day-popover-row-highlight vc-attr vc-${highlight.base.color}`,
        };
      }
      if (dot) {
        return {
          class: `vc-dot vc-attr vc-${dot.base.color}`,
        };
      }
      if (bar) {
        return {
          class: `vc-bar vc-day-popover-row-bar vc-attr vc-${bar.base.color}`,
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
