<template>
  <div class="example">
    <v-calendar
      :from-page="{ month: 10, year: 2020 }"
      :timezone="timezone"
      :attributes="attrs"
    />
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
    return {
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
      attrs: [
        {
          highlight: true,
          dates: { start: '2020-10-05T10:00:00Z', end: '2020-10-09T09:00:00Z' },
        },
        {
          dot: 'pink',
          dates: '2020-10-01T18:00:00Z',
        },
        {
          dot: 'indigo',
          dates: '2020-10-11T19:00:00Z',
        },
        {
          dot: 'indigo',
          dates: '2020-10-15T01:00:00Z',
        },
        {
          dot: 'red',
          dates: '2020-10-21T05:00:00Z',
        },
        {
          dot: 'green',
          dates: '2020-10-21T00:00:00Z',
        },
        {
          dot: 'blue',
          dates: '2020-10-29T03:00:00Z',
        },
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
