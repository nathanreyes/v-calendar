<template>
  <!--Nav panel-->
  <div class="vc-nav-container">
    <!--Nav header-->
    <grid
      :items="['prev', 'title', 'next']"
      :columns="3"
      ref="headerGrid"
      @rollover="onHeaderRollover"
    >
      <template #cell="{ item }">
        <!--Move prev button-->
        <span
          v-if="item === 'prev'"
          role="button"
          class="vc-nav-arrow is-left"
          tabindex="-1"
          @click="movePrev"
          @keydown="e => onSpaceOrEnter(e, movePrev)"
          ref="prevButton"
        >
          <slot name="nav-left-button">
            <svg-icon name="left-arrow" width="20px" height="24px" />
          </slot>
        </span>
        <!--Mode switch button-->
        <span
          v-else-if="item === 'title'"
          role="button"
          class="vc-nav-title vc-grid-focus"
          :style="{ whiteSpace: 'nowrap' }"
          tabindex="0"
          @click="toggleMode"
          @keydown="e => onSpaceOrEnter(e, toggleMode)"
          ref="titleButton"
        >
          {{ title }}
        </span>
        <!--Move next button-->
        <span
          v-else
          role="button"
          class="vc-nav-arrow is-right"
          tabindex="-1"
          @click="moveNext"
          @keydown="e => onSpaceOrEnter(e, moveNext)"
          ref="nextButton"
        >
          <slot name="nav-right-button">
            <svg-icon name="right-arrow" width="20px" height="24px" />
          </slot>
        </span>
      </template>
    </grid>
    <!--Navigation items-->
    <grid
      :items="activeItems"
      :rows="4"
      :columns="3"
      gap="2px 5px"
      ref="itemsGrid"
      @rollover="onItemsRollover"
    >
      <template #cell="{ item }">
        <span
          role="button"
          :aria-label="item.ariaLabel"
          :class="getItemClasses(item)"
          :tabindex="item.isDisabled ? undefined : item.isActive ? 0 : -1"
          @click="item.click"
          @keydown="e => onSpaceOrEnter(e, item.click)"
        >
          {{ item.label }}
        </span>
      </template>
    </grid>
  </div>
</template>

<script>
import Grid from '../Grid/Grid.vue';
import SvgIcon from '../SvgIcon/SvgIcon.vue';
import { childMixin } from '../../utils/mixins';
import { head, last } from '../../utils/_';
import { pageForDate, onSpaceOrEnter } from '../../utils/helpers';

const _yearGroupCount = 12;

export default {
  name: 'CalendarNav',
  emits: ['input'],
  components: {
    Grid,
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
      onSpaceOrEnter,
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
      return this.locale.getMonthDates().map((d, i) => {
        const month = i + 1;
        return {
          label: this.locale.format(d, this.masks.navMonths),
          ariaLabel: this.locale.format(d, 'MMMM YYYY'),
          isActive: month === this.month && this.yearIndex === this.year,
          isCurrent: month === thisMonth && this.yearIndex === thisYear,
          isDisabled: !this.validator({ month, year: this.yearIndex }),
          click: () => this.monthClick(month),
        };
      });
    },
    yearItems() {
      const { year: thisYear } = pageForDate(new Date());
      const startYear = this.yearGroupIndex * _yearGroupCount;
      const endYear = startYear + _yearGroupCount;
      const items = [];
      for (let year = startYear; year < endYear; year += 1) {
        items.push({
          year,
          label: year,
          ariaLabel: year,
          isActive: year === this.year,
          isCurrent: year === thisYear,
          isDisabled: !this.validator({ month: this.month, year }),
          click: () => this.yearClick(year),
        });
      }
      return items;
    },
    activeItems() {
      return this.monthMode ? this.monthItems : this.yearItems;
    },
    firstYear() {
      return head(this.yearItems.map(i => i.year));
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
  mounted() {
    this.$refs.itemsGrid.tryFocus();
  },
  methods: {
    getItemClasses({ isActive, isCurrent, isDisabled }) {
      const classes = ['vc-nav-item'];
      if (isActive) {
        classes.push('is-active', 'vc-grid-focus');
      } else if (isCurrent) {
        classes.push('is-inactive-current');
      } else {
        classes.push('is-inactive');
      }
      if (isDisabled) {
        classes.push('is-disabled');
      }
      return classes;
    },
    getYearGroupIndex(year) {
      return Math.floor(year / _yearGroupCount);
    },
    monthClick(month) {
      this.$emit('input', { month, year: this.yearIndex });
    },
    yearClick(year) {
      this.yearIndex = year;
      this.monthMode = true;
      this.$refs.itemsGrid.tryFocus();
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
    onHeaderRollover(e) {
      switch (e.direction) {
        case 'vertical-trailing':
          this.$refs.itemsGrid.tryFocus();
          break;
      }
      e.handled = true;
    },
    onItemsRollover(e) {
      switch (e.direction) {
        case 'horizontal-leading': {
          this.movePrev();
          break;
        }
        case 'horizontal-trailing': {
          this.moveNext();
          break;
        }
        case 'vertical-leading': {
          this.$refs.headerGrid.tryFocus();
          e.handled = true;
          break;
        }
        case 'vertical-trailing': {
          e.handled = true;
          break;
        }
      }
    },
  },
};
</script>

<style lang="css">
@import './calendar-nav.css';
</style>
