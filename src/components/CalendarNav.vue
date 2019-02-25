<template>
  <!--Nav panel-->
  <div class="c-nav-pane" :class="theme.navContainer">
    <!--Nav months-->
    <template v-if="mode_ === 'month'">
      <!--Months header-->
      <div class="c-nav-header" :class="theme.navHeader">
        <!--Previous year button-->
        <div class="c-nav-arrow-layout">
          <slot name="nav-left-button" :month-items="[...monthItems]" :move="movePrevYear">
            <svg-icon name="left-arrow" class="c-nav-arrow" @click="movePrevYear"></svg-icon>
          </slot>
        </div>
        <!--Mode switch button-->
        <span
          class="c-nav-title"
          :class="theme.navTitle"
          @click="selectMode('year')"
        >{{ yearIndex }}</span>
        <!--Next year button-->
        <div class="c-nav-arrow-layout">
          <slot name="nav-right-button" :month-items="[...monthItems]" :move="moveNextYear">
            <svg-icon name="right-arrow" class="c-nav-arrow" @click="moveNextYear"></svg-icon>
          </slot>
        </div>
      </div>
      <!--Months table-->
      <table class="c-nav-table">
        <tr v-for="(row, i) in monthRows" :key="i">
          <td v-for="item in row" :key="item.month">
            <div
              class="c-nav-table-cell"
              :class="{ [theme.navCell]: !item.isActive, [theme.navCellActive]: item.isActive, 'c-disabled': item.isDisabled }"
              :style="getMonthCellStyle(item)"
              @click="monthClick(item.month)"
            >
              <!--Month label-->
              {{ item.label }}
              <!--Attribute indicators-->
              <transition name="indicators">
                <div v-if="item.attributes" class="c-indicators">
                  <span
                    class="c-indicator"
                    v-for="attribute in item.attributes"
                    :key="attribute.key"
                    :style="attribute.style"
                  ></span>
                </div>
              </transition>
            </div>
          </td>
        </tr>
      </table>
    </template>
    <!--Nav years-->
    <template v-if="mode_ === 'year'">
      <div class="c-nav-header" :class="theme.navHeader">
        <!--Previous year group button-->
        <div class="c-nav-arrow-layout">
          <slot
            name="nav-left-button"
            :first-year="firstYear"
            :last-year="lastYear"
            :year-items="[...yearItems]"
            :move="movePrevYearGroup"
          >
            <svg-icon name="left-arrow" class="c-nav-arrow" @click="movePrevYearGroup"></svg-icon>
          </slot>
        </div>
        <!--Mode switch button-->
        <span
          class="c-nav-title"
          :class="theme.navTitle"
          @click="selectMode('month')"
        >{{ firstYear }} - {{ lastYear }}</span>
        <!--Next year group button-->
        <div class="c-nav-arrow-layout">
          <slot
            name="nav-right-button"
            :first-year="firstYear"
            :last-year="lastYear"
            :year-items="[...yearItems]"
            :move="moveNextYearGroup"
          >
            <svg-icon name="right-arrow" class="c-nav-arrow" @click="moveNextYearGroup"></svg-icon>
          </slot>
        </div>
      </div>
      <!--Years table-->
      <table class="c-nav-table">
        <tr v-for="(row, i) in yearRows" :key="i">
          <td v-for="item in row" :key="item.year">
            <div
              class="c-nav-table-cell"
              :class="{ 'c-active': item.isActive, 'c-disabled': item.isDisabled }"
              :style="getYearCellStyle(item)"
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
import injectMixin from '@/utils/injectMixin';
import DateInfo from '@/utils/dateInfo';
import { format } from '@/utils/fecha';
import {
  getMonthComps,
  getFirstArrayItem,
  getLastArrayItem,
  getMonthDates,
  evalFn,
} from '@/utils/helpers';

const _yearGroupCount = 12;

export default {
  components: {
    SvgIcon,
  },
  mixins: [injectMixin],
  props: {
    mode: { type: String, default: 'month' },
    value: { type: Object, default: () => ({ month: 0, year: 0 }) },
    validator: { type: Function, default: () => () => true },
    formats: Object,
    attributes: Array,
    styles: Object,
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
      return getMonthDates()
        .map(d => format(d, this.formats.navMonths))
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
    getMonthCellStyle(item) {
      return evalFn(this.styles.navMonthCell, item);
    },
    getYearCellStyle(item) {
      return evalFn(this.styles.navYearCell, item);
    },
    getMonthAttributes(month) {
      if (
        !this.attributesMap[this.yearIndex] ||
        !this.attributesMap[this.yearIndex][month]
      )
        return undefined;
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
            this.attributes.forEach(a => {
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

$cell-transition: all 0.1s ease-in-out

.c-nav-pane
  transition: height 5s ease-in-out
  width: $nav-table-cell-width*3
  overflow: hidden

.c-nav-header
  display: flex
  justify-content: space-between
  align-items: center
  padding: 3px 0

.c-nav-arrow-layout
  +box()
  min-width: 26px

.c-nav-arrow
  +box()
  font-size: $arrow-font-size
  transition: $arrow-transition
  cursor: pointer
  user-select: none

.c-nav-title
  transition: $title-transition
  cursor: pointer
  user-select: none

.c-nav-table
  &, tr, td, th
    margin: 0
    padding: 0
    background: none
    border: none
    border-collapse: collapse
    border-spacing: 0

.c-nav-table
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

.c-nav-table-cell
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  height: 100%
  position: relative
  user-select: none
  cursor: pointer
  transition: $cell-transition
  // &:hover
  //   background-color: $nav-table-cell-hover-background-color

.c-disabled
  opacity: 0.2
  cursor: not-allowed
  pointer-events: none
  &:hover
    background-color: transparent

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

.indicators-enter-active, .indicators-leave-active
  transition: $cell-transition

.indicators-enter, .indicators-leave-to
  opacity: 0

</style>
