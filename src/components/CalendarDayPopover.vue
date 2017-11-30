<template>
<div class='c-popover-container' ref='popoverContainer'>
  <popover
    v-bind='$attrs'
    :visibility='dayInfo ? "visible" : "hidden"'
    :style='popoverStyle'
    :content-style='contentStyle'>
    <div slot='popover-content'>
      <div :class='["c-popover-content", { "is-dark": isDark }]'>
        <!-- <span v-for='a in attributes' :key='a.key'>
          {{ getPopoverLabel(a) }}
        </span> -->
        <span>{{ getLabel() }}</span>
      </div>
    </div>
    <div></div>
  </popover>
</div>
</template>

<script>
import Popover from './Popover';
import {
  elementPositionInAncestor,
} from '../utils/helpers';

export default {
  components: {
    Popover,
  },
  props: {
    dayInfo: Object,
    isDark: Boolean,
  },
  data() {
    return {
      popoverStyle: null,
    };
  },
  computed: {
    attributes() {
      if (!this.dayInfo || !this.dayInfo.attributes) return [];
      return this.dayInfo.attributes.filter(a => a.popover);
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
  watch: {
    dayInfo(val) {
      if (!val) return;
      const el = val.el;
      const location = elementPositionInAncestor(el, this.$refs.popoverContainer.offsetParent);
      this.popoverStyle = {
        width: `${el.offsetWidth}px`,
        height: `${el.offsetHeight}px`,
        top: `${location.top}px`,
        left: `${location.left}px`,
      };
    },
  },
  methods: {
    getLabel() {
      return 'This is a test label.';
    },
    getPopoverLabel(attr) {
      const p = attr.popover;
      if (!p) return '';
      if (typeof p.label === 'string') return p.label;
      if (typeof p.label === 'function') return p.label(attr, this.dayInfo);
      return '';
    },
  },
};
</script>

<style lang='sass' scoped>

.c-popover-container
  position: absolute
  pointer-events: none

</style>
