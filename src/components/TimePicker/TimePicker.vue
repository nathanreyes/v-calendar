<template>
  <div
    class="vc-time-picker"
    :class="[{ 'vc-invalid': !modelValue.isValid, 'vc-bordered': showBorder }]"
  >
    <div>
      <svg
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        class="vc-time-icon"
        stroke="currentColor"
      >
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <div class="vc-time-content">
      <div v-if="date" class="vc-time-date">
        <span class="vc-time-weekday">
          {{ locale.format(date, 'WWW') }}
        </span>
        <span class="vc-time-month">
          {{ locale.format(date, 'MMM') }}
        </span>
        <span class="vc-time-day">
          {{ locale.format(date, 'D') }}
        </span>
        <span class="vc-time-year">
          {{ locale.format(date, 'YYYY') }}
        </span>
      </div>
      <div class="vc-time-select">
        <time-select v-model.number="hours" :options="hourOptions_" />
        <span style="margin: 0 4px">:</span>
        <time-select v-model.number="minutes" :options="minuteOptions" />
        <div v-if="!is24hr" class="vc-am-pm">
          <button
            :class="{ active: isAM, 'vc-disabled': amDisabled }"
            @click.prevent="isAM = true"
            type="button"
          >
            AM
          </button>
          <button
            :class="{ active: !isAM, 'vc-disabled': pmDisabled }"
            @click.prevent="isAM = false"
            type="button"
          >
            PM
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TimeSelect from '../TimeSelect/TimeSelect.vue';
import { arrayHasItems } from '../../utils/helpers';

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

export default {
  name: 'TimePicker',
  components: { TimeSelect },
  emits: ['update:modelValue'],
  props: {
    modelValue: { type: Object, required: true },
    locale: { type: Object, required: true },
    theme: { type: Object, required: true },
    is24hr: { type: Boolean, default: true },
    showBorder: Boolean,
    hourOptions: Array,
    minuteOptions: Array,
  },
  computed: {
    date() {
      let date = this.locale.normalizeDate(this.modelValue);
      if (this.modelValue.hours === 24) {
        date = new Date(date.getTime() - 1);
      }
      return date;
    },
    hours: {
      get() {
        return this.modelValue.hours;
      },
      set(value) {
        this.updateValue(value, this.minutes);
      },
    },
    minutes: {
      get() {
        return this.modelValue.minutes;
      },
      set(value) {
        this.updateValue(this.hours, value);
      },
    },
    isAM: {
      get() {
        return this.modelValue.hours < 12;
      },
      set(value) {
        let hours = this.hours;
        if (value && hours >= 12) {
          hours -= 12;
        } else if (!value && hours < 12) {
          hours += 12;
        }
        this.updateValue(hours, this.minutes);
      },
    },
    amHourOptions() {
      return _amOptions.filter(opt =>
        this.hourOptions.some(ho => ho.value === opt.value),
      );
    },
    pmHourOptions() {
      return _pmOptions.filter(opt =>
        this.hourOptions.some(ho => ho.value === opt.value),
      );
    },
    hourOptions_() {
      if (this.is24hr) return this.hourOptions;
      if (this.isAM) return this.amHourOptions;
      return this.pmHourOptions;
    },
    amDisabled() {
      return !arrayHasItems(this.amHourOptions);
    },
    pmDisabled() {
      return !arrayHasItems(this.pmHourOptions);
    },
  },
  methods: {
    updateValue(hours, minutes = this.minutes) {
      if (hours !== this.hours || minutes !== this.minutes) {
        this.$emit('update:modelValue', {
          ...this.modelValue,
          hours,
          minutes,
          seconds: 0,
          milliseconds: 0,
        });
      }
    },
  },
};
</script>
