<script>
import { on, off } from '@/utils/helpers';
import { isFunction } from '@/utils/typeCheckers';

export default {
  props: {
    id: { type: String, default: 'default' },
    element: null,
    args: null,
    visibility: {
      type: String,
      default: 'hover',
      validator: value => {
        return (
          ['hover', 'focus', 'click', 'visible', 'hidden'].indexOf(value) !== -1
        );
      },
    },
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
      return (
        this.$vcBus.activeRefs &&
        this.$vcBus.activeRefs[this.id] === this.reference
      );
    },
  },
  render(h) {
    return this.$slots.default[0];
  },
  watch: {
    visibility(val, oldVal) {
      this.refreshVisibility();
    },
    args(val) {
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
    this.$once('beforeDestroy', () => {
      this.removeEvents();
    });
    this.refreshVisibility();
  },
  methods: {
    addEvents() {
      on(this.reference, 'click', this.onClick);
      on(this.reference, 'mouseover', this.onMouseOver);
      on(this.reference, 'mouseleave', this.onMouseLeave);
      on(this.reference, 'focusin', this.onFocusIn);
      on(this.reference, 'blur', this.onBlur);
    },
    removeEvents() {
      off(this.reference, 'click', this.onClick);
      off(this.reference, 'mouseover', this.onMouseOver);
      off(this.reference, 'mouseleave', this.onMouseLeave);
      off(this.reference, 'focusin', this.onFocusIn);
      off(this.reference, 'blur', this.onBlur);
    },
    onClick() {
      if (this.visibility === 'click') {
        this.toggle();
      }
    },
    onMouseOver(e) {
      if (!this.isHovered) {
        this.isHovered = true;
        if (this.visibility === 'hover') {
          this.refreshVisibility();
        }
      }
    },
    onMouseLeave(e) {
      this.isHovered = false;
      if (this.visibility === 'hover') {
        this.refreshVisibility();
      }
    },
    onFocusIn(e) {
      if (!this.isFocused) {
        this.isFocused = true;
        if (this.visibility === 'focus') {
          this.refreshVisibility();
        }
      }
    },
    onBlur(e) {
      this.isFocused = false;
      if (this.visibility === 'focus') {
        this.refreshVisibility();
      }
    },
    includesEl(element) {
      return (
        element &&
        (this.reference === element || this.reference.contains(element))
      );
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
      this.$vcBus.$emit(`toggle:${this.id}`, {
        ref: this.reference,
        args: this.args,
        visibility: this.visibility,
      });
    },
    show() {
      this.$vcBus.$emit(`show:${this.id}`, {
        ref: this.reference,
        args: this.args,
        visibility: this.visibility,
        isInteractive: this.isInteractive,
        delay: this.showDelay,
      });
    },
    hide({ delay = this.hideDelay } = {}) {
      this.$vcBus.$emit(`hide:${this.id}`, {
        ref: this.reference,
        delay,
      });
    },
    update() {
      this.$vcBus.$emit(`update:${this.id}`, {
        ref: this.reference,
        args: this.args,
      });
    },
  },
};
</script>
