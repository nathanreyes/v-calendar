<template>
  <div class="vc-base-select">
    <BaseIcon v-if="showIcon" name="ChevronDown" :size="small ? '16' : '18'" />
    <select
      v-bind="$attrs"
      :value="modelValue"
      class="vc-focus"
      :class="{
        'vc-has-icon': showIcon,
        'vc-align-right': alignRight,
        'vc-align-left': alignLeft,
        'vc-small': small,
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
  alignLeft: Boolean,
  showIcon: Boolean,
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
    text-align: center;
    &:hover {
      background-color: var(--vc-select-hover-bg);
    }
    &.vc-has-icon {
      padding: 0px 24px 0 10px;
    }
    &.vc-small {
      font-size: var(--vc-text-sm);
      &.vc-has-icon {
        padding: 0 20px 0 8 px;
      }
    }
    &.vc-align-left {
      text-align: left;
    }
    &.vc-align-right {
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
