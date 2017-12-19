<template>
<div
  ref='popover'
  :class='["popover-container", { expanded: isExpanded }]'
  :tabindex='visibilityIsManaged ? 0 : undefined'
  @focusin='focusin'
  @focusout='focusout'
  @mouseleave='mouseleave'
  @mousemove='mousemove'
  @click.stop='click'>
  <transition
    tag='div'
    :name='transition'
    @before-enter='beforeContentEnter'
    @after-enter='afterContentEnter'
    @before-leave='beforeContentLeave'
    @after-leave='afterContentLeave'>
    <div
      ref='popoverOrigin'
      :class='["popover-origin", "direction-" + direction, "align-" + align]'
      v-if='visible'>
      <div
        ref='popoverContentWrapper'
        :class='["popover-content-wrapper", "direction-" + direction, "align-" + align, { "interactive": isInteractive }]'
        :style='contentWrapperStyle'>
        <div
          ref='popoverContent'
          :class='["popover-content", "direction-" + direction, "align-" + align]'
          :style='contentStyle'>
          <slot name='popover-content'>
            <div>Popover content goes here</div>
          </slot>
        </div>
      </div>
    </div>
  </transition>
  <slot>
    <span>Popover trigger goes here</span>
  </slot>
</div>
</template>

<script>
import defaults from '../utils/defaults';
import { elementHasAncestor } from '../utils/helpers';
import { POPOVER_VISIBILITIES as VISIBILITIES } from '../utils/constants';

export default {
  props: {
    isExpanded: { type: Boolean, default: () => defaults.popoverExpanded },
    direction: { type: String, default: () => defaults.popoverDirection },
    align: { type: String, default: () => defaults.popoverAlign },
    visibility: { type: String, default: () => defaults.popoverVisibility },
    isInteractive: Boolean,
    forceHidden: Boolean,
    toggleVisibleOnClick: Boolean, // Only valid when visibility === "focus"
    contentStyle: Object,
    contentOffset: { type: String, default: () => defaults.popoverContentOffset },
    transition: { type: String, default: 'slide-fade' },
  },
  data() {
    return {
      visibleManaged: false,
      contentTransitioning: false,
      disableNextClick: false,
    };
  },
  computed: {
    contentWrapperStyle() {
      const style = {};
      style[`padding${this.contentOffsetDirection}`] = this.contentOffset;
      return style;
    },
    contentOffsetDirection() {
      switch (this.direction) {
        case 'bottom': return 'Top';
        case 'top': return 'Bottom';
        case 'left': return 'Right';
        case 'right': return 'Left';
        default: return '';
      }
    },
    visibilityIsManaged() {
      return VISIBILITIES.isManaged(this.visibility);
    },
    visible() {
      return this.visibilityIsManaged ? this.visibleManaged : this.visibility === VISIBILITIES.VISIBLE;
    },
  },
  watch: {
    forceHidden() {
      // Reset managed visible state
      if (this.visibleManaged) this.visibleManaged = false;
      else {
        this.$emit('update:forcehidden', false);
        this.$emit('update:forceHidden', false);
      }
    },
  },
  created() {
    window.addEventListener('click', this.windowClick);
  },
  methods: {
    focusin() {
      if (this.visibility === VISIBILITIES.FOCUS && !this.visibleManaged && !this.contentTransitioning) {
        this.visibleManaged = true;
        this.disableNextClick = true;
      }
    },
    click(e) {
      if (
        this.visibility === VISIBILITIES.FOCUS
        && this.toggleVisibleOnClick
        && !this.contentTransitioning
        && elementHasAncestor(e.target, this.$refs.popover)
        && !elementHasAncestor(e.target, this.$refs.popoverOrigin)) {
        if (!this.disableNextClick) {
          this.visibleManaged = !this.visibleManaged;
        }
      }
      this.disableNextClick = false;
    },
    windowClick(e) {
      if (this.visibility === VISIBILITIES.FOCUS && this.visibleManaged && !elementHasAncestor(e.target, this.$refs.popover)) {
        this.visibleManaged = false;
      }
    },
    focusout(e) {
      if (this.visibility === VISIBILITIES.FOCUS && this.visibleManaged && !elementHasAncestor(e.relatedTarget, this.$refs.popover)) {
        this.visibleManaged = false;
      }
    },
    // mouseover() {
    //   if (this.visibility === VISIBILITIES.HOVER && !this.forceHidden && !this.contentTransitioning) {
    //     this.visibleManaged = true;
    //   }
    // },
    mousemove() {
      if (
        (this.visibility === VISIBILITIES.HOVER || !this.visibilityIsManaged) &&
        !this.forceHidden &&
        !this.contentTransitioning) {
        this.visibleManaged = true;
      }
    },
    mouseleave(e) {
      if (
        (this.visibility === VISIBILITIES.HOVER || !this.visibilityIsManaged) &&
        !this.forceHidden &&
        !elementHasAncestor(e.relatedTarget, this.$refs.popover)) {
        this.visibleManaged = false;
      }
    },
    beforeContentEnter() {
      this.contentTransitioning = true;
      this.$emit('willappear');
    },
    afterContentEnter() {
      this.contentTransitioning = false;
      this.$emit('didappear');
    },
    beforeContentLeave() {
      this.contentTransitioning = true;
      this.$emit('willdisappear');
    },
    afterContentLeave() {
      this.contentTransitioning = false;
      this.$emit('diddisappear');
      // Reset forceHidden state if needed
      if (this.forceHidden) {
        this.$emit('update:forcehidden', false);
        this.$emit('update:forceHidden', false);
      }
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
  pointer-events: none
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
    &.interactive
      pointer-events: all
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
      padding: $popoverPadding
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
        &:after
          top: 0
          border-width: 1px 1px 0 0
      &.direction-top
        &:after
          top: 100%
          border-width: 0 0 1px 1px
      &.direction-left
        &:after
          left: 100%
          border-width: 0 1px 1px 0
      &.direction-right
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

.fade-enter-active,
.fade-leave-active,
.slide-fade-enter-active,
.slide-fade-leave-active
  transition: all $popoverTransitionTime

.fade-enter,
.fade-leave-to
  opacity: 0

.slide-fade-enter,
.slide-fade-leave-to
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
