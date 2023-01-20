<template>
  <!-- Content row -->
  <div class="vc-day-popover-row">
    <!-- Indicator -->
    <div v-if="indicator" class="vc-day-popover-row-indicator">
      <span :class="indicator.class" />
    </div>
    <!-- Content -->
    <div class="vc-day-popover-row-label">
      <slot>{{
        attribute.popover ? attribute.popover.label : 'No content provided'
      }}</slot>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, computed } from 'vue';
import { Attribute } from '../../utils/attribute';

export default defineComponent({
  name: 'PopoverRow',
  props: {
    attribute: { type: Object as PropType<Attribute>, required: true },
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

<style lang="css">
.vc-day-popover-row {
  display: flex;
  align-items: center;
  transition: var(--vc-day-content-transition);
}

.vc-day-popover-row-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 0;
  width: 15px;
  & span {
    transition: var(--vc-day-content-transition);
  }
}

.vc-day-popover-row-label {
  display: flex;
  align-items: center;
  flex-wrap: none;
  flex-grow: 1;
  width: max-content;
  margin-left: 4px;
  margin-right: 4px;
  font-size: var(--vc-text-xs);
  line-height: var(--vc-leading-normal);
}

.vc-day-popover-row-highlight {
  width: 8px;
  height: 5px;
  border-radius: 3px;
}

.vc-day-popover-row-dot {
}
.vc-day-popover-row-bar {
  width: 10px;
  height: 3px;
}
</style>
