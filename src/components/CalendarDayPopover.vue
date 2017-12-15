<template>
<div
  class='c-popover-container'
  ref='popoverContainer'>
  <popover
    v-bind='$attrs'
    :style='popoverStyle'
    :visibility='isVisible ? "visible" : "hidden"'
    :content-style='contentStyle'>
    <div slot='popover-content'>
      <div
        ref='popoverContent'
        tabindex='0'
        :class='["c-popover-content", { "is-dark": isDark }]'>
        <slot
          v-if='$slots.popover'
          name='popover'
          :attribute='displayAttribute'
          :day-info='dayInfo'>
        </slot>
        <!-- <span v-if='displayLabel'>{{ displayLabel }}</span> -->
      </div>
    </div>
    <div></div>
  </popover>
</div>
</template>

<script>
import Popover from './Popover';
import { isString, isFunction } from '../utils/typeCheckers';
import {
  elementPositionInAncestor,
  getLastArrayItem,
} from '../utils/helpers';

export default {
  components: {
    Popover,
  },
  props: {
    isVisible: Boolean,
    dayInfo: Object,
    attributes: Object,
    isDark: Boolean,
  },
  data() {
    return {
      popoverStyle: null,
      hasFocus: false,
    };
  },
  watch: {
    dayInfo() {
      this.refreshPopoverStyle();
    },
    displayAttribute() {
      this.refreshPopoverStyle();
    },
  },
  methods: {
    refreshPopoverStyle() {
      if (!this.dayInfo || !this.displayAttribute) return;
      const el = this.dayInfo.el;
      const location = elementPositionInAncestor(el, this.$refs.popoverContainer.offsetParent);
      this.popoverStyle = {
        width: `${el.offsetWidth}px`,
        height: `${el.offsetHeight}px`,
        top: `${location.top}px`,
        left: `${location.left}px`,
      };
    },
  },
  computed: {
    popoverAttributes() {
      if (!this.attributes) return [];
      return Object.values(this.attributes).filter(a => a.popover);
    },
    displayAttribute() {
      return getLastArrayItem(this.popoverAttributes);
    },
    displayLabel() {
      const attr = this.displayAttribute;
      const label = attr && attr.popover.label;
      if (isString(label)) return label;
      if (isFunction(label)) return label(attr, this.dayInfo);
      return '';
    },
    contentStyle() {
      const base = {
        minWidth: '100px',
        fontSize: '.8rem',
      };
      if (this.isDark) {
        return {
          ...base,
          color: '#fafafa',
          backgroundColor: '#333333',
        };
      }
      return {
        ...base,
        color: '#333333',
      };
    },
  },
};
</script>

<style lang='sass' scoped>

.c-popover-container
  position: absolute
  pointer-events: none
  white-space: nowrap

.c-popover-content
  pointer-events: all

</style>
