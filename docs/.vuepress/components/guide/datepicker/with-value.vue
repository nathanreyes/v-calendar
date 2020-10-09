<template>
  <div class="example">
    <v-date-picker v-if="!isRange" :mode="mode" v-model="date">
      <template v-slot="{ inputValue, inputEvents }" v-if="showInput">
        <input
          class="bg-white border px-2 py-1 rounded"
          :value="inputValue"
          v-on="inputEvents"
        />
      </template>
    </v-date-picker>
    <v-date-picker v-else :mode="mode" v-model="dateRange" is-range>
      <template v-slot="{ inputValue, inputEvents }" v-if="showInput">
        <input
          class="bg-white border px-2 py-1 rounded"
          :value="inputValue"
          v-on="inputEvents"
        />
      </template>
    </v-date-picker>
    <template v-if="!isRange">
      <div class="flex items-baseline mt-2">
        <span class="text-gray-600 font-semibold tracking-wide">Date:</span>
        <span class="text-gray-800 ml-2">{{ date.toISOString() }}</span>
      </div>
    </template>
    <template v-else>
      <div class="flex mt-2">
        <span class="font-semibold text-gray-600 w-12">Start:</span
        ><span class="ml-2">{{
          dateRange && dateRange.start.toISOString()
        }}</span>
      </div>
      <div class="flex mt-2">
        <span class="font-semibold text-gray-600 w-12">End:</span
        ><span class="ml-2">{{
          dateRange && dateRange.end.toISOString()
        }}</span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      default: 'date',
    },
    isRange: Boolean,
    showInput: Boolean,
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
