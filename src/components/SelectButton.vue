<template>
  <div class="vc-relative">
    <select
      class="vc-absolute vc-opacity-0 vc-w-full vc-h-full"
      ref="select"
      v-model="value_"
      @focus="hasFocus = true"
      @blur="hasFocus = false"
    >
      <option v-for="item in items" :key="item.id" :value="item.value">{{
        item.label
      }}</option>
    </select>
    <slot :has-focus="hasFocus" />
  </div>
</template>

<script>
export default {
  props: {
    value: null,
    // Each item has 'id', 'value' and 'label' keys
    items: Array,
    focus: Boolean,
  },
  watch: {
    value(val) {
      this.value_ = val;
    },
    value_(val) {
      this.$emit('input', val);
    },
    hasFocus(val) {
      console.log('hasFocus', val);
    },
  },
  data() {
    return {
      value_: this.value,
      hasFocus: false,
    };
  },
  mounted() {
    if (this.focus && this.$refs.select) {
      this.$refs.select.focus();
    }
  },
};
</script>

<style scoped>
select > option[value=''] {
  display: none;
}
</style>
