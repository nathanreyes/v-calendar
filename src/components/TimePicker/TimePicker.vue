<template>
  <div
    class="vc-time-picker"
    :class="[{ 'vc-invalid': !(parts as DateParts).isValid, 'vc-bordered': showBorder }]"
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
      <template v-if="timeAccuracy > 2 && hasValue">
        <span class="vc-time-colon">:</span>
        <TimeSelect v-model.number="seconds" :options="options.seconds" />
      </template>
      <template v-if="timeAccuracy > 3 && hasValue">
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
import { computed } from 'vue';
import TimeSelect from '../TimeSelect/TimeSelect.vue';
import { arrayHasItems } from '../../utils/helpers';
import { DateParts, DatePatch, getDatePartsOptions } from '../../utils/dates';
import { useBase } from '../../use/base';
import {
  RangePriority,
  ValueTarget,
  useDatePicker,
} from '../../use/datePicker';

const _amOptions = [
  { value: 0, label: '12' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' },
  { value: 11, label: '11' },
];
const _pmOptions = [
  { value: 12, label: '12' },
  { value: 13, label: '1' },
  { value: 14, label: '2' },
  { value: 15, label: '3' },
  { value: 16, label: '4' },
  { value: 17, label: '5' },
  { value: 18, label: '6' },
  { value: 19, label: '7' },
  { value: 20, label: '8' },
  { value: 21, label: '9' },
  { value: 22, label: '10' },
  { value: 23, label: '11' },
];

const props = defineProps<{
  position: number;
}>();

const { locale } = useBase();
const {
  isRange,
  isTime,
  dateParts,
  modelConfig,
  is24hr,
  hideTimeHeader,
  timeAccuracy,
  updateValue: updateDpValue,
} = useDatePicker();

interface TimeParts {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

function updateParts(newParts: Partial<TimeParts>) {
  newParts = Object.assign(parts.value, newParts);
  let newValue = null;
  if (isRange.value) {
    const start = isStart.value ? newParts : dateParts.value[0];
    const end = isStart.value ? dateParts.value[1] : newParts;
    newValue = { start, end };
  } else {
    newValue = newParts;
  }
  updateDpValue(newValue, {
    patch: DatePatch.Time,
    rangePriority: isStart.value ? RangePriority.Start : RangePriority.End,
    moveToValue: isStart.value ? ValueTarget.Start : ValueTarget.End,
  });
}

const isStart = computed(() => props.position === 0);
const rules = computed(() => modelConfig.value[props.position].rules);
const parts = computed(() => dateParts.value[props.position]);
const showBorder = computed(() => !isTime.value);
const hasValue = computed(
  () => parts.value && (parts.value as DateParts).hours != null,
);
const showHeader = computed(() => {
  return !hideTimeHeader.value && hasValue.value;
});

const date = computed(() => {
  let date = locale.value.normalizeDate(parts.value);
  if ((parts.value as DateParts).hours === 24) {
    date = new Date(date.getTime() - 1);
  }
  return date;
});

const hours = computed<number>({
  get() {
    return (parts.value as DateParts).hours;
  },
  set(val) {
    updateParts({ hours: val });
  },
});

const minutes = computed<number>({
  get() {
    return (parts.value as DateParts).minutes;
  },
  set(val) {
    updateParts({ minutes: val });
  },
});

const seconds = computed<number>({
  get() {
    return (parts.value as DateParts).seconds;
  },
  set(val) {
    updateParts({ seconds: val });
  },
});

const milliseconds = computed<number>({
  get() {
    return (parts.value as DateParts).milliseconds;
  },
  set(val) {
    updateParts({ milliseconds: val });
  },
});

const isAM = computed({
  get() {
    return (parts.value as DateParts).hours < 12;
  },
  set(value) {
    let hValue = hours.value;
    if (value && hValue >= 12) {
      hValue -= 12;
    } else if (!value && hValue < 12) {
      hValue += 12;
    }
    updateParts({ hours: hValue });
  },
});

const options = computed(() =>
  getDatePartsOptions(parts.value as DateParts, rules.value),
);

const amHourOptions = computed(() => {
  return _amOptions.filter(opt =>
    options.value.hours.some(ho => ho.value === opt.value),
  );
});

const pmHourOptions = computed(() => {
  return _pmOptions.filter(opt =>
    options.value.hours.some(ho => ho.value === opt.value),
  );
});

const hourOptions = computed(() => {
  if (is24hr.value) return options.value.hours;
  if (isAM.value) return amHourOptions.value;
  return pmHourOptions.value;
});

const isAMOptions = computed(() => {
  const result = [];
  if (arrayHasItems(amHourOptions.value))
    result.push({ value: true, label: 'AM' });
  if (arrayHasItems(pmHourOptions.value))
    result.push({ value: false, label: 'PM' });
  return result;
});
</script>
