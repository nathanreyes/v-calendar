<template>
  <!--Nav panel-->
  <div class="vc-nav-pane">
    <!--Nav months-->
    <template v-if="mode_ === 'month'">
      <!--Months header-->
      <div class="vc-nav-header" :class="theme.navHeader">
        <!--Previous year button-->
        <div class="vc-nav-arrow-layout">
          <slot name="nav-left-button" :month-items="[...monthItems]" :move="movePrevYear">
            <svg-icon name="left-arrow" class="vc-nav-arrow" @click="movePrevYear"></svg-icon>
          </slot>
        </div>
        <!--Mode switch button-->
        <span
          class="vc-nav-title"
          :class="theme.navTitle"
          @click="selectMode('year')"
        >{{ yearIndex }}</span>
        <!--Next year button-->
        <div class="vc-nav-arrow-layout">
          <slot name="nav-right-button" :month-items="[...monthItems]" :move="moveNextYear">
            <svg-icon name="right-arrow" class="vc-nav-arrow" @click="moveNextYear"></svg-icon>
          </slot>
        </div>
      </div>
      <!--Months table-->
      <table class="vc-nav-table">
        <tr v-for="(row, i) in monthRows" :key="i">
          <td v-for="item in row" :key="item.month">
            <div
              class="vc-nav-table-cell"
              :class="{
                  [theme.navCell]: !item.isActive,
                  [theme.navCellActive]: item.isActive,
                  'vc-disabled': item.isDisabled
                }"
              @click="monthClick(item.month)"
            >
              <!--Month label-->
              {{ item.label }}
            </div>
          </td>
        </tr>
      </table>
    </template>
    <!--Nav years-->
    <template v-if="mode_ === 'year'">
      <div class="vc-nav-header" :class="theme.navHeader">
        <!--Previous year group button-->
        <div class="vc-nav-arrow-layout">
          <slot
            name="nav-left-button"
            :first-year="firstYear"
            :last-year="lastYear"
            :year-items="[...yearItems]"
            :move="movePrevYearGroup"
          >
            <svg-icon name="left-arrow" class="vc-nav-arrow" @click="movePrevYearGroup"></svg-icon>
          </slot>
        </div>
        <!--Mode switch button-->
        <span
          class="vc-nav-title"
          :class="theme.navTitle"
          @click="selectMode('month')"
        >{{ firstYear }} - {{ lastYear }}</span>
        <!--Next year group button-->
        <div class="vc-nav-arrow-layout">
          <slot
            name="nav-right-button"
            :first-year="firstYear"
            :last-year="lastYear"
            :year-items="[...yearItems]"
            :move="moveNextYearGroup"
          >
            <svg-icon name="right-arrow" class="vc-nav-arrow" @click="moveNextYearGroup"></svg-icon>
          </slot>
        </div>
      </div>
      <!--Years table-->
      <table class="vc-nav-table">
        <tr v-for="(row, i) in yearRows" :key="i">
          <td v-for="item in row" :key="item.year">
            <div
              class="vc-nav-table-cell"
              :class="{
                  [theme.navCell]: !item.isActive,
                  [theme.navCellActive]: item.isActive,
                  'vc-disabled': item.isDisabled
                }"
              @click="yearClick(item.year)"
            >
              <!--Year label-->
              {{ item.year }}
            </div>
          </td>
        </tr>
      </table>
    </template>
  </div>
</template>

<script>
import SvgIcon from './SvgIcon';
import { childMixin } from '@/utils/mixins';
import { first, last } from '@/utils/_';

const _yearGroupCount = 12;

export default {
  components: {
    SvgIcon,
  },
  mixins: [childMixin],
  props: {
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
    monthItems() {
      return this.locale
        .getMonthDates()
        .map(d => this.locale.format(d, this.masks.navMonths))
        .map((ml, i) => {
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
          month: 0,
          year: i,
          isActive: i === this.year,
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
      return first(this.yearItems.map(i => i.year));
    },
    lastYear() {
      return last(this.yearItems.map(i => i.year));
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
  },
  created() {
    this.mode_ = this.mode;
    this.yearIndex = this.year;
  },
  methods: {
    getMonthAttributes(month) {
      if (
        !this.attributesMap[this.yearIndex]
        || !this.attributesMap[this.yearIndex][month]
      ) {
        return undefined;
      }
      return Object.values(this.attributesMap[this.yearIndex][month]);
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
    movePrevYear() {
      this.yearIndex--;
    },
    moveNextYear() {
      this.yearIndex++;
    },
    movePrevYearGroup() {
      this.yearGroupIndex--;
    },
    moveNextYearGroup() {
      this.yearGroupIndex++;
    },
    createRows(items, columnCount) {
      const rows = [];
      let row = [];
      items.forEach(item => {
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

$nav-title-transition: all .25s ease-in-out
$nav-table-cell-width: 60px
$nav-table-cell-transition: all 0.1s ease-in-out

.vc-nav-pane
  transition: height 5s ease-in-out
  width: $nav-table-cell-width*3
  overflow: hidden

.vc-nav-header
  display: flex
  justify-content: space-between
  align-items: center
  padding: 3px 0

.vc-nav-arrow-layout
  +box()
  min-width: 26px

.vc-nav-arrow
  +box()
  font-size: $arrow-font-size
  transition: $arrow-transition
  cursor: pointer
  user-select: none

.vc-nav-title
  transition: $nav-title-transition
  cursor: pointer
  user-select: none

.vc-nav-table
  &, tr, td, th
    margin: 0
    padding: 0
    background: none
    border: none
    border-collapse: collapse
    border-spacing: 0

.vc-nav-table
  table-layout: fixed
  width: 100%
  tr
    td
      width: $nav-table-cell-width
      height: 34px
      &:first-child
        border-left: 0
      &:last-child
        border-right: 0
    &:last-child
      td
        border-bottom: 0

.vc-nav-table-cell
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  height: 100%
  position: relative
  user-select: none
  cursor: pointer
  transition: $nav-table-cell-transition
  // &:hover
  //   background-color: $nav-table-cell-hover-background-color

.vc-disabled
  opacity: 0.2
  cursor: not-allowed
  pointer-events: none
  &:hover
    background-color: transparent

.vc-indicators
  position: absolute
  display: flex
  justify-content: center
  align-items: center
  bottom: 5px
  width: 100%
  transition: $nav-table-cell-transition
  .vc-indicator
    width: 5px
    height: 5px
    border-radius: 50%
    &:not(:first-child)
      margin-left: 3px

.indicators-enter-active, .indicators-leave-active
  transition: $nav-table-cell-transition

.indicators-enter, .indicators-leave-to
  opacity: 0

</style>
