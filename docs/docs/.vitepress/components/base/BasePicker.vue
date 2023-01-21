<template>
  <BaseField>
    <div class="flex items-center space-x-3">
      <div
        class="flex space-x-2 hover:cursor-pointer text-sm font-medium hover:text-gray-500"
        v-for="option in opts"
        :key="option.value"
      >
        <input
          v-model="value"
          type="radio"
          :value="option.value"
          :id="option.id"
          class="hover:cursor-pointer"
          @click.stop
        />
        <label :for="option.id" class="hover:cursor-pointer">
          {{ option.label }}
        </label>
      </div>
    </div>
  </BaseField>
</template>

<script setup>
import { ref, computed } from 'vue';
import short from 'short-uuid';

const props = defineProps({
  options: { type: Array, default: () => [] },
  modelValue: {
    type: null,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue']);
const sid = ref(short.generate());
const opts = computed(() =>
  props.options.map(opt => ({
    ...opt,
    id: `${sid.value}-${opt.label}`,
  })),
);
const value = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});
</script>
