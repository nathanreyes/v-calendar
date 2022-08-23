<template>
  <Example centered>
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
    <DatePicker
      v-if="!isRange"
      v-bind="$attrs"
      :mode="mode"
      v-model="date"
      :is24hr="is24hr"
      :timezone="timezone"
    >
      <template v-slot="{ inputValue, inputEvents }" v-if="showInput">
        <input
          class="bg-white border px-2 py-1 rounded"
          :value="inputValue"
          v-on="inputEvents"
        />
      </template>
    </DatePicker>
    <!--Date Range Picker-->
    <DatePicker
      v-else
      :mode="mode"
      v-model="dateRange"
      :timezone="timezone"
      :is24hr="is24hr"
      is-range
    >
      <template v-slot="{ inputValue, inputEvents }" v-if="showInput">
        <input
          class="bg-white border px-2 py-1 rounded"
          :value="inputValue"
          v-on="inputEvents"
        />
      </template>
    </DatePicker>
    <!--Date Range (ISO)-->
    <template v-if="!isRange">
      <div class="flex items-baseline mt-2">
        <span
          class="text-gray-500 dark:text-gray-400 font-semibold tracking-wide"
          >Date (ISO):</span
        >
        <span class="font-medium ml-2">{{
          date ? date.toISOString() : 'null'
        }}</span>
      </div>
    </template>
    <!--Date (ISO)-->
    <template v-else>
      <div class="flex mt-4">
        <span
          class="font-semibold text-gray-500 dark:text-gray-300 w-24 text-right"
          >Start (ISO):</span
        ><span class="font-medium ml-2">{{
          dateRange && dateRange.start.toISOString()
        }}</span>
      </div>
      <div class="flex mt-2">
        <span
          class="font-semibold text-gray-500 dark:text-gray-300 w-24 text-right"
          >End (ISO):</span
        ><span class="font-medium ml-2">{{
          dateRange && dateRange.end.toISOString()
        }}</span>
      </div>
    </template>
  </Example>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    mode: {
      type: String,
      default: 'date',
    },
    isRange: Boolean,
    showInput: Boolean,
    is24hr: Boolean,
    timezone: {
      type: String,
      default: '',
    },
    showTimezone: Boolean,
  },
  data() {
    const date = new Date();
    const start = new Date(2020, 0, 6);
    const end = new Date(2020, 0, 10);
    return {
      date: new Date(),
      dateRange: { start, end },
    };
  },
};
</script>
