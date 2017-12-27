<template>
<!--Nav panel-->
<div class='c-nav'>
  <!--Nav months-->
  <div
    v-if='mode_ === "month"'>
    <!--Months header-->
    <div class='c-header'>
      <!--Previous year button-->
      <span
        class='c-arrow vc-angle-left'
        :class='{ "c-disabled": !canMovePrevYear }'
        @click='yearIndex--'>
      </span>
      <!--Mode switch button-->
      <span
        class='c-title'
        @click='selectMode("year")'>
        {{ yearIndex }}
      </span>
      <!--Next year button-->
      <span
        class='c-arrow vc-angle-right'
        :class='{ "c-disabled": !canMoveNextYear }'
        @click='yearIndex++'>
      </span>
    </div>
    <!--Months table-->
    <table class='c-table'>
      <tr v-for='(row, i) in monthRows' :key='i'>
        <td
          v-for='item in row'
          :key='item.month'>
          <div
            class='c-table-cell'
            :class='{ "c-active": item.isActive, "c-disabled": item.isDisabled }'
            @click='monthClick(item.month)'>
            <!--Month label-->
            {{ item.label.substring(0, 3) }}
            <!--Attribute indicators-->
            <transition name='indicators'>
              <div
                v-if='item.attributes'
                class='c-indicators'>
                <span
                  class='c-indicator'
                  v-for='attribute in item.attributes'
                  :key='attribute.key'
                  :style='attribute.style'>
                </span>
              </div>
            </transition>
          </div>
        </td>
      </tr>
    </table>
  </div>
  <!--Nav years-->
  <div
    v-if='mode_ === "year"'>
    <div class='c-header'>
      <!--Previous year group button-->
      <span
        class='c-arrow vc-angle-left'
        :class='{ "c-disabled": !canMovePrevYearGroup }'
        @click='yearGroupIndex--'>
      </span>
      <!--Mode switch button-->
      <span
        class='c-title'
        @click='selectMode("month")'>
        {{ firstYear }} - {{ lastYear }}
      </span>
      <!--Next year group button-->
      <span
        class='c-arrow vc-angle-right'
        :class='{ "c-disabled": !canMoveNextYearGroup }'
        @click='yearGroupIndex++'>
      </span>
    </div>
    <!--Years table-->
    <table class='c-table'>
      <tr v-for='(row, i) in yearRows' :key='i'>
        <td
          v-for='item in row'
          :key='item.year'>
          <div
            class='c-table-cell'
            :class='{ "c-active": item.year === year, "c-disabled": item.isDisabled }'
            @click='yearClick(item.year)'>
            <!--Year label-->
            {{ item.year }}
          </div>
        </td>
      </tr>
    </table>
  </div>
</div>
</template>

<script>
import DateInfo from '../utils/dateInfo';
import {
  getMonthComps,
  getFirstArrayItem,
  getLastArrayItem } from '../utils/helpers';

const _yearGroupCount = 12;

export default {
  props: {
    monthLabels: { type: Array, required: true },
    mode: { type: String, default: 'month' },
    value: { type: Object, default: () => ({ month: 0, year: 0 }) },
    validator: { type: Function, default: () => () => true },
    attributes: Array,
  },
  data() {
    return {
      mode_: '',
      yearIndex: 0,
      yearGroupIndex: 0,
      attributesMap: {},
    };
  },
  computed: {
    month() {
      return this.value ? this.value.month || 0 : 0;
    },
    year() {
      return this.value ? this.value.year || 0 : 0;
    },
    canMovePrevYear() {
      return this.validator({ month: 12, year: this.yearIndex - 1 });
    },
    canMoveNextYear() {
      return this.validator({ month: 1, year: this.yearIndex + 1 });
    },
    canMovePrevYearGroup() {
      return this.validator({ month: 12, year: this.firstYear - 1 });
    },
    canMoveNextYearGroup() {
      return this.validator({ month: 1, year: this.lastYear + 1 });
    },
    monthItems() {
      return this.monthLabels.map((ml, i) => {
        const month = i + 1;
        return {
          month,
          label: ml,
          attributes: this.getMonthAttributes(month),
          isActive: month === this.month && this.yearIndex === this.year,
          isDisabled: !this.validator({ month, year: this.yearIndex }),
        };
      });
    },
    yearItems() {
      const startYear = this.yearGroupIndex * _yearGroupCount;
      const endYear = startYear + _yearGroupCount;
      const items = [];
      for (let i = startYear; i < endYear; i += 1) {
        items.push({
          year: i,
          isDisabled: !this.validator({ month: this.month, year: i }),
        });
      }
      return items;
    },
    monthRows() {
      return this.createRows(this.monthItems, 3);
    },
    yearRows() {
      return this.createRows(this.yearItems, 3);
    },
    firstYear() {
      return getFirstArrayItem(this.yearItems.map(i => i.year), 0);
    },
    lastYear() {
      return getLastArrayItem(this.yearItems.map(i => i.year), 0);
    },
  },
  watch: {
    mode(val) {
      this.mode_ = val;
    },
    year() {
      this.yearIndex = this.year;
    },
    yearIndex(val) {
      this.yearGroupIndex = this.getYearGroupIndex(val);
    },
    attributes() {
      this.mapAttributes(true);
    },
    yearGroupIndex() {
      this.mapAttributes();
    },
  },
  created() {
    this.mode_ = this.mode;
    this.yearIndex = this.year;
  },
  methods: {
    getMonthAttributes(month) {
      if (!this.attributesMap[this.yearIndex] || !this.attributesMap[this.yearIndex][month]) return undefined;
      return Object.values(this.attributesMap[this.yearIndex][month]);
    },
    mapAttributes(clearCache) {
      // Clear map if there are no attributes
      if (!this.attributes || !this.attributes.length) {
        this.attributesMap = {};
        return;
      }
      // Clear cache if needed
      const map = clearCache ? {} : this.attributesMap;
      // Cycle each year in the current year group
      for (let y = this.firstYear; y <= this.lastYear; y++) {
        // If there isn't current year data...
        if (!map[y]) {
          const yearData = {};
          // Cycle each month
          for (let m = 1; m <= 12; m++) {
            const monthData = {};
            // Get range for the current month
            const comps = getMonthComps(m, y);
            const monthRange = new DateInfo({
              start: new Date(comps.year, comps.month - 1, 1),
              end: new Date(comps.year, comps.month - 1, comps.days),
            });
            // Assign attribute data if they lie in month range
            this.attributes.forEach((a) => {
              if (a.dates.find(d => d.intersects(monthRange))) {
                monthData[a.key] = this.getAttributeInfo(a);
              }
            });
            // Assign month data
            if (Object.keys(monthData).length) yearData[m] = monthData;
          }
          // Assign year data
          if (Object.keys(yearData).length) map[y] = yearData;
        }
      }
      // Use object spread to trigger Vue reactivity
      this.attributesMap = { ...map };
    },
    getAttributeInfo(attr) {
      let color;
      if (attr.highlight) {
        color = attr.highlight.backgroundColor;
      } else if (attr.dot) {
        color = attr.dot.backgroundColor;
      } else if (attr.bar) {
        color = attr.bar.backgroundColor;
      } else if (attr.contentStyle) {
        color = attr.contentStyle.backgroundColor || attr.contentStyle.color;
      }
      return {
        key: attr.key,
        style: {
          backgroundColor: color,
        },
      };
    },
    getYearGroupIndex(year) {
      return Math.floor(year / _yearGroupCount);
    },
    monthClick(month) {
      this.$emit('input', { month, year: this.yearIndex });
    },
    yearClick(year) {
      this.yearIndex = year;
      this.selectMode('month');
    },
    selectMode(mode) {
      this.mode_ = mode;
      this.$emit('update:mode', mode);
    },
    createRows(items, columnCount) {
      const rows = [];
      let row = [];
      items.forEach((item) => {
        row.push(item);
        if (row.length >= columnCount) {
          rows.push(row);
          row = [];
        }
      });
      return rows;
    },
  },
};
</script>

<style lang='sass' scoped>

@import '../styles/vars.sass'
@import '../styles/mixins.sass'

$cell-transition: all 0.1s ease-in-out

.c-nav
  transition: height 5s ease-in-out
  color: #333333

.c-header
  display: flex
  justify-content: space-between
  align-items: center
  border-bottom: 1px solid #dadada
  padding: 3px 0

.c-arrow
  +box()
  font-size: $arrow-font-size
  width: $arrow-width
  height: $arrow-height
  transition: $arrow-transition
  cursor: pointer
  user-select: none
  &:hover
    opacity: 0.5

.c-title
  font-size: $nav-title-font-size
  font-weight: $nav-title-font-weight
  transition: $title-transition
  cursor: pointer
  user-select: none
  &:hover
    opacity: 0.5

.c-table-cell
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  height: 100%
  position: relative
  user-select: none
  cursor: pointer
  font-size: $nav-table-font-size
  font-weight: $nav-table-font-weight
  background-color: white
  transition: $cell-transition
  &:hover
    background-color: #f0f0f0

.c-disabled
  opacity: 0.2
  cursor: not-allowed
  pointer-events: none
  &:hover
    background-color: transparent

.c-active
  background-color: #f0f0f0
  font-weight: $weight-semibold

.c-indicators
  position: absolute
  display: flex
  justify-content: center
  align-items: center
  bottom: 5px
  width: 100%
  transition: $cell-transition
  .c-indicator
    width: 5px
    height: 5px
    border-radius: 50%
    &:not(:first-child)
      margin-left: 3px

.c-table
  table-layout: fixed
  width: 100%
  border-collapse: collapse
  tr
    td
      border: 1px solid #dadada
      width: 60px
      height: 34px
      &:first-child
        border-left: 0
      &:last-child
        border-right: 0
    &:first-child
      td
        border-top: 0
    &:last-child
      td
        border-bottom: 0

.indicators-enter-active, .indicators-leave-active
  transition: $cell-transition

.indicators-enter, .indicators-leave-to
  opacity: 0

</style>
