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
        class: [
          'vc-popover-content-wrapper',
          { 'is-interactive': this.isInteractive },
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
    transition: { type: String, default: 'slide-fade' },
    contentClass: String,
  },
  data() {
    return {
      ref: null,
      args: null,
      visibility: '',
      placement: 'bottom',
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
            hide: () => this.onHide({ ref: this.ref }),
          })) ||
        this.$slots.default
      );
    },
    popperOptions() {
      return {
        placement: this.placement,
        onCreate: this.onPopperUpdate,
        onUpdate: this.onPopperUpdate,
        modifiers: {
          hide: { enabled: false },
          preventOverflow: { enabled: false },
        },
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
      return this.placement.split('-')[0] || 'bottom';
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
      on(this.popoverEl, 'mouseover', this.onMouseOver);
      on(this.popoverEl, 'mouseleave', this.onMouseLeave);
      on(this.popoverEl, 'focusin', this.onFocusIn);
      on(this.popoverEl, 'blur', this.onBlur);
      this.removeDocHandler = addTapOrClickHandler(
        document,
        this.onDocumentClick,
      );
    },
    removeEvents() {
      off(this.popoverEl, 'mouseover', this.onMouseOver);
      off(this.popoverEl, 'mouseleave', this.onMouseLeave);
      off(this.popoverEl, 'focusin', this.onFocusIn);
      off(this.popoverEl, 'blur', this.onBlur);
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
        elementContains(this.popoverEl, e.target) ||
        elementContains(this.ref, e.target)
      ) {
        return;
      }
      // Hide the popover
      this.ref = null;
    },
    onShow({ ref, args, visibility, placement, isInteractive }) {
      clearTimeout(this._timer);
      this.args = args;
      this.visibility = visibility;
      this.placement = placement;
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
