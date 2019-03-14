<template>
  <div>
    <input
      class="vc-numberpicker__input"
      type="number"
      :value="value"
      v-bind="$attrs"
      v-on="listeners"
    >
  </div>
</template>

<script>
export default {
  name: 'NumberPicker',
  inheritAttrs: false,
  props: {
    value: {
      type: Number,
      default: 0,
    }
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: event => {
          this.$emit('input', event.target.value);
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.vc-numberpicker__input
  width: 100%
</style>
