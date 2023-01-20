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
.vc-base-select {
  position: relative;
  & select {
    color: var(--vc-select-color);
    display: block;
    appearance: none;
    background-color: transparent;
    font-size: var(--vc-text-base);
    font-weight: var(--vc-font-medium);
    border-radius: var(--vc-rounded);
    height: 30px;
    width: max-content;
    padding: 0px 4px;
    margin: 0;
    line-height: var(--leading-none);
    text-indent: 0px;
    background-image: none;
    cursor: pointer;
    &:hover {
      background-color: var(--vc-select-hover-bg);
    }
    &.has-icon {
      padding: 0px 24px 0 10px;
    }
    &:not(.transparent) {
      background-color: var(--vc-select-bg);
      border: 1px solid var(--vc-select-border);
    }
    &.small {
      font-size: var(--vc-text-sm);
      &.has-icon {
        padding: 0 20px 0 8 px;
      }
    }
    &.align-right {
      text-align: right;
    }
  }
  & .vc-base-icon {
    position: absolute;
    top: 6px;
    right: 4px;
    opacity: 0.6;
    pointer-events: none;
  }
}
</style>
