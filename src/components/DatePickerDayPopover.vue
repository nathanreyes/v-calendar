<template>
  <div :class="{ 'is-range': isRange }">
    <div class="date-label">
      <div v-if="dateLabel">{{ this.dateLabel }}</div>
      <div v-if="startDateLabel">{{ this.startDateLabel }}</div>
      <div v-if="endDateLabel">{{ this.endDateLabel }}</div>
    </div>
    <div v-if="isRange" class="days-nights">
      <span class="days">
        <svg-icon name="sun" class="c-sun"></svg-icon>
        {{ days }}
      </span>
      <span class="nights">
        <svg-icon name="moon" class="c-moon"></svg-icon>
        {{ nights }}
      </span>
    </div>
  </div>
</template>

<script>
import SvgIcon from './SvgIcon';

export default {
  components: {
    SvgIcon,
  },
  props: {
    attribute: Object,
    dayFormat: String,
    format: Function,
  },
  data() {
    return {
      sun,
      moon,
    };
  },
  computed: {
    date() {
      return this.attribute.targetDate;
    },
    isDate() {
      return this.date.isDate;
    },
    isRange() {
      return this.date.isRange;
    },
    days() {
      return this.date.daySpan + 1;
    },
    nights() {
      return this.date.daySpan;
    },
    dateLabel() {
      if (!this.date || !this.date.date) return '';
      return this.getDateString(this.date.date);
    },
    startDateLabel() {
      if (!this.date || !this.date.start) return '';
      return this.getDateString(this.date.start);
    },
    endDateLabel() {
      if (!this.date || !this.date.end) return '';
      return this.getDateString(this.date.end);
    },
  },
  methods: {
    getDateString(date) {
      return this.format(date, this.dayFormat);
    },
  },
};
</script>

<style lang='sass' scoped>

@import '../styles/vars.sass'

.date-label
  text-align: center

.days-nights
  display: flex
  justify-content: center
  align-items: center
  margin-top: 3px
  .days, .nights
    font-weight: 700
    display: flex
    align-items: center
    &:not(:first-child)
      margin-left: 13px
  .c-sun, .c-moon
    margin-right: 5px
    width: 16px
    height: 16px
  .c-sun
    color: $day-popover-sun-color
  .c-moon
    color: $day-popover-moon-color

</style>