<script>
export default {
  render(h) {
    return h('div', [this.$slots.default]);
  },
  mounted() {
    const parent = this.$el.parentElement;
    if (parent != null) {
      this.$slots.default.forEach(slot => parent.insertBefore(slot.elm, this.$el),
      );
      this.$el.remove();
    }
  },
};
</script>
