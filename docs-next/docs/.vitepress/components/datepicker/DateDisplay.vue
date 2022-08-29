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
  <div class="w-full flex space-x-4">
    <!--Date Picker-->
    <div class="flex-shrink-0">
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
      <DatePicker v-else v-bind="$attrs" :timezone="timezone" is-range>
        <template v-slot="{ inputValue, inputEvents }" v-if="showInput">
          <input
            class="bg-white border px-2 py-1 rounded"
            :value="inputValue"
            v-on="inputEvents"
          />
        </template>
      </DatePicker>
    </div>
    <div class="flex-grow">
      <!--Date Display (ISO)-->
      <div v-if="!isRange">
        <DataField label="Date" />
        <DataField label="Type:">{{ dateType(value) }}</DataField>
        <DataField label="Value:">{{ dateLabel(value) }}</DataField>
      </div>
      <!--Date Range Display (ISO)-->
      <div v-else>
        <DataField v-if="value == null" label="Date Value"> Null </DataField>
        <template v-else>
          <DataField label="Start Date" />
          <DataField label="Type:">{{ dateType(value.start) }}</DataField>
          <DataField label="Value:">{{ dateLabel(value.start) }}</DataField>
          <DataField label="End Date" class="mt-4" />
          <DataField label="Type:">{{ dateType(value.end) }}</DataField>
          <DataField label="Value:">{{ dateLabel(value.end) }}</DataField>
        </template>
      </div>
    </div>
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
      dateType,
      dateLabel,
    };
  },
};
</script>
