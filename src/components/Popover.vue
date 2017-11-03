<template>
  <div
    ref='popover'
    :class='["popover-container", { expanded: isExpanded }]'
    :tabindex='visibility === -1 ? 0 : undefined'
    @focusin='focusin'
    @focusout='focusout'>
    <transition name='slide-fade' tag='div'>
      <div
        :class='["anchor", "direction-" + direction, "align-" + align]'
        v-if='visibleDelay'>
        <div
          :class='["content", "direction-" + direction, "align-" + align]'>
          <slot name='popover-content'>
            <div>Popover content goes here</div>
          </slot>
        </div>
      </div>
    </transition>
    <slot>
      <div>Popover anchor slot goes here</div>
    </slot>
  </div>
</template>

<script>
const POPOVER_AUTO = -1;
const POPOVER_VISIBLE = 1;
const _tapTolerance = 0;
const _tapMaxDuration = 200; // ms

export default {
  props: {
    isExpanded: Boolean,
    direction: { type: String, default: 'bottom' },
    align: { type: String, default: 'left' },
    visibility: { type: Number, default: POPOVER_AUTO },
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
      state.tapDetected = new Date() - state.startedOn <= _tapMaxDuration &&
        Math.abs(state.x - state.startX) <= _tapTolerance &&
        Math.abs(state.y - state.startY) <= _tapTolerance;
      if (state.tapDetected) this.visible = false;
      state.started = false;
    },
    focusin(e) {
      this.visible = true;
      this.$emit('focusin', e);
    },
    focusout(e) {
      this.visible = false;
      this.$emit('focusout', e);
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

.anchor
  position: absolute
  transform-origin: top center
  z-index: -1
  &.direction-top
    bottom: 100%
    margin-bottom: $popoverOffset
  &.direction-bottom
    top: 100%
    margin-top: $popoverOffset
  &.direction-left
    top: 0
    right: 100%
    margin-right: $popoverOffset
  &.direction-right
    top: 0
    left: 100%
    margin-left: $popoverOffset
  &.direction-left.align-top, &.direction-right.align-top
    top: 0
  &.direction-left.align-middle, &.direction-right.align-middle
    top: 50%
  &.direction-left.align-bottom, &.direction-right.align-bottom
    top: initial
    bottom: 0
  &.direction-top.align-left, &.direction-bottom.align-left
    left: 0
  &.direction-top.align-center, &.direction-bottom.align-center
    left: 50%
  &.direction-top.align-right, &.direction-bottom.align-right
    right: 0
  .content
    outline: none
    &.direction-top.align-center, &.direction-bottom.align-center
      margin-left: -50%
    &.direction-left.align-middle, &.direction-right.align-middle
      margin-top: -50%

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
