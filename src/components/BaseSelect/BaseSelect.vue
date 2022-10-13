<template>
  <div class="vc-base-select">
    <BaseIcon v-if="showIcon" name="ChevronDown" :size="small ? '16' : '18'" />
    <select
      v-bind="$attrs"
      :value="modelValue"
      class="vc-focus"
      :class="{
        'has-icon': showIcon,
        'align-right': alignRight,
        transparent,
        small,
      }"
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
};
</script>

<script setup>
import BaseIcon from '../BaseIcon/BaseIcon.vue';

defineProps({
  options: Array,
  modelValue: null,
  alignRight: Boolean,
  showIcon: Boolean,
  transparent: Boolean,
  small: Boolean,
});
defineEmits(['update:modelValue']);
</script>

<style lang="css">
@import './base-select.css';
</style>
