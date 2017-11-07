<template>
  <div
    ref='popover'
    :class='["popover-container", { expanded: isExpanded }]'
    :tabindex='visibility === -1 ? 0 : undefined'
    @focusin='focusin'
    @focusout='focusout'>
    <transition name='slide-fade' tag='div'>
      <div
        :class='["popover-origin", "direction-" + direction, "align-" + align]'
        v-if='visibleDelay'>
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

const POPOVER_AUTO = -1;
const POPOVER_VISIBLE = 1;

export default {
  props: {
    isExpanded: Boolean,
    direction: { type: String, default: 'bottom' },
    align: { type: String, default: 'left' },
    visibility: { type: Number, default: POPOVER_AUTO },
    contentStyle: { type: Object, default: () => ({}) },
    delay: { type: Number, default: 50 }, // Milliseconds
  },
  data() {
    return {
      visible: false,
      visibleDelay: false,
      touchState: null,
    };
  },
  computed: {
    visible_() {
      if (this.visibility === POPOVER_AUTO) return this.visible;
      return this.visibility === POPOVER_VISIBLE;
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
      if (cs.padding) style.padding = cs.padding;
      if (cs.borderRadius) style.borderRadius = cs.borderRadius;
      return style;
    },
  },
  watch: {
    visible_(val) {
      if (!this.delay) {
        this.visibleDelay = val;
      } else {
        setTimeout(() => {
          if (val === this.visible_) this.visibleDelay = val;
        }, this.delay);
      }
    },
  },
  created() {
    window.addEventListener('touchstart', this.touchStart);
    window.addEventListener('touchend', this.touchEnd);
    this.visibleDelay = this.visible_;
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
      if (state.tapDetected) this.visible = false;
      state.started = false;
    },
    focusin(e) {
      this.visible = true;
      this.$emit('focusin', e);
    },
    focusout(e) {
      // Trap focus if element losing focus is nested within the popover content
      if (e.target !== this.$refs.popover && composedPath(e.target).includes(this.$refs.popoverContent)) {
        Vue.nextTick(() => this.$refs.popover.focus());
      }
      this.visible = false;
      this.$emit('focusout', e);
    },
  },
};
</script>

<style lang='sass' scoped>

@import '../styles/vars.sass'

$popoverCaretOffset: 16px

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
        border-radius: $popoverBorderRadius
        padding: $popoverPadding
        overflow: hidden
      &:after
        display: block
        position: absolute
        background-color: $popoverBackgroundColor
        border: $popoverBorder
        border-width: 1px 1px 0 0
        width: 12px
        height: 12px
        content: ''
        transform: translateY(-50%) translateX(-50%) rotate(-45deg)
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
          left: $popoverCaretOffset
      &.align-right
        &:after
          right: $popoverCaretOffset
      &.align-center
        &:after
          left: 50%
      &.align-top
        &:after
          top: $popoverCaretOffset
      &.align-middle
        &:after
          top: 50%
      &.align-bottom
        &:after
          bottom: $popoverCaretOffset

.slide-fade-enter-active, .slide-fade-leave-active
  transition: all $popoverSlideTransitionTime

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
