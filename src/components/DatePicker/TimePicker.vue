<template>
  <div
    class="vc-time-picker"
    :class="[{ 'vc-invalid': !isValid, 'vc-attached': !isTimeMode }]"
  >
    <CalendarSlot name="time-header">
      <div v-if="showHeader && date" class="vc-time-header">
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
    </CalendarSlot>
    <div class="vc-time-select-group">
      <BaseIcon name="Clock" size="17" />
      <BaseSelect
        v-model.number="hours"
        :options="hourOptions"
        class="vc-time-select-hours"
        align-right
      />
      <template v-if="timeAccuracy > 1">
        <span class="vc-time-colon">:</span>
        <BaseSelect
          v-model.number="minutes"
          :options="options.minutes"
          class="vc-time-select-minutes"
          :align-left="timeAccuracy === 2"
        />
      </template>
      <template v-if="timeAccuracy > 2">
        <span class="vc-time-colon">:</span>
        <BaseSelect
          v-model.number="seconds"
          :options="options.seconds"
          class="vc-time-select-seconds"
          :align-left="timeAccuracy === 3"
        />
      </template>
      <template v-if="timeAccuracy > 3">
        <span class="vc-time-decimal">.</span>
        <BaseSelect
          v-model.number="milliseconds"
          :options="options.milliseconds"
          class="vc-time-select-milliseconds"
          align-left
        />
      </template>
      <BaseSelect v-if="!is24hr" v-model="isAM" :options="isAMOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { createTimePicker } from '../../use/timePicker';
import BaseIcon from '../BaseIcon/BaseIcon.vue';
import BaseSelect from '../BaseSelect/BaseSelect.vue';
import CalendarSlot from '../Calendar/CalendarSlot.vue';

const props = defineProps<{
  position: number;
}>();

const timePicker = createTimePicker(props);
defineExpose(timePicker);
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
  isTimeMode,
  isAM,
  isAMOptions,
  is24hr,
  showHeader,
  timeAccuracy,
} = timePicker;
</script>

<style lang="css">
.vc-time-picker {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 4px;
  &.vc-invalid {
    pointer-events: none;
    opacity: 0.5;
  }
  &.vc-attached {
    border-top: 1px solid var(--vc-time-picker-border);
  }
  > * + * {
    margin-top: 4px;
  }
}

.vc-time-header {
  display: flex;
  align-items: center;
  font-size: var(--vc-text-sm);
  font-weight: var(--vc-font-semibold);
  text-transform: uppercase;
  margin-top: -4px;
  padding-left: 4px;
  padding-right: 4px;
  line-height: 21px;
}

.vc-time-select-group {
  display: inline-flex;
  align-items: center;
  padding: 0 4px;
  background: var(--vc-time-select-group-bg);
  border-radius: var(--vc-rounded-md);
  border: 1px solid var(--vc-time-select-group-border);
  .vc-base-icon {
    margin-right: 4px;
    color: var(--vc-time-select-group-icon-color);
  }
  select {
    background: transparent;
    padding: 0px 4px;
  }
}

.vc-time-weekday {
  color: var(--vc-time-weekday-color);
  letter-spacing: var(--tracking-wide);
}

.vc-time-month {
  color: var(--vc-time-month-color);
  margin-left: 8px;
}

.vc-time-day {
  color: var(--vc-time-day-color);
  margin-left: 4px;
}

.vc-time-year {
  color: var(--vc-time-year-color);
  margin-left: 8px;
}

.vc-time-colon {
  margin: 0 1px 2px 2px;
}

.vc-time-decimal {
  margin: 0 0 0 1px;
}
</style>
