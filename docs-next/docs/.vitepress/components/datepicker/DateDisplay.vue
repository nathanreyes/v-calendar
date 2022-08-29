<template>
  <!--Timezone select-->
  <div class="flex mb-2 space-x-4" v-if="showTimezone">
    <label class="text-gray-600 dark:text-gray-300 font-medium"
      ><input
        class="mr-2"
        type="radio"
        value=""
        v-model="timezone"
      />Local</label
    >
    <label class="text-gray-600 dark:text-gray-300 font-medium"
      ><input
        class="mr-2"
        type="radio"
        value="utc"
        v-model="timezone"
      />UTC</label
    >
  </div>
  <!--Date Picker-->
  <DatePicker v-if="!isRange" v-bind="$attrs" :timezone="timezone">
    <template v-slot="{ inputValue, inputEvents }" v-if="showInput">
      <input
        class="bg-white border px-2 py-1 rounded"
        :value="inputValue"
        v-on="inputEvents"
      />
    </template>
  </DatePicker>
  <!--Date Range Picker-->
  <DatePicker v-else v-model="dateRange" :timezone="timezone" is-range>
    <template v-slot="{ inputValue, inputEvents }" v-if="showInput">
      <input
        class="bg-white border px-2 py-1 rounded"
        :value="inputValue"
        v-on="inputEvents"
      />
    </template>
  </DatePicker>
  <!--Date Display (ISO)-->
  <div v-if="!isRange" class="mt-4">
    <DataField label="Date Type:">{{ dateType(value) }}</DataField>
    <DataField label="Date Value:">{{ value }}</DataField>
    <DataField label="Date (ISO):">{{ dateLabel(value) }}</DataField>
  </div>
  <!--Date Range Display (ISO)-->
  <div v-else class="mt-4">
    <DataField v-if="value == null" label="Date Value"> Null </DataField>
    <template v-else>
      <DataField label="Start (ISO):">dateLabel(value.start)</DataField>
      <DataField label="End (ISO):">dateLabel(value.end)</DataField>
    </template>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  inheritAttrs: false,
  props: {
    isRange: Boolean,
    showInput: Boolean,
    timezone: {
      type: String,
      default: '',
    },
    showTimezone: Boolean,
  },
  setup(props, { attrs }) {
    const value = computed(() => {
      return attrs.modelValue;
    });
    function dateType(val) {
      if (val != null && val.toISOString) return 'date';
      return typeof val;
    }
    function dateLabel(val) {
      if (val == null) return 'null';
      if (typeof val === 'string') return val;
      if (typeof val === 'number') {
        if (isNaN(val)) return 'NaN';
        return new Date(val).toISOString();
      }
      if (val.toISOString) return val.toISOString();
    }
    return {
      value,
      dateType,
      dateLabel,
    };
  },
};
</script>
