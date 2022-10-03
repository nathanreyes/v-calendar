<template>
  <div
    class="vc-time-picker"
    :class="[{ 'vc-invalid': !isValid, 'vc-bordered': showBorder }]"
  >
    <slot name="time-header">
      <div v-if="showHeader" class="vc-time-header">
        <span class="vc-time-weekday">
          {{ locale.formatDate(date, 'WWW') }}
        </span>
        <span class="vc-time-month">
          {{ locale.formatDate(date, 'MMM') }}
        </span>
        <span class="vc-time-day">
          {{ locale.formatDate(date, 'D') }}
        </span>
        <span class="vc-time-year">
          {{ locale.formatDate(date, 'YYYY') }}
        </span>
      </div>
    </slot>
    <div class="vc-time-select-group">
      <svg
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        class="vc-time-select-group-icon"
        stroke="currentColor"
      >
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <TimeSelect v-model.number="hours" :options="hourOptions" />
      <template v-if="timeAccuracy > 1">
        <span class="vc-time-colon">:</span>
        <TimeSelect v-model.number="minutes" :options="options.minutes" />
      </template>
      <template v-if="timeAccuracy > 2">
        <span class="vc-time-colon">:</span>
        <TimeSelect v-model.number="seconds" :options="options.seconds" />
      </template>
      <template v-if="timeAccuracy > 3">
        <span class="vc-time-decimal">.</span>
        <TimeSelect
          v-model.number="milliseconds"
          :options="options.milliseconds"
        />
      </template>
      <TimeSelect v-if="!is24hr" v-model="isAM" :options="isAMOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TimeSelect from '../TimeSelect/TimeSelect.vue';
import { createTimePicker } from '../../use/timePicker';

const props = defineProps<{
  position: number;
}>();

const {
  locale,
  isValid,
  date,
  hours,
  minutes,
  seconds,
  milliseconds,
  options,
  hourOptions,
  isAM,
  isAMOptions,
  is24hr,
  showHeader,
  showBorder,
  timeAccuracy,
} = createTimePicker(props);
</script>
