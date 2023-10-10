<template>
  <div
    class="vc-base-select"
    :class="{
      'vc-fit-content': fitContent,
      'vc-has-icon': showIcon,
    }"
  >
    <select
      v-bind="$attrs"
      :value="modelValue"
      class="vc-focus"
      :class="{
        'vc-align-right': alignRight,
        'vc-align-left': alignLeft,
      }"
      @change="
        $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
      "
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
    <BaseIcon v-if="showIcon" name="ChevronDown" size="18" />
    <div v-if="fitContent" class="vc-base-sizer" aria-hidden="true">
      {{ selectedLabel }}
    </div>
  </div>
</template>

<script lang="ts">
interface BaseOption {
  value: any;
  label: string;
  disabled?: boolean;
}

export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed } from 'vue';
import BaseIcon from '../BaseIcon/BaseIcon.vue';

const props = defineProps<{
  options: BaseOption[];
  modelValue: any;
  alignRight?: boolean;
  alignLeft?: boolean;
  showIcon?: boolean;
  fitContent?: boolean;
}>();
defineEmits(['update:modelValue']);

const selectedLabel = computed(() => {
  const option = props.options.find(opt => opt.value === props.modelValue);
  return option?.label;
});
</script>

<style lang="css">
.vc-base-select {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  font-size: var(--vc-text-base);
  font-weight: var(--vc-font-medium);
  &.vc-has-icon {
    & select {
      padding: 0 27px 0 9px;
    }
    & .vc-base-sizer {
      padding: 0 28px 0 10px;
    }
  }
  &.vc-fit-content {
    & select {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
  }
  & .vc-base-icon {
    position: absolute;
    top: 6px;
    right: 4px;
    opacity: 0.6;
    pointer-events: none;
  }
  & .vc-base-sizer {
    font-size: var(--vc-text-base);
    font-weight: var(--vc-font-medium);
    color: transparent;
    padding: 0px 8px;
    margin: 0;
  }
  & select {
    display: inline-flex;
    justify-content: center;
    color: var(--vc-select-color);
    display: block;
    appearance: none;
    background-color: var(--vc-select-bg);
    border-radius: var(--vc-rounded);
    height: 30px;
    width: max-content;
    padding: 0px 7px;
    margin: 0;
    line-height: var(--leading-none);
    text-indent: 0px;
    background-image: none;
    cursor: pointer;
    text-align: center;
    &:hover {
      background-color: var(--vc-select-hover-bg);
    }
    &.vc-align-left {
      text-align: left;
    }
    &.vc-align-right {
      text-align: right;
    }
  }
}
</style>
