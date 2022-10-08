<template>
  <select
    v-bind="$attrs"
    :value="modelValue"
    class="vc-base-select"
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
</template>

<script setup>
defineProps({
  options: Array,
  modelValue: null,
});
defineEmits(['update:modelValue']);
</script>

<style lang="css">
@import './base-select.css';
</style>
