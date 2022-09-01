<template>
  <div class="flex flex-col items-center">
    <div class="space-y-2 mb-4">
      <!--Date Display (ISO)-->
      <div class="flex space-x-6" v-if="!isRange">
        <BaseField label="Date Type:">{{ dateType(value) }}</BaseField>
        <BaseField label="Date Value:">{{ dateLabel(value) }}</BaseField>
      </div>
      <!--Date Range Display (ISO)-->
      <template v-else>
        <BaseField v-if="value == null" label="Date Value"> null </BaseField>
        <template v-else>
          <div class="flex space-x-4">
            <BaseField label="Start Type:">{{
              dateType(value.start)
            }}</BaseField>
            <BaseField label="Start Value:">{{
              dateLabel(value.start)
            }}</BaseField>
          </div>
          <div class="flex space-x-4">
            <BaseField label="End Type:">{{ dateType(value.end) }}</BaseField>
            <BaseField label="End Value:">{{ dateLabel(value.end) }}</BaseField>
          </div>
        </template>
      </template>
      <slot />
    </div>
    <!--Date Picker-->
    <DatePicker v-bind="$attrs">
      <template #default="{ inputValue, inputEvents }" v-if="showInput">
        <BaseInput :value="inputValue" v-on="inputEvents" />
      </template>
    </DatePicker>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  inheritAttrs: false,
  props: {
    showInput: Boolean,
  },
  setup(props, { attrs }) {
    const value = computed(() => {
      return attrs.modelValue;
    });
    const isRange = computed(() => {
      if (!attrs.modelModifiers) return false;
      return attrs.modelModifiers.range === true;
    });
    function dateType(val) {
      if (val == null) return 'null';
      if (val.toISOString) return 'date';
      return typeof val;
    }
    function dateLabel(val) {
      if (val == null) return 'null';
      if (val.toISOString) return val.toISOString();
      return val;
    }
    return {
      value,
      isRange,
      dateType,
      dateLabel,
    };
  },
};
</script>
