<template>
  <div
    class="vc-flex vc-items-center vc-px-3 vc-pb-2 vc-bg-white vc-border-t"
    :class="{ 'vc-pointer-events-none vc-opacity-50': !value.isValid }"
  >
    <div>
      <svg
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        class="vc-w-4 vc-h-4 vc-text-gray-600"
        stroke="currentColor"
      >
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <div class="ml-2">
      <div class="vc-flex vc-justify-start vc-items-center vc-py-1 vc-ml-1">
        <div
          class="vc-text-sm text-gray-700 font-semibold uppercase tracking-wide"
        >
          {{ locale.format(date, 'WWW') }}
        </div>
        <div class="vc-text-sm text-blue-600 font-semibold uppercase ml-2">
          {{ locale.format(date, 'MMM') }}
        </div>
        <div class="vc-text-sm text-blue-600 font-semibold ml-1">
          {{ locale.format(date, 'DD') }}
        </div>
        <div class="vc-text-sm text-gray-500 font-semibold ml-2">
          {{ locale.format(date, 'YYYY') }}
        </div>
      </div>
      <div class="vc-flex vc-justify-center vc-items-center">
        <div>
          <select
            class="bg-gray-100 text-gray-800 font-medium border pl-1 py-1 rounded"
            v-model="hours"
          >
            <option
              v-for="{ value, label } in hourOptions"
              :key="value"
              :value="value"
            >
              {{ label }}
            </option>
          </select>
          <span>:</span>
          <select
            class="vc-bg-gray-100 vc-text-gray-800 vc-font-medium vc-border vc-pl-1 vc-py-1 vc-rounded"
            v-model="minutes"
          >
            <option
              v-for="{ value, label } in minuteOptions"
              :key="value"
              :value="value"
            >
              {{ label }}
            </option>
          </select>
        </div>
        <div
          class="vc-bg-gray-100 vc-ml-2 vc-flex vc-items-center vc-bg-white vc-p-1 vc-border vc-rounded"
        >
          <button
            class="vc-text-sm vc-font-semibold vc-px-1 vc-rounded"
            :class="
              isAM
                ? 'vc-bg-blue-600 vc-text-white hover:vc-bg-blue-500'
                : 'vc-text-gray-800 hover:vc-text-gray-600'
            "
            @click="isAM = true"
          >
            AM
          </button>
          <button
            class="vc-text-sm vc-font-semibold vc-px-1 vc-rounded vc-ml-1"
            :class="
              !isAM
                ? 'vc-bg-blue-600 vc-text-white hover:vc-bg-blue-500'
                : 'vc-text-gray-800 hover:vc-text-gray-600'
            "
            @click="isAM = false"
          >
            PM
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { pad } from '../utils/helpers';

export default {
  name: 'TimePicker',
  props: {
    value: { type: Object, required: true },
    locale: { type: Object, required: true },
  },
  data() {
    return {
      hours: 0,
      minutes: 0,
      minuteIncrement: 1,
      isAM: true,
    };
  },
  computed: {
    date() {
      let date = this.locale.normalizeDate(this.value);
      if (this.value.hours === 24) {
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
      while (m <= 59) {
        options.push({
          value: m,
          label: pad(m, 2),
        });
        m += this.minuteIncrement;
      }
      return options;
    },
  },
  watch: {
    value() {
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
        this.is24hr =
          this.locale.is24hr !== undefined ? this.locale.is24hr : false;
        let { hours } = this.value;
        if (hours === 24) hours = 0;
        let isAM = true;
        if (!this.is24hr && hours >= 12) {
          hours -= 12;
          isAM = false;
        }
        this.hours = hours;
        this.minutes = this.value.minutes;
        this.isAM = isAM;
      });
    },
    updateValue() {
      this.protected(() => {
        let hours = this.hours;
        if (!this.is24hr && !this.isAM) {
          hours += 12;
        }
        this.$emit('input', {
          ...this.value,
          hours,
          minutes: this.minutes,
        });
      });
    },
  },
};
</script>