<template>
  <div
    class="vc-time-picker"
    :class="[{ 'vc-disabled': isDisabled, 'vc-bordered': showBorder }]"
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
    <div class="vc-date-time">
      <div v-if="date" class="vc-date">
        <span class="vc-weekday">
          {{ locale.format(date, 'WWW') }}
        </span>
        <span class="vc-month">
          {{ locale.format(date, 'MMM') }}
        </span>
        <span class="vc-day">
          {{ locale.format(date, 'D') }}
        </span>
        <span class="vc-year">
          {{ locale.format(date, 'YYYY') }}
        </span>
      </div>
      <div class="vc-time">
        <time-select v-model.number="hours" :options="hourOptions_" />
        <span style="margin: 0 4px">:</span>
        <time-select v-model.number="minutes" :options="minuteOptions" />
        <div
          v-if="!is24hr"
          class="vc-am-pm"
          :class="{ 'vc-disabled': !(hours >= 0) }"
        >
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
import TimeSelect from './TimeSelect';
import { arrayHasItems } from '../utils/helpers';

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
  props: {
    value: { type: Object, required: true },
    locale: { type: Object, required: true },
    theme: { type: Object, required: true },
    is24hr: { type: Boolean, default: true },
    showBorder: Boolean,
    isDisabled: Boolean,
    hourOptions: Array,
    minuteOptions: Array,
  },
  computed: {
    date() {
      let date = this.locale.normalizeDate(this.value);
      if (this.value.hours === 24) {
        date = new Date(date.getTime() - 1);
      }
      return date;
    },
    hours: {
      get() {
        return this.value.hours;
      },
      set(value) {
        this.updateValue(value, this.minutes);
      },
    },
    minutes: {
      get() {
        return this.value.minutes;
      },
      set(value) {
        this.updateValue(this.hours, value);
      },
    },
    isAM: {
      get() {
        return this.value.hours < 12;
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
    updateValue(hours, minutes) {
      if (hours !== this.hours || minutes !== this.minutes) {
        this.$emit('input', {
          ...this.value,
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

<style lang="postcss" scoped>
.vc-time-picker {
  display: flex;
  align-items: center;
  padding: 8px;
  &.vc-invalid {
    pointer-events: none;
    opacity: 0.5;
  }
  &.vc-bordered {
    border-top: 1px solid var(--gray-400);
  }
}
.vc-date-time {
  margin-left: 8px;
}
.vc-disabled {
  pointer-events: none;
  opacity: 0.5;
}
.vc-time-icon {
  width: 16px;
  height: 16px;
  color: var(--gray-600);
}
.vc-date {
  display: flex;
  align-items: center;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  padding: 0 0 4px 4px;
  margin-top: -4px;
  & .vc-weekday {
    color: var(--gray-700);
    letter-spacing: var(--tracking-wide);
  }
  & .vc-month {
    color: var(--accent-600);
    margin-left: 8px;
  }
  & .vc-day {
    color: var(--accent-600);
    margin-left: 4px;
  }
  & .vc-year {
    color: var(--gray-500);
    margin-left: 8px;
  }
}
.vc-time {
  display: flex;
  align-items: center;
}
.vc-am-pm {
  display: flex;
  align-items: center;
  background: var(--gray-200);
  margin-left: 8px;
  padding: 4px;
  border-radius: var(--rounded);
  height: 30px;
  & button {
    color: var(--gray-900);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    padding: 0 4px;
    background: transparent;
    border: 2px solid transparent;
    border-radius: var(--rounded);
    line-height: var(--leading-snug);
    &:hover {
      color: var(--gray-600);
    }
    &:focus {
      border-color: var(--accent-400);
    }
    &.active {
      background: var(--accent-600);
      color: var(--white);
      &:hover {
        background: var(--accent-500);
      }
      &:focus {
        border-color: var(--accent-400);
      }
    }
  }
}
.vc-is-dark {
  & .vc-time-picker {
    border-color: var(--gray-700);
  }
  & .vc-time-icon {
    color: var(--gray-400);
  }
  & .vc-weekday {
    color: var(--gray-400);
  }
  & .vc-month {
    color: var(--accent-400);
  }
  & .vc-day {
    color: var(--accent-400);
  }
  & .vc-year {
    color: var(--gray-500);
  }
  & .vc-am-pm {
    background: var(--gray-700);
    &:focus {
      border-color: var(--accent-500);
    }
    & button {
      color: var(--gray-100);
      &:hover {
        color: var(--gray-400);
      }
      &:focus {
        border-color: var(--accent-500);
      }
      &.active {
        background: var(--accent-500);
        color: var(--white);
        &:hover {
          background: var(--accent-600);
        }
        &:focus {
          border-color: var(--accent-500);
        }
      }
    }
  }
}
</style>
