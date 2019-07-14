<template>
  <!--Nav panel-->
  <div>
    <!--Nav header-->
    <grid :columns="3" ref="headerGrid" @rollover="onHeaderRollover">
      <!--Move prev button-->
      <button
        class="vc-flex vc-justify-center vc-items-center vc-cursor-pointer mr-auto"
        :class="theme.navArrows"
        tabindex="-1"
        @click="movePrev"
        ref="prevButton"
      >
        <slot name="nav-left-button">
          <svg-icon name="left-arrow" />
        </slot>
      </button>
      <!--Mode switch button-->
      <button
        class="vc-cursor-pointer vc-grid-focus"
        :class="theme.navTitle"
        @click="toggleMode"
        :style="{ whiteSpace: 'nowrap' }"
        ref="titleButton"
      >
        {{ title }}
      </button>
      <!--Move next button-->
      <button
        class="vc-flex vc-justify-center vc-items-center vc-cursor-pointer ml-auto"
        :class="theme.navArrows"
        tabindex="-1"
        @click="moveNext"
        ref="nextButton"
      >
        <slot name="nav-right-button">
          <svg-icon name="right-arrow" />
        </slot>
      </button>
    </grid>
    <!--Navigation items-->
    <grid
      :rows="4"
      :columns="3"
      gap="1px 5px"
      ref="itemsGrid"
      @rollover="onItemsRollover"
    >
      <button
        v-for="item in activeItems"
        :key="item.label"
        :aria-label="item.ariaLabel"
        :class="[...item.classes, 'vc-cursor-pointer']"
        :tabindex="item.isActive ? 0 : -1"
        @click="item.click"
        ref="items"
      >
        {{ item.label }}
      </button>
    </grid>
  </div>
</template>

<script>
import Grid from './Grid';
import SvgIcon from './SvgIcon';
import { childMixin } from '@/utils/mixins';
import { head, last } from '@/utils/_';
import { pageForDate } from '@/utils/helpers';

const _yearGroupCount = 12;

export default {
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
        const label = this.locale.format(d, this.masks.navMonths);
        const ariaLabel = this.locale.format(d, 'MMMM YYYY');
        const isActive = month === this.month && this.yearIndex === this.year;
        const isCurrent = month === thisMonth && this.yearIndex === thisYear;
        const isDisabled = !this.validator({ month, year: this.yearIndex });
        const classes = [this.theme.navCell];
        if (isActive) {
          classes.push(this.theme.navCellActive, 'vc-grid-focus');
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
          ariaLabel,
          isActive,
          isCurrent,
          isDisabled,
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
          classes.push(this.theme.navCellActive, 'vc-grid-focus');
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
          ariaLabel: year,
          isActive,
          isCurrent,
          isDisabled,
          classes,
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
        default: {
          e.handled = true;
        }
      }
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
