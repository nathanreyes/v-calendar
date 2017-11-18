<template>
  <div
    ref='popover'
    :class='["popover-container", { expanded: isExpanded }]'
    :tabindex='visibilityIsManaged ? 0 : undefined'
    @focusin='focusin'
    @focusout='focusout'
    @mouseleave='mouseleave'
    @mouseover='mouseover'>
    <transition name='slide-fade' tag='div'>
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
import { composedPath } from '../utils/helpers';
import { maxTapTolerance, maxTapDuration } from '../utils/defaults';
import { POPOVER_VISIBILITIES as VISIBILITIES } from '../utils/constants';

export default {
  props: {
    isExpanded: Boolean,
    direction: { type: String, default: 'bottom' },
    align: { type: String, default: 'left' },
    visibility: { type: String, default: VISIBILITIES.HOVER },
    enterDelay: { type: Number, default: 200 }, // ms
    leaveDelay: { type: Number, default: 300 }, // ms
    forceHidden: Boolean,
    forceHiddenDelay: { type: Number, default: -1 },
    contentStyle: Object,
  },
  data() {
    return {
      visibleManaged: false,
      visibleAfterDelay: false,
      touchState: null,
    };
  },
  computed: {
    leaveDelay_() {
      return this.forceHidden && this.forceHiddenDelay >= 0 ? this.forceHiddenDelay : this.leaveDelay;
    },
    visibilityIsManaged() {
      return VISIBILITIES.isManaged(this.visibility);
    },
    visibleBeforeDelay() {
      if (this.visibilityIsManaged) return this.forceHidden ? false : this.visibleManaged;
      return this.visibility === VISIBILITIES.VISIBLE;
    },
    contentStyle_() {
      const style = { ...this.contentStyle };
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
  },
  watch: {
    forceHidden() {
      // Reset managed visibile state
      this.visibleManaged = false;
    },
    visibility() {
      // Reset managed visibile state
      this.visibleManaged = false;
    },
    visibleBeforeDelay(val) {
      // Ignore if already waiting for a visibility change
      if (val === this.visibleAfterDelay) return;
      // Delay visibility change?
      if ((val && this.enterDelay) || (!val && this.leaveDelay_)) {
        setTimeout(() => {
          if (val === this.visibleBeforeDelay) this.visibleAfterDelay = val;
        }, val ? this.enterDelay : this.leaveDelay_);
      } else {
        this.visibleAfterDelay = val;
      }
    },
    visibleAfterDelay(val) {
      if (!val && this.forceHidden) {
        setTimeout(() => {
          this.$emit('update:forceHidden', false);
        }, 300);
      }
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
      state.tapDetected = new Date() - state.startedOn <= maxTapDuration &&
        Math.abs(state.x - state.startX) <= maxTapTolerance &&
        Math.abs(state.y - state.startY) <= maxTapTolerance;
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
        if (e.target !== this.$refs.popover && composedPath(e.target).includes(this.$refs.popoverContent)) {
          Vue.nextTick(() => this.$refs.popover.focus());
        }
        this.visibleManaged = false;
      }
      this.$emit('focusout', e);
    },
    mouseleave() {
      if (this.visibility === VISIBILITIES.HOVER) this.visibleManaged = false;
    },
    mouseover(e) {
      // Show if moused over, but ignore the popover origin because it is transformed
      if (this.visibility === VISIBILITIES.HOVER) this.visibleManaged = e.target !== this.$refs.popoverOrigin;
    },
  },
};
</script>

<style lang='sass' scoped>

@import '../styles/vars.sass'

.popover-container
  position: relative
  display: inline-block
  z-index: 1
  outline: none
  &.expanded
    display: block

.popover-origin
  position: absolute
  transform-origin: top center
  z-index: -1
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
        background-color: inherit
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
