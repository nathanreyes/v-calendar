<template>
<!--Nav panel-->
<div class='c-nav'>
  <!--Nav years-->
  <div
    key='years'
    class='c-nav-years-container'
    v-if='mode === "year"'>
    <div class='c-nav-year-ranges'>
      <div class='c-nav-year-range is-button' @click='yearGroupIndex--'>
        ...{{ firstYear - 1 }}
      </div>
      <div class='c-nav-year-range is-faded'>
        {{ firstYear }} - {{ lastYear }}
      </div>
      <div class='c-nav-year-range is-button' @click='yearGroupIndex++'>
        {{ lastYear + 1 }}...
      </div>
    </div>
    <hr />
    <div class='c-nav-years'>
      <span
        v-for='item in yearItems'
        :key='item.year'
        :class='["c-nav-year", "is-button", {
          "is-active": item.year === year,
          "is-disabled": item.isDisabled,
        }]'
        @click='selectYear(item.year)'>
        {{ item.year }}
      </span>
    </div>
  </div>
  <!--Nav months-->
  <div
    key='months'
    class='c-nav-months-container'
    v-if='mode === "month"'>
    <div class='c-nav-months'>
      <span
        v-for='item in monthItems'
        :key='item.month'
        :class='["c-nav-month", "is-button", {
          "is-active": item.month === month,
          "is-disabled": item.isDisabled,
        }]'
        @click='selectMonth(item.month)'>
        {{ item.label.substring(0, 3) }}
      </span>
    </div>
  </div>
</div>
</template>

<script>
import {
  pageIsBeforePage,
  pageIsAfterPage,
  getFirstArrayItem,
  getLastArrayItem } from '../utils/helpers';

export default {
  props: {
    monthLabels: { type: Array, required: true },
    mode: { type: String, default: 'month' },
    value: { type: Object, default: () => ({ month: 0, year: 0 }) },
    minPage: Object,
    maxPage: Object,
    yearGroupCount: { type: Number, default: 16 },
  },
  data() {
    return {
      yearGroupIndex: 0,
    };
  },
  computed: {
    month() {
      return this.value ? this.value.month || 0 : 0;
    },
    year() {
      return this.value ? this.value.year || 0 : 0;
    },
    monthItems() {
      return this.monthLabels.map((ml, i) => ({
        month: i + 1,
        label: ml,
        isDisabled: this.pageIsDisabled(i + 1, this.year),
      }));
    },
    yearItems() {
      const startYear = this.yearGroupIndex * this.yearGroupCount;
      const endYear = startYear + this.yearGroupCount;
      const items = [];
      for (let i = startYear; i < endYear; i += 1) {
        items.push({
          year: i,
          isDisabled: this.pageIsDisabled(this.month, i),
        });
      }
      return items;
    },
    firstYear() {
      return getFirstArrayItem(this.yearItems.map(i => i.year), 0);
    },
    lastYear() {
      return getLastArrayItem(this.yearItems.map(i => i.year), 0);
    },
  },
  watch: {
    year() {
      this.refreshYearGroupIndex();
    },
  },
  created() {
    this.refreshYearGroupIndex();
  },
  methods: {
    refreshYearGroupIndex() {
      this.yearGroupIndex = Math.floor(this.year / this.yearGroupCount);
    },
    selectMonth(month) {
      if (month !== this.month) {
        this.$emit('input', {
          month,
          year: this.year,
        });
      }
    },
    selectYear(year) {
      if (year !== this.year) {
        this.$emit('input', {
          month: this.month,
          year,
        });
      }
    },
    pageIsDisabled(month, year) {
      if (this.minPage && pageIsBeforePage({ month, year }, this.minPage)) return true;
      if (this.maxPage && pageIsAfterPage({ month, year }, this.maxPage)) return true;
      return false;
    },
  },
};
</script>

<style lang='sass' scoped>

@import '../styles/mixins.sass'

=cells()
  display: flex
  justify-content: space-between
  flex-wrap: wrap

=cell()
  +box()
  color: #333333
  font-size: 0.9rem
  height: 30px
  user-select: none
  cursor: default
  transition: background-color 0.18s ease-in-out
  padding: 10px
  &.is-faded
    opacity: 0.8
  &.is-button
    cursor: pointer
    &:hover
      background-color: #d5d9dd
  &.is-active
    background-color: #eaeaea
    font-size: 0.92rem
    font-weight: 500
  &.is-disabled
    opacity: 0.4
    cursor: not-allowed
    &:hover
      background-color: transparent

hr
  background-color: #dbdbdb
  display: block
  margin: 3px auto
  width: 92%

.c-nav
  width: 230px
  transition: height 5s ease-in-out
  .c-nav-years-container
    .c-nav-year-ranges
      display: flex
      justify-content: space-between
      align-items: center
      .c-nav-year-range
        +cell()
        font-size: 0.8rem
    .c-nav-years
      +cells()
      .c-nav-year
        +cell()
        width: 23%
  .c-nav-months-container
    .c-nav-months
      +cells()
      .c-nav-month
        +cell()
        width: 32%

</style>
