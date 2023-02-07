<template>
  <div class="flex justify-center">
    <div class="form-check form-switch">
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" v-model="value" class="sr-only peer" />
        <div
          :class="`w-11 h-6 bg-gray-200 peer-focus:outline-none
        peer-focus:ring-4 peer-focus:ring-blue-300
        dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700
        peer-checked:after:translate-x-full peer-checked:after:border-white
        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
        after:bg-white after:border-gray-300 after:border after:rounded-full
        after:h-5 after:w-5 after:transition-all dark:border-gray-600
        peer-checked:bg-blue-600`"
        />
        <span
          v-if="label"
          class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
          >{{ label }}</span
        >
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{ id?: string; label?: string; modelValue: boolean }>(),
  {
    id: 'flexSwitchCheckDefault',
  },
);

const emit = defineEmits(['update:modelValue']);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});
</script>
