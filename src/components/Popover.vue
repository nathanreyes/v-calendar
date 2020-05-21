<script>
import Popper from 'popper.js';
import { popoversMixin } from '../utils/popovers';
import { on, off, elementContains } from '../utils/helpers';
import { addTapOrClickHandler } from '../utils/touch';
import { isFunction } from '../utils/_';

export default {
  name: 'Popover',
  render(h) {
    return h(
      'div',
      {
        class: [
          'vc-popover-content-wrapper',
          { 'is-interactive': this.isInteractive },
        ],
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
              beforeEnter: this.beforeEnter,
              afterEnter: this.afterEnter,
              beforeLeave: this.beforeLeave,
              afterLeave: this.afterLeave,
            },
          },
          [
            this.isVisible &&
              h(
                'div',
                {
                  attrs: {
                    tabindex: -1,
                  },
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
                      `align-${this.alignment}`,
                    ],
                  }),
                ],
              ),
          ],
        ),
      ],
    );
  },
  mixins: [popoversMixin],
  props: {
    id: { type: String, required: true },
    transition: { type: String, default: 'slide-fade' },
    contentClass: String,
  },
  data() {
    return {
      ref: null,
      args: null,
      visibility: '',
      placement: 'bottom',
      positionFixed: false,
      modifiers: {},
      isInteractive: false,
      delay: 10,
      popperEl: null,
    };
  },
  computed: {
    content() {
      return (
        (isFunction(this.$scopedSlots.default) &&
          this.$scopedSlots.default({
            direction: this.direction,
            alignment: this.alignment,
            args: this.args,
            updateLayout: this.scheduleUpdate,
            hide: opts => this.hide(opts),
          })) ||
        this.$slots.default
      );
    },
    popperOptions() {
      return {
        placement: this.placement,
        positionFixed: this.positionFixed,
        modifiers: {
          hide: { enabled: false },
          preventOverflow: { enabled: false },
          ...this.modifiers,
        },
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
    direction() {
      return (this.placement && this.placement.split('-')[0]) || 'bottom';
    },
    alignment() {
      const isLeftRight =
        this.direction === 'left' || this.direction === 'right';
      let alignment = this.placement.split('-');
      alignment = alignment.length > 1 ? alignment[1] : '';
      if (['start', 'top', 'left'].includes(alignment)) {
        return isLeftRight ? 'top' : 'left';
      }
      if (['end', 'bottom', 'right'].includes(alignment)) {
        return isLeftRight ? 'bottom' : 'right';
      }
      return isLeftRight ? 'middle' : 'center';
    },
    state() {
      return this.$popovers[this.id];
    },
  },
  watch: {
    state: {
      immediate: true,
      handler(val) {
        if (val) {
          this.ref = val.ref;
          this.args = val.args;
          this.visibility = val.visibility;
          this.placement = val.placement;
          this.positionFixed = val.positionFixed;
          this.modifiers = val.modifiers;
          this.isInteractive = val.isInteractive;
          this.setupPopper();
        }
      },
    },
  },
  mounted() {
    this.popoverEl = this.$refs.popover;
    this.addEvents();
  },
  beforeDestroy() {
    this.removeEvents();
  },
  methods: {
    addEvents() {
      on(this.popoverEl, 'click', this.onClick);
      on(this.popoverEl, 'mouseover', this.onMouseOver);
      on(this.popoverEl, 'mouseleave', this.onMouseLeave);
      on(this.popoverEl, 'focusin', this.onFocusIn);
      on(this.popoverEl, 'focusout', this.onFocusOut);
      on(document, 'keydown', this.onDocumentKeydown);
      this.removeDocHandler = addTapOrClickHandler(
        document,
        this.onDocumentClick,
      );
    },
    removeEvents() {
      off(this.popoverEl, 'click', this.onClick);
      off(this.popoverEl, 'mouseover', this.onMouseOver);
      off(this.popoverEl, 'mouseleave', this.onMouseLeave);
      off(this.popoverEl, 'focusin', this.onFocusIn);
      off(this.popoverEl, 'focusout', this.onFocusOut);
      off(document, 'keydown', this.onDocumentKeydown);
      if (this.removeDocHandler) this.removeDocHandler();
    },
    onClick(e) {
      e.stopPropagation();
    },
    onMouseOver() {
      if (this.isInteractive && this.visibility === 'hover') {
        this.show();
      }
    },
    onMouseLeave() {
      if (this.isInteractive && this.visibility === 'hover') {
        this.hide();
      }
    },
    onFocusIn() {
      if (this.isInteractive && this.visibility === 'focus') {
        this.show();
      }
    },
    onFocusOut(e) {
      if (
        this.isInteractive &&
        this.visibility === 'focus' &&
        e.relatedTarget &&
        !elementContains(this.popoverEl, e.relatedTarget)
      ) {
        this.hide();
      }
    },
    onDocumentClick(e) {
      if (!this.$refs.popover || !this.ref) {
        return;
      }
      // Don't hide if target element is contained within popover ref or content
      if (
        elementContains(this.popoverEl, e.target) ||
        elementContains(this.ref, e.target)
      ) {
        return;
      }
      // Hide the popover
      this.hide();
    },
    onDocumentKeydown(e) {
      if (e.key === 'Esc' || e.key === 'Escape') {
        this.hide();
      }
    },
    show() {
      this.$showPopover({ id: this.id, ref: this.ref, delay: 0 });
    },
    hide(opts) {
      this.$hidePopover({
        ...opts,
        id: this.id,
        ref: this.ref,
      });
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
            this.popoverEl,
            this.popperOptions,
          );
        } else {
          this.popper.scheduleUpdate();
        }
      });
    },
    onPopperUpdate(data) {
      this.placement = data.placement;
    },
    scheduleUpdate() {
      if (this.popper) {
        this.popper.scheduleUpdate();
      }
    },
    beforeEnter(e) {
      this.$emit('beforeShow', e);
    },
    afterEnter(e) {
      this.$emit('afterShow', e);
    },
    beforeLeave(e) {
      this.$emit('beforeHide', e);
    },
    afterLeave(e) {
      this.destroyPopper();
      this.$emit('afterHide', e);
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

<style lang="postcss" scoped>
.vc-popover-content-wrapper {
  --popover-horizontal-content-offset: 8px;
  --popover-vertical-content-offset: 10px;
  --popover-slide-translation: 15px;
  --popover-transition-time: 0.14s ease-in-out;
  --popover-caret-horizontal-offset: 18px;
  --popover-caret-vertical-offset: 8px;

  position: absolute;
  display: block;
  outline: none;
  z-index: 10;
  &:not(.is-interactive) {
    pointer-events: none;
  }
}

.vc-popover-content {
  position: relative;
  outline: none;
  z-index: 10;
  &.direction-bottom {
    margin-top: var(--popover-vertical-content-offset);
  }
  &.direction-top {
    margin-bottom: var(--popover-vertical-content-offset);
  }
  &.direction-left {
    margin-right: var(--popover-horizontal-content-offset);
  }
  &.direction-right {
    margin-left: var(--popover-horizontal-content-offset);
  }
}

.vc-popover-caret {
  content: '';
  position: absolute;
  display: block;
  width: 12px;
  height: 12px;
  border-top: inherit;
  border-left: inherit;
  background: inherit;
  z-index: -1;
  &.direction-bottom {
    top: 0;
    &.align-left {
      transform: translateY(-50%) rotate(45deg);
    }
    &.align-center {
      transform: translateX(-50%) translateY(-50%) rotate(45deg);
    }
    &.align-right {
      transform: translateY(-50%) rotate(45deg);
    }
  }
  &.direction-top {
    top: 100%;
    &.align-left {
      transform: translateY(-50%) rotate(-135deg);
    }
    &.align-center {
      transform: translateX(-50%) translateY(-50%) rotate(-135deg);
    }
    &.align-right {
      transform: translateY(-50%) rotate(-135deg);
    }
  }
  &.direction-left {
    left: 100%;
    &.align-top {
      transform: translateX(-50%) rotate(135deg);
    }
    &.align-middle {
      transform: translateY(-50%) translateX(-50%) rotate(135deg);
    }
    &.align-bottom {
      transform: translateX(-50%) rotate(135deg);
    }
  }
  &.direction-right {
    left: 0;
    &.align-top {
      transform: translateX(-50%) rotate(-45deg);
    }
    &.align-middle {
      transform: translateY(-50%) translateX(-50%) rotate(-45deg);
    }
    &.align-bottom {
      transform: translateX(-50%) rotate(-45deg);
    }
  }
  &.align-left {
    left: var(--popover-caret-horizontal-offset);
  }
  &.align-center {
    left: 50%;
  }
  &.align-right {
    right: var(--popover-caret-horizontal-offset);
  }
  &.align-top {
    top: var(--popover-caret-vertical-offset);
  }
  &.align-middle {
    top: 50%;
  }
  &.align-bottom {
    bottom: var(--popover-caret-vertical-offset);
  }
}

.fade-enter-active,
.fade-leave-active,
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all var(--popover-transition-time);
  pointer-events: none;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
  &.direction-bottom {
    transform: translateY(calc(-1 * var(--popover-slide-translation)));
  }
  &.direction-top {
    transform: translateY(var(--popover-slide-translation));
  }
  &.direction-left {
    transform: translateX(var(--popover-slide-translation));
  }
  &.direction-right {
    transform: translateX(calc(-1 * var(--popover-slide-translation)));
  }
}
</style>
