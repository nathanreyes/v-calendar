<template>
  <div class='popover-container'>
    <slot>
      <div>Popover anchor goes here</div>
    </slot>
    <transition name='slide-fade'>
      <div class='anchor' :class='["direction-" + direction, "align-" + align]' v-if='visible_'>
        <div class='content-container'>
          <div class='content' :class='["direction-" + direction, "align-" + align]'>
            <slot name='popover-content'>
              <div>Popover content goes here</div>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'vPopover',
  data() {
    return {
      visible_: this.visible,
    };
  },
  props: {
    visible: Boolean,
    direction: { type: String, default: 'bottom' },
    align: { type: String, default: 'left' },
    delay: { type: Number, default: 0 }, // Milliseconds
  },
  watch: {
    visible(val) {
      if (!this.delay) {
        this.visible_ = val;
      } else {
        setTimeout(() => {
          if (val === this.visible) this.visible_ = val;
        }, this.delay);
      }
    },
  },
};
</script>

<style lang='sass'>

@import '../styles/vars.sass'

.popover-container
  position: relative

.anchor
  position: absolute
  transform-origin: top center
  z-index: 100
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
  .content-container
    .content
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
