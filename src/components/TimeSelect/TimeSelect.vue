<template>
  <div class="vc-time-select">
    <select
      v-bind="$attrs"
      :value="modelValue"
      class="vc-focus-bg"
      :class="{ 'vc-locked': options.length < 2 }"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  emits: ['update:modelValue'],
  props: {
    options: Array,
    modelValue: null,
  },
};
</script>
