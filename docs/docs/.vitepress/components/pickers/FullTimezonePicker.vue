<template>
  <div class="w-full mt-4">
    <div class="flex justify-between w-full">
      <span class="text-sm font-bold">-11:00</span>
      <span class="text-sm font-bold">UTC</span>
      <span class="text-sm font-bold">+11:00</span>
    </div>
    <input
      class="w-full focus:outline-none"
      type="range"
      min="0"
      :max="timezones.length - 1"
      v-model="timezoneIndex"
    />
    <div class="flex font-semibold space-x-2">
      <span class="text-gray-600 dark:text-gray-400">Timezone:</span>
      <span>{{ modelValue }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

const timezoneIndex = computed({
  get() {
    return timezones.value.findIndex(
      s => s.toLowerCase() === props.modelValue.toLowerCase(),
    );
  },
  set(val) {
    emit('update:modelValue', timezones.value[val]);
  },
});

const timezones = ref([
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
]);
</script>
