<template>
  <div
    ref='popover'
    :class='["popover-container", { expanded: isExpanded }]'
    :tabindex='visibilityIsManaged ? 0 : undefined'
    @focusin='focusin'
    @focusout='focusout'
    @mouseleave='mouseleave'
    @mouseover='mouseover'>
    <transition
      name='slide-fade'
      tag='div'
      @before-enter='beforeContentEnter'
      @after-enter='afterContentEnter'
      @before-leave='beforeContentLeave'
      @after-leave='afterContentLeave'>
      <div
        ref='popoverOrigin'
        :class='["popover-origin", "direction-" + direction, "align-" + align]'
        v-if='visibleAfterDelay'>
        <div
          :class='["popover-content-wrapper", "direction-" + direction, "align-" + align]'>
          <div
            ref='popoverContent'
            :class='["popover-content", "direction-" + direction, "align-" + align]'
            :style='contentStyle_'>
            <div
              class='popover-content-mask'
              :style='maskStyle_'>
              <slot name='popover-content'>
                <div>Popover content goes here</div>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <slot>
      <div>Popover trigger goes here</div>
    </slot>
  </div>
</template>

<script>
import Vue from 'vue';
import defaults from '../utils/defaults';
import { ancestorElements } from '../utils/helpers';
import { POPOVER_VISIBILITIES as VISIBILITIES } from '../utils/constants';

export default {
  props: {
    isExpanded: { type: Boolean, default: () => defaults.popoverExpanded },
    direction: { type: String, default: () => defaults.popoverDirection },
    align: { type: String, default: () => defaults.popoverAlign },
    visibility: { type: String, default: () => defaults.popoverVisibility },
    visibleDelay: { type: Number, default: () => defaults.popoverVisibleDelay }, // ms
    hiddenDelay: { type: Number, default: () => defaults.popoverHiddenDelay }, // ms
    forceHidden: Boolean,
    forceHiddenDelay: { type: Number, default: -1 },
    contentStyle: Object,
    contentOffset: { type: String, default: () => defaults.popoverContentOffset },
  },
  data() {
    return {
      visibleManaged: false,
      visibleAfterDelay: false,
      touchState: null,
      contentTransitioning: false,
    };
  },
  computed: {
    contentStyle_() {
      const style = { ...this.contentStyle };
      style[this.contentOffsetMargin] = this.contentOffset;
      delete style.zIndex;
      delete style.padding;
      return style;
    },
    maskStyle_() {
      const cs = this.contentStyle;
      const style = {};
      if (cs && cs.padding) style.padding = cs.padding;
      return style;
    },
    contentOffsetMargin() {
      switch (this.direction) {
        case 'bottom': return 'marginTop';
        case 'top': return 'marginBottom';
        case 'left': return 'marginRight';
        case 'right': return 'marginLeft';
        default: return '';
      }
    },
    visibilityIsManaged() {
      return VISIBILITIES.isManaged(this.visibility);
    },
    hiddenDelay_() {
      return this.forceHidden && this.forceHiddenDelay >= 0 ? this.forceHiddenDelay : this.hiddenDelay;
    },
    visibleBeforeDelay() {
      return this.visibilityIsManaged ? this.visibleManaged : this.visibility === VISIBILITIES.VISIBLE;
    },
  },
  watch: {
    forceHidden() {
      // Reset managed visible state
      if (this.visibleManaged) this.visibleManaged = false;
      else this.$emit('update:forceHidden', false);
    },
    visibility() {
      // Reset managed visible state
      this.visibleManaged = false;
    },
    visibleBeforeDelay(val) {
      // Ignore if already waiting for a visibility change
      if (val === this.visibleAfterDelay) return;
      // Delay visibility change?
      if ((val && this.visibleDelay) || (!val && this.hiddenDelay_)) {
        setTimeout(() => {
          // Update visible state if it remained constant after delay
          if (val === this.visibleBeforeDelay || this.forceHidden) this.visibleAfterDelay = val;
        }, val ? this.visibleDelay : this.hiddenDelay_);
      } else {
        // Update visible state immediately
        this.visibleAfterDelay = val;
      }
    },
    visibleAfterDelay(val) {
      // Reset forceHidden state if needed
      if (!val && this.forceHidden) this.$emit('update:forceHidden', false);
    },
  },
  created() {
    this.visibleAfterDelay = this.visibleBeforeDelay;
    window.addEventListener('touchstart', this.touchStart);
    window.addEventListener('touchend', this.touchEnd);
  },
  methods: {
    touchStart(e) {
      if (!this.viewTouched(e.target)) {
        const t = e.targetTouches[0];
        this.touchState = {
          started: true,
          startedOn: new Date(),
          startX: t.screenX,
          startY: t.screenY,
          x: t.screenX,
          y: t.screenY,
        };
      }
    },
    viewTouched(element) {
      if (element === this.$refs.popover) return element;
      if (element.parentNode) return this.viewTouched(element.parentNode);
      return undefined;
    },
    touchEnd(e) {
      if (!this.touchState || !this.touchState.started) return;
      const t = e.changedTouches[0];
      const state = this.touchState;
      state.x = t.screenX;
      state.y = t.screenY;
      state.tapDetected = new Date() - state.startedOn <= defaults.maxTapDuration &&
        Math.abs(state.x - state.startX) <= defaults.maxTapTolerance &&
        Math.abs(state.y - state.startY) <= defaults.maxTapTolerance;
      if (state.tapDetected) this.visibleManaged = false;
      state.started = false;
    },
    focusin(e) {
      if (this.visibility === VISIBILITIES.FOCUS) this.visibleManaged = true;
      this.$emit('focusin', e);
    },
    focusout(e) {
      if (this.visibility === VISIBILITIES.FOCUS) {
        // Trap focus if element losing focus is nested within the popover content
        if (e.target !== this.$refs.popover && ancestorElements(e.target).includes(this.$refs.popoverContent)) {
          Vue.nextTick(() => this.$refs.popover.focus());
        }
        this.visibleManaged = false;
      }
      this.$emit('focusout', e);
    },
    mouseleave() {
      if (this.visibility === VISIBILITIES.HOVER && !this.forceHidden) {
        this.visibleManaged = false;
      }
    },
    mouseover(e) {
      const ignoreHover = e.target === this.$refs.popoverOrigin;
      if (this.visibility === VISIBILITIES.HOVER && !this.forceHidden && !this.contentTransitioning) {
        // Show if moused over, but ignore the popover origin because it is transformed
        this.visibleManaged = !ignoreHover;
      }
    },
    beforeContentEnter() {
      this.contentTransitioning = true;
      this.$emit('willAppear');
    },
    afterContentEnter() {
      this.contentTransitioning = false;
      this.$emit('didAppear');
    },
    beforeContentLeave() {
      this.contentTransitioning = true;
      this.$emit('willDisappear');
    },
    afterContentLeave() {
      this.contentTransitioning = false;
      this.$emit('didDisappear');
      // Reset forceHidden state if needed
      if (this.forceHidden) this.$emit('update:forceHidden', false);
    },
  },
};
</script>

<style lang='sass' scoped>

@import '../styles/vars.sass'

.popover-container
  position: relative
  display: inline-block
  outline: none
  &.expanded
    display: block

.popover-origin
  position: absolute
  transform-origin: top center
  z-index: 10
  &.direction-top
    bottom: 100%
  &.direction-bottom
    top: 100%
  &.direction-left
    top: 0
    right: 100%
  &.direction-right
    top: 0
    left: 100%
  &.direction-bottom.align-left, &.direction-top.align-left
    left: 0
  &.direction-bottom.align-center, &.direction-top.align-center
    left: 50%
  &.direction-bottom.align-right, &.direction-top.align-right
    right: 0
  &.direction-left.align-top, &.direction-right.align-top
    top: 0
  &.direction-left.align-middle, &.direction-right.align-middle
    top: 50%
  &.direction-left.align-bottom, &.direction-right.align-bottom
    top: initial
    bottom: 0
  .popover-content-wrapper
    position: relative
    outline: none
    &.align-center
      transform: translateX(-50%)
    &.align-middle
      transform: translateY(-50%)
    .popover-content
      position: relative
      background-color: $popoverBackgroundColor
      border: $popoverBorder
      border-radius: $popoverBorderRadius
      box-shadow: $popoverBoxShadow
      .popover-content-mask
        position: relative
        z-index: 1
        border-radius: inherit
        padding: $popoverPadding
        overflow: hidden
      &:after
        display: block
        position: absolute
        background: inherit
        border: inherit
        border-width: 1px 1px 0 0
        width: 12px
        height: 12px
        content: ''
      &.direction-bottom
        margin-top: $popoverOffset
        &:after
          top: 0
          border-width: 1px 1px 0 0
      &.direction-top
        margin-bottom: $popoverOffset
        &:after
          top: 100%
          border-width: 0 0 1px 1px
      &.direction-left
        margin-right: $popoverOffset
        &:after
          left: 100%
          border-width: 0 1px 1px 0
      &.direction-right
        margin-left: $popoverOffset
        &:after
          left: 0
          border-width: 1px 0 0 1px
      &.align-left
        &:after
          left: $popoverCaretHorizontalOffset
          transform: translateY(-50%) translateX(-50%) rotate(-45deg)
      &.align-right
        &:after
          right: $popoverCaretHorizontalOffset
          transform: translateY(-50%) translateX(50%) rotate(-45deg)
      &.align-center
        &:after
          left: 50%
          transform: translateY(-50%) translateX(-50%) rotate(-45deg)
      &.align-top
        &:after
          top: $popoverCaretVerticalOffset
          transform: translateY(-50%) translateX(-50%) rotate(-45deg)
      &.align-middle
        &:after
          top: 50%
          transform: translateY(-50%) translateX(-50%) rotate(-45deg)
      &.align-bottom
        &:after
          bottom: $popoverCaretVerticalOffset
          transform: translateY(50%) translateX(-50%) rotate(-45deg)

.slide-fade-enter-active, .slide-fade-leave-active
  transition: all $popoverTransitionTime

.slide-fade-enter, .slide-fade-leave-to
  opacity: 0
  &.direction-bottom
    transform: translateY(-$popoverSlideTranslation)
  &.direction-top
    transform: translateY($popoverSlideTranslation)
  &.direction-left
    transform: translateX($popoverSlideTranslation)
  &.direction-right
    transform: translateX(-$popoverSlideTranslation)

</style>
