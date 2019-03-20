<script>
import Popper from 'popper.js';
import { on, off, elementContains } from '@/utils/helpers';
import { addTapOrClickHandler } from '@/utils/touch';
import { isFunction } from '@/utils/_';

export default {
  render(h) {
    return h(
      'div',
      {
        class: 'vc-popover-content-wrapper',
        attrs: {
          tabindex: this.isInteractive ? 0 : -1,
        },
        ref: 'popover',
      },
      [
        h(
          'transition',
          {
            props: {
              name: this.transition,
              appear: true,
            },
            on: {
              afterLeave: this.afterLeave,
            },
          },
          [
            this.isVisible &&
              h(
                'div',
                {
                  class: [
                    'vc-popover-content',
                    `direction-${this.direction}`,
                    this.contentClass,
                  ],
                },
                [
                  this.content,
                  h('span', {
                    class: [
                      'vc-popover-caret',
                      `direction-${this.direction}`,
                      `align-${this.align}`,
                    ],
                  }),
                ],
              ),
          ],
        ),
      ],
    );
  },
  props: {
    id: { type: String, required: true },
    placement: { type: String, default: 'top-end' },
    transition: { type: String, default: 'slide-fade' },
    contentClass: String,
  },
  data() {
    return {
      ref: null,
      args: null,
      visibility: '',
      isInteractive: false,
      delay: 10,
      direction: 'bottom',
      align: 'center',
    };
  },
  computed: {
    content() {
      return (
        (isFunction(this.$scopedSlots.default) &&
          this.$scopedSlots.default({
            direction: this.direction,
            align: this.align,
            args: this.args,
            updateLayout: this.scheduleUpdate,
            hide: this.onHide,
          })) ||
        this.$slots.default
      );
    },
    popperOptions() {
      return {
        placement: this.placement,
        onCreate: this.onPopperUpdate,
        onUpdate: this.onPopperUpdate,
      };
    },
    isVisible() {
      return !!(
        this.ref &&
        (this.$scopedSlots.default || this.$slots.default) &&
        this.visibility !== 'hidden'
      );
    },
  },
  watch: {
    ref(val) {
      this.setupPopper();
      this.$vc.activeRefs = {
        ...this.$vc.activeRefs,
        [this.id]: val,
      };
    },
  },
  created() {
    this.$vc.$on(`show:${this.id}`, this.onShow);
    this.$vc.$on(`hide:${this.id}`, this.onHide);
    this.$vc.$on(`update:${this.id}`, this.onUpdate);
    this.$once('beforeDestroy', () => {
      this.$vc.$off(`show:${this.id}`, this.onShow);
      this.$vc.$off(`hide:${this.id}`, this.onHide);
      this.$vc.$off(`update:${this.id}`, this.onUpdate);
    });
    this.refreshPlacements(this.placement);
  },
  mounted() {
    this.addEvents();
  },
  beforeDestroy() {
    this.removeEvents();
  },
  methods: {
    addEvents() {
      on(this.$refs.popover, 'mouseover', this.onMouseOver);
      on(this.$refs.popover, 'mouseleave', this.onMouseLeave);
      on(this.$refs.popover, 'focusin', this.onFocusIn);
      on(this.$refs.popover, 'blur', this.onBlur);
      this.removeDocHandler = addTapOrClickHandler(
        document,
        this.onDocumentClick,
      );
    },
    removeEvents() {
      off(this.$refs.popover, 'mouseover', this.onMouseOver);
      off(this.$refs.popover, 'mouseleave', this.onMouseLeave);
      off(this.$refs.popover, 'focusin', this.onFocusIn);
      off(this.$refs.popover, 'blur', this.onBlur);
      if (this.removeDocHandler) this.removeDocHandler();
    },
    onMouseOver() {
      if (this.isInteractive && this.visibility === 'hover') {
        clearTimeout(this._timer);
      }
    },
    onMouseLeave() {
      if (this.isInteractive && this.visibility === 'hover') {
        this.onHide({
          ref: this.ref,
        });
      }
    },
    onFocusIn() {
      if (this.isInteractive && this.visibility === 'focus') {
        clearTimeout(this._timer);
      }
    },
    onBlur() {
      if (this.isInteractive && this.visibility === 'focus') {
        this.onHide({
          ref: this.ref,
        });
      }
    },
    onDocumentClick(e) {
      if (!this.$refs.popover || !this.ref) {
        return;
      }
      // Don't hide if target element is contained within popover ref or content
      if (
        elementContains(this.$refs.popover, e.target) ||
        elementContains(this.ref, e.target)
      ) {
        return;
      }
      // Hide the popover
      this.ref = null;
    },
    onShow({ ref, args, visibility, isInteractive }) {
      clearTimeout(this._timer);
      this.args = args;
      this.visibility = visibility;
      this.isInteractive = isInteractive;
      this.ref = ref;
    },
    onHide({ ref, delay }) {
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        if (ref === this.ref) {
          this.ref = null;
          this.args = null;
          this.visibility = '';
        }
      }, delay);
    },
    onUpdate({ args }) {
      this.args = args;
      this.setupPopper();
    },
    setupPopper() {
      this.$nextTick(() => {
        if (!this.ref || !this.$refs.popover) return;
        if (this.popper && this.popper.reference !== this.ref) {
          this.popper.destroy();
          this.popper = null;
        }
        if (!this.popper) {
          this.popper = new Popper(
            this.ref,
            this.$refs.popover,
            this.popperOptions,
          );
        } else {
          this.popper.scheduleUpdate();
        }
      });
    },
    onPopperUpdate(data) {
      this.refreshPlacements(data.placement);
    },
    scheduleUpdate() {
      if (this.popper) {
        this.popper.scheduleUpdate();
      }
    },
    refreshPlacements(placement) {
      if (!placement) {
        this.direction = 'bottom';
        this.align = 'center';
      } else {
        const placements = placement.split('-');
        const direction = placements[0];
        let align = '';
        switch (direction) {
          case 'bottom':
          case 'top':
            if (placements.length > 1) {
              align = placements[1] === 'start' ? 'left' : 'right';
            } else {
              align = 'center';
            }
            break;
          case 'left':
          case 'right':
            if (placements.length > 1) {
              align = placements[1] === 'start' ? 'top' : 'bottom';
            } else {
              align = 'middle';
            }
        }
        this.direction = direction;
        this.align = align;
      }
    },
    afterLeave() {
      this.destroyPopper();
    },
    destroyPopper() {
      if (this.popper) {
        this.popper.destroy();
        this.popper = null;
      }
    },
  },
};
</script>

<style lang='sass' scoped>

$popover-content-offset: 10px
$popover-slide-translation: 15px
$popover-transition-time: 0.14s ease-in-out
$popover-caret-horizontal-offset: 0px
$popover-caret-vertical-offset: 18px

.vc-popover-content-wrapper
  position: absolute
  display: block
  outline: none
  z-index: 10
  &.interactive
    pointer-events: all

.vc-popover-content
  position: relative
  z-index: 10
  &.direction-bottom
    margin-top: $popover-content-offset
  &.direction-top
    margin-bottom: $popover-content-offset
  &.direction-left
    margin-right: $popover-content-offset
  &.direction-right
    margin-left: $popover-content-offset

.vc-popover-caret
  content: ''
  position: absolute
  display: block
  width: 0
  height: 0
  border-width: 10px
  border-style: solid
  border-color: transparent
  border-bottom-color: inherit
  &.direction-bottom
    top: 0
  &.direction-top
    top: 100%
  &.direction-left
    left: 100%
    transform: translateY(-50%) rotate(90deg)
  &.direction-right
    left: 0
    transform: translateY(-50%) rotate(-90deg)
  &.align-left
    left: $popover-caret-horizontal-offset
    transform: translateY(-100%)
  &.align-center
    left: 50%
    &.direction-bottom
      transform: translateX(-50%) translateY(-100%)
    &.direction-top
      transform: translateX(-50%) rotate(180deg)
  &.align-right
    right: $popover-caret-horizontal-offset
    &.direction-bottom
      transform: translateY(-100%)
  &.align-top
    top: $popover-caret-vertical-offset
    // transform: translateY(-50%) translateX(-50%) rotate(-45deg)
  &.align-middle
    top: 50%
    // transform: translateY(-50%) translateX(-50%) rotate(-45deg)
  &.align-bottom
    bottom: $popover-caret-vertical-offset
    // transform: translateY(50%) translateX(-50%) rotate(-45deg)

.fade-enter-active,
.fade-leave-active,
.slide-fade-enter-active,
.slide-fade-leave-active
  transition: all $popover-transition-time
  pointer-events: none

.fade-enter,
.fade-leave-to
  opacity: 0

.slide-fade-enter,
.slide-fade-leave-to
  opacity: 0
  &.direction-bottom
    transform: translateY(-$popover-slide-translation)
  &.direction-top
    transform: translateY($popover-slide-translation)
  &.direction-left
    transform: translateX($popover-slide-translation)
  &.direction-right
    transform: translateX(-$popover-slide-translation)

</style>
