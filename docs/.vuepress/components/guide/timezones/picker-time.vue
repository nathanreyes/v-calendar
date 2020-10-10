<template>
  <div class="example">
    <v-date-picker
      mode="dateTime"
      v-model="dateRange"
      :timezone="timezone"
      is-range
    />
    <div class="flex mt-2">
      <span class="font-semibold text-gray-600 w-12">Start (ISO):</span
      ><span class="ml-2">{{
        dateRange && dateRange.start.toISOString()
      }}</span>
    </div>
    <div class="flex mt-2">
      <span class="font-semibold text-gray-600 w-12">End (ISO):</span
      ><span class="ml-2">{{ dateRange && dateRange.end.toISOString() }}</span>
    </div>
    <div class="w-full mt-4">
      <div class="flex justify-between w-full">
        <span class="text-sm font-bold text-gray-800">-11:00</span>
        <span class="text-sm font-bold text-gray-800">UTC</span>
        <span class="text-sm font-bold text-gray-800">+11:00</span>
      </div>
      <input
        class="w-full focus:outline-none"
        type="range"
        min="0"
        :max="timezones.length - 1"
        v-model="timezoneIndex"
      />
      <div class="flex">
        <span class="font-semibold text-gray-600 mr-2">Timezone:</span>
        <span class="text-gray-900">{{ timezone }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const start = new Date(2020, 0, 6);
    const end = new Date(2020, 0, 10);
    return {
      dateRange: {
        start,
        end,
      },
      timezoneIndex: 0,
      timezones: [
        'Pacific/Niue', // -11
        'US/Hawaii', // -10
        'America/Anchorage', // -9
        'America/Los_Angeles', // -8
        'America/Boise', // -7
        'America/Chicago', // -6
        'America/New_York', // -5
        'America/Aruba', // -4
        'America/Buenos_Aires', // -3
        'Brazil/DeNoronha', // -2,
        'Atlantic/Azores', // -1
        'UTC', // 0
        'Europe/Amsterdam', // +1
        'Europe/Athens', // +2
        'Europe/Moscow', // +3
        'Indian/Mahe', // +4
        'Asia/Ashgabat', // +5
        'Asia/Dhaka', // +6
        'Asia/Bangkok', // +7
        'Asia/Hong_Kong', // +8
        'Asia/Pyongyang', // +9
        'Australia/Sydney', // +10
        'Asia/Magadan', // +11
      ],
    };
  },
  computed: {
    timezone() {
      return this.timezones[this.timezoneIndex];
    },
  },
};
</script>
