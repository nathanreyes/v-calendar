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
        <time-select v-model.number="hours" :options="hourOptions" />
        <span style="margin: 0 4px">:</span>
        <time-select v-model.number="minutes" :options="minuteOptions" />
        <div v-if="!is24hr" class="vc-am-pm">
          <button
            :class="{ active: isAM }"
            @click.prevent="isAM = true"
            type="button"
          >
            AM
          </button>
          <button
            :class="{ active: !isAM }"
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
import { pad } from '../../utils/helpers';

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
  },
  data() {
    return {
      hours: 0,
      minutes: 0,
      isAM: true,
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
    hourOptions() {
      const options12 = [
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
      const options24 = [
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

      if (this.is24hr) return options24;
      return options12;
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
  },
  watch: {
    modelValue() {
      this.setup();
    },
    hours() {
      this.updateValue();
    },
    minutes() {
      this.updateValue();
    },
    isAM() {
      this.updateValue();
    },
  },
  created() {
    this.setup();
  },
  methods: {
    protected(fn) {
      if (this.busy) return;
      this.busy = true;
      fn();
      this.$nextTick(() => (this.busy = false));
    },
    setup() {
      this.protected(() => {
        let { hours } = this.modelValue;
        if (hours === 24) hours = 0;
        let isAM = true;
        if (!this.is24hr && hours >= 12) {
          hours -= 12;
          isAM = false;
        }
        this.hours = hours;
        this.minutes = this.modelValue.minutes;
        this.isAM = isAM;
      });
    },
    updateValue() {
      this.protected(() => {
        let hours = this.hours;
        if (!this.is24hr && !this.isAM) {
          hours += 12;
        }
        this.$emit('update:modelValue', {
          ...this.modelValue,
          hours,
          minutes: this.minutes,
          seconds: 0,
          milliseconds: 0,
        });
      });
    },
  },
};
</script>

<style lang="css" scoped>
@import './time-picker.css';
</style>
