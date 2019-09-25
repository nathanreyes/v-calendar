<script>
import { popoversMixin } from '@/utils/popovers';
import { on, off, elementContains } from '@/utils/helpers';

export default {
  name: 'PopoverRef',
  mixins: [popoversMixin],
  props: {
    id: { type: String, default: 'default' },
    element: null,
    args: null,
    visibility: {
      type: String,
      default: 'hover-focus',
      validator: value =>
        ['hover-focus', 'hover', 'focus', 'click', 'visible', 'hidden'].indexOf(
          value,
        ) !== -1,
    },
    placement: { type: String, default: 'bottom' },
    positionFixed: Boolean,
    modifiers: { type: Object, default: () => {} },
    isInteractive: Boolean,
    showDelay: { type: Number, default: 10 },
    hideDelay: { type: Number, default: 150 },
  },
  data() {
    return {
      reference: null,
      isHovered: false,
      isFocused: false,
    };
  },
  computed: {
    isActive() {
      return this.$popoverIsActive(this.id, this.reference);
    },
  },
  render() {
    return this.$slots.default[0];
  },
  watch: {
    visibility() {
      this.refreshVisibility();
    },
    args() {
      this.$nextTick(() => {
        if (this.isActive) {
          this.update();
        }
      });
    },
  },
  mounted() {
    this.reference = this.element || this.$slots.default[0].elm;
    this.addEvents();
    this.$once('beforeDestroy', () => this.removeEvents());
    this.refreshVisibility();
  },
  methods: {
    addEvents() {
      on(this.reference, 'click', this.onClick);
      on(this.reference, 'mouseover', this.onMouseOver);
      on(this.reference, 'mouseleave', this.onMouseLeave);
      on(this.reference, 'focusin', this.onFocusIn);
      on(this.reference, 'focusout', this.onFocusOut);
      // on(this.reference, 'blur', this.onFocusOut);
    },
    removeEvents() {
      off(this.reference, 'click', this.onClick);
      off(this.reference, 'mouseover', this.onMouseOver);
      off(this.reference, 'mouseleave', this.onMouseLeave);
      off(this.reference, 'focusin', this.onFocusIn);
      off(this.reference, 'focusout', this.onFocusOut);
      // off(this.reference, 'blur', this.onFocusOut);
    },
    onClick() {
      if (this.visibility === 'click') {
        this.toggle();
      }
    },
    onMouseOver() {
      if (!this.isHovered) {
        this.isHovered = true;
        if (this.visibility.includes('hover')) {
          this.refreshVisibility();
        }
      }
    },
    onMouseLeave() {
      if (this.isHovered) {
        this.isHovered = false;
        if (
          this.visibility === 'hover' ||
          (this.visibility === 'hover-focus' && !this.isFocused)
        ) {
          this.refreshVisibility();
        }
      }
    },
    onFocusIn() {
      if (!this.isFocused) {
        this.isFocused = true;
        if (this.visibility.includes('focus')) {
          this.refreshVisibility();
        }
      }
    },
    onFocusOut(e) {
      if (this.isFocused && !elementContains(this.reference, e.relatedTarget)) {
        this.isFocused = false;
        if (this.visibility.includes('focus')) {
          this.refreshVisibility();
        }
      }
    },
    refreshVisibility() {
      switch (this.visibility) {
        case 'hover':
          if (this.isHovered) {
            this.show();
          } else if (this.isActive) {
            this.hide();
          }
          break;
        case 'focus':
          if (this.isFocused) {
            this.show();
          } else if (this.isActive) {
            this.hide();
          }
          break;
        case 'hover-focus':
          if (this.isHovered || this.isFocused) {
            this.show({ visibility: this.isFocused ? 'focus' : 'hover' });
          } else if (this.isActive) {
            this.hide();
          }
          break;
        case 'visible':
          this.show();
          break;
        case 'hidden':
          if (this.isActive) {
            this.hide();
          }
          break;
      }
    },
    toggle() {
      if (this.isActive) {
        this.hide();
      } else {
        this.$nextTick(() => {
          this.show();
        });
      }
    },
    show({ visibility } = {}) {
      this.$showPopover({
        id: this.id,
        ref: this.reference,
        args: this.args,
        visibility: visibility || this.visibility,
        placement: this.placement,
        positionFixed: this.positionFixed,
        modifiers: this.modifiers,
        isInteractive: this.isInteractive,
        delay: this.showDelay,
      });
    },
    hide({ delay = this.hideDelay } = {}) {
      this.$hidePopover({
        id: this.id,
        ref: this.reference,
        delay,
      });
    },
    update() {
      this.$updatePopover({
        id: this.id,
        ref: this.reference,
        args: this.args,
      });
    },
  },
};
</script>
