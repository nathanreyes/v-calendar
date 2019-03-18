<script>
export default {
  name: 'CustomTransition',
  render(h) {
    return h(
      'transition',
      {
        props: {
          name: this.name_,
          appear: this.appear,
        },
        on: {
          beforeEnter: this.beforeEnter,
          afterEnter: this.afterEnter,
        },
      },
      [this.$slots.default],
    );
  },
  props: {
    name: String,
    appear: Boolean,
  },
  computed: {
    name_() {
      return this.name || 'none';
    },
  },
  methods: {
    beforeEnter(el) {
      this.$emit('beforeEnter', el);
      this.$emit('beforeTransition', el);
    },
    afterEnter(el) {
      this.$emit('afterEnter', el);
      this.$emit('afterTransition', el);
    },
  },
};
</script>

<style lang='sass' scoped>

$slide-translate: 22px
$slide-duration: .15s
$slide-timing: ease

.none-enter-active,
.none-leave-active
  transition-duration: 0s

.fade-enter-active,
.fade-leave-active,
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active,
.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active
  transition: transform $slide-duration $slide-timing, opacity $slide-duration $slide-timing
  backface-visibility: hidden

.none-leave-active,
.fade-leave-active,
.slide-left-leave-active,
.slide-right-leave-active,
.slide-up-leave-active,
.slide-down-leave-active
  position: absolute
  width: 100%

.none-enter,
.none-leave-to,
.fade-enter,
.fade-leave-to,
.slide-left-enter,
.slide-left-leave-to,
.slide-right-enter,
.slide-right-leave-to,
.slide-up-enter,
.slide-up-leave-to,
.slide-down-enter,
.slide-down-leave-to
  opacity: 0

.slide-left-enter,
.slide-right-leave-to
  transform: translateX($slide-translate)

.slide-right-enter,
.slide-left-leave-to
  transform: translateX(-$slide-translate)

.slide-up-enter,
.slide-down-leave-to
  transform: translateY($slide-translate)

.slide-down-enter,
.slide-up-leave-to
  transform: translateY(-$slide-translate)

</style>
