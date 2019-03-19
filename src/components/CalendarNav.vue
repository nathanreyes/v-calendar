<template>
  <!--Nav panel-->
  <div class="py-1">
    <!--Nav header-->
    <div class="flex justify-between items-center mx-2">
      <!--Move prev button-->
      <div @click="movePrev" class="flex justify-center items-center" :class="theme.navArrows">
        <slot name="nav-left-button">
          <svg-icon name="left-arrow"/>
        </slot>
      </div>
      <!--Mode switch button-->
      <span :class="theme.navTitle" @click="toggleMode">{{ title }}</span>
      <!--Move next-->
      <div @click="moveNext" class="flex justify-center items-center" :class="theme.navArrows">
        <slot name="nav-right-button">
          <svg-icon name="right-arrow"/>
        </slot>
      </div>
    </div>
    <!--Navigation items-->
    <div v-for="(row, i) in itemRows" :key="i" class="flex justify-between items-center mx-1 mb-1">
      <div
        v-for="(item, j) in row"
        :key="j"
        class="w-12 text-center py-1 mx-1 rounded"
        :class="{
                  [theme.navCell]: !item.isActive,
                  [theme.navCellActive]: item.isActive,
                  'vc-disabled': item.isDisabled
                }"
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
      return this.locale
        .getMonthDates()
        .map(d => this.locale.format(d, this.masks.navMonths))
        .map((ml, i) => {
          const month = i + 1;
          return {
            month,
            label: ml,
            isActive: month === this.month && this.yearIndex === this.year,
            isDisabled: !this.validator({ month, year: this.yearIndex }),
            click: () => this.monthClick(month),
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
          label: i,
          isActive: i === this.year,
          isDisabled: !this.validator({ month: this.month, year: i }),
          click: () => this.yearClick(i),
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

<style lang='sass' scoped>

.vc-disabled
  opacity: 0.2
  cursor: not-allowed
  pointer-events: none
  &:hover
    background-color: transparent

</style>
