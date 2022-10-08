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
    <BaseSelectGroup icon="Clock">
      <BaseIcon name="Clock" size="17" />
      <BaseSelect v-model.number="hours" :options="hourOptions" />
      <template v-if="timeAccuracy > 1">
        <span class="vc-time-colon">:</span>
        <BaseSelect v-model.number="minutes" :options="options.minutes" />
      </template>
      <template v-if="timeAccuracy > 2">
        <span class="vc-time-colon">:</span>
        <BaseSelect v-model.number="seconds" :options="options.seconds" />
      </template>
      <template v-if="timeAccuracy > 3">
        <span class="vc-time-decimal">.</span>
        <BaseSelect
          v-model.number="milliseconds"
          :options="options.milliseconds"
        />
      </template>
      <BaseSelect v-if="!is24hr" v-model="isAM" :options="isAMOptions" />
    </BaseSelectGroup>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '../BaseIcon/BaseIcon.vue';
import BaseSelectGroup from '../BaseSelectGroup/BaseSelectGroup.vue';
import BaseSelect from '../BaseSelect/BaseSelect.vue';
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
