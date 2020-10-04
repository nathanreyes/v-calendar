<template>
  <div class="example">
    <v-calendar :timezone="timezone" :attributes="attrs" />
    <div class="w-full mt-4">
      <input class="w-full" type="range" min="0" :max="timezones.length - 1" v-model="timezoneIndex" />
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
        'Africa/Nairobi', // +3
        'Asia/Dhaka', // +6
        'Asia/Pyongyang', // +9
        'Asia/Magadan', // +11
      ],
      attrs: [{
        highlight: true,
        dates: { start: '2020-10-05T23:00:00Z', end: '2020-10-09T23:00:00Z'}
      }],
    }
  },
  computed: {
    timezone() {
      return this.timezones[this.timezoneIndex]
    }
  }
}
</script>