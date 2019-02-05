<script>
import Popper from 'popper.js';
import { isFunction } from '@/utils/typeCheckers';
import { on, off } from '@/utils/helpers';

export default {
  render(h) {
    return h(
      'div',
      {
        class: [
          'c-popover-content-wrapper',
          `direction-${this.direction}`,
          `align-${this.align}`,
          { interactive: this.isInteractive },
        ],
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
                    'c-popover-content',
                    `direction-${this.direction}`,
                    `align-${this.align}`,
                    this.contentClass,
                  ],
                },
                [
                  h('span', {
                    class: 'c-popover-caret',
                  }),
                  (isFunction(this.$scopedSlots.default) &&
                    this.$scopedSlots.default({
                      direction: this.direction,
                      align: this.align,
                      args: this.args,
                      hide: this.onHide,
                    })) ||
                    this.$slots.default,
                ],
              ),
          ],
        ),
      ],
    );
  },
  props: {
    id: { type: String, required: true },
    placement: { type: String, default: 'bottom' },
    contentClass: String,
    transition: { type: String, default: 'slide-fade' },
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
    popperOptions() {
      return {
        placement: this.placement,
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
      this.$vcBus.activeRefs = {
        ...this.$vcBus.activeRefs,
        [this.id]: val,
      };
    },
  },
  created() {
    this.$vcBus.$on(`show:${this.id}`, this.onShow);
    this.$vcBus.$on(`hide:${this.id}`, this.onHide);
    this.$vcBus.$on(`update:${this.id}`, this.onUpdate);
    this.$once('beforeDestroy', () => {
      this.$vcBus.$off(`show:${this.id}`, this.onShow);
      this.$vcBus.$off(`hide:${this.id}`, this.onHide);
      this.$vcBus.$off(`update:${this.id}`, this.onUpdate);
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
      on(document, 'click', this.onDocumentClick);
    },
    removeEvents() {
      off(this.$refs.popover, 'mouseover', this.onMouseOver);
      off(this.$refs.popover, 'mouseleave', this.onMouseLeave);
      off(this.$refs.popover, 'focusin', this.onFocusIn);
      off(this.$refs.popover, 'blur', this.onBlur);
      off(document, 'click', this.onDocumentClick);
    },
    onMouseOver(e) {
      if (this.isInteractive && this.visibility === 'hover') {
        clearTimeout(this._timer);
      }
    },
    onMouseLeave(e) {
      if (this.isInteractive && this.visibility === 'hover') {
        this.onHide({
          ref: this.ref,
        });
      }
    },
    onFocusIn(e) {
      if (this.isInteractive && this.visibility === 'focus') {
        clearTimeout(this._timer);
      }
    },
    onBlur(e) {
      if (this.isInteractive && this.visibility === 'focus') {
        this.onHide({
          ref: this.ref,
        });
      }
    },
    onDocumentClick(e) {
      if (this.visibility !== 'click' || !this.$refs.popover || !this.ref)
        return;
      if (
        this.$refs.popover === e.target ||
        this.ref === e.target ||
        this.$refs.popover.contains(e.target) ||
        this.ref.contains(e.target)
      ) {
        return;
      }
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
        if (this.popper && this.popper.reference != this.ref) {
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
    refreshPlacements(placement) {
      if (!placement) {
        this.direction = 'bottom';
        this.align = 'center';
      } else {
        const placements = placement.split('-');
        const direction = placements[0];
        let align = '';
        if (['bottom', 'top'].includes(direction)) {
          if (placements.length > 1) {
            align = placements[1] === 'start' ? 'left' : 'right';
          } else {
            align = 'center';
          }
        } else if (['left', 'right'].includes(direction)) {
          if (placements.length > 1) {
            align = placements[1] === 'top' ? 'middle' : 'bottom';
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

@import '../styles/vars.sass'

.c-popover-content-wrapper
  position: absolute
  display: block
  outline: none
  z-index: 10
  &.interactive
    pointer-events: all

.c-popover-content
  position: relative
  background-color: $pane-background-color
  border: $pane-border
  z-index: 10
  .c-popover-caret
    display: block
    position: absolute
    border-width: 1px 1px 0 0
    background-color: inherit
    border-color: inherit
    width: 12px
    height: 12px
    content: ''
    z-index: 11
  &.direction-bottom
    margin-top: $popover-content-offset
    .c-popover-caret
      top: 0
      border-width: 1px 1px 0 0
  &.direction-top
    margin-bottom: $popover-content-offset
    .c-popover-caret
      top: 100%
      border-width: 0 0 1px 1px
  &.direction-left
    margin-right: $popover-content-offset
    .c-popover-caret
      left: 100%
      border-width: 0 1px 1px 0
  &.direction-right
    margin-left: $popover-content-offset
    .c-popover-caret
      left: 0
      border-width: 1px 0 0 1px
  &.align-left
    .c-popover-caret
      left: $popover-caret-horizontal-offset
      transform: translateY(-50%) translateX(-50%) rotate(-45deg)
  &.align-right
    .c-popover-caret
      right: $popover-caret-horizontal-offset
      transform: translateY(-50%) translateX(50%) rotate(-45deg)
  &.align-center
    .c-popover-caret
      left: 50%
      transform: translateY(-50%) translateX(-50%) rotate(-45deg)
  &.align-top
    .c-popover-caret
      top: $popover-caret-vertical-offset
      transform: translateY(-50%) translateX(-50%) rotate(-45deg)
  &.align-middle
    .c-popover-caret
      top: 50%
      transform: translateY(-50%) translateX(-50%) rotate(-45deg)
  &.align-bottom
    .c-popover-caret
      bottom: $popover-caret-vertical-offset
      transform: translateY(50%) translateX(-50%) rotate(-45deg)

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
