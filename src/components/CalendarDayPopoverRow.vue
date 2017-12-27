<template>
<!-- Content row -->
<div
  :class='["c-day-popover-row", { "selectable": isSelectable }]'
  @click='$emit("select")'>
  <!-- Indicator -->
  <div
    v-if='!hideIndicator && indicatorStyle'
    class='c-day-popover-indicator'>
    <span :style='indicatorStyle'></span>
  </div>
  <!-- Content -->
  <div class='c-day-popover-content'>
    <slot>
      This is the default content slot.
    </slot>
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
    isSelectable() {
      return this.$listeners.select;
    },
    indicatorStyle() {
      const attr = this.attribute;
      if (attr.highlight) {
        return {
          backgroundColor: attr.highlight.backgroundColor,
          width: '10px',
          height: '5px',
          borderRadius: '3px',
          opacity: attr.highlight.opacity,
        };
      }
      if (attr.dot) {
        return {
          backgroundColor: attr.dot.backgroundColor,
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          opacity: attr.dot.opacity,
        };
      }
      if (attr.bar) {
        return {
          backgroundColor: attr.bar.backgroundColor,
          width: '10px',
          height: '3px',
          opacity: attr.bar.opacity,
        };
      }
      if (attr.contentStyle) {
        return {
          backgroundColor: attr.contentStyle.color,
          width: '5px',
          height: '5px',
        };
      }
      return null;
    },
  },
};
</script>

<style lang='sass' scoped>

@import '../styles/mixins.sass'

.c-day-popover-row
  display: flex
  align-items: center
  padding: 2px 5px
  transition: all $day-content-transition-time
  &.selectable
    cursor: pointer
    &:hover
      background-color: rgba(0, 0, 0, 0.1)
  &:not(:first-child)
    margin-top: 3px
  .c-day-popover-indicator
    display: flex
    justify-content: center
    align-items: center
    flex-grow: 0
    width: 15px
    margin-right: 3px
    span
      transition: all $day-content-transition-time
  .c-day-popover-content
    display: flex
    align-items: center
    flex-wrap: none
    flex-grow: 1
    transition: all $day-content-transition-time
</style>
