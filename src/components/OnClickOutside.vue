<script>
import { isFunction } from '../utils/typeCheckers.js';

export default {
  render(h) {
    return this.$slots.default && this.$slots.default[0];
  },
  props: {
    run: Function,
    whitelist: { type: Array, default: () => [] },
  },
  mounted() {
    const listener = e => {
      if ((this.$el && this.$el === e.target) || this.$el.contains(e.target)) {
        return;
      }
      if (
        this.whitelist &&
        this.whitelist.some(el => {
          if (!el) return false;
          if (el === e.target) return true;
          return isFunction(el.contains) && el.contains(e.target);
        })
      ) {
        return;
      }
      this.run();
    };
    document.addEventListener('click', listener);
    this.$once('hook:beforeDestroy', () => {
      document.removeEventListener('click', listener);
    });
  },
};
</script>
