<template>
  <!--Nav panel-->
  <div>
    <!--Nav header-->
    <div class="vc-flex vc-justify-between vc-items-center vc-mx-2">
      <!--Move prev button-->
      <div
        class="vc-flex vc-justify-center vc-items-center vc-cursor-pointer"
        :class="theme.navArrows"
        @click="movePrev"
      >
        <slot name="nav-left-button">
          <svg-icon name="left-arrow" />
        </slot>
      </div>
      <!--Mode switch button-->
      <span
        class="vc-cursor-pointer"
        :class="theme.navTitle"
        @click="toggleMode"
        >{{ title }}</span
      >
      <!--Move next button-->
      <div
        class="vc-flex vc-justify-center vc-items-center vc-cursor-pointer"
        :class="theme.navArrows"
        @click="moveNext"
      >
        <slot name="nav-right-button">
          <svg-icon name="right-arrow" />
        </slot>
      </div>
    </div>
    <!--Navigation items-->
    <div
      v-for="(row, i) in itemRows"
      :key="i"
      class="vc-flex vc-justify-between vc-items-center vc-mx-1 vc-mb-1"
    >
      <div
        v-for="(item, j) in row"
        :key="j"
        :class="[...item.classes, 'vc-cursor-pointer']"
        @click="item.click"
      >
        <!--Item label-->
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from './SvgIcon';
import { childMixin } from '@/utils/mixins';
import { first, last } from '@/utils/_';
import { pageForDate } from '@/utils/helpers';

const _yearGroupCount = 12;

export default {
  components: {
    SvgIcon,
  },
  mixins: [childMixin],
  props: {
    value: { type: Object, default: () => ({ month: 0, year: 0 }) },
    validator: { type: Function, default: () => () => true },
  },
  data() {
    return {
      monthMode: true,
      yearIndex: 0,
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
    title() {
      return this.monthMode
        ? this.yearIndex
        : `${this.firstYear} - ${this.lastYear}`;
    },
    monthItems() {
      const { month: thisMonth, year: thisYear } = pageForDate(new Date());
      return this.locale
        .getMonthDates()
        .map(d => this.locale.format(d, this.masks.navMonths))
        .map((label, i) => {
          const month = i + 1;
          const isActive = month === this.month && this.yearIndex === this.year;
          const isCurrent = month === thisMonth && this.yearIndex === thisYear;
          const isDisabled = !this.validator({ month, year: this.yearIndex });
          const classes = [this.theme.navCell];
          if (isActive) {
            classes.push(this.theme.navCellActive);
          } else if (isCurrent) {
            classes.push(this.theme.navCellInactiveCurrent);
          } else {
            classes.push(this.theme.navCellInactive);
          }
          if (isDisabled) {
            classes.push(this.theme.navCellDisabled);
          }
          return {
            label,
            classes,
            click: () => this.monthClick(month),
          };
        });
    },
    yearItems() {
      const { month, year: thisYear } = pageForDate(new Date());
      const startYear = this.yearGroupIndex * _yearGroupCount;
      const endYear = startYear + _yearGroupCount;
      const items = [];
      for (let year = startYear; year < endYear; year += 1) {
        const isActive = year === this.year;
        const isCurrent = year === thisYear;
        const isDisabled = !this.validator({ month: this.month, year });
        const classes = [this.theme.navCell];
        if (isActive) {
          classes.push(this.theme.navCellActive);
        } else if (isCurrent) {
          classes.push(this.theme.navCellInactiveCurrent);
        } else {
          classes.push(this.theme.navCellInactive);
        }
        if (isDisabled) {
          classes.push('vc-opacity-25');
        }
        items.push({
          year,
          label: year,
          classes,
          click: () => this.yearClick(year),
        });
      }
      return items;
    },
    itemRows() {
      return this.monthMode ? this.monthRows : this.yearRows;
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
    year() {
      this.yearIndex = this.year;
    },
    yearIndex(val) {
      this.yearGroupIndex = this.getYearGroupIndex(val);
    },
  },
  created() {
    this.yearIndex = this.year;
  },
  methods: {
    getYearGroupIndex(year) {
      return Math.floor(year / _yearGroupCount);
    },
    monthClick(month) {
      this.$emit('input', { month, year: this.yearIndex });
    },
    yearClick(year) {
      this.yearIndex = year;
      this.monthMode = true;
    },
    toggleMode() {
      this.monthMode = !this.monthMode;
    },
    movePrev() {
      if (this.monthMode) {
        this.movePrevYear();
      }
      this.movePrevYearGroup();
    },
    moveNext() {
      if (this.monthMode) {
        this.moveNextYear();
      }
      this.moveNextYearGroup();
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
