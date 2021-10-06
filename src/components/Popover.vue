<script>
import { createPopper } from '@popperjs/core';
import { on, off, elementContains } from '../utils/helpers';
import { isFunction } from '../utils/_';

export default {
  name: 'Popover',
  render(h) {
    return h(
      'div',
      {
        class: [
          'vc-popover-content-wrapper',
          {
            'is-interactive': this.isInteractive,
          },
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
  props: {
    id: { type: String, required: true },
    contentClass: String,
  },
  data() {
    return {
      ref: null,
      opts: null,
      data: null,
      transition: 'slide-fade',
      placement: 'bottom',
      positionFixed: false,
      modifiers: [],
      isInteractive: false,
      isHovered: false,
      isFocused: false,
      showDelay: 0,
      hideDelay: 110,
      autoHide: false,
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
            data: this.data,
            updateLayout: this.setupPopper,
            hide: opts => this.hide(opts),
          })) ||
        this.$slots.default
      );
    },
    popperOptions() {
      return {
        placement: this.placement,
        strategy: this.positionFixed ? 'fixed' : 'absolute',
        modifiers: [
          {
            name: 'onUpdate',
            enabled: true,
            phase: 'afterWrite',
            fn: this.onPopperUpdate,
          },
          ...(this.modifiers || []),
        ],
        onFirstUpdate: this.onPopperUpdate,
      };
    },
    isVisible() {
      return !!(this.ref && this.content);
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
    opts(val, oldVal) {
      if (oldVal && oldVal.callback) {
        oldVal.callback({
          ...oldVal,
          completed: !val,
          reason: val ? 'Overridden by action' : null,
        });
      }
    },
  },
  mounted() {
    this.popoverEl = this.$refs.popover;
    this.addEvents();
  },
  beforeDestroy() {
    this.destroyPopper();
    this.removeEvents();
    this.popoverEl = null;
  },
  methods: {
    addEvents() {
      on(this.popoverEl, 'click', this.onClick);
      on(this.popoverEl, 'mouseover', this.onMouseOver);
      on(this.popoverEl, 'mouseleave', this.onMouseLeave);
      on(this.popoverEl, 'focusin', this.onFocusIn);
      on(this.popoverEl, 'focusout', this.onFocusOut);
      on(document, 'keydown', this.onDocumentKeydown);
      on(document, 'click', this.onDocumentClick);
      on(document, 'show-popover', this.onDocumentShowPopover);
      on(document, 'hide-popover', this.onDocumentHidePopover);
      on(document, 'toggle-popover', this.onDocumentTogglePopover);
      on(document, 'update-popover', this.onDocumentUpdatePopover);
    },
    removeEvents() {
      off(this.popoverEl, 'click', this.onClick);
      off(this.popoverEl, 'mouseover', this.onMouseOver);
      off(this.popoverEl, 'mouseleave', this.onMouseLeave);
      off(this.popoverEl, 'focusin', this.onFocusIn);
      off(this.popoverEl, 'focusout', this.onFocusOut);
      off(document, 'keydown', this.onDocumentKeydown);
      off(document, 'click', this.onDocumentClick);
      off(document, 'show-popover', this.onDocumentShowPopover);
      off(document, 'hide-popover', this.onDocumentHidePopover);
      off(document, 'toggle-popover', this.onDocumentTogglePopover);
      off(document, 'update-popover', this.onDocumentUpdatePopover);
    },
    onClick(e) {
      e.stopPropagation();
    },
    onMouseOver() {
      this.isHovered = true;
      if (this.isInteractive) this.show();
    },
    onMouseLeave() {
      this.isHovered = false;
      if (
        this.autoHide &&
        !this.isFocused &&
        (!this.ref || this.ref !== document.activeElement)
      ) {
        this.hide();
      }
    },
    onFocusIn() {
      this.isFocused = true;
      if (this.isInteractive) this.show();
    },
    onFocusOut(e) {
      if (
        !e.relatedTarget ||
        !elementContains(this.popoverEl, e.relatedTarget)
      ) {
        this.isFocused = false;
        if (!this.isHovered && this.autoHide) this.hide();
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
    onDocumentShowPopover({ detail }) {
      if (!detail.id || detail.id !== this.id) return;
      this.show(detail);
    },
    onDocumentHidePopover({ detail }) {
      if (!detail.id || detail.id !== this.id) return;
      this.hide(detail);
    },
    onDocumentTogglePopover({ detail }) {
      if (!detail.id || detail.id !== this.id) return;
      this.toggle(detail);
    },
    onDocumentUpdatePopover({ detail }) {
      if (!detail.id || detail.id !== this.id) return;
      this.update(detail);
    },
    show(opts = {}) {
      opts.action = 'show';
      const ref = opts.ref || this.ref;
      const delay = opts.showDelay >= 0 ? opts.showDelay : this.showDelay;
      // Validate options
      if (!ref) {
        if (opts.callback) {
          opts.callback({
            completed: false,
            reason: 'Invalid reference element provided',
          });
        }
        return;
      }
      clearTimeout(this.timeout);
      this.opts = opts;
      const fn = () => {
        Object.assign(this, opts);
        this.setupPopper();
        this.opts = null;
      };
      if (delay > 0) {
        this.timeout = setTimeout(() => fn(), delay);
      } else {
        fn();
      }
    },
    hide(opts = {}) {
      opts.action = 'hide';
      const ref = opts.ref || this.ref;
      const delay = opts.hideDelay >= 0 ? opts.hideDelay : this.hideDelay;
      if (!this.ref || ref !== this.ref) {
        if (opts.callback) {
          opts.callback({
            ...opts,
            completed: false,
            reason: this.ref
              ? 'Invalid reference element provided'
              : 'Popover already hidden',
          });
        }
        return;
      }
      const fn = () => {
        this.ref = null;
        this.opts = null;
      };
      clearTimeout(this.timeout);
      this.opts = opts;
      if (delay > 0) {
        this.timeout = setTimeout(fn, delay);
      } else {
        fn();
      }
    },
    toggle(opts = {}) {
      if (this.isVisible && opts.ref === this.ref) {
        this.hide(opts);
      } else {
        this.show(opts);
      }
    },
    update(opts = {}) {
      Object.assign(this, opts);
      this.setupPopper();
    },
    setupPopper() {
      this.$nextTick(() => {
        if (!this.ref || !this.$refs.popover) return;
        if (this.popper && this.popper.reference !== this.ref) {
          this.destroyPopper();
        }
        if (!this.popper) {
          this.popper = createPopper(
            this.ref,
            this.popoverEl,
            this.popperOptions,
          );
        } else {
          this.popper.update();
        }
      });
    },
    onPopperUpdate(args) {
      if (args.placement) {
        this.placement = args.placement;
      } else if (args.state) {
        this.placement = args.state.placement;
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
  box-shadow: var(--shadow-lg);
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
  background-color: inherit;
  user-select: none;
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
