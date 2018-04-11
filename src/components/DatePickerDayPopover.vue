<template>
<div>
  <div class='date-label'>
    <div v-if='dateLabel'>
      {{ this.dateLabel }}
    </div>
    <div v-if='startDateLabel'>
      {{ this.startDateLabel }}
    </div>
    <div v-if='endDateLabel'>
      {{ this.endDateLabel }}
    </div>
  </div>
  <div
    v-if='isRange'
    class='days-nights'>
    <span class='days'>
      <svg-icon
        :glyph='sun'
        class='vc-sun-o'>
      </svg-icon>
      {{ days }}
    </span>
    <span class='nights'>
      <svg-icon
        :glyph='moon'
        class='vc-moon-o'>
      </svg-icon>
      {{ nights }}
    </span>
  </div>
</div>
</template>

<script>
import SvgIcon from './SvgIcon';
import sun from '@/assets/icons/sun-o.svg';
import moon from '@/assets/icons/moon-o.svg';
import { format } from '@/utils/fecha';

export default {
  components: {
    SvgIcon,
  },
  props: {
    attribute: Object,
    format: String,
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
      return format(date, this.format);
    },
  },
};
</script>

<style lang='sass' scoped>

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
  .vc-sun-o, .vc-moon-o
    margin-right: 5px
    font-size: 1rem
  .vc-sun-o
    color: #ffb366
  .vc-moon-o
    color: #4d4d64
    
</style>