<template>
  <div class="example">
    <div class="flex">
      <div class="flex-shrink">
        <v-date-picker v-model="range" :model-config="modelConfig" is-range />
      </div>
      <div class="flex-grow ml-4 text-sm">
        <h4 class="text-gray-700">Select Date Range</h4>
        <div class="flex">
          <span class="inline-block w-16 font-semibold text-gray-600"
            >Start:</span
          ><span class="ml-2">{{ range && range.start }}</span>
        </div>
        <div class="flex mt-1">
          <span class="inline-block w-16 font-semibold text-gray-600">End:</span
          ><span class="ml-2">{{ range && range.end }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      range: {
        start: new Date(2020, 0, 6),
        end: new Date(2020, 0, 9),
      },
      modelConfig: {
        start: {
          timeAdjust: '00:00:00',
        },
        end: {
          timeAdjust: '23:59:59',
        },
      },
    };
  },
};
</script>
