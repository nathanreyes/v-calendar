<template>
  <div class="flex flex-col items-center">
    <div class="space-y-2 mb-4">
      <!--Date Display (ISO)-->
      <div class="flex space-x-6" v-if="!isRange">
        <BaseField label="Value:"
          >{{ dateRaw(value) }}
          <span v-if="dateType(value)"
            >({{ capitalize(dateType(value)) }})</span
          ></BaseField
        >
      </div>
      <!--Date Range Display (ISO)-->
      <template v-else>
        <BaseField v-if="value == null" label="Date Value"> null </BaseField>
        <template v-else>
          <div class="flex space-x-4">
            <BaseField label="Start:"
              >{{ dateRaw(value.start) }}
              <span v-if="dateType(value.start)"
                >({{ dateType(value.start) }})</span
              ></BaseField
            >
            <BaseField label="End:"
              >{{ dateRaw(value.end) }}
              <span v-if="dateType(value.end)"
                >({{ dateType(value.end) }})</span
              ></BaseField
            >
          </div>
        </template>
      </template>
      <slot name="header" />
    </div>
    <!--Date Picker-->
    <VDatePicker v-bind="$attrs">
      <template v-for="(index, name) in $slots" v-slot:[name]="props">
        <slot :name="name" v-bind="props" />
      </template>
    </VDatePicker>
  </div>
</template>

<script>
import { computed } from 'vue';
import capitalize from 'lodash/capitalize';

export default {
  inheritAttrs: false,
  setup(props, { attrs }) {
    const value = computed(() => {
      return attrs.modelValue;
    });
    const isRange = computed(() => {
      if (!attrs.modelModifiers) return false;
      return attrs.modelModifiers.range === true;
    });
    function dateType(val) {
      if (val == null) return '';
      if (val.toISOString) return 'date';
      return typeof val;
    }
    function dateRaw(val) {
      if (val == null) return 'null';
      if (val.toLocaleString) return val.toLocaleString();
      return val.toString();
    }
    return {
      value,
      isRange,
      dateType,
      dateRaw,
      capitalize,
    };
  },
};
</script>
