<template>
  <transition
    :name="name_"
    :appear="appear"
    @before-enter="beforeEnter"
    @after-enter="afterEnter"
  >
    <slot />
  </transition>
</template>
<script>
export default {
  name: 'CustomTransition',
  emits: [
    'before-enter',
    'before-transition',
    'after-enter',
    'after-transition',
  ],
  props: {
    name: String,
    appear: Boolean,
  },
  computed: {
    name_() {
      return `vc-${this.name || 'none'}`;
    },
  },
  methods: {
    beforeEnter(el) {
      this.$emit('before-enter', el);
      this.$emit('before-transition', el);
    },
    afterEnter(el) {
      this.$emit('after-enter', el);
      this.$emit('after-transition', el);
    },
  },
};
</script>
