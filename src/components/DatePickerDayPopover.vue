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
    <span>
      <span
        class='vc-sun-o'>
      </span>
      {{ days }}
    </span>
    <span>
      <span
        class='vc-moon-o'>
      </span>
      {{ nights }}
    </span>
  </div>
</div>
</template>

<script>
export default {
  props: {
    attribute: Object,
    dayInfo: Object,
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
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString(window.navigator.userLanguage || window.navigator.language, options);
    },
  },
};
</script>

<style lang='sass' scoped>
=icon
  margin-right: 5px
  font-size: 1rem

.date-label
  text-align: center

.days-nights
  display: flex
  justify-content: center
  align-items: center
  margin-top: 3px
  & > span
    font-weight: 700
    display: flex
    align-items: center
    &:not(:first-child)
      margin-left: 13px
  .vc-sun-o, .vc-moon-o
    +icon
  .vc-sun-o
    color: #ffb366
  .vc-moon-o
    color: #4d4d64
</style>