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
        <BaseField label="ISO:">{{ dateISO(value) }}</BaseField>
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
    <DatePicker v-bind="$attrs">
      <template v-for="(index, name) in $slots" v-slot:[name]="props">
        <slot :name="name" v-bind="props" />
      </template>
    </DatePicker>
  </div>
</template>

<script>
import { computed } from 'vue';
import { capitalize } from 'lodash';
import Locale from '@plugin/utils/locale';

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
    function dateISO(val) {
      if (val == null) return 'null';
      const locale = new Locale();
      const date = locale.toDate(val);
      return date.toISOString();
    }
    return {
      value,
      isRange,
      dateType,
      dateRaw,
      dateISO,
      capitalize,
    };
  },
};
</script>
