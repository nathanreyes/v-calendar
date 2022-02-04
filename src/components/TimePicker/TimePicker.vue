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
        <time-select v-model.number="uiHours" :options="hourOptions" />
        <span style="margin: 0 4px">:</span>
        <time-select v-model.number="uiMinutes" :options="minuteOptions" />
        <div v-if="!is24hr" class="vc-am-pm">
          <button
            :class="{ active: isAM, 'vc-disabled': amDisabled }"
            @click.prevent="setAM(true)"
            type="button"
          >
            AM
          </button>
          <button
            :class="{ active: !isAM, 'vc-disabled': pmDisabled }"
            @click.prevent="setAM(false)"
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
import { arrayHasItems, pad } from '../../utils/helpers';
import { isArray, isObject } from '../../utils/_';

const _24HourOptions = [
  { value: 0, label: '00' },
  { value: 1, label: '01' },
  { value: 2, label: '02' },
  { value: 3, label: '03' },
  { value: 4, label: '04' },
  { value: 5, label: '05' },
  { value: 6, label: '06' },
  { value: 7, label: '07' },
  { value: 8, label: '08' },
  { value: 9, label: '09' },
  { value: 10, label: '10' },
  { value: 11, label: '11' },
  { value: 12, label: '12' },
  { value: 13, label: '13' },
  { value: 14, label: '14' },
  { value: 15, label: '15' },
  { value: 16, label: '16' },
  { value: 17, label: '17' },
  { value: 18, label: '18' },
  { value: 19, label: '19' },
  { value: 20, label: '20' },
  { value: 21, label: '21' },
  { value: 22, label: '22' },
  { value: 23, label: '23' },
];
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
    minuteIncrement: { type: Number, default: 1 },
    showBorder: Boolean,
    validHours: [Object, Array, Function],
  },
  data() {
    return {
      hours: this.modelValue.hours === 24 ? 0 : this.modelValue.hours,
      minutes: this.modelValue.minutes,
      isAM: this.modelValue.hours < 12,
    };
  },
  computed: {
    date() {
      let date = this.locale.normalizeDate(this.modelValue);
      if (this.modelValue.hours === 24) {
        date = new Date(date.getTime() - 1);
      }
      return date;
    },
    uiHours: {
      get() {
        return this.hours;
      },
      set(value) {
        this.hours = value;
        this.updateValue(value, this.minutes);
      },
    },
    uiMinutes: {
      get() {
        return this.minutes;
      },
      set(value) {
        this.minutes = value;
        this.updateValue(this.hours, value);
      },
    },
    fullHourOptions() {
      return this.filterHourOptions(_24HourOptions);
    },
    amHourOptions() {
      return this.filterHourOptions(_amOptions);
    },
    pmHourOptions() {
      return this.filterHourOptions(_pmOptions);
    },
    hourOptions() {
      if (this.is24hr) return this.fullHourOptions;
      if (this.isAM) return this.amHourOptions;
      return this.pmHourOptions;
    },
    minuteOptions() {
      const options = [];
      let m = 0;
      let added = false;
      while (m <= 59) {
        options.push({
          value: m,
          label: pad(m, 2),
        });
        added = added || m === this.minutes;
        m += this.minuteIncrement;
        // Add disabled option if interval has skipped it
        if (!added && m > this.minutes) {
          added = true;
          options.push({
            value: this.minutes,
            label: pad(this.minutes, 2),
            disabled: true,
          });
        }
      }
      return options;
    },
    amDisabled() {
      return !arrayHasItems(this.amHourOptions);
    },
    pmDisabled() {
      return !arrayHasItems(this.pmHourOptions);
    },
  },
  watch: {
    modelValue(value) {
      this.updateValue(value.hours, value.minutes);
    },
    validHours() {
      this.updateValue();
    },
  },
  created() {
    this.updateValue();
  },
  methods: {
    setAM(am) {
      this.isAM = am;
      let hours = this.hours;
      if (am && hours >= 12) {
        hours -= 12;
      } else if (!am && hours < 12) {
        hours += 12;
      }
      this.updateValue(hours, this.minutes);
    },
    nearestOptionValue(value, options) {
      if (value == null) return value;
      const result = options.reduce((prev, opt) => {
        if (opt.disabled) return prev;
        if (isNaN(prev)) return opt.value;
        const diffPrev = Math.abs(prev - value);
        const diffCurr = Math.abs(opt.value - value);
        return diffCurr < diffPrev ? opt.value : prev;
      }, NaN);
      return isNaN(result) ? value : result;
    },
    updateValue(hours = this.hours, minutes = this.minutes) {
      this.hours = this.nearestOptionValue(hours, this.hourOptions);
      this.minutes = this.nearestOptionValue(minutes, this.minuteOptions);
      if (
        this.hours !== this.modelValue.hours ||
        this.minutes !== this.modelValue.minutes
      ) {
        this.$emit('update:modelValue', {
          ...this.modelValue,
          hours: this.hours,
          minutes: this.minutes,
          seconds: 0,
          milliseconds: 0,
        });
      }
    },
    filterHourOptions(options) {
      const result = [];
      options.forEach(opt => {
        if (this.hourIsValid(opt.value)) {
          result.push({ ...opt });
        } else if (opt.value === this.hours) {
          result.push({ ...opt, disabled: true });
        }
      });
      return result;
    },
    hourIsValid(hour) {
      if (!this.validHours) return true;
      if (isArray(this.validHours)) return this.validHours.includes(hour);
      if (isObject(this.validHours)) {
        const min = this.validHours.min || 0;
        const max = this.validHours.max || 24;
        return min <= hour && max >= hour;
      }
      return this.validHours(hour, this.modelValue);
    },
  },
};
</script>
